import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

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

    const updated = await prisma.seasonalCampaign.update({
      where: { id },
      data: {
        title: body.title,
        subtitle: body.subtitle,
        description: body.description,
        status: body.status,
        flightDepartureWeek: body.flightDepartureWeek,
        targetBrixSweetness: body.targetBrixSweetness,
        fruitSizeMm: body.fruitSizeMm,
        totalCapacityKg: body.totalCapacityKg,
        reservedCapacityKg: body.reservedCapacityKg,
        bannerImage: body.bannerImage,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Cập nhật chiến dịch thành công!",
      campaign: updated,
    });
  } catch (error: any) {
    console.error("Lỗi khi cập nhật chiến dịch:", error);
    return NextResponse.json(
      { success: false, message: "Không thể cập nhật chiến dịch." },
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
    await prisma.seasonalCampaign.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: "Đã xóa chiến dịch mùa vụ thành công.",
    });
  } catch (error: any) {
    console.error("Lỗi khi xóa chiến dịch mùa vụ:", error);
    return NextResponse.json(
      { success: false, message: "Không thể xóa chiến dịch mùa vụ." },
      { status: 500 }
    );
  }
}
