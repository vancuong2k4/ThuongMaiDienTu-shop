// ============================================================
// app/api/auth/register/route.ts – API Đăng ký tài khoản khách hàng
// ============================================================

import { NextRequest, NextResponse } from "next/server";
import { hash } from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { registerSchema } from "@/lib/validations/auth";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // 1. Validate dữ liệu đầu vào bằng Zod schema
    const parsed = registerSchema.safeParse(body);
    if (!parsed.success) {
      const firstError = parsed.error.issues[0]?.message || "Dữ liệu không hợp lệ";
      return NextResponse.json({ error: firstError }, { status: 400 });
    }

    const { name, email, phone, password } = parsed.data;
    const cleanEmail = email.toLowerCase().trim();
    const cleanPhone = phone?.trim() || null;

    // 2. Kiểm tra email đã tồn tại chưa
    const existingEmail = await prisma.user.findUnique({
      where: { email: cleanEmail },
      select: { id: true },
    });

    if (existingEmail) {
      return NextResponse.json(
        { error: "Email này đã được đăng ký tài khoản. Vui lòng đăng nhập hoặc sử dụng email khác." },
        { status: 409 }
      );
    }

    // 3. Kiểm tra số điện thoại (nếu có)
    if (cleanPhone) {
      const existingPhone = await prisma.user.findUnique({
        where: { phone: cleanPhone },
        select: { id: true },
      });

      if (existingPhone) {
        return NextResponse.json(
          { error: "Số điện thoại này đã được liên kết với một tài khoản khác." },
          { status: 409 }
        );
      }
    }

    // 4. Hash mật khẩu an toàn bằng bcryptjs
    const passwordHash = await hash(password, 12);

    // 5. Tạo user mới với vai trò CUSTOMER
    const newUser = await prisma.user.create({
      data: {
        name: name.trim(),
        email: cleanEmail,
        phone: cleanPhone,
        passwordHash,
        role: "CUSTOMER",
        isActive: true,
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        createdAt: true,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Đăng ký tài khoản thành công!",
        user: newUser,
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    console.error("Register error:", error);
    return NextResponse.json(
      { error: "Đã có lỗi xảy ra trong quá trình đăng ký. Vui lòng thử lại sau." },
      { status: 500 }
    );
  }
}
