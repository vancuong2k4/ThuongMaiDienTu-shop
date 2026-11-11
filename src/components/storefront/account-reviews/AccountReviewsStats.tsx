// ============================================================
// components/storefront/account-reviews/AccountReviewsStats.tsx
// 3 Thẻ KPI Thống Kê Đánh Giá & Điểm Thưởng Khách Hàng (Phase 14)
// ============================================================

"use client";

import React from "react";
import { Star, Gift, ThumbsUp, ShieldCheck } from "lucide-react";
import type { AccountReviewsStatsData } from "./types";

interface AccountReviewsStatsProps {
  stats: AccountReviewsStatsData;
}

export const AccountReviewsStats: React.FC<AccountReviewsStatsProps> = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {/* 1. Đã đánh giá */}
      <div className="bg-white rounded-2xl border border-neutral-200/80 p-4.5 shadow-xs hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
            Sản phẩm đã đánh giá
          </span>
          <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <Star className="w-4 h-4 fill-amber-400 text-amber-500" />
          </div>
        </div>
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-2xl font-black text-neutral-900 tracking-tight">
            {stats.totalReviewed}
          </span>
          <span className="text-xs text-neutral-500">sản phẩm</span>
        </div>
        <div className="mt-2 flex items-center gap-1.5 text-xs text-emerald-700 font-medium">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>Chia sẻ kinh nghiệm chuẩn Air Úc</span>
        </div>
      </div>

      {/* 2. Điểm thưởng nhận được */}
      <div className="bg-white rounded-2xl border border-neutral-200/80 p-4.5 shadow-xs hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
            Điểm thưởng đã tích lũy
          </span>
          <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
            <Gift className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-2xl font-black text-purple-700 tracking-tight">
            +{stats.totalPointsEarned}
          </span>
          <span className="text-xs text-neutral-500">Điểm THUYNGA Club</span>
        </div>
        <div className="mt-2 flex items-center gap-1.5 text-xs text-purple-700 font-medium">
          <span className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-pulse" />
          <span>Dùng đổi voucher giảm giá đơn sau</span>
        </div>
      </div>

      {/* 3. Lượt hữu ích */}
      <div className="bg-white rounded-2xl border border-neutral-200/80 p-4.5 shadow-xs hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
            Lượt cảm ơn hữu ích
          </span>
          <div className="w-8 h-8 rounded-xl bg-rose-50 text-[#800028] flex items-center justify-center">
            <ThumbsUp className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-2xl font-black text-[#800028] tracking-tight">
            {stats.totalHelpfulReceived}
          </span>
          <span className="text-xs text-neutral-500">lượt bình chọn</span>
        </div>
        <div className="mt-2 text-xs text-neutral-500">
          Từ các mẹ bỉm sữa & khách hàng sàn
        </div>
      </div>
    </div>
  );
};
