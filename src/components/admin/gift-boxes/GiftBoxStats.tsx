"use client";

// ============================================================
// components/admin/gift-boxes/GiftBoxStats.tsx
// 5 Thẻ Thống Kê KPI Quà Biếu & Quà Doanh Nghiệp (Phase 17)
// ============================================================

import React from "react";
import {
  Gift,
  Building2,
  Clock,
  CheckCircle2,
  DollarSign,
  Package,
  TrendingUp,
} from "lucide-react";
import { CorporateGiftKPIs } from "./types";

interface GiftBoxStatsProps {
  stats: CorporateGiftKPIs;
}

export const GiftBoxStats: React.FC<GiftBoxStatsProps> = ({ stats }) => {
  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(val);
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
      {/* 1. Tổng yêu cầu B2B */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs flex items-center justify-between">
        <div className="space-y-1">
          <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
            Yêu cầu B2B
          </p>
          <p className="text-xl font-black text-slate-900">
            {stats.totalInquiries}
          </p>
          <p className="text-[10px] text-slate-400">Doanh nghiệp liên hệ</p>
        </div>
        <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
          <Building2 className="w-5 h-5" />
        </div>
      </div>

      {/* 2. Chờ liên hệ báo giá */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs flex items-center justify-between">
        <div className="space-y-1">
          <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
            Chờ báo giá
          </p>
          <p className="text-xl font-black text-amber-600">
            {stats.pendingInquiries}
          </p>
          <p className="text-[10px] text-amber-600/80 font-medium">Cần liên hệ gấp</p>
        </div>
        <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
          <Clock className="w-5 h-5" />
        </div>
      </div>

      {/* 3. Đã chốt hợp đồng */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs flex items-center justify-between">
        <div className="space-y-1">
          <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
            Đã chốt cọc
          </p>
          <p className="text-xl font-black text-emerald-600">
            {stats.wonInquiries}
          </p>
          <p className="text-[10px] text-emerald-600/80 font-medium">
            Tỷ lệ chốt: {stats.conversionRate}%
          </p>
        </div>
        <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
          <CheckCircle2 className="w-5 h-5" />
        </div>
      </div>

      {/* 4. Doanh thu quà biếu thực tế */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs flex items-center justify-between">
        <div className="space-y-1">
          <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
            Doanh số quà biếu
          </p>
          <p className="text-base font-black text-rose-700 truncate max-w-[120px]">
            {formatCurrency(stats.wonRevenue)}
          </p>
          <p className="text-[10px] text-slate-400">Hợp đồng B2B đã thu</p>
        </div>
        <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-700 flex items-center justify-center shrink-0">
          <DollarSign className="w-5 h-5" />
        </div>
      </div>

      {/* 5. Mẫu hộp hoạt động */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs flex items-center justify-between">
        <div className="space-y-1">
          <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
            Mẫu vỏ hộp
          </p>
          <p className="text-xl font-black text-purple-700">
            {stats.templatesCount}
          </p>
          <p className="text-[10px] text-purple-700/80 font-medium">
            {stats.totalHampersCreated} giỏ đã thiết kế
          </p>
        </div>
        <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center shrink-0">
          <Gift className="w-5 h-5" />
        </div>
      </div>
    </div>
  );
};
