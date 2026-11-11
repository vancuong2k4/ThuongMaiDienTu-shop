// ============================================================
// components/storefront/subscription/SubscriptionHeroBanner.tsx
// Banner giới thiệu quyền lợi Gói Giao Định Kỳ Tiết Kiệm
// ============================================================

"use client";

import React from "react";
import { Repeat, ShieldCheck, Truck, Percent, Clock } from "lucide-react";

export const SubscriptionHeroBanner: React.FC = () => {
  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#800028] via-[#660020] to-[#0f172a] text-white p-6 sm:p-8 shadow-xl shadow-[#800028]/15 border border-rose-900/40">
      {/* Background Decorative Rings */}
      <div className="absolute -right-16 -top-16 w-64 h-64 rounded-full bg-rose-500/10 blur-3xl pointer-events-none" />
      <div className="absolute right-20 -bottom-20 w-80 h-80 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />

      <div className="relative z-10 space-y-4">
        {/* Top Tag */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-semibold text-rose-100">
          <Repeat className="w-3.5 h-3.5 text-emerald-400 animate-spin-slow" />
          <span>THUYNGA Auto-Ship & Save</span>
        </div>

        {/* Title & Desc */}
        <div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-black tracking-tight text-white">
            Gói Giao Định Kỳ Tiết Kiệm
          </h1>
          <p className="text-xs sm:text-sm text-rose-100/80 mt-1.5 max-w-2xl leading-relaxed">
            Tự động giao định kỳ sữa Aptamil, TPCN Úc và sản phẩm mẹ & bé tới tận cửa nhà. 
            Không lo quên mua, luôn đảm bảo nguồn hàng chính hãng đi air chuẩn nhiệt độ.
          </p>
        </div>

        {/* 3 Golden Benefits */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/10">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
              <Percent className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <div className="text-xs font-bold text-white">Giảm 10% trọn đời</div>
              <div className="text-[11px] text-rose-100/70 truncate">Áp dụng mọi chu kỳ</div>
            </div>
          </div>

          <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/10">
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-300 flex items-center justify-center shrink-0">
              <Truck className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <div className="text-xs font-bold text-white">Freeship 100%</div>
              <div className="text-[11px] text-rose-100/70 truncate">Miễn phí giao toàn quốc</div>
            </div>
          </div>

          <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/10">
            <div className="w-8 h-8 rounded-xl bg-rose-500/20 text-rose-300 flex items-center justify-center shrink-0">
              <Clock className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <div className="text-xs font-bold text-white">Linh hoạt 1-chạm</div>
              <div className="text-[11px] text-rose-100/70 truncate">Tạm dừng, hủy bất kỳ lúc nào</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
