// ============================================================
// app/(storefront)/dat-truoc-mua-vu/page.tsx
// Trung Tâm Đặt Hàng Trước Nông Sản & Đặc Sản Theo Mùa Vụ Úc (Phase 21)
// ============================================================

import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { calculateCampaignProgress, calculatePreOrderKPIs } from "@/lib/preorder";
import { CampaignCard, type CampaignCardData } from "@/components/storefront/preorder/CampaignCard";
import {
  Plane,
  Calendar,
  Home,
  ChevronRight,
  ShieldCheck,
  Award,
  Package,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Đặt Trước Mùa Vụ Úc & Giữ Suất Bay Air 24h | THUYNGA Shop",
  description:
    "Đặt cọc trước Cherry Đỏ Tasmania Reid Fruits vụ Tết Bính Ngọ 2026, Mật ong Manuka MGO 1200+ và nông sản tươi cao cấp từ Úc. Cam kết 100% bay Air trong 24 giờ.",
  openGraph: {
    title: "Đặt Trước Mùa Vụ Úc — Cherry Tasmania & Manuka Hoàng Gia Bay Air",
    description:
      "Bao tiêu trọn gói khoang lạnh máy bay Vietnam Airlines / Qantas Freight từ Hobart & Melbourne về Nội Bài.",
  },
};

export const revalidate = 60; // ISR 60s

export default async function PreOrderHubPage() {
  const [campaigns, kpis] = await Promise.all([
    prisma.seasonalCampaign.findMany({
      orderBy: [{ sortOrder: "asc" }, { harvestStartDate: "asc" }],
      include: {
        tiers: {
          orderBy: { sortOrder: "asc" },
        },
        _count: {
          select: { reservations: true },
        },
      },
    }),
    calculatePreOrderKPIs(),
  ]);

  const serializedCampaigns: CampaignCardData[] = campaigns.map((c) => {
    const stats = calculateCampaignProgress(c);
    return {
      id: c.id,
      title: c.title,
      slug: c.slug,
      subtitle: c.subtitle,
      farmName: c.farmName,
      farmRegion: c.farmRegion,
      productCategory: c.productCategory,
      bannerImage: c.bannerImage,
      flightDepartureWeek: c.flightDepartureWeek,
      targetBrixSweetness: c.targetBrixSweetness,
      fruitSizeMm: c.fruitSizeMm,
      depositPercent: c.depositPercent,
      tiers: c.tiers.map((t) => ({
        id: t.id,
        name: t.name,
        price: Number(t.price),
        depositAmount: Number(t.depositAmount),
        totalSlots: t.totalSlots,
        reservedSlots: t.reservedSlots,
      })),
      stats,
    };
  });

  return (
    <div className="bg-[#fcfaf8] min-h-screen py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 sm:space-y-12">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
          <Link
            href="/"
            className="flex items-center gap-1 hover:text-[#800028] transition-colors"
          >
            <Home className="w-3.5 h-3.5" />
            <span>Trang chủ</span>
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
          <span className="text-slate-800 font-semibold flex items-center gap-1">
            <Plane className="w-3.5 h-3.5 text-[#800028]" />
            Đặt trước mùa vụ Úc
          </span>
        </nav>

        {/* Hero Section */}
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-slate-950 via-slate-900 to-[#800028] text-white p-8 sm:p-12 shadow-xl">
          <div className="relative z-10 max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-amber-300 text-xs font-bold uppercase tracking-wider backdrop-blur-md">
              <Plane className="w-3.5 h-3.5" />
              <span>Chương Trình Đặt Suất Khoang Bay Air-Cargo Cao Cấp</span>
            </div>

            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
              Đặt Trước Mùa Vụ Úc <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-rose-300 to-white">
                Vận Chuyển Đường Bay Lạnh 24H
              </span>
            </h1>

            <p className="text-xs sm:text-sm text-slate-300 font-sans leading-relaxed">
              Các nông sản và mật ong thượng hạng của nước Úc (Cherry Tasmania Reid Fruits, Mật ong Manuka MGO 1200+) có sản lượng thu hái giới hạn mỗi năm. Đặt cọc giữ slot trước để được ưu tiên tuyển chọn đợt quả to nhất, ngọt nhất và giao đúng tuần đón Tết Nguyên Đán.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2 text-xs">
              <div className="flex items-center gap-2 text-emerald-300 font-bold">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Cam kết hoàn cọc 100% nếu mất mùa</span>
              </div>
              <div className="flex items-center gap-2 text-amber-300 font-bold">
                <Award className="w-4 h-4 text-amber-400" />
                <span>Bao bù 1:1 nếu dập nát cuống</span>
              </div>
            </div>
          </div>
        </div>

        {/* 4 Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
              Chiến Dịch Mùa Vụ
            </span>
            <div className="text-2xl font-black text-slate-900 font-mono mt-1">
              {kpis.totalCampaigns}
            </div>
            <span className="text-[11px] text-slate-500 mt-0.5 block">
              Cherry Tasmania & Manuka Vintage
            </span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
              Sản Lượng Bao Tiêu
            </span>
            <div className="text-2xl font-black text-[#800028] font-mono mt-1">
              5.5 Tấn
            </div>
            <span className="text-[11px] text-slate-500 mt-0.5 block">
              Khoang lạnh chuyên dụng 0-4°C
            </span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
              Số Suất Đã Đặt Chỗ
            </span>
            <div className="text-2xl font-black text-emerald-600 font-mono mt-1">
              {kpis.totalReservations} Khách
            </div>
            <span className="text-[11px] text-slate-500 mt-0.5 block">
              Cọc thành công qua VietQR Napas
            </span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
              Thời Gian Bay Air
            </span>
            <div className="text-2xl font-black text-sky-600 font-mono mt-1">
              24 Giờ
            </div>
            <span className="text-[11px] text-slate-500 mt-0.5 block">
              Từ nông trường Úc về Nội Bài
            </span>
          </div>
        </div>

        {/* Campaign Cards List */}
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-3">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                Chiến Dịch Mùa Vụ Đang Mở Đặt Cọc
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Lựa chọn quy cách hộp quà biếu hoặc thùng nguyên seal nông trường
              </p>
            </div>
            <span className="text-xs font-bold text-[#800028] bg-rose-50 px-3 py-1 rounded-full border border-rose-200 self-start sm:self-auto">
              Chỉ cọc trước 30%
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {serializedCampaigns.map((campaign) => (
              <CampaignCard key={campaign.id} campaign={campaign} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
