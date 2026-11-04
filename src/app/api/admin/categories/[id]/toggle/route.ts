// ============================================================
// app/api/admin/categories/[id]/toggle/route.ts
// API Bật / Tắt nhanh Trạng thái Kích hoạt Danh mục Ngành hàng
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
    const { isActive } = body;

    if (typeof isActive !== "boolean") {
      return NextResponse.json(
        { error: "Giá trị isActive không hợp lệ" },
        { status: 400 }
      );
    }

    const updated = await prisma.category.update({
      where: { id },
      data: { isActive },
      select: {
        id: true,
        name: true,
        isActive: true,
      },
    });

    return NextResponse.json({
      success: true,
      category: updated,
      message: `Đã ${isActive ? "bật" : "tắt"} hiển thị danh mục "${updated.name}"`,
    });
  } catch (error) {
    console.error("Lỗi khi toggle trạng thái danh mục:", error);
    return NextResponse.json(
      { error: "Không thể cập nhật trạng thái danh mục" },
      { status: 500 }
    );
  }
}
