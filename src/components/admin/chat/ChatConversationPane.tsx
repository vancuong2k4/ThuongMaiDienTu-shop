"use client";

// ============================================================
// components/admin/chat/ChatConversationPane.tsx
// Khung Trò Chuyện Chi Tiết & Gửi Phản Hồi Trực Tiếp Bên Phải (Phase 18)
// ============================================================

import React, { useState, useRef, useEffect } from "react";
import {
  Send,
  User,
  Stethoscope,
  Headphones,
  Bot,
  Clock,
  Phone,
  Mail,
  CheckCircle2,
  AlertCircle,
  Paperclip,
} from "lucide-react";
import { AdminChatSession, AdminChatMessage } from "./types";
import {
  ChatSenderRole,
  ChatSessionStatus,
  ChatMessageType,
} from "@prisma/client";
import {
  CHAT_SESSION_STATUS_CONFIG,
  CHAT_SENDER_ROLE_CONFIG,
} from "@/lib/validations/chat";

interface ChatConversationPaneProps {
  session: AdminChatSession | null;
  messages: AdminChatMessage[];
  onSendMessage: (content: string, senderRole: ChatSenderRole) => Promise<void>;
  onUpdateStatus: (status: ChatSessionStatus) => Promise<void>;
  onUpdateAssignee: (assignee: string) => Promise<void>;
  isSending: boolean;
}

