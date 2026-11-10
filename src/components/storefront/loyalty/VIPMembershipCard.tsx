"use client";

// ============================================================
// components/storefront/loyalty/VIPMembershipCard.tsx
// Thẻ Hội Viên VIP Điện Tử THUYNGA Club (Module 10.4)
// ============================================================

import React from "react";
import {
  Crown,
  Award,
  Coins,
  QrCode,
  Wifi,
  ChevronRight,
  TrendingUp,
  Sparkles,
} from "lucide-react";
import type { LoyaltyHubData } from "./types";

interface VIPMembershipCardProps {
  data: LoyaltyHubData;
  userName: string;
}

export const VIPMembershipCard: React.FC<VIPMembershipCardProps> = ({
  data,
  userName,
}) => {
  const { currentPoints, monetaryEquivalent, membershipTier, tierProgress, tierConfig } = data;

  // Cấu hình theme màu kim loại sang trọng cho từng hạng
  const tierThemes = {
    BRONZE: {
      cardBg:
        "bg-gradient-to-br from-[#451a03] via-[#78350f] to-[#b45309] text-amber-50 border-amber-600/40 shadow-amber-950/40",
      accentBadge: "bg-amber-500/20 text-amber-200 border-amber-400/30",
      chipColor: "bg-amber-300/80 border-amber-200",
      tierLabel: "HỘI VIÊN ĐỒNG",
      icon: Award,
      rate: "1%",
    },
    SILVER: {
      cardBg:
        "bg-gradient-to-br from-slate-900 via-slate-700 to-slate-500 text-slate-50 border-slate-400/40 shadow-slate-950/40",
      accentBadge: "bg-slate-300/20 text-slate-100 border-slate-300/30",
      chipColor: "bg-slate-200 border-slate-100",
      tierLabel: "HỘI VIÊN BẠC",
      icon: Award,
      rate: "1.5%",
    },
    GOLD: {
      cardBg:
        "bg-gradient-to-br from-[#713f12] via-[#ca8a04] to-[#fde047] text-amber-950 border-yellow-300/50 shadow-yellow-900/40",
      accentBadge: "bg-black/20 text-amber-950 font-black border-amber-900/20",
      chipColor: "bg-yellow-200 border-yellow-100",
      tierLabel: "HỘI VIÊN VÀNG",
      icon: Crown,
      rate: "2%",
    },
    DIAMOND: {
      cardBg:
        "bg-gradient-to-br from-[#0f172a] via-[#3b0764] to-[#1e1b4b] text-purple-50 border-purple-400/40 shadow-purple-950/50",
      accentBadge: "bg-purple-400/20 text-purple-200 border-purple-400/30",
      chipColor: "bg-purple-200 border-purple-100",
      tierLabel: "HỘI VIÊN KIM CƯƠNG",
      icon: Crown,
      rate: "3%",
    },
  };

  const theme = tierThemes[membershipTier] || tierThemes.BRONZE;
  const TierIcon = theme.icon;

  return (
    <div className="space-y-4">
      {/* Thẻ VIP Card 3D Luxury */}
      <div
        className={`relative w-full rounded-3xl p-6 sm:p-8 border shadow-2xl overflow-hidden transition-all duration-300 hover:scale-[1.01] ${theme.cardBg}`}
      >
        {/* Họa tiết vân chìm sang trọng */}
        <div className="absolute -right-16 -top-16 w-64 h-64 rounded-full bg-white/5 blur-2xl pointer-events-none" />
        <div className="absolute right-8 bottom-8 opacity-10 pointer-events-none">
          <TierIcon className="w-48 h-48" />
        </div>

        {/* Hàng 1: Logo & Huy hiệu hạng */}
        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-serif tracking-widest text-xs uppercase opacity-90 font-bold">
              THUYNGA CLUB
            </span>
            <span className="text-[10px] opacity-75 font-mono">• VIP PASS</span>
          </div>

          <div
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black tracking-wider border backdrop-blur-md uppercase ${theme.accentBadge}`}
          >
            <TierIcon className="w-3.5 h-3.5" />
            <span>{theme.tierLabel}</span>
          </div>
        </div>

        {/* Hàng 2: EMV Chip & Contactless */}
        <div className="relative z-10 my-6 flex items-center gap-3">
          {/* Chip kim loại */}
          <div
            className={`w-11 h-8 rounded-lg border flex flex-col justify-around p-1 shadow-inner ${theme.chipColor}`}
          >
            <div className="w-full h-px bg-black/20" />
            <div className="w-full h-px bg-black/20" />
          </div>
          {/* Sóng contactless */}
          <Wifi className="w-5 h-5 rotate-90 opacity-70" />
        </div>

        {/* Hàng 3: Điểm tích lũy & Quy đổi */}
        <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 gap-4 items-end">
          <div>
            <p className="text-[11px] uppercase tracking-wider opacity-80 font-medium">
              Điểm Tích Lũy Khả Dụng
            </p>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-3xl sm:text-4xl font-black font-mono tracking-tight">
                {currentPoints.toLocaleString("vi-VN")}
              </span>
              <span className="text-xs font-bold opacity-80">điểm</span>
            </div>
            <p className="text-xs opacity-85 mt-1 font-medium">
              ≈ {monetaryEquivalent.toLocaleString("vi-VN")} ₫ giảm trừ mua sắm
            </p>
          </div>

          <div className="sm:text-right">
            <p className="text-[11px] uppercase tracking-wider opacity-80 font-medium">
              Chủ Thẻ Hội Viên
            </p>
            <p className="text-base sm:text-lg font-black tracking-wide uppercase mt-0.5 truncate">
              {userName || "QUÝ KHÁCH"}
            </p>
            <p className="text-[11px] font-mono opacity-75 mt-0.5">
              Hoàn {theme.rate} giá trị mọi đơn hàng
            </p>
          </div>
        </div>
      </div>

      {/* Thanh Tiến Trình Lên Hạng Tiếp Theo */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-[#800028]" />
            <span className="text-xs font-bold text-slate-800">
              {tierProgress.nextTier ? (
                <>
                  Tiến độ thăng hạng{" "}
                  <span className="text-[#800028] font-black uppercase">
                    {tierProgress.nextTier}
                  </span>
                </>
              ) : (
                <span className="text-purple-700 font-black">
                  Hạng Kim Cương cao cấp nhất – Tận hưởng trọn vẹn đặc quyền VIP!
                </span>
              )}
            </span>
          </div>

          {tierProgress.nextTier && (
            <span className="text-xs text-slate-500">
              Chi tiêu thêm:{" "}
              <strong className="text-slate-800 font-bold">
                {tierProgress.spentNeeded.toLocaleString("vi-VN")} ₫
              </strong>
            </span>
          )}
        </div>

        {/* Thanh Progress Bar */}
        {tierProgress.nextTier && (
          <div className="mt-3">
            <div className="w-full h-3 rounded-full bg-slate-100 overflow-hidden p-0.5 border border-slate-200/60">
              <div
                className="h-full rounded-full bg-gradient-to-r from-amber-500 via-rose-600 to-[#800028] transition-all duration-700"
                style={{ width: `${Math.min(100, tierProgress.percentComplete)}%` }}
              />
            </div>
            <div className="flex justify-between items-center text-[10px] text-slate-400 font-medium mt-1.5">
              <span>Đã chi: {tierProgress.currentSpent.toLocaleString("vi-VN")} ₫</span>
              <span>
                Mục tiêu:{" "}
                {(tierProgress.nextTierThreshold || 0).toLocaleString("vi-VN")} ₫ (
                {tierProgress.percentComplete}%)
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
