// ============================================================
// lib/validations/blog.ts
// Schema Zod kiểm thực bài viết Cẩm Nang Sức Khỏe & Blog
// ============================================================

import { z } from "zod";

export const BLOG_CATEGORIES = [
  "Cẩm nang sức khỏe",
  "Dinh dưỡng mẹ & bé",
  "Kiến thức trái cây bay",
  "Mẹo phân biệt thật - giả",
  "Lối sống lành mạnh",
] as const;

export const blogPostSchema = z.object({
  title: z
    .string()
    .trim()
    .min(5, "Tiêu đề bài viết tối thiểu 5 ký tự")
    .max(250, "Tiêu đề bài viết tối đa 250 ký tự"),
  slug: z
    .string()
    .trim()
    .min(3, "Đường dẫn (slug) tối thiểu 3 ký tự")
    .max(250, "Đường dẫn tối đa 250 ký tự")
    .optional(),
  category: z
    .string()
    .trim()
    .min(1, "Vui lòng chọn hoặc nhập chuyên mục")
    .default("Cẩm nang sức khỏe"),
  authorName: z
    .string()
    .trim()
    .min(2, "Tên tác giả tối thiểu 2 ký tự")
    .default("Dược sĩ Thu Nga"),
  excerpt: z
    .string()
    .trim()
    .min(10, "Đoạn tóm tắt mở đầu tối thiểu 10 ký tự")
    .max(600, "Đoạn tóm tắt tối đa 600 ký tự"),
  content: z
    .string()
    .trim()
    .min(30, "Nội dung bài viết tối thiểu 30 ký tự"),
  coverImage: z
    .string()
    .trim()
    .optional()
    .or(z.literal("")),
  readingTime: z
    .coerce
    .number()
    .int()
    .min(1, "Thời gian đọc tối thiểu 1 phút")
    .default(5),
  isFeatured: z.boolean().default(false),
  isPublished: z.boolean().default(false),
  publishedAt: z.string().optional().nullable(),
  seoTitle: z.string().trim().optional().or(z.literal("")),
  seoDesc: z.string().trim().optional().or(z.literal("")),
  seoKeywords: z.string().trim().optional().or(z.literal("")),
});

export type BlogPostFormValues = z.infer<typeof blogPostSchema>;

export const blogPublishToggleSchema = z.object({
  isPublished: z.boolean(),
});

export const blogFeatureToggleSchema = z.object({
  isFeatured: z.boolean(),
});
