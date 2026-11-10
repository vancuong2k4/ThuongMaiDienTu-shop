"use client";

// ============================================================
// components/admin/blogs/BlogStats.tsx
// 4 Thẻ KPI Thống Kê Bài Viết Cẩm Nang
// ============================================================

import React from "react";
import { BookOpen, CheckCircle2, Clock, Eye } from "lucide-react";
import type { BlogStatsData } from "./types";

interface BlogStatsProps {
  stats: BlogStatsData;
}

export const BlogStats: React.FC<BlogStatsProps> = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* 1. Tổng bài viết */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs transition-all hover:shadow-md">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Tổng Bài Cẩm Nang
            </p>
            <p className="mt-2 text-2xl font-black text-slate-800 tracking-tight">
              {stats.total.toLocaleString("vi-VN")}
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center">
            <BookOpen className="w-6 h-6" />
          </div>
        </div>
        <p className="mt-3 text-xs text-slate-500 flex items-center gap-1.5">
          <span className="inline-block w-2 h-2 rounded-full bg-slate-400" />
          Bài viết cẩm nang y khoa & sản phẩm
        </p>
      </div>

      {/* 2. Đã xuất bản */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs transition-all hover:shadow-md">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-emerald-600 uppercase tracking-wider">
              Đã Xuất Bản
            </p>
            <p className="mt-2 text-2xl font-black text-emerald-700 tracking-tight">
              {stats.published.toLocaleString("vi-VN")}
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>
        <p className="mt-3 text-xs text-slate-500 flex items-center gap-1.5">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-500" />
          Đang hiển thị công khai trên website
        </p>
      </div>

      {/* 3. Bản nháp */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs transition-all hover:shadow-md">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-amber-600 uppercase tracking-wider">
              Bản Nháp
            </p>
            <p className="mt-2 text-2xl font-black text-amber-700 tracking-tight">
              {stats.draft.toLocaleString("vi-VN")}
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <Clock className="w-6 h-6" />
          </div>
        </div>
        <p className="mt-3 text-xs text-slate-500 flex items-center gap-1.5">
          <span className="inline-block w-2 h-2 rounded-full bg-amber-400" />
          Chưa xuất bản hoặc đang biên tập
        </p>
      </div>

      {/* 4. Tổng lượt xem */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs transition-all hover:shadow-md">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-[#800028] uppercase tracking-wider">
              Lượt Đọc Toàn Sàn
            </p>
            <p className="mt-2 text-2xl font-black text-[#800028] tracking-tight">
              {stats.totalViews.toLocaleString("vi-VN")} <span className="text-sm font-semibold text-slate-500">lượt</span>
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-rose-50 text-[#800028] flex items-center justify-center">
            <Eye className="w-6 h-6" />
          </div>
        </div>
        <p className="mt-3 text-xs text-slate-500 flex items-center gap-1.5">
          <span className="inline-block w-2 h-2 rounded-full bg-[#800028]" />
          Lượng độc giả tiếp cận tự nhiên (SEO)
        </p>
      </div>
    </div>
  );
};
