"use client";

// ============================================================
// components/admin/aircargo/ShipmentTable.tsx
// Bảng Danh Sách Vận Đơn Hàng Không & Chuyến Bay Air-Cargo (Phase 15)
// ============================================================

import React, { useState } from "react";
import Image from "next/image";
import {
  Plane,
  FileText,
  Calendar,
  Thermometer,
  Trash2,
  ExternalLink,
  ChevronRight,
  Package,
  X,
  AlertCircle,
} from "lucide-react";
import { AirCargoShipmentItem } from "./types";
import {
  AIRLINE_CARRIERS_CONFIG,
  SHIPMENT_STATUS_CONFIG,
} from "@/lib/validations/batch";
import { ShipmentStatus } from "@prisma/client";

interface ShipmentTableProps {
  shipments: AirCargoShipmentItem[];
  loading: boolean;
  onUpdateStatus: (id: string, newStatus: ShipmentStatus) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

export const ShipmentTable: React.FC<ShipmentTableProps> = ({
  shipments,
  loading,
  onUpdateStatus,
  onDelete,
}) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString("vi-VN", {
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

  const handleDelete = async (id: string) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa chuyến bay / vận đơn này?")) {
      return;
    }
    setDeletingId(id);
    try {
      await onDelete(id);
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return (
      <div className="bg-white border border-slate-200/90 rounded-2xl p-12 text-center shadow-sm">
        <div className="w-8 h-8 border-3 border-[#800028] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-sm font-medium text-slate-600">Đang tải danh sách chuyến bay Air-Cargo...</p>
      </div>
    );
  }

  if (shipments.length === 0) {
    return (
      <div className="bg-white border border-slate-200/90 rounded-2xl p-12 text-center shadow-sm">
        <Plane className="w-12 h-12 text-slate-300 mx-auto mb-3" />
        <h3 className="text-base font-semibold text-slate-800">Không có chuyến bay nào phù hợp</h3>
        <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
          Thử thay đổi bộ lọc tìm kiếm hoặc bấm nút &quot;Tạo Chuyến Bay / Vận Đơn Mới&quot; ở trên.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white border border-slate-200/90 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-50/80 border-b border-slate-200/80 text-[11px] uppercase tracking-wider text-slate-500 font-semibold">
              <tr>
                <th className="py-3 px-4">Chuyến bay & Hãng</th>
                <th className="py-3 px-4">Vận đơn (AWB)</th>
                <th className="py-3 px-4">Hành trình bay</th>
                <th className="py-3 px-4">Khoang lạnh (°C)</th>
                <th className="py-3 px-4">Trạng thái</th>
                <th className="py-3 px-4">Hóa đơn Úc & Chứng từ</th>
                <th className="py-3 px-4 text-center">Lô hàng</th>
                <th className="py-3 px-4 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {shipments.map((s) => {
                const carrierConf =
                  AIRLINE_CARRIERS_CONFIG[s.carrier] ||
                  AIRLINE_CARRIERS_CONFIG.VIETNAM_AIRLINES_CARGO;
                const statusConf =
                  SHIPMENT_STATUS_CONFIG[s.status] ||
                  SHIPMENT_STATUS_CONFIG.IN_WAREHOUSE;

                return (
                  <tr key={s.id} className="hover:bg-slate-50/50 transition-colors">
                    {/* Chuyến bay & Hãng */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-xl bg-sky-50 border border-sky-100 flex items-center justify-center flex-shrink-0">
                          <Plane className="w-4 h-4 text-sky-700" />
                        </div>
                        <div>
                          <div className="font-bold text-slate-900 flex items-center gap-1.5">
                            {s.flightNumber}
                            <span
                              className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${carrierConf.badgeColor}`}
                            >
                              {carrierConf.name}
                            </span>
                          </div>
                          <span className="text-[11px] text-slate-400 font-mono">
                            {s.shipmentNumber}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Vận đơn AWB */}
                    <td className="py-3.5 px-4 font-mono font-medium text-slate-800">
                      <div className="flex items-center gap-1.5">
                        <FileText className="w-3.5 h-3.5 text-slate-400" />
                        <span>{s.airWaybillNumber}</span>
                      </div>
                    </td>

                    {/* Hành trình bay */}
                    <td className="py-3.5 px-4">
                      <div className="space-y-1 text-xs">
                        <div className="flex items-center gap-1 font-semibold text-slate-800">
                          <span>{s.originAirport}</span>
                          <span className="text-slate-400">✈️</span>
                          <span>{s.destinationAirport}</span>
                        </div>
                        <div className="text-[11px] text-slate-500 flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-slate-400" />
                          <span>Đến: {formatDate(s.arrivalDate)}</span>
                        </div>
                      </div>
                    </td>

                    {/* Nhiệt độ kho mát */}
                    <td className="py-3.5 px-4">
                      <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 border border-emerald-100 text-emerald-800 font-semibold text-xs">
                        <Thermometer className="w-3.5 h-3.5 text-emerald-600" />
                        <span>
                          {s.storageTempMin}°C - {s.storageTempMax}°C
                        </span>
                      </div>
                    </td>

                    {/* Trạng thái */}
                    <td className="py-3.5 px-4">
                      <select
                        value={s.status}
                        onChange={(e) =>
                          onUpdateStatus(s.id, e.target.value as ShipmentStatus)
                        }
                        className={`text-xs font-semibold px-2.5 py-1 rounded-lg border focus:outline-none cursor-pointer ${statusConf.badgeColor}`}
                      >
                        {Object.entries(SHIPMENT_STATUS_CONFIG).map(([stKey, stVal]) => (
                          <option key={stKey} value={stKey}>
                            {stVal.label}
                          </option>
                        ))}
                      </select>
                    </td>

                    {/* Hóa đơn & Chứng từ */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1.5 flex-wrap max-w-[160px]">
                        {s.receiptImages?.length > 0 ? (
                          s.receiptImages.slice(0, 3).map((url, imgIdx) => (
                            <button
                              key={imgIdx}
                              onClick={() => setSelectedImage(url)}
                              className="relative w-8 h-8 rounded-lg overflow-hidden border border-slate-200 hover:border-slate-400 transition-all flex-shrink-0 group"
                              title="Xem hóa đơn mua hàng Chemist Warehouse Úc"
                            >
                              <Image
                                src={url}
                                alt="Hóa đơn Chemist Úc"
                                fill
                                className="object-cover group-hover:scale-110 transition-transform"
                                sizes="32px"
                              />
                            </button>
                          ))
                        ) : (
                          <span className="text-[11px] text-slate-400 italic">
                            Chưa đính kèm
                          </span>
                        )}
                        {s.receiptImages && s.receiptImages.length > 3 && (
                          <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                            +{s.receiptImages.length - 3}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Lô hàng liên kết */}
                    <td className="py-3.5 px-4 text-center">
                      <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold font-mono">
                        <Package className="w-3 h-3 text-slate-500" />
                        <span>{s._count?.batches ?? s.batches?.length ?? 0}</span>
                      </div>
                    </td>

                    {/* Thao tác */}
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => handleDelete(s.id)}
                        disabled={deletingId === s.id}
                        title="Xóa chuyến bay"
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Xem Ảnh Lớn Lightbox */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div
            className="relative max-w-3xl w-full max-h-[90vh] bg-white rounded-2xl overflow-hidden shadow-2xl p-4 flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
              <h4 className="font-bold text-slate-800 text-sm flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#800028]" />
                Hóa Đơn Mua Hàng Chemist Warehouse Úc / Chứng Từ Hàng Không
              </h4>
              <button
                onClick={() => setSelectedImage(null)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg bg-slate-100 hover:bg-slate-200 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="relative w-full h-[65vh] bg-slate-900 rounded-xl overflow-hidden">
              <Image
                src={selectedImage}
                alt="Chứng từ phóng to"
                fill
                className="object-contain"
                sizes="(max-width: 1024px) 100vw, 800px"
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};
