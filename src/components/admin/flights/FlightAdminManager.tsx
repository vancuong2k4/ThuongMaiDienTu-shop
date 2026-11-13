"use client";

// ============================================================
// components/admin/flights/FlightAdminManager.tsx
// Bộ Điều Phối Quản Trị Chuyến Bay Air Cargo & Chuỗi Lạnh
// ============================================================

import React, { useState } from "react";
import Link from "next/link";
import {
  Plane,
  Compass,
  Plus,
  RefreshCw,
  Search,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";
import { FlightStats } from "./FlightStats";
import { FlightTable } from "./FlightTable";
import { CreateFlightModal } from "./CreateFlightModal";
import { AddSensorLogModal } from "./AddSensorLogModal";
import type { AdminFlightItem, AdminFlightKPIs, FlightStatusType } from "./types";

interface FlightAdminManagerProps {
  initialFlights: AdminFlightItem[];
  initialKpis: AdminFlightKPIs;
}

export const FlightAdminManager: React.FC<FlightAdminManagerProps> = ({
  initialFlights,
  initialKpis,
}) => {
  const [flights, setFlights] = useState<AdminFlightItem[]>(initialFlights);
  const [kpis, setKpis] = useState<AdminFlightKPIs>(initialKpis);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");

  // Modals state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [sensorModalFlight, setSensorModalFlight] =
    useState<AdminFlightItem | null>(null);

  const fetchFreshData = async () => {
    try {
      setLoading(true);
      const [resFlights, resKpis] = await Promise.all([
        fetch("/api/admin/air-cargo/flights"),
        fetch("/api/air-cargo/kpis"),
      ]);

      const dataFlights = await resFlights.json();
      const dataKpis = await resKpis.json();

      if (dataFlights.success && dataFlights.flights) {
        setFlights(dataFlights.flights);
      }
      if (dataKpis.success && dataKpis.kpis) {
        setKpis(dataKpis.kpis);
      }
    } catch (err) {
      console.error("Lỗi làm mới dữ liệu chuyến bay:", err);
    } finally {
      setLoading(false);
    }
  };

  // Filter flights
  const filteredFlights = flights.filter((f) => {
    const matchSearch =
      f.flightNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.originCity.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.destCity.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.aircraftType.toLowerCase().includes(searchTerm.toLowerCase());

    const matchStatus =
      statusFilter === "ALL" || f.flightStatus === statusFilter;

    return matchSearch && matchStatus;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner & Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-slate-900 via-slate-800 to-[#800028] text-white p-6 rounded-3xl shadow-sm">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-amber-300 text-xs font-bold uppercase tracking-wider">
            <Compass className="w-3.5 h-3.5 animate-spin" />
            <span>Air Cargo Radar & Cold-Chain IoT CMS</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black tracking-tight">
            Quản Trị Chuyến Bay & Giám Sát Chuỗi Lạnh
          </h1>
          <p className="text-xs text-slate-300 max-w-2xl">
            Theo dõi vị trí radar GPS, tiến độ bay hành trình Úc — Việt Nam và dữ liệu cảm biến nhiệt độ kiểm soát khoang hàng.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <Link
            href="/tra-cuu-air-cargo"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition-colors flex items-center gap-1.5 border border-white/20"
          >
            <ExternalLink className="w-4 h-4" />
            <span>Xem Radar Storefront</span>
          </Link>

          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs shadow-md transition-colors flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Khởi Tạo Chuyến Bay</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <FlightStats kpis={kpis} />

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Tìm theo số hiệu (VN780...), máy bay, thành phố..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:border-[#800028] outline-hidden transition-colors"
          />
        </div>

        {/* Status Tabs & Refresh */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-semibold overflow-x-auto">
            <button
              onClick={() => setStatusFilter("ALL")}
              className={`px-3 py-1 rounded-lg transition-colors ${
                statusFilter === "ALL"
                  ? "bg-white text-slate-900 shadow-xs font-bold"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Tất cả ({flights.length})
            </button>
            <button
              onClick={() => setStatusFilter("CRUISING")}
              className={`px-3 py-1 rounded-lg transition-colors ${
                statusFilter === "CRUISING"
                  ? "bg-sky-600 text-white shadow-xs font-bold"
                  : "text-slate-600 hover:text-sky-700"
              }`}
            >
              Đang bay ({flights.filter((f) => f.flightStatus === "CRUISING").length})
            </button>
            <button
              onClick={() => setStatusFilter("STORED_COLD")}
              className={`px-3 py-1 rounded-lg transition-colors ${
                statusFilter === "STORED_COLD"
                  ? "bg-emerald-600 text-white shadow-xs font-bold"
                  : "text-slate-600 hover:text-emerald-700"
              }`}
            >
              Đã nhập kho ({flights.filter((f) => f.flightStatus === "STORED_COLD").length})
            </button>
          </div>

          <button
            onClick={fetchFreshData}
            disabled={loading}
            title="Làm mới danh sách chuyến bay"
            className="p-2 text-slate-500 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors disabled:opacity-40"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>
        </div>
      </div>

      {/* Flight Table */}
      <FlightTable
        flights={filteredFlights}
        onOpenAddSensorLog={(flight) => setSensorModalFlight(flight)}
        onRefresh={fetchFreshData}
      />

      {/* Modals */}
      <CreateFlightModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={fetchFreshData}
      />

      <AddSensorLogModal
        flight={sensorModalFlight}
        isOpen={!!sensorModalFlight}
        onClose={() => setSensorModalFlight(null)}
        onSuccess={fetchFreshData}
      />
    </div>
  );
};
