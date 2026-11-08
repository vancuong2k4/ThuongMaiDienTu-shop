"use client";

// ============================================================
// components/admin/orders/OrderPackingSlip.tsx
// Mẫu In Phiếu Đóng Gói / Giao Hàng Chuẩn In Ấn (Packing Slip)
// ============================================================

import React from "react";
import { formatCurrency, formatDateTime } from "@/lib/utils";
import { Printer, ArrowLeft } from "lucide-react";
import Link from "next/link";
import type { OrderDetailData } from "./OrderDetailView";

interface OrderPackingSlipProps {
  order: OrderDetailData;
}

export const OrderPackingSlip: React.FC<OrderPackingSlipProps> = ({ order }) => {
  const handlePrint = () => {
    window.print();
  };

  let parsedAddress: {
    addressDetail?: string;
    ward?: string;
    district?: string;
    province?: string;
  } = {};
  try {
    parsedAddress = JSON.parse(order.shippingAddress);
  } catch {
    // raw text
  }

  const fullAddress = parsedAddress.addressDetail
    ? `${parsedAddress.addressDetail}, ${parsedAddress.ward || ""}, ${parsedAddress.district || ""}, ${parsedAddress.province || ""}`
    : order.shippingAddress;

  const isPaid = order.paymentStatus === "PAID";

  return (
    <div className="min-h-screen bg-slate-100 py-6 print:bg-white print:py-0 text-slate-900">
      {/* ── Top Bar (Hidden when printing) ───────────────────────── */}
      <div className="max-w-3xl mx-auto px-4 mb-4 flex items-center justify-between print:hidden">
        <Link
          href={`/admin/don-hang/${order.orderNumber}`}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-wine-800 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Quay lại chi tiết đơn hàng</span>
        </Link>

        <button
          type="button"
          onClick={handlePrint}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-wine-800 hover:bg-wine-900 text-white text-xs font-bold shadow-md transition-all"
        >
          <Printer className="w-4 h-4" />
          <span>In Phiếu Đóng Gói (Print)</span>
        </button>
      </div>

      {/* ── Printable Paper (A4 / A5) ────────────────────────────── */}
      <div className="max-w-3xl mx-auto bg-white p-8 sm:p-10 shadow-lg rounded-2xl print:shadow-none print:rounded-none print:p-6 border border-slate-200 print:border-none font-sans text-xs">
        {/* Header Thương Hiệu */}
        <div className="flex items-start justify-between border-b-2 border-slate-900 pb-4 mb-6">
          <div>
            <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
              THUYNGA SHOP
            </h1>
            <p className="text-[11px] text-slate-600 mt-0.5 font-medium">
              Chuyên Hàng Nhập Khẩu Chính Hãng Cao Cấp
            </p>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Hotline: 0988.888.888 | Website: thuyngashop.com.vn
            </p>
          </div>

          <div className="text-right">
            <h2 className="text-base font-extrabold text-slate-900 uppercase">
              PHIẾU ĐÓNG GÓI & GIAO HÀNG
            </h2>
            <p className="text-xs font-mono font-bold text-wine-800 mt-1">
              MÃ ĐƠN: {order.orderNumber}
            </p>
            <p className="text-[10px] text-slate-500 mt-0.5">
              Ngày đặt: {formatDateTime(order.createdAt)}
            </p>
          </div>
        </div>

        {/* Thông Tin Người Nhận & Giao Hàng */}
        <div className="grid grid-cols-2 gap-6 p-4 rounded-xl border border-slate-200 bg-slate-50/50 mb-6">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
              Người Nhận Hàng:
            </span>
            <p className="font-extrabold text-slate-900 text-sm">
              {order.recipientName}
            </p>
            <p className="font-mono font-bold text-slate-700 mt-0.5">
              SĐT: {order.recipientPhone}
            </p>
          </div>

          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
              Địa Chỉ Giao Tận Nơi:
            </span>
            <p className="text-slate-800 leading-relaxed font-medium">
              {fullAddress}
            </p>
          </div>

          {order.note && (
            <div className="col-span-2 pt-2 border-t border-slate-200/60">
              <span className="text-[10px] font-bold text-slate-500 uppercase block">
                Ghi chú của khách:
              </span>
              <p className="text-slate-700 italic mt-0.5">&ldquo;{order.note}&rdquo;</p>
            </div>
          )}
        </div>

        {/* Bảng Danh Sách Sản Phẩm Kiểm Soát Kho */}
        <div className="mb-6">
          <table className="w-full text-left border-collapse border border-slate-300">
            <thead>
              <tr className="bg-slate-100 text-[11px] font-bold text-slate-700 uppercase border-b border-slate-300">
                <th className="py-2 px-3 border-r border-slate-300 w-10 text-center">STT</th>
                <th className="py-2 px-3 border-r border-slate-300">Tên Sản Phẩm & Quy Cách</th>
                <th className="py-2 px-3 border-r border-slate-300 w-32 font-mono">Mã SKU</th>
                <th className="py-2 px-3 border-r border-slate-300 w-16 text-center">SL</th>
                <th className="py-2 px-3 border-r border-slate-300 w-24 text-right">Đơn Giá</th>
                <th className="py-2 px-3 border-r border-slate-300 w-28 text-right">Thành Tiền</th>
                <th className="py-2 px-2 text-center w-14">Soạn kho</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-xs">
              {order.items.map((item, idx) => (
                <tr key={item.id} className="border-b border-slate-200">
                  <td className="py-2 px-3 border-r border-slate-200 text-center font-medium">
                    {idx + 1}
                  </td>
                  <td className="py-2 px-3 border-r border-slate-200">
                    <p className="font-bold text-slate-900">{item.productName}</p>
                    <p className="text-[11px] text-slate-500">{item.variantName}</p>
                  </td>
                  <td className="py-2 px-3 border-r border-slate-200 font-mono text-[11px] text-slate-600">
                    {item.sku}
                  </td>
                  <td className="py-2 px-3 border-r border-slate-200 text-center font-extrabold text-slate-900 text-sm">
                    {item.quantity}
                  </td>
                  <td className="py-2 px-3 border-r border-slate-200 text-right">
                    {formatCurrency(item.price)}
                  </td>
                  <td className="py-2 px-3 border-r border-slate-200 text-right font-bold text-slate-900">
                    {formatCurrency(item.price * item.quantity)}
                  </td>
                  <td className="py-2 px-2 text-center">
                    <div className="w-5 h-5 border-2 border-slate-400 rounded mx-auto" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Tổng Tiền & Khối Thanh Toán */}
        <div className="flex justify-between items-start gap-6 border-b border-slate-200 pb-6 mb-6">
          {/* Trạng thái thu tiền */}
          <div className="p-4 rounded-xl border-2 border-dashed flex-1 max-w-sm">
            {isPaid ? (
              <div className="text-center">
                <span className="text-base font-extrabold text-emerald-700 tracking-wider uppercase block">
                  ĐÃ THANH TOÁN (PAID)
                </span>
                <span className="text-[11px] text-slate-500 mt-1 block">
                  Phương thức: {order.paymentMethod === "VIETQR" ? "Chuyển khoản VietQR" : order.paymentMethod}
                </span>
                <span className="text-xs font-bold text-slate-800 mt-1 block">
                  SHIPPER KHÔNG THU THÊM TIỀN HÀNG
                </span>
              </div>
            ) : (
              <div className="text-center">
                <span className="text-xs font-bold text-slate-500 uppercase block">
                  SỐ TIỀN THU HỘ (COD):
                </span>
                <span className="text-xl font-black text-rose-700 mt-1 block">
                  {formatCurrency(order.total)}
                </span>
                <span className="text-[11px] text-slate-600 font-bold mt-1 block">
                  (Shipper vui lòng thu đúng số tiền trên)
                </span>
              </div>
            )}
          </div>

          {/* Bảng tính chi phí */}
          <div className="w-64 space-y-1.5 text-right text-xs">
            <div className="flex justify-between text-slate-600">
              <span>Tạm tính hàng:</span>
              <span className="font-semibold">{formatCurrency(order.subtotal)}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Phí vận chuyển:</span>
              <span className="font-semibold">
                {order.shippingFee > 0 ? formatCurrency(order.shippingFee) : "Miễn phí"}
              </span>
            </div>
            {order.discountAmount > 0 && (
              <div className="flex justify-between text-emerald-700 font-semibold">
                <span>Giảm giá ({order.voucher?.code || "Khuyến mãi"}):</span>
                <span>-{formatCurrency(order.discountAmount)}</span>
              </div>
            )}
            <div className="pt-2 border-t border-slate-900 flex justify-between items-baseline font-bold">
              <span className="text-xs text-slate-900">TỔNG CỘNG:</span>
              <span className="text-base font-black text-slate-900">
                {formatCurrency(order.total)}
              </span>
            </div>
          </div>
        </div>

        {/* Chữ Ký Xác Nhận */}
        <div className="grid grid-cols-3 gap-4 text-center pt-2">
          <div>
            <p className="font-bold text-slate-800 uppercase text-[11px]">Người Soạn Hàng</p>
            <p className="text-[10px] text-slate-400 mt-0.5">(Ký, ghi rõ họ tên)</p>
            <div className="h-16" />
          </div>

          <div>
            <p className="font-bold text-slate-800 uppercase text-[11px]">Người Giao Hàng</p>
            <p className="text-[10px] text-slate-400 mt-0.5">(Ký, ghi rõ họ tên)</p>
            <div className="h-16" />
          </div>

          <div>
            <p className="font-bold text-slate-800 uppercase text-[11px]">Người Nhận Hàng</p>
            <p className="text-[10px] text-slate-400 mt-0.5">(Đã kiểm tra đủ hàng)</p>
            <div className="h-16" />
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-slate-200 mt-6 pt-3 text-center text-[10px] text-slate-400">
          Cảm ơn quý khách đã tin dùng sản phẩm của THUYNGA Shop! Quý khách vui lòng đồng kiểm hàng cùng shipper trước khi nhận.
        </div>
      </div>
    </div>
  );
};
