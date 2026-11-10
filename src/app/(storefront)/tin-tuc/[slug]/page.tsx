// ============================================================
// app/(storefront)/tin-tuc/[slug]/page.tsx
// Trang Chi Tiết Bài Viết Cẩm Nang Chuẩn SEO & E-E-A-T (Stage 8.5)
// ============================================================

import React from "react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { TableOfContents, type HeadingItem } from "@/components/storefront/blog/TableOfContents";
import { ArticleShareBar } from "@/components/storefront/blog/ArticleShareBar";
import { ArticleContent, slugifyHeading } from "@/components/storefront/blog/ArticleContent";
import { ArticleProductMentions, type MentionedProduct } from "@/components/storefront/blog/ArticleProductMentions";
import { RelatedArticles } from "@/components/storefront/blog/RelatedArticles";
import { BlogExpertBanner } from "@/components/storefront/blog/BlogExpertBanner";
import type { StorefrontBlogPost } from "@/components/storefront/blog/types";
import {
  Home,
  ChevronRight,
  Calendar,
  Clock,
  Eye,
  CheckCircle2,
  PhoneCall,
  MessageCircle,
  ShieldCheck,
  BookOpen,
} from "lucide-react";

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export const revalidate = 60; // ISR 60 seconds

// Dynamic SEO Metadata
export async function generateMetadata(props: PageProps): Promise<Metadata> {
  const { slug } = await props.params;

  const post = await prisma.blogPost.findUnique({
    where: { slug },
  });

  if (!post || !post.isPublished) {
    return {
      title: "Không tìm thấy bài viết | THUYNGA Shop",
    };
  }

  const metaTitle = post.seoTitle || `${post.title} | THUYNGA Shop`;
  const metaDesc =
    post.seoDesc ||
    post.excerpt ||
    "Cẩm nang sức khỏe và tiêu dùng hàng ngoại nhập chính hãng từ Dược sĩ Thu Nga.";

  const keywords = post.seoKeywords
    ? post.seoKeywords.split(",").map((k) => k.trim())
    : [post.category, "cẩm nang sức khỏe", "thuy nga shop"];

  return {
    title: metaTitle,
    description: metaDesc,
    keywords,
    alternates: {
      canonical: `/tin-tuc/${post.slug}`,
    },
    openGraph: {
      title: metaTitle,
      description: metaDesc,
      type: "article",
      locale: "vi_VN",
      url: `/tin-tuc/${post.slug}`,
      publishedTime: post.publishedAt?.toISOString() || post.createdAt.toISOString(),
      modifiedTime: post.updatedAt.toISOString(),
      authors: [post.authorName],
      section: post.category,
      images: post.coverImage ? [{ url: post.coverImage }] : [],
    },
    twitter: {
      card: "summary_large_image",
      title: metaTitle,
      description: metaDesc,
      images: post.coverImage ? [post.coverImage] : [],
    },
  };
}

