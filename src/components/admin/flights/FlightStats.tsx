"use client";

// ============================================================
// components/admin/flights/FlightStats.tsx
// 5 Thẻ Thống Kê KPI Chuyến Bay Air Cargo & Chuỗi Lạnh
// ============================================================

import React from "react";
import {
  Plane,
  Compass,
  Thermometer,
  Package,
  ShieldCheck,
} from "lucide-react";
import type { AdminFlightKPIs } from "./types";

interface FlightStatsProps {
  kpis: AdminFlightKPIs;
}

export const FlightStats: React.FC<FlightStatsProps> = ({ kpis }) => {
  const cards = [
    {
      title: "Tổng Chuyến Bay Air",
      value: kpis.totalFlights,
      unit: "chuyến",
      desc: "Vietnam Airlines & Qantas Freight",
      icon: Plane,
      color: "from-blue-600 to-indigo-700",
      textColor: "text-blue-700",
      bgColor: "bg-blue-50",
    },
    {
      title: "Đang Bay Trên Không",
      value: kpis.activeCruisingFlights,
      unit: "chuyến",
      desc: "Theo dõi tọa độ GPS trực tiếp",
      icon: Compass,
      color: "from-amber-500 to-orange-600",
      textColor: "text-amber-700",
      bgColor: "bg-amber-50",
    },
    {
      title: "Đã Nhập Kho Lạnh",
      value: kpis.storedColdFlights,
      unit: "chuyến",
      desc: "Lưu trữ kho mát 18-24°C / 0-4°C",
      icon: ShieldCheck,
      color: "from-emerald-600 to-teal-700",
      textColor: "text-emerald-700",
      bgColor: "bg-emerald-50",
    },
    {
      title: "Tuân Thủ Chuỗi Lạnh",
      value: `${kpis.coldChainPassRate}%`,
      unit: "",
      desc: "Dữ liệu cảm biến trong ngưỡng an toàn",
      icon: Thermometer,
      color: "from-sky-600 to-cyan-700",
      textColor: "text-sky-700",
      bgColor: "bg-sky-50",
    },
    {
      title: "Sản Lượng Bay Air",
      value: kpis.totalWeightTons,
      unit: "tấn",
      desc: "Cherry Úc, Sữa Aptamil & Vitamin",
      icon: Package,
      color: "from-[#800028] to-rose-900",
      textColor: "text-[#800028]",
      bgColor: "bg-rose-50",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <div
            key={idx}
            className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                {card.title}
              </span>
              <div
                className={`w-9 h-9 rounded-xl ${card.bgColor} ${card.textColor} flex items-center justify-center`}
              >
                <Icon className="w-5 h-5" />
              </div>
            </div>

            <div className="mt-3">
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl font-black text-slate-900 tracking-tight">
                  {card.value}
                </span>
                {card.unit && (
                  <span className="text-xs font-semibold text-slate-500">
                    {card.unit}
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-400 mt-1 line-clamp-1">
                {card.desc}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};
