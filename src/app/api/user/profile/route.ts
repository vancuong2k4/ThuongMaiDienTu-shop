// ============================================================
// app/api/user/profile/route.ts – Cập nhật hồ sơ người dùng
// ============================================================

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Chưa đăng nhập" }, { status: 401 });
    }

    const body = await req.json();
    const { name, phone } = body;

    if (!name?.trim()) {
      return NextResponse.json(
        { error: "Họ và tên không được để trống" },
        { status: 400 }
      );
    }

    const cleanPhone = phone?.trim() || null;
    if (cleanPhone) {
      const phoneRegex = /(84|0[3|5|7|8|9])+([0-9]{8})\b/;
      if (!phoneRegex.test(cleanPhone)) {
        return NextResponse.json(
          { error: "Số điện thoại không hợp lệ (cần 10 chữ số)" },
          { status: 400 }
        );
      }

      // Kiểm tra xem số điện thoại có bị trùng với user khác không
      const existing = await prisma.user.findFirst({
        where: {
          phone: cleanPhone,
          id: { not: session.user.id },
        },
      });

      if (existing) {
        return NextResponse.json(
          { error: "Số điện thoại này đã được sử dụng bởi một tài khoản khác" },
          { status: 409 }
        );
      }
    }

    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        name: name.trim(),
        phone: cleanPhone,
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Cập nhật thông tin cá nhân thành công!",
      user: updatedUser,
    });
  } catch (error: unknown) {
    console.error("Profile update error:", error);
    return NextResponse.json(
      { error: "Đã xảy ra lỗi khi cập nhật thông tin" },
      { status: 500 }
    );
  }
}
