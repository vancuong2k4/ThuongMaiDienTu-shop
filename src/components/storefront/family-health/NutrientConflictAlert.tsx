"use client";

// ============================================================
// components/storefront/family-health/NutrientConflictAlert.tsx
// Cảnh Báo Đối Kháng Vi Chất Chuẩn Dược Sĩ THUYNGA Shop (Phase 22)
// ============================================================

import React from "react";
import { AlertTriangle, Stethoscope, ArrowRight } from "lucide-react";
import type { ConflictAlert } from "@/lib/family-health";

interface NutrientConflictAlertProps {
  alerts: ConflictAlert[];
}

export const NutrientConflictAlert: React.FC<NutrientConflictAlertProps> = ({
  alerts,
}) => {
  if (alerts.length === 0) return null;

  return (
    <div className="space-y-3">
      {alerts.map((alert, idx) => (
        <div
          key={idx}
          className="bg-amber-50/90 border-2 border-amber-300/80 rounded-2xl p-4 sm:p-5 shadow-xs flex flex-col sm:flex-row items-start gap-3.5"
        >
          <div className="w-9 h-9 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-xs">
            <AlertTriangle className="w-5 h-5" />
          </div>

          <div className="space-y-1.5 flex-1">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-wider bg-amber-200/80 text-amber-900 px-2 py-0.5 rounded-md">
                Cảnh Báo Tương Tác Vi Chất
              </span>
              <span className="text-xs font-bold text-amber-900">
                {alert.title}
              </span>
            </div>

            <p className="text-xs text-amber-800 leading-relaxed font-sans">
              {alert.message}
            </p>

            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="text-[11px] font-bold text-slate-500">
                Sản phẩm liên đới:
              </span>
              {alert.conflictingItems.map((item, i) => (
                <span
                  key={i}
                  className="text-[11px] font-bold text-slate-800 bg-white px-2 py-0.5 rounded-md border border-amber-200"
                >
                  {item}
                </span>
              ))}
            </div>

            <div className="pt-1.5 flex items-center gap-1.5 text-[11px] font-bold text-[#800028]">
              <Stethoscope className="w-3.5 h-3.5" />
              <span>Chỉ định Dược sĩ: Tách cữ uống cách nhau ít nhất 2 giờ.</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
