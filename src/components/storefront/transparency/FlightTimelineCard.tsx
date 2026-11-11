"use client";

// ============================================================
// components/storefront/transparency/FlightTimelineCard.tsx
// Thẻ Lộ Trình Chuyến Bay Air-Cargo & Vận Đơn Hàng Không AWB (Phase 15)
// ============================================================

import React, { useState } from "react";
import {
  Plane,
  FileText,
  Copy,
  Check,
  Calendar,
  Building,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";

interface FlightTimelineCardProps {
  shipment: {
    id: string;
    shipmentNumber: string;
    airWaybillNumber: string;
    carrier: string;
    carrierInfo: {
      code: string;
      name: string;
      country: string;
      flightPrefix: string;
      badgeColor: string;
    };
    flightNumber: string;
    originAirport: string;
    destinationAirport: string;
    departureDate: string;
    arrivalDate: string;
    status: string;
    statusInfo: {
      label: string;
      badgeColor: string;
      description: string;
    };
  };
}

export const FlightTimelineCard: React.FC<FlightTimelineCardProps> = ({
  shipment,
}) => {
  const [copied, setCopied] = useState(false);

  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString("vi-VN", {
        weekday: "short",
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return dateStr;
    }
  };

  const handleCopyAWB = () => {
    navigator.clipboard.writeText(shipment.airWaybillNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const airportNames: Record<string, string> = {
    SYD: "Sân bay Quốc tế Sydney (Kingsford Smith)",
    MEL: "Sân bay Quốc tế Melbourne (Tullamarine)",
    HAN: "Sân bay Quốc tế Nội Bài (Hà Nội)",
    SGN: "Sân bay Quốc tế Tân Sơn Nhất (TP.HCM)",
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-7 relative overflow-hidden">
      {/* Background Accent */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-sky-50/60 rounded-full blur-3xl -z-10" />

      {/* Header Chuyến Bay & Hãng */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-sky-50 border border-sky-100 flex items-center justify-center flex-shrink-0">
            <Plane className="w-6 h-6 text-sky-700" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-lg font-bold text-slate-900 tracking-tight">
                Chuyến bay {shipment.flightNumber}
              </h3>
              <span
                className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${shipment.carrierInfo.badgeColor}`}
              >
                {shipment.carrierInfo.name}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Vận tải chuyên tuyến Air-Cargo Úc ✈️ Việt Nam
            </p>
          </div>
        </div>

        {/* Số Vận Đơn AWB */}
        <div className="flex items-center gap-2 bg-slate-50 border border-slate-200/80 rounded-xl px-3 py-1.5 self-start sm:self-auto">
          <FileText className="w-4 h-4 text-slate-400" />
          <div className="text-xs">
            <span className="text-slate-500 font-medium">AWB: </span>
            <span className="font-mono font-bold text-slate-800">
              {shipment.airWaybillNumber}
            </span>
          </div>
          <button
            onClick={handleCopyAWB}
            title="Sao chép số vận đơn"
            className="p-1 hover:bg-slate-200 rounded text-slate-400 hover:text-slate-700 transition-colors"
          >
            {copied ? (
              <Check className="w-3.5 h-3.5 text-emerald-600" />
            ) : (
              <Copy className="w-3.5 h-3.5" />
            )}
          </button>
        </div>
      </div>

      {/* Lộ Trình Bay Trực Quan */}
      <div className="py-6 sm:py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          {/* Điểm Xuất Phát (Úc) */}
          <div className="text-left space-y-1">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 text-xs font-semibold">
              <Building className="w-3.5 h-3.5 text-slate-500" />
              <span>Khởi hành từ Úc</span>
            </div>
            <div className="text-2xl font-black text-slate-900 tracking-tight font-mono">
              {shipment.originAirport}
            </div>
            <p className="text-xs font-medium text-slate-600 line-clamp-1">
              {airportNames[shipment.originAirport] || shipment.originAirport}
            </p>
            <div className="text-xs text-slate-500 flex items-center gap-1 pt-1">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <span>Cất cánh: {formatDate(shipment.departureDate)}</span>
            </div>
          </div>

          {/* Đường Bay Ở Giữa */}
          <div className="flex flex-col items-center justify-center text-center px-2">
            <span className="text-xs font-semibold text-slate-400 mb-2">
              Thời gian bay: ~9h45m thẳng
            </span>
            <div className="w-full relative flex items-center justify-center">
              <div className="w-full border-t-2 border-dashed border-sky-300 absolute" />
              <div className="relative z-10 w-9 h-9 rounded-full bg-sky-600 text-white flex items-center justify-center shadow-md">
                <Plane className="w-4 h-4 rotate-90" />
              </div>
            </div>
            <span
              className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border mt-2.5 ${shipment.statusInfo.badgeColor}`}
            >
              {shipment.statusInfo.label}
            </span>
          </div>

          {/* Điểm Hạ Cánh (Nội Bài) */}
          <div className="text-left md:text-right space-y-1">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Hạ cánh & Thông quan</span>
            </div>
            <div className="text-2xl font-black text-slate-900 tracking-tight font-mono">
              {shipment.destinationAirport}
            </div>
            <p className="text-xs font-medium text-slate-600 line-clamp-1">
              {airportNames[shipment.destinationAirport] || shipment.destinationAirport}
            </p>
            <div className="text-xs text-slate-500 flex items-center md:justify-end gap-1 pt-1">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <span>Hạ cánh: {formatDate(shipment.arrivalDate)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Cam Kết Vận Chuyển Hàng Không */}
      <div className="p-4 bg-slate-50 border border-slate-200/80 rounded-2xl flex items-start gap-3">
        <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
        <div className="text-xs text-slate-600 leading-relaxed">
          <strong className="text-slate-800 font-semibold">
            Cam kết 100% đường bay Air Cargo:
          </strong>{" "}
          Hàng hóa được đưa lên máy bay trong vòng 24h sau khi mua tại Chemist
          Warehouse Sydney/Melbourne; tuyệt đối KHÔNG đi đường biển hàng container
          kéo dài 4-8 tuần gây biến tính sữa công thức và vitamin.
        </div>
      </div>
    </div>
  );
};
