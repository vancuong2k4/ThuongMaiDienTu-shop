import { Metadata } from "next";
import { CartPageClient } from "@/components/storefront/cart/CartPageClient";

export const metadata: Metadata = {
  title: "Giỏ hàng của bạn | THUYNGA Shop",
  description:
    "Xem lại các sản phẩm bạn đã chọn tại THUYNGA Shop. Đổi trả 7 ngày, miễn phí vận chuyển cho đơn từ 500.000₫, 100% hàng nhập khẩu chính ngạch.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function CartPage() {
  return <CartPageClient />;
}
