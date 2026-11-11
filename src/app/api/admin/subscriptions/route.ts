// ============================================================
// app/api/admin/subscriptions/route.ts
// REST API Quản Trị Gói Định Kỳ Admin CMS (Stage 13.2)
// ============================================================

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { querySubscriptionsSchema } from "@/lib/validations/subscription";
import type { Prisma, SubscriptionFrequency, SubscriptionStatus } from "@prisma/client";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const parsed = querySubscriptionsSchema.safeParse({
      page: searchParams.get("page") || 1,
      limit: searchParams.get("limit") || 15,
      status: searchParams.get("status") || "ALL",
      frequency: searchParams.get("frequency") || "ALL",
      search: searchParams.get("search") || undefined,
    });

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Tham số truy vấn không hợp lệ" },
        { status: 400 }
      );
    }

    const { page, limit, status, frequency, search } = parsed.data;
    const skip = (page - 1) * limit;

    const where: Prisma.SubscriptionWhereInput = {};

    if (status !== "ALL") {
      where.status = status as SubscriptionStatus;
    }

    if (frequency !== "ALL") {
      where.frequency = frequency as SubscriptionFrequency;
    }

    if (search && search.trim()) {
      where.OR = [
        { subscriptionNumber: { contains: search.trim(), mode: "insensitive" } },
        { recipientName: { contains: search.trim(), mode: "insensitive" } },
        { recipientPhone: { contains: search.trim(), mode: "insensitive" } },
        { user: { name: { contains: search.trim(), mode: "insensitive" } } },
        { user: { email: { contains: search.trim(), mode: "insensitive" } } },
        {
          items: {
            some: {
              productName: { contains: search.trim(), mode: "insensitive" },
            },
          },
        },
      ];
    }

    const [totalCount, subscriptionsRaw, activeCount, pausedCount, allActiveForMRR, totalOrdersGenerated] =
      await Promise.all([
        prisma.subscription.count({ where }),
        prisma.subscription.findMany({
          where,
          orderBy: { createdAt: "desc" },
          take: limit,
          skip,
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                phone: true,
                avatar: true,
                membershipTier: true,
              },
            },
            items: true,
            _count: {
              select: { orders: true },
            },
          },
        }),
        prisma.subscription.count({
          where: { status: "ACTIVE" },
        }),
        prisma.subscription.count({
          where: { status: "PAUSED" },
        }),
        // Truy vấn tất cả gói ACTIVE để tính doanh thu định kỳ ước tính (MRR)
        prisma.subscription.findMany({
          where: { status: "ACTIVE" },
          select: {
            frequency: true,
            items: {
              select: {
                price: true,
                quantity: true,
              },
            },
          },
        }),
        prisma.order.count({
          where: { subscriptionId: { not: null } },
        }),
      ]);

    // Tính toán ước tính MRR (Monthly Recurring Revenue) chuẩn hóa theo tháng
    let estimatedMRR = 0;
    allActiveForMRR.forEach((sub) => {
      let cycleTotal = 0;
      sub.items.forEach((item) => {
        cycleTotal += Number(item.price) * item.quantity;
      });

      switch (sub.frequency) {
        case "EVERY_2_WEEKS":
          estimatedMRR += cycleTotal * 2;
          break;
        case "EVERY_1_MONTH":
          estimatedMRR += cycleTotal * 1;
          break;
        case "EVERY_2_MONTHS":
          estimatedMRR += Math.round(cycleTotal / 2);
          break;
        case "EVERY_3_MONTHS":
          estimatedMRR += Math.round(cycleTotal / 3);
          break;
      }
    });

    const totalSystemSubscriptions = await prisma.subscription.count();

    const stats = {
      totalSubscriptions: totalSystemSubscriptions,
      activeCount,
      pausedCount,
      estimatedMRR,
      totalOrdersGenerated,
    };

    const formattedSubscriptions = subscriptionsRaw.map((sub) => {
      let cycleTotal = 0;
      let cycleOriginal = 0;

      sub.items.forEach((i) => {
        cycleTotal += Number(i.price) * i.quantity;
        cycleOriginal += Number(i.originalPrice) * i.quantity;
      });

      return {
        id: sub.id,
        subscriptionNumber: sub.subscriptionNumber,
        user: {
          id: sub.user.id,
          name: sub.user.name || "Khách hàng",
          email: sub.user.email,
          phone: sub.user.phone,
          avatar: sub.user.avatar,
          membershipTier: sub.user.membershipTier,
        },
        frequency: sub.frequency,
        status: sub.status,
        discountPercent: sub.discountPercent,
        startDate: sub.startDate.toISOString(),
        nextDeliveryDate: sub.nextDeliveryDate.toISOString(),
        lastDeliveryDate: sub.lastDeliveryDate ? sub.lastDeliveryDate.toISOString() : null,
        totalCyclesDelivered: sub.totalCyclesDelivered,
        ordersCount: sub._count.orders,
        recipientName: sub.recipientName,
        recipientPhone: sub.recipientPhone,
        shippingAddress: sub.shippingAddress,
        paymentMethod: sub.paymentMethod,
        note: sub.note,
        cycleTotal,
        cycleOriginal,
        items: sub.items.map((i) => ({
          id: i.id,
          variantId: i.variantId,
          productName: i.productName,
          variantName: i.variantName,
          sku: i.sku,
          originalPrice: Number(i.originalPrice),
          price: Number(i.price),
          quantity: i.quantity,
          image: i.image,
        })),
        createdAt: sub.createdAt.toISOString(),
      };
    });

    return NextResponse.json({
      success: true,
      subscriptions: formattedSubscriptions,
      stats,
      pagination: {
        page,
        limit,
        total: totalCount,
        totalPages: Math.ceil(totalCount / limit) || 1,
      },
    });
  } catch (error) {
    console.error("GET /api/admin/subscriptions error:", error);
    return NextResponse.json(
      { error: "Đã xảy ra lỗi khi lấy danh sách đơn định kỳ" },
      { status: 500 }
    );
  }
}
