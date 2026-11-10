// ============================================================
// components/storefront/blog/ArticleProductMentions.tsx
// Khối Ghim Sản Phẩm Khuyên Dùng Trong Bài Viết (Shop The Story)
// ============================================================

import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ShoppingBag,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Package,
} from "lucide-react";

export interface MentionedProduct {
  id: string;
  name: string;
  slug: string;
  brand: string | null;
  origin: string | null;
  imageUrl: string | null;
  price: number;
  originalPrice: number | null;
  inStock: boolean;
}

interface ArticleProductMentionsProps {
  products: MentionedProduct[];
}

export const ArticleProductMentions: React.FC<ArticleProductMentionsProps> = ({
  products,
}) => {
  if (!products || products.length === 0) return null;

  return (
    <section className="my-12 p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-rose-50/70 via-white to-amber-50/40 border border-rose-100 shadow-sm space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-rose-100/80 pb-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#800028]/10 text-[#800028] text-xs font-bold uppercase tracking-wider mb-1.5">
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Gợi Ý Mua Sắm Từ Chuyên Gia</span>
          </div>
          <h3 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
            Sản Phẩm Đề Xuất Trong Bài Viết
          </h3>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-emerald-700 font-semibold">
          <ShieldCheck className="w-4 h-4" />
          <span>100% Chính hãng có tem phụ</span>
        </div>
      </div>

      {/* Grid sản phẩm */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {products.map((product) => {
          const discountPercent =
            product.originalPrice && product.originalPrice > product.price
              ? Math.round(
                  ((product.originalPrice - product.price) /
                    product.originalPrice) *
                    100
                )
              : null;

          return (
            <div
              key={product.id}
              className="group bg-white rounded-2xl border border-slate-200/80 p-3.5 shadow-2xs hover:shadow-lg hover:border-rose-200 transition-all duration-300 flex flex-col justify-between"
            >
              <div className="space-y-3">
                {/* Ảnh sản phẩm */}
                <Link
                  href={`/san-pham/${product.slug}`}
                  className="relative aspect-square w-full rounded-xl overflow-hidden bg-slate-50 block"
                >
                  {product.imageUrl ? (
                    <Image
                      src={product.imageUrl}
                      alt={product.name}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-slate-300">
                      <Package className="w-8 h-8 mb-1" />
                    </div>
                  )}

                  {discountPercent && (
                    <div className="absolute top-2 left-2 z-10 px-2 py-0.5 rounded-md bg-rose-600 text-white text-[10px] font-black shadow-xs">
                      -{discountPercent}%
                    </div>
                  )}

                  {product.origin && (
                    <div className="absolute bottom-2 right-2 z-10 px-2 py-0.5 rounded-md bg-slate-900/80 text-white text-[10px] font-medium backdrop-blur-xs">
                      {product.origin}
                    </div>
                  )}
                </Link>

                {/* Brand & Name */}
                <div className="space-y-1">
                  {product.brand && (
                    <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider truncate">
                      {product.brand}
                    </p>
                  )}
                  <h4 className="text-xs font-bold text-slate-900 group-hover:text-[#800028] transition-colors line-clamp-2 leading-snug">
                    <Link href={`/san-pham/${product.slug}`}>
                      {product.name}
                    </Link>
                  </h4>
                </div>
              </div>

              {/* Price & Action */}
              <div className="pt-3 mt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                <div>
                  <div className="text-xs font-black text-[#800028]">
                    {product.price.toLocaleString("vi-VN")} ₫
                  </div>
                  {product.originalPrice && (
                    <div className="text-[10px] text-slate-400 line-through">
                      {product.originalPrice.toLocaleString("vi-VN")} ₫
                    </div>
                  )}
                </div>

                <Link
                  href={`/san-pham/${product.slug}`}
                  className="px-2.5 py-1.5 rounded-lg bg-[#800028]/10 hover:bg-[#800028] text-[#800028] hover:text-white transition-all text-[11px] font-bold shrink-0"
                >
                  Xem ngay
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
