"use client";

// ============================================================
// components/admin/orders/OrderFilters.tsx
// Thanh Lọc Trạng Thái & Tìm Kiếm Đơn Hàng Admin CMS
// ============================================================

import React, { useTransition } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Search, RotateCcw, Filter, CheckCircle2, Clock, Package, Truck, XCircle } from "lucide-react";
import { OrderStatus } from "@prisma/client";

interface OrderFiltersProps {
  counts: Record<string, number>;
}

export const OrderFilters: React.FC<OrderFiltersProps> = ({ counts }) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const currentSearch = searchParams.get("search") || "";
  const currentStatus = searchParams.get("status") || "all";
  const currentPaymentStatus = searchParams.get("paymentStatus") || "all";
  const currentPaymentMethod = searchParams.get("paymentMethod") || "all";
  const currentSortBy = searchParams.get("sortBy") || "createdAt_desc";

  const updateFilters = (updates: Record<string, string>) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", "1"); // Reset về trang 1 khi lọc

    Object.entries(updates).forEach(([key, value]) => {
      if (value === "all" || value === "") {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    });

    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`);
    });
  };

  const handleReset = () => {
    startTransition(() => {
      router.push(pathname);
    });
  };

  const statusTabs: Array<{ id: string; label: string; icon?: React.ElementType; badgeColor?: string }> = [
    { id: "all", label: "Tất cả đơn" },
    { id: "PENDING", label: "Chờ xác nhận", icon: Clock, badgeColor: "bg-amber-500 text-white" },
    { id: "CONFIRMED", label: "Đã xác nhận", icon: CheckCircle2, badgeColor: "bg-blue-600 text-white" },
    { id: "PROCESSING", label: "Đang đóng gói", icon: Package, badgeColor: "bg-indigo-600 text-white" },
    { id: "SHIPPING", label: "Đang giao", icon: Truck, badgeColor: "bg-cyan-600 text-white" },
    { id: "DELIVERED", label: "Đã giao", icon: CheckCircle2, badgeColor: "bg-emerald-600 text-white" },
    { id: "CANCELLED", label: "Đã hủy", icon: XCircle, badgeColor: "bg-rose-600 text-white" },
  ];

  const hasActiveFilters = Boolean(
    currentSearch ||
      currentStatus !== "all" ||
      currentPaymentStatus !== "all" ||
      currentPaymentMethod !== "all" ||
      currentSortBy !== "createdAt_desc"
  );

  return (
    <div className="space-y-3">
      {/* ── Hàng 1: Tabs Trạng Thái Đơn Hàng ──────────────────────── */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {statusTabs.map((tab) => {
          const isActive = currentStatus === tab.id;
          const count = counts[tab.id] || 0;

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => updateFilters({ status: tab.id })}
              disabled={isPending}
              className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
                isActive
                  ? "bg-wine-800 text-white shadow-xs"
                  : "bg-white text-slate-600 hover:bg-slate-50 border border-slate-200/80"
              }`}
            >
              <span>{tab.label}</span>
              {count > 0 && (
                <span
                  className={`text-[11px] px-1.5 py-0.2 rounded-full font-bold ${
                    isActive
                      ? "bg-white/20 text-white"
                      : tab.badgeColor || "bg-slate-100 text-slate-700"
                  }`}
                >
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* ── Hàng 2: Ô Tìm Kiếm & Bộ Lọc Thanh Toán ───────────────── */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          {/* Tìm kiếm */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              defaultValue={currentSearch}
              placeholder="Tìm theo mã đơn (TN-...), tên người nhận hoặc số điện thoại..."
              className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-wine-800/20 focus:border-wine-800"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  updateFilters({ search: (e.target as HTMLInputElement).value });
                }
              }}
              onBlur={(e) => {
                if (e.target.value !== currentSearch) {
                  updateFilters({ search: e.target.value });
                }
              }}
            />
          </div>

          {/* Phương thức thanh toán */}
          <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
            <select
              value={currentPaymentMethod}
              onChange={(e) => updateFilters({ paymentMethod: e.target.value })}
              className="py-2 px-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 bg-white"
            >
              <option value="all">Tất cả phương thức</option>
              <option value="COD">Tiền mặt (COD)</option>
              <option value="VIETQR">Chuyển khoản VietQR</option>
            </select>

            {/* Trạng thái thanh toán */}
            <select
              value={currentPaymentStatus}
              onChange={(e) => updateFilters({ paymentStatus: e.target.value })}
              className="py-2 px-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 bg-white"
            >
              <option value="all">Tất cả thanh toán</option>
              <option value="PAID">Đã thanh toán</option>
              <option value="PENDING">Chưa thanh toán</option>
              <option value="FAILED">Thanh toán lỗi</option>
            </select>

            {/* Sắp xếp */}
            <select
              value={currentSortBy}
              onChange={(e) => updateFilters({ sortBy: e.target.value })}
              className="py-2 px-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 bg-white"
            >
              <option value="createdAt_desc">Mới nhất</option>
              <option value="createdAt_asc">Cũ nhất</option>
              <option value="total_desc">Giá trị cao nhất</option>
              <option value="total_asc">Giá trị thấp nhất</option>
            </select>

            {/* Nút reset */}
            {hasActiveFilters && (
              <button
                type="button"
                onClick={handleReset}
                disabled={isPending}
                className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:text-wine-800 hover:bg-slate-50 transition-colors shrink-0"
                title="Xóa bộ lọc"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Xóa lọc</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
