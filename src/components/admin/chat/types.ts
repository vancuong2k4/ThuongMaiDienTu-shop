// ============================================================
// components/admin/chat/types.ts
// Kiểu dữ liệu Trung Tâm Live Chat & Dược Sĩ Admin CMS (Phase 18)
// ============================================================

import {
  ChatSenderRole,
  ChatSessionStatus,
  ChatMessageType,
} from "@prisma/client";

export interface AdminChatMessage {
  id: string;
  sessionId: string;
  senderRole: ChatSenderRole;
  senderName: string;
  messageType: ChatMessageType;
  content: string;
  mediaUrl: string | null;
  metadata?: any;
  isRead: boolean;
  createdAt: string;
}

export interface AdminChatSession {
  id: string;
  sessionCode: string;
  userId: string | null;
  guestSessionId: string | null;
  customerName: string;
  customerPhone: string | null;
  customerEmail: string | null;
  status: ChatSessionStatus;
  assignedTo: string | null;
  unreadCustomerCount: number;
  unreadAdminCount: number;
  lastMessageText: string | null;
  lastMessageAt: string;
  createdAt: string;
  updatedAt: string;
  messages?: AdminChatMessage[];
  _count?: {
    messages: number;
  };
}

export interface ChatKPIs {
  totalSessions: number;
  activeSessions: number;
  pendingPharmacistSessions: number;
  resolvedSessions: number;
  totalMessages: number;
  avgResponseMinutes: number;
}
