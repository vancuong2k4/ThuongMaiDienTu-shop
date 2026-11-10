// ============================================================
// app/(admin)/admin/khach-hang/tich-diem/page.tsx
// Trang Quản Lý THUYNGA Club - Điểm Tích Lũy & Hạng VIP (Stage 10.3)
// ============================================================

import React from "react";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { AdminPageHeader } from "@/components/admin/ui/AdminPageHeader";
import { LoyaltyManager } from "@/components/admin/loyalty/LoyaltyManager";
import type {
  LoyaltyStatsData,
  LoyaltyTransactionItem,
} from "@/components/admin/loyalty/types";

export const metadata: Metadata = {
  title: "Quản Lý Tích Điểm & VIP Club | Quản trị THUYNGA Shop",
  description:
    "Sổ cái tích điểm, phân cấp hạng thành viên Đồng / Bạc / Vàng / Kim Cương và điều chỉnh điểm thưởng khách hàng thân thiết.",
};

export const revalidate = 0;

export default async function AdminLoyaltyPage() {
  const [
    totalCount,
    transactionsRaw,
    totalCustomers,
    pointsAgg,
    tierCounts,
    redeemAgg,
  ] = await Promise.all([
    // 1. Tổng số giao dịch
    prisma.loyaltyTransaction.count(),

    // 2. Danh sách 15 giao dịch đầu tiên
    prisma.loyaltyTransaction.findMany({
      take: 15,
      skip: 0,
      orderBy: { createdAt: "desc" },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            avatar: true,
            membershipTier: true,
            loyaltyPoints: true,
          },
        },
        order: {
          select: {
            id: true,
            orderNumber: true,
            total: true,
          },
        },
      },
    }),

    // 3. Tổng số khách hàng
    prisma.user.count({ where: { role: "CUSTOMER" } }),

    // 4. Tổng điểm lưu hành và tích luỹ trọn đời
    prisma.user.aggregate({
      _sum: {
        loyaltyPoints: true,
        totalPointsEarned: true,
      },
      where: { role: "CUSTOMER" },
    }),

    // 5. Phân bổ các hạng VIP
    prisma.user.groupBy({
      by: ["membershipTier"],
      _count: { _all: true },
      where: { role: "CUSTOMER" },
    }),

    // 6. Tổng điểm đã đổi (các giao dịch âm)
    prisma.loyaltyTransaction.aggregate({
      _sum: { points: true },
      where: { points: { lt: 0 } },
    }),
  ]);

  // Phân bổ hạng VIP
  const tierMap: Record<string, number> = {
    BRONZE: 0,
    SILVER: 0,
    GOLD: 0,
    DIAMOND: 0,
  };
  tierCounts.forEach((tc) => {
    tierMap[tc.membershipTier] = tc._count._all;
  });

  const circulating = pointsAgg._sum.loyaltyPoints || 0;
  const lifetime = pointsAgg._sum.totalPointsEarned || 0;
  const redeemed = Math.abs(redeemAgg._sum.points || 0);

  const initialStats: LoyaltyStatsData = {
    totalCustomers,
    totalCirculatingPoints: circulating,
    totalLifetimePointsEarned: lifetime,
    totalRedeemedPoints: redeemed,
    monetaryEquivalentValue: circulating * 100, // 1 điểm = 100 VND
    tierDistribution: {
      bronze: tierMap.BRONZE,
      silver: tierMap.SILVER,
      gold: tierMap.GOLD,
      diamond: tierMap.DIAMOND,
    },
  };

  const initialTransactions: LoyaltyTransactionItem[] = transactionsRaw.map(
    (tx) => ({
      id: tx.id,
      points: tx.points,
      type: tx.type,
      description: tx.description,
      balanceAfter: tx.balanceAfter,
      createdAt: tx.createdAt.toISOString(),
      user: {
        id: tx.user.id,
        name: tx.user.name || "Khách hàng",
        email: tx.user.email,
        phone: tx.user.phone,
        avatar: tx.user.avatar,
        membershipTier: tx.user.membershipTier,
        currentPoints: tx.user.loyaltyPoints,
      },
      order: tx.order
        ? {
            id: tx.order.id,
            orderNumber: tx.order.orderNumber,
            total: Number(tx.order.total),
          }
        : null,
    })
  );

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Quản Lý Điểm Tích Lũy & VIP Club"
        description="Sổ cái kiểm toán biến động điểm thưởng, điều chỉnh điểm thủ công và chính sách khách hàng thân thiết THUYNGA Club."
        breadcrumbs={[
          { label: "Khách hàng", href: "/admin/khach-hang" },
          { label: "Sổ cái tích điểm THUYNGA Club" },
        ]}
      />

      <LoyaltyManager
        initialStats={initialStats}
        initialTransactions={initialTransactions}
        initialPagination={{
          page: 1,
          limit: 15,
          total: totalCount,
          totalPages: Math.ceil(totalCount / 15) || 1,
        }}
      />
    </div>
  );
}
