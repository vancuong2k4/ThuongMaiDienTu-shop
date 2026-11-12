// ============================================================
// lib/validations/protocol.ts
// Zod schemas & Cấu hình Tư Vấn Dinh Dưỡng & Phác Đồ Cá Nhân Hóa (Phase 16)
// ============================================================

import { z } from "zod";

export const HEALTH_TARGET_GROUPS_CONFIG = {
  BABY_KIDS: {
    code: "BABY_KIDS",
    label: "Bé Sơ Sinh & Trẻ Nhỏ",
    ageRange: "0 - 12 tuổi",
    description: "Tiêu hóa kém, biếng ăn, tăng đề kháng, phát triển chiều cao & trí não",
    badgeColor: "bg-amber-50 text-amber-800 border-amber-200",
    icon: "Baby",
  },
  PREGNANT_MOM: {
    code: "PREGNANT_MOM",
    label: "Mẹ Chuẩn Bị & Đang Mang Thai",
    ageRange: "Thai kỳ 40 tuần",
    description: "Bổ sung Sắt, Canxi sinh học, DHA phát triển não thai nhi, giảm ốm nghén",
    badgeColor: "bg-rose-50 text-rose-800 border-rose-200",
    icon: "Heart",
  },
  POSTPARTUM_MOM: {
    code: "POSTPARTUM_MOM",
    label: "Mẹ Sau Sinh & Đang Cho Con Bú",
    ageRange: "Giai đoạn 0 - 24 tháng sau sinh",
    description: "Kích sữa dồi dào dinh dưỡng, phục hồi thể trạng, chống rụng tóc & loãng xương",
    badgeColor: "bg-purple-50 text-purple-800 border-purple-200",
    icon: "Shield",
  },
  ADULT_HEALTH: {
    code: "ADULT_HEALTH",
    label: "Người Trưởng Thành & Văn Phòng",
    ageRange: "18 - 50 tuổi",
    description: "Thanh lọc gan, giảm stress mất ngủ, tăng cường năng lượng & làm đẹp da",
    badgeColor: "bg-blue-50 text-blue-800 border-blue-200",
    icon: "Activity",
  },
  ELDERLY: {
    code: "ELDERLY",
    label: "Người Cao Tuổi & Bậc Cha Mẹ",
    ageRange: "Trên 50 tuổi",
    description: "Tái tạo sụn khớp, bổ não tăng trí nhớ, bảo vệ tim mạch & huyết áp ổn định",
    badgeColor: "bg-emerald-50 text-emerald-800 border-emerald-200",
    icon: "UserCheck",
  },
} as const;

export const CONSULTATION_STATUS_CONFIG = {
  PENDING: {
    label: "Chờ Dược sĩ liên hệ",
    badgeColor: "bg-amber-50 text-amber-800 border-amber-200",
    description: "Hệ thống đã tiếp nhận lịch hẹn, Dược sĩ sẽ gọi theo khung giờ đã chọn",
  },
  CONFIRMED: {
    label: "Đã xác nhận giờ gọi",
    badgeColor: "bg-blue-50 text-blue-800 border-blue-200",
    description: "Dược sĩ phụ trách đã xếp lịch và chuẩn bị hồ sơ vi chất tư vấn",
  },
  COMPLETED: {
    label: "Đã tư vấn hoàn tất",
    badgeColor: "bg-emerald-50 text-emerald-800 border-emerald-200",
    description: "Đã hoàn thành cuộc gọi hướng dẫn lộ trình uống sữa & vitamin",
  },
  CANCELLED: {
    label: "Đã hủy lịch",
    badgeColor: "bg-slate-100 text-slate-500 border-slate-200",
    description: "Khách hàng bận hoặc thay đổi thời gian tư vấn",
  },
} as const;

// Schema gửi câu trả lời bài trắc nghiệm
export const submitAssessmentSchema = z.object({
  targetGroup: z.enum([
    "BABY_KIDS",
    "PREGNANT_MOM",
    "POSTPARTUM_MOM",
    "ADULT_HEALTH",
    "ELDERLY",
  ]),
  customerName: z.string().min(2, "Họ tên người nhận phác đồ tối thiểu 2 ký tự"),
  customerPhone: z
    .string()
    .regex(/(84|0[3|5|7|8|9])+([0-9]{8})\b/, "Số điện thoại liên hệ không hợp lệ"),
  customerEmail: z.string().email("Email không hợp lệ").optional().nullable(),
  answers: z.record(z.string(), z.any()), // Map questionId -> selectedOptionId(s)
  notes: z.string().optional().nullable(),
  isSavedToProfile: z.boolean().default(false),
});

export type SubmitAssessmentInput = z.infer<typeof submitAssessmentSchema>;

// Schema đặt lịch tư vấn Dược sĩ 1-1
export const bookConsultationSchema = z.object({
  assessmentId: z.string().optional().nullable(),
  customerName: z.string().min(2, "Vui lòng nhập họ và tên của bạn"),
  phone: z
    .string()
    .regex(/(84|0[3|5|7|8|9])+([0-9]{8})\b/, "Số điện thoại di động không hợp lệ"),
  preferredDate: z.string().or(z.date()),
  preferredTimeSlot: z.string().min(1, "Vui lòng chọn khung giờ gọi thuận tiện"),
  healthConcerns: z
    .string()
    .min(5, "Vui lòng chia sẻ ngắn gọn về tình trạng sức khỏe cần Dược sĩ tư vấn"),
});

export type BookConsultationInput = z.infer<typeof bookConsultationSchema>;

// Schema Admin tạo phác đồ
export const createProtocolSchema = z.object({
  slug: z.string().min(3, "Slug phác đồ tối thiểu 3 ký tự (VD: phac-do-be-bieng-an)"),
  title: z.string().min(5, "Tiêu đề phác đồ tối thiểu 5 ký tự"),
  targetGroup: z.enum([
    "BABY_KIDS",
    "PREGNANT_MOM",
    "POSTPARTUM_MOM",
    "ADULT_HEALTH",
    "ELDERLY",
  ]),
  subtitle: z.string().optional().nullable(),
  description: z.string().min(10, "Mô tả chuyên môn phác đồ không được để trống"),
  keyNutrients: z.array(z.string()).min(1, "Ít nhất 1 dưỡng chất cốt lõi"),
  pharmacistAdvice: z.string().min(10, "Lời khuyên của Dược sĩ không được trống"),
  dosageSchedule: z.any(), // JSON timing
  comboDiscountPercent: z.number().int().min(0).max(50).default(10),
  isActive: z.boolean().default(true),
  items: z.array(
    z.object({
      productId: z.string().min(1, "Product ID không được trống"),
      variantId: z.string().optional().nullable(),
      usageInstructions: z.string().min(3, "Hướng dẫn liều dùng"),
      timing: z.string().default("Sáng"),
      quantity: z.number().int().positive().default(1),
      isEssential: z.boolean().default(true),
      sortOrder: z.number().int().default(0),
    })
  ).min(1, "Phác đồ phải có ít nhất 1 sản phẩm chỉ định"),
});

export type CreateProtocolInput = z.infer<typeof createProtocolSchema>;
export const updateProtocolSchema = createProtocolSchema.partial();
export type UpdateProtocolInput = z.infer<typeof updateProtocolSchema>;
