"use client";

// ============================================================
// components/storefront/protocols/BookConsultationModal.tsx
// Modal Đặt Lịch Gọi Tư Vấn Dược Sĩ 1-1 Cho Khách Hàng (Phase 16)
// ============================================================

import React, { useState } from "react";
import {
  X,
  Phone,
  Calendar,
  Clock,
  User,
  CheckCircle2,
  AlertCircle,
  Stethoscope,
} from "lucide-react";

interface BookConsultationModalProps {
  isOpen: boolean;
  onClose: () => void;
  assessmentId?: string;
  defaultName?: string;
  defaultPhone?: string;
}

export const BookConsultationModal: React.FC<BookConsultationModalProps> = ({
  isOpen,
  onClose,
  assessmentId,
  defaultName = "",
  defaultPhone = "",
}) => {
  const [customerName, setCustomerName] = useState(defaultName);
  const [phone, setPhone] = useState(defaultPhone);
  const [preferredDate, setPreferredDate] = useState(
    new Date(Date.now() + 24 * 3600 * 1000).toISOString().slice(0, 10)
  );
  const [preferredTimeSlot, setPreferredTimeSlot] = useState("14:00 - 16:30");
  const [healthConcerns, setHealthConcerns] = useState(
    "Cần Dược sĩ hướng dẫn thêm về liều dùng và cách kết hợp sản phẩm trong phác đồ."
  );

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const timeSlots = [
    { slot: "09:00 - 11:30", label: "Buổi Sáng (09:00 - 11:30)" },
    { slot: "14:00 - 16:30", label: "Buổi Chiều (14:00 - 16:30)" },
    { slot: "19:00 - 21:00", label: "Buổi Tối (19:00 - 21:00)" },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/consultations/book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          assessmentId: assessmentId || null,
          customerName: customerName.trim(),
          phone: phone.trim(),
          preferredDate: new Date(preferredDate).toISOString(),
          preferredTimeSlot,
          healthConcerns: healthConcerns.trim(),
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Không thể đặt lịch tư vấn");
      }

      setSuccess(true);
    } catch (err: any) {
      setError(err.message || "Đã xảy ra lỗi khi đặt lịch");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl p-6 sm:p-7">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-emerald-50 text-emerald-700 rounded-xl border border-emerald-100">
              <Stethoscope className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">
                Đặt Lịch Tư Vấn Dược Sĩ 1-1 Miễn Phí
              </h3>
              <p className="text-xs text-slate-500">
                Dược sĩ THUYNGA Shop sẽ gọi điện tư vấn chuyên sâu qua điện thoại
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

        {success ? (
          <div className="text-center py-6 space-y-4">
            <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <h4 className="text-lg font-bold text-slate-900">
                Đặt Lịch Hẹn Thành Công!
              </h4>
              <p className="text-xs text-slate-600 max-w-sm mx-auto leading-relaxed">
                Dược sĩ phụ trách sẽ gọi điện đến số <strong>{phone}</strong> vào khung giờ{" "}
                <strong>{preferredTimeSlot}</strong> ngày{" "}
                <strong>{new Date(preferredDate).toLocaleDateString("vi-VN")}</strong>.
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 bg-[#800028] text-white text-xs font-bold rounded-xl shadow-sm hover:shadow transition-all"
            >
              Đã hiểu & Đóng
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-4 space-y-3.5">
            {error && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Họ Và Tên Của Bạn *
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="VD: Nguyễn Thị Mai Anh"
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#800028]/20 focus:border-[#800028]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Số Điện Thoại Nhận Cuộc Gọi *
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="VD: 0987654321"
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-mono text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#800028]/20 focus:border-[#800028]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Ngày Hẹn Thuận Tiện *
                </label>
                <input
                  type="date"
                  required
                  value={preferredDate}
                  onChange={(e) => setPreferredDate(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#800028]/20 focus:border-[#800028]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Khung Giờ Nhận Cuộc Gọi *
                </label>
                <select
                  value={preferredTimeSlot}
                  onChange={(e) => setPreferredTimeSlot(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#800028]/20 focus:border-[#800028]"
                >
                  {timeSlots.map((ts) => (
                    <option key={ts.slot} value={ts.slot}>
                      {ts.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Tình Trạng Sức Khỏe / Thắc Mắc Cần Giải Đáp *
              </label>
              <textarea
                rows={2}
                required
                value={healthConcerns}
                onChange={(e) => setHealthConcerns(e.target.value)}
                placeholder="Chia sẻ ngắn gọn để Dược sĩ chuẩn bị tài liệu trước khi gọi..."
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#800028]/20 focus:border-[#800028]"
              />
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={onClose}
                disabled={loading}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
              >
                Hủy bỏ
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-5 py-2 text-xs sm:text-sm font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-xl shadow-sm hover:shadow transition-all disabled:opacity-50"
              >
                {loading ? "Đang gửi..." : "Xác Nhận Đặt Lịch Hẹn"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
