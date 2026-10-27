// ============================================================
// app/api/user/change-password/route.ts – Đổi mật khẩu tài khoản
// ============================================================

import { NextRequest, NextResponse } from "next/server";
import { compare, hash } from "bcryptjs";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Chưa đăng nhập" }, { status: 401 });
    }

    const body = await req.json();
    const { currentPassword, newPassword, confirmPassword } = body;

    if (!currentPassword || !newPassword || !confirmPassword) {
      return NextResponse.json(
        { error: "Vui lòng nhập đầy đủ các trường thông tin" },
        { status: 400 }
      );
    }

    if (newPassword.length < 8) {
      return NextResponse.json(
        { error: "Mật khẩu mới phải có ít nhất 8 ký tự" },
        { status: 400 }
      );
    }

    if (newPassword !== confirmPassword) {
      return NextResponse.json(
        { error: "Mật khẩu xác nhận không khớp với mật khẩu mới" },
        { status: 400 }
      );
    }

    // Lấy mật khẩu hash hiện tại trong DB
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { passwordHash: true },
    });

    if (!user || !user.passwordHash) {
      return NextResponse.json(
        { error: "Tài khoản chưa thiết lập mật khẩu (đăng nhập bằng mạng xã hội)" },
        { status: 400 }
      );
    }

    // Kiểm tra mật khẩu cũ
    const isCurrentValid = await compare(currentPassword, user.passwordHash);
    if (!isCurrentValid) {
      return NextResponse.json(
        { error: "Mật khẩu hiện tại không chính xác" },
        { status: 400 }
      );
    }

    // Hash mật khẩu mới và lưu
    const newPasswordHash = await hash(newPassword, 12);
    await prisma.user.update({
      where: { id: session.user.id },
      data: { passwordHash: newPasswordHash },
    });

    return NextResponse.json({
      success: true,
      message: "Đổi mật khẩu thành công! Vui lòng sử dụng mật khẩu mới cho lần đăng nhập sau.",
    });
  } catch (error: unknown) {
    console.error("Change password error:", error);
    return NextResponse.json(
      { error: "Đã xảy ra lỗi khi đổi mật khẩu" },
      { status: 500 }
    );
  }
}
