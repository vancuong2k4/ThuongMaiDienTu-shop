"use client";

// ============================================================
// components/storefront/flash-sale/FlashSaleDealCard.tsx
// Thẻ Deal Giờ Vàng (Urgency Progress Bar & Instant Add to Cart)
// ============================================================

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Flame,
  ShoppingBag,
  Check,
  Package,
  ShieldCheck,
  ArrowRight,
  Clock,
} from "lucide-react";
import { useCartStore } from "@/store/cart";
import type { StorefrontFlashSaleDeal } from "./types";

interface FlashSaleDealCardProps {
  deal: StorefrontFlashSaleDeal;
  isUpcoming?: boolean;
}

export const FlashSaleDealCard: React.FC<FlashSaleDealCardProps> = ({
  deal,
  isUpcoming = false,
}) => {
  const [added, setAdded] = useState(false);
  const addItem = useCartStore((state) => state.addItem);

  const isSoldOut = deal.soldCount >= deal.quantity;
  const isUrgent = deal.soldPercentage >= 75 && !isSoldOut;

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isSoldOut || isUpcoming) return;

    addItem({
      variantId: deal.variant.id,
      productId: deal.product.id,
      productName: deal.product.name,
      variantName: deal.variant.name,
      sku: deal.variant.sku,
      price: deal.salePrice,
      image: deal.imageUrl || deal.variant.image,
      quantity: 1,
      stock: deal.variant.stock,
      isFlashSale: true,
      originalPrice: deal.regularPrice,
    });

    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <article className="group bg-white rounded-3xl border border-rose-100 shadow-sm hover:shadow-xl hover:border-rose-300 transition-all duration-300 flex flex-col justify-between overflow-hidden relative">
      <div>
        {/* Khối Ảnh Sản Phẩm */}
        <Link
          href={`/san-pham/${deal.product.slug}`}
          className="relative aspect-square w-full block overflow-hidden bg-slate-50"
        >
          {deal.imageUrl ? (
            <Image
              src={deal.imageUrl}
              alt={deal.product.name}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-slate-300">
              <Package className="w-12 h-12 mb-1" />
            </div>
          )}

          {/* Badge Giảm Giá Giờ Vàng */}
          <div className="absolute top-3 left-3 z-10">
            <span className="px-2.5 py-1 rounded-xl bg-gradient-to-r from-red-600 to-[#800028] text-white text-[11px] font-black shadow-md flex items-center gap-1 uppercase tracking-wider">
              <Flame className="w-3.5 h-3.5 fill-amber-300 text-amber-300" />
              <span>-{deal.discountPercent}%</span>
            </span>
          </div>

          {/* Badge Xuất Xứ */}
          {deal.product.origin && (
            <div className="absolute top-3 right-3 z-10 px-2 py-0.5 rounded-lg bg-slate-900/80 text-white text-[10px] font-medium backdrop-blur-xs">
              {deal.product.origin}
            </div>
          )}

          {/* Overlay Đã Cháy Hàng */}
          {isSoldOut && (
            <div className="absolute inset-0 bg-slate-900/70 backdrop-blur-2xs flex flex-col items-center justify-center text-white z-20">
              <span className="px-4 py-1.5 rounded-full bg-rose-600 font-black text-xs uppercase tracking-wider shadow-lg">
                Hết Suất Giờ Vàng
              </span>
              <span className="text-[11px] text-slate-300 mt-1">
                Hẹn bạn ở khung giờ tiếp theo!
              </span>
            </div>
          )}
        </Link>

        {/* Nội Dung Deal */}
        <div className="p-4 sm:p-5 space-y-3">
          {/* Brand & Category */}
          <div className="flex items-center justify-between text-[11px] text-slate-400">
            <span className="uppercase font-bold tracking-wider truncate">
              {deal.product.brand || "CHÍNH HÃNG"}
            </span>
            <span className="text-slate-500">{deal.variant.name}</span>
          </div>

          {/* Tiêu đề */}
          <h3 className="text-sm font-bold text-slate-900 group-hover:text-[#800028] transition-colors line-clamp-2 leading-snug min-h-[2.5rem]">
            <Link href={`/san-pham/${deal.product.slug}`}>
              {deal.product.name}
            </Link>
          </h3>

          {/* Giá Flash Sale vs Giá Gốc */}
          <div className="flex items-baseline gap-2 pt-1">
            <span className="text-lg sm:text-xl font-black text-[#800028]">
              {deal.salePrice.toLocaleString("vi-VN")} ₫
            </span>
            <span className="text-xs text-slate-400 line-through">
              {deal.regularPrice.toLocaleString("vi-VN")} ₫
            </span>
          </div>

          {/* Thanh Tiến Độ Cháy Hàng (Urgency Progress Bar) */}
          <div className="space-y-1.5 pt-1">
            <div className="relative w-full h-4 rounded-full bg-rose-100 overflow-hidden flex items-center">
              {/* Thanh fill */}
              <div
                className={`h-full transition-all duration-500 ${
                  isSoldOut
                    ? "bg-slate-400"
                    : isUrgent
                    ? "bg-gradient-to-r from-orange-500 to-rose-600"
                    : "bg-gradient-to-r from-amber-500 to-[#800028]"
                }`}
                style={{ width: `${Math.min(100, Math.max(8, deal.soldPercentage))}%` }}
              />

              {/* Text lồng trong thanh */}
              <div className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-white drop-shadow-xs select-none">
                {isSoldOut ? (
                  <span>ĐÃ BÁN HẾT</span>
                ) : isUrgent ? (
                  <span className="flex items-center gap-1">
                    <Flame className="w-3 h-3 fill-amber-300" />
                    <span>SẮP CHÁY HÀNG • ĐÃ BÁN {deal.soldPercentage}%</span>
                  </span>
                ) : (
                  <span>ĐÃ BÁN {deal.soldCount}/{deal.quantity}</span>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between text-[10px] text-slate-400">
              <span>Giới hạn: {deal.limitPerUser} sản phẩm/khách</span>
              {deal.variant.stock > 0 && (
                <span className="text-emerald-600 font-medium">Sẵn hàng</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Nút Thao Tác Mua Hàng */}
      <div className="p-4 sm:p-5 pt-0">
        {isUpcoming ? (
          <Link
            href={`/san-pham/${deal.product.slug}`}
            className="w-full inline-flex items-center justify-center gap-2 py-2.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 text-xs font-bold transition-all border border-amber-200"
          >
            <Clock className="w-4 h-4 text-amber-600" />
            <span>Xem Trước Deal</span>
          </Link>
        ) : isSoldOut ? (
          <button
            type="button"
            disabled
            className="w-full py-2.5 rounded-xl bg-slate-100 text-slate-400 text-xs font-bold cursor-not-allowed"
          >
            Đã Hết Suất Săn Deal
          </button>
        ) : (
          <button
            type="button"
            onClick={handleQuickAdd}
            className={`w-full inline-flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all shadow-md ${
              added
                ? "bg-emerald-600 text-white"
                : "bg-[#800028] hover:bg-[#60001e] text-white shadow-[#800028]/25 hover:gap-2.5"
            }`}
          >
            {added ? (
              <>
                <Check className="w-4 h-4" />
                <span>Đã Thêm Vào Giỏ!</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-4 h-4" />
                <span>Săn Ngay Deal Này</span>
              </>
            )}
          </button>
        )}
      </div>
    </article>
  );
};
