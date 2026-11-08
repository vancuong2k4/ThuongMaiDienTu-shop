"use client";

// ============================================================
// components/admin/vouchers/VoucherStats.tsx
// 4 Thẻ KPI Thống Kê Mã Giảm Giá
// ============================================================

import React from "react";
import { Ticket, CheckCircle2, Clock, TrendingUp } from "lucide-react";
import type { VoucherStatsData } from "./types";

interface VoucherStatsProps {
  stats: VoucherStatsData;
}

export const VoucherStats: React.FC<VoucherStatsProps> = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* 1. Tổng số Voucher */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs transition-all hover:shadow-md">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Tổng số Voucher
            </p>
            <p className="mt-2 text-2xl font-black text-slate-800 tracking-tight">
              {stats.total.toLocaleString("vi-VN")}
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center">
            <Ticket className="w-6 h-6" />
          </div>
        </div>
        <p className="mt-3 text-xs text-slate-500 flex items-center gap-1.5">
          <span className="inline-block w-2 h-2 rounded-full bg-slate-400" />
          Chương trình ưu đãi trong hệ thống
        </p>
      </div>

      {/* 2. Đang Hoạt Động */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs transition-all hover:shadow-md">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-emerald-600 uppercase tracking-wider">
              Đang Hoạt Động
            </p>
            <p className="mt-2 text-2xl font-black text-emerald-700 tracking-tight">
              {stats.active.toLocaleString("vi-VN")}
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>
        <p className="mt-3 text-xs text-slate-500 flex items-center gap-1.5">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          Khách hàng đang được áp dụng
        </p>
      </div>

      {/* 3. Sắp Diễn Ra */}
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
          Chưa đến ngày bắt đầu hiệu lực
        </p>
      </div>

      {/* 4. Tổng Lượt Đã Sử Dụng & Chiết Khấu */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs transition-all hover:shadow-md">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-[#800028] uppercase tracking-wider">
              Lượt Dùng Thực Tế
            </p>
            <p className="mt-2 text-2xl font-black text-[#800028] tracking-tight">
              {stats.totalUsed.toLocaleString("vi-VN")} <span className="text-sm font-semibold text-slate-500">lượt</span>
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-rose-50 text-[#800028] flex items-center justify-center">
            <TrendingUp className="w-6 h-6" />
          </div>
        </div>
        <p className="mt-3 text-xs font-medium text-slate-600 truncate" title={`${stats.totalDiscountGiven.toLocaleString("vi-VN")}₫`}>
          Đã trợ giá: <span className="font-bold text-[#800028]">{stats.totalDiscountGiven.toLocaleString("vi-VN")}₫</span>
        </p>
      </div>
    </div>
  );
};
