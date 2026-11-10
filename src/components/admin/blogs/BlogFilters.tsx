"use client";

// ============================================================
// components/admin/blogs/BlogFilters.tsx
// Bộ Lọc & Tìm Kiếm Bài Viết Cẩm Nang
// ============================================================

import React from "react";
import Link from "next/link";
import { Search, Plus, X, BookOpen } from "lucide-react";
import { BLOG_CATEGORIES } from "@/lib/validations/blog";

interface BlogFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  selectedStatus: string;
  onStatusChange: (status: string) => void;
  sortBy: string;
  onSortByChange: (sort: string) => void;
  onResetFilters: () => void;
  hasActiveFilters: boolean;
}

export const BlogFilters: React.FC<BlogFiltersProps> = ({
  search,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  selectedStatus,
  onStatusChange,
  sortBy,
  onSortByChange,
  onResetFilters,
  hasActiveFilters,
}) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs space-y-4">
      {/* Hàng 1: Tabs chuyên mục & Nút viết bài mới */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          <button
            type="button"
            onClick={() => onCategoryChange("ALL")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              selectedCategory === "ALL"
                ? "bg-[#800028] text-white shadow-xs"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200/80"
            }`}
          >
            Tất cả chuyên mục
          </button>
          {BLOG_CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => onCategoryChange(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  isSelected
                    ? "bg-[#800028] text-white shadow-xs"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200/80"
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        <Link
          href="/admin/bai-viet/tao-moi"
          className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-[#800028] hover:bg-[#680020] text-white text-xs font-bold shadow-xs hover:shadow-md transition-all shrink-0 active:scale-[0.98]"
        >
          <Plus className="w-4 h-4" />
          <span>Viết Bài Mới</span>
        </Link>
      </div>

      {/* Hàng 2: Tìm kiếm & Dropdowns */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Tìm theo tiêu đề hoặc nội dung bài viết..."
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

        {/* Status Dropdown */}
        <div className="flex items-center gap-2">
          <div className="relative min-w-[150px]">
            <select
              value={selectedStatus}
              onChange={(e) => onStatusChange(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50/50 text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#800028]/20 focus:border-[#800028] cursor-pointer"
            >
              <option value="ALL">Tất cả trạng thái</option>
              <option value="PUBLISHED">🟢 Đã xuất bản</option>
              <option value="DRAFT">🟡 Bản nháp</option>
            </select>
          </div>

          {/* Sort Dropdown */}
          <div className="relative min-w-[160px]">
            <select
              value={sortBy}
              onChange={(e) => onSortByChange(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50/50 text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#800028]/20 focus:border-[#800028] cursor-pointer"
            >
              <option value="createdAt_desc">Mới nhất</option>
              <option value="views_desc">Đọc nhiều nhất</option>
              <option value="title_asc">Tiêu đề (A-Z)</option>
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
