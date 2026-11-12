// ============================================================
// app/api/admin/gift-boxes/templates/[id]/route.ts
// Admin API Chi tiết, Cập nhật & Xóa mẫu vỏ hộp quà biếu (Phase 17)
// ============================================================

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (session?.user?.role !== "ADMIN") {
      return NextResponse.json(
        { success: false, message: "Không có quyền truy cập." },
        { status: 403 }
      );
    }

    const { id } = await params;
    const template = await prisma.giftBoxTemplate.findUnique({
      where: { id },
      include: {
        _count: {
          select: { hampers: true },
        },
      },
    });

    if (!template) {
      return NextResponse.json(
        { success: false, message: "Không tìm thấy mẫu vỏ hộp quà." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        ...template,
        basePrice: Number(template.basePrice),
        hamperCount: template._count.hampers,
      },
    });
  } catch (error) {
    console.error("Lỗi khi admin lấy chi tiết mẫu vỏ hộp:", error);
    return NextResponse.json(
      { success: false, message: "Không thể lấy chi tiết mẫu vỏ hộp." },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (session?.user?.role !== "ADMIN") {
      return NextResponse.json(
        { success: false, message: "Không có quyền thực hiện hành động này." },
        { status: 403 }
      );
    }

    const { id } = await params;
    const body = await req.json();

    const template = await prisma.giftBoxTemplate.update({
      where: { id },
      data: body,
    });

    return NextResponse.json({
      success: true,
      message: "Cập nhật thông tin mẫu vỏ hộp thành công!",
      data: {
        ...template,
        basePrice: Number(template.basePrice),
      },
    });
  } catch (error: any) {
    console.error("Lỗi khi admin cập nhật mẫu vỏ hộp:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Không thể cập nhật mẫu vỏ hộp." },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (session?.user?.role !== "ADMIN") {
      return NextResponse.json(
        { success: false, message: "Không có quyền thực hiện hành động này." },
        { status: 403 }
      );
    }

    const { id } = await params;

    // Kiểm tra xem mẫu vỏ hộp đã có giỏ quà nào sử dụng chưa
    const usedCount = await prisma.giftCustomHamper.count({
      where: { templateId: id },
    });

    if (usedCount > 0) {
      // Nếu đã có khách dùng thì chỉ ẩn (soft-deactivate)
      await prisma.giftBoxTemplate.update({
        where: { id },
        data: { isActive: false },
      });
      return NextResponse.json({
        success: true,
        message: `Mẫu vỏ hộp đã có ${usedCount} giỏ quà sử dụng. Đã chuyển sang trạng thái Ngừng hoạt động.`,
      });
    }

    await prisma.giftBoxTemplate.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: "Đã xóa mẫu vỏ hộp quà thành công!",
    });
  } catch (error: any) {
    console.error("Lỗi khi admin xóa mẫu vỏ hộp:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Không thể xóa mẫu vỏ hộp quà." },
      { status: 500 }
    );
  }
}
