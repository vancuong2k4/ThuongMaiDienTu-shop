"use client";

// ============================================================
// components/admin/vouchers/VoucherDetailModal.tsx
// Modal Xem Chi Tiết & Lịch Sử Đơn Hàng Áp Dụng Mã Giảm Giá
// ============================================================

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  X,
  Ticket,
  Percent,
  DollarSign,
  Truck,
  Calendar,
  ExternalLink,
  Loader2,
  AlertCircle,
  Copy,
  Check,
  ShoppingBag,
} from "lucide-react";
import { AdminBadge } from "@/components/admin/ui/AdminBadge";
import type { VoucherItem, VoucherDetailData } from "./types";

interface VoucherDetailModalProps {
  voucher: VoucherItem | null;
  isOpen: boolean;
  onClose: () => void;
}

export const VoucherDetailModal: React.FC<VoucherDetailModalProps> = ({
  voucher,
  isOpen,
  onClose,
}) => {
  const [detail, setDetail] = useState<VoucherDetailData | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!isOpen || !voucher) {
      setDetail(null);
      return;
    }

    const fetchDetail = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/admin/vouchers/${voucher.id}`);
        const data = await res.json();
        if (data.success && data.voucher) {
          setDetail(data.voucher);
        }
      } catch (err) {
        console.error("Fetch voucher detail error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
  }, [isOpen, voucher]);

  if (!isOpen || !voucher) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(voucher.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xl w-full max-w-3xl my-8 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-900 text-amber-300 flex items-center justify-center">
              <Ticket className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-800">
                  Mã Voucher: <span className="font-mono text-[#800028]">{voucher.code}</span>
                </h3>
                <button
                  type="button"
                  onClick={handleCopy}
                  className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                  title="Sao chép"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
              <p className="text-xs text-slate-500">
                Thống kê hiệu quả chuyển đổi và danh sách đơn hàng đã dùng mã này
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Quick Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
              <p className="text-[11px] font-semibold text-slate-500 uppercase">Hình Thức</p>
              <p className="mt-1 text-sm font-bold text-slate-800">
                {voucher.type === "PERCENTAGE"
                  ? `Giảm ${voucher.value}%`
                  : voucher.type === "FIXED"
                  ? `Giảm ${voucher.value.toLocaleString("vi-VN")}₫`
                  : `Miễn phí ship`}
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
              <p className="text-[11px] font-semibold text-slate-500 uppercase">Đơn Tối Thiểu</p>
              <p className="mt-1 text-sm font-bold text-slate-800">
                {voucher.minOrderAmount
                  ? `${voucher.minOrderAmount.toLocaleString("vi-VN")}₫`
                  : "0₫"}
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
              <p className="text-[11px] font-semibold text-slate-500 uppercase">Lượt Sử Dụng</p>
              <p className="mt-1 text-sm font-bold text-[#800028]">
                {voucher.usedCount}
                <span className="text-xs font-normal text-slate-400">
                  {voucher.usageLimit ? ` / ${voucher.usageLimit}` : " lượt"}
                </span>
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
              <p className="text-[11px] font-semibold text-slate-500 uppercase">Hiệu Lực</p>
              <div className="mt-1">
                {voucher.lifecycleStatus === "ACTIVE" ? (
                  <span className="text-xs font-bold text-emerald-700">🟢 Đang hoạt động</span>
                ) : voucher.lifecycleStatus === "UPCOMING" ? (
                  <span className="text-xs font-bold text-amber-700">🟡 Sắp tới</span>
                ) : voucher.lifecycleStatus === "EXPIRED" ? (
                  <span className="text-xs font-bold text-rose-700">🔴 Đã hết hạn</span>
                ) : voucher.lifecycleStatus === "DEPLETED" ? (
                  <span className="text-xs font-bold text-orange-700">⚠️ Hết lượt</span>
                ) : (
                  <span className="text-xs font-bold text-slate-500">⚪ Tạm dừng</span>
                )}
              </div>
            </div>
          </div>

          {/* Time range note */}
          <div className="flex items-center gap-2 p-3 rounded-xl bg-blue-50/60 border border-blue-100 text-xs text-blue-800">
            <Calendar className="w-4 h-4 text-blue-600 shrink-0" />
            <span>
              Thời hạn áp dụng: <strong>{formatDate(voucher.startDate)}</strong> đến{" "}
              <strong>{formatDate(voucher.endDate)}</strong> (Giới hạn:{" "}
              <strong>{voucher.userLimit} lần</strong>/khách hàng)
            </span>
          </div>

          {/* Orders History Table */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
                <ShoppingBag className="w-4 h-4 text-[#800028]" />
                <span>Các Đơn Hàng Áp Dụng Gần Đây</span>
              </h4>
              <span className="text-xs text-slate-400 font-medium">
                (Tối đa 10 đơn gần nhất)
              </span>
            </div>

            {loading ? (
              <div className="py-12 text-center text-slate-400">
                <Loader2 className="w-6 h-6 animate-spin text-[#800028] mx-auto mb-2" />
                <span className="text-xs">Đang tải lịch sử đơn hàng...</span>
              </div>
            ) : !detail?.recentOrders || detail.recentOrders.length === 0 ? (
              <div className="py-10 text-center rounded-xl border border-dashed border-slate-200 bg-slate-50/50">
                <p className="text-xs font-semibold text-slate-500">
                  Chưa có đơn hàng nào áp dụng mã này
                </p>
                <p className="text-[11px] text-slate-400 mt-1">
                  Khi khách hàng đặt đơn và dùng mã {voucher.code}, dữ liệu sẽ hiển thị tại đây
                </p>
              </div>
            ) : (
              <div className="border border-slate-200/80 rounded-xl overflow-hidden">
                <table className="w-full text-left text-xs text-slate-600">
                  <thead className="bg-slate-50 text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200/80">
                    <tr>
                      <th className="py-2.5 px-3">Mã Đơn</th>
                      <th className="py-2.5 px-3">Khách Hàng</th>
                      <th className="py-2.5 px-3">Tổng Đơn</th>
                      <th className="py-2.5 px-3">Chiết Khấu</th>
                      <th className="py-2.5 px-3">Trạng Thái</th>
                      <th className="py-2.5 px-3">Ngày Đặt</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {detail.recentOrders.map((order) => (
                      <tr key={order.id} className="hover:bg-slate-50/60 transition-colors">
                        <td className="py-2.5 px-3 font-mono font-bold">
                          <Link
                            href={`/admin/don-hang/${order.orderNumber}`}
                            target="_blank"
                            className="inline-flex items-center gap-1 text-[#800028] hover:underline"
                          >
                            <span>{order.orderNumber}</span>
                            <ExternalLink className="w-3 h-3" />
                          </Link>
                        </td>
                        <td className="py-2.5 px-3">
                          <p className="font-semibold text-slate-800">{order.recipientName}</p>
                          <p className="text-[10px] text-slate-400">{order.recipientPhone}</p>
                        </td>
                        <td className="py-2.5 px-3 font-semibold text-slate-800">
                          {order.total.toLocaleString("vi-VN")}₫
                        </td>
                        <td className="py-2.5 px-3 font-bold text-emerald-600">
                          -{order.discountAmount.toLocaleString("vi-VN")}₫
                        </td>
                        <td className="py-2.5 px-3">
                          <AdminBadge type="order" status={order.orderStatus} />
                        </td>
                        <td className="py-2.5 px-3 text-slate-500 whitespace-nowrap">
                          {formatDate(order.createdAt)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-end px-6 py-3.5 border-t border-slate-100 bg-slate-50/50">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-bold transition-all"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};
