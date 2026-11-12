"use client";

// ============================================================
// components/admin/protocols/ProtocolFilters.tsx
// Bộ lọc & Thanh công cụ Phác đồ & Lịch hẹn Dược sĩ (Phase 16)
// ============================================================

import React from "react";
import { Search, RotateCcw, Plus, Stethoscope, Calendar } from "lucide-react";
import { HealthTargetGroup, ConsultationStatus } from "@prisma/client";
import {
  HEALTH_TARGET_GROUPS_CONFIG,
  CONSULTATION_STATUS_CONFIG,
} from "@/lib/validations/protocol";

interface ProtocolFiltersProps {
  activeTab: "protocols" | "consultations";
  onTabChange: (tab: "protocols" | "consultations") => void;
  searchTerm: string;
  onSearchChange: (val: string) => void;
  targetGroupFilter: string;
  onTargetGroupChange: (val: string) => void;
  statusFilter: string;
  onStatusChange: (val: string) => void;
  onReset: () => void;
  onOpenCreateModal: () => void;
}

export const ProtocolFilters: React.FC<ProtocolFiltersProps> = ({
  activeTab,
  onTabChange,
  searchTerm,
  onSearchChange,
  targetGroupFilter,
  onTargetGroupChange,
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
            onClick={() => onTabChange("protocols")}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
              activeTab === "protocols"
                ? "bg-white text-slate-900 shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Stethoscope className="w-4 h-4 text-[#800028]" />
            Phác Đồ Dinh Dưỡng
          </button>
          <button
            onClick={() => onTabChange("consultations")}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
              activeTab === "consultations"
                ? "bg-white text-slate-900 shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Calendar className="w-4 h-4 text-emerald-600" />
            Lịch Hẹn Tư Vấn Dược Sĩ
          </button>
        </div>

        {activeTab === "protocols" && (
          <button
            onClick={onOpenCreateModal}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-[#800028] hover:bg-[#660020] text-white text-xs sm:text-sm font-medium rounded-xl shadow-sm hover:shadow transition-all"
          >
            <Plus className="w-4 h-4" />
            Tạo Phác Đồ Mới
          </button>
        )}
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
              activeTab === "protocols"
                ? "Tìm theo tên phác đồ, slug, vi chất cốt lõi..."
                : "Tìm theo tên khách hàng, số điện thoại, vấn đề sức khỏe..."
            }
            className="w-full pl-9 pr-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#800028]/20 focus:border-[#800028] transition-all"
          />
        </div>

        {/* Lọc Nhóm Đối Tượng nếu ở Tab Protocols */}
        {activeTab === "protocols" && (
          <div>
            <select
              value={targetGroupFilter}
              onChange={(e) => onTargetGroupChange(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#800028]/20 focus:border-[#800028] transition-all"
            >
              <option value="ALL">Tất cả nhóm đối tượng</option>
              {Object.entries(HEALTH_TARGET_GROUPS_CONFIG).map(([key, item]) => (
                <option key={key} value={key}>
                  {item.label} ({item.ageRange})
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Lọc Trạng Thái Lưu Hành nếu ở Tab Protocols */}
        {activeTab === "protocols" && (
          <div className="flex items-center gap-2">
            <select
              value={statusFilter}
              onChange={(e) => onStatusChange(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#800028]/20 focus:border-[#800028] transition-all"
            >
              <option value="ALL">Tất cả trạng thái</option>
              <option value="true">Đang lưu hành</option>
              <option value="false">Tạm ngưng</option>
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

        {/* Lọc Trạng Thái Lịch Hẹn nếu ở Tab Consultations */}
        {activeTab === "consultations" && (
          <div className="flex items-center gap-2 md:col-span-2">
            <select
              value={statusFilter}
              onChange={(e) => onStatusChange(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#800028]/20 focus:border-[#800028] transition-all"
            >
              <option value="ALL">Tất cả trạng thái lịch hẹn</option>
              {Object.entries(CONSULTATION_STATUS_CONFIG).map(([key, item]) => (
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
      </div>
    </div>
  );
};
