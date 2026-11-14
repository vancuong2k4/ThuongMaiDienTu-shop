"use client";

// ============================================================
// components/storefront/family-health/SupplementClockTimeline.tsx
// Đồng Hồ Sinh Học Lịch Uống Vi Chất Theo Cữ Trong Ngày (Phase 22)
// ============================================================

import React from "react";
import Link from "next/link";
import {
  Clock,
  CheckCircle2,
  Check,
  AlertCircle,
  Plus,
  ShoppingBag,
  RotateCcw,
  ShieldCheck,
} from "lucide-react";
import type { TimeSlotGroup, ScheduleWithStatus } from "@/lib/family-health";

interface SupplementClockTimelineProps {
  timeSlotGroups: TimeSlotGroup[];
  onToggleIntake: (scheduleId: string, currentStatus: string) => void;
  onOpenAddSchedule: () => void;
  loadingScheduleId?: string | null;
}

export const SupplementClockTimeline: React.FC<SupplementClockTimelineProps> = ({
  timeSlotGroups,
  onToggleIntake,
  onOpenAddSchedule,
  loadingScheduleId,
}) => {
  if (timeSlotGroups.length === 0) {
    return (
      <div className="bg-white rounded-3xl border border-neutral-200/90 p-10 text-center space-y-3">
        <div className="w-12 h-12 rounded-2xl bg-rose-50 text-[#800028] flex items-center justify-center mx-auto shadow-xs">
          <Clock className="w-6 h-6" />
        </div>
        <h3 className="font-bold text-slate-800 text-sm">
          Chưa thiết lập lịch uống vi chất cho thành viên này
        </h3>
        <p className="text-xs text-slate-500 max-w-sm mx-auto">
          Tạo lịch uống hàng ngày (Sữa Úc, Vitamin D3, Canxi, Sắt, Dầu cá DHA) để hệ thống tự động nhắc nhở và cảnh báo tương tác vi chất.
        </p>
        <button
          type="button"
          onClick={onOpenAddSchedule}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#800028] text-white font-bold text-xs hover:bg-[#660020] transition-colors mt-2 cursor-pointer shadow-xs"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Thêm vi chất vào lịch uống</span>
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {timeSlotGroups.map((group) => (
        <div
          key={group.slot}
          className="bg-white rounded-3xl border border-neutral-200/90 shadow-xs overflow-hidden"
        >
          {/* Slot Header */}
          <div className="p-4 sm:p-5 bg-gradient-to-r from-slate-900 to-slate-800 text-white flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-white/10 text-amber-300 flex items-center justify-center">
                <Clock className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-black text-xs sm:text-sm tracking-wide uppercase">
                  {group.label}
                </h3>
                <p className="text-[11px] text-slate-300 hidden sm:block">
                  {group.description}
                </p>
              </div>
            </div>

            <span className="font-mono text-xs font-bold text-amber-300 bg-white/10 px-2.5 py-0.5 rounded-lg border border-white/10">
              {group.typicalHours}
            </span>
          </div>

          {/* Slot Items List */}
          <div className="divide-y divide-neutral-100 p-2 sm:p-3">
            {group.items.map((item) => {
              const isTaken = item.todayLog?.status === "TAKEN";
              const isLoading = loadingScheduleId === item.id;

              return (
                <div
                  key={item.id}
                  className={`p-3.5 sm:p-4 rounded-2xl transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                    isTaken
                      ? "bg-emerald-50/50 border border-emerald-200/60"
                      : "hover:bg-neutral-50/80"
                  }`}
                >
                  {/* Left: Time & Product Info */}
                  <div className="flex items-start gap-3">
                    <div className="font-mono font-black text-xs sm:text-sm text-[#800028] bg-rose-50 px-2.5 py-1.5 rounded-xl border border-rose-100 shrink-0">
                      {item.timeString}
                    </div>

                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className="font-bold text-xs sm:text-sm text-slate-900">
                          {item.customItemName}
                        </span>
                        {item.brandName && (
                          <span className="text-[10px] font-semibold bg-neutral-100 text-slate-600 px-1.5 py-0.2 rounded">
                            {item.brandName}
                          </span>
                        )}
                      </div>

                      <div className="text-xs text-slate-600 font-medium">
                        Liều dùng: <strong className="text-slate-800">{item.dosageText}</strong>
                      </div>

                      {item.notes && (
                        <p className="text-[11px] text-slate-400 italic">
                          Lưu ý: {item.notes}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Right: Servings & Checkbox Button */}
                  <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-neutral-100">
                    {/* Remaining Pill */}
                    <div className="text-right">
                      <span
                        className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-md inline-block ${
                          item.restockStatus === "URGENT"
                            ? "bg-rose-100 text-rose-800 border border-rose-200"
                            : item.restockStatus === "WARNING"
                            ? "bg-amber-100 text-amber-800 border border-amber-200"
                            : "bg-neutral-100 text-slate-600"
                        }`}
                      >
                        Còn {item.servingsRemaining} liều (~{item.daysRemaining} ngày)
                      </span>
                    </div>

                    {/* Interactive Button */}
                    {isTaken ? (
                      <button
                        type="button"
                        onClick={() => onToggleIntake(item.id, "TAKEN")}
                        disabled={isLoading}
                        title="Bấm để hoàn tác nếu ghi nhận nhầm"
                        className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-emerald-600 text-white font-bold text-xs shadow-xs hover:bg-emerald-700 transition-colors cursor-pointer"
                      >
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                        <span>Đã uống</span>
                        <RotateCcw className="w-3 h-3 text-emerald-200 ml-1 opacity-60 hover:opacity-100" />
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => onToggleIntake(item.id, "SCHEDULED")}
                        disabled={isLoading}
                        className="flex items-center gap-1 px-4 py-1.5 rounded-xl border-2 border-slate-300 hover:border-[#800028] bg-white hover:bg-rose-50/60 text-slate-700 hover:text-[#800028] font-bold text-xs transition-all shadow-xs cursor-pointer"
                      >
                        <div className="w-3.5 h-3.5 rounded border border-slate-400" />
                        <span>{isLoading ? "Đang lưu..." : "Uống cữ này"}</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};
