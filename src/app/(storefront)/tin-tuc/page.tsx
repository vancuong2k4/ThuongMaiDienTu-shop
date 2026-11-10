// ============================================================
// app/(storefront)/tin-tuc/page.tsx
// Trang Cẩm Nang Sức Khỏe & Blog Tin Tức Chuẩn SEO (Stage 8.4)
// ============================================================

import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { BlogHeroFeatured } from "@/components/storefront/blog/BlogHeroFeatured";
import { BlogListClient } from "@/components/storefront/blog/BlogListClient";
import { BlogExpertBanner } from "@/components/storefront/blog/BlogExpertBanner";
import type {
  StorefrontBlogPost,
  CategoryCount,
} from "@/components/storefront/blog/types";
import { BLOG_CATEGORIES } from "@/lib/validations/blog";
import { Home, ChevronRight, BookOpen, ShieldCheck } from "lucide-react";

export const revalidate = 60; // ISR 60 seconds

export const metadata: Metadata = {
  title: "Cẩm Nang Sức Khỏe & Dinh Dưỡng Ngoại Nhập | THUYNGA Shop",
  description:
    "Kho tàng kiến thức y khoa, dinh dưỡng mẹ và bé, kinh nghiệm chọn trái cây bay và mẹo phân biệt thực phẩm chức năng chính hãng từ Dược sĩ Thu Nga.",
  keywords: [
    "cẩm nang sức khỏe",
    "dinh dưỡng mẹ và bé",
    "kinh nghiệm chọn cherry úc",
    "hồng sâm hàn quốc",
    "phân biệt thật giả",
    "thực phẩm chức năng úc",
    "dược sĩ thu nga",
  ],
  alternates: {
    canonical: "/tin-tuc",
  },
  openGraph: {
    title: "Cẩm Nang Sức Khỏe & Dinh Dưỡng Ngoại Nhập | THUYNGA Shop",
    description:
      "Kho tàng kiến thức y khoa và mẹo phân biệt hàng ngoại nhập chính hãng từ Dược sĩ Thu Nga.",
    type: "website",
    locale: "vi_VN",
    url: "/tin-tuc",
  },
};

export default async function StorefrontBlogPage() {
  // Query all published blog posts
  const posts = await prisma.blogPost.findMany({
    where: { isPublished: true },
    orderBy: [{ isFeatured: "desc" }, { publishedAt: "desc" }],
  });

  // Serialize to plain objects
  const serializedPosts: StorefrontBlogPost[] = posts.map((post) => ({
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
    publishedAt: post.publishedAt?.toISOString() || null,
    createdAt: post.createdAt.toISOString(),
    seoTitle: post.seoTitle,
    seoDesc: post.seoDesc,
    seoKeywords: post.seoKeywords,
  }));

  // Identify featured hero post (first isFeatured or first post)
  const featuredPost =
    serializedPosts.find((p) => p.isFeatured) || serializedPosts[0] || null;

  // Remaining posts for listing
  const listingPosts = featuredPost
    ? serializedPosts.filter((p) => p.id !== featuredPost.id)
    : serializedPosts;

  // Compute category counts
  const categoryCounts: CategoryCount[] = BLOG_CATEGORIES.map((catName) => ({
    name: catName,
    count: serializedPosts.filter((p) => p.category === catName).length,
  }));

  // Schema.org CollectionPage & Blog JSON-LD
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Cẩm Nang Sức Khỏe & Dinh Dưỡng Ngoại Nhập",
    description:
      "Kho tàng kiến thức y khoa, dinh dưỡng mẹ và bé và mẹo tiêu dùng thông minh từ Dược sĩ Thu Nga.",
    url: "https://thuynhangashop.vn/tin-tuc",
    mainEntity: {
      "@type": "ItemList",
      itemListElement: serializedPosts.slice(0, 10).map((post, index) => ({
        "@type": "ListItem",
        position: index + 1,
        url: `https://thuynhangashop.vn/tin-tuc/${post.slug}`,
        name: post.title,
      })),
    },
  };

  return (
    <div className="bg-[#fcfaf8] min-h-screen py-6 sm:py-10">
      {/* Schema.org Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Breadcrumb Navigation */}
        <nav
          aria-label="Breadcrumb"
          className="flex items-center gap-1.5 text-xs text-slate-500"
        >
          <Link
            href="/"
            className="flex items-center gap-1 hover:text-[#800028] transition-colors"
          >
            <Home className="w-3.5 h-3.5" />
            <span>Trang chủ</span>
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="font-semibold text-slate-800">
            Cẩm nang sức khỏe & Tin tức
          </span>
        </nav>

        {/* Page Hero Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 pt-2 pb-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-50 text-[#800028] text-xs font-bold uppercase tracking-wider border border-rose-100/80">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Kho Tàng Kiến Thức Dược Phẩm & Dinh Dưỡng</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight leading-tight">
            Cẩm Nang Sức Khỏe & Tiêu Dùng Thông Minh
          </h1>

          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
            Kiến thức y khoa chuẩn xác, kinh nghiệm chọn thực phẩm ngoại nhập bay Air Cargo và mẹo chăm sóc sức khỏe gia đình được biên soạn bởi Dược sĩ đại học.
          </p>
        </div>

        {/* Featured Hero Article */}
        {featuredPost && <BlogHeroFeatured post={featuredPost} />}

        {/* Interactive Listing Container */}
        <BlogListClient
          initialPosts={listingPosts}
          categories={categoryCounts}
        />

        {/* Expert & Consultation Trust Banner */}
        <BlogExpertBanner />
      </div>
    </div>
  );
}
