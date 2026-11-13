"use client";

// ============================================================
// components/storefront/product/ProductAirCargoBadge.tsx
// Widget Huy Hiệu Chứng Nhận Bay Air & Khóa HSD Chi Tiết Sản Phẩm (Phase 15)
// ============================================================

import React from "react";
import Link from "next/link";
import {
  Plane,
  ShieldCheck,
  Calendar,
  Thermometer,
  FileText,
  ExternalLink,
  ChevronRight,
  CheckCircle2,
} from "lucide-react";

export interface LatestBatchData {
  batchCode: string;
  expiryDate: string;
  monthsRemaining: number;
  chemistSource: string | null;
  australianBarcode: string | null;
  airWaybillNumber: string;
  flightNumber: string;
  carrier: string;
  arrivalDate: string;
  storageTemp: string;
}

interface ProductAirCargoBadgeProps {
  latestBatch?: LatestBatchData | null;
}

export const ProductAirCargoBadge: React.FC<ProductAirCargoBadgeProps> = ({
  latestBatch,
}) => {
  if (!latestBatch) {
    return (
      <div className="p-3.5 rounded-2xl bg-gradient-to-r from-sky-50/80 via-emerald-50/50 to-white border border-sky-200/80 shadow-2xs">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-sky-100/90 text-sky-800 flex items-center justify-center shrink-0">
              <Plane className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-1.5 font-bold text-xs text-slate-900 uppercase tracking-wide">
                <span>100% Vận Chuyển Đường Bay Air-Cargo</span>
                <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded font-semibold">
                  Date mới tinh
                </span>
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Khoang mát 18-24°C, bảo quản trọn vẹn vi chất Aptamil & Vitamin Úc.
              </p>
            </div>
          </div>

          <Link
            href="/minh-bach-air-cargo"
            className="flex items-center gap-1 text-[11px] font-bold text-[#800028] hover:underline shrink-0 pl-2"
          >
            <span>Tra cứu</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    );
  }

  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString("vi-VN", {
        month: "2-digit",
        year: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="p-4 rounded-2xl bg-gradient-to-br from-sky-50/90 via-emerald-50/40 to-white border border-sky-200/90 shadow-2xs space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between gap-2 pb-2.5 border-b border-sky-100/80">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-sky-600 text-white flex items-center justify-center shadow-xs">
            <Plane className="w-3.5 h-3.5" />
          </div>
          <div>
            <h4 className="font-bold text-xs text-slate-900 tracking-wide uppercase">
              Chứng Nhận Lô Bay Air Đang Lưu Hành
            </h4>
            <span className="text-[11px] text-slate-500 font-medium">
              Chuyến {latestBatch.flightNumber} • AWB:{" "}
              <strong className="text-slate-700 font-mono">
                {latestBatch.airWaybillNumber}
              </strong>
            </span>
          </div>
        </div>

        <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100/90 px-2 py-0.5 rounded-full border border-emerald-200 shrink-0">
          Còn {latestBatch.monthsRemaining} tháng HSD
        </span>
      </div>

      {/* Grid Thông Số */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
        {/* Mã lô */}
        <div className="p-2 bg-white/80 rounded-xl border border-sky-100/80">
          <span className="text-[10px] text-slate-400 block font-medium">
            Mã lô đáy lon:
          </span>
          <span className="font-mono font-bold text-[#800028] text-xs">
            {latestBatch.batchCode}
          </span>
        </div>

        {/* HSD */}
        <div className="p-2 bg-white/80 rounded-xl border border-sky-100/80">
          <span className="text-[10px] text-slate-400 block font-medium">
            Hạn sử dụng:
          </span>
          <span className="font-mono font-bold text-slate-800 text-xs">
            {formatDate(latestBatch.expiryDate)}
          </span>
        </div>

        {/* Nhiệt độ */}
        <div className="p-2 bg-white/80 rounded-xl border border-sky-100/80 col-span-2 sm:col-span-1">
          <span className="text-[10px] text-slate-400 block font-medium">
            Nhiệt độ kho mát:
          </span>
          <span className="font-mono font-bold text-emerald-700 text-xs">
            {latestBatch.storageTemp}
          </span>
        </div>
      </div>

      {/* Action CTA link to Portal & Flight Radar */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-[11px]">
        <div className="flex items-center gap-1 text-slate-500 truncate">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
          <span className="truncate">
            Mua tại {latestBatch.chemistSource || "Chemist Warehouse Úc"}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {latestBatch.flightNumber && (
            <Link
              href={`/tra-cuu-air-cargo/${encodeURIComponent(latestBatch.flightNumber)}`}
              className="font-bold text-sky-700 hover:text-sky-900 hover:underline flex items-center gap-0.5"
            >
              <Plane className="w-3 h-3" />
              <span>Radar bay {latestBatch.flightNumber}</span>
            </Link>
          )}

          <Link
            href={`/minh-bach-air-cargo?code=${encodeURIComponent(latestBatch.batchCode)}`}
            className="font-bold text-[#800028] hover:text-[#660020] hover:underline flex items-center gap-0.5 shrink-0"
          >
            <span>Soi hóa đơn & AWB</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
};
