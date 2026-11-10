// ============================================================
// app/api/notifications/[id]/read/route.ts
// API Đánh Dấu Thông Báo Đã Đọc (Stage 11.2)
// ============================================================

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function PATCH(req: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const userId = session.user.id;

    // Kiểm tra thông báo có thuộc về người dùng hiện tại không
    const notification = await prisma.notification.findFirst({
      where: { id, userId },
    });

    if (!notification) {
      return NextResponse.json(
        { error: "Thông báo không tồn tại hoặc không thuộc quyền sở hữu" },
        { status: 404 }
      );
    }

    const updated = await prisma.notification.update({
      where: { id },
      data: {
        isRead: true,
        readAt: new Date(),
      },
    });

    // Tính lại số thông báo chưa đọc
    const remainingUnread = await prisma.notification.count({
      where: { userId, isRead: false },
    });

    return NextResponse.json({
      success: true,
      notification: updated,
      remainingUnread,
    });
  } catch (error) {
    console.error("PATCH /api/notifications/[id]/read error:", error);
    return NextResponse.json(
      { error: "Không thể cập nhật trạng thái thông báo" },
      { status: 500 }
    );
  }
}
