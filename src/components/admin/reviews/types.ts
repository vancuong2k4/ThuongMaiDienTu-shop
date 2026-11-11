// ============================================================
// components/admin/reviews/types.ts
// Định nghĩa kiểu dữ liệu cho phân hệ Kiểm Duyệt Đánh Giá & UGC (Phase 14)
// ============================================================

export type ReviewStatus = "PENDING" | "APPROVED" | "REJECTED" | "FEATURED";

export interface ReviewListItem {
  id: string;
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
  status: ReviewStatus;
  createdAt: string;
  updatedAt: string;
  product: {
    id: string;
    name: string;
    slug: string;
    image: string | null;
  };
  user: {
    id: string;
    name: string | null;
    email: string;
    avatar: string | null;
    membershipTier?: string | null;
  };
}

export interface ReviewStatsData {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
  featured: number;
  averageRating: number;
  mediaRate: number; // Tỷ lệ % đánh giá có đính kèm ảnh/video UGC
}
