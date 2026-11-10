"use client";

// ============================================================
// components/storefront/blog/BlogCategoryFilter.tsx
// Thanh Chuyển Chuyên Mục & Tìm Kiếm Nhanh Cẩm Nang Sức Khỏe
// ============================================================

import React from "react";
import { Search, X, BookOpen } from "lucide-react";
import type { CategoryCount } from "./types";

interface BlogCategoryFilterProps {
  categories: CategoryCount[];
  totalAll: number;
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
  search: string;
  onSearchChange: (search: string) => void;
}

export const BlogCategoryFilter: React.FC<BlogCategoryFilterProps> = ({
  categories,
  totalAll,
  selectedCategory,
  onSelectCategory,
  search,
  onSearchChange,
}) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs mb-8 space-y-4">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Horizontal Category Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 lg:pb-0 scrollbar-none">
          {/* Tab Tất cả */}
          <button
            type="button"
            onClick={() => onSelectCategory("ALL")}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 shrink-0 ${
              selectedCategory === "ALL"
                ? "bg-[#800028] text-white shadow-md shadow-[#800028]/20"
                : "bg-slate-100/80 text-slate-700 hover:bg-slate-200"
            }`}
          >
            <span>Tất cả</span>
            <span
              className={`px-1.5 py-0.5 rounded-full text-[10px] ${
                selectedCategory === "ALL"
                  ? "bg-white/20 text-white"
                  : "bg-white text-slate-600 shadow-2xs"
              }`}
            >
              {totalAll}
            </span>
          </button>

          {/* Các chuyên mục E-E-A-T */}
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.name;
            return (
              <button
                key={cat.name}
                type="button"
                onClick={() => onSelectCategory(cat.name)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 shrink-0 ${
                  isSelected
                    ? "bg-[#800028] text-white shadow-md shadow-[#800028]/20"
                    : "bg-slate-100/80 text-slate-700 hover:bg-slate-200"
                }`}
              >
                <span>{cat.name}</span>
                <span
                  className={`px-1.5 py-0.5 rounded-full text-[10px] ${
                    isSelected
                      ? "bg-white/20 text-white"
                      : "bg-white text-slate-600 shadow-2xs"
                  }`}
                >
                  {cat.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Live Search Bar */}
        <div className="relative min-w-[260px] lg:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Tìm theo chủ đề, triệu chứng..."
            className="w-full pl-9 pr-8 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 placeholder:text-slate-400 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#800028]/20 focus:border-[#800028] transition-all"
          />
          {search && (
            <button
              type="button"
              onClick={() => onSearchChange("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
