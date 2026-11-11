// ============================================================
// components/storefront/account-reviews/types.ts
// Định nghĩa kiểu dữ liệu Trung Tâm Đánh Giá & Điểm Thưởng Của Tôi (Phase 14)
// ============================================================

export interface PendingReviewItem {
  orderId: string;
  orderNumber: string;
  orderDate: string;
  productId: string;
  productName: string;
  productSlug: string;
  productImage: string | null;
  variantName: string | null;
  price: number;
}

export interface MyReviewItem {
  id: string;
  productId: string;
  productName: string;
  productSlug: string;
  productImage: string | null;
  rating: number;
  packagingRating?: number | null;
  freshnessRating?: number | null;
  effectivenessRating?: number | null;
  content: string | null;
  images: string[];
  isVerifiedBuyer: boolean;
  airCargoVerified: boolean;
  helpfulCount: number;
  adminReply: string | null;
  adminReplyAt: string | null;
  rewardPoints: number;
  status: "PENDING" | "APPROVED" | "REJECTED" | "FEATURED";
  createdAt: string;
}

export interface AccountReviewsStatsData {
  totalReviewed: number;
  totalPointsEarned: number;
  totalHelpfulReceived: number;
  pendingCount: number;
}
