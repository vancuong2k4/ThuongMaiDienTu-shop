"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Tag,
  ArrowRight,
  ShieldCheck,
  RotateCcw,
  PackageCheck,
  Check,
  X,
  Loader2,
} from "lucide-react";
import { formatVND } from "@/lib/utils";
import type { AppliedVoucher } from "@/store/cart";

interface CartOrderSummaryProps {
  subtotal: number;
  shippingFee: number;
  discountAmount: number;
  totalPrice: number;
  appliedVoucher: AppliedVoucher | null;
  onApplyVoucher: (voucher: AppliedVoucher) => void;
  onRemoveVoucher: () => void;
}

const SUGGESTED_VOUCHERS = [
  { code: "WELCOME50", desc: "Giảm 50k đơn từ 500k" },
  { code: "FREESHIP", desc: "Freeship đơn từ 300k" },
  { code: "THUYNGA10", desc: "Giảm 10% đơn từ 1M" },
];

export function CartOrderSummary({
  subtotal,
  shippingFee,
  discountAmount,
  totalPrice,
  appliedVoucher,
  onApplyVoucher,
  onRemoveVoucher,
}: CartOrderSummaryProps) {
  const [voucherInput, setVoucherInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const handleApply = async (codeToApply?: string) => {
    const code = (codeToApply || voucherInput).trim().toUpperCase();
    if (!code) {
      setErrorMsg("Vui lòng nhập mã giảm giá");
      return;
    }

    setIsLoading(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      const res = await fetch("/api/vouchers/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, subtotal }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setErrorMsg(data.error || "Mã không hợp lệ hoặc không đủ điều kiện");
      } else {
        onApplyVoucher(data.voucher);
        setSuccessMsg(`Áp dụng thành công mã ${code}!`);
        setVoucherInput("");
      }
    } catch (err) {
      setErrorMsg("Không thể kết nối đến máy chủ. Vui lòng thử lại!");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-gray-100 p-5 sm:p-6 shadow-sm sticky top-24 space-y-5">
      <h3 className="font-black text-base sm:text-lg text-gray-900 border-b border-gray-100 pb-3 uppercase tracking-tight">
        Tóm Tắt Đơn Hàng
      </h3>

      {/* ── Nhập mã giảm giá ───────────────────────────────────────── */}
      <div className="space-y-2.5">
        <label className="flex items-center gap-1.5 text-xs font-bold text-gray-700">
          <Tag className="w-3.5 h-3.5 text-[#800028]" />
          <span>Mã Khuyến Mãi / Voucher</span>
        </label>

        {appliedVoucher ? (
          <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-between gap-2 animate-in fade-in-50">
            <div className="space-y-0.5 min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="font-black text-xs text-emerald-800 uppercase tracking-wider bg-white px-2 py-0.5 rounded border border-emerald-300">
                  {appliedVoucher.code}
                </span>
                <span className="text-[11px] text-emerald-700 font-semibold truncate">
                  {appliedVoucher.description}
                </span>
              </div>
              <div className="text-[11px] text-emerald-600">
                Tiết kiệm: -{formatVND(discountAmount)}
              </div>
            </div>

            <button
              type="button"
              onClick={onRemoveVoucher}
              className="w-7 h-7 rounded-full bg-white hover:bg-emerald-100 text-gray-500 hover:text-red-600 flex items-center justify-center transition-colors shrink-0 shadow-2xs cursor-pointer"
              title="Gỡ mã giảm giá"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleApply();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={voucherInput}
              onChange={(e) => {
                setVoucherInput(e.target.value.toUpperCase());
                setErrorMsg("");
              }}
              placeholder="Nhập mã ưu đãi..."
              className="flex-1 h-10 px-3.5 rounded-xl border border-gray-200 text-xs font-semibold uppercase placeholder:normal-case placeholder:font-normal focus:border-[#800028] focus:outline-none transition-colors"
            />
            <button
              type="submit"
              disabled={isLoading || !voucherInput.trim()}
              className="h-10 px-4 rounded-xl bg-gray-900 hover:bg-[#800028] text-white font-bold text-xs transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5 shrink-0 cursor-pointer"
            >
              {isLoading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              <span>Áp dụng</span>
            </button>
          </form>
        )}

        {/* Thông báo lỗi / thành công */}
        {errorMsg && (
          <p className="text-[11px] text-red-600 font-medium">{errorMsg}</p>
        )}
        {successMsg && (
          <p className="text-[11px] text-emerald-600 font-medium">{successMsg}</p>
        )}

        {/* Gợi ý mã có sẵn */}
        {!appliedVoucher && (
          <div className="pt-1">
            <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1.5">
              Mã gợi ý cho bạn:
            </div>
            <div className="flex flex-wrap gap-1.5">
              {SUGGESTED_VOUCHERS.map((v) => (
                <button
                  key={v.code}
                  type="button"
                  onClick={() => handleApply(v.code)}
                  className="px-2.5 py-1 rounded-lg bg-gray-50 hover:bg-rose-50 text-gray-700 hover:text-[#800028] border border-gray-200/80 hover:border-rose-200 text-[10px] font-semibold transition-all cursor-pointer"
                >
                  <span className="font-bold">{v.code}</span>: {v.desc}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="border-t border-gray-100" />

      {/* ── Bảng tính tiền chi tiết ───────────────────────────────── */}
      <div className="space-y-2.5 text-xs sm:text-sm">
        <div className="flex items-center justify-between text-gray-600">
          <span>Tạm tính hàng hóa:</span>
          <span className="font-bold text-gray-900">{formatVND(subtotal)}</span>
        </div>

        {discountAmount > 0 && (
          <div className="flex items-center justify-between text-emerald-700 font-semibold">
            <span>Giảm giá khuyến mãi:</span>
            <span>-{formatVND(discountAmount)}</span>
          </div>
        )}

        <div className="flex items-center justify-between text-gray-600">
          <div className="flex flex-col">
            <span>Phí vận chuyển dự kiến:</span>
            <span className="text-[10px] text-gray-400">
              (Miễn phí cho đơn từ 500k)
            </span>
          </div>
          <span className="font-bold text-gray-900">
            {shippingFee === 0 ? (
              <span className="text-emerald-700 font-black">Miễn phí</span>
            ) : (
              formatVND(shippingFee)
            )}
          </span>
        </div>

        <div className="border-t border-dashed border-gray-200 pt-3 flex items-baseline justify-between">
          <div>
            <div className="text-sm font-bold text-gray-900">Tổng thanh toán:</div>
            <div className="text-[10px] text-gray-400 font-normal">
              (Đã bao gồm thuế GTGT nếu có)
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-black text-[#800028]">
            {formatVND(totalPrice)}
          </div>
        </div>
      </div>

      {/* ── Nút Tiến Hành Thanh Toán ──────────────────────────────── */}
      <div className="pt-2">
        <Link
          href="/thanh-toan"
          className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-[#800028] to-[#9e0032] hover:from-[#5c001e] hover:to-[#800028] text-white font-black text-sm tracking-wide uppercase flex items-center justify-center gap-2 shadow-lg shadow-rose-900/20 active:scale-[0.99] transition-all cursor-pointer"
        >
          <span>Tiến Hành Thanh Toán</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* ── 3 Cam kết mua sắm an toàn ─────────────────────────────── */}
      <div className="pt-2 border-t border-gray-100 space-y-2 text-[11px] text-gray-500">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Cam kết 100% chính hãng, đền 200% nếu hàng giả</span>
        </div>
        <div className="flex items-center gap-2">
          <PackageCheck className="w-4 h-4 text-blue-600 shrink-0" />
          <span>Được kiểm tra hàng trước khi thanh toán tiền mặt</span>
        </div>
        <div className="flex items-center gap-2">
          <RotateCcw className="w-4 h-4 text-[#800028] shrink-0" />
          <span>Đổi trả linh hoạt trong 7 ngày nếu lỗi bao bì</span>
        </div>
      </div>
    </div>
  );
}
