"use client";

// ============================================================
// components/storefront/preorder/BrixSweetnessMeter.tsx
// Thang Đo Độ Ngọt Brix & Kích Thước Quả Tiêu Chuẩn Úc (Phase 21)
// ============================================================

import React from "react";
import { Thermometer, ShieldCheck, CheckCircle2 } from "lucide-react";

interface BrixSweetnessMeterProps {
  targetBrix: string;
  fruitSizeMm: string;
  category: string;
}

export const BrixSweetnessMeter: React.FC<BrixSweetnessMeterProps> = ({
  targetBrix,
  fruitSizeMm,
  category,
}) => {
  return (
    <div className="bg-gradient-to-br from-amber-50/70 via-rose-50/40 to-white rounded-2xl p-4 sm:p-5 border border-amber-200/80 shadow-xs space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between gap-2 border-b border-amber-100 pb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-amber-500 text-white flex items-center justify-center font-bold text-xs shadow-xs">
            Brix
          </div>
          <div>
            <h4 className="font-bold text-xs sm:text-sm text-slate-900 uppercase tracking-wide">
              Chỉ Số Chất Lượng Mùa Vụ Nông Trường
            </h4>
            <p className="text-[11px] text-slate-500">
              Kiểm định đo quang phổ khúc xạ độ đường tự nhiên trước khi thu hái
            </p>
          </div>
        </div>

        <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-extrabold uppercase shrink-0">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>Chuẩn Thượng Hạng</span>
        </div>
      </div>

      {/* 2 Stats Highlight */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white/90 p-3 rounded-xl border border-amber-100">
          <span className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider">
            {category === "MANUKA_HONEY" ? "Hoạt tính kháng khuẩn" : "Độ ngọt tự nhiên"}
          </span>
          <div className="text-base sm:text-lg font-black text-[#800028] font-mono mt-0.5">
            {targetBrix}
          </div>
          <span className="text-[10px] text-slate-500 mt-0.5 block">
            {category === "MANUKA_HONEY"
              ? "Methylglyoxal tự nhiên cực đại"
              : "Ngọt đậm đà, không gắt họng"}
          </span>
        </div>

        <div className="bg-white/90 p-3 rounded-xl border border-amber-100">
          <span className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider">
            {category === "MANUKA_HONEY" ? "Chứng nhận kiểm định" : "Kích thước đường kính"}
          </span>
          <div className="text-base sm:text-lg font-black text-amber-600 font-mono mt-0.5">
            {fruitSizeMm}
          </div>
          <span className="text-[10px] text-slate-500 mt-0.5 block">
            {category === "MANUKA_HONEY"
              ? "Chuẩn ISO 17025 Chính Phủ Úc"
              : "Size Jumbo Select giòn đặc"}
          </span>
        </div>
      </div>

      {/* Visual Brix Comparison Scale */}
      {category !== "MANUKA_HONEY" && (
        <div className="space-y-1.5 pt-1">
          <div className="flex items-center justify-between text-[11px] font-bold">
            <span className="text-slate-500">Đối chiếu thang đo độ ngọt hoa quả:</span>
            <span className="text-[#800028] font-mono">22.0° - 26.0° Brix</span>
          </div>

          <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden p-0.5 flex gap-1">
            <div
              className="bg-slate-300 rounded-l-full text-[8px] font-black text-slate-600 flex items-center justify-center"
              style={{ width: "35%" }}
              title="Hoa quả thông thường: 10 - 13° Brix"
            >
              12°
            </div>
            <div
              className="bg-amber-400 text-[8px] font-black text-amber-950 flex items-center justify-center"
              style={{ width: "25%" }}
              title="Cherry tiêu chuẩn: 16 - 19° Brix"
            >
              18°
            </div>
            <div
              className="bg-gradient-to-r from-rose-600 to-[#800028] rounded-r-full text-[8px] font-black text-white flex items-center justify-center animate-pulse"
              style={{ width: "40%" }}
              title="Cherry Tasmania THUYNGA Shop: 22 - 26° Brix"
            >
              24°+ Tuyển Chọn
            </div>
          </div>

          <div className="flex justify-between text-[10px] text-slate-400 px-0.5">
            <span>Trái cây phổ thông (12° Brix)</span>
            <span>Cherry thường (18° Brix)</span>
            <span className="font-bold text-[#800028]">Tasmania Đỉnh Cao (24°+ Brix)</span>
          </div>
        </div>
      )}
    </div>
  );
};
