"use client";

// ============================================================
// components/admin/vouchers/VoucherTable.tsx
// Bảng Danh Sách Voucher Thông Minh với Optimistic UI
// ============================================================

import React, { useState } from "react";
import {
  Copy,
  Check,
  Percent,
  DollarSign,
  Truck,
  Eye,
  Edit2,
  Trash2,
  Calendar,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  Loader2,
} from "lucide-react";
import type { VoucherItem } from "./types";

interface VoucherTableProps {
  vouchers: VoucherItem[];
  loading: boolean;
  page: number;
  totalPages: number;
  totalItems: number;
  onPageChange: (newPage: number) => void;
  onToggleActive: (id: string, currentState: boolean) => Promise<void>;
  onViewDetail: (voucher: VoucherItem) => void;
  onEdit: (voucher: VoucherItem) => void;
  onDelete: (voucher: VoucherItem) => void;
}

export const VoucherTable: React.FC<VoucherTableProps> = ({
  vouchers,
  loading,
  page,
  totalPages,
  totalItems,
  onPageChange,
  onToggleActive,
  onViewDetail,
  onEdit,
  onDelete,
}) => {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => {
      setCopiedCode((prev) => (prev === code ? null : prev));
    }, 2000);
  };

  const handleToggle = async (voucher: VoucherItem) => {
    try {
      setTogglingId(voucher.id);
      await onToggleActive(voucher.id, voucher.isActive);
    } finally {
      setTogglingId(null);
    }
  };

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
      {/* Table Container */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-slate-600">
          <thead className="bg-slate-50/80 text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200/80">
            <tr>
              <th className="py-3.5 px-4">Mã Voucher</th>
              <th className="py-3.5 px-4">Loại & Mức Giảm</th>
              <th className="py-3.5 px-4">Điều Kiện Đơn</th>
              <th className="py-3.5 px-4 min-w-[170px]">Tiến Trình Dùng</th>
              <th className="py-3.5 px-4">Thời Hạn</th>
              <th className="py-3.5 px-4 text-center">Trạng Thái</th>
              <th className="py-3.5 px-4 text-right">Thao Tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading ? (
              <tr>
                <td colSpan={7} className="py-16 text-center text-slate-400">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <Loader2 className="w-6 h-6 animate-spin text-[#800028]" />
                    <span className="text-xs font-medium">Đang tải danh sách voucher...</span>
                  </div>
                </td>
              </tr>
            ) : vouchers.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-16 text-center">
                  <div className="flex flex-col items-center justify-center gap-2 text-slate-400">
                    <AlertTriangle className="w-8 h-8 text-slate-300" />
                    <p className="text-sm font-semibold text-slate-600">Không tìm thấy mã giảm giá nào</p>
                    <p className="text-xs text-slate-400">Thử thay đổi bộ lọc hoặc tạo mã khuyến mãi mới</p>
                  </div>
                </td>
              </tr>
            ) : (
              vouchers.map((voucher) => {
                const percentUsed =
                  voucher.usageLimit !== null && voucher.usageLimit > 0
                    ? Math.min(100, Math.round((voucher.usedCount / voucher.usageLimit) * 100))
                    : null;

                const isCopied = copiedCode === voucher.code;
                const isToggling = togglingId === voucher.id;

                return (
                  <tr
                    key={voucher.id}
                    className="hover:bg-slate-50/60 transition-colors group"
                  >
                    {/* 1. Mã Voucher */}
                    <td className="py-4 px-4 align-middle">
                      <div className="flex items-center gap-2">
                        <span className="inline-block px-2.5 py-1 rounded-lg bg-slate-900 text-amber-300 font-mono text-xs font-black tracking-wider shadow-2xs">
                          {voucher.code}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleCopy(voucher.code)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                          title="Sao chép mã"
                        >
                          {isCopied ? (
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                      <p className="mt-1 text-[11px] text-slate-400">
                        {voucher.orderCount} đơn hàng đã dùng
                      </p>
                    </td>

                    {/* 2. Loại & Mức Giảm */}
                    <td className="py-4 px-4 align-middle">
                      {voucher.type === "PERCENTAGE" ? (
                        <div>
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-rose-50 text-[#800028] border border-rose-200/80">
                            <Percent className="w-3 h-3" />
                            Giảm {voucher.value}%
                          </span>
                          {voucher.maxDiscount && (
                            <p className="mt-1 text-xs text-slate-500 font-medium">
                              Tối đa: <span className="font-semibold text-slate-700">{voucher.maxDiscount.toLocaleString("vi-VN")}₫</span>
                            </p>
                          )}
                        </div>
                      ) : voucher.type === "FIXED" ? (
                        <div>
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200/80">
                            <DollarSign className="w-3 h-3" />
                            Giảm {voucher.value.toLocaleString("vi-VN")}₫
                          </span>
                        </div>
                      ) : (
                        <div>
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200/80">
                            <Truck className="w-3 h-3" />
                            Miễn Phí Vận Chuyển
                          </span>
                          <p className="mt-1 text-xs text-slate-500">
                            Tối đa: {voucher.value.toLocaleString("vi-VN")}₫
                          </p>
                        </div>
                      )}
                    </td>

                    {/* 3. Điều Kiện Đơn */}
                    <td className="py-4 px-4 align-middle">
                      <div className="space-y-0.5 text-xs">
                        <p className="text-slate-700 font-semibold">
                          {voucher.minOrderAmount
                            ? `Đơn từ ${voucher.minOrderAmount.toLocaleString("vi-VN")}₫`
                            : "Không giới hạn tối thiểu"}
                        </p>
                        <p className="text-slate-400 text-[11px]">
                          Tối đa {voucher.userLimit} lần/khách
                        </p>
                      </div>
                    </td>

                    {/* 4. Tiến Trình Dùng */}
                    <td className="py-4 px-4 align-middle">
                      {voucher.usageLimit !== null ? (
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between text-xs">
                            <span className="font-bold text-slate-700">
                              {voucher.usedCount}
                              <span className="font-normal text-slate-400">/{voucher.usageLimit}</span>
                            </span>
                            <span
                              className={`text-[11px] font-bold ${
                                (percentUsed ?? 0) >= 90
                                  ? "text-rose-600"
                                  : (percentUsed ?? 0) >= 60
                                  ? "text-amber-600"
                                  : "text-emerald-600"
                              }`}
                            >
                              {percentUsed}%
                            </span>
                          </div>
                          {/* Progress Bar */}
                          <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all duration-500 ${
                                (percentUsed ?? 0) >= 90
                                  ? "bg-rose-500"
                                  : (percentUsed ?? 0) >= 60
                                  ? "bg-amber-500"
                                  : "bg-emerald-500"
                              }`}
                              style={{ width: `${percentUsed}%` }}
                            />
                          </div>
                        </div>
                      ) : (
                        <div className="text-xs">
                          <span className="font-bold text-slate-700">{voucher.usedCount}</span>
                          <span className="text-slate-400"> lượt (Không giới hạn)</span>
                        </div>
                      )}
                    </td>

                    {/* 5. Thời Hạn */}
                    <td className="py-4 px-4 align-middle">
                      <div className="space-y-0.5 text-xs">
                        <div className="flex items-center gap-1 text-slate-700 font-medium">
                          <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span>{formatDate(voucher.startDate)}</span>
                          <span className="text-slate-400">→</span>
                          <span>{formatDate(voucher.endDate)}</span>
                        </div>
                        <div>
                          {voucher.lifecycleStatus === "ACTIVE" ? (
                            <span className="inline-block text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                              🟢 Đang diễn ra
                            </span>
                          ) : voucher.lifecycleStatus === "UPCOMING" ? (
                            <span className="inline-block text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                              🟡 Sắp diễn ra
                            </span>
                          ) : voucher.lifecycleStatus === "EXPIRED" ? (
                            <span className="inline-block text-[10px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
                              🔴 Đã hết hạn
                            </span>
                          ) : voucher.lifecycleStatus === "DEPLETED" ? (
                            <span className="inline-block text-[10px] font-bold text-orange-700 bg-orange-50 px-2 py-0.5 rounded-full border border-orange-200">
                              ⚠️ Đã hết lượt
                            </span>
                          ) : (
                            <span className="inline-block text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                              ⚪ Tạm dừng
                            </span>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* 6. Trạng Thái Kích Hoạt */}
                    <td className="py-4 px-4 align-middle text-center">
                      <button
                        type="button"
                        disabled={isToggling}
                        onClick={() => handleToggle(voucher)}
                        className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-[#800028]/20 ${
                          voucher.isActive ? "bg-[#800028]" : "bg-slate-200"
                        } ${isToggling ? "opacity-50 cursor-not-allowed" : ""}`}
                        title={voucher.isActive ? "Bấm để tạm dừng" : "Bấm để kích hoạt"}
                      >
                        <span
                          className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                            voucher.isActive ? "translate-x-5" : "translate-x-0"
                          }`}
                        />
                      </button>
                    </td>

                    {/* 7. Thao Tác */}
                    <td className="py-4 px-4 align-middle text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          type="button"
                          onClick={() => onViewDetail(voucher)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
                          title="Xem chi tiết & lịch sử dùng"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => onEdit(voucher)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-[#800028] hover:bg-rose-50 transition-colors"
                          title="Chỉnh sửa voucher"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => onDelete(voucher)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                          title="Xóa voucher"
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

      {/* Pagination Footer */}
      {!loading && vouchers.length > 0 && totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 border-t border-slate-100 bg-slate-50/50 text-xs text-slate-500">
          <p>
            Hiển thị trang <span className="font-bold text-slate-700">{page}</span> /{" "}
            <span className="font-bold text-slate-700">{totalPages}</span> (Tổng{" "}
            <span className="font-bold text-slate-700">{totalItems}</span> mã)
          </p>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              disabled={page <= 1}
              onClick={() => onPageChange(page - 1)}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all font-semibold"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Trước</span>
            </button>
            <div className="px-2 py-1 font-bold text-slate-700">
              {page}
            </div>
            <button
              type="button"
              disabled={page >= totalPages}
              onClick={() => onPageChange(page + 1)}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all font-semibold"
            >
              <span>Sau</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
