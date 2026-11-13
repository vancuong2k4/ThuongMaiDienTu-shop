import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { updateFlightStatusSchema } from "@/lib/validations/air-cargo";

export const dynamic = "force-dynamic";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (session?.user?.role !== "ADMIN") {
      return NextResponse.json(
        { success: false, message: "Không có quyền truy cập." },
        { status: 403 }
      );
    }

    const { id } = await params;
    const body = await req.json();
    const validated = updateFlightStatusSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        {
          success: false,
          message: validated.error.issues[0]?.message || "Dữ liệu cập nhật không hợp lệ.",
        },
        { status: 400 }
      );
    }

    const data = validated.data;

    const updated = await prisma.airCargoFlight.update({
      where: { id },
      data: {
        flightStatus: data.flightStatus,
        flightProgressPercent: data.flightProgressPercent,
        currentLatitude: data.currentLatitude,
        currentLongitude: data.currentLongitude,
        currentAltitudeFeet: data.currentAltitudeFeet,
        actualDeparture: data.actualDeparture ? new Date(data.actualDeparture) : undefined,
        actualArrival: data.actualArrival ? new Date(data.actualArrival) : undefined,
      },
    });

    return NextResponse.json({ success: true, flight: updated });
  } catch (error: any) {
    console.error("Lỗi khi cập nhật chuyến bay:", error);
    return NextResponse.json(
      { success: false, message: "Không thể cập nhật chuyến bay." },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (session?.user?.role !== "ADMIN") {
      return NextResponse.json(
        { success: false, message: "Không có quyền truy cập." },
        { status: 403 }
      );
    }

    const { id } = await params;
    await prisma.airCargoFlight.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: "Đã xóa chuyến bay thành công.",
    });
  } catch (error: any) {
    console.error("Lỗi khi xóa chuyến bay:", error);
    return NextResponse.json(
      { success: false, message: "Không thể xóa chuyến bay." },
      { status: 500 }
    );
  }
}
