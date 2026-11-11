// ============================================================
// app/api/admin/referrals/route.ts
// REST API Quản Trị Hệ Thống Tiếp Thị Giới Thiệu Admin CMS (Stage 12.2)
// ============================================================

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { queryReferralsSchema } from "@/lib/validations/referral";
import type { Prisma, ReferralStatus } from "@prisma/client";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const parsed = queryReferralsSchema.safeParse({
      page: searchParams.get("page") || 1,
      limit: searchParams.get("limit") || 15,
      status: searchParams.get("status") || "ALL",
      search: searchParams.get("search") || undefined,
    });

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Tham số truy vấn không hợp lệ" },
        { status: 400 }
      );
    }

    const { page, limit, status, search } = parsed.data;
    const skip = (page - 1) * limit;

    const where: Prisma.ReferralRecordWhereInput = {};

    if (status !== "ALL") {
      where.status = status as ReferralStatus;
    }

    if (search && search.trim()) {
      where.OR = [
        { referrer: { name: { contains: search.trim(), mode: "insensitive" } } },
        { referrer: { email: { contains: search.trim(), mode: "insensitive" } } },
        { referee: { name: { contains: search.trim(), mode: "insensitive" } } },
        { referee: { email: { contains: search.trim(), mode: "insensitive" } } },
        { refereeVoucherCode: { contains: search.trim(), mode: "insensitive" } },
      ];
    }

    const [totalCount, recordsRaw, totalRewarded, allDeliveredOrders] =
      await Promise.all([
        prisma.referralRecord.count({ where }),
        prisma.referralRecord.findMany({
          where,
          orderBy: { createdAt: "desc" },
          take: limit,
          skip,
          include: {
            referrer: {
              select: {
                id: true,
                name: true,
                email: true,
                phone: true,
                avatar: true,
                membershipTier: true,
                referralCode: true,
              },
            },
            referee: {
              select: {
                id: true,
                name: true,
                email: true,
                phone: true,
                avatar: true,
                membershipTier: true,
                createdAt: true,
              },
            },
            order: {
              select: {
                id: true,
                orderNumber: true,
                total: true,
                orderStatus: true,
                createdAt: true,
              },
            },
          },
        }),
        prisma.referralRecord.count({
          where: { status: "REWARDED" },
        }),
        // Tổng doanh số từ các đơn hàng giới thiệu thành công
        prisma.order.aggregate({
          _sum: { total: true },
          where: {
            referralRecords: {
              some: { status: "REWARDED" },
            },
            orderStatus: "DELIVERED",
          },
        }),
      ]);

    const totalSystemReferrals = await prisma.referralRecord.count();
    const conversionRate =
      totalSystemReferrals > 0
        ? Math.round((totalRewarded / totalSystemReferrals) * 100)
        : 0;
    const totalRevenue = Number(allDeliveredOrders._sum.total || 0);

    const stats = {
      totalReferrals: totalSystemReferrals,
      totalRewarded,
      conversionRate,
      totalRevenue,
      totalPointsDistributed: totalRewarded * 500,
    };

    const formattedRecords = recordsRaw.map((rec) => ({
      id: rec.id,
      referrer: {
        id: rec.referrer.id,
        name: rec.referrer.name || "Khách hàng",
        email: rec.referrer.email,
        phone: rec.referrer.phone,
        avatar: rec.referrer.avatar,
        membershipTier: rec.referrer.membershipTier,
        referralCode: rec.referrer.referralCode,
      },
      referee: {
        id: rec.referee.id,
        name: rec.referee.name || "Bạn mới",
        email: rec.referee.email,
        phone: rec.referee.phone,
        avatar: rec.referee.avatar,
        membershipTier: rec.referee.membershipTier,
        joinedAt: rec.referee.createdAt.toISOString(),
      },
      order: rec.order
        ? {
            id: rec.order.id,
            orderNumber: rec.order.orderNumber,
            total: Number(rec.order.total),
            status: rec.order.orderStatus,
            createdAt: rec.order.createdAt.toISOString(),
          }
        : null,
      status: rec.status,
      rewardPoints: rec.referrerRewardPoints,
      voucherCode: rec.refereeVoucherCode,
      rewardedAt: rec.rewardedAt ? rec.rewardedAt.toISOString() : null,
      createdAt: rec.createdAt.toISOString(),
    }));

    return NextResponse.json({
      success: true,
      records: formattedRecords,
      stats,
      pagination: {
        page,
        limit,
        total: totalCount,
        totalPages: Math.ceil(totalCount / limit) || 1,
      },
    });
  } catch (error) {
    console.error("GET /api/admin/referrals error:", error);
    return NextResponse.json(
      { error: "Đã xảy ra lỗi khi lấy danh sách tiếp thị giới thiệu" },
      { status: 500 }
    );
  }
}
