// ============================================================
// lib/validations/flash-sale.ts
// Zod Validation Schemas Cho Phân Hệ Quản Lý Chiến Dịch Flash Sale
// ============================================================

import { z } from "zod";

export const flashSaleCreateSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(3, "Tên chiến dịch phải có ít nhất 3 ký tự")
      .max(150, "Tên chiến dịch tối đa 150 ký tự"),
    description: z.string().trim().max(500, "Mô tả tối đa 500 ký tự").optional().nullable(),
    bannerImage: z
      .string()
      .trim()
      .url("Đường dẫn ảnh banner không hợp lệ")
      .optional()
      .nullable()
      .or(z.literal("")),
    startTime: z.coerce.date(),
    endTime: z.coerce.date(),
    isActive: z.boolean().default(true),
  })
  .refine((data) => data.endTime > data.startTime, {
    message: "Thời gian kết thúc phải diễn ra sau thời gian bắt đầu",
    path: ["endTime"],
  });

export const flashSaleUpdateSchema = z
  .object({
    name: z.string().trim().min(3).max(150).optional(),
    description: z.string().trim().max(500).optional().nullable(),
    bannerImage: z
      .string()
      .trim()
      .url("Đường dẫn ảnh banner không hợp lệ")
      .optional()
      .nullable()
      .or(z.literal("")),
    startTime: z.coerce.date().optional(),
    endTime: z.coerce.date().optional(),
    isActive: z.boolean().optional(),
  })
  .refine(
    (data) => {
      if (data.startTime && data.endTime) {
        return data.endTime > data.startTime;
      }
      return true;
    },
    {
      message: "Thời gian kết thúc phải diễn ra sau thời gian bắt đầu",
      path: ["endTime"],
    }
  );

export const flashSaleItemCreateSchema = z.object({
  productId: z.string().trim().min(1, "ID sản phẩm là bắt buộc"),
  variantId: z.string().trim().min(1, "ID biến thể là bắt buộc"),
  salePrice: z.coerce.number().positive("Giá Flash Sale phải lớn hơn 0"),
  quantity: z.coerce
    .number()
    .int("Số lượng phải là số nguyên")
    .min(1, "Số lượng mở bán tối thiểu là 1"),
  limitPerUser: z.coerce
    .number()
    .int()
    .min(1, "Giới hạn mỗi khách tối thiểu là 1")
    .default(1),
});

export const flashSaleItemUpdateSchema = z.object({
  salePrice: z.coerce.number().positive().optional(),
  quantity: z.coerce.number().int().min(1).optional(),
  soldCount: z.coerce.number().int().min(0).optional(),
  limitPerUser: z.coerce.number().int().min(1).optional(),
});

export type FlashSaleCreateInput = z.infer<typeof flashSaleCreateSchema>;
export type FlashSaleUpdateInput = z.infer<typeof flashSaleUpdateSchema>;
export type FlashSaleItemCreateInput = z.infer<typeof flashSaleItemCreateSchema>;
export type FlashSaleItemUpdateInput = z.infer<typeof flashSaleItemUpdateSchema>;
