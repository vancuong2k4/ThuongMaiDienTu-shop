"use client";

// ============================================================
// components/admin/gift-boxes/GiftTemplateTable.tsx
// Bảng Quản Lý Mẫu Vỏ Hộp Quà Biếu Cao Cấp (Phase 17)
// ============================================================

import React from "react";
import Image from "next/image";
import {
  Gift,
  Plane,
  Box,
  Layers,
  CheckCircle2,
  XCircle,
  Edit2,
  Trash2,
} from "lucide-react";
import { AdminGiftBoxTemplate } from "./types";
import { GIFT_BOX_TYPE_CONFIG } from "@/lib/validations/gift-box";

interface GiftTemplateTableProps {
  templates: AdminGiftBoxTemplate[];
  onToggleActive: (template: AdminGiftBoxTemplate) => void;
  onDeleteTemplate: (id: string) => void;
}

export const GiftTemplateTable: React.FC<GiftTemplateTableProps> = ({
  templates,
  onToggleActive,
  onDeleteTemplate,
}) => {
  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(val);
  };

  if (templates.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200/80 p-12 text-center space-y-3">
        <Gift className="w-12 h-12 text-slate-300 mx-auto" />
        <h4 className="font-bold text-slate-700 text-sm">
          Chưa có mẫu vỏ hộp quà nào
        </h4>
        <p className="text-xs text-slate-400 max-w-sm mx-auto">
          Nhấn nút "Thêm Mẫu Hộp Mới" phía trên để thiết lập vỏ hộp quà gỗ, hộp da hoặc hộp chuyên dụng Cherry.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 border-b border-slate-200/80 text-slate-600 font-bold uppercase tracking-wider">
            <tr>
              <th className="px-4 py-3.5">Mẫu Hộp</th>
              <th className="px-4 py-3.5">Loại & Chất Liệu</th>
              <th className="px-4 py-3.5">Kích Thước</th>
              <th className="px-4 py-3.5">Giá Vỏ Hộp</th>
              <th className="px-4 py-3.5">Sức Chứa</th>
              <th className="px-4 py-3.5">Bảo Ôn Bay Air</th>
              <th className="px-4 py-3.5">Đã Phối Giỏ</th>
              <th className="px-4 py-3.5">Trạng Thái</th>
              <th className="px-4 py-3.5 text-right">Thao Tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
            {templates.map((tpl) => {
              const typeCfg =
                GIFT_BOX_TYPE_CONFIG[tpl.boxType] ||
                GIFT_BOX_TYPE_CONFIG.WOODEN_BOX;

              return (
                <tr key={tpl.id} className="hover:bg-slate-50/70 transition-colors">
                  {/* Thumbnail & Tên mẫu */}
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-slate-100 shrink-0 border border-slate-200">
                        {tpl.imageUrl ? (
                          <img
                            src={tpl.imageUrl}
                            alt={tpl.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-slate-300">
                            <Box className="w-5 h-5" />
                          </div>
                        )}
                      </div>
                      <div>
                        <span className="font-bold text-slate-900 block line-clamp-1 max-w-[200px]">
                          {tpl.name}
                        </span>
                        <span className="text-[11px] font-mono text-slate-400">
                          {tpl.slug}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* Loại & Chất liệu */}
                  <td className="px-4 py-3.5 whitespace-nowrap">
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${typeCfg.badgeClass}`}
                    >
                      {typeCfg.label}
                    </span>
                    <span className="block text-[10px] text-slate-400 mt-0.5">
                      {typeCfg.material}
                    </span>
                  </td>

                  {/* Kích thước */}
                  <td className="px-4 py-3.5 whitespace-nowrap font-mono text-slate-600">
                    {tpl.dimensions}
                  </td>

                  {/* Giá vỏ hộp */}
                  <td className="px-4 py-3.5 whitespace-nowrap font-bold text-slate-900">
                    {formatCurrency(tpl.basePrice)}
                  </td>

                  {/* Sức chứa tối đa */}
                  <td className="px-4 py-3.5 whitespace-nowrap">
                    <span className="inline-flex items-center gap-1 font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded-md">
                      <Layers className="w-3 h-3 text-slate-500" />
                      <span>{tpl.maxSlots} ô sản phẩm</span>
                    </span>
                  </td>

                  {/* Cam kết bảo ôn bay Air */}
                  <td className="px-4 py-3.5 whitespace-nowrap">
                    {tpl.isAirCargoPledge ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-sky-700 bg-sky-50 px-2 py-0.5 rounded-full border border-sky-100">
                        <Plane className="w-3 h-3 text-sky-600" />
                        <span>Giữ lạnh Cherry</span>
                      </span>
                    ) : (
                      <span className="text-slate-400 text-[11px]">Tiêu chuẩn</span>
                    )}
                  </td>

                  {/* Đã phối giỏ */}
                  <td className="px-4 py-3.5 whitespace-nowrap text-slate-500">
                    <strong>{tpl.hamperCount || 0}</strong> lượt
                  </td>

                  {/* Trạng thái hoạt động */}
                  <td className="px-4 py-3.5 whitespace-nowrap">
                    <button
                      onClick={() => onToggleActive(tpl)}
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold border transition-colors ${
                        tpl.isActive
                          ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                          : "bg-slate-100 text-slate-500 border-slate-200"
                      }`}
                    >
                      {tpl.isActive ? (
                        <>
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          <span>Đang kinh doanh</span>
                        </>
                      ) : (
                        <>
                          <XCircle className="w-3 h-3 text-slate-400" />
                          <span>Tạm ngừng</span>
                        </>
                      )}
                    </button>
                  </td>

                  {/* Thao tác */}
                  <td className="px-4 py-3.5 whitespace-nowrap text-right space-x-1.5">
                    <button
                      onClick={() => onDeleteTemplate(tpl.id)}
                      className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-all"
                      title="Xóa mẫu vỏ hộp"
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
