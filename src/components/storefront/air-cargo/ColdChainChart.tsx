"use client";

// ============================================================
// components/storefront/air-cargo/ColdChainChart.tsx
// Biểu Đồ Giám Sát Cảm Biến Nhiệt Độ Chuỗi Lạnh Cold-Chain SVG (Phase 20)
// ============================================================

import React, { useState } from "react";
import {
  Thermometer,
  ShieldCheck,
  CheckCircle2,
  Droplets,
  BatteryCharging,
  AlertTriangle,
  Info,
} from "lucide-react";
import { ColdChainAnalysis } from "@/lib/flight-tracker";
import { ColdChainCategory } from "@prisma/client";
import { COLD_CHAIN_CATEGORY_CONFIG } from "@/lib/validations/air-cargo";

export interface SensorPoint {
  id: string;
  recordedAt: string | Date;
  temperatureCelsius: number;
  humidityPercent: number | null;
  stageName: string;
}

interface ColdChainChartProps {
  logs: SensorPoint[];
  coldChainAnalysis: ColdChainAnalysis;
  targetTempMin: number;
  targetTempMax: number;
  coldChainCategory: ColdChainCategory;
  sensorId?: string;
}

export const ColdChainChart: React.FC<ColdChainChartProps> = ({
  logs,
  coldChainAnalysis,
  targetTempMin,
  targetTempMax,
  coldChainCategory,
  sensorId = "SENS-LOGGER-TAS-01",
}) => {
  const [activePoint, setActivePoint] = useState<SensorPoint | null>(
    logs.length > 0 ? logs[logs.length - 1] : null
  );

  const catCfg =
    COLD_CHAIN_CATEGORY_CONFIG[coldChainCategory] ||
    COLD_CHAIN_CATEGORY_CONFIG[ColdChainCategory.ULTRA_COLD_CHERRY];

  // SVG Chart Geometry
  const chartWidth = 700;
  const chartHeight = 260;
  const paddingX = 50;
  const paddingY = 40;

  // Temperature Y scale: min display temp to max display temp
  const yMin = Math.min(targetTempMin - 1.5, ...logs.map((l) => l.temperatureCelsius));
  const yMax = Math.max(targetTempMax + 1.5, ...logs.map((l) => l.temperatureCelsius));
  const yRange = Math.max(1, yMax - yMin);

  const getY = (temp: number) => {
    const ratio = (temp - yMin) / yRange;
    return chartHeight - paddingY - ratio * (chartHeight - paddingY * 2);
  };

  const getX = (index: number) => {
    if (logs.length <= 1) return chartWidth / 2;
    return (
      paddingX +
      (index / (logs.length - 1)) * (chartWidth - paddingX * 2)
    );
  };

  // Safe Zone Rectangle coordinates
  const safeTopY = getY(targetTempMax);
  const safeBottomY = getY(targetTempMin);
  const safeHeight = Math.abs(safeBottomY - safeTopY);

  // Polyline points
  const pointsString = logs
    .map((l, i) => `${getX(i)},${getY(l.temperatureCelsius)}`)
    .join(" ");

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6 font-sans">
      {/* ── 1. Header with KPIs ─────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-sky-50 text-sky-700 flex items-center justify-center border border-sky-100">
            <Thermometer className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
              Giám Sát Nhiệt Độ Chuỗi Lạnh Cold-Chain
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Dữ liệu cảm biến tự ghi USB Logger theo chuẩn IATA DGR Hàng Không
            </p>
          </div>
        </div>

        {/* Quality Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-black">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{coldChainAnalysis.complianceRatePercent}% Tuân Thủ Chuỗi Lạnh</span>
        </div>
      </div>

      {/* ── 2. Summary KPI Metrics ──────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
          <span className="text-[11px] font-bold text-slate-400 block">
            Nhiệt độ trung bình:
          </span>
          <span className="text-lg font-black text-sky-700 block">
            {coldChainAnalysis.avgTemp}°C
          </span>
          <span className="text-[10px] text-slate-500 block">
            Ổn định suốt 9h bay
          </span>
        </div>

        <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
          <span className="text-[11px] font-bold text-slate-400 block">
            Dải nhiệt độ chuẩn:
          </span>
          <span className="text-lg font-black text-emerald-700 block">
            {targetTempMin}°C - {targetTempMax}°C
          </span>
          <span className="text-[10px] text-slate-500 block">{catCfg.label}</span>
        </div>

        <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
          <span className="text-[11px] font-bold text-slate-400 block">
            Tổng lượt quét cảm biến:
          </span>
          <span className="text-lg font-black text-slate-900 block">
            {coldChainAnalysis.totalReadings} điểm đo
          </span>
          <span className="text-[10px] text-slate-500 block">
            Ghi nhận mỗi 1-2 giờ
          </span>
        </div>

        <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
          <span className="text-[11px] font-bold text-slate-400 block">
            Mã thiết bị Sensor:
          </span>
          <span className="text-xs font-mono font-bold text-slate-700 block pt-1 truncate">
            {sensorId}
          </span>
          <span className="text-[10px] text-emerald-600 font-bold block">
            Pin 98% • Đạt chuẩn IATA
          </span>
        </div>
      </div>

      {/* ── 3. SVG Line Chart ────────────────────────────────────── */}
      <div className="relative bg-slate-950 rounded-2xl p-4 overflow-hidden border border-slate-800 text-white">
        <div className="flex items-center justify-between text-xs pb-2 border-b border-white/10 text-slate-400">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <span>Dải kiểm soát an toàn ({targetTempMin}°C ➔ {targetTempMax}°C)</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-sky-400" />
              <span>Nhiệt độ thực tế</span>
            </span>
          </div>

          <span className="font-mono text-[11px]">Đơn vị: Độ C (°C)</span>
        </div>

        <div className="w-full aspect-16/7 sm:aspect-16/6 relative">
          <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full h-full">
            {/* Safe Zone Highlight Rectangle */}
            <rect
              x={paddingX}
              y={safeTopY}
              width={chartWidth - paddingX * 2}
              height={safeHeight}
              fill="rgba(16, 185, 129, 0.12)"
              stroke="rgba(16, 185, 129, 0.3)"
              strokeDasharray="4 4"
            />
            <text
              x={chartWidth - paddingX - 10}
              y={safeTopY + 16}
              fill="#10b981"
              fontSize="10"
              fontWeight="bold"
              textAnchor="end"
            >
              VÙNG AN TOÀN CHUỖI LẠNH ({targetTempMin} - {targetTempMax}°C)
            </text>

            {/* Target lines */}
            <line
              x1={paddingX}
              y1={safeTopY}
              x2={chartWidth - paddingX}
              y2={safeTopY}
              stroke="#10b981"
              strokeWidth="1"
              strokeDasharray="3 3"
            />
            <line
              x1={paddingX}
              y1={safeBottomY}
              x2={chartWidth - paddingX}
              y2={safeBottomY}
              stroke="#10b981"
              strokeWidth="1"
              strokeDasharray="3 3"
            />

            {/* Temperature Path */}
            {logs.length > 1 && (
              <polyline
                fill="none"
                stroke="#38bdf8"
                strokeWidth="2.5"
                points={pointsString}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            )}

            {/* Data Points */}
            {logs.map((l, idx) => {
              const cx = getX(idx);
              const cy = getY(l.temperatureCelsius);
              const isSelected = activePoint?.id === l.id;

              return (
                <g
                  key={l.id}
                  onClick={() => setActivePoint(l)}
                  className="cursor-pointer group"
                >
                  <circle
                    cx={cx}
                    cy={cy}
                    r={isSelected ? "7" : "4.5"}
                    fill={isSelected ? "#38bdf8" : "#0284c7"}
                    stroke="#ffffff"
                    strokeWidth="2"
                    className="transition-all hover:scale-125"
                  />
                  {isSelected && (
                    <circle
                      cx={cx}
                      cy={cy}
                      r="12"
                      fill="none"
                      stroke="#38bdf8"
                      strokeWidth="1.5"
                      className="animate-ping"
                    />
                  )}
                </g>
              );
            })}
          </svg>
        </div>

        {/* ── 4. Active Point Detailed Inspector ─────────────────── */}
        {activePoint && (
          <div className="mt-3 p-3 rounded-xl bg-slate-900 border border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-sky-400" />
              <strong className="text-white">{activePoint.stageName}</strong>
              <span className="text-slate-400">
                ({new Date(activePoint.recordedAt).toLocaleString("vi-VN")})
              </span>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5 font-bold text-sky-400">
                <Thermometer className="w-3.5 h-3.5" />
                <span>{activePoint.temperatureCelsius}°C</span>
              </div>
              {activePoint.humidityPercent && (
                <div className="flex items-center gap-1.5 text-slate-300">
                  <Droplets className="w-3.5 h-3.5 text-blue-400" />
                  <span>{activePoint.humidityPercent}% Độ ẩm</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* ── 5. Pharmacist & Quality Note ────────────────────────── */}
      <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-950 text-xs flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
        <div className="space-y-0.5">
          <strong className="font-bold">Đảm bảo chuỗi lạnh khép kín (Cold-Chain Guarantee):</strong>
          <p className="text-emerald-800 leading-relaxed">
            {coldChainAnalysis.statusText} Hàng được bọc xốp giữ nhiệt đa lớp, đá khô gel sinh học và lưu trữ trong khoang máy bay điều áp chuẩn 2°C từ Úc về Việt Nam.
          </p>
        </div>
      </div>
    </div>
  );
};
