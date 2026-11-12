// ============================================================
// app/api/admin/protocols/route.ts
// Quản trị Danh Sách & Tạo Mới Phác Đồ Dinh Dưỡng Admin CMS (Phase 16)
// ============================================================

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { HealthTargetGroup, Prisma } from "@prisma/client";
import { createProtocolSchema } from "@/lib/validations/protocol";
import { calculateProtocolKPIs } from "@/lib/protocols";

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
    const limit = Math.max(1, Math.min(100, parseInt(searchParams.get("limit") || "10")));
    const skip = (page - 1) * limit;

    const search = searchParams.get("search")?.trim() || "";
    const targetGroup = searchParams.get("targetGroup") || "ALL";
    const isActiveParam = searchParams.get("isActive");

    const where: Prisma.HealthProtocolWhereInput = {};

    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { slug: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ];
    }

    if (
      targetGroup !== "ALL" &&
      Object.values(HealthTargetGroup).includes(targetGroup as HealthTargetGroup)
    ) {
      where.targetGroup = targetGroup as HealthTargetGroup;
    }

    if (isActiveParam !== null && isActiveParam !== undefined && isActiveParam !== "ALL") {
      where.isActive = isActiveParam === "true";
    }

    const [protocols, total, kpis] = await Promise.all([
      prisma.healthProtocol.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          items: {
            include: {
              product: {
                select: {
                  id: true,
                  name: true,
                  slug: true,
                  images: {
                    take: 1,
                    select: { url: true },
                  },
                },
              },
              variant: {
                select: {
                  id: true,
                  name: true,
                  price: true,
                  originalPrice: true,
                  stock: true,
                },
              },
            },
          },
          _count: {
            select: { assessments: true },
          },
        },
      }),
      prisma.healthProtocol.count({ where }),
      calculateProtocolKPIs(),
    ]);

    return NextResponse.json({
      success: true,
      data: protocols,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
      kpis,
    });
  } catch (error) {
    console.error("GET /api/admin/protocols error:", error);
    return NextResponse.json(
      { error: "Đã xảy ra lỗi khi lấy danh sách phác đồ dinh dưỡng" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const parsed = createProtocolSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Dữ liệu không hợp lệ", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const data = parsed.data;

    // Kiểm tra trùng slug
    const existing = await prisma.healthProtocol.findUnique({
      where: { slug: data.slug.trim().toLowerCase() },
    });

    if (existing) {
      return NextResponse.json(
        { error: `Slug phác đồ "${data.slug}" đã tồn tại trên hệ thống!` },
        { status: 400 }
      );
    }

    const protocol = await prisma.healthProtocol.create({
      data: {
        slug: data.slug.trim().toLowerCase(),
        title: data.title.trim(),
        targetGroup: data.targetGroup,
        subtitle: data.subtitle?.trim() || null,
        description: data.description.trim(),
        keyNutrients: data.keyNutrients,
        pharmacistAdvice: data.pharmacistAdvice.trim(),
        dosageSchedule: data.dosageSchedule,
        comboDiscountPercent: data.comboDiscountPercent,
        isActive: data.isActive,
        items: {
          create: data.items.map((item) => ({
            productId: item.productId,
            variantId: item.variantId || null,
            usageInstructions: item.usageInstructions.trim(),
            timing: item.timing.trim(),
            quantity: item.quantity,
            isEssential: item.isEssential,
            sortOrder: item.sortOrder,
          })),
        },
      },
      include: {
        items: true,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Tạo phác đồ dinh dưỡng thành công",
      data: protocol,
    });
  } catch (error) {
    console.error("POST /api/admin/protocols error:", error);
    return NextResponse.json(
      { error: "Đã xảy ra lỗi khi tạo phác đồ dinh dưỡng" },
      { status: 500 }
    );
  }
}
