// ============================================================
// app/api/admin/loyalty/route.ts
// REST API Quản Trị Sổ Cái Tích Điểm & Thống Kê Thành Viên (Stage 10.2)
// ============================================================

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { LoyaltyType, MembershipTier, Prisma } from "@prisma/client";

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
    const limit = Math.max(1, Math.min(100, parseInt(searchParams.get("limit") || "15")));
    const skip = (page - 1) * limit;

    const search = searchParams.get("search")?.trim() || "";
    const type = searchParams.get("type") || "ALL";
    const tier = searchParams.get("tier") || "ALL";

    // ── Điều kiện lọc ───────────────────────────────────────────
    const where: Prisma.LoyaltyTransactionWhereInput = {};

    if (search) {
      where.OR = [
        { description: { contains: search, mode: "insensitive" } },
        { user: { name: { contains: search, mode: "insensitive" } } },
        { user: { email: { contains: search, mode: "insensitive" } } },
        { user: { phone: { contains: search, mode: "insensitive" } } },
      ];
    }

    if (type !== "ALL" && Object.values(LoyaltyType).includes(type as LoyaltyType)) {
      where.type = type as LoyaltyType;
    }

    if (tier !== "ALL" && Object.values(MembershipTier).includes(tier as MembershipTier)) {
      where.user = {
        is: {
          membershipTier: tier as MembershipTier,
        },
      };
    }

    // ── Truy vấn song song ──────────────────────────────────────
    const [totalTransactions, transactionsRaw, usersForStats] =
      await Promise.all([
        prisma.loyaltyTransaction.count({ where }),
        prisma.loyaltyTransaction.findMany({
          where,
          skip,
          take: limit,
          orderBy: { createdAt: "desc" },
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                phone: true,
                avatar: true,
                membershipTier: true,
                loyaltyPoints: true,
              },
            },
            order: {
              select: {
                id: true,
                orderNumber: true,
                total: true,
              },
            },
          },
        }),
        // Lấy thống kê thành viên
        prisma.user.findMany({
          where: { role: "CUSTOMER" },
          select: {
            loyaltyPoints: true,
            totalPointsEarned: true,
            membershipTier: true,
          },
        }),
      ]);

    // ── Tính toán số liệu KPI ───────────────────────────────────
    let totalCirculatingPoints = 0;
    let totalLifetimePointsEarned = 0;
    let countBronze = 0;
    let countSilver = 0;
    let countGold = 0;
    let countDiamond = 0;

    usersForStats.forEach((u) => {
      totalCirculatingPoints += u.loyaltyPoints;
      totalLifetimePointsEarned += u.totalPointsEarned;
      if (u.membershipTier === "BRONZE") countBronze++;
      else if (u.membershipTier === "SILVER") countSilver++;
      else if (u.membershipTier === "GOLD") countGold++;
      else if (u.membershipTier === "DIAMOND") countDiamond++;
    });

    const totalRedeemedPoints = Math.max(
      0,
      totalLifetimePointsEarned - totalCirculatingPoints
    );

    // ── Serialize transactions ──────────────────────────────────
    const transactions = transactionsRaw.map((t) => ({
      id: t.id,
      points: t.points,
      type: t.type,
      description: t.description,
      balanceAfter: t.balanceAfter,
      createdAt: t.createdAt.toISOString(),
      user: {
        id: t.user.id,
        name: t.user.name || "Khách hàng",
        email: t.user.email,
        phone: t.user.phone,
        avatar: t.user.avatar,
        membershipTier: t.user.membershipTier,
        currentPoints: t.user.loyaltyPoints,
      },
      order: t.order
        ? {
            id: t.order.id,
            orderNumber: t.order.orderNumber,
            total: Number(t.order.total),
          }
        : null,
    }));

    return NextResponse.json({
      success: true,
      data: transactions,
      pagination: {
        page,
        limit,
        total: totalTransactions,
        totalPages: Math.ceil(totalTransactions / limit) || 1,
      },
      stats: {
        totalCustomers: usersForStats.length,
        totalCirculatingPoints,
        totalLifetimePointsEarned,
        totalRedeemedPoints,
        monetaryEquivalentValue: totalCirculatingPoints * 100, // 1 điểm = 100₫
        tierDistribution: {
          bronze: countBronze,
          silver: countSilver,
          gold: countGold,
          diamond: countDiamond,
        },
      },
    });
  } catch (err: unknown) {
    console.error("GET /api/admin/loyalty error:", err);
    return NextResponse.json(
      { error: "Lỗi hệ thống khi tải sổ cái tích điểm" },
      { status: 500 }
    );
  }
}
