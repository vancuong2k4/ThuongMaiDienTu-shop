// ============================================================
// lib/validations/product.ts
// Zod schemas cho Quản lý Sản phẩm & Biến thể Admin CMS
// ============================================================

import { z } from "zod";

export const productVariantSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Tên biến thể không được để trống").max(100),
  sku: z
    .string()
    .min(2, "Mã SKU ít nhất 2 ký tự")
    .max(50, "Mã SKU tối đa 50 ký tự")
    .regex(/^[A-Za-z0-9-_]+$/, "Mã SKU chỉ gồm chữ, số, gạch ngang và gạch dưới"),
  price: z.coerce.number().min(0, "Giá bán không được âm"),
  originalPrice: z.coerce
    .number()
    .min(0, "Giá gốc không được âm")
    .optional()
    .nullable(),
  stock: z.coerce.number().int().min(0, "Tồn kho không được âm"),
  weight: z.coerce
    .number()
    .int()
    .min(0, "Khối lượng không được âm")
    .optional()
    .nullable(),
  image: z.string().optional().nullable(),
  isDefault: z.boolean().default(false),
  isActive: z.boolean().default(true),
  sortOrder: z.coerce.number().int().default(0),
});

export const productImageSchema = z.object({
  id: z.string().optional(),
  url: z.string().min(1, "Đường dẫn ảnh không được để trống"),
  alt: z.string().optional().nullable(),
  sortOrder: z.coerce.number().int().default(0),
});

export const productFormSchema = z.object({
  name: z
    .string()
    .min(2, "Tên sản phẩm tối thiểu 2 ký tự")
    .max(255, "Tên sản phẩm tối đa 255 ký tự"),
  slug: z
    .string()
    .min(2, "Slug tối thiểu 2 ký tự")
    .max(255, "Slug tối đa 255 ký tự")
    .regex(
      /^[a-z0-9-]+$/,
      "Slug chỉ gồm chữ thường không dấu, số và gạch ngang (-)"
    ),
  categoryId: z.string().min(1, "Vui lòng chọn danh mục"),
  brand: z.string().optional().nullable(),
  origin: z.string().optional().nullable(),
  specification: z.string().optional().nullable(),
  expiryInfo: z.string().optional().nullable(),
  shortDesc: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  isFeatured: z.boolean().default(false),
  isActive: z.boolean().default(true),
  seoTitle: z.string().optional().nullable(),
  seoDesc: z.string().optional().nullable(),
  seoKeywords: z.string().optional().nullable(),
  variants: z
    .array(productVariantSchema)
    .min(1, "Sản phẩm phải có ít nhất 1 biến thể (phân loại giá & tồn kho)"),
  images: z.array(productImageSchema).default([]),
});

export type ProductVariantInput = z.infer<typeof productVariantSchema>;
export type ProductImageInput = z.infer<typeof productImageSchema>;
export type ProductFormInput = z.infer<typeof productFormSchema>;
