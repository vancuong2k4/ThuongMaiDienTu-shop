// ============================================================
// lib/flight-tracker.ts
// Flight Tracker Engine, GPS Trajectory Interpolation & Cold-Chain Analytics (Phase 20)
// ============================================================

import { prisma } from "@/lib/prisma";
import {
  AirCargoFlight,
  ColdChainSensorLog,
  FlightStatus,
  SensorAlertLevel,
} from "@prisma/client";

export interface AirportCoordinates {
  code: string;
  name: string;
  lat: number;
  lng: number;
}

export const AIRPORT_COORDINATES: Record<string, AirportCoordinates> = {
  MEL: {
    code: "MEL",
    name: "Melbourne Tullamarine Airport",
    lat: -37.669,
    lng: 144.841,
  },
  SYD: {
    code: "SYD",
    name: "Sydney Kingsford Smith Airport",
    lat: -33.9399,
    lng: 151.1753,
  },
  HBA: {
    code: "HBA",
    name: "Hobart International Airport (Tasmania)",
    lat: -42.8361,
    lng: 147.5097,
  },
  HAN: {
    code: "HAN",
    name: "Sân bay Quốc tế Nội Bài (Hà Nội)",
    lat: 21.2212,
    lng: 105.8072,
  },
  SGN: {
    code: "SGN",
    name: "Sân bay Quốc tế Tân Sơn Nhất (TP.HCM)",
    lat: 10.8188,
    lng: 106.652,
  },
};

export interface ColdChainAnalysis {
  minTemp: number;
  maxTemp: number;
  avgTemp: number;
  totalReadings: number;
  compliantReadings: number;
  complianceRatePercent: number;
  qualityScore: number;
  status: "OPTIMAL" | "ACCEPTABLE" | "BREACHED";
  statusText: string;
}

/**
 * Tính toán tọa độ và tiến độ bay trực tiếp (ước lượng GPS và thời gian bay còn lại)
 */
export function calculateFlightLiveProgress(flight: AirCargoFlight) {
  const origin = AIRPORT_COORDINATES[flight.originAirport] || {
    lat: -37.8136,
    lng: 144.9631,
  };
  const dest = AIRPORT_COORDINATES[flight.destAirport] || {
    lat: 21.0285,
    lng: 105.8542,
  };

  const now = new Date().getTime();
  const depTime = new Date(flight.actualDeparture || flight.scheduledDeparture).getTime();
  const arrTime = new Date(flight.scheduledArrival).getTime();

  let progress = flight.flightProgressPercent;
  let currentLat = flight.currentLatitude || origin.lat;
  let currentLng = flight.currentLongitude || origin.lng;
  let remainingMinutes = 0;

  if (flight.flightStatus === FlightStatus.CRUISING) {
    const totalDuration = Math.max(1, arrTime - depTime);
    const elapsed = Math.max(0, now - depTime);
    const calculatedProgress = Math.min(
      95,
      Math.max(5, Math.round((elapsed / totalDuration) * 100))
    );

    progress = calculatedProgress;
    const ratio = progress / 100;

    // Linear interpolation
    currentLat = origin.lat + (dest.lat - origin.lat) * ratio;
    currentLng = origin.lng + (dest.lng - origin.lng) * ratio;

    remainingMinutes = Math.max(
      0,
      Math.round((arrTime - now) / (60 * 1000))
    );
  } else if (
    flight.flightStatus === FlightStatus.LANDED ||
    flight.flightStatus === FlightStatus.CUSTOMS_CLEARING ||
    flight.flightStatus === FlightStatus.STORED_COLD
  ) {
    progress = 100;
    currentLat = dest.lat;
    currentLng = dest.lng;
    remainingMinutes = 0;
  } else if (flight.flightStatus === FlightStatus.DEPARTED) {
    progress = Math.max(progress, 15);
    currentLat = origin.lat + (dest.lat - origin.lat) * 0.15;
    currentLng = origin.lng + (dest.lng - origin.lng) * 0.15;
    remainingMinutes = flight.flightDurationMinutes;
  }

  const hours = Math.floor(remainingMinutes / 60);
  const mins = remainingMinutes % 60;
  const remainingTimeFormatted =
    remainingMinutes > 0 ? `${hours}h ${mins}p` : "Đã tiếp đất";

  return {
    progress,
    currentLatitude: Number(currentLat.toFixed(4)),
    currentLongitude: Number(currentLng.toFixed(4)),
    remainingMinutes,
    remainingTimeFormatted,
  };
}

