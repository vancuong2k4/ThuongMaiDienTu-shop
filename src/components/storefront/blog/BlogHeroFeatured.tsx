"use client";

// ============================================================
// components/storefront/blog/BlogHeroFeatured.tsx
// Tiêu Điểm Cẩm Nang Sức Khỏe (Magazine Featured Hero Banner)
// ============================================================

import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Calendar,
  Clock,
  Eye,
  ArrowRight,
  Sparkles,
  Star,
  CheckCircle2,
  BookOpen,
} from "lucide-react";
import type { StorefrontBlogPost } from "./types";

interface BlogHeroFeaturedProps {
  post: StorefrontBlogPost;
}

export const BlogHeroFeatured: React.FC<BlogHeroFeaturedProps> = ({ post }) => {
  if (!post) return null;

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
    <section className="mb-12">
      <div className="group relative bg-white rounded-3xl border border-rose-100/80 shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
          {/* Cột trái: Ảnh bìa lớn với hiệu ứng zoom (7 cols) */}
          <Link
            href={`/tin-tuc/${post.slug}`}
            className="lg:col-span-7 relative h-72 sm:h-96 lg:h-full min-h-[340px] overflow-hidden bg-slate-100 block"
          >
            {post.coverImage ? (
              <Image
                src={post.coverImage}
                alt={post.title}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 60vw"
                className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-rose-900/10 to-slate-900/10 text-slate-400">
                <BookOpen className="w-16 h-16 opacity-30 mb-2 text-[#800028]" />
                <span className="text-sm font-semibold">Cẩm Nang Sức Khỏe</span>
              </div>
            )}

            {/* Badge Tiêu Điểm Ghim */}
            <div className="absolute top-4 left-4 z-10 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#800028] text-white text-xs font-bold shadow-lg backdrop-blur-md">
              <Star className="w-3.5 h-3.5 fill-amber-300 text-amber-300" />
              <span>Bài Viết Tiêu Điểm</span>
            </div>

            {/* Overlay dải chuyển màu mờ trên mobile */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent lg:hidden" />
          </Link>

          {/* Cột phải: Thông tin nội dung (5 cols) */}
          <div className="lg:col-span-5 p-6 sm:p-8 lg:p-10 flex flex-col justify-between bg-gradient-to-b from-white to-[#fff0f3]/30">
            <div className="space-y-4">
              {/* Category & Meta */}
              <div className="flex flex-wrap items-center gap-2.5 text-xs text-slate-500">
                <span className="px-2.5 py-1 rounded-lg bg-rose-50 text-[#800028] font-bold uppercase tracking-wider text-[11px] border border-rose-100">
                  {post.category}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  <span>{formattedDate}</span>
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span>{post.readingTime} phút đọc</span>
                </span>
              </div>

              {/* Title */}
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-slate-900 group-hover:text-[#800028] transition-colors leading-tight line-clamp-3">
                <Link href={`/tin-tuc/${post.slug}`}>{post.title}</Link>
              </h2>

              {/* Excerpt */}
              {post.excerpt && (
                <p className="text-sm text-slate-600 line-clamp-3 sm:line-clamp-4 leading-relaxed font-normal">
                  {post.excerpt}
                </p>
              )}
            </div>

            {/* Author Footer & CTA Button */}
            <div className="pt-6 mt-6 border-t border-rose-100/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#800028] to-slate-900 text-white font-black text-xs flex items-center justify-center shadow-md">
                  TN
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900 flex items-center gap-1">
                    <span>{post.authorName}</span>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 fill-emerald-100" />
                  </div>
                  <p className="text-[11px] text-slate-500">
                    Cố vấn chuyên môn Thúy Nga Shop
                  </p>
                </div>
              </div>

              <Link
                href={`/tin-tuc/${post.slug}`}
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-[#800028] hover:bg-[#60001e] transition-all shadow-md shadow-[#800028]/25 group-hover:gap-3"
              >
                <span>Đọc bài viết</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
