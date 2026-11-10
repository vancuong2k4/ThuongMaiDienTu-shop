"use client";

// ============================================================
// components/admin/loyalty/LoyaltyTable.tsx
// Bảng Sổ Cái Giao Dịch Tích Điểm & Đổi Quà (Module 10.3)
// ============================================================

import React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Award,
  Crown,
  Gift,
  Coins,
  Package,
  ArrowUpRight,
  ArrowDownLeft,
  ChevronLeft,
  ChevronRight,
  ShieldAlert,
  Sparkles,
} from "lucide-react";
import type { LoyaltyTransactionItem } from "./types";

interface LoyaltyTableProps {
  transactions: LoyaltyTransactionItem[];
  isLoading: boolean;
  currentPage: number;
  totalPages: number;
  totalItems: number;
  onPageChange: (page: number) => void;
}

const TIER_BADGES: Record<
  string,
  { label: string; bg: string; text: string; border: string }
> = {
  BRONZE: {
    label: "Đồng",
    bg: "bg-amber-50",
    text: "text-amber-900",
    border: "border-amber-200",
  },
  SILVER: {
    label: "Bạc",
    bg: "bg-slate-100",
    text: "text-slate-800",
    border: "border-slate-200",
  },
  GOLD: {
    label: "Vàng",
    bg: "bg-yellow-50",
    text: "text-yellow-800",
    border: "border-yellow-200",
  },
  DIAMOND: {
    label: "Kim Cương",
    bg: "bg-purple-50",
    text: "text-purple-800",
    border: "border-purple-200",
  },
};

const TYPE_CONFIG: Record<
  string,
  { label: string; icon: React.ComponentType<{ className?: string }>; color: string }
> = {
  EARN_ORDER: {
    label: "Tích điểm đơn",
    icon: Package,
    color: "bg-emerald-50 text-emerald-700 border-emerald-200",
  },
  REDEEM_VOUCHER: {
    label: "Đổi voucher",
    icon: Gift,
    color: "bg-rose-50 text-[#800028] border-rose-200",
  },
  REDEEM_ORDER: {
    label: "Trừ điểm checkout",
    icon: Coins,
    color: "bg-amber-50 text-amber-800 border-amber-200",
  },
  ADMIN_ADJUST: {
    label: "Admin điều chỉnh",
    icon: Award,
    color: "bg-blue-50 text-blue-700 border-blue-200",
  },
  SIGNUP_BONUS: {
    label: "Thưởng chào mừng",
    icon: Award,
    color: "bg-purple-50 text-purple-700 border-purple-200",
  },
};

