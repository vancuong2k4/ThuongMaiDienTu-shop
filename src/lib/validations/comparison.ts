// ============================================================
// lib/validations/comparison.ts
// Zod Schemas & Configs cho Bộ So Sánh Sản Phẩm & Phân Tích Vi Chất (Phase 19)
// ============================================================

import { z } from "zod";
import { NutrientUnit, ComparisonScope, SynergyType } from "@prisma/client";

export const NUTRIENT_UNIT_CONFIG: Record<
  NutrientUnit,
  { label: string; symbol: string }
> = {
  [NutrientUnit.MG]: { label: "Miligam", symbol: "mg" },
  [NutrientUnit.MCG]: { label: "Microgam", symbol: "mcg" },
  [NutrientUnit.G]: { label: "Gam", symbol: "g" },
  [NutrientUnit.IU]: { label: "Đơn vị quốc tế", symbol: "IU" },
  [NutrientUnit.CFU]: { label: "Đơn vị khuẩn lạc", symbol: "CFU" },
  [NutrientUnit.PERCENT]: { label: "Phần trăm", symbol: "%" },
  [NutrientUnit.MGO]: { label: "Chỉ số Methylglyoxal", symbol: "MGO" },
};

export const COMPARISON_SCOPE_CONFIG: Record<
  ComparisonScope,
  { label: string; badge: string; description: string }
> = {
  [ComparisonScope.INFANT_FORMULA]: {
    label: "Sữa Công Thức Mẹ & Bé",
    badge: "🇦🇺 Aptamil & Sữa Úc",
    description: "So sánh chuyên sâu đạm A2, hệ vi sinh Synbiotics, hàm lượng DHA và tỷ lệ đạm Whey/Casein.",
  },
  [ComparisonScope.SUPPLEMENTS]: {
    label: "Thực Phẩm Chức Năng Úc",
    badge: "🇦🇺 TPCN Chemist Warehouse",
    description: "So sánh nồng độ hoạt chất nguyên chất, liều dùng ngày và tiêu chuẩn kiểm định TGA Úc.",
  },
  [ComparisonScope.MANUKA_HONEY]: {
    label: "Mật Ong Manuka Thượng Hạng",
    badge: "🇦🇺 Kháng Khuẩn Tự Nhiên",
    description: "So sánh chỉ số kháng sinh tự nhiên MGO/UMF, độ sánh đặc và chứng nhận nguồn gốc xuất xứ.",
  },
  [ComparisonScope.FRESH_FRUITS]: {
    label: "Cherry Bay Air & Trái Cây",
    badge: "✈️ Hàng Bay Air 48h",
    description: "So sánh size quả (30-34mm), độ giòn ngọt Brix và bảo quản chuỗi lạnh nguyên phấn cuống xanh.",
  },
  [ComparisonScope.GENERAL]: {
    label: "So Sánh Tổng Quan",
    badge: "Hàng Úc Chính Hãng",
    description: "So sánh quy cách đóng gói, giá thành ngày dùng và chứng từ hóa đơn nhập khẩu.",
  },
};

export const SYNERGY_TYPE_CONFIG: Record<
  SynergyType,
  {
    label: string;
    bgClass: string;
    textClass: string;
    borderClass: string;
    badgeText: string;
  }
> = {
  [SynergyType.SYNERGY_BENEFICIAL]: {
    label: "Tương tác hiệp đồng (Có lợi)",
    bgClass: "bg-emerald-50",
    textClass: "text-emerald-800",
    borderClass: "border-emerald-200",
    badgeText: "Hiệp Đồng Hấp Thu",
  },
  [SynergyType.CAUTION_OVERDOSE]: {
    label: "Cảnh báo trùng lặp (Nguy cơ thừa vi chất)",
    bgClass: "bg-rose-50",
    textClass: "text-rose-800",
    borderClass: "border-rose-200",
    badgeText: "Cảnh Báo Vượt Ngưỡng",
  },
  [SynergyType.INTERACTION_SEPARATE]: {
    label: "Uống cách thời điểm (Tránh cạnh tranh)",
    bgClass: "bg-amber-50",
    textClass: "text-amber-800",
    borderClass: "border-amber-200",
    badgeText: "Cách Nhau 2 Giờ",
  },
  [SynergyType.NEUTRAL]: {
    label: "Dùng kết hợp an toàn",
    bgClass: "bg-slate-50",
    textClass: "text-slate-800",
    borderClass: "border-slate-200",
    badgeText: "An Toàn Phối Hợp",
  },
};

// ── Zod Schemas ─────────────────────────────────────────────

export const analyzeSynergySchema = z.object({
  productIds: z
    .array(z.string().min(1, "Product ID không được rỗng"))
    .min(2, "Cần ít nhất 2 sản phẩm để so sánh và phân tích tương tác")
    .max(4, "Tối đa so sánh 4 sản phẩm cùng lúc"),
});

export const createNutrientReferenceSchema = z.object({
  code: z
    .string()
    .min(2, "Mã vi chất tối thiểu 2 ký tự")
    .max(50, "Mã vi chất tối đa 50 ký tự")
    .toUpperCase(),
  nameVi: z.string().min(2, "Tên tiếng Việt tối thiểu 2 ký tự"),
  nameEn: z.string().optional().nullable(),
  category: z.string().min(2, "Danh mục vi chất tối thiểu 2 ký tự"),
  standardRdi: z.number().positive().optional().nullable(),
  upperLimit: z.number().positive().optional().nullable(),
  unit: z.nativeEnum(NutrientUnit).default(NutrientUnit.MG),
  benefitsSummary: z.string().min(5, "Tóm tắt lợi ích tối thiểu 5 ký tự"),
  cautionNotes: z.string().optional().nullable(),
  sortOrder: z.number().int().default(0),
});

export const updateProductNutrientSchema = z.object({
  nutrientRefId: z.string().min(1, "nutrientRefId là bắt buộc"),
  amountPerServing: z.number().positive("Hàm lượng liều dùng phải lớn hơn 0"),
  amountPer100g: z.number().positive().optional().nullable(),
  servingSizeText: z.string().optional().nullable(),
  percentDailyValue: z.number().nonnegative().optional().nullable(),
  highlightClaim: z.string().optional().nullable(),
});

export const updateProductComparisonFeatureSchema = z.object({
  scope: z.nativeEnum(ComparisonScope).default(ComparisonScope.GENERAL),
  costPerDay: z.number().nonnegative().optional().nullable(),
  servingsPerPack: z.number().int().positive().optional().nullable(),
  australianCertification: z.string().optional().nullable(),
  targetAgeGroup: z.string().optional().nullable(),
  textureOrFlavor: z.string().optional().nullable(),
  keyDifferentiators: z.array(z.string()).optional().nullable(),
  storageInstruction: z.string().optional().nullable(),
});
