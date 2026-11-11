// ============================================================
// lib/referral.ts
// Service Điều Phối Hệ Thống Giới Thiệu Bạn Bè & Trả Thưởng (Stage 12.2)
// ============================================================

import { prisma } from "@/lib/prisma";
import { REFERRAL_PROGRAM_CONFIG } from "@/lib/validations/referral";
import { createInAppNotification } from "@/lib/notifications";
import { VoucherType, LoyaltyType } from "@prisma/client";

export { REFERRAL_PROGRAM_CONFIG };

/**
 * Sinh mã giới thiệu độc nhất dạng TNREF-XXXXX
 */
export function generateRandomReferralCode(name?: string | null): string {
  const cleanName = (name || "VIP")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^A-Za-z0-9]/g, "")
    .toUpperCase()
    .slice(0, 4);

  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let random = "";
  for (let i = 0; i < 4; i++) {
    random += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `TNREF${cleanName}${random}`;
}

/**
 * Đảm bảo người dùng luôn có một mã referralCode hợp lệ
 */
export async function ensureUserReferralCode(userId: string, name?: string | null): Promise<string> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { referralCode: true, name: true },
  });

  if (user?.referralCode) {
    return user.referralCode;
  }

  let code = generateRandomReferralCode(name || user?.name);
  let isUnique = false;
  let attempts = 0;

  while (!isUnique && attempts < 5) {
    const existing = await prisma.user.findUnique({
      where: { referralCode: code },
      select: { id: true },
    });
    if (!existing) {
      isUnique = true;
    } else {
      code = generateRandomReferralCode(name || user?.name);
      attempts++;
    }
  }

  await prisma.user.update({
    where: { id: userId },
    data: { referralCode: code },
  });

  return code;
}

/**
 * Tự động tạo voucher chào mừng 50.000₫ cho bạn mới
 */
export async function createRefereeWelcomeVoucher(refereeId: string): Promise<string> {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let random = "";
  for (let i = 0; i < 5; i++) {
    random += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  const code = `${REFERRAL_PROGRAM_CONFIG.welcomeVoucherPrefix}-${random}`;

  const now = new Date();
  const expiry = new Date(
    now.getTime() + REFERRAL_PROGRAM_CONFIG.voucherExpiryDays * 24 * 60 * 60 * 1000
  );

  await prisma.voucher.create({
    data: {
      code,
      type: VoucherType.FIXED,
      value: REFERRAL_PROGRAM_CONFIG.refereeVoucherValue,
      minOrderAmount: REFERRAL_PROGRAM_CONFIG.refereeMinOrderAmount,
      usageLimit: 1,
      userLimit: 1,
      usedCount: 0,
      startDate: now,
      endDate: expiry,
      isActive: true,
    },
  });

  return code;
}

/**
 * Xử lý trả thưởng tự động khi đơn hàng đầu tiên của bạn mới giao thành công (DELIVERED)
 */
export async function processReferralRewardOnDelivered(orderId: string) {
  try {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      select: {
        id: true,
        orderNumber: true,
        userId: true,
        total: true,
        orderStatus: true,
      },
    });

    if (!order || !order.userId || order.orderStatus !== "DELIVERED") {
      return null;
    }

    // Kiểm tra xem người đặt đơn có ReferralRecord ở trạng thái PENDING hoặc QUALIFIED không
    const referralRecord = await prisma.referralRecord.findUnique({
      where: { refereeId: order.userId },
      include: {
        referrer: {
          select: {
            id: true,
            name: true,
            email: true,
            loyaltyPoints: true,
          },
        },
      },
    });

    if (!referralRecord || referralRecord.status === "REWARDED") {
      return null;
    }

    // Thực hiện cộng điểm và cập nhật bản ghi trong Transaction
    const rewardPoints = referralRecord.referrerRewardPoints || REFERRAL_PROGRAM_CONFIG.referrerRewardPoints;

    await prisma.$transaction(async (tx) => {
      // 1. Cập nhật trạng thái ReferralRecord
      await tx.referralRecord.update({
        where: { id: referralRecord.id },
        data: {
          status: "REWARDED",
          orderId: order.id,
          rewardedAt: new Date(),
        },
      });

      // 2. Cộng điểm thưởng cho người giới thiệu
      const newPoints = referralRecord.referrer.loyaltyPoints + rewardPoints;
      await tx.user.update({
        where: { id: referralRecord.referrerId },
        data: {
          loyaltyPoints: { increment: rewardPoints },
          totalPointsEarned: { increment: rewardPoints },
        },
      });

      // 3. Ghi vào sổ cái giao dịch điểm LoyaltyTransaction
      await tx.loyaltyTransaction.create({
        data: {
          userId: referralRecord.referrerId,
          orderId: order.id,
          points: rewardPoints,
          type: LoyaltyType.EARN_ORDER,
          description: `Thưởng giới thiệu bạn bè thành công (Đơn hàng #${order.orderNumber})`,
          balanceAfter: newPoints,
        },
      });
    });

    // 4. Bắn thông báo In-App cho Người giới thiệu
    await createInAppNotification({
      userId: referralRecord.referrerId,
      title: `🎉 Nhận +${rewardPoints} điểm thưởng giới thiệu bạn bè!`,
      message: `Bạn bè của bạn vừa hoàn tất đơn hàng #${order.orderNumber}. Bạn đã được cộng +${rewardPoints} điểm THUYNGA Club vào tài khoản.`,
      type: "LOYALTY_TIER",
      link: "/tai-khoan/gioi-thieu",
    });

    // 5. Bắn thông báo In-App cho Người được giới thiệu
    await createInAppNotification({
      userId: order.userId,
      title: "🎉 Chúc mừng bạn đã hoàn thành đơn hàng đầu tiên!",
      message: `Đơn hàng #${order.orderNumber} đã giao thành công. Hãy tạo mã giới thiệu của riêng bạn để mời bạn bè và nhận quà không giới hạn nhé!`,
      type: "LOYALTY_TIER",
      link: "/tai-khoan/gioi-thieu",
    });

    return {
      success: true,
      referrerId: referralRecord.referrerId,
      pointsAwarded: rewardPoints,
    };
  } catch (error) {
    console.error("Lỗi khi xử lý trả thưởng giới thiệu:", error);
    return null;
  }
}
