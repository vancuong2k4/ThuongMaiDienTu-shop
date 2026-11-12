// ============================================================
// app/(storefront)/so-sanh/page.tsx
// Trang So Sánh Sản Phẩm Úc & Phân Tích Vi Chất Chuyên Sâu (Phase 19)
// ============================================================

import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { Home, ChevronRight, Scale, ShieldCheck } from "lucide-react";
import { ComparisonPageClient } from "@/components/storefront/comparison/ComparisonPageClient";

export const metadata: Metadata = {
  title: "So Sánh Sản Phẩm Úc & Phân Tích Vi Chất Dược Sĩ | THUYNGA Shop",
  description:
    "Công cụ đối chiếu trực quan thông số, chi phí ngày dùng và phân tích tương tác hiệp đồng vi chất chuẩn Dược sĩ chuyên môn tại THUYNGA Shop.",
  openGraph: {
    title: "So Sánh Sản Phẩm Úc & Phân Tích Vi Chất Dược Sĩ | THUYNGA Shop",
    description:
      "Đối chiếu ma trận dinh dưỡng, kiểm tra trùng lặp vi chất và tối ưu hấp thu khi dùng kết hợp các sản phẩm Úc nhập khẩu.",
  },
};

export default function ComparisonPage() {
  return (
    <main className="min-h-screen py-6 sm:py-8 lg:py-10 bg-slate-50/60 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* ── 1. Breadcrumbs ────────────────────────────────────── */}
        <nav
          className="flex items-center gap-2 text-xs text-slate-500"
          aria-label="Breadcrumb"
        >
          <Link
            href="/"
            className="flex items-center gap-1 hover:text-[#800028] transition-colors"
          >
            <Home className="w-3.5 h-3.5" />
            <span>Trang chủ</span>
          </Link>
          <ChevronRight className="w-3 h-3 text-slate-400" />
          <span className="text-slate-900 font-bold">So sánh sản phẩm</span>
        </nav>

        {/* ── 2. Page Header ────────────────────────────────────── */}
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Chuẩn Dược Sĩ Chuyên Môn • Hàng Úc Chemist Warehouse</span>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight">
            Bảng So Sánh Sản Phẩm & Phân Tích Vi Chất
          </h1>

          <p className="text-xs sm:text-sm text-slate-600 max-w-3xl leading-relaxed">
            Đối chiếu trực quan bảng thành phần dinh dưỡng, tính toán chi phí trung bình trên mỗi ngày dùng và nhận khuyến nghị an toàn sinh học từ đội ngũ Dược sĩ THUYNGA Shop.
          </p>
        </div>

        {/* ── 3. Interactive Client Component ───────────────────── */}
        <ComparisonPageClient />
      </div>
    </main>
  );
}