export const ChatConversationPane: React.FC<ChatConversationPaneProps> = ({
  session,
  messages,
  onSendMessage,
  onUpdateStatus,
  onUpdateAssignee,
  isSending,
}) => {
  const [inputText, setInputText] = useState("");
  const [activeRole, setActiveRole] = useState<ChatSenderRole>(
    ChatSenderRole.SUPPORT_AGENT
  );
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (!session) {
    return (
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs h-[700px] flex flex-col items-center justify-center p-8 text-center text-slate-400 space-y-3">
        <div className="w-16 h-16 rounded-3xl bg-slate-100 flex items-center justify-center text-slate-400">
          <Headphones className="w-8 h-8" />
        </div>
        <h4 className="font-extrabold text-slate-700 text-sm">
          Chưa chọn cuộc trò chuyện nào
        </h4>
        <p className="text-xs max-w-xs text-slate-400">
          Nhấp vào một cuộc hội thoại ở danh sách bên trái để xem lịch sử tin nhắn và gửi phản hồi cho khách hàng.
        </p>
      </div>
    );
  }

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isSending) return;
    const text = inputText;
    setInputText("");
    await onSendMessage(text, activeRole);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend(e);
    }
  };

  const statusCfg =
    CHAT_SESSION_STATUS_CONFIG[session.status] ||
    CHAT_SESSION_STATUS_CONFIG.ACTIVE;

  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs overflow-hidden flex flex-col h-[700px]">
      {/* 1. Header Bar */}
      <div className="px-5 py-3.5 border-b border-slate-100 bg-slate-50/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-[#800028] text-white flex items-center justify-center font-black text-sm shadow-xs">
            {session.customerName.charAt(0).toUpperCase()}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-black text-slate-900 text-sm">
                {session.customerName}
              </h3>
              <span className="font-mono text-[10px] text-slate-400 bg-slate-200/60 px-1.5 py-0.5 rounded">
                {session.sessionCode}
              </span>
            </div>
            <div className="flex items-center gap-3 text-[11px] text-slate-500 mt-0.5">
              {session.customerPhone && (
                <a
                  href={`tel:${session.customerPhone}`}
                  className="flex items-center gap-1 text-emerald-700 hover:underline font-semibold"
                >
                  <Phone className="w-3 h-3" />
                  <span>{session.customerPhone}</span>
                </a>
              )}
              {session.customerEmail && (
                <span className="flex items-center gap-1 text-slate-400">
                  <Mail className="w-3 h-3" />
                  <span className="truncate max-w-[120px]">{session.customerEmail}</span>
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Status & Assignment */}
        <div className="flex items-center gap-2">
          {/* Status switcher */}
          <select
            value={session.status}
            onChange={(e) => onUpdateStatus(e.target.value as ChatSessionStatus)}
            className="text-xs font-bold rounded-xl border border-slate-200 px-3 py-1.5 bg-white focus:outline-none focus:border-[#800028] text-slate-800"
          >
            {Object.entries(CHAT_SESSION_STATUS_CONFIG).map(([k, cfg]) => (
              <option key={k} value={k}>
                {cfg.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 2. Message Feed */}
      <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-slate-50/30">
        {messages.map((msg) => {
          const isCustomer = msg.senderRole === ChatSenderRole.CUSTOMER;
          const isPharmacist = msg.senderRole === ChatSenderRole.PHARMACIST;
          const isBot = msg.senderRole === ChatSenderRole.SYSTEM_BOT;

          if (isBot) {
            return (
              <div key={msg.id} className="flex justify-center my-2">
                <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-purple-50 text-purple-800 border border-purple-200 text-[11px] font-medium">
                  <Bot className="w-3.5 h-3.5 text-purple-600" />
                  <span>{msg.content}</span>
                </div>
              </div>
            );
          }

          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isCustomer ? "items-start" : "items-end"}`}
            >
              {/* Sender label */}
              <div className="flex items-center gap-1.5 mb-1 px-1">
                {isPharmacist && (
                  <Stethoscope className="w-3.5 h-3.5 text-emerald-600" />
                )}
                {!isCustomer && !isPharmacist && (
                  <Headphones className="w-3.5 h-3.5 text-[#800028]" />
                )}
                <span className="text-[11px] font-bold text-slate-500">
                  {msg.senderName}
                </span>
                <span className="text-[10px] text-slate-400">
                  {new Date(msg.createdAt).toLocaleTimeString("vi-VN", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>

              {/* Message Bubble */}
              <div
                className={`max-w-[85%] sm:max-w-md p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed shadow-2xs ${
                  isCustomer
                    ? "bg-white text-slate-900 border border-slate-200 rounded-tl-xs"
                    : isPharmacist
                    ? "bg-emerald-600 text-white rounded-tr-xs"
                    : "bg-[#800028] text-white rounded-tr-xs"
                }`}
              >
                <p className="whitespace-pre-wrap">{msg.content}</p>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* 3. Bottom Input Bar */}
      <div className="p-4 border-t border-slate-100 bg-white space-y-3">
        {/* Role Switcher Pill */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold text-slate-500">Trả lời với vai trò:</span>
            <div className="inline-flex rounded-xl p-0.5 bg-slate-100 border border-slate-200">
              <button
                type="button"
                onClick={() => setActiveRole(ChatSenderRole.SUPPORT_AGENT)}
                className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
                  activeRole === ChatSenderRole.SUPPORT_AGENT
                    ? "bg-[#800028] text-white shadow-2xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <Headphones className="w-3 h-3" />
                <span>CSKH</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveRole(ChatSenderRole.PHARMACIST)}
                className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
                  activeRole === ChatSenderRole.PHARMACIST
                    ? "bg-emerald-600 text-white shadow-2xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <Stethoscope className="w-3 h-3" />
                <span>Dược Sĩ</span>
              </button>
            </div>
          </div>

          <span className="text-[10px] text-slate-400 hidden sm:inline">
            Nhấn Enter để gửi, Shift+Enter xuống dòng
          </span>
        </div>

        {/* Input box */}
        <form onSubmit={handleSend} className="flex items-end gap-2">
          <textarea
            rows={2}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={`Nhập phản hồi với tư cách ${
              activeRole === ChatSenderRole.PHARMACIST ? "Dược sĩ Chuyên Môn" : "Chuyên viên CSKH"
            }...`}
            className="flex-1 p-3 rounded-2xl border border-slate-200 text-xs focus:outline-none focus:border-[#800028] resize-none"
          />

          <button
            type="submit"
            disabled={!inputText.trim() || isSending}
            className={`p-3 rounded-2xl text-white flex items-center justify-center shrink-0 shadow-xs transition-all disabled:opacity-40 ${
              activeRole === ChatSenderRole.PHARMACIST
                ? "bg-emerald-600 hover:bg-emerald-700"
                : "bg-[#800028] hover:bg-[#660020]"
            }`}
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
