// ============================================================
// app/(storefront)/tra-cuu-air-cargo/page.tsx
// Trung Tâm Tra Cứu Chuyến Bay Air Cargo & Chuỗi Lạnh Cold-Chain (Phase 20)
// ============================================================

import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import {
  Plane,
  Home,
  ChevronRight,
  Search,
  Thermometer,
  ShieldCheck,
  CheckCircle2,
  Clock,
  ArrowRight,
  Compass,
} from "lucide-react";
import { prisma } from "@/lib/prisma";
import {
  calculateFlightKPIs,
  calculateFlightLiveProgress,
} from "@/lib/flight-tracker";
import {
  FLIGHT_STATUS_CONFIG,
  COLD_CHAIN_CATEGORY_CONFIG,
  AIRLINE_CARRIER_CONFIG,
} from "@/lib/validations/air-cargo";

export const metadata: Metadata = {
  title: "Tra Cứu Chuyến Bay Air Cargo & Chuỗi Lạnh Cold-Chain | THUYNGA Shop",
  description:
    "Radar giám sát trực tiếp các chuyến bay chuyên chở hàng Úc bay Air 48h về Việt Nam, kèm số liệu cảm biến nhiệt độ chuỗi lạnh Cold-Chain 0-4°C thời gian thực.",
};

export const revalidate = 60; // 1 minute ISR

