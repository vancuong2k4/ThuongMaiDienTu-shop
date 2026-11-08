// ============================================================
// app/(admin)/admin/don-hang/[orderNumber]/in/page.tsx
// Trang In Phiếu Đóng Gói (Packing Slip) Chuẩn In Ấn
// ============================================================

import React from "react";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { OrderPackingSlip } from "@/components/admin/orders/OrderPackingSlip";
import type { OrderDetailData } from "@/components/admin/orders/OrderDetailView";

interface PrintPageProps {
  params: Promise<{ orderNumber: string }>;
}

export async function generateMetadata({ params }: PrintPageProps) {
  const { orderNumber } = await params;
  return {
    title: `In Phiếu Đóng Gói - ${orderNumber} | THUYNGA Shop`,
  };
}

export default async function AdminOrderPrintPage({ params }: PrintPageProps) {
  const { orderNumber } = await params;

  const order = await prisma.order.findFirst({
    where: {
      OR: [{ orderNumber }, { id: orderNumber }],
    },
    include: {
      items: true,
      voucher: true,
      user: true,
      statusHistory: {
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!order) {
    notFound();
  }

  const formattedOrder: OrderDetailData = {
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
    voucher: order.voucher
      ? {
          id: order.voucher.id,
          code: order.voucher.code,
          type: order.voucher.type,
          value: Number(order.voucher.value),
        }
      : null,
    items: order.items.map((it) => ({
      ...it,
      price: Number(it.price),
    })),
    statusHistory: order.statusHistory,
  };

  return <OrderPackingSlip order={formattedOrder} />;
}
