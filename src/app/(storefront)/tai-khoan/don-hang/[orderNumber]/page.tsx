import { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { OrderDetailView } from "@/components/storefront/account/OrderDetailView";

interface PageProps {
  params: Promise<{
    orderNumber: string;
  }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { orderNumber } = await params;
  return {
    title: `Chi tiết đơn hàng #${orderNumber} | THUYNGA Shop`,
    description: `Xem trạng thái và tiến trình vận chuyển đơn hàng #${orderNumber}.`,
    robots: {
      index: false,
      follow: false,
    },
  };
}

export default async function OrderDetailPage({ params }: PageProps) {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/dang-nhap?callbackUrl=/tai-khoan/don-hang");
  }

  const { orderNumber } = await params;

  const order = await prisma.order.findUnique({
    where: { orderNumber },
    include: {
      items: true,
      statusHistory: {
        orderBy: { createdAt: "asc" },
      },
    },
  });

  if (!order) {
    notFound();
  }

  // Bảo vệ: Chỉ chủ sở hữu đơn hàng hoặc Admin mới xem được
  if (order.userId !== session.user.id && session.user.role !== "ADMIN") {
    notFound();
  }

  const serializedOrder = {
    id: order.id,
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
    note: order.note,
    createdAt: order.createdAt.toISOString(),
    items: order.items.map((it) => ({
      id: it.id,
      variantId: it.variantId,
      productName: it.productName,
      variantName: it.variantName,
      sku: it.sku,
      price: Number(it.price),
      quantity: it.quantity,
      image: it.image,
    })),
    statusHistory: order.statusHistory.map((sh) => ({
      id: sh.id,
      status: sh.status,
      note: sh.note,
      createdAt: sh.createdAt.toISOString(),
    })),
  };

  return <OrderDetailView order={serializedOrder} />;
}
