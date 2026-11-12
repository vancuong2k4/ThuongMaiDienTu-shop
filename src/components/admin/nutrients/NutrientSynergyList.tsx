"use client";

// ============================================================
// components/admin/nutrients/NutrientSynergyList.tsx
// Danh Sách Quy Tắc Hiệp Đồng & Cảnh Báo An Toàn Dược Sĩ (Phase 19)
// ============================================================

import React from "react";
import {
  Stethoscope,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ArrowRight,
} from "lucide-react";
import { SynergyType } from "@prisma/client";
import { SYNERGY_TYPE_CONFIG } from "@/lib/validations/comparison";

export interface AdminSynergyItem {
  id: string;
  synergyType: SynergyType;
  title: string;
  description: string;
  pharmacistRecommendation: string | null;
  primaryNutrient: {
    code: string;
    nameVi: string;
    unit: string;
  };
  secondaryNutrient: {
    code: string;
    nameVi: string;
    unit: string;
  };
}

interface NutrientSynergyListProps {
  synergies: AdminSynergyItem[];
}

export const NutrientSynergyList: React.FC<NutrientSynergyListProps> = ({
  synergies,
}) => {
  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 shadow-2xs p-5 sm:p-6 space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div>
          <h3 className="font-extrabold text-sm sm:text-base text-slate-900">
            Quy Tắc Tương Tác & Hiệp Đồng Dược Sĩ Đã Thiết Lập
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Hệ thống tự động kích hoạt khi khách hàng so sánh các sản phẩm có chứa cặp vi chất tương ứng
          </p>
        </div>
        <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
          {synergies.length} Quy Tắc
        </span>
      </div>

      <div className="grid grid-cols-1 gap-3">
        {synergies.map((rule) => {
          const cfg =
            SYNERGY_TYPE_CONFIG[rule.synergyType] ||
            SYNERGY_TYPE_CONFIG[SynergyType.NEUTRAL];

          return (
            <div
              key={rule.id}
              className={`p-4 rounded-2xl border ${cfg.bgClass} ${cfg.borderClass} space-y-2.5 transition-all`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span
                    className={`text-[10px] font-black px-2.5 py-0.5 rounded uppercase tracking-wider bg-white/80 border ${cfg.textClass}`}
                  >
                    {cfg.badgeText}
                  </span>
                  <h4 className={`font-extrabold text-xs sm:text-sm ${cfg.textClass}`}>
                    {rule.title}
                  </h4>
                </div>

                {/* Pair indicators */}
                <div className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-700 bg-white/90 px-2.5 py-1 rounded-xl border border-slate-200">
                  <span className="text-indigo-700 font-mono">
                    {rule.primaryNutrient.code}
                  </span>
                  <ArrowRight className="w-3 h-3 text-slate-400" />
                  <span className="text-purple-700 font-mono">
                    {rule.secondaryNutrient.code}
                  </span>
                </div>
              </div>

              <p className="text-xs text-slate-700 leading-relaxed">
                {rule.description}
              </p>

              {rule.pharmacistRecommendation && (
                <div className="pt-2 border-t border-slate-200/60 flex items-start gap-2 text-xs">
                  <span className="font-bold text-emerald-800 shrink-0">
                    Chỉ định Dược sĩ:
                  </span>
                  <span className="text-slate-800">
                    {rule.pharmacistRecommendation}
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
