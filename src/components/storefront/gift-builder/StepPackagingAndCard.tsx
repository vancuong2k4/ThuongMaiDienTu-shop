"use client";

// ============================================================
// components/storefront/gift-builder/StepPackagingAndCard.tsx
// Bước 3: Phụ Kiện Nơ Satin, Dấu Niêm Sáp & Thiết Kế Thiệp Chúc Mừng (Phase 17)
// ============================================================

import React from "react";
import {
  Gift,
  Check,
  Stamp,
  Lightbulb,
  FileText,
  Heart,
  ChevronRight,
  PenTool,
} from "lucide-react";
import { BuilderFormData } from "./types";
import {
  GiftRibbonColor,
  GiftOccasion,
} from "@prisma/client";
import {
  GIFT_RIBBON_COLOR_CONFIG,
  GIFT_OCCASION_CONFIG,
} from "@/lib/validations/gift-box";

interface StepPackagingAndCardProps {
  formData: BuilderFormData;
  onChange: (fields: Partial<BuilderFormData>) => void;
}

export const StepPackagingAndCard: React.FC<StepPackagingAndCardProps> = ({
  formData,
  onChange,
}) => {
  const currentOccasionCfg = GIFT_OCCASION_CONFIG[formData.occasion];

  const handleApplySampleGreeting = () => {
    if (currentOccasionCfg?.greetingSample) {
      onChange({ greetingCardMessage: currentOccasionCfg.greetingSample });
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h3 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
          3. Phụ Kiện Đóng Gói Hoàng Gia & Thiết Kế Thiệp Chúc Mừng
        </h3>
        <p className="text-xs text-slate-500">
          Tùy chỉnh nơ lụa satin dệt kim, dấu niêm sáp đồng cổ điển và in thiệp chúc mừng gửi tận tay người nhận.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column: Form Controls */}
        <div className="space-y-5 bg-white p-5 sm:p-6 rounded-3xl border border-slate-200/90 shadow-xs">
          {/* 1. Chọn màu nơ ruy băng */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-800 flex items-center justify-between">
              <span>Màu Nơ Lụa Satin Cao Cấp</span>
              <span className="text-[11px] font-semibold text-[#800028]">
                {GIFT_RIBBON_COLOR_CONFIG[formData.ribbonColor].label}
              </span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {Object.entries(GIFT_RIBBON_COLOR_CONFIG).map(([key, cfg]) => {
                const isSelected = formData.ribbonColor === key;
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => onChange({ ribbonColor: key as GiftRibbonColor })}
                    className={`p-2.5 rounded-2xl border-2 flex items-center gap-2 transition-all ${
                      isSelected
                        ? "border-[#800028] bg-rose-50/30 ring-1 ring-[#800028]"
                        : "border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <span
                      className="w-4 h-4 rounded-full shrink-0 shadow-2xs border border-white"
                      style={{ backgroundColor: cfg.hex }}
                    />
                    <span className="text-xs font-bold text-slate-800 truncate">
                      {cfg.label.split(" ")[0]}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. Dấu niêm sáp & Đèn LED */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            {/* Wax Seal */}
            <div
              onClick={() => onChange({ hasWaxSeal: !formData.hasWaxSeal })}
              className={`p-3.5 rounded-2xl border-2 cursor-pointer transition-all flex items-start gap-3 ${
                formData.hasWaxSeal
                  ? "border-[#800028] bg-rose-50/20"
                  : "border-slate-200 hover:border-slate-300"
              }`}
            >
              <div
                className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 mt-0.5 ${
                  formData.hasWaxSeal
                    ? "bg-[#800028] border-[#800028] text-white"
                    : "border-slate-300 bg-white"
                }`}
              >
                {formData.hasWaxSeal && <Check className="w-3.5 h-3.5 stroke-[3]" />}
              </div>
              <div>
                <span className="font-bold text-xs text-slate-900 block">
                  Dấu Niêm Sáp Đồng THUYNGA
                </span>
                <span className="text-[11px] text-slate-400 block mt-0.5">
                  Niêm phong nắp hộp phong cách quý tộc Âu Mỹ (Miễn phí)
                </span>
              </div>
            </div>

            {/* LED Fairy Lights */}
            <div
              onClick={() => onChange({ hasLedLights: !formData.hasLedLights })}
              className={`p-3.5 rounded-2xl border-2 cursor-pointer transition-all flex items-start gap-3 ${
                formData.hasLedLights
                  ? "border-amber-400 bg-amber-50/20"
                  : "border-slate-200 hover:border-slate-300"
              }`}
            >
              <div
                className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 mt-0.5 ${
                  formData.hasLedLights
                    ? "bg-amber-500 border-amber-500 text-white"
                    : "border-slate-300 bg-white"
                }`}
              >
                {formData.hasLedLights && <Check className="w-3.5 h-3.5 stroke-[3]" />}
              </div>
              <div>
                <span className="font-bold text-xs text-slate-900 block">
                  Đèn LED Đom Đóm Ấm Áp
                </span>
                <span className="text-[11px] text-amber-700 block mt-0.5 font-medium">
                  Hiệu ứng lung linh khi mở hộp (+50.000₫)
                </span>
              </div>
            </div>
          </div>

          {/* 3. Dịp biếu tặng */}
          <div className="space-y-1.5 pt-2">
            <label className="text-xs font-bold text-slate-800">
              Dịp Lễ / Mục Đích Tặng Quà
            </label>
            <select
              value={formData.occasion}
              onChange={(e) => onChange({ occasion: e.target.value as GiftOccasion })}
              className="w-full px-3.5 py-2.5 rounded-2xl border border-slate-200 focus:outline-none focus:border-[#800028] bg-white text-xs font-bold text-slate-800"
            >
              {Object.entries(GIFT_OCCASION_CONFIG).map(([k, cfg]) => (
                <option key={k} value={k}>
                  {cfg.label}
                </option>
              ))}
            </select>
          </div>

          {/* 4. Người gửi & Người nhận */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Người Tặng (Gửi Từ)</label>
              <input
                type="text"
                value={formData.cardSenderName}
                onChange={(e) => onChange({ cardSenderName: e.target.value })}
                placeholder="VD: Gia đình Bác Thành, Công ty ABC"
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-[#800028]"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Người Nhận (Kính Tặng)</label>
              <input
                type="text"
                value={formData.cardReceiverName}
                onChange={(e) => onChange({ cardReceiverName: e.target.value })}
                placeholder="VD: Bác sĩ Minh Hoàng, Chú Ba"
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-[#800028]"
              />
            </div>
          </div>

          {/* 5. Lời chúc thiệp */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-800">
                Lời Chúc In Thiệp (Tối đa 500 ký tự)
              </label>
              <button
                type="button"
                onClick={handleApplySampleGreeting}
                className="text-[11px] font-bold text-[#800028] hover:underline"
              >
                Gợi ý lời chúc theo dịp
              </button>
            </div>
            <textarea
              rows={4}
              maxLength={500}
              value={formData.greetingCardMessage}
              onChange={(e) => onChange({ greetingCardMessage: e.target.value })}
              placeholder="Nhập lời chúc chân thành của bạn..."
              className="w-full p-3 rounded-2xl border border-slate-200 text-xs focus:outline-none focus:border-[#800028] leading-relaxed"
            />
          </div>
        </div>

        {/* Right Column: Live Embossed Card Preview */}
        <div className="space-y-3">
          <div className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
            <PenTool className="w-4 h-4 text-[#800028]" />
            <span>Xem Trước Thiệp Chúc Mừng Dập Nổi Thực Tế</span>
          </div>

          <div className="relative rounded-3xl p-7 sm:p-9 shadow-lg border-2 border-amber-200 bg-gradient-to-br from-amber-50/80 via-white to-amber-50/60 overflow-hidden min-h-[360px] flex flex-col justify-between">
            {/* Top decorative header */}
            <div className="text-center space-y-1 pb-4 border-b border-amber-200/60">
              <span className="text-[10px] tracking-widest font-black uppercase text-amber-800">
                THUYNGA SHOP • AUSTRALIA PREMIUM GIFTS
              </span>
              <h4 className="font-serif italic text-xl font-bold text-slate-900">
                {currentOccasionCfg?.label || "Thiệp Chúc Mừng"}
              </h4>
            </div>

            {/* Card Body */}
            <div className="py-6 space-y-4 text-center my-auto">
              {formData.cardReceiverName && (
                <p className="font-serif italic text-base font-bold text-[#800028]">
                  Kính tặng: {formData.cardReceiverName}
                </p>
              )}

              <p className="font-serif text-slate-800 text-sm sm:text-base leading-relaxed italic max-w-sm mx-auto px-2">
                &ldquo;{formData.greetingCardMessage || "Kính chúc Quý Khách cùng gia đình luôn dồi dào sức khỏe, an khang thịnh vượng và vạn sự như ý!"}&rdquo;
              </p>

              {formData.cardSenderName && (
                <div className="pt-2">
                  <span className="text-xs text-slate-500 font-serif italic block">
                    Thân gửi từ:
                  </span>
                  <span className="font-bold text-slate-900 text-sm sm:text-base">
                    {formData.cardSenderName}
                  </span>
                </div>
              )}
            </div>

            {/* Wax Seal Decoration Stamp */}
            {formData.hasWaxSeal && (
              <div className="flex justify-end pt-3 border-t border-amber-200/50">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-900 text-amber-200 text-[10px] font-black uppercase tracking-wider shadow-sm border border-amber-300">
                  <Stamp className="w-3.5 h-3.5" />
                  <span>Dấu Sáp Hoàng Gia TN</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
