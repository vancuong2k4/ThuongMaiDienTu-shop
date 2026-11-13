import { NextRequest, NextResponse } from "next/server";
import { calculatePreOrderKPIs } from "@/lib/preorder";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const kpis = await calculatePreOrderKPIs();
    return NextResponse.json({
      success: true,
      kpis,
    });
  } catch (error: any) {
    console.error("Lỗi khi tải KPIs đặt trước:", error);
    return NextResponse.json(
      { success: false, message: "Không thể tải KPIs mùa vụ." },
      { status: 500 }
    );
  }
}
