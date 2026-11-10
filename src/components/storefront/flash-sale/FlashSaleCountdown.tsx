"use client";

// ============================================================
// components/storefront/flash-sale/FlashSaleCountdown.tsx
// Đồng Hồ Đếm Ngược Giờ Vàng Thời Gian Thực (Luxury Flip Style)
// ============================================================

import React, { useState, useEffect } from "react";
import { Clock, Zap } from "lucide-react";

interface FlashSaleCountdownProps {
  endTime: string;
  label?: string;
}

export const FlashSaleCountdown: React.FC<FlashSaleCountdownProps> = ({
  endTime,
  label = "KẾT THÚC TRONG",
}) => {
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    isEnded: boolean;
  }>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isEnded: false,
  });

  useEffect(() => {
    const target = new Date(endTime).getTime();

    const calculateTime = () => {
      const now = new Date().getTime();
      const diff = target - now;

      if (diff <= 0) {
        setTimeLeft({
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
          isEnded: true,
        });
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds, isEnded: false });
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, [endTime]);

  const pad = (n: number) => n.toString().padStart(2, "0");

  if (timeLeft.isEnded) {
    return (
      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-slate-900/90 text-slate-300 text-xs font-bold backdrop-blur-md border border-white/10">
        <Clock className="w-4 h-4 text-slate-400" />
        <span>Khung giờ deal này đã kết thúc</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col sm:flex-row items-center gap-2.5">
      <div className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-amber-300">
        <Zap className="w-4 h-4 fill-amber-300 animate-pulse text-amber-300" />
        <span>{label}</span>
      </div>

      <div className="flex items-center gap-1 text-white font-mono">
        {/* Ngày (nếu có > 0) */}
        {timeLeft.days > 0 && (
          <>
            <div className="flex flex-col items-center">
              <span className="w-10 h-10 rounded-xl bg-slate-900/90 border border-white/15 flex items-center justify-center text-base sm:text-lg font-black shadow-lg shadow-black/40 text-amber-300">
                {pad(timeLeft.days)}
              </span>
              <span className="text-[9px] uppercase tracking-wider text-slate-300 mt-1">
                Ngày
              </span>
            </div>
            <span className="text-lg font-black text-white/60 mb-3">:</span>
          </>
        )}

        {/* Giờ */}
        <div className="flex flex-col items-center">
          <span className="w-10 h-10 rounded-xl bg-slate-900/90 border border-white/15 flex items-center justify-center text-base sm:text-lg font-black shadow-lg shadow-black/40 text-white">
            {pad(timeLeft.hours)}
          </span>
          <span className="text-[9px] uppercase tracking-wider text-slate-300 mt-1">
            Giờ
          </span>
        </div>

        <span className="text-lg font-black text-white/60 mb-3">:</span>

        {/* Phút */}
        <div className="flex flex-col items-center">
          <span className="w-10 h-10 rounded-xl bg-slate-900/90 border border-white/15 flex items-center justify-center text-base sm:text-lg font-black shadow-lg shadow-black/40 text-white">
            {pad(timeLeft.minutes)}
          </span>
          <span className="text-[9px] uppercase tracking-wider text-slate-300 mt-1">
            Phút
          </span>
        </div>

        <span className="text-lg font-black text-white/60 mb-3">:</span>

        {/* Giây */}
        <div className="flex flex-col items-center">
          <span className="w-10 h-10 rounded-xl bg-[#800028] border border-rose-400/30 flex items-center justify-center text-base sm:text-lg font-black shadow-lg shadow-[#800028]/40 text-white">
            {pad(timeLeft.seconds)}
          </span>
          <span className="text-[9px] uppercase tracking-wider text-rose-200 mt-1">
            Giây
          </span>
        </div>
      </div>
    </div>
  );
};
