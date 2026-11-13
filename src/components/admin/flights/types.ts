// ============================================================
// components/admin/flights/types.ts
// Các Kiểu Dữ Liệu Quản Trị Chuyến Bay Air Cargo & Chuỗi Lạnh
// ============================================================

export type FlightStatusType =
  | "SCHEDULED"
  | "DEPARTED"
  | "CRUISING"
  | "LANDED"
  | "CUSTOMS_CLEARING"
  | "STORED_COLD";

export type ColdChainCategoryType =
  | "ULTRA_COLD_CHERRY"
  | "COOL_PROBIOTICS"
  | "CONTROLLED_AMBIENT";

export type SensorAlertLevelType = "NORMAL" | "WARNING" | "CRITICAL";

export interface AdminSensorLogItem {
  id: string;
  sensorId: string;
  recordedAt: string | Date;
  temperatureCelsius: number;
  humidityPercent?: number | null;
  batteryPercent?: number | null;
  alertLevel: SensorAlertLevelType;
  stageName: string;
}

export interface AdminFlightMilestoneItem {
  id: string;
  stepNumber: number;
  title: string;
  locationName: string;
  timestamp: string | Date;
  isCompleted: boolean;
}

export interface AdminFlightItem {
  id: string;
  flightNumber: string;
  carrier: "VIETNAM_AIRLINES" | "QANTAS_FREIGHT";
  aircraftType: string;
  originAirport: string;
  originCity: string;
  destAirport: string;
  destCity: string;
  scheduledDeparture: string | Date;
  actualDeparture?: string | Date | null;
  scheduledArrival: string | Date;
  actualArrival?: string | Date | null;
  flightDurationMinutes: number;
  flightStatus: FlightStatusType;
  flightProgressPercent?: number | null;
  currentLatitude?: number | null;
  currentLongitude?: number | null;
  currentAltitudeFeet?: number | null;
  coldChainCategory: ColdChainCategoryType;
  targetTempMin: number;
  targetTempMax: number;
  averageTemp?: number | null;
  totalCargoWeightKg?: number | null;
  cargoManifestSummary?: string | null;
  _count?: {
    milestones: number;
    sensorLogs: number;
  };
  sensorLogs?: AdminSensorLogItem[];
}

export interface AdminFlightKPIs {
  totalFlights: number;
  activeCruisingFlights: number;
  storedColdFlights: number;
  totalWeightTons: number;
  coldChainPassRate: number;
  totalSensorLogsCount?: number;
}
