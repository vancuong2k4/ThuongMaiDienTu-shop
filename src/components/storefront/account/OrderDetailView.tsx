// ============================================================
// components/storefront/account/OrderDetailView.tsx
// Chi tiết đơn hàng với Timeline tiến trình vận chuyển & VietQR
// ============================================================

"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/store/cart";
import {
  Package,
  Calendar,
  Clock,
  Truck,
  CheckCircle2,
  XCircle,
  MapPin,
  CreditCard,
  QrCode,
  Copy,
  Check,
  RotateCcw,
  ArrowLeft,
  ShoppingBag,
  PhoneCall,
  ShieldCheck,
} from "lucide-react";

interface OrderDetailItem {
  id: string;
  variantId: string | null;
  productName: string;
  variantName: string;
  sku: string;
  price: number;
  quantity: number;
  image: string | null;
}

interface StatusHistoryItem {
  id: string;
  status: string;
  note: string | null;
  createdAt: string;
}

interface OrderDetailViewProps {
  order: {
    id: string;
    orderNumber: string;
    recipientName: string;
    recipientPhone: string;
    shippingAddress: string;
    subtotal: number;
    shippingFee: number;
    discountAmount: number;
    total: number;
    paymentMethod: "COD" | "VIETQR";
    paymentStatus: string;
    orderStatus: string;
    transferCode: string | null;
    note: string | null;
    createdAt: string;
    items: OrderDetailItem[];
    statusHistory: StatusHistoryItem[];
  };
}

