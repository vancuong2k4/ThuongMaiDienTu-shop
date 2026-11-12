// ============================================================
// app/api/chat/session/route.ts
// Public API Lấy hoặc Tạo phiên chat trực tuyến cho khách hàng (Phase 18)
// ============================================================

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { createChatSessionSchema } from "@/lib/validations/chat";
import { getOrCreateChatSession } from "@/lib/chat";
import { ChatSessionStatus } from "@prisma/client";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    const { searchParams } = new URL(req.url);
    const guestSessionId = searchParams.get("guestSessionId");

    const userId = session?.user?.id;

    if (!userId && !guestSessionId) {
      return NextResponse.json({
        success: true,
        data: null,
      });
    }

    const chatSession = await prisma.chatSession.findFirst({
      where: {
        OR: [
          ...(userId ? [{ userId }] : []),
          ...(guestSessionId ? [{ guestSessionId }] : []),
        ],
        status: { in: [ChatSessionStatus.ACTIVE, ChatSessionStatus.PENDING_PHARMACIST] },
      },
      include: {
        messages: {
          orderBy: { createdAt: "asc" },
          take: 50,
        },
      },
    });

    return NextResponse.json({
      success: true,
      data: chatSession,
    });
  } catch (error) {
    console.error("Lỗi khi lấy phiên chat:", error);
    return NextResponse.json(
      { success: false, message: "Không thể lấy thông tin phiên chat." },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    const body = await req.json();

    const parsed = createChatSessionSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Dữ liệu bắt đầu trò chuyện không hợp lệ.",
          errors: parsed.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const {
      customerName,
      customerPhone,
      customerEmail,
      initialMessage,
      guestSessionId,
    } = parsed.data;

    const chatSession = await getOrCreateChatSession({
      userId: session?.user?.id || null,
      guestSessionId: guestSessionId || null,
      customerName,
      customerPhone,
      customerEmail,
      initialMessage,
    });

    return NextResponse.json({
      success: true,
      message: "Bắt đầu cuộc trò chuyện thành công!",
      data: chatSession,
    });
  } catch (error: any) {
    console.error("Lỗi khi tạo phiên chat:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Không thể tạo phiên chat." },
      { status: 500 }
    );
  }
}
