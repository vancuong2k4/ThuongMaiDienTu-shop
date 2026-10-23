"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Flame, Award, Plane, ShieldCheck, ArrowRight } from "lucide-react";

interface BannerSlide {
  id: string;
  badge: string;
  title: string;
  subtitle: string;
  highlightText: string;
  ctaText: string;
  ctaLink: string;
  bgGradient: string;
  badgeColor: string;
}

const BANNERS: BannerSlide[] = [
  {
    id: "1",
    badge: "100% CHÍNH HÃNG NHẬP KHẨU",
    title: "Thực Phẩm Chức Năng Chuẩn Ngoại",
    subtitle: "Hồng sâm KGC 6 năm tuổi, Bổ não Ginkgo Mỹ, Collagen DHC Nhật",
    highlightText: "Bồi thường 200% nếu phát hiện hàng giả",
    ctaText: "Khám phá ngay",
    ctaLink: "/danh-muc/thuc-pham-chuc-nang",
    bgGradient: "from-[#800028] via-[#5c001e] to-[#3a0013]",
    badgeColor: "bg-amber-400 text-[#5c001e]",
  },
  {
    id: "2",
    badge: "AIR CARGO 48H",
    title: "Trái Cây Tươi Hàng Bay Cao Cấp",
    subtitle: "Cherry Mỹ giòn đanh, Nho Mẫu Đơn Hàn Quốc ngọt ngào vị sữa",
    highlightText: "Bảo quản ngăn lạnh tiêu chuẩn – Giao hỏa tốc",
    ctaText: "Xem các loại trái cây",
    ctaLink: "/danh-muc/trai-cay-nhap-khau",
    bgGradient: "from-[#7f1d1d] via-[#991b1b] to-[#450a0a]",
    badgeColor: "bg-emerald-400 text-emerald-950",
  },
  {
    id: "3",
    badge: "FLASH SALE HÔM NAY",
    title: "Săn Deal Giá Sốc Giờ Vàng",
    subtitle: "Giảm tới 40% các mặt hàng thực phẩm, mỹ phẩm nhập khẩu",
    highlightText: "Số lượng có hạn – Chống bán vượt tồn kho",
    ctaText: "Săn Flash Sale ngay",
    ctaLink: "/flash-sale",
    bgGradient: "from-[#c2410c] via-[#9a3412] to-[#7c2d12]",
    badgeColor: "bg-yellow-300 text-yellow-950",
  },
];

