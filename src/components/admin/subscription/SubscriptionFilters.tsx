"use client";

// ============================================================
// components/admin/subscription/SubscriptionFilters.tsx
// Bộ Lọc & Tìm Kiếm Gói Giao Định Kỳ (Stage 13.3)
// ============================================================

import React from "react";
import Link from "next/link";
import { Search, X, ExternalLink, Calendar } from "lucide-react";

interface SubscriptionFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  selectedStatus: string;
  onStatusChange: (status: string) => void;
  selectedFrequency: string;
  onFrequencyChange: (freq: string) => void;
  onResetFilters: () => void;
  hasActiveFilters: boolean;
}

export const SubscriptionFilters: React.FC<SubscriptionFiltersProps> = ({
  search,
  onSearchChange,
  selectedStatus,
  onStatusChange,
  selectedFrequency,
  onFrequencyChange,
  onResetFilters,
  hasActiveFilters,
}) => {
  const statusTabs = [
    { value: "ALL", label: "Tất cả gói" },
    { value: "ACTIVE", label: "🟢 Đang hoạt động" },
    { value: "PAUSED", label: "⏸️ Tạm dừng" },
    { value: "CANCELLED", label: "❌ Đã hủy" },
  ];

  const frequencyOptions = [
    { value: "ALL", label: "Tất cả chu kỳ" },
    { value: "EVERY_2_WEEKS", label: "Mỗi 2 tuần" },
    { value: "EVERY_1_MONTH", label: "Mỗi 1 tháng" },
    { value: "EVERY_2_MONTHS", label: "Mỗi 2 tháng" },
    { value: "EVERY_3_MONTHS", label: "Mỗi 3 tháng" },
  ];

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs space-y-4">
      {/* Hàng 1: Tabs trạng thái & Phím tắt */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          {statusTabs.map((tab) => {
            const isSelected = selectedStatus === tab.value;
            return (
              <button
                key={tab.value}
                type="button"
                onClick={() => onStatusChange(tab.value)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
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

        <div className="flex items-center gap-2 shrink-0">
          <Link
            href="/tai-khoan/dinh-ky"
            target="_blank"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            Xem Trang Storefront
          </Link>
        </div>
      </div>

      {/* Hàng 2: Bộ chọn chu kỳ & Ô tìm kiếm */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        {/* Dropdown Chu kỳ */}
        <div className="relative shrink-0 sm:w-48">
          <select
            value={selectedFrequency}
            onChange={(e) => onFrequencyChange(e.target.value)}
            className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs sm:text-sm font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#800028]/20 focus:border-[#800028]"
          >
            {frequencyOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {/* Ô Tìm kiếm */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Tìm theo mã SUB-..., tên khách hàng, SĐT, tên sản phẩm..."
            className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#800028]/20 focus:border-[#800028] transition-all"
          />
          {search && (
            <button
              type="button"
              onClick={() => onSearchChange("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 rounded-md"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Nút Xóa bộ lọc */}
        {hasActiveFilters && (
          <button
            type="button"
            onClick={onResetFilters}
            className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 transition-colors shrink-0"
          >
            <X className="w-3.5 h-3.5" />
            Xóa bộ lọc
          </button>
        )}
      </div>
    </div>
  );
};
