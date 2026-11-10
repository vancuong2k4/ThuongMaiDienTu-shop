"use client";

// ============================================================
// components/storefront/flash-sale/FlashSaleTimeSlots.tsx
// Thanh Chọn Khung Giờ Săn Deal (Active vs Upcoming Slots)
// ============================================================

import React from "react";
import { Zap, Clock, Calendar } from "lucide-react";
import type { StorefrontFlashSaleCampaign } from "./types";

interface FlashSaleTimeSlotsProps {
  campaigns: StorefrontFlashSaleCampaign[];
  selectedCampaignId: string;
  onSelectCampaign: (id: string) => void;
}

export const FlashSaleTimeSlots: React.FC<FlashSaleTimeSlotsProps> = ({
  campaigns,
  selectedCampaignId,
  onSelectCampaign,
}) => {
  if (campaigns.length <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-3 overflow-x-auto pb-2 scrollbar-none my-6">
      {campaigns.map((c) => {
        const isSelected = selectedCampaignId === c.id;
        const isActive = c.status === "ACTIVE";

        return (
          <button
            key={c.id}
            type="button"
            onClick={() => onSelectCampaign(c.id)}
            className={`px-5 py-3 rounded-2xl transition-all flex items-center gap-3 shrink-0 text-left border ${
              isSelected
                ? "bg-[#800028] text-white border-[#800028] shadow-lg shadow-[#800028]/25 scale-105"
                : "bg-white text-slate-700 border-slate-200/80 hover:bg-slate-50"
            }`}
          >
            <div
              className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                isSelected
                  ? "bg-white/20 text-white"
                  : isActive
                  ? "bg-rose-50 text-[#800028]"
                  : "bg-amber-50 text-amber-600"
              }`}
            >
              {isActive ? (
                <Zap className="w-5 h-5 fill-current" />
              ) : (
                <Clock className="w-5 h-5" />
              )}
            </div>

            <div className="space-y-0.5">
              <div className="text-xs font-black uppercase tracking-wider">
                {isActive ? "⚡ Đang Diễn Ra" : "⏳ Sắp Diễn Ra"}
              </div>
              <div
                className={`text-[11px] font-medium line-clamp-1 max-w-[180px] ${
                  isSelected ? "text-rose-100" : "text-slate-500"
                }`}
              >
                {c.deals.length} Sản phẩm deal sốc
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
};
