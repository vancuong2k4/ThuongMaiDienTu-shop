"use client";

// ============================================================
// components/admin/settings/VietQRSettingsForm.tsx
// Form Cấu Hình Tài Khoản Ngân Hàng VietQR Napas 24/7 & Live Preview
// ============================================================

import React, { useState } from "react";
import Image from "next/image";
import {
  CreditCard,
  QrCode,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Copy,
  Check,
  Smartphone,
  ShieldCheck,
} from "lucide-react";
import type { VietQRConfigValues } from "./types";

interface VietQRSettingsFormProps {
  initialData: VietQRConfigValues;
  onSave: (data: VietQRConfigValues) => Promise<void>;
}

const SUPPORTED_BANKS = [
  { code: "MB", name: "MB Bank (Ngân hàng Quân Đội)" },
  { code: "VCB", name: "Vietcombank (Ngoại Thương Việt Nam)" },
  { code: "TCB", name: "Techcombank (Kỹ Thương Việt Nam)" },
  { code: "ICB", name: "VietinBank (Công Thương Việt Nam)" },
  { code: "BIDV", name: "BIDV (Đầu Tư & Phát Triển)" },
  { code: "ACB", name: "ACB (Á Châu)" },
  { code: "TPB", name: "TPBank (Tiên Phong)" },
  { code: "VPB", name: "VPBank (Việt Nam Thịnh Vượng)" },
  { code: "STB", name: "Sacombank (Sài Gòn Thương Tín)" },
  { code: "HDB", name: "HDBank (Phát Triển TP.HCM)" },
  { code: "VIB", name: "VIB (Quốc Tế)" },
  { code: "SHB", name: "SHB (Sài Gòn - Hà Nội)" },
  { code: "OCB", name: "OCB (Phương Đông)" },
  { code: "MSB", name: "MSB (Hàng Hải)" },
  { code: "SEAB", name: "SeABank (Đông Nam Á)" },
];

