"use client";

// ============================================================
// components/admin/gift-boxes/InquiryQuoteModal.tsx
// Modal Báo Giá & Cập Nhật Trạng Thái Yêu Cầu B2B (Phase 17)
// ============================================================

import React, { useState } from "react";
import {
  X,
  Building2,
  Phone,
  Mail,
  Calendar,
  DollarSign,
  AlertCircle,
  Save,
  CheckCircle2,
} from "lucide-react";
import { AdminCorporateInquiry } from "./types";
import {
  CORPORATE_GIFT_STATUS_CONFIG,
  GIFT_OCCASION_CONFIG,
} from "@/lib/validations/gift-box";
import { CorporateGiftStatus } from "@prisma/client";

interface InquiryQuoteModalProps {
  inquiry: AdminCorporateInquiry | null;
  onClose: () => void;
  onSuccess: () => void;
}

export const InquiryQuoteModal: React.FC<InquiryQuoteModalProps> = ({
  inquiry,
  onClose,
  onSuccess,
}) => {
  if (!inquiry) return null;

  const [status, setStatus] = useState<CorporateGiftStatus>(inquiry.status);
  const [quotedTotal, setQuotedTotal] = useState(
    inquiry.quotedTotal ? String(inquiry.quotedTotal) : ""
  );
  const [adminNotes, setAdminNotes] = useState(inquiry.adminNotes || "");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const occasionCfg = GIFT_OCCASION_CONFIG[inquiry.occasion];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const res = await fetch(
        `/api/admin/gift-boxes/corporate-inquiries/${inquiry.id}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            status,
            quotedTotal: quotedTotal ? parseFloat(quotedTotal) : null,
            adminNotes,
          }),
        }
      );

      const data = await res.json();
      if (!data.success) {
        throw new Error(data.message || "Không thể cập nhật yêu cầu.");
      }

      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || "Đã xảy ra lỗi khi cập nhật.");
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
            <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
              <Building2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm">
                Xử Lý Yêu Cầu Quà Doanh Nghiệp #{inquiry.inquiryCode}
              </h3>
              <p className="text-[11px] text-slate-400">
                {inquiry.companyName} ({inquiry.quantity} suất)
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

          {/* Customer brief info box */}
          <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-900 text-sm">
                {inquiry.companyName}
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-800">
                {occasionCfg?.label || inquiry.occasion}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-slate-600">
              <div>
                <span className="text-slate-400 block text-[10px]">Người liên hệ:</span>
                <strong>{inquiry.contactPerson}</strong>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Số điện thoại:</span>
                <a href={`tel:${inquiry.phone}`} className="text-emerald-700 font-bold hover:underline">
                  {inquiry.phone}
                </a>
              </div>
            </div>

            {inquiry.notes && (
              <div className="pt-2 border-t border-slate-200/60">
                <span className="text-slate-400 block text-[10px]">Yêu cầu phối set quà của khách:</span>
                <p className="text-slate-700 italic mt-0.5">{inquiry.notes}</p>
              </div>
            )}
          </div>

          {/* Trạng thái B2B */}
          <div className="space-y-1">
            <label className="font-bold text-slate-700">Trạng Thái Xử Lý *</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as CorporateGiftStatus)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-[#800028] bg-white font-medium"
            >
              {Object.entries(CORPORATE_GIFT_STATUS_CONFIG).map(([k, cfg]) => (
                <option key={k} value={k}>
                  {cfg.label}
                </option>
              ))}
            </select>
          </div>

          {/* Báo giá chính thức (VNĐ) */}
          <div className="space-y-1">
            <label className="font-bold text-slate-700">
              Tổng Giá Trị Báo Giá Chính Thức (VNĐ)
            </label>
            <div className="relative">
              <input
                type="number"
                min={0}
                step={500000}
                value={quotedTotal}
                onChange={(e) => setQuotedTotal(e.target.value)}
                placeholder="VD: 200000000"
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-[#800028] font-mono font-bold text-rose-700"
              />
              <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold">
                ₫
              </span>
            </div>
            <p className="text-[10px] text-slate-400">
              Dựa trên {inquiry.quantity} suất quà và ngân sách dự kiến{" "}
              {new Intl.NumberFormat("vi-VN", {
                style: "currency",
                currency: "VND",
              }).format(inquiry.budgetPerHamper)}
              /suất.
            </p>
          </div>

          {/* Ghi chú nội bộ chuyên viên */}
          <div className="space-y-1">
            <label className="font-bold text-slate-700">
              Ghi Chú Đàm Phán & Tiến Độ Sản Xuất
            </label>
            <textarea
              rows={3}
              value={adminNotes}
              onChange={(e) => setAdminNotes(e.target.value)}
              placeholder="VD: Đã gửi email demo khắc logo ngày 11/11, khách hẹn chuyển khoản cọc 30%..."
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-[#800028]"
            />
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
              <span>{isSubmitting ? "Đang lưu..." : "Cập Nhật Hồ Sơ"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
