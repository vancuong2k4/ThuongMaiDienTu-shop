"use client";

// ============================================================
// components/admin/dashboard/RevenueChart.tsx
// Biểu đồ Doanh thu & Đơn hàng Tương tác Cao cấp (SVG/CSS)
// ============================================================

import React, { useState } from "react";
import { formatCurrency } from "@/lib/utils";
import { BarChart3, TrendingUp, ShoppingCart } from "lucide-react";

interface ChartPoint {
  date: string;
  label: string;
  revenue: number;
  orders: number;
}

interface RevenueChartProps {
  data: ChartPoint[];
  totalRevenue: number;
  totalOrders: number;
}

export const RevenueChart: React.FC<RevenueChartProps> = ({
  data,
  totalRevenue,
  totalOrders,
}) => {
  const [activeTab, setActiveTab] = useState<"revenue" | "orders">("revenue");
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // Tính giá trị cực đại để scale chiều cao cột
  const maxRevenue = Math.max(...data.map((d) => d.revenue), 1);
  const maxOrders = Math.max(...data.map((d) => d.orders), 1);

  const activeHoverItem = hoveredIndex !== null ? data[hoveredIndex] : null;

  return (
    <div className="space-y-4">
      {/* ── Chart Header & Tab Switcher ─────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-slate-800">
              Xu Hướng Vận Hành
            </span>
            <span className="text-xs px-2 py-0.5 rounded-full font-bold bg-wine-50 text-wine-800 border border-wine-200/60">
              {data.length} mốc ngày
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Biểu đồ diễn biến theo thời gian thực từ cơ sở dữ liệu
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="inline-flex items-center p-1 bg-slate-100 rounded-xl">
          <button
            type="button"
            onClick={() => setActiveTab("revenue")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === "revenue"
                ? "bg-white text-wine-800 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Doanh thu ({formatCurrency(totalRevenue)})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("orders")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === "orders"
                ? "bg-white text-wine-800 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <ShoppingCart className="w-3.5 h-3.5" />
            <span>Số đơn ({totalOrders})</span>
          </button>
        </div>
      </div>

      {/* ── Hover Tooltip Display ─────────────────────────────────── */}
      <div className="h-10 flex items-center justify-between px-3 py-1.5 bg-slate-50 rounded-xl border border-slate-200/60 text-xs">
        {activeHoverItem ? (
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-800">
                Ngày {activeHoverItem.label}:
              </span>
              <span className="font-extrabold text-wine-800">
                {formatCurrency(activeHoverItem.revenue)}
              </span>
            </div>
            <div className="flex items-center gap-1 text-slate-600 font-medium">
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              <span>{activeHoverItem.orders} đơn hàng</span>
            </div>
          </div>
        ) : (
          <div className="text-slate-500 italic text-[11px] flex items-center gap-1.5">
            <BarChart3 className="w-3.5 h-3.5 text-slate-400" />
            <span>Di chuột vào từng cột để xem chi tiết doanh thu và đơn hàng mỗi ngày</span>
          </div>
        )}
      </div>

      {/* ── Responsive Bar Chart Area ────────────────────────────── */}
      <div className="pt-6 pb-2">
        <div className="h-56 flex items-end gap-2 sm:gap-4 relative border-b border-slate-200 px-2">
          {/* Background Grid Lines */}
          <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-40">
            <div className="border-b border-dashed border-slate-200 w-full" />
            <div className="border-b border-dashed border-slate-200 w-full" />
            <div className="border-b border-dashed border-slate-200 w-full" />
          </div>

          {data.map((item, index) => {
            const isHovered = hoveredIndex === index;
            const currentVal =
              activeTab === "revenue" ? item.revenue : item.orders;
            const maxVal = activeTab === "revenue" ? maxRevenue : maxOrders;
            const heightPercent =
              maxVal > 0 ? Math.max((currentVal / maxVal) * 100, 4) : 4;

            return (
              <div
                key={item.date}
                className="flex-1 flex flex-col items-center h-full justify-end group relative cursor-pointer"
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                {/* Floating tooltip above bar when hovered */}
                {isHovered && (
                  <div className="absolute -top-10 z-30 bg-slate-900 text-white text-[11px] font-bold px-2.5 py-1 rounded-lg shadow-lg whitespace-nowrap animate-in fade-in duration-150 pointer-events-none">
                    {activeTab === "revenue"
                      ? formatCurrency(item.revenue)
                      : `${item.orders} đơn`}
                  </div>
                )}

                {/* The Bar */}
                <div className="w-full max-w-[48px] h-full flex items-end">
                  <div
                    style={{ height: `${heightPercent}%` }}
                    className={`w-full rounded-t-lg transition-all duration-300 relative ${
                      isHovered
                        ? "bg-gradient-to-t from-wine-800 to-amber-500 shadow-md scale-y-105"
                        : currentVal > 0
                        ? "bg-gradient-to-t from-slate-800 to-wine-700"
                        : "bg-slate-200/70"
                    }`}
                  />
                </div>

                {/* X Axis Date Label */}
                <span
                  className={`text-[11px] mt-2 font-medium transition-colors ${
                    isHovered
                      ? "text-wine-800 font-bold"
                      : "text-slate-500 group-hover:text-slate-800"
                  }`}
                >
                  {item.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
