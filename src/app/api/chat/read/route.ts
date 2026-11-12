// ============================================================
// app/api/chat/read/route.ts
// API Khách hàng đánh dấu đã đọc toàn bộ tin nhắn trong phiên (Phase 18)
// ============================================================

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const { sessionId } = await req.json();

    if (!sessionId) {
      return NextResponse.json(
        { success: false, message: "Thiếu sessionId." },
        { status: 400 }
      );
    }

    await prisma.chatSession.update({
      where: { id: sessionId },
      data: { unreadCustomerCount: 0 },
    });

    return NextResponse.json({
      success: true,
      message: "Đã đánh dấu đọc tin nhắn thành công.",
    });
  } catch (error) {
    console.error("Lỗi khi đánh dấu đọc tin nhắn:", error);
    return NextResponse.json(
      { success: false, message: "Không thể đánh dấu đọc tin nhắn." },
      { status: 500 }
    );
  }
}
