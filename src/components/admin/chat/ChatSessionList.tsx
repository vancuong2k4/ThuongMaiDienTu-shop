"use client";

// ============================================================
// components/admin/chat/ChatSessionList.tsx
// Danh Sách Cuộc Hội Thoại Live Chat Bên Trái (Phase 18)
// ============================================================

import React from "react";
import {
  Search,
  MessageSquare,
  Stethoscope,
  Clock,
  User,
  Filter,
} from "lucide-react";
import { AdminChatSession } from "./types";
import { ChatSessionStatus } from "@prisma/client";
import { CHAT_SESSION_STATUS_CONFIG } from "@/lib/validations/chat";

interface ChatSessionListProps {
  sessions: AdminChatSession[];
  selectedSessionId: string | null;
  onSelectSession: (session: AdminChatSession) => void;
  searchTerm: string;
  onSearchChange: (value: string) => void;
  statusFilter: string;
  onStatusFilterChange: (value: string) => void;
}

export const ChatSessionList: React.FC<ChatSessionListProps> = ({
  sessions,
  selectedSessionId,
  onSelectSession,
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
}) => {
  const formatTimeAgo = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      const diffMs = Date.now() - d.getTime();
      const diffMins = Math.floor(diffMs / 60000);
      if (diffMins < 1) return "Vừa xong";
      if (diffMins < 60) return `${diffMins}p trước`;
      const diffHours = Math.floor(diffMins / 60);
      if (diffHours < 24) return `${diffHours}h trước`;
      return d.toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit" });
    } catch {
      return "";
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs overflow-hidden flex flex-col h-[700px]">
      {/* 1. Header & Search */}
      <div className="p-4 border-b border-slate-100 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-[#800028]" />
            <h3 className="font-extrabold text-slate-900 text-sm">
              Hộp Thư Đến ({sessions.length})
            </h3>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Tìm theo tên khách, SĐT, mã..."
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-[#800028] bg-slate-50/50"
          />
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pb-1">
          <button
            onClick={() => onStatusFilterChange("ALL")}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-bold whitespace-nowrap transition-all ${
              statusFilter === "ALL"
                ? "bg-slate-900 text-white"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            Tất cả
          </button>
          <button
            onClick={() => onStatusFilterChange(ChatSessionStatus.ACTIVE)}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-bold whitespace-nowrap transition-all ${
              statusFilter === ChatSessionStatus.ACTIVE
                ? "bg-emerald-600 text-white"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            Đang chat
          </button>
          <button
            onClick={() => onStatusFilterChange(ChatSessionStatus.PENDING_PHARMACIST)}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-bold whitespace-nowrap transition-all ${
              statusFilter === ChatSessionStatus.PENDING_PHARMACIST
                ? "bg-amber-600 text-white"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            Cần Dược sĩ
          </button>
          <button
            onClick={() => onStatusFilterChange(ChatSessionStatus.RESOLVED)}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-bold whitespace-nowrap transition-all ${
              statusFilter === ChatSessionStatus.RESOLVED
                ? "bg-blue-600 text-white"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            Đã xong
          </button>
        </div>
      </div>

      {/* 2. Scrollable Thread List */}
      <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
        {sessions.length === 0 ? (
          <div className="p-8 text-center text-slate-400 space-y-2">
            <MessageSquare className="w-8 h-8 mx-auto text-slate-300" />
            <p className="text-xs">Không có cuộc trò chuyện nào phù hợp.</p>
          </div>
        ) : (
          sessions.map((item) => {
            const isSelected = selectedSessionId === item.id;
            const statusCfg =
              CHAT_SESSION_STATUS_CONFIG[item.status] ||
              CHAT_SESSION_STATUS_CONFIG.ACTIVE;

            return (
              <div
                key={item.id}
                onClick={() => onSelectSession(item)}
                className={`p-3.5 cursor-pointer transition-all flex items-start gap-3 hover:bg-slate-50 ${
                  isSelected
                    ? "bg-rose-50/60 border-l-4 border-l-[#800028]"
                    : "bg-white"
                }`}
              >
                {/* Avatar with unread badge */}
                <div className="relative shrink-0">
                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                    {item.customerName ? item.customerName.charAt(0).toUpperCase() : "K"}
                  </div>
                  {item.unreadAdminCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-600 text-white text-[9px] font-black flex items-center justify-center shadow-xs">
                      {item.unreadAdminCount}
                    </span>
                  )}
                </div>

                {/* Content */}
                <div className="min-w-0 flex-1 space-y-1">
                  <div className="flex items-center justify-between gap-1">
                    <span className="font-extrabold text-xs text-slate-900 truncate">
                      {item.customerName}
                    </span>
                    <span className="text-[10px] text-slate-400 shrink-0 font-medium">
                      {formatTimeAgo(item.lastMessageAt)}
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-500 line-clamp-1">
                    {item.lastMessageText || "Bắt đầu cuộc trò chuyện..."}
                  </p>

                  <div className="flex items-center gap-1.5 pt-0.5">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[9px] font-bold border ${statusCfg.badgeClass}`}
                    >
                      {statusCfg.label}
                    </span>
                    {item.assignedTo && (
                      <span className="text-[10px] text-slate-400 truncate">
                        • {item.assignedTo}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
