// ============================================================
// app/(storefront)/tra-cuu-air-cargo/[flightNumber]/page.tsx
// Chi Tiết Radar Chuyến Bay & Nhật Ký Cảm Biến Chuỗi Lạnh (Phase 20)
// ============================================================

import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Plane,
  Home,
  ChevronRight,
  ShieldCheck,
  Package,
  Calendar,
  Clock,
  ArrowRight,
} from "lucide-react";
import { prisma } from "@/lib/prisma";
import {
  calculateFlightLiveProgress,
  evaluateColdChainAnalytics,
} from "@/lib/flight-tracker";
import {
  FLIGHT_STATUS_CONFIG,
  COLD_CHAIN_CATEGORY_CONFIG,
  AIRLINE_CARRIER_CONFIG,
} from "@/lib/validations/air-cargo";
import { FlightRadarMap } from "@/components/storefront/air-cargo/FlightRadarMap";
import { ColdChainChart } from "@/components/storefront/air-cargo/ColdChainChart";
import { FlightMilestoneTimeline } from "@/components/storefront/air-cargo/FlightMilestoneTimeline";
import { AirlineCarrier } from "@prisma/client";

interface FlightDetailPageProps {
  params: Promise<{ flightNumber: string }>;
}

export async function generateMetadata({
  params,
}: FlightDetailPageProps): Promise<Metadata> {
  const { flightNumber } = await params;
  const num = flightNumber.toUpperCase();
  return {
    title: `Radar Chuyến Bay ${num} & Chuỗi Lạnh Cold-Chain | THUYNGA Shop`,
    description: `Theo dõi hành trình bay trực tiếp của chuyến bay hàng không ${num} từ Úc về Việt Nam và bản ghi nhiệt độ cảm biến tự ghi 0-4°C.`,
  };
}

export const revalidate = 30; // 30 seconds

