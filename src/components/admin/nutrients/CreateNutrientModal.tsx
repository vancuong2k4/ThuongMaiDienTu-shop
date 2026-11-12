"use client";

// ============================================================
// components/admin/nutrients/CreateNutrientModal.tsx
// Modal Thêm Mới Chỉ Tiêu Vi Chất Chuẩn Hóa Admin CMS (Phase 19)
// ============================================================

import React, { useState } from "react";
import { X, Scale, AlertCircle } from "lucide-react";
import { NutrientUnit } from "@prisma/client";
import { NUTRIENT_UNIT_CONFIG } from "@/lib/validations/comparison";

interface CreateNutrientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const CreateNutrientModal: React.FC<CreateNutrientModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [code, setCode] = useState("");
  const [nameVi, setNameVi] = useState("");
  const [nameEn, setNameEn] = useState("");
  const [category, setCategory] = useState("Vitamin & Khoáng Chất");
  const [unit, setUnit] = useState<NutrientUnit>(NutrientUnit.MG);
  const [standardRdi, setStandardRdi] = useState("");
  const [upperLimit, setUpperLimit] = useState("");
  const [benefitsSummary, setBenefitsSummary] = useState("");
  const [cautionNotes, setCautionNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/admin/nutrients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: code.trim().toUpperCase(),
          nameVi: nameVi.trim(),
          nameEn: nameEn.trim() || undefined,
          category: category.trim(),
          unit,
          standardRdi: standardRdi ? parseFloat(standardRdi) : undefined,
          upperLimit: upperLimit ? parseFloat(upperLimit) : undefined,
          benefitsSummary: benefitsSummary.trim(),
          cautionNotes: cautionNotes.trim() || undefined,
        }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.message || "Không thể tạo chỉ tiêu vi chất.");
      }

      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || "Đã xảy ra lỗi.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in-0 duration-200">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#800028] text-white flex items-center justify-center">
              <Scale className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm sm:text-base text-slate-900">
                Thêm Chỉ Tiêu Vi Chất Mới
              </h3>
              <p className="text-xs text-slate-500">
                Chuẩn hóa mã code và ngưỡng an toàn sinh học (RDI / UL)
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4">
          {error && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Mã Định Danh (Code) *
              </label>
              <input
                type="text"
                required
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                placeholder="VD: LACTOFERRIN, COQ10"
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 uppercase font-mono focus:outline-none focus:border-[#800028]"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Đơn Vị Đo Lường *
              </label>
              <select
                value={unit}
                onChange={(e) => setUnit(e.target.value as NutrientUnit)}
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-[#800028]"
              >
                {Object.entries(NUTRIENT_UNIT_CONFIG).map(([k, v]) => (
                  <option key={k} value={k}>
                    {v.symbol} ({v.label})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Tên Tiếng Việt *
              </label>
              <input
                type="text"
                required
                value={nameVi}
                onChange={(e) => setNameVi(e.target.value)}
                placeholder="VD: Đạm Kháng Thể Lactoferrin"
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-[#800028]"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Tên Tiếng Anh (Khoa học)
              </label>
              <input
                type="text"
                value={nameEn}
                onChange={(e) => setNameEn(e.target.value)}
                placeholder="VD: Bovine Lactoferrin"
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-[#800028]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Phân Loại Nhóm *
              </label>
              <input
                type="text"
                required
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="VD: Kháng Thể & Miễn Dịch"
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-[#800028]"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Khuyến Nghị RDI
              </label>
              <input
                type="number"
                step="0.01"
                value={standardRdi}
                onChange={(e) => setStandardRdi(e.target.value)}
                placeholder="Liều chuẩn"
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-[#800028]"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Ngưỡng Tối Đa (UL)
              </label>
              <input
                type="number"
                step="0.01"
                value={upperLimit}
                onChange={(e) => setUpperLimit(e.target.value)}
                placeholder="Mức cảnh báo thừa"
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-[#800028]"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              Tóm Tắt Công Dụng & Lợi Ích *
            </label>
            <textarea
              rows={2}
              required
              value={benefitsSummary}
              onChange={(e) => setBenefitsSummary(e.target.value)}
              placeholder="Mô tả cơ chế tác dụng sinh học..."
              className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-[#800028] resize-none"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              Lưu Ý Khi Uống & Chỉ Định Dược Sĩ
            </label>
            <textarea
              rows={2}
              value={cautionNotes}
              onChange={(e) => setCautionNotes(e.target.value)}
              placeholder="Thời điểm uống tốt nhất, tương tác..."
              className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-[#800028] resize-none"
            />
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold rounded-xl text-slate-600 hover:bg-slate-100"
            >
              Hủy bỏ
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 rounded-xl bg-[#800028] hover:bg-[#660020] text-white font-bold text-xs shadow-xs disabled:opacity-50"
            >
              {isSubmitting ? "Đang lưu..." : "Tạo Mới Chỉ Tiêu"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
