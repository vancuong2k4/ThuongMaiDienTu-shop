// ============================================================
// app/api/admin/orders/[id]/status/route.ts
// API Cập nhật Trạng thái Đơn hàng & Tự động Hoàn/Trừ Kho
// ============================================================

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { updateOrderStatusSchema } from "@/lib/validations/order";

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
    const parsed = updateOrderStatusSchema.safeParse(body);

    if (!parsed.success) {
      const firstError = parsed.error.issues[0]?.message || "Dữ liệu không hợp lệ";
      return NextResponse.json({ error: firstError }, { status: 400 });
    }

    const { status: newStatus, note } = parsed.data;

    // 1. Tìm đơn hàng
    const order = await prisma.order.findFirst({
      where: {
        OR: [{ id }, { orderNumber: id }],
      },
      include: {
        items: true,
      },
    });

    if (!order) {
      return NextResponse.json(
        { error: "Đơn hàng không tồn tại" },
        { status: 404 }
      );
    }

    const currentStatus = order.orderStatus;
    if (currentStatus === newStatus) {
      return NextResponse.json({
        success: true,
        message: "Trạng thái đơn hàng không thay đổi",
        order,
      });
    }

    // 2. Chuyển đổi trạng thái trong Transaction đảm bảo toàn vẹn kho hàng
    const updatedOrder = await prisma.$transaction(async (tx) => {
      // Trường hợp A: Chuyển sang CANCELLED -> Hoàn trả tồn kho nguyên tử
      if (newStatus === "CANCELLED" && currentStatus !== "CANCELLED") {
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
      }

      // Trường hợp B: Khôi phục từ CANCELLED sang trạng thái khác -> Trừ kho trở lại
      if (currentStatus === "CANCELLED" && newStatus !== "CANCELLED") {
        // Kiểm tra tồn kho trước
        for (const item of order.items) {
          if (item.variantId) {
            const variant = await tx.productVariant.findUnique({
              where: { id: item.variantId },
              select: { stock: true, name: true },
            });
            if (!variant || variant.stock < item.quantity) {
              throw new Error(
                `Không thể khôi phục đơn: Sản phẩm "${item.productName} - ${item.variantName}" hiện không đủ tồn kho (Còn ${variant?.stock || 0}, cần ${item.quantity}).`
              );
            }
          }
        }

        // Trừ kho
        for (const item of order.items) {
          if (item.variantId) {
            await tx.productVariant.update({
              where: { id: item.variantId },
              data: {
                stock: { decrement: item.quantity },
              },
            });
          }
        }
      }

      // Tạo nhật ký lịch sử trạng thái
      await tx.orderStatusHistory.create({
        data: {
          orderId: order.id,
          status: newStatus,
          note: note || `Admin ${session.user.name || "Quản trị viên"} cập nhật trạng thái`,
        },
      });

      // Cập nhật đơn hàng
      const updated = await tx.order.update({
        where: { id: order.id },
        data: {
          orderStatus: newStatus,
        },
      });

      return updated;
    });

    return NextResponse.json({
      success: true,
      message: `Đã cập nhật trạng thái đơn hàng sang "${newStatus}"`,
      order: updatedOrder,
    });
  } catch (error) {
    console.error("Lỗi khi cập nhật trạng thái đơn hàng:", error);
    return NextResponse.json(
      { error: (error as Error).message || "Không thể cập nhật trạng thái đơn hàng" },
      { status: 500 }
    );
  }
}
