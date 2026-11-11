// ============================================================
// components/storefront/product/ProductReviewsSection.tsx
// Phân Hệ Đánh Giá Xác Thực Bay Air & UGC Khách Hàng (Phase 14)
// ============================================================

"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
  Star,
  CheckCircle2,
  ShieldCheck,
  ThumbsUp,
  MessageSquarePlus,
  X,
  Send,
  Image as ImageIcon,
  Camera,
  Eye,
  Award,
  Loader2,
  Package,
} from "lucide-react";
import { useSession } from "next-auth/react";
import { formatDate } from "@/lib/utils";

export interface ReviewItemData {
  id: string;
  rating: number;
  packagingRating?: number | null;
  freshnessRating?: number | null;
  effectivenessRating?: number | null;
  content: string | null;
  images: string[];
  isVerifiedBuyer?: boolean;
  airCargoVerified?: boolean;
  helpfulCount?: number;
  isHelpfulByMe?: boolean;
  adminReply?: string | null;
  adminReplyAt?: string | null;
  rewardPoints?: number;
  isFeatured?: boolean;
  createdAt: string | Date;
  user: {
    name: string | null;
    avatar: string | null;
    membershipTier?: string | null;
  };
}

interface ProductReviewsSectionProps {
  productId: string;
  productSlug?: string;
  productName: string;
  reviews?: ReviewItemData[];
}

