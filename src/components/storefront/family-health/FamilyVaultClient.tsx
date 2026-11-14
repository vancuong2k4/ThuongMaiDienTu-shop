"use client";

// ============================================================
// components/storefront/family-health/FamilyVaultClient.tsx
// Bộ Điều Phối Khách Hàng Tủ Thuốc Gia Đình & Lịch Uống (Phase 22)
// ============================================================

import React, { useState } from "react";
import {
  Clock,
  Heart,
  Calendar,
  CheckCircle2,
  Plus,
  RefreshCw,
  Users,
} from "lucide-react";
import { FamilyMemberTabs, type FamilyMemberSummary } from "./FamilyMemberTabs";
import { SupplementClockTimeline } from "./SupplementClockTimeline";
import { NutrientConflictAlert } from "./NutrientConflictAlert";
import { RestockAlertCard } from "./RestockAlertCard";
import { AddMemberModal } from "./AddMemberModal";
import { AddScheduleModal } from "./AddScheduleModal";
import { chatAudio } from "@/lib/chat-audio";
import type { MemberScheduleOverview } from "@/lib/family-health";

interface FamilyVaultClientProps {
  initialMembers: FamilyMemberSummary[];
  initialOverview: MemberScheduleOverview | null;
}

export const FamilyVaultClient: React.FC<FamilyVaultClientProps> = ({
  initialMembers,
  initialOverview,
}) => {
  const [members, setMembers] = useState<FamilyMemberSummary[]>(initialMembers);
  const [activeMemberId, setActiveMemberId] = useState<string>(
    initialMembers[0]?.id || ""
  );
  const [overview, setOverview] = useState<MemberScheduleOverview | null>(
    initialOverview
  );
  const [loading, setLoading] = useState(false);
  const [loadingScheduleId, setLoadingScheduleId] = useState<string | null>(null);

  // Modals state
  const [isAddMemberOpen, setIsAddMemberOpen] = useState(false);
  const [isAddScheduleOpen, setIsAddScheduleOpen] = useState(false);

  const fetchMemberOverview = async (memberId: string) => {
    try {
      setLoading(true);
      const res = await fetch(`/api/family-health/members/${memberId}`);
      const data = await res.json();
      if (data.success && data.overview) {
        setOverview(data.overview);
      }
    } catch (err) {
      console.error("Lỗi khi tải lịch uống:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectMember = (id: string) => {
    setActiveMemberId(id);
    fetchMemberOverview(id);
  };

  const handleToggleIntake = async (
    scheduleId: string,
    currentStatus: string
  ) => {
    if (!overview) return;
    const nextStatus = currentStatus === "TAKEN" ? "SCHEDULED" : "TAKEN";
    const todayStr = overview.todayFormatted;

    try {
      setLoadingScheduleId(scheduleId);

      // Play soft chime if user marks as TAKEN
      if (nextStatus === "TAKEN") {
        chatAudio.playIncoming();
      }

      const res = await fetch("/api/family-health/logs/toggle", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          scheduleId,
          memberProfileId: activeMemberId,
          logDate: todayStr,
          status: nextStatus,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        alert(data.message || "Không thể cập nhật cữ uống.");
        return;
      }

      // Refresh overview
      fetchMemberOverview(activeMemberId);
    } catch {
      alert("Lỗi kết nối khi cập nhật cữ uống.");
    } finally {
      setLoadingScheduleId(null);
    }
  };

  const handleMemberCreated = (newMember: any) => {
    setMembers((prev) => [...prev, newMember]);
    handleSelectMember(newMember.id);
  };

  const activeMember = members.find((m) => m.id === activeMemberId);

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-neutral-200/90 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-neutral-100 pb-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#800028] uppercase tracking-wider mb-1">
              <Heart className="w-3.5 h-3.5 text-[#800028]" />
              <span>Family Health Vault & Smart Supplement Clock</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Tủ Thuốc Sức Khỏe Gia Đình Đa Thế Hệ
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Theo dõi cữ uống Sữa Úc, Vitamin D3, Canxi, Sắt và cảnh báo tương tác vi chất chuẩn Dược sĩ
            </p>
          </div>

          {/* Adherence progress pill */}
          {overview && (
            <div className="flex items-center gap-2 self-start sm:self-auto bg-emerald-50 px-3.5 py-2 rounded-2xl border border-emerald-200/80">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <div>
                <span className="text-[10px] text-emerald-700 font-bold uppercase block">
                  Tuân thủ hôm nay
                </span>
                <span className="font-mono font-black text-emerald-800 text-xs sm:text-sm">
                  {overview.takenTodayCount}/{overview.totalSchedules} cữ ({overview.adherenceRatePercent}%)
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Member Selector Tabs */}
        <FamilyMemberTabs
          members={members}
          activeMemberId={activeMemberId}
          onSelectMember={handleSelectMember}
          onOpenAddMember={() => setIsAddMemberOpen(true)}
        />
      </div>

      {/* Member Details & Conflict / Restock Alerts */}
      {overview && (
        <>
          {/* Conflict Alerts */}
          <NutrientConflictAlert alerts={overview.conflictAlerts} />

          {/* Restock Urgency Alerts */}
          <RestockAlertCard alerts={overview.restockAlerts} />

          {/* Clock Timeline Section Header */}
          <div className="flex items-center justify-between gap-2 pt-2">
            <div>
              <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight flex items-center gap-2">
                <span>Lịch Uống Hôm Nay:</span>
                <span className="text-[#800028] font-bold">
                  {overview.member.fullName}
                </span>
              </h2>
              <p className="text-xs text-slate-500">
                Nhấp vào ô &quot;Uống cữ này&quot; để đánh dấu đã uống và tự động trừ số lượng còn lại
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => fetchMemberOverview(activeMemberId)}
                disabled={loading}
                title="Làm mới lịch uống"
                className="p-2 text-slate-500 hover:text-slate-900 bg-white hover:bg-slate-100 rounded-xl border border-slate-200 transition-colors cursor-pointer"
              >
                <RefreshCw
                  className={`w-4 h-4 ${loading ? "animate-spin" : ""}`}
                />
              </button>

              <button
                type="button"
                onClick={() => setIsAddScheduleOpen(true)}
                className="px-3.5 py-2 rounded-xl bg-[#800028] hover:bg-[#660020] text-white font-bold text-xs transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
              >
                <Plus className="w-4 h-4 stroke-[2.5]" />
                <span className="hidden sm:inline">Thêm vi chất</span>
              </button>
            </div>
          </div>

          {/* Supplement Clock Timeline */}
          <SupplementClockTimeline
            timeSlotGroups={overview.timeSlotGroups}
            onToggleIntake={handleToggleIntake}
            onOpenAddSchedule={() => setIsAddScheduleOpen(true)}
            loadingScheduleId={loadingScheduleId}
          />
        </>
      )}

      {/* Modals */}
      <AddMemberModal
        isOpen={isAddMemberOpen}
        onClose={() => setIsAddMemberOpen(false)}
        onSuccess={handleMemberCreated}
      />

      <AddScheduleModal
        memberProfileId={activeMemberId}
        memberName={activeMember?.fullName || "thành viên"}
        isOpen={isAddScheduleOpen}
        onClose={() => setIsAddScheduleOpen(false)}
        onSuccess={() => fetchMemberOverview(activeMemberId)}
      />
    </div>
  );
};
