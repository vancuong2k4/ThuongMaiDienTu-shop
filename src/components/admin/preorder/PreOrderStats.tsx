"use client";

// ============================================================
// components/admin/preorder/PreOrderStats.tsx
// 4 Thẻ Thống Kê KPI Chiến Dịch & Doanh Thu Cọc Mùa Vụ Úc (Phase 21)
// ============================================================

import React from "react";
import { Calendar, Plane, ShieldCheck, Users } from "lucide-react";
import type { AdminPreOrderKPIs } from "./types";

interface PreOrderStatsProps {
  kpis: AdminPreOrderKPIs;
}

export const PreOrderStats: React.FC<PreOrderStatsProps> = ({ kpis }) => {
  const formatVND = (n: number) => {
    return new Intl.NumberFormat("vi-VN").format(n) + "₫";
  };

  const cards = [
    {
      title: "Tổng Chiến Dịch Mùa Vụ",
      value: kpis.totalCampaigns,
      unit: "chiến dịch",
      desc: "Cherry Tasmania, Manuka MGO 1200+...",
      icon: Calendar,
      color: "from-blue-600 to-indigo-700",
      textColor: "text-blue-700",
      bgColor: "bg-blue-50",
    },
    {
      title: "Chiến Dịch Đang Mở Cọc",
      value: kpis.activeCampaigns,
      unit: "vụ mùa",
      desc: "Tiếp nhận giữ slot khoang bay",
      icon: Plane,
      color: "from-emerald-600 to-teal-700",
      textColor: "text-emerald-700",
      bgColor: "bg-emerald-50",
    },
    {
      title: "Tiền Cọc Đã Thu (VietQR)",
      value: formatVND(kpis.totalDepositRevenue),
      unit: "",
      desc: `Tổng giá trị HĐ: ${formatVND(kpis.totalContractValue)}`,
      icon: ShieldCheck,
      color: "from-[#800028] to-rose-900",
      textColor: "text-[#800028]",
      bgColor: "bg-rose-50",
    },
    {
      title: "Khách Đã Giữ Chỗ",
      value: kpis.totalReservations,
      unit: "khách",
      desc: "Tỷ lệ xác nhận cọc đạt 100%",
      icon: Users,
      color: "from-amber-500 to-orange-600",
      textColor: "text-amber-700",
      bgColor: "bg-amber-50",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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
                <span className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
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
