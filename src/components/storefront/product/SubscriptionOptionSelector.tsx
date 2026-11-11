"use client";

// ============================================================
// components/storefront/product/SubscriptionOptionSelector.tsx
// Bộ Chọn Phương Thức Mua: "Mua Một Lần" vs "Giao Định Kỳ Tiết Kiệm 10%" (Stage 13.4)
// ============================================================

import React from "react";
import { formatVND } from "@/lib/utils";
import {
  Repeat,
  CheckCircle2,
  Calendar,
  Truck,
  ShieldCheck,
  Clock,
} from "lucide-react";
import { SUBSCRIPTION_CONFIG } from "@/lib/validations/subscription";

export type SubscriptionFrequencyType =
  | "EVERY_2_WEEKS"
  | "EVERY_1_MONTH"
  | "EVERY_2_MONTHS"
  | "EVERY_3_MONTHS";

interface SubscriptionOptionSelectorProps {
  isSubscription: boolean;
  onToggleSubscription: (isSub: boolean) => void;
  frequency: SubscriptionFrequencyType;
  onFrequencyChange: (freq: SubscriptionFrequencyType) => void;
  basePrice: number;
}

export const SubscriptionOptionSelector: React.FC<SubscriptionOptionSelectorProps> = ({
  isSubscription,
  onToggleSubscription,
  frequency,
  onFrequencyChange,
  basePrice,
}) => {
  const subscriptionPrice = Math.round(
    basePrice * (1 - SUBSCRIPTION_CONFIG.DEFAULT_DISCOUNT_PERCENT / 100)
  );
  const savingsPerUnit = basePrice - subscriptionPrice;

  return (
    <div className="space-y-3 pt-2">
      <span className="text-xs font-bold text-gray-700 uppercase tracking-wide block">
        Tùy chọn mua hàng:
      </span>

      <div className="grid grid-cols-1 gap-2.5">
        {/* Lựa chọn 1: Mua một lần */}
        <label
          onClick={() => onToggleSubscription(false)}
          className={`flex items-center justify-between p-3.5 rounded-2xl border-2 cursor-pointer transition-all ${
            !isSubscription
              ? "border-[#800028] bg-rose-50/30 shadow-2xs"
              : "border-gray-200 bg-white hover:border-gray-300"
          }`}
        >
          <div className="flex items-center gap-3">
            <input
              type="radio"
              name="purchaseType"
              checked={!isSubscription}
              onChange={() => onToggleSubscription(false)}
              className="w-4 h-4 text-[#800028] focus:ring-[#800028]"
            />
            <div>
              <span className="text-xs sm:text-sm font-bold text-gray-900 block">
                Mua một lần
              </span>
              <span className="text-[11px] text-gray-500">
                Giao hàng tiêu chuẩn theo đơn hàng này
              </span>
            </div>
          </div>
          <span className="text-sm font-extrabold text-gray-900">
            {formatVND(basePrice)}
          </span>
        </label>

        {/* Lựa chọn 2: Đăng ký định kỳ (Subscribe & Save) */}
        <div
          className={`rounded-2xl border-2 transition-all overflow-hidden ${
            isSubscription
              ? "border-emerald-600 bg-gradient-to-br from-emerald-50/40 via-white to-emerald-50/20 shadow-sm"
              : "border-gray-200 bg-white hover:border-gray-300"
          }`}
        >
          <label
            onClick={() => onToggleSubscription(true)}
            className="flex items-start justify-between p-3.5 cursor-pointer"
          >
            <div className="flex items-start gap-3">
              <input
                type="radio"
                name="purchaseType"
                checked={isSubscription}
                onChange={() => onToggleSubscription(true)}
                className="w-4 h-4 mt-0.5 text-emerald-600 focus:ring-emerald-600"
              />
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs sm:text-sm font-black text-gray-900">
                    Giao Định Kỳ (Subscribe & Save)
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-600 text-white text-[10px] font-black uppercase tracking-wider shadow-2xs">
                    TIẾT KIỆM 10%
                  </span>
                </div>
                <p className="text-[11px] text-emerald-800 font-medium mt-0.5">
                  Tiết kiệm {formatVND(savingsPerUnit)} mỗi sản phẩm + Freeship trọn đời
                </p>
              </div>
            </div>
            <div className="text-right shrink-0">
              <span className="text-sm sm:text-base font-black text-emerald-700 block">
                {formatVND(subscriptionPrice)}
              </span>
              <span className="text-[11px] text-gray-400 line-through">
                {formatVND(basePrice)}
              </span>
            </div>
          </label>

          {/* Khối chọn Chu kỳ (Chỉ hiện khi chọn Giao Định Kỳ) */}
          {isSubscription && (
            <div className="px-4 pb-4 pt-1 border-t border-emerald-100/80 space-y-3 animate-in fade-in-0 duration-150">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-950 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                  Chọn chu kỳ tự động giao:
                </span>
                <span className="text-[11px] text-gray-500">
                  (Đổi chu kỳ hoặc hủy bất cứ lúc nào)
                </span>
              </div>

              {/* 4 Lựa chọn tần suất */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {Object.values(SUBSCRIPTION_CONFIG.FREQUENCIES).map((f) => {
                  const isSelected = frequency === f.key;
                  return (
                    <button
                      key={f.key}
                      type="button"
                      onClick={() =>
                        onFrequencyChange(f.key as SubscriptionFrequencyType)
                      }
                      className={`p-2 rounded-xl text-left border transition-all ${
                        isSelected
                          ? "border-emerald-600 bg-emerald-600 text-white font-bold shadow-xs"
                          : "border-gray-200 bg-white text-gray-700 hover:border-emerald-300"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold">{f.label}</span>
                        {"recommended" in f && Boolean(f.recommended) && (
                          <span
                            className={`text-[9px] px-1 py-0.2 rounded font-bold ${
                              isSelected
                                ? "bg-white text-emerald-800"
                                : "bg-emerald-100 text-emerald-800"
                            }`}
                          >
                            Hot
                          </span>
                        )}
                      </div>
                      <span
                        className={`text-[10px] block mt-0.5 truncate ${
                          isSelected ? "text-emerald-100" : "text-gray-400"
                        }`}
                      >
                        {f.tag}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* 3 Cam kết vàng của Subscribe & Save */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1 text-[11px] text-gray-600">
                <div className="flex items-center gap-1.5">
                  <Truck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Miễn phí vận chuyển toàn quốc</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Tạm dừng hoặc hủy 1-chạm</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Cam kết chuẩn Air-Cargo date mới</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
