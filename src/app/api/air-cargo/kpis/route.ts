import { NextRequest, NextResponse } from "next/server";
import { calculateFlightKPIs } from "@/lib/flight-tracker";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const kpis = await calculateFlightKPIs();
    return NextResponse.json({ success: true, kpis });
  } catch (error: any) {
    console.error("Lỗi khi lấy KPIs chuyến bay:", error);
    return NextResponse.json(
      { error: "Không thể lấy số liệu KPIs chuyến bay." },
      { status: 500 }
    );
  }
}
