"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ShoppingBag, Zap, Check } from "lucide-react";
import { formatVND } from "@/lib/utils";
import { useCartStore } from "@/store/cart";
import type { VariantData } from "./ProductInfoSection";

interface StickyMobileCartBarProps {
  productId: string;
  productName: string;
  selectedVariant: VariantData;
  activeImage: string;
}

export function StickyMobileCartBar({
  productId,
  productName,
  selectedVariant,
  activeImage,
}: StickyMobileCartBarProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isAdded, setIsAdded] = useState(false);
  const router = useRouter();
  const addItem = useCartStore((state) => state.addItem);

  const price = selectedVariant.price;
  const isOutOfStock = selectedVariant.stock <= 0;

  useEffect(() => {
    const handleScroll = () => {
      // Khi cuộn qua 450px (qua khối hình ảnh & nút mua chính) thì thanh này hiện ra
      if (window.scrollY > 450) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!isVisible) return null;

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    addItem({
      variantId: selectedVariant.id,
      productId,
      productName,
      variantName: selectedVariant.name,
      sku: selectedVariant.sku,
      price,
      image: selectedVariant.image || activeImage,
      quantity: 1,
      stock: selectedVariant.stock,
    });

    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1800);
  };

  const handleBuyNow = () => {
    if (isOutOfStock) return;
    addItem({
      variantId: selectedVariant.id,
      productId,
      productName,
      variantName: selectedVariant.name,
      sku: selectedVariant.sku,
      price,
      image: selectedVariant.image || activeImage,
      quantity: 1,
      stock: selectedVariant.stock,
    });
    router.push("/thanh-toan");
  };

  return (
    <div className="fixed bottom-14 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-gray-200 px-4 py-2.5 shadow-2xl lg:hidden animate-in slide-in-from-bottom-5 duration-200">
      <div className="flex items-center justify-between gap-3 max-w-md mx-auto">
        {/* Thumbnail & Giá */}
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="relative w-10 h-10 rounded-xl overflow-hidden shrink-0 border border-gray-200 bg-white">
            <Image
              src={selectedVariant.image || activeImage}
              alt={productName}
              fill
              className="object-cover"
              sizes="40px"
            />
          </div>
          <div className="min-w-0 leading-tight">
            <div className="text-xs font-black text-[#800028] truncate">
              {formatVND(price)}
            </div>
            <div className="text-[10px] text-gray-500 truncate">
              {selectedVariant.name}
            </div>
          </div>
        </div>

        {/* Nút hành động */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            className={`h-9 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1 border transition-all ${
              isAdded
                ? "bg-emerald-600 text-white border-emerald-600"
                : isOutOfStock
                ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
                : "border-[#800028] text-[#800028] bg-white active:bg-rose-50"
            }`}
          >
            {isAdded ? (
              <Check className="w-3.5 h-3.5" />
            ) : (
              <ShoppingBag className="w-3.5 h-3.5" />
            )}
            <span className="hidden sm:inline">Thêm giỏ</span>
          </button>

          <button
            onClick={handleBuyNow}
            disabled={isOutOfStock}
            className={`h-9 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-1 transition-all ${
              isOutOfStock
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-[#800028] text-white shadow-md active:bg-[#5c001e]"
            }`}
          >
            <Zap className="w-3.5 h-3.5 fill-current text-amber-300" />
            <span>Mua ngay</span>
          </button>
        </div>
      </div>
    </div>
  );
}
