"use client";

// ============================================================
// components/storefront/chat/LiveChatWindow.tsx
// Cửa Sổ Trò Chuyện Trực Tuyến Live Chat Storefront (Phase 18)
// ============================================================

import React, { useState, useRef, useEffect } from "react";
import {
  X,
  Send,
  MessageSquare,
  Stethoscope,
  Headphones,
  Bot,
  User,
  ShieldCheck,
  ChevronDown,
  Clock,
  AlertCircle,
} from "lucide-react";
import { StorefrontChatSession, StorefrontChatMessage } from "./types";
import { ChatSenderRole } from "@prisma/client";
import { QUICK_CHAT_PROMPTS } from "@/lib/validations/chat";

interface LiveChatWindowProps {
  isOpen: boolean;
  onClose: () => void;
  session: StorefrontChatSession | null;
  onStartSession: (name: string, phone: string, initialMessage: string) => Promise<void>;
  onSendMessage: (content: string) => Promise<void>;
  isStarting: boolean;
  isSending: boolean;
  initialUserName?: string | null;
  initialUserPhone?: string | null;
}

export const LiveChatWindow: React.FC<LiveChatWindowProps> = ({
  isOpen,
  onClose,
  session,
  onStartSession,
  onSendMessage,
  isStarting,
  isSending,
  initialUserName,
  initialUserPhone,
}) => {
  const [customerName, setCustomerName] = useState(initialUserName || "");
  const [customerPhone, setCustomerPhone] = useState(initialUserPhone || "");
  const [initialQuestion, setInitialQuestion] = useState("");
  const [inputText, setInputText] = useState("");
  const [error, setError] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    if (session?.messages) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [session?.messages]);

  if (!isOpen) return null;

  const handleStartChat = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !initialQuestion.trim() || isStarting) return;
    setError(null);
    try {
      await onStartSession(customerName, customerPhone, initialQuestion);
    } catch (err: any) {
      setError(err.message || "Không thể bắt đầu trò chuyện.");
    }
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isSending) return;
    const text = inputText;
    setInputText("");
    try {
      await onSendMessage(text);
    } catch (err: any) {
      setError(err.message || "Không thể gửi tin nhắn.");
    }
  };

  const handleQuickPromptClick = (text: string) => {
    if (session) {
      onSendMessage(text);
    } else {
      setInitialQuestion(text);
    }
  };

  return (
    <div className="fixed bottom-24 lg:bottom-6 right-4 sm:right-6 z-50 w-[92vw] sm:w-[380px] h-[520px] max-h-[85vh] bg-white rounded-3xl shadow-2xl border border-slate-200/90 flex flex-col overflow-hidden animate-in fade-in-0 zoom-in-95 duration-200">
      {/* ── 1. Window Header ─────────────────────────────────── */}
      <div className="bg-gradient-to-r from-slate-900 via-[#800028] to-slate-900 text-white px-5 py-3.5 flex items-center justify-between shadow-xs shrink-0">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center text-white border border-white/20">
              <Headphones className="w-5 h-5" />
            </div>
            {/* Green online pulse dot */}
            <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full border-2 border-slate-900" />
          </div>

          <div>
            <h4 className="font-black text-sm text-white tracking-tight flex items-center gap-1.5">
              <span>Dược Sĩ & CSKH THUYNGA</span>
            </h4>
            <div className="flex items-center gap-1.5 text-[11px] text-emerald-300 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>Trực tuyến • Phản hồi ~3 phút</span>
            </div>
          </div>
        </div>

        <button
          onClick={onClose}
          className="p-1.5 rounded-xl text-white/80 hover:text-white hover:bg-white/10 transition-colors"
          aria-label="Đóng cửa sổ chat"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* ── 2. Body: Pre-chat Welcome OR Active Conversation ─── */}
      <div className="flex-1 overflow-y-auto p-4 bg-slate-50/50 flex flex-col space-y-3">
        {error && (
          <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {!session ? (
          // Pre-Chat Welcome Form
          <div className="space-y-4 my-auto">
            <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs space-y-2 text-center">
              <span className="text-xl">🇦🇺</span>
              <h5 className="font-bold text-slate-900 text-xs sm:text-sm">
                Xin chào Quý khách!
              </h5>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                Đội ngũ Dược sĩ & Chuyên viên THUYNGA Shop luôn sẵn sàng hỗ trợ tư vấn hạn sử dụng hàng bay Air, liều dùng vi chất và giải đáp đơn hàng.
              </p>
            </div>

            {/* Quick Questions */}
            <div className="space-y-1.5">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Câu hỏi nhanh phổ biến:
              </span>
              <div className="flex flex-col gap-1.5">
                {QUICK_CHAT_PROMPTS.map((prompt) => (
                  <button
                    key={prompt.id}
                    type="button"
                    onClick={() => handleQuickPromptClick(prompt.text)}
                    className="text-left text-xs p-2 rounded-xl bg-white hover:bg-rose-50/60 border border-slate-200 hover:border-[#800028]/40 text-slate-700 font-medium transition-all flex items-center justify-between gap-2"
                  >
                    <span className="line-clamp-1">{prompt.text}</span>
                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-500 shrink-0">
                      {prompt.tag}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Start Form */}
            <form onSubmit={handleStartChat} className="space-y-2.5 pt-1">
              <input
                type="text"
                required
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Họ và tên của bạn *"
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-[#800028] bg-white"
              />

              <input
                type="tel"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                placeholder="Số điện thoại / Zalo (để nhận phản hồi)"
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-[#800028] bg-white"
              />

              <textarea
                rows={2}
                required
                value={initialQuestion}
                onChange={(e) => setInitialQuestion(e.target.value)}
                placeholder="Nội dung cần tư vấn..."
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-[#800028] bg-white resize-none"
              />

              <button
                type="submit"
                disabled={isStarting}
                className="w-full py-2.5 rounded-xl bg-[#800028] hover:bg-[#660020] text-white text-xs font-bold shadow-xs transition-all disabled:opacity-50"
              >
                {isStarting ? "Đang kết nối..." : "Bắt Đầu Trò Chuyện"}
              </button>
            </form>
          </div>
        ) : (
          // Active Messages Feed
          <div className="space-y-3 flex-1">
            {session.messages.map((msg) => {
              const isMe = msg.senderRole === ChatSenderRole.CUSTOMER;
              const isPharmacist = msg.senderRole === ChatSenderRole.PHARMACIST;
              const isBot = msg.senderRole === ChatSenderRole.SYSTEM_BOT;

              if (isBot) {
                return (
                  <div key={msg.id} className="text-center my-1">
                    <span className="inline-block px-3 py-1 rounded-full bg-purple-50 text-purple-800 text-[10px] font-medium border border-purple-200">
                      {msg.content}
                    </span>
                  </div>
                );
              }

              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}
                >
                  {/* Sender label */}
                  {!isMe && (
                    <div className="flex items-center gap-1 mb-1 px-1">
                      {isPharmacist ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-800 bg-emerald-100/70 px-2 py-0.5 rounded-md">
                          <Stethoscope className="w-3 h-3 text-emerald-600" />
                          <span>Dược Sĩ Chuyên Môn</span>
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold text-slate-500">
                          {msg.senderName}
                        </span>
                      )}
                    </div>
                  )}

                  {/* Bubble */}
                  <div
                    className={`max-w-[85%] p-3 rounded-2xl text-xs leading-relaxed shadow-2xs ${
                      isMe
                        ? "bg-[#800028] text-white rounded-tr-xs"
                        : "bg-white text-slate-900 border border-slate-200 rounded-tl-xs"
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{msg.content}</p>
                  </div>

                  <span className="text-[9px] text-slate-400 mt-0.5 px-1 font-mono">
                    {new Date(msg.createdAt).toLocaleTimeString("vi-VN", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* ── 3. Bottom Input Bar (When session active) ─────────── */}
      {session && (
        <div className="p-3 border-t border-slate-100 bg-white space-y-2 shrink-0">
          {/* Quick chips when session active */}
          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pb-0.5">
            <button
              type="button"
              onClick={() => handleQuickPromptClick("Tư vấn liều uống chi tiết")}
              className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 whitespace-nowrap"
            >
              Liều dùng vi chất
            </button>
            <button
              type="button"
              onClick={() => handleQuickPromptClick("Cherry đợt này còn tươi giòn không?")}
              className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 whitespace-nowrap"
            >
              Độ tươi Cherry
            </button>
            <button
              type="button"
              onClick={() => handleQuickPromptClick("Đơn hàng của tôi bao giờ giao?")}
              className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 whitespace-nowrap"
            >
              Hạn giao hàng
            </button>
          </div>

          <form onSubmit={handleSend} className="flex items-center gap-2">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Nhập tin nhắn..."
              className="flex-1 px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-[#800028]"
            />
            <button
              type="submit"
              disabled={!inputText.trim() || isSending}
              className="p-2 rounded-xl bg-[#800028] hover:bg-[#660020] text-white flex items-center justify-center shrink-0 shadow-xs transition-all disabled:opacity-40"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
