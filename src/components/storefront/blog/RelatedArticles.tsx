// ============================================================
// components/storefront/blog/RelatedArticles.tsx
// Danh Sách Bài Viết Cùng Chuyên Mục Gợi Ý Tiếp Tục Đọc
// ============================================================

import React from "react";
import Link from "next/link";
import { BlogCard } from "./BlogCard";
import type { StorefrontBlogPost } from "./types";
import { BookOpen, ArrowRight } from "lucide-react";

interface RelatedArticlesProps {
  articles: StorefrontBlogPost[];
  category: string;
}

export const RelatedArticles: React.FC<RelatedArticlesProps> = ({
  articles,
  category,
}) => {
  if (!articles || articles.length === 0) return null;

  return (
    <section className="mt-14 pt-10 border-t border-slate-200/80 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#800028] mb-1">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Tiếp Tục Khám Phá</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Bài Viết Cùng Chuyên Mục: {category}
          </h3>
        </div>

        <Link
          href="/tin-tuc"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#800028] hover:text-[#60001e] transition-colors"
        >
          <span>Xem tất cả bài viết</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {articles.map((article) => (
          <BlogCard key={article.id} post={article} />
        ))}
      </div>
    </section>
  );
};
