"use client";

// ============================================================
// components/storefront/transparency/BatchFreshnessPledge.tsx
// Thẻ Chứng Thực Hạn Sử Dụng & Cam Kết Tươi Mới (Phase 15)
// ============================================================

import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Calendar,
  Barcode,
  ShoppingBag,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Sparkles,
} from "lucide-react";

interface BatchFreshnessPledgeProps {
  batch: {
    batchCode: string;
    manufactureDate: string;
    expiryDate: string;
    monthsRemaining: number;
    freshnessBadge: string;
    australianBarcode: string | null;
    chemistSource: string | null;
    certificateUrl: string | null;
    product: {
      id: string;
      name: string;
      slug: string;
      image: string | null;
    };
    variant?: {
      id: string;
      name: string;
      sku: string;
    } | null;
  };
}

export const BatchFreshnessPledge: React.FC<BatchFreshnessPledgeProps> = ({
  batch,
}) => {
  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

  const productImage = batch.product.image || "/images/placeholder.png";

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-7 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-rose-50 border border-rose-100 flex items-center justify-center flex-shrink-0">
            <ShieldCheck className="w-5 h-5 text-[#800028]" />
          </div>
          <div>
            <h4 className="font-bold text-slate-900 text-base">
              Chứng Nhận Mã Lô & Hạn Sử Dụng
            </h4>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-xs text-slate-500">Mã lô in đáy lon:</span>
              <span className="font-mono font-bold text-xs text-[#800028] bg-rose-50 px-2 py-0.5 rounded border border-rose-100">
                {batch.batchCode}
              </span>
            </div>
          </div>
        </div>

        <div className="self-start sm:self-auto">
          <span className="text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full inline-block">
            {batch.freshnessBadge}
          </span>
        </div>
      </div>

      {/* Thông tin sản phẩm & Hạn sử dụng */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
        {/* Ảnh & Tên Sản Phẩm */}
        <div className="flex items-center gap-4 md:col-span-1">
          <div className="relative w-20 h-20 rounded-2xl overflow-hidden bg-slate-50 border border-slate-200 flex-shrink-0 shadow-sm">
            <Image
              src={productImage}
              alt={batch.product.name}
              fill
              className="object-cover"
              sizes="80px"
            />
          </div>
          <div>
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Sản phẩm đối soát
            </span>
            <h5 className="font-bold text-slate-900 text-sm line-clamp-2 mt-0.5">
              {batch.product.name}
            </h5>
            {batch.variant && (
              <span className="text-xs text-slate-500 block mt-0.5">
                Phân loại: {batch.variant.name}
              </span>
            )}
          </div>
        </div>

        {/* Bảng Chỉ Số NSX & HSD */}
        <div className="grid grid-cols-2 gap-3 md:col-span-2">
          <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
            <span className="text-[11px] font-medium text-slate-500 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              Ngày sản xuất (NSX)
            </span>
            <div className="font-mono font-bold text-sm text-slate-800">
              {formatDate(batch.manufactureDate)}
            </div>
          </div>

          <div className="p-3.5 bg-emerald-50/50 rounded-2xl border border-emerald-100 space-y-1">
            <span className="text-[11px] font-medium text-emerald-800 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-emerald-600" />
              Hạn sử dụng (HSD)
            </span>
            <div className="font-mono font-bold text-sm text-emerald-900">
              {formatDate(batch.expiryDate)}
            </div>
          </div>

          {batch.australianBarcode && (
            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 space-y-1 col-span-2">
              <span className="text-[11px] font-medium text-slate-500 flex items-center gap-1">
                <Barcode className="w-3.5 h-3.5 text-slate-400" />
                Mã vạch quốc gia Úc (GS1 Australia)
              </span>
              <div className="font-mono font-bold text-sm text-slate-800">
                {batch.australianBarcode} (Đầu số 93x chuẩn Australia)
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Cam kết 4 không & Nút Đặt Mua Ngay */}
      <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-xs text-slate-600">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>
            Bảo đảm hoàn tiền 200% nếu phát hiện date cận hạn dưới 12 tháng.
          </span>
        </div>

        <Link
          href={`/san-pham/${batch.product.slug}`}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-[#800028] hover:bg-[#660020] text-white text-xs sm:text-sm font-semibold rounded-xl shadow-sm hover:shadow transition-all self-stretch sm:self-auto"
        >
          <ShoppingBag className="w-4 h-4" />
          <span>Đặt Mua Lô Hàng Này</span>
        </Link>
      </div>
    </div>
  );
};
