"use client";

// ============================================================
// components/storefront/referral/ReferralStatsCards.tsx
// 3 Thẻ Đo Lường Hiệu Quả Mời Bạn Của Người Dùng (Stage 12.4)
// ============================================================

import React from "react";
import { Users, CheckCircle2, Award } from "lucide-react";
import type { StorefrontReferralStats } from "./types";

interface ReferralStatsCardsProps {
  stats: StorefrontReferralStats;
}

export const ReferralStatsCards: React.FC<ReferralStatsCardsProps> = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {/* 1. Tổng bạn bè đã kết nối */}
      <div className="bg-white rounded-3xl border border-neutral-200/90 shadow-sm p-5 transition-all hover:shadow-md">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-neutral-500 uppercase tracking-wider">
              Bạn Bè Đã Kết Nối
            </p>
            <p className="mt-2 text-2xl sm:text-3xl font-black text-neutral-900 tracking-tight">
              {stats.totalInvited.toLocaleString("vi-VN")}
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-rose-50 text-[#800028] flex items-center justify-center shrink-0">
            <Users className="w-6 h-6" />
          </div>
        </div>
        <p className="mt-3 text-xs text-neutral-500">
          Người đã đăng ký tài khoản qua mã mời của bạn
        </p>
      </div>

      {/* 2. Bạn đã hoàn thành đơn đầu */}
      <div className="bg-white rounded-3xl border border-neutral-200/90 shadow-sm p-5 transition-all hover:shadow-md">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-emerald-600 uppercase tracking-wider">
              Đơn Đầu Thành Công
            </p>
            <p className="mt-2 text-2xl sm:text-3xl font-black text-emerald-700 tracking-tight">
              {stats.totalRewarded.toLocaleString("vi-VN")}
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>
        <p className="mt-3 text-xs text-neutral-500">
          Bạn bè đã nhận hàng thành công đơn hàng đầu tiên
        </p>
      </div>

      {/* 3. Tổng điểm thưởng đã nhận */}
      <div className="bg-white rounded-3xl border border-neutral-200/90 shadow-sm p-5 transition-all hover:shadow-md">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-amber-600 uppercase tracking-wider">
              Điểm Thưởng Đã Nhận
            </p>
            <p className="mt-2 text-2xl sm:text-3xl font-black text-amber-600 tracking-tight">
              +{stats.totalPointsEarned.toLocaleString("vi-VN")} pts
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <Award className="w-6 h-6" />
          </div>
        </div>
        <p className="mt-3 text-xs text-neutral-500">
          Tương đương{" "}
          <span className="font-bold text-slate-800">
            ≈ {stats.totalValueVND.toLocaleString("vi-VN")} ₫
          </span>{" "}
          vào ví THUYNGA Club
        </p>
      </div>
    </div>
  );
};
