// ============================================================
// lib/reviews.ts
// Nghiệp vụ Đánh Giá, Thưởng Điểm THUYNGA Club & Bình Chọn Hữu Ích (Phase 14)
// ============================================================

import { prisma } from "@/lib/prisma";
import { LoyaltyType, OrderStatus, ReviewStatus } from "@prisma/client";
import { REVIEW_CONFIG } from "@/lib/validations/review";
import { createInAppNotification } from "@/lib/notifications";

/**
 * Kiểm tra xem người dùng đã thực sự mua và nhận sản phẩm này chưa (Verified Buyer)
 */
export async function checkVerifiedBuyer(
  userId: string,
  productId: string
): Promise<{ isVerifiedBuyer: boolean; orderId: string | null }> {
  try {
    const product = await prisma.product.findUnique({
      where: { id: productId },
      select: {
        id: true,
        name: true,
        variants: { select: { id: true } },
      },
    });

    if (!product) {
      return { isVerifiedBuyer: false, orderId: null };
    }

    const variantIds = product.variants.map((v) => v.id);

    // Tìm đơn hàng thành công (DELIVERED) của user có chứa sản phẩm này
    const deliveredOrder = await prisma.order.findFirst({
      where: {
        userId,
        orderStatus: OrderStatus.DELIVERED,
        items: {
          some: {
            OR: [
              { variantId: { in: variantIds } },
              { productName: { contains: product.name, mode: "insensitive" } },
            ],
          },
        },
      },
      select: { id: true },
      orderBy: { createdAt: "desc" },
    });

    if (deliveredOrder) {
      return { isVerifiedBuyer: true, orderId: deliveredOrder.id };
    }

    return { isVerifiedBuyer: false, orderId: null };
  } catch (error) {
    console.error("checkVerifiedBuyer error:", error);
    return { isVerifiedBuyer: false, orderId: null };
  }
}

/**
 * Cộng điểm thưởng THUYNGA Club khi gửi đánh giá (+50đ bài chữ, +150đ bài kèm ảnh)
 */
export async function awardReviewPoints(
  userId: string,
  reviewId: string,
  hasImages: boolean
): Promise<{ pointsAwarded: number }> {
  const pointsAwarded = hasImages
    ? REVIEW_CONFIG.REWARD_POINTS.WITH_MEDIA
    : REVIEW_CONFIG.REWARD_POINTS.TEXT_ONLY;

  try {
    await prisma.$transaction(async (tx) => {
      // 1. Cập nhật điểm cho user
      const user = await tx.user.update({
        where: { id: userId },
        data: {
          loyaltyPoints: { increment: pointsAwarded },
          totalPointsEarned: { increment: pointsAwarded },
        },
        select: { id: true, loyaltyPoints: true },
      });

      // 2. Ghi nhật ký giao dịch điểm
      await tx.loyaltyTransaction.create({
        data: {
          userId,
          points: pointsAwarded,
          type: LoyaltyType.EARN_REVIEW,
          description: `Thưởng đánh giá sản phẩm${hasImages ? " kèm ảnh thực tế" : ""} (+${pointsAwarded} điểm)`,
          balanceAfter: user.loyaltyPoints,
        },
      });

      // 3. Cập nhật số điểm đã thưởng vào review
      await tx.review.update({
        where: { id: reviewId },
        data: { rewardPoints: pointsAwarded },
      });
    });

    // 4. Bắn thông báo In-App cho khách hàng
    await createInAppNotification({
      userId,
      title: "🎁 Thưởng Điểm Đánh Giá Sản Phẩm!",
      message: `Bạn vừa nhận được +${pointsAwarded} Điểm THUYNGA Club cho bài đánh giá của mình. Cảm ơn bạn đã đóng góp cho cộng đồng!`,
      type: "LOYALTY_TIER",
      link: "/tai-khoan/tich-diem",
    });

    return { pointsAwarded };
  } catch (error) {
    console.error("awardReviewPoints error:", error);
    return { pointsAwarded: 0 };
  }
}

/**
 * Bình chọn hữu ích (Helpful Vote) dạng Toggle
 */
