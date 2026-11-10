"use client";

// ============================================================
// components/storefront/blog/ArticleShareBar.tsx
// Thanh Chia Sẻ Mạng Xã Hội & Chỉ Báo Đọc Bài Viết (Reading Progress)
// ============================================================

import React, { useState, useEffect } from "react";
import {
  Share2,
  Copy,
  Check,
  MessageCircle,
  Printer,
  Bookmark,
} from "lucide-react";

interface ArticleShareBarProps {
  title: string;
  slug: string;
}

export const ArticleShareBar: React.FC<ArticleShareBarProps> = ({
  title,
  slug,
}) => {
  const [copied, setCopied] = useState(false);
  const [readingProgress, setReadingProgress] = useState(0);

  // Calculate reading progress
  useEffect(() => {
    const updateProgress = () => {
      const totalHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const progress = (window.scrollY / totalHeight) * 100;
        setReadingProgress(Math.min(100, Math.max(0, progress)));
      }
    };

    window.addEventListener("scroll", updateProgress, { passive: true });
    return () => window.removeEventListener("scroll", updateProgress);
  }, []);

  const getArticleUrl = () => {
    if (typeof window !== "undefined") {
      return `${window.location.origin}/tin-tuc/${slug}`;
    }
    return `https://thuynhangashop.vn/tin-tuc/${slug}`;
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(getArticleUrl());
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback
    }
  };

  const handleFacebookShare = () => {
    const url = encodeURIComponent(getArticleUrl());
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${url}`,
      "_blank",
      "noopener,noreferrer"
    );
  };

  const handleZaloShare = () => {
    const url = encodeURIComponent(getArticleUrl());
    window.open(
      `https://sp.zalo.me/share_inline?url=${url}`,
      "_blank",
      "noopener,noreferrer"
    );
  };

  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  return (
    <>
      {/* Top Floating Reading Progress Bar */}
      <div
        role="progressbar"
        aria-valuenow={Math.round(readingProgress)}
        aria-valuemin={0}
        aria-valuemax={100}
        className="fixed top-0 left-0 right-0 h-1 bg-transparent z-50 pointer-events-none"
      >
        <div
          className="h-full bg-gradient-to-r from-[#800028] via-rose-600 to-amber-500 transition-all duration-150 ease-out"
          style={{ width: `${readingProgress}%` }}
        />
      </div>

      {/* Share Actions Widget */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-xs text-xs text-slate-600 my-6">
        <div className="flex items-center gap-2 font-bold text-slate-900">
          <Share2 className="w-4 h-4 text-[#800028]" />
          <span>Chia sẻ bài viết:</span>
        </div>

        <div className="flex items-center gap-1.5 flex-wrap">
          {/* Copy link button */}
          <button
            type="button"
            onClick={handleCopyLink}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-medium transition-all ${
              copied
                ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span className="font-bold">Đã chép link</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-slate-500" />
                <span>Sao chép</span>
              </>
            )}
          </button>

          {/* Facebook */}
          <button
            type="button"
            onClick={handleFacebookShare}
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-blue-50 text-blue-700 hover:bg-blue-100 transition-all font-medium border border-blue-100"
            title="Chia sẻ lên Facebook"
          >
            <svg
              className="w-3.5 h-3.5 fill-current text-blue-600"
              viewBox="0 0 24 24"
            >
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
            </svg>
            <span>Facebook</span>
          </button>

          {/* Zalo */}
          <button
            type="button"
            onClick={handleZaloShare}
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-sky-50 text-sky-700 hover:bg-sky-100 transition-all font-medium border border-sky-100"
            title="Chia sẻ qua Zalo"
          >
            <MessageCircle className="w-3.5 h-3.5 text-sky-600" />
            <span>Zalo</span>
          </button>

          {/* Print */}
          <button
            type="button"
            onClick={handlePrint}
            className="p-1.5 rounded-xl text-slate-500 hover:bg-slate-100 transition-all"
            title="In bài viết"
          >
            <Printer className="w-4 h-4" />
          </button>
        </div>
      </div>
    </>
  );
};
