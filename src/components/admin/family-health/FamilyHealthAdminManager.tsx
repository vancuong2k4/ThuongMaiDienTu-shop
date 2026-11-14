"use client";

// ============================================================
// components/admin/family-health/FamilyHealthAdminManager.tsx
// Trình Điều Phối Quản Trị Tủ Thuốc Gia Đình & CRM Tái Nạp (Phase 22)
// ============================================================

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Heart,
  AlertTriangle,
  Users,
  RefreshCw,
  Clock,
  ShieldCheck,
} from "lucide-react";
import { FamilyHealthStats } from "./FamilyHealthStats";
import { RestockAlertQueueTable } from "./RestockAlertQueueTable";
import { FamilyProfilesTable } from "./FamilyProfilesTable";
import type {
  AdminFamilyKPIs,
  AdminUrgentRestockItem,
  AdminFamilyMemberItem,
} from "./types";

interface FamilyHealthAdminManagerProps {
  initialKpis: AdminFamilyKPIs;
  initialRestocks: AdminUrgentRestockItem[];
  initialMembers: AdminFamilyMemberItem[];
}

export const FamilyHealthAdminManager: React.FC<FamilyHealthAdminManagerProps> = ({
  initialKpis,
  initialRestocks,
  initialMembers,
}) => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"RESTOCKS" | "MEMBERS">("RESTOCKS");
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    router.refresh();
    setTimeout(() => setIsRefreshing(false), 800);
  };

  return (
    <div className="space-y-6">
      {/* 1. Page Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-gray-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-8 h-8 rounded-lg bg-rose-50 text-[#800028] flex items-center justify-center font-black">
              <Heart className="w-4 h-4 fill-[#800028]" />
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">
              Quản Trị Tủ Thuốc Gia Đình &amp; CRM Tái Nạp Vi Chất
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-gray-500">
            Dự báo khách hàng sắp hết hộp Aptamil, Canxi, Sắt &amp; Kẽm Úc để Dược sĩ chủ động chăm
            sóc, không lo gián đoạn liệu trình.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-all flex items-center gap-1.5 disabled:opacity-50"
          >
            <RefreshCw
              className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin" : ""}`}
            />
            <span>Làm Mới</span>
          </button>
        </div>
      </div>

      {/* 2. KPI Cards */}
      <FamilyHealthStats kpis={initialKpis} />

      {/* 3. Tab Switcher */}
      <div className="flex border-b border-gray-200 gap-2">
        <button
          type="button"
          onClick={() => setActiveTab("RESTOCKS")}
          className={`flex items-center gap-2 px-5 py-3 font-bold text-xs sm:text-sm border-b-2 transition-colors ${
            activeTab === "RESTOCKS"
              ? "border-[#800028] text-[#800028]"
              : "border-transparent text-gray-500 hover:text-gray-900"
          }`}
        >
          <AlertTriangle className="w-4 h-4 text-amber-500" />
          <span>Hàng Đợi Chăm Sóc Sắp Hết Hộp (CRM Lead)</span>
          {initialKpis.urgentRestocksCount > 0 && (
            <span className="px-2 py-0.5 rounded-full text-[11px] font-black bg-rose-500 text-white animate-pulse">
              {initialKpis.urgentRestocksCount}
            </span>
          )}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("MEMBERS")}
          className={`flex items-center gap-2 px-5 py-3 font-bold text-xs sm:text-sm border-b-2 transition-colors ${
            activeTab === "MEMBERS"
              ? "border-[#800028] text-[#800028]"
              : "border-transparent text-gray-500 hover:text-gray-900"
          }`}
        >
          <Users className="w-4 h-4 text-blue-600" />
          <span>Danh Sách Hồ Sơ Thành Viên ({initialMembers.length})</span>
        </button>
      </div>

      {/* 4. Tab Content */}
      {activeTab === "RESTOCKS" ? (
        <RestockAlertQueueTable items={initialRestocks} />
      ) : (
        <FamilyProfilesTable members={initialMembers} />
      )}
    </div>
  );
};
