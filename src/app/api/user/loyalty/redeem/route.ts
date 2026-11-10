// ============================================================
// app/api/user/loyalty/redeem/route.ts
// REST API Đổi Điểm Thưởng Lấy Mã Giảm Giá Độc Quyền (Stage 10.2)
// ============================================================

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redeemRewardSchema, REWARD_CATALOG } from "@/lib/validations/loyalty";
import { VoucherType, LoyaltyType } from "@prisma/client";

function generateRewardVoucherCode(prefix: string): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let random = "";
  for (let i = 0; i < 6; i++) {
    random += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `${prefix}-${random}`;
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session || !session.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    const body = await req.json();

    const validation = redeemRewardSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.issues[0]?.message || "Gói đổi thưởng không hợp lệ" },
        { status: 400 }
      );
    }

    const { rewardId } = validation.data;
    const reward = REWARD_CATALOG.find((r) => r.id === rewardId);
    if (!reward) {
      return NextResponse.json(
        { error: "Không tìm thấy thông tin gói đổi thưởng" },
        { status: 404 }
      );
    }

    // Thực hiện giao dịch an toàn
    const result = await prisma.$transaction(async (tx) => {
      // 1. Khóa và lấy thông tin User
      const user = await tx.user.findUnique({
        where: { id: userId },
        select: { id: true, loyaltyPoints: true, name: true, email: true },
      });

      if (!user) {
        throw new Error("Không tìm thấy thông tin tài khoản");
      }

      if (user.loyaltyPoints < reward.pointsRequired) {
        throw new Error(
          `Bạn không đủ điểm thưởng. Bạn có ${user.loyaltyPoints} điểm, gói này cần ${reward.pointsRequired} điểm.`
        );
      }

      const newBalance = user.loyaltyPoints - reward.pointsRequired;

      // 2. Trừ điểm người dùng
      await tx.user.update({
        where: { id: userId },
        data: {
          loyaltyPoints: newBalance,
        },
      });

      // 3. Tạo mã Voucher độc quyền cho khách
      const now = new Date();
      const thirtyDaysLater = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
      const voucherPrefix =
        rewardId === "VOUCHER_250K"
          ? "VIP250"
          : rewardId === "VOUCHER_100K"
          ? "CLUB100"
          : "CLUB50";

      let voucherCode = generateRewardVoucherCode(voucherPrefix);
      // Đảm bảo không trùng mã
      const existing = await tx.voucher.findUnique({
        where: { code: voucherCode },
      });
      if (existing) {
        voucherCode = generateRewardVoucherCode(voucherPrefix) + "B";
      }

      const voucher = await tx.voucher.create({
        data: {
          code: voucherCode,
          type: VoucherType.FIXED,
          value: reward.voucherValue,
          minOrderAmount: reward.minOrderAmount,
          usageLimit: 1,
          userLimit: 1,
          usedCount: 0,
          startDate: now,
          endDate: thirtyDaysLater,
          isActive: true,
        },
      });

      // 4. Ghi nhận vào Sổ cái giao dịch Điểm (LoyaltyTransaction)
      const transaction = await tx.loyaltyTransaction.create({
        data: {
          userId,
          points: -reward.pointsRequired,
          type: LoyaltyType.REDEEM_VOUCHER,
          description: `Đổi ${reward.pointsRequired} điểm nhận ${reward.title} (Mã: ${voucherCode})`,
          balanceAfter: newBalance,
        },
      });

      return {
        voucher,
        transaction,
        remainingPoints: newBalance,
      };
    });

    return NextResponse.json({
      success: true,
      message: `Đổi thưởng thành công! Mã Voucher của bạn là: ${result.voucher.code}`,
      data: {
        voucherCode: result.voucher.code,
        voucherValue: reward.voucherValue,
        minOrderAmount: reward.minOrderAmount,
        expiresAt: result.voucher.endDate.toISOString(),
        remainingPoints: result.remainingPoints,
      },
    });
  } catch (err: unknown) {
    console.error("POST /api/user/loyalty/redeem error:", err);
    const msg = err instanceof Error ? err.message : "Đã có lỗi xảy ra";
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}
