// ============================================================
// app/api/admin/chat/messages/route.ts
// Admin API Dược sĩ / Chuyên viên CSKH gửi tin nhắn phản hồi (Phase 18)
// ============================================================

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { sendChatMessageSchema } from "@/lib/validations/chat";
import { ChatSenderRole } from "@prisma/client";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (session?.user?.role !== "ADMIN") {
      return NextResponse.json(
        { success: false, message: "Không có quyền thực hiện hành động này." },
        { status: 403 }
      );
    }

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
    const role = (body.senderRole as ChatSenderRole) || ChatSenderRole.SUPPORT_AGENT;
    const senderName =
      body.senderName ||
      (role === ChatSenderRole.PHARMACIST ? "Dược sĩ THUYNGA" : "CSKH THUYNGA");

    // Tạo tin nhắn mới từ Admin / Dược sĩ
    const message = await prisma.chatMessage.create({
      data: {
        sessionId,
        senderRole: role,
        senderName,
        messageType,
        content,
        mediaUrl: mediaUrl || null,
        metadata: metadata || null,
      },
    });

    // Cập nhật phiên chat: tăng unreadCustomerCount, cập nhật lastMessage
    await prisma.chatSession.update({
      where: { id: sessionId },
      data: {
        lastMessageText: content,
        lastMessageAt: new Date(),
        unreadCustomerCount: { increment: 1 },
      },
    });

    return NextResponse.json({
      success: true,
      data: message,
    });
  } catch (error: any) {
    console.error("Lỗi khi admin gửi tin nhắn:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Không thể gửi tin nhắn." },
      { status: 500 }
    );
  }
}
