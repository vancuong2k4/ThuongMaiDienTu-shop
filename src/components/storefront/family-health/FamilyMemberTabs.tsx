"use client";

// ============================================================
// components/storefront/family-health/FamilyMemberTabs.tsx
// Thanh Chọn Thành Viên Gia Đình Đa Thế Hệ (Phase 22)
// ============================================================

import React from "react";
import { Plus, Users, User, Heart } from "lucide-react";
import type { FamilyRelation } from "@prisma/client";

export interface FamilyMemberSummary {
  id: string;
  fullName: string;
  relation: FamilyRelation;
  avatarEmoji?: string | null;
  healthGoals: string[];
  allergies?: string[];
  dateOfBirth?: Date | string | null;
  _count?: {
    supplementSchedules: number;
  };
}

interface FamilyMemberTabsProps {
  members: FamilyMemberSummary[];
  activeMemberId: string;
  onSelectMember: (id: string) => void;
  onOpenAddMember: () => void;
}

export const FamilyMemberTabs: React.FC<FamilyMemberTabsProps> = ({
  members,
  activeMemberId,
  onSelectMember,
  onOpenAddMember,
}) => {
  const getRelationLabel = (rel: FamilyRelation) => {
    switch (rel) {
      case "CHILD":
        return "Bé con";
      case "SELF":
        return "Bản thân";
      case "SPOUSE":
        return "Vợ / Chồng";
      case "PARENT":
        return "Bố / Mẹ";
      case "GRANDPARENT":
        return "Ông / Bà";
      default:
        return "Người thân";
    }
  };

  return (
    <div className="flex items-center gap-2.5 overflow-x-auto scrollbar-none pb-2">
      {members.map((mem) => {
        const isActive = mem.id === activeMemberId;
        const relLabel = getRelationLabel(mem.relation);

        return (
          <button
            key={mem.id}
            type="button"
            onClick={() => onSelectMember(mem.id)}
            className={`flex items-center gap-2.5 px-4 py-2.5 rounded-2xl border-2 transition-all shrink-0 text-left cursor-pointer ${
              isActive
                ? "bg-white border-[#800028] shadow-md shadow-rose-950/10 ring-2 ring-[#800028]/10"
                : "bg-neutral-50/90 hover:bg-white border-neutral-200 text-slate-600"
            }`}
          >
            {/* Avatar Emoji */}
            <div
              className={`w-9 h-9 rounded-xl flex items-center justify-center text-lg shrink-0 ${
                isActive ? "bg-rose-50" : "bg-white border border-neutral-200"
              }`}
            >
              {mem.avatarEmoji || "👤"}
            </div>

            {/* Info */}
            <div>
              <div className="flex items-center gap-1.5">
                <span
                  className={`font-black text-xs ${
                    isActive ? "text-[#800028]" : "text-slate-900"
                  }`}
                >
                  {mem.fullName}
                </span>
              </div>
              <div className="flex items-center gap-1 text-[10px] text-slate-400 font-medium">
                <span>{relLabel}</span>
                {mem._count?.supplementSchedules !== undefined && (
                  <>
                    <span>•</span>
                    <span className="font-mono">
                      {mem._count.supplementSchedules} vi chất
                    </span>
                  </>
                )}
              </div>
            </div>
          </button>
        );
      })}

      {/* Button Thêm Thành Viên */}
      <button
        type="button"
        onClick={onOpenAddMember}
        className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-2xl border-2 border-dashed border-slate-300 hover:border-[#800028] hover:bg-rose-50/50 text-slate-600 hover:text-[#800028] transition-all shrink-0 text-xs font-bold cursor-pointer"
      >
        <Plus className="w-4 h-4 stroke-[2.5]" />
        <span>Thêm người thân</span>
      </button>
    </div>
  );
};
