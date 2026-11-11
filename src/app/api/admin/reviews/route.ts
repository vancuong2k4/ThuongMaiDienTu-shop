// ============================================================
// app/api/admin/reviews/route.ts
// API Danh Sách & Thống Kê Kiểm Duyệt Đánh Giá Admin CMS (Phase 14)
// ============================================================

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ReviewStatus, Prisma } from "@prisma/client";

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
    const status = searchParams.get("status") || "ALL";
    const rating = searchParams.get("rating") || "ALL";
    const sortBy = searchParams.get("sortBy") || "createdAt_desc";

    // ── Xây dựng điều kiện lọc ──────────────────────────────────
    const where: Prisma.ReviewWhereInput = {};

    if (search) {
      where.OR = [
        { content: { contains: search, mode: "insensitive" } },
        { user: { name: { contains: search, mode: "insensitive" } } },
        { user: { email: { contains: search, mode: "insensitive" } } },
        { product: { name: { contains: search, mode: "insensitive" } } },
      ];
    }

    if (status !== "ALL" && Object.values(ReviewStatus).includes(status as ReviewStatus)) {
      where.status = status as ReviewStatus;
    }

    if (rating !== "ALL") {
      const parsedRating = parseInt(rating);
      if (!isNaN(parsedRating) && parsedRating >= 1 && parsedRating <= 5) {
        where.rating = parsedRating;
      }
    }

    // ── Sắp xếp ────────────────────────────────────────────────
    let orderBy: Prisma.ReviewOrderByWithRelationInput = { createdAt: "desc" };
    if (sortBy === "rating_desc") {
      orderBy = { rating: "desc" };
    } else if (sortBy === "rating_asc") {
      orderBy = { rating: "asc" };
    } else if (sortBy === "helpful_desc") {
      orderBy = { helpfulCount: "desc" };
    }

    // ── Truy vấn dữ liệu & Thống kê song song ───────────────────
    const [reviews, totalCount, statsData, avgAgg, mediaCount] = await Promise.all([
      prisma.review.findMany({
        where,
        skip,
        take: limit,
        orderBy,
        include: {
          product: {
            select: {
              id: true,
              name: true,
              slug: true,
              images: {
                take: 1,
                orderBy: { sortOrder: "asc" },
                select: { url: true },
              },
            },
          },
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              avatar: true,
              membershipTier: true,
            },
          },
        },
      }),
      prisma.review.count({ where }),
      Promise.all([
        prisma.review.count(),
        prisma.review.count({ where: { status: ReviewStatus.PENDING } }),
        prisma.review.count({ where: { status: ReviewStatus.APPROVED } }),
        prisma.review.count({ where: { status: ReviewStatus.REJECTED } }),
        prisma.review.count({ where: { status: ReviewStatus.FEATURED } }),
      ]),
      prisma.review.aggregate({
        _avg: { rating: true },
      }),
      prisma.review.count({
        where: { images: { isEmpty: false } },
      }),
    ]);

    const [totalAll, pendingCount, approvedCount, rejectedCount, featuredCount] = statsData;

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
      status: r.status,
      createdAt: r.createdAt.toISOString(),
      updatedAt: r.updatedAt.toISOString(),
      product: {
        id: r.product.id,
        name: r.product.name,
        slug: r.product.slug,
        image: r.product.images[0]?.url || null,
      },
      user: {
        id: r.user.id,
        name: r.user.name,
        email: r.user.email,
        avatar: r.user.avatar,
        membershipTier: r.user.membershipTier,
      },
    }));

    const rawAvg = avgAgg._avg.rating || 5.0;
    const averageRating = Math.round(rawAvg * 10) / 10;
    const mediaRate = totalAll > 0 ? Math.round((mediaCount / totalAll) * 100) : 0;

    return NextResponse.json({
      success: true,
      reviews: formattedReviews,
      pagination: {
        page,
        limit,
        total: totalCount,
        totalPages: Math.ceil(totalCount / limit) || 1,
      },
      stats: {
        total: totalAll,
        pending: pendingCount,
        approved: approvedCount,
        rejected: rejectedCount,
        featured: featuredCount,
        averageRating,
        mediaRate,
      },
    });
  } catch (error) {
    console.error("GET /api/admin/reviews error:", error);
    return NextResponse.json(
      { error: "Đã xảy ra lỗi khi lấy danh sách đánh giá" },
      { status: 500 }
    );
  }
}
