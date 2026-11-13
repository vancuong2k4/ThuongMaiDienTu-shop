// ============================================================
// lib/validations/air-cargo.ts
// Zod Schemas & Configs Giám Sát Chuyến Bay Air Cargo & Chuỗi Lạnh (Phase 20)
// ============================================================

import { z } from "zod";
import {
  FlightStatus,
  ColdChainCategory,
  SensorAlertLevel,
  AirlineCarrier,
} from "@prisma/client";

export const FLIGHT_STATUS_CONFIG: Record<
  FlightStatus,
  {
    label: string;
    step: number;
    bgClass: string;
    textClass: string;
    borderClass: string;
    description: string;
  }
> = {
  [FlightStatus.SCHEDULED]: {
    label: "Đã lên lịch bay",
    step: 1,
    bgClass: "bg-slate-100",
    textClass: "text-slate-700",
    borderClass: "border-slate-200",
    description: "Chuyến bay đã xếp chỗ hàng không và sẵn sàng tiếp nhận pallet tại Melbourne/Sydney.",
  },
  [FlightStatus.DEPARTED]: {
    label: "Đã cất cánh từ Úc",
    step: 2,
    bgClass: "bg-blue-50",
    textClass: "text-blue-700",
    borderClass: "border-blue-200",
    description: "Máy bay đã rời đường băng, bắt đầu hành trình bay thẳng 9 tiếng về Việt Nam.",
  },
  [FlightStatus.CRUISING]: {
    label: "Đang bay trên không phận",
    step: 3,
    bgClass: "bg-sky-50",
    textClass: "text-sky-700",
    borderClass: "border-sky-200",
    description: "Khoang hàng kích hoạt chế độ kiểm soát nhiệt độ chuỗi lạnh Cold-Chain liên tục.",
  },
  [FlightStatus.LANDED]: {
    label: "Đã hạ cánh an toàn",
    step: 4,
    bgClass: "bg-emerald-50",
    textClass: "text-emerald-700",
    borderClass: "border-emerald-200",
    description: "Hạ cánh tại Sân bay Quốc tế Nội Bài / Tân Sơn Nhất, chuyển xe kéo vào kho hàng không.",
  },
  [FlightStatus.CUSTOMS_CLEARING]: {
    label: "Đang thông quan & kiểm dịch",
    step: 5,
    bgClass: "bg-amber-50",
    textClass: "text-amber-800",
    borderClass: "border-amber-200",
    description: "Chi cục Hải quan & Cục Bảo vệ Thực vật tiến hành lấy mẫu kiểm nghiệm chất lượng.",
  },
  [FlightStatus.STORED_COLD]: {
    label: "Đã nhập kho lạnh THUYNGA",
    step: 6,
    bgClass: "bg-emerald-100",
    textClass: "text-emerald-900",
    borderClass: "border-emerald-300",
    description: "Nhập kho lạnh tiêu chuẩn 0-4°C sẵn sàng giao hỏa tốc 2h cho khách hàng.",
  },
};

export const COLD_CHAIN_CATEGORY_CONFIG: Record<
  ColdChainCategory,
  {
    label: string;
    targetRange: string;
    minTemp: number;
    maxTemp: number;
    badgeColor: string;
    targetItems: string;
  }
> = {
  [ColdChainCategory.ULTRA_COLD_CHERRY]: {
    label: "Chuỗi Lạnh Sâu 0°C - 4°C",
    targetRange: "0.0°C - 4.0°C",
    minTemp: 0.0,
    maxTemp: 4.0,
    badgeColor: "bg-sky-100 text-sky-800 border-sky-300",
    targetItems: "Cherry Tasmania Úc, Nho mẫu đơn, Dâu tây bay Air",
  },
  [ColdChainCategory.COOL_PROBIOTICS]: {
    label: "Chuỗi Mát 2°C - 8°C",
    targetRange: "2.0°C - 8.0°C",
    minTemp: 2.0,
    maxTemp: 8.0,
    badgeColor: "bg-teal-100 text-teal-800 border-teal-300",
    targetItems: "Men vi sinh sống, Tinh dầu thông đỏ, Kháng thể sinh học",
  },
  [ColdChainCategory.CONTROLLED_AMBIENT]: {
    label: "Nhiệt Độ Phòng 18°C - 24°C",
    targetRange: "18.0°C - 24.0°C",
    minTemp: 18.0,
    maxTemp: 24.0,
    badgeColor: "bg-amber-100 text-amber-900 border-amber-300",
    targetItems: "Sữa bột Aptamil Profutura, Mật ong Manuka, TPCN Chemist",
  },
};

