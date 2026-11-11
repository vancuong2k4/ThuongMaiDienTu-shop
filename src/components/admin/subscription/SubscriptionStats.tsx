"use client";

// ============================================================
// components/admin/subscription/SubscriptionStats.tsx
// 4 Thẻ KPI Thống Kê Gói Đơn Hàng Giao Định Kỳ (Stage 13.3)
// ============================================================

import React from "react";
import { Repeat, Coins, Package, Clock } from "lucide-react";
import type { SubscriptionStatsData } from "./types";

interface SubscriptionStatsProps {
  stats: SubscriptionStatsData;
}

export const SubscriptionStats: React.FC<SubscriptionStatsProps> = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* 1. Doanh thu định kỳ ước tính (MRR) */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs transition-all hover:shadow-md">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-emerald-600 uppercase tracking-wider">
              Doanh Thu MRR Ước Tính
            </p>
            <p className="mt-2 text-2xl font-black text-emerald-700 tracking-tight">
              {stats.estimatedMRR.toLocaleString("vi-VN")} ₫
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Coins className="w-6 h-6" />
          </div>
        </div>
        <p className="mt-3 text-xs text-slate-500">
          Doanh số chu kỳ chuẩn hóa theo tháng
        </p>
      </div>

      {/* 2. Gói đang hoạt động */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs transition-all hover:shadow-md">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-[#800028] uppercase tracking-wider">
              Gói Đang Hoạt Động
            </p>
            <p className="mt-2 text-2xl font-black text-slate-800 tracking-tight">
              {stats.activeCount.toLocaleString("vi-VN")}
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-rose-50 text-[#800028] flex items-center justify-center">
            <Repeat className="w-6 h-6" />
          </div>
        </div>
        <p className="mt-3 text-xs text-slate-500">
          Chiếm{" "}
          <span className="font-semibold text-emerald-600">
            {stats.totalSubscriptions > 0
              ? Math.round((stats.activeCount / stats.totalSubscriptions) * 100)
              : 0}
            %
          </span>{" "}
          tổng số {stats.totalSubscriptions} gói đăng ký
        </p>
      </div>

      {/* 3. Tổng đơn hàng định kỳ đã tạo */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs transition-all hover:shadow-md">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-amber-600 uppercase tracking-wider">
              Đơn Định Kỳ Đã Tạo
            </p>
            <p className="mt-2 text-2xl font-black text-amber-700 tracking-tight">
              {stats.totalOrdersGenerated.toLocaleString("vi-VN")}
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <Package className="w-6 h-6" />
          </div>
        </div>
        <p className="mt-3 text-xs text-slate-500">
          Đơn hàng tự động phát sinh theo chu kỳ
        </p>
      </div>

      {/* 4. Gói tạm dừng */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs transition-all hover:shadow-md">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-blue-600 uppercase tracking-wider">
              Gói Đang Tạm Dừng
            </p>
            <p className="mt-2 text-2xl font-black text-blue-700 tracking-tight">
              {stats.pausedCount.toLocaleString("vi-VN")}
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <Clock className="w-6 h-6" />
          </div>
        </div>
        <p className="mt-3 text-xs text-slate-500">
          Khách hàng tạm ngưng và có thể bật lại bất cứ lúc nào
        </p>
      </div>
    </div>
  );
};
