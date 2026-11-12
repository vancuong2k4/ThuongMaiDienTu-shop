"use client";

// ============================================================
// components/admin/chat/ChatCenterManager.tsx
// Container Trung Tâm Điều Phối Live Chat Admin CMS (Phase 18)
// ============================================================

import React, { useState, useEffect, useCallback } from "react";
import { AdminChatSession, AdminChatMessage, ChatKPIs } from "./types";
import { ChatStats } from "./ChatStats";
import { ChatSessionList } from "./ChatSessionList";
import { ChatConversationPane } from "./ChatConversationPane";
import { ChatSenderRole, ChatSessionStatus } from "@prisma/client";

interface ChatCenterManagerProps {
  initialStats: ChatKPIs;
  initialSessions: AdminChatSession[];
}

export const ChatCenterManager: React.FC<ChatCenterManagerProps> = ({
  initialStats,
  initialSessions,
}) => {
  const [stats, setStats] = useState<ChatKPIs>(initialStats);
  const [sessions, setSessions] = useState<AdminChatSession[]>(initialSessions);
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(
    initialSessions[0]?.id || null
  );

  const [activeMessages, setActiveMessages] = useState<AdminChatMessage[]>(
    initialSessions[0]?.messages || []
  );

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [isSending, setIsSending] = useState(false);

  const selectedSession =
    sessions.find((s) => s.id === selectedSessionId) || sessions[0] || null;

  // Lấy chi tiết tin nhắn của phiên đang chọn
  const loadSessionMessages = useCallback(async (sessionId: string) => {
    try {
      const res = await fetch(`/api/admin/chat/sessions/${sessionId}`);
      const data = await res.json();
      if (data.success && data.data) {
        setActiveMessages(data.data.messages || []);
        // Đánh dấu đã đọc cho Admin
        await fetch("/api/admin/chat/read", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sessionId }),
        });
        // Cập nhật lại unreadAdminCount trên state
        setSessions((prev) =>
          prev.map((s) => (s.id === sessionId ? { ...s, unreadAdminCount: 0 } : s))
        );
      }
    } catch (err) {
      console.error("Lỗi khi tải tin nhắn phiên chat:", err);
    }
  }, []);

  // Khi chọn phiên khác
  const handleSelectSession = (session: AdminChatSession) => {
    setSelectedSessionId(session.id);
    loadSessionMessages(session.id);
  };

  // Polling tự động mỗi 4 giây để cập nhật tin nhắn mới
  useEffect(() => {
    const interval = setInterval(async () => {
      if (!selectedSessionId) return;
      try {
        const res = await fetch(`/api/admin/chat/sessions/${selectedSessionId}`);
        const data = await res.json();
        if (data.success && data.data) {
          setActiveMessages(data.data.messages || []);
        }

        // Cập nhật lại danh sách sessions
        const resSessions = await fetch("/api/admin/chat/sessions?limit=30");
        const dataSessions = await resSessions.json();
        if (dataSessions.success && dataSessions.data) {
          setSessions(dataSessions.data);
        }
      } catch (err) {
        // ignore polling errors
      }
    }, 4000);

    return () => clearInterval(interval);
  }, [selectedSessionId]);

  // Gửi tin nhắn từ Admin / Dược sĩ
  const handleSendMessage = async (content: string, senderRole: ChatSenderRole) => {
    if (!selectedSessionId) return;
    setIsSending(true);

    try {
      const res = await fetch("/api/admin/chat/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId: selectedSessionId,
          content,
          senderRole,
          senderName:
            senderRole === ChatSenderRole.PHARMACIST
              ? "Dược sĩ THUYNGA"
              : "Thu Hằng (CSKH)",
        }),
      });

      const data = await res.json();
      if (data.success && data.data) {
        setActiveMessages((prev) => [...prev, data.data]);
        setSessions((prev) =>
          prev.map((s) =>
            s.id === selectedSessionId
              ? {
                  ...s,
                  lastMessageText: content,
                  lastMessageAt: new Date().toISOString(),
                }
              : s
          )
        );
      }
    } catch (err) {
      console.error("Lỗi khi gửi tin nhắn:", err);
    } finally {
      setIsSending(false);
    }
  };

  // Cập nhật trạng thái phiên
  const handleUpdateStatus = async (status: ChatSessionStatus) => {
    if (!selectedSessionId) return;
    try {
      setSessions((prev) =>
        prev.map((s) => (s.id === selectedSessionId ? { ...s, status } : s))
      );
      await fetch(`/api/admin/chat/sessions/${selectedSessionId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
    } catch (err) {
      console.error("Lỗi khi cập nhật trạng thái:", err);
    }
  };

  // Cập nhật người phụ trách
  const handleUpdateAssignee = async (assignedTo: string) => {
    if (!selectedSessionId) return;
    try {
      setSessions((prev) =>
        prev.map((s) => (s.id === selectedSessionId ? { ...s, assignedTo } : s))
      );
      await fetch(`/api/admin/chat/sessions/${selectedSessionId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ assignedTo }),
      });
    } catch (err) {
      console.error("Lỗi khi phân công phiên chat:", err);
    }
  };

  // Lọc sessions
  const filteredSessions = sessions.filter((s) => {
    const matchesStatus = statusFilter === "ALL" || s.status === statusFilter;
    const matchesSearch =
      searchTerm === "" ||
      s.sessionCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (s.customerPhone && s.customerPhone.includes(searchTerm));

    return matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* 1. KPIs */}
      <ChatStats stats={stats} />

      {/* 2. Split Workspace (Left: Sessions List, Right: Chat Conversation) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-5">
          <ChatSessionList
            sessions={filteredSessions}
            selectedSessionId={selectedSessionId}
            onSelectSession={handleSelectSession}
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            statusFilter={statusFilter}
            onStatusFilterChange={setStatusFilter}
          />
        </div>

        <div className="lg:col-span-7">
          <ChatConversationPane
            session={selectedSession}
            messages={activeMessages}
            onSendMessage={handleSendMessage}
            onUpdateStatus={handleUpdateStatus}
            onUpdateAssignee={handleUpdateAssignee}
            isSending={isSending}
          />
        </div>
      </div>
    </div>
  );
};
