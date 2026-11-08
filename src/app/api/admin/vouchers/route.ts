// ============================================================
// app/api/admin/vouchers/route.ts
// API Danh Sách & Tạo Mới Voucher Admin CMS
// ============================================================

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { voucherFormSchema } from "@/lib/validations/voucher";
import { VoucherType, Prisma } from "@prisma/client";

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

    const search = searchParams.get("search")?.trim().toUpperCase() || "";
    const type = searchParams.get("type") || "ALL";
    const status = searchParams.get("status") || "ALL";

    const now = new Date();

    // ── Xây dựng điều kiện lọc ──────────────────────────────────
    const where: Prisma.VoucherWhereInput = {};

    if (search) {
      where.code = { contains: search, mode: "insensitive" };
    }

    if (type !== "ALL" && Object.values(VoucherType).includes(type as VoucherType)) {
      where.type = type as VoucherType;
    }

    if (status === "ACTIVE") {
      where.isActive = true;
      where.startDate = { lte: now };
      where.endDate = { gte: now };
    } else if (status === "UPCOMING") {
      where.isActive = true;
      where.startDate = { gt: now };
    } else if (status === "EXPIRED") {
      where.endDate = { lt: now };
    } else if (status === "DISABLED") {
      where.isActive = false;
    }

    // ── Truy vấn song song dữ liệu & thống kê ────────────────────
    const [vouchers, totalCount, stats, discountAgg] = await Promise.all([
      prisma.voucher.findMany({
        where,
        skip,
        take: limit,
        orderBy: [{ createdAt: "desc" }],
        include: {
          _count: {
            select: { orders: true },
          },
        },
      }),
      prisma.voucher.count({ where }),
      // Thống kê nhanh toàn hệ thống
      Promise.all([
        prisma.voucher.count(),
        prisma.voucher.count({
          where: {
            isActive: true,
            startDate: { lte: now },
            endDate: { gte: now },
          },
        }),
        prisma.voucher.count({
          where: {
            isActive: true,
            startDate: { gt: now },
          },
        }),
        prisma.voucher.count({
          where: {
            endDate: { lt: now },
          },
        }),
        prisma.voucher.aggregate({
          _sum: { usedCount: true },
        }),
      ]),
      prisma.order.aggregate({
        _sum: { discountAmount: true },
        where: {
          voucherId: { not: null },
          orderStatus: { not: "CANCELLED" },
        },
      }),
    ]);

    const [totalAll, activeCount, upcomingCount, expiredCount, usedCountAgg] = stats;

    // ── Serialize Decimal & Gắn nhãn lifecycleStatus ─────────────
    const formattedVouchers = vouchers.map((v) => {
      let lifecycleStatus: "ACTIVE" | "UPCOMING" | "EXPIRED" | "DEPLETED" | "DISABLED" = "ACTIVE";
      if (!v.isActive) {
        lifecycleStatus = "DISABLED";
      } else if (now < v.startDate) {
        lifecycleStatus = "UPCOMING";
      } else if (now > v.endDate) {
        lifecycleStatus = "EXPIRED";
      } else if (v.usageLimit !== null && v.usedCount >= v.usageLimit) {
        lifecycleStatus = "DEPLETED";
      }

      return {
        id: v.id,
        code: v.code,
        type: v.type,
        value: Number(v.value),
        minOrderAmount: v.minOrderAmount ? Number(v.minOrderAmount) : null,
        maxDiscount: v.maxDiscount ? Number(v.maxDiscount) : null,
        usageLimit: v.usageLimit,
        usedCount: v.usedCount,
        userLimit: v.userLimit,
        startDate: v.startDate.toISOString(),
        endDate: v.endDate.toISOString(),
        isActive: v.isActive,
        createdAt: v.createdAt.toISOString(),
        orderCount: v._count.orders,
        lifecycleStatus,
      };
    });

    return NextResponse.json({
      success: true,
      vouchers: formattedVouchers,
      pagination: {
        page,
        limit,
        total: totalCount,
        totalPages: Math.ceil(totalCount / limit),
      },
      stats: {
        total: totalAll,
        active: activeCount,
        upcoming: upcomingCount,
        expired: expiredCount,
        totalUsed: usedCountAgg._sum.usedCount || 0,
        totalDiscountGiven: Number(discountAgg._sum.discountAmount || 0),
      },
    });
  } catch (error) {
    console.error("GET /api/admin/vouchers error:", error);
    return NextResponse.json(
      { error: "Đã xảy ra lỗi khi lấy danh sách voucher" },
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
    const result = voucherFormSchema.safeParse(body);

    if (!result.success) {
      const firstError = result.error.issues[0]?.message || "Dữ liệu không hợp lệ";
      return NextResponse.json({ error: firstError }, { status: 400 });
    }

    const {
      code,
      type,
      value,
      minOrderAmount,
      maxDiscount,
      usageLimit,
      userLimit,
      startDate,
      endDate,
      isActive,
    } = result.data;

    // Kiểm tra trùng lặp mã code
    const existing = await prisma.voucher.findUnique({
      where: { code },
    });

    if (existing) {
      return NextResponse.json(
        { error: `Mã voucher "${code}" đã tồn tại. Vui lòng chọn mã khác.` },
        { status: 400 }
      );
    }

    const voucher = await prisma.voucher.create({
      data: {
        code,
        type,
        value: new Prisma.Decimal(value),
        minOrderAmount: minOrderAmount ? new Prisma.Decimal(minOrderAmount) : null,
        maxDiscount: maxDiscount ? new Prisma.Decimal(maxDiscount) : null,
        usageLimit: usageLimit ?? null,
        userLimit: userLimit ?? 1,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        isActive,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: `Đã tạo voucher ${voucher.code} thành công`,
        voucher: {
          id: voucher.id,
          code: voucher.code,
          type: voucher.type,
          value: Number(voucher.value),
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /api/admin/vouchers error:", error);
    return NextResponse.json(
      { error: "Đã xảy ra lỗi khi tạo mã voucher mới" },
      { status: 500 }
    );
  }
}
