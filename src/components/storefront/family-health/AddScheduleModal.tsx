"use client";

// ============================================================
// components/storefront/family-health/AddScheduleModal.tsx
// Modal Thêm Lịch Uống Vi Chất Mới Cho Thành Viên (Phase 22)
// ============================================================

import React, { useState } from "react";
import { X, Clock, Plus, CheckCircle2 } from "lucide-react";
import type { SupplementTimeSlot } from "@prisma/client";

interface AddScheduleModalProps {
  memberProfileId: string;
  memberName: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const AddScheduleModal: React.FC<AddScheduleModalProps> = ({
  memberProfileId,
  memberName,
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form State
  const [customItemName, setCustomItemName] = useState("");
  const [brandName, setBrandName] = useState("Aptamil Úc");
  const [timeSlot, setTimeSlot] = useState<SupplementTimeSlot>(
    "MORNING_AFTER_MEAL"
  );
  const [timeString, setTimeString] = useState("08:00");
  const [dosageText, setDosageText] = useState("1 viên sau ăn sáng cùng nước ấm");
  const [totalServingsPerBox, setTotalServingsPerBox] = useState(60);
  const [servingsRemaining, setServingsRemaining] = useState(60);
  const [reminderEnabled, setReminderEnabled] = useState(true);
  const [notes, setNotes] = useState("");

  if (!isOpen) return null;

  const handleTimeSlotChange = (slot: SupplementTimeSlot) => {
    setTimeSlot(slot);
    switch (slot) {
      case "MORNING_BEFORE_MEAL":
        setTimeString("06:30");
        setDosageText("1 gói pha 50ml nước ấm trước ăn sáng");
        break;
      case "MORNING_AFTER_MEAL":
        setTimeString("08:00");
        setDosageText("1 viên sau ăn sáng cùng nước ấm");
        break;
      case "NOON_AFTER_MEAL":
        setTimeString("12:30");
        setDosageText("1 viên sau ăn trưa (cách Canxi ít nhất 2 giờ)");
        break;
      case "EVENING_AFTER_MEAL":
        setTimeString("19:00");
        setDosageText("1 viên sau bữa ăn tối");
        break;
      case "BEFORE_BED":
        setTimeString("21:30");
        setDosageText("1 viên trước khi đi ngủ 30 phút");
        break;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const payload = {
        memberProfileId,
        customItemName: customItemName.trim(),
        brandName: brandName.trim() || undefined,
        timeSlot,
        timeString,
        dosageText: dosageText.trim(),
        totalServingsPerBox: Number(totalServingsPerBox),
        servingsRemaining: Number(servingsRemaining),
        reminderEnabled,
        notes: notes.trim() || undefined,
      };

      const res = await fetch("/api/family-health/schedules", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        setError(json.message || "Không thể lưu lịch uống.");
        return;
      }

      onSuccess();
      onClose();
    } catch {
      setError("Lỗi kết nối máy chủ khi lưu lịch uống.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-slate-900 to-[#800028] text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center">
              <Clock className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <h3 className="font-black text-sm tracking-wide uppercase">
                Thêm Lịch Uống Vi Chất
              </h3>
              <p className="text-[11px] text-slate-300">
                Thành viên: <strong className="text-amber-300">{memberName}</strong>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
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

          {/* Product name & Brand */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="font-bold text-slate-700 block mb-1">
                Tên sản phẩm / vi chất <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="VD: Sữa Aptamil Úc Số 3, Bio Island Zinc..."
                value={customItemName}
                onChange={(e) => setCustomItemName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 font-bold focus:border-[#800028] outline-hidden"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">
                Thương hiệu
              </label>
              <input
                type="text"
                placeholder="Aptamil, Blackmores..."
                value={brandName}
                onChange={(e) => setBrandName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-[#800028] outline-hidden"
              />
            </div>
          </div>

          {/* Time Slot Selector */}
          <div>
            <label className="font-bold text-slate-700 block mb-1">
              Khung giờ uống sinh học <span className="text-rose-500">*</span>
            </label>
            <select
              value={timeSlot}
              onChange={(e) =>
                handleTimeSlotChange(e.target.value as SupplementTimeSlot)
              }
              className="w-full px-3 py-2 rounded-xl border border-slate-200 font-bold focus:border-[#800028] outline-hidden cursor-pointer"
            >
              <option value="MORNING_BEFORE_MEAL">Sáng Trước Ăn (Men vi sinh, Tinh nghệ)</option>
              <option value="MORNING_AFTER_MEAL">Sáng Sau Ăn (D3 K2, Canxi, DHA, Sữa)</option>
              <option value="NOON_AFTER_MEAL">Trưa Sau Ăn (Sắt hữu cơ, Kẽm Zinc, Vitamin C)</option>
              <option value="EVENING_AFTER_MEAL">Tối Sau Ăn (Glucosamine, CoQ10, Bổ gan)</option>
              <option value="BEFORE_BED">Trước Khi Ngủ (Magie, Melatonin thảo dược)</option>
            </select>
          </div>

          {/* Time string & Dosage text */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="font-bold text-slate-700 block mb-1">
                Giờ nhắc uống (HH:mm) <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={timeString}
                onChange={(e) => setTimeString(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 font-mono font-bold focus:border-[#800028] outline-hidden"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="font-bold text-slate-700 block mb-1">
                Liều lượng & Cách uống <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={dosageText}
                onChange={(e) => setDosageText(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-[#800028] outline-hidden"
              />
            </div>
          </div>

          {/* Servings per box & Remaining */}
          <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-200">
            <div>
              <label className="font-bold text-slate-700 block mb-1">
                Tổng số liều/viên trong hộp
              </label>
              <input
                type="number"
                min="1"
                value={totalServingsPerBox}
                onChange={(e) => setTotalServingsPerBox(Number(e.target.value))}
                className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white font-mono font-bold focus:border-[#800028] outline-hidden"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">
                Số liều/viên hiện còn lại
              </label>
              <input
                type="number"
                min="0"
                value={servingsRemaining}
                onChange={(e) => setServingsRemaining(Number(e.target.value))}
                className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white font-mono font-bold text-[#800028] focus:border-[#800028] outline-hidden"
              />
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="font-bold text-slate-700 block mb-1">
              Ghi chú thêm (dặn dò của Dược sĩ)
            </label>
            <input
              type="text"
              placeholder="VD: Không uống cùng sữa hoặc trà xanh..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-[#800028] outline-hidden"
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
              Hủy
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 rounded-xl bg-[#800028] hover:bg-[#660020] text-white font-black shadow-md transition-colors flex items-center gap-1.5 disabled:opacity-50 cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{loading ? "Đang lưu..." : "Lưu Lịch Uống"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
