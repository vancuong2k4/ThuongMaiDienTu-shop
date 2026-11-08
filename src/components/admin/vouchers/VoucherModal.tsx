"use client";

// ============================================================
// components/admin/vouchers/VoucherModal.tsx
// Modal Tạo Mới & Chỉnh Sửa Mã Giảm Giá
// ============================================================

import React, { useState, useEffect } from "react";
import {
  X,
  Plus,
  Percent,
  DollarSign,
  Truck,
  Shuffle,
  Calendar,
  AlertCircle,
  Loader2,
  CheckCircle2,
} from "lucide-react";
import type { VoucherItem, VoucherType } from "./types";

interface VoucherModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  initialData?: VoucherItem | null;
}

export const VoucherModal: React.FC<VoucherModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  initialData,
}) => {
  const isEditing = Boolean(initialData);

  // Form states
  const [code, setCode] = useState("");
  const [type, setType] = useState<VoucherType>("PERCENTAGE");
  const [value, setValue] = useState<number | string>(10);
  const [minOrderAmount, setMinOrderAmount] = useState<number | string>(0);
  const [maxDiscount, setMaxDiscount] = useState<number | string>("");
  const [usageLimit, setUsageLimit] = useState<number | string>("");
  const [userLimit, setUserLimit] = useState<number | string>(1);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isActive, setIsActive] = useState(true);

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Convert Date to YYYY-MM-DDTHH:mm for datetime-local input
  const toLocalISOString = (d: Date) => {
    const tzOffset = d.getTimezoneOffset() * 60000;
    const localTime = new Date(d.getTime() - tzOffset);
    return localTime.toISOString().slice(0, 16);
  };

  useEffect(() => {
    if (!isOpen) return;

    if (initialData) {
      setCode(initialData.code);
      setType(initialData.type);
      setValue(initialData.value);
      setMinOrderAmount(initialData.minOrderAmount ?? 0);
      setMaxDiscount(initialData.maxDiscount ?? "");
      setUsageLimit(initialData.usageLimit ?? "");
      setUserLimit(initialData.userLimit ?? 1);
      setStartDate(toLocalISOString(new Date(initialData.startDate)));
      setEndDate(toLocalISOString(new Date(initialData.endDate)));
      setIsActive(initialData.isActive);
    } else {
      // Default dates: start now, end 30 days later
      const now = new Date();
      const nextMonth = new Date();
      nextMonth.setDate(now.getDate() + 30);

      setCode("");
      setType("PERCENTAGE");
      setValue(10);
      setMinOrderAmount(300000);
      setMaxDiscount(100000);
      setUsageLimit(200);
      setUserLimit(1);
      setStartDate(toLocalISOString(now));
      setEndDate(toLocalISOString(nextMonth));
      setIsActive(true);
    }
    setErrorMessage(null);
  }, [isOpen, initialData]);

  if (!isOpen) return null;

  // Generate random code (e.g. TN-SALE20, TN-FLASH50, TN-VIP8X)
  const generateRandomCode = () => {
    const prefixes = ["TN", "THUYNGA", "SALE", "VIP", "OFFER", "DEAL"];
    const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    let suffix = "";
    for (let i = 0; i < 4; i++) {
      suffix += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setCode(`${prefix}-${suffix}`);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const cleanCode = code.trim().toUpperCase();
    if (!cleanCode) {
      setErrorMessage("Vui lòng nhập mã voucher");
      return;
    }

    const numValue = Number(value);
    if (isNaN(numValue) || numValue <= 0) {
      setErrorMessage("Giá trị giảm phải là số dương lớn hơn 0");
      return;
    }

    if (type === "PERCENTAGE" && numValue > 100) {
      setErrorMessage("Giảm theo % không được vượt quá 100%");
      return;
    }

    if (!startDate || !endDate) {
      setErrorMessage("Vui lòng chọn thời gian bắt đầu và kết thúc");
      return;
    }

    const startMs = new Date(startDate).getTime();
    const endMs = new Date(endDate).getTime();
    if (endMs < startMs) {
      setErrorMessage("Ngày kết thúc phải sau hoặc bằng ngày bắt đầu");
      return;
    }

    const payload = {
      code: cleanCode,
      type,
      value: numValue,
      minOrderAmount: minOrderAmount ? Number(minOrderAmount) : null,
      maxDiscount: type === "PERCENTAGE" && maxDiscount ? Number(maxDiscount) : null,
      usageLimit: usageLimit ? Number(usageLimit) : null,
      userLimit: Number(userLimit) || 1,
      startDate: new Date(startDate).toISOString(),
      endDate: new Date(endDate).toISOString(),
      isActive,
    };

    try {
      setLoading(true);
      const url = isEditing
        ? `/api/admin/vouchers/${initialData!.id}`
        : `/api/admin/vouchers`;
      const method = isEditing ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Thao tác thất bại");
      }

      onSuccess();
      onClose();
    } catch (err: any) {
      setErrorMessage(err.message || "Đã xảy ra lỗi");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xl w-full max-w-2xl my-8 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-rose-50 text-[#800028] flex items-center justify-center">
              <Plus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-800">
                {isEditing ? `Chỉnh Sửa Voucher "${initialData?.code}"` : "Tạo Mã Giảm Giá Mới"}
              </h3>
              <p className="text-xs text-slate-500">
                Cấu hình thông tin mã ưu đãi, điều kiện đơn & thời hạn áp dụng
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="mx-6 mt-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            <span className="font-semibold">{errorMessage}</span>
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* 1. Mã Voucher & Generator */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Mã Voucher <span className="text-rose-500">*</span>
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="VD: THUYNGA10, VIP200K"
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                className="flex-1 px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-sm font-mono font-bold tracking-wider text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#800028]/20 focus:border-[#800028] transition-all"
                required
              />
              <button
                type="button"
                onClick={generateRandomCode}
                className="inline-flex items-center gap-1.5 px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-100 hover:bg-slate-200/80 text-xs font-bold text-slate-700 transition-all shrink-0"
                title="Tạo mã ngẫu nhiên"
              >
                <Shuffle className="w-3.5 h-3.5" />
                <span>Tạo ngẫu nhiên</span>
              </button>
            </div>
            <p className="mt-1 text-[11px] text-slate-400">
              Mã in hoa, không dấu, từ 3-30 ký tự (chữ cái, chữ số, gạch nối).
            </p>
          </div>

          {/* 2. Loại Voucher */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Hình thức chiết khấu <span className="text-rose-500">*</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {/* Type: PERCENTAGE */}
              <button
                type="button"
                onClick={() => {
                  setType("PERCENTAGE");
                  if (Number(value) > 100) setValue(10);
                }}
                className={`p-3 rounded-xl border text-left transition-all flex flex-col gap-1 ${
                  type === "PERCENTAGE"
                    ? "border-[#800028] bg-rose-50/50 ring-1 ring-[#800028]"
                    : "border-slate-200 hover:border-slate-300 bg-white"
                }`}
              >
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
                  <Percent className="w-4 h-4 text-[#800028]" />
                  <span>Giảm theo %</span>
                </div>
                <p className="text-[11px] text-slate-500">
                  Giảm % giá trị đơn, có mức chặn tối đa
                </p>
              </button>

              {/* Type: FIXED */}
              <button
                type="button"
                onClick={() => {
                  setType("FIXED");
                  if (Number(value) <= 100) setValue(50000);
                }}
                className={`p-3 rounded-xl border text-left transition-all flex flex-col gap-1 ${
                  type === "FIXED"
                    ? "border-[#800028] bg-rose-50/50 ring-1 ring-[#800028]"
                    : "border-slate-200 hover:border-slate-300 bg-white"
                }`}
              >
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
                  <DollarSign className="w-4 h-4 text-indigo-600" />
                  <span>Giảm tiền mặt</span>
                </div>
                <p className="text-[11px] text-slate-500">
                  Trừ thẳng số tiền cố định (VD: 50.000₫)
                </p>
              </button>

              {/* Type: FREE_SHIP */}
              <button
                type="button"
                onClick={() => {
                  setType("FREE_SHIP");
                  setValue(30000);
                }}
                className={`p-3 rounded-xl border text-left transition-all flex flex-col gap-1 ${
                  type === "FREE_SHIP"
                    ? "border-[#800028] bg-rose-50/50 ring-1 ring-[#800028]"
                    : "border-slate-200 hover:border-slate-300 bg-white"
                }`}
              >
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
                  <Truck className="w-4 h-4 text-emerald-600" />
                  <span>Miễn phí vận chuyển</span>
                </div>
                <p className="text-[11px] text-slate-500">
                  Tài trợ phí ship tiêu chuẩn (30.000₫)
                </p>
              </button>
            </div>
          </div>

          {/* 3. Giá trị giảm & Mức tối đa */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                {type === "PERCENTAGE"
                  ? "Phần trăm giảm (%)"
                  : type === "FIXED"
                  ? "Số tiền giảm (₫)"
                  : "Mức phí ship tối đa được giảm (₫)"}{" "}
                <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="number"
                  min={1}
                  max={type === "PERCENTAGE" ? 100 : undefined}
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#800028]/20 focus:border-[#800028] transition-all"
                  required
                />
                <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                  {type === "PERCENTAGE" ? "%" : "₫"}
                </span>
              </div>
            </div>

            {type === "PERCENTAGE" ? (
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Mức giảm tối đa (₫)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min={0}
                    step={1000}
                    placeholder="VD: 150000"
                    value={maxDiscount}
                    onChange={(e) => setMaxDiscount(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#800028]/20 focus:border-[#800028] transition-all"
                  />
                  <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                    ₫
                  </span>
                </div>
                <p className="mt-1 text-[11px] text-slate-400">
                  Để trống nếu không giới hạn số tiền giảm
                </p>
              </div>
            ) : (
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Đơn hàng tối thiểu (₫)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min={0}
                    step={1000}
                    placeholder="VD: 500000"
                    value={minOrderAmount}
                    onChange={(e) => setMinOrderAmount(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#800028]/20 focus:border-[#800028] transition-all"
                  />
                  <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                    ₫
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* 4. Ràng buộc đơn hàng & Lượt dùng */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {type === "PERCENTAGE" && (
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Đơn hàng tối thiểu (₫)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min={0}
                    step={1000}
                    placeholder="VD: 500000"
                    value={minOrderAmount}
                    onChange={(e) => setMinOrderAmount(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#800028]/20 focus:border-[#800028] transition-all"
                  />
                  <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                    ₫
                  </span>
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Tổng lượt dùng tối đa
              </label>
              <input
                type="number"
                min={1}
                placeholder="VD: 500 (Để trống = vô hạn)"
                value={usageLimit}
                onChange={(e) => setUsageLimit(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#800028]/20 focus:border-[#800028] transition-all"
              />
              <p className="mt-1 text-[11px] text-slate-400">
                Để trống nếu không giới hạn số lượt
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Giới hạn / Khách hàng <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                min={1}
                value={userLimit}
                onChange={(e) => setUserLimit(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#800028]/20 focus:border-[#800028] transition-all"
                required
              />
              <p className="mt-1 text-[11px] text-slate-400">
                Mặc định mỗi khách dùng 1 lần
              </p>
            </div>
          </div>

          {/* 5. Thời gian bắt đầu & kết thúc */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Thời gian bắt đầu <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="datetime-local"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#800028]/20 focus:border-[#800028] transition-all"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Thời gian kết thúc <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="datetime-local"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#800028]/20 focus:border-[#800028] transition-all"
                  required
                />
              </div>
            </div>
          </div>

          {/* 6. Công tắc Kích hoạt */}
          <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
            <div>
              <span className="text-xs font-bold text-slate-800">
                Kích hoạt chương trình ngay
              </span>
              <p className="text-[11px] text-slate-500">
                Khách hàng có thể áp dụng mã này khi đủ điều kiện
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsActive(!isActive)}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-[#800028]/20 ${
                isActive ? "bg-[#800028]" : "bg-slate-300"
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                  isActive ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
          </div>

          {/* Modal Footer */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              disabled={loading}
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-bold transition-all"
            >
              Hủy bỏ
            </button>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#800028] hover:bg-[#680020] text-white text-xs font-bold shadow-xs hover:shadow-md transition-all disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Đang lưu...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{isEditing ? "Cập Nhật Voucher" : "Tạo Voucher"}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
