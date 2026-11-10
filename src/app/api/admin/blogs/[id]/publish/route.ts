// ============================================================
// app/api/admin/blogs/[id]/publish/route.ts
// API Bật/Tắt nhanh xuất bản bài viết cẩm nang Admin CMS (Stage 8.2)
// ============================================================

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { blogPublishToggleSchema } from "@/lib/validations/blog";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function PATCH(req: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth();
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();
    const result = blogPublishToggleSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: "Dữ liệu trạng thái không hợp lệ" },
        { status: 400 }
      );
    }

    const post = await prisma.blogPost.findUnique({
      where: { id },
    });

    if (!post) {
      return NextResponse.json(
        { error: "Không tìm thấy bài viết" },
        { status: 404 }
      );
    }

    const nextPublishedState = result.data.isPublished;
    const publishedAt =
      nextPublishedState && !post.publishedAt ? new Date() : post.publishedAt;

    const updated = await prisma.blogPost.update({
      where: { id },
      data: {
        isPublished: nextPublishedState,
        publishedAt,
      },
    });

    return NextResponse.json({
      success: true,
      message: `Đã ${updated.isPublished ? "xuất bản công khai" : "chuyển thành bản nháp"} bài viết`,
      isPublished: updated.isPublished,
      publishedAt: updated.publishedAt ? updated.publishedAt.toISOString() : null,
    });
  } catch (error) {
    console.error("PATCH /api/admin/blogs/[id]/publish error:", error);
    return NextResponse.json(
      { error: "Đã xảy ra lỗi khi cập nhật trạng thái xuất bản" },
      { status: 500 }
    );
  }
}
