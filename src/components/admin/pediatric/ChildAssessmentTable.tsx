"use client";

// ============================================================
// components/admin/pediatric/ChildAssessmentTable.tsx
// Bảng Danh Sách Đánh Giá Thể Trạng Trẻ Em (CRM Dược Sĩ - Phase 23)
// ============================================================

import React, { useState } from "react";
import {
  Baby,
  Phone,
  Search,
  Filter,
  Activity,
  Scale,
  CheckCircle2,
  AlertTriangle,
  Stethoscope,
} from "lucide-react";
import type { AdminChildAssessmentItem } from "./types";

interface ChildAssessmentTableProps {
  items: AdminChildAssessmentItem[];
}

export const ChildAssessmentTable: React.FC<ChildAssessmentTableProps> = ({
  items,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("ALL");

  const filteredItems = items.filter((item) => {
    const matchesSearch =
      item.childName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.user?.name && item.user.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (item.user?.phone && item.user.phone.includes(searchTerm));

    const matchesStatus =
      selectedStatus === "ALL" ||
      (selectedStatus === "UNDERWEIGHT" &&
        (item.weightStatus === "UNDERWEIGHT" ||
          item.weightStatus === "SEVERELY_UNDERWEIGHT")) ||
      (selectedStatus === "STUNTED" && item.heightStatus === "STUNTED") ||
      (selectedStatus === "NORMAL" &&
        item.weightStatus === "NORMAL" &&
        item.heightStatus === "NORMAL");

    return matchesSearch && matchesStatus;
  });

  const getWeightBadge = (status: string, z: number) => {
    switch (status) {
      case "SEVERELY_UNDERWEIGHT":
        return <span className="px-2 py-0.5 rounded text-[10px] font-black bg-rose-100 text-rose-800 border border-rose-300">Rất nhẹ cân (Z: {z})</span>;
      case "UNDERWEIGHT":
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-300">Nhẹ cân (Z: {z})</span>;
      case "OVERWEIGHT":
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-100 text-purple-800 border border-purple-300">Thừa cân (Z: {z})</span>;
      default:
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">Chuẩn (Z: {z})</span>;
    }
  };

  const getHeightBadge = (status: string, z: number) => {
    switch (status) {
      case "STUNTED":
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-800 border border-rose-300">Thấp còi (Z: {z})</span>;
      case "TALL":
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-sky-100 text-sky-800 border border-sky-300">Cao vượt trội (Z: {z})</span>;
      default:
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">Chuẩn (Z: {z})</span>;
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200/80 shadow-xs overflow-hidden">
      {/* Header and Filter */}
      <div className="p-4 sm:p-5 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50/50">
        <div>
          <h3 className="text-base font-black text-gray-900">
            Hồ Sơ Đánh Giá Thể Trạng Trẻ Em (Lead Tư Vấn Dược Sĩ)
          </h3>
          <p className="text-xs text-gray-500 mt-0.5">
            Dữ liệu bách phân vị WHO giúp Dược sĩ gợi ý đúng dòng sữa Aptamil &amp; vi chất cho bé
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Tìm theo tên bé, SĐT mẹ..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 pr-3 py-1.5 text-xs bg-white border border-gray-200 rounded-xl focus:outline-hidden focus:ring-1 focus:ring-[#800028] w-48 sm:w-56"
            />
          </div>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-1.5 text-xs bg-white border border-gray-200 rounded-xl focus:outline-hidden font-bold text-gray-700"
          >
            <option value="ALL">Tất cả thể trạng</option>
            <option value="UNDERWEIGHT">Nhẹ cân (Cần Aptamil & Men)</option>
            <option value="STUNTED">Thấp còi (Cần Canxi & D3 K2)</option>
            <option value="NORMAL">Thể trạng chuẩn WHO</option>
          </select>
        </div>
      </div>

      {filteredItems.length === 0 ? (
        <div className="p-12 text-center text-gray-500">
          <Baby className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-sm font-semibold">Chưa có dữ liệu đánh giá thể trạng phù hợp.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/70 text-gray-500 font-bold uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4">Bé &amp; Giới Tính</th>
                <th className="py-3 px-4">Phụ Huynh (Tài Khoản)</th>
                <th className="py-3 px-4 text-center">Cân Nặng &amp; Z-Score</th>
                <th className="py-3 px-4 text-center">Chiều Cao &amp; Z-Score</th>
                <th className="py-3 px-4">Phác Đồ Vi Chất Khuyến Nghị</th>
                <th className="py-3 px-4 text-right">Ngày Đánh Giá</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 font-medium text-gray-700">
              {filteredItems.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/60 transition-colors">
                  {/* Bé */}
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-gray-900 text-sm flex items-center gap-1.5">
                      <span>{item.gender === "BOY" ? "👦" : "👧"}</span>
                      <span>{item.childName}</span>
                    </div>
                    <div className="text-[11px] text-gray-500 mt-0.5">
                      {item.ageMonths} tháng tuổi • {item.gender === "BOY" ? "Bé trai" : "Bé gái"}
                    </div>
                  </td>

                  {/* Phụ huynh */}
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-gray-900">
                      {item.user?.name || "Khách vãng lai"}
                    </div>
                    <div className="text-xs text-gray-500 mt-0.5">
                      {item.user?.phone ? (
                        <a
                          href={`tel:${item.user.phone}`}
                          className="flex items-center gap-1 text-emerald-700 font-bold hover:underline"
                        >
                          <Phone className="w-3 h-3 text-emerald-600" />
                          <span>{item.user.phone}</span>
                        </a>
                      ) : (
                        <span className="text-gray-400">Chưa có SĐT</span>
                      )}
                    </div>
                  </td>

                  {/* Cân nặng */}
                  <td className="py-3.5 px-4 text-center">
                    <div className="font-black text-gray-900 text-xs">
                      {item.weightKg} kg
                    </div>
                    <div className="mt-1">
                      {getWeightBadge(item.weightStatus, item.weightZScore)}
                    </div>
                  </td>

                  {/* Chiều cao */}
                  <td className="py-3.5 px-4 text-center">
                    <div className="font-black text-gray-900 text-xs">
                      {item.heightCm} cm
                    </div>
                    <div className="mt-1">
                      {getHeightBadge(item.heightStatus, item.heightZScore)}
                    </div>
                  </td>

                  {/* Phác đồ vi chất */}
                  <td className="py-3.5 px-4">
                    <div className="flex flex-wrap gap-1 max-w-xs">
                      {item.recommendedNutrients.map((nutr, nIdx) => (
                        <span
                          key={nIdx}
                          className="px-2 py-0.5 bg-slate-100 text-slate-800 rounded text-[10px] font-bold border border-slate-200"
                        >
                          {nutr}
                        </span>
                      ))}
                    </div>
                  </td>

                  {/* Ngày */}
                  <td className="py-3.5 px-4 text-right text-gray-400 text-xs">
                    {new Date(item.createdAt).toLocaleDateString("vi-VN")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
