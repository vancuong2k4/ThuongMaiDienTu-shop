// ============================================================
// app/(admin)/admin/marketing/gioi-thieu/page.tsx
// Trang Quản Trị Hệ Thống Tiếp Thị Giới Thiệu & Bạn Mới (Stage 12.3)
// ============================================================

import React from "react";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { AdminPageHeader } from "@/components/admin/ui/AdminPageHeader";
import { ReferralManager } from "@/components/admin/referral/ReferralManager";
import type {
  AdminReferralRecordItem,
  ReferralStatsData,
  ReferralPaginationData,
} from "@/components/admin/referral/types";

export const metadata: Metadata = {
  title: "Quản Lý Tiếp Thị Giới Thiệu & Bạn Mới | Quản trị THUYNGA Shop",
  description:
    "Theo dõi chiến dịch Mời Bạn Nhận Quà Đôi: Mã mời độc quyền, tỷ lệ hoàn thành đơn đầu, voucher chào mừng và thưởng điểm THUYNGA Club.",
};

export const revalidate = 0;

export default async function AdminReferralsPage() {
  const [totalCount, recordsRaw, totalRewarded, allDeliveredOrders] =
    await Promise.all([
      // 1. Tổng số liên kết giới thiệu
      prisma.referralRecord.count(),

      // 2. 15 liên kết mới nhất
      prisma.referralRecord.findMany({
        take: 15,
        skip: 0,
        orderBy: { createdAt: "desc" },
        include: {
          referrer: {
            select: {
              id: true,
              name: true,
              email: true,
              phone: true,
              avatar: true,
              membershipTier: true,
              referralCode: true,
            },
          },
          referee: {
            select: {
              id: true,
              name: true,
              email: true,
              phone: true,
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
              createdAt: true,
            },
          },
        },
      }),

      // 3. Số liên kết đã hoàn thành đơn và nhận thưởng
      prisma.referralRecord.count({
        where: { status: "REWARDED" },
      }),

      // 4. Doanh số phát sinh từ đơn hàng giới thiệu
      prisma.order.aggregate({
        _sum: { total: true },
        where: {
          referralRecords: {
            some: { status: "REWARDED" },
          },
          orderStatus: "DELIVERED",
        },
      }),
    ]);

  const conversionRate =
    totalCount > 0 ? Math.round((totalRewarded / totalCount) * 100) : 0;
  const totalRevenue = Number(allDeliveredOrders._sum.total || 0);

  const initialStats: ReferralStatsData = {
    totalReferrals: totalCount,
    totalRewarded,
    conversionRate,
    totalRevenue,
    totalPointsDistributed: totalRewarded * 500,
  };

  const initialRecords: AdminReferralRecordItem[] = recordsRaw.map((rec) => ({
    id: rec.id,
    referrer: {
      id: rec.referrer.id,
      name: rec.referrer.name || "Khách hàng",
      email: rec.referrer.email,
      phone: rec.referrer.phone,
      avatar: rec.referrer.avatar,
      membershipTier: rec.referrer.membershipTier,
      referralCode: rec.referrer.referralCode,
    },
    referee: {
      id: rec.referee.id,
      name: rec.referee.name || "Bạn mới",
      email: rec.referee.email,
      phone: rec.referee.phone,
      avatar: rec.referee.avatar,
      membershipTier: rec.referee.membershipTier,
      joinedAt: rec.referee.createdAt.toISOString(),
    },
    order: rec.order
      ? {
          id: rec.order.id,
          orderNumber: rec.order.orderNumber,
          total: Number(rec.order.total),
          status: rec.order.orderStatus,
          createdAt: rec.order.createdAt.toISOString(),
        }
      : null,
    status: rec.status,
    rewardPoints: rec.referrerRewardPoints,
    voucherCode: rec.refereeVoucherCode,
    rewardedAt: rec.rewardedAt ? rec.rewardedAt.toISOString() : null,
    createdAt: rec.createdAt.toISOString(),
  }));

  const initialPagination: ReferralPaginationData = {
    page: 1,
    limit: 15,
    total: totalCount,
    totalPages: Math.ceil(totalCount / 15) || 1,
  };

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Tiếp Thị & Mời Bạn Nhận Quà"
        description="Quản lý chiến dịch tiếp thị giới thiệu bạn bè, tỷ lệ kích hoạt đơn hàng đầu tiên và trả thưởng điểm THUYNGA Club."
        breadcrumbs={[
          { label: "Tiếp thị", href: "/admin/marketing/gioi-thieu" },
          { label: "Mời bạn nhận quà" },
        ]}
      />

      <ReferralManager
        initialStats={initialStats}
        initialRecords={initialRecords}
        initialPagination={initialPagination}
      />
    </div>
  );
}
