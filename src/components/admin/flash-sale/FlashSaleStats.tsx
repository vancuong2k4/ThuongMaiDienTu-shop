"use client";

// ============================================================
// components/admin/flash-sale/FlashSaleStats.tsx
// 4 Thẻ KPI Thống Kê Chiến Dịch Flash Sale (Module 9.3)
// ============================================================

import React from "react";
import { Zap, Clock, Flame, ShoppingBag } from "lucide-react";
import type { FlashSaleStatsData } from "./types";

interface FlashSaleStatsProps {
  stats: FlashSaleStatsData;
}

export const FlashSaleStats: React.FC<FlashSaleStatsProps> = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* 1. Đang diễn ra */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs transition-all hover:shadow-md">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-emerald-600 uppercase tracking-wider">
              Đang Diễn Ra
            </p>
            <p className="mt-2 text-2xl font-black text-emerald-700 tracking-tight">
              {stats.active.toLocaleString("vi-VN")}
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Zap className="w-6 h-6 fill-emerald-600" />
          </div>
        </div>
        <p className="mt-3 text-xs text-slate-500 flex items-center gap-1.5">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          Chiến dịch đang mở bán trên website
        </p>
      </div>

      {/* 2. Sắp diễn ra */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs transition-all hover:shadow-md">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-amber-600 uppercase tracking-wider">
              Sắp Diễn Ra
            </p>
            <p className="mt-2 text-2xl font-black text-amber-700 tracking-tight">
              {stats.upcoming.toLocaleString("vi-VN")}
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <Clock className="w-6 h-6" />
          </div>
        </div>
        <p className="mt-3 text-xs text-slate-500 flex items-center gap-1.5">
          <span className="inline-block w-2 h-2 rounded-full bg-amber-400" />
          Chiến dịch lên lịch mở bán trong tuần
        </p>
      </div>

      {/* 3. Tổng deal đã bán */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs transition-all hover:shadow-md">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-[#800028] uppercase tracking-wider">
              Lượt Mua Flash Sale
            </p>
            <p className="mt-2 text-2xl font-black text-[#800028] tracking-tight">
              {stats.totalSold.toLocaleString("vi-VN")}
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-rose-50 text-[#800028] flex items-center justify-center">
            <Flame className="w-6 h-6 fill-[#800028]" />
          </div>
        </div>
        <p className="mt-3 text-xs text-slate-500 flex items-center gap-1.5">
          <span className="font-semibold text-slate-700">
            {stats.averageSoldRate}%
          </span>
          tỷ lệ cháy hàng trung bình
        </p>
      </div>

      {/* 4. Doanh thu giờ vàng */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs transition-all hover:shadow-md">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-blue-600 uppercase tracking-wider">
              Doanh Thu Giờ Vàng
            </p>
            <p className="mt-2 text-2xl font-black text-blue-700 tracking-tight">
              {stats.totalRevenue.toLocaleString("vi-VN")} ₫
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <ShoppingBag className="w-6 h-6" />
          </div>
        </div>
        <p className="mt-3 text-xs text-slate-500 flex items-center gap-1.5">
          Tổng giá trị đơn hàng săn deal thành công
        </p>
      </div>
    </div>
  );
};
