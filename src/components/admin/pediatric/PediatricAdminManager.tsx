"use client";

// ============================================================
// components/admin/pediatric/PediatricAdminManager.tsx
// Trình Điều Phối Quản Trị Tăng Trưởng Trẻ Em & Pha Sữa Úc (Phase 23)
// ============================================================

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Baby,
  Activity,
  RefreshCw,
  BookOpen,
  Scale,
  ShieldCheck,
} from "lucide-react";
import { PediatricKPIStats } from "./PediatricKPIStats";
import { ChildAssessmentTable } from "./ChildAssessmentTable";
import { AptamilProtocolsTable } from "./AptamilProtocolsTable";
import type {
  PediatricAdminKPIs,
  AdminAptamilProtocolItem,
} from "./types";

interface PediatricAdminManagerProps {
  initialKpis: PediatricAdminKPIs;
  initialProtocols: AdminAptamilProtocolItem[];
}

export const PediatricAdminManager: React.FC<PediatricAdminManagerProps> = ({
  initialKpis,
  initialProtocols,
}) => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"ASSESSMENTS" | "PROTOCOLS">("ASSESSMENTS");
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    router.refresh();
    setTimeout(() => setIsRefreshing(false), 800);
  };

  return (
    <div className="space-y-6">
      {/* 1. Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-gray-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center font-black">
              <Baby className="w-5 h-5" />
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">
              Quản Trị Thể Trạng Trẻ Em &amp; Quy Chuẩn Pha Sữa Aptamil Úc
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-gray-500">
            Theo dõi dữ liệu bách phân vị WHO (chiều cao, cân nặng, Z-score) để Dược sĩ tư vấn chính
            xác dòng sữa Aptamil và vi chất bổ sung cho mẹ.
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
      <PediatricKPIStats kpis={initialKpis} />

      {/* 3. Tabs */}
      <div className="flex border-b border-gray-200 gap-2">
        <button
          type="button"
          onClick={() => setActiveTab("ASSESSMENTS")}
          className={`flex items-center gap-2 px-5 py-3 font-bold text-xs sm:text-sm border-b-2 transition-colors ${
            activeTab === "ASSESSMENTS"
              ? "border-blue-600 text-blue-600"
              : "border-transparent text-gray-500 hover:text-gray-900"
          }`}
        >
          <Activity className="w-4 h-4 text-blue-600" />
          <span>Hồ Sơ Đánh Giá Thể Trạng Trẻ Em ({initialKpis.totalAssessments})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("PROTOCOLS")}
          className={`flex items-center gap-2 px-5 py-3 font-bold text-xs sm:text-sm border-b-2 transition-colors ${
            activeTab === "PROTOCOLS"
              ? "border-blue-600 text-blue-600"
              : "border-transparent text-gray-500 hover:text-gray-900"
          }`}
        >
          <BookOpen className="w-4 h-4 text-emerald-600" />
          <span>Quy Chuẩn Pha Sữa Aptamil Profutura Úc (4 Giai Đoạn)</span>
        </button>
      </div>

      {/* 4. Tab Content */}
      {activeTab === "ASSESSMENTS" ? (
        <ChildAssessmentTable items={initialKpis.recentAssessments} />
      ) : (
        <AptamilProtocolsTable protocols={initialProtocols} />
      )}
    </div>
  );
};
