// ============================================================
// app/api/admin/subscriptions/[id]/trigger/route.ts
// REST API Kích Hoạt Tạo Đơn Hàng Từ Gói Định Kỳ Dành Cho Admin (Stage 13.2)
// ============================================================

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { createOrderFromSubscription } from "@/lib/subscription";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function POST(req: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth();
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const newOrder = await createOrderFromSubscription(id);

    return NextResponse.json({
      success: true,
      message: `Đã kích hoạt tạo đơn hàng #${newOrder.orderNumber} thành công!`,
      order: {
        id: newOrder.id,
        orderNumber: newOrder.orderNumber,
        total: Number(newOrder.total),
      },
    });
  } catch (error) {
    console.error("POST /api/admin/subscriptions/[id]/trigger error:", error);
    return NextResponse.json(
      { error: (error as Error).message || "Không thể kích hoạt tạo đơn hàng định kỳ" },
      { status: 500 }
    );
  }
}
