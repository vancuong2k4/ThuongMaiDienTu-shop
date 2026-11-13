"use client";

// ============================================================
// components/storefront/preorder/CampaignDetailView.tsx
// Giao Diện Chi Tiết Chiến Dịch Mùa Vụ Úc & Đặt Cọc Giữ Chỗ (Phase 21)
// ============================================================

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Plane,
  Calendar,
  MapPin,
  ShieldCheck,
  CheckCircle2,
  Clock,
  ArrowRight,
  Package,
  Share2,
  PhoneCall,
  Check,
} from "lucide-react";
import { BrixSweetnessMeter } from "./BrixSweetnessMeter";
import { HarvestUpdateTimeline } from "./HarvestUpdateTimeline";
import { ReservationModal } from "./ReservationModal";
import type { CampaignProgressStats } from "@/lib/preorder";

export interface CampaignDetailData {
  id: string;
  title: string;
  slug: string;
  subtitle: string;
  description: string;
  farmName: string;
  farmRegion: string;
  originCountry: string;
  productCategory: string;
  bannerImage: string;
  galleryImages?: any;
  harvestStartDate: string | Date;
  harvestEndDate: string | Date;
  flightDepartureWeek: string;
  targetBrixSweetness: string;
  fruitSizeMm: string;
  totalCapacityKg: number;
  reservedCapacityKg: number;
  status: any;
  depositType: any;
  depositPercent: number;
  tiers: Array<{
    id: string;
    name: string;
    specification: string;
    price: number | any;
    depositAmount: number | any;
    totalSlots: number;
    reservedSlots: number;
    isAvailable: boolean;
  }>;
  harvestUpdates: Array<{
    id: string;
    title: string;
    content: string;
    brixRecorded?: number | null;
    sizeRecordedMm?: number | null;
    weatherCondition?: string | null;
    reportedAt: string | Date;
  }>;
  stats: CampaignProgressStats;
}

interface CampaignDetailViewProps {
  campaign: CampaignDetailData;
  onSelectTier?: (tierId: string) => void;
}

