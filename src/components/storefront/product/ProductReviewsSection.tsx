"use client";

import { useState } from "react";
import Image from "next/image";
import { Star, CheckCircle, MessageSquarePlus, X, Send, Image as ImageIcon } from "lucide-react";
import { formatDate } from "@/lib/utils";

export interface ReviewData {
  id: string;
  rating: number;
  content: string | null;
  images: string[];
  createdAt: string | Date;
  user: {
    name: string | null;
    avatar: string | null;
  };
}

interface ProductReviewsSectionProps {
  productId: string;
  productName: string;
  reviews: ReviewData[];
}

export function ProductReviewsSection({
  productId,
  productName,
  reviews,
}: ProductReviewsSectionProps) {
  const [filterRating, setFilterRating] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [ratingInput, setRatingInput] = useState(5);
  const [contentInput, setContentInput] = useState("");
  const [nameInput, setNameInput] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Tính điểm đánh giá trung bình
  const totalReviews = reviews.length;
  const averageRating =
    totalReviews > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews
      : 5.0;

  // Đếm số lượng theo số sao
  const starCounts: Record<number, number> = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  reviews.forEach((r) => {
    if (starCounts[r.rating] !== undefined) {
      starCounts[r.rating]++;
    }
  });

  // Lọc review theo lựa chọn
  const filteredReviews = filterRating
    ? reviews.filter((r) => r.rating === filterRating)
    : reviews;

  // Gửi đánh giá mới
  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contentInput.trim() || !nameInput.trim()) return;

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId,
          rating: ratingInput,
          content: contentInput,
          userName: nameInput,
        }),
      });

      if (res.ok) {
        setSubmitSuccess(true);
        setTimeout(() => {
          setIsModalOpen(false);
          setSubmitSuccess(false);
          setContentInput("");
        }, 2000);
      }
    } catch (err) {
      console.error("Failed to submit review", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="danh-gia-khach-hang" className="bg-white rounded-3xl border border-gray-100 p-6 sm:p-8 shadow-sm space-y-6">
      {/* ── 1. Section Header ──────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-6">
        <div>
          <h3 className="text-lg sm:text-xl font-black text-gray-900 tracking-tight">
            Khách hàng đánh giá & Nhận xét
          </h3>
          <p className="text-xs text-gray-500 mt-0.5">
            100% Đánh giá từ khách hàng đã mua và trải nghiệm thực tế
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#800028] hover:bg-[#5c001e] text-white font-bold text-xs shadow-sm transition-colors self-start sm:self-auto"
        >
          <MessageSquarePlus className="w-4 h-4" />
          <span>Viết đánh giá của bạn</span>
        </button>
      </div>

      {/* ── 2. Rating Breakdown Bar Chart ──────────────────────────── */}
      <div className="p-6 rounded-2xl bg-gray-50/80 border border-gray-100 grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
        {/* Điểm tổng quan */}
        <div className="flex flex-col items-center justify-center text-center space-y-1.5 md:border-r border-gray-200">
          <div className="text-4xl sm:text-5xl font-black text-[#800028]">
            {averageRating.toFixed(1)}
          </div>
          <div className="flex items-center gap-1 text-amber-400">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`w-4 h-4 ${
                  star <= Math.round(averageRating)
                    ? "fill-current"
                    : "text-gray-300"
                }`}
              />
            ))}
          </div>
          <span className="text-xs text-gray-500 font-medium">
            ({totalReviews} lượt đánh giá)
          </span>
        </div>

        {/* Thanh tỉ lệ số sao */}
        <div className="md:col-span-2 space-y-1.5">
          {[5, 4, 3, 2, 1].map((star) => {
            const count = starCounts[star] || 0;
            const percent = totalReviews > 0 ? (count / totalReviews) * 100 : 0;
            return (
              <div key={star} className="flex items-center gap-3 text-xs">
                <span className="w-12 font-semibold text-gray-600 flex items-center gap-1">
                  {star} <Star className="w-3 h-3 text-amber-400 fill-current" />
                </span>
                <div className="flex-1 h-2 rounded-full bg-gray-200 overflow-hidden">
                  <div
                    className="h-full bg-amber-400 rounded-full transition-all duration-500"
                    style={{ width: `${percent}%` }}
                  />
                </div>
                <span className="w-8 text-right text-gray-400 font-medium">
                  {count}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── 3. Review Filter Pills ──────────────────────────────────── */}
      <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide pb-1">
        <button
          onClick={() => setFilterRating(null)}
          className={`px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-colors border ${
            filterRating === null
              ? "bg-[#800028] text-white border-[#800028]"
              : "bg-white text-gray-700 border-gray-200 hover:border-gray-300"
          }`}
        >
          Tất cả ({totalReviews})
        </button>

        {[5, 4, 3].map((star) => (
          <button
            key={star}
            onClick={() => setFilterRating(star)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors border ${
              filterRating === star
                ? "bg-[#800028] text-white border-[#800028]"
                : "bg-white text-gray-700 border-gray-200 hover:border-gray-300"
            }`}
          >
            {star} Sao ({starCounts[star] || 0})
          </button>
        ))}
      </div>

      {/* ── 4. Reviews List ────────────────────────────────────────── */}
      <div className="divide-y divide-gray-100">
        {filteredReviews.length === 0 ? (
          <div className="py-8 text-center text-xs text-gray-400">
            Chưa có đánh giá nào phù hợp với bộ lọc.
          </div>
        ) : (
          filteredReviews.map((r) => (
            <div key={r.id} className="py-5 space-y-2.5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-full bg-rose-100 text-[#800028] font-bold text-xs flex items-center justify-center">
                    {r.user.name?.charAt(0).toUpperCase() || "K"}
                  </div>
                  <div>
                    <div className="font-bold text-xs text-gray-900 flex items-center gap-1.5">
                      <span>{r.user.name || "Khách hàng ẩn danh"}</span>
                      <span className="inline-flex items-center gap-0.5 text-[10px] text-emerald-600 font-semibold bg-emerald-50 px-1.5 py-0.5 rounded">
                        <CheckCircle className="w-3 h-3" />
                        <span>Đã mua tại shop</span>
                      </span>
                    </div>
                    <span className="text-[10px] text-gray-400">
                      {formatDate(r.createdAt)}
                    </span>
                  </div>
                </div>

                {/* Rating stars */}
                <div className="flex items-center gap-0.5 text-amber-400">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`w-3.5 h-3.5 ${
                        star <= r.rating ? "fill-current" : "text-gray-200"
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Review content */}
              <p className="text-xs text-gray-700 leading-relaxed">
                {r.content}
              </p>

              {/* Review attached images */}
              {r.images && r.images.length > 0 && (
                <div className="flex items-center gap-2 pt-1">
                  {r.images.map((img, idx) => (
                    <div
                      key={idx}
                      className="relative w-16 h-16 rounded-xl overflow-hidden border border-gray-200"
                    >
                      <Image
                        src={img}
                        alt="Ảnh review thực tế"
                        fill
                        className="object-cover"
                        sizes="64px"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* ── 5. Review Form Modal ────────────────────────────────────── */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h4 className="font-black text-base text-gray-900">
                Đánh giá sản phẩm
              </h4>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-gray-400 hover:text-gray-600 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {submitSuccess ? (
              <div className="py-8 text-center space-y-2">
                <CheckCircle className="w-12 h-12 text-emerald-500 mx-auto" />
                <h5 className="font-bold text-gray-900 text-sm">
                  Cảm ơn bạn đã gửi đánh giá!
                </h5>
                <p className="text-xs text-gray-500">
                  Nhận xét của bạn sẽ được hiển thị ngay sau khi duyệt.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmitReview} className="space-y-4 text-xs">
                {/* Chọn số sao */}
                <div>
                  <label className="block font-bold text-gray-700 mb-1.5">
                    Mức độ hài lòng của bạn:
                  </label>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRatingInput(star)}
                        className="p-1 text-amber-400 hover:scale-110 transition-transform"
                      >
                        <Star
                          className={`w-7 h-7 ${
                            star <= ratingInput ? "fill-current" : "text-gray-200"
                          }`}
                        />
                      </button>
                    ))}
                    <span className="font-bold text-gray-800 ml-2">
                      {ratingInput === 5 && "Cực kỳ hài lòng ⭐⭐⭐⭐⭐"}
                      {ratingInput === 4 && "Hài lòng ⭐⭐⭐⭐"}
                      {ratingInput === 3 && "Bình thường ⭐⭐⭐"}
                      {ratingInput === 2 && "Chưa hài lòng ⭐⭐"}
                      {ratingInput === 1 && "Rất thất vọng ⭐"}
                    </span>
                  </div>
                </div>

                {/* Tên người đánh giá */}
                <div>
                  <label className="block font-bold text-gray-700 mb-1">
                    Họ và tên của bạn:
                  </label>
                  <input
                    type="text"
                    required
                    value={nameInput}
                    onChange={(e) => setNameInput(e.target.value)}
                    placeholder="VD: Chị Minh Anh, Anh Hoàng..."
                    className="w-full h-10 px-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#800028] text-xs"
                  />
                </div>

                {/* Nội dung đánh giá */}
                <div>
                  <label className="block font-bold text-gray-700 mb-1">
                    Nhận xét chi tiết:
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={contentInput}
                    onChange={(e) => setContentInput(e.target.value)}
                    placeholder="Chia sẻ cảm nhận về chất lượng sản phẩm, bao bì, hạn sử dụng và dịch vụ giao hàng..."
                    className="w-full p-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#800028] text-xs resize-none"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2.5 rounded-xl border border-gray-200 text-gray-600 font-bold hover:bg-gray-50"
                  >
                    Hủy bỏ
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="inline-flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-[#800028] hover:bg-[#5c001e] text-white font-bold disabled:opacity-50 transition-colors"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{isSubmitting ? "Đang gửi..." : "Gửi đánh giá"}</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
