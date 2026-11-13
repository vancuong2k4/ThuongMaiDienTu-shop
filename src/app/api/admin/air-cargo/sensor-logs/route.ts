import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { createSensorLogSchema } from "@/lib/validations/air-cargo";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (session?.user?.role !== "ADMIN") {
      return NextResponse.json(
        { success: false, message: "Không có quyền truy cập." },
        { status: 403 }
      );
    }

    const body = await req.json();
    const validated = createSensorLogSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        {
          success: false,
          message: validated.error.issues[0]?.message || "Dữ liệu cảm biến không hợp lệ.",
        },
        { status: 400 }
      );
    }

    const data = validated.data;

    const log = await prisma.coldChainSensorLog.create({
      data: {
        flightId: data.flightId,
        sensorId: data.sensorId,
        recordedAt: new Date(data.recordedAt),
        temperatureCelsius: data.temperatureCelsius,
        humidityPercent: data.humidityPercent || null,
        batteryPercent: data.batteryPercent || 100,
        alertLevel: data.alertLevel,
        stageName: data.stageName,
      },
    });

    // Cập nhật lại nhiệt độ trung bình của chuyến bay
    const allLogs = await prisma.coldChainSensorLog.findMany({
      where: { flightId: data.flightId },
      select: { temperatureCelsius: true },
    });

    if (allLogs.length > 0) {
      const avg =
        allLogs.reduce((s, l) => s + l.temperatureCelsius, 0) / allLogs.length;
      await prisma.airCargoFlight.update({
        where: { id: data.flightId },
        data: { averageTemp: Number(avg.toFixed(2)) },
      });
    }

    return NextResponse.json({ success: true, log }, { status: 201 });
  } catch (error: any) {
    console.error("Lỗi khi ghi nhận dữ liệu cảm biến:", error);
    return NextResponse.json(
      { success: false, message: "Không thể lưu dữ liệu cảm biến nhiệt độ." },
      { status: 500 }
    );
  }
}
