"use client";

// ============================================================
// components/admin/media/MediaStats.tsx
// 3 Thẻ KPI Thống Kê Kho Media
// ============================================================

import React from "react";
import { Image as ImageIcon, HardDrive, CheckCircle2 } from "lucide-react";
import type { MediaStatsData } from "./types";

interface MediaStatsProps {
  stats: MediaStatsData;
}

export const MediaStats: React.FC<MediaStatsProps> = ({ stats }) => {
  const formatBytes = (bytes: number) => {
    if (bytes === 0) return "0 MB";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {/* 1. Tổng số tệp */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs transition-all hover:shadow-md">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Tổng Số Hình Ảnh
            </p>
            <p className="mt-2 text-2xl font-black text-slate-800 tracking-tight">
              {stats.totalFiles.toLocaleString("vi-VN")} <span className="text-sm font-semibold text-slate-500">tệp</span>
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center">
            <ImageIcon className="w-6 h-6" />
          </div>
        </div>
        <p className="mt-3 text-xs text-slate-500 flex items-center gap-1.5">
          <span className="inline-block w-2 h-2 rounded-full bg-slate-400" />
          Kho ảnh sản phẩm, banner & thương hiệu
        </p>
      </div>

      {/* 2. Dung lượng lưu trữ */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs transition-all hover:shadow-md">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-[#800028] uppercase tracking-wider">
              Dung Lượng Đã Dùng
            </p>
            <p className="mt-2 text-2xl font-black text-[#800028] tracking-tight">
              {formatBytes(stats.totalSizeBytes)}
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-rose-50 text-[#800028] flex items-center justify-center">
            <HardDrive className="w-6 h-6" />
          </div>
        </div>
        <p className="mt-3 text-xs text-slate-500 flex items-center gap-1.5">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-500" />
          Lưu trữ tối ưu trên máy chủ máy chủ cục bộ
        </p>
      </div>

      {/* 3. Định dạng hỗ trợ */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs transition-all hover:shadow-md">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-emerald-600 uppercase tracking-wider">
              Định Dạng Hỗ Trợ
            </p>
            <p className="mt-2 text-lg font-bold text-slate-800 tracking-tight">
              WEBP, PNG, JPG, SVG
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>
        <p className="mt-3 text-xs text-slate-500 flex items-center gap-1.5">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-400" />
          Tự động tối ưu hóa hiển thị web
        </p>
      </div>
    </div>
  );
};
