"use client";

// ============================================================
// components/storefront/loyalty/LoyaltyRedemptionShop.tsx
// Gian Hàng Đổi Voucher Bằng Điểm Tích Lũy (Module 10.4)
// ============================================================

import React, { useState } from "react";
import Link from "next/link";
import {
  Gift,
  Coins,
  Copy,
  Check,
  AlertCircle,
  Tag,
  ArrowRight,
  ShieldCheck,
  Zap,
} from "lucide-react";
import type { RewardOption } from "./types";

interface LoyaltyRedemptionShopProps {
  rewards: readonly RewardOption[];
  currentPoints: number;
  onPointsUpdated: (newPoints: number) => void;
}

export const LoyaltyRedemptionShop: React.FC<LoyaltyRedemptionShopProps> = ({
  rewards,
  currentPoints,
  onPointsUpdated,
}) => {
  const [redeemingId, setRedeemingId] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [issuedVoucher, setIssuedVoucher] = useState<{
    code: string;
    amount: number;
    title: string;
  } | null>(null);
  const [copied, setCopied] = useState(false);

  const handleRedeem = async (reward: RewardOption) => {
    setErrorMsg(null);
    setIssuedVoucher(null);

    if (currentPoints < reward.pointsRequired) {
      setErrorMsg(
        `Bạn cần thêm ${(reward.pointsRequired - currentPoints).toLocaleString(
          "vi-VN"
        )} điểm để đổi phần quà này.`
      );
      return;
    }

    const confirmRedeem = window.confirm(
      `Xác nhận dùng ${reward.pointsRequired.toLocaleString(
        "vi-VN"
      )} điểm để đổi ${reward.title}?`
    );
    if (!confirmRedeem) return;

    try {
      setRedeemingId(reward.id);
      const res = await fetch("/api/user/loyalty/redeem", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rewardId: reward.id }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Đổi quà không thành công");
      }

      // Cập nhật điểm khả dụng của người dùng
      onPointsUpdated(data.data.remainingPoints);

      // Hiển thị voucher vừa đổi thành công
      setIssuedVoucher({
        code: data.data.voucherCode,
        amount: data.data.discountAmount,
        title: reward.title,
      });
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "Đã xảy ra lỗi khi đổi quà";
      setErrorMsg(msg);
    } finally {
      setRedeemingId(null);
    }
  };

  const handleCopyCode = () => {
    if (!issuedVoucher) return;
    navigator.clipboard.writeText(issuedVoucher.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h3 className="text-base font-black text-slate-800 flex items-center gap-2">
            <Gift className="w-5 h-5 text-[#800028]" />
            <span>Gian Hàng Đổi Thưởng THUYNGA Club</span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Dùng điểm tích lũy đổi voucher độc quyền – Áp dụng ngay tại bước thanh toán
          </p>
        </div>

        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-rose-50 border border-rose-200/80 text-xs font-bold text-[#800028] self-start sm:self-auto">
          <Coins className="w-3.5 h-3.5" />
          <span>Điểm khả dụng: {currentPoints.toLocaleString("vi-VN")} pts</span>
        </div>
      </div>

      {/* Thông báo lỗi nếu có */}
      {errorMsg && (
        <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Thông báo thành công & Mã voucher vừa đổi */}
      {issuedVoucher && (
        <div className="p-5 rounded-3xl bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-100 border border-emerald-300 shadow-md space-y-3 animate-in fade-in duration-300">
          <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm">
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
            <span>Đổi Thưởng Thành Công! Bạn nhận được {issuedVoucher.title}</span>
          </div>

          <p className="text-xs text-emerald-700">
            Mã voucher độc quyền của bạn đã được kích hoạt. Hãy sao chép mã và dán vào ô Khuyến Mãi tại trang Giỏ Hàng / Thanh Toán:
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="w-full sm:w-auto flex-1 flex items-center justify-between px-4 py-2.5 rounded-2xl bg-white border-2 border-dashed border-emerald-400 font-mono text-base font-black text-slate-800 tracking-wider">
              <span>{issuedVoucher.code}</span>
              <button
                type="button"
                onClick={handleCopyCode}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-sans font-bold transition-colors"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Đã Chép</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Sao Chép</span>
                  </>
                )}
              </button>
            </div>

            <Link
              href="/san-pham"
              className="w-full sm:w-auto px-5 py-2.5 rounded-2xl bg-[#800028] hover:bg-[#60001e] text-white text-xs font-bold transition-all text-center shrink-0"
            >
              Mua Sắm Áp Mã Ngay
            </Link>
          </div>
        </div>
      )}

      {/* Danh sách 3 Voucher đổi thưởng */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {rewards.map((reward) => {
          const isAffordable = currentPoints >= reward.pointsRequired;
          const isLoadingThis = redeemingId === reward.id;

          return (
            <div
              key={reward.id}
              className={`rounded-3xl border p-5 flex flex-col justify-between transition-all bg-white ${
                isAffordable
                  ? "border-rose-200 shadow-xs hover:shadow-md hover:border-[#800028]/40"
                  : "border-slate-200/80 opacity-75"
              }`}
            >
              <div>
                {/* Header voucher */}
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-rose-50 text-[#800028] text-xs font-black">
                    <Tag className="w-3 h-3" />
                    Giảm {reward.voucherValue.toLocaleString("vi-VN")} ₫
                  </span>

                  <span className="font-mono text-xs font-bold text-slate-600">
                    {reward.pointsRequired.toLocaleString("vi-VN")} pts
                  </span>
                </div>

                {/* Nội dung */}
                <h4 className="mt-3 text-sm font-extrabold text-slate-900">
                  {reward.title}
                </h4>
                <p className="mt-1 text-xs text-slate-500 leading-relaxed">
                  {reward.description}
                </p>

                <div className="mt-3 pt-3 border-t border-slate-100 text-[11px] text-slate-500">
                  Đơn tối thiểu:{" "}
                  <strong className="text-slate-700 font-semibold">
                    {reward.minOrderAmount.toLocaleString("vi-VN")} ₫
                  </strong>
                </div>
              </div>

              {/* Nút bấm đổi */}
              <div className="mt-5">
                <button
                  type="button"
                  disabled={!isAffordable || isLoadingThis}
                  onClick={() => handleRedeem(reward)}
                  className={`w-full py-2.5 px-4 rounded-2xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                    isAffordable
                      ? "bg-[#800028] hover:bg-[#60001e] text-white shadow-md shadow-[#800028]/20"
                      : "bg-slate-100 text-slate-400 cursor-not-allowed"
                  }`}
                >
                  {isLoadingThis ? (
                    <span>Đang đổi mã...</span>
                  ) : isAffordable ? (
                    <>
                      <span>Đổi Thưởng Ngay</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  ) : (
                    <span>
                      Cần thêm{" "}
                      {(reward.pointsRequired - currentPoints).toLocaleString("vi-VN")}{" "}
                      điểm
                    </span>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
