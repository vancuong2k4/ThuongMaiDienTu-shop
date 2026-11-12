// ============================================================
// app/api/admin/gift-boxes/templates/route.ts
// Admin API Quản lý danh sách & Tạo mới mẫu vỏ hộp quà biếu (Phase 17)
// ============================================================

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { createGiftBoxTemplateSchema } from "@/lib/validations/gift-box";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (session?.user?.role !== "ADMIN") {
      return NextResponse.json(
        { success: false, message: "Không có quyền truy cập." },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || "";

    const where: any = {};
    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { slug: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ];
    }

    const templates = await prisma.giftBoxTemplate.findMany({
      where,
      orderBy: { sortOrder: "asc" },
      include: {
        _count: {
          select: { hampers: true },
        },
      },
    });

    return NextResponse.json({
      success: true,
      data: templates.map((t) => ({
        ...t,
        basePrice: Number(t.basePrice),
        hamperCount: t._count.hampers,
      })),
    });
  } catch (error) {
    console.error("Lỗi khi admin lấy danh sách mẫu vỏ hộp:", error);
    return NextResponse.json(
      { success: false, message: "Không thể tải danh sách mẫu vỏ hộp." },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (session?.user?.role !== "ADMIN") {
      return NextResponse.json(
        { success: false, message: "Không có quyền thực hiện hành động này." },
        { status: 403 }
      );
    }

    const body = await req.json();
    const parsed = createGiftBoxTemplateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Dữ liệu mẫu vỏ hộp không hợp lệ.",
          errors: parsed.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const existing = await prisma.giftBoxTemplate.findUnique({
      where: { slug: parsed.data.slug },
    });
    if (existing) {
      return NextResponse.json(
        { success: false, message: "Slug mẫu vỏ hộp đã tồn tại." },
        { status: 400 }
      );
    }

    const template = await prisma.giftBoxTemplate.create({
      data: parsed.data,
    });

    return NextResponse.json({
      success: true,
      message: "Tạo mới mẫu vỏ hộp quà thành công!",
      data: {
        ...template,
        basePrice: Number(template.basePrice),
      },
    });
  } catch (error: any) {
    console.error("Lỗi khi admin tạo mẫu vỏ hộp:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Không thể tạo mẫu vỏ hộp quà." },
      { status: 500 }
    );
  }
}
