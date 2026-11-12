// ============================================================
// app/api/protocols/[slug]/route.ts
// Lấy Chi Tiết Phác Đồ Bổ Sung Dinh Dưỡng Theo Slug (Phase 16)
// ============================================================

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

interface RouteParams {
  params: Promise<{ slug: string }>;
}

export async function GET(req: NextRequest, { params }: RouteParams) {
  try {
    const { slug } = await params;
    if (!slug) {
      return NextResponse.json({ error: "Slug is required" }, { status: 400 });
    }

    const protocol = await prisma.healthProtocol.findUnique({
      where: { slug },
      include: {
        items: {
          orderBy: { sortOrder: "asc" },
          include: {
            product: {
              select: {
                id: true,
                name: true,
                slug: true,
                origin: true,
                images: {
                  take: 1,
                  orderBy: { sortOrder: "asc" },
                  select: { url: true },
                },
              },
            },
            variant: {
              select: {
                id: true,
                name: true,
                sku: true,
                price: true,
                originalPrice: true,
                stock: true,
              },
            },
          },
        },
      },
    });

    if (!protocol) {
      return NextResponse.json(
        { error: "Không tìm thấy phác đồ dinh dưỡng" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: protocol,
    });
  } catch (error) {
    console.error("GET /api/protocols/[slug] error:", error);
    return NextResponse.json(
      { error: "Đã xảy ra lỗi khi lấy thông tin phác đồ" },
      { status: 500 }
    );
  }
}