export const VietQRSettingsForm: React.FC<VietQRSettingsFormProps> = ({
  initialData,
  onSave,
}) => {
  const [formData, setFormData] = useState<VietQRConfigValues>(initialData);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const handleChange = (field: keyof VietQRConfigValues, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: field === "accountName" ? value.toUpperCase() : value,
    }));
    setSavedSuccess(false);
    setErrorMsg(null);
  };

  const handleCopy = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2000);
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
      setErrorMsg(err.message || "Không thể lưu cấu hình VietQR");
    } finally {
      setSaving(false);
    }
  };

  // Sinh link mã VietQR xem thử
  const qrPreviewUrl = `https://img.vietqr.io/image/${formData.bankId}-${formData.accountNo}-${formData.template}.png?amount=10000&addInfo=TEST%20NAPAS%20247&accountName=${encodeURIComponent(
    formData.accountName
  )}`;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {savedSuccess && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Đã lưu cấu hình tài khoản VietQR Napas 24/7 thành công!</span>
        </div>
      )}

      {errorMsg && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Cột trái: Form nhập thông tin */}
        <div className="lg:col-span-7 space-y-5 bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs">
          <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2 border-b border-slate-100 pb-3">
            <CreditCard className="w-4 h-4 text-[#800028]" />
            <span>Thông Tin Tài Khoản Thụ Hưởng</span>
          </h4>

          {/* Ngân hàng */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Ngân Hàng Nhận Tiền <span className="text-rose-500">*</span>
            </label>
            <select
              value={formData.bankId}
              onChange={(e) => handleChange("bankId", e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#800028]/20 focus:border-[#800028] transition-all cursor-pointer"
            >
              {SUPPORTED_BANKS.map((b) => (
                <option key={b.code} value={b.code}>
                  {b.name} ({b.code})
                </option>
              ))}
            </select>
            <p className="mt-1 text-[11px] text-slate-400">
              Hỗ trợ chuyển tiền liên ngân hàng 24/7 qua cổng thanh toán Napas
            </p>
          </div>

          {/* Số tài khoản */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Số Tài Khoản Ngân Hàng <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={formData.accountNo}
              onChange={(e) => handleChange("accountNo", e.target.value.replace(/\D/g, ""))}
              placeholder="VD: 0987654321"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-sm font-mono font-bold tracking-wider text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#800028]/20 focus:border-[#800028] transition-all"
              required
            />
          </div>

          {/* Tên chủ tài khoản */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Tên Chủ Tài Khoản (In hoa không dấu) <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={formData.accountName}
              onChange={(e) => handleChange("accountName", e.target.value)}
              placeholder="VD: TRAN VAN CUONG"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-sm font-bold tracking-wider text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#800028]/20 focus:border-[#800028] transition-all"
              required
            />
            <p className="mt-1 text-[11px] text-slate-400">
              Trùng khớp với tên trên thẻ ATM / ứng dụng ngân hàng
            </p>
          </div>

          {/* Mẫu hiển thị VietQR Template */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Mẫu Hiển Thị VietQR
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: "compact", label: "Gọn chuẩn (Compact)" },
                { id: "compact2", label: "Hiện đại (Compact 2)" },
                { id: "qr_only", label: "Chỉ mã QR" },
              ].map((tmpl) => (
                <button
                  key={tmpl.id}
                  type="button"
                  onClick={() => handleChange("template", tmpl.id)}
                  className={`p-2.5 rounded-xl border text-xs font-bold transition-all text-center ${
                    formData.template === tmpl.id
                      ? "border-[#800028] bg-rose-50/50 text-[#800028] ring-1 ring-[#800028]"
                      : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  {tmpl.label}
                </button>
              ))}
            </div>
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
                  <span>Lưu Cấu Hình VietQR</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Cột phải: Live Preview Thẻ VietQR Napas 24/7 */}
        <div className="lg:col-span-5 bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-6 text-white shadow-lg space-y-4">
          <div className="flex items-center justify-between border-b border-slate-700 pb-3">
            <div className="flex items-center gap-2">
              <QrCode className="w-4 h-4 text-amber-400" />
              <h4 className="text-xs font-bold tracking-wider uppercase text-amber-300">
                Live Preview VietQR Napas 24/7
              </h4>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              Hoạt động
            </span>
          </div>

          {/* QR Container */}
          <div className="bg-white rounded-2xl p-4 flex flex-col items-center justify-center shadow-md">
            {formData.accountNo && formData.accountName ? (
              <Image
                src={qrPreviewUrl}
                alt="VietQR Live Test"
                width={260}
                height={260}
                className="w-60 h-auto rounded-lg object-contain"
                unoptimized
              />
            ) : (
              <div className="w-60 h-60 flex flex-col items-center justify-center text-slate-400 gap-2">
                <QrCode className="w-12 h-12 text-slate-300" />
                <span className="text-xs">Vui lòng nhập đủ STK và tên</span>
              </div>
            )}
            <p className="mt-3 text-[11px] text-slate-500 text-center flex items-center gap-1">
              <Smartphone className="w-3.5 h-3.5 text-slate-400" />
              <span>Quét thử bằng App ngân hàng bất kỳ (Mẫu 10.000₫)</span>
            </p>
          </div>

          {/* Account Details Box */}
          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-800/80 border border-slate-700">
              <span className="text-slate-400">Ngân hàng:</span>
              <span className="font-bold text-white">{formData.bankId}</span>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-800/80 border border-slate-700">
              <span className="text-slate-400">Số tài khoản:</span>
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-amber-300">{formData.accountNo}</span>
                <button
                  type="button"
                  onClick={() => handleCopy(formData.accountNo, "accNo")}
                  className="p-1 rounded text-slate-400 hover:text-white"
                >
                  {copiedField === "accNo" ? (
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-800/80 border border-slate-700">
              <span className="text-slate-400">Chủ tài khoản:</span>
              <span className="font-bold text-white tracking-wider">{formData.accountName}</span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-[11px] text-amber-200/90 leading-relaxed flex items-start gap-2">
            <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <span>
              Mọi đơn hàng chọn thanh toán VietQR ngoài storefront sẽ tự động gắn số tiền chính xác và mã chuyển khoản của đơn hàng vào mã QR này.
            </span>
          </div>
        </div>
      </div>
    </form>
  );
};
