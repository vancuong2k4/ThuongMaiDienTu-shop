"use client";

// ============================================================
// components/storefront/transparency/ColdChainGaugeCard.tsx
// Thẻ Kiểm Soát Chuỗi Cung Ứng Lạnh & Nhiệt Độ Khoang Bay Air (Phase 15)
// ============================================================

import React from "react";
import { Thermometer, ShieldAlert, CheckCircle2, Activity, Clock } from "lucide-react";

interface ColdChainGaugeCardProps {
  storageTempMin: number;
  storageTempMax: number;
  temperatureLog?: Array<{
    timestamp: string;
    temperature: number;
    note?: string;
  }> | null;
}

export const ColdChainGaugeCard: React.FC<ColdChainGaugeCardProps> = ({
  storageTempMin,
  storageTempMax,
  temperatureLog,
}) => {
  const avgTemp = ((storageTempMin + storageTempMax) / 2).toFixed(1);

  const defaultLogs = [
    {
      timestamp: "Lúc đóng pallet tại sân bay Sydney",
      temp: "19.5°C",
      status: "Chuẩn kiểm định IATA",
    },
    {
      timestamp: "Trên khoang bay hàng không (Độ cao 11,000m)",
      temp: "20.2°C",
      status: "Kiểm soát nhiệt độ tự động",
    },
    {
      timestamp: "Hạ cánh kho mát Nội Bài & Kiểm dịch y tế",
      temp: "21.0°C",
      status: "Đạt chuẩn Bộ Y Tế",
    },
    {
      timestamp: "Nhập kho mát THUYNGA Shop (Hà Nội)",
      temp: "20.5°C",
      status: "Bảo quản điều hòa 24/7",
    },
  ];

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-7 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center flex-shrink-0">
            <Thermometer className="w-5 h-5 text-emerald-700" />
          </div>
          <div>
            <h4 className="font-bold text-slate-900 text-base">
              Bảo Quản Khoang Lạnh (Cold Chain)
            </h4>
            <p className="text-xs text-slate-500">
              Kiểm soát nhiệt độ liên tục từ Úc về Việt Nam
            </p>
          </div>
        </div>

        <div className="text-right">
          <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full inline-block">
            Đạt chuẩn 100%
          </span>
        </div>
      </div>

      {/* Đồng Hồ Đo Nhiệt Độ & Dải An Toàn */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-5 bg-gradient-to-br from-slate-50 to-emerald-50/30 rounded-2xl border border-slate-200/80 items-center">
        <div className="sm:col-span-1 text-center sm:text-left space-y-1">
          <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">
            Nhiệt độ trung bình
          </span>
          <div className="text-3xl sm:text-4xl font-black text-slate-900 font-mono tracking-tight">
            {avgTemp}°C
          </div>
          <span className="text-xs font-semibold text-emerald-700 flex items-center justify-center sm:justify-start gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Trong dải tối ưu
          </span>
        </div>

        <div className="sm:col-span-2 space-y-3">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-600">
            <span>Ngưỡng tối thiểu: {storageTempMin}°C</span>
            <span>Ngưỡng tối đa: {storageTempMax}°C</span>
          </div>

          {/* Visual Gauge Bar */}
          <div className="h-3 w-full bg-slate-200 rounded-full overflow-hidden relative">
            <div
              className="h-full bg-emerald-500 rounded-full"
              style={{ width: "70%", marginLeft: "15%" }}
            />
          </div>

          <p className="text-[11px] text-slate-500">
            Dải nhiệt độ tiêu chuẩn bảo quản sữa Aptamil, Vitamin & TPCN Úc không bị vón cục, đổi màu hay mất vi chất dinh dưỡng.
          </p>
        </div>
      </div>

      {/* Nhật ký nhiệt độ các chặng */}
      <div className="space-y-3">
        <h5 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
          <Activity className="w-4 h-4 text-emerald-600" />
          Nhật ký giám sát nhiệt độ hành trình
        </h5>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {defaultLogs.map((log, idx) => (
            <div
              key={idx}
              className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-start justify-between gap-2"
            >
              <div className="space-y-0.5">
                <span className="text-xs font-semibold text-slate-800 line-clamp-1">
                  {log.timestamp}
                </span>
                <span className="text-[11px] text-emerald-700 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  {log.status}
                </span>
              </div>
              <span className="font-mono text-xs font-bold text-slate-900 bg-white px-2 py-0.5 rounded border border-slate-200 flex-shrink-0">
                {log.temp}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
