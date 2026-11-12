"use client";

// ============================================================
// components/admin/gift-boxes/GiftBoxFilters.tsx
// Bộ lọc, Tab Switcher & Phím tắt Quản trị Quà Biếu (Phase 17)
// ============================================================

import React from "react";
import {
  Search,
  Plus,
  RefreshCw,
  Building2,
  Gift,
  Filter,
} from "lucide-react";
import { CorporateGiftStatus } from "@prisma/client";
import { CORPORATE_GIFT_STATUS_CONFIG } from "@/lib/validations/gift-box";

interface GiftBoxFiltersProps {
  activeTab: "inquiries" | "templates";
  onTabChange: (tab: "inquiries" | "templates") => void;
  searchTerm: string;
  onSearchChange: (value: string) => void;
  statusFilter: string;
  onStatusFilterChange: (value: string) => void;
  onOpenCreateTemplateModal: () => void;
  onRefresh: () => void;
  isRefreshing?: boolean;
}

export const GiftBoxFilters: React.FC<GiftBoxFiltersProps> = ({
  activeTab,
  onTabChange,
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  onOpenCreateTemplateModal,
  onRefresh,
  isRefreshing = false,
}) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs space-y-4">
      {/* 1. Dual Tab Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => onTabChange("inquiries")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              activeTab === "inquiries"
                ? "bg-[#800028] text-white shadow-xs"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            <Building2 className="w-4 h-4" />
            <span>Yêu Cầu Quà Doanh Nghiệp (B2B)</span>
          </button>

          <button
            onClick={() => onTabChange("templates")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              activeTab === "templates"
                ? "bg-[#800028] text-white shadow-xs"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            <Gift className="w-4 h-4" />
            <span>Mẫu Vỏ Hộp Quà Biếu</span>
          </button>
        </div>

        {/* Action button */}
        <div className="flex items-center gap-2">
          {activeTab === "templates" && (
            <button
              onClick={onOpenCreateTemplateModal}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl shadow-xs transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Thêm Mẫu Hộp Mới</span>
            </button>
          )}

          <button
            onClick={onRefresh}
            disabled={isRefreshing}
            className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-all"
            title="Tải lại dữ liệu"
          >
            <RefreshCw
              className={`w-4 h-4 ${isRefreshing ? "animate-spin text-[#800028]" : ""}`}
            />
          </button>
        </div>
      </div>

      {/* 2. Search & Status Filter */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={
              activeTab === "inquiries"
                ? "Tìm theo mã yêu cầu, tên công ty, người liên hệ, SĐT..."
                : "Tìm theo tên mẫu hộp, slug, chất liệu..."
            }
            className="w-full pl-9 pr-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-[#800028] focus:ring-1 focus:ring-[#800028] bg-slate-50/50"
          />
        </div>

        {/* Status Dropdown (Inquiries Tab only) */}
        {activeTab === "inquiries" && (
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-400 shrink-0" />
            <select
              value={statusFilter}
              onChange={(e) => onStatusFilterChange(e.target.value)}
              className="text-xs rounded-xl border border-slate-200 px-3 py-2 bg-white focus:outline-none focus:border-[#800028] text-slate-700 font-medium"
            >
              <option value="ALL">Tất cả trạng thái</option>
              {Object.entries(CORPORATE_GIFT_STATUS_CONFIG).map(([key, config]) => (
                <option key={key} value={key}>
                  {config.label}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>
    </div>
  );
};
