"use client";

// ============================================================
// components/storefront/comparison/FloatingComparisonDock.tsx
// Thanh Dock Nổi So Sánh Dưới Đáy Màn Hình (Phase 19)
// ============================================================

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Scale,
  X,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  Plus,
  Trash2,
} from "lucide-react";
import { useComparisonStore } from "@/store/comparison";
import { formatVND } from "@/lib/utils";

export const FloatingComparisonDock: React.FC = () => {
  const [mounted, setMounted] = useState(false);
  const { items, isOpen, toggleOpen, removeItem, clear } =
    useComparisonStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || items.length === 0) return null;

  const maxSlots = 4;
  const emptySlotsCount = Math.max(0, maxSlots - items.length);

  return (
    <div className="fixed bottom-20 lg:bottom-4 left-4 right-4 sm:left-auto sm:right-6 z-45 max-w-2xl sm:min-w-[480px] animate-in fade-in-0 slide-in-from-bottom-5 duration-300 font-sans">
      {!isOpen ? (
        // ── Collapsed Pill ──────────────────────────────────────
        <div className="flex justify-end">
          <button
            type="button"
            onClick={toggleOpen}
            className="group flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-gradient-to-r from-slate-900 via-[#800028] to-slate-900 text-white shadow-xl hover:shadow-2xl border border-white/20 transition-all hover:scale-105"
          >
            <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
              <Scale className="w-3.5 h-3.5 text-white" />
            </div>
            <div className="flex items-center gap-1.5 text-xs font-bold">
              <span>So sánh sản phẩm</span>
              <span className="px-1.5 py-0.2 rounded-full bg-amber-400 text-slate-950 text-[10px] font-black">
                {items.length}/{maxSlots}
              </span>
            </div>
            <ChevronUp className="w-4 h-4 text-white/70 group-hover:text-white" />
          </button>
        </div>
      ) : (
        // ── Expanded Dock Card ──────────────────────────────────
        <div className="bg-white/95 backdrop-blur-md rounded-3xl border border-slate-200 shadow-2xl overflow-hidden flex flex-col">
          {/* Header */}
          <div className="px-4 py-2.5 bg-gradient-to-r from-slate-900 via-[#800028] to-slate-900 text-white flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Scale className="w-4 h-4 text-amber-300" />
              <h4 className="font-bold text-xs">
                So Sánh Sản Phẩm Úc ({items.length}/{maxSlots})
              </h4>
            </div>

            <div className="flex items-center gap-3 text-xs">
              <button
                type="button"
                onClick={clear}
                className="text-white/70 hover:text-white flex items-center gap-1 text-[11px] font-medium transition-colors"
                title="Xóa tất cả"
              >
                <Trash2 className="w-3 h-3" />
                <span>Xóa hết</span>
              </button>

              <button
                type="button"
                onClick={toggleOpen}
                className="p-1 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors"
                title="Thu gọn"
              >
                <ChevronDown className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Product Slots */}
          <div className="p-3.5 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="grid grid-cols-4 gap-2 flex-1">
              {/* Filled Slots */}
              {items.map((item) => (
                <div
                  key={item.id}
                  className="relative group bg-slate-50 border border-slate-200/90 rounded-2xl p-1.5 flex flex-col items-center text-center shadow-2xs"
                >
                  {/* Remove Button */}
                  <button
                    type="button"
                    onClick={() => removeItem(item.id)}
                    className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-slate-800 text-white hover:bg-rose-600 flex items-center justify-center shadow-xs transition-colors z-10"
                    title="Xóa khỏi so sánh"
                  >
                    <X className="w-3 h-3" />
                  </button>

                  <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-white shrink-0 mb-1">
                    <Image
                      src={item.image || "/images/placeholder.svg"}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  </div>

                  <span className="text-[10px] font-bold text-slate-800 line-clamp-1 w-full px-0.5">
                    {item.name}
                  </span>
                  <span className="text-[10px] font-extrabold text-[#800028]">
                    {formatVND(item.price)}
                  </span>
                </div>
              ))}

              {/* Empty Slots */}
              {Array.from({ length: emptySlotsCount }).map((_, idx) => (
                <div
                  key={`empty_${idx}`}
                  className="border-2 border-dashed border-slate-200 rounded-2xl p-2 flex flex-col items-center justify-center text-center text-slate-400 min-h-[80px]"
                >
                  <Plus className="w-4 h-4 text-slate-300 mb-1" />
                  <span className="text-[9px] font-medium text-slate-400">
                    Thêm SP ({items.length + idx + 1})
                  </span>
                </div>
              ))}
            </div>

            {/* Compare CTA */}
            <div className="sm:border-l sm:border-slate-100 sm:pl-3 flex flex-col justify-center shrink-0">
              <Link
                href="/so-sanh"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-3 rounded-2xl bg-[#800028] hover:bg-[#660020] text-white font-black text-xs shadow-md transition-all active:scale-98"
              >
                <span>So Sánh Ngay</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <span className="text-[9px] text-slate-400 text-center mt-1">
                Phân tích vi chất Dược sĩ
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
