import { z } from "zod";

// ============================================================
// lib/validations/family-health.ts
// Zod Schema & Quy Tắc Kiểm Tra Tủ Thuốc Gia Đình & Lịch Uống (Phase 22)
// ============================================================

export const FamilyRelationEnum = z.enum([
  "SELF",
  "SPOUSE",
  "CHILD",
  "PARENT",
  "GRANDPARENT",
]);

export const SupplementTimeSlotEnum = z.enum([
  "MORNING_BEFORE_MEAL",
  "MORNING_AFTER_MEAL",
  "NOON_AFTER_MEAL",
  "EVENING_AFTER_MEAL",
  "BEFORE_BED",
]);

export const IntakeLogStatusEnum = z.enum([
  "SCHEDULED",
  "TAKEN",
  "SKIPPED",
]);

export const createFamilyMemberSchema = z.object({
  fullName: z.string().min(2, "Họ và tên thành viên tối thiểu 2 ký tự"),
  relation: FamilyRelationEnum.default("CHILD"),
  dateOfBirth: z.string().or(z.date()).optional().nullable(),
  gender: z.string().optional().nullable(),
  avatarEmoji: z.string().default("👶"),
  healthGoals: z.array(z.string()).default([]),
  allergies: z.array(z.string()).default([]),
  weightKg: z.number().positive().optional().nullable(),
  heightCm: z.number().positive().optional().nullable(),
  notes: z.string().max(500, "Ghi chú không quá 500 ký tự").optional().nullable(),
});

export const updateFamilyMemberSchema = createFamilyMemberSchema.partial();

export const createSupplementScheduleSchema = z.object({
  memberProfileId: z.string().cuid("Mã hồ sơ thành viên không hợp lệ"),
  productId: z.string().cuid().optional().nullable(),
  customItemName: z.string().min(2, "Tên sản phẩm/vi chất không được để trống"),
  brandName: z.string().optional().nullable(),
  timeSlot: SupplementTimeSlotEnum.default("MORNING_AFTER_MEAL"),
  timeString: z
    .string()
    .regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Giờ uống phải có định dạng HH:mm (VD: 08:00)")
    .default("08:00"),
  dosageText: z.string().min(2, "Liều lượng uống không được để trống (VD: 1 viên/lần)"),
  dailyFrequency: z.number().int().min(1).max(5).default(1),
  totalServingsPerBox: z.number().int().positive().default(60),
  servingsRemaining: z.number().int().min(0).default(60),
  startDate: z.string().or(z.date()).default(() => new Date()),
  estimatedEmptyDate: z.string().or(z.date()).optional().nullable(),
  reminderEnabled: z.boolean().default(true),
  notes: z.string().max(500).optional().nullable(),
});

export const updateSupplementScheduleSchema = createSupplementScheduleSchema.partial();

export const toggleIntakeLogSchema = z.object({
  scheduleId: z.string().cuid("Mã lịch uống không hợp lệ"),
  memberProfileId: z.string().cuid("Mã hồ sơ thành viên không hợp lệ"),
  logDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Định dạng ngày YYYY-MM-DD"),
  status: IntakeLogStatusEnum,
  notes: z.string().max(200).optional().nullable(),
});

export type CreateFamilyMemberInput = z.infer<typeof createFamilyMemberSchema>;
export type UpdateFamilyMemberInput = z.infer<typeof updateFamilyMemberSchema>;
export type CreateSupplementScheduleInput = z.infer<
  typeof createSupplementScheduleSchema
>;
export type UpdateSupplementScheduleInput = z.infer<
  typeof updateSupplementScheduleSchema
>;
export type ToggleIntakeLogInput = z.infer<typeof toggleIntakeLogSchema>;
