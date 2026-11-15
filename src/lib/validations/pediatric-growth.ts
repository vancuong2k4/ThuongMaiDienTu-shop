import { z } from "zod";
import { FormulaStage, ChildGender } from "@prisma/client";

// ============================================================
// lib/validations/pediatric-growth.ts
// Zod Validation Schemas cho Phân Hệ Tăng Trưởng & Pha Sữa Úc (Phase 23)
// ============================================================

export const growthAssessmentInputSchema = z.object({
  childName: z
    .string()
    .min(1, "Vui lòng nhập tên bé")
    .max(100, "Tên bé tối đa 100 ký tự"),
  gender: z.nativeEnum(ChildGender, {
    message: "Giới tính phải là Bé trai (BOY) hoặc Bé gái (GIRL)",
  }),
  birthDate: z
    .string()
    .refine((val) => !isNaN(Date.parse(val)), "Ngày sinh không hợp lệ"),
  weightKg: z
    .number()
    .min(1.5, "Cân nặng tối thiểu 1.5 kg")
    .max(50.0, "Cân nặng tối đa 50 kg"),
  heightCm: z
    .number()
    .min(35.0, "Chiều cao tối thiểu 35 cm")
    .max(150.0, "Chiều cao tối đa 150 cm"),
  memberProfileId: z.string().optional().nullable(),
});

export type GrowthAssessmentInput = z.infer<typeof growthAssessmentInputSchema>;

export const aptamilFormulaCalculatorInputSchema = z.object({
  stage: z.nativeEnum(FormulaStage, {
    message: "Giai đoạn sữa không hợp lệ (STAGE_1 đến STAGE_4)",
  }),
  babyWeightKg: z.number().min(2.0).max(35.0).optional(),
  babyAgeMonths: z.number().min(0).max(72).optional(),
  targetWaterVolumeMl: z.number().min(50).max(500).optional(),
});

export type AptamilFormulaCalculatorInput = z.infer<
  typeof aptamilFormulaCalculatorInputSchema
>;

export const aptamilProtocolAdminSchema = z.object({
  stage: z.nativeEnum(FormulaStage),
  productTitle: z.string().min(3),
  ageRangeMonths: z.string().min(2),
  waterTemperatureMinC: z.number().min(35).max(50).default(40),
  waterTemperatureMaxC: z.number().min(40).max(55).default(45),
  waterMlPerScoop: z.number().min(25).max(70).default(50.0),
  scoopWeightGrams: z.number().min(4.0).max(12.0).default(7.3),
  standardFeedsPerDay: z.number().min(1).max(10).default(4),
  waterVolumeMlPerFeed: z.number().min(50).max(350).default(200),
  scoopsPerFeed: z.number().min(1).max(8).default(4),
  mixingSteps: z.array(z.string()).min(3),
  probioticWarning: z.string().min(5),
  storageGuidelines: z.string().min(5),
  productId: z.string().optional().nullable(),
});

export type AptamilProtocolAdminInput = z.infer<typeof aptamilProtocolAdminSchema>;
