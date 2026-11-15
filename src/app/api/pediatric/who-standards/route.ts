import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ChildGender } from "@prisma/client";

// ============================================================
// app/api/pediatric/who-standards/route.ts
// Lấy Đường Chuẩn Bách Phân Vị Chiều Cao / Cân Nặng WHO 0-60 Tháng (Phase 23)
// ============================================================

export const revalidate = 86400; // Cache 24 giờ

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const genderParam = searchParams.get("gender");
    const ageMonthsParam = searchParams.get("ageMonths");

    const gender =
      genderParam === "GIRL" ? ChildGender.GIRL : ChildGender.BOY;

    if (ageMonthsParam !== null && !isNaN(Number(ageMonthsParam))) {
      const ageMonths = Math.min(60, Math.max(0, parseInt(ageMonthsParam, 10)));
      const standard = await prisma.whoGrowthStandard.findUnique({
        where: {
          gender_ageMonths: { gender, ageMonths },
        },
      });
      return NextResponse.json({ success: true, data: standard });
    }

    const standards = await prisma.whoGrowthStandard.findMany({
      where: { gender },
      orderBy: { ageMonths: "asc" },
    });

    return NextResponse.json({
      success: true,
      gender,
      data: standards,
    });
  } catch (error: any) {
    console.error("Lỗi khi lấy chuẩn tăng trưởng WHO:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Không thể lấy dữ liệu chuẩn tăng trưởng WHO.",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
