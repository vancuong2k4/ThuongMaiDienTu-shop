"use client";

// ============================================================
// components/admin/reviews/ReviewStats.tsx
// 4 Thẻ KPI Thống Kê Kiểm Duyệt Đánh Giá
// ============================================================

import React from "react";
import { MessageSquare, Clock, CheckCircle2, Star } from "lucide-react";
import type { ReviewStatsData } from "./types";

interface ReviewStatsProps {
  stats: ReviewStatsData;
}

export const ReviewStats: React.FC<ReviewStatsProps> = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* 1. Tổng đánh giá */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs transition-all hover:shadow-md">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Tổng Đánh Giá
            </p>
            <p className="mt-2 text-2xl font-black text-slate-800 tracking-tight">
              {stats.total.toLocaleString("vi-VN")}
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center">
            <MessageSquare className="w-6 h-6" />
          </div>
        </div>
        <p className="mt-3 text-xs text-slate-500 flex items-center gap-1.5">
          <span className="inline-block w-2 h-2 rounded-full bg-slate-400" />
          Tất cả phản hồi từ khách hàng
        </p>
      </div>

      {/* 2. Chờ kiểm duyệt */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs transition-all hover:shadow-md">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-amber-600 uppercase tracking-wider">
              Chờ Kiểm Duyệt
            </p>
            <p className="mt-2 text-2xl font-black text-amber-700 tracking-tight">
              {stats.pending.toLocaleString("vi-VN")}
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <Clock className="w-6 h-6" />
          </div>
        </div>
        <p className="mt-3 text-xs text-slate-500 flex items-center gap-1.5">
          {stats.pending > 0 ? (
            <>
              <span className="inline-block w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
              <span className="text-amber-700 font-semibold">Cần phê duyệt để hiển thị</span>
            </>
          ) : (
            <>
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-500" />
              Đã kiểm duyệt toàn bộ
            </>
          )}
        </p>
      </div>

      {/* 3. Đã phê duyệt công khai */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs transition-all hover:shadow-md">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-emerald-600 uppercase tracking-wider">
              Đã Công Khai
            </p>
            <p className="mt-2 text-2xl font-black text-emerald-700 tracking-tight">
              {stats.approved.toLocaleString("vi-VN")}
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>
        <p className="mt-3 text-xs text-slate-500 flex items-center gap-1.5">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-500" />
          Đang hiển thị trên trang sản phẩm
        </p>
      </div>

      {/* 4. Điểm đánh giá trung bình */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs transition-all hover:shadow-md">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-[#800028] uppercase tracking-wider">
              Điểm Trung Bình
            </p>
            <div className="mt-2 flex items-baseline gap-1">
              <span className="text-2xl font-black text-[#800028] tracking-tight">
                {stats.averageRating.toFixed(1)}
              </span>
              <span className="text-xs font-bold text-slate-400">/ 5.0</span>
            </div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-rose-50 text-[#800028] flex items-center justify-center">
            <Star className="w-6 h-6 fill-amber-400 text-amber-500" />
          </div>
        </div>
        <p className="mt-3 text-xs font-medium text-slate-600 flex items-center gap-1">
          Độ hài lòng chung của khách hàng
        </p>
      </div>
    </div>
  );
};
