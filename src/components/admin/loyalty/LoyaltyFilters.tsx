"use client";

// ============================================================
// components/admin/loyalty/LoyaltyFilters.tsx
// Bộ Lọc & Tìm Kiếm Sổ Cái Tích Điểm (Module 10.3)
// ============================================================

import React from "react";
import Link from "next/link";
import { Search, Plus, X, Users, Award, SlidersHorizontal } from "lucide-react";

interface LoyaltyFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  selectedType: string;
  onTypeChange: (type: string) => void;
  selectedTier: string;
  onTierChange: (tier: string) => void;
  onOpenAdjustModal: () => void;
  onResetFilters: () => void;
  hasActiveFilters: boolean;
}

export const LoyaltyFilters: React.FC<LoyaltyFiltersProps> = ({
  search,
  onSearchChange,
  selectedType,
  onTypeChange,
  selectedTier,
  onTierChange,
  onOpenAdjustModal,
  onResetFilters,
  hasActiveFilters,
}) => {
  const typeTabs = [
    { value: "ALL", label: "Tất cả giao dịch" },
    { value: "EARN_ORDER", label: "📦 Tích điểm đơn" },
    { value: "REDEEM_VOUCHER", label: "🎟️ Đổi voucher" },
    { value: "REDEEM_ORDER", label: "💳 Trừ điểm checkout" },
    { value: "ADMIN_ADJUST", label: "⚖️ Admin điều chỉnh" },
    { value: "SIGNUP_BONUS", label: "🎁 Thưởng chào mừng" },
  ];

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs space-y-4">
      {/* Hàng 1: Tabs loại giao dịch & Nút điều chỉnh điểm */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          {typeTabs.map((tab) => {
            const isSelected = selectedType === tab.value;
            return (
              <button
                key={tab.value}
                type="button"
                onClick={() => onTypeChange(tab.value)}
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
            href="/admin/khach-hang"
            className="px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
          >
            Quản Lý Khách Hàng
          </Link>
          <button
            type="button"
            onClick={onOpenAdjustModal}
            className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-xs font-bold text-white bg-[#800028] hover:bg-[#60001e] transition-all shadow-md shadow-[#800028]/20"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Điều Chỉnh Điểm Thủ Công</span>
          </button>
        </div>
      </div>

      {/* Hàng 2: Tìm kiếm & Lọc hạng thành viên */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-slate-100">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Tìm theo tên, email, SĐT hoặc nội dung giao dịch..."
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
          <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-xs text-slate-500 font-medium">Hạng VIP:</span>
          <select
            value={selectedTier}
            onChange={(e) => onTierChange(e.target.value)}
            className="px-2.5 py-1.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-[#800028]/20 focus:border-[#800028]"
          >
            <option value="ALL">Tất cả các hạng</option>
            <option value="BRONZE">Thành Viên Đồng</option>
            <option value="SILVER">Thành Viên Bạc</option>
            <option value="GOLD">Thành Viên Vàng</option>
            <option value="DIAMOND">Thành Viên Kim Cương</option>
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
