import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { updateReservationStatusSchema } from "@/lib/validations/preorder";

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
    const validated = updateReservationStatusSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        {
          success: false,
          message:
            validated.error.issues[0]?.message || "Dữ liệu cập nhật không hợp lệ.",
        },
        { status: 400 }
      );
    }

    const data = validated.data;

    const updated = await prisma.preOrderReservation.update({
      where: { id },
      data: {
        status: data.status,
        flightNumber: data.flightNumber || undefined,
        airWaybillNumber: data.airWaybillNumber || undefined,
        notes: data.notes || undefined,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Cập nhật đơn đặt giữ chỗ thành công!",
      reservation: updated,
    });
  } catch (error: any) {
    console.error("Lỗi khi cập nhật đơn đặt giữ chỗ:", error);
    return NextResponse.json(
      { success: false, message: "Không thể cập nhật đơn đặt giữ chỗ." },
      { status: 500 }
    );
  }
}
