"use client";

// ============================================================
// components/admin/chat/ChatStats.tsx
// 4 Thẻ Thống Kê KPI Live Chat & Tư Vấn Dược Sĩ (Phase 18)
// ============================================================

import React from "react";
import {
  MessageSquare,
  Stethoscope,
  CheckCircle2,
  Clock,
  Headphones,
} from "lucide-react";
import { ChatKPIs } from "./types";

interface ChatStatsProps {
  stats: ChatKPIs;
}

export const ChatStats: React.FC<ChatStatsProps> = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* 1. Phiên Đang Chat */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs flex items-center justify-between">
        <div className="space-y-1">
          <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
            Đang trao đổi
          </p>
          <p className="text-2xl font-black text-emerald-600">
            {stats.activeSessions}
          </p>
          <p className="text-[10px] text-slate-400">Khách đang online</p>
        </div>
        <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
          <MessageSquare className="w-5 h-5" />
        </div>
      </div>

      {/* 2. Cần Dược Sĩ Hỗ Trợ */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs flex items-center justify-between">
        <div className="space-y-1">
          <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
            Cần Dược sĩ
          </p>
          <p className="text-2xl font-black text-amber-600">
            {stats.pendingPharmacistSessions}
          </p>
          <p className="text-[10px] text-amber-600/80 font-medium">Tham vấn y khoa</p>
        </div>
        <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
          <Stethoscope className="w-5 h-5" />
        </div>
      </div>

      {/* 3. Đã Giải Quyết Xong */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs flex items-center justify-between">
        <div className="space-y-1">
          <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
            Đã giải quyết
          </p>
          <p className="text-2xl font-black text-blue-600">
            {stats.resolvedSessions}
          </p>
          <p className="text-[10px] text-slate-400">Hội thoại hoàn tất</p>
        </div>
        <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
          <CheckCircle2 className="w-5 h-5" />
        </div>
      </div>

      {/* 4. Tổng Tin Nhắn & Thời Gian Phản Hồi */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs flex items-center justify-between">
        <div className="space-y-1">
          <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
            Tổng tin nhắn
          </p>
          <p className="text-2xl font-black text-slate-900">
            {stats.totalMessages}
          </p>
          <p className="text-[10px] text-emerald-600 font-medium">
            Phản hồi ~{stats.avgResponseMinutes} phút
          </p>
        </div>
        <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center shrink-0">
          <Clock className="w-5 h-5" />
        </div>
      </div>
    </div>
  );
};
