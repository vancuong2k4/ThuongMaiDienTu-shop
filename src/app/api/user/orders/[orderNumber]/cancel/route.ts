// ============================================================
// app/api/user/orders/[orderNumber]/cancel/route.ts
// Khách hàng tự hủy đơn hàng (khi đơn còn ở trạng thái PENDING)
// Tự động hoàn lại tồn kho nguyên tử (Atomic rollback)
// ============================================================

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

interface RouteParams {
  params: Promise<{
    orderNumber: string;
  }>;
}

export async function POST(req: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Chưa đăng nhập" }, { status: 401 });
    }

    const { orderNumber } = await params;
    const body = await req.json().catch(() => ({}));
    const reason = body?.reason?.trim() || "Khách hàng yêu cầu hủy đơn";

    const result = await prisma.$transaction(async (tx) => {
      // 1. Tìm đơn hàng
      const order = await tx.order.findUnique({
        where: { orderNumber },
        include: {
          items: true,
        },
      });

      if (!order) {
        throw new Error("Không tìm thấy đơn hàng");
      }

      // Kiểm tra quyền sở hữu
      if (order.userId !== session.user.id && session.user.role !== "ADMIN") {
        throw new Error("Bạn không có quyền hủy đơn hàng này");
      }

      // Chỉ cho phép hủy khi đang chờ xác nhận
      if (order.orderStatus !== "PENDING") {
        throw new Error(
          "Chỉ có thể hủy đơn hàng khi đang ở trạng thái 'Chờ xác nhận'. Đơn hàng đang được xử lý không thể hủy tự động."
        );
      }

      // 2. Hoàn trả tồn kho cho từng biến thể
      for (const item of order.items) {
        if (item.variantId) {
          await tx.productVariant.update({
            where: { id: item.variantId },
            data: {
              stock: { increment: item.quantity },
            },
          });
        }
      }

      // 3. Cập nhật trạng thái đơn hàng thành CANCELLED
      const updatedOrder = await tx.order.update({
        where: { id: order.id },
        data: {
          orderStatus: "CANCELLED",
        },
      });

      // 4. Ghi nhật ký trạng thái
      await tx.orderStatusHistory.create({
        data: {
          orderId: order.id,
          status: "CANCELLED",
          note: reason,
        },
      });

      return updatedOrder;
    });

    return NextResponse.json({
      success: true,
      message: "Đã hủy đơn hàng thành công!",
      orderNumber: result.orderNumber,
    });
  } catch (error: unknown) {
    console.error("Cancel order error:", error);
    const msg = error instanceof Error ? error.message : "Lỗi khi hủy đơn hàng";
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}