export default async function AirCargoSearchPage() {
  const [kpis, flights] = await Promise.all([
    calculateFlightKPIs(),
    prisma.airCargoFlight.findMany({
      orderBy: [{ scheduledArrival: "desc" }],
      include: {
        sensorLogs: {
          orderBy: { recordedAt: "desc" },
          take: 1,
        },
      },
    }),
  ]);

  return (
    <main className="min-h-screen py-6 sm:py-8 lg:py-10 bg-slate-50/60 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* ── 1. Breadcrumbs ────────────────────────────────────── */}
        <nav
          className="flex items-center gap-2 text-xs text-slate-500"
          aria-label="Breadcrumb"
        >
          <Link
            href="/"
            className="flex items-center gap-1 hover:text-[#800028] transition-colors"
          >
            <Home className="w-3.5 h-3.5" />
            <span>Trang chủ</span>
          </Link>
          <ChevronRight className="w-3 h-3 text-slate-400" />
          <span className="text-slate-900 font-bold">
            Tra cứu chuyến bay Air Cargo
          </span>
        </nav>

        {/* ── 2. Hero Section ───────────────────────────────────── */}
        <div className="relative bg-gradient-to-r from-slate-950 via-[#800028] to-slate-950 text-white rounded-3xl p-6 sm:p-10 lg:p-12 shadow-2xl overflow-hidden">
          {/* Subtle radar circle decorations */}
          <div className="absolute -right-20 -bottom-20 w-80 h-80 rounded-full border border-white/10 pointer-events-none" />
          <div className="absolute -right-10 -bottom-10 w-60 h-60 rounded-full border border-white/10 pointer-events-none" />

          <div className="relative z-10 max-w-2xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md text-amber-300 text-xs font-black border border-white/15">
              <Compass className="w-4 h-4 animate-spin" />
              <span>RADAR AIR CARGO TRỰC TIẾP • ÚC ➔ VIỆT NAM</span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight">
              Giám Sát Chuyến Bay Hàng Không & Chuỗi Lạnh Cold-Chain
            </h1>

            <p className="text-xs sm:text-sm text-rose-100/80 leading-relaxed">
              Minh bạch 100% dữ liệu hành trình chuyến bay, nhật ký nhiệt độ cảm biến tự ghi trong thùng xốp hàng không và tiến trình thông quan kiểm dịch của từng lô hàng nhập khẩu từ Úc.
            </p>
          </div>
        </div>

        {/* ── 3. KPI Stats Grid ─────────────────────────────────── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-2xs space-y-1">
            <span className="text-xs font-bold text-slate-500 block">
              Tổng Chuyến Bay Đã Về
            </span>
            <span className="text-2xl font-black text-slate-900 block tracking-tight">
              {kpis.totalFlights} Chuyến
            </span>
            <span className="text-[11px] text-slate-400 block">
              Melbourne & Sydney
            </span>
          </div>

          <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-2xs space-y-1">
            <span className="text-xs font-bold text-slate-500 block">
              Đang Bay Trên Không Phận
            </span>
            <span className="text-2xl font-black text-sky-700 block tracking-tight flex items-center gap-1.5">
              <span>{kpis.activeCruisingFlights} Chuyến</span>
              <span className="w-2 h-2 rounded-full bg-sky-500 animate-pulse" />
            </span>
            <span className="text-[11px] text-slate-400 block">
              Cập nhật GPS trực tiếp
            </span>
          </div>

          <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-2xs space-y-1">
            <span className="text-xs font-bold text-slate-500 block">
              Sản Lượng Bay Air Tích Lũy
            </span>
            <span className="text-2xl font-black text-[#800028] block tracking-tight">
              ~{kpis.totalWeightTons} Tấn
            </span>
            <span className="text-[11px] text-slate-400 block">
              Cherry, Sữa & TPCN Úc
            </span>
          </div>

          <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-2xs space-y-1">
            <span className="text-xs font-bold text-slate-500 block">
              Chuỗi Lạnh Cold-Chain
            </span>
            <span className="text-2xl font-black text-emerald-700 block tracking-tight">
              {kpis.coldChainPassRate}% Đạt Chuẩn
            </span>
            <span className="text-[11px] text-slate-400 block">
              0°C - 4°C bảo quản sâu
            </span>
          </div>
        </div>

        {/* ── 4. Active Flights List ────────────────────────────── */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight flex items-center gap-2">
              <Plane className="w-5 h-5 text-[#800028]" />
              <span>Danh Sách Chuyến Bay Hàng Không Về Gần Nhất</span>
            </h2>

            <span className="text-xs font-bold text-slate-400">
              {flights.length} Chuyến Bay
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {flights.map((flight) => {
              const live = calculateFlightLiveProgress(flight);
              const statusCfg =
                FLIGHT_STATUS_CONFIG[flight.flightStatus] ||
                FLIGHT_STATUS_CONFIG.STORED_COLD;
              const catCfg =
                COLD_CHAIN_CATEGORY_CONFIG[flight.coldChainCategory] ||
                COLD_CHAIN_CATEGORY_CONFIG.ULTRA_COLD_CHERRY;
              const carrierCfg =
                AIRLINE_CARRIER_CONFIG[flight.carrier] ||
                AIRLINE_CARRIER_CONFIG.VIETNAM_AIRLINES_CARGO;

              const latestSensor = flight.sensorLogs[0];

              return (
                <div
                  key={flight.id}
                  className="bg-white rounded-3xl border border-slate-200/90 shadow-2xs hover:shadow-md transition-all p-5 flex flex-col justify-between space-y-4 group"
                >
                  {/* Top Bar */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{carrierCfg.flag}</span>
                      <div>
                        <span className="font-mono font-black text-slate-900 text-sm block">
                          {flight.flightNumber}
                        </span>
                        <span className="text-[10px] text-slate-400 block">
                          {flight.aircraftType}
                        </span>
                      </div>
                    </div>

                    <span
                      className={`text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider border ${statusCfg.bgClass} ${statusCfg.textClass} ${statusCfg.borderClass}`}
                    >
                      {statusCfg.label}
                    </span>
                  </div>

                  {/* Route & Progress */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                      <span>{flight.originCity} ({flight.originAirport})</span>
                      <span className="text-[#800028]">➔</span>
                      <span>{flight.destCity} ({flight.destAirport})</span>
                    </div>

                    {/* Progress Bar */}
                    <div className="space-y-1">
                      <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-[#800028] to-emerald-500 rounded-full transition-all duration-500"
                          style={{ width: `${live.progress}%` }}
                        />
                      </div>
                      <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
                        <span>Tiến trình: {live.progress}%</span>
                        <span className="font-sans font-bold text-slate-700">
                          {live.remainingTimeFormatted}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Cold Chain Badge */}
                  <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <Thermometer className="w-4 h-4 text-sky-600" />
                      <div>
                        <span className="text-[10px] text-slate-400 block">
                          Nhiệt độ cảm biến:
                        </span>
                        <strong className="text-slate-900 font-bold">
                          {latestSensor
                            ? `${latestSensor.temperatureCelsius}°C`
                            : `${flight.averageTemp || 2.1}°C`}
                        </strong>
                      </div>
                    </div>

                    <span className="text-[10px] font-extrabold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      {catCfg.targetRange}
                    </span>
                  </div>

                  {/* Cargo Manifest summary */}
                  {flight.cargoManifestSummary && (
                    <p className="text-[11px] text-slate-500 line-clamp-2 italic leading-relaxed">
                      Kiện hàng: {flight.cargoManifestSummary}
                    </p>
                  )}

                  {/* Detail Link Button */}
                  <Link
                    href={`/tra-cuu-air-cargo/${flight.flightNumber}`}
                    className="w-full py-2.5 rounded-2xl bg-slate-900 group-hover:bg-[#800028] text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors shadow-xs"
                  >
                    <span>Xem Radar & Chuỗi Lạnh Chi Tiết</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </main>
  );
}
