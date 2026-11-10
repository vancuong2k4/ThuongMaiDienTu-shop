// ============================================================
// app/(admin)/admin/bai-viet/page.tsx
// Trang Quản Lý Danh Sách Bài Viết Cẩm Nang Y Khoa & Sản Phẩm (Stage 8.3)
// ============================================================

import React from "react";
import Link from "next/link";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { AdminPageHeader } from "@/components/admin/ui/AdminPageHeader";
import { BlogManager } from "@/components/admin/blogs/BlogManager";
import { Plus, BookOpen } from "lucide-react";
import type { BlogItem, BlogStatsData } from "@/components/admin/blogs/types";

export const metadata: Metadata = {
  title: "Quản lý Cẩm nang & Tin tức | Quản trị THUYNGA Shop",
  description:
    "Hệ thống quản trị nội dung cẩm nang sức khỏe, dinh dưỡng và mẹo phân biệt hàng chính hãng chuẩn SEO E-E-A-T.",
};

export const revalidate = 0; // Luôn lấy dữ liệu mới nhất trong CMS

export default async function AdminBlogsPage() {
  // Pre-fetch dữ liệu trang 1 và KPI stats trên server để render nhanh
  const [total, published, draft, viewAggregation, initialPostsRaw] =
    await Promise.all([
      prisma.blogPost.count(),
      prisma.blogPost.count({ where: { isPublished: true } }),
      prisma.blogPost.count({ where: { isPublished: false } }),
      prisma.blogPost.aggregate({
        _sum: { viewCount: true },
      }),
      prisma.blogPost.findMany({
        take: 10,
        skip: 0,
        orderBy: { createdAt: "desc" },
      }),
    ]);

  const stats: BlogStatsData = {
    total,
    published,
    draft,
    totalViews: viewAggregation._sum.viewCount || 0,
  };

  const initialPosts: BlogItem[] = initialPostsRaw.map((post) => ({
    id: post.id,
    title: post.title,
    slug: post.slug,
    excerpt: post.excerpt,
    content: post.content,
    coverImage: post.coverImage,
    category: post.category,
    authorName: post.authorName,
    readingTime: post.readingTime,
    viewCount: post.viewCount,
    isFeatured: post.isFeatured,
    isPublished: post.isPublished,
    publishedAt: post.publishedAt?.toISOString() || null,
    seoTitle: post.seoTitle,
    seoDesc: post.seoDesc,
    seoKeywords: post.seoKeywords,
    createdAt: post.createdAt.toISOString(),
    updatedAt: post.updatedAt.toISOString(),
  }));

  const totalPages = Math.ceil(total / 10) || 1;

  return (
    <div className="space-y-6">
      {/* Header trang */}
      <AdminPageHeader
        title="Cẩm Nang Sức Khỏe & Tin Tức"
        description="Quản trị bài viết chuyên môn y khoa, cẩm nang dinh dưỡng và mẹo tiêu dùng chính hãng chuẩn SEO E-E-A-T"
        breadcrumbs={[{ label: "Bài viết", href: "/admin/bai-viet" }]}
        badge={
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#800028]/10 text-[#800028]">
            <BookOpen className="w-3.5 h-3.5" />
            <span>SEO E-E-A-T</span>
          </span>
        }
        actions={
          <Link
            href="/admin/bai-viet/tao-moi"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-white bg-[#800028] hover:bg-[#60001e] transition-all shadow-md shadow-[#800028]/20"
          >
            <Plus className="w-4 h-4" />
            <span>Viết Bài Mới</span>
          </Link>
        }
      />

      {/* Container tương tác phía Client */}
      <BlogManager
        initialStats={stats}
        initialPosts={initialPosts}
        initialPagination={{
          page: 1,
          limit: 10,
          totalPages,
          totalItems: total,
        }}
      />
    </div>
  );
}
