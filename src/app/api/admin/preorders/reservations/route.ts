import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { ReservationStatus } from "@prisma/client";

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

    const { searchParams } = new URL(req.url);
    const campaignId = searchParams.get("campaignId");
    const status = searchParams.get("status") as ReservationStatus | null;
    const search = searchParams.get("search");

    const where: any = {};
    if (campaignId) where.campaignId = campaignId;
    if (status) where.status = status;
    if (search) {
      where.OR = [
        { reservationCode: { contains: search, mode: "insensitive" } },
        { customerName: { contains: search, mode: "insensitive" } },
        { customerPhone: { contains: search } },
      ];
    }

    const reservations = await prisma.preOrderReservation.findMany({
      where,
      orderBy: [{ createdAt: "desc" }],
      include: {
        campaign: {
          select: {
            title: true,
            slug: true,
            farmName: true,
            flightDepartureWeek: true,
          },
        },
        tier: {
          select: {
            name: true,
            specification: true,
            price: true,
            depositAmount: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      reservations,
    });
  } catch (error: any) {
    console.error("Lỗi khi tải danh sách đơn đặt trước admin:", error);
    return NextResponse.json(
      { success: false, message: "Không thể tải danh sách đơn đặt trước." },
      { status: 500 }
    );
  }
}
