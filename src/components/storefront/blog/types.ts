// ============================================================
// components/storefront/blog/types.ts
// Định nghĩa kiểu dữ liệu cho giao diện Cẩm Nang Sức Khỏe Storefront
// ============================================================

export interface StorefrontBlogPost {
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
  publishedAt: string | null;
  createdAt: string;
  seoTitle: string | null;
  seoDesc: string | null;
  seoKeywords: string | null;
}

export interface CategoryCount {
  name: string;
  count: number;
}
