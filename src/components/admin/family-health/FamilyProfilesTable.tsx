"use client";

// ============================================================
// components/admin/family-health/FamilyProfilesTable.tsx
// Danh Sách Hồ Sơ Thành Viên Gia Đình Đa Thế Hệ (Admin CMS - Phase 22)
// ============================================================

import React, { useState } from "react";
import {
  Users,
  Search,
  Filter,
  Phone,
  Clock,
  Heart,
  AlertCircle,
  Calendar,
} from "lucide-react";
import type { AdminFamilyMemberItem } from "./types";

interface FamilyProfilesTableProps {
  members: AdminFamilyMemberItem[];
}

export const FamilyProfilesTable: React.FC<FamilyProfilesTableProps> = ({
  members,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRelation, setSelectedRelation] = useState<string>("ALL");

  const filteredMembers = members.filter((m) => {
    const matchesRelation =
      selectedRelation === "ALL" || m.relation === selectedRelation;

    const matchesSearch =
      m.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (m.user.name && m.user.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (m.user.phone && m.user.phone.includes(searchTerm));

    return matchesRelation && matchesSearch;
  });

  const getRelationBadge = (rel: string) => {
    switch (rel) {
      case "CHILD":
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-pink-50 text-pink-700 border border-pink-200">Bé / Con</span>;
      case "SPOUSE":
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-50 text-purple-700 border border-purple-200">Vợ / Chồng</span>;
      case "PARENT":
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">Bố / Mẹ</span>;
      case "GRANDPARENT":
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">Ông / Bà</span>;
      default:
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-50 text-slate-700 border border-slate-200">Bản thân</span>;
    }
  };

  const calculateAge = (dob?: Date | string | null) => {
    if (!dob) return null;
    const diffMs = Date.now() - new Date(dob).getTime();
    return Math.floor(diffMs / (1000 * 60 * 60 * 24 * 365.25));
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200/80 shadow-xs overflow-hidden">
      {/* Header & Filter Controls */}
      <div className="p-4 sm:p-5 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50/50">
        <div>
          <h3 className="text-base font-black text-gray-900">
            Hồ Sơ Thành Viên Gia Đình Đã Đăng Ký
          </h3>
          <p className="text-xs text-gray-500 mt-0.5">
            Tổng hợp dữ liệu thể trạng, mục tiêu sức khỏe và số cữ uống vi chất đang theo dõi
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Search box */}
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

          {/* Relation select */}
          <select
            value={selectedRelation}
            onChange={(e) => setSelectedRelation(e.target.value)}
            className="px-3 py-1.5 text-xs bg-white border border-gray-200 rounded-xl focus:outline-hidden font-bold text-gray-700"
          >
            <option value="ALL">Tất cả mối quan hệ</option>
            <option value="CHILD">Bé / Con nhỏ</option>
            <option value="SELF">Bản thân</option>
            <option value="SPOUSE">Vợ / Chồng</option>
            <option value="PARENT">Bố / Mẹ</option>
            <option value="GRANDPARENT">Ông / Bà</option>
          </select>
        </div>
      </div>

      {filteredMembers.length === 0 ? (
        <div className="p-12 text-center text-gray-500">
          <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-sm font-semibold">Không tìm thấy hồ sơ thành viên nào phù hợp.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/70 text-gray-500 font-bold uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4">Thành Viên</th>
                <th className="py-3 px-4">Quan Hệ</th>
                <th className="py-3 px-4">Khách Hàng (Tài Khoản)</th>
                <th className="py-3 px-4">Mục Tiêu & Dị Ứng</th>
                <th className="py-3 px-4 text-center">Số Cữ Uống Đang Bật</th>
                <th className="py-3 px-4 text-right">Ngày Tạo</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 font-medium text-gray-700">
              {filteredMembers.map((member) => {
                const age = calculateAge(member.dateOfBirth);

                return (
                  <tr key={member.id} className="hover:bg-slate-50/60 transition-colors">
                    {/* Member */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2.5">
                        <span className="text-2xl">{member.avatarEmoji || "👤"}</span>
                        <div>
                          <div className="font-bold text-gray-900 text-sm">
                            {member.fullName}
                          </div>
                          <div className="text-[11px] text-gray-500">
                            {age !== null ? `${age} tuổi` : "Chưa nhập ngày sinh"}
                            {member.weightKg ? ` • ${member.weightKg}kg` : ""}
                            {member.heightCm ? ` • ${member.heightCm}cm` : ""}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Relation */}
                    <td className="py-3.5 px-4">
                      {getRelationBadge(member.relation)}
                    </td>

                    {/* Customer */}
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-gray-900">
                        {member.user.name || "Khách hàng THUYNGA"}
                      </div>
                      <div className="flex items-center gap-2 mt-0.5 text-xs text-gray-500">
                        {member.user.phone ? (
                          <a
                            href={`tel:${member.user.phone}`}
                            className="flex items-center gap-1 text-emerald-700 hover:underline font-bold"
                          >
                            <Phone className="w-3 h-3 text-emerald-600" />
                            <span>{member.user.phone}</span>
                          </a>
                        ) : (
                          <span className="text-gray-400">Chưa có SĐT</span>
                        )}
                      </div>
                    </td>

                    {/* Health Goals & Allergies */}
                    <td className="py-3.5 px-4">
                      <div className="flex flex-wrap gap-1 max-w-xs">
                        {member.healthGoals.map((g, gIdx) => (
                          <span
                            key={gIdx}
                            className="px-2 py-0.5 bg-emerald-50 text-emerald-800 rounded text-[10px] font-bold border border-emerald-200"
                          >
                            {g}
                          </span>
                        ))}
                        {member.allergies.map((a, aIdx) => (
                          <span
                            key={aIdx}
                            className="px-2 py-0.5 bg-rose-50 text-rose-800 rounded text-[10px] font-black border border-rose-200 flex items-center gap-1"
                          >
                            <AlertCircle className="w-2.5 h-2.5" />
                            <span>{a}</span>
                          </span>
                        ))}
                        {member.healthGoals.length === 0 && member.allergies.length === 0 && (
                          <span className="text-gray-400 text-[11px]">Chưa thiết lập</span>
                        )}
                      </div>
                    </td>

                    {/* Schedules Count */}
                    <td className="py-3.5 px-4 text-center">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-100 text-slate-800 font-bold text-xs">
                        <Clock className="w-3 h-3 text-slate-500" />
                        <span>{member._count.supplementSchedules} cữ</span>
                      </span>
                    </td>

                    {/* Created date */}
                    <td className="py-3.5 px-4 text-right text-gray-400 text-xs">
                      {new Date(member.createdAt).toLocaleDateString("vi-VN")}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
