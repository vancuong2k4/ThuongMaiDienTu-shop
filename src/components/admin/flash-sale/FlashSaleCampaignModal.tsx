"use client";

// ============================================================
// components/admin/flash-sale/FlashSaleCampaignModal.tsx
// Modal Tạo Mới & Chỉnh Sửa Chiến Dịch Flash Sale (Module 9.3)
// ============================================================

import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
  X,
  Zap,
  Calendar,
  Clock,
  Image as ImageIcon,
  Loader2,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import type { FlashSaleCampaignItem } from "./types";

interface FlashSaleCampaignModalProps {
  isOpen: boolean;
  onClose: () => void;
  campaign?: FlashSaleCampaignItem | null;
  onSuccess: () => void;
}

// Chuyển đổi Date sang định dạng input datetime-local: "YYYY-MM-DDTHH:mm"
function toDateTimeLocalString(date: Date): string {
  const pad = (n: number) => n.toString().padStart(2, "0");
  const yyyy = date.getFullYear();
  const MM = pad(date.getMonth() + 1);
  const dd = pad(date.getDate());
  const hh = pad(date.getHours());
  const mm = pad(date.getMinutes());
  return `${yyyy}-${MM}-${dd}T${hh}:${mm}`;
}

export const FlashSaleCampaignModal: React.FC<FlashSaleCampaignModalProps> = ({
  isOpen,
  onClose,
  campaign,
  onSuccess,
}) => {
  const isEdit = Boolean(campaign);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [bannerImage, setBannerImage] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [isActive, setIsActive] = useState(true);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Điền dữ liệu khi mở modal
  useEffect(() => {
    if (!isOpen) return;

    if (campaign) {
      setName(campaign.name);
      setDescription(campaign.description || "");
      setBannerImage(campaign.bannerImage || "");
      setStartTime(toDateTimeLocalString(new Date(campaign.startTime)));
      setEndTime(toDateTimeLocalString(new Date(campaign.endTime)));
      setIsActive(campaign.isActive);
    } else {
      // Giá trị mặc định tạo mới: bắt đầu từ hiện tại đến 48h sau
      const now = new Date();
      const in48Hours = new Date(now.getTime() + 48 * 60 * 60 * 1000);
      setName("");
      setDescription("");
      setBannerImage("");
      setStartTime(toDateTimeLocalString(now));
      setEndTime(toDateTimeLocalString(in48Hours));
      setIsActive(true);
    }
    setError(null);
  }, [isOpen, campaign]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError("Vui lòng nhập tên chiến dịch Flash Sale");
      return;
    }

    const startDate = new Date(startTime);
    const endDate = new Date(endTime);

    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      setError("Thời gian bắt đầu hoặc kết thúc không hợp lệ");
      return;
    }

    if (endDate <= startDate) {
      setError("Thời gian kết thúc phải diễn ra sau thời gian bắt đầu");
      return;
    }

    try {
      setLoading(true);

      const url = isEdit
        ? `/api/admin/flash-sales/${campaign?.id}`
        : "/api/admin/flash-sales";
      const method = isEdit ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          description: description.trim() || null,
          bannerImage: bannerImage.trim() || null,
          startTime: startDate.toISOString(),
          endTime: endDate.toISOString(),
          isActive,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Không thể lưu chiến dịch Flash Sale");
      }

      onSuccess();
      onClose();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Đã có lỗi xảy ra";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 overflow-hidden space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-rose-50 text-[#800028] flex items-center justify-center">
              <Zap className="w-4 h-4 fill-[#800028]" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                {isEdit ? "Chỉnh Sửa Chiến Dịch Giờ Vàng" : "Tạo Mới Chiến Dịch Flash Sale"}
              </h3>
              <p className="text-[11px] text-slate-500">
                Thiết lập khung giờ săn deal và nội dung hiển thị trên trang chủ
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Tên chiến dịch */}
          <div className="space-y-1">
            <label className="block text-xs font-bold text-slate-700">
              Tên chiến dịch <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ví dụ: ⚡ ĐẠI TIỆC GIỜ VÀNG – HÀNG BAY AIR CARGO & VITAMIN ÚC"
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#800028]/20 focus:border-[#800028]"
            />
          </div>

          {/* Mô tả chiến dịch */}
          <div className="space-y-1">
            <label className="block text-xs font-bold text-slate-700">
              Mô tả ngắn hiển thị kèm
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Ưu đãi độc quyền các dòng thực phẩm bổ sung và trái cây tươi tuyển chọn..."
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#800028]/20 focus:border-[#800028]"
            />
          </div>

          {/* Banner Image URL */}
          <div className="space-y-1">
            <label className="block text-xs font-bold text-slate-700">
              URL Banner Chiến Dịch
            </label>
            <input
              type="url"
              value={bannerImage}
              onChange={(e) => setBannerImage(e.target.value)}
              placeholder="https://images.unsplash.com/..."
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#800028]/20 focus:border-[#800028]"
            />
            {bannerImage && (
              <div className="relative aspect-[21/9] w-full rounded-xl overflow-hidden bg-slate-100 border border-slate-200 mt-2">
                <Image
                  src={bannerImage}
                  alt="Xem trước banner"
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>
            )}
          </div>

          {/* Khung giờ: Bắt đầu & Kết thúc */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-700">
                Thời gian bắt đầu <span className="text-rose-500">*</span>
              </label>
              <input
                type="datetime-local"
                required
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#800028]/20 focus:border-[#800028]"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-700">
                Thời gian kết thúc <span className="text-rose-500">*</span>
              </label>
              <input
                type="datetime-local"
                required
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#800028]/20 focus:border-[#800028]"
              />
            </div>
          </div>

          {/* Công tắc kích hoạt */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
            <div>
              <span className="text-xs font-bold text-slate-800">
                Kích hoạt chiến dịch
              </span>
              <p className="text-[11px] text-slate-500">
                Cho phép mở bán flash sale trên website khi tới khung giờ
              </p>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={isActive}
              onClick={() => setIsActive(!isActive)}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                isActive ? "bg-emerald-600" : "bg-slate-300"
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                  isActive ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
            >
              Hủy bỏ
            </button>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl text-xs font-bold text-white bg-[#800028] hover:bg-[#60001e] transition-all shadow-md shadow-[#800028]/20 disabled:opacity-50"
            >
              {loading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              <span>{isEdit ? "Cập Nhật Chiến Dịch" : "Tạo Chiến Dịch"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
