// ============================================================
// app/api/admin/orders/[id]/route.ts
// API Chi tiết Đơn hàng Admin CMS
// ============================================================

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(req: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth();
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    // Tìm theo id hoặc theo orderNumber
    const order = await prisma.order.findFirst({
      where: {
        OR: [{ id }, { orderNumber: id }],
      },
      include: {
        items: {
          include: {
            variant: {
              select: {
                id: true,
                sku: true,
                stock: true,
                weight: true,
              },
            },
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
        voucher: {
          select: {
            id: true,
            code: true,
            type: true,
            value: true,
          },
        },
        statusHistory: {
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!order) {
      return NextResponse.json(
        { error: "Không tìm thấy đơn hàng" },
        { status: 404 }
      );
    }

    const formatted = {
      ...order,
      subtotal: Number(order.subtotal),
      shippingFee: Number(order.shippingFee),
      discountAmount: Number(order.discountAmount),
      total: Number(order.total),
      items: order.items.map((it) => ({
        ...it,
        price: Number(it.price),
      })),
    };

    return NextResponse.json({ order: formatted });
  } catch (error) {
    console.error("Lỗi khi lấy chi tiết đơn hàng:", error);
    return NextResponse.json(
      { error: "Lỗi hệ thống khi tải đơn hàng" },
      { status: 500 }
    );
  }
}
