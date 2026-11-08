// ============================================================
// app/api/admin/orders/[id]/payment/route.ts
// API Cập nhật Trạng thái Thanh toán Đơn hàng Admin CMS
// ============================================================

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { updatePaymentStatusSchema } from "@/lib/validations/order";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function PATCH(req: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth();
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();
    const parsed = updatePaymentStatusSchema.safeParse(body);

    if (!parsed.success) {
      const firstError = parsed.error.issues[0]?.message || "Dữ liệu không hợp lệ";
      return NextResponse.json({ error: firstError }, { status: 400 });
    }

    const { paymentStatus, paidAt } = parsed.data;

    // Tìm đơn hàng
    const order = await prisma.order.findFirst({
      where: {
        OR: [{ id }, { orderNumber: id }],
      },
      select: { id: true, paymentStatus: true },
    });

    if (!order) {
      return NextResponse.json(
        { error: "Đơn hàng không tồn tại" },
        { status: 404 }
      );
    }

    const updatedPaidAt =
      paymentStatus === "PAID"
        ? paidAt
          ? new Date(paidAt)
          : new Date()
        : null;

    const updated = await prisma.order.update({
      where: { id: order.id },
      data: {
        paymentStatus,
        paidAt: updatedPaidAt,
      },
    });

    return NextResponse.json({
      success: true,
      message: `Đã cập nhật thanh toán sang "${paymentStatus}"`,
      order: updated,
    });
  } catch (error) {
    console.error("Lỗi khi cập nhật thanh toán đơn hàng:", error);
    return NextResponse.json(
      { error: "Không thể cập nhật trạng thái thanh toán" },
      { status: 500 }
    );
  }
}
