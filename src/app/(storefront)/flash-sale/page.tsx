// ============================================================
// app/(storefront)/flash-sale/page.tsx
// Trang Săn Deal Flash Sale & Giờ Vàng Storefront (Stage 9.4)
// ============================================================

import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { FlashSaleClient } from "@/components/storefront/flash-sale/FlashSaleClient";
import type { StorefrontFlashSaleCampaign } from "@/components/storefront/flash-sale/types";
import { Home, ChevronRight, Zap } from "lucide-react";

export const revalidate = 30; // Cập nhật định kỳ 30s để đảm bảo tồn kho và thời gian chính xác

export const metadata: Metadata = {
  title: "⚡ Flash Sale Hàng Ngoại Nhập – Giờ Vàng Săn Deal Giá Sốc | THUYNGA Shop",
  description:
    "Cơ hội săn thực phẩm chức năng Úc/Mỹ, hồng sâm Hàn Quốc và trái cây bay Air Cargo với giá giảm sốc tới 35% duy nhất trong khung giờ vàng.",
  keywords: [
    "flash sale thuy nga",
    "giờ vàng săn deal",
    "cherry úc giảm giá",
    "thực phẩm chức năng giá sốc",
    "hàng bay air cargo khuyến mãi",
  ],
  alternates: {
    canonical: "/flash-sale",
  },
  openGraph: {
    title: "⚡ Flash Sale Hàng Ngoại Nhập – Săn Deal Giờ Vàng | THUYNGA Shop",
    description:
      "Giờ vàng giá sốc hàng ngoại nhập chính hãng số lượng giới hạn. Mua ngay!",
    type: "website",
    locale: "vi_VN",
    url: "/flash-sale",
  },
};

export default async function StorefrontFlashSalePage() {
  const now = new Date();

  // Truy vấn các chiến dịch đang diễn ra và sắp diễn ra
  const campaignsRaw = await prisma.flashSale.findMany({
    where: {
      isActive: true,
      endTime: { gte: now },
    },
    orderBy: { startTime: "asc" },
    include: {
      items: {
        include: {
          product: {
            include: {
              category: { select: { name: true } },
              images: {
                take: 1,
                orderBy: { sortOrder: "asc" },
                select: { url: true },
              },
            },
          },
          variant: true,
        },
      },
    },
  });

  // Serialize dữ liệu sang Plain Objects
  const campaigns: StorefrontFlashSaleCampaign[] = campaignsRaw.map((c) => {
    const isAct = c.startTime <= now && c.endTime >= now;
    const isUp = c.startTime > now;
    const status = isAct ? "ACTIVE" : isUp ? "UPCOMING" : "ENDED";

    const deals = c.items.map((item) => {
      const regular = Number(item.variant.price);
      const sale = Number(item.salePrice);
      const discount =
        regular > 0 ? Math.round(((regular - sale) / regular) * 100) : 0;
      const soldPct =
        item.quantity > 0
          ? Math.round((item.soldCount / item.quantity) * 100)
          : 0;

      return {
        id: item.id,
        flashSaleId: item.flashSaleId,
        productId: item.productId,
        variantId: item.variantId,
        salePrice: sale,
        regularPrice: regular,
        originalPrice: item.variant.originalPrice
          ? Number(item.variant.originalPrice)
          : null,
        discountPercent: discount,
        quantity: item.quantity,
        soldCount: item.soldCount,
        soldPercentage: soldPct,
        limitPerUser: item.limitPerUser,
        product: {
          id: item.product.id,
          name: item.product.name,
          slug: item.product.slug,
          brand: item.product.brand,
          origin: item.product.origin,
          categoryName: item.product.category?.name || "Khác",
        },
        variant: {
          id: item.variant.id,
          name: item.variant.name,
          sku: item.variant.sku,
          stock: item.variant.stock,
          image: item.variant.image,
        },
        imageUrl: item.product.images[0]?.url || item.variant.image || null,
      };
    });

    return {
      id: c.id,
      name: c.name,
      description: c.description,
      bannerImage: c.bannerImage,
      startTime: c.startTime.toISOString(),
      endTime: c.endTime.toISOString(),
      status,
      deals,
    };
  });

  // Schema.org SaleEvent JSON-LD
  const activeCampaign = campaigns.find((c) => c.status === "ACTIVE") || campaigns[0];
  const jsonLd = activeCampaign
    ? {
        "@context": "https://schema.org",
        "@type": "SaleEvent",
        name: activeCampaign.name,
        description: activeCampaign.description,
        startDate: activeCampaign.startTime,
        endDate: activeCampaign.endTime,
        eventStatus: "https://schema.org/EventScheduled",
        eventAttendanceMode: "https://schema.org/OnlineEventAttendanceMode",
        location: {
          "@type": "VirtualLocation",
          url: "https://thuynhangashop.vn/flash-sale",
        },
        organizer: {
          "@type": "Organization",
          name: "THUYNGA Shop",
          url: "https://thuynhangashop.vn",
        },
      }
    : null;

  return (
    <div className="bg-[#fcfaf8] min-h-screen py-6 sm:py-10">
      {/* Schema.org Structured Data */}
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Breadcrumb Navigation */}
        <nav
          aria-label="Breadcrumb"
          className="flex items-center gap-1.5 text-xs text-slate-500"
        >
          <Link
            href="/"
            className="flex items-center gap-1 hover:text-[#800028] transition-colors"
          >
            <Home className="w-3.5 h-3.5" />
            <span>Trang chủ</span>
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="font-semibold text-slate-800 flex items-center gap-1">
            <Zap className="w-3 h-3 text-[#800028] fill-[#800028]" />
            <span>Giờ Vàng Săn Deal Flash Sale</span>
          </span>
        </nav>

        {/* Client Interactivity Container */}
        <FlashSaleClient campaigns={campaigns} />
      </div>
    </div>
  );
}
