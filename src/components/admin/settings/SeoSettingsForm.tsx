"use client";

// ============================================================
// components/admin/settings/SeoSettingsForm.tsx
// Form Cấu Hình SEO & SERP Snippet Preview
// ============================================================

import React, { useState } from "react";
import Image from "next/image";
import {
  Search,
  Globe,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Share2,
} from "lucide-react";
import type { SeoConfigValues } from "./types";

interface SeoSettingsFormProps {
  initialData: SeoConfigValues;
  onSave: (data: SeoConfigValues) => Promise<void>;
}

export const SeoSettingsForm: React.FC<SeoSettingsFormProps> = ({
  initialData,
  onSave,
}) => {
  const [formData, setFormData] = useState<SeoConfigValues>(initialData);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleChange = (field: keyof SeoConfigValues, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setSavedSuccess(false);
    setErrorMsg(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      setErrorMsg(null);
      await onSave(formData);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err: any) {
      setErrorMsg(err.message || "Không thể lưu cấu hình SEO");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {savedSuccess && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Đã lưu cấu hình SEO & Thẻ Meta thành công!</span>
        </div>
      )}

      {errorMsg && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Form nhập liệu SEO */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-4">
          <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2 border-b border-slate-100 pb-3">
            <Search className="w-4 h-4 text-[#800028]" />
            <span>Thẻ Meta SEO Mặc Định</span>
          </h4>

          {/* Meta Title */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Tiêu Đề Trang Mặc Định (Meta Title) <span className="text-rose-500">*</span>
              </label>
              <span
                className={`text-[11px] font-bold ${
                  formData.metaTitle.length > 60 ? "text-amber-600" : "text-slate-400"
                }`}
              >
                {formData.metaTitle.length}/60 ký tự
              </span>
            </div>
            <input
              type="text"
              value={formData.metaTitle}
              onChange={(e) => handleChange("metaTitle", e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#800028]/20 focus:border-[#800028] transition-all"
              required
            />
          </div>

          {/* Meta Description */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Mô Tả Tóm Tắt (Meta Description) <span className="text-rose-500">*</span>
              </label>
              <span
                className={`text-[11px] font-bold ${
                  formData.metaDescription.length > 160 ? "text-amber-600" : "text-slate-400"
                }`}
              >
                {formData.metaDescription.length}/160 ký tự
              </span>
            </div>
            <textarea
              rows={3}
              value={formData.metaDescription}
              onChange={(e) => handleChange("metaDescription", e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#800028]/20 focus:border-[#800028] transition-all leading-relaxed"
              required
            />
          </div>

          {/* Keywords */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Từ Khóa Tìm Kiếm (Meta Keywords)
            </label>
            <input
              type="text"
              placeholder="VD: thuc pham chuc nang, hang uc, sua aptamil, cherry my"
              value={formData.keywords || ""}
              onChange={(e) => handleChange("keywords", e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#800028]/20 focus:border-[#800028] transition-all"
            />
            <p className="mt-1 text-[11px] text-slate-400">
              Phân cách các từ khóa bằng dấu phẩy
            </p>
          </div>

          {/* OG Image */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Ảnh Chia Sẻ Mạng Xã Hội (OpenGraph Image URL)
            </label>
            <div className="flex items-center gap-3">
              <input
                type="text"
                placeholder="VD: /og-image.jpg hoặc https://..."
                value={formData.ogImage || ""}
                onChange={(e) => handleChange("ogImage", e.target.value)}
                className="flex-1 px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#800028]/20 focus:border-[#800028] transition-all"
              />
              {formData.ogImage && (
                <div className="w-12 h-8 rounded-lg border border-slate-200 bg-slate-50 overflow-hidden shrink-0">
                  <Image
                    src={formData.ogImage}
                    alt="OG Preview"
                    width={48}
                    height={32}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
            </div>
            <p className="mt-1 text-[11px] text-slate-400">
              Kích thước khuyến nghị: 1200 x 630 pixels
            </p>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#800028] hover:bg-[#680020] text-white text-xs font-bold shadow-xs hover:shadow-md transition-all active:scale-[0.98] disabled:opacity-50"
            >
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Đang lưu...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Lưu Cấu Hình SEO</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Cột phải: Live Google SERP Snippet Simulator */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-blue-600" />
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Mô Phỏng Google Search SERP
              </h4>
            </div>
            <span className="text-[10px] font-bold text-slate-400">Live Preview</span>
          </div>

          {/* Google Result Box */}
          <div className="p-4 rounded-xl border border-slate-100 bg-slate-50/60 font-sans space-y-1">
            <div className="flex items-center gap-2 text-xs text-slate-600">
              <div className="w-4 h-4 rounded-full bg-slate-200 flex items-center justify-center text-[9px] font-bold text-[#800028]">
                T
              </div>
              <span className="text-[11px] text-slate-700">thuyngashop.com.vn</span>
              <span className="text-slate-400 text-[10px]">› trang-chu</span>
            </div>

            <h5 className="text-base text-blue-800 font-semibold hover:underline cursor-pointer line-clamp-1">
              {formData.metaTitle || "THUYNGA Shop | Hàng Nhập Khẩu Chính Hãng"}
            </h5>

            <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
              {formData.metaDescription ||
                "Cửa hàng trực tuyến hàng nhập khẩu chính hãng từ Úc, Nhật, Hàn, Mỹ. Cam kết 100% nguồn gốc rõ ràng, vận chuyển Air Cargo chuẩn nhiệt độ."}
            </p>
          </div>

          <div className="p-3 rounded-xl bg-slate-100/70 text-[11px] text-slate-500 leading-relaxed">
            💡 <strong>Mẹo tối ưu SEO:</strong> Giữ tiêu đề dưới 60 ký tự và mô tả dưới 160 ký tự để không bị Google cắt ngắn dấu chấm lửng trên kết quả tìm kiếm.
          </div>
        </div>
      </div>
    </form>
  );
};