export async function toggleHelpfulVote(
  reviewId: string,
  userId: string
): Promise<{ isHelpful: boolean; helpfulCount: number }> {
  const existingVote = await prisma.reviewHelpfulVote.findUnique({
    where: {
      reviewId_userId: {
        reviewId,
        userId,
      },
    },
  });

  if (existingVote) {
    // Đã vote -> Bỏ vote
    await prisma.$transaction([
      prisma.reviewHelpfulVote.delete({
        where: { id: existingVote.id },
      }),
      prisma.review.update({
        where: { id: reviewId },
        data: { helpfulCount: { decrement: 1 } },
      }),
    ]);

    const updated = await prisma.review.findUnique({
      where: { id: reviewId },
      select: { helpfulCount: true },
    });

    return { isHelpful: false, helpfulCount: Math.max(0, updated?.helpfulCount || 0) };
  } else {
    // Chưa vote -> Thêm vote
    await prisma.$transaction([
      prisma.reviewHelpfulVote.create({
        data: {
          reviewId,
          userId,
        },
      }),
      prisma.review.update({
        where: { id: reviewId },
        data: { helpfulCount: { increment: 1 } },
      }),
    ]);

    const updated = await prisma.review.findUnique({
      where: { id: reviewId },
      select: { helpfulCount: true },
    });

    return { isHelpful: true, helpfulCount: updated?.helpfulCount || 1 };
  }
}

/**
 * Tính toán thống kê đánh giá chi tiết cho sản phẩm
 */
export async function calculateProductRatingStats(productId: string) {
  const reviews = await prisma.review.findMany({
    where: {
      productId,
      status: { in: [ReviewStatus.APPROVED, ReviewStatus.FEATURED] },
    },
    select: {
      rating: true,
      packagingRating: true,
      freshnessRating: true,
      effectivenessRating: true,
      images: true,
      isVerifiedBuyer: true,
    },
  });

  const totalReviews = reviews.length;

  if (totalReviews === 0) {
    return {
      averageRating: 0,
      totalReviews: 0,
      ratingBreakdown: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
      ratingPercentages: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
      averagePackaging: 0,
      averageFreshness: 0,
      averageEffectiveness: 0,
      mediaCount: 0,
      verifiedBuyerCount: 0,
    };
  }

  const breakdown: Record<number, number> = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  let sumRating = 0;
  let sumPackaging = 0;
  let countPackaging = 0;
  let sumFreshness = 0;
  let countFreshness = 0;
  let sumEffectiveness = 0;
  let countEffectiveness = 0;
  let mediaCount = 0;
  let verifiedBuyerCount = 0;

  reviews.forEach((r) => {
    sumRating += r.rating;
    if (r.rating >= 1 && r.rating <= 5) {
      breakdown[r.rating] = (breakdown[r.rating] || 0) + 1;
    }
    if (r.packagingRating) {
      sumPackaging += r.packagingRating;
      countPackaging++;
    }
    if (r.freshnessRating) {
      sumFreshness += r.freshnessRating;
      countFreshness++;
    }
    if (r.effectivenessRating) {
      sumEffectiveness += r.effectivenessRating;
      countEffectiveness++;
    }
    if (r.images && r.images.length > 0) {
      mediaCount++;
    }
    if (r.isVerifiedBuyer) {
      verifiedBuyerCount++;
    }
  });

  const averageRating = Number((sumRating / totalReviews).toFixed(1));
  const averagePackaging = countPackaging > 0 ? Number((sumPackaging / countPackaging).toFixed(1)) : 5.0;
  const averageFreshness = countFreshness > 0 ? Number((sumFreshness / countFreshness).toFixed(1)) : 5.0;
  const averageEffectiveness = countEffectiveness > 0 ? Number((sumEffectiveness / countEffectiveness).toFixed(1)) : 5.0;

  const percentages: Record<number, number> = {
    5: Math.round((breakdown[5] / totalReviews) * 100),
    4: Math.round((breakdown[4] / totalReviews) * 100),
    3: Math.round((breakdown[3] / totalReviews) * 100),
    2: Math.round((breakdown[2] / totalReviews) * 100),
    1: Math.round((breakdown[1] / totalReviews) * 100),
  };

  return {
    averageRating,
    totalReviews,
    ratingBreakdown: breakdown,
    ratingPercentages: percentages,
    averagePackaging,
    averageFreshness,
    averageEffectiveness,
    mediaCount,
    verifiedBuyerCount,
  };
}
