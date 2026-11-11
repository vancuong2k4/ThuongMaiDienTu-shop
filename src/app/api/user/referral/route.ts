// ============================================================
// app/api/user/referral/route.ts
// REST API Lấy Dữ Liệu & Thống Kê Giới Thiệu Bạn Bè Của Khách Hàng (Stage 12.2)
// ============================================================

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  ensureUserReferralCode,
  REFERRAL_PROGRAM_CONFIG,
} from "@/lib/referral";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;

    // Đảm bảo user có mã giới thiệu
    const referralCode = await ensureUserReferralCode(
      userId,
      session.user.name
    );

    // Truy vấn các lượt giới thiệu của user
    const [referralRecords, rewardedCount] = await Promise.all([
      prisma.referralRecord.findMany({
        where: { referrerId: userId },
        orderBy: { createdAt: "desc" },
        include: {
          referee: {
            select: {
              id: true,
              name: true,
              email: true,
              avatar: true,
              membershipTier: true,
              createdAt: true,
            },
          },
          order: {
            select: {
              id: true,
              orderNumber: true,
              total: true,
              orderStatus: true,
            },
          },
        },
      }),
      prisma.referralRecord.count({
        where: { referrerId: userId, status: "REWARDED" },
      }),
    ]);

    const totalInvited = referralRecords.length;
    const totalPointsEarned =
      rewardedCount * REFERRAL_PROGRAM_CONFIG.referrerRewardPoints;

    // Mask email hiển thị an toàn: cuo***@gmail.com
    const maskEmail = (email: string) => {
      const parts = email.split("@");
      if (parts.length !== 2) return email;
      const name = parts[0];
      const domain = parts[1];
      const maskedName =
        name.length <= 3
          ? name + "***"
          : name.slice(0, 3) + "***" + name.slice(-1);
      return `${maskedName}@${domain}`;
    };

    const formattedRecords = referralRecords.map((rec) => ({
      id: rec.id,
      refereeName: rec.referee.name || "Khách hàng mới",
      refereeEmail: maskEmail(rec.referee.email),
      refereeAvatar: rec.referee.avatar,
      refereeTier: rec.referee.membershipTier,
      joinedAt: rec.referee.createdAt.toISOString(),
      status: rec.status,
      rewardPoints: rec.referrerRewardPoints,
      rewardedAt: rec.rewardedAt ? rec.rewardedAt.toISOString() : null,
      order: rec.order
        ? {
            orderNumber: rec.order.orderNumber,
            total: Number(rec.order.total),
            status: rec.order.orderStatus,
          }
        : null,
    }));

    return NextResponse.json({
      success: true,
      data: {
        referralCode,
        stats: {
          totalInvited,
          totalRewarded: rewardedCount,
          totalPointsEarned,
          rewardPerFriend: REFERRAL_PROGRAM_CONFIG.referrerRewardPoints,
        },
        records: formattedRecords,
        config: REFERRAL_PROGRAM_CONFIG,
      },
    });
  } catch (error) {
    console.error("GET /api/user/referral error:", error);
    return NextResponse.json(
      { error: "Không thể lấy thông tin giới thiệu bạn bè" },
      { status: 500 }
    );
  }
}
