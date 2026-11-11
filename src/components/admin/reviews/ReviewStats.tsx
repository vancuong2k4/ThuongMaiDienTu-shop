// ============================================================
// components/admin/reviews/ReviewStats.tsx
// 4 Thẻ KPI Thống Kê Kiểm Duyệt Đánh Giá & UGC Air-Cargo (Phase 14)
// ============================================================

"use client";

import React from "react";
import { MessageSquare, Clock, CheckCircle2, Star, Image as ImageIcon, Award } from "lucide-react";
import type { ReviewStatsData } from "./types";

interface ReviewStatsProps {
  stats: ReviewStatsData;
}

export const ReviewStats: React.FC<ReviewStatsProps> = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* 1. Tổng đánh giá & Điểm TB */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs transition-all hover:shadow-md">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Tổng Đánh Giá
            </p>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl font-black text-slate-800 tracking-tight">
                {stats.total.toLocaleString("vi-VN")}
              </span>
              <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                <Star className="w-3 h-3 fill-amber-400 text-amber-500" />
                {stats.averageRating.toFixed(1)} / 5
              </span>
            </div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center">
            <MessageSquare className="w-6 h-6" />
          </div>
        </div>
        <p className="mt-3 text-xs text-slate-500 flex items-center gap-1.5">
          <span className="inline-block w-2 h-2 rounded-full bg-slate-400" />
          Toàn bộ phản hồi từ người mua thực tế
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
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span className="text-emerald-700 font-medium">Đã xử lý sạch hàng đợi</span>
            </>
          )}
        </p>
      </div>

      {/* 3. Ghim nổi bật (Top UGC) */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs transition-all hover:shadow-md">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-purple-600 uppercase tracking-wider">
              Ghim Nổi Bật (Top UGC)
            </p>
            <p className="mt-2 text-2xl font-black text-purple-700 tracking-tight">
              {stats.featured.toLocaleString("vi-VN")}
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
            <Award className="w-6 h-6" />
          </div>
        </div>
        <p className="mt-3 text-xs text-slate-500 flex items-center gap-1.5">
          <span className="inline-block w-2 h-2 rounded-full bg-purple-500" />
          <span>{stats.approved} bài đã duyệt công khai</span>
        </p>
      </div>

      {/* 4. Tỷ lệ ảnh/video UGC */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs transition-all hover:shadow-md">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-emerald-600 uppercase tracking-wider">
              Tỷ Lệ Ảnh UGC Thực Tế
            </p>
            <p className="mt-2 text-2xl font-black text-emerald-700 tracking-tight">
              {stats.mediaRate}%
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <ImageIcon className="w-6 h-6" />
          </div>
        </div>
        <p className="mt-3 text-xs text-slate-500 flex items-center gap-1.5">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-500" />
          Hình ảnh bóc hộp air-cargo chính hãng
        </p>
      </div>
    </div>
  );
};
