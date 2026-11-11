// ============================================================
// lib/validations/batch.ts
// Zod schemas & Cấu hình Minh Bạch Lô Hàng Bay Air & Hạn Sử Dụng (Phase 15)
// ============================================================

import { z } from "zod";

export const AIRLINE_CARRIERS_CONFIG = {
  VIETNAM_AIRLINES_CARGO: {
    code: "VN",
    name: "Vietnam Airlines Cargo",
    country: "Việt Nam",
    flightPrefix: "VN",
    badgeColor: "bg-sky-50 text-sky-800 border-sky-200",
  },
  QANTAS_FREIGHT: {
    code: "QF",
    name: "Qantas Freight",
    country: "Australia",
    flightPrefix: "QF",
    badgeColor: "bg-red-50 text-red-800 border-red-200",
  },
  EMIRATES_SKYCARGO: {
    code: "EK",
    name: "Emirates SkyCargo",
    country: "UAE",
    flightPrefix: "EK",
    badgeColor: "bg-amber-50 text-amber-800 border-amber-200",
  },
  SINGAPORE_AIRLINES_CARGO: {
    code: "SQ",
    name: "Singapore Airlines Cargo",
    country: "Singapore",
    flightPrefix: "SQ",
    badgeColor: "bg-indigo-50 text-indigo-800 border-indigo-200",
  },
} as const;

export const SHIPMENT_STATUS_CONFIG = {
  DEPARTED: {
    label: "Đã cất cánh từ Úc",
    badgeColor: "bg-amber-50 text-amber-800 border-amber-200",
    description: "Hàng đã hoàn tất kiểm định tại Sydney/Melbourne và rời cảng",
  },
  IN_TRANSIT: {
    label: "Đang trên khoang lạnh hàng không",
    badgeColor: "bg-blue-50 text-blue-800 border-blue-200",
    description: "Khoang mát kiểm soát nhiệt độ nghiêm ngặt suốt chặng bay",
  },
  CUSTOMS_CLEARED: {
    label: "Đã thông quan Nội Bài",
    badgeColor: "bg-purple-50 text-purple-800 border-purple-200",
    description: "Đã hoàn thành thủ tục hải quan và kiểm dịch y tế động thực vật",
  },
  IN_WAREHOUSE: {
    label: "Đã nhập kho mát THUYNGA Shop",
    badgeColor: "bg-emerald-50 text-emerald-800 border-emerald-200",
    description: "Sẵn sàng phân phối đến tay khách hàng với date mới nhất",
  },
} as const;

export const createShipmentSchema = z.object({
  airWaybillNumber: z
    .string()
    .min(5, "Số vận đơn AWB tối thiểu 5 ký tự (VD: 738-48291048)"),
  carrier: z
    .enum([
      "VIETNAM_AIRLINES_CARGO",
      "QANTAS_FREIGHT",
      "EMIRATES_SKYCARGO",
      "SINGAPORE_AIRLINES_CARGO",
    ])
    .default("VIETNAM_AIRLINES_CARGO"),
  flightNumber: z.string().min(3, "Số hiệu chuyến bay không được trống (VD: VN782)"),
  originAirport: z.string().default("SYD"),
  destinationAirport: z.string().default("HAN"),
  departureDate: z.string().or(z.date()),
  arrivalDate: z.string().or(z.date()),
  status: z
    .enum(["DEPARTED", "IN_TRANSIT", "CUSTOMS_CLEARED", "IN_WAREHOUSE"])
    .default("IN_WAREHOUSE"),
  storageTempMin: z.number().default(18.0),
  storageTempMax: z.number().default(24.0),
  receiptImages: z.array(z.string().url()).default([]),
  customsDocImages: z.array(z.string().url()).default([]),
  notes: z.string().optional().nullable(),
});

export type CreateShipmentInput = z.infer<typeof createShipmentSchema>;
export const updateShipmentSchema = createShipmentSchema.partial();
export type UpdateShipmentInput = z.infer<typeof updateShipmentSchema>;

export const createBatchSchema = z.object({
  batchCode: z
    .string()
    .min(3, "Mã lô tối thiểu 3 ký tự (VD: APT-2026-SYD01)"),
  productId: z.string().min(1, "Mã sản phẩm không được trống"),
  variantId: z.string().optional().nullable(),
  shipmentId: z.string().min(1, "Mã lô hàng bay air không được trống"),
  manufactureDate: z.string().or(z.date()),
  expiryDate: z.string().or(z.date()),
  importedQuantity: z.number().int().positive("Số lượng nhập phải lớn hơn 0"),
  remainingStock: z.number().int().min(0).optional(),
  australianBarcode: z.string().optional().nullable(),
  chemistSource: z.string().optional().nullable(),
  certificateUrl: z.string().optional().nullable(),
  isActive: z.boolean().default(true),
});

export type CreateBatchInput = z.infer<typeof createBatchSchema>;
export const updateBatchSchema = createBatchSchema.partial();
export type UpdateBatchInput = z.infer<typeof updateBatchSchema>;

export const verifyBatchQuerySchema = z.object({
  batchCode: z.string().min(2, "Mã lô tra cứu tối thiểu 2 ký tự"),
});

export type VerifyBatchQuery = z.infer<typeof verifyBatchQuerySchema>;
