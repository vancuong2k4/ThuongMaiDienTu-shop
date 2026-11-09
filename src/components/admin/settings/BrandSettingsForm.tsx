"use client";

// ============================================================
// components/admin/settings/BrandSettingsForm.tsx
// Form Cấu Hình Thông Tin Thương Hiệu & Cửa Hàng
// ============================================================

import React, { useState } from "react";
import Image from "next/image";
import {
  Store,
  Phone,
  Mail,
  MapPin,
  Clock,
  Globe,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Image as ImageIcon,
} from "lucide-react";
import type { SiteConfigValues } from "./types";

interface BrandSettingsFormProps {
  initialData: SiteConfigValues;
  onSave: (data: SiteConfigValues) => Promise<void>;
}

export const BrandSettingsForm: React.FC<BrandSettingsFormProps> = ({
  initialData,
  onSave,
}) => {
  const [formData, setFormData] = useState<SiteConfigValues>(initialData);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleChange = (field: keyof SiteConfigValues, value: string) => {
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
      setErrorMsg(err.message || "Không thể lưu thông tin thương hiệu");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {savedSuccess && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Đã lưu thông tin thương hiệu thành công!</span>
        </div>
      )}

      {errorMsg && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Thông tin cốt lõi */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-4">
        <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2 border-b border-slate-100 pb-3">
          <Store className="w-4 h-4 text-[#800028]" />
          <span>Nhận Diện Thương Hiệu</span>
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Tên Cửa Hàng / Thương Hiệu <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={formData.brandName}
              onChange={(e) => handleChange("brandName", e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#800028]/20 focus:border-[#800028] transition-all"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Khẩu Hiệu / Slogan Cam Kết <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={formData.slogan}
              onChange={(e) => handleChange("slogan", e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#800028]/20 focus:border-[#800028] transition-all"
              required
            />
          </div>
        </div>

        {/* Logo URL */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            Đường Dẫn Logo Thương Hiệu
          </label>
          <div className="flex items-center gap-3">
            <input
              type="text"
              placeholder="VD: /logo.png hoặc https://..."
              value={formData.logo || ""}
              onChange={(e) => handleChange("logo", e.target.value)}
              className="flex-1 px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#800028]/20 focus:border-[#800028] transition-all"
            />
            {formData.logo && (
              <div className="w-10 h-10 rounded-xl border border-slate-200 bg-slate-50 p-1 flex items-center justify-center shrink-0 overflow-hidden">
                <Image
                  src={formData.logo}
                  alt="Logo preview"
                  width={36}
                  height={36}
                  className="max-h-full w-auto object-contain"
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Thông tin liên hệ & địa chỉ */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-4">
        <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2 border-b border-slate-100 pb-3">
          <Phone className="w-4 h-4 text-[#800028]" />
          <span>Thông Tin Liên Hệ & Chăm Sóc Khách Hàng</span>
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Hotline Tư Vấn & Khiếu Nại <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={formData.hotline}
              onChange={(e) => handleChange("hotline", e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-sm font-bold text-[#800028] focus:outline-none focus:ring-2 focus:ring-[#800028]/20 focus:border-[#800028] transition-all"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Email Hỗ Trợ Khách Hàng <span className="text-rose-500">*</span>
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => handleChange("email", e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#800028]/20 focus:border-[#800028] transition-all"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Địa Chỉ Kho Hàng / Showroom <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={formData.address}
              onChange={(e) => handleChange("address", e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#800028]/20 focus:border-[#800028] transition-all"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Thời Gian Mở Cửa & Trực Hotline <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={formData.openingHours}
              onChange={(e) => handleChange("openingHours", e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#800028]/20 focus:border-[#800028] transition-all"
              required
            />
          </div>
        </div>
      </div>

      {/* Mạng xã hội */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-4">
        <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2 border-b border-slate-100 pb-3">
          <Globe className="w-4 h-4 text-[#800028]" />
          <span>Kênh Truyền Thông & Mạng Xã Hội</span>
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Facebook Fanpage
            </label>
            <input
              type="text"
              placeholder="https://facebook.com/..."
              value={formData.fanpage}
              onChange={(e) => handleChange("fanpage", e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#800028]/20 focus:border-[#800028] transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Zalo OA / Số Zalo CSKH <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              placeholder="https://zalo.me/... hoặc 0987..."
              value={formData.zalo}
              onChange={(e) => handleChange("zalo", e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#800028]/20 focus:border-[#800028] transition-all"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Kênh TikTok
            </label>
            <input
              type="text"
              placeholder="https://tiktok.com/@..."
              value={formData.tiktok || ""}
              onChange={(e) => handleChange("tiktok", e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#800028]/20 focus:border-[#800028] transition-all"
            />
          </div>
        </div>
      </div>

      {/* Nút lưu */}
      <div className="flex items-center justify-end gap-3 pt-2">
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
              <span>Lưu Thông Tin Thương Hiệu</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
};
