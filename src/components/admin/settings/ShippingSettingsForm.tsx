"use client";

// ============================================================
// components/admin/settings/ShippingSettingsForm.tsx
// Form Cấu Hình Phí Vận Chuyển & Ngưỡng Freeship
// ============================================================

import React, { useState } from "react";
import {
  Truck,
  DollarSign,
  Gift,
  Clock,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ShieldCheck,
} from "lucide-react";
import type { ShippingConfigValues } from "./types";

interface ShippingSettingsFormProps {
  initialData: ShippingConfigValues;
  onSave: (data: ShippingConfigValues) => Promise<void>;
}

export const ShippingSettingsForm: React.FC<ShippingSettingsFormProps> = ({
  initialData,
  onSave,
}) => {
  const [formData, setFormData] = useState<ShippingConfigValues>(initialData);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleChange = (
    field: keyof ShippingConfigValues,
    value: string | number
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setSavedSuccess(false);
    setErrorMsg(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      setErrorMsg(null);
      await onSave({
        standardFee: Number(formData.standardFee) || 0,
        freeShippingThreshold: Number(formData.freeShippingThreshold) || 0,
        deliveryTime: formData.deliveryTime.trim(),
      });
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err: any) {
      setErrorMsg(err.message || "Không thể lưu cấu hình vận chuyển");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {savedSuccess && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Đã lưu cấu hình vận chuyển thành công!</span>
        </div>
      )}

      {errorMsg && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-5">
        <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2 border-b border-slate-100 pb-3">
          <Truck className="w-4 h-4 text-[#800028]" />
          <span>Chính Sách Phí Giao Hàng & Miễn Phí Vận Chuyển (Freeship)</span>
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Phí ship chuẩn */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Phí Giao Hàng Tiêu Chuẩn (₫) <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <input
                type="number"
                min={0}
                step={1000}
                value={formData.standardFee}
                onChange={(e) => handleChange("standardFee", e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#800028]/20 focus:border-[#800028] transition-all"
                required
              />
              <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                ₫
              </span>
            </div>
            <p className="mt-1 text-[11px] text-slate-400">
              Áp dụng mặc định cho các đơn hàng chưa đạt mức miễn phí vận chuyển
            </p>
          </div>

          {/* Ngưỡng Freeship */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Ngưỡng Đơn Hàng Miễn Phí Freeship (₫) <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <input
                type="number"
                min={0}
                step={1000}
                value={formData.freeShippingThreshold}
                onChange={(e) => handleChange("freeShippingThreshold", e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-sm font-bold text-[#800028] focus:outline-none focus:ring-2 focus:ring-[#800028]/20 focus:border-[#800028] transition-all"
                required
              />
              <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                ₫
              </span>
            </div>
            <p className="mt-1 text-[11px] text-slate-400">
              Đơn hàng có tổng tiền từ mức này trở lên sẽ được tự động miễn phí vận chuyển
            </p>
          </div>
        </div>

        {/* Thời gian cam kết giao hàng */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            Thời Gian Giao Hàng & Cam Kết Air Cargo <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            value={formData.deliveryTime}
            onChange={(e) => handleChange("deliveryTime", e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#800028]/20 focus:border-[#800028] transition-all"
            required
          />
          <p className="mt-1 text-[11px] text-slate-400">
            Hiển thị tại trang giỏ hàng, trang thanh toán và chân trang website
          </p>
        </div>

        <div className="p-3.5 rounded-xl bg-blue-50/60 border border-blue-100 text-xs text-blue-800 flex items-start gap-2">
          <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
          <span>
            Thanh tiến trình Freeship (**Free Shipping Progress Bar**) tại trang giỏ hàng `/gio-hang` sẽ tự động cập nhật theo giá trị ngưỡng này để kích thích khách hàng mua thêm đạt mốc.
          </span>
        </div>
      </div>

      <div className="flex items-center justify-end gap-3 pt-2">
        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#800028] hover:bg-[#680020] text-white text-xs font-bold shadow-xs hover:shadow-md transition-all active:scale-[0.98] disabled:opacity-50"
        >
          {saving ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Đang lưu...</span>
            </>
          ) : (
            <>
              <CheckCircle2 className="w-4 h-4" />
              <span>Lưu Cấu Hình Vận Chuyển</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
};
