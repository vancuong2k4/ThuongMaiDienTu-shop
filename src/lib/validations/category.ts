// ============================================================
// lib/validations/category.ts
// Zod schemas cho Quản lý Danh mục Ngành hàng Admin CMS
// ============================================================

import { z } from "zod";

export const categorySchema = z.object({
  name: z
    .string()
    .min(2, "Tên danh mục tối thiểu 2 ký tự")
    .max(100, "Tên danh mục tối đa 100 ký tự"),
  slug: z
    .string()
    .min(2, "Slug tối thiểu 2 ký tự")
    .max(100, "Slug tối đa 100 ký tự")
    .regex(
      /^[a-z0-9-]+$/,
      "Slug chỉ gồm chữ thường không dấu, số và dấu gạch ngang (-)"
    ),
  parentId: z.string().nullable().optional(),
  description: z.string().nullable().optional(),
  image: z.string().nullable().optional(),
  sortOrder: z.coerce.number().int().min(0, "Thứ tự sắp xếp không được âm").default(0),
  isActive: z.boolean().default(true),
  seoTitle: z.string().nullable().optional(),
  seoDesc: z.string().nullable().optional(),
});

export type CategoryInput = z.infer<typeof categorySchema>;
