"use client";

// ============================================================
// components/admin/flash-sale/FlashSaleFilters.tsx
// Bộ Lọc & Tìm Kiếm Chiến Dịch Flash Sale (Module 9.3)
// ============================================================

import React from "react";
import { Search, Plus, X, Zap } from "lucide-react";

interface FlashSaleFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  selectedStatus: string;
  onStatusChange: (status: string) => void;
  sortBy: string;
  onSortByChange: (sort: string) => void;
  onOpenCreateModal: () => void;
  onResetFilters: () => void;
  hasActiveFilters: boolean;
}

export const FlashSaleFilters: React.FC<FlashSaleFiltersProps> = ({
  search,
  onSearchChange,
  selectedStatus,
  onStatusChange,
  sortBy,
  onSortByChange,
  onOpenCreateModal,
  onResetFilters,
  hasActiveFilters,
}) => {
  const statusTabs = [
    { value: "ALL", label: "Tất cả" },
    { value: "ACTIVE", label: "⚡ Đang diễn ra" },
    { value: "UPCOMING", label: "⏳ Sắp diễn ra" },
    { value: "ENDED", label: "Đã kết thúc" },
  ];

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs space-y-4">
      {/* Hàng 1: Tabs trạng thái & Nút tạo mới */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          {statusTabs.map((tab) => {
            const isSelected = selectedStatus === tab.value;
            return (
              <button
                key={tab.value}
                type="button"
                onClick={() => onStatusChange(tab.value)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  isSelected
                    ? "bg-[#800028] text-white shadow-xs"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200/80"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        <button
          type="button"
          onClick={onOpenCreateModal}
          className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-white bg-[#800028] hover:bg-[#60001e] transition-all shadow-md shadow-[#800028]/20 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Tạo Chiến Dịch Mới</span>
        </button>
      </div>

      {/* Hàng 2: Tìm kiếm & Sắp xếp */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-slate-100">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Tìm theo tên chiến dịch hoặc nội dung..."
            className="w-full pl-9 pr-8 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#800028]/20 focus:border-[#800028]"
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

        <div className="flex items-center gap-2 self-end sm:self-auto">
          <span className="text-xs text-slate-500 font-medium">Sắp xếp:</span>
          <select
            value={sortBy}
            onChange={(e) => onSortByChange(e.target.value)}
            className="px-2.5 py-1.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-[#800028]/20 focus:border-[#800028]"
          >
            <option value="createdAt_desc">Mới tạo gần đây</option>
            <option value="startTime_asc">Sắp bắt đầu trước</option>
            <option value="startTime_desc">Bắt đầu muộn nhất</option>
            <option value="endTime_asc">Sắp kết thúc trước</option>
          </select>

          {hasActiveFilters && (
            <button
              type="button"
              onClick={onResetFilters}
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
              title="Đặt lại bộ lọc"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
