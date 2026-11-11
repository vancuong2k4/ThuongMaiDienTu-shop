// ============================================================
// app/api/reviews/product/[slug]/route.ts
// REST API Lấy danh sách đánh giá & Thống kê đa chiều của Sản phẩm (Phase 14)
// ============================================================

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ReviewStatus, Prisma } from "@prisma/client";
import { auth } from "@/lib/auth";
import { calculateProductRatingStats } from "@/lib/reviews";

interface RouteParams {
  params: Promise<{ slug: string }>;
}

export async function GET(req: NextRequest, { params }: RouteParams) {
  try {
    const { slug } = await params;
    const { searchParams } = new URL(req.url);

    const product = await prisma.product.findUnique({
      where: { slug },
      select: { id: true, name: true, slug: true },
    });

    if (!product) {
      return NextResponse.json(
        { error: "Không tìm thấy sản phẩm" },
        { status: 404 }
      );
    }

    const session = await auth();
    const currentUserId = session?.user?.id;

    const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
    const limit = Math.max(1, Math.min(50, parseInt(searchParams.get("limit") || "10")));
    const skip = (page - 1) * limit;

    const ratingParam = searchParams.get("rating");
    const hasImagesParam = searchParams.get("hasImages");
    const verifiedOnlyParam = searchParams.get("verifiedOnly");
    const sortParam = searchParams.get("sort") || "latest";

    // Xây dựng điều kiện lọc
    const where: Prisma.ReviewWhereInput = {
      productId: product.id,
      status: { in: [ReviewStatus.APPROVED, ReviewStatus.FEATURED] },
    };

    if (ratingParam && ratingParam !== "ALL") {
      const parsedRating = parseInt(ratingParam);
      if (!isNaN(parsedRating) && parsedRating >= 1 && parsedRating <= 5) {
        where.rating = parsedRating;
      }
    }

    if (hasImagesParam === "true") {
      where.images = { isEmpty: false };
    }

    if (verifiedOnlyParam === "true") {
      where.isVerifiedBuyer = true;
    }

    // Sắp xếp
    let orderBy: Prisma.ReviewOrderByWithRelationInput[] = [];
    if (sortParam === "helpful") {
      orderBy = [{ helpfulCount: "desc" }, { createdAt: "desc" }];
    } else if (sortParam === "highest") {
      orderBy = [{ rating: "desc" }, { createdAt: "desc" }];
    } else if (sortParam === "lowest") {
      orderBy = [{ rating: "asc" }, { createdAt: "desc" }];
    } else {
      // Mặc định: Ghim FEATURED lên đầu, sau đó theo ngày mới nhất
      orderBy = [{ status: "asc" }, { createdAt: "desc" }];
    }

    // Truy vấn song song dữ liệu thống kê & danh sách bài đánh giá
    const [stats, totalCount, reviews] = await Promise.all([
      calculateProductRatingStats(product.id),
      prisma.review.count({ where }),
      prisma.review.findMany({
        where,
        skip,
        take: limit,
        orderBy,
        include: {
          user: {
            select: {
              name: true,
              avatar: true,
              membershipTier: true,
            },
          },
        },
      }),
    ]);

    // Kiểm tra xem người dùng hiện tại đã like bài nào chưa
    let userHelpfulVoteReviewIds = new Set<string>();
    if (currentUserId && reviews.length > 0) {
      const reviewIds = reviews.map((r) => r.id);
      const userVotes = await prisma.reviewHelpfulVote.findMany({
        where: {
          userId: currentUserId,
          reviewId: { in: reviewIds },
        },
        select: { reviewId: true },
      });
      userHelpfulVoteReviewIds = new Set(userVotes.map((v) => v.reviewId));
    }

    const formattedReviews = reviews.map((r) => ({
      id: r.id,
      rating: r.rating,
      packagingRating: r.packagingRating,
      freshnessRating: r.freshnessRating,
      effectivenessRating: r.effectivenessRating,
      content: r.content,
      images: r.images,
      isVerifiedBuyer: r.isVerifiedBuyer,
      airCargoVerified: r.airCargoVerified,
      helpfulCount: r.helpfulCount,
      adminReply: r.adminReply,
      adminReplyAt: r.adminReplyAt ? r.adminReplyAt.toISOString() : null,
      rewardPoints: r.rewardPoints,
      isFeatured: r.status === ReviewStatus.FEATURED,
      isHelpfulByMe: userHelpfulVoteReviewIds.has(r.id),
      createdAt: r.createdAt.toISOString(),
      user: {
        name: r.user.name || "Khách hàng",
        avatar: r.user.avatar,
        membershipTier: r.user.membershipTier,
      },
    }));

    return NextResponse.json({
      success: true,
      stats,
      reviews: formattedReviews,
      pagination: {
        page,
        limit,
        total: totalCount,
        totalPages: Math.ceil(totalCount / limit),
      },
    });
  } catch (error) {
    console.error("GET /api/reviews/product/[slug] error:", error);
    return NextResponse.json(
      { error: "Đã xảy ra lỗi khi tải danh sách đánh giá" },
      { status: 500 }
    );
  }
}
