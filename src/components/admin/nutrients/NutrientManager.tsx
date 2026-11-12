"use client";

// ============================================================
// components/admin/nutrients/NutrientManager.tsx
// Bộ Điều Phối Giao Diện Quản Trị Vi Chất & Hiệp Đồng Dược Sĩ (Phase 19)
// ============================================================

import React, { useState } from "react";
import { Plus, Scale, Stethoscope, RefreshCw } from "lucide-react";
import { NutrientStats } from "./NutrientStats";
import {
  NutrientReferenceTable,
  AdminNutrientItem,
} from "./NutrientReferenceTable";
import { NutrientSynergyList, AdminSynergyItem } from "./NutrientSynergyList";
import { CreateNutrientModal } from "./CreateNutrientModal";
import { useRouter } from "next/navigation";

interface NutrientManagerProps {
  nutrients: AdminNutrientItem[];
  synergies: AdminSynergyItem[];
  totalConfiguredProducts: number;
}

export const NutrientManager: React.FC<NutrientManagerProps> = ({
  nutrients,
  synergies,
  totalConfiguredProducts,
}) => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"NUTRIENTS" | "SYNERGIES">(
    "NUTRIENTS"
  );
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const categoriesCount = new Set(nutrients.map((n) => n.category)).size;

  const handleRefresh = () => {
    setIsRefreshing(true);
    router.refresh();
    setTimeout(() => setIsRefreshing(false), 600);
  };

  return (
    <div className="space-y-6 font-sans">
      {/* ── 1. Top Bar & Action Buttons ─────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Tab switch */}
        <div className="inline-flex rounded-2xl p-1 bg-slate-100 border border-slate-200">
          <button
            type="button"
            onClick={() => setActiveTab("NUTRIENTS")}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === "NUTRIENTS"
                ? "bg-white text-slate-900 shadow-2xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Scale className="w-3.5 h-3.5 text-[#800028]" />
            <span>Chỉ Tiêu Vi Chất ({nutrients.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("SYNERGIES")}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === "SYNERGIES"
                ? "bg-white text-slate-900 shadow-2xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Stethoscope className="w-3.5 h-3.5 text-emerald-600" />
            <span>Quy Tắc Hiệp Đồng ({synergies.length})</span>
          </button>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleRefresh}
            className="p-2.5 rounded-2xl border border-slate-200 text-slate-600 hover:text-slate-900 bg-white hover:bg-slate-50 transition-colors shadow-2xs"
            title="Làm mới dữ liệu"
          >
            <RefreshCw
              className={`w-4 h-4 ${isRefreshing ? "animate-spin text-[#800028]" : ""}`}
            />
          </button>

          <button
            type="button"
            onClick={() => setIsCreateModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-[#800028] hover:bg-[#660020] text-white font-bold text-xs shadow-xs transition-all active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Thêm Chỉ Tiêu Vi Chất</span>
          </button>
        </div>
      </div>

      {/* ── 2. KPI Stats Cards ──────────────────────────────────── */}
      <NutrientStats
        totalNutrients={nutrients.length}
        totalSynergies={synergies.length}
        totalConfiguredProducts={totalConfiguredProducts}
        totalCategories={categoriesCount}
      />

      {/* ── 3. Content Tabs ─────────────────────────────────────── */}
      {activeTab === "NUTRIENTS" ? (
        <NutrientReferenceTable nutrients={nutrients} />
      ) : (
        <NutrientSynergyList synergies={synergies} />
      )}

      {/* Create Modal */}
      <CreateNutrientModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={() => {
          router.refresh();
        }}
      />
    </div>
  );
};
