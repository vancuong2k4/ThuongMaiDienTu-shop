"use client";

// ============================================================
// components/storefront/air-cargo/LiveFlightTicker.tsx
// Dải Băng Thông Tin Chuyến Bay Air Cargo Trực Tiếp Storefront (Phase 20)
// ============================================================

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Plane, Thermometer, Compass, ArrowRight } from "lucide-react";

interface TickerFlight {
  flightNumber: string;
  carrierFlag: string;
  origin: string;
  dest: string;
  statusLabel: string;
  progress: number;
  temp: string;
  isCruising: boolean;
}

export const LiveFlightTicker: React.FC = () => {
  const [flights, setFlights] = useState<TickerFlight[]>([
    {
      flightNumber: "VN772",
      carrierFlag: "🇻🇳",
      origin: "Sydney (SYD)",
      dest: "Hà Nội (HAN)",
      statusLabel: "Đang bay trên không",
      progress: 68,
      temp: "2.2°C",
      isCruising: true,
    },
    {
      flightNumber: "VN780",
      carrierFlag: "🇻🇳",
      origin: "Melbourne (MEL)",
      dest: "Hà Nội (HAN)",
      statusLabel: "Đã nhập kho lạnh",
      progress: 100,
      temp: "2.1°C",
      isCruising: false,
    },
    {
      flightNumber: "QF7561",
      carrierFlag: "🇦🇺",
      origin: "Melbourne (MEL)",
      dest: "TP.HCM (SGN)",
      statusLabel: "Đang thông quan",
      progress: 92,
      temp: "20.8°C",
      isCruising: false,
    },
  ]);

  useEffect(() => {
    // Optionally fetch dynamic live flights
    fetch("/api/air-cargo/flights")
      .then((res) => res.json())
      .then((json) => {
        if (json.success && json.flights && json.flights.length > 0) {
          const list: TickerFlight[] = json.flights.map((f: any) => ({
            flightNumber: f.flightNumber,
            carrierFlag: f.carrier === "QANTAS_FREIGHT" ? "🇦🇺" : "🇻🇳",
            origin: `${f.originCity.split(" ")[0]} (${f.originAirport})`,
            dest: `${f.destCity.split(" ")[0]} (${f.destAirport})`,
            statusLabel:
              f.flightStatus === "CRUISING"
                ? "Đang bay trên không"
                : f.flightStatus === "STORED_COLD"
                ? "Đã nhập kho lạnh"
                : "Đang thông quan",
            progress: f.progress || 100,
            temp: f.latestSensor ? `${f.latestSensor.temperatureCelsius}°C` : "2.1°C",
            isCruising: f.flightStatus === "CRUISING",
          }));
          setFlights(list);
        }
      })
      .catch(() => {});
  }, []);

  return (
    <div className="bg-slate-900 text-white border-y border-slate-800 py-2 px-4 font-sans text-xs overflow-hidden">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2.5">
        {/* Left: Ticker Title */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="w-5 h-5 rounded-md bg-[#800028] flex items-center justify-center text-white">
            <Compass className="w-3.5 h-3.5 animate-spin" />
          </div>
          <span className="font-black text-[11px] uppercase tracking-wider text-amber-400">
            Radar Air Cargo Úc
          </span>
          <span className="text-slate-600 hidden sm:inline">•</span>
        </div>

        {/* Center: Live Flight Pills Carousel */}
        <div className="flex items-center gap-2.5 overflow-x-auto scrollbar-none py-0.5">
          {flights.map((f) => (
            <Link
              key={f.flightNumber}
              href={`/tra-cuu-air-cargo/${f.flightNumber}`}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-xl bg-slate-800/90 hover:bg-slate-700/90 border border-slate-700 hover:border-amber-400/50 transition-all text-[11px] shrink-0 group"
            >
              <span>{f.carrierFlag}</span>
              <span className="font-mono font-black text-amber-400">
                {f.flightNumber}
              </span>
              <span className="text-slate-400 hidden md:inline">
                {f.origin} ➔ {f.dest}
              </span>
              {f.isCruising ? (
                <span className="inline-flex items-center gap-1 font-bold text-sky-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-pulse" />
                  <span>Bay {f.progress}%</span>
                </span>
              ) : (
                <span className="font-bold text-emerald-400">
                  {f.statusLabel}
                </span>
              )}
              <span className="inline-flex items-center gap-0.5 text-slate-300 font-mono">
                <Thermometer className="w-3 h-3 text-sky-400" />
                <span>{f.temp}</span>
              </span>
            </Link>
          ))}
        </div>

        {/* Right: View All */}
        <Link
          href="/tra-cuu-air-cargo"
          className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-300 hover:text-white hover:underline shrink-0"
        >
          <span>Xem tất cả radar</span>
          <ArrowRight className="w-3 h-3" />
        </Link>
      </div>
    </div>
  );
};
