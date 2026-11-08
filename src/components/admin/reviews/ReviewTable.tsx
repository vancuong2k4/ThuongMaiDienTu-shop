"use client";

// ============================================================
// components/admin/reviews/ReviewTable.tsx
// Bảng Danh Sách & Thao Tác Kiểm Duyệt Đánh Giá
// ============================================================

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Star,
  ExternalLink,
  Check,
  Ban,
  Trash2,
  Calendar,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  Loader2,
  X,
  Eye,
} from "lucide-react";
import type { ReviewListItem, ReviewStatus } from "./types";

interface ReviewTableProps {
  reviews: ReviewListItem[];
  loading: boolean;
  page: number;
  totalPages: number;
  totalItems: number;
  onPageChange: (newPage: number) => void;
  onUpdateStatus: (id: string, nextStatus: ReviewStatus) => Promise<void>;
  onDeleteReview: (review: ReviewListItem) => void;
}

export const ReviewTable: React.FC<ReviewTableProps> = ({
  reviews,
  loading,
  page,
  totalPages,
  totalItems,
  onPageChange,
  onUpdateStatus,
  onDeleteReview,
}) => {
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);

  const handleStatusChange = async (id: string, status: ReviewStatus) => {
    try {
      setUpdatingId(id);
      await onUpdateStatus(id, status);
    } finally {
      setUpdatingId(null);
    }
  };

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getInitials = (name: string | null, email: string) => {
    if (name) {
      const parts = name.trim().split(" ");
      if (parts.length >= 2) {
        return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
      }
      return name.slice(0, 2).toUpperCase();
    }
    return email.slice(0, 2).toUpperCase();
  };

  return (
    <>
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        {/* Table Container */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50/80 text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200/80">
              <tr>
                <th className="py-3.5 px-4 min-w-[220px]">Sản Phẩm</th>
                <th className="py-3.5 px-4 min-w-[180px]">Khách Hàng</th>
                <th className="py-3.5 px-4 min-w-[280px]">Đánh Giá & Nhận Xét</th>
                <th className="py-3.5 px-4">Thời Gian</th>
                <th className="py-3.5 px-4 text-center">Trạng Thái</th>
                <th className="py-3.5 px-4 text-right">Kiểm Duyệt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-16 text-center text-slate-400">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <Loader2 className="w-6 h-6 animate-spin text-[#800028]" />
                      <span className="text-xs font-medium">Đang tải danh sách đánh giá...</span>
                    </div>
                  </td>
                </tr>
              ) : reviews.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-16 text-center">
                    <div className="flex flex-col items-center justify-center gap-2 text-slate-400">
                      <AlertTriangle className="w-8 h-8 text-slate-300" />
                      <p className="text-sm font-semibold text-slate-600">
                        Không tìm thấy bài đánh giá nào
                      </p>
                      <p className="text-xs text-slate-400">
                        Thử thay đổi bộ lọc trạng thái hoặc từ khóa tìm kiếm
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                reviews.map((review) => {
                  const isUpdating = updatingId === review.id;

                  return (
                    <tr
                      key={review.id}
                      className="hover:bg-slate-50/60 transition-colors group"
                    >
                      {/* 1. Sản Phẩm */}
                      <td className="py-4 px-4 align-top">
                        <div className="flex items-start gap-2.5">
                          {review.product.image ? (
                            <Image
                              src={review.product.image}
                              alt={review.product.name}
                              width={44}
                              height={44}
                              className="w-11 h-11 rounded-lg object-cover border border-slate-200 shrink-0"
                            />
                          ) : (
                            <div className="w-11 h-11 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400 text-xs shrink-0">
                              SP
                            </div>
                          )}
                          <div className="min-w-0">
                            <Link
                              href={`/san-pham/${review.product.slug}`}
                              target="_blank"
                              className="font-bold text-xs text-slate-800 hover:text-[#800028] hover:underline line-clamp-2 leading-snug"
                              title={review.product.name}
                            >
                              {review.product.name}
                            </Link>
                            <span className="inline-flex items-center gap-1 text-[10px] text-slate-400 mt-1">
                              <span>Xem sản phẩm</span>
                              <ExternalLink className="w-2.5 h-2.5" />
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* 2. Khách Hàng */}
                      <td className="py-4 px-4 align-top">
                        <div className="flex items-center gap-2">
                          {review.user.avatar ? (
                            <Image
                              src={review.user.avatar}
                              alt={review.user.name || review.user.email}
                              width={32}
                              height={32}
                              className="w-8 h-8 rounded-full object-cover border border-slate-200"
                            />
                          ) : (
                            <div className="w-8 h-8 rounded-full bg-slate-100 text-[#800028] font-bold text-xs flex items-center justify-center border border-slate-200 shrink-0">
                              {getInitials(review.user.name, review.user.email)}
                            </div>
                          )}
                          <div className="min-w-0">
                            <p className="font-bold text-xs text-slate-800 truncate">
                              {review.user.name || "Khách hàng"}
                            </p>
                            <p className="text-[11px] text-slate-400 truncate">
                              {review.user.email}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* 3. Đánh Giá & Nội Dung */}
                      <td className="py-4 px-4 align-top">
                        <div className="space-y-1.5">
                          {/* Stars */}
                          <div className="flex items-center gap-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                className={`w-3.5 h-3.5 ${
                                  star <= review.rating
                                    ? "text-amber-400 fill-amber-400"
                                    : "text-slate-200"
                                }`}
                              />
                            ))}
                            <span className="text-xs font-bold text-slate-700 ml-1">
                              {review.rating}.0
                            </span>
                          </div>

                          {/* Content */}
                          {review.content ? (
                            <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                              {review.content}
                            </p>
                          ) : (
                            <p className="text-xs text-slate-400 italic">
                              (Khách hàng không để lại nhận xét bằng chữ)
                            </p>
                          )}

                          {/* Images Attachments */}
                          {review.images && review.images.length > 0 && (
                            <div className="flex items-center gap-2 pt-1">
                              {review.images.map((img, idx) => (
                                <button
                                  key={idx}
                                  type="button"
                                  onClick={() => setLightboxImage(img)}
                                  className="relative group/img overflow-hidden rounded-lg border border-slate-200 hover:border-[#800028] transition-all"
                                  title="Bấm để xem ảnh phóng to"
                                >
                                  <Image
                                    src={img}
                                    alt={`Ảnh review ${idx + 1}`}
                                    width={48}
                                    height={48}
                                    className="w-12 h-12 object-cover"
                                  />
                                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center text-white">
                                    <Eye className="w-3.5 h-3.5" />
                                  </div>
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      </td>

                      {/* 4. Thời Gian */}
                      <td className="py-4 px-4 align-top">
                        <div className="flex items-center gap-1 text-xs text-slate-500">
                          <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span className="whitespace-nowrap">{formatDate(review.createdAt)}</span>
                        </div>
                      </td>

                      {/* 5. Trạng Thái */}
                      <td className="py-4 px-4 align-top text-center">
                        {review.status === "APPROVED" ? (
                          <span className="inline-block px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            🟢 Đã công khai
                          </span>
                        ) : review.status === "PENDING" ? (
                          <span className="inline-block px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-300 animate-pulse">
                            🟡 Chờ duyệt
                          </span>
                        ) : (
                          <span className="inline-block px-2.5 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200">
                            🔴 Đã từ chối
                          </span>
                        )}
                      </td>

                      {/* 6. Thao Tác Kiểm Duyệt */}
                      <td className="py-4 px-4 align-top text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Nút Duyệt nếu chưa duyệt */}
                          {review.status !== "APPROVED" && (
                            <button
                              type="button"
                              disabled={isUpdating}
                              onClick={() => handleStatusChange(review.id, "APPROVED")}
                              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 text-xs font-bold transition-all disabled:opacity-50"
                              title="Phê duyệt công khai đánh giá này"
                            >
                              <Check className="w-3.5 h-3.5" />
                              <span>Duyệt</span>
                            </button>
                          )}

                          {/* Nút Từ chối/Ẩn nếu chưa từ chối */}
                          {review.status !== "REJECTED" && (
                            <button
                              type="button"
                              disabled={isUpdating}
                              onClick={() => handleStatusChange(review.id, "REJECTED")}
                              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 text-xs font-bold transition-all disabled:opacity-50"
                              title="Từ chối hoặc ẩn đánh giá này"
                            >
                              <Ban className="w-3.5 h-3.5" />
                              <span>Ẩn</span>
                            </button>
                          )}

                          {/* Nút Xóa vĩnh viễn */}
                          <button
                            type="button"
                            disabled={isUpdating}
                            onClick={() => onDeleteReview(review)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors disabled:opacity-50"
                            title="Xóa vĩnh viễn đánh giá"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        {!loading && reviews.length > 0 && totalPages > 1 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 border-t border-slate-100 bg-slate-50/50 text-xs text-slate-500">
            <p>
              Hiển thị trang <span className="font-bold text-slate-700">{page}</span> /{" "}
              <span className="font-bold text-slate-700">{totalPages}</span> (Tổng{" "}
              <span className="font-bold text-slate-700">{totalItems}</span> đánh giá)
            </p>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                disabled={page <= 1}
                onClick={() => onPageChange(page - 1)}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all font-semibold"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Trước</span>
              </button>
              <div className="px-2 py-1 font-bold text-slate-700">{page}</div>
              <button
                type="button"
                disabled={page >= totalPages}
                onClick={() => onPageChange(page + 1)}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all font-semibold"
              >
                <span>Sau</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Lightbox Modal: Xem ảnh đánh giá kích thước đầy đủ */}
      {lightboxImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-in fade-in"
          onClick={() => setLightboxImage(null)}
        >
          <div
            className="relative max-w-3xl max-h-[90vh] bg-transparent"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setLightboxImage(null)}
              className="absolute -top-10 right-0 p-2 text-white hover:text-slate-300"
            >
              <X className="w-6 h-6" />
            </button>
            <Image
              src={lightboxImage}
              alt="Ảnh đánh giá"
              width={800}
              height={800}
              className="max-h-[85vh] w-auto rounded-2xl object-contain shadow-2xl"
            />
          </div>
        </div>
      )}
    </>
  );
};
