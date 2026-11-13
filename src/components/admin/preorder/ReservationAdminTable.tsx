"use client";

// ============================================================
// components/admin/preorder/ReservationAdminTable.tsx
// Bảng Quản Trị Đơn Đặt Chỗ & Xếp Chuyến Bay Air Cargo (Phase 21)
// ============================================================

import React, { useState } from "react";
import Link from "next/link";
import {
  Plane,
  CheckCircle2,
  ExternalLink,
  MapPin,
  Phone,
  User,
  ShieldCheck,
} from "lucide-react";
import type { AdminReservationItem, ReservationStatusType } from "./types";

interface ReservationAdminTableProps {
  reservations: AdminReservationItem[];
  onRefresh: () => void;
}

export const ReservationAdminTable: React.FC<ReservationAdminTableProps> = ({
  reservations,
  onRefresh,
}) => {
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [editingFlightId, setEditingFlightId] = useState<string | null>(null);
  const [flightInput, setFlightInput] = useState("");

  const formatVND = (n: number | any) => {
    return new Intl.NumberFormat("vi-VN").format(Number(n)) + "₫";
  };

  const handleStatusChange = async (
    reservationId: string,
    newStatus: ReservationStatusType
  ) => {
    try {
      setUpdatingId(reservationId);
      const res = await fetch(
        `/api/admin/preorders/reservations/${reservationId}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: newStatus }),
        }
      );
      const data = await res.json();
      if (!res.ok || !data.success) {
        alert(data.message || "Không thể cập nhật trạng thái đơn đặt chỗ.");
        return;
      }
      onRefresh();
    } catch {
      alert("Lỗi kết nối khi cập nhật trạng thái.");
    } finally {
      setUpdatingId(null);
    }
  };

  const handleSaveFlight = async (reservation: AdminReservationItem) => {
    try {
      setUpdatingId(reservation.id);
      const res = await fetch(
        `/api/admin/preorders/reservations/${reservation.id}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            status: "ALLOCATED_FLIGHT",
            flightNumber: flightInput.trim().toUpperCase() || undefined,
          }),
        }
      );
      const data = await res.json();
      if (!res.ok || !data.success) {
        alert(data.message || "Không thể xếp chuyến bay.");
        return;
      }
      setEditingFlightId(null);
      onRefresh();
    } catch {
      alert("Lỗi kết nối khi gán chuyến bay.");
    } finally {
      setUpdatingId(null);
    }
  };

  if (reservations.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3">
        <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
          <ShieldCheck className="w-6 h-6" />
        </div>
        <h3 className="font-bold text-slate-800 text-base">
          Chưa có đơn đặt giữ chỗ nào
        </h3>
        <p className="text-xs text-slate-500 max-w-sm mx-auto">
          Đơn cọc từ khách hàng sẽ xuất hiện tại đây kèm số tiền cọc 30% đã chuyển khoản qua VietQR Napas 24/7.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[11px]">
              <th className="py-3 px-4">Mã đơn & Khách hàng</th>
              <th className="py-3 px-4">Quy cách & Chiến dịch</th>
              <th className="py-3 px-4">Tiền cọc / Tổng tiền</th>
              <th className="py-3 px-4">Trạng thái cọc</th>
              <th className="py-3 px-4">Chuyến bay Air gán</th>
              <th className="py-3 px-4 text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {reservations.map((res) => {
              const isEditingFlight = editingFlightId === res.id;

              return (
                <tr key={res.id} className="hover:bg-slate-50/60 transition-colors">
                  {/* Code & Customer */}
                  <td className="py-3.5 px-4">
                    <div className="space-y-1">
                      <span className="font-mono font-black text-[#800028] text-xs">
                        {res.reservationCode}
                      </span>
                      <div className="font-bold text-slate-900 text-xs">
                        {res.customerName}
                      </div>
                      <div className="text-[11px] text-slate-500 flex items-center gap-1">
                        <Phone className="w-3 h-3 text-slate-400" />
                        <span className="font-mono">{res.customerPhone}</span>
                      </div>
                      <div className="text-[10px] text-slate-400 max-w-xs truncate" title={res.deliveryAddress}>
                        {res.deliveryAddress}
                      </div>
                    </div>
                  </td>

                  {/* Campaign & Tier */}
                  <td className="py-3.5 px-4">
                    <div className="space-y-0.5">
                      <span className="font-bold text-slate-900 block text-xs">
                        {res.tier.name} (x{res.quantity})
                      </span>
                      <span className="text-[11px] text-slate-500 block truncate max-w-xs">
                        {res.campaign.title}
                      </span>
                      <span className="text-[10px] text-slate-400 block font-mono">
                        {res.campaign.flightDepartureWeek}
                      </span>
                    </div>
                  </td>

                  {/* Financials */}
                  <td className="py-3.5 px-4 font-mono text-xs">
                    <div className="space-y-0.5">
                      <div className="font-black text-emerald-700">
                        Cọc: {formatVND(res.depositPaid)}
                      </div>
                      <div className="text-slate-500 text-[11px]">
                        Tổng: {formatVND(res.totalPrice)}
                      </div>
                      <div className="text-[10px] text-slate-400">
                        Còn lại: {formatVND(res.remainingAmount)}
                      </div>
                    </div>
                  </td>

                  {/* Status Dropdown */}
                  <td className="py-3.5 px-4">
                    <div className="space-y-1">
                      <select
                        value={res.status}
                        disabled={updatingId === res.id}
                        onChange={(e) =>
                          handleStatusChange(
                            res.id,
                            e.target.value as ReservationStatusType
                          )
                        }
                        className="text-xs font-bold rounded-lg px-2.5 py-1 border border-slate-200 bg-white cursor-pointer focus:border-[#800028] outline-hidden"
                      >
                        <option value="CONFIRMED_DEPOSIT">Đã cọc thành công</option>
                        <option value="PAID_FULL">Đã thanh toán đủ</option>
                        <option value="ALLOCATED_FLIGHT">Đã xếp chuyến bay</option>
                        <option value="SHIPPED">Đang giao hàng</option>
                        <option value="COMPLETED">Đã hoàn thành</option>
                        <option value="CANCELLED">Hủy & hoàn tiền</option>
                      </select>
                      {updatingId === res.id && (
                        <p className="text-[10px] text-amber-600 animate-pulse">
                          Đang lưu...
                        </p>
                      )}
                    </div>
                  </td>

                  {/* Flight Assignment */}
                  <td className="py-3.5 px-4">
                    {isEditingFlight ? (
                      <div className="flex items-center gap-1">
                        <input
                          type="text"
                          placeholder="VD: VN780"
                          value={flightInput}
                          onChange={(e) => setFlightInput(e.target.value)}
                          className="w-20 px-2 py-1 text-xs font-mono font-bold uppercase rounded border border-slate-300 outline-hidden"
                        />
                        <button
                          onClick={() => handleSaveFlight(res)}
                          className="p-1 bg-[#800028] text-white rounded text-xs font-bold"
                        >
                          Lưu
                        </button>
                        <button
                          onClick={() => setEditingFlightId(null)}
                          className="p-1 text-slate-400 hover:text-slate-600 text-xs"
                        >
                          X
                        </button>
                      </div>
                    ) : res.flightNumber ? (
                      <div className="flex items-center gap-1.5 font-mono text-xs">
                        <Plane className="w-3.5 h-3.5 text-sky-600" />
                        <Link
                          href={`/tra-cuu-air-cargo/${res.flightNumber}`}
                          target="_blank"
                          className="font-bold text-sky-700 hover:underline flex items-center gap-0.5"
                        >
                          <span>{res.flightNumber}</span>
                          <ExternalLink className="w-3 h-3" />
                        </Link>
                      </div>
                    ) : (
                      <button
                        onClick={() => {
                          setEditingFlightId(res.id);
                          setFlightInput("VN780");
                        }}
                        className="text-[11px] text-sky-600 hover:underline font-semibold"
                      >
                        + Xếp chuyến bay
                      </button>
                    )}
                  </td>

                  {/* Actions */}
                  <td className="py-3.5 px-4 text-right">
                    <span className="text-[11px] text-slate-400 font-mono">
                      {new Date(res.createdAt).toLocaleDateString("vi-VN", {
                        day: "2-digit",
                        month: "2-digit",
                      })}
                    </span>
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
