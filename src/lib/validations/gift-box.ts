// ============================================================
// lib/validations/gift-box.ts
// Zod Validations & Configurations: Hộp Quà Biếu & Quà Doanh Nghiệp (Phase 17)
// ============================================================

import { z } from "zod";
import {
  GiftBoxType,
  GiftRibbonColor,
  GiftOccasion,
  CorporateGiftStatus,
} from "@prisma/client";

// ============================================================
// UI CONFIGURATIONS & LABELS
// ============================================================

export const GIFT_BOX_TYPE_CONFIG: Record<
  GiftBoxType,
  { label: string; description: string; badgeClass: string; material: string }
> = {
  WOODEN_BOX: {
    label: "Hộp Gỗ Sơn Mài Hoàng Gia",
    description: "Gỗ thông New Zealand nguyên khối, phủ sơn mài cao cấp, khắc laser tinh xảo theo yêu cầu.",
    badgeClass: "bg-amber-100 text-amber-900 border-amber-200",
    material: "Gỗ thông tự nhiên",
  },
  LEATHER_CASE: {
    label: "Hộp Da Lót Nhung Rượu Vang",
    description: "Bọc da PU cao cấp nhập khẩu, lót nhung đỏ rượu mận mềm mại, khóa đồng cổ điển sang trọng.",
    badgeClass: "bg-rose-100 text-rose-900 border-rose-200",
    material: "Da bọc lót nhung",
  },
  BAMBOO_HAMPER: {
    label: "Giỏ Mây Tre Đan Thủ Công",
    description: "Mây tre đan nghệ nhân truyền thống, phủ bóng chống ẩm mốc, phối nơ satin bồng bềnh trang nhã.",
    badgeClass: "bg-emerald-100 text-emerald-900 border-emerald-200",
    material: "Mây tre thủ công",
  },
  CHERRY_CARGO_BOX: {
    label: "Hộp Air-Cargo Cherry Ép Kim",
    description: "Hộp giữ nhiệt 3 lớp chuẩn vận chuyển hàng không Úc, ép kim vàng gold 24K, chống va đập quả cherry.",
    badgeClass: "bg-red-100 text-red-900 border-red-200",
    material: "Hộp carton lạnh ép kim",
  },
  LUXURY_MAGNETIC_BOX: {
    label: "Hộp Nam Châm Nắp Gập Hoàng Gia",
    description: "Hộp cứng giấy mỹ thuật cao cấp, nắp gập hút nam châm chuẩn Âu Mỹ, rơm lót giấy nhập khẩu.",
    badgeClass: "bg-slate-100 text-slate-800 border-slate-200",
    material: "Giấy mỹ thuật định lượng 1200gsm",
  },
};

export const GIFT_RIBBON_COLOR_CONFIG: Record<
  GiftRibbonColor,
  { label: string; hex: string; bgClass: string; textClass: string }
> = {
  RUBY_RED: {
    label: "Đỏ Rượu Ruby",
    hex: "#800028",
    bgClass: "bg-[#800028]",
    textClass: "text-[#800028]",
  },
  CHAMPAGNE_GOLD: {
    label: "Vàng Champagne Ánh Kim",
    hex: "#d4af37",
    bgClass: "bg-amber-500",
    textClass: "text-amber-800",
  },
  EMERALD_GREEN: {
    label: "Xanh Ngọc Lục Bảo",
    hex: "#059669",
    bgClass: "bg-emerald-600",
    textClass: "text-emerald-800",
  },
  ROYAL_NAVY: {
    label: "Xanh Navy Quý Phái",
    hex: "#1e3a8a",
    bgClass: "bg-blue-800",
    textClass: "text-blue-900",
  },
};

export const GIFT_OCCASION_CONFIG: Record<
  GiftOccasion,
  { label: string; shortLabel: string; greetingSample: string }
> = {
  TET_HOLIDAY: {
    label: "Tết Nguyên Đán & Năm Mới",
    shortLabel: "Quà Tết",
    greetingSample: "Kính chúc Quý Khách năm mới An Khang Thịnh Vượng, Vạn Sự Như Ý, Sức Khỏe Dồi Dào và Tấn Tài Tấn Lộc!",
  },
  MID_AUTUMN: {
    label: "Tết Trung Thu Đoàn Viên",
    shortLabel: "Trung Thu",
    greetingSample: "Kính chúc Gia đình một mùa Trăng rằm An yên, Ấm áp sum vầy và Hạnh phúc vẹn tròn!",
  },
  CORPORATE_THANK_YOU: {
    label: "Tri Ân Đối Tác & Khách Hàng",
    shortLabel: "Tri Ân Doanh Nghiệp",
    greetingSample: "Trân trọng cảm ơn Quý Đối tác đã đồng hành cùng chúng tôi. Kính chúc Quý Công ty ngày càng phát triển thịnh vượng!",
  },
  BIRTHDAY: {
    label: "Chúc Mừng Sinh Nhật & Kỷ Niệm",
    shortLabel: "Sinh Nhật",
    greetingSample: "Chúc mừng sinh nhật! Chúc bạn tuổi mới luôn rạng rỡ, tràn đầy năng lượng và gặt hái thêm nhiều thành công rực rỡ!",
  },
  NEWBORN_BABY: {
    label: "Mừng Đầy Tháng & Thôi Nôi Bé",
    shortLabel: "Đầy Tháng Bé",
    greetingSample: "Mừng con yêu chào đời bình an! Chúc bé hay ăn chóng lớn, khỏe mạnh thông minh và là niềm tự hào của cả gia đình!",
  },
  PARENTS_HEALTH: {
    label: "Báo Hiếu Cha Mẹ & Chúc Thọ",
    shortLabel: "Báo Hiếu Cha Mẹ",
    greetingSample: "Kính chúc Bố Mẹ bách niên giai lão, sức khỏe dồi dào, tâm an vui hưởng hạnh phúc cùng con cháu!",
  },
};

