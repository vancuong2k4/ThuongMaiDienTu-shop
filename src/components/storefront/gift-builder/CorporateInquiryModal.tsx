"use client";

// ============================================================
// components/storefront/gift-builder/CorporateInquiryModal.tsx
// Modal Yêu Cầu Báo Giá Quà Doanh Nghiệp B2B Số Lượng Lớn (Phase 17)
// ============================================================

import React, { useState } from "react";
import {
  X,
  Building2,
  Phone,
  Mail,
  Send,
  CheckCircle2,
  AlertCircle,
  FileText,
  Stamp,
} from "lucide-react";
import { GiftOccasion } from "@prisma/client";
import { GIFT_OCCASION_CONFIG } from "@/lib/validations/gift-box";

interface CorporateInquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CorporateInquiryModal: React.FC<CorporateInquiryModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [companyName, setCompanyName] = useState("");
  const [contactPerson, setContactPerson] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [occasion, setOccasion] = useState<GiftOccasion>(
    GiftOccasion.CORPORATE_THANK_YOU
  );
  const [quantity, setQuantity] = useState("50");
  const [budgetPerHamper, setBudgetPerHamper] = useState("2000000");
  const [deliveryDeadline, setDeliveryDeadline] = useState("");
  const [requiresVatInvoice, setRequiresVatInvoice] = useState(true);
  const [customLogoBranding, setCustomLogoBranding] = useState(true);
  const [notes, setNotes] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [inquiryCode, setInquiryCode] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/gift-boxes/corporate-inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          companyName,
          contactPerson,
          phone,
          email,
          occasion,
          quantity: parseInt(quantity, 10) || 5,
          budgetPerHamper: parseFloat(budgetPerHamper) || 1000000,
          deliveryDeadline: deliveryDeadline || null,
          requiresVatInvoice,
          customLogoBranding,
          notes,
        }),
      });

      const data = await res.json();
      if (!data.success) {
        throw new Error(data.message || "Không thể gửi yêu cầu báo giá.");
      }

      setIsSuccess(true);
      setInquiryCode(data.data?.inquiryCode || null);
    } catch (err: any) {
      setError(err.message || "Đã xảy ra lỗi khi gửi yêu cầu.");
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
                Yêu Cầu Báo Giá Quà Tặng Doanh Nghiệp B2B
              </h3>
              <p className="text-[11px] text-slate-400">
                Chiết khấu lên đến 15% cho đơn hàng từ 5 suất trở lên
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

        {/* Content */}
        {isSuccess ? (
          <div className="p-8 text-center space-y-4">
            <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <h4 className="font-bold text-slate-900 text-base">
                Tiếp Nhận Yêu Cầu B2B Thành Công!
              </h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
                Mã yêu cầu của Quý Doanh nghiệp:{" "}
                <strong className="text-slate-900 font-mono font-bold text-sm">
                  {inquiryCode}
                </strong>
                . Chuyên viên phòng dự án B2B của THUYNGA Shop sẽ liên hệ gửi bảng báo giá & demo thiết kế trong vòng 2-4 giờ làm việc.
              </p>
            </div>
            <button
              onClick={onClose}
              className="px-6 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition-all shadow-xs"
            >
              Đóng Cửa Sổ
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-3.5 flex-1 text-xs">
            {error && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {/* Tên công ty & Người liên hệ */}
            <div className="space-y-1">
              <label className="font-bold text-slate-700">Tên Doanh Nghiệp / Tổ Chức *</label>
              <input
                type="text"
                required
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="VD: Tập đoàn ABC, Công ty TNHH XYZ"
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-[#800028]"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700">Người Phụ Trách Liên Hệ *</label>
              <input
                type="text"
                required
                value={contactPerson}
                onChange={(e) => setContactPerson(e.target.value)}
                placeholder="Họ tên & Chức danh"
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-[#800028]"
              />
            </div>

            {/* SĐT & Email */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="font-bold text-slate-700">Số Điện Thoại Zalo *</label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="0912.345.678"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-[#800028]"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Email Nhận Báo Giá *</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="contact@company.vn"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-[#800028]"
                />
              </div>
            </div>

            {/* Số lượng suất & Ngân sách */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="font-bold text-slate-700">Số Lượng Suất Quà (từ 5 suất) *</label>
                <input
                  type="number"
                  min={5}
                  required
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-[#800028]"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Ngân Sách Mỗi Suất (VNĐ) *</label>
                <input
                  type="number"
                  min={500000}
                  step={100000}
                  required
                  value={budgetPerHamper}
                  onChange={(e) => setBudgetPerHamper(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-[#800028]"
                />
              </div>
            </div>

            {/* Dịp & Hạn giao */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="font-bold text-slate-700">Dịp Tặng Quà *</label>
                <select
                  value={occasion}
                  onChange={(e) => setOccasion(e.target.value as GiftOccasion)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-[#800028] bg-white font-medium"
                >
                  {Object.entries(GIFT_OCCASION_CONFIG).map(([k, cfg]) => (
                    <option key={k} value={k}>
                      {cfg.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Hạn Giao Hàng Dự Kiến</label>
                <input
                  type="date"
                  value={deliveryDeadline}
                  onChange={(e) => setDeliveryDeadline(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-[#800028]"
                />
              </div>
            </div>

            {/* Checkboxes: VAT & Logo Branding */}
            <div className="pt-1 space-y-2">
              <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-700">
                <input
                  type="checkbox"
                  checked={requiresVatInvoice}
                  onChange={(e) => setRequiresVatInvoice(e.target.checked)}
                  className="w-4 h-4 text-[#800028] rounded border-slate-300 focus:ring-[#800028]"
                />
                <span>Yêu cầu xuất hóa đơn đỏ VAT (8% - 10%) đầy đủ</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-700">
                <input
                  type="checkbox"
                  checked={customLogoBranding}
                  onChange={(e) => setCustomLogoBranding(e.target.checked)}
                  className="w-4 h-4 text-[#800028] rounded border-slate-300 focus:ring-[#800028]"
                />
                <span>Yêu cầu in khắc laser logo doanh nghiệp lên hộp quà / ruy băng</span>
              </label>
            </div>

            {/* Notes */}
            <div className="space-y-1">
              <label className="font-bold text-slate-700">Ghi Chú Phối Set & Yêu Cầu Riêng</label>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="VD: Cần phối set Cherry Úc + Mật ong Manuka, giao tại tòa nhà Keangnam Hà Nội..."
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
                className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-slate-900 text-white hover:bg-slate-800 font-bold shadow-xs transition-all disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
                <span>{isSubmitting ? "Đang gửi..." : "Gửi Yêu Cầu Báo Giá"}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
