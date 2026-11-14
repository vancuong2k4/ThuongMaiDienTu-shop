// ============================================================
// components/admin/family-health/FamilyHealthStats.tsx
// Các Thẻ Chỉ Số KPI Tủ Thuốc Gia Đình & Khách Sắp Hết Hộp (Phase 22)
// ============================================================

import React from "react";
import { Users, Heart, Clock, AlertTriangle } from "lucide-react";
import type { AdminFamilyKPIs } from "./types";

interface FamilyHealthStatsProps {
  kpis: AdminFamilyKPIs;
}

export const FamilyHealthStats: React.FC<FamilyHealthStatsProps> = ({ kpis }) => {
  const cards = [
    {
      title: "Hộ Gia Đình Tham Gia",
      value: kpis.totalProfiles,
      unit: "hộ gia đình",
      subtext: "Đã kích hoạt tủ thuốc sức khỏe",
      icon: Users,
      bgColor: "bg-blue-50 text-blue-700 border-blue-200",
      iconColor: "text-blue-600 bg-blue-100",
    },
    {
      title: "Tổng Số Thành Viên",
      value: kpis.totalMembers,
      unit: "thành viên",
      subtext: "Trẻ em, mẹ bầu, ông bà 3 thế hệ",
      icon: Heart,
      bgColor: "bg-rose-50 text-rose-700 border-rose-200",
      iconColor: "text-rose-600 bg-rose-100",
    },
    {
      title: "Lịch Uống Đang Theo Dõi",
      value: kpis.totalSchedules,
      unit: "cữ uống vi chất",
      subtext: "Theo chuẩn nhịp sinh học 24h",
      icon: Clock,
      bgColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
      iconColor: "text-emerald-600 bg-emerald-100",
    },
    {
      title: "Sắp Hết Hộp Trong 7 Ngày",
      value: kpis.urgentRestocksCount,
      unit: "cảnh báo tái nạp",
      subtext: "Hot lead CRM cần Dược sĩ liên hệ",
      icon: AlertTriangle,
      bgColor: "bg-amber-50 text-amber-800 border-amber-300",
      iconColor: "text-amber-600 bg-amber-100",
      highlight: kpis.urgentRestocksCount > 0,
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
                ? "bg-amber-50/80 border-amber-300 shadow-sm ring-1 ring-amber-400"
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
                {card.value.toLocaleString("vi-VN")}
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
