"use client";

// ============================================================
// components/storefront/loyalty/MemberPointsHistory.tsx
// Lịch Sử Biến Động Điểm Tích Lũy Hội Viên (Module 10.4)
// ============================================================

import React, { useState } from "react";
import Link from "next/link";
import {
  Clock,
  ArrowUpRight,
  ArrowDownLeft,
  Package,
  Gift,
  Coins,
  Award,
} from "lucide-react";
import type { LoyaltyTransactionEntry } from "./types";

interface MemberPointsHistoryProps {
  transactions: LoyaltyTransactionEntry[];
}

export const MemberPointsHistory: React.FC<MemberPointsHistoryProps> = ({
  transactions,
}) => {
  const [filterTab, setFilterTab] = useState<"ALL" | "EARN" | "REDEEM">("ALL");

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

  const filteredTransactions = transactions.filter((t) => {
    if (filterTab === "EARN") return t.points > 0;
    if (filterTab === "REDEEM") return t.points < 0;
    return true;
  });

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "EARN_ORDER":
        return Package;
      case "REDEEM_VOUCHER":
        return Gift;
      case "REDEEM_ORDER":
        return Coins;
      case "ADMIN_ADJUST":
      case "SIGNUP_BONUS":
      default:
        return Award;
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200/80 p-5 sm:p-6 shadow-xs space-y-4">
      {/* Header & Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
        <div>
          <h3 className="text-base font-black text-slate-800 flex items-center gap-2">
            <Clock className="w-5 h-5 text-[#800028]" />
            <span>Lịch Sử Điểm Tích Lũy</span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Chi tiết các giao dịch cộng và trừ điểm trong tài khoản của bạn
          </p>
        </div>

        {/* Tabs Lọc */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-2xl self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setFilterTab("ALL")}
            className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
              filterTab === "ALL"
                ? "bg-white text-slate-800 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Tất cả ({transactions.length})
          </button>
          <button
            type="button"
            onClick={() => setFilterTab("EARN")}
            className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
              filterTab === "EARN"
                ? "bg-white text-emerald-700 shadow-xs"
                : "text-slate-600 hover:text-emerald-700"
            }`}
          >
            Điểm cộng (+)
          </button>
          <button
            type="button"
            onClick={() => setFilterTab("REDEEM")}
            className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
              filterTab === "REDEEM"
                ? "bg-white text-rose-700 shadow-xs"
                : "text-slate-600 hover:text-rose-700"
            }`}
          >
            Đã đổi (-)
          </button>
        </div>
      </div>

      {/* Danh sách giao dịch */}
      {filteredTransactions.length === 0 ? (
        <div className="py-10 text-center">
          <Clock className="w-10 h-10 text-slate-300 mx-auto" />
          <p className="mt-2 text-xs font-semibold text-slate-600">
            Không có giao dịch điểm nào trong danh mục này
          </p>
          <p className="text-[11px] text-slate-400 mt-0.5">
            Hãy tiếp tục mua sắm các sản phẩm chính hãng để tích lũy điểm thưởng!
          </p>
        </div>
      ) : (
        <div className="divide-y divide-slate-100">
          {filteredTransactions.map((tx) => {
            const isPositive = tx.points > 0;
            const TypeIcon = getTypeIcon(tx.type);

            return (
              <div
                key={tx.id}
                className="py-3.5 flex items-center justify-between gap-3 hover:bg-slate-50/50 rounded-2xl px-2 transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 ${
                      isPositive
                        ? "bg-emerald-50 text-emerald-600 border border-emerald-100"
                        : "bg-rose-50 text-[#800028] border border-rose-100"
                    }`}
                  >
                    <TypeIcon className="w-5 h-5" />
                  </div>

                  <div className="min-w-0">
                    <p className="text-xs font-bold text-slate-800 truncate">
                      {tx.description}
                    </p>
                    <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                      <span className="text-[11px] text-slate-400">
                        {formatDate(tx.createdAt)}
                      </span>
                      {tx.order && (
                        <Link
                          href={`/tai-khoan/don-hang/${tx.order.orderNumber}`}
                          className="text-[11px] text-[#800028] font-semibold hover:underline"
                        >
                          Xem đơn #{tx.order.orderNumber}
                        </Link>
                      )}
                    </div>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span
                    className={`inline-flex items-center gap-0.5 text-sm font-mono font-black ${
                      isPositive ? "text-emerald-600" : "text-rose-600"
                    }`}
                  >
                    {isPositive ? (
                      <>
                        <ArrowUpRight className="w-4 h-4 stroke-[2.5]" />
                        +{tx.points.toLocaleString("vi-VN")}
                      </>
                    ) : (
                      <>
                        <ArrowDownLeft className="w-4 h-4 stroke-[2.5]" />
                        {tx.points.toLocaleString("vi-VN")}
                      </>
                    )}
                    <span className="text-[10px] font-sans font-bold text-slate-500 ml-0.5">
                      pts
                    </span>
                  </span>
                  <p className="text-[11px] text-slate-400 font-mono mt-0.5">
                    Số dư: {tx.balanceAfter.toLocaleString("vi-VN")} pts
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
