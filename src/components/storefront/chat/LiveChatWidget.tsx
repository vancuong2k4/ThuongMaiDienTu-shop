"use client";

// ============================================================
// components/storefront/chat/LiveChatWidget.tsx
// Widget Hợp Nhất Live Chat Nổi Góc Màn Hình Khách Hàng (Phase 18)
// ============================================================

import React, { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { LiveChatButton } from "./LiveChatButton";
import { LiveChatWindow } from "./LiveChatWindow";
import { StorefrontChatSession, StorefrontChatMessage } from "./types";

export const LiveChatWidget: React.FC = () => {
  const { data: authSession } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const [session, setSession] = useState<StorefrontChatSession | null>(null);
  const [isStarting, setIsStarting] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [guestSessionId, setGuestSessionId] = useState<string>("");

  // Khởi tạo hoặc lấy guestSessionId từ localStorage
  useEffect(() => {
    try {
      let gid = localStorage.getItem("thuynga_guest_session_id");
      if (!gid) {
        gid = "guest_" + Math.random().toString(36).substring(2, 12) + Date.now().toString(36);
        localStorage.setItem("thuynga_guest_session_id", gid);
      }
      setGuestSessionId(gid);
    } catch {
      // fallback nếu localStorage bị chặn
      setGuestSessionId("guest_fallback_" + Date.now());
    }
  }, []);

  // Lấy session chat hiện tại khi guestSessionId sẵn sàng
  const fetchActiveSession = useCallback(async () => {
    if (!guestSessionId) return;
    try {
      const res = await fetch(`/api/chat/session?guestSessionId=${guestSessionId}`);
      const data = await res.json();
      if (data.success && data.data) {
        setSession(data.data);
      }
    } catch (err) {
      // ignore
    }
  }, [guestSessionId]);

  useEffect(() => {
    fetchActiveSession();
  }, [fetchActiveSession]);

  // Polling tự động kiểm tra tin nhắn mới mỗi 3.5 giây khi có phiên
  useEffect(() => {
    if (!session?.id) return;

    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/chat/messages?sessionId=${session.id}`);
        const data = await res.json();
        if (data.success && Array.isArray(data.data)) {
          setSession((prev) => {
            if (!prev) return null;
            return {
              ...prev,
              messages: data.data,
            };
          });

          // Nếu đang mở cửa sổ chat, tự động đánh dấu đã đọc
          if (isOpen) {
            await fetch("/api/chat/read", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ sessionId: session.id }),
            });
          }
        }
      } catch {
        // ignore polling error
      }
    }, 3500);

    return () => clearInterval(interval);
  }, [session?.id, isOpen]);

  // Bắt đầu phiên chat mới
  const handleStartSession = async (
    name: string,
    phone: string,
    initialMessage: string
  ) => {
    setIsStarting(true);
    try {
      const res = await fetch("/api/chat/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName: name,
          customerPhone: phone || null,
          initialMessage,
          guestSessionId,
        }),
      });

      const data = await res.json();
      if (!data.success) {
        throw new Error(data.message || "Không thể bắt đầu phiên chat.");
      }

      setSession(data.data);
    } finally {
      setIsStarting(false);
    }
  };

  // Gửi tin nhắn mới từ khách hàng
  const handleSendMessage = async (content: string) => {
    if (!session?.id) return;
    setIsSending(true);

    try {
      const res = await fetch("/api/chat/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId: session.id,
          content,
        }),
      });

      const data = await res.json();
      if (data.success && data.data) {
        setSession((prev) => {
          if (!prev) return null;
          return {
            ...prev,
            messages: [...prev.messages, data.data],
            lastMessageText: content,
          };
        });
      }
    } finally {
      setIsSending(false);
    }
  };

  const handleToggle = () => {
    setIsOpen(!isOpen);
    if (!isOpen && session?.id) {
      // Đánh dấu đã đọc khi mở cửa sổ
      fetch("/api/chat/read", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId: session.id }),
      });
      setSession((prev) => (prev ? { ...prev, unreadCustomerCount: 0 } : null));
    }
  };

  return (
    <>
      <LiveChatButton
        isOpen={isOpen}
        onToggle={handleToggle}
        unreadCount={session?.unreadCustomerCount || 0}
      />

      <LiveChatWindow
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        session={session}
        onStartSession={handleStartSession}
        onSendMessage={handleSendMessage}
        isStarting={isStarting}
        isSending={isSending}
        initialUserName={authSession?.user?.name || null}
      />
    </>
  );
};
