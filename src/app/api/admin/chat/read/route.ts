// ============================================================
// app/api/admin/chat/read/route.ts
// Admin API Đánh dấu đã đọc tin nhắn trong phiên chat (Phase 18)
// ============================================================

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (session?.user?.role !== "ADMIN") {
      return NextResponse.json(
        { success: false, message: "Không có quyền truy cập." },
        { status: 403 }
      );
    }

    const { sessionId } = await req.json();

    if (!sessionId) {
      return NextResponse.json(
        { success: false, message: "Thiếu sessionId." },
        { status: 400 }
      );
    }

    await prisma.chatSession.update({
      where: { id: sessionId },
      data: { unreadAdminCount: 0 },
    });

    return NextResponse.json({
      success: true,
      message: "Đã đánh dấu đọc tin nhắn thành công.",
    });
  } catch (error) {
    console.error("Lỗi khi admin đánh dấu đọc tin nhắn:", error);
    return NextResponse.json(
      { success: false, message: "Không thể đánh dấu đọc tin nhắn." },
      { status: 500 }
    );
  }
}