/**
 * Phân tích chất lượng cảm biến chuỗi lạnh (Cold-Chain Analytics)
 */
export function evaluateColdChainAnalytics(
  logs: ColdChainSensorLog[],
  targetMin: number,
  targetMax: number
): ColdChainAnalysis {
  if (!logs || logs.length === 0) {
    return {
      minTemp: targetMin,
      maxTemp: targetMax,
      avgTemp: (targetMin + targetMax) / 2,
      totalReadings: 0,
      compliantReadings: 0,
      complianceRatePercent: 100,
      qualityScore: 100,
      status: "OPTIMAL",
      statusText: "Chưa có bản ghi cảm biến.",
    };
  }

  let min = logs[0].temperatureCelsius;
  let max = logs[0].temperatureCelsius;
  let sum = 0;
  let compliant = 0;

  logs.forEach((l) => {
    const t = l.temperatureCelsius;
    if (t < min) min = t;
    if (t > max) max = t;
    sum += t;
    if (t >= targetMin && t <= targetMax) {
      compliant++;
    }
  });

  const total = logs.length;
  const avg = Number((sum / total).toFixed(2));
  const complianceRate = Number(((compliant / total) * 100).toFixed(1));

  let status: ColdChainAnalysis["status"] = "OPTIMAL";
  let statusText = "Chuỗi lạnh Cold-Chain đạt chuẩn tuyệt đối 100%.";

  if (complianceRate >= 95) {
    status = "OPTIMAL";
    statusText = "Chuỗi lạnh giữ nhiệt hoàn hảo, vi sinh và độ tươi giòn được bảo toàn nguyên vẹn.";
  } else if (complianceRate >= 85) {
    status = "ACCEPTABLE";
    statusText = "Có dao động nhẹ trong ngưỡng cho phép khi bốc xếp hàng, chất lượng an toàn.";
  } else {
    status = "BREACHED";
    statusText = "Cảnh báo: Có thời điểm nhiệt độ vượt ngưỡng mục tiêu. Cần kiểm tra cảm quan thực tế.";
  }

  return {
    minTemp: min,
    maxTemp: max,
    avgTemp: avg,
    totalReadings: total,
    compliantReadings: compliant,
    complianceRatePercent: complianceRate,
    qualityScore: complianceRate,
    status,
    statusText,
  };
}

/**
 * Thống kê các chỉ số KPIs Chuyến bay Air Cargo & Chuỗi lạnh
 */
export async function calculateFlightKPIs() {
  const [
    totalFlights,
    activeCruisingFlights,
    storedColdFlights,
    flightsWithWeight,
    allSensorLogs,
  ] = await Promise.all([
    prisma.airCargoFlight.count(),
    prisma.airCargoFlight.count({
      where: {
        flightStatus: { in: [FlightStatus.DEPARTED, FlightStatus.CRUISING] },
      },
    }),
    prisma.airCargoFlight.count({
      where: { flightStatus: FlightStatus.STORED_COLD },
    }),
    prisma.airCargoFlight.findMany({
      select: { totalCargoWeightKg: true },
    }),
    prisma.coldChainSensorLog.findMany({
      select: { alertLevel: true },
    }),
  ]);

  const totalWeightKg = flightsWithWeight.reduce(
    (sum, f) => sum + (f.totalCargoWeightKg || 0),
    0
  );
  const totalWeightTons = Number((totalWeightKg / 1000).toFixed(1));

  const normalLogs = allSensorLogs.filter(
    (l) => l.alertLevel === SensorAlertLevel.NORMAL
  ).length;
  const coldChainPassRate =
    allSensorLogs.length > 0
      ? Number(((normalLogs / allSensorLogs.length) * 100).toFixed(1))
      : 100;

  return {
    totalFlights,
    activeCruisingFlights,
    storedColdFlights,
    totalWeightTons,
    coldChainPassRate,
    totalSensorLogsCount: allSensorLogs.length,
  };
}
