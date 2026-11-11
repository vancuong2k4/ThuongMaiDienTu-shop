"use client";

// ============================================================
// components/admin/subscription/SubscriptionTable.tsx
// Bảng Danh Sách Gói Giao Định Kỳ Admin CMS (Stage 13.3)
// ============================================================

import React, { useState } from "react";
import Link from "next/link";
import {
  Repeat,
  Package,
  Calendar,
  Clock,
  Play,
  Pause,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  CheckCircle2,
  Send,
} from "lucide-react";
import type {
  AdminSubscriptionItem,
  SubscriptionFrequencyType,
  SubscriptionStatusType,
} from "./types";
import { SUBSCRIPTION_CONFIG } from "@/lib/validations/subscription";

interface SubscriptionTableProps {
  subscriptions: AdminSubscriptionItem[];
  isLoading: boolean;
  currentPage: number;
  totalPages: number;
  totalItems: number;
  onPageChange: (page: number) => void;
  onTriggerOrder: (id: string) => Promise<void>;
}

const TIER_BADGES: Record<string, { label: string; bg: string; text: string }> = {
  BRONZE: { label: "Đồng", bg: "bg-amber-100", text: "text-amber-900" },
  SILVER: { label: "Bạc", bg: "bg-slate-200", text: "text-slate-800" },
  GOLD: { label: "Vàng", bg: "bg-yellow-200", text: "text-yellow-900" },
  DIAMOND: { label: "Kim Cương", bg: "bg-purple-100", text: "text-purple-900" },
};