export const AIRLINE_CARRIER_CONFIG: Record<
  AirlineCarrier,
  {
    name: string;
    iataCode: string;
    flag: string;
    brandColor: string;
  }
> = {
  [AirlineCarrier.VIETNAM_AIRLINES_CARGO]: {
    name: "Vietnam Airlines Cargo",
    iataCode: "VN",
    flag: "🇻🇳",
    brandColor: "#00658f",
  },
  [AirlineCarrier.QANTAS_FREIGHT]: {
    name: "Qantas Freight",
    iataCode: "QF",
    flag: "🇦🇺",
    brandColor: "#e00000",
  },
  [AirlineCarrier.EMIRATES_SKYCARGO]: {
    name: "Emirates SkyCargo",
    iataCode: "EK",
    flag: "🇦🇪",
    brandColor: "#d71920",
  },
  [AirlineCarrier.SINGAPORE_AIRLINES_CARGO]: {
    name: "Singapore Airlines Cargo",
    iataCode: "SQ",
    flag: "🇸🇬",
    brandColor: "#00266b",
  },
};

// ── Zod Schemas ─────────────────────────────────────────────

export const createFlightSchema = z.object({
  flightNumber: z
    .string()
    .min(3, "Số hiệu chuyến bay tối thiểu 3 ký tự")
    .max(10, "Số hiệu chuyến bay tối đa 10 ký tự")
    .toUpperCase(),
  aircraftType: z.string().min(2, "Loại máy bay tối thiểu 2 ký tự"),
  carrier: z.nativeEnum(AirlineCarrier).default(AirlineCarrier.VIETNAM_AIRLINES_CARGO),
  originAirport: z.string().min(3).max(4).toUpperCase(),
  originCity: z.string().min(2),
  destAirport: z.string().min(3).max(4).toUpperCase(),
  destCity: z.string().min(2),
  scheduledDeparture: z.string().or(z.date()),
  scheduledArrival: z.string().or(z.date()),
  flightDurationMinutes: z.number().int().positive().default(540),
  coldChainCategory: z
    .nativeEnum(ColdChainCategory)
    .default(ColdChainCategory.ULTRA_COLD_CHERRY),
  targetTempMin: z.number().default(0.0),
  targetTempMax: z.number().default(4.0),
  totalCargoWeightKg: z.number().positive().optional().nullable(),
  cargoManifestSummary: z.string().optional().nullable(),
});

export const updateFlightStatusSchema = z.object({
  flightStatus: z.nativeEnum(FlightStatus),
  flightProgressPercent: z.number().min(0).max(100).optional(),
  currentLatitude: z.number().optional().nullable(),
  currentLongitude: z.number().optional().nullable(),
  currentAltitudeFeet: z.number().int().optional().nullable(),
  actualDeparture: z.string().or(z.date()).optional().nullable(),
  actualArrival: z.string().or(z.date()).optional().nullable(),
});

export const createSensorLogSchema = z.object({
  flightId: z.string().min(1, "flightId là bắt buộc"),
  sensorId: z.string().min(1, "sensorId là bắt buộc"),
  recordedAt: z.string().or(z.date()),
  temperatureCelsius: z.number(),
  humidityPercent: z.number().min(0).max(100).optional().nullable(),
  batteryPercent: z.number().int().min(0).max(100).optional().nullable(),
  alertLevel: z.nativeEnum(SensorAlertLevel).default(SensorAlertLevel.NORMAL),
  stageName: z.string().min(2, "Tên công đoạn là bắt buộc"),
});
