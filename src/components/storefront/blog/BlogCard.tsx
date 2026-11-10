"use client";

// ============================================================
// components/storefront/blog/BlogCard.tsx
// Thẻ Bài Viết Cẩm Nang (Magazine Grid Card)
// ============================================================

import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Calendar,
  Clock,
  Eye,
  ArrowRight,
  CheckCircle2,
  BookOpen,
} from "lucide-react";
import type { StorefrontBlogPost } from "./types";

interface BlogCardProps {
  post: StorefrontBlogPost;
}

export const BlogCard: React.FC<BlogCardProps> = ({ post }) => {
  const formattedDate = post.publishedAt
    ? new Date(post.publishedAt).toLocaleDateString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      })
    : new Date(post.createdAt).toLocaleDateString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });

  return (
    <article className="group bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-xl hover:border-rose-200 transition-all duration-300 flex flex-col overflow-hidden">
      {/* Khối Ảnh bìa */}
      <Link
        href={`/tin-tuc/${post.slug}`}
        className="relative aspect-video w-full overflow-hidden bg-slate-100 block"
      >
        {post.coverImage ? (
          <Image
            src={post.coverImage}
            alt={post.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-rose-50 to-slate-100 text-slate-400">
            <BookOpen className="w-10 h-10 opacity-30 text-[#800028] mb-1" />
            <span className="text-xs font-semibold text-slate-500">Cẩm Nang</span>
          </div>
        )}

        {/* Category Pill Tag */}
        <div className="absolute top-3 left-3 z-10">
          <span className="px-2.5 py-1 rounded-lg bg-white/95 backdrop-blur-xs text-[#800028] text-[11px] font-bold shadow-xs uppercase tracking-wider border border-rose-100/60">
            {post.category}
          </span>
        </div>

        {/* Reading Time Badge */}
        <div className="absolute bottom-3 right-3 z-10 flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-900/80 text-white text-[10px] font-medium backdrop-blur-xs">
          <Clock className="w-3 h-3" />
          <span>{post.readingTime} phút đọc</span>
        </div>
      </Link>

      {/* Nội Dung Thẻ */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-2.5">
          {/* Metadata row */}
          <div className="flex items-center justify-between text-[11px] text-slate-500">
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3 text-slate-400" />
              <span>{formattedDate}</span>
            </span>
            <span className="flex items-center gap-1 font-medium">
              <Eye className="w-3 h-3 text-slate-400" />
              <span>{post.viewCount.toLocaleString("vi-VN")} lượt đọc</span>
            </span>
          </div>

          {/* Title */}
          <h3 className="text-base font-bold text-slate-900 group-hover:text-[#800028] transition-colors line-clamp-2 leading-snug">
            <Link href={`/tin-tuc/${post.slug}`}>{post.title}</Link>
          </h3>

          {/* Excerpt */}
          {post.excerpt && (
            <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
              {post.excerpt}
            </p>
          )}
        </div>

        {/* Footer: Tác giả & Link đọc tiếp */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5 text-slate-700">
            <span className="w-6 h-6 rounded-full bg-[#800028]/10 text-[#800028] font-bold text-[10px] flex items-center justify-center">
              TN
            </span>
            <span className="font-semibold text-slate-800 text-[11px] flex items-center gap-1">
              {post.authorName}
              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            </span>
          </div>

          <Link
            href={`/tin-tuc/${post.slug}`}
            className="inline-flex items-center gap-1 text-[11px] font-bold text-[#800028] hover:text-[#60001e] group-hover:gap-1.5 transition-all"
          >
            <span>Đọc tiếp</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </article>
  );
};
