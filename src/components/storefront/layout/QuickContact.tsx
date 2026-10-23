"use client";

import { useEffect, useState } from "react";
import { Phone, ArrowUp, MessageCircle } from "lucide-react";

export function QuickContact() {
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <aside
      className="fixed bottom-20 lg:bottom-8 right-4 z-40 flex flex-col items-center gap-3"
      aria-label="Liên hệ nhanh"
    >
      {/* Nút gọi Hotline */}
      <a
        href="tel:0987654321"
        className="w-12 h-12 rounded-full bg-[#800028] hover:bg-[#5c001e] text-white flex items-center justify-center shadow-lg hover:scale-110 active:scale-95 transition-all group relative"
        aria-label="Gọi hotline 0987.654.321"
      >
        <span className="absolute -left-32 bg-gray-900 text-white text-[11px] font-semibold py-1 px-2.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none hidden md:block whitespace-nowrap shadow-md">
          Hotline: 0987.654.321
        </span>
        <Phone className="w-5 h-5 animate-pulse" />
      </a>

      {/* Nút chat Zalo */}
      <a
        href="https://zalo.me/0987654321"
        target="_blank"
        rel="noopener noreferrer"
        className="w-12 h-12 rounded-full bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center shadow-lg hover:scale-110 active:scale-95 transition-all group relative font-bold text-xs"
        aria-label="Chat Zalo với THUYNGA Shop"
      >
        <span className="absolute -left-28 bg-gray-900 text-white text-[11px] font-semibold py-1 px-2.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none hidden md:block whitespace-nowrap shadow-md">
          Chat Zalo tư vấn
        </span>
        <MessageCircle className="w-5 h-5" />
      </a>

      {/* Nút cuộn lên đầu trang */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="w-10 h-10 rounded-full bg-white text-gray-700 border border-gray-200 flex items-center justify-center shadow-md hover:bg-gray-100 hover:text-[#800028] active:scale-90 transition-all animate-in fade-in-0 duration-200"
          aria-label="Cuộn lên đầu trang"
        >
          <ArrowUp className="w-4 h-4" />
        </button>
      )}
    </aside>
  );
}
