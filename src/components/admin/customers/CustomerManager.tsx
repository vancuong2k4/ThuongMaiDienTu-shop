"use client";

// ============================================================
// components/admin/customers/CustomerManager.tsx
// Trình Quản Lý Khách Hàng (Client Component điều phối)
// ============================================================

import React, { useState, useEffect, useCallback } from "react";
import { CustomerStats } from "./CustomerStats";
import { CustomerFilters } from "./CustomerFilters";
import { CustomerTable } from "./CustomerTable";
import { CustomerDetailModal } from "./CustomerDetailModal";
import type { CustomerListItem, CustomerStatsData } from "./types";

interface CustomerManagerProps {
  initialStats?: CustomerStatsData;
}

export const CustomerManager: React.FC<CustomerManagerProps> = ({
  initialStats,
}) => {
  // Data states
  const [customers, setCustomers] = useState<CustomerListItem[]>([]);
  const [currentUserId, setCurrentUserId] = useState<string | undefined>(undefined);
  const [stats, setStats] = useState<CustomerStatsData>(
    initialStats || {
      totalCustomers: 0,
      activeCustomers: 0,
      vipCustomers: 0,
      totalSpentAll: 0,
    }
  );

  // Pagination states
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(true);

  // Filter states
  const [search, setSearch] = useState("");
  const [selectedTier, setSelectedTier] = useState("ALL");
  const [selectedStatus, setSelectedStatus] = useState("ALL");
  const [selectedRole, setSelectedRole] = useState("ALL");
  const [sortBy, setSortBy] = useState("createdAt_desc");

  // Modal states
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerListItem | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  // Fetch customers from API
  const fetchCustomers = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      params.set("page", page.toString());
      params.set("limit", "10");
      if (search) params.set("search", search);
      if (selectedTier !== "ALL") params.set("tier", selectedTier);
      if (selectedStatus !== "ALL") params.set("status", selectedStatus);
      if (selectedRole !== "ALL") params.set("role", selectedRole);
      if (sortBy) params.set("sortBy", sortBy);

      const res = await fetch(`/api/admin/customers?${params.toString()}`);
      const data = await res.json();

      if (data.success) {
        setCustomers(data.customers);
        setCurrentUserId(data.currentUserId);
        setTotalPages(data.pagination.totalPages);
        setTotalItems(data.pagination.total);
        if (data.stats) {
          setStats(data.stats);
        }
      }
    } catch (err) {
      console.error("Fetch customers failed:", err);
    } finally {
      setLoading(false);
    }
  }, [page, search, selectedTier, selectedStatus, selectedRole, sortBy]);

  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  // Handle Toggle Active (Optimistic UI)
  const handleToggleActive = async (id: string, currentState: boolean) => {
    const nextState = !currentState;

    // Optimistic update
    setCustomers((prev) =>
      prev.map((c) => (c.id === id ? { ...c, isActive: nextState } : c))
    );

    try {
      const res = await fetch(`/api/admin/customers/${id}/toggle`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: nextState }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Không thể cập nhật trạng thái");
      }

      // Re-fetch to sync stats
      fetchCustomers();
    } catch (err: any) {
      // Revert if failed
      setCustomers((prev) =>
        prev.map((c) => (c.id === id ? { ...c, isActive: currentState } : c))
      );
      alert(err.message || "Đã xảy ra lỗi khi đổi trạng thái tài khoản");
    }
  };

  // Open Detail Modal
  const handleOpenDetail = (customer: CustomerListItem) => {
    setSelectedCustomer(customer);
    setIsDetailOpen(true);
  };

  // Reset Filters
  const handleResetFilters = () => {
    setSearch("");
    setSelectedTier("ALL");
    setSelectedStatus("ALL");
    setSelectedRole("ALL");
    setSortBy("createdAt_desc");
    setPage(1);
  };

  const hasActiveFilters = Boolean(
    search ||
      selectedTier !== "ALL" ||
      selectedStatus !== "ALL" ||
      selectedRole !== "ALL" ||
      sortBy !== "createdAt_desc"
  );

  return (
    <div className="space-y-6">
      {/* 1. KPI Stats Cards */}
      <CustomerStats stats={stats} />

      {/* 2. Filters & Actions */}
      <CustomerFilters
        search={search}
        onSearchChange={(val) => {
          setSearch(val);
          setPage(1);
        }}
        selectedTier={selectedTier}
        onTierChange={(t) => {
          setSelectedTier(t);
          setPage(1);
        }}
        selectedStatus={selectedStatus}
        onStatusChange={(s) => {
          setSelectedStatus(s);
          setPage(1);
        }}
        selectedRole={selectedRole}
        onRoleChange={(r) => {
          setSelectedRole(r);
          setPage(1);
        }}
        sortBy={sortBy}
        onSortByChange={(sb) => {
          setSortBy(sb);
          setPage(1);
        }}
        onResetFilters={handleResetFilters}
        hasActiveFilters={hasActiveFilters}
      />

      {/* 3. Table of Customers */}
      <CustomerTable
        customers={customers}
        currentUserId={currentUserId}
        loading={loading}
        page={page}
        totalPages={totalPages}
        totalItems={totalItems}
        onPageChange={setPage}
        onToggleActive={handleToggleActive}
        onViewDetail={handleOpenDetail}
      />

      {/* Modal: View Customer Profile */}
      <CustomerDetailModal
        customer={selectedCustomer}
        isOpen={isDetailOpen}
        onClose={() => {
          setIsDetailOpen(false);
          setSelectedCustomer(null);
        }}
      />
    </div>
  );
};
