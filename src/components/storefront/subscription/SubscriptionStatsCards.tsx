// ============================================================
// components/storefront/subscription/SubscriptionStatsCards.tsx
// Các thẻ thống kê nhanh trạng thái Gói Giao Định Kỳ
// ============================================================

"use client";

import React from "react";
import { Repeat, Calendar, PiggyBank, ShieldCheck } from "lucide-react";
import type { StorefrontSubscriptionStats } from "./types";

interface SubscriptionStatsCardsProps {
  stats: StorefrontSubscriptionStats;
}

export const SubscriptionStatsCards: React.FC<SubscriptionStatsCardsProps> = ({
  stats,
}) => {
  const formatVND = (val: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(val);
  };

  // Tính số ngày còn lại đến lần giao tiếp theo
  let countdownText = "Chưa có lịch";
  let formattedNextDate = "—";
  if (stats.earliestNextDelivery) {
    const nextDate = new Date(stats.earliestNextDelivery);
    formattedNextDate = nextDate.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const target = new Date(nextDate);
    target.setHours(0, 0, 0, 0);

    const diffDays = Math.ceil(
      (target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (diffDays < 0) {
      countdownText = "Đang xử lý tạo đơn";
    } else if (diffDays === 0) {
      countdownText = "Giao hôm nay";
    } else if (diffDays === 1) {
      countdownText = "Giao ngày mai";
    } else {
      countdownText = `Còn ${diffDays} ngày nữa`;
    }
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {/* Card 1: Gói đang hoạt động */}
      <div className="bg-white rounded-2xl border border-neutral-200/80 p-4.5 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
            Gói đang kích hoạt
          </span>
          <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Repeat className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-2xl font-black text-neutral-900 tracking-tight">
            {stats.activeCount}
          </span>
          <span className="text-xs text-neutral-500">
            / {stats.totalSubscriptions} tổng số gói
          </span>
        </div>
        <div className="mt-2 flex items-center gap-1.5 text-xs text-emerald-700 font-medium">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span>Tự động giao định kỳ đúng hẹn</span>
        </div>
      </div>

      {/* Card 2: Lịch giao gần nhất */}
      <div className="bg-white rounded-2xl border border-neutral-200/80 p-4.5 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
            Lịch giao gần nhất
          </span>
          <div className="w-8 h-8 rounded-xl bg-rose-50 text-[#800028] flex items-center justify-center">
            <Calendar className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-xl sm:text-2xl font-black text-[#800028] tracking-tight">
            {formattedNextDate}
          </span>
        </div>
        <div className="mt-2 flex items-center gap-1.5 text-xs text-neutral-600 font-medium">
          <span className="px-2 py-0.5 rounded-full bg-rose-50 text-[#800028] font-bold text-[11px] border border-rose-200">
            {countdownText}
          </span>
        </div>
      </div>

      {/* Card 3: Tiền đã tiết kiệm */}
      <div className="bg-white rounded-2xl border border-neutral-200/80 p-4.5 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
            Đã tiết kiệm được
          </span>
          <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <PiggyBank className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-2xl font-black text-emerald-600 tracking-tight">
            {formatVND(stats.totalSavedAmount)}
          </span>
        </div>
        <div className="mt-2 flex items-center gap-1 text-xs text-neutral-500">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
          <span>Từ chiết khấu 10% & Freeship</span>
        </div>
      </div>
    </div>
  );
};
