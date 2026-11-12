// ============================================================
// app/(storefront)/tu-van-dinh-duong/page.tsx
// Trang Tư Vấn Dinh Dưỡng & Phác Đồ Cá Nhân Hóa Chuẩn Y Khoa (Phase 16)
// ============================================================

import React from "react";
import Link from "next/link";
import { ChevronRight, Home, Stethoscope } from "lucide-react";
import { NutritionConsultationClient } from "@/components/storefront/protocols/NutritionConsultationClient";
import { prisma } from "@/lib/prisma";

interface PageProps {
  searchParams: Promise<{ protocol?: string }>;
}

export const metadata = {
  title: "Tư Vấn Dinh Dưỡng & Phác Đồ Bổ Sung Cá Nhân Hóa | THUYNGA Shop",
  description:
    "Làm bài trắc nghiệm sức khỏe thông minh trong 2 phút để nhận phác đồ bổ sung vi chất Úc chuẩn y khoa cho bé, mẹ bầu và gia đình; hỗ trợ đặt lịch tư vấn 1-1 miễn phí cùng Dược sĩ.",
  openGraph: {
    title: "Phác Đồ Dinh Dưỡng Cá Nhân Hóa Chuẩn Dược Sĩ Úc | THUYNGA Shop",
    description:
      "Tối ưu hóa liều dùng sáng/trưa/tối, phối hợp vi chất khoa học, cam kết 100% hàng bay Air và ưu đãi combo tiết kiệm 10%.",
  },
};

export const revalidate = 60; // ISR 60s

export default async function NutritionConsultationPage({
  searchParams,
}: PageProps) {
  const { protocol: protocolSlug } = await searchParams;

  let initialProtocol = null;
  if (protocolSlug) {
    try {
      const raw = await prisma.healthProtocol.findUnique({
        where: { slug: protocolSlug },
        include: {
          items: {
            orderBy: { sortOrder: "asc" },
            include: {
              product: {
                select: {
                  id: true,
                  name: true,
                  slug: true,
                  origin: true,
                  images: {
                    take: 1,
                    orderBy: { sortOrder: "asc" },
                    select: { url: true },
                  },
                },
              },
              variant: {
                select: {
                  id: true,
                  name: true,
                  sku: true,
                  price: true,
                  originalPrice: true,
                  stock: true,
                },
              },
            },
          },
        },
      });

      if (raw) {
        initialProtocol = {
          ...raw,
          items: raw.items.map((it) => ({
            ...it,
            variant: it.variant
              ? {
                  ...it.variant,
                  price: Number(it.variant.price),
                  originalPrice: it.variant.originalPrice
                    ? Number(it.variant.originalPrice)
                    : null,
                }
              : null,
          })),
        };
      }
    } catch {
      // ignore
    }
  }

  return (
    <div className="bg-[#fcfaf8] min-h-screen py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Breadcrumbs */}
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
            <Stethoscope className="w-3.5 h-3.5 text-[#800028]" />
            Tư vấn dinh dưỡng & Phác đồ cá nhân hóa
          </span>
        </nav>

        {/* Client Interactive Container */}
        <NutritionConsultationClient initialProtocol={initialProtocol} />
      </div>
    </div>
  );
}
