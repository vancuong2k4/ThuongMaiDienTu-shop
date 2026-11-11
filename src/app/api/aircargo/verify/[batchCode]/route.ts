// ============================================================
// app/api/aircargo/verify/[batchCode]/route.ts
// REST API Khách Hàng Tra Cứu Minh Bạch Mã Lô & Vận Đơn Air (Phase 15)
// ============================================================

import { NextRequest, NextResponse } from "next/server";
import { verifyBatchByCode } from "@/lib/aircargo";

interface RouteParams {
  params: Promise<{ batchCode: string }>;
}

export async function GET(req: NextRequest, { params }: RouteParams) {
  try {
    const { batchCode } = await params;
    if (!batchCode || batchCode.trim().length < 2) {
      return NextResponse.json(
        { error: "Vui lòng nhập mã lô hàng hợp lệ (tối thiểu 2 ký tự)" },
        { status: 400 }
      );
    }

    const ip = req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "127.0.0.1";
    const userAgent = req.headers.get("user-agent") || "Unknown";

    const result = await verifyBatchByCode(batchCode, { ip, userAgent });

    if (!result.found) {
      return NextResponse.json(
        {
          found: false,
          error: `Không tìm thấy mã lô "${batchCode}". Vui lòng kiểm tra lại mã in dưới đáy hộp hoặc thân chai.`,
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      found: true,
      data: result.batch,
    });
  } catch (error) {
    console.error("GET /api/aircargo/verify/[batchCode] error:", error);
    return NextResponse.json(
      { error: "Đã xảy ra lỗi khi tra cứu mã lô hàng" },
      { status: 500 }
    );
  }
}
