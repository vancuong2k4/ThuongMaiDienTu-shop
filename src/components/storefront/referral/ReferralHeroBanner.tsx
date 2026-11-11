"use client";

// ============================================================
// components/storefront/referral/ReferralHeroBanner.tsx
// Banner Giới Thiệu Chương Trình "Mời Bạn Nhận Quà Đôi" (Stage 12.4)
// ============================================================

import React from "react";
import { Gift, Award, Users, ShieldCheck, HeartHandshake } from "lucide-react";

export const ReferralHeroBanner: React.FC = () => {
  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#800028] via-[#60001e] to-[#360011] text-white p-6 sm:p-10 shadow-xl border border-rose-900/40">
      {/* Background Decorative Rings */}
      <div className="absolute -right-16 -top-16 w-72 h-72 rounded-full bg-rose-500/10 blur-3xl pointer-events-none" />
      <div className="absolute -left-16 -bottom-16 w-72 h-72 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-3xl">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-400/15 border border-amber-400/30 text-amber-300 text-xs font-bold uppercase tracking-wider mb-4">
          <HeartHandshake className="w-4 h-4 text-amber-400" />
          <span>Chương Trình Đặc Quyền Hội Viên</span>
        </div>

        {/* Headline */}
        <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white mb-3">
          Mời Bạn Nhận Quà Đôi
        </h1>
        <p className="text-sm sm:text-base text-rose-100/90 leading-relaxed max-w-2xl">
          Cùng lan tỏa giải pháp chăm sóc sức khỏe & dinh dưỡng Úc chuẩn Air Cargo
          đến những người thân yêu. Mỗi lời giới thiệu là một món quà trao tay trọn vẹn.
        </p>

        {/* 2 Value Offer Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
          {/* Quà cho bạn mới */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 sm:p-5 border border-white/15 hover:bg-white/15 transition-all">
            <div className="flex items-center gap-3 mb-2.5">
              <div className="w-10 h-10 rounded-xl bg-amber-400/20 text-amber-300 flex items-center justify-center shrink-0">
                <Gift className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-amber-300 block">
                  Dành Cho Bạn Mới
                </span>
                <span className="text-base sm:text-lg font-black text-white">
                  Voucher 50.000 ₫
                </span>
              </div>
            </div>
            <p className="text-xs text-rose-100/80 leading-relaxed">
              Áp dụng giảm ngay cho đơn hàng đầu tiên từ 300.000₫. Mã voucher có
              hiệu lực 30 ngày ngay sau khi kích hoạt mã mời.
            </p>
          </div>

          {/* Quà cho người mời */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 sm:p-5 border border-white/15 hover:bg-white/15 transition-all">
            <div className="flex items-center gap-3 mb-2.5">
              <div className="w-10 h-10 rounded-xl bg-rose-400/20 text-rose-200 flex items-center justify-center shrink-0">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-rose-200 block">
                  Dành Cho Bạn (Người Mời)
                </span>
                <span className="text-base sm:text-lg font-black text-white">
                  +500 Điểm THUYNGA Club
                </span>
              </div>
            </div>
            <p className="text-xs text-rose-100/80 leading-relaxed">
              Tương đương 50.000₫ tích lũy vào ví hội viên khi bạn mới hoàn thành
              và nhận hàng thành công đơn đầu tiên. Không giới hạn số bạn bè được mời!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
