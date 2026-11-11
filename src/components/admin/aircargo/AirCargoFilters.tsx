"use client";

// ============================================================
// components/admin/aircargo/AirCargoFilters.tsx
// Bộ lọc & Thanh công cụ tìm kiếm Lô Hàng / Chuyến Bay Air (Phase 15)
// ============================================================

import React from "react";
import { Search, RotateCcw, Plus, Plane, Package } from "lucide-react";
import { AirlineCarrier, ShipmentStatus } from "@prisma/client";
import {
  AIRLINE_CARRIERS_CONFIG,
  SHIPMENT_STATUS_CONFIG,
} from "@/lib/validations/batch";

interface AirCargoFiltersProps {
  activeTab: "shipments" | "batches";
  onTabChange: (tab: "shipments" | "batches") => void;
  searchTerm: string;
  onSearchChange: (val: string) => void;
  carrierFilter: string;
  onCarrierChange: (val: string) => void;
  statusFilter: string;
  onStatusChange: (val: string) => void;
  onReset: () => void;
  onOpenCreateModal: () => void;
}

export const AirCargoFilters: React.FC<AirCargoFiltersProps> = ({
  activeTab,
  onTabChange,
  searchTerm,
  onSearchChange,
  carrierFilter,
  onCarrierChange,
  statusFilter,
  onStatusChange,
  onReset,
  onOpenCreateModal,
}) => {
  return (
    <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-sm space-y-4">
      {/* Tab Switcher & Nút Tạo Mới */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 border-b border-slate-100 pb-3.5">
        <div className="flex items-center gap-2 p-1 bg-slate-100/80 rounded-xl">
          <button
            onClick={() => onTabChange("shipments")}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
              activeTab === "shipments"
                ? "bg-white text-slate-900 shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Plane className="w-4 h-4 text-sky-600" />
            Vận Đơn & Chuyến Bay Air
          </button>
          <button
            onClick={() => onTabChange("batches")}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
              activeTab === "batches"
                ? "bg-white text-slate-900 shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Package className="w-4 h-4 text-emerald-600" />
            Mã Lô & Hạn Sử Dụng
          </button>
        </div>

        <button
          onClick={onOpenCreateModal}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-[#800028] hover:bg-[#660020] text-white text-xs sm:text-sm font-medium rounded-xl shadow-sm hover:shadow transition-all"
        >
          <Plus className="w-4 h-4" />
          {activeTab === "shipments" ? "Tạo Chuyến Bay / Vận Đơn Mới" : "Tạo Mã Lô Sản Phẩm Mới"}
        </button>
      </div>

      {/* Bộ Lọc Tìm Kiếm */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
        {/* Ô Tìm Kiếm */}
        <div className="relative md:col-span-2">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={
              activeTab === "shipments"
                ? "Tìm theo số AWB (738-...), số hiệu chuyến (VN782), mã lô..."
                : "Tìm theo mã lô (APT-...), mã vạch Úc (93x), tên sản phẩm..."
            }
            className="w-full pl-9 pr-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#800028]/20 focus:border-[#800028] transition-all"
          />
        </div>

        {/* Lọc Hãng Hàng Không */}
        {activeTab === "shipments" && (
          <div>
            <select
              value={carrierFilter}
              onChange={(e) => onCarrierChange(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#800028]/20 focus:border-[#800028] transition-all"
            >
              <option value="ALL">Tất cả hãng hàng không</option>
              {Object.entries(AIRLINE_CARRIERS_CONFIG).map(([key, item]) => (
                <option key={key} value={key}>
                  {item.name} ({item.code})
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Lọc Trạng Thái Vận Chuyển */}
        {activeTab === "shipments" && (
          <div className="flex items-center gap-2">
            <select
              value={statusFilter}
              onChange={(e) => onStatusChange(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#800028]/20 focus:border-[#800028] transition-all"
            >
              <option value="ALL">Tất cả trạng thái</option>
              {Object.entries(SHIPMENT_STATUS_CONFIG).map(([key, item]) => (
                <option key={key} value={key}>
                  {item.label}
                </option>
              ))}
            </select>

            <button
              onClick={onReset}
              title="Đặt lại bộ lọc"
              className="p-2 border border-slate-200 hover:border-slate-300 rounded-xl text-slate-500 hover:text-slate-800 bg-slate-50 hover:bg-slate-100 transition-all flex-shrink-0"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Lọc Tình Trạng Lưu Hành nếu ở tab Batches */}
        {activeTab === "batches" && (
          <div className="flex items-center gap-2 md:col-span-2">
            <select
              value={statusFilter}
              onChange={(e) => onStatusChange(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#800028]/20 focus:border-[#800028] transition-all"
            >
              <option value="ALL">Tất cả trạng thái lưu hành</option>
              <option value="true">Đang lưu hành (Active)</option>
              <option value="false">Tạm ngưng / Hết hàng</option>
            </select>

            <button
              onClick={onReset}
              title="Đặt lại bộ lọc"
              className="p-2 border border-slate-200 hover:border-slate-300 rounded-xl text-slate-500 hover:text-slate-800 bg-slate-50 hover:bg-slate-100 transition-all flex-shrink-0"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
