"use client";

// ============================================================
// components/admin/protocols/ProtocolStats.tsx
// 5 Thẻ Thống Kê KPI Phác Đồ Dinh Dưỡng & Tư Vấn Dược Sĩ (Phase 16)
// ============================================================

import React from "react";
import {
  ClipboardCheck,
  Clock,
  UserCheck,
  Stethoscope,
  Award,
} from "lucide-react";
import { ProtocolKPIs } from "./types";

interface ProtocolStatsProps {
  kpis: ProtocolKPIs;
}

export const ProtocolStats: React.FC<ProtocolStatsProps> = ({ kpis }) => {
  const cards = [
    {
      label: "Lượt trắc nghiệm sức khỏe",
      value: kpis.totalAssessments,
      unit: "lượt",
      description: "Khách hàng hoàn thành bài test",
      icon: ClipboardCheck,
      color: "text-sky-600 bg-sky-50 border-sky-100",
    },
    {
      label: "Lịch hẹn chờ Dược sĩ gọi",
      value: kpis.pendingBookings,
      unit: "lịch",
      description: "Cần phân công Dược sĩ liên hệ",
      icon: Clock,
      color: "text-amber-600 bg-amber-50 border-amber-100",
    },
    {
      label: "Đã tư vấn hoàn tất",
      value: kpis.completedBookings,
      unit: `/${kpis.totalBookings} cuộc`,
      description: "Tư vấn 1-1 chuyên sâu qua điện thoại",
      icon: UserCheck,
      color: "text-emerald-600 bg-emerald-50 border-emerald-100",
    },
    {
      label: "Phác đồ đang lưu hành",
      value: kpis.totalProtocols,
      unit: "phác đồ",
      description: "Chuẩn y khoa Dược sĩ Úc",
      icon: Stethoscope,
      color: "text-[#800028] bg-rose-50 border-rose-100",
    },
    {
      label: "Tỷ lệ chốt combo phác đồ",
      value: "84.5%",
      unit: "",
      description: "Khách mua trọn bộ combo giảm 10%",
      icon: Award,
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
