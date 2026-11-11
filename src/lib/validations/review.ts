// ============================================================
// lib/validations/review.ts
// Zod schemas & Cấu hình Đánh Giá, UGC & Hỏi Đáp Sản Phẩm (Phase 14)
// ============================================================

import { z } from "zod";

export const REVIEW_CONFIG = {
  REWARD_POINTS: {
    TEXT_ONLY: 50,       // Thưởng +50 điểm THUYNGA Club khi đánh giá chữ
    WITH_MEDIA: 150,     // Thưởng +150 điểm khi đính kèm ảnh/video UGC thật
  },
  MAX_IMAGES: 5,
  STATUSES: {
    PENDING: {
      label: "Chờ kiểm duyệt",
      badgeColor: "bg-amber-50 text-amber-800 border-amber-200",
    },
    APPROVED: {
      label: "Đã phê duyệt",
      badgeColor: "bg-emerald-50 text-emerald-800 border-emerald-200",
    },
    REJECTED: {
      label: "Từ chối",
      badgeColor: "bg-rose-50 text-rose-800 border-rose-200",
    },
    FEATURED: {
      label: "Ghim nổi bật (Top UGC)",
      badgeColor: "bg-purple-50 text-purple-800 border-purple-200",
    },
  },
} as const;

export const createReviewSchema = z.object({
  productId: z.string().min(1, "Mã sản phẩm không được trống"),
  orderId: z.string().optional().nullable(),
  rating: z.number().int().min(1, "Điểm đánh giá tối thiểu là 1 sao").max(5, "Điểm đánh giá tối đa là 5 sao"),
  packagingRating: z.number().int().min(1).max(5).optional().nullable(),
  freshnessRating: z.number().int().min(1).max(5).optional().nullable(),
  effectivenessRating: z.number().int().min(1).max(5).optional().nullable(),
  content: z
    .string()
    .min(10, "Nội dung nhận xét tối thiểu 10 ký tự để chia sẻ trải nghiệm hữu ích")
    .max(2000, "Nội dung nhận xét tối đa 2000 ký tự"),
  images: z
    .array(z.string().url("Đường dẫn ảnh không hợp lệ"))
    .max(REVIEW_CONFIG.MAX_IMAGES, `Chỉ được đính kèm tối đa ${REVIEW_CONFIG.MAX_IMAGES} ảnh`)
    .default([]),
});

export type CreateReviewInput = z.infer<typeof createReviewSchema>;

export const adminUpdateReviewSchema = z.object({
  status: z.enum(["PENDING", "APPROVED", "REJECTED", "FEATURED"]),
  adminReply: z.string().max(1000, "Phản hồi tối đa 1000 ký tự").optional().nullable(),
});

export type AdminUpdateReviewInput = z.infer<typeof adminUpdateReviewSchema>;

export const reviewStatusUpdateSchema = z.object({
  status: z.enum(["PENDING", "APPROVED", "REJECTED", "FEATURED"]),
});

export type ReviewStatusUpdateInput = z.infer<typeof reviewStatusUpdateSchema>;

export const askQuestionSchema = z.object({
  productId: z.string().min(1, "Mã sản phẩm không được trống"),
  question: z
    .string()
    .min(10, "Câu hỏi tối thiểu 10 ký tự để dược sĩ tư vấn chính xác nhất")
    .max(1000, "Câu hỏi tối đa 1000 ký tự"),
});

export type AskQuestionInput = z.infer<typeof askQuestionSchema>;

export const answerQuestionSchema = z.object({
  questionId: z.string().min(1, "Mã câu hỏi không được trống"),
  answer: z
    .string()
    .min(5, "Câu trả lời tối thiểu 5 ký tự")
    .max(1500, "Câu trả lời tối đa 1500 ký tự"),
  isOfficial: z.boolean().default(false),
});

export type AnswerQuestionInput = z.infer<typeof answerQuestionSchema>;

export const reviewQueryFilterSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(50).default(10),
  status: z.enum(["ALL", "PENDING", "APPROVED", "REJECTED", "FEATURED"]).default("ALL"),
  rating: z.coerce.number().int().min(1).max(5).optional(),
  hasImages: z.enum(["true", "false"]).optional(),
  verifiedOnly: z.enum(["true", "false"]).optional(),
  search: z.string().optional(),
  sort: z.enum(["latest", "helpful", "highest", "lowest"]).default("latest"),
});

export type ReviewQueryFilter = z.infer<typeof reviewQueryFilterSchema>;