export const SubscriptionTable: React.FC<SubscriptionTableProps> = ({
  subscriptions,
  isLoading,
  currentPage,
  totalPages,
  totalItems,
  onPageChange,
  onTriggerOrder,
}) => {
  const [triggeringId, setTriggeringId] = useState<string | null>(null);

  const handleTrigger = async (id: string) => {
    if (triggeringId) return;
    if (!confirm("Bạn có chắc chắn muốn kích hoạt tạo đơn hàng ngay lập tức cho gói định kỳ này?")) {
      return;
    }
    try {
      setTriggeringId(id);
      await onTriggerOrder(id);
    } finally {
      setTriggeringId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200/80 p-12 text-center shadow-xs">
        <div className="w-10 h-10 border-3 border-[#800028]/20 border-t-[#800028] rounded-full animate-spin mx-auto mb-4" />
        <p className="text-sm font-medium text-slate-500">
          Đang tải dữ liệu gói định kỳ...
        </p>
      </div>
    );
  }

  if (subscriptions.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200/80 p-12 text-center shadow-xs">
        <div className="w-14 h-14 rounded-2xl bg-rose-50 text-[#800028] flex items-center justify-center mx-auto mb-3">
          <Repeat className="w-7 h-7" />
        </div>
        <h3 className="text-base font-bold text-slate-800">
          Không tìm thấy gói định kỳ nào
        </h3>
        <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
          Chưa có khách hàng nào đăng ký gói giao định kỳ phù hợp với bộ lọc hiện tại.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs sm:text-sm">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 text-xs uppercase font-bold tracking-wider">
            <tr>
              <th className="py-3.5 px-4">Mã Gói & Khách Hàng</th>
              <th className="py-3.5 px-4">Sản Phẩm Đăng Ký</th>
              <th className="py-3.5 px-4">Chu Kỳ</th>
              <th className="py-3.5 px-4">Trạng Thái</th>
              <th className="py-3.5 px-4">Kỳ Giao Kế Tiếp</th>
              <th className="py-3.5 px-4">Doanh Thu / Chu Kỳ</th>
              <th className="py-3.5 px-4">Lần Giao</th>
              <th className="py-3.5 px-4 text-right">Thao Tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {subscriptions.map((sub) => {
              const statusCfg =
                SUBSCRIPTION_CONFIG.STATUSES[sub.status] ||
                SUBSCRIPTION_CONFIG.STATUSES.ACTIVE;
              const freqCfg =
                SUBSCRIPTION_CONFIG.FREQUENCIES[sub.frequency] ||
                SUBSCRIPTION_CONFIG.FREQUENCIES.EVERY_1_MONTH;
              const tierCfg =
                sub.user.membershipTier && TIER_BADGES[sub.user.membershipTier]
                  ? TIER_BADGES[sub.user.membershipTier]
                  : null;

              const nextDate = new Date(sub.nextDeliveryDate);
              const now = new Date();
              const daysRemaining = Math.ceil(
                (nextDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
              );

              return (
                <tr key={sub.id} className="hover:bg-slate-50/80 transition-colors">
                  {/* Mã Gói & Khách hàng */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-full bg-rose-100 text-[#800028] flex items-center justify-center font-bold text-xs shrink-0">
                        {sub.user.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="font-mono font-bold text-[#800028] text-xs">
                            {sub.subscriptionNumber}
                          </span>
                          {tierCfg && (
                            <span
                              className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${tierCfg.bg} ${tierCfg.text}`}
                            >
                              {tierCfg.label}
                            </span>
                          )}
                        </div>
                        <p className="font-semibold text-slate-800 text-xs truncate mt-0.5">
                          {sub.user.name}
                        </p>
                        <p className="text-[11px] text-slate-400 truncate">
                          {sub.user.phone || sub.user.email}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Sản phẩm đăng ký */}
                  <td className="py-3.5 px-4 max-w-xs">
                    <div className="space-y-1">
                      {sub.items.map((item) => (
                        <div
                          key={item.id}
                          className="flex items-center gap-2 text-xs"
                        >
                          <span className="font-semibold text-slate-700 truncate max-w-[180px]">
                            {item.productName}
                          </span>
                          <span className="font-bold text-[#800028] shrink-0">
                            x{item.quantity}
                          </span>
                        </div>
                      ))}
                    </div>
                  </td>

                  {/* Chu kỳ */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                      <Calendar className="w-3.5 h-3.5 text-slate-500" />
                      {freqCfg.label}
                    </span>
                  </td>

                  {/* Trạng thái */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold border ${statusCfg.badgeColor}`}
                    >
                      {sub.status === "ACTIVE" && <CheckCircle2 className="w-3.5 h-3.5" />}
                      {sub.status === "PAUSED" && <Pause className="w-3.5 h-3.5" />}
                      {sub.status === "CANCELLED" && <AlertCircle className="w-3.5 h-3.5" />}
                      {statusCfg.label}
                    </span>
                  </td>

                  {/* Kỳ giao kế tiếp */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <div className="font-medium text-slate-800 text-xs">
                      {nextDate.toLocaleDateString("vi-VN", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                      })}
                    </div>
                    {sub.status === "ACTIVE" && (
                      <span
                        className={`text-[11px] font-semibold block ${
                          daysRemaining <= 3
                            ? "text-rose-600 font-bold"
                            : "text-slate-500"
                        }`}
                      >
                        {daysRemaining <= 0
                          ? "Hôm nay đến hạn"
                          : `Còn ${daysRemaining} ngày`}
                      </span>
                    )}
                  </td>

                  {/* Doanh thu mỗi chu kỳ */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <div className="font-bold text-slate-900 text-xs">
                      {sub.cycleTotal.toLocaleString("vi-VN")} ₫
                    </div>
                    <span className="text-[11px] text-emerald-600 font-semibold block">
                      Giảm 10% trọn đời
                    </span>
                  </td>

                  {/* Số lần giao */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <span className="font-semibold text-slate-700">
                      {sub.totalCyclesDelivered} kỳ
                    </span>
                    <span className="text-[11px] text-slate-400 block">
                      {sub.ordersCount} đơn phát sinh
                    </span>
                  </td>

                  {/* Thao tác */}
                  <td className="py-3.5 px-4 text-right whitespace-nowrap">
                    {sub.status === "ACTIVE" && (
                      <button
                        type="button"
                        onClick={() => handleTrigger(sub.id)}
                        disabled={triggeringId === sub.id}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-white bg-[#800028] hover:bg-[#660020] transition-colors shadow-2xs disabled:opacity-50"
                      >
                        <Send className="w-3 h-3" />
                        {triggeringId === sub.id ? "Đang tạo..." : "Tạo đơn ngay"}
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Phân trang */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-4 py-3 bg-slate-50 border-t border-slate-200">
          <p className="text-xs text-slate-500">
            Hiển thị trang <span className="font-semibold text-slate-800">{currentPage}</span> /{" "}
            <span className="font-semibold text-slate-800">{totalPages}</span> (Tổng cộng{" "}
            <span className="font-semibold text-slate-800">{totalItems}</span> gói)
          </p>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              disabled={currentPage <= 1}
              onClick={() => onPageChange(currentPage - 1)}
              className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => {
              if (
                p === 1 ||
                p === totalPages ||
                (p >= currentPage - 1 && p <= currentPage + 1)
              ) {
                return (
                  <button
                    key={p}
                    type="button"
                    onClick={() => onPageChange(p)}
                    className={`min-w-8 h-8 px-2 rounded-lg text-xs font-bold transition-all ${
                      p === currentPage
                        ? "bg-[#800028] text-white shadow-xs"
                        : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-100"
                    }`}
                  >
                    {p}
                  </button>
                );
              }
              if (p === currentPage - 2 || p === currentPage + 2) {
                return (
                  <span key={p} className="text-xs text-slate-400 px-1">
                    ...
                  </span>
                );
              }
              return null;
            })}

            <button
              type="button"
              disabled={currentPage >= totalPages}
              onClick={() => onPageChange(currentPage + 1)}
              className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
