// ============================================================
// app/(admin)/admin/kho-hang/chuyen-bay-air/page.tsx
// Trang Quản Trị Chuyến Bay Air Cargo & Chuỗi Cung Ứng Lạnh Cold-Chain (Phase 20)
// ============================================================

import React from "react";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { calculateFlightKPIs } from "@/lib/flight-tracker";
import { FlightAdminManager } from "@/components/admin/flights/FlightAdminManager";
import type { AdminFlightItem } from "@/components/admin/flights/types";

export const metadata: Metadata = {
  title: "Quản Trị Chuyến Bay Air Cargo & Chuỗi Lạnh | Admin CMS THUYNGA Shop",
  description:
    "Giám sát hành trình bay Air Cargo Úc — Việt Nam, tọa độ radar GPS và dữ liệu cảm biến nhiệt độ kiểm soát khoang hàng.",
};

export const revalidate = 0; // Luôn lấy số liệu mới nhất khi quản trị viên truy cập

export default async function AdminAirCargoFlightsPage() {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") {
    redirect("/dang-nhap?callbackUrl=/admin/kho-hang/chuyen-bay-air");
  }

  const [flights, kpis] = await Promise.all([
    prisma.airCargoFlight.findMany({
      orderBy: [{ scheduledArrival: "desc" }],
      include: {
        _count: {
          select: { milestones: true, sensorLogs: true },
        },
        sensorLogs: {
          orderBy: { recordedAt: "desc" },
          take: 1,
        },
      },
    }),
    calculateFlightKPIs(),
  ]);

  const serializedFlights: AdminFlightItem[] = flights.map((f) => ({
    id: f.id,
    flightNumber: f.flightNumber,
    carrier: f.carrier as "VIETNAM_AIRLINES" | "QANTAS_FREIGHT",
    aircraftType: f.aircraftType,
    originAirport: f.originAirport,
    originCity: f.originCity,
    destAirport: f.destAirport,
    destCity: f.destCity,
    scheduledDeparture: f.scheduledDeparture.toISOString(),
    actualDeparture: f.actualDeparture ? f.actualDeparture.toISOString() : null,
    scheduledArrival: f.scheduledArrival.toISOString(),
    actualArrival: f.actualArrival ? f.actualArrival.toISOString() : null,
    flightDurationMinutes: f.flightDurationMinutes,
    flightStatus: f.flightStatus as any,
    flightProgressPercent: f.flightProgressPercent,
    currentLatitude: f.currentLatitude,
    currentLongitude: f.currentLongitude,
    currentAltitudeFeet: f.currentAltitudeFeet,
    coldChainCategory: f.coldChainCategory as any,
    targetTempMin: f.targetTempMin,
    targetTempMax: f.targetTempMax,
    averageTemp: f.averageTemp,
    totalCargoWeightKg: f.totalCargoWeightKg,
    cargoManifestSummary: f.cargoManifestSummary,
    _count: f._count,
    sensorLogs: f.sensorLogs.map((log) => ({
      id: log.id,
      sensorId: log.sensorId,
      recordedAt: log.recordedAt.toISOString(),
      temperatureCelsius: log.temperatureCelsius,
      humidityPercent: log.humidityPercent,
      batteryPercent: log.batteryPercent,
      alertLevel: log.alertLevel as any,
      stageName: log.stageName,
    })),
  }));

  return (
    <div className="space-y-6">
      <FlightAdminManager
        initialFlights={serializedFlights}
        initialKpis={kpis}
      />
    </div>
  );
}
