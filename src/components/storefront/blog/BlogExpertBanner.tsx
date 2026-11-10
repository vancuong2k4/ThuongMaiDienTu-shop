// ============================================================
// components/storefront/blog/BlogExpertBanner.tsx
// Khối Cam Kết Chuyên Môn Y Khoa & Hotline Dược Sĩ (E-E-A-T Trust)
// ============================================================

import React from "react";
import Link from "next/link";
import {
  ShieldCheck,
  PhoneCall,
  MessageCircle,
  AlertTriangle,
  Award,
  HeartPulse,
} from "lucide-react";

export const BlogExpertBanner: React.FC = () => {
  return (
    <section className="my-14 rounded-3xl bg-gradient-to-br from-[#800028] via-[#60001e] to-slate-900 p-8 sm:p-10 text-white relative overflow-hidden shadow-2xl">
      {/* Background soft pattern */}
      <div className="absolute -right-16 -top-16 w-80 h-80 rounded-full bg-white/5 blur-3xl pointer-events-none" />
      <div className="absolute -left-16 -bottom-16 w-80 h-80 rounded-full bg-amber-400/10 blur-3xl pointer-events-none" />

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left: Info */}
        <div className="lg:col-span-8 space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-amber-300 text-xs font-bold uppercase tracking-wider border border-white/15">
            <Award className="w-3.5 h-3.5" />
            <span>Chuyên Môn Y Khoa E-E-A-T</span>
          </div>

          <h3 className="text-2xl sm:text-3xl font-black tracking-tight leading-tight">
            Bạn Cần Tư Vấn Liều Dùng Hay Lựa Chọn Sản Phẩm Phù Hợp?
          </h3>

          <p className="text-sm text-rose-100/90 leading-relaxed max-w-2xl font-normal">
            Mỗi cơ địa và độ tuổi đều có nhu cầu vi chất khác nhau. Đội ngũ Dược sĩ tại THUYNGA Shop luôn sẵn sàng lắng nghe, tư vấn tận tâm và cam kết chỉ khuyên dùng những sản phẩm thực sự cần thiết và an toàn cho gia đình bạn.
          </p>

          {/* Core pledges */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs text-rose-100">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>100% Hàng bay chính ngạch có bill & tem phụ</span>
            </div>
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-300 shrink-0" />
              <span>Nguyên tắc vàng: Không kinh doanh thuốc kê đơn</span>
            </div>
          </div>
        </div>

        {/* Right: CTA Actions */}
        <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-3 justify-center">
          <a
            href="tel:0987654321"
            className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-2xl bg-white text-[#800028] font-bold text-sm hover:bg-rose-50 transition-all shadow-lg hover:shadow-xl hover:scale-[1.02] duration-200"
          >
            <PhoneCall className="w-4 h-4 text-[#800028]" />
            <span>Hotline: 0987.654.321</span>
          </a>

          <a
            href="https://zalo.me"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-2xl bg-white/10 hover:bg-white/15 text-white font-bold text-sm transition-all border border-white/20"
          >
            <MessageCircle className="w-4 h-4 text-emerald-300" />
            <span>Chat Zalo Dược Sĩ Tư Vấn</span>
          </a>
        </div>
      </div>
    </section>
  );
};
