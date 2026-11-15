import { NextResponse } from "next/server";
import { getAptamilProtocols } from "@/lib/pediatric-growth";

// ============================================================
// app/api/pediatric/protocols/route.ts
// Lấy Danh Sách Quy Trình Pha Sữa Aptamil Profutura Úc (Phase 23)
// ============================================================

export const revalidate = 3600; // Cache 1 giờ

export async function GET() {
  try {
    const protocols = await getAptamilProtocols();
    return NextResponse.json({
      success: true,
      data: protocols,
    });
  } catch (error: any) {
    console.error("Lỗi khi lấy protocols pha sữa Aptamil:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Không thể lấy danh sách quy trình pha sữa Aptamil.",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
