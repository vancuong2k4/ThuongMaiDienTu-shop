// ============================================================
// app/api/admin/blogs/[id]/route.ts
// API Chi Tiết, Chỉnh Sửa & Xóa Bài Viết Admin CMS (Stage 8.2)
// ============================================================

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { blogPostSchema } from "@/lib/validations/blog";
import { slugify } from "@/lib/utils";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(req: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth();
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const post = await prisma.blogPost.findUnique({
      where: { id },
    });

    if (!post) {
      return NextResponse.json(
        { error: "Không tìm thấy bài viết" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      post: {
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
        publishedAt: post.publishedAt ? post.publishedAt.toISOString() : null,
        seoTitle: post.seoTitle,
        seoDesc: post.seoDesc,
        seoKeywords: post.seoKeywords,
        createdAt: post.createdAt.toISOString(),
        updatedAt: post.updatedAt.toISOString(),
      },
    });
  } catch (error) {
    console.error("GET /api/admin/blogs/[id] error:", error);
    return NextResponse.json(
      { error: "Đã xảy ra lỗi khi lấy bài viết" },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth();
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();
    const result = blogPostSchema.safeParse(body);

    if (!result.success) {
      const firstError = result.error.issues[0]?.message || "Dữ liệu không hợp lệ";
      return NextResponse.json({ error: firstError }, { status: 400 });
    }

    const existing = await prisma.blogPost.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json(
        { error: "Không tìm thấy bài viết cần cập nhật" },
        { status: 404 }
      );
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

    let finalSlug = slug ? slugify(slug) : slugify(title);
    if (!finalSlug) {
      finalSlug = existing.slug;
    }

    // Kiểm tra trùng lặp slug với bài khác
    if (finalSlug !== existing.slug) {
      const duplicate = await prisma.blogPost.findUnique({
        where: { slug: finalSlug },
      });
      if (duplicate && duplicate.id !== id) {
        return NextResponse.json(
          { error: `Đường dẫn (slug) "${finalSlug}" đã được sử dụng ở bài viết khác.` },
          { status: 400 }
        );
      }
    }

    // Xác định thời gian xuất bản
    let publishedAt = existing.publishedAt;
    if (isPublished && !existing.isPublished && !publishedAt) {
      publishedAt = new Date();
    }

    const updated = await prisma.blogPost.update({
      where: { id },
      data: {
        title,
        slug: finalSlug,
        category: category || "Cẩm nang sức khỏe",
        authorName: authorName || "Dược sĩ Thu Nga",
        excerpt,
        content,
        coverImage: coverImage || null,
        readingTime: readingTime || existing.readingTime,
        isFeatured,
        isPublished,
        publishedAt,
        seoTitle: seoTitle || title,
        seoDesc: seoDesc || excerpt.slice(0, 160),
        seoKeywords: seoKeywords || null,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Đã cập nhật bài viết thành công",
      post: {
        id: updated.id,
        title: updated.title,
        slug: updated.slug,
      },
    });
  } catch (error) {
    console.error("PUT /api/admin/blogs/[id] error:", error);
    return NextResponse.json(
      { error: "Đã xảy ra lỗi khi cập nhật bài viết" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth();
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const existing = await prisma.blogPost.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json(
        { error: "Không tìm thấy bài viết để xóa" },
        { status: 404 }
      );
    }

    await prisma.blogPost.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: `Đã xóa bài viết "${existing.title}" thành công`,
    });
  } catch (error) {
    console.error("DELETE /api/admin/blogs/[id] error:", error);
    return NextResponse.json(
      { error: "Đã xảy ra lỗi khi xóa bài viết" },
      { status: 500 }
    );
  }
}
