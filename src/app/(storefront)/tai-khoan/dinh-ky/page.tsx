// ============================================================
// app/(storefront)/tai-khoan/dinh-ky/page.tsx
// Trang Trung Tâm Quản Lý Gói Định Kỳ Storefront (Stage 13.5)
// ============================================================

import React from "react";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { SubscriptionHubClient } from "@/components/storefront/subscription/SubscriptionHubClient";
import type {
  StorefrontSubscription,
  StorefrontSubscriptionStats,
} from "@/components/storefront/subscription/types";

export const metadata: Metadata = {
  title: "Gói Giao Định Kỳ Của Tôi | THUYNGA Shop",
  description:
    "Quản lý lịch giao định kỳ sữa Aptamil và TPCN Úc chính hãng - Tiết kiệm 10% trọn đời và Freeship 100% mọi chu kỳ.",
};

export const revalidate = 0;

export default async function CustomerSubscriptionPage() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/dang-nhap?callbackUrl=/tai-khoan/dinh-ky");
  }

  const userId = session.user.id;

  // Lấy danh sách subscriptions của user kèm items và 3 đơn hàng gần nhất
  const subscriptions = await prisma.subscription.findMany({
    where: { userId },
    include: {
      items: true,
      orders: {
        select: {
          id: true,
          orderNumber: true,
          total: true,
          orderStatus: true,
          createdAt: true,
        },
        orderBy: { createdAt: "desc" },
        take: 3,
      },
    },
    orderBy: { createdAt: "desc" },
  });

  // Chuyển đổi định dạng dữ liệu cho client component
  const formattedSubscriptions: StorefrontSubscription[] = subscriptions.map(
    (sub) => {
      let subtotalPerCycle = 0;
      let totalPerCycle = 0;
      let discountPerCycle = 0;

      sub.items.forEach((item) => {
        const orig = Number(item.originalPrice);
        const discounted = Number(item.price);
        subtotalPerCycle += orig * item.quantity;
        totalPerCycle += discounted * item.quantity;
        discountPerCycle += (orig - discounted) * item.quantity;
      });

      return {
        id: sub.id,
        subscriptionNumber: sub.subscriptionNumber,
        frequency: sub.frequency,
        status: sub.status,
        discountPercent: sub.discountPercent,
        startDate: sub.startDate.toISOString(),
        nextDeliveryDate: sub.nextDeliveryDate.toISOString(),
        lastDeliveryDate: sub.lastDeliveryDate
          ? sub.lastDeliveryDate.toISOString()
          : null,
        totalCyclesDelivered: sub.totalCyclesDelivered,
        recipientName: sub.recipientName,
        recipientPhone: sub.recipientPhone,
        shippingAddress: sub.shippingAddress,
        paymentMethod: sub.paymentMethod,
        note: sub.note,
        pausedAt: sub.pausedAt ? sub.pausedAt.toISOString() : null,
        subtotalPerCycle,
        discountPerCycle,
        totalPerCycle,
        items: sub.items.map((item) => ({
          id: item.id,
          variantId: item.variantId,
          productName: item.productName,
          variantName: item.variantName,
          sku: item.sku,
          originalPrice: Number(item.originalPrice),
          price: Number(item.price),
          quantity: item.quantity,
          image: item.image,
        })),
        recentOrders: sub.orders.map((ord) => ({
          id: ord.id,
          orderNumber: ord.orderNumber,
          total: Number(ord.total),
          status: ord.orderStatus,
          createdAt: ord.createdAt.toISOString(),
        })),
        createdAt: sub.createdAt.toISOString(),
      };
    }
  );

  // Thống kê nhanh
  const activeSubs = formattedSubscriptions.filter((s) => s.status === "ACTIVE");
  const earliestNext =
    activeSubs.length > 0
      ? activeSubs
          .map((s) => s.nextDeliveryDate)
          .sort((a, b) => new Date(a).getTime() - new Date(b).getTime())[0]
      : null;

  // Tính tổng số tiền đã tiết kiệm (10% chiết khấu + 30.000₫ freeship mỗi chu kỳ đã giao hoặc đang hưởng)
  const totalSaved = formattedSubscriptions.reduce((acc, sub) => {
    const cycles = Math.max(1, sub.totalCyclesDelivered);
    return acc + sub.discountPerCycle * cycles + 30000 * cycles;
  }, 0);

  const stats: StorefrontSubscriptionStats = {
    totalSubscriptions: formattedSubscriptions.length,
    activeCount: activeSubs.length,
    earliestNextDelivery: earliestNext,
    totalSavedAmount: totalSaved,
  };

  return (
    <SubscriptionHubClient
      initialSubscriptions={formattedSubscriptions}
      initialStats={stats}
    />
  );
}
