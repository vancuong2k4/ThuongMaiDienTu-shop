// ============================================================
// app/api/admin/blogs/route.ts
// API Danh Sách & Tạo Mới Bài Viết Cẩm Nang Admin CMS (Stage 8.2)
// ============================================================

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { blogPostSchema } from "@/lib/validations/blog";
import { slugify } from "@/lib/utils";
import { Prisma } from "@prisma/client";

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
    const limit = Math.max(1, Math.min(100, parseInt(searchParams.get("limit") || "10")));
    const skip = (page - 1) * limit;

    const search = searchParams.get("search")?.trim() || "";
    const category = searchParams.get("category") || "ALL";
    const status = searchParams.get("status") || "ALL";
    const isFeatured = searchParams.get("isFeatured") || "ALL";
    const sortBy = searchParams.get("sortBy") || "createdAt_desc";

    // ── Xây dựng điều kiện lọc ──────────────────────────────────
    const where: Prisma.BlogPostWhereInput = {};

    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { excerpt: { contains: search, mode: "insensitive" } },
        { content: { contains: search, mode: "insensitive" } },
      ];
    }

    if (category !== "ALL") {
      where.category = category;
    }

    if (status === "PUBLISHED") {
      where.isPublished = true;
    } else if (status === "DRAFT") {
      where.isPublished = false;
    }

    if (isFeatured === "FEATURED") {
      where.isFeatured = true;
    } else if (isFeatured === "NORMAL") {
      where.isFeatured = false;
    }

    // ── Sắp xếp ────────────────────────────────────────────────
    let orderBy: Prisma.BlogPostOrderByWithRelationInput = { createdAt: "desc" };
    if (sortBy === "views_desc") {
      orderBy = { viewCount: "desc" };
    } else if (sortBy === "title_asc") {
      orderBy = { title: "asc" };
    }

    // ── Truy vấn danh sách & Thống kê song song ────────────────
    const [posts, totalCount, statsAgg] = await Promise.all([
      prisma.blogPost.findMany({
        where,
        skip,
        take: limit,
        orderBy,
      }),
      prisma.blogPost.count({ where }),
      Promise.all([
        prisma.blogPost.count(),
        prisma.blogPost.count({ where: { isPublished: true } }),
        prisma.blogPost.count({ where: { isPublished: false } }),
        prisma.blogPost.aggregate({
          _sum: { viewCount: true },
        }),
      ]),
    ]);

    const [totalAll, publishedCount, draftCount, viewsAgg] = statsAgg;

    const formattedPosts = posts.map((p) => ({
      id: p.id,
      title: p.title,
      slug: p.slug,
      excerpt: p.excerpt,
      content: p.content,
      coverImage: p.coverImage,
      category: p.category,
      authorName: p.authorName,
      readingTime: p.readingTime,
      viewCount: p.viewCount,
      isFeatured: p.isFeatured,
      isPublished: p.isPublished,
      publishedAt: p.publishedAt ? p.publishedAt.toISOString() : null,
      seoTitle: p.seoTitle,
      seoDesc: p.seoDesc,
      seoKeywords: p.seoKeywords,
      createdAt: p.createdAt.toISOString(),
      updatedAt: p.updatedAt.toISOString(),
    }));

    return NextResponse.json({
      success: true,
      posts: formattedPosts,
      pagination: {
        page,
        limit,
        total: totalCount,
        totalPages: Math.ceil(totalCount / limit) || 1,
      },
      stats: {
        total: totalAll,
        published: publishedCount,
        draft: draftCount,
        totalViews: viewsAgg._sum.viewCount || 0,
      },
    });
  } catch (error) {
    console.error("GET /api/admin/blogs error:", error);
    return NextResponse.json(
      { error: "Đã xảy ra lỗi khi lấy danh sách bài viết" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const result = blogPostSchema.safeParse(body);

    if (!result.success) {
      const firstError = result.error.issues[0]?.message || "Dữ liệu không hợp lệ";
      return NextResponse.json({ error: firstError }, { status: 400 });
    }

    const {
      title,
      slug,
      category,
      authorName,
      excerpt,
      content,
      coverImage,
      readingTime,
      isFeatured,
      isPublished,
      seoTitle,
      seoDesc,
      seoKeywords,
    } = result.data;

    // Tự sinh slug tiếng Việt chuẩn SEO nếu không nhập
    let finalSlug = slug ? slugify(slug) : slugify(title);
    if (!finalSlug) {
      finalSlug = `bai-viet-${Date.now()}`;
    }

    // Kiểm tra trùng lặp slug
    const existing = await prisma.blogPost.findUnique({
      where: { slug: finalSlug },
    });

    if (existing) {
      finalSlug = `${finalSlug}-${Date.now().toString().slice(-4)}`;
    }

    // Tính toán thời gian đọc tự động nếu cần (khoảng 200 từ/phút)
    let computedReadingTime = readingTime;
    if (!computedReadingTime || computedReadingTime <= 1) {
      const plainText = content.replace(/<[^>]*>/g, " ");
      const wordCount = plainText.trim().split(/\s+/).length;
      computedReadingTime = Math.max(1, Math.ceil(wordCount / 200));
    }

    const post = await prisma.blogPost.create({
      data: {
        title,
        slug: finalSlug,
        category: category || "Cẩm nang sức khỏe",
        authorName: authorName || "Dược sĩ Thu Nga",
        excerpt,
        content,
        coverImage: coverImage || null,
        readingTime: computedReadingTime,
        isFeatured,
        isPublished,
        publishedAt: isPublished ? new Date() : null,
        seoTitle: seoTitle || title,
        seoDesc: seoDesc || excerpt.slice(0, 160),
        seoKeywords: seoKeywords || null,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Đã tạo bài viết cẩm nang thành công",
        post: {
          id: post.id,
          title: post.title,
          slug: post.slug,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /api/admin/blogs error:", error);
    return NextResponse.json(
      { error: "Đã xảy ra lỗi khi tạo bài viết mới" },
      { status: 500 }
    );
  }
}
