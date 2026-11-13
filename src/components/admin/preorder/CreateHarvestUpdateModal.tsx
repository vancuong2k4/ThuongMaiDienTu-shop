"use client";

// ============================================================
// components/admin/preorder/CreateHarvestUpdateModal.tsx
// Modal Xuất Bản Nhật Ký Nông Trường Úc (Phase 21)
// ============================================================

import React, { useState } from "react";
import {
  X,
  BookOpen,
  Thermometer,
  CloudSun,
  CheckCircle2,
  Calendar,
} from "lucide-react";
import type { AdminCampaignItem } from "./types";

interface CreateHarvestUpdateModalProps {
  campaign: AdminCampaignItem | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const CreateHarvestUpdateModal: React.FC<CreateHarvestUpdateModalProps> = ({
  campaign,
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form State
  const [title, setTitle] = useState(
    "Đo đạc độ ngọt tuần thu hoạch: Độ đường đạt đỉnh cao 24.5° Brix"
  );
  const [content, setContent] = useState(
    "Thời tiết thung lũng Huon tuần qua duy trì biên độ nhiệt lý tưởng giữa ngày và đêm, kích hoạt vị ngọt đậm đà và thịt quả giòn đặc chuẩn bị đóng thùng bay Air."
  );
  const [brixRecorded, setBrixRecorded] = useState("24.5");
  const [sizeRecordedMm, setSizeRecordedMm] = useState("33.5");
  const [weatherCondition, setWeatherCondition] = useState(
    "Trời quang 20°C, gió mát Nam Cực"
  );

  if (!isOpen || !campaign) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const payload = {
        campaignId: campaign.id,
        title: title.trim(),
        content: content.trim(),
        brixRecorded: brixRecorded ? parseFloat(brixRecorded) : undefined,
        sizeRecordedMm: sizeRecordedMm ? parseFloat(sizeRecordedMm) : undefined,
        weatherCondition: weatherCondition.trim() || undefined,
        reportedAt: new Date().toISOString(),
      };

      const res = await fetch("/api/admin/preorders/harvest-updates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        setError(json.message || "Không thể xuất bản nhật ký.");
        return;
      }

      onSuccess();
      onClose();
    } catch {
      setError("Lỗi kết nối máy chủ khi đăng nhật ký.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-slate-900 to-amber-950 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-black text-sm tracking-wide uppercase">
                Viết Nhật Ký Nông Trường Úc
              </h3>
              <p className="text-[11px] text-slate-300">
                Chiến dịch: <strong className="text-amber-300">{campaign.title}</strong>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
          {error && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 font-medium">
              {error}
            </div>
          )}

          <div>
            <label className="font-bold text-slate-700 block mb-1">
              Tiêu đề bản tin hiện trường <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 font-bold focus:border-amber-700 outline-hidden"
            />
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">
              Nội dung chi tiết nhật ký <span className="text-rose-500">*</span>
            </label>
            <textarea
              required
              rows={3}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-amber-700 outline-hidden"
            />
          </div>

          {/* Brix & Size & Weather */}
          <div className="grid grid-cols-3 gap-2.5">
            <div>
              <label className="font-bold text-slate-700 block mb-1">
                Độ ngọt (°Brix)
              </label>
              <input
                type="number"
                step="0.1"
                value={brixRecorded}
                onChange={(e) => setBrixRecorded(e.target.value)}
                className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 font-mono font-bold focus:border-amber-700 outline-hidden text-[#800028]"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">
                Size quả (mm)
              </label>
              <input
                type="number"
                step="0.1"
                value={sizeRecordedMm}
                onChange={(e) => setSizeRecordedMm(e.target.value)}
                className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 font-mono font-bold focus:border-amber-700 outline-hidden text-amber-700"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">
                Thời tiết vườn
              </label>
              <input
                type="text"
                value={weatherCondition}
                onChange={(e) => setWeatherCondition(e.target.value)}
                placeholder="VD: Nắng 21°C"
                className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 focus:border-amber-700 outline-hidden"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 rounded-xl border border-slate-300 font-bold text-slate-600 hover:bg-slate-50 transition-colors"
            >
              Hủy bỏ
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 rounded-xl bg-amber-700 hover:bg-amber-800 text-white font-black shadow-md transition-colors flex items-center gap-1.5 disabled:opacity-50"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{loading ? "Đang xuất bản..." : "Xuất Bản Nhật Ký"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
