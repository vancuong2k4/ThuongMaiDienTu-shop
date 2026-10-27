import { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { CheckoutClient } from "@/components/storefront/checkout/CheckoutClient";

export const metadata: Metadata = {
  title: "Thanh toán đơn hàng | THUYNGA Shop",
  description:
    "Hoàn tất đặt hàng tại THUYNGA Shop. Hỗ trợ thanh toán COD và chuyển khoản VietQR Napas 24/7 siêu tiện lợi.",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function CheckoutPage() {
  // 1. Bắt buộc kiểm tra đăng nhập trước khi vào trang thanh toán
  const session = await auth();

  if (!session?.user) {
    redirect("/dang-nhap?callbackUrl=/thanh-toan");
  }

  // 2. Lấy thông tin người dùng từ cơ sở dữ liệu
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      addresses: {
        where: { isDefault: true },
        take: 1,
      },
    },
  });

  const defaultAddress = user?.addresses[0] || null;

  return (
    <CheckoutClient
      user={{
        id: session.user.id || "",
        name: user?.name || session.user.name || "",
        email: user?.email || session.user.email || "",
        phone: user?.phone || "",
        defaultAddress: defaultAddress
          ? {
              province: defaultAddress.province,
              district: defaultAddress.district,
              ward: defaultAddress.ward,
              street: defaultAddress.street,
            }
          : undefined,
      }}
    />
  );
}
