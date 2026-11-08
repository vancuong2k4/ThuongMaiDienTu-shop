// ============================================================
// app/(admin)/admin/don-hang/[orderNumber]/page.tsx
// Trang Chi Tiết Đơn Hàng & Thao Tác Quản Trị CMS
// ============================================================

import React from "react";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { AdminPageHeader } from "@/components/admin/ui/AdminPageHeader";
import { OrderDetailView, type OrderDetailData } from "@/components/admin/orders/OrderDetailView";
import { OrderPackingSlip } from "@/components/admin/orders/OrderPackingSlip";

interface OrderDetailPageProps {
  params: Promise<{ orderNumber: string }>;
  searchParams: Promise<{ print?: string }>;
}

export async function generateMetadata({ params }: OrderDetailPageProps) {
  const { orderNumber } = await params;
  return {
    title: `Đơn Hàng ${orderNumber} | Admin THUYNGA Shop`,
  };
}

export default async function AdminOrderDetailPage({
  params,
  searchParams,
}: OrderDetailPageProps) {
  const { orderNumber } = await params;
  const { print } = await searchParams;

  const order = await prisma.order.findFirst({
    where: {
      OR: [{ orderNumber }, { id: orderNumber }],
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
    statusHistory: order.statusHistory.map((sh) => ({
      ...sh,
      createdAt: sh.createdAt,
    })),
  };

  // Nếu có query param ?print=true -> Hiển thị trực tiếp mẫu in
  if (print === "true") {
    return <OrderPackingSlip order={formattedOrder} />;
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title={`Chi Tiết Đơn Hàng: ${order.orderNumber}`}
        description={`Đặt lúc ${new Date(order.createdAt).toLocaleDateString("vi-VN", {
          hour: "2-digit",
          minute: "2-digit",
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        })} bởi ${order.recipientName}`}
        breadcrumbs={[
          { label: "Đơn hàng", href: "/admin/don-hang" },
          { label: order.orderNumber },
        ]}
      />

      <OrderDetailView order={formattedOrder} />
    </div>
  );
}
