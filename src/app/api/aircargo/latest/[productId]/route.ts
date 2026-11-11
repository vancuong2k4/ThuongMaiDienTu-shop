// ============================================================
// app/api/aircargo/latest/[productId]/route.ts
// Lấy thông tin lô hàng bay Air mới nhất cho trang chi tiết sản phẩm (Phase 15)
// ============================================================

import { NextRequest, NextResponse } from "next/server";
import { getLatestBatchForProduct } from "@/lib/aircargo";

interface RouteParams {
  params: Promise<{ productId: string }>;
}

export async function GET(req: NextRequest, { params }: RouteParams) {
  try {
    const { productId } = await params;
    if (!productId) {
      return NextResponse.json(
        { error: "Product ID is required" },
        { status: 400 }
      );
    }

    const batch = await getLatestBatchForProduct(productId);
    return NextResponse.json({
      success: true,
      data: batch,
    });
  } catch (error) {
    console.error("GET /api/aircargo/latest/[productId] error:", error);
    return NextResponse.json(
      { error: "Đã xảy ra lỗi khi tải thông tin lô hàng mới nhất" },
      { status: 500 }
    );
  }
}
