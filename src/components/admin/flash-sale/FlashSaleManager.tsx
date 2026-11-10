"use client";

// ============================================================
// components/admin/flash-sale/FlashSaleManager.tsx
// Bộ Điều Phối Quản Trị Flash Sale Client (Module 9.3)
// ============================================================

import React, { useState, useEffect, useCallback } from "react";
import { FlashSaleStats } from "./FlashSaleStats";
import { FlashSaleFilters } from "./FlashSaleFilters";
import { FlashSaleTable } from "./FlashSaleTable";
import { FlashSaleCampaignModal } from "./FlashSaleCampaignModal";
import { FlashSaleItemModal } from "./FlashSaleItemModal";
import type {
  FlashSaleCampaignItem,
  FlashSaleStatsData,
} from "./types";
import {
  AlertTriangle,
  Loader2,
  CheckCircle2,
  XCircle,
  X,
  Zap,
} from "lucide-react";

interface FlashSaleManagerProps {
  initialStats?: FlashSaleStatsData;
  initialCampaigns?: FlashSaleCampaignItem[];
  initialPagination?: {
    page: number;
    limit: number;
    totalPages: number;
    total: number;
  };
}

export const FlashSaleManager: React.FC<FlashSaleManagerProps> = ({
  initialStats = {
    total: 0,
    active: 0,
    upcoming: 0,
    ended: 0,
    totalSold: 0,
    totalRevenue: 0,
    averageSoldRate: 0,
  },
  initialCampaigns = [],
  initialPagination = { page: 1, limit: 10, totalPages: 1, total: 0 },
}) => {
  const [stats, setStats] = useState<FlashSaleStatsData>(initialStats);
  const [campaigns, setCampaigns] =
    useState<FlashSaleCampaignItem[]>(initialCampaigns);
  const [page, setPage] = useState(initialPagination.page);
  const [totalPages, setTotalPages] = useState(initialPagination.totalPages);
  const [totalItems, setTotalItems] = useState(initialPagination.total);
  const [limit] = useState(initialPagination.limit);

  // Filters
  const [search, setSearch] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("ALL");
  const [sortBy, setSortBy] = useState("createdAt_desc");
  const [loading, setLoading] = useState(false);

  // Modals
  const [isCampaignModalOpen, setIsCampaignModalOpen] = useState(false);
  const [editingCampaign, setEditingCampaign] =
    useState<FlashSaleCampaignItem | null>(null);

  const [isItemModalOpen, setIsItemModalOpen] = useState(false);
  const [managingCampaign, setManagingCampaign] =
    useState<FlashSaleCampaignItem | null>(null);

  const [deletingCampaign, setDeletingCampaign] =
    useState<FlashSaleCampaignItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Toast
  const [notification, setNotification] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  useEffect(() => {
    if (!notification) return;
    const timer = setTimeout(() => setNotification(null), 4000);
    return () => clearTimeout(timer);
  }, [notification]);

  // Fetch campaigns
  const fetchCampaigns = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      params.set("page", page.toString());
      params.set("limit", limit.toString());
      if (search.trim()) params.set("search", search.trim());
      if (selectedStatus !== "ALL") params.set("status", selectedStatus);
      if (sortBy) params.set("sortBy", sortBy);

      const res = await fetch(`/api/admin/flash-sales?${params.toString()}`);
      if (!res.ok) {
        throw new Error("Không thể tải danh sách Flash Sale");
      }

      const data = await res.json();
      if (data.success) {
        setCampaigns(data.data);
        setTotalPages(data.pagination.totalPages);
        setTotalItems(data.pagination.total);
        if (data.stats) {
          setStats(data.stats);
        }
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Đã có lỗi xảy ra";
      setNotification({ type: "error", message: msg });
    } finally {
      setLoading(false);
    }
  }, [page, limit, search, selectedStatus, sortBy]);

  useEffect(() => {
    fetchCampaigns();
  }, [fetchCampaigns]);

  // Filter handlers
  const handleSearchChange = (val: string) => {
    setSearch(val);
    setPage(1);
  };

  const handleStatusChange = (status: string) => {
    setSelectedStatus(status);
    setPage(1);
  };

  const handleSortByChange = (sort: string) => {
    setSortBy(sort);
    setPage(1);
  };

  const handleResetFilters = () => {
    setSearch("");
    setSelectedStatus("ALL");
    setSortBy("createdAt_desc");
    setPage(1);
  };

  // Toggle active
  const handleToggleActive = async (id: string, currentState: boolean) => {
    const nextState = !currentState;
    // Optimistic update
    setCampaigns((prev) =>
      prev.map((c) => (c.id === id ? { ...c, isActive: nextState } : c))
    );

    try {
      const res = await fetch(`/api/admin/flash-sales/${id}/toggle`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: nextState }),
      });
      if (!res.ok) throw new Error("Lỗi cập nhật trạng thái");

      setNotification({
        type: "success",
        message: nextState
          ? "Đã kích hoạt chiến dịch Flash Sale thành công!"
          : "Đã tạm dừng chiến dịch Flash Sale.",
      });
      fetchCampaigns();
    } catch {
      // Rollback
      setCampaigns((prev) =>
        prev.map((c) => (c.id === id ? { ...c, isActive: currentState } : c))
      );
      setNotification({
        type: "error",
        message: "Không thể đổi trạng thái chiến dịch. Vui lòng thử lại.",
      });
    }
  };

  // Create & Edit modals
  const handleOpenCreate = () => {
    setEditingCampaign(null);
    setIsCampaignModalOpen(true);
  };

  const handleEditCampaign = (c: FlashSaleCampaignItem) => {
    setEditingCampaign(c);
    setIsCampaignModalOpen(true);
  };

  const handleManageDeals = (c: FlashSaleCampaignItem) => {
    setManagingCampaign(c);
    setIsItemModalOpen(true);
  };

  // Delete Campaign
  const handleConfirmDelete = async () => {
    if (!deletingCampaign) return;
    try {
      setIsDeleting(true);
      const res = await fetch(`/api/admin/flash-sales/${deletingCampaign.id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Không thể xóa chiến dịch");

      setNotification({
        type: "success",
        message: `Đã xóa chiến dịch "${deletingCampaign.name}" thành công!`,
      });
      setDeletingCampaign(null);
      fetchCampaigns();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Lỗi khi xóa chiến dịch";
      setNotification({ type: "error", message: msg });
    } finally {
      setIsDeleting(false);
    }
  };

  const hasActiveFilters =
    search.trim() !== "" ||
    selectedStatus !== "ALL" ||
    sortBy !== "createdAt_desc";

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {notification && (
        <div
          role="alert"
          className={`flex items-center justify-between p-4 rounded-xl text-sm font-medium border shadow-xs transition-all animate-in fade-in slide-in-from-top-2 ${
            notification.type === "success"
              ? "bg-emerald-50 text-emerald-800 border-emerald-200"
              : "bg-rose-50 text-rose-800 border-rose-200"
          }`}
        >
          <div className="flex items-center gap-2.5">
            {notification.type === "success" ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            ) : (
              <XCircle className="w-5 h-5 text-rose-600 shrink-0" />
            )}
            <span>{notification.message}</span>
          </div>
          <button
            type="button"
            onClick={() => setNotification(null)}
            className="p-1 rounded-lg hover:bg-black/5 text-slate-500"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* 4 Thẻ KPI */}
      <FlashSaleStats stats={stats} />

      {/* Bộ Lọc & Tìm Kiếm */}
      <FlashSaleFilters
        search={search}
        onSearchChange={handleSearchChange}
        selectedStatus={selectedStatus}
        onStatusChange={handleStatusChange}
        sortBy={sortBy}
        onSortByChange={handleSortByChange}
        onOpenCreateModal={handleOpenCreate}
        onResetFilters={handleResetFilters}
        hasActiveFilters={hasActiveFilters}
      />

      {/* Bảng Dữ Liệu */}
      <FlashSaleTable
        campaigns={campaigns}
        loading={loading}
        page={page}
        totalPages={totalPages}
        totalItems={totalItems}
        onPageChange={setPage}
        onToggleActive={handleToggleActive}
        onEditCampaign={handleEditCampaign}
        onManageDeals={handleManageDeals}
        onDeleteCampaign={setDeletingCampaign}
      />

      {/* Modal Tạo Mới / Sửa Chiến Dịch */}
      <FlashSaleCampaignModal
        isOpen={isCampaignModalOpen}
        onClose={() => setIsCampaignModalOpen(false)}
        campaign={editingCampaign}
        onSuccess={() => {
          fetchCampaigns();
          setNotification({
            type: "success",
            message: editingCampaign
              ? "Đã cập nhật chiến dịch Flash Sale thành công!"
              : "Đã tạo chiến dịch Flash Sale mới thành công!",
          });
        }}
      />

      {/* Modal Quản Lý Deal Sản Phẩm */}
      <FlashSaleItemModal
        isOpen={isItemModalOpen}
        onClose={() => setIsItemModalOpen(false)}
        campaign={managingCampaign}
        onSuccess={() => {
          fetchCampaigns();
        }}
      />

      {/* Hộp Thoại Xác Nhận Xóa Chiến Dịch */}
      {deletingCampaign && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-slate-900">
                  Xác nhận xóa chiến dịch Flash Sale?
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Thao tác này sẽ xóa vĩnh viễn chiến dịch cùng tất cả các deal sản phẩm liên kết khỏi hệ thống.
                </p>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs font-semibold text-slate-800 line-clamp-2">
              {deletingCampaign.name}
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setDeletingCampaign(null)}
                disabled={isDeleting}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors disabled:opacity-50"
              >
                Hủy bỏ
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                disabled={isDeleting}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 transition-colors shadow-xs disabled:opacity-50"
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Đang xóa...</span>
                  </>
                ) : (
                  <span>Xác nhận xóa</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
