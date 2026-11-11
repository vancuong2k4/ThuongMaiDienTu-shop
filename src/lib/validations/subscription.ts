// ============================================================
// lib/validations/subscription.ts
// Zod schemas & Cấu hình cho Đơn Hàng Giao Định Kỳ (Subscribe & Save)
// ============================================================

import { z } from "zod";

export const SUBSCRIPTION_CONFIG = {
  DEFAULT_DISCOUNT_PERCENT: 10, // Giảm 10% trọn đời cho mọi kỳ giao
  PREFIX: "SUB",
  FREQUENCIES: {
    EVERY_2_WEEKS: {
      key: "EVERY_2_WEEKS",
      label: "Mỗi 2 tuần",
      days: 14,
      tag: "Giao 2 tuần/lần",
      description: "Phù hợp sữa công thức cho bé uống nhiều hoặc mật ong dùng hằng ngày",
    },
    EVERY_1_MONTH: {
      key: "EVERY_1_MONTH",
      label: "Mỗi 1 tháng",
      days: 30,
      tag: "Phổ biến nhất",
      recommended: true,
      description: "Chu kỳ khuyên dùng - Tối ưu cho vitamin, TPCN, collagen Úc lọ 30-60 viên",
    },
    EVERY_2_MONTHS: {
      key: "EVERY_2_MONTHS",
      label: "Mỗi 2 tháng",
      days: 60,
      tag: "Tiết kiệm thời gian",
      description: "Phù hợp cho combo sản phẩm lớn hoặc gia đình nhiều thành viên",
    },
    EVERY_3_MONTHS: {
      key: "EVERY_3_MONTHS",
      label: "Mỗi 3 tháng",
      days: 90,
      tag: "Định kỳ quý",
      description: "Dành cho liệu trình chăm sóc sức khỏe dài hạn",
    },
  },
  STATUSES: {
    ACTIVE: {
      label: "Đang hoạt động",
      badgeColor: "bg-emerald-50 text-emerald-800 border-emerald-200",
    },
    PAUSED: {
      label: "Tạm dừng",
      badgeColor: "bg-amber-50 text-amber-800 border-amber-200",
    },
    CANCELLED: {
      label: "Đã hủy gói",
      badgeColor: "bg-rose-50 text-rose-800 border-rose-200",
    },
    EXPIRED: {
      label: "Hết hiệu lực",
      badgeColor: "bg-slate-100 text-slate-600 border-slate-200",
    },
  },
} as const;

export const SUBSCRIPTION_FREQUENCY_CONFIG = SUBSCRIPTION_CONFIG.FREQUENCIES;

export const subscriptionItemSchema = z.object({
  variantId: z.string().optional().nullable(),
  productName: z.string().min(1, "Tên sản phẩm không được trống"),
  variantName: z.string().default("Mặc định"),
  sku: z.string().default("SKU-DEFAULT"),
  originalPrice: z.number().positive("Giá gốc phải lớn hơn 0"),
  quantity: z.number().int().positive("Số lượng phải lớn hơn 0").default(1),
  image: z.string().optional().nullable(),
});

export const createSubscriptionSchema = z.object({
  frequency: z.enum([
    "EVERY_2_WEEKS",
    "EVERY_1_MONTH",
    "EVERY_2_MONTHS",
    "EVERY_3_MONTHS",
  ]),
  recipientName: z.string().min(2, "Họ và tên người nhận phải có ít nhất 2 ký tự"),
  recipientPhone: z.string().regex(/^(0|\+84)[3-9]\d{8}$/, "Số điện thoại không hợp lệ"),
  shippingAddress: z.string().min(5, "Địa chỉ nhận hàng quá ngắn"),
  paymentMethod: z.enum(["COD", "VIETQR"]).default("COD"),
  note: z.string().max(500).optional().nullable(),
  startDate: z.string().optional(), // ISO string hoặc mặc định hôm nay
  items: z.array(subscriptionItemSchema).min(1, "Gói định kỳ phải có ít nhất 1 sản phẩm"),
});

export const subscriptionActionSchema = z.object({
  action: z.enum([
    "PAUSE",        // Tạm dừng
    "RESUME",       // Tiếp tục
    "SKIP_NEXT",    // Bỏ qua kỳ giao tiếp theo
    "DELIVER_NOW",  // Đặt giao ngay lập tức một đơn hôm nay
    "CANCEL",       // Hủy gói định kỳ
    "UPDATE_FREQUENCY", // Đổi chu kỳ giao
  ]),
  frequency: z
    .enum(["EVERY_2_WEEKS", "EVERY_1_MONTH", "EVERY_2_MONTHS", "EVERY_3_MONTHS"])
    .optional(),
  reason: z.string().max(500).optional(),
});

export const querySubscriptionsSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(50).default(15),
  status: z
    .enum(["ALL", "ACTIVE", "PAUSED", "CANCELLED", "EXPIRED"])
    .default("ALL"),
  frequency: z
    .enum(["ALL", "EVERY_2_WEEKS", "EVERY_1_MONTH", "EVERY_2_MONTHS", "EVERY_3_MONTHS"])
    .default("ALL"),
  search: z.string().optional(),
});

export type CreateSubscriptionInput = z.infer<typeof createSubscriptionSchema>;
export type SubscriptionActionInput = z.infer<typeof subscriptionActionSchema>;
export type QuerySubscriptionsInput = z.infer<typeof querySubscriptionsSchema>;
