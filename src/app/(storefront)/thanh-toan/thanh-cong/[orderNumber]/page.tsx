import { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { OrderSuccessView } from "@/components/storefront/checkout/OrderSuccessView";

interface PageProps {
  params: Promise<{
    orderNumber: string;
  }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { orderNumber } = await params;
  return {
    title: `Đơn hàng #${orderNumber} thành công | THUYNGA Shop`,
    description: `Chi tiết xác nhận đơn hàng #${orderNumber} tại THUYNGA Shop.`,
    robots: {
      index: false,
      follow: false,
    },
  };
}

export default async function OrderSuccessPage({ params }: PageProps) {
  const { orderNumber } = await params;

  const order = await prisma.order.findUnique({
    where: { orderNumber },
    include: {
      items: true,
    },
  });

  if (!order) {
    notFound();
  }

  // Chuyển đổi dữ liệu Decimal thành number để an toàn render phía client
  const serializedOrder = {
    orderNumber: order.orderNumber,
    recipientName: order.recipientName,
    recipientPhone: order.recipientPhone,
    shippingAddress: order.shippingAddress,
    subtotal: Number(order.subtotal),
    shippingFee: Number(order.shippingFee),
    discountAmount: Number(order.discountAmount),
    total: Number(order.total),
    paymentMethod: order.paymentMethod as "COD" | "VIETQR",
    paymentStatus: order.paymentStatus,
    orderStatus: order.orderStatus,
    transferCode: order.transferCode,
    createdAt: order.createdAt.toISOString(),
    items: order.items.map((item) => ({
      id: item.id,
      productName: item.productName,
      variantName: item.variantName,
      sku: item.sku,
      price: Number(item.price),
      quantity: item.quantity,
      image: item.image,
    })),
  };

  return <OrderSuccessView order={serializedOrder} />;
}
