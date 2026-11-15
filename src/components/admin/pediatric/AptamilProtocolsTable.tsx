"use client";

// ============================================================
// components/admin/pediatric/AptamilProtocolsTable.tsx
// Bảng Quản Trị Quy Chuẩn Pha Sữa Aptamil Profutura Úc (Phase 23)
// ============================================================

import React from "react";
import Link from "next/link";
import {
  Thermometer,
  Droplets,
  Scale,
  Clock,
  ExternalLink,
  ShieldCheck,
  AlertTriangle,
} from "lucide-react";
import type { AdminAptamilProtocolItem } from "./types";

interface AptamilProtocolsTableProps {
  protocols: AdminAptamilProtocolItem[];
}

export const AptamilProtocolsTable: React.FC<AptamilProtocolsTableProps> = ({
  protocols,
}) => {
  return (
    <div className="bg-white rounded-2xl border border-gray-200/80 shadow-xs overflow-hidden">
      <div className="p-4 sm:p-5 border-b border-gray-100 flex flex-wrap items-center justify-between gap-3 bg-slate-50/50">
        <div>
          <h3 className="text-base font-black text-gray-900">
            Quy Chuẩn Pha 4 Giai Đoạn Sữa Bột Aptamil Profutura Úc
          </h3>
          <p className="text-xs text-gray-500 mt-0.5">
            Quy chuẩn hóa nhiệt độ nước vàng 40°C - 45°C, tỷ lệ muỗng gạt và bảo tồn men vi sinh sống
          </p>
        </div>
        <span className="px-3 py-1 rounded-full text-xs font-black bg-emerald-100 text-emerald-800 border border-emerald-300">
          Chuẩn Hóa 100% Theo Hãng Danone Nutricia Úc
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50/70 text-gray-500 font-bold uppercase tracking-wider text-[11px]">
              <th className="py-3 px-4">Giai Đoạn (Stage)</th>
              <th className="py-3 px-4">Tên Sản Phẩm</th>
              <th className="py-3 px-4 text-center">Nhiệt Độ Nước Vàng</th>
              <th className="py-3 px-4 text-center">Tỷ Lệ Nước / Muỗng</th>
              <th className="py-3 px-4 text-center">Cữ Chuẩn / Ngày</th>
              <th className="py-3 px-4">Liên Kết Sản Phẩm Sàn</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 font-medium text-gray-700">
            {protocols.map((p) => (
              <tr key={p.id} className="hover:bg-slate-50/60 transition-colors">
                {/* Stage */}
                <td className="py-3.5 px-4">
                  <span className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 font-black text-xs border border-emerald-200">
                    {p.stage.replace("_", " ")}
                  </span>
                  <div className="text-[11px] text-gray-500 mt-1">
                    Độ tuổi: {p.ageRangeMonths}
                  </div>
                </td>

                {/* Product Title */}
                <td className="py-3.5 px-4 font-bold text-gray-900">
                  {p.productTitle}
                  <div className="text-[11px] text-gray-500 font-normal mt-0.5">
                    Trọng lượng muỗng: {p.scoopWeightGrams}g
                  </div>
                </td>

                {/* Water Temp */}
                <td className="py-3.5 px-4 text-center">
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-900 font-black text-xs border border-emerald-300">
                    <Thermometer className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{p.waterTemperatureMinC}°C - {p.waterTemperatureMaxC}°C</span>
                  </span>
                </td>

                {/* Mixing Ratio */}
                <td className="py-3.5 px-4 text-center">
                  <div className="font-black text-gray-900">
                    {p.waterMlPerScoop} ml / muỗng
                  </div>
                  <div className="text-[11px] text-gray-400 mt-0.5">
                    Cữ chuẩn: {p.waterVolumeMlPerFeed}ml ({p.scoopsPerFeed} muỗng)
                  </div>
                </td>

                {/* Feeds */}
                <td className="py-3.5 px-4 text-center font-bold text-gray-800">
                  {p.standardFeedsPerDay} cữ / ngày
                </td>

                {/* Product Link */}
                <td className="py-3.5 px-4">
                  {p.product ? (
                    <Link
                      href={`/san-pham/${p.product.slug}`}
                      target="_blank"
                      className="text-emerald-700 hover:text-[#800028] font-bold flex items-center gap-1.5"
                    >
                      <span className="truncate max-w-[180px]">{p.product.name}</span>
                      <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                    </Link>
                  ) : (
                    <span className="text-gray-400 text-xs">Chưa gán ID sản phẩm</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
