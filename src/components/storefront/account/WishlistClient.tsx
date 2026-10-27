// ============================================================
// components/storefront/account/WishlistClient.tsx
// Danh sách sản phẩm yêu thích của khách hàng kèm thêm giỏ nhanh
// ============================================================

"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/store/cart";
import {
  Heart,
  ShoppingBag,
  Trash2,
  ChevronRight,
  ShieldCheck,
  Check,
} from "lucide-react";

export interface WishlistProductItem {
  id: string;
  productId: string;
  addedAt: string;
  product: {
    id: string;
    name: string;
    slug: string;
    brand: string | null;
    origin: string | null;
    defaultVariant: {
      id: string;
      name: string;
      sku: string;
      price: number;
      originalPrice: number | null;
      stock: number;
      image: string | null;
    } | null;
    image: string | null;
  };
}

interface WishlistClientProps {
  initialItems: WishlistProductItem[];
}

export const WishlistClient: React.FC<WishlistClientProps> = ({ initialItems }) => {
  const router = useRouter();
  const [items, setItems] = useState<WishlistProductItem[]>(initialItems);
  const [removingId, setRemovingId] = useState<string | null>(null);
  const [addedVariantId, setAddedVariantId] = useState<string | null>(null);

  const addItemToCart = useCartStore((s) => s.addItem);

  // Xóa khỏi danh sách yêu thích
  const handleRemoveFromWishlist = async (productId: string) => {
    setRemovingId(productId);
    try {
      const res = await fetch("/api/wishlist/toggle", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId }),
      });

      if (res.ok) {
        setItems((prev) => prev.filter((it) => it.productId !== productId));
        router.refresh();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setRemovingId(null);
    }
  };

  // Thêm nhanh vào giỏ hàng
  const handleAddToCart = (item: WishlistProductItem) => {
    const variant = item.product.defaultVariant;
    if (!variant || variant.stock <= 0) return;

    addItemToCart({
      variantId: variant.id,
      productId: item.product.id,
      productName: item.product.name,
      variantName: variant.name,
      sku: variant.sku,
      price: variant.price,
      stock: variant.stock,
      image: variant.image || item.product.image,
      quantity: 1,
    });

    setAddedVariantId(variant.id);
    setTimeout(() => setAddedVariantId(null), 1500);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-neutral-900 tracking-tight">
            Sản phẩm yêu thích ({items.length})
          </h1>
          <p className="text-xs text-neutral-500 mt-0.5">
            Danh sách các sản phẩm bạn đã lưu lại để tham khảo và mua sắm sau.
          </p>
        </div>
      </div>

      {items.length === 0 ? (
        <div className="bg-white rounded-3xl border border-neutral-200/90 p-12 text-center shadow-sm">
          <div className="w-16 h-16 rounded-2xl bg-rose-50 text-[#800028] flex items-center justify-center mx-auto mb-3">
            <Heart className="w-8 h-8 fill-rose-100 text-[#800028]" />
          </div>
          <h3 className="font-bold text-sm text-neutral-800">
            Danh sách yêu thích đang trống
          </h3>
          <p className="text-xs text-neutral-500 mt-1 max-w-sm mx-auto">
            Hãy bấm vào biểu tượng Trái tim trên bất kỳ sản phẩm nào bạn yêu thích để lưu lại và theo dõi ưu đãi nhé!
          </p>
          <div className="mt-5">
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#800028] text-white text-xs font-bold hover:bg-[#60001e] transition-colors shadow-sm"
            >
              <span>Khám phá sản phẩm ngay</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((item) => {
            const variant = item.product.defaultVariant;
            const price = variant?.price || 0;
            const originalPrice = variant?.originalPrice || null;
            const isOutOfStock = !variant || variant.stock <= 0;
            const isAdded = addedVariantId === variant?.id;

            return (
              <div
                key={item.id}
                className="bg-white rounded-3xl border border-neutral-200/90 shadow-sm overflow-hidden hover:shadow-md transition-all flex flex-col group relative"
              >
                {/* Nút Xóa yêu thích ở góc */}
                <button
                  onClick={() => handleRemoveFromWishlist(item.productId)}
                  disabled={removingId === item.productId}
                  className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-white/90 backdrop-blur-xs border border-neutral-200 flex items-center justify-center text-neutral-400 hover:text-red-600 hover:border-red-200 transition-colors shadow-xs cursor-pointer"
                  title="Bỏ thích sản phẩm này"
                >
                  <Trash2 className="w-4 h-4" />
                </button>

                {/* Ảnh sản phẩm */}
                <Link
                  href={`/san-pham/${item.product.slug}`}
                  className="relative aspect-square bg-neutral-100 overflow-hidden block"
                >
                  {item.product.image ? (
                    <Image
                      src={item.product.image}
                      alt={item.product.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-neutral-400">
                      <ShoppingBag className="w-10 h-10" />
                    </div>
                  )}

                  {/* Badge xuất xứ */}
                  {item.product.origin && (
                    <span className="absolute bottom-2.5 left-2.5 bg-black/60 text-white text-[10px] font-semibold px-2 py-0.5 rounded-full backdrop-blur-xs">
                      {item.product.origin}
                    </span>
                  )}
                </Link>

                {/* Nội dung card */}
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    {item.product.brand && (
                      <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block mb-1">
                        {item.product.brand}
                      </span>
                    )}

                    <Link
                      href={`/san-pham/${item.product.slug}`}
                      className="font-bold text-xs text-neutral-900 hover:text-[#800028] transition-colors line-clamp-2 leading-relaxed"
                    >
                      {item.product.name}
                    </Link>

                    {/* Phân loại biến thể */}
                    {variant && (
                      <p className="text-[11px] text-neutral-400 mt-1">
                        Loại: {variant.name}
                      </p>
                    )}
                  </div>

                  <div className="mt-3 pt-3 border-t border-neutral-100">
                    {/* Giá bán */}
                    <div className="flex items-baseline gap-2 mb-3">
                      <span className="text-sm font-black text-[#800028]">
                        {price.toLocaleString("vi-VN")}₫
                      </span>
                      {originalPrice && originalPrice > price && (
                        <span className="text-[11px] text-neutral-400 line-through">
                          {originalPrice.toLocaleString("vi-VN")}₫
                        </span>
                      )}
                    </div>

                    {/* Nút thêm vào giỏ */}
                    <button
                      onClick={() => handleAddToCart(item)}
                      disabled={isOutOfStock}
                      className={`w-full py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                        isOutOfStock
                          ? "bg-neutral-100 text-neutral-400 cursor-not-allowed"
                          : isAdded
                          ? "bg-emerald-600 text-white"
                          : "bg-[#800028] hover:bg-[#60001e] text-white shadow-xs"
                      }`}
                    >
                      {isOutOfStock ? (
                        <span>Tạm hết hàng</span>
                      ) : isAdded ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>Đã thêm vào giỏ!</span>
                        </>
                      ) : (
                        <>
                          <ShoppingBag className="w-3.5 h-3.5" />
                          <span>Thêm vào giỏ</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
