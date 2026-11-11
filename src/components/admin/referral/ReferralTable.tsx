"use client";

// ============================================================
// components/admin/referral/ReferralTable.tsx
// Bảng Quản Trị Theo Dõi Tiếp Thị Giới Thiệu (Stage 12.3)
// ============================================================

import React, { useState } from "react";
import Link from "next/link";
import {
  Users,
  Gift,
  Award,
  Clock,
  Truck,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Package,
} from "lucide-react";
import type { AdminReferralRecordItem, ReferralStatusType } from "./types";

interface ReferralTableProps {
  records: AdminReferralRecordItem[];
  isLoading: boolean;
  currentPage: number;
  totalPages: number;
  totalItems: number;
  onPageChange: (page: number) => void;
}

const STATUS_BADGE: Record<
  ReferralStatusType,
  { label: string; bg: string; text: string; border: string; icon: React.ElementType }
> = {
  PENDING: {
    label: "Chờ đơn đầu",
    bg: "bg-amber-50",
    text: "text-amber-800",
    border: "border-amber-200",
    icon: Clock,
  },
  QUALIFIED: {
    label: "Đang giao đơn",
    bg: "bg-blue-50",
    text: "text-blue-800",
    border: "border-blue-200",
    icon: Truck,
  },
  REWARDED: {
    label: "Đã trả thưởng",
    bg: "bg-emerald-50",
    text: "text-emerald-800",
    border: "border-emerald-200",
    icon: CheckCircle2,
  },
  EXPIRED: {
    label: "Hết hạn",
    bg: "bg-slate-100",
    text: "text-slate-600",
    border: "border-slate-200",
    icon: AlertCircle,
  },
};

const TIER_BADGES: Record<
  string,
  { label: string; bg: string; text: string }
> = {
  BRONZE: { label: "Đồng", bg: "bg-amber-100", text: "text-amber-900" },
  SILVER: { label: "Bạc", bg: "bg-slate-200", text: "text-slate-800" },
  GOLD: { label: "Vàng", bg: "bg-yellow-200", text: "text-yellow-900" },
  DIAMOND: { label: "Kim Cương", bg: "bg-purple-100", text: "text-purple-900" },
};

