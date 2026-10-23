"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { ShoppingBag, Heart, Star, Check } from "lucide-react";
import { formatVND, calcDiscount, toNumber } from "@/lib/utils";
import { useCartStore } from "@/store/cart";

export interface ProductCardData {
  id: string;
  name: string;
  slug: string;
  brand: string | null;
  origin: string | null;
  specification: string | null;
  expiryInfo: string | null;
  category: {
    name: string;
    slug: string;
  };
  variants: Array<{
    id: string;
    name: string;
    sku: string;
    price: unknown;
    originalPrice: unknown | null;
    stock: number;
    image: string | null;
    isDefault: boolean;
  }>;
  images: Array<{
    url: string;
    alt: string | null;
  }>;
}

interface ProductCardProps {
  product: ProductCardData;
}

export function ProductCard({ product }: ProductCardProps) {
  const [isAdded, setIsAdded] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const addItem = useCartStore((state) => state.addItem);

  // Chọn biến thể mặc định hoặc biến thể đầu tiên
  const defaultVariant =
    product.variants.find((v) => v.isDefault) || product.variants[0];

  const price = defaultVariant ? toNumber(defaultVariant.price) : 0;
  const originalPrice =
    defaultVariant?.originalPrice ? toNumber(defaultVariant.originalPrice) : 0;
  const discountPercent = calcDiscount(originalPrice, price);

  // Ảnh hiển thị (ưu tiên ảnh biến thể, sau đó ảnh sản phẩm, cuối cùng là placeholder)
  const imageUrl =
    defaultVariant?.image ||
    product.images[0]?.url ||
    "https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=600&q=80";

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!defaultVariant) return;

    addItem({
      variantId: defaultVariant.id,
      productId: product.id,
      productName: product.name,
      variantName: defaultVariant.name,
      sku: defaultVariant.sku,
      price: price,
      image: imageUrl,
      quantity: 1,
      stock: defaultVariant.stock,
    });

    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1800);
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsWishlisted(!isWishlisted);
  };

  return (
    <div className="group relative bg-white rounded-2xl border border-gray-100 hover:border-[#ffe0e8] hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden">
      {/* ── 1. Image & Badges Container ────────────────────────────── */}
      <div className="relative aspect-square w-full overflow-hidden bg-gray-50">
        <Link href={`/san-pham/${product.slug}`} className="block w-full h-full">
          <Image
            src={imageUrl}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
          />
        </Link>

        {/* Origin Badge */}
        {product.origin && (
          <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-md text-white text-[10px] font-bold tracking-wide">
            {product.origin === "Hàn Quốc" && "🇰🇷 "}
            {product.origin === "Mỹ" && "🇺🇸 "}
            {product.origin === "Nhật Bản" && "🇯🇵 "}
            {product.origin === "Úc" && "🇦🇺 "}
            {product.origin === "New Zealand" && "🇳🇿 "}
            {product.origin === "Pháp" && "🇫🇷 "}
            {product.origin === "Đan Mạch" && "🇩🇰 "}
            <span>{product.origin}</span>
          </div>
        )}

        {/* Discount Badge */}
        {discountPercent > 0 && (
          <div className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-md bg-red-600 text-white text-[11px] font-black shadow-sm">
            -{discountPercent}%
          </div>
        )}

        {/* Wishlist Button */}
        <button
          onClick={handleToggleWishlist}
          className={`absolute bottom-2.5 right-2.5 w-8 h-8 rounded-full flex items-center justify-center transition-all ${
            isWishlisted
              ? "bg-rose-50 text-red-500 shadow-md"
              : "bg-white/80 backdrop-blur-sm text-gray-500 hover:text-red-500 hover:bg-white opacity-0 group-hover:opacity-100"
          }`}
          aria-label="Thêm vào yêu thích"
        >
          <Heart
            className={`w-4 h-4 ${isWishlisted ? "fill-current" : ""}`}
          />
        </button>

        {/* Date / HSD preview badge */}
        {product.expiryInfo && (
          <div className="absolute bottom-2.5 left-2.5 px-2 py-0.5 rounded bg-white/90 backdrop-blur-sm text-gray-700 text-[10px] font-medium border border-gray-100 hidden sm:block">
            {product.expiryInfo}
          </div>
        )}
      </div>

      {/* ── 2. Product Info Container ──────────────────────────────── */}
      <div className="p-3.5 sm:p-4 flex flex-col flex-1 justify-between gap-2.5">
        <div className="space-y-1">
          {/* Brand & Category */}
          <div className="flex items-center justify-between text-[11px] text-gray-400">
            <span className="font-semibold text-[#800028] uppercase tracking-wider truncate max-w-[140px]">
              {product.brand || product.category.name}
            </span>
            {product.variants.length > 1 && (
              <span className="text-[10px] text-gray-400 bg-gray-50 px-1.5 py-0.5 rounded border border-gray-100">
                {product.variants.length} phân loại
              </span>
            )}
          </div>

          {/* Product Title */}
          <h3 className="font-bold text-xs sm:text-sm text-gray-800 group-hover:text-[#800028] transition-colors line-clamp-2 leading-snug">
            <Link href={`/san-pham/${product.slug}`} title={product.name}>
              {product.name}
            </Link>
          </h3>
        </div>

        {/* Price & Rating */}
        <div className="space-y-2 pt-1 border-t border-gray-50">
          <div className="flex items-baseline gap-1.5 flex-wrap">
            <span className="text-base sm:text-lg font-black text-[#800028] tracking-tight">
              {formatVND(price)}
            </span>
            {originalPrice > price && (
              <span className="text-xs text-gray-400 line-through">
                {formatVND(originalPrice)}
              </span>
            )}
          </div>

          {/* Variant name preview */}
          {defaultVariant && product.variants.length > 1 && (
            <p className="text-[11px] text-gray-500 truncate">
              Quy cách: <span className="font-medium text-gray-700">{defaultVariant.name}</span>
            </p>
          )}

          {/* Quick Add To Cart Button */}
          <button
            onClick={handleQuickAdd}
            disabled={defaultVariant ? defaultVariant.stock <= 0 : true}
            className={`w-full py-2 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all duration-200 active:scale-95 ${
              isAdded
                ? "bg-emerald-600 text-white shadow-md"
                : defaultVariant && defaultVariant.stock > 0
                ? "bg-[#800028] hover:bg-[#5c001e] text-white shadow-sm hover:shadow"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }`}
          >
            {isAdded ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Đã thêm vào giỏ!</span>
              </>
            ) : defaultVariant && defaultVariant.stock > 0 ? (
              <>
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Thêm giỏ hàng</span>
              </>
            ) : (
              <span>Tạm hết hàng</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
