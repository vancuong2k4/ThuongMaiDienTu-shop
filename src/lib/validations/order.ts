// ============================================================
// lib/validations/order.ts
// Zod schemas cho Quản lý Đơn hàng Admin CMS
// ============================================================

import { z } from "zod";

export const updateOrderStatusSchema = z.object({
  status: z.enum([
    "PENDING",
    "CONFIRMED",
    "PROCESSING",
    "SHIPPING",
    "DELIVERED",
    "CANCELLED",
    "REFUNDED",
  ]),
  note: z.string().max(500, "Ghi chú tối đa 500 ký tự").optional(),
});

export const updatePaymentStatusSchema = z.object({
  paymentStatus: z.enum(["PENDING", "PAID", "FAILED", "REFUNDED"]),
  paidAt: z.string().datetime().optional().nullable(),
});

export const updateAdminNoteSchema = z.object({
  adminNote: z.string().max(1000, "Ghi chú nội bộ tối đa 1000 ký tự").nullable().optional(),
});

export type UpdateOrderStatusInput = z.infer<typeof updateOrderStatusSchema>;
export type UpdatePaymentStatusInput = z.infer<typeof updatePaymentStatusSchema>;
export type UpdateAdminNoteInput = z.infer<typeof updateAdminNoteSchema>;
