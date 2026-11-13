"use client";

// ============================================================
// components/admin/preorder/PreOrderAdminManager.tsx
// Bộ Điều Phối Quản Trị Đặt Trước Mùa Vụ & Cọc VietQR (Phase 21)
// ============================================================

import React, { useState } from "react";
import Link from "next/link";
import {
  Calendar,
  Plane,
  Plus,
  RefreshCw,
  Search,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";
import { PreOrderStats } from "./PreOrderStats";
import { CampaignAdminTable } from "./CampaignAdminTable";
import { ReservationAdminTable } from "./ReservationAdminTable";
import { CreateCampaignModal } from "./CreateCampaignModal";
import { CreateHarvestUpdateModal } from "./CreateHarvestUpdateModal";
import type {
  AdminCampaignItem,
  AdminReservationItem,
  AdminPreOrderKPIs,
} from "./types";

interface PreOrderAdminManagerProps {
  initialCampaigns: AdminCampaignItem[];
  initialReservations: AdminReservationItem[];
  initialKpis: AdminPreOrderKPIs;
}

export const PreOrderAdminManager: React.FC<PreOrderAdminManagerProps> = ({
  initialCampaigns,
  initialReservations,
  initialKpis,
}) => {
  const [activeTab, setActiveTab] = useState<"CAMPAIGNS" | "RESERVATIONS">(
    "CAMPAIGNS"
  );
  const [campaigns, setCampaigns] = useState<AdminCampaignItem[]>(
    initialCampaigns
  );
  const [reservations, setReservations] = useState<AdminReservationItem[]>(
    initialReservations
  );
  const [kpis, setKpis] = useState<AdminPreOrderKPIs>(initialKpis);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Modals state
  const [isCreateCampaignOpen, setIsCreateCampaignOpen] = useState(false);
  const [updateModalCampaign, setUpdateModalCampaign] =
    useState<AdminCampaignItem | null>(null);

  const fetchFreshData = async () => {
    try {
      setLoading(true);
      const [resCampaigns, resReservations, resKpis] = await Promise.all([
        fetch("/api/admin/preorders/campaigns"),
        fetch("/api/admin/preorders/reservations"),
        fetch("/api/preorders/kpis"),
      ]);

      const dataC = await resCampaigns.json();
      const dataR = await resReservations.json();
      const dataK = await resKpis.json();

      if (dataC.success && dataC.campaigns) setCampaigns(dataC.campaigns);
      if (dataR.success && dataR.reservations) setReservations(dataR.reservations);
      if (dataK.success && dataK.kpis) setKpis(dataK.kpis);
    } catch (err) {
      console.error("Lỗi làm mới dữ liệu đặt trước mùa vụ:", err);
    } finally {
      setLoading(false);
    }
  };

  const filteredCampaigns = campaigns.filter((c) => {
    const q = searchTerm.toLowerCase();
    return (
      c.title.toLowerCase().includes(q) ||
      c.farmName.toLowerCase().includes(q) ||
      c.farmRegion.toLowerCase().includes(q)
    );
  });

  const filteredReservations = reservations.filter((r) => {
    const q = searchTerm.toLowerCase();
    return (
      r.reservationCode.toLowerCase().includes(q) ||
      r.customerName.toLowerCase().includes(q) ||
      r.customerPhone.includes(q) ||
      r.campaign.title.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-slate-900 via-slate-800 to-[#800028] text-white p-6 rounded-3xl shadow-sm">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-amber-300 text-xs font-bold uppercase tracking-wider">
            <Calendar className="w-3.5 h-3.5" />
            <span>Seasonal Harvest Pre-Order & Flight Allocation CMS</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black tracking-tight">
            Quản Trị Đặt Trước Mùa Vụ Úc
          </h1>
          <p className="text-xs text-slate-300 max-w-2xl">
            Quản lý chiến dịch Cherry Tasmania, Mật ong Manuka Hoàng gia, phân bổ slot khoang lạnh máy bay và đối soát tiền cọc VietQR.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <Link
            href="/dat-truoc-mua-vu"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition-colors flex items-center gap-1.5 border border-white/20"
          >
            <ExternalLink className="w-4 h-4" />
            <span>Xem Hub Storefront</span>
          </Link>

          <button
            onClick={() => setIsCreateCampaignOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs shadow-md transition-colors flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Khởi Tạo Chiến Dịch</span>
          </button>
        </div>
      </div>

      {/* KPI Stats */}
      <PreOrderStats kpis={kpis} />

      {/* Control Bar: Tabs & Search */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Tabs */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-semibold">
          <button
            onClick={() => setActiveTab("CAMPAIGNS")}
            className={`px-4 py-1.5 rounded-lg transition-colors ${
              activeTab === "CAMPAIGNS"
                ? "bg-white text-slate-900 shadow-xs font-bold"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Chiến Dịch Mùa Vụ ({campaigns.length})
          </button>
          <button
            onClick={() => setActiveTab("RESERVATIONS")}
            className={`px-4 py-1.5 rounded-lg transition-colors ${
              activeTab === "RESERVATIONS"
                ? "bg-[#800028] text-white shadow-xs font-bold"
                : "text-slate-600 hover:text-[#800028]"
            }`}
          >
            Đơn Đặt Giữ Chỗ ({reservations.length})
          </button>
        </div>

        {/* Search & Refresh */}
        <div className="flex items-center gap-2.5">
          <div className="relative flex-1 sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Tìm kiếm theo mã, khách, nông trường..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-1.5 text-xs rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:border-[#800028] outline-hidden transition-colors"
            />
          </div>

          <button
            onClick={fetchFreshData}
            disabled={loading}
            title="Làm mới dữ liệu"
            className="p-2 text-slate-500 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors disabled:opacity-40"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>
        </div>
      </div>

      {/* Main Table view based on tab */}
      {activeTab === "CAMPAIGNS" ? (
        <CampaignAdminTable
          campaigns={filteredCampaigns}
          onOpenCreateUpdate={(c) => setUpdateModalCampaign(c)}
          onRefresh={fetchFreshData}
        />
      ) : (
        <ReservationAdminTable
          reservations={filteredReservations}
          onRefresh={fetchFreshData}
        />
      )}

      {/* Modals */}
      <CreateCampaignModal
        isOpen={isCreateCampaignOpen}
        onClose={() => setIsCreateCampaignOpen(false)}
        onSuccess={fetchFreshData}
      />

      <CreateHarvestUpdateModal
        campaign={updateModalCampaign}
        isOpen={!!updateModalCampaign}
        onClose={() => setUpdateModalCampaign(null)}
        onSuccess={fetchFreshData}
      />
    </div>
  );
};
