"use client";

// ============================================================
// components/admin/vouchers/VoucherFilters.tsx
// Bộ Lọc & Tìm Kiếm Mã Giảm Giá
// ============================================================

import React from "react";
import { Search, Plus, Filter, X, Percent, DollarSign, Truck } from "lucide-react";

interface VoucherFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  selectedType: string;
  onTypeChange: (type: string) => void;
  selectedStatus: string;
  onStatusChange: (status: string) => void;
  onOpenCreateModal: () => void;
  onResetFilters: () => void;
  hasActiveFilters: boolean;
}

export const VoucherFilters: React.FC<VoucherFiltersProps> = ({
  search,
  onSearchChange,
  selectedType,
  onTypeChange,
  selectedStatus,
  onStatusChange,
  onOpenCreateModal,
  onResetFilters,
  hasActiveFilters,
}) => {
  const typeTabs = [
    { id: "ALL", label: "Tất cả loại", icon: null },
    { id: "PERCENTAGE", label: "Giảm %", icon: Percent },
    { id: "FIXED", label: "Tiền mặt", icon: DollarSign },
    { id: "FREE_SHIP", label: "Freeship", icon: Truck },
  ];

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs space-y-4">
      {/* Hàng 1: Tabs phân loại & Nút tạo mới */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Type Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          {typeTabs.map((tab) => {
            const Icon = tab.icon;
            const isSelected = selectedType === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => onTypeChange(tab.id)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  isSelected
                    ? "bg-[#800028] text-white shadow-xs"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200/80"
                }`}
              >
                {Icon && <Icon className="w-3.5 h-3.5" />}
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Nút Tạo Voucher */}
        <button
          type="button"
          onClick={onOpenCreateModal}
          className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-[#800028] hover:bg-[#680020] text-white text-sm font-bold shadow-xs hover:shadow-md transition-all active:scale-[0.98]"
        >
          <Plus className="w-4 h-4" />
          <span>Tạo Voucher Mới</span>
        </button>
      </div>

      {/* Hàng 2: Ô tìm kiếm & Dropdown trạng thái */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Tìm theo mã voucher (VD: THUYNGA10, WELCOME50)..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value.toUpperCase())}
            className="w-full pl-9 pr-9 py-2 rounded-xl border border-slate-200 bg-slate-50/50 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#800028]/20 focus:border-[#800028] transition-all font-mono tracking-wider font-semibold"
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
          <div className="relative min-w-[170px]">
            <Filter className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <select
              value={selectedStatus}
              onChange={(e) => onStatusChange(e.target.value)}
              className="w-full pl-8 pr-8 py-2 rounded-xl border border-slate-200 bg-slate-50/50 text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#800028]/20 focus:border-[#800028] appearance-none transition-all cursor-pointer"
            >
              <option value="ALL">Tất cả trạng thái</option>
              <option value="ACTIVE">🟢 Đang hoạt động</option>
              <option value="UPCOMING">🟡 Sắp diễn ra</option>
              <option value="EXPIRED">🔴 Đã hết hạn</option>
              <option value="DISABLED">⚪ Đang tạm dừng</option>
            </select>
          </div>

          {/* Reset button */}
          {hasActiveFilters && (
            <button
              type="button"
              onClick={onResetFilters}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-slate-600 hover:text-[#800028] bg-slate-100 hover:bg-rose-50 transition-all"
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
