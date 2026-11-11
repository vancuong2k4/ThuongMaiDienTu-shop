// ============================================================
// app/(admin)/admin/don-hang/dinh-ky/page.tsx
// Trang Quản Trị Đơn Hàng Giao Định Kỳ (Subscribe & Save) Admin CMS (Stage 13.3)
// ============================================================

import React from "react";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { AdminPageHeader } from "@/components/admin/ui/AdminPageHeader";
import { SubscriptionManager } from "@/components/admin/subscription/SubscriptionManager";
import type {
  AdminSubscriptionItem,
  SubscriptionStatsData,
  SubscriptionPaginationData,
} from "@/components/admin/subscription/types";

export const metadata: Metadata = {
  title: "Quản Lý Đơn Hàng Giao Định Kỳ (Subscribe & Save) | Quản trị THUYNGA Shop",
  description:
    "Theo dõi và quản lý các gói đăng ký giao hàng định kỳ: Sữa bột cho bé, Vitamin Úc, doanh thu định kỳ MRR và tự động sinh đơn hàng chu kỳ.",
};

export const revalidate = 0;

export default async function AdminSubscriptionsPage() {
  const [
    totalCount,
    subscriptionsRaw,
    activeCount,
    pausedCount,
    allActiveForMRR,
    totalOrdersGenerated,
  ] = await Promise.all([
    prisma.subscription.count(),
    prisma.subscription.findMany({
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
          },
        },
        items: true,
        _count: {
          select: { orders: true },
        },
      },
    }),
    prisma.subscription.count({
      where: { status: "ACTIVE" },
    }),
    prisma.subscription.count({
      where: { status: "PAUSED" },
    }),
    prisma.subscription.findMany({
      where: { status: "ACTIVE" },
      select: {
        frequency: true,
        items: {
          select: {
            price: true,
            quantity: true,
          },
        },
      },
    }),
    prisma.order.count({
      where: { subscriptionId: { not: null } },
    }),
  ]);

  // Tính toán doanh thu MRR ước tính
  let estimatedMRR = 0;
  allActiveForMRR.forEach((sub) => {
    let cycleTotal = 0;
    sub.items.forEach((item) => {
      cycleTotal += Number(item.price) * item.quantity;
    });

    switch (sub.frequency) {
      case "EVERY_2_WEEKS":
        estimatedMRR += cycleTotal * 2;
        break;
      case "EVERY_1_MONTH":
        estimatedMRR += cycleTotal * 1;
        break;
      case "EVERY_2_MONTHS":
        estimatedMRR += Math.round(cycleTotal / 2);
        break;
      case "EVERY_3_MONTHS":
        estimatedMRR += Math.round(cycleTotal / 3);
        break;
    }
  });

  const initialStats: SubscriptionStatsData = {
    totalSubscriptions: totalCount,
    activeCount,
    pausedCount,
    estimatedMRR,
    totalOrdersGenerated,
  };

  const initialSubscriptions: AdminSubscriptionItem[] = subscriptionsRaw.map(
    (sub) => {
      let cycleTotal = 0;
      let cycleOriginal = 0;

      sub.items.forEach((i) => {
        cycleTotal += Number(i.price) * i.quantity;
        cycleOriginal += Number(i.originalPrice) * i.quantity;
      });

      return {
        id: sub.id,
        subscriptionNumber: sub.subscriptionNumber,
        user: {
          id: sub.user.id,
          name: sub.user.name || "Khách hàng",
          email: sub.user.email,
          phone: sub.user.phone,
          avatar: sub.user.avatar,
          membershipTier: sub.user.membershipTier,
        },
        frequency: sub.frequency,
        status: sub.status,
        discountPercent: sub.discountPercent,
        startDate: sub.startDate.toISOString(),
        nextDeliveryDate: sub.nextDeliveryDate.toISOString(),
        lastDeliveryDate: sub.lastDeliveryDate
          ? sub.lastDeliveryDate.toISOString()
          : null,
        totalCyclesDelivered: sub.totalCyclesDelivered,
        ordersCount: sub._count.orders,
        recipientName: sub.recipientName,
        recipientPhone: sub.recipientPhone,
        shippingAddress: sub.shippingAddress,
        paymentMethod: sub.paymentMethod,
        note: sub.note,
        cycleTotal,
        cycleOriginal,
        items: sub.items.map((i) => ({
          id: i.id,
          variantId: i.variantId,
          productName: i.productName,
          variantName: i.variantName,
          sku: i.sku,
          originalPrice: Number(i.originalPrice),
          price: Number(i.price),
          quantity: i.quantity,
          image: i.image,
        })),
        createdAt: sub.createdAt.toISOString(),
      };
    }
  );

  const initialPagination: SubscriptionPaginationData = {
    page: 1,
    limit: 15,
    total: totalCount,
    totalPages: Math.ceil(totalCount / 15) || 1,
  };

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Quản Lý Đơn Hàng Giao Định Kỳ"
        description="Theo dõi các gói Subscribe & Save, lịch giao hàng theo chu kỳ và kích hoạt đơn hàng định kỳ tự động."
        breadcrumbs={[
          { label: "Đơn hàng", href: "/admin/don-hang" },
          { label: "Giao định kỳ" },
        ]}
      />

      <SubscriptionManager
        initialStats={initialStats}
        initialSubscriptions={initialSubscriptions}
        initialPagination={initialPagination}
      />
    </div>
  );
}
