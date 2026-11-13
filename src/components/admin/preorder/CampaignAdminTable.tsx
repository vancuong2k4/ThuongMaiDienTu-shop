"use client";

// ============================================================
// components/admin/preorder/CampaignAdminTable.tsx
// Bảng Quản Trị Chiến Dịch Mùa Vụ Nông Sản Úc (Phase 21)
// ============================================================

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Calendar,
  Plane,
  ExternalLink,
  PlusCircle,
  Trash2,
  MapPin,
  Clock,
  BookOpen,
} from "lucide-react";
import type { AdminCampaignItem, CampaignStatusType } from "./types";

interface CampaignAdminTableProps {
  campaigns: AdminCampaignItem[];
  onOpenCreateUpdate: (campaign: AdminCampaignItem) => void;
  onRefresh: () => void;
}

export const CampaignAdminTable: React.FC<CampaignAdminTableProps> = ({
  campaigns,
  onOpenCreateUpdate,
  onRefresh,
}) => {
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleStatusChange = async (
    campaignId: string,
    newStatus: CampaignStatusType
  ) => {
    try {
      setUpdatingId(campaignId);
      const res = await fetch(`/api/admin/preorders/campaigns/${campaignId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        alert(data.message || "Không thể cập nhật trạng thái chiến dịch.");
        return;
      }
      onRefresh();
    } catch {
      alert("Lỗi kết nối khi cập nhật trạng thái.");
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDelete = async (campaign: AdminCampaignItem) => {
    if (
      !confirm(
        `Bạn có chắc chắn muốn xóa chiến dịch "${campaign.title}" không? Tất cả các tier và nhật ký thu hoạch liên quan sẽ bị xóa.`
      )
    ) {
      return;
    }

    try {
      setDeletingId(campaign.id);
      const res = await fetch(`/api/admin/preorders/campaigns/${campaign.id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        alert(data.message || "Không thể xóa chiến dịch.");
        return;
      }
      onRefresh();
    } catch {
      alert("Lỗi kết nối khi xóa chiến dịch.");
    } finally {
      setDeletingId(null);
    }
  };

  if (campaigns.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3">
        <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
          <Calendar className="w-6 h-6" />
        </div>
        <h3 className="font-bold text-slate-800 text-base">
          Chưa có chiến dịch mùa vụ nào
        </h3>
        <p className="text-xs text-slate-500 max-w-sm mx-auto">
          Khởi tạo chiến dịch Cherry Tasmania hoặc Mật ong Manuka Hoàng gia để mở cổng đặt cọc giữ slot bay Air.
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
              <th className="py-3 px-4">Chiến dịch / Nông trường</th>
              <th className="py-3 px-4">Thông số kỹ thuật</th>
              <th className="py-3 px-4">Tuần bay Air</th>
              <th className="py-3 px-4">Trạng thái mùa vụ</th>
              <th className="py-3 px-4">Tiến độ cọc (Kg)</th>
              <th className="py-3 px-4 text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {campaigns.map((c) => {
              const fillRate =
                c.totalCapacityKg > 0
                  ? Math.min(
                      100,
                      Number(((c.reservedCapacityKg / c.totalCapacityKg) * 100).toFixed(1))
                    )
                  : 0;

              return (
                <tr key={c.id} className="hover:bg-slate-50/60 transition-colors">
                  {/* Title & Farm */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <div className="relative w-12 h-12 rounded-xl bg-slate-100 overflow-hidden shrink-0 border border-slate-200">
                        <Image
                          src={c.bannerImage}
                          alt={c.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <Link
                          href={`/dat-truoc-mua-vu/${c.slug}`}
                          target="_blank"
                          className="font-bold text-slate-900 hover:text-[#800028] transition-colors line-clamp-1 text-xs"
                        >
                          {c.title}
                        </Link>
                        <div className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3 h-3 text-[#800028]" />
                          <span>{c.farmName}</span>
                          <span className="text-slate-300">•</span>
                          <span>{c.farmRegion}</span>
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Specs */}
                  <td className="py-3.5 px-4">
                    <div className="space-y-0.5">
                      <div className="font-semibold text-slate-700">
                        {c.targetBrixSweetness}
                      </div>
                      <div className="text-[11px] text-slate-400">
                        {c.fruitSizeMm}
                      </div>
                    </div>
                  </td>

                  {/* Flight Departure Week */}
                  <td className="py-3.5 px-4 font-mono text-[11px]">
                    <div className="flex items-center gap-1 text-sky-800 font-semibold">
                      <Plane className="w-3 h-3 text-sky-600" />
                      <span>{c.flightDepartureWeek}</span>
                    </div>
                  </td>

                  {/* Status Dropdown */}
                  <td className="py-3.5 px-4">
                    <div className="space-y-1">
                      <select
                        value={c.status}
                        disabled={updatingId === c.id}
                        onChange={(e) =>
                          handleStatusChange(
                            c.id,
                            e.target.value as CampaignStatusType
                          )
                        }
                        className="text-xs font-bold rounded-lg px-2.5 py-1 border border-slate-200 bg-white cursor-pointer focus:border-[#800028] outline-hidden"
                      >
                        <option value="UPCOMING">Sắp mở giữ chỗ</option>
                        <option value="OPEN_FOR_RESERVATION">Đang mở đặt cọc</option>
                        <option value="HARVESTING">Đang thu hoạch tại Úc</option>
                        <option value="AIR_SHIPPING">Đang bay Air về VN</option>
                        <option value="DELIVERED">Đã trả hàng</option>
                        <option value="CLOSED">Đã đóng chiến dịch</option>
                      </select>
                      {updatingId === c.id && (
                        <p className="text-[10px] text-amber-600 animate-pulse">
                          Đang lưu...
                        </p>
                      )}
                    </div>
                  </td>

                  {/* Fill progress */}
                  <td className="py-3.5 px-4">
                    <div className="w-28 space-y-1">
                      <div className="flex justify-between text-[11px] font-mono">
                        <span className="font-bold text-[#800028]">{fillRate}%</span>
                        <span className="text-slate-400">
                          {c.reservedCapacityKg}/{c.totalCapacityKg} kg
                        </span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            fillRate >= 90
                              ? "bg-rose-600"
                              : fillRate >= 60
                              ? "bg-amber-500"
                              : "bg-emerald-500"
                          }`}
                          style={{ width: `${Math.min(100, fillRate)}%` }}
                        />
                      </div>
                    </div>
                  </td>

                  {/* Actions */}
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      {/* Post Farm Update */}
                      <button
                        onClick={() => onOpenCreateUpdate(c)}
                        title="Đăng bài nhật ký thu hoạch nông trường"
                        className="p-1.5 text-amber-700 hover:text-amber-900 hover:bg-amber-50 rounded-lg transition-colors flex items-center gap-1 text-[11px] font-semibold border border-amber-200"
                      >
                        <BookOpen className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Viết nhật ký</span>
                      </button>

                      {/* Storefront Link */}
                      <Link
                        href={`/dat-truoc-mua-vu/${c.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        title="Xem trang chiến dịch công khai"
                        className="p-1.5 text-slate-600 hover:text-[#800028] hover:bg-slate-100 rounded-lg transition-colors"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </Link>

                      {/* Delete */}
                      <button
                        onClick={() => handleDelete(c)}
                        disabled={deletingId === c.id}
                        title="Xóa chiến dịch"
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
