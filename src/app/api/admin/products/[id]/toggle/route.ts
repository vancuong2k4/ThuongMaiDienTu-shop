// ============================================================
// app/api/admin/products/[id]/toggle/route.ts
// API Bật / Tắt nhanh Trạng thái Kinh doanh hoặc Nổi bật
// ============================================================

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function PATCH(req: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth();
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();
    const { field, value } = body;

    if (!["isActive", "isFeatured"].includes(field) || typeof value !== "boolean") {
      return NextResponse.json(
        { error: "Tham số cập nhật không hợp lệ" },
        { status: 400 }
      );
    }

    const updated = await prisma.product.update({
      where: { id },
      data: {
        [field]: value,
      },
      select: {
        id: true,
        name: true,
        isActive: true,
        isFeatured: true,
      },
    });

    return NextResponse.json({
      success: true,
      product: updated,
      message: `Đã cập nhật ${
        field === "isActive" ? "trạng thái kinh doanh" : "sản phẩm nổi bật"
      }`,
    });
  } catch (error) {
    console.error("Lỗi khi toggle trạng thái sản phẩm:", error);
    return NextResponse.json(
      { error: "Không thể cập nhật trạng thái sản phẩm" },
      { status: 500 }
    );
  }
}
