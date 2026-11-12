// ============================================================
// lib/validations/chat.ts
// Zod Validations & Configurations: Hệ Thống Live Chat & Dược Sĩ (Phase 18)
// ============================================================

import { z } from "zod";
import {
  ChatSenderRole,
  ChatSessionStatus,
  ChatMessageType,
} from "@prisma/client";

// ============================================================
// UI CONFIGURATIONS & LABELS
// ============================================================

export const CHAT_SENDER_ROLE_CONFIG: Record<
  ChatSenderRole,
  { label: string; badgeClass: string; roleDesc: string }
> = {
  CUSTOMER: {
    label: "Khách hàng",
    badgeClass: "bg-slate-100 text-slate-800 border-slate-200",
    roleDesc: "Khách hàng tìm hiểu sản phẩm",
  },
  PHARMACIST: {
    label: "Dược sĩ Chuyên Môn",
    badgeClass: "bg-emerald-100 text-emerald-900 border-emerald-200",
    roleDesc: "Dược sĩ tư vấn y khoa & phác đồ dinh dưỡng Úc",
  },
  SUPPORT_AGENT: {
    label: "Chuyên viên CSKH",
    badgeClass: "bg-blue-100 text-blue-900 border-blue-200",
    roleDesc: "Hỗ trợ đơn hàng, vận chuyển và khuyến mãi",
  },
  SYSTEM_BOT: {
    label: "Hệ thống Tự Động",
    badgeClass: "bg-purple-100 text-purple-900 border-purple-200",
    roleDesc: "Tin nhắn điều hướng tự động",
  },
};

export const CHAT_SESSION_STATUS_CONFIG: Record<
  ChatSessionStatus,
  { label: string; badgeClass: string }
> = {
  ACTIVE: {
    label: "Đang trao đổi",
    badgeClass: "bg-emerald-50 text-emerald-700 border-emerald-200",
  },
  PENDING_PHARMACIST: {
    label: "Cần Dược sĩ hỗ trợ",
    badgeClass: "bg-amber-50 text-amber-700 border-amber-200",
  },
  RESOLVED: {
    label: "Đã giải đáp xong",
    badgeClass: "bg-blue-50 text-blue-700 border-blue-200",
  },
  CLOSED: {
    label: "Đã đóng phiên",
    badgeClass: "bg-slate-100 text-slate-600 border-slate-200",
  },
};

export const QUICK_CHAT_PROMPTS = [
  {
    id: "cherry-schedule",
    text: "Lịch bay và hạn sử dụng Cherry Tasmania đợt này?",
    tag: "Bay Air",
  },
  {
    id: "aptamil-switch",
    text: "Bé 7 tháng đổi sang Aptamil Úc có bị táo không?",
    tag: "Dược sĩ",
  },
  {
    id: "order-track",
    text: "Tôi muốn tra cứu tiến độ vận chuyển đơn hàng",
    tag: "Đơn hàng",
  },
  {
    id: "gift-inquiry",
    text: "Tư vấn giỏ quà biếu Tết và báo giá doanh nghiệp",
    tag: "Quà biếu",
  },
  {
    id: "pharmacist-call",
    text: "Tôi muốn trao đổi trực tiếp với Dược sĩ tư vấn",
    tag: "Dược sĩ",
  },
];

// ============================================================
// ZOD SCHEMAS
// ============================================================

export const createChatSessionSchema = z.object({
  customerName: z.string().min(2, "Vui lòng nhập họ tên của bạn"),
  customerPhone: z
    .string()
    .min(9, "Số điện thoại không hợp lệ")
    .max(12, "Số điện thoại không hợp lệ")
    .regex(/^[0-9+() -]+$/, "Số điện thoại chỉ chứa chữ số")
    .optional()
    .nullable(),
  customerEmail: z.string().email("Địa chỉ email không hợp lệ").optional().nullable(),
  initialMessage: z.string().min(1, "Vui lòng nhập nội dung câu hỏi đầu tiên"),
  guestSessionId: z.string().optional().nullable(),
});

export const sendChatMessageSchema = z.object({
  sessionId: z.string().min(1, "Thiếu ID phiên chat"),
  content: z.string().min(1, "Nội dung tin nhắn không được để trống"),
  messageType: z.nativeEnum(ChatMessageType).default(ChatMessageType.TEXT),
  mediaUrl: z.string().url("URL đính kèm không hợp lệ").optional().nullable(),
  metadata: z.any().optional().nullable(),
});

export const updateChatSessionSchema = z.object({
  status: z.nativeEnum(ChatSessionStatus).optional(),
  assignedTo: z.string().optional().nullable(),
});
