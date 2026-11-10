"use client";

// ============================================================
// components/admin/loyalty/LoyaltyStats.tsx
// 4 Thẻ KPI Thống Kê Điểm Tích Lũy & Hạng VIP (Module 10.3)
// ============================================================

import React from "react";
import { Award, Gift, TrendingUp, Crown, Coins } from "lucide-react";
import type { LoyaltyStatsData } from "./types";

interface LoyaltyStatsProps {
  stats: LoyaltyStatsData;
}

export const LoyaltyStats: React.FC<LoyaltyStatsProps> = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* 1. Tổng điểm đang lưu hành */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs transition-all hover:shadow-md">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-[#800028] uppercase tracking-wider">
              Điểm Đang Lưu Hành
            </p>
            <p className="mt-2 text-2xl font-black text-slate-800 tracking-tight">
              {stats.totalCirculatingPoints.toLocaleString("vi-VN")}
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-rose-50 text-[#800028] flex items-center justify-center">
            <Coins className="w-6 h-6" />
          </div>
        </div>
        <p className="mt-3 text-xs text-slate-500 flex items-center gap-1.5">
          <span className="font-semibold text-slate-700">
            ≈ {stats.monetaryEquivalentValue.toLocaleString("vi-VN")} ₫
          </span>
          giá trị quy đổi
        </p>
      </div>

      {/* 2. Tổng điểm đã đổi thưởng */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs transition-all hover:shadow-md">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-emerald-600 uppercase tracking-wider">
              Điểm Đã Đổi Thưởng
            </p>
            <p className="mt-2 text-2xl font-black text-emerald-700 tracking-tight">
              {stats.totalRedeemedPoints.toLocaleString("vi-VN")}
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Gift className="w-6 h-6" />
          </div>
        </div>
        <p className="mt-3 text-xs text-slate-500 flex items-center gap-1.5">
          Đổi voucher giảm giá & quà tặng
        </p>
      </div>

      {/* 3. Tổng điểm tích trọn đời */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs transition-all hover:shadow-md">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-blue-600 uppercase tracking-wider">
              Tổng Điểm Trọn Đời
            </p>
            <p className="mt-2 text-2xl font-black text-blue-700 tracking-tight">
              {stats.totalLifetimePointsEarned.toLocaleString("vi-VN")}
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <TrendingUp className="w-6 h-6" />
          </div>
        </div>
        <p className="mt-3 text-xs text-slate-500 flex items-center gap-1.5">
          Tích từ đơn hàng & thưởng thăng hạng
        </p>
      </div>

      {/* 4. Phân bổ hạng thành viên */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs transition-all hover:shadow-md">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-amber-600 uppercase tracking-wider">
              Thành Viên THUYNGA Club
            </p>
            <p className="mt-2 text-2xl font-black text-amber-700 tracking-tight">
              {stats.totalCustomers.toLocaleString("vi-VN")}
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <Crown className="w-6 h-6" />
          </div>
        </div>
        <div className="mt-3 flex items-center gap-2 text-[10px] text-slate-600 font-semibold flex-wrap">
          <span className="px-1.5 py-0.5 rounded bg-amber-50 text-amber-900 border border-amber-200">
            {stats.tierDistribution.bronze} Đồng
          </span>
          <span className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-800 border border-slate-200">
            {stats.tierDistribution.silver} Bạc
          </span>
          <span className="px-1.5 py-0.5 rounded bg-yellow-50 text-yellow-800 border border-yellow-200">
            {stats.tierDistribution.gold} Vàng
          </span>
          <span className="px-1.5 py-0.5 rounded bg-purple-50 text-purple-800 border border-purple-200">
            {stats.tierDistribution.diamond} Kim Cương
          </span>
        </div>
      </div>
    </div>
  );
};
