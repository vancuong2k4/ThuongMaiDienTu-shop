"use client";

// ============================================================
// components/admin/flights/FlightTable.tsx
// Bảng Quản Trị Chuyến Bay Air Cargo & Điều Phối Chuỗi Lạnh
// ============================================================

import React, { useState } from "react";
import Link from "next/link";
import {
  Plane,
  Thermometer,
  ExternalLink,
  PlusCircle,
  Trash2,
  AlertCircle,
  Clock,
  Compass,
  CheckCircle2,
} from "lucide-react";
import type { AdminFlightItem, FlightStatusType } from "./types";

interface FlightTableProps {
  flights: AdminFlightItem[];
  onOpenAddSensorLog: (flight: AdminFlightItem) => void;
  onRefresh: () => void;
}

export const FlightTable: React.FC<FlightTableProps> = ({
  flights,
  onOpenAddSensorLog,
  onRefresh,
}) => {
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleStatusChange = async (
    flightId: string,
    newStatus: FlightStatusType
  ) => {
    try {
      setUpdatingId(flightId);
      const res = await fetch(`/api/admin/air-cargo/flights/${flightId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ flightStatus: newStatus }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        alert(data.message || "Không thể cập nhật trạng thái chuyến bay.");
        return;
      }
      onRefresh();
    } catch {
      alert("Lỗi kết nối khi cập nhật trạng thái.");
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDeleteFlight = async (flight: AdminFlightItem) => {
    if (
      !confirm(
        `Bạn có chắc chắn muốn xóa chuyến bay ${flight.flightNumber} không? Dữ liệu cảm biến và mốc hành trình liên quan sẽ bị xóa vĩnh viễn.`
      )
    ) {
      return;
    }

    try {
      setDeletingId(flight.id);
      const res = await fetch(`/api/admin/air-cargo/flights/${flight.id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        alert(data.message || "Không thể xóa chuyến bay.");
        return;
      }
      onRefresh();
    } catch {
      alert("Lỗi kết nối khi xóa chuyến bay.");
    } finally {
      setDeletingId(null);
    }
  };

  const getStatusBadge = (status: FlightStatusType) => {
    switch (status) {
      case "CRUISING":
        return {
          bg: "bg-sky-50 text-sky-700 border-sky-200",
          dot: "bg-sky-500 animate-pulse",
          label: "Đang bay trên không",
        };
      case "STORED_COLD":
        return {
          bg: "bg-emerald-50 text-emerald-700 border-emerald-200",
          dot: "bg-emerald-500",
          label: "Đã nhập kho lạnh",
        };
      case "CUSTOMS_CLEARING":
        return {
          bg: "bg-amber-50 text-amber-700 border-amber-200",
          dot: "bg-amber-500",
          label: "Đang thông quan",
        };
      case "LANDED":
        return {
          bg: "bg-purple-50 text-purple-700 border-purple-200",
          dot: "bg-purple-500",
          label: "Đã hạ cánh",
        };
      case "DEPARTED":
        return {
          bg: "bg-blue-50 text-blue-700 border-blue-200",
          dot: "bg-blue-500",
          label: "Đã cất cánh",
        };
      case "SCHEDULED":
      default:
        return {
          bg: "bg-slate-50 text-slate-700 border-slate-200",
          dot: "bg-slate-400",
          label: "Đã lên lịch",
        };
    }
  };

  if (flights.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3">
        <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
          <Plane className="w-6 h-6" />
        </div>
        <h3 className="font-bold text-slate-800 text-base">
          Chưa có chuyến bay Air Cargo nào
        </h3>
        <p className="text-xs text-slate-500 max-w-sm mx-auto">
          Khởi tạo chuyến bay mới từ Melbourne hoặc Sydney để kích hoạt hệ thống Radar hàng không và giám sát chuỗi lạnh.
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
              <th className="py-3 px-4">Chuyến bay / Hãng</th>
              <th className="py-3 px-4">Lộ trình & Máy bay</th>
              <th className="py-3 px-4">Thời gian bay</th>
              <th className="py-3 px-4">Trạng thái bay</th>
              <th className="py-3 px-4">Tiến độ</th>
              <th className="py-3 px-4">Nhiệt độ cảm biến</th>
              <th className="py-3 px-4 text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {flights.map((flight) => {
              const statusBadge = getStatusBadge(flight.flightStatus);
              const flag =
                flight.carrier === "QANTAS_FREIGHT" ? "🇦🇺" : "🇻🇳";
              const carrierName =
                flight.carrier === "QANTAS_FREIGHT"
                  ? "Qantas Freight"
                  : "Vietnam Airlines Cargo";

              const progress = flight.flightProgressPercent || 0;
              const latestLog = flight.sensorLogs?.[0];
              const temp =
                latestLog?.temperatureCelsius !== undefined
                  ? latestLog.temperatureCelsius
                  : flight.averageTemp !== null && flight.averageTemp !== undefined
                  ? flight.averageTemp
                  : null;

              const isTempSafe =
                temp !== null
                  ? temp >= flight.targetTempMin && temp <= flight.targetTempMax
                  : true;

              return (
                <tr
                  key={flight.id}
                  className="hover:bg-slate-50/60 transition-colors"
                >
                  {/* Flight & Carrier */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2.5">
                      <span className="text-xl" title={carrierName}>
                        {flag}
                      </span>
                      <div>
                        <div className="font-mono font-black text-sm text-[#800028] flex items-center gap-1.5">
                          <span>{flight.flightNumber}</span>
                          <span className="text-[10px] font-sans font-bold bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded">
                            {flight.coldChainCategory === "ULTRA_COLD_CHERRY"
                              ? "Lạnh 0-4°C"
                              : flight.coldChainCategory === "COOL_PROBIOTICS"
                              ? "Mát 2-8°C"
                              : "Mát 18-24°C"}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 mt-0.5">
                          {carrierName}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Route & Aircraft */}
                  <td className="py-3.5 px-4">
                    <div className="font-medium text-slate-800">
                      <span className="font-bold">{flight.originAirport}</span>{" "}
                      ({flight.originCity}) ➔{" "}
                      <span className="font-bold">{flight.destAirport}</span>{" "}
                      ({flight.destCity})
                    </div>
                    <div className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                      <Plane className="w-3 h-3 text-slate-400" />
                      <span>{flight.aircraftType}</span>
                      {flight.totalCargoWeightKg && (
                        <span>
                          • {(flight.totalCargoWeightKg / 1000).toFixed(1)} tấn
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Times */}
                  <td className="py-3.5 px-4 font-mono text-[11px] text-slate-600">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-400" />
                      <span>
                        Khởi hành:{" "}
                        {new Date(flight.scheduledDeparture).toLocaleDateString(
                          "vi-VN",
                          { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" }
                        )}
                      </span>
                    </div>
                    <div className="text-slate-400 mt-0.5">
                      Đến:{" "}
                      {new Date(flight.scheduledArrival).toLocaleDateString(
                        "vi-VN",
                        { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" }
                      )}
                    </div>
                  </td>

                  {/* Flight Status Selector */}
                  <td className="py-3.5 px-4">
                    <div className="space-y-1">
                      <select
                        value={flight.flightStatus}
                        disabled={updatingId === flight.id}
                        onChange={(e) =>
                          handleStatusChange(
                            flight.id,
                            e.target.value as FlightStatusType
                          )
                        }
                        className={`text-xs font-bold rounded-lg px-2.5 py-1 border transition-colors cursor-pointer ${statusBadge.bg}`}
                      >
                        <option value="SCHEDULED">Đã lên lịch</option>
                        <option value="DEPARTED">Đã cất cánh</option>
                        <option value="CRUISING">Đang bay trên không</option>
                        <option value="LANDED">Đã hạ cánh</option>
                        <option value="CUSTOMS_CLEARING">Đang thông quan</option>
                        <option value="STORED_COLD">Đã nhập kho lạnh</option>
                      </select>
                      {updatingId === flight.id && (
                        <p className="text-[10px] text-amber-600 animate-pulse">
                          Đang lưu...
                        </p>
                      )}
                    </div>
                  </td>

                  {/* Progress Bar */}
                  <td className="py-3.5 px-4">
                    <div className="w-24 space-y-1">
                      <div className="flex items-center justify-between text-[11px] font-mono">
                        <span className="font-bold text-slate-700">
                          {progress}%
                        </span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            progress >= 100
                              ? "bg-emerald-500"
                              : "bg-sky-500"
                          }`}
                          style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
                        />
                      </div>
                    </div>
                  </td>

                  {/* Cold-Chain Temp Sensor */}
                  <td className="py-3.5 px-4">
                    <div className="space-y-1">
                      {temp !== null ? (
                        <div className="flex items-center gap-1.5">
                          <Thermometer
                            className={`w-3.5 h-3.5 ${
                              isTempSafe ? "text-emerald-600" : "text-rose-600"
                            }`}
                          />
                          <span
                            className={`font-mono font-bold text-xs ${
                              isTempSafe ? "text-emerald-700" : "text-rose-600"
                            }`}
                          >
                            {temp}°C
                          </span>
                          <span
                            className={`text-[9px] px-1 py-0.2 rounded font-bold uppercase ${
                              isTempSafe
                                ? "bg-emerald-100 text-emerald-800"
                                : "bg-rose-100 text-rose-800"
                            }`}
                          >
                            {isTempSafe ? "An toàn" : "Cảnh báo"}
                          </span>
                        </div>
                      ) : (
                        <span className="text-slate-400 text-[11px]">
                          Chưa có cảm biến
                        </span>
                      )}
                      <p className="text-[10px] text-slate-400">
                        Ngưỡng: {flight.targetTempMin}°C - {flight.targetTempMax}°C
                      </p>
                    </div>
                  </td>

                  {/* Actions */}
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      {/* Log Sensor Button */}
                      <button
                        onClick={() => onOpenAddSensorLog(flight)}
                        title="Ghi nhận bản đọc cảm biến nhiệt độ"
                        className="p-1.5 text-sky-600 hover:text-sky-800 hover:bg-sky-50 rounded-lg transition-colors flex items-center gap-1 text-[11px] font-semibold border border-sky-200"
                      >
                        <PlusCircle className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Ghi nhiệt độ</span>
                      </button>

                      {/* Live Radar External Link */}
                      <Link
                        href={`/tra-cuu-air-cargo/${flight.flightNumber}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        title="Xem bản đồ Radar trực tiếp"
                        className="p-1.5 text-slate-600 hover:text-[#800028] hover:bg-slate-100 rounded-lg transition-colors"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </Link>

                      {/* Delete Flight Button */}
                      <button
                        onClick={() => handleDeleteFlight(flight)}
                        disabled={deletingId === flight.id}
                        title="Xóa chuyến bay"
                        className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors disabled:opacity-40"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
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