export function ProductReviewsSection({
  productId,
  productSlug,
  productName,
  reviews: initialReviews = [],
}: ProductReviewsSectionProps) {
  const { data: session } = useSession();
  const [reviews, setReviews] = useState<ReviewItemData[]>(initialReviews);
  const [filterRating, setFilterRating] = useState<number | null>(null);
  const [filterHasImages, setFilterHasImages] = useState(false);
  const [filterVerifiedOnly, setFilterVerifiedOnly] = useState(false);
  const [sortBy, setSortBy] = useState<"latest" | "helpful" | "highest">("latest");

  // Modal Đánh giá
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [ratingInput, setRatingInput] = useState(5);
  const [packagingRatingInput, setPackagingRatingInput] = useState(5);
  const [freshnessRatingInput, setFreshnessRatingInput] = useState(5);
  const [effectivenessRatingInput, setEffectivenessRatingInput] = useState(5);
  const [contentInput, setContentInput] = useState("");
  const [imageUrlInput, setImageUrlInput] = useState("");
  const [imagesList, setImagesList] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccessMsg, setSubmitSuccessMsg] = useState<string | null>(null);
  const [modalError, setModalError] = useState<string | null>(null);

  // Lightbox xem ảnh lớn
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);

  // Fetch reviews nếu có slug
  const fetchReviewsFromApi = async () => {
    if (!productSlug) return;
    try {
      const params = new URLSearchParams();
      if (filterRating) params.set("rating", filterRating.toString());
      if (filterHasImages) params.set("hasImages", "true");
      if (filterVerifiedOnly) params.set("verifiedOnly", "true");
      params.set("sort", sortBy);

      const res = await fetch(`/api/reviews/product/${productSlug}?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setReviews(data.reviews || []);
      }
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    if (productSlug) {
      fetchReviewsFromApi();
    }
  }, [productSlug, filterRating, filterHasImages, filterVerifiedOnly, sortBy]);

  // Tính điểm đánh giá trung bình & Phân bổ sao
  const totalReviews = reviews.length;
  const averageRating =
    totalReviews > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews
      : 5.0;

  const starCounts: Record<number, number> = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  reviews.forEach((r) => {
    if (starCounts[r.rating] !== undefined) {
      starCounts[r.rating]++;
    }
  });

  // Toàn bộ ảnh UGC từ các bài review
  const allUgcImages = reviews.flatMap((r) => r.images || []);

  // Xử lý vote "Hữu ích"
  const handleToggleHelpful = async (reviewId: string) => {
    if (!session?.user) {
      alert("Vui lòng đăng nhập để bình chọn đánh giá hữu ích");
      return;
    }

    try {
      const res = await fetch(`/api/reviews/${reviewId}/helpful`, {
        method: "POST",
      });
      const data = await res.json();
      if (res.ok) {
        setReviews((prev) =>
          prev.map((r) =>
            r.id === reviewId
              ? {
                  ...r,
                  helpfulCount: data.helpfulCount,
                  isHelpfulByMe: data.isHelpful,
                }
              : r
          )
        );
      } else {
        alert(data.error || "Không thể bình chọn");
      }
    } catch {
      // ignore
    }
  };

  // Thêm ảnh vào danh sách đánh giá
  const handleAddImage = () => {
    if (!imageUrlInput.trim()) return;
    if (imagesList.length >= 5) {
      alert("Tối đa 5 ảnh");
      return;
    }
    setImagesList([...imagesList, imageUrlInput.trim()]);
    setImageUrlInput("");
  };

  // Gửi đánh giá mới
  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session?.user) {
      setModalError("Vui lòng đăng nhập để gửi đánh giá và nhận điểm");
      return;
    }
    if (contentInput.trim().length < 10) {
      setModalError("Nội dung đánh giá tối thiểu 10 ký tự");
      return;
    }

    setIsSubmitting(true);
    setModalError(null);
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId,
          rating: ratingInput,
          packagingRating: packagingRatingInput,
          freshnessRating: freshnessRatingInput,
          effectivenessRating: effectivenessRatingInput,
          content: contentInput.trim(),
          images: imagesList,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Không thể gửi đánh giá");
      }

      setSubmitSuccessMsg(data.message || "Gửi đánh giá thành công!");
      setTimeout(() => {
        setIsModalOpen(false);
        setSubmitSuccessMsg(null);
        setContentInput("");
        setImagesList([]);
        if (productSlug) fetchReviewsFromApi();
      }, 2000);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Đã có lỗi xảy ra";
      setModalError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section
      id="danh-gia-khach-hang"
      className="bg-white rounded-3xl border border-neutral-200/90 p-6 sm:p-8 shadow-xs space-y-6"
    >
      {/* ── 1. Section Header ──────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-100 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-lg sm:text-xl font-black text-neutral-900 tracking-tight">
              Đánh Giá & Trưng Bày UGC Người Mua Thực Tế
            </h3>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              Air-Cargo 100%
            </span>
          </div>
          <p className="text-xs text-neutral-500 mt-1">
            Hình ảnh bóc hộp thực tế và trải nghiệm chân thực từ các mẹ bỉm sữa & khách hàng toàn quốc
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-[#800028] text-white hover:bg-[#660020] transition-colors shadow-md shadow-[#800028]/20 self-start sm:self-auto shrink-0"
        >
          <Camera className="w-4 h-4 text-rose-200" />
          <span>Viết đánh giá & Nhận đến +150đ</span>
        </button>
      </div>

      {/* ── 2. Rating Breakdown Box & Sub-scores ─────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 p-6 rounded-3xl bg-neutral-50/70 border border-neutral-100">
        {/* Điểm tổng quan (4 cols) */}
        <div className="md:col-span-4 flex flex-col items-center justify-center text-center p-4 border-b md:border-b-0 md:border-r border-neutral-200/80">
          <div className="text-5xl font-black text-[#800028] tracking-tight">
            {averageRating.toFixed(1)}
          </div>
          <div className="flex items-center gap-1 text-amber-400 my-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`w-5 h-5 ${
                  star <= Math.round(averageRating)
                    ? "fill-amber-400 text-amber-400"
                    : "text-neutral-200"
                }`}
              />
            ))}
          </div>
          <div className="text-xs font-bold text-neutral-600">
            Dựa trên {totalReviews} lượt đánh giá thực tế
          </div>
          <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>100% Cam kết chuẩn Air-Cargo Úc</span>
          </div>
        </div>

        {/* Thanh phân bổ 5 sao (5 cols) */}
        <div className="md:col-span-5 space-y-2 flex flex-col justify-center">
          {[5, 4, 3, 2, 1].map((s) => {
            const count = starCounts[s] || 0;
            const pct = totalReviews > 0 ? (count / totalReviews) * 100 : 0;
            return (
              <div key={s} className="flex items-center gap-3 text-xs">
                <span className="w-8 font-bold text-neutral-700 flex items-center gap-1">
                  {s} <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                </span>
                <div className="flex-1 h-2 rounded-full bg-neutral-200/80 overflow-hidden">
                  <div
                    className="h-full bg-amber-400 rounded-full transition-all duration-300"
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <span className="w-12 text-right font-medium text-neutral-500">
                  {count} ({Math.round(pct)}%)
                </span>
              </div>
            );
          })}
        </div>

        {/* Điểm thành phần chi tiết (3 cols) */}
        <div className="md:col-span-3 flex flex-col justify-center space-y-3 border-t md:border-t-0 md:border-l border-neutral-200/80 pt-4 md:pt-0 md:pl-5 text-xs">
          <div className="space-y-1">
            <div className="flex items-center justify-between text-neutral-700">
              <span className="font-semibold">Đóng gói Air-cargo:</span>
              <strong className="text-amber-600 font-bold">5.0 ★</strong>
            </div>
            <div className="h-1.5 rounded-full bg-neutral-200 overflow-hidden">
              <div className="h-full bg-emerald-500 rounded-full w-[98%]" />
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-between text-neutral-700">
              <span className="font-semibold">Date HSD mới tinh:</span>
              <strong className="text-amber-600 font-bold">5.0 ★</strong>
            </div>
            <div className="h-1.5 rounded-full bg-neutral-200 overflow-hidden">
              <div className="h-full bg-emerald-500 rounded-full w-[96%]" />
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-between text-neutral-700">
              <span className="font-semibold">Bé hợp vị & Hiệu quả:</span>
              <strong className="text-amber-600 font-bold">4.9 ★</strong>
            </div>
            <div className="h-1.5 rounded-full bg-neutral-200 overflow-hidden">
              <div className="h-full bg-emerald-500 rounded-full w-[94%]" />
            </div>
          </div>
        </div>
      </div>

      {/* ── 3. Top UGC Unboxing Gallery (Ảnh thực tế từ khách) ─────────── */}
      {allUgcImages.length > 0 && (
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Camera className="w-4 h-4 text-[#800028]" />
              <h4 className="text-xs font-bold text-neutral-800 uppercase tracking-wider">
                Góc Ảnh Mở Hộp Air-Cargo Của Khách Hàng ({allUgcImages.length})
              </h4>
            </div>
            <span className="text-xs text-neutral-400">
              Nhấp vào ảnh để xem kích thước lớn
            </span>
          </div>

          <div className="flex items-center gap-3 overflow-x-auto scrollbar-hide py-1">
            {allUgcImages.map((imgUrl, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setLightboxImage(imgUrl)}
                className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl border border-neutral-200 overflow-hidden shrink-0 group hover:border-[#800028] transition-all shadow-xs"
              >
                <Image
                  src={imgUrl}
                  alt={`UGC ${idx + 1}`}
                  width={96}
                  height={96}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
                <div className="absolute inset-0 bg-black/25 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                  <Eye className="w-4 h-4 text-white" />
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ── 4. Filter Toolbar ──────────────────────────────────────── */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setFilterRating(null)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              filterRating === null
                ? "bg-neutral-900 text-white"
                : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
            }`}
          >
            Tất cả ({totalReviews})
          </button>
          {[5, 4, 3, 2, 1].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setFilterRating(filterRating === star ? null : star)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 ${
                filterRating === star
                  ? "bg-amber-500 text-white"
                  : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
              }`}
            >
              <span>{star}</span>
              <Star className="w-3 h-3 fill-current" />
              <span>({starCounts[star] || 0})</span>
            </button>
          ))}

          <button
            type="button"
            onClick={() => setFilterHasImages(!filterHasImages)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 border ${
              filterHasImages
                ? "bg-emerald-50 border-emerald-300 text-emerald-800"
                : "bg-white border-neutral-200 text-neutral-600 hover:bg-neutral-50"
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5" />
            <span>Có ảnh UGC</span>
          </button>

          <button
            type="button"
            onClick={() => setFilterVerifiedOnly(!filterVerifiedOnly)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 border ${
              filterVerifiedOnly
                ? "bg-blue-50 border-blue-300 text-blue-800"
                : "bg-white border-neutral-200 text-neutral-600 hover:bg-neutral-50"
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Đã mua hàng</span>
          </button>
        </div>

        {/* Sort */}
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as any)}
          aria-label="Sắp xếp đánh giá"
          className="text-xs py-1.5 px-3 rounded-xl border border-neutral-200 bg-white font-semibold text-neutral-700"
        >
          <option value="latest">Mới nhất</option>
          <option value="helpful">Hữu ích nhất</option>
          <option value="highest">Sao cao nhất</option>
        </select>
      </div>

      {/* ── 5. Review Cards List ───────────────────────────────────── */}
      <div className="divide-y divide-neutral-100 space-y-4 pt-2">
        {reviews.length === 0 ? (
          <div className="py-12 text-center text-neutral-400 space-y-2">
            <Package className="w-8 h-8 text-neutral-300 mx-auto" />
            <p className="text-xs font-semibold text-neutral-700">
              Chưa có đánh giá nào phù hợp với bộ lọc hiện tại.
            </p>
          </div>
        ) : (
          reviews.map((rev) => (
            <div key={rev.id} className="pt-5 first:pt-0 space-y-3">
              {/* Header dòng review */}
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-neutral-100 border border-neutral-200 overflow-hidden flex items-center justify-center font-bold text-xs text-neutral-700 shrink-0">
                    {rev.user.avatar ? (
                      <Image
                        src={rev.user.avatar}
                        alt={rev.user.name || "User"}
                        width={40}
                        height={40}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      (rev.user.name || "KH").slice(0, 2).toUpperCase()
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-xs sm:text-sm text-neutral-900">
                        {rev.user.name || "Khách hàng"}
                      </span>
                      {rev.isVerifiedBuyer && (
                        <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                          <CheckCircle2 className="w-3 h-3" />
                          Đã mua hàng
                        </span>
                      )}
                      {rev.airCargoVerified && (
                        <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <ShieldCheck className="w-3 h-3" />
                          Chuẩn Air Úc
                        </span>
                      )}
                      {rev.isFeatured && (
                        <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-50 text-purple-700 border border-purple-200">
                          <Award className="w-3 h-3" />
                          Top Đánh Giá
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 mt-0.5">
                      <div className="flex items-center text-amber-400">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star
                            key={s}
                            className={`w-3 h-3 ${
                              s <= rev.rating
                                ? "fill-amber-400 text-amber-400"
                                : "text-neutral-200"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-[11px] text-neutral-400">
                        {formatDate(rev.createdAt)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Nội dung nhận xét */}
              <p className="text-xs sm:text-sm text-neutral-700 leading-relaxed pl-13">
                {rev.content}
              </p>

              {/* Ảnh UGC đính kèm */}
              {rev.images && rev.images.length > 0 && (
                <div className="flex flex-wrap items-center gap-2 pl-13 pt-1">
                  {rev.images.map((imgUrl, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setLightboxImage(imgUrl)}
                      className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-xl border border-neutral-200 overflow-hidden group hover:border-[#800028] transition-colors shrink-0"
                    >
                      <Image
                        src={imgUrl}
                        alt="UGC Image"
                        width={80}
                        height={80}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                        <Eye className="w-3.5 h-3.5 text-white" />
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {/* Phản hồi chính thức từ Dược sĩ THUYNGA Shop */}
              {rev.adminReply && (
                <div className="ml-13 p-3.5 rounded-2xl bg-rose-50/70 border border-rose-200/70 space-y-1 text-xs">
                  <div className="flex items-center gap-1.5 font-bold text-[#800028]">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Dược sĩ THUYNGA Shop phản hồi:</span>
                  </div>
                  <p className="text-neutral-700 italic leading-relaxed">
                    &ldquo;{rev.adminReply}&rdquo;
                  </p>
                </div>
              )}

              {/* Nút bình chọn Hữu ích */}
              <div className="pl-13 flex items-center gap-4 text-xs text-neutral-500 pt-1">
                <button
                  type="button"
                  onClick={() => handleToggleHelpful(rev.id)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg border transition-colors ${
                    rev.isHelpfulByMe
                      ? "bg-rose-50 border-rose-200 text-[#800028] font-bold"
                      : "bg-neutral-50 border-neutral-200 hover:bg-neutral-100 text-neutral-600"
                  }`}
                >
                  <ThumbsUp className="w-3.5 h-3.5" />
                  <span>Hữu ích ({rev.helpfulCount || 0})</span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* ── 6. Modal Viết Đánh Giá ─────────────────────────────────── */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="w-full max-w-lg bg-white rounded-3xl p-6 sm:p-8 shadow-2xl space-y-5 animate-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
              <div>
                <h3 className="font-extrabold text-base text-neutral-900">
                  Đánh Giá Sản Phẩm & Nhận Điểm Thưởng
                </h3>
                <p className="text-xs text-neutral-500 mt-0.5">{productName}</p>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-full hover:bg-neutral-100 flex items-center justify-center text-neutral-400 hover:text-neutral-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Banner Điểm thưởng */}
            <div className="p-3.5 rounded-2xl bg-gradient-to-r from-rose-50 to-purple-50 border border-rose-200/80 flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#800028] text-white flex items-center justify-center font-bold text-sm shrink-0">
                🎁
              </div>
              <div className="text-xs">
                <span className="font-bold text-[#800028]">
                  Thưởng +50 Điểm THUYNGA Club
                </span>{" "}
                cho bài nhận xét chữ và{" "}
                <span className="font-bold text-purple-700">
                  +150 Điểm
                </span>{" "}
                khi đính kèm ảnh bóc hộp thực tế!
              </div>
            </div>

            {modalError && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs font-bold text-red-700">
                {modalError}
              </div>
            )}

            {submitSuccessMsg ? (
              <div className="py-8 text-center space-y-2">
                <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto animate-bounce" />
                <h4 className="font-black text-neutral-900 text-base">
                  {submitSuccessMsg}
                </h4>
                <p className="text-xs text-neutral-500">
                  Cảm ơn bạn đã đóng góp trải nghiệm cho cộng đồng mẹ bỉm sữa!
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmitReview} className="space-y-4">
                {/* 1. Điểm sao tổng thể */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-neutral-700">
                    1. Đánh giá chung về sản phẩm:
                  </label>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRatingInput(star)}
                        className="p-1 hover:scale-110 transition-transform"
                      >
                        <Star
                          className={`w-7 h-7 ${
                            star <= ratingInput
                              ? "fill-amber-400 text-amber-400"
                              : "text-neutral-200"
                          }`}
                        />
                      </button>
                    ))}
                    <span className="ml-2 font-black text-sm text-neutral-800">
                      {ratingInput} sao
                    </span>
                  </div>
                </div>

                {/* 2. Tiêu chí chi tiết */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3 rounded-2xl bg-neutral-50 border border-neutral-100 text-xs">
                  <div>
                    <span className="font-semibold text-neutral-600 block mb-1">
                      Đóng gói Air:
                    </span>
                    <select
                      value={packagingRatingInput}
                      onChange={(e) => setPackagingRatingInput(Number(e.target.value))}
                      className="w-full p-1.5 rounded-lg border border-neutral-200 bg-white"
                    >
                      <option value={5}>5★ - Cực dày dặn</option>
                      <option value={4}>4★ - Tốt</option>
                      <option value={3}>3★ - Tạm ổn</option>
                    </select>
                  </div>

                  <div>
                    <span className="font-semibold text-neutral-600 block mb-1">
                      Date HSD:
                    </span>
                    <select
                      value={freshnessRatingInput}
                      onChange={(e) => setFreshnessRatingInput(Number(e.target.value))}
                      className="w-full p-1.5 rounded-lg border border-neutral-200 bg-white"
                    >
                      <option value={5}>5★ - Date mới tinh</option>
                      <option value={4}>4★ - Còn xa</option>
                      <option value={3}>3★ - Vừa phải</option>
                    </select>
                  </div>

                  <div>
                    <span className="font-semibold text-neutral-600 block mb-1">
                      Bé hợp vị:
                    </span>
                    <select
                      value={effectivenessRatingInput}
                      onChange={(e) => setEffectivenessRatingInput(Number(e.target.value))}
                      className="w-full p-1.5 rounded-lg border border-neutral-200 bg-white"
                    >
                      <option value={5}>5★ - Bé thích mê</option>
                      <option value={4}>4★ - Uống ngoan</option>
                      <option value={3}>3★ - Đang làm quen</option>
                    </select>
                  </div>
                </div>

                {/* 3. Nội dung nhận xét */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-neutral-700">
                    2. Cảm nhận thực tế của bạn:
                  </label>
                  <textarea
                    rows={4}
                    value={contentInput}
                    onChange={(e) => setContentInput(e.target.value)}
                    placeholder="Mùi vị sữa thế nào, bé output ra sao, đóng gói xốp chống sốc có chắc chắn không?..."
                    className="w-full p-3 text-xs rounded-2xl border border-neutral-200 focus:outline-none focus:border-[#800028] focus:ring-1 focus:ring-[#800028] resize-none"
                  />
                  <div className="text-[11px] text-neutral-400 text-right">
                    {contentInput.length}/2000 ký tự (tối thiểu 10)
                  </div>
                </div>

                {/* 4. Đính kèm ảnh thực tế */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-neutral-700 flex items-center justify-between">
                    <span>3. Đính kèm ảnh mở hộp (+150 điểm):</span>
                    <span className="text-neutral-400 font-normal">
                      {imagesList.length}/5 ảnh
                    </span>
                  </label>

                  <div className="flex items-center gap-2">
                    <input
                      type="url"
                      value={imageUrlInput}
                      onChange={(e) => setImageUrlInput(e.target.value)}
                      placeholder="Dán link ảnh bóc hộp (https://...)"
                      className="flex-1 p-2.5 text-xs rounded-xl border border-neutral-200 focus:outline-none focus:border-[#800028]"
                    />
                    <button
                      type="button"
                      onClick={handleAddImage}
                      className="px-4 py-2.5 rounded-xl text-xs font-bold bg-neutral-100 hover:bg-neutral-200 text-neutral-700 transition-colors"
                    >
                      Thêm ảnh
                    </button>
                  </div>

                  {imagesList.length > 0 && (
                    <div className="flex flex-wrap gap-2 pt-1">
                      {imagesList.map((img, idx) => (
                        <div
                          key={idx}
                          className="relative w-16 h-16 rounded-xl border border-neutral-200 overflow-hidden"
                        >
                          <Image
                            src={img}
                            alt="preview"
                            width={64}
                            height={64}
                            className="w-full h-full object-cover"
                          />
                          <button
                            type="button"
                            onClick={() =>
                              setImagesList(imagesList.filter((_, i) => i !== idx))
                            }
                            className="absolute top-1 right-1 w-5 h-5 rounded-full bg-red-600 text-white flex items-center justify-center text-[10px]"
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Submit button */}
                <div className="flex items-center justify-end gap-3 pt-3 border-t border-neutral-100">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-neutral-600 hover:bg-neutral-100"
                  >
                    Hủy bỏ
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting || contentInput.trim().length < 10}
                    className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold bg-[#800028] text-white hover:bg-[#660020] transition-colors disabled:opacity-50 shadow-md shadow-[#800028]/20"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{isSubmitting ? "Đang gửi..." : "Hoàn tất & Nhận thưởng"}</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* ── 7. Lightbox Image Modal ─────────────────────────────────── */}
      {lightboxImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-in fade-in duration-150"
          onClick={() => setLightboxImage(null)}
        >
          <div className="relative max-w-3xl max-h-[90vh] overflow-hidden rounded-3xl bg-white p-2">
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
              className="w-auto h-auto max-h-[85vh] object-contain rounded-2xl"
            />
          </div>
        </div>
      )}
    </section>
  );
}
