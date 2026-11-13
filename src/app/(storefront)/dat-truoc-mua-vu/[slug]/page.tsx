// ============================================================
// app/(storefront)/dat-truoc-mua-vu/[slug]/page.tsx
// Trang Chi Tiết Chiến Dịch Đặt Trước Mùa Vụ Úc (Phase 21)
// ============================================================

import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { calculateCampaignProgress } from "@/lib/preorder";
import {
  CampaignDetailView,
  type CampaignDetailData,
} from "@/components/storefront/preorder/CampaignDetailView";
import { ChevronRight, Home, Plane } from "lucide-react";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const campaign = await prisma.seasonalCampaign.findUnique({
    where: { slug },
    select: {
      title: true,
      subtitle: true,
      bannerImage: true,
      farmName: true,
      flightDepartureWeek: true,
    },
  });

  if (!campaign) {
    return {
      title: "Chiến dịch không tồn tại | THUYNGA Shop",
    };
  }

  return {
    title: `${campaign.title} | Đặt Trước Mùa Vụ Úc THUYNGA Shop`,
    description: `${campaign.subtitle} - Đặt cọc giữ slot bay Air 24h từ ${campaign.farmName}. Khởi hành ${campaign.flightDepartureWeek}.`,
    openGraph: {
      title: campaign.title,
      description: campaign.subtitle,
      images: [{ url: campaign.bannerImage }],
    },
  };
}

export const revalidate = 60; // ISR 60s

export default async function CampaignDetailPage({ params }: PageProps) {
  const { slug } = await params;

  const campaign = await prisma.seasonalCampaign.findUnique({
    where: { slug },
    include: {
      tiers: {
        orderBy: { sortOrder: "asc" },
      },
      harvestUpdates: {
        orderBy: { reportedAt: "desc" },
      },
      _count: {
        select: { reservations: true },
      },
    },
  });

  if (!campaign) {
    notFound();
  }

  const stats = calculateCampaignProgress(campaign);

  const serializedData: CampaignDetailData = {
    id: campaign.id,
    title: campaign.title,
    slug: campaign.slug,
    subtitle: campaign.subtitle,
    description: campaign.description,
    farmName: campaign.farmName,
    farmRegion: campaign.farmRegion,
    originCountry: campaign.originCountry,
    productCategory: campaign.productCategory,
    bannerImage: campaign.bannerImage,
    galleryImages: campaign.galleryImages,
    harvestStartDate: campaign.harvestStartDate.toISOString(),
    harvestEndDate: campaign.harvestEndDate.toISOString(),
    flightDepartureWeek: campaign.flightDepartureWeek,
    targetBrixSweetness: campaign.targetBrixSweetness,
    fruitSizeMm: campaign.fruitSizeMm,
    totalCapacityKg: campaign.totalCapacityKg,
    reservedCapacityKg: campaign.reservedCapacityKg,
    status: campaign.status,
    depositType: campaign.depositType,
    depositPercent: campaign.depositPercent,
    tiers: campaign.tiers.map((t) => ({
      id: t.id,
      name: t.name,
      specification: t.specification,
      price: Number(t.price),
      depositAmount: Number(t.depositAmount),
      totalSlots: t.totalSlots,
      reservedSlots: t.reservedSlots,
      isAvailable: t.isAvailable,
    })),
    harvestUpdates: campaign.harvestUpdates.map((u) => ({
      id: u.id,
      title: u.title,
      content: u.content,
      brixRecorded: u.brixRecorded,
      sizeRecordedMm: u.sizeRecordedMm,
      weatherCondition: u.weatherCondition,
      reportedAt: u.reportedAt.toISOString(),
    })),
    stats,
  };

  return (
    <div className="bg-[#fcfaf8] min-h-screen py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
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
          <Link
            href="/dat-truoc-mua-vu"
            className="hover:text-[#800028] transition-colors flex items-center gap-1"
          >
            <Plane className="w-3.5 h-3.5 text-sky-600" />
            <span>Đặt trước mùa vụ Úc</span>
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
          <span className="text-slate-800 font-semibold truncate max-w-xs sm:max-w-md">
            {campaign.title}
          </span>
        </nav>

        {/* Campaign Detail View */}
        <CampaignDetailView campaign={serializedData} />
      </div>
    </div>
  );
}
