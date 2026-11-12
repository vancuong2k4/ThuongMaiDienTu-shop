import { NextRequest, NextResponse } from "next/server";
import { getComparisonDataset } from "@/lib/comparison";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const idsParam = searchParams.get("ids");

    if (!idsParam) {
      return NextResponse.json(
        { error: "Vui lòng cung cấp danh sách ID sản phẩm cần so sánh." },
        { status: 400 }
      );
    }

    const productIds = idsParam
      .split(",")
      .map((id) => id.trim())
      .filter(Boolean);

    if (productIds.length === 0) {
      return NextResponse.json(
        { error: "Danh sách ID sản phẩm không hợp lệ." },
        { status: 400 }
      );
    }

    const data = await getComparisonDataset(productIds);
    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    console.error("Lỗi khi lấy dữ liệu ma trận so sánh:", error);
    return NextResponse.json(
      { error: "Không thể tải dữ liệu so sánh sản phẩm." },
      { status: 500 }
    );
  }
}
