"use client";

// ============================================================
// components/admin/vouchers/VoucherManager.tsx
// Trình Quản Lý Voucher Chính (Client Component điều phối)
// ============================================================

import React, { useState, useEffect, useCallback } from "react";
import { VoucherStats } from "./VoucherStats";
import { VoucherFilters } from "./VoucherFilters";
import { VoucherTable } from "./VoucherTable";
import { VoucherModal } from "./VoucherModal";
import { VoucherDetailModal } from "./VoucherDetailModal";
import { AlertTriangle, Trash2, X, Loader2 } from "lucide-react";
import type { VoucherItem, VoucherStatsData } from "./types";

interface VoucherManagerProps {
  initialStats?: VoucherStatsData;
}

export const VoucherManager: React.FC<VoucherManagerProps> = ({ initialStats }) => {
  // Data states
  const [vouchers, setVouchers] = useState<VoucherItem[]>([]);
  const [stats, setStats] = useState<VoucherStatsData>(
    initialStats || {
      total: 0,
      active: 0,
      upcoming: 0,
      expired: 0,
      totalUsed: 0,
      totalDiscountGiven: 0,
    }
  );

  // Pagination states
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(true);

  // Filter states
  const [search, setSearch] = useState("");
  const [selectedType, setSelectedType] = useState("ALL");
  const [selectedStatus, setSelectedStatus] = useState("ALL");

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingVoucher, setEditingVoucher] = useState<VoucherItem | null>(null);

  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [detailVoucher, setDetailVoucher] = useState<VoucherItem | null>(null);

  // Delete dialog states
  const [voucherToDelete, setVoucherToDelete] = useState<VoucherItem | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  // Fetch vouchers from API
  const fetchVouchers = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      params.set("page", page.toString());
      params.set("limit", "10");
      if (search) params.set("search", search);
      if (selectedType !== "ALL") params.set("type", selectedType);
      if (selectedStatus !== "ALL") params.set("status", selectedStatus);

      const res = await fetch(`/api/admin/vouchers?${params.toString()}`);
      const data = await res.json();

      if (data.success) {
        setVouchers(data.vouchers);
        setTotalPages(data.pagination.totalPages);
        setTotalItems(data.pagination.total);
        if (data.stats) {
          setStats(data.stats);
        }
      }
    } catch (err) {
      console.error("Fetch vouchers failed:", err);
    } finally {
      setLoading(false);
    }
  }, [page, search, selectedType, selectedStatus]);

  useEffect(() => {
    fetchVouchers();
  }, [fetchVouchers]);

  // Handle Toggle Active (Optimistic UI)
  const handleToggleActive = async (id: string, currentState: boolean) => {
    const nextState = !currentState;

    // Optimistic update
    setVouchers((prev) =>
      prev.map((v) =>
        v.id === id
          ? {
              ...v,
              isActive: nextState,
              lifecycleStatus: nextState ? "ACTIVE" : "DISABLED",
            }
          : v
      )
    );

    try {
      const res = await fetch(`/api/admin/vouchers/${id}/toggle`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: nextState }),
      });

      if (!res.ok) {
        throw new Error("Không thể cập nhật trạng thái");
      }

      // Re-fetch stats to keep counters accurate
      fetchVouchers();
    } catch (err) {
      // Revert if failed
      setVouchers((prev) =>
        prev.map((v) => (v.id === id ? { ...v, isActive: currentState } : v))
      );
      alert("Đã xảy ra lỗi khi đổi trạng thái voucher. Vui lòng thử lại.");
    }
  };

  // Open Create Modal
  const handleOpenCreate = () => {
    setEditingVoucher(null);
    setIsModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEdit = (voucher: VoucherItem) => {
    setEditingVoucher(voucher);
    setIsModalOpen(true);
  };

  // Open Detail Modal
  const handleOpenDetail = (voucher: VoucherItem) => {
    setDetailVoucher(voucher);
    setIsDetailOpen(true);
  };

  // Trigger Delete Modal
  const handleDeletePrompt = (voucher: VoucherItem) => {
    setVoucherToDelete(voucher);
    setDeleteError(null);
  };

  // Confirm Delete
  const handleConfirmDelete = async () => {
    if (!voucherToDelete) return;

    try {
      setDeleting(true);
      setDeleteError(null);

      const res = await fetch(`/api/admin/vouchers/${voucherToDelete.id}`, {
        method: "DELETE",
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Không thể xóa voucher");
      }

      setVoucherToDelete(null);
      fetchVouchers();
    } catch (err: any) {
      setDeleteError(err.message || "Đã xảy ra lỗi khi xóa");
    } finally {
      setDeleting(false);
    }
  };

  // Reset Filters
  const handleResetFilters = () => {
    setSearch("");
    setSelectedType("ALL");
    setSelectedStatus("ALL");
    setPage(1);
  };

  const hasActiveFilters = Boolean(
    search || selectedType !== "ALL" || selectedStatus !== "ALL"
  );

  return (
    <div className="space-y-6">
      {/* 1. KPI Stats Cards */}
      <VoucherStats stats={stats} />

      {/* 2. Filters & Actions */}
      <VoucherFilters
        search={search}
        onSearchChange={(val) => {
          setSearch(val);
          setPage(1);
        }}
        selectedType={selectedType}
        onTypeChange={(t) => {
          setSelectedType(t);
          setPage(1);
        }}
        selectedStatus={selectedStatus}
        onStatusChange={(s) => {
          setSelectedStatus(s);
          setPage(1);
        }}
        onOpenCreateModal={handleOpenCreate}
        onResetFilters={handleResetFilters}
        hasActiveFilters={hasActiveFilters}
      />

      {/* 3. Table of Vouchers */}
      <VoucherTable
        vouchers={vouchers}
        loading={loading}
        page={page}
        totalPages={totalPages}
        totalItems={totalItems}
        onPageChange={setPage}
        onToggleActive={handleToggleActive}
        onViewDetail={handleOpenDetail}
        onEdit={handleOpenEdit}
        onDelete={handleDeletePrompt}
      />

      {/* Modal: Create & Edit Voucher */}
      <VoucherModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={() => {
          fetchVouchers();
        }}
        initialData={editingVoucher}
      />

      {/* Modal: View Details & Orders History */}
      <VoucherDetailModal
        voucher={detailVoucher}
        isOpen={isDetailOpen}
        onClose={() => {
          setIsDetailOpen(false);
          setDetailVoucher(null);
        }}
      />

      {/* Dialog: Confirm Delete Voucher */}
      {voucherToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-6 text-center">
              <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-800">
                Xác Nhận Xóa Mã Voucher?
              </h3>
              <p className="text-xs text-slate-500 mt-2">
                Bạn có chắc chắn muốn xóa vĩnh viễn voucher{" "}
                <span className="font-mono font-bold text-[#800028]">
                  {voucherToDelete.code}
                </span>{" "}
                khỏi hệ thống?
              </p>

              {deleteError && (
                <div className="mt-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs text-left">
                  <p className="font-bold flex items-center gap-1.5 mb-1">
                    <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                    Không thể xóa mã này
                  </p>
                  <p className="text-[11px] leading-relaxed">{deleteError}</p>
                </div>
              )}
            </div>

            <div className="flex items-center justify-end gap-2.5 px-6 py-4 bg-slate-50 border-t border-slate-100">
              <button
                type="button"
                disabled={deleting}
                onClick={() => setVoucherToDelete(null)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 text-xs font-bold transition-all"
              >
                Hủy bỏ
              </button>
              <button
                type="button"
                disabled={deleting}
                onClick={handleConfirmDelete}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-all disabled:opacity-50"
              >
                {deleting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Đang xóa...</span>
                  </>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4" />
                    <span>Xóa Vĩnh Viễn</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
