"use client";

// ============================================================
// components/admin/customers/CustomerFilters.tsx
// Bộ Lọc & Tìm Kiếm Khách Hàng
// ============================================================

import React from "react";
import { Search, Filter, X, Award, User, Sparkles } from "lucide-react";

interface CustomerFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  selectedTier: string;
  onTierChange: (tier: string) => void;
  selectedStatus: string;
  onStatusChange: (status: string) => void;
  selectedRole: string;
  onRoleChange: (role: string) => void;
  sortBy: string;
  onSortByChange: (sort: string) => void;
  onResetFilters: () => void;
  hasActiveFilters: boolean;
}

export const CustomerFilters: React.FC<CustomerFiltersProps> = ({
  search,
  onSearchChange,
  selectedTier,
  onTierChange,
  selectedStatus,
  onStatusChange,
  selectedRole,
  onRoleChange,
  sortBy,
  onSortByChange,
  onResetFilters,
  hasActiveFilters,
}) => {
  const tierTabs = [
    { id: "ALL", label: "Tất cả thành viên" },
    { id: "VIP", label: "Khách VIP", icon: Award },
    { id: "REGULAR", label: "Khách quen", icon: User },
    { id: "NEW", label: "Khách mới" },
  ];

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs space-y-4">
      {/* Hàng 1: Tier Tabs */}
      <div className="flex items-center justify-between gap-3 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
        <div className="flex items-center gap-1.5">
          {tierTabs.map((tab) => {
            const Icon = tab.icon;
            const isSelected = selectedTier === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => onTierChange(tab.id)}
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
            <option value="createdAt_desc">Mới tham gia nhất</option>
            <option value="spent_desc">Chi tiêu cao nhất</option>
            <option value="orders_desc">Nhiều đơn hàng nhất</option>
          </select>
        </div>
      </div>

      {/* Hàng 2: Tìm kiếm & Dropdowns */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Tìm theo tên, email hoặc số điện thoại..."
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
              <option value="ACTIVE">🟢 Đang hoạt động</option>
              <option value="BLOCKED">🔴 Đã bị khóa</option>
            </select>
          </div>

          {/* Role Dropdown */}
          <div className="relative min-w-[150px]">
            <select
              value={selectedRole}
              onChange={(e) => onRoleChange(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50/50 text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#800028]/20 focus:border-[#800028] cursor-pointer"
            >
              <option value="ALL">Tất cả vai trò</option>
              <option value="CUSTOMER">👤 Khách hàng</option>
              <option value="ADMIN">🛡️ Quản trị viên</option>
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