export default async function BlogPostDetailPage(props: PageProps) {
  const { slug } = await props.params;

  // Query article
  const post = await prisma.blogPost.findUnique({
    where: { slug },
  });

  if (!post || !post.isPublished) {
    notFound();
  }

  // Atomic increment view count in background
  try {
    await prisma.blogPost.update({
      where: { id: post.id },
      data: { viewCount: { increment: 1 } },
    });
  } catch {
    // Non-blocking error
  }

  // Extract headings for Table of Contents
  const headings: HeadingItem[] = [];
  const lines = post.content.split("\n");
  lines.forEach((line) => {
    const trimmed = line.trim();
    if (trimmed.startsWith("## ")) {
      const text = trimmed.replace("## ", "").trim();
      headings.push({ id: slugifyHeading(text), text, level: 2 });
    } else if (trimmed.startsWith("### ")) {
      const text = trimmed.replace("### ", "").trim();
      headings.push({ id: slugifyHeading(text), text, level: 3 });
    }
  });

  // Query related genuine products to suggest
  const rawProducts = await prisma.product.findMany({
    where: { isActive: true },
    take: 4,
    orderBy: { isFeatured: "desc" },
    include: {
      variants: {
        where: { isActive: true },
        orderBy: [{ isDefault: "desc" }, { price: "asc" }],
        take: 1,
      },
      images: {
        orderBy: { sortOrder: "asc" },
        take: 1,
      },
    },
  });

  const mentionedProducts: MentionedProduct[] = rawProducts.map((p) => {
    const defaultVariant = p.variants[0];
    const defaultImage = p.images[0];
    return {
      id: p.id,
      name: p.name,
      slug: p.slug,
      brand: p.brand,
      origin: p.origin,
      imageUrl: defaultImage?.url || null,
      price: defaultVariant ? Number(defaultVariant.price) : 0,
      originalPrice: defaultVariant?.originalPrice
        ? Number(defaultVariant.originalPrice)
        : null,
      inStock: defaultVariant ? defaultVariant.stock > 0 : true,
    };
  });

  // Query related articles in same category
  const rawRelatedArticles = await prisma.blogPost.findMany({
    where: {
      isPublished: true,
      category: post.category,
      id: { not: post.id },
    },
    take: 3,
    orderBy: { publishedAt: "desc" },
  });

  const relatedArticles: StorefrontBlogPost[] = rawRelatedArticles.map((a) => ({
    id: a.id,
    title: a.title,
    slug: a.slug,
    excerpt: a.excerpt,
    content: a.content,
    coverImage: a.coverImage,
    category: a.category,
    authorName: a.authorName,
    readingTime: a.readingTime,
    viewCount: a.viewCount,
    isFeatured: a.isFeatured,
    publishedAt: a.publishedAt?.toISOString() || null,
    createdAt: a.createdAt.toISOString(),
    seoTitle: a.seoTitle,
    seoDesc: a.seoDesc,
    seoKeywords: a.seoKeywords,
  }));

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

  // Schema.org Article Structured Data
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt || post.seoDesc,
    image: post.coverImage ? [post.coverImage] : [],
    datePublished: post.publishedAt?.toISOString() || post.createdAt.toISOString(),
    dateModified: post.updatedAt.toISOString(),
    author: {
      "@type": "Person",
      name: post.authorName,
      jobTitle: "Dược sĩ chuyên môn",
      worksFor: {
        "@type": "Organization",
        name: "THUYNGA Shop",
      },
    },
    publisher: {
      "@type": "Organization",
      name: "THUYNGA Shop",
      logo: {
        "@type": "ImageObject",
        url: "https://thuynhangashop.vn/logo.png",
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://thuynhangashop.vn/tin-tuc/${post.slug}`,
    },
  };

  return (
    <article className="bg-[#fcfaf8] min-h-screen py-6 sm:py-10">
      {/* Schema.org Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Breadcrumb Navigation */}
        <nav
          aria-label="Breadcrumb"
          className="flex items-center gap-1.5 text-xs text-slate-500 flex-wrap"
        >
          <Link
            href="/"
            className="flex items-center gap-1 hover:text-[#800028] transition-colors"
          >
            <Home className="w-3.5 h-3.5" />
            <span>Trang chủ</span>
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <Link
            href="/tin-tuc"
            className="hover:text-[#800028] transition-colors"
          >
            Cẩm nang sức khỏe
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-slate-500 font-medium">{post.category}</span>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="font-semibold text-slate-800 line-clamp-1 max-w-xs">
            {post.title}
          </span>
        </nav>

        {/* Article Header */}
        <header className="space-y-4 max-w-4xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-50 text-[#800028] text-xs font-bold uppercase tracking-wider border border-rose-100">
            <BookOpen className="w-3.5 h-3.5" />
            <span>{post.category}</span>
          </div>

          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-tight">
            {post.title}
          </h1>

          {/* Metadata bar */}
          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600 pt-2 border-b border-slate-200/80 pb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-[#800028] text-white font-bold text-xs flex items-center justify-center">
                TN
              </div>
              <div>
                <span className="font-bold text-slate-900 flex items-center gap-1">
                  {post.authorName}
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                </span>
                <span className="text-[11px] text-slate-400">
                  Dược sĩ tư vấn chuyên môn
                </span>
              </div>
            </div>

            <span className="text-slate-300 hidden sm:inline">•</span>

            <span className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-slate-400" />
              <span>Đăng ngày: {formattedDate}</span>
            </span>

            <span className="text-slate-300 hidden sm:inline">•</span>

            <span className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-slate-400" />
              <span>{post.readingTime} phút đọc</span>
            </span>

            <span className="text-slate-300 hidden sm:inline">•</span>

            <span className="flex items-center gap-1.5 font-medium">
              <Eye className="w-4 h-4 text-slate-400" />
              <span>{(post.viewCount + 1).toLocaleString("vi-VN")} lượt đọc</span>
            </span>
          </div>
        </header>

        {/* Cover Image */}
        {post.coverImage && (
          <div className="relative aspect-video max-h-[500px] w-full rounded-3xl overflow-hidden bg-slate-100 shadow-lg border border-slate-200/80">
            <Image
              src={post.coverImage}
              alt={post.title}
              fill
              priority
              sizes="(max-width: 1280px) 100vw, 1200px"
              className="object-cover"
            />
          </div>
        )}

        {/* Social Share Bar */}
        <ArticleShareBar title={post.title} slug={post.slug} />

        {/* Main Content Layout: 2 Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Article Body (8 cols) */}
          <main className="lg:col-span-8 bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-10 shadow-xs">
            {/* Excerpt Lead */}
            {post.excerpt && (
              <p className="text-base sm:text-lg font-medium text-slate-800 leading-relaxed border-l-4 border-[#800028] pl-4 py-1 mb-8 bg-rose-50/40 rounded-r-xl">
                {post.excerpt}
              </p>
            )}

            {/* Formatted Content */}
            <ArticleContent content={post.content} />

            {/* Shop The Story: Mentioned Products */}
            <ArticleProductMentions products={mentionedProducts} />
          </main>

          {/* Sticky Sidebar (4 cols) */}
          <aside className="lg:col-span-4 space-y-6 lg:sticky lg:top-24">
            {/* Table of Contents */}
            <TableOfContents headings={headings} />

            {/* Quick Consultation Callout */}
            <div className="bg-gradient-to-br from-rose-900 to-slate-900 rounded-3xl p-6 text-white space-y-4 shadow-xl">
              <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-amber-300">
                <ShieldCheck className="w-6 h-6" />
              </div>

              <div className="space-y-1">
                <h4 className="text-base font-bold">Tư Vấn Miễn Phí Với Dược Sĩ</h4>
                <p className="text-xs text-rose-100/80 leading-relaxed">
                  Cần tư vấn chọn sản phẩm phù hợp thể trạng hoặc giải đáp liều dùng? Đội ngũ Dược sĩ sẵn sàng hỗ trợ bạn.
                </p>
              </div>

              <div className="space-y-2 pt-2">
                <a
                  href="tel:0987654321"
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-white text-[#800028] font-bold text-xs hover:bg-rose-50 transition-all shadow-md"
                >
                  <PhoneCall className="w-4 h-4 text-[#800028]" />
                  <span>Hotline: 0987.654.321</span>
                </a>

                <a
                  href="https://zalo.me"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold text-xs transition-all border border-white/20"
                >
                  <MessageCircle className="w-4 h-4 text-emerald-300" />
                  <span>Nhắn Zalo Dược Sĩ</span>
                </a>
              </div>
            </div>
          </aside>
        </div>

        {/* Related Articles in same category */}
        <RelatedArticles
          articles={relatedArticles}
          category={post.category}
        />

        {/* Bottom Expert Banner */}
        <BlogExpertBanner />
      </div>
    </article>
  );
}