export const ReferralTable: React.FC<ReferralTableProps> = ({
  records,
  isLoading,
  currentPage,
  totalPages,
  totalItems,
  onPageChange,
}) => {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200/80 p-12 text-center shadow-xs">
        <div className="w-10 h-10 border-3 border-[#800028]/20 border-t-[#800028] rounded-full animate-spin mx-auto mb-4" />
        <p className="text-sm font-medium text-slate-500">
          Đang tải dữ liệu tiếp thị giới thiệu...
        </p>
      </div>
    );
  }

  if (records.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200/80 p-12 text-center shadow-xs">
        <div className="w-14 h-14 rounded-2xl bg-rose-50 text-[#800028] flex items-center justify-center mx-auto mb-3">
          <Users className="w-7 h-7" />
        </div>
        <h3 className="text-base font-bold text-slate-800">
          Không tìm thấy liên kết giới thiệu nào
        </h3>
        <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
          Chưa có lượt mời nào phù hợp với bộ lọc hiện tại hoặc chưa có người dùng nào chia sẻ mã mời.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs sm:text-sm">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 text-xs uppercase font-bold tracking-wider">
            <tr>
              <th className="py-3.5 px-4">Người Giới Thiệu</th>
              <th className="py-3.5 px-4">Bạn Mới Được Mời</th>
              <th className="py-3.5 px-4">Trạng Thái</th>
              <th className="py-3.5 px-4">Voucher Bạn Mới</th>
              <th className="py-3.5 px-4">Đơn Hàng Kích Hoạt</th>
              <th className="py-3.5 px-4">Thưởng Người Mời</th>
              <th className="py-3.5 px-4">Thời Gian</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {records.map((rec) => {
              const statusCfg = STATUS_BADGE[rec.status] || STATUS_BADGE.PENDING;
              const StatusIcon = statusCfg.icon;
              const tierCfg =
                rec.referrer.membershipTier &&
                TIER_BADGES[rec.referrer.membershipTier]
                  ? TIER_BADGES[rec.referrer.membershipTier]
                  : null;

              return (
                <tr key={rec.id} className="hover:bg-slate-50/80 transition-colors">
                  {/* Người giới thiệu */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-full bg-rose-100 text-[#800028] flex items-center justify-center font-bold text-xs shrink-0">
                        {rec.referrer.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="font-semibold text-slate-900 truncate">
                            {rec.referrer.name}
                          </span>
                          {tierCfg && (
                            <span
                              className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${tierCfg.bg} ${tierCfg.text}`}
                            >
                              {tierCfg.label}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-500 truncate">
                          {rec.referrer.email || "Chưa có email"}
                        </p>
                        {rec.referrer.referralCode && (
                          <span className="inline-block mt-0.5 font-mono text-[11px] text-[#800028] font-bold">
                            Mã: {rec.referrer.referralCode}
                          </span>
                        )}
                      </div>
                    </div>
                  </td>

                  {/* Bạn mới được mời */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs shrink-0">
                        {rec.referee.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-slate-900 truncate">
                          {rec.referee.name}
                        </p>
                        <p className="text-xs text-slate-500 truncate">
                          {rec.referee.email || "Chưa có email"}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Trạng thái */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold border ${statusCfg.bg} ${statusCfg.text} ${statusCfg.border}`}
                    >
                      <StatusIcon className="w-3.5 h-3.5" />
                      {statusCfg.label}
                    </span>
                  </td>

                  {/* Voucher bạn mới */}
                  <td className="py-3.5 px-4">
                    {rec.voucherCode ? (
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono text-xs font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                          {rec.voucherCode}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleCopy(rec.voucherCode!)}
                          title="Sao chép mã voucher"
                          className="p-1 text-slate-400 hover:text-slate-700 rounded transition-colors"
                        >
                          {copiedCode === rec.voucherCode ? (
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                    ) : (
                      <span className="text-xs text-slate-400">—</span>
                    )}
                  </td>

                  {/* Đơn hàng kích hoạt */}
                  <td className="py-3.5 px-4">
                    {rec.order ? (
                      <div className="min-w-0">
                        <Link
                          href={`/admin/don-hang?search=${rec.order.orderNumber}`}
                          className="inline-flex items-center gap-1 font-semibold text-[#800028] hover:underline"
                        >
                          <Package className="w-3.5 h-3.5" />
                          {rec.order.orderNumber}
                        </Link>
                        <p className="text-xs text-slate-600 font-medium">
                          {rec.order.total.toLocaleString("vi-VN")} ₫
                        </p>
                      </div>
                    ) : (
                      <span className="text-xs text-slate-400 italic">
                        Chưa phát sinh
                      </span>
                    )}
                  </td>

                  {/* Thưởng người mời */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <div className="flex items-center gap-1 font-bold text-emerald-700">
                      <Award className="w-4 h-4 text-emerald-600" />
                      +{rec.rewardPoints.toLocaleString("vi-VN")} pts
                    </div>
                    {rec.status === "REWARDED" && rec.rewardedAt && (
                      <span className="text-[11px] text-slate-400 block">
                        Đã cộng điểm
                      </span>
                    )}
                  </td>

                  {/* Thời gian */}
                  <td className="py-3.5 px-4 text-slate-500 text-xs whitespace-nowrap">
                    {new Date(rec.createdAt).toLocaleDateString("vi-VN", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                    })}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Phân trang */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-4 py-3 bg-slate-50 border-t border-slate-200">
          <p className="text-xs text-slate-500">
            Hiển thị trang <span className="font-semibold text-slate-800">{currentPage}</span> /{" "}
            <span className="font-semibold text-slate-800">{totalPages}</span> (Tổng cộng{" "}
            <span className="font-semibold text-slate-800">{totalItems}</span> lượt mời)
          </p>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              disabled={currentPage <= 1}
              onClick={() => onPageChange(currentPage - 1)}
              className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => {
              // Only display first, last, and window around current
              if (
                p === 1 ||
                p === totalPages ||
                (p >= currentPage - 1 && p <= currentPage + 1)
              ) {
                return (
                  <button
                    key={p}
                    type="button"
                    onClick={() => onPageChange(p)}
                    className={`min-w-8 h-8 px-2 rounded-lg text-xs font-bold transition-all ${
                      p === currentPage
                        ? "bg-[#800028] text-white shadow-xs"
                        : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-100"
                    }`}
                  >
                    {p}
                  </button>
                );
              }
              if (p === currentPage - 2 || p === currentPage + 2) {
                return (
                  <span key={p} className="text-xs text-slate-400 px-1">
                    ...
                  </span>
                );
              }
              return null;
            })}

            <button
              type="button"
              disabled={currentPage >= totalPages}
              onClick={() => onPageChange(currentPage + 1)}
              className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
