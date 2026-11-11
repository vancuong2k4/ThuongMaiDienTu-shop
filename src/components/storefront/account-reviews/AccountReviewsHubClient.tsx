// ============================================================
// components/storefront/account-reviews/AccountReviewsHubClient.tsx
// Client Container Trung Tâm Đánh Giá & Điểm Thưởng Của Tôi (Phase 14)
// ============================================================

"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  Star,
  Camera,
  Gift,
  CheckCircle2,
  Clock,
  X,
  Send,
  Loader2,
  ShieldCheck,
} from "lucide-react";
import type {
  PendingReviewItem,
  MyReviewItem,
  AccountReviewsStatsData,
} from "./types";
import { AccountReviewsStats } from "./AccountReviewsStats";
import { PendingReviewsList } from "./PendingReviewsList";
import { MyReviewsList } from "./MyReviewsList";

interface AccountReviewsHubClientProps {
  initialPending: PendingReviewItem[];
  initialReviews: MyReviewItem[];
  initialStats: AccountReviewsStatsData;
}

export const AccountReviewsHubClient: React.FC<AccountReviewsHubClientProps> = ({
  initialPending,
  initialReviews,
  initialStats,
}) => {
  const [activeTab, setActiveTab] = useState<"PENDING" | "REVIEWED">("PENDING");
  const [pendingItems, setPendingItems] = useState<PendingReviewItem[]>(initialPending);
  const [myReviews, setMyReviews] = useState<MyReviewItem[]>(initialReviews);
  const [stats, setStats] = useState<AccountReviewsStatsData>(initialStats);

  // Modal Review
  const [reviewingItem, setReviewingItem] = useState<PendingReviewItem | null>(null);
  const [ratingInput, setRatingInput] = useState(5);
  const [packagingRatingInput, setPackagingRatingInput] = useState(5);
  const [freshnessRatingInput, setFreshnessRatingInput] = useState(5);
  const [effectivenessRatingInput, setEffectivenessRatingInput] = useState(5);
  const [contentInput, setContentInput] = useState("");
  const [imageUrlInput, setImageUrlInput] = useState("");
  const [imagesList, setImagesList] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [modalError, setModalError] = useState<string | null>(null);

  // Toast
  const [toastMessage, setToastMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const showToast = (type: "success" | "error", text: string) => {
    setToastMessage({ type, text });
    setTimeout(() => {
      setToastMessage(null);
    }, 4500);
  };

  const handleOpenReviewModal = (item: PendingReviewItem) => {
    setReviewingItem(item);
    setRatingInput(5);
    setPackagingRatingInput(5);
    setFreshnessRatingInput(5);
    setEffectivenessRatingInput(5);
    setContentInput("");
    setImagesList([]);
    setModalError(null);
  };

  const handleAddImage = () => {
    if (!imageUrlInput.trim()) return;
    if (imagesList.length >= 5) {
      alert("Tối đa 5 ảnh");
      return;
    }
    setImagesList([...imagesList, imageUrlInput.trim()]);
    setImageUrlInput("");
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewingItem) return;
    if (contentInput.trim().length < 10) {
      setModalError("Nội dung nhận xét tối thiểu 10 ký tự");
      return;
    }

    setIsSubmitting(true);
    setModalError(null);
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: reviewingItem.productId,
          orderId: reviewingItem.orderId,
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

      showToast("success", data.message || "Gửi đánh giá thành công!");

      // Cập nhật trạng thái danh sách
      setPendingItems((prev) =>
        prev.filter(
          (p) =>
            !(
              p.orderId === reviewingItem.orderId &&
              p.productId === reviewingItem.productId
            )
        )
      );

      // Thêm bài đánh giá vào MyReviews
      const newReview: MyReviewItem = {
        id: data.data.id,
        productId: reviewingItem.productId,
        productName: reviewingItem.productName,
        productSlug: reviewingItem.productSlug,
        productImage: reviewingItem.productImage,
        rating: ratingInput,
        packagingRating: packagingRatingInput,
        freshnessRating: freshnessRatingInput,
        effectivenessRating: effectivenessRatingInput,
        content: contentInput.trim(),
        images: imagesList,
        isVerifiedBuyer: true,
        airCargoVerified: true,
        helpfulCount: 0,
        adminReply: null,
        adminReplyAt: null,
        rewardPoints: data.pointsAwarded || 50,
        status: "APPROVED",
        createdAt: new Date().toISOString(),
      };

      setMyReviews((prev) => [newReview, ...prev]);

      setStats((prev) => ({
        ...prev,
        totalReviewed: prev.totalReviewed + 1,
        totalPointsEarned: prev.totalPointsEarned + (data.pointsAwarded || 50),
        pendingCount: Math.max(0, prev.pendingCount - 1),
      }));

      setReviewingItem(null);
      setActiveTab("REVIEWED");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Đã có lỗi xảy ra";
      setModalError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast */}
      {toastMessage && (
        <div
          className={`p-4 rounded-2xl flex items-center justify-between text-xs sm:text-sm font-bold shadow-lg animate-in slide-in-from-top duration-150 ${
            toastMessage.type === "success"
              ? "bg-emerald-600 text-white"
              : "bg-red-600 text-white"
          }`}
        >
          <span>{toastMessage.text}</span>
          <button
            type="button"
            onClick={() => setToastMessage(null)}
            className="text-white/80 hover:text-white font-bold ml-3"
          >
            ✕
          </button>
        </div>
      )}

      {/* Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#800028] via-[#660020] to-[#0f172a] text-white p-6 sm:p-8 shadow-xl shadow-[#800028]/15 border border-rose-900/40">
        <div className="relative z-10 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-semibold text-rose-100">
            <Camera className="w-3.5 h-3.5 text-amber-300" />
            <span>Đánh Giá Thật - Thưởng Điểm Thật</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white">
            Trung Tâm Đánh Giá & Trưng Bày UGC
          </h1>
          <p className="text-xs sm:text-sm text-rose-100/80 max-w-2xl leading-relaxed">
            Mỗi bài chia sẻ hình ảnh mở hộp chuẩn bay air của bạn sẽ giúp hàng ngàn
            mẹ bỉm sữa an tâm mua sắm, đồng thời nhận ngay đến{" "}
            <strong className="text-amber-300">+150 Điểm THUYNGA Club</strong>!
          </p>
        </div>
      </div>

      {/* KPI Stats */}
      <AccountReviewsStats stats={stats} />

      {/* Main Container with Tabs */}
      <div className="bg-white rounded-3xl border border-neutral-200/90 p-5 sm:p-6 shadow-xs space-y-6">
        {/* Tabs */}
        <div className="flex items-center gap-3 border-b border-neutral-100 pb-4">
          <button
            type="button"
            onClick={() => setActiveTab("PENDING")}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${
              activeTab === "PENDING"
                ? "bg-[#800028] text-white shadow-sm"
                : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
            }`}
          >
            <span>Chờ Đánh Giá</span>
            {pendingItems.length > 0 && (
              <span
                className={`px-2 py-0.5 rounded-full text-xs font-extrabold ${
                  activeTab === "PENDING"
                    ? "bg-amber-400 text-neutral-900"
                    : "bg-amber-100 text-amber-800"
                }`}
              >
                {pendingItems.length}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("REVIEWED")}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${
              activeTab === "REVIEWED"
                ? "bg-neutral-900 text-white shadow-sm"
                : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
            }`}
          >
            <span>Đã Đánh Giá</span>
            <span
              className={`px-2 py-0.5 rounded-full text-xs font-extrabold ${
                activeTab === "REVIEWED"
                  ? "bg-white/20 text-white"
                  : "bg-neutral-200 text-neutral-700"
              }`}
            >
              {myReviews.length}
            </span>
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === "PENDING" ? (
          <PendingReviewsList
            items={pendingItems}
            onOpenReviewModal={handleOpenReviewModal}
          />
        ) : (
          <MyReviewsList items={myReviews} />
        )}
      </div>

      {/* Modal Viết Đánh Giá Từ Đơn Hàng */}
      {reviewingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="w-full max-w-lg bg-white rounded-3xl p-6 sm:p-8 shadow-2xl space-y-5 animate-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-neutral-50 border border-neutral-200 p-1 flex items-center justify-center shrink-0 overflow-hidden">
                  {reviewingItem.productImage ? (
                    <Image
                      src={reviewingItem.productImage}
                      alt={reviewingItem.productName}
                      width={48}
                      height={48}
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <span>📦</span>
                  )}
                </div>
                <div>
                  <h3 className="font-extrabold text-sm sm:text-base text-neutral-900 line-clamp-1">
                    {reviewingItem.productName}
                  </h3>
                  <p className="text-xs text-neutral-500 mt-0.5">
                    Đơn hàng #{reviewingItem.orderNumber}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setReviewingItem(null)}
                className="w-8 h-8 rounded-full hover:bg-neutral-100 flex items-center justify-center text-neutral-400 hover:text-neutral-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Banner Điểm thưởng */}
            <div className="p-3.5 rounded-2xl bg-gradient-to-r from-rose-50 to-purple-50 border border-rose-200/80 flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-[#800028] text-white flex items-center justify-center font-bold text-xs shrink-0">
                🎁
              </div>
              <div className="text-xs">
                Nhận ngay{" "}
                <strong className="text-[#800028]">+50 Điểm</strong> (chữ) hoặc{" "}
                <strong className="text-purple-700">+150 Điểm THUYNGA Club</strong>{" "}
                khi đính kèm ảnh bóc hộp air-cargo thật!
              </div>
            </div>

            {modalError && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs font-bold text-red-700">
                {modalError}
              </div>
            )}

            <form onSubmit={handleSubmitReview} className="space-y-4">
              {/* Điểm sao tổng thể */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-neutral-700">
                  1. Đánh giá chung:
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

              {/* Tiêu chí chi tiết */}
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
                    <option value={5}>5★ - Rất dày dặn</option>
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

              {/* Nội dung nhận xét */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-neutral-700">
                  2. Chia sẻ trải nghiệm thực tế:
                </label>
                <textarea
                  rows={4}
                  value={contentInput}
                  onChange={(e) => setContentInput(e.target.value)}
                  placeholder="Mô tả cảm nhận thực tế của bạn khi sử dụng sản phẩm..."
                  className="w-full p-3 text-xs rounded-2xl border border-neutral-200 focus:outline-none focus:border-[#800028] resize-none"
                />
                <div className="text-[11px] text-neutral-400 text-right">
                  {contentInput.length}/2000 ký tự (tối thiểu 10)
                </div>
              </div>

              {/* Đính kèm ảnh */}
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
                    placeholder="Dán link ảnh (https://...)"
                    className="flex-1 p-2 text-xs rounded-xl border border-neutral-200 focus:outline-none focus:border-[#800028]"
                  />
                  <button
                    type="button"
                    onClick={handleAddImage}
                    className="px-3.5 py-2 rounded-xl text-xs font-bold bg-neutral-100 hover:bg-neutral-200 text-neutral-700"
                  >
                    Thêm
                  </button>
                </div>

                {imagesList.length > 0 && (
                  <div className="flex flex-wrap gap-2 pt-1">
                    {imagesList.map((img, idx) => (
                      <div
                        key={idx}
                        className="relative w-14 h-14 rounded-xl border border-neutral-200 overflow-hidden"
                      >
                        <Image
                          src={img}
                          alt="preview"
                          width={56}
                          height={56}
                          className="w-full h-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setImagesList(imagesList.filter((_, i) => i !== idx))
                          }
                          className="absolute top-1 right-1 w-4 h-4 rounded-full bg-red-600 text-white flex items-center justify-center text-[10px]"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-neutral-100">
                <button
                  type="button"
                  onClick={() => setReviewingItem(null)}
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
          </div>
        </div>
      )}
    </div>
  );
};
