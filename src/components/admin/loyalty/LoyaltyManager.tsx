"use client";

// ============================================================
// components/admin/loyalty/LoyaltyManager.tsx
// Trình Quản Lý Trung Tâm Sổ Cái Tích Điểm Admin CMS (Module 10.3)
// ============================================================

import React, { useState, useEffect, useCallback } from "react";
import { LoyaltyStats } from "./LoyaltyStats";
import { LoyaltyFilters } from "./LoyaltyFilters";
import { LoyaltyTable } from "./LoyaltyTable";
import { AdjustPointsModal } from "./AdjustPointsModal";
import type { LoyaltyStatsData, LoyaltyTransactionItem } from "./types";
import { RefreshCw } from "lucide-react";

interface LoyaltyManagerProps {
  initialStats: LoyaltyStatsData;
  initialTransactions: LoyaltyTransactionItem[];
  initialPagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export const LoyaltyManager: React.FC<LoyaltyManagerProps> = ({
  initialStats,
  initialTransactions,
  initialPagination,
}) => {
  const [stats, setStats] = useState<LoyaltyStatsData>(initialStats);
  const [transactions, setTransactions] =
    useState<LoyaltyTransactionItem[]>(initialTransactions);

  const [search, setSearch] = useState("");
  const [selectedType, setSelectedType] = useState("ALL");
  const [selectedTier, setSelectedTier] = useState("ALL");

  const [currentPage, setCurrentPage] = useState(initialPagination.page);
  const [totalPages, setTotalPages] = useState(initialPagination.totalPages);
  const [totalItems, setTotalItems] = useState(initialPagination.total);

  const [isLoading, setIsLoading] = useState(false);
  const [isAdjustModalOpen, setIsAdjustModalOpen] = useState(false);

  // Tải dữ liệu sổ cái từ API
  const fetchTransactions = useCallback(
    async (pageToLoad: number) => {
      try {
        setIsLoading(true);
        const params = new URLSearchParams({
          page: pageToLoad.toString(),
          limit: "15",
        });

        if (search.trim()) params.append("search", search.trim());
        if (selectedType !== "ALL") params.append("type", selectedType);
        if (selectedTier !== "ALL") params.append("tier", selectedTier);

        const res = await fetch(`/api/admin/loyalty?${params.toString()}`);
        const data = await res.json();

        if (data.success) {
          setTransactions(data.transactions);
          setStats(data.stats);
          setCurrentPage(data.pagination.page);
          setTotalPages(data.pagination.totalPages);
          setTotalItems(data.pagination.total);
        }
      } catch (err) {
        console.error("Lỗi khi tải dữ liệu sổ cái tích điểm:", err);
      } finally {
        setIsLoading(false);
      }
    },
    [search, selectedType, selectedTier]
  );

  // Debounced filter effect
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchTransactions(1);
    }, 300);
    return () => clearTimeout(timer);
  }, [fetchTransactions]);

  const handlePageChange = (newPage: number) => {
    fetchTransactions(newPage);
  };

  const handleResetFilters = () => {
    setSearch("");
    setSelectedType("ALL");
    setSelectedTier("ALL");
  };

  const hasActiveFilters =
    search.trim() !== "" || selectedType !== "ALL" || selectedTier !== "ALL";

  return (
    <div className="space-y-6">
      {/* 4 Thẻ KPI */}
      <LoyaltyStats stats={stats} />

      {/* Bộ Lọc & Tìm Kiếm */}
      <LoyaltyFilters
        search={search}
        onSearchChange={setSearch}
        selectedType={selectedType}
        onTypeChange={setSelectedType}
        selectedTier={selectedTier}
        onTierChange={setSelectedTier}
        onOpenAdjustModal={() => setIsAdjustModalOpen(true)}
        onResetFilters={handleResetFilters}
        hasActiveFilters={hasActiveFilters}
      />

      {/* Bảng Sổ Cái Giao Dịch */}
      <LoyaltyTable
        transactions={transactions}
        isLoading={isLoading}
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={totalItems}
        onPageChange={handlePageChange}
      />

      {/* Modal Điều Chỉnh Điểm Thủ Công */}
      <AdjustPointsModal
        isOpen={isAdjustModalOpen}
        onClose={() => setIsAdjustModalOpen(false)}
        onSuccess={() => fetchTransactions(currentPage)}
      />
    </div>
  );
};
