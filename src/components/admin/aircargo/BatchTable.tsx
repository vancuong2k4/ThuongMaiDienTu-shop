"use client";

// ============================================================
// components/admin/aircargo/BatchTable.tsx
// Bảng Danh Sách Mã Lô Sản Phẩm, Hạn Sử Dụng & Nguồn Gốc Úc (Phase 15)
// ============================================================

import React, { useState } from "react";
import Image from "next/image";
import {
  Package,
  Calendar,
  Barcode,
  Building2,
  Trash2,
  Search,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";
import { ProductBatchItem } from "./types";

interface BatchTableProps {
  batches: ProductBatchItem[];
  loading: boolean;
  onToggleActive: (id: string, currentActive: boolean) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

export const BatchTable: React.FC<BatchTableProps> = ({
  batches,
  loading,
  onToggleActive,
  onDelete,
}) => {
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

  const getFreshness = (expiryStr: string) => {
    try {
      const exp = new Date(expiryStr);
      const today = new Date();
      const diffTime = exp.getTime() - today.getTime();
      const months = Math.max(0, Math.floor(diffTime / (1000 * 60 * 60 * 24 * 30)));
      if (months >= 20) {
        return {
          label: `Date mới tinh (${months} th)`,
          color: "bg-emerald-50 text-emerald-800 border-emerald-200",
        };
      }
      if (months >= 12) {
        return {
          label: `Date rất xa (${months} th)`,
          color: "bg-sky-50 text-sky-800 border-sky-200",
        };
      }
      if (months > 0) {
        return {
          label: `Còn ${months} tháng`,
          color: "bg-amber-50 text-amber-800 border-amber-200",
        };
      }
      return {
        label: "Hết hạn",
        color: "bg-rose-50 text-rose-800 border-rose-200",
      };
    } catch {
      return { label: "N/A", color: "bg-slate-50 text-slate-600 border-slate-200" };
    }
  };

  const handleToggle = async (id: string, current: boolean) => {
    setTogglingId(id);
    try {
      await onToggleActive(id, current);
    } finally {
      setTogglingId(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa mã lô hàng này?")) {
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
        <p className="text-sm font-medium text-slate-600">Đang tải danh sách mã lô sản phẩm...</p>
      </div>
    );
  }

  if (batches.length === 0) {
    return (
      <div className="bg-white border border-slate-200/90 rounded-2xl p-12 text-center shadow-sm">
        <Package className="w-12 h-12 text-slate-300 mx-auto mb-3" />
        <h3 className="text-base font-semibold text-slate-800">Không có mã lô nào phù hợp</h3>
        <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
          Thử thay đổi bộ lọc tìm kiếm hoặc bấm nút &quot;Tạo Mã Lô Sản Phẩm Mới&quot; ở trên.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-slate-200/90 rounded-2xl shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs sm:text-sm">
          <thead className="bg-slate-50/80 border-b border-slate-200/80 text-[11px] uppercase tracking-wider text-slate-500 font-semibold">
            <tr>
              <th className="py-3 px-4">Mã Lô & Barcode Úc</th>
              <th className="py-3 px-4">Sản phẩm</th>
              <th className="py-3 px-4">Chuyến bay / AWB</th>
              <th className="py-3 px-4">NSX - HSD</th>
              <th className="py-3 px-4">Tồn kho / Nhập</th>
              <th className="py-3 px-4">Nguồn Chemist</th>
              <th className="py-3 px-4 text-center">Tra cứu</th>
              <th className="py-3 px-4 text-center">Lưu hành</th>
              <th className="py-3 px-4 text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {batches.map((b) => {
              const freshness = getFreshness(b.expiryDate);
              const productImage = b.product.images?.[0]?.url || "/images/placeholder.png";

              return (
                <tr key={b.id} className="hover:bg-slate-50/50 transition-colors">
                  {/* Mã Lô & Barcode Úc */}
                  <td className="py-3.5 px-4">
                    <div className="space-y-1">
                      <div className="font-mono font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded inline-block text-xs">
                        {b.batchCode}
                      </div>
                      {b.australianBarcode && (
                        <div className="text-[11px] text-slate-500 font-mono flex items-center gap-1">
                          <Barcode className="w-3.5 h-3.5 text-slate-400" />
                          <span>{b.australianBarcode}</span>
                        </div>
                      )}
                    </div>
                  </td>

                  {/* Sản phẩm */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2.5 max-w-[240px]">
                      <div className="relative w-10 h-10 rounded-xl overflow-hidden bg-slate-50 border border-slate-200 flex-shrink-0">
                        <Image
                          src={productImage}
                          alt={b.product.name}
                          fill
                          className="object-cover"
                          sizes="40px"
                        />
                      </div>
                      <div>
                        <a
                          href={`/san-pham/${b.product.slug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-semibold text-slate-800 hover:text-[#800028] transition-colors line-clamp-1"
                        >
                          {b.product.name}
                        </a>
                        {b.variant && (
                          <span className="text-[11px] text-slate-500">
                            Phân loại: {b.variant.name}
                          </span>
                        )}
                      </div>
                    </div>
                  </td>

                  {/* Chuyến bay / AWB */}
                  <td className="py-3.5 px-4">
                    <div className="space-y-0.5">
                      <div className="font-semibold text-slate-800 flex items-center gap-1">
                        <ShieldCheck className="w-3.5 h-3.5 text-sky-600" />
                        <span>{b.shipment.flightNumber}</span>
                      </div>
                      <div className="text-[11px] font-mono text-slate-500">
                        {b.shipment.airWaybillNumber}
                      </div>
                    </div>
                  </td>

                  {/* NSX - HSD */}
                  <td className="py-3.5 px-4">
                    <div className="space-y-1">
                      <div className="text-[11px] text-slate-500">
                        NSX: {formatDate(b.manufactureDate)}
                      </div>
                      <div className="font-semibold text-slate-800 flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        <span>HSD: {formatDate(b.expiryDate)}</span>
                      </div>
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border inline-block ${freshness.color}`}
                      >
                        {freshness.label}
                      </span>
                    </div>
                  </td>

                  {/* Tồn kho / Nhập */}
                  <td className="py-3.5 px-4">
                    <div className="font-mono text-xs font-semibold text-slate-800">
                      <span className="text-emerald-700">{b.remainingStock}</span>
                      <span className="text-slate-400 font-normal"> / {b.importedQuantity}</span>
                    </div>
                  </td>

                  {/* Nguồn Chemist */}
                  <td className="py-3.5 px-4 text-xs text-slate-600">
                    <div className="flex items-center gap-1">
                      <Building2 className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                      <span className="line-clamp-1 max-w-[140px]">
                        {b.chemistSource || "Chemist Warehouse Úc"}
                      </span>
                    </div>
                  </td>

                  {/* Lượt tra cứu */}
                  <td className="py-3.5 px-4 text-center">
                    <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-rose-50 border border-rose-100 text-[#800028] text-xs font-bold font-mono">
                      <Search className="w-3 h-3" />
                      <span>{b._count?.verificationLogs ?? 0}</span>
                    </div>
                  </td>

                  {/* Trạng thái lưu hành */}
                  <td className="py-3.5 px-4 text-center">
                    <button
                      onClick={() => handleToggle(b.id, b.isActive)}
                      disabled={togglingId === b.id}
                      className={`text-xs font-semibold px-2.5 py-1 rounded-full border transition-all ${
                        b.isActive
                          ? "bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100"
                          : "bg-slate-100 text-slate-500 border-slate-200 hover:bg-slate-200"
                      }`}
                    >
                      {b.isActive ? "Đang lưu hành" : "Tạm ngưng"}
                    </button>
                  </td>

                  {/* Thao tác */}
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => handleDelete(b.id)}
                      disabled={deletingId === b.id}
                      title="Xóa mã lô"
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
  );
};
