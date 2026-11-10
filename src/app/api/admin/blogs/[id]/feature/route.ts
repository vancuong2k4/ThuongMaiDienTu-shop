// ============================================================
// app/api/admin/blogs/[id]/feature/route.ts
// API Ghim/Bỏ ghim bài viết nổi bật Admin CMS (Stage 8.2)
// ============================================================

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { blogFeatureToggleSchema } from "@/lib/validations/blog";

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
    const result = blogFeatureToggleSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: "Dữ liệu trạng thái nổi bật không hợp lệ" },
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

    const updated = await prisma.blogPost.update({
      where: { id },
      data: {
        isFeatured: result.data.isFeatured,
      },
    });

    return NextResponse.json({
      success: true,
      message: `Đã ${updated.isFeatured ? "đánh dấu nổi bật" : "bỏ đánh dấu nổi bật"} bài viết`,
      isFeatured: updated.isFeatured,
    });
  } catch (error) {
    console.error("PATCH /api/admin/blogs/[id]/feature error:", error);
    return NextResponse.json(
      { error: "Đã xảy ra lỗi khi cập nhật trạng thái nổi bật" },
      { status: 500 }
    );
  }
}
