"use client";

// ============================================================
// components/storefront/chat/LiveChatButton.tsx
// Nút Bấm Floating Mở Live Chat Góc Màn Hình (Phase 18)
// ============================================================

import React from "react";
import { MessageSquare, Stethoscope } from "lucide-react";

interface LiveChatButtonProps {
  isOpen: boolean;
  onToggle: () => void;
  unreadCount?: number;
}

export const LiveChatButton: React.FC<LiveChatButtonProps> = ({
  isOpen,
  onToggle,
  unreadCount = 0,
}) => {
  return (
    <div className="relative group">
      {/* Tooltip on hover (desktop only) */}
      {!isOpen && (
        <span className="absolute -left-44 top-1/2 -translate-y-1/2 bg-slate-900 text-white text-[11px] font-semibold py-1.5 px-3 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none hidden md:block whitespace-nowrap shadow-lg border border-slate-700">
          Chat cùng Dược sĩ & CSKH
        </span>
      )}

      {/* Floating Button */}
      <button
        onClick={onToggle}
        className="w-12 h-12 rounded-full bg-gradient-to-br from-[#800028] via-[#9e0032] to-[#5c001e] hover:from-[#9e0032] hover:to-[#800028] text-white flex items-center justify-center shadow-xl hover:scale-110 active:scale-95 transition-all relative border border-amber-300/40"
        aria-label="Mở cửa sổ chat trực tuyến"
      >
        <MessageSquare className="w-5 h-5 text-white" />

        {/* Unread badge */}
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-600 text-white font-black text-[10px] flex items-center justify-center shadow-md animate-bounce">
            {unreadCount}
          </span>
        )}

        {/* Green online dot */}
        <span className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-white" />
      </button>
    </div>
  );
};
