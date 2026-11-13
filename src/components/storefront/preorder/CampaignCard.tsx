"use client";

// ============================================================
// components/storefront/preorder/CampaignCard.tsx
// Thẻ Trực Quan Chiến Dịch Đặt Trước Mùa Vụ Úc (Phase 21)
// ============================================================

import React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Plane,
  Calendar,
  MapPin,
  ArrowRight,
  ShieldCheck,
  Clock,
  Thermometer,
} from "lucide-react";
import type { CampaignProgressStats } from "@/lib/preorder";

export interface CampaignCardData {
  id: string;
  title: string;
  slug: string;
  subtitle: string;
  farmName: string;
  farmRegion: string;
  productCategory: string;
  bannerImage: string;
  flightDepartureWeek: string;
  targetBrixSweetness: string;
  fruitSizeMm: string;
  depositPercent: number;
  tiers?: Array<{
    id: string;
    name: string;
    price: number | any;
    depositAmount: number | any;
    totalSlots: number;
    reservedSlots: number;
  }>;
  stats: CampaignProgressStats;
}

interface CampaignCardProps {
  campaign: CampaignCardData;
}

export const CampaignCard: React.FC<CampaignCardProps> = ({ campaign }) => {
  const { stats } = campaign;

  // Tìm giá cọc thấp nhất
  let minDeposit = 315000;
  if (campaign.tiers && campaign.tiers.length > 0) {
    const deposits = campaign.tiers.map((t) => Number(t.depositAmount));
    minDeposit = Math.min(...deposits);
  }

  const formatVND = (n: number) => {
    return new Intl.NumberFormat("vi-VN").format(n) + "₫";
  };

  return (
    <div className="bg-white rounded-3xl overflow-hidden border border-slate-200/90 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col group">
      {/* Banner Image & Badges */}
      <div className="relative aspect-16/9 w-full bg-slate-900 overflow-hidden">
        <Image
          src={campaign.bannerImage}
          alt={campaign.title}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2">
          {/* Status Badge */}
          <span
            className={`px-3 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wide border shadow-xs backdrop-blur-md ${stats.statusBadge.bgColor} ${stats.statusBadge.textColor} ${stats.statusBadge.borderColor}`}
          >
            {stats.statusBadge.label}
          </span>

          {/* Quality Badge */}
          <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-white/90 text-slate-900 backdrop-blur-md shadow-xs">
            {stats.qualityBadge.label}
          </span>
        </div>

        {/* Bottom Image Overlay: Farm & Flight Week */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs">
          <div className="flex items-center gap-1.5 font-bold truncate">
            <MapPin className="w-3.5 h-3.5 text-amber-300 shrink-0" />
            <span className="truncate">{campaign.farmName}</span>
          </div>

          <div className="flex items-center gap-1 text-sky-200 font-mono text-[11px] shrink-0 bg-sky-950/80 px-2 py-0.5 rounded-lg border border-sky-400/30">
            <Plane className="w-3 h-3 text-sky-400" />
            <span>Bay Air 24h</span>
          </div>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-2">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            {campaign.farmRegion}
          </div>

          <Link href={`/dat-truoc-mua-vu/${campaign.slug}`}>
            <h3 className="text-base sm:text-lg font-black text-slate-900 group-hover:text-[#800028] transition-colors line-clamp-2">
              {campaign.title}
            </h3>
          </Link>

          <p className="text-xs text-slate-500 line-clamp-2 font-sans">
            {campaign.subtitle}
          </p>
        </div>

        {/* Key Metrics Chips */}
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="p-2.5 bg-amber-50/60 rounded-xl border border-amber-100 space-y-0.5">
            <span className="text-[10px] font-bold text-amber-700 block uppercase">
              {campaign.productCategory === "MANUKA_HONEY" ? "Kháng khuẩn" : "Độ ngọt tự nhiên"}
            </span>
            <span className="font-mono font-bold text-slate-800 text-xs">
              {campaign.targetBrixSweetness}
            </span>
          </div>

          <div className="p-2.5 bg-rose-50/60 rounded-xl border border-rose-100 space-y-0.5">
            <span className="text-[10px] font-bold text-rose-700 block uppercase">
              {campaign.productCategory === "MANUKA_HONEY" ? "Tiêu chuẩn" : "Kích thước quả"}
            </span>
            <span className="font-mono font-bold text-slate-800 text-xs">
              {campaign.fruitSizeMm}
            </span>
          </div>
        </div>

        {/* Slot Progress Bar */}
        <div className="space-y-1.5 pt-1">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-slate-700">
              Đã giữ chỗ:{" "}
              <strong className="text-[#800028] font-mono">
                {stats.fillRatePercent}%
              </strong>
            </span>
            <span className="text-slate-400 text-[11px] font-mono">
              Còn {stats.availableSlots} suất
            </span>
          </div>

          <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-700 ${
                stats.fillRatePercent >= 90
                  ? "bg-rose-600"
                  : stats.fillRatePercent >= 60
                  ? "bg-amber-500"
                  : "bg-emerald-500"
              }`}
              style={{ width: `${Math.min(100, stats.fillRatePercent)}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-400">
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              <span>{campaign.flightDepartureWeek}</span>
            </span>
            {stats.daysRemaining > 0 && (
              <span className="font-bold text-amber-600">
                Còn {stats.daysRemaining} ngày cọc
              </span>
            )}
          </div>
        </div>

        {/* Card Footer: Deposit Price & CTA */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
          <div>
            <span className="text-[10px] font-bold text-slate-400 block uppercase tracking-wide">
              Mức cọc giữ slot ({campaign.depositPercent}%)
            </span>
            <span className="text-sm sm:text-base font-black text-[#800028] font-mono">
              Từ {formatVND(minDeposit)}
            </span>
          </div>

          <Link
            href={`/dat-truoc-mua-vu/${campaign.slug}`}
            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-[#800028] text-white font-bold text-xs transition-colors flex items-center gap-1 shadow-xs group-hover:shadow-md"
          >
            <span>Giữ chỗ ngay</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  );
};
