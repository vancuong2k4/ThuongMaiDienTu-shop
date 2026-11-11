"use client";

// ============================================================
// components/storefront/referral/ReferralHubClient.tsx
// Trung Tâm Mời Bạn Nhận Quà Storefront - Client Container (Stage 12.4)
// ============================================================

import React, { useState, useRef } from "react";
import { ReferralHeroBanner } from "./ReferralHeroBanner";
import { ReferralShareCard } from "./ReferralShareCard";
import { ReferralStatsCards } from "./ReferralStatsCards";
import { ReferralFriendsList } from "./ReferralFriendsList";
import { ReferralFAQ } from "./ReferralFAQ";
import type {
  ReferralUserProfile,
  StorefrontReferralStats,
  InvitedFriendItem,
} from "./types";
import { Gift, Check, AlertCircle, ArrowRight } from "lucide-react";

interface ReferralHubClientProps {
  user: ReferralUserProfile;
  stats: StorefrontReferralStats;
  friends: InvitedFriendItem[];
  hasReferrer: boolean;
  referredByCode?: string | null;
}

export const ReferralHubClient: React.FC<ReferralHubClientProps> = ({
  user,
  stats,
  friends,
  hasReferrer: initialHasReferrer,
  referredByCode: initialReferredByCode,
}) => {
  const shareCardRef = useRef<HTMLDivElement>(null);

  // Nhập mã mời từ người khác
  const [hasReferrer, setHasReferrer] = useState(initialHasReferrer);
  const [appliedCode, setAppliedCode] = useState(initialReferredByCode || "");
  const [inputCode, setInputCode] = useState("");
  const [isApplying, setIsApplying] = useState(false);
  const [applyMessage, setApplyMessage] = useState<{
    type: "success" | "error";
    text: string;
    voucherCode?: string;
  } | null>(null);

  const handleScrollToShare = () => {
    shareCardRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleApplyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputCode.trim()) return;

    try {
      setIsApplying(true);
      setApplyMessage(null);

      const res = await fetch("/api/user/referral/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ referralCode: inputCode.trim() }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setHasReferrer(true);
        setAppliedCode(inputCode.trim().toUpperCase());
        setApplyMessage({
          type: "success",
          text: `Áp dụng mã giới thiệu thành công! Bạn nhận được Voucher chào mừng 50.000₫ (${data.data.voucherCode}).`,
          voucherCode: data.data.voucherCode,
        });
        setInputCode("");
      } else {
        setApplyMessage({
          type: "error",
          text: data.error || "Không thể áp dụng mã giới thiệu",
        });
      }
    } catch (err) {
      console.error("Apply referral code error:", err);
      setApplyMessage({
        type: "error",
        text: "Đã xảy ra lỗi mạng. Vui lòng thử lại sau.",
      });
    } finally {
      setIsApplying(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* 1. Hero Banner */}
      <ReferralHeroBanner />

      {/* 2. Thẻ Chia Sẻ Mã & Link */}
      <div ref={shareCardRef}>
        <ReferralShareCard
          referralCode={user.referralCode}
          referralLink={user.referralLink}
        />
      </div>

      {/* 3. Ô Nhập Mã Mời Từ Người Khác (Nếu chưa có người giới thiệu) */}
      {!hasReferrer && (
        <div className="bg-gradient-to-r from-amber-50 to-orange-50/60 rounded-3xl border border-amber-200/90 p-6 sm:p-8 shadow-sm">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="max-w-xl">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 text-amber-900 text-xs font-bold uppercase tracking-wider mb-2">
                <Gift className="w-3.5 h-3.5 text-amber-700" />
                <span>Nhận Voucher Chào Mừng 50.000 ₫</span>
              </div>
              <h3 className="text-base sm:text-lg font-black text-amber-950">
                Bạn có mã giới thiệu từ bạn bè?
              </h3>
              <p className="text-xs sm:text-sm text-amber-900/80 mt-1">
                Nhập mã mời của bạn bè để nhận ngay 1 voucher 50.000₫ (cho đơn từ
                300k). Áp dụng cho tài khoản chưa phát sinh đơn hàng.
              </p>
            </div>

            <form
              onSubmit={handleApplyCode}
              className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 shrink-0"
            >
              <input
                type="text"
                value={inputCode}
                onChange={(e) => setInputCode(e.target.value.toUpperCase())}
                placeholder="Nhập mã: REF-..."
                maxLength={20}
                className="px-4 py-2.5 rounded-xl border border-amber-300 bg-white text-xs sm:text-sm font-mono font-bold text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500 uppercase"
              />
              <button
                type="submit"
                disabled={isApplying || !inputCode.trim()}
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-white bg-amber-600 hover:bg-amber-700 disabled:opacity-50 transition-colors shadow-sm"
              >
                {isApplying ? "Đang kiểm tra..." : "Kích hoạt nhận quà"}
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>

          {applyMessage && (
            <div
              className={`mt-4 p-3.5 rounded-xl text-xs font-medium flex items-center gap-2 ${
                applyMessage.type === "success"
                  ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                  : "bg-rose-50 text-rose-800 border border-rose-200"
              }`}
            >
              {applyMessage.type === "success" ? (
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              )}
              <span>{applyMessage.text}</span>
            </div>
          )}
        </div>
      )}

      {/* 4. 3 Thẻ Đo Lường Hiệu Quả */}
      <ReferralStatsCards stats={stats} />

      {/* 5. Danh Sách Bạn Bè Đã Mời */}
      <ReferralFriendsList
        friends={friends}
        onInviteClick={handleScrollToShare}
      />

      {/* 6. Câu Hỏi Thường Gặp FAQ */}
      <ReferralFAQ />
    </div>
  );
};
