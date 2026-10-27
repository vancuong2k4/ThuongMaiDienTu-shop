// ============================================================
// components/storefront/checkout/AddressSelector.tsx
// Chọn Tỉnh/Thành, Quận/Huyện, Phường/Xã chuẩn Việt Nam
// ============================================================

"use client";

import React, { useMemo } from "react";
import { VIETNAM_PROVINCES } from "@/data/vietnam-locations";
import { MapPin } from "lucide-react";

interface AddressSelectorProps {
  province: string;
  district: string;
  ward: string;
  addressDetail: string;
  onProvinceChange: (province: string) => void;
  onDistrictChange: (district: string) => void;
  onWardChange: (ward: string) => void;
  onAddressDetailChange: (addressDetail: string) => void;
  disabled?: boolean;
}

export const AddressSelector: React.FC<AddressSelectorProps> = ({
  province,
  district,
  ward,
  addressDetail,
  onProvinceChange,
  onDistrictChange,
  onWardChange,
  onAddressDetailChange,
  disabled = false,
}) => {
  // Lấy danh sách quận/huyện dựa theo tỉnh được chọn
  const districts = useMemo(() => {
    if (!province) return [];
    const found = VIETNAM_PROVINCES.find((p) => p.name === province);
    return found ? found.districts : [];
  }, [province]);

  // Lấy danh sách phường/xã dựa theo quận được chọn
  const wards = useMemo(() => {
    if (!district || !districts.length) return [];
    const found = districts.find((d) => d.name === district);
    return found ? found.wards : [];
  }, [district, districts]);

  const handleSelectProvince = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newProv = e.target.value;
    onProvinceChange(newProv);
    onDistrictChange("");
    onWardChange("");
  };

  const handleSelectDistrict = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newDist = e.target.value;
    onDistrictChange(newDist);
    onWardChange("");
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-neutral-800 font-semibold border-b border-neutral-100 pb-2">
        <MapPin className="w-5 h-5 text-[#800028]" />
        <span>Địa chỉ nhận hàng</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {/* Tỉnh / Thành Phố */}
        <div>
          <label className="block text-xs font-medium text-neutral-700 mb-1">
            Tỉnh / Thành phố <span className="text-red-500">*</span>
          </label>
          <select
            value={province}
            onChange={handleSelectProvince}
            disabled={disabled}
            className="w-full h-11 px-3 text-sm bg-white border border-neutral-300 rounded-lg focus:outline-none focus:border-[#800028] focus:ring-1 focus:ring-[#800028] transition-colors disabled:bg-neutral-100 disabled:cursor-not-allowed"
          >
            <option value="">-- Chọn Tỉnh / Thành phố --</option>
            {VIETNAM_PROVINCES.map((p) => (
              <option key={p.name} value={p.name}>
                {p.name}
              </option>
            ))}
          </select>
        </div>

        {/* Quận / Huyện */}
        <div>
          <label className="block text-xs font-medium text-neutral-700 mb-1">
            Quận / Huyện <span className="text-red-500">*</span>
          </label>
          <select
            value={district}
            onChange={handleSelectDistrict}
            disabled={disabled || !province}
            className="w-full h-11 px-3 text-sm bg-white border border-neutral-300 rounded-lg focus:outline-none focus:border-[#800028] focus:ring-1 focus:ring-[#800028] transition-colors disabled:bg-neutral-100 disabled:cursor-not-allowed"
          >
            <option value="">
              {!province ? "-- Chọn Tỉnh trước --" : "-- Chọn Quận / Huyện --"}
            </option>
            {districts.map((d) => (
              <option key={d.name} value={d.name}>
                {d.name}
              </option>
            ))}
          </select>
        </div>

        {/* Phường / Xã */}
        <div>
          <label className="block text-xs font-medium text-neutral-700 mb-1">
            Phường / Xã <span className="text-red-500">*</span>
          </label>
          <select
            value={ward}
            onChange={(e) => onWardChange(e.target.value)}
            disabled={disabled || !district}
            className="w-full h-11 px-3 text-sm bg-white border border-neutral-300 rounded-lg focus:outline-none focus:border-[#800028] focus:ring-1 focus:ring-[#800028] transition-colors disabled:bg-neutral-100 disabled:cursor-not-allowed"
          >
            <option value="">
              {!district ? "-- Chọn Huyện trước --" : "-- Chọn Phường / Xã --"}
            </option>
            {wards.map((w) => (
              <option key={w} value={w}>
                {w}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Địa chỉ chi tiết (số nhà, đường...) */}
      <div>
        <label className="block text-xs font-medium text-neutral-700 mb-1">
          Số nhà, tên tòa nhà, tên đường <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          placeholder="Ví dụ: Số 24 ngõ 180 đường Hoàng Quốc Việt"
          value={addressDetail}
          onChange={(e) => onAddressDetailChange(e.target.value)}
          disabled={disabled}
          className="w-full h-11 px-3.5 text-sm bg-white border border-neutral-300 rounded-lg focus:outline-none focus:border-[#800028] focus:ring-1 focus:ring-[#800028] transition-colors disabled:bg-neutral-100"
        />
      </div>

      {/* Preview địa chỉ đầy đủ */}
      {(addressDetail || ward || district || province) && (
        <div className="p-3 bg-amber-50/70 border border-amber-200/80 rounded-lg text-xs text-neutral-700 flex items-start gap-2">
          <MapPin className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <span className="font-medium text-neutral-900">Giao tới: </span>
            <span>
              {[addressDetail, ward, district, province]
                .filter(Boolean)
                .join(", ")}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
