// ============================================================
// app/api/reviews/route.ts
// REST API Khách Hàng Gửi Đánh Giá Xác Thực & Nhận Thưởng (Phase 14)
// ============================================================

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ReviewStatus } from "@prisma/client";
import { auth } from "@/lib/auth";
import { createReviewSchema } from "@/lib/validations/review";
import { checkVerifiedBuyer, awardReviewPoints } from "@/lib/reviews";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Vui lòng đăng nhập để gửi đánh giá và nhận điểm thưởng THUYNGA Club" },
        { status: 401 }
      );
    }

    const userId = session.user.id;
    const body = await req.json();
    const result = createReviewSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        {
          error: "Dữ liệu đánh giá không hợp lệ",
          details: result.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const {
      productId,
      orderId: clientOrderId,
      rating,
      packagingRating,
      freshnessRating,
      effectivenessRating,
      content,
      images,
    } = result.data;

    // 1. Kiểm tra xem người dùng đã từng đánh giá sản phẩm này chưa
    const existingReview = await prisma.review.findUnique({
      where: {
        productId_userId: {
          productId,
          userId,
        },
      },
    });

    if (existingReview) {
      return NextResponse.json(
        { error: "Bạn đã gửi đánh giá cho sản phẩm này rồi" },
        { status: 400 }
      );
    }

    // 2. Kiểm tra xác thực người mua hàng (Verified Buyer)
    const buyerCheck = await checkVerifiedBuyer(userId, productId);
    const finalOrderId = clientOrderId || buyerCheck.orderId;
    const isVerifiedBuyer = buyerCheck.isVerifiedBuyer || Boolean(finalOrderId);

    // 3. Khởi tạo đánh giá
    // Nếu là người mua hàng xác thực (Verified Buyer), tự động duyệt APPROVED để hiển thị ngay
    const initialStatus = isVerifiedBuyer
      ? ReviewStatus.APPROVED
      : ReviewStatus.PENDING;

    const review = await prisma.review.create({
      data: {
        productId,
        userId,
        orderId: finalOrderId,
        rating,
        packagingRating: packagingRating || rating,
        freshnessRating: freshnessRating || rating,
        effectivenessRating: effectivenessRating || rating,
        content: content.trim(),
        images,
        isVerifiedBuyer,
        airCargoVerified: true,
        status: initialStatus,
      },
      include: {
        user: {
          select: {
            name: true,
            avatar: true,
          },
        },
      },
    });

    // 4. Trả thưởng điểm THUYNGA Club (+50đ hoặc +150đ kèm ảnh UGC)
    const { pointsAwarded } = await awardReviewPoints(
      userId,
      review.id,
      images.length > 0
    );

    return NextResponse.json({
      success: true,
      message: `Cảm ơn bạn đã đánh giá! Bạn được tặng +${pointsAwarded} Điểm THUYNGA Club.`,
      data: review,
      pointsAwarded,
    });
  } catch (error) {
    console.error("POST /api/reviews error:", error);
    return NextResponse.json(
      { error: "Đã xảy ra lỗi khi gửi đánh giá, vui lòng thử lại sau" },
      { status: 500 }
    );
  }
}
