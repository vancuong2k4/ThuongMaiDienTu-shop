// ============================================================
// app/api/notifications/route.ts
// API Lấy Danh Sách Thông Báo & Số Lượng Chưa Đọc (Stage 11.2)
// ============================================================

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { queryNotificationsSchema } from "@/lib/validations/notification";
import type { NotificationType, Prisma } from "@prisma/client";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    const { searchParams } = new URL(req.url);

    const parsedQuery = queryNotificationsSchema.safeParse({
      page: searchParams.get("page") || 1,
      limit: searchParams.get("limit") || 10,
      type: searchParams.get("type") || "ALL",
      isRead: searchParams.get("isRead") || "ALL",
    });

    if (!parsedQuery.success) {
      return NextResponse.json(
        { error: "Tham số truy vấn không hợp lệ" },
        { status: 400 }
      );
    }

    const { page, limit, type, isRead } = parsedQuery.data;
    const skip = (page - 1) * limit;

    // Xây dựng điều kiện lọc
    const where: Prisma.NotificationWhereInput = {
      userId,
    };

    if (type !== "ALL") {
      where.type = type as NotificationType;
    }

    if (isRead === "UNREAD") {
      where.isRead = false;
    } else if (isRead === "READ") {
      where.isRead = true;
    }

    const [totalCount, unreadCount, notifications] = await Promise.all([
      prisma.notification.count({ where }),
      prisma.notification.count({
        where: { userId, isRead: false },
      }),
      prisma.notification.findMany({
        where,
        orderBy: { createdAt: "desc" },
        take: limit,
        skip,
      }),
    ]);

    return NextResponse.json({
      success: true,
      notifications,
      unreadCount,
      pagination: {
        page,
        limit,
        total: totalCount,
        totalPages: Math.ceil(totalCount / limit) || 1,
      },
    });
  } catch (error) {
    console.error("GET /api/notifications error:", error);
    return NextResponse.json(
      { error: "Không thể lấy danh sách thông báo" },
      { status: 500 }
    );
  }
}
