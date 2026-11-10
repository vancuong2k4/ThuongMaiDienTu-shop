// ============================================================
// app/api/admin/flash-sales/route.ts
// REST API Danh Sách & Tạo Mới Chiến Dịch Flash Sale Admin CMS (Stage 9.2)
// ============================================================

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { flashSaleCreateSchema } from "@/lib/validations/flash-sale";
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
    const status = searchParams.get("status") || "ALL"; // ALL | ACTIVE | UPCOMING | ENDED
    const sortBy = searchParams.get("sortBy") || "createdAt_desc";

    const now = new Date();

    // ── Xây dựng điều kiện lọc ──────────────────────────────────
    const where: Prisma.FlashSaleWhereInput = {};

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ];
    }

    if (status === "ACTIVE") {
      where.isActive = true;
      where.startTime = { lte: now };
      where.endTime = { gte: now };
    } else if (status === "UPCOMING") {
      where.startTime = { gt: now };
    } else if (status === "ENDED") {
      where.endTime = { lt: now };
    }

    // ── Xây dựng sắp xếp ────────────────────────────────────────
    let orderBy: Prisma.FlashSaleOrderByWithRelationInput = { createdAt: "desc" };
    if (sortBy === "startTime_asc") orderBy = { startTime: "asc" };
    if (sortBy === "startTime_desc") orderBy = { startTime: "desc" };
    if (sortBy === "endTime_asc") orderBy = { endTime: "asc" };

    // ── Truy vấn dữ liệu song song ──────────────────────────────
    const [total, campaignsRaw, allCampaignsForStats] = await Promise.all([
      prisma.flashSale.count({ where }),
      prisma.flashSale.findMany({
        where,
        skip,
        take: limit,
        orderBy,
        include: {
          items: {
            select: {
              id: true,
              salePrice: true,
              quantity: true,
              soldCount: true,
            },
          },
        },
      }),
      // Lấy toàn bộ để tính thống kê KPI
      prisma.flashSale.findMany({
        include: {
          items: {
            select: {
              salePrice: true,
              quantity: true,
              soldCount: true,
            },
          },
        },
      }),
    ]);

    // ── Tính toán số liệu KPI toàn hệ thống ──────────────────────
    let activeCampaignsCount = 0;
    let upcomingCampaignsCount = 0;
    let endedCampaignsCount = 0;
    let totalItemsAllocated = 0;
    let totalItemsSold = 0;
    let totalRevenueFromFlashSale = 0;

    allCampaignsForStats.forEach((c) => {
      const isAct = c.isActive && c.startTime <= now && c.endTime >= now;
      const isUp = c.startTime > now;
      const isEnd = c.endTime < now;

      if (isAct) activeCampaignsCount++;
      else if (isUp) upcomingCampaignsCount++;
      else if (isEnd) endedCampaignsCount++;

      c.items.forEach((item) => {
        totalItemsAllocated += item.quantity;
        totalItemsSold += item.soldCount;
        totalRevenueFromFlashSale += item.soldCount * Number(item.salePrice);
      });
    });

    const averageSoldRate =
      totalItemsAllocated > 0
        ? Math.round((totalItemsSold / totalItemsAllocated) * 100)
        : 0;

    // ── Serialize campaigns ─────────────────────────────────────
    const campaigns = campaignsRaw.map((c) => {
      const isCurrentlyActive =
        c.isActive && c.startTime <= now && c.endTime >= now;
      const isUpcoming = c.startTime > now;
      const isEnded = c.endTime < now;

      const campaignStatus = isCurrentlyActive
        ? "ACTIVE"
        : isUpcoming
        ? "UPCOMING"
        : "ENDED";

      const totalQuantity = c.items.reduce((acc, i) => acc + i.quantity, 0);
      const totalSold = c.items.reduce((acc, i) => acc + i.soldCount, 0);
      const revenue = c.items.reduce(
        (acc, i) => acc + i.soldCount * Number(i.salePrice),
        0
      );

      return {
        id: c.id,
        name: c.name,
        description: c.description,
        bannerImage: c.bannerImage,
        startTime: c.startTime.toISOString(),
        endTime: c.endTime.toISOString(),
        isActive: c.isActive,
        createdAt: c.createdAt.toISOString(),
        updatedAt: c.updatedAt.toISOString(),
        status: campaignStatus,
        itemCount: c.items.length,
        totalQuantity,
        totalSold,
        revenue,
        soldPercentage:
          totalQuantity > 0 ? Math.round((totalSold / totalQuantity) * 100) : 0,
      };
    });

    return NextResponse.json({
      success: true,
      data: campaigns,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit) || 1,
      },
      stats: {
        total: allCampaignsForStats.length,
        active: activeCampaignsCount,
        upcoming: upcomingCampaignsCount,
        ended: endedCampaignsCount,
        totalSold: totalItemsSold,
        totalRevenue: totalRevenueFromFlashSale,
        averageSoldRate,
      },
    });
  } catch (err: unknown) {
    console.error("GET /api/admin/flash-sales error:", err);
    return NextResponse.json(
      { error: "Lỗi hệ thống khi tải danh sách Flash Sale" },
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
    const validation = flashSaleCreateSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.issues[0]?.message || "Dữ liệu không hợp lệ" },
        { status: 400 }
      );
    }

    const { name, description, bannerImage, startTime, endTime, isActive } =
      validation.data;

    const campaign = await prisma.flashSale.create({
      data: {
        name,
        description: description || null,
        bannerImage: bannerImage || null,
        startTime,
        endTime,
        isActive: isActive ?? true,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Tạo chiến dịch Flash Sale thành công!",
        data: campaign,
      },
      { status: 201 }
    );
  } catch (err: unknown) {
    console.error("POST /api/admin/flash-sales error:", err);
    return NextResponse.json(
      { error: "Lỗi hệ thống khi tạo chiến dịch Flash Sale" },
      { status: 500 }
    );
  }
}
