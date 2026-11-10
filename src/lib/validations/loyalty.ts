// ============================================================
// lib/validations/loyalty.ts
// Zod Schemas & Cấu Hình Hạng Thành Viên THUYNGA Club (Stage 10.1)
// ============================================================

import { z } from "zod";

export const adjustPointsSchema = z.object({
  userId: z.string().trim().min(1, "ID khách hàng là bắt buộc"),
  points: z.coerce
    .number()
    .int("Số điểm phải là số nguyên")
    .refine((val) => val !== 0, "Số điểm điều chỉnh không được bằng 0"),
  description: z
    .string()
    .trim()
    .min(3, "Lý do điều chỉnh tối thiểu 3 ký tự")
    .max(255, "Lý do tối đa 255 ký tự"),
});

export const redeemRewardSchema = z.object({
  rewardId: z.enum(["VOUCHER_50K", "VOUCHER_100K", "VOUCHER_250K"]),
});

export type AdjustPointsInput = z.infer<typeof adjustPointsSchema>;
export type RedeemRewardInput = z.infer<typeof redeemRewardSchema>;

// Cấu hình 4 hạng thành viên THUYNGA Club
export const MEMBERSHIP_TIER_CONFIG = {
  BRONZE: {
    name: "Thành Viên Đồng",
    code: "BRONZE",
    minSpent: 0,
    pointRatePercent: 1.0, // 1% giá trị đơn hàng quy thành điểm (100.000₫ = 10 điểm = 1.000₫)
    gradient: "from-amber-700 via-amber-800 to-amber-950",
    textGradient: "from-amber-200 to-amber-400",
    badgeBg: "bg-amber-100 text-amber-900 border-amber-300",
    privileges: [
      "Tích lũy 1% giá trị mọi đơn hàng giao thành công",
      "Đổi điểm lấy mã giảm giá không giới hạn",
      "Nhận ưu đãi quà tặng ngày sinh nhật",
    ],
  },
  SILVER: {
    name: "Thành Viên Bạc",
    code: "SILVER",
    minSpent: 3000000, // Chi tiêu 3 triệu
    pointRatePercent: 1.5, // 1.5% tích điểm
    gradient: "from-slate-400 via-slate-500 to-slate-700",
    textGradient: "from-slate-100 to-slate-300",
    badgeBg: "bg-slate-100 text-slate-800 border-slate-300",
    privileges: [
      "Tích lũy 1.5% giá trị đơn hàng (nhanh hơn 50%)",
      "Voucher sinh nhật trị giá 100.000₫",
      "Ưu tiên hỗ trợ tư vấn y khoa từ Dược sĩ",
    ],
  },
  GOLD: {
    name: "Thành Viên Vàng",
    code: "GOLD",
    minSpent: 10000000, // Chi tiêu 10 triệu
    pointRatePercent: 2.0, // 2% tích điểm
    gradient: "from-amber-400 via-yellow-500 to-amber-600",
    textGradient: "from-amber-100 to-yellow-200",
    badgeBg: "bg-amber-100 text-amber-900 border-amber-400",
    privileges: [
      "Tích lũy 2.0% giá trị đơn hàng (gấp đôi hạng Đồng)",
      "Voucher sinh nhật trị giá 200.000₫",
      "Tặng thêm 01 mã freeship hàng bay Air Cargo mỗi tháng",
      "Đặc quyền mua sớm các lô hàng hoa quả bay đầu mùa",
    ],
  },
  DIAMOND: {
    name: "Thành Viên Kim Cương",
    code: "DIAMOND",
    minSpent: 25000000, // Chi tiêu 25 triệu
    pointRatePercent: 3.0, // 3% tích điểm
    gradient: "from-indigo-600 via-purple-600 to-slate-950",
    textGradient: "from-indigo-100 via-purple-200 to-pink-200",
    badgeBg: "bg-purple-100 text-purple-900 border-purple-300",
    privileges: [
      "Tích lũy 3.0% giá trị đơn hàng trọn đời (gấp 3 lần thông thường)",
      "Miễn phí vận chuyển toàn quốc cho mọi đơn hàng",
      "Hộp quà tri ân thượng hạng dịp Tết & Sinh nhật",
      "Hotline VIP kết nối trực tiếp Dược sĩ Trưởng 24/7",
    ],
  },
} as const;

// Danh mục đổi thưởng từ điểm tích lũy
export const REWARD_CATALOG = [
  {
    id: "VOUCHER_50K",
    title: "Voucher Giảm Giá 50.000₫",
    description: "Áp dụng cho mọi đơn hàng từ 300.000₫ tại THUYNGA Shop",
    pointsRequired: 500,
    voucherValue: 50000,
    minOrderAmount: 300000,
    tag: "Phổ Biến Nhất",
  },
  {
    id: "VOUCHER_100K",
    title: "Voucher Giảm Giá 100.000₫",
    description: "Áp dụng cho mọi đơn hàng từ 600.000₫. Tiết kiệm ngay 100 điểm!",
    pointsRequired: 900,
    voucherValue: 100000,
    minOrderAmount: 600000,
    tag: "Ưu Đãi Hot",
  },
  {
    id: "VOUCHER_250K",
    title: "Voucher VIP Giảm Giá 250.000₫",
    description: "Áp dụng cho đơn hàng từ 1.200.000₫. Tiết kiệm tới 500 điểm thưởng!",
    pointsRequired: 2000,
    voucherValue: 250000,
    minOrderAmount: 1200000,
    tag: "Đặc Quyền VIP",
  },
] as const;
