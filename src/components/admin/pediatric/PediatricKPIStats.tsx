// ============================================================
// components/admin/pediatric/PediatricKPIStats.tsx
// Các Thẻ Chỉ Số KPI Tăng Trưởng Trẻ Em & Lead Tư Vấn Sữa (Phase 23)
// ============================================================

import React from "react";
import { Baby, Activity, Scale, AlertTriangle } from "lucide-react";
import type { PediatricAdminKPIs } from "./types";

interface PediatricKPIStatsProps {
  kpis: PediatricAdminKPIs;
}

export const PediatricKPIStats: React.FC<PediatricKPIStatsProps> = ({ kpis }) => {
  const cards = [
    {
      title: "Tổng Lượt Đánh Giá Thể Trạng",
      value: kpis.totalAssessments,
      unit: "lượt bé",
      subtext: "Đã đo lường bách phân vị Z-score",
      icon: Baby,
      bgColor: "bg-blue-50 text-blue-700 border-blue-200",
      iconColor: "text-blue-600 bg-blue-100",
    },
    {
      title: "Tỷ Lệ Thể Trạng Chuẩn WHO",
      value: `${kpis.normalRatioPercent}%`,
      unit: `(${kpis.normalCount} bé)`,
      subtext: "Cả chiều cao & cân nặng đạt chuẩn P50",
      icon: Activity,
      bgColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
      iconColor: "text-emerald-600 bg-emerald-100",
    },
    {
      title: "Trẻ Nhẹ Cân Cần Tư Vấn",
      value: kpis.underweightCount,
      unit: "bé (Z < -2)",
      subtext: "Khách hàng cần Aptamil Úc & Men vi sinh",
      icon: Scale,
      bgColor: "bg-amber-50 text-amber-800 border-amber-300",
      iconColor: "text-amber-600 bg-amber-100",
      highlight: kpis.underweightCount > 0,
    },
    {
      title: "Trẻ Thấp Còi Cần Tăng Cao",
      value: kpis.stuntedCount,
      unit: "bé (Z < -2)",
      subtext: "Khách hàng cần Canxi Sữa & D3 K2",
      icon: AlertTriangle,
      bgColor: "bg-rose-50 text-rose-800 border-rose-300",
      iconColor: "text-rose-600 bg-rose-100",
      highlight: kpis.stuntedCount > 0,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <div
            key={idx}
            className={`p-5 rounded-2xl border transition-all ${
              card.highlight
                ? "bg-amber-50/70 border-amber-300 shadow-sm ring-1 ring-amber-400"
                : "bg-white border-gray-200/80 shadow-xs"
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                {card.title}
              </span>
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${card.iconColor}`}
              >
                <Icon className="w-5 h-5" />
              </div>
            </div>

            <div className="flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-black text-gray-900">
                {typeof card.value === "number"
                  ? card.value.toLocaleString("vi-VN")
                  : card.value}
              </span>
              <span className="text-xs font-medium text-gray-500">{card.unit}</span>
            </div>

            <p className="text-xs text-gray-500 mt-1 font-medium">{card.subtext}</p>
          </div>
        );
      })}
    </div>
  );
};
