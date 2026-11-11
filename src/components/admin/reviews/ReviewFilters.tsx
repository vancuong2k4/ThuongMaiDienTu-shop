// ============================================================
// components/admin/reviews/ReviewFilters.tsx
// Bộ Lọc & Tìm Kiếm Đánh Giá Khách Hàng Admin CMS (Phase 14)
// ============================================================

"use client";

import React from "react";
import { Search, X, Star, Filter, Image as ImageIcon, CheckCircle2 } from "lucide-react";
import type { ReviewStatus } from "./types";

interface ReviewFiltersProps {
  currentStatus: string;
  onStatusChange: (status: string) => void;
  currentRating: string;
  onRatingChange: (rating: string) => void;
  search: string;
  onSearchChange: (search: string) => void;
  hasImages: boolean;
  onHasImagesChange: (val: boolean) => void;
  verifiedOnly: boolean;
  onVerifiedOnlyChange: (val: boolean) => void;
  onResetFilters: () => void;
  hasActiveFilters: boolean;
  counts?: {
    all: number;
    pending: number;
    approved: number;
    featured: number;
    rejected: number;
  };
}

export const ReviewFilters: React.FC<ReviewFiltersProps> = ({
  currentStatus,
  onStatusChange,
  currentRating,
  onRatingChange,
  search,
  onSearchChange,
  hasImages,
  onHasImagesChange,
  verifiedOnly,
  onVerifiedOnlyChange,
  onResetFilters,
  hasActiveFilters,
  counts,
}) => {
  const statusTabs = [
    { key: "ALL", label: "Tất Cả", count: counts?.all },
    { key: "PENDING", label: "Chờ Duyệt", count: counts?.pending },
    { key: "APPROVED", label: "Đã Duyệt", count: counts?.approved },
    { key: "FEATURED", label: "Ghim Nổi Bật", count: counts?.featured },
    { key: "REJECTED", label: "Từ Chối", count: counts?.rejected },
  ];

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-4">
      {/* 1. Tabs trạng thái */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-100 pb-4">
        {statusTabs.map((tab) => {
          const isActive = currentStatus === tab.key;
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => onStatusChange(tab.key)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                isActive
                  ? tab.key === "PENDING"
                    ? "bg-amber-600 text-white shadow-xs"
                    : tab.key === "FEATURED"
                    ? "bg-purple-600 text-white shadow-xs"
                    : tab.key === "APPROVED"
                    ? "bg-emerald-600 text-white shadow-xs"
                    : "bg-slate-900 text-white shadow-xs"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              <span>{tab.label}</span>
              {typeof tab.count === "number" && (
                <span
                  className={`px-1.5 py-0.5 rounded-full text-[10px] ${
                    isActive
                      ? "bg-white/20 text-white"
                      : "bg-slate-200 text-slate-700"
                  }`}
                >
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* 2. Thanh tìm kiếm & Bộ lọc phụ */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Tìm kiếm */}
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Tìm theo nội dung, tên khách, email hoặc tên sản phẩm..."
            className="w-full pl-9 pr-9 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-[#800028] focus:ring-1 focus:ring-[#800028] bg-slate-50/50"
          />
          {search && (
            <button
              type="button"
              onClick={() => onSearchChange("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Lọc theo số sao */}
        <div className="flex items-center gap-2">
          <select
            value={currentRating}
            onChange={(e) => onRatingChange(e.target.value)}
            aria-label="Lọc theo số sao"
            className="text-xs py-2 px-3 rounded-xl border border-slate-200 bg-white font-medium text-slate-700 focus:outline-none focus:border-[#800028]"
          >
            <option value="ALL">Tất cả số sao</option>
            <option value="5">⭐⭐⭐⭐⭐ (5 sao)</option>
            <option value="4">⭐⭐⭐⭐ (4 sao)</option>
            <option value="3">⭐⭐⭐ (3 sao)</option>
            <option value="2">⭐⭐ (2 sao)</option>
            <option value="1">⭐ (1 sao)</option>
          </select>
        </div>

        {/* Toggle Chỉ bài có ảnh UGC */}
        <button
          type="button"
          onClick={() => onHasImagesChange(!hasImages)}
          className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border transition-all ${
            hasImages
              ? "bg-emerald-50 border-emerald-300 text-emerald-800"
              : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
          }`}
        >
          <ImageIcon className="w-3.5 h-3.5" />
          <span>Có ảnh UGC</span>
        </button>

        {/* Toggle Người mua thực tế */}
        <button
          type="button"
          onClick={() => onVerifiedOnlyChange(!verifiedOnly)}
          className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border transition-all ${
            verifiedOnly
              ? "bg-blue-50 border-blue-300 text-blue-800"
              : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
          }`}
        >
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>Đã mua hàng</span>
        </button>

        {/* Nút xóa bộ lọc */}
        {hasActiveFilters && (
          <button
            type="button"
            onClick={onResetFilters}
            className="inline-flex items-center gap-1 text-xs text-rose-600 hover:text-rose-800 font-semibold px-2 py-1"
          >
            <X className="w-3.5 h-3.5" />
            <span>Xóa lọc</span>
          </button>
        )}
      </div>
    </div>
  );
};
