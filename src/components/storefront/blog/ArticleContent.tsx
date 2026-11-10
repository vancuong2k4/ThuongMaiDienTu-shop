// ============================================================
// components/storefront/blog/ArticleContent.tsx
// Trình Hiển Thị Nội Dung Bài Viết & Cảnh Báo Y Khoa (Typography)
// ============================================================

import React from "react";
import {
  ShieldAlert,
  AlertTriangle,
  HeartHandshake,
  CheckCircle2,
} from "lucide-react";

interface ArticleContentProps {
  content: string;
}

// Hàm sinh anchor ID đồng bộ với Table of Contents
export function slugifyHeading(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[đĐ]/g, "d")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export const ArticleContent: React.FC<ArticleContentProps> = ({ content }) => {
  // Parse markdown lines into formatted HTML elements
  const lines = content.split("\n");

  const renderContent = () => {
    const elements: React.ReactNode[] = [];
    let listBuffer: string[] = [];

    const flushList = (keyPrefix: number) => {
      if (listBuffer.length > 0) {
        elements.push(
          <ul
            key={`list-${keyPrefix}`}
            className="my-4 space-y-2 list-none pl-0 text-slate-700 text-sm sm:text-base leading-relaxed"
          >
            {listBuffer.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#800028] mt-2 shrink-0" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        );
        listBuffer = [];
      }
    };

    lines.forEach((line, index) => {
      const trimmed = line.trim();

      // Heading 2
      if (trimmed.startsWith("## ")) {
        flushList(index);
        const headingText = trimmed.replace("## ", "").trim();
        const id = slugifyHeading(headingText);
        elements.push(
          <h2
            key={`h2-${index}`}
            id={id}
            className="text-xl sm:text-2xl font-black text-slate-900 mt-8 mb-4 pt-4 border-t border-slate-100 scroll-mt-24 leading-snug tracking-tight"
          >
            {headingText}
          </h2>
        );
        return;
      }

      // Heading 3
      if (trimmed.startsWith("### ")) {
        flushList(index);
        const headingText = trimmed.replace("### ", "").trim();
        const id = slugifyHeading(headingText);
        elements.push(
          <h3
            key={`h3-${index}`}
            id={id}
            className="text-lg sm:text-xl font-bold text-slate-800 mt-6 mb-3 scroll-mt-24 leading-snug"
          >
            {headingText}
          </h3>
        );
        return;
      }

      // Blockquote / Expert Tip
      if (trimmed.startsWith("> ")) {
        flushList(index);
        const quoteText = trimmed.replace("> ", "").trim();
        elements.push(
          <blockquote
            key={`quote-${index}`}
            className="my-5 p-4 sm:p-5 rounded-2xl bg-rose-50/70 border-l-4 border-[#800028] text-slate-800 text-sm sm:text-base italic leading-relaxed"
          >
            <div className="font-semibold not-italic text-[#800028] text-xs uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Ghi chú chuyên môn từ Dược sĩ</span>
            </div>
            {quoteText}
          </blockquote>
        );
        return;
      }

      // List Item
      if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
        const itemText = trimmed.substring(2).trim();
        listBuffer.push(itemText);
        return;
      }

      // Empty line
      if (!trimmed) {
        flushList(index);
        return;
      }

      // Normal paragraph
      flushList(index);
      elements.push(
        <p
          key={`p-${index}`}
          className="my-4 text-slate-700 text-sm sm:text-base leading-relaxed font-normal"
        >
          {trimmed}
        </p>
      );
    });

    flushList(lines.length);
    return elements;
  };

  return (
    <div className="prose prose-slate max-w-none">
      {/* Main Formatted Article Body */}
      <div className="article-body-container">{renderContent()}</div>

      {/* Medical Disclaimer Card (E-E-A-T Compliance) */}
      <div className="mt-12 p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-amber-50 to-rose-50/60 border border-amber-200/80 shadow-xs space-y-3 not-prose">
        <div className="flex items-center gap-2 text-amber-800 font-bold text-xs sm:text-sm uppercase tracking-wider">
          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
          <span>Khuyến Cáo Y Khoa & Cam Kết Chất Lượng</span>
        </div>

        <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
          Thông tin trong chuyên mục <strong>Cẩm Nang Sức Khỏe</strong> được tổng hợp dựa trên tài liệu y khoa chính thống và kinh nghiệm thực tiễn nhằm mục đích phổ biến kiến thức chăm sóc sức khỏe chủ động. Nội dung không thể thay thế cho chỉ định điều trị y khoa trực tiếp từ bác sĩ.
        </p>

        <div className="pt-2 border-t border-amber-200/60 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs font-semibold text-slate-800">
          <span className="flex items-center gap-1.5 text-emerald-700">
            <CheckCircle2 className="w-3.5 h-3.5" />
            100% Thực phẩm bổ sung chính ngạch
          </span>
          <span className="flex items-center gap-1.5 text-[#800028]">
            <ShieldAlert className="w-3.5 h-3.5" />
            Tuyệt đối không kinh doanh thuốc kê đơn
          </span>
        </div>
      </div>
    </div>
  );
};
