"use client";

// ============================================================
// components/storefront/transparency/ChemistReceiptGallery.tsx
// Thư Viện Hóa Đơn Mua Hàng Chemist Warehouse Úc & Lightbox (Phase 15)
// ============================================================

import React, { useState } from "react";
import Image from "next/image";
import { FileText, ZoomIn, X, ShieldCheck, ExternalLink } from "lucide-react";

interface ChemistReceiptGalleryProps {
  receiptImages: string[];
  chemistSource?: string | null;
}

export const ChemistReceiptGallery: React.FC<ChemistReceiptGalleryProps> = ({
  receiptImages,
  chemistSource,
}) => {
  const [activeImage, setActiveImage] = useState<string | null>(null);

  const imagesToDisplay =
    receiptImages.length > 0
      ? receiptImages
      : [
          "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800",
        ];

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-7 space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-amber-50 border border-amber-100 flex items-center justify-center flex-shrink-0">
            <FileText className="w-5 h-5 text-amber-700" />
          </div>
          <div>
            <h4 className="font-bold text-slate-900 text-base">
              Hóa Đơn Mua Hàng Tại Úc (Tax Invoice)
            </h4>
            <p className="text-xs text-slate-500">
              {chemistSource || "Chemist Warehouse Sydney (Pitt St, NSW, Australia)"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full self-start sm:self-auto">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>Có thuế GST Úc</span>
        </div>
      </div>

      {/* Grid Thumbnail Hóa Đơn */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3.5">
        {imagesToDisplay.map((imgUrl, idx) => (
          <div
            key={idx}
            onClick={() => setActiveImage(imgUrl)}
            className="group relative aspect-[3/4] bg-slate-100 rounded-2xl overflow-hidden border border-slate-200 cursor-pointer hover:border-[#800028] shadow-sm hover:shadow-md transition-all"
          >
            <Image
              src={imgUrl}
              alt={`Hóa đơn Chemist Warehouse #${idx + 1}`}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 768px) 50vw, 25vw"
            />
            <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <div className="p-2.5 rounded-full bg-white/90 text-slate-900 shadow-lg">
                <ZoomIn className="w-5 h-5" />
              </div>
            </div>
            <div className="absolute bottom-2 left-2 right-2 bg-black/60 backdrop-blur-sm px-2 py-1 rounded-lg text-[10px] text-white font-medium text-center truncate">
              Hóa đơn #{idx + 1}
            </div>
          </div>
        ))}
      </div>

      <p className="text-xs text-slate-500 italic">
        * Nhấp vào hóa đơn để xem ảnh độ phân giải cao, hiển thị rõ số sê-ri, mã sản phẩm và thời gian thanh toán tại quầy thuốc Úc.
      </p>

      {/* Lightbox Modal */}
      {activeImage && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setActiveImage(null)}
        >
          <div
            className="relative max-w-4xl w-full max-h-[90vh] bg-white rounded-3xl overflow-hidden shadow-2xl p-4 flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
              <h5 className="font-bold text-slate-800 text-sm flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#800028]" />
                Hóa Đơn Mua Hàng Chemist Warehouse Úc (Tax Invoice Official)
              </h5>
              <button
                onClick={() => setActiveImage(null)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg bg-slate-100 hover:bg-slate-200 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="relative w-full h-[70vh] bg-slate-950 rounded-2xl overflow-hidden">
              <Image
                src={activeImage}
                alt="Hóa đơn phóng to"
                fill
                className="object-contain"
                sizes="(max-width: 1200px) 100vw, 1000px"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
