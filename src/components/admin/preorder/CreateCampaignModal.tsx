"use client";

// ============================================================
// components/admin/preorder/CreateCampaignModal.tsx
// Modal Khởi Tạo Chiến Dịch Mùa Vụ Nông Sản Úc (Phase 21)
// ============================================================

import React, { useState } from "react";
import {
  X,
  Calendar,
  Plane,
  ShieldCheck,
  CheckCircle2,
  MapPin,
  Thermometer,
} from "lucide-react";
import type { HarvestGradeType } from "./types";

interface CreateCampaignModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const CreateCampaignModal: React.FC<CreateCampaignModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form State
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [description, setDescription] = useState("");
  const [farmName, setFarmName] = useState("Reid Fruits Tasmania");
  const [farmRegion, setFarmRegion] = useState("Huon Valley, Tasmania, Australia");
  const [productCategory, setProductCategory] = useState("CHERRY");
  const [flightDepartureWeek, setFlightDepartureWeek] = useState(
    "Tuần 3 Tháng 1/2026 (Đúng dịp Tết Bính Ngọ)"
  );
  const [targetBrixSweetness, setTargetBrixSweetness] = useState("22.0° - 26.0° Brix");
  const [fruitSizeMm, setFruitSizeMm] = useState("32mm - 34mm (Jumbo Select)");
  const [qualityGrade, setQualityGrade] = useState<HarvestGradeType>("ROYAL_RESERVE");
  const [totalCapacityKg, setTotalCapacityKg] = useState(5000);
  const [depositPercent, setDepositPercent] = useState(30);
  const [bannerImage, setBannerImage] = useState(
    "https://images.unsplash.com/photo-1528825871115-3581a5387919?auto=format&fit=crop&w=1400&q=80"
  );

  const toLocalISO = (d: Date) => d.toISOString().slice(0, 10);
  const now = new Date();
  const endDate = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
  const [harvestStartDate, setHarvestStartDate] = useState(toLocalISO(now));
  const [harvestEndDate, setHarvestEndDate] = useState(toLocalISO(endDate));

  if (!isOpen) return null;

  // Auto-generate slug from title
  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (!slug || slug === "") {
      const generated = val
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
      setSlug(generated);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const payload = {
        title: title.trim(),
        slug: slug.trim().toLowerCase(),
        subtitle: subtitle.trim(),
        description: description.trim(),
        farmName: farmName.trim(),
        farmRegion: farmRegion.trim(),
        originCountry: "Australia",
        productCategory,
        bannerImage: bannerImage.trim(),
        harvestStartDate: new Date(harvestStartDate).toISOString(),
        harvestEndDate: new Date(harvestEndDate).toISOString(),
        flightDepartureWeek: flightDepartureWeek.trim(),
        targetBrixSweetness: targetBrixSweetness.trim(),
        fruitSizeMm: fruitSizeMm.trim(),
        qualityGrade,
        totalCapacityKg: Number(totalCapacityKg),
        status: "OPEN_FOR_RESERVATION",
        depositType: "PERCENTAGE_30",
        depositPercent: Number(depositPercent),
        sortOrder: 0,
      };

      const res = await fetch("/api/admin/preorders/campaigns", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        setError(json.message || "Không thể tạo chiến dịch.");
        return;
      }

      onSuccess();
      onClose();
    } catch {
      setError("Lỗi kết nối máy chủ khi tạo chiến dịch.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-slate-900 to-[#800028] text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center">
              <Calendar className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <h3 className="font-black text-sm tracking-wide uppercase">
                Khởi Tạo Chiến Dịch Mùa Vụ Úc
              </h3>
              <p className="text-[11px] text-slate-300">
                Mở đợt đặt cọc giữ chỗ khoang lạnh bay Air 24h từ nông trường Úc
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
        <form onSubmit={handleSubmit} className="p-5 overflow-y-auto space-y-4 text-xs">
          {error && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 font-medium">
              {error}
            </div>
          )}

          {/* Group 1: Tiêu đề & Slug */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-slate-700 block mb-1">
                Tiêu đề chiến dịch <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="VD: Cherry Đỏ Tasmania Vụ Tết 2026"
                value={title}
                onChange={(e) => handleTitleChange(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 font-bold focus:border-[#800028] outline-hidden"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">
                Đường dẫn slug (URL) <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="cherry-tasmania-tet-2026"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 font-mono focus:border-[#800028] outline-hidden"
              />
            </div>
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">
              Mô tả ngắn (Subtitle) <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="VD: 100% Vận chuyển đường bay Air 24h từ Thung Lũng Huon..."
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-[#800028] outline-hidden"
            />
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">
              Mô tả chi tiết & Cam kết chất lượng <span className="text-rose-500">*</span>
            </label>
            <textarea
              required
              rows={3}
              placeholder="Thông tin nông trường, khí hậu, quy trình thu hái và cam kết bay Air..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-[#800028] outline-hidden"
            />
          </div>

          {/* Group 2: Nông trường & Vùng */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="font-bold text-slate-700 block mb-1">
                Tên nông trường / Hãng
              </label>
              <input
                type="text"
                required
                value={farmName}
                onChange={(e) => setFarmName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-[#800028] outline-hidden"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">
                Vùng trồng (State / Region)
              </label>
              <input
                type="text"
                required
                value={farmRegion}
                onChange={(e) => setFarmRegion(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-[#800028] outline-hidden"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">
                Loại nông sản
              </label>
              <select
                value={productCategory}
                onChange={(e) => setProductCategory(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 font-semibold focus:border-[#800028] outline-hidden"
              >
                <option value="CHERRY">Cherry tươi Úc 🍒</option>
                <option value="MANUKA_HONEY">Mật ong Manuka 🍯</option>
                <option value="PREMIUM_FRUIT">Trái cây mùa vụ khác 🍇</option>
              </select>
            </div>
          </div>

          {/* Group 3: Specs (Brix & Size) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3 bg-amber-50/50 rounded-2xl border border-amber-200/80">
            <div>
              <label className="font-bold text-slate-700 block mb-1">
                Độ ngọt Brix mục tiêu
              </label>
              <input
                type="text"
                required
                value={targetBrixSweetness}
                onChange={(e) => setTargetBrixSweetness(e.target.value)}
                className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white font-mono font-bold focus:border-[#800028] outline-hidden"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">
                Kích thước quả mục tiêu
              </label>
              <input
                type="text"
                required
                value={fruitSizeMm}
                onChange={(e) => setFruitSizeMm(e.target.value)}
                className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white font-mono font-bold focus:border-[#800028] outline-hidden"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">
                Phân hạng chất lượng
              </label>
              <select
                value={qualityGrade}
                onChange={(e) => setQualityGrade(e.target.value as HarvestGradeType)}
                className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white font-semibold focus:border-[#800028] outline-hidden"
              >
                <option value="ROYAL_RESERVE">Hoàng Gia Royal Reserve</option>
                <option value="DIAMOND_SELECT">Kim Cương Diamond Select</option>
                <option value="PREMIUM_EXPORT">Xuất Khẩu Loại 1 Premium</option>
              </select>
            </div>
          </div>

          {/* Group 4: Dates & Capacity */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="font-bold text-slate-700 block mb-1">
                Tuần bay dự kiến
              </label>
              <input
                type="text"
                required
                value={flightDepartureWeek}
                onChange={(e) => setFlightDepartureWeek(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 font-mono focus:border-[#800028] outline-hidden"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">
                Tổng sản lượng bao tiêu (kg)
              </label>
              <input
                type="number"
                min="100"
                step="100"
                value={totalCapacityKg}
                onChange={(e) => setTotalCapacityKg(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 font-mono font-bold focus:border-[#800028] outline-hidden"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">
                Tỷ lệ cọc giữ chỗ (%)
              </label>
              <input
                type="number"
                min="10"
                max="100"
                value={depositPercent}
                onChange={(e) => setDepositPercent(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 font-mono font-bold focus:border-[#800028] outline-hidden"
              />
            </div>
          </div>

          {/* Banner image */}
          <div>
            <label className="font-bold text-slate-700 block mb-1">
              Đường dẫn ảnh bìa (Banner URL)
            </label>
            <input
              type="url"
              required
              value={bannerImage}
              onChange={(e) => setBannerImage(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 font-mono text-[11px] focus:border-[#800028] outline-hidden"
            />
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
              className="px-5 py-2 rounded-xl bg-[#800028] hover:bg-[#660020] text-white font-black shadow-md transition-colors flex items-center gap-1.5 disabled:opacity-50"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{loading ? "Đang tạo..." : "Khởi Tạo Chiến Dịch"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
