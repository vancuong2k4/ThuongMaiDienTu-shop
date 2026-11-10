"use client";

// ============================================================
// components/storefront/blog/TableOfContents.tsx
// Mục Lục Bài Viết Thông Minh (Interactive Smart TOC with Scrollspy)
// ============================================================

import React, { useState, useEffect } from "react";
import { ListOrdered, ChevronDown, ChevronUp } from "lucide-react";

export interface HeadingItem {
  id: string;
  text: string;
  level: number;
}

interface TableOfContentsProps {
  headings: HeadingItem[];
}

export const TableOfContents: React.FC<TableOfContentsProps> = ({
  headings,
}) => {
  const [activeId, setActiveId] = useState<string>("");
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    if (headings.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      {
        rootMargin: "-80px 0px -60% 0px",
        threshold: 0,
      }
    );

    headings.forEach((heading) => {
      const el = document.getElementById(heading.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [headings]);

  if (headings.length === 0) return null;

  const scrollToHeading = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const yOffset = -90;
      const y =
        el.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  return (
    <nav
      aria-label="Mục lục bài viết"
      className="bg-white rounded-2xl border border-rose-100/80 p-4 sm:p-5 shadow-xs mb-8"
    >
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="flex items-center gap-2 text-xs font-bold text-slate-900 uppercase tracking-wider w-full justify-between"
        >
          <span className="flex items-center gap-2">
            <ListOrdered className="w-4 h-4 text-[#800028]" />
            <span>Mục Lục Bài Viết ({headings.length} phần)</span>
          </span>
          {isCollapsed ? (
            <ChevronDown className="w-4 h-4 text-slate-400" />
          ) : (
            <ChevronUp className="w-4 h-4 text-slate-400" />
          )}
        </button>
      </div>

      {!isCollapsed && (
        <ul className="mt-3.5 space-y-1.5 border-t border-rose-50 pt-3 text-xs leading-relaxed max-h-96 overflow-y-auto scrollbar-thin">
          {headings.map((heading) => {
            const isActive = activeId === heading.id;
            return (
              <li
                key={heading.id}
                style={{
                  paddingLeft: heading.level === 3 ? "1rem" : "0",
                }}
              >
                <button
                  type="button"
                  onClick={() => scrollToHeading(heading.id)}
                  className={`text-left w-full py-1 px-2 rounded-lg transition-all ${
                    isActive
                      ? "text-[#800028] font-bold bg-rose-50/70 border-l-2 border-[#800028]"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                  }`}
                >
                  <span className="line-clamp-1">{heading.text}</span>
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </nav>
  );
};
