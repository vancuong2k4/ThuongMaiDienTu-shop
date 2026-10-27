import { Metadata } from "next";
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

export default function CheckoutPage() {
  return <CheckoutClient />;
}
