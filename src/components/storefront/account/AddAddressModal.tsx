// ============================================================
// components/storefront/account/AddAddressModal.tsx
// Modal thêm mới địa chỉ nhận hàng với dropdown 3 cấp 63 Tỉnh/Thành
// ============================================================

"use client";

import React, { useState, useMemo } from "react";
import { VIETNAM_PROVINCES } from "@/data/vietnam-locations";
import { X, MapPin, Loader2, Check } from "lucide-react";

interface AddAddressModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const AddAddressModal: React.FC<AddAddressModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [province, setProvince] = useState("");
  const [district, setDistrict] = useState("");
  const [ward, setWard] = useState("");
  const [street, setStreet] = useState("");
  const [isDefault, setIsDefault] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const districts = useMemo(() => {
    if (!province) return [];
    const found = VIETNAM_PROVINCES.find((p) => p.name === province);
    return found ? found.districts : [];
  }, [province]);

  const wards = useMemo(() => {
    if (!district || !districts.length) return [];
    const found = districts.find((d) => d.name === district);
    return found ? found.wards : [];
  }, [district, districts]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (!fullName.trim() || !phone.trim() || !province || !district || !ward || !street.trim()) {
      setErrorMsg("Vui lòng điền đầy đủ các thông tin địa chỉ.");
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch("/api/user/addresses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: fullName.trim(),
          phone: phone.trim(),
          province,
          district,
          ward,
          street: street.trim(),
          isDefault,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Không thể lưu địa chỉ.");
      }

      onSuccess();
      onClose();
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : "Đã có lỗi xảy ra");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-neutral-200 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-neutral-100">
          <div className="flex items-center gap-2 text-neutral-900 font-bold text-base">
            <MapPin className="w-5 h-5 text-[#800028]" />
            <span>Thêm địa chỉ giao hàng mới</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {errorMsg && (
            <div className="p-3 bg-red-50 text-red-800 text-xs rounded-xl border border-red-200">
              {errorMsg}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">
                Tên người nhận <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Nguyễn Văn A"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                className="w-full h-10 px-3 text-xs bg-white border border-neutral-300 rounded-lg focus:outline-none focus:border-[#800028]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">
                Số điện thoại <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                placeholder="0912345678"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                className="w-full h-10 px-3 text-xs bg-white border border-neutral-300 rounded-lg focus:outline-none focus:border-[#800028]"
              />
            </div>
          </div>

          {/* 3 Cấp Tỉnh / Huyện / Xã */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">
                Tỉnh / Thành <span className="text-red-500">*</span>
              </label>
              <select
                value={province}
                onChange={(e) => {
                  setProvince(e.target.value);
                  setDistrict("");
                  setWard("");
                }}
                required
                className="w-full h-10 px-2 text-xs bg-white border border-neutral-300 rounded-lg focus:outline-none focus:border-[#800028]"
              >
                <option value="">-- Chọn Tỉnh --</option>
                {VIETNAM_PROVINCES.map((p) => (
                  <option key={p.name} value={p.name}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">
                Quận / Huyện <span className="text-red-500">*</span>
              </label>
              <select
                value={district}
                onChange={(e) => {
                  setDistrict(e.target.value);
                  setWard("");
                }}
                disabled={!province}
                required
                className="w-full h-10 px-2 text-xs bg-white border border-neutral-300 rounded-lg focus:outline-none focus:border-[#800028] disabled:bg-neutral-100"
              >
                <option value="">-- Chọn Huyện --</option>
                {districts.map((d) => (
                  <option key={d.name} value={d.name}>
                    {d.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">
                Phường / Xã <span className="text-red-500">*</span>
              </label>
              <select
                value={ward}
                onChange={(e) => setWard(e.target.value)}
                disabled={!district}
                required
                className="w-full h-10 px-2 text-xs bg-white border border-neutral-300 rounded-lg focus:outline-none focus:border-[#800028] disabled:bg-neutral-100"
              >
                <option value="">-- Chọn Xã --</option>
                {wards.map((w) => (
                  <option key={w} value={w}>
                    {w}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Đường / số nhà */}
          <div>
            <label className="block text-xs font-semibold text-neutral-700 mb-1">
              Địa chỉ cụ thể (Số nhà, ngõ, đường) <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="Ví dụ: Số 123 ngõ 45 đường Cầu Giấy"
              value={street}
              onChange={(e) => setStreet(e.target.value)}
              required
              className="w-full h-10 px-3 text-xs bg-white border border-neutral-300 rounded-lg focus:outline-none focus:border-[#800028]"
            />
          </div>

          {/* Đặt làm mặc định */}
          <label className="flex items-center gap-2 pt-1 cursor-pointer">
            <input
              type="checkbox"
              checked={isDefault}
              onChange={(e) => setIsDefault(e.target.checked)}
              className="rounded text-[#800028] focus:ring-[#800028] w-4 h-4"
            />
            <span className="text-xs text-neutral-700 font-medium">
              Đặt làm địa chỉ nhận hàng mặc định
            </span>
          </label>

          {/* Buttons */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-neutral-100">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="px-4 py-2 text-xs font-semibold text-neutral-600 hover:bg-neutral-100 rounded-lg transition-colors"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-5 py-2 text-xs font-bold text-white bg-[#800028] hover:bg-[#60001e] rounded-lg transition-colors flex items-center gap-1.5 shadow-sm disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Đang lưu...</span>
                </>
              ) : (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Lưu địa chỉ</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