export const CORPORATE_GIFT_STATUS_CONFIG: Record<
  CorporateGiftStatus,
  { label: string; badgeClass: string }
> = {
  PENDING: {
    label: "Tiếp nhận mới",
    badgeClass: "bg-amber-50 text-amber-800 border-amber-200",
  },
  CONTACTED: {
    label: "Đã liên hệ tư vấn",
    badgeClass: "bg-sky-50 text-sky-800 border-sky-200",
  },
  QUOTED: {
    label: "Đã gửi bảng báo giá",
    badgeClass: "bg-purple-50 text-purple-800 border-purple-200",
  },
  DEPOSIT_PAID: {
    label: "Đã đặt cọc sản xuất",
    badgeClass: "bg-indigo-50 text-indigo-800 border-indigo-200",
  },
  FULFILLED: {
    label: "Đã giao hàng & Tất toán",
    badgeClass: "bg-emerald-50 text-emerald-800 border-emerald-200",
  },
  CANCELLED: {
    label: "Đã hủy yêu cầu",
    badgeClass: "bg-rose-50 text-rose-800 border-rose-200",
  },
};

// ============================================================
// ZOD SCHEMAS
// ============================================================

export const createHamperItemSchema = z.object({
  productId: z.string().min(1, "Vui lòng chọn sản phẩm"),
  variantId: z.string().optional().nullable(),
  quantity: z.number().int().min(1, "Số lượng tối thiểu là 1").default(1),
  unitPrice: z.number().min(0, "Giá sản phẩm không hợp lệ"),
  slotCost: z.number().int().min(1).default(1),
});

export const createCustomHamperSchema = z.object({
  templateId: z.string().min(1, "Vui lòng chọn mẫu vỏ hộp quà"),
  occasion: z.nativeEnum(GiftOccasion).default(GiftOccasion.TET_HOLIDAY),
  ribbonColor: z.nativeEnum(GiftRibbonColor).default(GiftRibbonColor.RUBY_RED),
  hasWaxSeal: z.boolean().default(true),
  hasLedLights: z.boolean().default(false),
  greetingCardMessage: z.string().max(500, "Lời chúc tối đa 500 ký tự").optional().nullable(),
  cardSenderName: z.string().max(100, "Tên người gửi tối đa 100 ký tự").optional().nullable(),
  cardReceiverName: z.string().max(100, "Tên người nhận tối đa 100 ký tự").optional().nullable(),
  notes: z.string().max(500, "Ghi chú tối đa 500 ký tự").optional().nullable(),
  items: z.array(createHamperItemSchema).min(1, "Giỏ quà phải có ít nhất 1 sản phẩm"),
});

export const corporateGiftInquirySchema = z.object({
  companyName: z.string().min(2, "Vui lòng nhập tên công ty hoặc tổ chức"),
  contactPerson: z.string().min(2, "Vui lòng nhập họ tên người liên hệ"),
  phone: z
    .string()
    .min(9, "Số điện thoại không hợp lệ")
    .max(12, "Số điện thoại không hợp lệ")
    .regex(/^[0-9+() -]+$/, "Số điện thoại chỉ chứa chữ số"),
  email: z.string().email("Địa chỉ email không hợp lệ"),
  occasion: z.nativeEnum(GiftOccasion).default(GiftOccasion.CORPORATE_THANK_YOU),
  quantity: z.number().int().min(5, "Số lượng đặt doanh nghiệp tối thiểu từ 5 suất"),
  budgetPerHamper: z.number().min(500000, "Ngân sách tối thiểu từ 500.000đ/suất"),
  deliveryDeadline: z.string().optional().nullable(),
  requiresVatInvoice: z.boolean().default(true),
  customLogoBranding: z.boolean().default(true),
  notes: z.string().max(1000, "Ghi chú tối đa 1000 ký tự").optional().nullable(),
});

export const updateCorporateInquiryStatusSchema = z.object({
  status: z.nativeEnum(CorporateGiftStatus),
  quotedTotal: z.number().optional().nullable(),
  adminNotes: z.string().optional().nullable(),
});

export const createGiftBoxTemplateSchema = z.object({
  name: z.string().min(3, "Tên vỏ hộp quà tối thiểu 3 ký tự"),
  slug: z.string().min(3, "Slug tối thiểu 3 ký tự"),
  boxType: z.nativeEnum(GiftBoxType),
  dimensions: z.string().min(3, "Vui lòng nhập kích thước vỏ hộp (VD: 36 x 28 x 12 cm)"),
  basePrice: z.number().min(0, "Giá vỏ hộp không thể âm"),
  maxSlots: z.number().int().min(2).max(12).default(5),
  imageUrl: z.string().url("URL ảnh không hợp lệ"),
  description: z.string().optional().nullable(),
  isAirCargoPledge: z.boolean().default(true),
  isActive: z.boolean().default(true),
  sortOrder: z.number().int().default(0),
});
