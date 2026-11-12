// ============================================================
// app/api/admin/consultations/route.ts
// Quản trị Danh Sách Lịch Hẹn Tư Vấn Dược Sĩ 1-1 Admin CMS (Phase 16)
// ============================================================

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ConsultationStatus, Prisma } from "@prisma/client";

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
    const limit = Math.max(1, Math.min(100, parseInt(searchParams.get("limit") || "15")));
    const skip = (page - 1) * limit;

    const search = searchParams.get("search")?.trim() || "";
    const status = searchParams.get("status") || "ALL";

    const where: Prisma.PharmacistConsultationBookingWhereInput = {};

    if (search) {
      where.OR = [
        { customerName: { contains: search, mode: "insensitive" } },
        { phone: { contains: search, mode: "insensitive" } },
        { healthConcerns: { contains: search, mode: "insensitive" } },
      ];
    }

    if (
      status !== "ALL" &&
      Object.values(ConsultationStatus).includes(status as ConsultationStatus)
    ) {
      where.status = status as ConsultationStatus;
    }

    const [bookings, total] = await Promise.all([
      prisma.pharmacistConsultationBooking.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          assessment: {
            include: {
              protocol: {
                select: {
                  id: true,
                  title: true,
                  slug: true,
                  targetGroup: true,
                },
              },
            },
          },
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              membershipTier: true,
            },
          },
        },
      }),
      prisma.pharmacistConsultationBooking.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      data: bookings,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("GET /api/admin/consultations error:", error);
    return NextResponse.json(
      { error: "Đã xảy ra lỗi khi lấy danh sách lịch hẹn tư vấn dược sĩ" },
      { status: 500 }
    );
  }
}