export function HeroBannerCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % BANNERS.length);
  }, []);

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + BANNERS.length) % BANNERS.length);
  };

  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(nextSlide, 5000);
    return () => clearInterval(timer);
  }, [isPaused, nextSlide]);

  const current = BANNERS[currentIndex];

  return (
    <div className="py-4 sm:py-6">
      <div className="shop-container">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 xl:gap-6">
          {/* ── Cột Trái: Main Banner Slider (2/3 width trên Desktop) ── */}
          <div
            className="lg:col-span-2 relative rounded-3xl overflow-hidden shadow-xl min-h-[360px] sm:min-h-[420px] flex flex-col justify-between p-6 sm:p-10 text-white select-none group"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            {/* Background gradient with smooth transition */}
            <div
              className={`absolute inset-0 bg-gradient-to-r ${current.bgGradient} transition-all duration-700`}
            />

            {/* Pattern họa tiết sang trọng */}
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

            {/* Ánh sáng mờ trang trí */}
            <div className="absolute -top-24 -right-24 w-80 h-80 rounded-full bg-white/10 blur-3xl pointer-events-none" />
            <div className="absolute -bottom-24 -left-24 w-80 h-80 rounded-full bg-amber-400/10 blur-3xl pointer-events-none" />

            {/* Nội dung Banner */}
            <div className="relative z-10 max-w-xl space-y-3 sm:space-y-4">
              <div
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ${current.badgeColor} shadow-sm animate-in fade-in-50 duration-300`}
              >
                <Award className="w-3.5 h-3.5" />
                <span>{current.badge}</span>
              </div>

              <h2 className="text-2xl sm:text-4xl xl:text-5xl font-black tracking-tight leading-tight text-white drop-shadow-sm">
                {current.title}
              </h2>

              <p className="text-sm sm:text-base text-rose-100/90 leading-relaxed font-normal">
                {current.subtitle}
              </p>

              <div className="flex items-center gap-2 text-xs sm:text-sm text-amber-300 font-semibold pt-1">
                <ShieldCheck className="w-4 h-4 shrink-0" />
                <span>{current.highlightText}</span>
              </div>
            </div>

            {/* Action Button & Slider Controls */}
            <div className="relative z-10 flex flex-wrap items-center justify-between gap-4 pt-6">
              <Link
                href={current.ctaLink}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white text-[#800028] hover:bg-amber-300 hover:text-[#5c001e] font-extrabold text-xs sm:text-sm shadow-xl transition-all duration-200 active:scale-95"
              >
                <span>{current.ctaText}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              {/* Dots Pagination */}
              <div className="flex items-center gap-2">
                {BANNERS.map((banner, idx) => (
                  <button
                    key={banner.id}
                    onClick={() => setCurrentIndex(idx)}
                    className={`h-2.5 rounded-full transition-all duration-300 ${
                      idx === currentIndex ? "w-8 bg-amber-400" : "w-2.5 bg-white/40 hover:bg-white/70"
                    }`}
                    aria-label={`Chuyển tới slide ${idx + 1}`}
                  />
                ))}
              </div>
            </div>

            {/* Navigation Arrows (hiện khi hover trên desktop) */}
            <button
              onClick={prevSlide}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/25 hover:bg-black/50 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm z-20"
              aria-label="Slide trước"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/25 hover:bg-black/50 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm z-20"
              aria-label="Slide sau"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* ── Cột Phải: 2 Sub Banners (1/3 width trên Desktop) ── */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
            {/* Sub banner 1 */}
            <Link
              href="/flash-sale"
              className="group relative rounded-3xl p-6 bg-gradient-to-br from-amber-500 to-orange-600 text-white overflow-hidden shadow-lg hover:shadow-xl transition-all flex flex-col justify-between min-h-[190px]"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-xl pointer-events-none" />
              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-black/20 text-[11px] font-bold uppercase tracking-wider mb-2">
                  <Flame className="w-3.5 h-3.5 text-yellow-300 animate-bounce" />
                  <span>Giờ vàng săn deal</span>
                </div>
                <h3 className="text-xl font-black leading-tight text-white group-hover:translate-x-1 transition-transform">
                  Flash Sale Đếm Ngược
                </h3>
                <p className="text-xs text-orange-100 mt-1">
                  Chỉ áp dụng trong khung giờ vàng hôm nay.
                </p>
              </div>
              <div className="flex items-center gap-1 text-xs font-bold text-amber-200 mt-4 group-hover:text-white transition-colors">
                <span>Khám phá ngay</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            {/* Sub banner 2 */}
            <Link
              href="/danh-muc/trai-cay-nhap-khau"
              className="group relative rounded-3xl p-6 bg-gradient-to-br from-[#800028] to-[#9e0032] text-white overflow-hidden shadow-lg hover:shadow-xl transition-all flex flex-col justify-between min-h-[190px]"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-xl pointer-events-none" />
              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/20 text-[11px] font-bold uppercase tracking-wider mb-2 text-amber-300">
                  <Plane className="w-3.5 h-3.5" />
                  <span>Hàng bay 48H</span>
                </div>
                <h3 className="text-xl font-black leading-tight text-white group-hover:translate-x-1 transition-transform">
                  Trái Cây Tươi Cao Cấp
                </h3>
                <p className="text-xs text-rose-100 mt-1">
                  Cherry Mỹ size 9, Nho mẫu đơn Hàn Quốc chuẩn vị sữa.
                </p>
              </div>
              <div className="flex items-center gap-1 text-xs font-bold text-amber-300 mt-4 group-hover:text-white transition-colors">
                <span>Đặt hàng ngay</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
