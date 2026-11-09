// ============================================================
// components/admin/settings/types.ts
// Định nghĩa kiểu dữ liệu cho phân hệ Cài Đặt Hệ Thống (Module 6.9)
// ============================================================

import type {
  SiteConfigValues,
  VietQRConfigValues,
  ShippingConfigValues,
  SeoConfigValues,
  AllSettingsValues,
} from "@/lib/validations/settings";

export type SettingsTabType = "brand" | "vietqr" | "shipping" | "seo";

export type {
  SiteConfigValues,
  VietQRConfigValues,
  ShippingConfigValues,
  SeoConfigValues,
  AllSettingsValues,
};
