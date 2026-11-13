import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { createFlightSchema } from "@/lib/validations/air-cargo";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (session?.user?.role !== "ADMIN") {
      return NextResponse.json(
        { success: false, message: "Không có quyền truy cập." },
        { status: 403 }
      );
    }

    const flights = await prisma.airCargoFlight.findMany({
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

    return NextResponse.json({ success: true, flights });
  } catch (error: any) {
    console.error("Lỗi khi tải danh sách chuyến bay admin:", error);
    return NextResponse.json(
      { success: false, message: "Không thể tải danh sách chuyến bay." },
      { status: 500 }
    );
  }
}

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
    const validated = createFlightSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        {
          success: false,
          message: validated.error.issues[0]?.message || "Dữ liệu chuyến bay không hợp lệ.",
        },
        { status: 400 }
      );
    }

    const data = validated.data;

    const flight = await prisma.airCargoFlight.create({
      data: {
        flightNumber: data.flightNumber,
        aircraftType: data.aircraftType,
        carrier: data.carrier,
        originAirport: data.originAirport,
        originCity: data.originCity,
        destAirport: data.destAirport,
        destCity: data.destCity,
        scheduledDeparture: new Date(data.scheduledDeparture),
        scheduledArrival: new Date(data.scheduledArrival),
        flightDurationMinutes: data.flightDurationMinutes,
        coldChainCategory: data.coldChainCategory,
        targetTempMin: data.targetTempMin,
        targetTempMax: data.targetTempMax,
        totalCargoWeightKg: data.totalCargoWeightKg || null,
        cargoManifestSummary: data.cargoManifestSummary || null,
      },
    });

    // Tạo sẵn 4 mốc hành trình cơ bản
    await prisma.flightMilestone.createMany({
      data: [
        {
          flightId: flight.id,
          stepNumber: 1,
          title: `Đóng gói & Kiểm tra cảm biến chuỗi lạnh tại ${data.originCity}`,
          locationName: `${data.originAirport} Hub`,
          timestamp: new Date(data.scheduledDeparture),
          isCompleted: false,
        },
        {
          flightId: flight.id,
          stepNumber: 2,
          title: `Cất cánh từ sân bay ${data.originAirport}`,
          locationName: `${data.originAirport} International Airport`,
          timestamp: new Date(data.scheduledDeparture),
          isCompleted: false,
        },
        {
          flightId: flight.id,
          stepNumber: 3,
          title: `Hạ cánh tại sân bay ${data.destAirport}`,
          locationName: `${data.destAirport} Cargo Terminal`,
          timestamp: new Date(data.scheduledArrival),
          isCompleted: false,
        },
        {
          flightId: flight.id,
          stepNumber: 4,
          title: "Nhập kho lạnh kiểm soát nhiệt độ THUYNGA Shop",
          locationName: "Tổng kho THUYNGA Shop",
          timestamp: new Date(new Date(data.scheduledArrival).getTime() + 3 * 3600 * 1000),
          isCompleted: false,
        },
      ],
    });

    return NextResponse.json({ success: true, flight }, { status: 201 });
  } catch (error: any) {
    console.error("Lỗi khi tạo chuyến bay:", error);
    if (error.code === "P2002") {
      return NextResponse.json(
        { success: false, message: "Số hiệu chuyến bay này đã tồn tại." },
        { status: 409 }
      );
    }
    return NextResponse.json(
      { success: false, message: "Không thể khởi tạo chuyến bay." },
      { status: 500 }
    );
  }
}
