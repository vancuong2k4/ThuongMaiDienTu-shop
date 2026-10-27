// ============================================================
// components/storefront/checkout/PaymentMethodSelector.tsx
// Chọn phương thức thanh toán: COD hoặc VietQR
// ============================================================

"use client";

import React from "react";
import { Truck, QrCode, CheckCircle2, ShieldCheck, Zap } from "lucide-react";

export type PaymentMethodType = "COD" | "VIETQR";

interface PaymentMethodSelectorProps {
  value: PaymentMethodType;
  onChange: (method: PaymentMethodType) => void;
  disabled?: boolean;
}

export const PaymentMethodSelector: React.FC<PaymentMethodSelectorProps> = ({
  value,
  onChange,
  disabled = false,
}) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-neutral-800 font-semibold border-b border-neutral-100 pb-2">
        <ShieldCheck className="w-5 h-5 text-[#800028]" />
        <span>Phương thức thanh toán</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {/* VietQR */}
        <label
          onClick={() => !disabled && onChange("VIETQR")}
          className={`relative flex items-start gap-3.5 p-4 rounded-xl border-2 cursor-pointer transition-all ${
            value === "VIETQR"
              ? "border-[#800028] bg-rose-50/30 shadow-sm"
              : "border-neutral-200 hover:border-neutral-300 bg-white"
          } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          <input
            type="radio"
            name="paymentMethod"
            checked={value === "VIETQR"}
            onChange={() => onChange("VIETQR")}
            disabled={disabled}
            className="sr-only"
          />

          <div
            className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
              value === "VIETQR"
                ? "bg-[#800028] text-white"
                : "bg-neutral-100 text-neutral-600"
            }`}
          >
            <QrCode className="w-5 h-5" />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-semibold text-sm text-neutral-900">
                Chuyển khoản VietQR 24/7
              </span>
              <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                <Zap className="w-2.5 h-2.5 fill-amber-500" /> Nhanh & Tiện
              </span>
            </div>
            <p className="text-xs text-neutral-500 leading-relaxed">
              Quét mã QR tự động điền thông tin và số tiền từ bất kỳ app ngân hàng nào (MB, Vietcombank, Techcombank, BIDV...).
            </p>
          </div>

          <div
            className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 ${
              value === "VIETQR"
                ? "border-[#800028] bg-[#800028]"
                : "border-neutral-300 bg-white"
            }`}
          >
            {value === "VIETQR" && (
              <CheckCircle2 className="w-4 h-4 text-white fill-white" />
            )}
          </div>
        </label>

        {/* COD */}
        <label
          onClick={() => !disabled && onChange("COD")}
          className={`relative flex items-start gap-3.5 p-4 rounded-xl border-2 cursor-pointer transition-all ${
            value === "COD"
              ? "border-[#800028] bg-rose-50/30 shadow-sm"
              : "border-neutral-200 hover:border-neutral-300 bg-white"
          } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          <input
            type="radio"
            name="paymentMethod"
            checked={value === "COD"}
            onChange={() => onChange("COD")}
            disabled={disabled}
            className="sr-only"
          />

          <div
            className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
              value === "COD"
                ? "bg-[#800028] text-white"
                : "bg-neutral-100 text-neutral-600"
            }`}
          >
            <Truck className="w-5 h-5" />
          </div>

          <div className="flex-1 min-w-0">
            <div className="font-semibold text-sm text-neutral-900 mb-1">
              Thanh toán khi nhận hàng (COD)
            </div>
            <p className="text-xs text-neutral-500 leading-relaxed">
              Kiểm tra hàng đồng kiểm trước khi thanh toán. Trả tiền mặt trực tiếp cho shipper khi nhận kiện hàng.
            </p>
          </div>

          <div
            className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 ${
              value === "COD"
                ? "border-[#800028] bg-[#800028]"
                : "border-neutral-300 bg-white"
            }`}
          >
            {value === "COD" && (
              <CheckCircle2 className="w-4 h-4 text-white fill-white" />
            )}
          </div>
        </label>
      </div>
    </div>
  );
};
