// ============================================================
// app/(admin)/admin/chat-cskh/page.tsx
// Trang Trung Tâm Live Chat & Tư Vấn Dược Sĩ Admin CMS (Phase 18 - Stage 18.3)
// ============================================================

import React from "react";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { calculateChatKPIs } from "@/lib/chat";
import { ChatCenterManager } from "@/components/admin/chat/ChatCenterManager";
import type {
  AdminChatSession,
  AdminChatMessage,
} from "@/components/admin/chat/types";

export const metadata: Metadata = {
  title: "Trung Tâm Live Chat & Tư Vấn Dược Sĩ | Admin CMS THUYNGA Shop",
  description:
    "Hệ thống tiếp nhận và phản hồi tin nhắn khách hàng đa kênh theo thời gian thực, tích hợp Dược sĩ tư vấn y khoa và CSKH.",
};

export const revalidate = 0;

export default async function AdminChatPage() {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") {
    redirect("/dang-nhap?callbackUrl=/admin/chat-cskh");
  }

  const [stats, sessions] = await Promise.all([
    calculateChatKPIs(),
    prisma.chatSession.findMany({
      orderBy: { lastMessageAt: "desc" },
      take: 30,
      include: {
        messages: {
          orderBy: { createdAt: "asc" },
        },
      },
    }),
  ]);

  const formattedSessions: AdminChatSession[] = sessions.map((s) => ({
    id: s.id,
    sessionCode: s.sessionCode,
    userId: s.userId,
    guestSessionId: s.guestSessionId,
    customerName: s.customerName,
    customerPhone: s.customerPhone,
    customerEmail: s.customerEmail,
    status: s.status,
    assignedTo: s.assignedTo,
    unreadCustomerCount: s.unreadCustomerCount,
    unreadAdminCount: s.unreadAdminCount,
    lastMessageText: s.lastMessageText,
    lastMessageAt: s.lastMessageAt.toISOString(),
    createdAt: s.createdAt.toISOString(),
    updatedAt: s.updatedAt.toISOString(),
    messages: s.messages.map((m) => ({
      id: m.id,
      sessionId: m.sessionId,
      senderRole: m.senderRole,
      senderName: m.senderName,
      messageType: m.messageType,
      content: m.content,
      mediaUrl: m.mediaUrl,
      metadata: m.metadata,
      isRead: m.isRead,
      createdAt: m.createdAt.toISOString(),
    })),
  }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Trung Tâm Live Chat & Tư Vấn Dược Sĩ
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Tiếp nhận câu hỏi về HSD hàng bay Air, tư vấn phác đồ dinh dưỡng và xử lý yêu cầu khách hàng đa kênh theo thời gian thực.
          </p>
        </div>
      </div>

      {/* Main Split Chat Center */}
      <ChatCenterManager
        initialStats={stats}
        initialSessions={formattedSessions}
      />
    </div>
  );
}
