// ============================================================
// app/(storefront)/gio-qua-bieu/page.tsx
// Trang Trình Thiết Kế Giỏ Quà Biếu Cao Cấp & Thiệp Chúc Mừng (Phase 17 - Stage 17.4)
// ============================================================

import React from "react";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { HamperBuilderClient } from "@/components/storefront/gift-builder/HamperBuilderClient";
import type {
  BuilderTemplate,
  BuilderProduct,
} from "@/components/storefront/gift-builder/types";

export const metadata: Metadata = {
  title: "Tự Thiết Kế Giỏ Quà Biếu & Hộp Cherry Úc Hoàng Gia | THUYNGA Shop",
  description:
    "Tự tay thiết kế giỏ quà Tết, quà tri ân doanh nghiệp sang trọng: Hộp gỗ thông sơn mài, Cherry Úc tươi bay Air, Mật ong Manuka và in thiệp chúc mừng dập nổi kim.",
  keywords: [
    "giỏ quà tết",
    "hộp quà cherry úc",
    "quà biếu doanh nghiệp",
    "mật ong manuka",
    "quà tặng sức khỏe",
  ],
};

export const revalidate = 60; // ISR 60s

export default async function GiftHamperBuilderPage() {
  // 1. Lấy danh sách mẫu vỏ hộp đang hoạt động
  const templates = await prisma.giftBoxTemplate.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: "asc" },
  });

  // 2. Lấy danh sách các sản phẩm phù hợp phối quà biếu
  const products = await prisma.product.findMany({
    where: {
      isActive: true,
      variants: {
        some: {
          isActive: true,
          stock: { gt: 0 },
        },
      },
    },
    include: {
      category: {
        select: {
          id: true,
          name: true,
          slug: true,
        },
      },
      images: {
        select: { url: true },
        take: 1,
      },
      variants: {
        where: { isActive: true },
        orderBy: { isDefault: "desc" },
        take: 1,
      },
    },
    orderBy: { isFeatured: "desc" },
    take: 40,
  });

  // 3. Chuẩn hóa dữ liệu templates
  const formattedTemplates: BuilderTemplate[] = templates.map((t) => ({
    id: t.id,
    name: t.name,
    slug: t.slug,
    boxType: t.boxType,
    dimensions: t.dimensions,
    basePrice: Number(t.basePrice),
    maxSlots: t.maxSlots,
    imageUrl: t.imageUrl,
    description: t.description,
    isAirCargoPledge: t.isAirCargoPledge,
  }));

  // 4. Chuẩn hóa dữ liệu sản phẩm
  const formattedProducts: BuilderProduct[] = products
    .filter((p) => p.variants.length > 0)
    .map((p) => {
      const v = p.variants[0];
      // Nếu là Cherry hoặc thùng quà lớn thì chiếm 2 slots, các sản phẩm vi chất/mật ong chiếm 1 slot
      const isBigItem =
        p.slug.includes("cherry") ||
        p.slug.includes("thung") ||
        p.slug.includes("set-lon") ||
        (v && v.weight && v.weight >= 1500);

      return {
        id: p.id,
        name: p.name,
        slug: p.slug,
        shortDesc: p.shortDesc,
        brand: p.brand,
        origin: p.origin,
        specification: p.specification,
        category: p.category,
        images: p.images.map((img) => ({ url: img.url })),
        defaultVariant: v
          ? {
              id: v.id,
              name: v.name,
              price: Number(v.price),
              originalPrice: v.originalPrice ? Number(v.originalPrice) : null,
              stock: v.stock,
              sku: v.sku,
            }
          : null,
        slotCost: isBigItem ? 2 : 1,
      };
    });

  return (
    <div className="min-h-screen bg-slate-50/60 py-6 sm:py-8">
      <div className="shop-container">
        <HamperBuilderClient
          templates={formattedTemplates}
          products={formattedProducts}
        />
      </div>
    </div>
  );
}
