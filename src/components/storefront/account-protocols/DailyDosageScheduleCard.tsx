"use client";

// ============================================================
// components/storefront/account-protocols/DailyDosageScheduleCard.tsx
// Lịch Nhắc Liều Dùng Hàng Ngày & Điểm Danh Uống Vi Chất (Phase 16)
// ============================================================

import React, { useState, useEffect } from "react";
import {
  Clock,
  CheckCircle2,
  Calendar,
  Stethoscope,
  Flame,
  Award,
} from "lucide-react";
import { AccountProtocolItem } from "./types";

interface DailyDosageScheduleCardProps {
  activeAssessment: AccountProtocolItem | null;
}

export const DailyDosageScheduleCard: React.FC<DailyDosageScheduleCardProps> = ({
  activeAssessment,
}) => {
  const todayStr = new Date().toISOString().slice(0, 10);
  const [completedDoses, setCompletedDoses] = useState<Record<string, boolean>>({});
  const [streakDays, setStreakDays] = useState(5);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(`thuynga_dosage_${todayStr}`);
      if (saved) {
        setCompletedDoses(JSON.parse(saved));
      }
    } catch {
      // ignore
    }
  }, [todayStr]);

  const handleToggleDose = (period: string) => {
    const updated = {
      ...completedDoses,
      [period]: !completedDoses[period],
    };
    setCompletedDoses(updated);
    try {
      localStorage.setItem(`thuynga_dosage_${todayStr}`, JSON.stringify(updated));
    } catch {
      // ignore
    }
  };

  if (!activeAssessment || !activeAssessment.protocol) {
    return (
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-8 text-center space-y-3">
        <Stethoscope className="w-12 h-12 text-slate-300 mx-auto" />
        <h3 className="font-bold text-slate-800 text-base">
          Chưa có phác đồ hoạt động nào
        </h3>
        <p className="text-xs text-slate-500 max-w-sm mx-auto">
          Làm bài trắc nghiệm nhanh để nhận phác đồ bổ sung vi chất cá nhân hóa và kích hoạt lịch nhắc uống hàng ngày.
        </p>
        <a
          href="/tu-van-dinh-duong"
          className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-[#800028] text-white text-xs font-bold rounded-xl shadow-sm hover:shadow transition-all"
        >
          <span>Làm bài trắc nghiệm ngay</span>
        </a>
      </div>
    );
  }

  const { protocol } = activeAssessment;
  const schedule = protocol.dosageSchedule || {};

  const morningDone = Boolean(completedDoses.morning);
  const afternoonDone = Boolean(completedDoses.afternoon);
  const eveningDone = Boolean(completedDoses.evening);

  const doneCount = (morningDone ? 1 : 0) + (afternoonDone ? 1 : 0) + (eveningDone ? 1 : 0);
  const totalSlots = 3;
  const progressPercent = Math.round((doneCount / totalSlots) * 100);

  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 sm:p-7 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
        <div>
          <span className="text-[11px] font-bold text-rose-700 bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-100 uppercase tracking-wider">
            Phác đồ đang áp dụng
          </span>
          <h3 className="font-bold text-slate-900 text-base sm:text-lg mt-1">
            {protocol.title}
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Lịch nhắc uống sữa & vitamin hôm nay:{" "}
            <strong>{new Date().toLocaleDateString("vi-VN", { weekday: "long", day: "2-digit", month: "2-digit", year: "numeric" })}</strong>
          </p>
        </div>

        {/* Streak Counter */}
        <div className="flex items-center gap-2 p-2.5 bg-amber-50 rounded-2xl border border-amber-200/80 self-start sm:self-auto">
          <div className="w-8 h-8 rounded-xl bg-amber-500 text-white flex items-center justify-center font-black text-xs shadow-xs">
            🔥
          </div>
          <div>
            <span className="text-[10px] text-amber-800 font-semibold block uppercase">
              Chuỗi uống đúng giờ
            </span>
            <span className="text-xs font-bold text-slate-900">
              {streakDays} ngày liên tiếp
            </span>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="space-y-1.5 p-4 bg-slate-50 rounded-2xl border border-slate-200/80">
        <div className="flex items-center justify-between text-xs font-semibold">
          <span className="text-slate-600">Tiến độ uống vi chất hôm nay</span>
          <span className="text-emerald-700 font-mono">
            {doneCount}/{totalSlots} cữ ({progressPercent}%)
          </span>
        </div>
        <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-emerald-500 rounded-full transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Checklist 3 Khung Giờ Trong Ngày */}
      <div className="space-y-3">
        {/* Sáng */}
        <div
          onClick={() => handleToggleDose("morning")}
          className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-start gap-3.5 ${
            morningDone
              ? "bg-emerald-50/60 border-emerald-300"
              : "bg-slate-50/60 border-slate-200 hover:border-slate-300"
          }`}
        >
          <div
            className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
              morningDone
                ? "border-emerald-600 bg-emerald-600 text-white"
                : "border-slate-300 bg-white"
            }`}
          >
            {morningDone && <CheckCircle2 className="w-4 h-4" />}
          </div>
          <div className="space-y-0.5 flex-1">
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs uppercase tracking-wider text-amber-800">
                🌅 Buổi Sáng
              </span>
              <span className="text-[11px] font-semibold text-slate-400">
                {morningDone ? "Đã uống" : "Chưa uống"}
              </span>
            </div>
            <p className="text-xs sm:text-sm font-medium text-slate-800 leading-relaxed">
              {schedule.morning || "Uống sau ăn sáng 30 phút cùng nhiều nước ấm"}
            </p>
          </div>
        </div>

        {/* Chiều */}
        <div
          onClick={() => handleToggleDose("afternoon")}
          className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-start gap-3.5 ${
            afternoonDone
              ? "bg-emerald-50/60 border-emerald-300"
              : "bg-slate-50/60 border-slate-200 hover:border-slate-300"
          }`}
        >
          <div
            className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
              afternoonDone
                ? "border-emerald-600 bg-emerald-600 text-white"
                : "border-slate-300 bg-white"
            }`}
          >
            {afternoonDone && <CheckCircle2 className="w-4 h-4" />}
          </div>
          <div className="space-y-0.5 flex-1">
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs uppercase tracking-wider text-sky-800">
                ☀️ Buổi Chiều
              </span>
              <span className="text-[11px] font-semibold text-slate-400">
                {afternoonDone ? "Đã uống" : "Chưa uống"}
              </span>
            </div>
            <p className="text-xs sm:text-sm font-medium text-slate-800 leading-relaxed">
              {schedule.afternoon || "Uống men vi sinh cùng nước ấm (dưới 40°C)"}
            </p>
          </div>
        </div>

        {/* Tối */}
        <div
          onClick={() => handleToggleDose("evening")}
          className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-start gap-3.5 ${
            eveningDone
              ? "bg-emerald-50/60 border-emerald-300"
              : "bg-slate-50/60 border-slate-200 hover:border-slate-300"
          }`}
        >
          <div
            className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
              eveningDone
                ? "border-emerald-600 bg-emerald-600 text-white"
                : "border-slate-300 bg-white"
            }`}
          >
            {eveningDone && <CheckCircle2 className="w-4 h-4" />}
          </div>
          <div className="space-y-0.5 flex-1">
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs uppercase tracking-wider text-purple-800">
                🌙 Buổi Tối
              </span>
              <span className="text-[11px] font-semibold text-slate-400">
                {eveningDone ? "Đã uống" : "Chưa uống"}
              </span>
            </div>
            <p className="text-xs sm:text-sm font-medium text-slate-800 leading-relaxed">
              {schedule.evening || "Cữ sữa ấm trước giờ ngủ giúp ngủ sâu giấc"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
