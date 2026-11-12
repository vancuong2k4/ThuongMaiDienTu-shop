"use client";

// ============================================================
// components/admin/gift-boxes/CreateGiftTemplateModal.tsx
// Modal Thêm Mới Mẫu Vỏ Hộp Quà Biếu Cao Cấp (Phase 17)
// ============================================================

import React, { useState } from "react";
import { X, Gift, AlertCircle, Save } from "lucide-react";
import { GiftBoxType } from "@prisma/client";
import { GIFT_BOX_TYPE_CONFIG } from "@/lib/validations/gift-box";

interface CreateGiftTemplateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const CreateGiftTemplateModal: React.FC<CreateGiftTemplateModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [boxType, setBoxType] = useState<GiftBoxType>(GiftBoxType.WOODEN_BOX);
  const [dimensions, setDimensions] = useState("36 x 28 x 14 cm");
  const [basePrice, setBasePrice] = useState("250000");
  const [maxSlots, setMaxSlots] = useState("5");
  const [imageUrl, setImageUrl] = useState("");
  const [description, setDescription] = useState("");
  const [isAirCargoPledge, setIsAirCargoPledge] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleNameChange = (val: string) => {
    setName(val);
    const autoSlug = val
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[đĐ]/g, "d")
      .replace(/[^a-z0-9\s-]/g, "")
      .trim()
      .replace(/\s+/g, "-");
    setSlug(autoSlug);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/admin/gift-boxes/templates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          slug,
          boxType,
          dimensions,
          basePrice: parseFloat(basePrice) || 0,
          maxSlots: parseInt(maxSlots, 10) || 5,
          imageUrl:
            imageUrl ||
            "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=800&q=80",
          description,
          isAirCargoPledge,
          isActive: true,
          sortOrder: 0,
        }),
      });

      const data = await res.json();
      if (!data.success) {
        throw new Error(data.message || "Không thể tạo mẫu vỏ hộp.");
      }

      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || "Đã xảy ra lỗi khi tạo mẫu vỏ hộp.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in-0 duration-150">
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center">
              <Gift className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm">
                Thêm Mới Mẫu Vỏ Hộp Quà Biếu
              </h3>
              <p className="text-[11px] text-slate-400">
                Thiết lập vỏ hộp gỗ, da hoặc hộp carton lạnh giữ nhiệt
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 flex-1 text-xs">
          {error && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Tên mẫu hộp */}
          <div className="space-y-1">
            <label className="font-bold text-slate-700">Tên Mẫu Vỏ Hộp *</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => handleNameChange(e.target.value)}
              placeholder="VD: Hộp Gỗ Thông Sơn Mài Hoàng Gia"
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-[#800028]"
            />
          </div>

          {/* Slug */}
          <div className="space-y-1">
            <label className="font-bold text-slate-700">Slug Đường Dẫn *</label>
            <input
              type="text"
              required
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="hop-go-thong-son-mai"
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 font-mono text-[11px] focus:outline-none focus:border-[#800028]"
            />
          </div>

          {/* Grid 2 cột: Loại hộp & Sức chứa slots */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="font-bold text-slate-700">Kiểu Dáng Hộp *</label>
              <select
                value={boxType}
                onChange={(e) => setBoxType(e.target.value as GiftBoxType)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-[#800028] bg-white font-medium"
              >
                {Object.entries(GIFT_BOX_TYPE_CONFIG).map(([k, cfg]) => (
                  <option key={k} value={k}>
                    {cfg.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700">Sức Chứa (Slots) *</label>
              <input
                type="number"
                min={2}
                max={12}
                required
                value={maxSlots}
                onChange={(e) => setMaxSlots(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-[#800028]"
              />
            </div>
          </div>

          {/* Grid 2 cột: Kích thước & Giá vỏ hộp */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="font-bold text-slate-700">Kích Thước (DxRxC) *</label>
              <input
                type="text"
                required
                value={dimensions}
                onChange={(e) => setDimensions(e.target.value)}
                placeholder="36 x 28 x 14 cm"
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-[#800028]"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700">Giá Vỏ Hộp (VNĐ) *</label>
              <input
                type="number"
                min={0}
                step={10000}
                required
                value={basePrice}
                onChange={(e) => setBasePrice(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-[#800028]"
              />
            </div>
          </div>

          {/* URL Ảnh */}
          <div className="space-y-1">
            <label className="font-bold text-slate-700">URL Hình Ảnh</label>
            <input
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://images.unsplash.com/..."
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-[#800028]"
            />
          </div>

          {/* Mô tả */}
          <div className="space-y-1">
            <label className="font-bold text-slate-700">Mô Tả & Quy Cách</label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Gỗ thông New Zealand, lót rơm lụa cao cấp, nắp khắc laser..."
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-[#800028]"
            />
          </div>

          {/* Checkbox Air-Cargo pledge */}
          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="isAirCargo"
              checked={isAirCargoPledge}
              onChange={(e) => setIsAirCargoPledge(e.target.checked)}
              className="w-4 h-4 text-[#800028] rounded border-slate-300 focus:ring-[#800028]"
            />
            <label htmlFor="isAirCargo" className="font-medium text-slate-700 cursor-pointer">
              Đạt chuẩn giữ nhiệt lạnh bảo quản Cherry & Men vi sinh Úc
            </label>
          </div>

          {/* Actions */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 font-semibold"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-[#800028] text-white hover:bg-[#660020] font-bold shadow-xs transition-all disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{isSubmitting ? "Đang lưu..." : "Lưu Mẫu Hộp"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
