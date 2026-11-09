// ============================================================
// lib/validations/settings.ts
// Schema Zod kiểm thực dữ liệu Cài Đặt Hệ Thống (Module 6.9)
// ============================================================

import { z } from "zod";

export const siteConfigSchema = z.object({
  brandName: z.string().trim().min(1, "Vui lòng nhập tên thương hiệu"),
  slogan: z.string().trim().min(1, "Vui lòng nhập slogan thương hiệu"),
  hotline: z.string().trim().min(1, "Vui lòng nhập hotline"),
  email: z.string().trim().email("Email không hợp lệ"),
  address: z.string().trim().min(1, "Vui lòng nhập địa chỉ cửa hàng"),
  openingHours: z.string().trim().min(1, "Vui lòng nhập thời gian mở cửa"),
  fanpage: z.string().trim().url("Đường dẫn Fanpage không hợp lệ").or(z.literal("")),
  zalo: z.string().trim().min(1, "Vui lòng nhập số Zalo hoặc link Zalo OA"),
  tiktok: z.string().trim().url("Đường dẫn TikTok không hợp lệ").or(z.literal("")).optional(),
  logo: z.string().trim().optional(),
  favicon: z.string().trim().optional(),
});

export const vietqrConfigSchema = z.object({
  bankId: z.string().trim().min(1, "Vui lòng chọn ngân hàng"),
  accountNo: z.string().trim().min(4, "Số tài khoản ngân hàng tối thiểu 4 chữ số"),
  accountName: z.string().trim().min(2, "Vui lòng nhập tên chủ tài khoản"),
  template: z.enum(["compact", "compact2", "qr_only"]).default("compact"),
});

export const shippingConfigSchema = z.object({
  standardFee: z.coerce.number().min(0, "Phí vận chuyển không được âm"),
  freeShippingThreshold: z.coerce.number().min(0, "Mức đơn Freeship không được âm"),
  deliveryTime: z.string().trim().min(1, "Vui lòng nhập thời gian giao hàng dự kiến"),
});

export const seoConfigSchema = z.object({
  metaTitle: z.string().trim().min(1, "Vui lòng nhập tiêu đề SEO mặc định"),
  metaDescription: z.string().trim().min(1, "Vui lòng nhập mô tả SEO mặc định"),
  keywords: z.string().trim().optional(),
  ogImage: z.string().trim().optional(),
});

export type SiteConfigValues = z.infer<typeof siteConfigSchema>;
export type VietQRConfigValues = z.infer<typeof vietqrConfigSchema>;
export type ShippingConfigValues = z.infer<typeof shippingConfigSchema>;
export type SeoConfigValues = z.infer<typeof seoConfigSchema>;

export interface AllSettingsValues {
  siteConfig: SiteConfigValues;
  vietqrConfig: VietQRConfigValues;
  shippingConfig: ShippingConfigValues;
  seoConfig: SeoConfigValues;
}
