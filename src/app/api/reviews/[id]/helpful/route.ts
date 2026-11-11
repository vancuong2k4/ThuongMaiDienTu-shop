// ============================================================
// app/api/reviews/[id]/helpful/route.ts
// REST API Bình chọn "Hữu ích" cho đánh giá khách hàng (Phase 14)
// ============================================================

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { toggleHelpfulVote } from "@/lib/reviews";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function POST(req: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Vui lòng đăng nhập để bình chọn đánh giá hữu ích" },
        { status: 401 }
      );
    }

    const { id: reviewId } = await params;
    const userId = session.user.id;

    const review = await prisma.review.findUnique({
      where: { id: reviewId },
      select: { id: true, userId: true },
    });

    if (!review) {
      return NextResponse.json(
        { error: "Không tìm thấy bài đánh giá" },
        { status: 404 }
      );
    }

    if (review.userId === userId) {
      return NextResponse.json(
        { error: "Bạn không thể tự bình chọn đánh giá của chính mình" },
        { status: 400 }
      );
    }

    const result = await toggleHelpfulVote(reviewId, userId);

    return NextResponse.json({
      success: true,
      isHelpful: result.isHelpful,
      helpfulCount: result.helpfulCount,
      message: result.isHelpful
        ? "Cảm ơn bạn đã ghi nhận đánh giá hữu ích!"
        : "Đã hủy bình chọn hữu ích",
    });
  } catch (error) {
    console.error("POST /api/reviews/[id]/helpful error:", error);
    return NextResponse.json(
      { error: "Đã xảy ra lỗi khi bình chọn, vui lòng thử lại sau" },
      { status: 500 }
    );
  }
}