export const LoyaltyTable: React.FC<LoyaltyTableProps> = ({
  transactions,
  isLoading,
  currentPage,
  totalPages,
  totalItems,
  onPageChange,
}) => {
  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleString("vi-VN", {
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

  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200/80 p-8 shadow-xs text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-slate-200 border-t-[#800028]" />
        <p className="mt-3 text-xs text-slate-500 font-medium">
          Đang tải sổ cái giao dịch tích điểm...
        </p>
      </div>
    );
  }

  if (transactions.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200/80 p-12 text-center shadow-xs">
        <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
          <Award className="w-8 h-8" />
        </div>
        <h3 className="mt-4 text-sm font-bold text-slate-800">
          Không tìm thấy giao dịch tích điểm nào
        </h3>
        <p className="mt-1 text-xs text-slate-500 max-w-sm mx-auto">
          Chưa có giao dịch phù hợp với điều kiện tìm kiếm hoặc bộ lọc hiện tại.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-200/80 bg-slate-50/75 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              <th className="py-3 px-4">Thời gian</th>
              <th className="py-3 px-4">Khách hàng</th>
              <th className="py-3 px-4">Loại giao dịch</th>
              <th className="py-3 px-4 text-right">Biến động</th>
              <th className="py-3 px-4 text-right">Số dư sau</th>
              <th className="py-3 px-4">Diễn giải & Đơn hàng</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs">
            {transactions.map((tx) => {
              const tierBadge =
                TIER_BADGES[tx.user.membershipTier] || TIER_BADGES.BRONZE;
              const typeConfig =
                TYPE_CONFIG[tx.type] || TYPE_CONFIG.ADMIN_ADJUST;
              const TypeIcon = typeConfig.icon;
              const isPositive = tx.points > 0;

              return (
                <tr
                  key={tx.id}
                  className="hover:bg-slate-50/50 transition-colors"
                >
                  {/* 1. Thời gian */}
                  <td className="py-3.5 px-4 text-slate-500 whitespace-nowrap text-[11px]">
                    {formatDate(tx.createdAt)}
                  </td>

                  {/* 2. Khách hàng */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3 min-w-[200px]">
                      <div className="w-9 h-9 rounded-full bg-slate-100 border border-slate-200 overflow-hidden shrink-0 flex items-center justify-center font-bold text-xs text-slate-600">
                        {tx.user.avatar ? (
                          <Image
                            src={tx.user.avatar}
                            alt={tx.user.name}
                            width={36}
                            height={36}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          (tx.user.name || "U")[0]?.toUpperCase()
                        )}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <Link
                            href={`/admin/khach-hang/${tx.user.id}`}
                            className="font-bold text-slate-800 hover:text-[#800028] transition-colors truncate"
                          >
                            {tx.user.name}
                          </Link>
                          <span
                            className={`inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-semibold border ${tierBadge.bg} ${tierBadge.text} ${tierBadge.border}`}
                          >
                            <Crown className="w-2.5 h-2.5" />
                            {tierBadge.label}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 truncate">
                          {tx.user.email}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* 3. Loại giao dịch */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold border ${typeConfig.color}`}
                    >
                      <TypeIcon className="w-3.5 h-3.5" />
                      {typeConfig.label}
                    </span>
                  </td>

                  {/* 4. Số điểm biến động */}
                  <td className="py-3.5 px-4 text-right whitespace-nowrap font-mono">
                    <span
                      className={`inline-flex items-center gap-0.5 font-bold ${
                        isPositive ? "text-emerald-600" : "text-rose-600"
                      }`}
                    >
                      {isPositive ? (
                        <>
                          <ArrowUpRight className="w-3.5 h-3.5 stroke-[2.5]" />
                          +{tx.points.toLocaleString("vi-VN")}
                        </>
                      ) : (
                        <>
                          <ArrowDownLeft className="w-3.5 h-3.5 stroke-[2.5]" />
                          {tx.points.toLocaleString("vi-VN")}
                        </>
                      )}
                      <span className="text-[10px] font-normal text-slate-500 ml-0.5">
                        điểm
                      </span>
                    </span>
                  </td>

                  {/* 5. Số dư sau giao dịch */}
                  <td className="py-3.5 px-4 text-right whitespace-nowrap font-mono font-semibold text-slate-700">
                    {tx.balanceAfter.toLocaleString("vi-VN")}{" "}
                    <span className="text-[10px] text-slate-400 font-normal">
                      pts
                    </span>
                  </td>

                  {/* 6. Diễn giải & Đơn hàng */}
                  <td className="py-3.5 px-4 max-w-xs">
                    <p className="text-slate-700 text-xs truncate">
                      {tx.description}
                    </p>
                    {tx.order && (
                      <Link
                        href={`/admin/don-hang/${tx.order.id}`}
                        className="inline-flex items-center gap-1 text-[11px] text-[#800028] hover:underline font-semibold mt-0.5"
                      >
                        Đơn #{tx.order.orderNumber} (
                        {tx.order.total.toLocaleString("vi-VN")} ₫)
                      </Link>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Phân trang */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-4 py-3 border-t border-slate-100 bg-slate-50/50">
          <p className="text-xs text-slate-500">
            Hiển thị trang <span className="font-semibold">{currentPage}</span>{" "}
            / <span className="font-semibold">{totalPages}</span> (Tổng{" "}
            <span className="font-semibold">{totalItems}</span> giao dịch)
          </p>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              disabled={currentPage <= 1}
              onClick={() => onPageChange(currentPage - 1)}
              className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <span className="px-3 py-1 rounded-lg bg-white border border-slate-200 text-xs font-semibold text-slate-700">
              {currentPage}
            </span>

            <button
              type="button"
              disabled={currentPage >= totalPages}
              onClick={() => onPageChange(currentPage + 1)}
              className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
