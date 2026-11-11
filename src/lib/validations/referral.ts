// ============================================================
// lib/validations/referral.ts
// Zod Schemas & Cấu Hình Tiếp Thị Giới Thiệu THUYNGA Shop (Stage 12.1)
// ============================================================

import { z } from "zod";

export const REFERRAL_STATUSES = [
  "PENDING",
  "QUALIFIED",
  "REWARDED",
  "EXPIRED",
] as const;

// Cấu hình thể lệ chương trình Mời Bạn Nhận Quà
export const REFERRAL_PROGRAM_CONFIG = {
  referrerRewardPoints: 500, // Người giới thiệu nhận 500 điểm THUYNGA Club (= 50.000₫)
  refereeVoucherValue: 50000, // Người được mời nhận Voucher 50.000₫
  refereeMinOrderAmount: 300000, // Đơn hàng tối thiểu 300.000₫
  voucherExpiryDays: 30, // Hạn sử dụng voucher chào mừng 30 ngày
  codePrefix: "TNREF",
  welcomeVoucherPrefix: "BANMOI",
} as const;

export const applyReferralCodeSchema = z.object({
  referralCode: z
    .string()
    .trim()
    .min(5, "Mã giới thiệu tối thiểu 5 ký tự")
    .max(20, "Mã giới thiệu tối đa 20 ký tự")
    .toUpperCase(),
});

export const queryReferralsSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().min(1).max(50).default(10),
  status: z.enum(["ALL", ...REFERRAL_STATUSES]).default("ALL"),
  search: z.string().trim().optional(),
});

export type ApplyReferralCodeInput = z.infer<typeof applyReferralCodeSchema>;
export type QueryReferralsInput = z.infer<typeof queryReferralsSchema>;

// Cấu hình nhãn trạng thái giao diện
export const REFERRAL_STATUS_CONFIG = {
  PENDING: {
    label: "Chờ Đơn Đầu Tiên",
    badge: "bg-amber-50 text-amber-800 border-amber-200",
    description: "Bạn bè đã đăng ký thành công, chưa phát sinh đơn hàng.",
  },
  QUALIFIED: {
    label: "Đang Xử Lý Đơn",
    badge: "bg-blue-50 text-blue-700 border-blue-200",
    description: "Bạn bè đã đặt đơn hàng đầu tiên, đang chờ giao hàng thành công.",
  },
  REWARDED: {
    label: "Đã Nhận Thưởng",
    badge: "bg-emerald-50 text-emerald-700 border-emerald-200",
    description: "Đơn hàng đầu tiên đã giao thành công. Đã cộng +500 điểm vào tài khoản.",
  },
  EXPIRED: {
    label: "Hết Hiệu Lực",
    badge: "bg-slate-100 text-slate-600 border-slate-200",
    description: "Đơn hàng bị hủy hoặc không đáp ứng điều kiện chương trình.",
  },
} as const;
