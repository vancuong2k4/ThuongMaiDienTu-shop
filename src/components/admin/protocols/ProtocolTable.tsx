"use client";

// ============================================================
// components/admin/protocols/ProtocolTable.tsx
// Bảng Danh Sách Phác Đồ Dinh Dưỡng Chuẩn Y Khoa (Phase 16)
// ============================================================

import React, { useState } from "react";
import Image from "next/image";
import {
  Stethoscope,
  Trash2,
  ExternalLink,
  Tag,
  CheckCircle2,
  Percent,
  Package,
} from "lucide-react";
import { HealthProtocolItem } from "./types";
import { HEALTH_TARGET_GROUPS_CONFIG } from "@/lib/validations/protocol";

interface ProtocolTableProps {
  protocols: HealthProtocolItem[];
  loading: boolean;
  onToggleActive: (id: string, current: boolean) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

export const ProtocolTable: React.FC<ProtocolTableProps> = ({
  protocols,
  loading,
  onToggleActive,
  onDelete,
}) => {
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleToggle = async (id: string, current: boolean) => {
    setTogglingId(id);
    try {
      await onToggleActive(id, current);
    } finally {
      setTogglingId(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa phác đồ dinh dưỡng này?")) {
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
        <p className="text-sm font-medium text-slate-600">Đang tải danh sách phác đồ dinh dưỡng...</p>
      </div>
    );
  }

  if (protocols.length === 0) {
    return (
      <div className="bg-white border border-slate-200/90 rounded-2xl p-12 text-center shadow-sm">
        <Stethoscope className="w-12 h-12 text-slate-300 mx-auto mb-3" />
        <h3 className="text-base font-semibold text-slate-800">Không có phác đồ nào phù hợp</h3>
        <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
          Thử thay đổi bộ lọc tìm kiếm hoặc bấm nút &quot;Tạo Phác Đồ Mới&quot; ở trên.
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
              <th className="py-3 px-4">Phác Đồ & Mã Định Danh</th>
              <th className="py-3 px-4">Nhóm Đối Tượng</th>
              <th className="py-3 px-4">Dưỡng Chất Cốt Lõi</th>
              <th className="py-3 px-4">Sản phẩm combo</th>
              <th className="py-3 px-4 text-center">Khách áp dụng</th>
              <th className="py-3 px-4 text-center">Trạng thái</th>
              <th className="py-3 px-4 text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {protocols.map((p) => {
              const groupConf =
                HEALTH_TARGET_GROUPS_CONFIG[p.targetGroup] ||
                HEALTH_TARGET_GROUPS_CONFIG.BABY_KIDS;

              return (
                <tr key={p.id} className="hover:bg-slate-50/50 transition-colors">
                  {/* Phác Đồ & Mã Định Danh */}
                  <td className="py-3.5 px-4 max-w-[280px]">
                    <div className="space-y-1">
                      <div className="font-bold text-slate-900 line-clamp-2">
                        {p.title}
                      </div>
                      <div className="text-[11px] font-mono text-slate-400">
                        slug: {p.slug}
                      </div>
                      {p.subtitle && (
                        <p className="text-[11px] text-slate-500 line-clamp-1 italic">
                          {p.subtitle}
                        </p>
                      )}
                    </div>
                  </td>

                  {/* Nhóm Đối Tượng */}
                  <td className="py-3.5 px-4">
                    <span
                      className={`text-xs font-semibold px-2.5 py-1 rounded-full border inline-block whitespace-nowrap ${groupConf.badgeColor}`}
                    >
                      {groupConf.label}
                    </span>
                    <span className="text-[10px] text-slate-400 block mt-1">
                      {groupConf.ageRange}
                    </span>
                  </td>

                  {/* Dưỡng Chất Cốt Lõi */}
                  <td className="py-3.5 px-4 max-w-[220px]">
                    <div className="flex flex-wrap gap-1">
                      {p.keyNutrients.slice(0, 3).map((nutr, idx) => (
                        <span
                          key={idx}
                          className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-medium"
                        >
                          {nutr}
                        </span>
                      ))}
                      {p.keyNutrients.length > 3 && (
                        <span className="text-[10px] text-slate-400">
                          +{p.keyNutrients.length - 3}
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Sản phẩm combo */}
                  <td className="py-3.5 px-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-800">
                        <Package className="w-3.5 h-3.5 text-slate-400" />
                        <span>{p.items?.length || 0} sản phẩm</span>
                      </div>
                      <div className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-100">
                        <Percent className="w-3 h-3" />
                        <span>Giảm {p.comboDiscountPercent}% combo</span>
                      </div>
                    </div>
                  </td>

                  {/* Khách áp dụng */}
                  <td className="py-3.5 px-4 text-center">
                    <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-800 font-mono text-xs font-bold">
                      <span>{p._count?.assessments ?? 0}</span>
                      <span className="text-slate-400 font-normal">lượt</span>
                    </div>
                  </td>

                  {/* Trạng thái lưu hành */}
                  <td className="py-3.5 px-4 text-center">
                    <button
                      onClick={() => handleToggle(p.id, p.isActive)}
                      disabled={togglingId === p.id}
                      className={`text-xs font-semibold px-2.5 py-1 rounded-full border transition-all ${
                        p.isActive
                          ? "bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100"
                          : "bg-slate-100 text-slate-500 border-slate-200 hover:bg-slate-200"
                      }`}
                    >
                      {p.isActive ? "Lưu hành" : "Tạm ngưng"}
                    </button>
                  </td>

                  {/* Thao tác */}
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <a
                        href={`/tu-van-dinh-duong?protocol=${p.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        title="Xem phác đồ ngoài Storefront"
                        className="p-1.5 text-slate-400 hover:text-sky-600 hover:bg-sky-50 rounded-lg transition-colors"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                      <button
                        onClick={() => handleDelete(p.id)}
                        disabled={deletingId === p.id}
                        title="Xóa phác đồ"
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
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
