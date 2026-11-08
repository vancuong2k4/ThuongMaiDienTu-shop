"use client";

// ============================================================
// components/admin/reviews/ReviewFilters.tsx
// Bộ Lọc & Tìm Kiếm Đánh Giá Khách Hàng
// ============================================================

import React from "react";
import { Search, Filter, X, Star, Clock, CheckCircle2, Ban } from "lucide-react";
import type { ReviewStatus } from "./types";

interface ReviewFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  selectedStatus: string;
  onStatusChange: (status: string) => void;
  selectedRating: string;
  onRatingChange: (rating: string) => void;
  sortBy: string;
  onSortByChange: (sort: string) => void;
  pendingCount: number;
  onResetFilters: () => void;
  hasActiveFilters: boolean;
}

export const ReviewFilters: React.FC<ReviewFiltersProps> = ({
  search,
  onSearchChange,
  selectedStatus,
  onStatusChange,
  selectedRating,
  onRatingChange,
  sortBy,
  onSortByChange,
  pendingCount,
  onResetFilters,
  hasActiveFilters,
}) => {
  const statusTabs = [
    { id: "ALL", label: "Tất cả đánh giá", icon: null, badge: null },
    {
      id: "PENDING",
      label: "Chờ kiểm duyệt",
      icon: Clock,
      badge: pendingCount > 0 ? pendingCount : null,
    },
    { id: "APPROVED", label: "Đã công khai", icon: CheckCircle2, badge: null },
    { id: "REJECTED", label: "Từ chối / Ẩn", icon: Ban, badge: null },
  ];

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs space-y-4">
      {/* Hàng 1: Tabs trạng thái */}
      <div className="flex items-center justify-between gap-3 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
        <div className="flex items-center gap-1.5">
          {statusTabs.map((tab) => {
            const Icon = tab.icon;
            const isSelected = selectedStatus === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => onStatusChange(tab.id)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  isSelected
                    ? "bg-[#800028] text-white shadow-xs"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200/80"
                }`}
              >
                {Icon && <Icon className="w-3.5 h-3.5" />}
                <span>{tab.label}</span>
                {tab.badge !== null && (
                  <span
                    className={`ml-1 px-1.5 py-0.2 rounded-full text-[10px] font-black ${
                      isSelected
                        ? "bg-white text-[#800028]"
                        : "bg-amber-500 text-white animate-pulse"
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Sort Dropdown */}
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-xs text-slate-400 font-medium hidden sm:inline">
            Sắp xếp:
          </span>
          <select
            value={sortBy}
            onChange={(e) => onSortByChange(e.target.value)}
            className="px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#800028]/20 focus:border-[#800028] cursor-pointer"
          >
            <option value="createdAt_desc">Mới gửi nhất</option>
            <option value="rating_desc">Sao cao nhất (5 ★)</option>
            <option value="rating_asc">Sao thấp nhất (1 ★)</option>
          </select>
        </div>
      </div>

      {/* Hàng 2: Tìm kiếm & Lọc số sao */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Tìm theo tên khách, sản phẩm hoặc nội dung đánh giá..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-9 pr-9 py-2 rounded-xl border border-slate-200 bg-slate-50/50 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#800028]/20 focus:border-[#800028] transition-all"
          />
          {search && (
            <button
              type="button"
              onClick={() => onSearchChange("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Rating Filter Dropdown */}
        <div className="flex items-center gap-2">
          <div className="relative min-w-[150px]">
            <select
              value={selectedRating}
              onChange={(e) => onRatingChange(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50/50 text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#800028]/20 focus:border-[#800028] cursor-pointer"
            >
              <option value="ALL">Tất cả số sao</option>
              <option value="5">⭐⭐⭐⭐⭐ (5 sao)</option>
              <option value="4">⭐⭐⭐⭐ (4 sao)</option>
              <option value="3">⭐⭐⭐ (3 sao)</option>
              <option value="2">⭐⭐ (2 sao)</option>
              <option value="1">⭐ (1 sao)</option>
            </select>
          </div>

          {/* Reset button */}
          {hasActiveFilters && (
            <button
              type="button"
              onClick={onResetFilters}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-slate-600 hover:text-[#800028] bg-slate-100 hover:bg-rose-50 transition-all shrink-0"
              title="Đặt lại bộ lọc"
            >
              <X className="w-3.5 h-3.5" />
              <span>Xóa lọc</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
