// ============================================================
// app/api/gift-boxes/calculate/route.ts
// API tính toán dung lượng (Slots) & Giá giỏ quà theo thời gian thực (Phase 17)
// ============================================================

import { NextRequest, NextResponse } from "next/server";
import { calculateHamperCapacityAndTotal } from "@/lib/gift-box";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { templateId, hasLedLights, items } = body;

    if (!templateId || !Array.isArray(items)) {
      return NextResponse.json(
        { success: false, message: "Dữ liệu tính toán không hợp lệ." },
        { status: 400 }
      );
    }

    const result = await calculateHamperCapacityAndTotal({
      templateId,
      hasLedLights: Boolean(hasLedLights),
      items,
    });

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    console.error("Lỗi khi tính toán dung lượng giỏ quà:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Không thể tính toán chi phí giỏ quà." },
      { status: 400 }
    );
  }
}
