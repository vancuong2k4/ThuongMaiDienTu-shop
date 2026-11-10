// ============================================================
// app/api/user/loyalty/route.ts
// REST API Thông Tin Điểm Tích Lũy, Hạng VIP & Quyền Lợi Của Khách Hàng (Stage 10.2)
// ============================================================

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  MEMBERSHIP_TIER_CONFIG,
  REWARD_CATALOG,
} from "@/lib/validations/loyalty";

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session || !session.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;

    // Lấy thông tin user cùng lịch sử giao dịch và tổng chi tiêu đơn hàng
    const [user, transactions, ordersAgg] = await Promise.all([
      prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          avatar: true,
          loyaltyPoints: true,
          totalPointsEarned: true,
          membershipTier: true,
          createdAt: true,
        },
      }),
      prisma.loyaltyTransaction.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
        take: 30,
      }),
      prisma.order.aggregate({
        where: {
          userId,
          orderStatus: { in: ["CONFIRMED", "PROCESSING", "SHIPPING", "DELIVERED"] },
        },
        _sum: {
          total: true,
        },
      }),
    ]);

    if (!user) {
      return NextResponse.json(
        { error: "Không tìm thấy thông tin tài khoản" },
        { status: 404 }
      );
    }

    const totalSpent = Number(ordersAgg._sum.total || 0);
    const currentTierConfig =
      MEMBERSHIP_TIER_CONFIG[user.membershipTier] ||
      MEMBERSHIP_TIER_CONFIG.BRONZE;

    // Tính toán tiến trình lên hạng tiếp theo
    let nextTierConfig = null;
    let spentNeededForNextTier = 0;
    let tierProgressPercentage = 100;

    if (user.membershipTier === "BRONZE") {
      nextTierConfig = MEMBERSHIP_TIER_CONFIG.SILVER;
      spentNeededForNextTier = Math.max(0, nextTierConfig.minSpent - totalSpent);
      tierProgressPercentage = Math.min(
        100,
        Math.round((totalSpent / nextTierConfig.minSpent) * 100)
      );
    } else if (user.membershipTier === "SILVER") {
      nextTierConfig = MEMBERSHIP_TIER_CONFIG.GOLD;
      spentNeededForNextTier = Math.max(0, nextTierConfig.minSpent - totalSpent);
      tierProgressPercentage = Math.min(
        100,
        Math.round((totalSpent / nextTierConfig.minSpent) * 100)
      );
    } else if (user.membershipTier === "GOLD") {
      nextTierConfig = MEMBERSHIP_TIER_CONFIG.DIAMOND;
      spentNeededForNextTier = Math.max(0, nextTierConfig.minSpent - totalSpent);
      tierProgressPercentage = Math.min(
        100,
        Math.round((totalSpent / nextTierConfig.minSpent) * 100)
      );
    } else {
      // DIAMOND: Hạng tối cao nhất
      tierProgressPercentage = 100;
    }

    return NextResponse.json({
      success: true,
      data: {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          avatar: user.avatar,
          loyaltyPoints: user.loyaltyPoints,
          totalPointsEarned: user.totalPointsEarned,
          membershipTier: user.membershipTier,
          joinedAt: user.createdAt.toISOString(),
        },
        tier: {
          current: currentTierConfig,
          next: nextTierConfig,
          totalSpent,
          spentNeededForNextTier,
          progressPercentage: tierProgressPercentage,
        },
        transactions: transactions.map((t) => ({
          id: t.id,
          points: t.points,
          type: t.type,
          description: t.description,
          balanceAfter: t.balanceAfter,
          createdAt: t.createdAt.toISOString(),
        })),
        rewardsCatalog: REWARD_CATALOG,
      },
    });
  } catch (err: unknown) {
    console.error("GET /api/user/loyalty error:", err);
    return NextResponse.json(
      { error: "Lỗi hệ thống khi tải thông tin tích điểm" },
      { status: 500 }
    );
  }
}
