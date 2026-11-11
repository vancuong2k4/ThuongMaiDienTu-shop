"use client";

// ============================================================
// components/admin/referral/ReferralStats.tsx
// 4 Thẻ KPI Thống Kê Tiếp Thị Giới Thiệu & Bạn Mới (Stage 12.3)
// ============================================================

import React from "react";
import { Users, TrendingUp, Coins, Award } from "lucide-react";
import type { ReferralStatsData } from "./types";

interface ReferralStatsProps {
  stats: ReferralStatsData;
}

export const ReferralStats: React.FC<ReferralStatsProps> = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* 1. Tổng lượt giới thiệu */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs transition-all hover:shadow-md">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-[#800028] uppercase tracking-wider">
              Tổng Lượt Giới Thiệu
            </p>
            <p className="mt-2 text-2xl font-black text-slate-800 tracking-tight">
              {stats.totalReferrals.toLocaleString("vi-VN")}
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-rose-50 text-[#800028] flex items-center justify-center">
            <Users className="w-6 h-6" />
          </div>
        </div>
        <p className="mt-3 text-xs text-slate-500 flex items-center gap-1.5">
          <span className="font-semibold text-emerald-600">
            {stats.totalRewarded}
          </span>{" "}
          bạn đã hoàn thành đơn đầu
        </p>
      </div>

      {/* 2. Tỷ lệ hoàn thành đơn đầu (Conversion Rate) */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs transition-all hover:shadow-md">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-emerald-600 uppercase tracking-wider">
              Tỷ Lệ Chuyển Đổi
            </p>
            <p className="mt-2 text-2xl font-black text-emerald-700 tracking-tight">
              {stats.conversionRate}%
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <TrendingUp className="w-6 h-6" />
          </div>
        </div>
        <p className="mt-3 text-xs text-slate-500 flex items-center gap-1.5">
          Tỷ lệ bạn mới chốt đơn đầu thành công
        </p>
      </div>

      {/* 3. Doanh số phát sinh từ bạn mới */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs transition-all hover:shadow-md">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-amber-600 uppercase tracking-wider">
              Doanh Số Bạn Mới
            </p>
            <p className="mt-2 text-2xl font-black text-amber-700 tracking-tight">
              {stats.totalRevenue.toLocaleString("vi-VN")} ₫
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <Coins className="w-6 h-6" />
          </div>
        </div>
        <p className="mt-3 text-xs text-slate-500 flex items-center gap-1.5">
          Doanh thu thuần từ các đơn hàng giới thiệu
        </p>
      </div>

      {/* 4. Tổng điểm thưởng đã chi trả */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs transition-all hover:shadow-md">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-blue-600 uppercase tracking-wider">
              Điểm Thưởng Đã Chi
            </p>
            <p className="mt-2 text-2xl font-black text-blue-700 tracking-tight">
              {stats.totalPointsDistributed.toLocaleString("vi-VN")} pts
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <Award className="w-6 h-6" />
          </div>
        </div>
        <p className="mt-3 text-xs text-slate-500 flex items-center gap-1.5">
          <span className="font-semibold text-slate-700">
            ≈ {(stats.totalPointsDistributed * 100).toLocaleString("vi-VN")} ₫
          </span>{" "}
          giá trị quy đổi điểm
        </p>
      </div>
    </div>
  );
};
