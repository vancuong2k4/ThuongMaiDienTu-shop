"use client";

// ============================================================
// components/admin/flights/CreateFlightModal.tsx
// Modal Thêm Mới Chuyến Bay Air Cargo & Thiết Lập Chuỗi Lạnh
// ============================================================

import React, { useState } from "react";
import {
  X,
  Plane,
  Calendar,
  Thermometer,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";
import type { ColdChainCategoryType } from "./types";

interface CreateFlightModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const CreateFlightModal: React.FC<CreateFlightModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form State
  const [flightNumber, setFlightNumber] = useState("");
  const [carrier, setCarrier] = useState<"VIETNAM_AIRLINES" | "QANTAS_FREIGHT">(
    "VIETNAM_AIRLINES"
  );
  const [aircraftType, setAircraftType] = useState("Boeing 787-9 Dreamliner");
  const [originAirport, setOriginAirport] = useState("MEL");
  const [originCity, setOriginCity] = useState("Melbourne, Úc");
  const [destAirport, setDestAirport] = useState("HAN");
  const [destCity, setDestCity] = useState("Hà Nội, Việt Nam");

  const now = new Date();
  const future = new Date(now.getTime() + 9 * 60 * 60 * 1000);
  const toLocalISO = (d: Date) => d.toISOString().slice(0, 16);

  const [scheduledDeparture, setScheduledDeparture] = useState(toLocalISO(now));
  const [scheduledArrival, setScheduledArrival] = useState(toLocalISO(future));
  const [flightDurationMinutes, setFlightDurationMinutes] = useState(540);

  const [coldChainCategory, setColdChainCategory] =
    useState<ColdChainCategoryType>("ULTRA_COLD_CHERRY");
  const [targetTempMin, setTargetTempMin] = useState(0.0);
  const [targetTempMax, setTargetTempMax] = useState(4.0);
  const [totalCargoWeightKg, setTotalCargoWeightKg] = useState(15000);
  const [cargoManifestSummary, setCargoManifestSummary] = useState(
    "Cherry tươi Tasmania bay Air 24h & Sữa bột Aptamil Profutura Úc"
  );

  if (!isOpen) return null;

  const handleCategoryChange = (cat: ColdChainCategoryType) => {
    setColdChainCategory(cat);
    if (cat === "ULTRA_COLD_CHERRY") {
      setTargetTempMin(0.0);
      setTargetTempMax(4.0);
    } else if (cat === "COOL_PROBIOTICS") {
      setTargetTempMin(2.0);
      setTargetTempMax(8.0);
    } else {
      setTargetTempMin(18.0);
      setTargetTempMax(24.0);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const payload = {
        flightNumber: flightNumber.trim().toUpperCase(),
        aircraftType: aircraftType.trim(),
        carrier,
        originAirport: originAirport.trim().toUpperCase(),
        originCity: originCity.trim(),
        destAirport: destAirport.trim().toUpperCase(),
        destCity: destCity.trim(),
        scheduledDeparture: new Date(scheduledDeparture).toISOString(),
        scheduledArrival: new Date(scheduledArrival).toISOString(),
        flightDurationMinutes: Number(flightDurationMinutes),
        coldChainCategory,
        targetTempMin: Number(targetTempMin),
        targetTempMax: Number(targetTempMax),
        totalCargoWeightKg: Number(totalCargoWeightKg),
        cargoManifestSummary: cargoManifestSummary.trim() || undefined,
      };

      const res = await fetch("/api/admin/air-cargo/flights", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        setError(json.message || "Không thể tạo chuyến bay.");
        return;
      }

      onSuccess();
      onClose();
    } catch {
      setError("Lỗi kết nối máy chủ khi tạo chuyến bay.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-slate-900 to-[#800028] text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center">
              <Plane className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <h3 className="font-black text-sm tracking-wide uppercase">
                Khởi Tạo Chuyến Bay Air Cargo Úc
              </h3>
              <p className="text-[11px] text-slate-300">
                Kích hoạt radar GPS và chuẩn hóa giám sát chuỗi lạnh Cold-Chain
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 overflow-y-auto space-y-4 text-xs">
          {error && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 font-medium">
              {error}
            </div>
          )}

          {/* Group 1: Thông tin chuyến bay & Hãng */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="font-bold text-slate-700 block mb-1">
                Số hiệu chuyến bay <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="VD: VN780, QF7561"
                value={flightNumber}
                onChange={(e) => setFlightNumber(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 uppercase font-mono font-bold focus:border-[#800028] outline-hidden"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">
                Hãng hàng không <span className="text-rose-500">*</span>
              </label>
              <select
                value={carrier}
                onChange={(e) =>
                  setCarrier(e.target.value as "VIETNAM_AIRLINES" | "QANTAS_FREIGHT")
                }
                className="w-full px-3 py-2 rounded-xl border border-slate-200 font-semibold focus:border-[#800028] outline-hidden"
              >
                <option value="VIETNAM_AIRLINES">Vietnam Airlines Cargo 🇻🇳</option>
                <option value="QANTAS_FREIGHT">Qantas Freight 🇦🇺</option>
              </select>
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">
                Dòng tàu bay <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="VD: Boeing 787-9 Dreamliner"
                value={aircraftType}
                onChange={(e) => setAircraftType(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-[#800028] outline-hidden"
              />
            </div>
          </div>

          {/* Group 2: Sân bay xuất phát & Hạ cánh */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 bg-slate-50/80 rounded-2xl border border-slate-200/80">
            {/* Origin */}
            <div className="space-y-2">
              <span className="font-black text-slate-600 uppercase tracking-wider text-[10px]">
                Sân bay cất cánh (Úc)
              </span>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] text-slate-500 block mb-0.5">
                    Mã IATA (VD: MEL, SYD)
                  </label>
                  <input
                    type="text"
                    required
                    value={originAirport}
                    onChange={(e) => setOriginAirport(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 font-mono font-bold uppercase focus:border-[#800028] outline-hidden"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-slate-500 block mb-0.5">
                    Thành phố
                  </label>
                  <input
                    type="text"
                    required
                    value={originCity}
                    onChange={(e) => setOriginCity(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 focus:border-[#800028] outline-hidden"
                  />
                </div>
              </div>
            </div>

            {/* Destination */}
            <div className="space-y-2">
              <span className="font-black text-slate-600 uppercase tracking-wider text-[10px]">
                Sân bay hạ cánh (Việt Nam)
              </span>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] text-slate-500 block mb-0.5">
                    Mã IATA (VD: HAN, SGN)
                  </label>
                  <input
                    type="text"
                    required
                    value={destAirport}
                    onChange={(e) => setDestAirport(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 font-mono font-bold uppercase focus:border-[#800028] outline-hidden"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-slate-500 block mb-0.5">
                    Thành phố
                  </label>
                  <input
                    type="text"
                    required
                    value={destCity}
                    onChange={(e) => setDestCity(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 focus:border-[#800028] outline-hidden"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Group 3: Giờ bay & Thời lượng */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="font-bold text-slate-700 block mb-1">
                Giờ cất cánh dự kiến <span className="text-rose-500">*</span>
              </label>
              <input
                type="datetime-local"
                required
                value={scheduledDeparture}
                onChange={(e) => setScheduledDeparture(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 font-mono focus:border-[#800028] outline-hidden"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">
                Giờ hạ cánh dự kiến <span className="text-rose-500">*</span>
              </label>
              <input
                type="datetime-local"
                required
                value={scheduledArrival}
                onChange={(e) => setScheduledArrival(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 font-mono focus:border-[#800028] outline-hidden"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">
                Thời lượng bay (phút)
              </label>
              <input
                type="number"
                min="60"
                max="1440"
                value={flightDurationMinutes}
                onChange={(e) => setFlightDurationMinutes(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 font-mono focus:border-[#800028] outline-hidden"
              />
            </div>
          </div>

          {/* Group 4: Chuỗi Lạnh Cold-Chain */}
          <div className="p-3.5 bg-sky-50/50 rounded-2xl border border-sky-200/80 space-y-3">
            <div className="flex items-center gap-1.5 font-bold text-sky-900 text-xs">
              <Thermometer className="w-4 h-4 text-sky-600" />
              <span>Tiêu Chuẩn Giám Sát Chuỗi Lạnh Cold-Chain</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Nhóm mặt hàng
                </label>
                <select
                  value={coldChainCategory}
                  onChange={(e) =>
                    handleCategoryChange(e.target.value as ColdChainCategoryType)
                  }
                  className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white font-semibold focus:border-[#800028] outline-hidden"
                >
                  <option value="ULTRA_COLD_CHERRY">Cherry tươi Úc (0°C - 4°C)</option>
                  <option value="COOL_PROBIOTICS">Men sống Probiotics (2°C - 8°C)</option>
                  <option value="CONTROLLED_AMBIENT">Sữa Aptamil & TPCN (18°C - 24°C)</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Nhiệt độ tối thiểu (°C)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={targetTempMin}
                  onChange={(e) => setTargetTempMin(Number(e.target.value))}
                  className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white font-mono font-bold focus:border-[#800028] outline-hidden"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Nhiệt độ tối đa (°C)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={targetTempMax}
                  onChange={(e) => setTargetTempMax(Number(e.target.value))}
                  className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white font-mono font-bold focus:border-[#800028] outline-hidden"
                />
              </div>
            </div>
          </div>

          {/* Group 5: Manifest & Trọng lượng */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="font-bold text-slate-700 block mb-1">
                Tổng trọng lượng kiện (kg)
              </label>
              <input
                type="number"
                min="0"
                step="100"
                value={totalCargoWeightKg}
                onChange={(e) => setTotalCargoWeightKg(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 font-mono focus:border-[#800028] outline-hidden"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="font-bold text-slate-700 block mb-1">
                Tóm tắt bản kê hàng hóa (Manifest)
              </label>
              <input
                type="text"
                value={cargoManifestSummary}
                onChange={(e) => setCargoManifestSummary(e.target.value)}
                placeholder="VD: 500 thùng Cherry Tasmania, 1200 lon Aptamil Profutura"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-[#800028] outline-hidden"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 rounded-xl border border-slate-300 font-bold text-slate-600 hover:bg-slate-50 transition-colors"
            >
              Hủy bỏ
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 rounded-xl bg-[#800028] hover:bg-[#660020] text-white font-black shadow-md transition-colors flex items-center gap-1.5 disabled:opacity-50"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{loading ? "Đang khởi tạo..." : "Khởi Tạo Chuyến Bay"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
