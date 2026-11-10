// ============================================================
// app/(admin)/admin/flash-sale/page.tsx
// Trang Quản Lý Chiến Dịch Flash Sale & Deal Giờ Vàng (Stage 9.3)
// ============================================================

import React from "react";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { AdminPageHeader } from "@/components/admin/ui/AdminPageHeader";
import { FlashSaleManager } from "@/components/admin/flash-sale/FlashSaleManager";
import { Zap } from "lucide-react";
import type {
  FlashSaleCampaignItem,
  FlashSaleStatsData,
} from "@/components/admin/flash-sale/types";

export const metadata: Metadata = {
  title: "Quản Lý Flash Sale & Giờ Vàng | Quản trị THUYNGA Shop",
  description:
    "Hệ thống quản trị chiến dịch giờ vàng, phân bổ sản phẩm deal sốc và theo dõi doanh thu Flash Sale theo thời gian thực.",
};

export const revalidate = 0;

export default async function AdminFlashSalePage() {
  const now = new Date();

  // Pre-fetch dữ liệu trang 1 và stats trên server
  const [total, campaignsRaw, allCampaigns] = await Promise.all([
    prisma.flashSale.count(),
    prisma.flashSale.findMany({
      take: 10,
      skip: 0,
      orderBy: { createdAt: "desc" },
      include: {
        items: {
          select: {
            salePrice: true,
            quantity: true,
            soldCount: true,
          },
        },
      },
    }),
    prisma.flashSale.findMany({
      include: {
        items: {
          select: {
            salePrice: true,
            quantity: true,
            soldCount: true,
          },
        },
      },
    }),
  ]);

  // Tính toán KPI stats
  let activeCount = 0;
  let upcomingCount = 0;
  let endedCount = 0;
  let totalSold = 0;
  let totalAllocated = 0;
  let totalRevenue = 0;

  allCampaigns.forEach((c) => {
    const isAct = c.isActive && c.startTime <= now && c.endTime >= now;
    const isUp = c.startTime > now;
    const isEnd = c.endTime < now;

    if (isAct) activeCount++;
    else if (isUp) upcomingCount++;
    else if (isEnd) endedCount++;

    c.items.forEach((item) => {
      totalAllocated += item.quantity;
      totalSold += item.soldCount;
      totalRevenue += item.soldCount * Number(item.salePrice);
    });
  });

  const averageSoldRate =
    totalAllocated > 0 ? Math.round((totalSold / totalAllocated) * 100) : 0;

  const stats: FlashSaleStatsData = {
    total: allCampaigns.length,
    active: activeCount,
    upcoming: upcomingCount,
    ended: endedCount,
    totalSold,
    totalRevenue,
    averageSoldRate,
  };

  const initialCampaigns: FlashSaleCampaignItem[] = campaignsRaw.map((c) => {
    const isAct = c.isActive && c.startTime <= now && c.endTime >= now;
    const isUp = c.startTime > now;
    const status = isAct ? "ACTIVE" : isUp ? "UPCOMING" : "ENDED";

    const totalQty = c.items.reduce((acc, i) => acc + i.quantity, 0);
    const sold = c.items.reduce((acc, i) => acc + i.soldCount, 0);
    const revenue = c.items.reduce(
      (acc, i) => acc + i.soldCount * Number(i.salePrice),
      0
    );

    return {
      id: c.id,
      name: c.name,
      description: c.description,
      bannerImage: c.bannerImage,
      startTime: c.startTime.toISOString(),
      endTime: c.endTime.toISOString(),
      isActive: c.isActive,
      createdAt: c.createdAt.toISOString(),
      updatedAt: c.updatedAt.toISOString(),
      status,
      itemCount: c.items.length,
      totalQuantity: totalQty,
      totalSold: sold,
      revenue,
      soldPercentage:
        totalQty > 0 ? Math.round((sold / totalQty) * 100) : 0,
    };
  });

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Quản Lý Chiến Dịch Flash Sale"
        description="Thiết lập các khung giờ săn deal sốc, quản lý sản phẩm mở bán và theo dõi tiến độ cháy hàng"
        breadcrumbs={[{ label: "Flash Sale", href: "/admin/flash-sale" }]}
        badge={
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#800028]/10 text-[#800028]">
            <Zap className="w-3.5 h-3.5 fill-[#800028]" />
            <span>Giờ Vàng Giá Sốc</span>
          </span>
        }
      />

      <FlashSaleManager
        initialStats={stats}
        initialCampaigns={initialCampaigns}
        initialPagination={{
          page: 1,
          limit: 10,
          totalPages: Math.ceil(total / 10) || 1,
          total,
        }}
      />
    </div>
  );
}
