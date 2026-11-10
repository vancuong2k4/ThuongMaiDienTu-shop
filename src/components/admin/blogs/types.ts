// ============================================================
// components/admin/blogs/types.ts
// Định nghĩa kiểu dữ liệu cho phân hệ Quản Lý Bài Viết Cẩm Nang
// ============================================================

export interface BlogItem {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  coverImage: string | null;
  category: string;
  authorName: string;
  readingTime: number;
  viewCount: number;
  isFeatured: boolean;
  isPublished: boolean;
  publishedAt: string | null;
  seoTitle: string | null;
  seoDesc: string | null;
  seoKeywords: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface BlogStatsData {
  total: number;
  published: number;
  draft: number;
  totalViews: number;
}
