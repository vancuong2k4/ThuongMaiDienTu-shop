// ============================================================
// app/api/admin/aircargo/shipments/[id]/route.ts
// Chi Tiết, Cập Nhật & Xóa Vận Đơn Hàng Không Air-Cargo (Phase 15)
// ============================================================

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { updateShipmentSchema } from "@/lib/validations/batch";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(req: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth();
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const shipment = await prisma.airCargoShipment.findUnique({
      where: { id },
      include: {
        batches: {
          include: {
            product: {
              select: { id: true, name: true, slug: true },
            },
            variant: {
              select: { id: true, name: true, sku: true },
            },
            _count: {
              select: { verificationLogs: true },
            },
          },
        },
      },
    });

    if (!shipment) {
      return NextResponse.json(
        { error: "Không tìm thấy chuyến bay / vận đơn hàng không" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: shipment });
  } catch (error) {
    console.error("GET /api/admin/aircargo/shipments/[id] error:", error);
    return NextResponse.json(
      { error: "Đã xảy ra lỗi khi lấy thông tin chuyến bay" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth();
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();
    const parsed = updateShipmentSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Dữ liệu không hợp lệ", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const data = parsed.data;
    const updateData: any = {};

    if (data.airWaybillNumber !== undefined) updateData.airWaybillNumber = data.airWaybillNumber.trim();
    if (data.carrier !== undefined) updateData.carrier = data.carrier;
    if (data.flightNumber !== undefined) updateData.flightNumber = data.flightNumber.replace(/\s+/g, "").toUpperCase();
    if (data.originAirport !== undefined) updateData.originAirport = data.originAirport.toUpperCase();
    if (data.destinationAirport !== undefined) updateData.destinationAirport = data.destinationAirport.toUpperCase();
    if (data.departureDate !== undefined) updateData.departureDate = new Date(data.departureDate);
    if (data.arrivalDate !== undefined) updateData.arrivalDate = new Date(data.arrivalDate);
    if (data.status !== undefined) updateData.status = data.status;
    if (data.storageTempMin !== undefined) updateData.storageTempMin = data.storageTempMin;
    if (data.storageTempMax !== undefined) updateData.storageTempMax = data.storageTempMax;
    if (data.receiptImages !== undefined) updateData.receiptImages = data.receiptImages;
    if (data.customsDocImages !== undefined) updateData.customsDocImages = data.customsDocImages;
    if (data.notes !== undefined) updateData.notes = data.notes;

    const updated = await prisma.airCargoShipment.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({
      success: true,
      message: "Cập nhật chuyến bay thành công",
      data: updated,
    });
  } catch (error) {
    console.error("PATCH /api/admin/aircargo/shipments/[id] error:", error);
    return NextResponse.json(
      { error: "Đã xảy ra lỗi khi cập nhật chuyến bay" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth();
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const batchCount = await prisma.productBatch.count({
      where: { shipmentId: id },
    });

    if (batchCount > 0) {
      return NextResponse.json(
        {
          error: `Không thể xóa chuyến bay này vì đang liên kết với ${batchCount} lô sản phẩm. Vui lòng gỡ liên kết trước.`,
        },
        { status: 400 }
      );
    }

    await prisma.airCargoShipment.delete({ where: { id } });

    return NextResponse.json({
      success: true,
      message: "Xóa chuyến bay / vận đơn thành công",
    });
  } catch (error) {
    console.error("DELETE /api/admin/aircargo/shipments/[id] error:", error);
    return NextResponse.json(
      { error: "Đã xảy ra lỗi khi xóa chuyến bay" },
      { status: 500 }
    );
  }
}
