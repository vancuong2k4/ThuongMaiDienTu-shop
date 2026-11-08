"use client";

// ============================================================
// components/admin/customers/CustomerStats.tsx
// 4 Thẻ KPI Thống Kê Khách Hàng
// ============================================================

import React from "react";
import { Users, UserCheck, Award, TrendingUp } from "lucide-react";
import type { CustomerStatsData } from "./types";

interface CustomerStatsProps {
  stats: CustomerStatsData;
}

export const CustomerStats: React.FC<CustomerStatsProps> = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* 1. Tổng số khách hàng */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs transition-all hover:shadow-md">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Khách Thành Viên
            </p>
            <p className="mt-2 text-2xl font-black text-slate-800 tracking-tight">
              {stats.totalCustomers.toLocaleString("vi-VN")}
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center">
            <Users className="w-6 h-6" />
          </div>
        </div>
        <p className="mt-3 text-xs text-slate-500 flex items-center gap-1.5">
          <span className="inline-block w-2 h-2 rounded-full bg-slate-400" />
          Tài khoản khách hàng đăng ký
        </p>
      </div>

      {/* 2. Đang hoạt động */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs transition-all hover:shadow-md">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-emerald-600 uppercase tracking-wider">
              Đang Hoạt Động
            </p>
            <p className="mt-2 text-2xl font-black text-emerald-700 tracking-tight">
              {stats.activeCustomers.toLocaleString("vi-VN")}
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <UserCheck className="w-6 h-6" />
          </div>
        </div>
        <p className="mt-3 text-xs text-slate-500 flex items-center gap-1.5">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          Tài khoản bình thường & hợp lệ
        </p>
      </div>

      {/* 3. Khách hàng VIP */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs transition-all hover:shadow-md">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-amber-600 uppercase tracking-wider">
              Khách Hàng VIP
            </p>
            <p className="mt-2 text-2xl font-black text-amber-700 tracking-tight">
              {stats.vipCustomers.toLocaleString("vi-VN")}
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <Award className="w-6 h-6" />
          </div>
        </div>
        <p className="mt-3 text-xs text-slate-500 flex items-center gap-1.5">
          <span className="inline-block w-2 h-2 rounded-full bg-amber-400" />
          Chi tiêu ≥ 5.000.000₫ hoặc ≥ 3 đơn
        </p>
      </div>

      {/* 4. Tổng doanh số từ thành viên */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs transition-all hover:shadow-md">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-[#800028] uppercase tracking-wider">
              Doanh Số Thành Viên
            </p>
            <p className="mt-2 text-2xl font-black text-[#800028] tracking-tight">
              {stats.totalSpentAll >= 1000000000
                ? `${(stats.totalSpentAll / 1000000000).toFixed(2)} tỷ`
                : `${(stats.totalSpentAll / 1000000).toFixed(1)} tr`}
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-rose-50 text-[#800028] flex items-center justify-center">
            <TrendingUp className="w-6 h-6" />
          </div>
        </div>
        <p className="mt-3 text-xs font-medium text-slate-600 truncate" title={`${stats.totalSpentAll.toLocaleString("vi-VN")}₫`}>
          Tổng giá trị: <span className="font-bold text-[#800028]">{stats.totalSpentAll.toLocaleString("vi-VN")}₫</span>
        </p>
      </div>
    </div>
  );
};
