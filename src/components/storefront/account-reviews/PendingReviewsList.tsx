// ============================================================
// components/storefront/account-reviews/PendingReviewsList.tsx
// Danh Sách Sản Phẩm Chờ Đánh Giá Nhận Điểm Thưởng (Phase 14)
// ============================================================

"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Camera, Package, Gift, CheckCircle2, ChevronRight } from "lucide-react";
import type { PendingReviewItem } from "./types";

interface PendingReviewsListProps {
  items: PendingReviewItem[];
  onOpenReviewModal: (item: PendingReviewItem) => void;
}

export const PendingReviewsList: React.FC<PendingReviewsListProps> = ({
  items,
  onOpenReviewModal,
}) => {
  const formatVND = (val: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(val);
  };

  if (items.length === 0) {
    return (
      <div className="py-12 text-center space-y-3">
        <div className="w-16 h-16 rounded-3xl bg-emerald-50 text-emerald-600 mx-auto flex items-center justify-center">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <div className="space-y-1">
          <h4 className="font-extrabold text-neutral-800 text-base">
            Tuyệt vời! Bạn đã đánh giá tất cả sản phẩm đã mua
          </h4>
          <p className="text-xs text-neutral-500 max-w-md mx-auto">
            Mọi bài đánh giá của bạn đều giúp cộng đồng lựa chọn đúng sản phẩm chuẩn
            bay air và giúp bạn tích lũy thêm điểm THUYNGA Club.
          </p>
        </div>
        <Link
          href="/san-pham"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-[#800028] text-white hover:bg-[#660020] transition-colors shadow-sm"
        >
          <span>Khám phá sản phẩm mới</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    );
  }

  return (
    <div className="divide-y divide-neutral-100">
      {items.map((item) => (
        <div
          key={`${item.orderId}_${item.productId}`}
          className="py-4 first:pt-1 last:pb-1 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
        >
          {/* Thông tin sản phẩm & đơn hàng */}
          <div className="flex items-center gap-3.5">
            <div className="w-16 h-16 rounded-2xl bg-white border border-neutral-200/80 p-1 flex items-center justify-center shrink-0 overflow-hidden">
              {item.productImage ? (
                <Image
                  src={item.productImage}
                  alt={item.productName}
                  width={64}
                  height={64}
                  className="w-full h-full object-contain"
                />
              ) : (
                <Package className="w-7 h-7 text-neutral-300" />
              )}
            </div>

            <div className="min-w-0 flex-1">
              <Link
                href={`/san-pham/${item.productSlug}`}
                className="font-bold text-sm text-neutral-900 hover:text-[#800028] transition-colors line-clamp-1"
              >
                {item.productName}
              </Link>
              {item.variantName && (
                <p className="text-xs text-neutral-500 mt-0.5">
                  Phân loại: {item.variantName}
                </p>
              )}
              <div className="flex items-center gap-2 mt-1 text-xs text-neutral-500">
                <span>Đơn hàng: <strong>#{item.orderNumber}</strong></span>
                <span>•</span>
                <span>{new Date(item.orderDate).toLocaleDateString("vi-VN")}</span>
              </div>
            </div>
          </div>

          {/* Nút hành động */}
          <div className="flex items-center gap-3 self-end sm:self-auto shrink-0">
            <button
              type="button"
              onClick={() => onOpenReviewModal(item)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-[#800028] to-[#a80035] text-white hover:opacity-95 transition-opacity shadow-sm shadow-[#800028]/20"
            >
              <Camera className="w-3.5 h-3.5 text-rose-200" />
              <span>Đánh giá (+150đ)</span>
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};
