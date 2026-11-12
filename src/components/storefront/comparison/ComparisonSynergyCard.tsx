"use client";

// ============================================================
// components/storefront/comparison/ComparisonSynergyCard.tsx
// Thẻ Phân Tích Hiệp Đồng Vi Chất & Cảnh Báo An Toàn Dược Sĩ (Phase 19)
// ============================================================

import React from "react";
import {
  Stethoscope,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Info,
  Layers,
} from "lucide-react";
import { ComparisonAnalysisResult, SynergyAlert } from "@/lib/comparison";
import { SYNERGY_TYPE_CONFIG } from "@/lib/validations/comparison";
import { SynergyType } from "@prisma/client";

interface ComparisonSynergyCardProps {
  analysis: ComparisonAnalysisResult | null;
  isLoading: boolean;
}

export const ComparisonSynergyCard: React.FC<ComparisonSynergyCardProps> = ({
  analysis,
  isLoading,
}) => {
  if (isLoading) {
    return (
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm animate-pulse space-y-4">
        <div className="h-6 w-64 bg-slate-200 rounded-lg" />
        <div className="h-20 bg-slate-100 rounded-2xl" />
        <div className="h-32 bg-slate-100 rounded-2xl" />
      </div>
    );
  }

  if (!analysis || analysis.products.length < 2) {
    return null;
  }

  const isCaution = analysis.overallSafetyStatus === "CAUTION";
  const isSynergy = analysis.overallSafetyStatus === "EXCELLENT_SYNERGY";

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
      {/* ── 1. Header with Status Badge ──────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#800028] to-slate-900 text-white flex items-center justify-center shadow-xs">
            <Stethoscope className="w-6 h-6 text-emerald-300" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-black text-slate-900 tracking-tight flex items-center gap-2">
              <span>Phân Tích Tương Tác & Hiệp Đồng Dược Sĩ</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Hệ thống đối chiếu tự động hàm lượng vi chất trên từng liều dùng thực tế
            </p>
          </div>
        </div>

        {/* Overall Badge */}
        <div>
          {isCaution ? (
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-black bg-rose-100 text-rose-800 border border-rose-300">
              <AlertTriangle className="w-4 h-4 text-rose-600" />
              <span>Cần Lưu Ý Liều Dùng</span>
            </span>
          ) : isSynergy ? (
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-black bg-emerald-100 text-emerald-800 border border-emerald-300">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Hiệp Đồng Sinh Học Cao</span>
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-black bg-slate-100 text-slate-800 border border-slate-300">
              <ShieldCheck className="w-4 h-4 text-slate-600" />
              <span>Kết Hợp An Toàn</span>
            </span>
          )}
        </div>
      </div>

      {/* ── 2. Pharmacist Advice Box ─────────────────────────────── */}
      <div
        className={`p-4 sm:p-5 rounded-2xl border flex items-start gap-3.5 ${
          isCaution
            ? "bg-rose-50/80 border-rose-200 text-rose-950"
            : isSynergy
            ? "bg-emerald-50/70 border-emerald-200 text-emerald-950"
            : "bg-slate-50 border-slate-200 text-slate-900"
        }`}
      >
        <div
          className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
            isCaution
              ? "bg-rose-200 text-rose-800"
              : isSynergy
              ? "bg-emerald-200 text-emerald-800"
              : "bg-slate-200 text-slate-700"
          }`}
        >
          <Info className="w-5 h-5" />
        </div>
        <div className="space-y-1">
          <h5 className="font-bold text-xs uppercase tracking-wide">
            Ý kiến đánh giá chuyên môn Dược sĩ THUYNGA Shop:
          </h5>
          <p className="text-xs sm:text-sm leading-relaxed">
            {analysis.pharmacistSummary}
          </p>
        </div>
      </div>

      {/* ── 3. Detailed Alerts & Interactions ─────────────────────── */}
      {analysis.synergyAlerts.length > 0 && (
        <div className="space-y-3 pt-1">
          <h4 className="text-xs font-black uppercase tracking-wider text-slate-400">
            Chi tiết các tương tác phát hiện ({analysis.synergyAlerts.length}):
          </h4>

          <div className="grid grid-cols-1 gap-3">
            {analysis.synergyAlerts.map((alert) => {
              const cfg =
                SYNERGY_TYPE_CONFIG[alert.type] ||
                SYNERGY_TYPE_CONFIG[SynergyType.NEUTRAL];

              return (
                <div
                  key={alert.id}
                  className={`p-4 rounded-2xl border ${cfg.bgClass} ${cfg.borderClass} space-y-2.5 transition-all`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-[10px] font-black px-2 py-0.5 rounded-md uppercase tracking-wider bg-white/80 border ${cfg.textClass}`}
                      >
                        {cfg.badgeText}
                      </span>
                      <h5 className={`font-extrabold text-xs sm:text-sm ${cfg.textClass}`}>
                        {alert.title}
                      </h5>
                    </div>

                    <div className="text-[11px] text-slate-500 flex items-center gap-1 font-medium">
                      <span>Vi chất:</span>
                      <strong className="text-slate-800">
                        {alert.involvedNutrients.join(" + ")}
                      </strong>
                    </div>
                  </div>

                  <p className="text-xs text-slate-700 leading-relaxed">
                    {alert.description}
                  </p>

                  {alert.pharmacistRecommendation && (
                    <div className="pt-2 border-t border-slate-200/60 flex items-start gap-2 text-xs">
                      <span className="font-bold text-emerald-800 shrink-0">
                        Chỉ định Dược sĩ:
                      </span>
                      <span className="text-slate-800">
                        {alert.pharmacistRecommendation}
                      </span>
                    </div>
                  )}

                  <div className="flex items-center gap-2 text-[10px] text-slate-400 pt-1">
                    <span>Sản phẩm liên quan:</span>
                    {alert.involvedProducts.map((p) => (
                      <span
                        key={p.id}
                        className="bg-white/80 px-2 py-0.5 rounded border border-slate-200 font-semibold text-slate-600 truncate max-w-[200px]"
                      >
                        {p.name}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
