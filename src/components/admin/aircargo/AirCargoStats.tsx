"use client";

// ============================================================
// components/admin/aircargo/AirCargoStats.tsx
// 5 Thẻ Thống Kê KPI Vận Hành Lô Hàng Bay Air & Chuỗi Cung Ứng Lạnh
// ============================================================

import React from "react";
import { Plane, CheckCircle2, Clock, Search, Thermometer } from "lucide-react";
import { AirCargoKPIs } from "./types";

interface AirCargoStatsProps {
  kpis: AirCargoKPIs;
}

export const AirCargoStats: React.FC<AirCargoStatsProps> = ({ kpis }) => {
  const cards = [
    {
      label: "Tổng chuyến bay Air",
      value: kpis.totalShipments,
      unit: "chuyến",
      description: "Chặng bay SYD/MEL về Nội Bài",
      icon: Plane,
      color: "text-sky-600 bg-sky-50 border-sky-100",
    },
    {
      label: "Lô hàng đang lưu hành",
      value: kpis.activeBatches,
      unit: `/${kpis.totalBatches} lô`,
      description: "Cam kết HSD > 18-24 tháng",
      icon: CheckCircle2,
      color: "text-emerald-600 bg-emerald-50 border-emerald-100",
    },
    {
      label: "Chuyến bay đang vận chuyển",
      value: kpis.inTransitShipments,
      unit: "chuyến",
      description: "Khoang mát kiểm soát nhiệt độ",
      icon: Clock,
      color: "text-amber-600 bg-amber-50 border-amber-100",
    },
    {
      label: "Lượt khách tra cứu AWB",
      value: kpis.totalVerifications,
      unit: "lượt",
      description: "Khách quét mã QR / tra cứu mã lô",
      icon: Search,
      color: "text-[#800028] bg-rose-50 border-rose-100",
    },
    {
      label: "Chuẩn nhiệt độ kho lạnh",
      value: "18° - 24°C",
      unit: "",
      description: "Duy trì nguyên vẹn dinh dưỡng",
      icon: Thermometer,
      color: "text-indigo-600 bg-indigo-50 border-indigo-100",
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3.5 sm:gap-4">
      {cards.map((c, i) => {
        const Icon = c.icon;
        return (
          <div
            key={i}
            className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-slate-500 line-clamp-1">
                {c.label}
              </span>
              <div className={`p-2 rounded-xl border ${c.color}`}>
                <Icon className="w-4 h-4" />
              </div>
            </div>
            <div>
              <div className="flex items-baseline gap-1">
                <span className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                  {c.value}
                </span>
                {c.unit && (
                  <span className="text-xs font-semibold text-slate-500">
                    {c.unit}
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-400 mt-1 line-clamp-1">
                {c.description}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};
