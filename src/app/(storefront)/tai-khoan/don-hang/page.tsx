import { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { OrderListClient, UserOrder } from "@/components/storefront/account/OrderListClient";

export const metadata: Metadata = {
  title: "Đơn hàng của tôi | THUYNGA Shop",
  description:
    "Xem lịch sử đơn hàng, theo dõi tình trạng xử lý và tiến trình vận chuyển tại THUYNGA Shop.",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function UserOrdersPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/dang-nhap?callbackUrl=/tai-khoan/don-hang");
  }

  const rawOrders = await prisma.order.findMany({
    where: {
      userId: session.user.id,
    },
    include: {
      items: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const serializedOrders: UserOrder[] = rawOrders.map((o) => ({
    id: o.id,
    orderNumber: o.orderNumber,
    total: Number(o.total),
    subtotal: Number(o.subtotal),
    shippingFee: Number(o.shippingFee),
    discountAmount: Number(o.discountAmount),
    paymentMethod: o.paymentMethod as "COD" | "VIETQR",
    paymentStatus: o.paymentStatus,
    orderStatus: o.orderStatus,
    createdAt: o.createdAt.toISOString(),
    items: o.items.map((it) => ({
      id: it.id,
      variantId: it.variantId,
      productName: it.productName,
      variantName: it.variantName,
      sku: it.sku,
      price: Number(it.price),
      quantity: it.quantity,
      image: it.image,
    })),
  }));

  return <OrderListClient initialOrders={serializedOrders} />;
}
