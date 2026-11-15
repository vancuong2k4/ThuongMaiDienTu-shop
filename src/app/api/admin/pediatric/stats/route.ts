import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { calculatePediatricAdminKPIs } from "@/lib/pediatric-growth";

// ============================================================
// app/api/admin/pediatric/stats/route.ts
// Thống Kê Admin CMS Cho Phân Hệ Tăng Trưởng & Pha Sữa Úc (Phase 23)
// ============================================================

export async function GET() {
  try {
    const session = await auth();
    if (session?.user?.role !== "ADMIN") {
      return NextResponse.json(
        { success: false, message: "Không có quyền truy cập quản trị." },
        { status: 403 }
      );
    }

    const stats = await calculatePediatricAdminKPIs();

    return NextResponse.json({
      success: true,
      data: stats,
    });
  } catch (error: any) {
    console.error("Lỗi khi lấy thống kê tăng trưởng trẻ em:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Không thể lấy thống kê quản trị tăng trưởng trẻ em.",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
