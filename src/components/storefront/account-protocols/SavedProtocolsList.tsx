"use client";

// ============================================================
// components/storefront/account-protocols/SavedProtocolsList.tsx
// Danh Sách Phác Đồ Đã Lưu & Lịch Hẹn Tư Vấn Của Tôi (Phase 16)
// ============================================================

import React from "react";
import Link from "next/link";
import {
  Stethoscope,
  Calendar,
  Clock,
  Phone,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  ShoppingBag,
} from "lucide-react";
import { AccountProtocolItem } from "./types";
import {
  HEALTH_TARGET_GROUPS_CONFIG,
  CONSULTATION_STATUS_CONFIG,
} from "@/lib/validations/protocol";

interface SavedProtocolsListProps {
  assessments: AccountProtocolItem[];
}

export const SavedProtocolsList: React.FC<SavedProtocolsListProps> = ({
  assessments,
}) => {
  if (assessments.length === 0) {
    return (
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-12 text-center space-y-3">
        <Stethoscope className="w-12 h-12 text-slate-300 mx-auto" />
        <h4 className="font-bold text-slate-800 text-base">
          Bạn chưa lưu phác đồ dinh dưỡng nào
        </h4>
        <p className="text-xs text-slate-500 max-w-sm mx-auto">
          Làm bài trắc nghiệm sức khỏe thông minh để nhận lộ trình bổ sung vi chất Úc chuẩn y khoa cho bạn và gia đình.
        </p>
        <Link
          href="/tu-van-dinh-duong"
          className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-[#800028] text-white text-xs font-bold rounded-xl shadow-sm hover:shadow transition-all"
        >
          <span>Làm bài trắc nghiệm ngay</span>
        </Link>
      </div>
    );
  }

  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="space-y-4">
      {assessments.map((a) => {
        const groupConf =
          HEALTH_TARGET_GROUPS_CONFIG[a.targetGroup] ||
          HEALTH_TARGET_GROUPS_CONFIG.BABY_KIDS;
        const protocol = a.protocol;
        const latestBooking = a.consultationBookings?.[0];

        return (
          <div
            key={a.id}
            className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 space-y-4 hover:border-slate-300 transition-all"
          >
            {/* Header Thẻ */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span
                  className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${groupConf.badgeColor}`}
                >
                  {groupConf.label}
                </span>
                <span className="text-xs text-slate-400">
                  Ngày đánh giá: {formatDate(a.createdAt)}
                </span>
              </div>

              {latestBooking && (
                <div className="flex items-center gap-1.5 text-xs font-semibold self-start sm:self-auto">
                  <span className="text-slate-500">Lịch tư vấn:</span>
                  <span
                    className={`px-2 py-0.5 rounded-full border text-[11px] ${
                      CONSULTATION_STATUS_CONFIG[latestBooking.status]?.badgeColor ||
                      "bg-slate-100 text-slate-700"
                    }`}
                  >
                    {CONSULTATION_STATUS_CONFIG[latestBooking.status]?.label ||
                      latestBooking.status}
                  </span>
                </div>
              )}
            </div>

            {/* Thông Tin Phác Đồ */}
            {protocol ? (
              <div className="space-y-2">
                <h4 className="font-bold text-slate-900 text-base">
                  {protocol.title}
                </h4>
                {protocol.subtitle && (
                  <p className="text-xs text-slate-500 line-clamp-1">
                    {protocol.subtitle}
                  </p>
                )}

                <div className="flex items-center flex-wrap gap-1.5 pt-1">
                  {protocol.keyNutrients.slice(0, 4).map((nutr, idx) => (
                    <span
                      key={idx}
                      className="text-[11px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-medium"
                    >
                      {nutr}
                    </span>
                  ))}
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-500 italic">
                Chưa gán phác đồ cụ thể. Vui lòng liên hệ Dược sĩ THUYNGA Shop để được tư vấn trực tiếp.
              </p>
            )}

            {/* Chi Tiết Lịch Hẹn Tư Vấn (Nếu có) */}
            {latestBooking && (
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80 text-xs text-slate-700 space-y-1">
                <div className="flex items-center gap-2 font-medium">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  <span>
                    Giờ gọi hẹn trước: <strong>{latestBooking.preferredTimeSlot}</strong> ngày{" "}
                    <strong>{formatDate(latestBooking.preferredDate)}</strong>
                  </span>
                </div>
                {latestBooking.pharmacistNotes && (
                  <div className="text-[11px] text-emerald-800 bg-emerald-50 p-2 rounded-xl border border-emerald-100 mt-1">
                    <strong>Chỉ dẫn của Dược sĩ:</strong> {latestBooking.pharmacistNotes}
                  </div>
                )}
              </div>
            )}

            {/* Thao tác */}
            <div className="pt-2 flex items-center justify-between gap-3">
              <span className="text-xs text-slate-500 font-medium">
                {protocol?.items?.length || 0} sản phẩm combo
              </span>

              {protocol && (
                <Link
                  href={`/tu-van-dinh-duong?protocol=${protocol.slug}`}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#800028] hover:bg-[#660020] text-white text-xs font-semibold rounded-xl shadow-xs hover:shadow transition-all"
                >
                  <span>Xem Lại Phác Đồ Chi Tiết</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </Link>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
