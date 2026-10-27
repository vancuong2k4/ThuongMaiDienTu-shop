// ============================================================
// components/storefront/checkout/CheckoutClient.tsx
// Trang thanh toán chính: Điền thông tin, chọn địa chỉ, chọn PTTT và gửi đơn
// ============================================================

"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/store/cart";
import { AddressSelector } from "./AddressSelector";
import { PaymentMethodSelector, PaymentMethodType } from "./PaymentMethodSelector";
import {
  ShieldCheck,
  ChevronRight,
  User,
  Phone,
  FileText,
  AlertCircle,
  Loader2,
  ArrowLeft,
  ShoppingBag,
  Tag,
  CheckCircle,
} from "lucide-react";

interface CheckoutClientProps {
  user: {
    id: string;
    name: string;
    email: string;
    phone?: string;
    defaultAddress?: {
      province: string;
      district: string;
      ward: string;
      street: string;
    };
  };
}

export const CheckoutClient: React.FC<CheckoutClientProps> = ({ user }) => {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  // Zustand Store
  const items = useCartStore((s) => s.items);
  const appliedVoucher = useCartStore((s) => s.appliedVoucher);
  const subtotal = useCartStore((s) => s.subtotal);
  const shippingFee = useCartStore((s) => s.shippingFee);
  const discountAmount = useCartStore((s) => s.discountAmount);
  const totalPrice = useCartStore((s) => s.totalPrice);
  const clearCart = useCartStore((s) => s.clearCart);

  // Form State (điền trước thông tin từ tài khoản đã đăng nhập)
  const [recipientName, setRecipientName] = useState(user.name || "");
  const [recipientPhone, setRecipientPhone] = useState(user.phone || "");
  const [province, setProvince] = useState(user.defaultAddress?.province || "");
  const [district, setDistrict] = useState(user.defaultAddress?.district || "");
  const [ward, setWard] = useState(user.defaultAddress?.ward || "");
  const [addressDetail, setAddressDetail] = useState(user.defaultAddress?.street || "");
  const [note, setNote] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodType>("VIETQR");

  // Submission State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-[500px] flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#800028]" />
      </div>
    );
  }

  // Nếu giỏ hàng trống
  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-amber-50 flex items-center justify-center text-amber-600">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <h2 className="text-2xl font-bold text-neutral-800 mb-2">
          Giỏ hàng của bạn đang trống
        </h2>
        <p className="text-neutral-500 mb-6 text-sm">
          Vui lòng thêm sản phẩm vào giỏ hàng trước khi tiến hành thanh toán.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-[#800028] text-white font-semibold text-sm hover:bg-[#60001e] transition-colors shadow-sm"
        >
          <ArrowLeft className="w-4 h-4" /> Quay lại mua sắm
        </Link>
      </div>
    );
  }

  const calculatedSub = subtotal();
  const calculatedShip = shippingFee();
  const calculatedDiscount = discountAmount();
  const finalTotal = totalPrice();

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Validate client-side
    if (!recipientName.trim()) {
      setErrorMessage("Vui lòng nhập họ và tên người nhận hàng.");
      return;
    }

    const cleanPhone = recipientPhone.trim().replace(/[\s.-]/g, "");
    const phoneRegex = /(84|0[3|5|7|8|9])+([0-9]{8})\b/;
    if (!phoneRegex.test(cleanPhone)) {
      setErrorMessage("Vui lòng nhập số điện thoại hợp lệ (10 chữ số).");
      return;
    }

    if (!province || !district || !ward || !addressDetail.trim()) {
      setErrorMessage("Vui lòng cung cấp đầy đủ địa chỉ giao hàng (Tỉnh, Huyện, Xã, Địa chỉ cụ thể).");
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        recipientName: recipientName.trim(),
        recipientPhone: cleanPhone,
        province,
        district,
        ward,
        addressDetail: addressDetail.trim(),
        note: note.trim() || undefined,
        paymentMethod,
        voucherCode: appliedVoucher?.code || undefined,
        items: items.map((it) => ({
          variantId: it.variantId,
          quantity: it.quantity,
        })),
      };

      const res = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Không thể tạo đơn hàng. Vui lòng thử lại.");
      }

      // Xóa giỏ hàng sau khi đặt thành công
      clearCart();

      // Chuyển hướng sang trang thành công
      const orderNumber = data.order.orderNumber;
      router.push(`/thanh-toan/thanh-cong/${orderNumber}`);
    } catch (err: unknown) {
      console.error(err);
      setErrorMessage(
        err instanceof Error ? err.message : "Đã có lỗi xảy ra khi tạo đơn hàng."
      );
      setIsSubmitting(false);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-neutral-500 mb-6">
        <Link href="/" className="hover:text-neutral-900 transition-colors">
          Trang chủ
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-neutral-400" />
        <Link href="/gio-hang" className="hover:text-neutral-900 transition-colors">
          Giỏ hàng
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-neutral-400" />
        <span className="text-neutral-900 font-semibold">Thanh toán</span>
      </nav>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 tracking-tight">
          Thông tin thanh toán
        </h1>
        <p className="text-sm text-neutral-500 mt-1">
          Hoàn tất đơn hàng của bạn với địa chỉ nhận và phương thức thanh toán an toàn.
        </p>
      </div>

      {/* Error Alert */}
      {errorMessage && (
        <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 flex items-start gap-3 animate-shake">
          <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
          <div className="flex-1">
            <h4 className="font-semibold text-sm">Chưa thể đặt hàng</h4>
            <p className="text-xs mt-0.5 text-red-700 leading-relaxed">
              {errorMessage}
            </p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmitOrder}>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* CỘT TRÁI: THÔNG TIN GIAO HÀNG & THANH TOÁN (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Banner tài khoản đã đăng nhập */}
            <div className="bg-emerald-50/70 border border-emerald-200/90 rounded-2xl p-4 flex items-center justify-between text-xs shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-sm shrink-0">
                  {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                </div>
                <div>
                  <div className="flex items-center gap-1.5 font-bold text-neutral-900">
                    <span>Tài khoản đặt hàng:</span>
                    <span className="text-emerald-800">{user.name}</span>
                  </div>
                  <p className="text-[11px] text-neutral-500">{user.email}</p>
                </div>
              </div>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-semibold shrink-0">
                <CheckCircle className="w-3.5 h-3.5" /> Đã xác thực
              </span>
            </div>

            {/* Box 1: Thông tin người nhận */}
            <div className="bg-white rounded-2xl border border-neutral-200 p-5 sm:p-6 shadow-sm space-y-4">
              <div className="flex items-center gap-2 text-neutral-900 font-semibold border-b border-neutral-100 pb-3">
                <User className="w-5 h-5 text-[#800028]" />
                <span>Thông tin người nhận hàng</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-neutral-700 mb-1">
                    Họ và tên <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Ví dụ: Nguyễn Văn A"
                      value={recipientName}
                      onChange={(e) => setRecipientName(e.target.value)}
                      disabled={isSubmitting}
                      className="w-full h-11 pl-3.5 pr-3 text-sm bg-white border border-neutral-300 rounded-lg focus:outline-none focus:border-[#800028] focus:ring-1 focus:ring-[#800028] transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-700 mb-1">
                    Số điện thoại <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="tel"
                      placeholder="Ví dụ: 0912345678"
                      value={recipientPhone}
                      onChange={(e) => setRecipientPhone(e.target.value)}
                      disabled={isSubmitting}
                      className="w-full h-11 pl-3.5 pr-3 text-sm bg-white border border-neutral-300 rounded-lg focus:outline-none focus:border-[#800028] focus:ring-1 focus:ring-[#800028] transition-colors"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Box 2: Địa chỉ nhận hàng */}
            <div className="bg-white rounded-2xl border border-neutral-200 p-5 sm:p-6 shadow-sm">
              <AddressSelector
                province={province}
                district={district}
                ward={ward}
                addressDetail={addressDetail}
                onProvinceChange={setProvince}
                onDistrictChange={setDistrict}
                onWardChange={setWard}
                onAddressDetailChange={setAddressDetail}
                disabled={isSubmitting}
              />
            </div>

            {/* Box 3: Phương thức thanh toán */}
            <div className="bg-white rounded-2xl border border-neutral-200 p-5 sm:p-6 shadow-sm">
              <PaymentMethodSelector
                value={paymentMethod}
                onChange={setPaymentMethod}
                disabled={isSubmitting}
              />
            </div>

            {/* Box 4: Ghi chú đơn hàng */}
            <div className="bg-white rounded-2xl border border-neutral-200 p-5 sm:p-6 shadow-sm space-y-3">
              <div className="flex items-center gap-2 text-neutral-900 font-semibold border-b border-neutral-100 pb-2">
                <FileText className="w-5 h-5 text-[#800028]" />
                <span>Ghi chú đơn hàng (tùy chọn)</span>
              </div>
              <textarea
                rows={3}
                placeholder="Ví dụ: Giao giờ hành chính, gọi trước khi giao 15 phút..."
                value={note}
                onChange={(e) => setNote(e.target.value)}
                disabled={isSubmitting}
                className="w-full p-3 text-sm bg-white border border-neutral-300 rounded-lg focus:outline-none focus:border-[#800028] focus:ring-1 focus:ring-[#800028] transition-colors resize-none"
              />
            </div>
          </div>

          {/* CỘT PHẢI: TÓM TẮT ĐƠN HÀNG & NÚT ĐẶT HÀNG (5 cols) */}
          <div className="lg:col-span-5 space-y-5">
            <div className="bg-white rounded-2xl border border-neutral-200 p-5 sm:p-6 shadow-sm sticky top-24">
              <div className="flex items-center justify-between border-b border-neutral-100 pb-4 mb-4">
                <h3 className="text-base font-bold text-neutral-900">
                  Đơn hàng của bạn ({items.reduce((s, i) => s + i.quantity, 0)} món)
                </h3>
                <Link
                  href="/gio-hang"
                  className="text-xs text-[#800028] hover:underline font-medium"
                >
                  Sửa giỏ hàng
                </Link>
              </div>

              {/* Danh sách items rút gọn */}
              <div className="max-h-64 overflow-y-auto divide-y divide-neutral-100 pr-1 -mr-1 mb-4">
                {items.map((item) => (
                  <div key={item.variantId} className="py-3 flex gap-3 items-center">
                    <div className="relative w-14 h-14 rounded-lg bg-neutral-100 border border-neutral-200 overflow-hidden shrink-0">
                      {item.image ? (
                        <Image
                          src={item.image}
                          alt={item.productName}
                          fill
                          className="object-cover"
                          sizes="56px"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-neutral-400">
                          <ShoppingBag className="w-5 h-5" />
                        </div>
                      )}
                      <span className="absolute bottom-0 right-0 bg-[#800028] text-white text-[10px] font-bold px-1.5 py-0.2 rounded-tl">
                        x{item.quantity}
                      </span>
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-neutral-900 line-clamp-1">
                        {item.productName}
                      </p>
                      <p className="text-[11px] text-neutral-500 mt-0.5">
                        Phân loại: {item.variantName}
                      </p>
                      <p className="text-xs font-bold text-[#800028] mt-1">
                        {(item.price * item.quantity).toLocaleString("vi-VN")}₫
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Voucher đang áp dụng */}
              {appliedVoucher && (
                <div className="mb-4 p-3 bg-amber-50 rounded-xl border border-amber-200/80 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <Tag className="w-4 h-4 text-amber-600" />
                    <div>
                      <span className="font-bold text-amber-900">
                        {appliedVoucher.code}
                      </span>
                      <p className="text-[10px] text-amber-700">
                        {appliedVoucher.description}
                      </p>
                    </div>
                  </div>
                  <span className="font-semibold text-emerald-700">
                    -{calculatedDiscount.toLocaleString("vi-VN")}₫
                  </span>
                </div>
              )}

              {/* Bảng tính chi phí */}
              <div className="space-y-2.5 pt-3 border-t border-neutral-100 text-xs text-neutral-600">
                <div className="flex justify-between">
                  <span>Tạm tính hàng hóa:</span>
                  <span className="font-semibold text-neutral-900">
                    {calculatedSub.toLocaleString("vi-VN")}₫
                  </span>
                </div>

                <div className="flex justify-between">
                  <span>Phí vận chuyển toàn quốc:</span>
                  <span className="font-semibold text-neutral-900">
                    {calculatedShip === 0 ? (
                      <span className="text-emerald-600 font-bold">MIỄN PHÍ</span>
                    ) : (
                      `${calculatedShip.toLocaleString("vi-VN")}₫`
                    )}
                  </span>
                </div>

                {calculatedDiscount > 0 && (
                  <div className="flex justify-between text-emerald-700 font-medium">
                    <span>Giảm giá từ ưu đãi:</span>
                    <span>-{calculatedDiscount.toLocaleString("vi-VN")}₫</span>
                  </div>
                )}

                <div className="pt-3 border-t border-neutral-200 flex justify-between items-baseline">
                  <span className="text-sm font-bold text-neutral-900">
                    Tổng thanh toán:
                  </span>
                  <div className="text-right">
                    <span className="text-xl sm:text-2xl font-black text-[#800028]">
                      {finalTotal.toLocaleString("vi-VN")}₫
                    </span>
                    <p className="text-[10px] text-neutral-400 mt-0.5">
                      (Đã bao gồm VAT & phí giao hàng)
                    </p>
                  </div>
                </div>
              </div>

              {/* Nút đặt hàng */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full mt-6 py-3.5 px-4 rounded-xl bg-gradient-to-r from-[#800028] to-[#9b0032] hover:from-[#660020] hover:to-[#800028] text-white font-bold text-base shadow-lg shadow-[#800028]/25 hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Đang xử lý đơn hàng...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-5 h-5" />
                    <span>Xác nhận đặt hàng</span>
                  </>
                )}
              </button>

              {/* Cam kết thương hiệu */}
              <div className="mt-5 pt-4 border-t border-neutral-100 space-y-2 text-[11px] text-neutral-500">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>100% hàng nhập khẩu chính ngạch, hóa đơn đầy đủ</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Cam kết bồi hoàn 200% nếu phát hiện hàng không chính hãng</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Đổi trả miễn phí trong 7 ngày nếu lỗi từ nhà sản xuất</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
