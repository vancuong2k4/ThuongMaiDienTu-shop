// ============================================================
// app/api/auth/register/route.ts – API Đăng ký tài khoản khách hàng
// ============================================================

import { NextRequest, NextResponse } from "next/server";
import { hash } from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { registerSchema } from "@/lib/validations/auth";
import {
  generateRandomReferralCode,
  createRefereeWelcomeVoucher,
  REFERRAL_PROGRAM_CONFIG,
} from "@/lib/referral";
import { createInAppNotification } from "@/lib/notifications";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // 1. Validate dữ liệu đầu vào bằng Zod schema
    const parsed = registerSchema.safeParse(body);
    if (!parsed.success) {
      const firstError = parsed.error.issues[0]?.message || "Dữ liệu không hợp lệ";
      return NextResponse.json({ error: firstError }, { status: 400 });
    }

    const { name, email, phone, password, referralCode } = parsed.data;
    const cleanEmail = email.toLowerCase().trim();
    const cleanPhone = phone?.trim() || null;
    const cleanReferralCode = referralCode?.trim().toUpperCase() || null;

    // 1.5. Kiểm tra mã giới thiệu (nếu có cung cấp)
    let referrer: { id: string; name: string | null } | null = null;
    if (cleanReferralCode) {
      referrer = await prisma.user.findUnique({
        where: { referralCode: cleanReferralCode },
        select: { id: true, name: true },
      });

      if (!referrer) {
        return NextResponse.json(
          { error: `Mã giới thiệu "${cleanReferralCode}" không tồn tại trên hệ thống.` },
          { status: 400 }
        );
      }
    }

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

    // 4.5. Sinh mã giới thiệu độc quyền cho tài khoản mới
    let newUserReferralCode = generateRandomReferralCode();
    let isCodeUnique = false;
    let attempts = 0;
    while (!isCodeUnique && attempts < 5) {
      const existing = await prisma.user.findUnique({
        where: { referralCode: newUserReferralCode },
        select: { id: true },
      });
      if (!existing) {
        isCodeUnique = true;
      } else {
        newUserReferralCode = generateRandomReferralCode();
        attempts++;
      }
    }

    // 5. Tạo user mới với vai trò CUSTOMER
    const newUser = await prisma.user.create({
      data: {
        name: name.trim(),
        email: cleanEmail,
        phone: cleanPhone,
        passwordHash,
        role: "CUSTOMER",
        isActive: true,
        referralCode: newUserReferralCode,
        referredById: referrer ? referrer.id : null,
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        referralCode: true,
        createdAt: true,
      },
    });

    // 6. Xử lý thưởng chào mừng nếu đăng ký qua mã giới thiệu
    let welcomeVoucherCode: string | null = null;
    if (referrer) {
      try {
        // Sinh Voucher chào mừng 50.000₫ cho bạn mới
        const voucherCode = await createRefereeWelcomeVoucher(newUser.id);
        welcomeVoucherCode = voucherCode;

        // Tạo bản ghi ReferralRecord (PENDING)
        await prisma.referralRecord.create({
          data: {
            referrerId: referrer.id,
            refereeId: newUser.id,
            status: "PENDING",
            referrerRewardPoints: REFERRAL_PROGRAM_CONFIG.referrerRewardPoints,
            refereeVoucherCode: voucherCode,
          },
        });

        // Bắn thông báo In-App cho người giới thiệu
        await createInAppNotification({
          userId: referrer.id,
          type: "LOYALTY_TIER",
          title: "Bạn mới đã tham gia qua mã mời của bạn! 🎉",
          message: `Khách hàng ${newUser.name || "Bạn mới"} vừa đăng ký tài khoản qua mã giới thiệu của bạn. Khi bạn ấy hoàn thành đơn đầu tiên, bạn sẽ nhận ngay +500 điểm THUYNGA Club!`,
          link: "/tai-khoan/gioi-thieu",
        });

        // Bắn thông báo In-App cho bạn mới
        await createInAppNotification({
          userId: newUser.id,
          type: "PROMOTION",
          title: "Chào mừng bạn mới! Nhận ngay Voucher 50.000₫ 🎁",
          message: `Chào mừng bạn đã gia nhập THUYNGA Shop! Mã voucher giảm ngay 50.000₫ cho đơn đầu từ 300.000₫ của bạn là: ${voucherCode}.`,
          link: "/gio-hang",
        });
      } catch (referralErr) {
        console.error("Lỗi khi kích hoạt ưu đãi giới thiệu:", referralErr);
      }
    }

    return NextResponse.json(
      {
        success: true,
        message: "Đăng ký tài khoản thành công!",
        user: newUser,
        welcomeVoucherCode,
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
