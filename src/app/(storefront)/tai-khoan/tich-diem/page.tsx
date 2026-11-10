// ============================================================
// app/(storefront)/tai-khoan/tich-diem/page.tsx
// Trang Trung Tâm Thành Viên VIP & Đổi Thưởng THUYNGA Club (Stage 10.4)
// ============================================================

import React from "react";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  MEMBERSHIP_TIER_CONFIG,
  REWARD_CATALOG,
} from "@/lib/validations/loyalty";
import { LoyaltyHubClient } from "@/components/storefront/loyalty/LoyaltyHubClient";
import type {
  LoyaltyHubData,
  LoyaltyTransactionEntry,
} from "@/components/storefront/loyalty/types";

export const metadata: Metadata = {
  title: "THUYNGA Club - Điểm Tích Lũy & Hạng Hội Viên VIP | THUYNGA Shop",
  description:
    "Quản lý thẻ VIP điện tử, tích lũy điểm thưởng từ mọi đơn hàng nhập khẩu và đổi voucher giảm giá độc quyền THUYNGA Club.",
};

export const revalidate = 0;

export default async function MemberLoyaltyPage() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/dang-nhap?callbackUrl=/tai-khoan/tich-diem");
  }

  const userId = session.user.id;

  // Truy vấn thông tin người dùng và tổng chi tiêu hợp lệ
  const [user, totalSpentAgg, transactions] = await Promise.all([
    prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        loyaltyPoints: true,
        totalPointsEarned: true,
        membershipTier: true,
      },
    }),
    prisma.order.aggregate({
      _sum: { total: true },
      where: {
        userId,
        orderStatus: { not: "CANCELLED" },
      },
    }),
    prisma.loyaltyTransaction.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 30,
      include: {
        order: {
          select: {
            orderNumber: true,
            total: true,
          },
        },
      },
    }),
  ]);

  if (!user) {
    redirect("/dang-nhap");
  }

  const currentTier = user.membershipTier || "BRONZE";
  const tierConfig = MEMBERSHIP_TIER_CONFIG[currentTier];
  const currentSpent = Number(totalSpentAgg._sum.total || 0);

  // Tính toán tiến độ thăng hạng
  let nextTier: string | null = null;
  let nextTierThreshold: number | null = null;
  let spentNeeded = 0;
  let percentComplete = 100;

  if (currentTier === "BRONZE") {
    nextTier = "Thành Viên Bạc (Silver)";
    nextTierThreshold = MEMBERSHIP_TIER_CONFIG.SILVER.minSpent;
    spentNeeded = Math.max(0, nextTierThreshold - currentSpent);
    percentComplete = Math.min(
      100,
      Math.round((currentSpent / nextTierThreshold) * 100)
    );
  } else if (currentTier === "SILVER") {
    nextTier = "Thành Viên Vàng (Gold)";
    nextTierThreshold = MEMBERSHIP_TIER_CONFIG.GOLD.minSpent;
    spentNeeded = Math.max(0, nextTierThreshold - currentSpent);
    percentComplete = Math.min(
      100,
      Math.round((currentSpent / nextTierThreshold) * 100)
    );
  } else if (currentTier === "GOLD") {
    nextTier = "Thành Viên Kim Cương (Diamond)";
    nextTierThreshold = MEMBERSHIP_TIER_CONFIG.DIAMOND.minSpent;
    spentNeeded = Math.max(0, nextTierThreshold - currentSpent);
    percentComplete = Math.min(
      100,
      Math.round((currentSpent / nextTierThreshold) * 100)
    );
  } else {
    nextTier = null;
    nextTierThreshold = null;
    spentNeeded = 0;
    percentComplete = 100;
  }

  const formattedTransactions: LoyaltyTransactionEntry[] = transactions.map(
    (tx) => ({
      id: tx.id,
      points: tx.points,
      type: tx.type,
      description: tx.description,
      balanceAfter: tx.balanceAfter,
      createdAt: tx.createdAt.toISOString(),
      order: tx.order
        ? {
            orderNumber: tx.order.orderNumber,
            total: Number(tx.order.total),
          }
        : null,
    })
  );

  const initialData: LoyaltyHubData = {
    currentPoints: user.loyaltyPoints,
    monetaryEquivalent: user.loyaltyPoints * 100,
    totalPointsEarned: user.totalPointsEarned,
    membershipTier: currentTier,
    tierConfig,
    tierProgress: {
      currentSpent,
      nextTier,
      nextTierThreshold,
      spentNeeded,
      percentComplete,
    },
    transactions: formattedTransactions,
    rewardCatalog: REWARD_CATALOG,
  };

  return (
    <LoyaltyHubClient
      initialData={initialData}
      userName={user.name || "Khách hàng"}
    />
  );
}
