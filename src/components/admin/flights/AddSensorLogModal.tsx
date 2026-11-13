"use client";

// ============================================================
// components/admin/flights/AddSensorLogModal.tsx
// Modal Ghi Nhận Dữ Liệu Cảm Biến Chuỗi Lạnh Cold-Chain IoT
// ============================================================

import React, { useState, useEffect } from "react";
import {
  X,
  Thermometer,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Battery,
} from "lucide-react";
import type { AdminFlightItem, SensorAlertLevelType } from "./types";

interface AddSensorLogModalProps {
  flight: AdminFlightItem | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const AddSensorLogModal: React.FC<AddSensorLogModalProps> = ({
  flight,
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form State
  const [sensorId, setSensorId] = useState("TEMPTALE-AUS-01");
  const [temperatureCelsius, setTemperatureCelsius] = useState("2.2");
  const [humidityPercent, setHumidityPercent] = useState("88");
  const [batteryPercent, setBatteryPercent] = useState("98");
  const [stageName, setStageName] = useState(
    "Khoang hàng lạnh máy bay lúc bay hành trình FL360"
  );
  const [alertLevel, setAlertLevel] =
    useState<SensorAlertLevelType>("NORMAL");

  const toLocalISO = (d: Date) => d.toISOString().slice(0, 16);
  const [recordedAt, setRecordedAt] = useState(toLocalISO(new Date()));

  useEffect(() => {
    if (flight) {
      if (flight.coldChainCategory === "ULTRA_COLD_CHERRY") {
        setTemperatureCelsius("2.1");
      } else if (flight.coldChainCategory === "COOL_PROBIOTICS") {
        setTemperatureCelsius("4.5");
      } else {
        setTemperatureCelsius("21.5");
      }
    }
  }, [flight]);

  if (!isOpen || !flight) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const payload = {
        flightId: flight.id,
        sensorId: sensorId.trim().toUpperCase(),
        recordedAt: new Date(recordedAt).toISOString(),
        temperatureCelsius: parseFloat(temperatureCelsius),
        humidityPercent: humidityPercent ? parseFloat(humidityPercent) : undefined,
        batteryPercent: batteryPercent ? parseInt(batteryPercent) : 100,
        alertLevel,
        stageName: stageName.trim(),
      };

      const res = await fetch("/api/admin/air-cargo/sensor-logs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        setError(json.message || "Không thể lưu dữ liệu cảm biến.");
        return;
      }

      onSuccess();
      onClose();
    } catch {
      setError("Lỗi kết nối máy chủ khi lưu dữ liệu cảm biến.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-slate-900 to-sky-950 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-sky-500/20 text-sky-400 flex items-center justify-center">
              <Thermometer className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-black text-sm tracking-wide uppercase">
                Ghi Nhận Nhiệt Độ Cảm Biến IoT
              </h3>
              <p className="text-[11px] text-slate-300">
                Chuyến bay: <strong className="text-amber-300 font-mono">{flight.flightNumber}</strong> ({flight.originAirport} ➔ {flight.destAirport})
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
        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
          {error && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 font-medium">
              {error}
            </div>
          )}

          {/* Target temp range banner */}
          <div className="p-3 rounded-xl bg-sky-50 border border-sky-200 text-sky-900 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-sky-600" />
              <span>Dải nhiệt độ kiểm soát:</span>
            </div>
            <span className="font-mono font-bold text-sky-800">
              {flight.targetTempMin}°C — {flight.targetTempMax}°C
            </span>
          </div>

          {/* Sensor ID & Recorded At */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-slate-700 block mb-1">
                Mã cảm biến USB/BLE <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={sensorId}
                onChange={(e) => setSensorId(e.target.value)}
                placeholder="VD: TEMPTALE-AUS-01"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 font-mono font-bold uppercase focus:border-sky-600 outline-hidden"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">
                Thời điểm ghi nhận <span className="text-rose-500">*</span>
              </label>
              <input
                type="datetime-local"
                required
                value={recordedAt}
                onChange={(e) => setRecordedAt(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 font-mono focus:border-sky-600 outline-hidden"
              />
            </div>
          </div>

          {/* Temperature & Humidity & Battery */}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="font-bold text-slate-700 block mb-1">
                Nhiệt độ (°C) <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                step="0.1"
                required
                value={temperatureCelsius}
                onChange={(e) => setTemperatureCelsius(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 font-mono font-black text-sm text-[#800028] focus:border-sky-600 outline-hidden"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">
                Độ ẩm (% RH)
              </label>
              <input
                type="number"
                step="0.5"
                min="0"
                max="100"
                value={humidityPercent}
                onChange={(e) => setHumidityPercent(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 font-mono focus:border-sky-600 outline-hidden"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">
                Pin logger (%)
              </label>
              <input
                type="number"
                min="1"
                max="100"
                value={batteryPercent}
                onChange={(e) => setBatteryPercent(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 font-mono focus:border-sky-600 outline-hidden"
              />
            </div>
          </div>

          {/* Stage name */}
          <div>
            <label className="font-bold text-slate-700 block mb-1">
              Công đoạn / Vị trí kiện hàng <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={stageName}
              onChange={(e) => setStageName(e.target.value)}
              placeholder="VD: Khoang hàng lạnh máy bay lúc bay hành trình FL360"
              className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-sky-600 outline-hidden"
            />
          </div>

          {/* Alert level */}
          <div>
            <label className="font-bold text-slate-700 block mb-1">
              Mức độ cảnh báo chuỗi lạnh
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setAlertLevel("NORMAL")}
                className={`py-2 px-3 rounded-xl border font-bold text-center transition-all ${
                  alertLevel === "NORMAL"
                    ? "bg-emerald-50 border-emerald-500 text-emerald-800 ring-2 ring-emerald-400/30"
                    : "border-slate-200 text-slate-600 hover:bg-slate-50"
                }`}
              >
                An Toàn (0-4°C)
              </button>

              <button
                type="button"
                onClick={() => setAlertLevel("WARNING")}
                className={`py-2 px-3 rounded-xl border font-bold text-center transition-all ${
                  alertLevel === "WARNING"
                    ? "bg-amber-50 border-amber-500 text-amber-800 ring-2 ring-amber-400/30"
                    : "border-slate-200 text-slate-600 hover:bg-slate-50"
                }`}
              >
                Cận Ngưỡng
              </button>

              <button
                type="button"
                onClick={() => setAlertLevel("CRITICAL")}
                className={`py-2 px-3 rounded-xl border font-bold text-center transition-all ${
                  alertLevel === "CRITICAL"
                    ? "bg-rose-50 border-rose-500 text-rose-800 ring-2 ring-rose-400/30"
                    : "border-slate-200 text-slate-600 hover:bg-slate-50"
                }`}
              >
                Vượt Ngưỡng
              </button>
            </div>
          </div>

          {/* Actions */}
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
              className="px-5 py-2 rounded-xl bg-sky-700 hover:bg-sky-800 text-white font-black shadow-md transition-colors flex items-center gap-1.5 disabled:opacity-50"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{loading ? "Đang lưu..." : "Lưu Bản Đọc Cảm Biến"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
