"use client";

// ============================================================
// components/admin/reviews/ReviewManager.tsx
// Trình Quản Lý & Kiểm Duyệt Đánh Giá (Client Component điều phối)
// ============================================================

import React, { useState, useEffect, useCallback } from "react";
import { ReviewStats } from "./ReviewStats";
import { ReviewFilters } from "./ReviewFilters";
import { ReviewTable } from "./ReviewTable";
import { AlertTriangle, Trash2, Loader2 } from "lucide-react";
import type { ReviewListItem, ReviewStatsData, ReviewStatus } from "./types";

interface ReviewManagerProps {
  initialStats?: ReviewStatsData;
}

export const ReviewManager: React.FC<ReviewManagerProps> = ({ initialStats }) => {
  // Data states
  const [reviews, setReviews] = useState<ReviewListItem[]>([]);
  const [stats, setStats] = useState<ReviewStatsData>(
    initialStats || {
      total: 0,
      pending: 0,
      approved: 0,
      rejected: 0,
      averageRating: 5.0,
    }
  );

  // Pagination states
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(true);

  // Filter states
  const [search, setSearch] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("ALL");
  const [selectedRating, setSelectedRating] = useState("ALL");
  const [sortBy, setSortBy] = useState("createdAt_desc");

  // Delete dialog states
  const [reviewToDelete, setReviewToDelete] = useState<ReviewListItem | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Fetch reviews from API
  const fetchReviews = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      params.set("page", page.toString());
      params.set("limit", "10");
      if (search) params.set("search", search);
      if (selectedStatus !== "ALL") params.set("status", selectedStatus);
      if (selectedRating !== "ALL") params.set("rating", selectedRating);
      if (sortBy) params.set("sortBy", sortBy);

      const res = await fetch(`/api/admin/reviews?${params.toString()}`);
      const data = await res.json();

      if (data.success) {
        setReviews(data.reviews);
        setTotalPages(data.pagination.totalPages);
        setTotalItems(data.pagination.total);
        if (data.stats) {
          setStats(data.stats);
        }
      }
    } catch (err) {
      console.error("Fetch reviews failed:", err);
    } finally {
      setLoading(false);
    }
  }, [page, search, selectedStatus, selectedRating, sortBy]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  // Handle Update Status with Optimistic UI
  const handleUpdateStatus = async (id: string, nextStatus: ReviewStatus) => {
    const prevReviews = [...reviews];

    // Optimistic update
    setReviews((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: nextStatus } : r))
    );

    try {
      const res = await fetch(`/api/admin/reviews/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: nextStatus }),
      });

      if (!res.ok) {
        throw new Error("Không thể cập nhật trạng thái");
      }

      // Re-fetch to sync counts
      fetchReviews();
    } catch (err) {
      // Revert if failed
      setReviews(prevReviews);
      alert("Đã xảy ra lỗi khi cập nhật trạng thái đánh giá");
    }
  };

  // Trigger Delete Review
  const handleDeletePrompt = (review: ReviewListItem) => {
    setReviewToDelete(review);
  };

  // Confirm Delete
  const handleConfirmDelete = async () => {
    if (!reviewToDelete) return;

    try {
      setDeleting(true);
      const res = await fetch(`/api/admin/reviews/${reviewToDelete.id}`, {
        method: "DELETE",
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Không thể xóa đánh giá");
      }

      setReviewToDelete(null);
      fetchReviews();
    } catch (err: any) {
      alert(err.message || "Đã xảy ra lỗi khi xóa");
    } finally {
      setDeleting(false);
    }
  };

  // Reset Filters
  const handleResetFilters = () => {
    setSearch("");
    setSelectedStatus("ALL");
    setSelectedRating("ALL");
    setSortBy("createdAt_desc");
    setPage(1);
  };

  const hasActiveFilters = Boolean(
    search ||
      selectedStatus !== "ALL" ||
      selectedRating !== "ALL" ||
      sortBy !== "createdAt_desc"
  );

  return (
    <div className="space-y-6">
      {/* 1. KPI Stats Cards */}
      <ReviewStats stats={stats} />

      {/* 2. Filters & Actions */}
      <ReviewFilters
        search={search}
        onSearchChange={(val) => {
          setSearch(val);
          setPage(1);
        }}
        selectedStatus={selectedStatus}
        onStatusChange={(s) => {
          setSelectedStatus(s);
          setPage(1);
        }}
        selectedRating={selectedRating}
        onRatingChange={(r) => {
          setSelectedRating(r);
          setPage(1);
        }}
        sortBy={sortBy}
        onSortByChange={(sb) => {
          setSortBy(sb);
          setPage(1);
        }}
        pendingCount={stats.pending}
        onResetFilters={handleResetFilters}
        hasActiveFilters={hasActiveFilters}
      />

      {/* 3. Table of Reviews */}
      <ReviewTable
        reviews={reviews}
        loading={loading}
        page={page}
        totalPages={totalPages}
        totalItems={totalItems}
        onPageChange={setPage}
        onUpdateStatus={handleUpdateStatus}
        onDeleteReview={handleDeletePrompt}
      />

      {/* Dialog: Confirm Delete Review */}
      {reviewToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-6 text-center">
              <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-800">
                Xác Nhận Xóa Đánh Giá?
              </h3>
              <p className="text-xs text-slate-500 mt-2">
                Bạn có chắc chắn muốn xóa đánh giá của{" "}
                <span className="font-bold text-slate-700">
                  {reviewToDelete.user.name || reviewToDelete.user.email}
                </span>{" "}
                cho sản phẩm{" "}
                <span className="font-bold text-[#800028]">
                  {reviewToDelete.product.name}
                </span>
                ? Thao tác này không thể hoàn tác.
              </p>
            </div>

            <div className="flex items-center justify-end gap-2.5 px-6 py-4 bg-slate-50 border-t border-slate-100">
              <button
                type="button"
                disabled={deleting}
                onClick={() => setReviewToDelete(null)}
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
