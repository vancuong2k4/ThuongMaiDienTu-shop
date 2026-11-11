// ============================================================
// app/(storefront)/tai-khoan/danh-gia/page.tsx
// Trang Trung Tâm Đánh Giá & Điểm Thưởng Của Tôi (Phase 14 - Stage 14.5)
// ============================================================

import React from "react";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { AccountReviewsHubClient } from "@/components/storefront/account-reviews/AccountReviewsHubClient";
import type {
  PendingReviewItem,
  MyReviewItem,
  AccountReviewsStatsData,
} from "@/components/storefront/account-reviews/types";

export const metadata: Metadata = {
  title: "Đánh Giá & Săn Điểm Thưởng | THUYNGA Shop",
  description:
    "Chia sẻ hình ảnh mở hộp chuẩn bay air thực tế, nhận ngay đến +150 Điểm THUYNGA Club đổi voucher mua sắm.",
};

export const revalidate = 0;

export default async function AccountReviewsPage() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/dang-nhap?callbackUrl=/tai-khoan/danh-gia");
  }

  const userId = session.user.id;

  // 1. Truy vấn các bài đánh giá của user
  const reviews = await prisma.review.findMany({
    where: { userId },
    include: {
      product: {
        select: {
          id: true,
          name: true,
          slug: true,
          images: {
            take: 1,
            orderBy: { sortOrder: "asc" },
            select: { url: true },
          },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  const reviewedProductIds = new Set(reviews.map((r) => r.productId));

  // 2. Truy vấn các đơn hàng đã giao thành công (DELIVERED) để tìm sản phẩm chờ đánh giá
  const deliveredOrders = await prisma.order.findMany({
    where: {
      userId,
      orderStatus: "DELIVERED",
    },
    include: {
      items: {
        include: {
          variant: {
            include: {
              product: {
                select: {
                  id: true,
                  name: true,
                  slug: true,
                  images: {
                    take: 1,
                    orderBy: { sortOrder: "asc" },
                    select: { url: true },
                  },
                },
              },
            },
          },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  // Lọc ra các sản phẩm chưa đánh giá
  const pendingItems: PendingReviewItem[] = [];
  const processedKeySet = new Set<string>();

  deliveredOrders.forEach((order) => {
    order.items.forEach((item) => {
      const prod = item.variant?.product;
      if (prod && !reviewedProductIds.has(prod.id)) {
        const key = `${order.id}_${prod.id}`;
        if (!processedKeySet.has(key)) {
          processedKeySet.add(key);
          pendingItems.push({
            orderId: order.id,
            orderNumber: order.orderNumber,
            orderDate: order.createdAt.toISOString(),
            productId: prod.id,
            productName: prod.name,
            productSlug: prod.slug,
            productImage: prod.images[0]?.url || null,
            variantName: item.variantName || null,
            price: Number(item.price),
          });
        }
      }
    });
  });

  // Chuyển đổi định dạng bài đánh giá của tôi
  const formattedMyReviews: MyReviewItem[] = reviews.map((r) => ({
    id: r.id,
    productId: r.productId,
    productName: r.product.name,
    productSlug: r.product.slug,
    productImage: r.product.images[0]?.url || null,
    rating: r.rating,
    packagingRating: r.packagingRating,
    freshnessRating: r.freshnessRating,
    effectivenessRating: r.effectivenessRating,
    content: r.content,
    images: r.images,
    isVerifiedBuyer: r.isVerifiedBuyer,
    airCargoVerified: r.airCargoVerified,
    helpfulCount: r.helpfulCount,
    adminReply: r.adminReply,
    adminReplyAt: r.adminReplyAt ? r.adminReplyAt.toISOString() : null,
    rewardPoints: r.rewardPoints,
    status: r.status,
    createdAt: r.createdAt.toISOString(),
  }));

  // Tính thống kê
  const totalPointsEarned = formattedMyReviews.reduce(
    (acc, r) => acc + (r.rewardPoints || 0),
    0
  );
  const totalHelpfulReceived = formattedMyReviews.reduce(
    (acc, r) => acc + (r.helpfulCount || 0),
    0
  );

  const stats: AccountReviewsStatsData = {
    totalReviewed: formattedMyReviews.length,
    totalPointsEarned,
    totalHelpfulReceived,
    pendingCount: pendingItems.length,
  };

  return (
    <AccountReviewsHubClient
      initialPending={pendingItems}
      initialReviews={formattedMyReviews}
      initialStats={stats}
    />
  );
}
