"use client";

// ============================================================
// components/storefront/gift-builder/StepBoxSelection.tsx
// Bước 1: Chọn Kiểu Dáng & Chất Liệu Vỏ Hộp Quà Biếu (Phase 17)
// ============================================================

import React from "react";
import { Check, Layers, Plane, Box } from "lucide-react";
import { BuilderTemplate } from "./types";
import { GIFT_BOX_TYPE_CONFIG } from "@/lib/validations/gift-box";

interface StepBoxSelectionProps {
  templates: BuilderTemplate[];
  selectedTemplateId: string | null;
  onSelectTemplate: (template: BuilderTemplate) => void;
}

export const StepBoxSelection: React.FC<StepBoxSelectionProps> = ({
  templates,
  selectedTemplateId,
  onSelectTemplate,
}) => {
  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(val);
  };

  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <h3 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
          1. Lựa Chọn Kiểu Dáng Vỏ Hộp Quà Sang Trọng
        </h3>
        <p className="text-xs text-slate-500">
          Mỗi vỏ hộp được chế tác công phu kèm rơm lót lụa cao cấp và bảo vệ tối ưu trong quá trình vận chuyển.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {templates.map((tpl) => {
          const isSelected = selectedTemplateId === tpl.id;
          const typeCfg =
            GIFT_BOX_TYPE_CONFIG[tpl.boxType] ||
            GIFT_BOX_TYPE_CONFIG.WOODEN_BOX;

          return (
            <div
              key={tpl.id}
              onClick={() => onSelectTemplate(tpl)}
              className={`relative rounded-3xl border-2 p-4 cursor-pointer transition-all flex flex-col justify-between overflow-hidden bg-white shadow-xs hover:shadow-md ${
                isSelected
                  ? "border-[#800028] ring-2 ring-[#800028]/20 bg-rose-50/20"
                  : "border-slate-200/90 hover:border-slate-300"
              }`}
            >
              {/* Selected Badge */}
              {isSelected && (
                <div className="absolute top-3 right-3 z-10 w-7 h-7 rounded-full bg-[#800028] text-white flex items-center justify-center shadow-sm">
                  <Check className="w-4 h-4 stroke-[3]" />
                </div>
              )}

              {/* Image Preview */}
              <div className="space-y-3">
                <div className="relative w-full h-44 rounded-2xl overflow-hidden bg-slate-100 border border-slate-100">
                  {tpl.imageUrl ? (
                    <img
                      src={tpl.imageUrl}
                      alt={tpl.name}
                      className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-300">
                      <Box className="w-8 h-8" />
                    </div>
                  )}

                  {/* Air-Cargo Badge */}
                  {tpl.isAirCargoPledge && (
                    <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded-full bg-slate-900/80 backdrop-blur-md text-white text-[10px] font-bold flex items-center gap-1">
                      <Plane className="w-3 h-3 text-sky-400" />
                      <span>Chuẩn bay Air</span>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${typeCfg.badgeClass}`}
                    >
                      {typeCfg.label}
                    </span>
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md">
                      <Layers className="w-3 h-3 text-slate-500" />
                      <span>{tpl.maxSlots} ô sức chứa</span>
                    </span>
                  </div>

                  <h4 className="font-extrabold text-slate-900 text-sm sm:text-base leading-snug">
                    {tpl.name}
                  </h4>

                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                    {tpl.description || typeCfg.description}
                  </p>

                  <div className="text-[11px] text-slate-400 font-mono">
                    Kích thước: {tpl.dimensions}
                  </div>
                </div>
              </div>

              {/* Price footer */}
              <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 block uppercase font-semibold">
                    Giá vỏ hộp
                  </span>
                  <span className="text-sm sm:text-base font-black text-[#800028]">
                    {formatCurrency(tpl.basePrice)}
                  </span>
                </div>

                <button
                  type="button"
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    isSelected
                      ? "bg-[#800028] text-white"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  }`}
                >
                  {isSelected ? "Đã chọn" : "Chọn mẫu này"}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
