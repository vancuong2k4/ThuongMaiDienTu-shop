"use client";

// ============================================================
// components/storefront/air-cargo/FlightRadarMap.tsx
// Bản Đồ Radar Quỹ Đạo Hàng Không Úc - Việt Nam SVG Trực Quan (Phase 20)
// ============================================================

import React from "react";
import { Plane, MapPin, Compass, Navigation } from "lucide-react";
import { AIRLINE_CARRIER_CONFIG } from "@/lib/validations/air-cargo";
import { AirlineCarrier } from "@prisma/client";

interface FlightRadarMapProps {
  flightNumber: string;
  carrier: AirlineCarrier;
  originAirport: string;
  originCity: string;
  destAirport: string;
  destCity: string;
  progress: number; // 0 - 100
  altitudeFeet?: number | null;
  latitude?: number | null;
  longitude?: number | null;
  remainingTimeFormatted: string;
}

export const FlightRadarMap: React.FC<FlightRadarMapProps> = ({
  flightNumber,
  carrier,
  originAirport,
  originCity,
  destAirport,
  destCity,
  progress,
  altitudeFeet = 38000,
  latitude,
  longitude,
  remainingTimeFormatted,
}) => {
  const carrierCfg =
    AIRLINE_CARRIER_CONFIG[carrier] ||
    AIRLINE_CARRIER_CONFIG[AirlineCarrier.VIETNAM_AIRLINES_CARGO];

  // SVG Coordinates for Radar View (Width: 800, Height: 450)
  // Australia (Bottom-Right): ~ X: 680, Y: 370
  // Vietnam (Top-Left): ~ X: 160, Y: 90
  const originX = 680;
  const originY = 370;
  const destX = 160;
  const destY = 90;

  // Arc control point (bent towards the west for great-circle look)
  const controlX = 360;
  const controlY = 170;

  // Quadratic Bezier Calculation: B(t) = (1-t)^2 * P0 + 2(1-t)t * P1 + t^2 * P2
  const t = Math.max(0, Math.min(1, progress / 100));
  const planeX =
    Math.pow(1 - t, 2) * originX +
    2 * (1 - t) * t * controlX +
    Math.pow(t, 2) * destX;
  const planeY =
    Math.pow(1 - t, 2) * originY +
    2 * (1 - t) * t * controlY +
    Math.pow(t, 2) * destY;

  // Plane heading angle
  const dx = 2 * (1 - t) * (controlX - originX) + 2 * t * (destX - controlX);
  const dy = 2 * (1 - t) * (controlY - originY) + 2 * t * (destY - controlY);
  const angleRad = Math.atan2(dy, dx);
  const angleDeg = (angleRad * 180) / Math.PI + 90; // Adjust for upward plane icon

  return (
    <div className="relative bg-slate-950 rounded-3xl overflow-hidden border border-slate-800 text-white shadow-2xl font-sans">
      {/* ── 1. Top Flight Telemetry HUD ─────────────────────────── */}
      <div className="absolute top-4 left-4 right-4 z-20 flex flex-wrap items-center justify-between gap-3 bg-slate-900/80 backdrop-blur-md p-3.5 rounded-2xl border border-white/10 text-xs">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-base">{carrierCfg.flag}</span>
            <span className="font-mono font-black text-amber-400 text-sm">
              {flightNumber}
            </span>
          </div>
          <span className="text-slate-500">•</span>
          <span className="text-slate-300 font-medium">
            {originAirport} ➔ {destAirport}
          </span>
        </div>

        {/* Live Metrics */}
        <div className="flex items-center gap-4 text-[11px] font-mono">
          <div>
            <span className="text-slate-400">Tiến độ: </span>
            <span className="font-bold text-emerald-400">{progress}%</span>
          </div>

          {altitudeFeet && altitudeFeet > 0 ? (
            <div>
              <span className="text-slate-400">Độ cao: </span>
              <span className="font-bold text-sky-400">
                {altitudeFeet.toLocaleString()} FT
              </span>
            </div>
          ) : null}

          {latitude && longitude ? (
            <div className="hidden sm:block">
              <span className="text-slate-400">GPS: </span>
              <span className="text-slate-300">
                {latitude}°N, {longitude}°E
              </span>
            </div>
          ) : null}

          <div className="bg-[#800028] px-2.5 py-1 rounded-lg text-white font-bold font-sans">
            {remainingTimeFormatted}
          </div>
        </div>
      </div>

      {/* ── 2. SVG Radar Map ─────────────────────────────────────── */}
      <div className="w-full aspect-16/10 sm:aspect-16/9 relative">
        <svg
          viewBox="0 0 800 450"
          className="w-full h-full object-cover select-none"
        >
          <defs>
            {/* Grid Pattern */}
            <pattern
              id="radar-grid"
              width="40"
              height="40"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 40 0 L 0 0 0 40"
                fill="none"
                stroke="rgba(255, 255, 255, 0.04)"
                strokeWidth="1"
              />
            </pattern>

            {/* Trajectory Glow Gradient */}
            <linearGradient id="flightPathGrad" x1="1" y1="1" x2="0" y2="0">
              <stop offset="0%" stopColor="#800028" />
              <stop offset="50%" stopColor="#f59e0b" />
              <stop offset="100%" stopColor="#10b981" />
            </linearGradient>

            {/* Radar Sweep Effect */}
            <radialGradient id="beaconGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="rgba(16, 185, 129, 0.6)" />
              <stop offset="100%" stopColor="rgba(16, 185, 129, 0)" />
            </radialGradient>
          </defs>

          {/* Background Grid */}
          <rect width="800" height="450" fill="url(#radar-grid)" />

          {/* Radar Circles */}
          <circle
            cx="400"
            cy="225"
            r="180"
            fill="none"
            stroke="rgba(255,255,255,0.05)"
            strokeDasharray="4 4"
          />
          <circle
            cx="400"
            cy="225"
            r="120"
            fill="none"
            stroke="rgba(255,255,255,0.05)"
            strokeDasharray="4 4"
          />

          {/* Decorative Land outlines / Regions text */}
          <text
            x="670"
            y="410"
            fill="rgba(255,255,255,0.3)"
            fontSize="12"
            fontWeight="bold"
            fontFamily="monospace"
            textAnchor="middle"
          >
            AUSTRALIA (ÚC)
          </text>

          <text
            x="160"
            y="65"
            fill="rgba(255,255,255,0.3)"
            fontSize="12"
            fontWeight="bold"
            fontFamily="monospace"
            textAnchor="middle"
          >
            VIỆT NAM (SÂN BAY NỘI BÀI / TSN)
          </text>

          <text
            x="420"
            y="260"
            fill="rgba(255,255,255,0.15)"
            fontSize="10"
            fontFamily="monospace"
            textAnchor="middle"
          >
            KHÔNG PHẬN QUỐC TẾ • BIỂN ĐÔNG
          </text>

          {/* Full Trajectory Curve */}
          <path
            d={`M ${originX} ${originY} Q ${controlX} ${controlY} ${destX} ${destY}`}
            fill="none"
            stroke="rgba(255, 255, 255, 0.15)"
            strokeWidth="2"
            strokeDasharray="6 6"
          />

          {/* Active Flown Trajectory Curve (Glow) */}
          <path
            d={`M ${originX} ${originY} Q ${controlX} ${controlY} ${planeX} ${planeY}`}
            fill="none"
            stroke="url(#flightPathGrad)"
            strokeWidth="3.5"
            strokeLinecap="round"
          />

          {/* Destination Beacon (Vietnam) */}
          <circle cx={destX} cy={destY} r="18" fill="url(#beaconGlow)" />
          <circle
            cx={destX}
            cy={destY}
            r="6"
            fill="#10b981"
            className="animate-ping"
          />
          <circle
            cx={destX}
            cy={destY}
            r="6"
            fill="#10b981"
            stroke="#ffffff"
            strokeWidth="2"
          />
          <text
            x={destX}
            y={destY + 22}
            fill="#10b981"
            fontSize="11"
            fontWeight="bold"
            textAnchor="middle"
          >
            {destAirport}
          </text>

          {/* Origin Beacon (Australia) */}
          <circle
            cx={originX}
            cy={originY}
            r="6"
            fill="#800028"
            stroke="#ffffff"
            strokeWidth="2"
          />
          <text
            x={originX}
            y={originY + 22}
            fill="#fda4af"
            fontSize="11"
            fontWeight="bold"
            textAnchor="middle"
          >
            {originAirport}
          </text>

          {/* Moving Airplane Marker */}
          <g
            transform={`translate(${planeX}, ${planeY}) rotate(${angleDeg})`}
            className="cursor-pointer transition-transform duration-500"
          >
            {/* Plane Ping Ring */}
            <circle
              r="14"
              fill="none"
              stroke="#f59e0b"
              strokeWidth="1.5"
              className="animate-ping"
            />
            {/* Plane Background Circle */}
            <circle r="12" fill="#800028" stroke="#ffffff" strokeWidth="2" />
            {/* SVG Airplane Shape */}
            <path
              d="M 0 -8 L 2 -2 L 8 2 L 8 4 L 2 3 L 2 7 L 4 9 L 4 10 L 0 9 L -4 10 L -4 9 L -2 7 L -2 3 L -8 4 L -8 2 L -2 -2 Z"
              fill="#ffffff"
            />
          </g>
        </svg>

        {/* ── 3. Bottom Corner Legend ────────────────────────────── */}
        <div className="absolute bottom-4 left-4 z-20 flex items-center gap-3 text-[11px] text-slate-400 bg-slate-900/80 backdrop-blur-md px-3.5 py-2 rounded-xl border border-white/10">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#800028]" />
            <span>Sân bay xuất phát ({originCity})</span>
          </div>
          <span className="text-slate-600">•</span>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>Sân bay đích ({destCity})</span>
          </div>
        </div>
      </div>
    </div>
  );
};
