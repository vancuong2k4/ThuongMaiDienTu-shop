// ============================================================
// app/api/admin/aircargo/shipments/route.ts
// Quản trị Vận Đơn Hàng Không (AWB) & Chuyến Bay Air-Cargo (Phase 15)
// ============================================================

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { AirlineCarrier, ShipmentStatus, Prisma } from "@prisma/client";
import { createShipmentSchema } from "@/lib/validations/batch";
import { calculateAirCargoKPIs } from "@/lib/aircargo";

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
    const limit = Math.max(1, Math.min(100, parseInt(searchParams.get("limit") || "10")));
    const skip = (page - 1) * limit;

    const search = searchParams.get("search")?.trim() || "";
    const carrier = searchParams.get("carrier") || "ALL";
    const status = searchParams.get("status") || "ALL";

    const where: Prisma.AirCargoShipmentWhereInput = {};

    if (search) {
      where.OR = [
        { airWaybillNumber: { contains: search, mode: "insensitive" } },
        { flightNumber: { contains: search, mode: "insensitive" } },
        { shipmentNumber: { contains: search, mode: "insensitive" } },
      ];
    }

    if (carrier !== "ALL" && Object.values(AirlineCarrier).includes(carrier as AirlineCarrier)) {
      where.carrier = carrier as AirlineCarrier;
    }

    if (status !== "ALL" && Object.values(ShipmentStatus).includes(status as ShipmentStatus)) {
      where.status = status as ShipmentStatus;
    }

    const [shipments, total, kpis] = await Promise.all([
      prisma.airCargoShipment.findMany({
        where,
        skip,
        take: limit,
        orderBy: { departureDate: "desc" },
        include: {
          batches: {
            select: {
              id: true,
              batchCode: true,
              product: {
                select: { name: true, slug: true },
              },
            },
          },
          _count: {
            select: { batches: true },
          },
        },
      }),
      prisma.airCargoShipment.count({ where }),
      calculateAirCargoKPIs(),
    ]);

    return NextResponse.json({
      success: true,
      data: shipments,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
      kpis,
    });
  } catch (error) {
    console.error("GET /api/admin/aircargo/shipments error:", error);
    return NextResponse.json(
      { error: "Đã xảy ra lỗi khi lấy danh sách chuyến bay air-cargo" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const parsed = createShipmentSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Dữ liệu không hợp lệ", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const data = parsed.data;
    const cleanFlight = data.flightNumber.replace(/\s+/g, "").toUpperCase();
    const timestampSuffix = Date.now().toString().slice(-6);
    const shipmentNumber = `AWB-${cleanFlight}-${timestampSuffix}`;

    const shipment = await prisma.airCargoShipment.create({
      data: {
        shipmentNumber,
        airWaybillNumber: data.airWaybillNumber.trim(),
        carrier: data.carrier,
        flightNumber: cleanFlight,
        originAirport: data.originAirport.toUpperCase(),
        destinationAirport: data.destinationAirport.toUpperCase(),
        departureDate: new Date(data.departureDate),
        arrivalDate: new Date(data.arrivalDate),
        status: data.status,
        storageTempMin: data.storageTempMin,
        storageTempMax: data.storageTempMax,
        receiptImages: data.receiptImages,
        customsDocImages: data.customsDocImages,
        notes: data.notes || null,
        temperatureLog: [
          {
            timestamp: new Date(data.departureDate).toISOString(),
            temperature: (data.storageTempMin + data.storageTempMax) / 2,
            note: "Kiểm tra nhiệt độ khi xếp hàng vào khoang lạnh sân bay Úc",
          },
        ],
      },
    });

    return NextResponse.json({
      success: true,
      message: "Tạo chuyến bay / vận đơn hàng không thành công",
      data: shipment,
    });
  } catch (error) {
    console.error("POST /api/admin/aircargo/shipments error:", error);
    return NextResponse.json(
      { error: "Đã xảy ra lỗi khi tạo chuyến bay air-cargo" },
      { status: 500 }
    );
  }
}
