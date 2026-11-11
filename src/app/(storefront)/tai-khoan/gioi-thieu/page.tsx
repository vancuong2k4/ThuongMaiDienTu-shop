// ============================================================
// app/(storefront)/tai-khoan/gioi-thieu/page.tsx
// Trang Trung Tâm Mời Bạn Nhận Quà Storefront (Stage 12.4)
// ============================================================

import React from "react";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ensureUserReferralCode } from "@/lib/referral";
import { ReferralHubClient } from "@/components/storefront/referral/ReferralHubClient";
import type {
  ReferralUserProfile,
  StorefrontReferralStats,
  InvitedFriendItem,
} from "@/components/storefront/referral/types";

export const metadata: Metadata = {
  title: "Mời Bạn Nhận Quà Đôi | THUYNGA Shop",
  description:
    "Chia sẻ mã mời nhận ngay Voucher 50.000₫ cho bạn mới và tích lũy +500 Điểm THUYNGA Club không giới hạn cho mỗi đơn hàng thành công.",
};

export const revalidate = 0;

// Helper che dấu email bảo mật (ng***@gmail.com)
function maskEmail(email: string | null): string {
  if (!email) return "Ẩn danh";
  const [localPart, domain] = email.split("@");
  if (!domain) return email;
  if (localPart.length <= 2) return `${localPart[0]}***@${domain}`;
  return `${localPart.slice(0, 2)}***@${domain}`;
}

export default async function ReferralHubPage() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/dang-nhap?callbackUrl=/tai-khoan/gioi-thieu");
  }

  const userId = session.user.id;

  // Đảm bảo người dùng luôn có mã giới thiệu
  const referralCode = await ensureUserReferralCode(userId);

  // Truy vấn thông tin người dùng và danh sách bạn bè đã mời
  const [user, referralRecords] = await Promise.all([
    prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        referralCode: true,
        referredById: true,
        referredBy: {
          select: {
            referralCode: true,
          },
        },
      },
    }),
    prisma.referralRecord.findMany({
      where: { referrerId: userId },
      orderBy: { createdAt: "desc" },
      include: {
        referee: {
          select: {
            id: true,
            name: true,
            email: true,
            createdAt: true,
          },
        },
        order: {
          select: {
            total: true,
            orderStatus: true,
          },
        },
      },
    }),
  ]);

  if (!user) {
    redirect("/dang-nhap");
  }

  const baseUrl =
    process.env.NEXTAUTH_URL ||
    (process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : "http://localhost:3000");

  const referralLink = `${baseUrl}/dang-ky?ref=${referralCode}`;

  const userProfile: ReferralUserProfile = {
    id: user.id,
    name: user.name || "Khách hàng",
    email: user.email || "",
    referralCode,
    referralLink,
  };

  const totalInvited = referralRecords.length;
  const totalRewarded = referralRecords.filter(
    (r) => r.status === "REWARDED"
  ).length;
  const totalPointsEarned = referralRecords.reduce(
    (sum, r) => (r.status === "REWARDED" ? sum + r.referrerRewardPoints : sum),
    0
  );
  const totalValueVND = totalPointsEarned * 100;

  const stats: StorefrontReferralStats = {
    totalInvited,
    totalRewarded,
    totalPointsEarned,
    totalValueVND,
  };

  const friends: InvitedFriendItem[] = referralRecords.map((r) => ({
    id: r.id,
    name: r.referee.name || "Bạn mới",
    maskedEmail: maskEmail(r.referee.email),
    joinedAt: r.referee.createdAt.toISOString(),
    status: r.status,
    rewardPoints: r.referrerRewardPoints,
    firstOrderTotal: r.order ? Number(r.order.total) : null,
    voucherCode: r.refereeVoucherCode,
  }));

  return (
    <ReferralHubClient
      user={userProfile}
      stats={stats}
      friends={friends}
      hasReferrer={Boolean(user.referredById)}
      referredByCode={user.referredBy?.referralCode}
    />
  );
}
