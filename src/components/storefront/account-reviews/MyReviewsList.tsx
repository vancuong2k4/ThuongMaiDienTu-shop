// ============================================================
// components/storefront/account-reviews/MyReviewsList.tsx
// Danh Sách Đánh Giá Khách Hàng Đã Đăng & Điểm Thưởng (Phase 14)
// ============================================================

"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Star,
  CheckCircle2,
  ShieldCheck,
  ThumbsUp,
  Award,
  Package,
  Clock,
  Eye,
  X,
  ExternalLink,
} from "lucide-react";
import type { MyReviewItem } from "./types";

interface MyReviewsListProps {
  items: MyReviewItem[];
}

export const MyReviewsList: React.FC<MyReviewsListProps> = ({ items }) => {
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);

  if (items.length === 0) {
    return (
      <div className="py-12 text-center space-y-3">
        <div className="w-16 h-16 rounded-3xl bg-neutral-100 text-neutral-400 mx-auto flex items-center justify-center">
          <Star className="w-8 h-8" />
        </div>
        <div className="space-y-1">
          <h4 className="font-extrabold text-neutral-800 text-base">
            Bạn chưa có bài đánh giá nào
          </h4>
          <p className="text-xs text-neutral-500 max-w-sm mx-auto">
            Sau khi nhận hàng thành công, hãy đánh giá sản phẩm để tích lũy thêm điểm
            thưởng THUYNGA Club nhé!
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="divide-y divide-neutral-100 space-y-4">
        {items.map((rev) => (
          <div key={rev.id} className="pt-4 first:pt-0 space-y-3">
            {/* Header: Sản phẩm & Trạng thái */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-white border border-neutral-200 p-1 flex items-center justify-center shrink-0 overflow-hidden">
                  {rev.productImage ? (
                    <Image
                      src={rev.productImage}
                      alt={rev.productName}
                      width={48}
                      height={48}
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <Package className="w-6 h-6 text-neutral-300" />
                  )}
                </div>

                <div>
                  <Link
                    href={`/san-pham/${rev.productSlug}`}
                    className="font-bold text-xs sm:text-sm text-neutral-900 hover:text-[#800028] transition-colors line-clamp-1"
                  >
                    {rev.productName}
                  </Link>
                  <div className="flex items-center gap-2 mt-0.5 text-xs text-neutral-400">
                    <span>{new Date(rev.createdAt).toLocaleDateString("vi-VN")}</span>
                    {rev.rewardPoints > 0 && (
                      <span className="font-bold text-purple-700 bg-purple-50 px-2 py-0.2 rounded text-[10px]">
                        +{rev.rewardPoints} điểm
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Status Badge */}
              <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
                {rev.status === "FEATURED" && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-100 text-purple-800 border border-purple-200">
                    <Award className="w-3 h-3" />
                    Top Đánh Giá
                  </span>
                )}
                {rev.status === "APPROVED" && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                    <CheckCircle2 className="w-3 h-3" />
                    Đã hiển thị
                  </span>
                )}
                {rev.status === "PENDING" && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200">
                    <Clock className="w-3 h-3" />
                    Đang duyệt
                  </span>
                )}
              </div>
            </div>

            {/* Số sao & Chi tiết */}
            <div className="flex items-center gap-2">
              <div className="flex items-center text-amber-400">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star
                    key={s}
                    className={`w-3.5 h-3.5 ${
                      s <= rev.rating
                        ? "fill-amber-400 text-amber-400"
                        : "text-neutral-200"
                    }`}
                  />
                ))}
              </div>
              <span className="font-bold text-xs text-neutral-800">
                {rev.rating}.0
              </span>

              {rev.airCargoVerified && (
                <span className="inline-flex items-center gap-0.5 px-2 py-0.2 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <ShieldCheck className="w-3 h-3" />
                  Chuẩn Air Úc
                </span>
              )}
            </div>

            {/* Nội dung */}
            <p className="text-xs sm:text-sm text-neutral-700 leading-relaxed">
              {rev.content}
            </p>

            {/* Thư viện ảnh UGC */}
            {rev.images && rev.images.length > 0 && (
              <div className="flex flex-wrap items-center gap-2 pt-1">
                {rev.images.map((imgUrl, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setLightboxImage(imgUrl)}
                    className="relative w-16 h-16 rounded-xl border border-neutral-200 overflow-hidden group hover:border-[#800028] transition-colors shrink-0"
                  >
                    <Image
                      src={imgUrl}
                      alt="UGC Image"
                      width={64}
                      height={64}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                      <Eye className="w-3.5 h-3.5 text-white" />
                    </div>
                  </button>
                ))}
              </div>
            )}

            {/* Phản hồi Dược sĩ */}
            {rev.adminReply && (
              <div className="p-3 rounded-2xl bg-rose-50/70 border border-rose-200/70 space-y-1 text-xs">
                <span className="font-bold text-[#800028] flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Dược sĩ THUYNGA Shop đã phản hồi:
                </span>
                <p className="text-neutral-700 italic leading-relaxed">
                  &ldquo;{rev.adminReply}&rdquo;
                </p>
              </div>
            )}

            {/* Lượt hữu ích */}
            {rev.helpfulCount > 0 && (
              <div className="flex items-center gap-1 text-[11px] text-neutral-500 font-medium">
                <ThumbsUp className="w-3.5 h-3.5 text-neutral-400" />
                <span>{rev.helpfulCount} người đã cảm ơn đánh giá của bạn</span>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
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
    </>
  );
};
