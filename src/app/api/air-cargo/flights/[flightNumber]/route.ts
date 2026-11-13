import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  calculateFlightLiveProgress,
  evaluateColdChainAnalytics,
} from "@/lib/flight-tracker";

export const dynamic = "force-dynamic";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ flightNumber: string }> }
) {
  try {
    const { flightNumber } = await params;
    const cleanNumber = flightNumber.trim().toUpperCase();

    const flight = await prisma.airCargoFlight.findUnique({
      where: { flightNumber: cleanNumber },
      include: {
        milestones: {
          orderBy: { stepNumber: "asc" },
        },
        sensorLogs: {
          orderBy: { recordedAt: "asc" },
        },
        shipment: {
          include: {
            batches: {
              include: {
                product: {
                  select: { id: true, name: true, slug: true, brand: true },
                },
              },
            },
          },
        },
      },
    });

    if (!flight) {
      return NextResponse.json(
        { error: `Không tìm thấy thông tin chuyến bay ${cleanNumber}.` },
        { status: 404 }
      );
    }

    const live = calculateFlightLiveProgress(flight);
    const coldChain = evaluateColdChainAnalytics(
      flight.sensorLogs,
      flight.targetTempMin,
      flight.targetTempMax
    );

    return NextResponse.json({
      success: true,
      data: {
        flight: {
          ...flight,
          progress: live.progress,
          currentLatitude: live.currentLatitude,
          currentLongitude: live.currentLongitude,
          remainingMinutes: live.remainingMinutes,
          remainingTimeFormatted: live.remainingTimeFormatted,
        },
        coldChain,
      },
    });
  } catch (error: any) {
    console.error("Lỗi khi lấy chi tiết chuyến bay:", error);
    return NextResponse.json(
      { error: "Không thể tải chi tiết chuyến bay Air Cargo." },
      { status: 500 }
    );
  }
}
