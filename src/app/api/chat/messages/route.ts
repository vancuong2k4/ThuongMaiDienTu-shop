// ============================================================
// app/api/chat/messages/route.ts
// Public API Lấy và Gửi tin nhắn trong phiên chat (Phase 18)
// ============================================================

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendChatMessageSchema } from "@/lib/validations/chat";
import { ChatSenderRole } from "@prisma/client";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const sessionId = searchParams.get("sessionId");
    const since = searchParams.get("since");

    if (!sessionId) {
      return NextResponse.json(
        { success: false, message: "Thiếu sessionId." },
        { status: 400 }
      );
    }

    const where: any = { sessionId };
    if (since) {
      where.createdAt = { gt: new Date(since) };
    }

    const messages = await prisma.chatMessage.findMany({
      where,
      orderBy: { createdAt: "asc" },
      take: 100,
    });

    return NextResponse.json({
      success: true,
      data: messages,
    });
  } catch (error) {
    console.error("Lỗi khi tải tin nhắn chat:", error);
    return NextResponse.json(
      { success: false, message: "Không thể tải tin nhắn chat." },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const parsed = sendChatMessageSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Dữ liệu tin nhắn không hợp lệ.",
          errors: parsed.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const { sessionId, content, messageType, mediaUrl, metadata } = parsed.data;

    // Kiểm tra phiên chat tồn tại
    const session = await prisma.chatSession.findUnique({
      where: { id: sessionId },
    });

    if (!session) {
      return NextResponse.json(
        { success: false, message: "Phiên trò chuyện không tồn tại." },
        { status: 404 }
      );
    }

    // Tạo tin nhắn mới từ khách hàng
    const message = await prisma.chatMessage.create({
      data: {
        sessionId,
        senderRole: ChatSenderRole.CUSTOMER,
        senderName: session.customerName,
        messageType,
        content,
        mediaUrl: mediaUrl || null,
        metadata: metadata || null,
      },
    });

    // Cập nhật phiên chat: tăng unreadAdminCount, cập nhật lastMessage
    await prisma.chatSession.update({
      where: { id: sessionId },
      data: {
        lastMessageText: content,
        lastMessageAt: new Date(),
        unreadAdminCount: { increment: 1 },
      },
    });

    return NextResponse.json({
      success: true,
      data: message,
    });
  } catch (error: any) {
    console.error("Lỗi khi gửi tin nhắn chat:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Không thể gửi tin nhắn." },
      { status: 500 }
    );
  }
}
