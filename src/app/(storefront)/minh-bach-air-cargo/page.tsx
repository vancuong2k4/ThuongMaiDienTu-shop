// ============================================================
// app/(storefront)/minh-bach-air-cargo/page.tsx
// Trang Tra Cứu Minh Bạch Vận Đơn Air-Cargo & Hóa Đơn Úc (Phase 15)
// ============================================================

import React from "react";
import Link from "next/link";
import { ChevronRight, Home, Plane } from "lucide-react";
import { TransparencyPortalClient } from "@/components/storefront/transparency/TransparencyPortalClient";
import { verifyBatchByCode } from "@/lib/aircargo";

interface PageProps {
  searchParams: Promise<{ code?: string }>;
}

export const metadata = {
  title: "Tra Cứu Minh Bạch Vận Đơn Air-Cargo & Hạn Sử Dụng | THUYNGA Shop",
  description:
    "Nhập mã lô in dưới đáy lon/thân chai để tra cứu trực tiếp số vận đơn hàng không AWB, chuyến bay Vietnam Airlines/Qantas Freight và hóa đơn Chemist Warehouse Úc.",
  openGraph: {
    title: "Minh Bạch Vận Đơn Hàng Không & Chuỗi Cung Ứng Lạnh Air-Cargo Úc",
    description:
      "Cam kết 100% hàng đi đường bay máy bay, date mới tinh > 18-24 tháng, kho lạnh 18-24°C và đầy đủ hóa đơn Chemist Warehouse Úc.",
  },
};

export const revalidate = 60; // ISR cache 60s

export default async function TransparencyPage({ searchParams }: PageProps) {
  const { code } = await searchParams;

  let initialData = null;
  if (code && code.trim().length >= 2) {
    try {
      const res = await verifyBatchByCode(code.trim());
      if (res.found) {
        initialData = res.batch;
      }
    } catch {
      // ignore
    }
  }

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
          <span className="text-slate-800 font-semibold flex items-center gap-1">
            <Plane className="w-3.5 h-3.5 text-sky-600" />
            Minh bạch Air-Cargo & Hạn sử dụng
          </span>
        </nav>

        {/* Client Portal Container */}
        <TransparencyPortalClient
          initialCode={code || ""}
          initialData={initialData}
        />
      </div>
    </div>
  );
}
