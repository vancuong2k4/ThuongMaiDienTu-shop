"use client";

// ============================================================
// components/admin/dashboard/DashboardFilter.tsx
// Thanh lọc khoảng thời gian báo cáo cho Admin Dashboard
// ============================================================

import React, { useTransition } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Calendar, RotateCw } from "lucide-react";
import type { TimeRange } from "@/lib/services/analytics";

interface DashboardFilterProps {
  currentRange: TimeRange;
}

export const DashboardFilter: React.FC<DashboardFilterProps> = ({
  currentRange,
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const handleRangeChange = (range: TimeRange) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("range", range);
    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`);
    });
  };

  const handleRefresh = () => {
    startTransition(() => {
      router.refresh();
    });
  };

  const filters: Array<{ id: TimeRange; label: string }> = [
    { id: "today", label: "Hôm nay" },
    { id: "7days", label: "7 ngày qua" },
    { id: "30days", label: "30 ngày qua" },
    { id: "all", label: "Toàn thời gian" },
  ];

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-2 sm:p-2.5 rounded-2xl border border-slate-200/80 shadow-xs">
      {/* Time filter buttons */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
        <div className="px-2.5 py-1 text-slate-500 flex items-center gap-1.5 text-xs font-semibold shrink-0">
          <Calendar className="w-3.5 h-3.5 text-slate-400" />
          <span>Kỳ báo cáo:</span>
        </div>

        {filters.map((f) => {
          const isActive = currentRange === f.id;
          return (
            <button
              key={f.id}
              type="button"
              onClick={() => handleRangeChange(f.id)}
              disabled={isPending}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                isActive
                  ? "bg-wine-800 text-white shadow-xs"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              }`}
            >
              {f.label}
            </button>
          );
        })}
      </div>

      {/* Refresh button */}
      <div className="flex items-center gap-2 justify-end shrink-0 px-2 sm:px-0">
        <button
          type="button"
          onClick={handleRefresh}
          disabled={isPending}
          title="Làm mới dữ liệu số liệu"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-600 hover:text-wine-800 hover:bg-slate-50 border border-slate-200 transition-colors disabled:opacity-50"
        >
          <RotateCw
            className={`w-3.5 h-3.5 ${isPending ? "animate-spin text-wine-700" : ""}`}
          />
          <span className="hidden sm:inline">Làm mới</span>
        </button>
      </div>
    </div>
  );
};
