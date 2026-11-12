"use client";

// ============================================================
// components/admin/protocols/ConsultationTable.tsx
// Bảng Danh Sách Lịch Hẹn Tư Vấn Dược Sĩ 1-1 (Phase 16)
// ============================================================

import React, { useState } from "react";
import {
  Calendar,
  Phone,
  Clock,
  User,
  FileText,
  Trash2,
  CheckCircle2,
  AlertCircle,
  MessageSquare,
} from "lucide-react";
import { ConsultationBookingItem } from "./types";
import { CONSULTATION_STATUS_CONFIG } from "@/lib/validations/protocol";
import { ConsultationStatus } from "@prisma/client";

interface ConsultationTableProps {
  bookings: ConsultationBookingItem[];
  loading: boolean;
  onUpdateStatus: (id: string, newStatus: ConsultationStatus) => Promise<void>;
  onOpenNotes: (booking: ConsultationBookingItem) => void;
  onDelete: (id: string) => Promise<void>;
}

export const ConsultationTable: React.FC<ConsultationTableProps> = ({
  bookings,
  loading,
  onUpdateStatus,
  onOpenNotes,
  onDelete,
}) => {
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString("vi-VN", {
        weekday: "short",
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa lịch hẹn tư vấn này?")) {
      return;
    }
    setDeletingId(id);
    try {
      await onDelete(id);
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return (
      <div className="bg-white border border-slate-200/90 rounded-2xl p-12 text-center shadow-sm">
        <div className="w-8 h-8 border-3 border-[#800028] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-sm font-medium text-slate-600">Đang tải danh sách lịch hẹn tư vấn...</p>
      </div>
    );
  }

  if (bookings.length === 0) {
    return (
      <div className="bg-white border border-slate-200/90 rounded-2xl p-12 text-center shadow-sm">
        <Calendar className="w-12 h-12 text-slate-300 mx-auto mb-3" />
        <h3 className="text-base font-semibold text-slate-800">Không có lịch hẹn tư vấn nào</h3>
        <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
          Khi khách hàng đặt lịch hẹn từ trang trắc nghiệm hoặc chi tiết phác đồ, danh sách sẽ hiển thị tại đây.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-slate-200/90 rounded-2xl shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs sm:text-sm">
          <thead className="bg-slate-50/80 border-b border-slate-200/80 text-[11px] uppercase tracking-wider text-slate-500 font-semibold">
            <tr>
              <th className="py-3 px-4">Khách Hàng & Liên Hệ</th>
              <th className="py-3 px-4">Thời Gian Hẹn Gọi</th>
              <th className="py-3 px-4">Vấn Đề Sức Khỏe</th>
              <th className="py-3 px-4">Phác Đồ Đã Gợi Ý</th>
              <th className="py-3 px-4">Trạng Thái</th>
              <th className="py-3 px-4 text-center">Ghi Chú Dược Sĩ</th>
              <th className="py-3 px-4 text-right">Thao Tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {bookings.map((b) => {
              const statusConf =
                CONSULTATION_STATUS_CONFIG[b.status] ||
                CONSULTATION_STATUS_CONFIG.PENDING;

              return (
                <tr key={b.id} className="hover:bg-slate-50/50 transition-colors">
                  {/* Khách Hàng & Liên Hệ */}
                  <td className="py-3.5 px-4">
                    <div className="space-y-0.5">
                      <div className="font-bold text-slate-900 flex items-center gap-1.5">
                        <span>{b.customerName}</span>
                        {b.user?.membershipTier && (
                          <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.2 rounded font-semibold uppercase">
                            {b.user.membershipTier}
                          </span>
                        )}
                      </div>
                      <a
                        href={`tel:${b.phone}`}
                        className="text-xs font-mono font-medium text-sky-700 hover:underline flex items-center gap-1"
                      >
                        <Phone className="w-3 h-3" />
                        <span>{b.phone}</span>
                      </a>
                    </div>
                  </td>

                  {/* Thời Gian Hẹn Gọi */}
                  <td className="py-3.5 px-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-1 text-xs font-semibold text-slate-800">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        <span>{formatDate(b.preferredDate)}</span>
                      </div>
                      <div className="inline-flex items-center gap-1 text-[11px] font-mono font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                        <Clock className="w-3 h-3 text-slate-400" />
                        <span>{b.preferredTimeSlot}</span>
                      </div>
                    </div>
                  </td>

                  {/* Vấn Đề Sức Khỏe */}
                  <td className="py-3.5 px-4 max-w-[240px]">
                    <p className="text-xs text-slate-700 line-clamp-2 leading-relaxed">
                      {b.healthConcerns}
                    </p>
                  </td>

                  {/* Phác Đồ Đã Gợi Ý */}
                  <td className="py-3.5 px-4 max-w-[180px]">
                    {b.assessment?.protocol ? (
                      <span className="text-xs font-medium text-[#800028] bg-rose-50 px-2 py-1 rounded-lg border border-rose-100 line-clamp-1 block truncate">
                        {b.assessment.protocol.title}
                      </span>
                    ) : (
                      <span className="text-[11px] text-slate-400 italic">
                        Chưa làm bài test
                      </span>
                    )}
                  </td>

                  {/* Trạng Thái */}
                  <td className="py-3.5 px-4">
                    <select
                      value={b.status}
                      onChange={(e) =>
                        onUpdateStatus(b.id, e.target.value as ConsultationStatus)
                      }
                      className={`text-xs font-semibold px-2.5 py-1 rounded-lg border focus:outline-none cursor-pointer ${statusConf.badgeColor}`}
                    >
                      {Object.entries(CONSULTATION_STATUS_CONFIG).map(
                        ([stKey, stVal]) => (
                          <option key={stKey} value={stKey}>
                            {stVal.label}
                          </option>
                        )
                      )}
                    </select>
                  </td>

                  {/* Ghi Chú Dược Sĩ */}
                  <td className="py-3.5 px-4 text-center">
                    <button
                      onClick={() => onOpenNotes(b)}
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium border transition-colors ${
                        b.pharmacistNotes
                          ? "bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100"
                          : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
                      }`}
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>{b.pharmacistNotes ? "Xem ghi chú" : "Thêm ghi chú"}</span>
                    </button>
                  </td>

                  {/* Thao Tác */}
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => handleDelete(b.id)}
                      disabled={deletingId === b.id}
                      title="Xóa lịch hẹn"
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
