// ============================================================
// components/admin/reviews/types.ts
// Định nghĩa kiểu dữ liệu cho phân hệ Kiểm Duyệt Đánh Giá (Module 6.8)
// ============================================================

export type ReviewStatus = "PENDING" | "APPROVED" | "REJECTED";

export interface ReviewListItem {
  id: string;
  rating: number;
  content: string | null;
  images: string[];
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
  };
}

export interface ReviewStatsData {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
  averageRating: number;
}
