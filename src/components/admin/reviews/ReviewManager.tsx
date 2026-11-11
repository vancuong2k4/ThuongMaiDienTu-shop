// ============================================================
// components/admin/reviews/ReviewManager.tsx
// Trình Quản Lý & Kiểm Duyệt Đánh Giá UGC Air-Cargo (Phase 14)
// ============================================================

"use client";

import React, { useState, useEffect, useCallback } from "react";
import { ReviewStats } from "./ReviewStats";
import { ReviewFilters } from "./ReviewFilters";
import { ReviewTable } from "./ReviewTable";
import { ReviewPharmacistReplyModal } from "./ReviewPharmacistReplyModal";
import { AlertTriangle, Trash2, Loader2, CheckCircle2 } from "lucide-react";
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
      featured: 0,
      averageRating: 5.0,
      mediaRate: 0,
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
  const [hasImages, setHasImages] = useState(false);
  const [verifiedOnly, setVerifiedOnly] = useState(false);

  // Modals & Dialogs
  const [replyReview, setReplyReview] = useState<ReviewListItem | null>(null);
  const [reviewToDelete, setReviewToDelete] = useState<ReviewListItem | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [toastMessage, setToastMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const showToast = (type: "success" | "error", text: string) => {
    setToastMessage({ type, text });
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

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
      if (hasImages) params.set("hasImages", "true");
      if (verifiedOnly) params.set("verifiedOnly", "true");

      const res = await fetch(`/api/admin/reviews?${params.toString()}`);
      if (!res.ok) {
        throw new Error("Không thể tải danh sách đánh giá");
      }

      const data = await res.json();
      if (data.success) {
        setReviews(data.reviews || []);
        setTotalPages(data.pagination?.totalPages || 1);
        setTotalItems(data.pagination?.total || 0);
        if (data.stats) {
          setStats(data.stats);
        }
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Đã có lỗi xảy ra";
      showToast("error", msg);
    } finally {
      setLoading(false);
    }
  }, [page, search, selectedStatus, selectedRating, hasImages, verifiedOnly]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  // Cập nhật trạng thái duyệt (PENDING, APPROVED, REJECTED, FEATURED)
  const handleUpdateStatus = async (id: string, nextStatus: ReviewStatus) => {
    try {
      const res = await fetch(`/api/admin/reviews/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: nextStatus }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Không thể cập nhật trạng thái");
      }

      showToast("success", "Cập nhật trạng thái đánh giá thành công!");
      await fetchReviews();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Đã có lỗi xảy ra";
      showToast("error", msg);
    }
  };

  // Dược sĩ gửi phản hồi
  const handlePharmacistReplySubmit = async (
    reviewId: string,
    replyText: string
  ) => {
    try {
      const targetReview = reviews.find((r) => r.id === reviewId);
      const currentStatus = targetReview?.status || "APPROVED";

      const res = await fetch(`/api/admin/reviews/${reviewId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: currentStatus,
          adminReply: replyText,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Không thể lưu phản hồi");
      }

      showToast("success", "Gửi phản hồi từ Dược sĩ thành công!");
      await fetchReviews();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Đã có lỗi xảy ra";
      showToast("error", msg);
    }
  };

  // Xóa đánh giá
  const confirmDelete = async () => {
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

      showToast("success", "Đã xóa đánh giá vi phạm thành công!");
      setReviewToDelete(null);
      await fetchReviews();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Đã có lỗi xảy ra";
      showToast("error", msg);
    } finally {
      setDeleting(false);
    }
  };

  const hasActiveFilters =
    selectedStatus !== "ALL" ||
    selectedRating !== "ALL" ||
    Boolean(search) ||
    hasImages ||
    verifiedOnly;

  const handleResetFilters = () => {
    setSelectedStatus("ALL");
    setSelectedRating("ALL");
    setSearch("");
    setHasImages(false);
    setVerifiedOnly(false);
    setPage(1);
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div
          className={`p-3.5 rounded-2xl flex items-center justify-between text-xs sm:text-sm font-bold shadow-lg animate-in slide-in-from-top duration-200 ${
            toastMessage.type === "success"
              ? "bg-emerald-600 text-white"
              : "bg-red-600 text-white"
          }`}
        >
          <div className="flex items-center gap-2">
            <span>{toastMessage.type === "success" ? "✓" : "⚠"}</span>
            <span>{toastMessage.text}</span>
          </div>
          <button
            type="button"
            onClick={() => setToastMessage(null)}
            className="text-white/80 hover:text-white ml-3 font-bold"
          >
            ✕
          </button>
        </div>
      )}

      {/* KPI Stats */}
      <ReviewStats stats={stats} />

      {/* Filters & Search */}
      <ReviewFilters
        currentStatus={selectedStatus}
        onStatusChange={(status) => {
          setSelectedStatus(status);
          setPage(1);
        }}
        currentRating={selectedRating}
        onRatingChange={(rating) => {
          setSelectedRating(rating);
          setPage(1);
        }}
        search={search}
        onSearchChange={(val) => {
          setSearch(val);
          setPage(1);
        }}
        hasImages={hasImages}
        onHasImagesChange={(val) => {
          setHasImages(val);
          setPage(1);
        }}
        verifiedOnly={verifiedOnly}
        onVerifiedOnlyChange={(val) => {
          setVerifiedOnly(val);
          setPage(1);
        }}
        onResetFilters={handleResetFilters}
        hasActiveFilters={hasActiveFilters}
        counts={{
          all: stats.total,
          pending: stats.pending,
          approved: stats.approved,
          featured: stats.featured,
          rejected: stats.rejected,
        }}
      />

      {/* Reviews Table */}
      <ReviewTable
        reviews={reviews}
        loading={loading}
        page={page}
        totalPages={totalPages}
        totalItems={totalItems}
        onPageChange={setPage}
        onUpdateStatus={handleUpdateStatus}
        onDeleteReview={setReviewToDelete}
        onOpenPharmacistReply={setReplyReview}
      />

      {/* Modal Phản hồi Dược sĩ */}
      <ReviewPharmacistReplyModal
        review={replyReview}
        isOpen={replyReview !== null}
        onClose={() => setReplyReview(null)}
        onSubmit={handlePharmacistReplySubmit}
      />

      {/* Delete Confirmation Dialog */}
      {reviewToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl space-y-4 animate-in zoom-in-95 duration-150">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div className="text-center space-y-1">
              <h3 className="font-extrabold text-base text-slate-900">
                Xác Nhận Xóa Đánh Giá?
              </h3>
              <p className="text-xs text-slate-500">
                Hành động này sẽ xóa vĩnh viễn bài nhận xét và toàn bộ ảnh UGC kèm theo.
                Dữ liệu không thể khôi phục lại sau khi xóa.
              </p>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-700 italic text-center line-clamp-2">
              &ldquo;{reviewToDelete.content || "Ảnh đánh giá không có văn bản"}&rdquo;
            </div>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                type="button"
                disabled={deleting}
                onClick={() => setReviewToDelete(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors"
              >
                Hủy bỏ
              </button>
              <button
                type="button"
                disabled={deleting}
                onClick={confirmDelete}
                className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl text-xs font-bold bg-rose-600 text-white hover:bg-rose-700 transition-colors disabled:opacity-50 shadow-md shadow-rose-600/20"
              >
                {deleting ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Trash2 className="w-3.5 h-3.5" />
                )}
                <span>{deleting ? "Đang xóa..." : "Xác nhận xóa"}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
