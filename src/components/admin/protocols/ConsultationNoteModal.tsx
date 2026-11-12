"use client";

// ============================================================
// components/admin/protocols/ConsultationNoteModal.tsx
// Modal Ghi Chú Chuyên Môn Của Dược Sĩ & Cập Nhật Cuộc Gọi (Phase 16)
// ============================================================

import React, { useState } from "react";
import { X, MessageSquare, Phone, Calendar, Clock, AlertCircle } from "lucide-react";
import { ConsultationBookingItem } from "./types";
import { ConsultationStatus } from "@prisma/client";
import { CONSULTATION_STATUS_CONFIG } from "@/lib/validations/protocol";

interface ConsultationNoteModalProps {
  booking: ConsultationBookingItem | null;
  isOpen: boolean;
  onClose: () => void;
  onSaved: () => void;
}

export const ConsultationNoteModal: React.FC<ConsultationNoteModalProps> = ({
  booking,
  isOpen,
  onClose,
  onSaved,
}) => {
  const [status, setStatus] = useState<ConsultationStatus>(
    booking?.status || ConsultationStatus.PENDING
  );
  const [notes, setNotes] = useState(booking?.pharmacistNotes || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen || !booking) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/admin/consultations/${booking.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status,
          pharmacistNotes: notes.trim() || null,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Không thể cập nhật ghi chú");
      }

      onSaved();
      onClose();
    } catch (err: any) {
      setError(err.message || "Đã xảy ra lỗi khi lưu ghi chú");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl p-6">
        <div className="flex items-center justify-between pb-3.5 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-emerald-50 text-emerald-700 rounded-xl border border-emerald-100">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm">
                Hồ Sơ & Ghi Chú Tư Vấn Dược Sĩ
              </h3>
              <p className="text-xs text-slate-500">
                Khách hàng: {booking.customerName} ({booking.phone})
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg bg-slate-100 hover:bg-slate-200 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {error && (
          <div className="mt-3 p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div className="mt-3.5 p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-slate-500">Giờ hẹn gọi:</span>
            <span className="font-mono font-bold text-slate-800">
              {booking.preferredTimeSlot} • {new Date(booking.preferredDate).toLocaleDateString("vi-VN")}
            </span>
          </div>
          <div>
            <span className="font-semibold text-slate-500 block mb-0.5">
              Vấn đề sức khỏe khách chia sẻ:
            </span>
            <p className="text-slate-800 bg-white p-2 rounded-xl border border-slate-200/60 leading-relaxed">
              {booking.healthConcerns}
            </p>
          </div>
          {booking.assessment?.quizAnswers && (
            <div>
              <span className="font-semibold text-slate-500 block mb-0.5">
                Câu trả lời trắc nghiệm:
              </span>
              <pre className="text-[11px] font-mono text-slate-600 bg-white p-2 rounded-xl border border-slate-200/60 overflow-x-auto">
                {JSON.stringify(booking.assessment.quizAnswers, null, 2)}
              </pre>
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-3.5">
          {/* Cập Nhật Trạng Thái */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Trạng Thái Cuộc Gọi *
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as ConsultationStatus)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#800028]/20 focus:border-[#800028]"
            >
              {Object.entries(CONSULTATION_STATUS_CONFIG).map(([k, item]) => (
                <option key={k} value={k}>
                  {item.label}
                </option>
              ))}
            </select>
          </div>

          {/* Ghi Chú Chuyên Môn */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Ghi Chú Tư Vấn & Chỉ Dẫn Dược Sĩ
            </label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="VD: Đã gọi điện lúc 14:15, khách đồng ý đổi sang sữa Aptamil số 2 kết hợp men vi sinh Bio-Oil..."
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#800028]/20 focus:border-[#800028]"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
            >
              Đóng
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-xl shadow-sm hover:shadow transition-all disabled:opacity-50"
            >
              {loading ? "Đang lưu..." : "Lưu Ghi Chú"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
