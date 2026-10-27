// ============================================================
// components/storefront/checkout/OrderSuccessView.tsx
// Giao diện xác nhận đơn hàng thành công kèm VietQR tự động & nút sao chép
// ============================================================

"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { VietQRCard } from "./VietQRCard";
import {
  CheckCircle2,
  Copy,
  Check,
  QrCode,
  Truck,
  ArrowRight,
  ShoppingBag,
  Clock,
  PhoneCall,
  ShieldCheck,
} from "lucide-react";

interface OrderItemView {
  id: string;
  productName: string;
  variantName: string;
  sku: string;
  price: number;
  quantity: number;
  image: string | null;
}

interface OrderSuccessViewProps {
  order: {
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
    createdAt: string;
    items: OrderItemView[];
  };
}

export const OrderSuccessView: React.FC<OrderSuccessViewProps> = ({ order }) => {
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const bankInfo = {
    bankId: "MB",
    bankName: "MB Bank (Ngân hàng TMCP Quân Đội)",
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
    setTimeout(() => {
      setCopiedField(null);
    }, 2000);
  };

  const formattedDate = new Date(order.createdAt).toLocaleDateString("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Banner Thành công */}
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-3 shadow-inner">
          <CheckCircle2 className="w-10 h-10 text-emerald-600" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-900">
          Đặt hàng thành công!
        </h1>
        <p className="text-sm text-neutral-500 mt-1">
          Cảm ơn bạn đã tin tưởng mua sắm tại{" "}
          <span className="font-semibold text-[#800028]">THUYNGA Shop</span>.
        </p>
        <div className="mt-3 inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-neutral-100 text-xs font-mono font-medium text-neutral-800">
          <span>Mã đơn hàng:</span>
          <span className="font-bold text-[#800028]">{order.orderNumber}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* CỘT TRÁI: KHỐI THANH TOÁN (VIETQR HOẶC COD) (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {order.paymentMethod === "VIETQR" ? (
            <VietQRCard
              amount={order.total}
              transferCode={order.transferCode || order.orderNumber}
              orderNumber={order.orderNumber}
            />
          ) : (
            <div className="bg-white rounded-2xl border border-neutral-200 p-6 shadow-sm space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
                  <Truck className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="font-bold text-base text-neutral-900">
                    Thanh toán khi nhận hàng (COD)
                  </h2>
                  <p className="text-xs text-neutral-500">
                    Thanh toán bằng tiền mặt trực tiếp cho nhân viên giao hàng
                  </p>
                </div>
              </div>

              <div className="p-4 bg-neutral-50 rounded-xl border border-neutral-200 space-y-2 text-xs text-neutral-700">
                <p>
                  Đơn hàng của bạn sẽ được đội ngũ kho THUYNGA Shop kiểm tra, đóng gói cẩn thận và gửi tới đơn vị vận chuyển hỏa tốc.
                </p>
                <p className="font-medium text-neutral-900">
                  Số tiền cần thanh toán cho shipper khi nhận hàng:{" "}
                  <span className="text-[#800028] font-bold text-sm">
                    {order.total.toLocaleString("vi-VN")}₫
                  </span>
                </p>
              </div>

              <div className="flex items-center gap-2 text-xs text-emerald-700 font-medium">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Được quyền kiểm tra ngoại quan sản phẩm trước khi thanh toán.</span>
              </div>
            </div>
          )}

          {/* Thông tin giao hàng */}
          <div className="bg-white rounded-2xl border border-neutral-200 p-5 sm:p-6 shadow-sm space-y-3">
            <h3 className="font-bold text-sm text-neutral-900 border-b border-neutral-100 pb-2">
              Thông tin nhận hàng
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-neutral-600">
              <div>
                <span className="text-neutral-400 block">Người nhận:</span>
                <span className="font-semibold text-neutral-900">
                  {order.recipientName}
                </span>
              </div>
              <div>
                <span className="text-neutral-400 block">Số điện thoại:</span>
                <span className="font-semibold text-neutral-900">
                  {order.recipientPhone}
                </span>
              </div>
              <div className="sm:col-span-2">
                <span className="text-neutral-400 block">Địa chỉ nhận hàng:</span>
                <span className="font-medium text-neutral-800">
                  {order.shippingAddress}
                </span>
              </div>
              <div>
                <span className="text-neutral-400 block">Thời gian đặt:</span>
                <span className="font-medium text-neutral-700">
                  {formattedDate}
                </span>
              </div>
              <div>
                <span className="text-neutral-400 block">Trạng thái đơn:</span>
                <span className="inline-block px-2 py-0.5 rounded bg-amber-100 text-amber-800 font-bold text-[10px]">
                  Chờ xác nhận
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* CỘT PHẢI: CHI TIẾT SẢN PHẨM & TỔNG TIỀN (5 cols) */}
        <div className="lg:col-span-5 space-y-5">
          <div className="bg-white rounded-2xl border border-neutral-200 p-5 sm:p-6 shadow-sm">
            <h3 className="font-bold text-sm text-neutral-900 border-b border-neutral-100 pb-3 mb-3">
              Chi tiết sản phẩm ({order.items.reduce((s, i) => s + i.quantity, 0)} món)
            </h3>

            {/* Danh sách món */}
            <div className="divide-y divide-neutral-100 max-h-72 overflow-y-auto pr-1">
              {order.items.map((item) => (
                <div key={item.id} className="py-3 flex gap-3 items-center">
                  <div className="relative w-12 h-12 rounded-lg bg-neutral-100 border border-neutral-200 overflow-hidden shrink-0">
                    {item.image ? (
                      <Image
                        src={item.image}
                        alt={item.productName}
                        fill
                        className="object-cover"
                        sizes="48px"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-neutral-400">
                        <ShoppingBag className="w-4 h-4" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-neutral-900 line-clamp-1">
                      {item.productName}
                    </p>
                    <p className="text-[11px] text-neutral-500">
                      {item.variantName} × {item.quantity}
                    </p>
                  </div>
                  <div className="text-xs font-semibold text-neutral-900">
                    {(item.price * item.quantity).toLocaleString("vi-VN")}₫
                  </div>
                </div>
              ))}
            </div>

            {/* Bảng chi phí */}
            <div className="pt-4 border-t border-neutral-100 space-y-2 text-xs text-neutral-600">
              <div className="flex justify-between">
                <span>Tạm tính hàng:</span>
                <span>{order.subtotal.toLocaleString("vi-VN")}₫</span>
              </div>
              <div className="flex justify-between">
                <span>Phí vận chuyển:</span>
                <span>
                  {order.shippingFee === 0 ? (
                    <span className="text-emerald-600 font-bold">MIỄN PHÍ</span>
                  ) : (
                    `${order.shippingFee.toLocaleString("vi-VN")}₫`
                  )}
                </span>
              </div>
              {order.discountAmount > 0 && (
                <div className="flex justify-between text-emerald-700">
                  <span>Giảm giá:</span>
                  <span>-{order.discountAmount.toLocaleString("vi-VN")}₫</span>
                </div>
              )}
              <div className="pt-2 border-t border-neutral-200 flex justify-between items-baseline font-bold">
                <span className="text-neutral-900 text-sm">Tổng cộng:</span>
                <span className="text-lg text-[#800028]">
                  {order.total.toLocaleString("vi-VN")}₫
                </span>
              </div>
            </div>

            {/* Nút hành động */}
            <div className="mt-6 pt-4 border-t border-neutral-100 space-y-3">
              <Link
                href="/"
                className="w-full py-3 px-4 rounded-xl bg-[#800028] hover:bg-[#60001e] text-white font-semibold text-sm transition-colors shadow-sm flex items-center justify-center gap-2"
              >
                <span>Tiếp tục mua sắm</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <div className="text-center text-xs text-neutral-500 flex items-center justify-center gap-1.5 pt-1">
                <PhoneCall className="w-3.5 h-3.5 text-[#800028]" />
                <span>Hỗ trợ đơn hàng: </span>
                <span className="font-bold text-neutral-800">0988.888.888</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