export default async function FlightDetailPage({
  params,
}: FlightDetailPageProps) {
  const { flightNumber } = await params;
  const cleanNumber = flightNumber.trim().toUpperCase();

  const flight = await prisma.airCargoFlight.findUnique({
    where: { flightNumber: cleanNumber },
    include: {
      milestones: {
        orderBy: { stepNumber: "asc" },
      },
      sensorLogs: {
        orderBy: { recordedAt: "asc" },
      },
      shipment: {
        include: {
          batches: {
            include: {
              product: {
                select: {
                  id: true,
                  name: true,
                  slug: true,
                  brand: true,
                  specification: true,
                },
              },
            },
          },
        },
      },
    },
  });

  if (!flight) {
    notFound();
  }

  const live = calculateFlightLiveProgress(flight);
  const coldChain = evaluateColdChainAnalytics(
    flight.sensorLogs,
    flight.targetTempMin,
    flight.targetTempMax
  );

  const statusCfg =
    FLIGHT_STATUS_CONFIG[flight.flightStatus] ||
    FLIGHT_STATUS_CONFIG.STORED_COLD;
  const carrierCfg =
    AIRLINE_CARRIER_CONFIG[flight.carrier] ||
    AIRLINE_CARRIER_CONFIG[AirlineCarrier.VIETNAM_AIRLINES_CARGO];

  const batches = flight.shipment?.batches || [];

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
          <Link
            href="/tra-cuu-air-cargo"
            className="hover:text-[#800028] transition-colors"
          >
            Tra cứu Air Cargo
          </Link>
          <ChevronRight className="w-3 h-3 text-slate-400" />
          <span className="text-slate-900 font-bold">{flight.flightNumber}</span>
        </nav>

        {/* ── 2. Flight Header Summary ──────────────────────────── */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-3xl bg-[#800028] text-white flex items-center justify-center font-black text-2xl shadow-xs">
              <Plane className="w-8 h-8" />
            </div>

            <div>
              <div className="flex items-center gap-2.5">
                <span className="text-xl">{carrierCfg.flag}</span>
                <h1 className="text-xl sm:text-3xl font-black text-slate-900 tracking-tight">
                  Chuyến Bay {flight.flightNumber}
                </h1>
                <span
                  className={`text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider border ${statusCfg.bgClass} ${statusCfg.textClass} ${statusCfg.borderClass}`}
                >
                  {statusCfg.label}
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs text-slate-500 mt-1">
                <span>{carrierCfg.name}</span>
                <span>•</span>
                <span className="font-semibold text-slate-700">
                  {flight.aircraftType}
                </span>
                <span>•</span>
                <span>
                  {flight.originCity} ({flight.originAirport}) ➔{" "}
                  {flight.destCity} ({flight.destAirport})
                </span>
              </div>
            </div>
          </div>

          {/* Departure & Arrival Badges */}
          <div className="flex items-center gap-3 text-right">
            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 text-xs text-left">
              <span className="text-[10px] text-slate-400 block font-medium">
                Cất cánh từ Úc:
              </span>
              <strong className="text-slate-900 block font-bold">
                {new Date(flight.scheduledDeparture).toLocaleDateString("vi-VN", {
                  hour: "2-digit",
                  minute: "2-digit",
                  day: "2-digit",
                  month: "2-digit",
                })}
              </strong>
            </div>

            <div className="p-3 rounded-2xl bg-emerald-50/70 border border-emerald-100 text-xs text-left">
              <span className="text-[10px] text-emerald-700 block font-medium">
                Hạ cánh Việt Nam:
              </span>
              <strong className="text-emerald-950 block font-bold">
                {new Date(flight.scheduledArrival).toLocaleDateString("vi-VN", {
                  hour: "2-digit",
                  minute: "2-digit",
                  day: "2-digit",
                  month: "2-digit",
                })}
              </strong>
            </div>
          </div>
        </div>

        {/* ── 3. Radar Map Component ────────────────────────────── */}
        <FlightRadarMap
          flightNumber={flight.flightNumber}
          carrier={flight.carrier}
          originAirport={flight.originAirport}
          originCity={flight.originCity}
          destAirport={flight.destAirport}
          destCity={flight.destCity}
          progress={live.progress}
          altitudeFeet={flight.currentAltitudeFeet}
          latitude={live.currentLatitude}
          longitude={live.currentLongitude}
          remainingTimeFormatted={live.remainingTimeFormatted}
        />

        {/* ── 4. Grid: Cold-Chain Chart & Milestone Timeline ────── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Temperature Sensor Chart (7/12) */}
          <div className="lg:col-span-7">
            <ColdChainChart
              logs={flight.sensorLogs}
              coldChainAnalysis={coldChain}
              targetTempMin={flight.targetTempMin}
              targetTempMax={flight.targetTempMax}
              coldChainCategory={flight.coldChainCategory}
            />
          </div>

          {/* Flight Milestones (5/12) */}
          <div className="lg:col-span-5">
            <FlightMilestoneTimeline milestones={flight.milestones} />
          </div>
        </div>

        {/* ── 5. Cargo Manifest & Connected Batches ─────────────── */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
            <Package className="w-5 h-5 text-[#800028]" />
            <h3 className="font-black text-base text-slate-900 tracking-tight">
              Bản Kê Kiện Hàng Hóa Air Cargo (Manifest)
            </h3>
          </div>

          {flight.cargoManifestSummary && (
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-100">
              {flight.cargoManifestSummary}
            </p>
          )}

          {batches.length > 0 && (
            <div className="space-y-3 pt-2">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Các lô sản phẩm nhập kho từ chuyến bay này:
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {batches.map((b) => (
                  <div
                    key={b.id}
                    className="p-3.5 rounded-2xl bg-white border border-slate-200 hover:border-[#800028] shadow-2xs flex items-center justify-between gap-3 transition-colors"
                  >
                    <div>
                      <span className="text-[10px] font-mono font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded block w-fit">
                        {b.batchCode}
                      </span>
                      <h5 className="font-extrabold text-xs text-slate-900 mt-1 line-clamp-1">
                        {b.product.name}
                      </h5>
                      <span className="text-[10px] text-slate-400 block mt-0.5">
                        HSD: {new Date(b.expiryDate).toLocaleDateString("vi-VN")}
                      </span>
                    </div>

                    <Link
                      href={`/san-pham/${b.product.slug}`}
                      className="p-2 rounded-xl bg-slate-100 hover:bg-[#800028] text-slate-600 hover:text-white transition-colors shrink-0"
                      title="Xem sản phẩm"
                    >
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
