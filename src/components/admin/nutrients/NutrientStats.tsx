"use client";

// ============================================================
// components/admin/nutrients/NutrientStats.tsx
// 4 Thẻ Thống Kê KPI Vi Chất & Ma Trận Dinh Dưỡng (Phase 19)
// ============================================================

import React from "react";
import { Scale, Stethoscope, AlertTriangle, CheckCircle2 } from "lucide-react";

interface NutrientStatsProps {
  totalNutrients: number;
  totalSynergies: number;
  totalConfiguredProducts: number;
  totalCategories: number;
}

export const NutrientStats: React.FC<NutrientStatsProps> = ({
  totalNutrients,
  totalSynergies,
  totalConfiguredProducts,
  totalCategories,
}) => {
  const statCards = [
    {
      title: "Chỉ Tiêu Vi Chất Chuẩn",
      value: totalNutrients,
      desc: "DHA, MGO, Synbiotics, Kẽm...",
      icon: Scale,
      color: "from-blue-600 to-indigo-700",
      textColor: "text-blue-700",
      bgColor: "bg-blue-50",
    },
    {
      title: "Quy Tắc Hiệp Đồng Dược Sĩ",
      value: totalSynergies,
      desc: "Hiệp đồng hấp thu & cách thời điểm",
      icon: Stethoscope,
      color: "from-emerald-600 to-teal-700",
      textColor: "text-emerald-700",
      bgColor: "bg-emerald-50",
    },
    {
      title: "Sản Phẩm Đã Nạp Vi Chất",
      value: totalConfiguredProducts,
      desc: "Sữa Úc, TPCN, Mật ong Manuka",
      icon: CheckCircle2,
      color: "from-[#800028] to-rose-900",
      textColor: "text-[#800028]",
      bgColor: "bg-rose-50",
    },
    {
      title: "Nhóm Dưỡng Chất Chính",
      value: totalCategories,
      desc: "Omega, Vitamin, Khoáng chất, Men vi sinh",
      icon: AlertTriangle,
      color: "from-amber-500 to-amber-700",
      textColor: "text-amber-700",
      bgColor: "bg-amber-50",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {statCards.map((c, i) => {
        const Icon = c.icon;
        return (
          <div
            key={i}
            className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-2xs hover:shadow-sm transition-all flex items-center justify-between"
          >
            <div className="space-y-1">
              <span className="text-xs font-bold text-slate-500 block">
                {c.title}
              </span>
              <span className="text-2xl font-black text-slate-900 tracking-tight block">
                {c.value}
              </span>
              <span className="text-[11px] text-slate-400 block">{c.desc}</span>
            </div>

            <div
              className={`w-12 h-12 rounded-2xl ${c.bgColor} ${c.textColor} flex items-center justify-center shrink-0 shadow-2xs`}
            >
              <Icon className="w-6 h-6" />
            </div>
          </div>
        );
      })}
    </div>
  );
};