export const CampaignDetailView: React.FC<CampaignDetailViewProps> = ({
  campaign,
  onSelectTier,
}) => {
  const [selectedTierId, setSelectedTierId] = useState<string>(
    campaign.tiers[0]?.id || ""
  );
  const [isModalOpen, setIsModalOpen] = useState(false);

  const formatVND = (n: number) => {
    return new Intl.NumberFormat("vi-VN").format(n) + "₫";
  };

  const selectedTier =
    campaign.tiers.find((t) => t.id === selectedTierId) || campaign.tiers[0];

  const handleTierClick = (id: string) => {
    setSelectedTierId(id);
    if (onSelectTier) onSelectTier(id);
  };

  return (
    <div className="space-y-8 sm:space-y-12">
      {/* ── 1. Hero Header Banner ─────────────────────────────────── */}
      <div className="relative rounded-3xl overflow-hidden bg-slate-950 text-white min-h-[380px] sm:min-h-[440px] flex flex-col justify-end p-6 sm:p-10 shadow-2xl">
        <Image
          src={campaign.bannerImage}
          alt={campaign.title}
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-45 mix-blend-luminosity scale-100 hover:scale-105 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-slate-950/20" />

        <div className="relative z-10 space-y-4 max-w-4xl">
          {/* Badges */}
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider border backdrop-blur-md ${campaign.stats.statusBadge.bgColor} ${campaign.stats.statusBadge.textColor} ${campaign.stats.statusBadge.borderColor}`}
            >
              {campaign.stats.statusBadge.label}
            </span>

            <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-white/95 text-slate-950 shadow-xs">
              {campaign.stats.qualityBadge.label}
            </span>

            <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-sky-950/90 text-sky-300 border border-sky-400/30 flex items-center gap-1.5">
              <Plane className="w-3.5 h-3.5 text-sky-400" />
              <span>Chuyến Bay Air 24h</span>
            </span>
          </div>

          {/* Farm subtitle */}
          <div className="flex items-center gap-2 text-amber-300 font-bold text-xs sm:text-sm">
            <MapPin className="w-4 h-4 shrink-0" />
            <span>
              {campaign.farmName} • {campaign.farmRegion}
            </span>
          </div>

          {/* Main Title */}
          <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white leading-tight">
            {campaign.title}
          </h1>

          <p className="text-sm sm:text-base text-slate-300 max-w-3xl font-sans leading-relaxed">
            {campaign.subtitle}
          </p>

          {/* Key Quick Facts Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 text-xs">
            <div className="bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/10">
              <span className="text-slate-400 block text-[10px] font-bold uppercase">
                Tuần bay dự kiến
              </span>
              <span className="font-bold text-amber-300 text-xs sm:text-sm mt-0.5 block font-mono">
                {campaign.flightDepartureWeek}
              </span>
            </div>

            <div className="bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/10">
              <span className="text-slate-400 block text-[10px] font-bold uppercase">
                Chỉ số độ đường / hoạt tính
              </span>
              <span className="font-bold text-white text-xs sm:text-sm mt-0.5 block font-mono">
                {campaign.targetBrixSweetness}
              </span>
            </div>

            <div className="bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/10">
              <span className="text-slate-400 block text-[10px] font-bold uppercase">
                Tiêu chuẩn quy cách
              </span>
              <span className="font-bold text-white text-xs sm:text-sm mt-0.5 block font-mono">
                {campaign.fruitSizeMm}
              </span>
            </div>

            <div className="bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/10">
              <span className="text-slate-400 block text-[10px] font-bold uppercase">
                Tỷ lệ đã giữ chỗ
              </span>
              <span className="font-black text-emerald-400 text-xs sm:text-sm mt-0.5 block font-mono">
                {campaign.stats.fillRatePercent}% (Còn {campaign.stats.availableSlots} suất)
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ── 2. Main Content 2-Column: Left (Overview & Timeline) | Right (Reservation Card) ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column (2 Cols) */}
        <div className="lg:col-span-2 space-y-8">
          {/* Detailed Narrative */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs space-y-4">
            <h3 className="text-lg font-black text-slate-900 tracking-tight">
              Giới Thiệu Mùa Vụ & Cam Kết Chất Lượng
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-sans whitespace-pre-line">
              {campaign.description}
            </p>

            {/* Commitments checklist */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-slate-100 text-xs font-semibold text-slate-700">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>100% Vận chuyển đường bay Air Vietnam Airlines/Qantas</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Kho mát 0-4°C kiểm soát tự ghi sensor suốt hành trình</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Bao bù 100% nếu dập cuống hoặc không đạt chuẩn cam kết</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Hoàn cọc 100% nếu nông trường mất mùa do thiên tai</span>
              </div>
            </div>
          </div>

          {/* Brix Sweetness Meter */}
          <BrixSweetnessMeter
            targetBrix={campaign.targetBrixSweetness}
            fruitSizeMm={campaign.fruitSizeMm}
            category={campaign.productCategory}
          />

          {/* Harvest Timeline */}
          <HarvestUpdateTimeline
            updates={campaign.harvestUpdates}
            farmName={campaign.farmName}
            farmRegion={campaign.farmRegion}
          />
        </div>

        {/* Right Column (1 Col Sticky): Tier Selector & Reservation Box */}
        <div className="space-y-6">
          <div className="sticky top-24 bg-white rounded-3xl p-6 border-2 border-[#800028]/20 shadow-xl space-y-5">
            <div className="border-b border-slate-100 pb-3">
              <span className="text-[10px] font-black uppercase tracking-widest text-[#800028] block mb-1">
                Gói Giữ Chỗ Mùa Vụ
              </span>
              <h3 className="text-lg font-black text-slate-900 tracking-tight">
                Chọn Quy Cách Đặt Cọc
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Chỉ cần cọc trước {campaign.depositPercent}%, số tiền còn lại thanh toán khi hàng hạ cánh Nội Bài
              </p>
            </div>

            {/* Tiers List */}
            <div className="space-y-3">
              {campaign.tiers.map((tier) => {
                const isSelected = tier.id === selectedTierId;
                const price = Number(tier.price);
                const deposit = Number(tier.depositAmount);
                const available = tier.totalSlots - tier.reservedSlots;

                return (
                  <div
                    key={tier.id}
                    onClick={() => handleTierClick(tier.id)}
                    className={`p-4 rounded-2xl border-2 transition-all cursor-pointer ${
                      isSelected
                        ? "border-[#800028] bg-rose-50/40 shadow-xs"
                        : "border-slate-200 hover:border-slate-300 bg-white"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="space-y-1">
                        <div className="font-bold text-xs sm:text-sm text-slate-900 flex items-center gap-1.5">
                          {isSelected && (
                            <span className="w-2 h-2 rounded-full bg-[#800028]" />
                          )}
                          <span>{tier.name}</span>
                        </div>
                        <p className="text-[11px] text-slate-500 line-clamp-2">
                          {tier.specification}
                        </p>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="text-xs font-bold text-slate-400 line-through block">
                          {formatVND(price)}
                        </span>
                        <span className="text-sm font-black text-[#800028] font-mono block">
                          Cọc {formatVND(deposit)}
                        </span>
                      </div>
                    </div>

                    <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px]">
                      <span className="text-slate-400">
                        Giá trọn gói:{" "}
                        <strong className="text-slate-700">{formatVND(price)}</strong>
                      </span>
                      <span
                        className={`font-bold font-mono ${
                          available <= 10 ? "text-rose-600" : "text-emerald-700"
                        }`}
                      >
                        Còn {available}/{tier.totalSlots} suất
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Reservation Summary */}
            {selectedTier && (
              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Quy cách:</span>
                  <strong className="text-slate-900">{selectedTier.name}</strong>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Tổng giá trị niêm yết:</span>
                  <span className="font-mono font-bold text-slate-900">
                    {formatVND(Number(selectedTier.price))}
                  </span>
                </div>
                <div className="flex justify-between text-slate-600 pt-1 border-t border-slate-200">
                  <span className="font-bold text-slate-900">
                    Số tiền cần cọc ({campaign.depositPercent}%):
                  </span>
                  <span className="font-mono font-black text-[#800028] text-sm">
                    {formatVND(Number(selectedTier.depositAmount))}
                  </span>
                </div>
              </div>
            )}

            {/* CTA Button */}
            <div className="space-y-2">
              <button
                onClick={() => setIsModalOpen(true)}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#800028] to-[#660020] hover:opacity-95 text-white font-black text-sm shadow-lg shadow-rose-950/20 transition-all flex items-center justify-center gap-2 group cursor-pointer"
              >
                <span>Đặt Cọc Giữ Suất Ngay</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <div className="text-center text-[11px] text-slate-400 flex items-center justify-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Chính sách hoàn cọc 100% nếu chuyến bay bị hủy</span>
              </div>
            </div>

            {/* Hotline consultation */}
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
              <div className="flex items-center gap-1.5">
                <PhoneCall className="w-3.5 h-3.5 text-[#800028]" />
                <span>Hotline tư vấn mùa vụ:</span>
              </div>
              <a
                href="tel:0988888888"
                className="font-mono font-bold text-[#800028] hover:underline"
              >
                0988.888.888
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Reservation & VietQR Modal */}
      <ReservationModal
        campaignId={campaign.id}
        campaignTitle={campaign.title}
        depositPercent={campaign.depositPercent}
        flightDepartureWeek={campaign.flightDepartureWeek}
        tier={selectedTier}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};
