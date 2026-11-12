"use client";

// ============================================================
// components/storefront/gift-builder/StepProductSelection.tsx
// Bước 2: Chọn Sản Phẩm Úc Xếp Vào Giỏ & Theo Dõi Sức Chứa (Phase 17)
// ============================================================

import React, { useState } from "react";
import {
  Layers,
  Plus,
  Minus,
  Check,
  AlertCircle,
  Package,
  Plane,
  ShieldCheck,
  Filter,
} from "lucide-react";
import { BuilderProduct, SelectedHamperItem, BuilderTemplate } from "./types";

interface StepProductSelectionProps {
  products: BuilderProduct[];
  selectedTemplate: BuilderTemplate | null;
  selectedItems: SelectedHamperItem[];
  onAddItem: (product: BuilderProduct) => void;
  onRemoveItem: (productId: string) => void;
  totalSlotsUsed: number;
}

export const StepProductSelection: React.FC<StepProductSelectionProps> = ({
  products,
  selectedTemplate,
  selectedItems,
  onAddItem,
  onRemoveItem,
  totalSlotsUsed,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(val);
  };

  const maxSlots = selectedTemplate?.maxSlots || 5;
  const isFull = totalSlotsUsed >= maxSlots;
  const remainingSlots = Math.max(0, maxSlots - totalSlotsUsed);
  const progressPercent = Math.min(100, Math.round((totalSlotsUsed / maxSlots) * 100));

  // Lọc sản phẩm
  const filteredProducts = products.filter((p) => {
    if (selectedCategory === "ALL") return true;
    return p.category.slug.includes(selectedCategory);
  });

  return (
    <div className="space-y-5">
      {/* 1. Header & Live Capacity Gauge */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <span className="text-[11px] font-bold text-[#800028] bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-100 uppercase tracking-wider">
              Vỏ hộp: {selectedTemplate?.name || "Chưa chọn"}
            </span>
            <h3 className="text-base sm:text-lg font-black text-slate-900 mt-1">
              2. Chọn Vật Phẩm Cao Cấp Xếp Vào Hộp Quà
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              100% Sản phẩm nhập khẩu bay Air chính ngạch, có tem phụ và chứng nhận nguồn gốc xuất xứ.
            </p>
          </div>

          {/* Capacity pill */}
          <div className="flex items-center gap-2 p-2.5 bg-slate-50 rounded-2xl border border-slate-200/80 self-start sm:self-auto">
            <Layers className="w-5 h-5 text-[#800028]" />
            <div>
              <span className="text-[10px] text-slate-400 block uppercase font-bold">
                Sức chứa hộp
              </span>
              <span className="text-xs sm:text-sm font-black text-slate-900">
                {totalSlotsUsed} / {maxSlots} ô ({isFull ? "Đầy hộp" : `Còn ${remainingSlots} ô`})
              </span>
            </div>
          </div>
        </div>

        {/* Capacity Progress Bar */}
        <div className="space-y-1.5">
          <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200">
            <div
              className={`h-full rounded-full transition-all duration-300 ${
                isFull
                  ? "bg-amber-500"
                  : progressPercent > 70
                  ? "bg-[#800028]"
                  : "bg-emerald-500"
              }`}
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          {isFull && (
            <p className="text-[11px] text-amber-700 font-semibold flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>Hộp quà đã đầy sức chứa. Bạn có thể chuyển sang Bước 3 hoặc bỏ bớt sản phẩm để thêm món khác.</span>
            </p>
          )}
        </div>
      </div>

      {/* 2. Category Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        <button
          onClick={() => setSelectedCategory("ALL")}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
            selectedCategory === "ALL"
              ? "bg-slate-900 text-white shadow-xs"
              : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
          }`}
        >
          Tất cả vật phẩm ({products.length})
        </button>
        <button
          onClick={() => setSelectedCategory("trai-cay")}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
            selectedCategory === "trai-cay"
              ? "bg-[#800028] text-white shadow-xs"
              : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
          }`}
        >
          🍒 Cherry Úc Tươi Bay Air
        </button>
        <button
          onClick={() => setSelectedCategory("thuc-pham-chuc-nang")}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
            selectedCategory === "thuc-pham-chuc-nang"
              ? "bg-[#800028] text-white shadow-xs"
              : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
          }`}
        >
          🍯 Mật Ong Manuka & TPCN Úc
        </button>
        <button
          onClick={() => setSelectedCategory("me-va-be")}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
            selectedCategory === "me-va-be"
              ? "bg-[#800028] text-white shadow-xs"
              : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
          }`}
        >
          👶 Sữa Aptamil & Mẹ Bé
        </button>
      </div>

      {/* 3. Product Selection Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredProducts.map((p) => {
          const variant = p.defaultVariant;
          const price = variant ? Number(variant.price) : 0;
          const selected = selectedItems.find((i) => i.productId === p.id);
          const currentQty = selected ? selected.quantity : 0;
          const canAdd = !isFull && (totalSlotsUsed + p.slotCost <= maxSlots);

          return (
            <div
              key={p.id}
              className={`bg-white rounded-3xl border-2 p-4 shadow-xs transition-all flex flex-col justify-between ${
                currentQty > 0
                  ? "border-emerald-400 bg-emerald-50/15"
                  : "border-slate-200/90 hover:border-slate-300"
              }`}
            >
              <div className="space-y-3">
                {/* Image */}
                <div className="relative w-full h-36 rounded-2xl overflow-hidden bg-slate-100 border border-slate-100">
                  {p.images[0]?.url ? (
                    <img
                      src={p.images[0].url}
                      alt={p.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-300">
                      <Package className="w-8 h-8" />
                    </div>
                  )}

                  {/* Slot cost tag */}
                  <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-slate-900/80 backdrop-blur-md text-white text-[10px] font-bold flex items-center gap-1">
                    <Layers className="w-3 h-3 text-amber-400" />
                    <span>Chiếm {p.slotCost} ô</span>
                  </div>

                  {/* Origin */}
                  {p.origin && (
                    <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-white/90 backdrop-blur-md text-slate-800 text-[10px] font-semibold border border-slate-200">
                      {p.origin}
                    </div>
                  )}
                </div>

                {/* Details */}
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    {p.brand || p.category.name}
                  </span>
                  <h4 className="font-bold text-slate-900 text-xs sm:text-sm line-clamp-2 leading-snug">
                    {p.name}
                  </h4>
                  {p.specification && (
                    <p className="text-[11px] text-slate-500">
                      Quy cách: {p.specification}
                    </p>
                  )}
                </div>
              </div>

              {/* Price & Quantity Controls */}
              <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <span className="text-sm font-black text-[#800028] block">
                    {formatCurrency(price)}
                  </span>
                </div>

                {currentQty > 0 ? (
                  <div className="flex items-center gap-1.5 bg-emerald-100/70 p-1 rounded-xl border border-emerald-200">
                    <button
                      type="button"
                      onClick={() => onRemoveItem(p.id)}
                      className="w-7 h-7 rounded-lg bg-white text-slate-700 hover:bg-slate-50 flex items-center justify-center font-bold shadow-2xs"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="font-black text-xs text-emerald-950 w-5 text-center">
                      {currentQty}
                    </span>
                    <button
                      type="button"
                      onClick={() => onAddItem(p)}
                      disabled={!canAdd}
                      className="w-7 h-7 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 flex items-center justify-center font-bold shadow-2xs disabled:opacity-40"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => onAddItem(p)}
                    disabled={!canAdd}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all disabled:opacity-30 disabled:pointer-events-none"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Thêm vào hộp</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
