// ============================================================
// app/api/notifications/read-all/route.ts
// API Đánh Dấu Tất Cả Thông Báo Là Đã Đọc 1-Chạm (Stage 11.2)
// ============================================================

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;

    const result = await prisma.notification.updateMany({
      where: {
        userId,
        isRead: false,
      },
      data: {
        isRead: true,
        readAt: new Date(),
      },
    });

    return NextResponse.json({
      success: true,
      message: `Đã đánh dấu ${result.count} thông báo là đã đọc`,
      count: result.count,
    });
  } catch (error) {
    console.error("POST /api/notifications/read-all error:", error);
    return NextResponse.json(
      { error: "Không thể đánh dấu tất cả thông báo" },
      { status: 500 }
    );
  }
}
