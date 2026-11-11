"use client";

// ============================================================
// components/admin/referral/ReferralManager.tsx
// Trình Quản Lý Tiếp Thị Giới Thiệu Admin CMS (Stage 12.3)
// ============================================================

import React, { useState, useEffect, useCallback, useRef } from "react";
import { ReferralStats } from "./ReferralStats";
import { ReferralFilters } from "./ReferralFilters";
import { ReferralTable } from "./ReferralTable";
import type {
  AdminReferralRecordItem,
  ReferralStatsData,
  ReferralPaginationData,
} from "./types";
import { RefreshCw } from "lucide-react";

interface ReferralManagerProps {
  initialStats: ReferralStatsData;
  initialRecords: AdminReferralRecordItem[];
  initialPagination: ReferralPaginationData;
}

export const ReferralManager: React.FC<ReferralManagerProps> = ({
  initialStats,
  initialRecords,
  initialPagination,
}) => {
  const [stats, setStats] = useState<ReferralStatsData>(initialStats);
  const [records, setRecords] =
    useState<AdminReferralRecordItem[]>(initialRecords);

  const [search, setSearch] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("ALL");

  const [currentPage, setCurrentPage] = useState(initialPagination.page);
  const [totalPages, setTotalPages] = useState(initialPagination.totalPages);
  const [totalItems, setTotalItems] = useState(initialPagination.total);

  const [isLoading, setIsLoading] = useState(false);
  const isFirstRender = useRef(true);

  // Tải danh sách giới thiệu từ API
  const fetchRecords = useCallback(
    async (pageToLoad: number) => {
      try {
        setIsLoading(true);
        const params = new URLSearchParams({
          page: pageToLoad.toString(),
          limit: "15",
        });

        if (search.trim()) params.append("search", search.trim());
        if (selectedStatus !== "ALL") params.append("status", selectedStatus);

        const res = await fetch(`/api/admin/referrals?${params.toString()}`);
        const data = await res.json();

        if (data.success) {
          setRecords(data.records);
          setStats(data.stats);
          setCurrentPage(data.pagination.page);
          setTotalPages(data.pagination.totalPages);
          setTotalItems(data.pagination.total);
        }
      } catch (err) {
        console.error("Lỗi khi tải dữ liệu tiếp thị giới thiệu:", err);
      } finally {
        setIsLoading(false);
      }
    },
    [search, selectedStatus]
  );

  // Debounced search & filter
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    const timer = setTimeout(() => {
      fetchRecords(1);
    }, 300);
    return () => clearTimeout(timer);
  }, [fetchRecords]);

  const handlePageChange = (newPage: number) => {
    fetchRecords(newPage);
  };

  const handleResetFilters = () => {
    setSearch("");
    setSelectedStatus("ALL");
  };

  const hasActiveFilters = search.trim() !== "" || selectedStatus !== "ALL";

  return (
    <div className="space-y-6">
      {/* 4 Thẻ KPI */}
      <ReferralStats stats={stats} />

      {/* Bộ Lọc & Tìm Kiếm */}
      <ReferralFilters
        search={search}
        onSearchChange={setSearch}
        selectedStatus={selectedStatus}
        onStatusChange={setSelectedStatus}
        onResetFilters={handleResetFilters}
        hasActiveFilters={hasActiveFilters}
      />

      {/* Header thanh danh sách & Nút làm mới */}
      <div className="flex items-center justify-between px-1">
        <h2 className="text-sm font-bold text-slate-800">
          Danh sách liên kết ({totalItems.toLocaleString("vi-VN")})
        </h2>
        <button
          type="button"
          onClick={() => fetchRecords(currentPage)}
          disabled={isLoading}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-700 bg-white border border-slate-200/80 hover:bg-slate-50 transition-colors shadow-2xs disabled:opacity-50"
        >
          <RefreshCw
            className={`w-3.5 h-3.5 ${isLoading ? "animate-spin text-[#800028]" : ""}`}
          />
          Làm mới
        </button>
      </div>

      {/* Bảng dữ liệu */}
      <ReferralTable
        records={records}
        isLoading={isLoading}
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={totalItems}
        onPageChange={handlePageChange}
      />
    </div>
  );
};
