"use client";

// ============================================================
// components/storefront/air-cargo/FlightMilestoneTimeline.tsx
// Tiến Trình Mốc Hành Trình Chuyến Bay Air Cargo (Phase 20)
// ============================================================

import React from "react";
import { Check, Clock, MapPin, Plane, ShieldCheck } from "lucide-react";

export interface FlightMilestoneItem {
  id: string;
  stepNumber: number;
  title: string;
  locationName: string;
  timestamp: string | Date;
  isCompleted: boolean;
  notes?: string | null;
}

interface FlightMilestoneTimelineProps {
  milestones: FlightMilestoneItem[];
}

export const FlightMilestoneTimeline: React.FC<FlightMilestoneTimelineProps> = ({
  milestones,
}) => {
  const sorted = [...milestones].sort((a, b) => a.stepNumber - b.stepNumber);

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6 font-sans">
      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#800028] text-white flex items-center justify-center">
            <Plane className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-black text-base text-slate-900 tracking-tight">
              Nhật Ký Mốc Hành Trình Hàng Không
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Toàn bộ tiến trình vận chuyển khép kín từ Úc về Việt Nam
            </p>
          </div>
        </div>

        <span className="text-xs font-bold text-slate-400">
          5 Bước Khép Kín
        </span>
      </div>

      <div className="relative pl-6 sm:pl-8 space-y-6 before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
        {sorted.map((m, idx) => {
          const isDone = m.isCompleted;
          const isCurrent = !isDone && (idx === 0 || sorted[idx - 1]?.isCompleted);

          return (
            <div key={m.id} className="relative group">
              {/* Bullet Node */}
              <div
                className={`absolute -left-6 sm:-left-8 top-1 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                  isDone
                    ? "bg-emerald-600 text-white shadow-xs"
                    : isCurrent
                    ? "bg-sky-500 text-white ring-4 ring-sky-100 animate-pulse"
                    : "bg-slate-200 text-slate-400"
                }`}
              >
                {isDone ? (
                  <Check className="w-3.5 h-3.5" />
                ) : (
                  <span>{m.stepNumber}</span>
                )}
              </div>

              {/* Content Box */}
              <div
                className={`p-4 rounded-2xl border transition-all ${
                  isDone
                    ? "bg-emerald-50/40 border-emerald-100"
                    : isCurrent
                    ? "bg-sky-50/40 border-sky-200 shadow-xs"
                    : "bg-slate-50/50 border-slate-100"
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <h4 className="font-extrabold text-xs sm:text-sm text-slate-900">
                    {m.title}
                  </h4>

                  <span className="text-[11px] font-mono text-slate-400 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>
                      {new Date(m.timestamp).toLocaleString("vi-VN", {
                        hour: "2-digit",
                        minute: "2-digit",
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                      })}
                    </span>
                  </span>
                </div>

                <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1">
                  <MapPin className="w-3.5 h-3.5 text-[#800028] shrink-0" />
                  <span className="font-medium">{m.locationName}</span>
                </div>

                {m.notes && (
                  <p className="text-[11px] text-slate-600 mt-2 pt-2 border-t border-slate-200/50 italic">
                    Ghi chú: {m.notes}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
