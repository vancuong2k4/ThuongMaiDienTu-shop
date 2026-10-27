// ============================================================
// app/api/user/addresses/[id]/route.ts – Sửa, Đặt mặc định hoặc Xóa địa chỉ
// ============================================================

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

// PATCH: Đặt làm mặc định hoặc cập nhật thông tin
export async function PATCH(req: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Chưa đăng nhập" }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();
    const { isDefault } = body;

    // Kiểm tra địa chỉ có thuộc về user không
    const address = await prisma.address.findFirst({
      where: { id, userId: session.user.id },
    });

    if (!address) {
      return NextResponse.json(
        { error: "Địa chỉ không tồn tại hoặc không thuộc quyền quản lý của bạn" },
        { status: 404 }
      );
    }

    if (isDefault) {
      await prisma.$transaction(async (tx) => {
        // Hủy default các địa chỉ khác
        await tx.address.updateMany({
          where: { userId: session.user.id },
          data: { isDefault: false },
        });

        // Đặt địa chỉ này thành default
        await tx.address.update({
          where: { id },
          data: { isDefault: true },
        });
      });
    }

    return NextResponse.json({
      success: true,
      message: "Đã cập nhật địa chỉ mặc định thành công!",
    });
  } catch (error: unknown) {
    console.error("Update address error:", error);
    return NextResponse.json(
      { error: "Lỗi khi cập nhật địa chỉ" },
      { status: 500 }
    );
  }
}

// DELETE: Xóa địa chỉ
export async function DELETE(req: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Chưa đăng nhập" }, { status: 401 });
    }

    const { id } = await params;

    const address = await prisma.address.findFirst({
      where: { id, userId: session.user.id },
    });

    if (!address) {
      return NextResponse.json(
        { error: "Địa chỉ không tồn tại" },
        { status: 404 }
      );
    }

    // Không cho phép xóa nếu đây là địa chỉ mặc định và còn nhiều địa chỉ khác
    const totalCount = await prisma.address.count({
      where: { userId: session.user.id },
    });

    if (address.isDefault && totalCount > 1) {
      return NextResponse.json(
        { error: "Vui lòng thiết lập một địa chỉ khác làm mặc định trước khi xóa địa chỉ này." },
        { status: 400 }
      );
    }

    await prisma.address.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: "Đã xóa địa chỉ thành công!",
    });
  } catch (error: unknown) {
    console.error("Delete address error:", error);
    return NextResponse.json(
      { error: "Lỗi khi xóa địa chỉ" },
      { status: 500 }
    );
  }
}
