import { z } from "zod";

// ============================================================
// lib/validations/preorder.ts
// Zod Schema & Quy Tắc Kiểm Tra Hệ Thống Đặt Trước Mùa Vụ Úc (Phase 21)
// ============================================================

export const CampaignStatusEnum = z.enum([
  "UPCOMING",
  "OPEN_FOR_RESERVATION",
  "HARVESTING",
  "AIR_SHIPPING",
  "DELIVERED",
  "CLOSED",
]);

export const DepositTypeEnum = z.enum([
  "PERCENTAGE_30",
  "PERCENTAGE_50",
  "FULL_PAYMENT",
]);

export const HarvestQualityGradeEnum = z.enum([
  "PREMIUM_EXPORT",
  "ROYAL_RESERVE",
  "DIAMOND_SELECT",
]);

export const ReservationStatusEnum = z.enum([
  "CONFIRMED_DEPOSIT",
  "PAID_FULL",
  "ALLOCATED_FLIGHT",
  "SHIPPED",
  "COMPLETED",
  "CANCELLED",
]);

export const createSeasonalCampaignSchema = z.object({
  title: z.string().min(5, "Tiêu đề chiến dịch phải có ít nhất 5 ký tự"),
  slug: z
    .string()
    .min(3, "Slug chiến dịch không được để trống")
    .regex(/^[a-z0-9-]+$/, "Slug chỉ bao gồm chữ thường, số và dấu gạch ngang"),
  subtitle: z.string().min(10, "Mô tả ngắn tối thiểu 10 ký tự"),
  description: z.string().min(20, "Mô tả chi tiết tối thiểu 20 ký tự"),
  farmName: z.string().min(3, "Tên nông trại/vườn cây không được để trống"),
  farmRegion: z.string().min(3, "Vùng địa lý Úc không được để trống"),
  originCountry: z.string().default("Australia"),
  productCategory: z.string().default("CHERRY"),
  bannerImage: z.string().url("Banner ảnh phải là đường dẫn URL hợp lệ"),
  galleryImages: z.array(z.string().url()).optional(),
  harvestStartDate: z.string().or(z.date()),
  harvestEndDate: z.string().or(z.date()),
  flightDepartureWeek: z.string().min(3, "Tuần bay dự kiến không được để trống"),
  targetBrixSweetness: z.string().min(2, "Độ ngọt Brix mục tiêu"),
  fruitSizeMm: z.string().min(2, "Kích thước quả mục tiêu"),
  qualityGrade: HarvestQualityGradeEnum.default("ROYAL_RESERVE"),
  totalCapacityKg: z.number().positive("Tổng sản lượng phải lớn hơn 0"),
  status: CampaignStatusEnum.default("OPEN_FOR_RESERVATION"),
  depositType: DepositTypeEnum.default("PERCENTAGE_30"),
  depositPercent: z.number().min(10).max(100).default(30),
  sortOrder: z.number().default(0),
});

export const createPreOrderTierSchema = z.object({
  campaignId: z.string().cuid("Mã chiến dịch không hợp lệ"),
  name: z.string().min(3, "Tên quy cách hộp/thùng tối thiểu 3 ký tự"),
  specification: z.string().min(5, "Mô tả quy cách đóng gói"),
  price: z.number().positive("Giá bán phải lớn hơn 0"),
  depositAmount: z.number().positive("Số tiền đặt cọc phải lớn hơn 0"),
  totalSlots: z.number().int().positive("Tổng số lượng slot phải lớn hơn 0"),
  isAvailable: z.boolean().default(true),
  sortOrder: z.number().default(0),
});

export const createHarvestUpdateSchema = z.object({
  campaignId: z.string().cuid("Mã chiến dịch không hợp lệ"),
  title: z.string().min(5, "Tiêu đề nhật ký nông trại tối thiểu 5 ký tự"),
  content: z.string().min(10, "Nội dung cập nhật tối thiểu 10 ký tự"),
  brixRecorded: z.number().min(10).max(35).optional(),
  sizeRecordedMm: z.number().min(20).max(45).optional(),
  weatherCondition: z.string().optional(),
  photos: z.array(z.string().url()).optional(),
  reportedAt: z.string().or(z.date()).optional(),
});

export const createReservationSchema = z.object({
  campaignId: z.string().cuid("Mã chiến dịch không hợp lệ"),
  tierId: z.string().cuid("Mã quy cách hộp/thùng không hợp lệ"),
  customerName: z.string().min(2, "Họ tên người nhận hàng tối thiểu 2 ký tự"),
  customerPhone: z
    .string()
    .min(9, "Số điện thoại không hợp lệ")
    .max(15, "Số điện thoại không hợp lệ"),
  customerEmail: z.string().email("Email không hợp lệ").optional().or(z.literal("")),
  deliveryAddress: z.string().min(5, "Địa chỉ nhận hàng tối thiểu 5 ký tự"),
  quantity: z.number().int().min(1, "Số lượng tối thiểu là 1").default(1),
  depositMethod: z.string().default("VIETQR_NAPAS"),
  notes: z.string().max(500, "Ghi chú không quá 500 ký tự").optional(),
});

export const updateReservationStatusSchema = z.object({
  status: ReservationStatusEnum,
  flightNumber: z.string().optional(),
  airWaybillNumber: z.string().optional(),
  notes: z.string().optional(),
});

export type CreateSeasonalCampaignInput = z.infer<
  typeof createSeasonalCampaignSchema
>;
export type CreatePreOrderTierInput = z.infer<typeof createPreOrderTierSchema>;
export type CreateHarvestUpdateInput = z.infer<typeof createHarvestUpdateSchema>;
export type CreateReservationInput = z.infer<typeof createReservationSchema>;
export type UpdateReservationStatusInput = z.infer<
  typeof updateReservationStatusSchema
>;
