// ============================================================
// lib/validations/notification.ts
// Zod Schemas & Cấu Hình Phân Hệ Thông Báo Đẩy In-App (Stage 11.1)
// ============================================================

import { z } from "zod";

export const NOTIFICATION_TYPES = [
  "ORDER_STATUS",
  "PROMOTION",
  "LOYALTY_TIER",
  "SYSTEM",
] as const;

export const createNotificationSchema = z.object({
  userId: z.string().trim().min(1, "ID người nhận thông báo là bắt buộc"),
  title: z
    .string()
    .trim()
    .min(3, "Tiêu đề thông báo tối thiểu 3 ký tự")
    .max(200, "Tiêu đề tối đa 200 ký tự"),
  message: z
    .string()
    .trim()
    .min(5, "Nội dung thông báo tối thiểu 5 ký tự")
    .max(1000, "Nội dung tối đa 1000 ký tự"),
  type: z.enum(NOTIFICATION_TYPES).default("SYSTEM"),
  link: z.string().trim().optional().nullable(),
});

export const broadcastNotificationSchema = z.object({
  title: z
    .string()
    .trim()
    .min(3, "Tiêu đề thông báo tối thiểu 3 ký tự")
    .max(200, "Tiêu đề tối đa 200 ký tự"),
  message: z
    .string()
    .trim()
    .min(5, "Nội dung thông báo tối thiểu 5 ký tự")
    .max(1000, "Nội dung tối đa 1000 ký tự"),
  type: z.enum(NOTIFICATION_TYPES).default("PROMOTION"),
  link: z.string().trim().optional().nullable(),
  targetRole: z.enum(["ALL", "CUSTOMER", "VIP_ONLY"]).default("ALL"),
});

export const queryNotificationsSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().min(1).max(50).default(10),
  type: z.enum(["ALL", ...NOTIFICATION_TYPES]).default("ALL"),
  isRead: z.enum(["ALL", "UNREAD", "READ"]).default("ALL"),
});

export type CreateNotificationInput = z.infer<typeof createNotificationSchema>;
export type BroadcastNotificationInput = z.infer<typeof broadcastNotificationSchema>;
export type QueryNotificationsInput = z.infer<typeof queryNotificationsSchema>;

// Cấu hình hiển thị theo từng phân loại thông báo
export const NOTIFICATION_TYPE_CONFIG = {
  ORDER_STATUS: {
    label: "Đơn Hàng",
    badgeBg: "bg-blue-50 text-blue-700 border-blue-200",
    iconName: "Package",
  },
  PROMOTION: {
    label: "Ưu Đãi & Deal",
    badgeBg: "bg-rose-50 text-[#800028] border-rose-200",
    iconName: "Tag",
  },
  LOYALTY_TIER: {
    label: "Hội Viên VIP",
    badgeBg: "bg-amber-50 text-amber-800 border-amber-200",
    iconName: "Crown",
  },
  SYSTEM: {
    label: "Hệ Thống",
    badgeBg: "bg-slate-100 text-slate-700 border-slate-200",
    iconName: "Bell",
  },
} as const;
