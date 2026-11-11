"use client";

// ============================================================
// components/admin/subscription/SubscriptionManager.tsx
// Trình Quản Lý Gói Đơn Hàng Giao Định Kỳ Admin CMS (Stage 13.3)
// ============================================================

import React, { useState, useEffect, useCallback, useRef } from "react";
import { SubscriptionStats } from "./SubscriptionStats";
import { SubscriptionFilters } from "./SubscriptionFilters";
import { SubscriptionTable } from "./SubscriptionTable";
import type {
  AdminSubscriptionItem,
  SubscriptionStatsData,
  SubscriptionPaginationData,
} from "./types";
import { RefreshCw } from "lucide-react";

interface SubscriptionManagerProps {
  initialStats: SubscriptionStatsData;
  initialSubscriptions: AdminSubscriptionItem[];
  initialPagination: SubscriptionPaginationData;
}

export const SubscriptionManager: React.FC<SubscriptionManagerProps> = ({
  initialStats,
  initialSubscriptions,
  initialPagination,
}) => {
  const [stats, setStats] = useState<SubscriptionStatsData>(initialStats);
  const [subscriptions, setSubscriptions] =
    useState<AdminSubscriptionItem[]>(initialSubscriptions);

  const [search, setSearch] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("ALL");
  const [selectedFrequency, setSelectedFrequency] = useState("ALL");

  const [currentPage, setCurrentPage] = useState(initialPagination.page);
  const [totalPages, setTotalPages] = useState(initialPagination.totalPages);
  const [totalItems, setTotalItems] = useState(initialPagination.total);

  const [isLoading, setIsLoading] = useState(false);
  const isFirstRender = useRef(true);

  // Fetch subscriptions from API
  const fetchSubscriptions = useCallback(
    async (pageToLoad: number) => {
      try {
        setIsLoading(true);
        const params = new URLSearchParams({
          page: pageToLoad.toString(),
          limit: "15",
        });

        if (search.trim()) params.append("search", search.trim());
        if (selectedStatus !== "ALL") params.append("status", selectedStatus);
        if (selectedFrequency !== "ALL") params.append("frequency", selectedFrequency);

        const res = await fetch(`/api/admin/subscriptions?${params.toString()}`);
        const data = await res.json();

        if (data.success) {
          setSubscriptions(data.subscriptions);
          setStats(data.stats);
          setCurrentPage(data.pagination.page);
          setTotalPages(data.pagination.totalPages);
          setTotalItems(data.pagination.total);
        }
      } catch (err) {
        console.error("Lỗi khi tải danh sách gói định kỳ:", err);
      } finally {
        setIsLoading(false);
      }
    },
    [search, selectedStatus, selectedFrequency]
  );

  // Debounced search & filter
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    const timer = setTimeout(() => {
      fetchSubscriptions(1);
    }, 300);
    return () => clearTimeout(timer);
  }, [fetchSubscriptions]);

  const handlePageChange = (newPage: number) => {
    fetchSubscriptions(newPage);
  };

  const handleResetFilters = () => {
    setSearch("");
    setSelectedStatus("ALL");
    setSelectedFrequency("ALL");
  };

  const handleTriggerOrder = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/subscriptions/${id}/trigger`, {
        method: "POST",
      });
      const data = await res.json();
      if (res.ok && data.success) {
        alert(data.message || "Tạo đơn hàng định kỳ thành công!");
        fetchSubscriptions(currentPage);
      } else {
        alert(data.error || "Không thể tạo đơn hàng");
      }
    } catch (err) {
      console.error("Trigger order error:", err);
      alert("Đã xảy ra lỗi khi tạo đơn hàng định kỳ");
    }
  };

  const hasActiveFilters =
    search.trim() !== "" || selectedStatus !== "ALL" || selectedFrequency !== "ALL";

  return (
    <div className="space-y-6">
      {/* 4 Thẻ KPI */}
      <SubscriptionStats stats={stats} />

      {/* Bộ Lọc & Tìm Kiếm */}
      <SubscriptionFilters
        search={search}
        onSearchChange={setSearch}
        selectedStatus={selectedStatus}
        onStatusChange={setSelectedStatus}
        selectedFrequency={selectedFrequency}
        onFrequencyChange={setSelectedFrequency}
        onResetFilters={handleResetFilters}
        hasActiveFilters={hasActiveFilters}
      />

      {/* Header Danh Sách & Nút Làm Mới */}
      <div className="flex items-center justify-between px-1">
        <h2 className="text-sm font-bold text-slate-800">
          Danh sách gói định kỳ ({totalItems.toLocaleString("vi-VN")})
        </h2>
        <button
          type="button"
          onClick={() => fetchSubscriptions(currentPage)}
          disabled={isLoading}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-700 bg-white border border-slate-200/80 hover:bg-slate-50 transition-colors shadow-2xs disabled:opacity-50"
        >
          <RefreshCw
            className={`w-3.5 h-3.5 ${isLoading ? "animate-spin text-[#800028]" : ""}`}
          />
          Làm mới
        </button>
      </div>

      {/* Bảng Dữ Liệu */}
      <SubscriptionTable
        subscriptions={subscriptions}
        isLoading={isLoading}
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={totalItems}
        onPageChange={handlePageChange}
        onTriggerOrder={handleTriggerOrder}
      />
    </div>
  );
};
