// ============================================================
// components/storefront/chat/types.ts
// Kiểu dữ liệu Live Chat Widget Khách Hàng Storefront (Phase 18)
// ============================================================

import {
  ChatSenderRole,
  ChatSessionStatus,
  ChatMessageType,
} from "@prisma/client";

export interface StorefrontChatMessage {
  id: string;
  sessionId: string;
  senderRole: ChatSenderRole;
  senderName: string;
  messageType: ChatMessageType;
  content: string;
  mediaUrl: string | null;
  metadata?: any;
  createdAt: string;
}

export interface StorefrontChatSession {
  id: string;
  sessionCode: string;
  customerName: string;
  customerPhone?: string | null;
  customerEmail?: string | null;
  status: ChatSessionStatus;
  assignedTo?: string | null;
  unreadCustomerCount: number;
  lastMessageText?: string | null;
  lastMessageAt: string;
  messages: StorefrontChatMessage[];
}
