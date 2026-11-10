"use client";

// ============================================================
// components/admin/flash-sale/FlashSaleTable.tsx
// Bảng Danh Sách Chiến Dịch Flash Sale (Module 9.3)
// ============================================================

import React, { useState } from "react";
import Image from "next/image";
import {
  Zap,
  Clock,
  Calendar,
  Layers,
  Edit2,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Flame,
  AlertTriangle,
  Loader2,
  PlusCircle,
  Package,
} from "lucide-react";
import type { FlashSaleCampaignItem } from "./types";

interface FlashSaleTableProps {
  campaigns: FlashSaleCampaignItem[];
  loading: boolean;
  page: number;
  totalPages: number;
  totalItems: number;
  onPageChange: (newPage: number) => void;
  onToggleActive: (id: string, currentState: boolean) => Promise<void>;
  onEditCampaign: (campaign: FlashSaleCampaignItem) => void;
  onManageDeals: (campaign: FlashSaleCampaignItem) => void;
  onDeleteCampaign: (campaign: FlashSaleCampaignItem) => void;
}

export const FlashSaleTable: React.FC<FlashSaleTableProps> = ({
  campaigns,
  loading,
  page,
  totalPages,
  totalItems,
  onPageChange,
  onToggleActive,
  onEditCampaign,
  onManageDeals,
  onDeleteCampaign,
}) => {
  const [togglingId, setTogglingId] = useState<string | null>(null);

  const handleToggle = async (id: string, current: boolean) => {
    try {
      setTogglingId(id);
      await onToggleActive(id, current);
    } finally {
      setTogglingId(null);
    }
  };

  const formatDateTime = (dateStr: string) => {
    return new Date(dateStr).toLocaleString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[11px]">
              <th className="py-3.5 px-4">Chiến Dịch Giờ Vàng</th>
              <th className="py-3.5 px-4">Khung Giờ</th>
              <th className="py-3.5 px-4 text-center">Trạng Thái</th>
              <th className="py-3.5 px-4">Tiến Độ & Doanh Thu</th>
              <th className="py-3.5 px-4 text-center">Kích Hoạt</th>
              <th className="py-3.5 px-4 text-right">Thao Tác</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {loading ? (
              <tr>
                <td colSpan={6} className="py-16 text-center text-slate-400">
                  <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-[#800028]" />
                  <span>Đang tải danh sách chiến dịch Flash Sale...</span>
                </td>
              </tr>
            ) : campaigns.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-16 text-center text-slate-400">
                  <Zap className="w-10 h-10 mx-auto mb-2 opacity-30 text-[#800028]" />
                  <p className="text-sm font-semibold text-slate-700">
                    Chưa có chiến dịch Flash Sale nào
                  </p>
                  <p className="text-xs text-slate-400 mt-1">
                    Hãy bấm &quot;Tạo Chiến Dịch Mới&quot; để thiết lập giờ vàng săn deal!
                  </p>
                </td>
              </tr>
            ) : (
              campaigns.map((c) => {
                const isToggling = togglingId === c.id;

                return (
                  <tr
                    key={c.id}
                    className="hover:bg-slate-50/60 transition-colors"
                  >
                    {/* Cột 1: Thông tin chiến dịch */}
                    <td className="py-4 px-4 max-w-xs">
                      <div className="flex items-start gap-3">
                        {/* Thumbnail */}
                        <div className="relative w-16 h-10 rounded-lg overflow-hidden bg-slate-100 shrink-0 border border-slate-200">
                          {c.bannerImage ? (
                            <Image
                              src={c.bannerImage}
                              alt={c.name}
                              fill
                              sizes="64px"
                              className="object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-rose-50 text-[#800028]">
                              <Zap className="w-5 h-5 fill-[#800028]" />
                            </div>
                          )}
                        </div>

                        {/* Title & Description */}
                        <div className="space-y-0.5 min-w-0">
                          <p className="font-bold text-slate-900 line-clamp-1 text-xs hover:text-[#800028] transition-colors">
                            {c.name}
                          </p>
                          {c.description && (
                            <p className="text-[11px] text-slate-500 line-clamp-1">
                              {c.description}
                            </p>
                          )}
                          <div className="flex items-center gap-2 pt-0.5">
                            <span className="text-[10px] font-semibold text-[#800028] bg-rose-50 px-1.5 py-0.5 rounded">
                              {c.itemCount} Deal sản phẩm
                            </span>
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Cột 2: Khung giờ bắt đầu - kết thúc */}
                    <td className="py-4 px-4 whitespace-nowrap">
                      <div className="space-y-1 text-slate-600">
                        <div className="flex items-center gap-1.5 text-[11px]">
                          <Clock className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span>Bắt đầu: {formatDateTime(c.startTime)}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-[11px]">
                          <Clock className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                          <span>Kết thúc: {formatDateTime(c.endTime)}</span>
                        </div>
                      </div>
                    </td>

                    {/* Cột 3: Trạng thái */}
                    <td className="py-4 px-4 text-center whitespace-nowrap">
                      {c.status === "ACTIVE" ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-[11px] font-bold border border-emerald-200">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                          Đang diễn ra
                        </span>
                      ) : c.status === "UPCOMING" ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 text-[11px] font-bold border border-amber-200">
                          <Clock className="w-3 h-3" />
                          Sắp tới
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 text-[11px] font-semibold">
                          Đã kết thúc
                        </span>
                      )}
                    </td>

                    {/* Cột 4: Tiến độ & Doanh thu */}
                    <td className="py-4 px-4 max-w-[200px]">
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="font-semibold text-slate-700">
                            {c.totalSold}/{c.totalQuantity} đã bán
                          </span>
                          <span className="font-bold text-[#800028]">
                            {c.soldPercentage}%
                          </span>
                        </div>

                        {/* Progress bar */}
                        <div className="w-full h-1.5 rounded-full bg-slate-100 overflow-hidden">
                          <div
                            className={`h-full transition-all duration-300 ${
                              c.soldPercentage >= 80
                                ? "bg-rose-600"
                                : c.soldPercentage >= 50
                                ? "bg-amber-500"
                                : "bg-emerald-500"
                            }`}
                            style={{ width: `${Math.min(100, c.soldPercentage)}%` }}
                          />
                        </div>

                        <div className="text-[10px] text-slate-400">
                          Doanh thu:{" "}
                          <strong className="text-slate-700">
                            {c.revenue.toLocaleString("vi-VN")} ₫
                          </strong>
                        </div>
                      </div>
                    </td>

                    {/* Cột 5: Bật/Tắt kích hoạt */}
                    <td className="py-4 px-4 text-center">
                      <button
                        type="button"
                        role="switch"
                        aria-checked={c.isActive}
                        disabled={isToggling}
                        onClick={() => handleToggle(c.id, c.isActive)}
                        className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none disabled:opacity-50 ${
                          c.isActive ? "bg-emerald-600" : "bg-slate-300"
                        }`}
                      >
                        <span
                          className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                            c.isActive ? "translate-x-4" : "translate-x-0"
                          }`}
                        />
                      </button>
                    </td>

                    {/* Cột 6: Thao tác */}
                    <td className="py-4 px-4 text-right whitespace-nowrap">
                      <div className="inline-flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => onManageDeals(c)}
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-rose-50 text-[#800028] hover:bg-[#800028] hover:text-white transition-all text-[11px] font-bold"
                          title="Quản lý danh sách deal sản phẩm"
                        >
                          <Package className="w-3.5 h-3.5" />
                          <span>Quản Lý Deal</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => onEditCampaign(c)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
                          title="Chỉnh sửa thông tin chiến dịch"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>

                        <button
                          type="button"
                          onClick={() => onDeleteCampaign(c)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                          title="Xóa chiến dịch"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Phân trang */}
      {totalPages > 1 && (
        <div className="p-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <div>
            Hiển thị trang <strong>{page}</strong> trên{" "}
            <strong>{totalPages}</strong> ({totalItems} chiến dịch)
          </div>
          <div className="flex items-center gap-1">
            <button
              type="button"
              disabled={page <= 1}
              onClick={() => onPageChange(page - 1)}
              className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-40"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              disabled={page >= totalPages}
              onClick={() => onPageChange(page + 1)}
              className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-40"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