export const OrderDetailView: React.FC<OrderDetailViewProps> = ({ order }) => {
  const router = useRouter();
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const addItemToCart = useCartStore((s) => s.addItem);

  const bankInfo = {
    bankId: "MB",
    bankName: "MB Bank (Ngân hàng Quân Đội)",
    accountNumber: "0988888888",
    accountName: "NGUYEN THUY NGA",
  };

  const vietQrUrl = `https://img.vietqr.io/image/${bankInfo.bankId}-${
    bankInfo.accountNumber
  }-compact2.png?amount=${order.total}&addInfo=${encodeURIComponent(
    order.transferCode || order.orderNumber
  )}&accountName=${encodeURIComponent(bankInfo.accountName)}`;

  const copyToClipboard = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleReorder = () => {
    order.items.forEach((it) => {
      if (it.variantId) {
        addItemToCart({
          variantId: it.variantId,
          productId: "",
          productName: it.productName,
          variantName: it.variantName,
          sku: it.sku,
          price: it.price,
          stock: 99,
          image: it.image,
          quantity: it.quantity,
        });
      }
    });
    router.push("/gio-hang");
  };

  // Xác định bước tiến trình (0: Chờ duyệt, 1: Đã xác nhận, 2: Đang giao, 3: Đã giao)
  const getTimelineStep = () => {
    switch (order.orderStatus) {
      case "PENDING":
        return 0;
      case "CONFIRMED":
      case "PROCESSING":
        return 1;
      case "SHIPPING":
        return 2;
      case "DELIVERED":
        return 3;
      case "CANCELLED":
      case "REFUNDED":
        return -1;
      default:
        return 0;
    }
  };

  const currentStep = getTimelineStep();

  const formattedCreatedDate = new Date(order.createdAt).toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="space-y-6">
      {/* Nút quay lại & Tiêu đề */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Link
            href="/tai-khoan/don-hang"
            className="w-9 h-9 rounded-xl bg-white border border-neutral-200 flex items-center justify-center text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50 transition-colors shadow-xs"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-lg sm:text-xl font-black text-neutral-900 tracking-tight">
              Chi tiết đơn hàng #{order.orderNumber}
            </h1>
            <p className="text-xs text-neutral-500 mt-0.5">
              Ngày đặt: {formattedCreatedDate}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleReorder}
            className="px-3.5 py-2 rounded-xl border border-[#800028] text-[#800028] text-xs font-bold hover:bg-rose-50 transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Mua lại tất cả</span>
          </button>
        </div>
      </div>

      {/* TIMELINE TIẾN TRÌNH VẬN CHUYỂN */}
      <div className="bg-white rounded-3xl border border-neutral-200/90 shadow-sm p-6">
        <h3 className="font-bold text-sm text-neutral-900 mb-6">
          Trạng thái đơn hàng
        </h3>

        {currentStep === -1 ? (
          <div className="p-4 rounded-2xl bg-neutral-100 text-neutral-700 flex items-center gap-3 text-xs">
            <XCircle className="w-5 h-5 text-red-500 shrink-0" />
            <div>
              <p className="font-bold text-neutral-900">Đơn hàng đã bị hủy</p>
              <p className="text-neutral-500 mt-0.5">
                Rất tiếc đơn hàng này đã được hủy. Mọi sản phẩm đã được hoàn trả lại tồn kho.
              </p>
            </div>
          </div>
        ) : (
          <div className="relative">
            {/* Thanh nối */}
            <div className="absolute top-5 left-6 right-6 h-0.5 bg-neutral-200 hidden sm:block">
              <div
                className="h-full bg-[#800028] transition-all duration-500"
                style={{
                  width: `${(Math.max(0, currentStep) / 3) * 100}%`,
                }}
              />
            </div>

            {/* 4 Mốc trạng thái */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 relative">
              {[
                { title: "Đã đặt hàng", desc: "Đơn hàng mới tạo", icon: Clock, step: 0 },
                { title: "Đã xác nhận", desc: "Đang đóng gói kiện hàng", icon: Package, step: 1 },
                { title: "Đang giao hàng", desc: "Shipper đang giao", icon: Truck, step: 2 },
                { title: "Đã giao thành công", desc: "Kiện hàng đã tới tay bạn", icon: CheckCircle2, step: 3 },
              ].map((st) => {
                const isPassed = currentStep >= st.step;
                const isCurrent = currentStep === st.step;
                const Icon = st.icon;

                return (
                  <div key={st.step} className="flex sm:flex-col items-center sm:text-center gap-3 sm:gap-2">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 z-10 transition-colors ${
                        isPassed
                          ? "bg-[#800028] text-white shadow-md shadow-[#800028]/25"
                          : "bg-neutral-100 text-neutral-400"
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>

                    <div>
                      <p
                        className={`text-xs font-bold ${
                          isCurrent
                            ? "text-[#800028]"
                            : isPassed
                            ? "text-neutral-900"
                            : "text-neutral-400"
                        }`}
                      >
                        {st.title}
                      </p>
                      <p className="text-[11px] text-neutral-400 mt-0.5 hidden sm:block">
                        {st.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* KHỐI VIETQR NẾU CHƯA THANH TOÁN */}
      {order.paymentMethod === "VIETQR" && order.paymentStatus === "PENDING" && currentStep !== -1 && (
        <div className="bg-white rounded-3xl border-2 border-[#800028]/20 p-6 shadow-sm">
          <div className="flex items-center gap-2.5 pb-4 mb-4 border-b border-neutral-100">
            <div className="w-8 h-8 rounded-lg bg-[#800028] text-white flex items-center justify-center">
              <QrCode className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-neutral-900">
                Thanh toán đơn hàng qua VietQR Napas 24/7
              </h3>
              <p className="text-xs text-neutral-500">
                Đơn hàng của bạn đang chờ chuyển khoản để bộ phận kho tiến hành gửi hàng.
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-6 items-center">
            {/* Ảnh QR */}
            <div className="shrink-0 text-center">
              <div className="w-44 h-44 bg-white border border-neutral-200 rounded-2xl p-2 shadow-xs">
                <img
                  src={vietQrUrl}
                  alt="VietQR"
                  className="w-full h-full object-contain rounded-xl"
                />
              </div>
              <span className="inline-block mt-2 text-[10px] text-neutral-500 font-medium">
                Quét bằng app ngân hàng bất kỳ
              </span>
            </div>

            {/* Bảng chi tiết chuyển khoản */}
            <div className="flex-1 w-full space-y-2 text-xs">
              <div className="p-2.5 bg-neutral-50 rounded-xl flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-neutral-500 block">Số tài khoản</span>
                  <span className="font-mono font-bold text-sm text-[#800028]">
                    {bankInfo.accountNumber}
                  </span>
                </div>
                <button
                  onClick={() => copyToClipboard(bankInfo.accountNumber, "stk")}
                  className="px-2 py-1 bg-white border border-neutral-200 rounded text-[11px] font-medium hover:border-[#800028] flex items-center gap-1 cursor-pointer"
                >
                  {copiedField === "stk" ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedField === "stk" ? "Đã chép" : "Sao chép"}</span>
                </button>
              </div>

              <div className="p-2.5 bg-neutral-50 rounded-xl flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-neutral-500 block">Chủ tài khoản</span>
                  <span className="font-bold text-neutral-900">{bankInfo.accountName}</span>
                </div>
              </div>

              <div className="p-2.5 bg-neutral-50 rounded-xl flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-neutral-500 block">Số tiền cần chuyển</span>
                  <span className="font-bold text-[#800028] text-sm">
                    {order.total.toLocaleString("vi-VN")}₫
                  </span>
                </div>
                <button
                  onClick={() => copyToClipboard(order.total.toString(), "amount")}
                  className="px-2 py-1 bg-white border border-neutral-200 rounded text-[11px] font-medium hover:border-[#800028] flex items-center gap-1 cursor-pointer"
                >
                  {copiedField === "amount" ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedField === "amount" ? "Đã chép" : "Sao chép"}</span>
                </button>
              </div>

              <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-xl flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-neutral-600 block font-medium">
                    Nội dung chuyển khoản (bắt buộc)
                  </span>
                  <span className="font-mono font-bold text-[#800028] text-sm">
                    {order.transferCode || order.orderNumber}
                  </span>
                </div>
                <button
                  onClick={() =>
                    copyToClipboard(order.transferCode || order.orderNumber, "code")
                  }
                  className="px-2.5 py-1 bg-[#800028] text-white rounded text-[11px] font-bold hover:bg-[#60001e] flex items-center gap-1 cursor-pointer shadow-xs"
                >
                  {copiedField === "code" ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedField === "code" ? "Đã chép" : "Sao chép"}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2 CỘT THÔNG TIN: GIAO HÀNG & CHI TIẾT SẢN PHẨM */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* CỘT TRÁI: ĐỊA CHỈ & PHƯƠNG THỨC (5 cols) */}
        <div className="lg:col-span-5 space-y-5">
          {/* Thông tin nhận hàng */}
          <div className="bg-white rounded-3xl border border-neutral-200/90 shadow-sm p-5 space-y-3">
            <h3 className="font-bold text-xs text-neutral-900 border-b border-neutral-100 pb-2.5 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#800028]" />
              <span>Địa chỉ nhận hàng</span>
            </h3>

            <div className="text-xs text-neutral-700 space-y-1 leading-relaxed">
              <p className="font-bold text-neutral-900">{order.recipientName}</p>
              <p className="text-neutral-500">Số điện thoại: {order.recipientPhone}</p>
              <p className="text-neutral-600 mt-1">{order.shippingAddress}</p>
            </div>

            {order.note && (
              <div className="pt-2 border-t border-neutral-100 text-[11px] text-neutral-500">
                <span className="font-semibold text-neutral-700">Ghi chú:</span> {order.note}
              </div>
            )}
          </div>

          {/* Phương thức thanh toán */}
          <div className="bg-white rounded-3xl border border-neutral-200/90 shadow-sm p-5 space-y-2 text-xs">
            <h3 className="font-bold text-xs text-neutral-900 border-b border-neutral-100 pb-2.5 flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-[#800028]" />
              <span>Phương thức thanh toán</span>
            </h3>

            <p className="font-semibold text-neutral-800">
              {order.paymentMethod === "VIETQR"
                ? "Chuyển khoản VietQR Napas 24/7"
                : "Thanh toán khi nhận hàng (COD)"}
            </p>
            <p className="text-[11px] text-neutral-500">
              Trạng thái:{" "}
              {order.paymentStatus === "PAID" ? (
                <span className="text-emerald-700 font-bold">Đã thanh toán</span>
              ) : (
                <span className="text-amber-800 font-bold">Chưa thanh toán</span>
              )}
            </p>
          </div>
        </div>

        {/* CỘT PHẢI: DANH SÁCH MÓN HÀNG & BẢNG TIỀN (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-neutral-200/90 shadow-sm p-5 space-y-4">
          <h3 className="font-bold text-xs text-neutral-900 border-b border-neutral-100 pb-2.5 flex items-center gap-2">
            <ShoppingBag className="w-4 h-4 text-[#800028]" />
            <span>Sản phẩm trong đơn ({order.items.reduce((s, it) => s + it.quantity, 0)} món)</span>
          </h3>

          <div className="divide-y divide-neutral-100">
            {order.items.map((it) => (
              <div key={it.id} className="py-3.5 first:pt-0 last:pb-0 flex items-center gap-3">
                <div className="relative w-14 h-14 rounded-xl bg-neutral-100 border border-neutral-200 overflow-hidden shrink-0">
                  {it.image ? (
                    <Image
                      src={it.image}
                      alt={it.productName}
                      fill
                      className="object-cover"
                      sizes="56px"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-neutral-400">
                      <ShoppingBag className="w-5 h-5" />
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-xs text-neutral-900 line-clamp-1">
                    {it.productName}
                  </h4>
                  <p className="text-[11px] text-neutral-500 mt-0.5">
                    Phân loại: {it.variantName}
                  </p>
                  <p className="text-[11px] text-neutral-400">
                    SKU: {it.sku} | Số lượng: x{it.quantity}
                  </p>
                </div>

                <div className="text-right">
                  <span className="text-xs font-bold text-neutral-900">
                    {(it.price * it.quantity).toLocaleString("vi-VN")}₫
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Bảng chi phí */}
          <div className="pt-3 border-t border-neutral-100 space-y-2 text-xs text-neutral-600">
            <div className="flex justify-between">
              <span>Tạm tính hàng hóa:</span>
              <span className="font-semibold text-neutral-900">
                {order.subtotal.toLocaleString("vi-VN")}₫
              </span>
            </div>

            <div className="flex justify-between">
              <span>Phí vận chuyển:</span>
              <span className="font-semibold text-neutral-900">
                {order.shippingFee === 0 ? (
                  <span className="text-emerald-600 font-bold">MIỄN PHÍ</span>
                ) : (
                  `${order.shippingFee.toLocaleString("vi-VN")}₫`
                )}
              </span>
            </div>

            {order.discountAmount > 0 && (
              <div className="flex justify-between text-emerald-700 font-medium">
                <span>Giảm giá từ ưu đãi:</span>
                <span>-{order.discountAmount.toLocaleString("vi-VN")}₫</span>
              </div>
            )}

            <div className="pt-2.5 border-t border-neutral-200 flex justify-between items-baseline font-bold">
              <span className="text-sm text-neutral-900">Tổng thanh toán:</span>
              <span className="text-lg text-[#800028]">
                {order.total.toLocaleString("vi-VN")}₫
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
