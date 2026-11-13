"use client";

// ============================================================
// components/storefront/preorder/ReservationModal.tsx
// Modal Đặt Cọc Giữ Chỗ Mùa Vụ & Quét Mã VietQR Napas 24/7 (Phase 21)
// ============================================================

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import {
  X,
  CheckCircle2,
  Copy,
  Check,
  ShieldCheck,
  Plane,
  AlertCircle,
  ArrowRight,
  Phone,
  User,
  MapPin,
  Mail,
} from "lucide-react";

interface ReservationModalProps {
  campaignId: string;
  campaignTitle: string;
  depositPercent: number;
  flightDepartureWeek: string;
  tier: {
    id: string;
    name: string;
    price: number;
    depositAmount: number;
    totalSlots: number;
    reservedSlots: number;
  } | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const ReservationModal: React.FC<ReservationModalProps> = ({
  campaignId,
  campaignTitle,
  depositPercent,
  flightDepartureWeek,
  tier,
  isOpen,
  onClose,
  onSuccess,
}) => {
  const { data: session } = useSession();

  const [step, setStep] = useState<"FORM" | "PAYMENT">("FORM");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form State
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [notes, setNotes] = useState("");

  // Payment Result State
  const [reservationData, setReservationData] = useState<any>(null);
  const [paymentData, setPaymentData] = useState<any>(null);

  // Copy feedback state
  const [copiedField, setCopiedField] = useState<string | null>(null);

  useEffect(() => {
    if (session?.user) {
      if (session.user.name && !customerName) setCustomerName(session.user.name);
      if (session.user.email && !customerEmail) setCustomerEmail(session.user.email);
    }
  }, [session, customerName, customerEmail]);

  if (!isOpen || !tier) return null;

  const pricePerUnit = Number(tier.price);
  const depositPerUnit = Number(tier.depositAmount);
  const totalContractPrice = pricePerUnit * quantity;
  const totalDepositRequired = depositPerUnit * quantity;
  const remainingBalance = totalContractPrice - totalDepositRequired;
  const availableSlots = tier.totalSlots - tier.reservedSlots;

  const formatVND = (n: number) => {
    return new Intl.NumberFormat("vi-VN").format(n) + "₫";
  };

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const payload = {
        campaignId,
        tierId: tier.id,
        customerName: customerName.trim(),
        customerPhone: customerPhone.trim(),
        customerEmail: customerEmail.trim() || undefined,
        deliveryAddress: deliveryAddress.trim(),
        quantity: Number(quantity),
        depositMethod: "VIETQR_NAPAS",
        notes: notes.trim() || undefined,
      };

      const res = await fetch("/api/preorders/reserve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        setError(json.message || "Không thể khởi tạo đơn đặt giữ chỗ.");
        return;
      }

      setReservationData(json.reservation);
      setPaymentData(json.payment);
      setStep("PAYMENT");
      if (onSuccess) onSuccess();
    } catch {
      setError("Lỗi kết nối máy chủ khi tạo đơn đặt chỗ.");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setStep("FORM");
    setError(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl w-full max-w-xl max-h-[92vh] shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-slate-900 to-[#800028] text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center">
              <Plane className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <h3 className="font-black text-sm tracking-wide uppercase">
                {step === "FORM"
                  ? "Đặt Cọc Giữ Chỗ Mùa Vụ Úc"
                  : "Thanh Toán Cọc VietQR Napas 24/7"}
              </h3>
              <p className="text-[11px] text-slate-300 line-clamp-1">
                {campaignTitle} • {tier.name}
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        {step === "FORM" ? (
          <form
            onSubmit={handleSubmit}
            className="p-5 sm:p-6 overflow-y-auto space-y-4 text-xs"
          >
            {error && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 font-medium">
                {error}
              </div>
            )}

            {/* Selected Tier Recap Box */}
            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
              <div className="flex justify-between items-start">
                <div>
                  <span className="font-black text-xs text-slate-900">
                    {tier.name}
                  </span>
                  <p className="text-[10px] text-slate-400 mt-0.5">
                    Khởi hành: <strong>{flightDepartureWeek}</strong>
                  </p>
                </div>
                <span className="text-[10px] font-mono font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-md">
                  Còn {availableSlots} suất
                </span>
              </div>

              <div className="pt-2 border-t border-slate-200 grid grid-cols-3 gap-2 text-center text-[11px]">
                <div>
                  <span className="text-[10px] text-slate-400 block">Đơn giá:</span>
                  <span className="font-bold text-slate-800 font-mono">
                    {formatVND(pricePerUnit)}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">
                    Cọc giữ slot ({depositPercent}%):
                  </span>
                  <span className="font-black text-[#800028] font-mono">
                    {formatVND(depositPerUnit)}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">
                    Thanh toán khi nhận:
                  </span>
                  <span className="font-bold text-slate-600 font-mono">
                    {formatVND(pricePerUnit - depositPerUnit)}
                  </span>
                </div>
              </div>
            </div>

            {/* Quantity Selector */}
            <div className="flex items-center justify-between p-3 bg-white rounded-xl border border-slate-200">
              <label className="font-bold text-slate-700">
                Số lượng hộp / thùng đặt:
              </label>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold flex items-center justify-center text-sm"
                >
                  -
                </button>
                <span className="w-8 text-center font-mono font-black text-sm text-slate-900">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() =>
                    setQuantity(Math.min(availableSlots, quantity + 1))
                  }
                  className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold flex items-center justify-center text-sm"
                >
                  +
                </button>
              </div>
            </div>

            {/* Customer Inputs */}
            <div className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Họ và tên người nhận <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="VD: Nguyễn Văn Anh"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-[#800028] outline-hidden font-medium"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Số điện thoại nhận hàng <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="VD: 0912345678"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 font-mono font-bold focus:border-[#800028] outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Địa chỉ giao hàng (Tận nhà) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Số nhà, tên đường, phường/xã, quận/huyện, tỉnh/thành"
                  value={deliveryAddress}
                  onChange={(e) => setDeliveryAddress(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-[#800028] outline-hidden font-medium"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Email nhận thông báo vận đơn (tùy chọn)
                </label>
                <input
                  type="email"
                  placeholder="name@example.com"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-[#800028] outline-hidden"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Ghi chú cho Dược sĩ / Kho đóng gói (tùy chọn)
                </label>
                <input
                  type="text"
                  placeholder="VD: Giao đúng ngày 27 Tết, đóng gói kèm thiệp chúc..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-[#800028] outline-hidden"
                />
              </div>
            </div>

            {/* Total deposit calculation bar */}
            <div className="p-3.5 bg-rose-50/80 rounded-2xl border border-rose-200 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-rose-700 font-bold uppercase block">
                  Số tiền cọc cần thanh toán:
                </span>
                <span className="text-base sm:text-lg font-black text-[#800028] font-mono">
                  {formatVND(totalDepositRequired)}
                </span>
              </div>
              <div className="text-right text-[11px] text-slate-500">
                <span>Tổng hợp đồng: {formatVND(totalContractPrice)}</span>
                <span className="block text-[10px]">
                  Còn lại {formatVND(remainingBalance)} khi nhận
                </span>
              </div>
            </div>

            {/* Submit CTA */}
            <div className="pt-2 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={handleClose}
                disabled={loading}
                className="px-4 py-2.5 rounded-xl border border-slate-300 font-bold text-slate-600 hover:bg-slate-50 transition-colors"
              >
                Hủy bỏ
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-5 py-2.5 rounded-xl bg-[#800028] hover:bg-[#660020] text-white font-black shadow-md transition-colors flex items-center gap-1.5 disabled:opacity-50 cursor-pointer"
              >
                <span>{loading ? "Đang xử lý..." : "Tiếp Tục Quét Mã Cọc"}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        ) : (
          /* Step 2: VietQR Payment Display */
          <div className="p-5 sm:p-6 overflow-y-auto space-y-4 text-xs">
            <div className="text-center space-y-1">
              <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto mb-2">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h4 className="text-base font-black text-slate-900">
                Đã Khởi Tạo Suất Giữ Chỗ Thành Công!
              </h4>
              <p className="text-slate-500 text-[11px]">
                Mã đơn đặt trước:{" "}
                <strong className="text-[#800028] font-mono">
                  {reservationData?.reservationCode}
                </strong>
              </p>
            </div>

            {/* QR Code Container */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col items-center space-y-3">
              <div className="bg-white p-2.5 rounded-2xl border border-slate-200 shadow-xs">
                {paymentData?.vietQrUrl ? (
                  <img
                    src={paymentData.vietQrUrl}
                    alt="Mã QR Napas 24/7 đặt cọc"
                    width={220}
                    height={220}
                    className="rounded-xl mx-auto"
                  />
                ) : (
                  <div className="w-48 h-48 bg-slate-100 flex items-center justify-center text-slate-400 font-mono text-[10px]">
                    Đang tải mã QR...
                  </div>
                )}
              </div>

              <div className="text-center space-y-0.5">
                <span className="text-[10px] text-slate-400 uppercase font-bold">
                  Số tiền cần chuyển khoản đúng:
                </span>
                <div className="text-lg font-black text-[#800028] font-mono">
                  {formatVND(paymentData?.amount || 0)}
                </div>
              </div>
            </div>

            {/* Transfer details copy fields */}
            <div className="space-y-2 bg-white rounded-2xl border border-slate-200 p-3.5">
              {/* Bank */}
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-slate-500">Ngân hàng:</span>
                <span className="font-bold text-slate-800">
                  {paymentData?.bankName}
                </span>
              </div>

              {/* Account Number */}
              <div className="flex items-center justify-between text-[11px] pt-1 border-t border-slate-100">
                <span className="text-slate-500">Số tài khoản:</span>
                <div className="flex items-center gap-1.5 font-mono font-bold text-slate-900">
                  <span>{paymentData?.bankAccount}</span>
                  <button
                    type="button"
                    onClick={() =>
                      copyToClipboard(paymentData?.bankAccount, "account")
                    }
                    className="p-1 hover:bg-slate-100 rounded text-slate-500"
                    title="Sao chép số tài khoản"
                  >
                    {copiedField === "account" ? (
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Account Name */}
              <div className="flex items-center justify-between text-[11px] pt-1 border-t border-slate-100">
                <span className="text-slate-500">Chủ tài khoản:</span>
                <span className="font-bold text-slate-800 font-mono">
                  {paymentData?.bankAccountName}
                </span>
              </div>

              {/* Memo */}
              <div className="flex items-center justify-between text-[11px] pt-1 border-t border-slate-100">
                <span className="text-slate-500">Nội dung chuyển khoản:</span>
                <div className="flex items-center gap-1.5 font-mono font-black text-[#800028]">
                  <span>{paymentData?.transferContent}</span>
                  <button
                    type="button"
                    onClick={() =>
                      copyToClipboard(paymentData?.transferContent, "memo")
                    }
                    className="p-1 hover:bg-slate-100 rounded text-slate-500"
                    title="Sao chép nội dung chuyển khoản"
                  >
                    {copiedField === "memo" ? (
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Pledge note */}
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>
                Sau khi quét mã VietQR, hệ thống sẽ tự động đối soát và gửi tin nhắn xác nhận giữ slot trong vòng 5-10 phút. Quý khách có thể theo dõi tiến độ bay trên trang cá nhân.
              </span>
            </div>

            {/* Actions */}
            <div className="pt-2 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={handleClose}
                className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-colors"
              >
                Đã Hoàn Tất Chuyển Cọc & Đóng
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
