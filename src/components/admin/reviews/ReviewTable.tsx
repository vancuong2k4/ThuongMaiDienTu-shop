// ============================================================
// components/admin/reviews/ReviewTable.tsx
// Bảng Danh Sách & Thao Tác Kiểm Duyệt Đánh Giá UGC Air-Cargo (Phase 14)
// ============================================================

"use client";

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
  ShieldCheck,
  CheckCircle2,
  MessageSquare,
  Award,
  ThumbsUp,
  Package,
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
  onOpenPharmacistReply: (review: ReviewListItem) => void;
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
  onOpenPharmacistReply,
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
                <th className="py-3.5 px-4 min-w-[200px]">Sản Phẩm</th>
                <th className="py-3.5 px-4 min-w-[170px]">Khách Hàng</th>
                <th className="py-3.5 px-4 min-w-[320px]">Đánh Giá & Nhận Xét</th>
                <th className="py-3.5 px-4 min-w-[130px]">Thời Gian</th>
                <th className="py-3.5 px-4 text-center">Trạng Thái</th>
                <th className="py-3.5 px-4 text-right min-w-[160px]">Kiểm Duyệt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-[#800028]" />
                    <span>Đang tải danh sách đánh giá...</span>
                  </td>
                </tr>
              ) : reviews.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    <AlertTriangle className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                    <span>Không tìm thấy đánh giá nào phù hợp với bộ lọc</span>
                  </td>
                </tr>
              ) : (
                reviews.map((item) => {
                  const isUpdating = updatingId === item.id;
                  return (
                    <tr
                      key={item.id}
                      className="hover:bg-slate-50/70 transition-colors align-top"
                    >
                      {/* Cột 1: Sản phẩm */}
                      <td className="py-4 px-4">
                        <div className="flex items-start gap-3">
                          <div className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200 overflow-hidden shrink-0 flex items-center justify-center">
                            {item.product.image ? (
                              <Image
                                src={item.product.image}
                                alt={item.product.name}
                                width={48}
                                height={48}
                                className="w-full h-full object-contain"
                              />
                            ) : (
                              <Package className="w-6 h-6 text-slate-400" />
                            )}
                          </div>
                          <div className="min-w-0 flex-1">
                            <Link
                              href={`/san-pham/${item.product.slug}`}
                              target="_blank"
                              className="font-bold text-xs text-slate-800 hover:text-[#800028] transition-colors line-clamp-2"
                              title={item.product.name}
                            >
                              {item.product.name}
                            </Link>
                            <span className="inline-flex items-center gap-1 text-[11px] text-slate-400 mt-1">
                              <ExternalLink className="w-3 h-3" />
                              Xem sản phẩm
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Cột 2: Khách hàng */}
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2.5">
                          <div className="w-9 h-9 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-xs text-slate-700 overflow-hidden shrink-0">
                            {item.user.avatar ? (
                              <Image
                                src={item.user.avatar}
                                alt={item.user.name || item.user.email}
                                width={36}
                                height={36}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              getInitials(item.user.name, item.user.email)
                            )}
                          </div>
                          <div className="min-w-0">
                            <p className="font-bold text-xs text-slate-800 truncate">
                              {item.user.name || "Ẩn danh"}
                            </p>
                            <p className="text-[11px] text-slate-400 truncate">
                              {item.user.email}
                            </p>
                            {item.user.membershipTier && (
                              <span className="inline-block mt-0.5 px-1.5 py-0.2 rounded text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                                {item.user.membershipTier}
                              </span>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Cột 3: Đánh giá, sao & Ảnh UGC */}
                      <td className="py-4 px-4 space-y-2">
                        {/* Sao tổng thể & Huy hiệu uy tín */}
                        <div className="flex flex-wrap items-center gap-2">
                          <div className="flex items-center text-amber-400">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                className={`w-3.5 h-3.5 ${
                                  star <= item.rating
                                    ? "fill-amber-400 text-amber-400"
                                    : "text-slate-200"
                                }`}
                              />
                            ))}
                            <span className="ml-1.5 font-black text-xs text-slate-700">
                              {item.rating}.0
                            </span>
                          </div>

                          {item.isVerifiedBuyer && (
                            <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                              <CheckCircle2 className="w-3 h-3" />
                              Đã mua hàng
                            </span>
                          )}

                          {item.airCargoVerified && (
                            <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                              <ShieldCheck className="w-3 h-3" />
                              Bay Air
                            </span>
                          )}

                          {item.rewardPoints > 0 && (
                            <span className="inline-block px-1.5 py-0.5 rounded text-[10px] font-bold bg-purple-50 text-purple-700">
                              +{item.rewardPoints}đ
                            </span>
                          )}
                        </div>

                        {/* Điểm tiêu chí chi tiết */}
                        {(item.packagingRating ||
                          item.freshnessRating ||
                          item.effectivenessRating) && (
                          <div className="flex items-center gap-2 text-[10px] text-slate-500">
                            {item.packagingRating && (
                              <span>Đóng gói: <strong>{item.packagingRating}★</strong></span>
                            )}
                            {item.freshnessRating && (
                              <span>• Date mới: <strong>{item.freshnessRating}★</strong></span>
                            )}
                            {item.effectivenessRating && (
                              <span>• Hiệu quả: <strong>{item.effectivenessRating}★</strong></span>
                            )}
                          </div>
                        )}

                        {/* Nội dung nhận xét */}
                        <p className="text-xs text-slate-700 leading-relaxed break-words">
                          {item.content || <em className="text-slate-400">Không có văn bản nhận xét</em>}
                        </p>

                        {/* Thư viện ảnh UGC */}
                        {item.images && item.images.length > 0 && (
                          <div className="flex flex-wrap items-center gap-1.5 pt-1">
                            {item.images.map((imgUrl, idx) => (
                              <button
                                key={idx}
                                type="button"
                                onClick={() => setLightboxImage(imgUrl)}
                                className="relative w-12 h-12 rounded-lg border border-slate-200 overflow-hidden group shrink-0 hover:border-[#800028] transition-colors"
                              >
                                <Image
                                  src={imgUrl}
                                  alt="UGC Preview"
                                  width={48}
                                  height={48}
                                  className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                  <Eye className="w-3.5 h-3.5 text-white" />
                                </div>
                              </button>
                            ))}
                          </div>
                        )}

                        {/* Lượt hữu ích */}
                        {item.helpfulCount > 0 && (
                          <div className="flex items-center gap-1 text-[11px] text-slate-500 font-medium">
                            <ThumbsUp className="w-3 h-3 text-slate-400" />
                            <span>{item.helpfulCount} người thấy hữu ích</span>
                          </div>
                        )}

                        {/* Phản hồi từ Dược sĩ nếu có */}
                        {item.adminReply ? (
                          <div className="p-2.5 rounded-xl bg-rose-50/60 border border-rose-100 text-[11px] space-y-1">
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-[#800028] flex items-center gap-1">
                                <MessageSquare className="w-3 h-3" />
                                Dược sĩ THUYNGA Shop phản hồi:
                              </span>
                              <button
                                type="button"
                                onClick={() => onOpenPharmacistReply(item)}
                                className="text-[10px] text-[#800028] hover:underline font-semibold"
                              >
                                Sửa
                              </button>
                            </div>
                            <p className="text-slate-700 italic">
                              &ldquo;{item.adminReply}&rdquo;
                            </p>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => onOpenPharmacistReply(item)}
                            className="inline-flex items-center gap-1 text-[11px] text-[#800028] hover:underline font-semibold"
                          >
                            <MessageSquare className="w-3 h-3" />
                            <span>Thêm phản hồi từ Dược sĩ</span>
                          </button>
                        )}
                      </td>

                      {/* Cột 4: Thời gian */}
                      <td className="py-4 px-4 text-xs text-slate-500 whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          <span>{formatDate(item.createdAt)}</span>
                        </div>
                      </td>

                      {/* Cột 5: Trạng thái */}
                      <td className="py-4 px-4 text-center whitespace-nowrap">
                        {item.status === "FEATURED" && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-purple-100 text-purple-800 border border-purple-200">
                            <Award className="w-3 h-3" />
                            Ghim Top
                          </span>
                        )}
                        {item.status === "APPROVED" && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                            <Check className="w-3 h-3" />
                            Đã Duyệt
                          </span>
                        )}
                        {item.status === "PENDING" && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                            Chờ Duyệt
                          </span>
                        )}
                        {item.status === "REJECTED" && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-800 border border-rose-200">
                            <Ban className="w-3 h-3" />
                            Từ Chối
                          </span>
                        )}
                      </td>

                      {/* Cột 6: Thao tác kiểm duyệt */}
                      <td className="py-4 px-4 text-right whitespace-nowrap">
                        <div className="inline-flex items-center gap-1.5">
                          {/* Phê duyệt */}
                          {item.status !== "APPROVED" && (
                            <button
                              type="button"
                              disabled={isUpdating}
                              onClick={() => handleStatusChange(item.id, "APPROVED")}
                              title="Phê duyệt hiển thị công khai"
                              className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 flex items-center justify-center transition-colors disabled:opacity-50"
                            >
                              <Check className="w-4 h-4" />
                            </button>
                          )}

                          {/* Ghim Top UGC */}
                          {item.status !== "FEATURED" && (
                            <button
                              type="button"
                              disabled={isUpdating}
                              onClick={() => handleStatusChange(item.id, "FEATURED")}
                              title="Ghim nổi bật (Top UGC)"
                              className="w-8 h-8 rounded-lg bg-purple-50 text-purple-700 hover:bg-purple-100 flex items-center justify-center transition-colors disabled:opacity-50"
                            >
                              <Award className="w-4 h-4" />
                            </button>
                          )}

                          {/* Từ chối */}
                          {item.status !== "REJECTED" && (
                            <button
                              type="button"
                              disabled={isUpdating}
                              onClick={() => handleStatusChange(item.id, "REJECTED")}
                              title="Từ chối / Tạm ẩn đánh giá"
                              className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 hover:bg-amber-100 flex items-center justify-center transition-colors disabled:opacity-50"
                            >
                              <Ban className="w-4 h-4" />
                            </button>
                          )}

                          {/* Xóa vĩnh viễn */}
                          <button
                            type="button"
                            disabled={isUpdating}
                            onClick={() => onDeleteReview(item)}
                            title="Xóa đánh giá vi phạm"
                            className="w-8 h-8 rounded-lg bg-slate-100 text-slate-500 hover:bg-rose-50 hover:text-rose-600 flex items-center justify-center transition-colors disabled:opacity-50"
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

        {/* Phân trang */}
        {totalPages > 1 && (
          <div className="p-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <div>
              Hiển thị <strong>{reviews.length}</strong> / <strong>{totalItems}</strong> đánh giá
            </div>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                disabled={page <= 1 || loading}
                onClick={() => onPageChange(page - 1)}
                className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center hover:bg-slate-50 disabled:opacity-40 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="px-2 font-bold text-slate-700">
                {page} / {totalPages}
              </span>
              <button
                type="button"
                disabled={page >= totalPages || loading}
                onClick={() => onPageChange(page + 1)}
                className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center hover:bg-slate-50 disabled:opacity-40 transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Lightbox Modal xem ảnh UGC phóng to */}
      {lightboxImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-in fade-in duration-150"
          onClick={() => setLightboxImage(null)}
        >
          <div className="relative max-w-3xl max-h-[90vh] overflow-hidden rounded-2xl bg-white p-2">
            <button
              type="button"
              onClick={() => setLightboxImage(null)}
              className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/80 transition-colors z-10"
            >
              <X className="w-5 h-5" />
            </button>
            <Image
              src={lightboxImage}
              alt="UGC Fullsize"
              width={800}
              height={800}
              className="w-auto h-auto max-h-[85vh] object-contain rounded-xl"
            />
          </div>
        </div>
      )}
    </>
  );
};
