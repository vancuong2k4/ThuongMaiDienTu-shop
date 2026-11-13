import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { calculateFlightLiveProgress } from "@/lib/flight-tracker";
import { FlightStatus, AirlineCarrier } from "@prisma/client";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search")?.trim() || "";
    const carrier = searchParams.get("carrier") as AirlineCarrier | null;
    const status = searchParams.get("status") as FlightStatus | null;

    const where: any = {};

    if (search) {
      where.OR = [
        { flightNumber: { contains: search, mode: "insensitive" } },
        { originCity: { contains: search, mode: "insensitive" } },
        { destCity: { contains: search, mode: "insensitive" } },
        { cargoManifestSummary: { contains: search, mode: "insensitive" } },
      ];
    }

    if (carrier) where.carrier = carrier;
    if (status) where.flightStatus = status;

    const flights = await prisma.airCargoFlight.findMany({
      where,
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
    });

    const formatted = flights.map((f) => {
      const live = calculateFlightLiveProgress(f);
      const latestSensor = f.sensorLogs[0] || null;

      return {
        id: f.id,
        flightNumber: f.flightNumber,
        aircraftType: f.aircraftType,
        carrier: f.carrier,
        originAirport: f.originAirport,
        originCity: f.originCity,
        destAirport: f.destAirport,
        destCity: f.destCity,
        scheduledDeparture: f.scheduledDeparture,
        actualDeparture: f.actualDeparture,
        scheduledArrival: f.scheduledArrival,
        actualArrival: f.actualArrival,
        flightDurationMinutes: f.flightDurationMinutes,
        flightStatus: f.flightStatus,
        coldChainCategory: f.coldChainCategory,
        targetTempMin: f.targetTempMin,
        targetTempMax: f.targetTempMax,
        averageTemp: f.averageTemp,
        isColdChainPassed: f.isColdChainPassed,
        totalCargoWeightKg: f.totalCargoWeightKg,
        cargoManifestSummary: f.cargoManifestSummary,
        // Live progress
        progress: live.progress,
        currentLatitude: live.currentLatitude,
        currentLongitude: live.currentLongitude,
        remainingMinutes: live.remainingMinutes,
        remainingTimeFormatted: live.remainingTimeFormatted,
        latestSensor,
        milestonesCount: f._count.milestones,
        sensorLogsCount: f._count.sensorLogs,
      };
    });

    return NextResponse.json({ success: true, flights: formatted });
  } catch (error: any) {
    console.error("Lỗi khi tải danh sách chuyến bay:", error);
    return NextResponse.json(
      { error: "Không thể tải danh sách chuyến bay Air Cargo." },
      { status: 500 }
    );
  }
}
