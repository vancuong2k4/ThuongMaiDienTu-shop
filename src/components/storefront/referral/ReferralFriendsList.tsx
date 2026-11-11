"use client";

// ============================================================
// components/storefront/referral/ReferralFriendsList.tsx
// Danh Sách Bạn Bè Đã Giới Thiệu & Tiến Độ Đơn Đầu (Stage 12.4)
// ============================================================

import React from "react";
import {
  Users,
  Award,
  Clock,
  Truck,
  CheckCircle2,
  AlertCircle,
  Share2,
} from "lucide-react";
import type { InvitedFriendItem, ReferralStatusType } from "./types";

interface ReferralFriendsListProps {
  friends: InvitedFriendItem[];
  onInviteClick?: () => void;
}

const STATUS_CONFIG: Record<
  ReferralStatusType,
  { label: string; bg: string; text: string; border: string; icon: React.ElementType }
> = {
  PENDING: {
    label: "Chờ đơn đầu",
    bg: "bg-amber-50",
    text: "text-amber-800",
    border: "border-amber-200",
    icon: Clock,
  },
  QUALIFIED: {
    label: "Đang giao hàng",
    bg: "bg-blue-50",
    text: "text-blue-800",
    border: "border-blue-200",
    icon: Truck,
  },
  REWARDED: {
    label: "Đã nhận +500 pts",
    bg: "bg-emerald-50",
    text: "text-emerald-800",
    border: "border-emerald-200",
    icon: CheckCircle2,
  },
  EXPIRED: {
    label: "Hết hạn",
    bg: "bg-slate-100",
    text: "text-slate-600",
    border: "border-slate-200",
    icon: AlertCircle,
  },
};

export const ReferralFriendsList: React.FC<ReferralFriendsListProps> = ({
  friends,
  onInviteClick,
}) => {
  return (
    <div className="bg-white rounded-3xl border border-neutral-200/90 shadow-sm p-6 sm:p-8 space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg sm:text-xl font-black text-neutral-900 tracking-tight">
            Bạn Bè Đã Tham Gia ({friends.length})
          </h2>
          <p className="text-xs sm:text-sm text-neutral-500 mt-0.5">
            Theo dõi tiến trình hoàn tất đơn hàng đầu tiên của bạn bè được giới thiệu.
          </p>
        </div>
      </div>

      {friends.length === 0 ? (
        <div className="py-12 px-4 text-center bg-slate-50/70 rounded-2xl border border-slate-150">
          <div className="w-14 h-14 rounded-2xl bg-rose-50 text-[#800028] flex items-center justify-center mx-auto mb-3">
            <Users className="w-7 h-7" />
          </div>
          <h3 className="text-base font-bold text-neutral-800">
            Bạn chưa mời người bạn nào
          </h3>
          <p className="text-xs text-neutral-500 max-w-sm mx-auto mt-1 mb-5">
            Hãy gửi mã mời hoặc chia sẻ liên kết trực tiếp để bạn bè nhận ngay Voucher 50.000₫!
          </p>
          {onInviteClick && (
            <button
              type="button"
              onClick={onInviteClick}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-[#800028] hover:bg-[#660020] transition-colors shadow-sm"
            >
              <Share2 className="w-4 h-4" />
              Mời bạn bè ngay
            </button>
          )}
        </div>
      ) : (
        <div className="divide-y divide-neutral-100">
          {friends.map((friend) => {
            const statusCfg = STATUS_CONFIG[friend.status] || STATUS_CONFIG.PENDING;
            const StatusIcon = statusCfg.icon;

            return (
              <div
                key={friend.id}
                className="py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                {/* Thông tin bạn mới */}
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center justify-center font-bold text-sm shrink-0">
                    {friend.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-bold text-sm text-neutral-900">
                      {friend.name}
                    </p>
                    <p className="text-xs text-neutral-500 font-mono">
                      {friend.maskedEmail}
                    </p>
                    <p className="text-[11px] text-neutral-400 mt-0.5">
                      Đã tham gia:{" "}
                      {new Date(friend.joinedAt).toLocaleDateString("vi-VN", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                </div>

                {/* Trạng thái & Phần thưởng */}
                <div className="flex items-center gap-3 self-end sm:self-center">
                  {friend.status === "REWARDED" ? (
                    <div className="text-right">
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold border bg-emerald-50 text-emerald-800 border-emerald-200">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        +{friend.rewardPoints} điểm THUYNGA Club
                      </span>
                    </div>
                  ) : (
                    <span
                      className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold border ${statusCfg.bg} ${statusCfg.text} ${statusCfg.border}`}
                    >
                      <StatusIcon className="w-3.5 h-3.5" />
                      {statusCfg.label}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
