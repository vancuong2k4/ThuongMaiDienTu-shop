// ============================================================
// app/api/admin/orders/route.ts
// API Danh sách & Lọc Đơn hàng Admin CMS
// ============================================================

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { OrderStatus, PaymentStatus, PaymentMethod, Prisma } from "@prisma/client";

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
    const limit = Math.max(1, Math.min(100, parseInt(searchParams.get("limit") || "10")));
    const skip = (page - 1) * limit;

    const search = searchParams.get("search")?.trim() || "";
    const status = searchParams.get("status") || "all";
    const paymentStatus = searchParams.get("paymentStatus") || "all";
    const paymentMethod = searchParams.get("paymentMethod") || "all";
    const sortBy = searchParams.get("sortBy") || "createdAt_desc";

    // ── Xây dựng điều kiện lọc ──────────────────────────────────
    const where: Prisma.OrderWhereInput = {};

    if (search) {
      where.OR = [
        { orderNumber: { contains: search, mode: "insensitive" } },
        { recipientName: { contains: search, mode: "insensitive" } },
        { recipientPhone: { contains: search, mode: "insensitive" } },
      ];
    }

    if (status !== "all" && Object.values(OrderStatus).includes(status as OrderStatus)) {
      where.orderStatus = status as OrderStatus;
    }

    if (
      paymentStatus !== "all" &&
      Object.values(PaymentStatus).includes(paymentStatus as PaymentStatus)
    ) {
      where.paymentStatus = paymentStatus as PaymentStatus;
    }

    if (
      paymentMethod !== "all" &&
      Object.values(PaymentMethod).includes(paymentMethod as PaymentMethod)
    ) {
      where.paymentMethod = paymentMethod as PaymentMethod;
    }

    // Sắp xếp
    let orderBy: Prisma.OrderOrderByWithRelationInput = { createdAt: "desc" };
    if (sortBy === "createdAt_asc") orderBy = { createdAt: "asc" };
    if (sortBy === "total_desc") orderBy = { total: "desc" };
    if (sortBy === "total_asc") orderBy = { total: "asc" };

    // ── Truy vấn song song dữ liệu & đếm số lượng ─────────────
    const [total, orders, statusCounts] = await Promise.all([
      prisma.order.count({ where }),
      prisma.order.findMany({
        where,
        skip,
        take: limit,
        orderBy,
        include: {
          items: {
            select: {
              id: true,
              productName: true,
              variantName: true,
              quantity: true,
              price: true,
              image: true,
            },
          },
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      }),
      // Đếm số lượng theo từng trạng thái để làm badge trên Tab
      prisma.order.groupBy({
        by: ["orderStatus"],
        _count: { id: true },
      }),
    ]);

    // Chuẩn hóa bộ đếm trạng thái
    const countsMap: Record<string, number> = {
      all: 0,
      PENDING: 0,
      CONFIRMED: 0,
      PROCESSING: 0,
      SHIPPING: 0,
      DELIVERED: 0,
      CANCELLED: 0,
      REFUNDED: 0,
    };

    let totalAllOrders = 0;
    statusCounts.forEach((sc) => {
      countsMap[sc.orderStatus] = sc._count.id;
      totalAllOrders += sc._count.id;
    });
    countsMap.all = totalAllOrders;

    // Chuẩn hóa danh sách đơn hàng
    const items = orders.map((order) => {
      const itemCount = order.items.reduce((sum, it) => sum + it.quantity, 0);

      return {
        id: order.id,
        orderNumber: order.orderNumber,
        recipientName: order.recipientName,
        recipientPhone: order.recipientPhone,
        shippingAddress: order.shippingAddress,
        subtotal: Number(order.subtotal),
        shippingFee: Number(order.shippingFee),
        discountAmount: Number(order.discountAmount),
        total: Number(order.total),
        paymentMethod: order.paymentMethod,
        paymentStatus: order.paymentStatus,
        orderStatus: order.orderStatus,
        note: order.note,
        adminNote: order.adminNote,
        transferCode: order.transferCode,
        paidAt: order.paidAt,
        createdAt: order.createdAt,
        updatedAt: order.updatedAt,
        user: order.user,
        itemCount,
        items: order.items.map((it) => ({
          ...it,
          price: Number(it.price),
        })),
      };
    });

    return NextResponse.json({
      items,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
      counts: countsMap,
    });
  } catch (error) {
    console.error("Lỗi khi lấy danh sách đơn hàng:", error);
    return NextResponse.json(
      { error: "Không thể lấy danh sách đơn hàng" },
      { status: 500 }
    );
  }
}
