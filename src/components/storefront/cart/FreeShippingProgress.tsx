"use client";

import { Truck, CheckCircle2 } from "lucide-react";
import { formatVND } from "@/lib/utils";

interface FreeShippingProgressProps {
  subtotal: number;
  freeShippingThreshold?: number; // Mặc định 500.000₫
}

export function FreeShippingProgress({
  subtotal,
  freeShippingThreshold = 500000,
}: FreeShippingProgressProps) {
  const isQualified = subtotal >= freeShippingThreshold;
  const remaining = Math.max(0, freeShippingThreshold - subtotal);
  const percent = Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100));

  return (
    <div className="bg-gradient-to-r from-rose-50/80 via-white to-amber-50/60 rounded-2xl border border-rose-100 p-4 mb-6 shadow-2xs">
      <div className="flex items-center gap-2.5 mb-2.5">
        <div
          className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
            isQualified
              ? "bg-emerald-100 text-emerald-700"
              : "bg-rose-100 text-[#800028]"
          }`}
        >
          {isQualified ? (
            <CheckCircle2 className="w-5 h-5" />
          ) : (
            <Truck className="w-4 h-4" />
          )}
        </div>

        <div className="text-xs sm:text-sm text-gray-800 leading-snug">
          {isQualified ? (
            <span className="font-bold text-emerald-800">
              🎉 Chúc mừng! Đơn hàng của bạn đủ điều kiện{" "}
              <span className="text-[#800028] uppercase font-black">
                MIỄN PHÍ VẬN CHUYỂN
              </span>{" "}
              toàn quốc!
            </span>
          ) : (
            <span>
              Mua thêm{" "}
              <strong className="text-[#800028] font-black text-sm">
                {formatVND(remaining)}
              </strong>{" "}
              để được{" "}
              <strong className="text-emerald-700">
                Miễn Phí Vận Chuyển (Freeship)
              </strong>
            </span>
          )}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-gray-200/80 h-2.5 rounded-full overflow-hidden">
        <div
          className={`h-full transition-all duration-500 rounded-full ${
            isQualified
              ? "bg-gradient-to-r from-emerald-500 to-teal-500"
              : "bg-gradient-to-r from-[#800028] to-amber-500"
          }`}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
