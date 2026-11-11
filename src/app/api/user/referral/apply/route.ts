// ============================================================
// app/api/user/referral/apply/route.ts
// REST API Nhập & Kích Hoạt Mã Giới Thiệu Từ Bạn Bè (Stage 12.2)
// ============================================================

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  applyReferralCodeSchema,
  REFERRAL_PROGRAM_CONFIG,
} from "@/lib/validations/referral";
import { createRefereeWelcomeVoucher } from "@/lib/referral";
import { createInAppNotification } from "@/lib/notifications";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    const body = await req.json();
    const validation = applyReferralCodeSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.issues[0]?.message || "Mã không hợp lệ" },
        { status: 400 }
      );
    }

    const { referralCode } = validation.data;

    // 1. Kiểm tra tài khoản hiện tại
    const currentUser = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        referredById: true,
        orders: {
          take: 1,
          select: { id: true },
        },
      },
    });

    if (!currentUser) {
      return NextResponse.json(
        { error: "Tài khoản không tồn tại" },
        { status: 404 }
      );
    }

    if (currentUser.referredById) {
      return NextResponse.json(
        { error: "Bạn đã từng kích hoạt mã giới thiệu trước đó." },
        { status: 400 }
      );
    }

    if (currentUser.orders.length > 0) {
      return NextResponse.json(
        {
          error:
            "Chương trình chỉ áp dụng cho tài khoản mới chưa phát sinh đơn hàng nào.",
        },
        { status: 400 }
      );
    }

    // 2. Tìm người giới thiệu sở hữu mã
    const referrer = await prisma.user.findUnique({
      where: { referralCode },
      select: {
        id: true,
        name: true,
        email: true,
      },
    });

    if (!referrer) {
      return NextResponse.json(
        { error: `Mã giới thiệu "${referralCode}" không tồn tại trên hệ thống.` },
        { status: 404 }
      );
    }

    if (referrer.id === userId) {
      return NextResponse.json(
        { error: "Bạn không thể tự nhập mã giới thiệu của chính mình." },
        { status: 400 }
      );
    }

    // 3. Tạo voucher chào mừng 50.000₫ cho bạn mới
    const voucherCode = await createRefereeWelcomeVoucher(userId);

    // 4. Cập nhật User và tạo ReferralRecord
    await prisma.$transaction([
      prisma.user.update({
        where: { id: userId },
        data: { referredById: referrer.id },
      }),
      prisma.referralRecord.create({
        data: {
          referrerId: referrer.id,
          refereeId: userId,
          status: "PENDING",
          referrerRewardPoints: REFERRAL_PROGRAM_CONFIG.referrerRewardPoints,
          refereeVoucherCode: voucherCode,
        },
      }),
    ]);

    // 5. Gửi thông báo In-App cho Người giới thiệu
    await createInAppNotification({
      userId: referrer.id,
      title: "👥 Bạn có thêm 1 người bạn mới gia nhập!",
      message: `Khách hàng ${currentUser.name || currentUser.email} vừa kích hoạt liên kết giới thiệu của bạn. Khi bạn ấy hoàn thành đơn hàng đầu tiên, bạn sẽ nhận ngay +${REFERRAL_PROGRAM_CONFIG.referrerRewardPoints} điểm THUYNGA Club!`,
      type: "LOYALTY_TIER",
      link: "/tai-khoan/gioi-thieu",
    });

    // 6. Gửi thông báo In-App cho Người được giới thiệu
    await createInAppNotification({
      userId,
      title: "🎁 Nhận Voucher chào mừng 50.000₫ từ bạn bè!",
      message: `Bạn vừa áp dụng thành công mã giới thiệu từ ${referrer.name || "bạn bè"}. Mã voucher giảm 50.000₫ của bạn là: ${voucherCode}.`,
      type: "PROMOTION",
      link: "/san-pham",
    });

    return NextResponse.json({
      success: true,
      message: `Áp dụng thành công mã giới thiệu từ ${referrer.name || "bạn bè"}!`,
      voucherCode,
      voucherValue: REFERRAL_PROGRAM_CONFIG.refereeVoucherValue,
      referrerName: referrer.name || "Khách hàng THUYNGA",
    });
  } catch (error) {
    console.error("POST /api/user/referral/apply error:", error);
    return NextResponse.json(
      { error: "Đã xảy ra lỗi khi áp dụng mã giới thiệu" },
      { status: 500 }
    );
  }
}
