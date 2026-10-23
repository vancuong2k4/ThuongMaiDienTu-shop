"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Flame, Clock, ArrowRight, Zap, Check, ShoppingBag } from "lucide-react";
import { formatVND, calcDiscount, toNumber } from "@/lib/utils";
import { useCartStore } from "@/store/cart";

interface FlashSaleItemData {
  id: string;
  salePrice: unknown;
  quantity: number;
  soldCount: number;
  product: {
    id: string;
    name: string;
    slug: string;
    origin: string | null;
  };
  variant: {
    id: string;
    name: string;
    sku: string;
    price: unknown;
    originalPrice: unknown | null;
    stock: number;
    image: string | null;
  };
}

interface FlashSaleSectionProps {
  endTime: string | Date;
  items: FlashSaleItemData[];
}

export function FlashSaleSection({ endTime, items }: FlashSaleSectionProps) {
  const [timeLeft, setTimeLeft] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [addedVariantId, setAddedVariantId] = useState<string | null>(null);
  const addItem = useCartStore((state) => state.addItem);

  // Countdown timer logic
  useEffect(() => {
    const target = new Date(endTime).getTime();

    const updateTimer = () => {
      const now = new Date().getTime();
      const distance = target - now;

      if (distance <= 0) {
        setTimeLeft({ hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      const hours = Math.floor(distance / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      setTimeLeft({ hours, minutes, seconds });
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [endTime]);

  const handleQuickAdd = (item: FlashSaleItemData) => {
    const salePriceNum = toNumber(item.salePrice);
    addItem({
      variantId: item.variant.id,
      productId: item.product.id,
      productName: item.product.name,
      variantName: item.variant.name,
      sku: item.variant.sku,
      price: salePriceNum,
      image: item.variant.image,
      quantity: 1,
      stock: item.variant.stock,
    });

    setAddedVariantId(item.variant.id);
    setTimeout(() => setAddedVariantId(null), 1800);
  };

  if (!items || items.length === 0) return null;

  return (
    <section className="py-6 sm:py-8">
      <div className="shop-container">
        <div className="bg-gradient-to-r from-red-600 via-[#800028] to-[#5c001e] rounded-3xl p-4 sm:p-6 lg:p-8 shadow-2xl text-white relative overflow-hidden">
          {/* Header Flash Sale */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/15">
            <div className="flex flex-wrap items-center gap-3 sm:gap-4">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-2xl bg-amber-400 flex items-center justify-center text-[#5c001e] shadow-lg animate-bounce">
                  <Flame className="w-6 h-6 fill-current" />
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-white flex items-center gap-2">
                    <span>FLASH SALE</span>
                    <span className="text-amber-300 font-extrabold text-xs px-2 py-0.5 rounded-full bg-white/20">
                      GIÁ SỐC
                    </span>
                  </h2>
                  <p className="text-xs text-rose-100 font-medium hidden sm:block">
                    Cơ hội săn hàng nhập khẩu chính hãng với ưu đãi đặc quyền
                  </p>
                </div>
              </div>

              {/* Countdown Boxes */}
              <div className="flex items-center gap-1.5 ml-0 sm:ml-4">
                <span className="text-xs text-rose-100 font-semibold mr-1 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Kết thúc sau:</span>
                </span>
                <div className="px-2.5 py-1 rounded-lg bg-black/40 backdrop-blur-md text-amber-300 font-mono font-black text-sm sm:text-base min-w-[36px] text-center border border-white/10 shadow-inner">
                  {String(timeLeft.hours).padStart(2, "0")}
                </div>
                <span className="font-bold text-amber-300">:</span>
                <div className="px-2.5 py-1 rounded-lg bg-black/40 backdrop-blur-md text-amber-300 font-mono font-black text-sm sm:text-base min-w-[36px] text-center border border-white/10 shadow-inner">
                  {String(timeLeft.minutes).padStart(2, "0")}
                </div>
                <span className="font-bold text-amber-300">:</span>
                <div className="px-2.5 py-1 rounded-lg bg-black/40 backdrop-blur-md text-amber-300 font-mono font-black text-sm sm:text-base min-w-[36px] text-center border border-white/10 shadow-inner">
                  {String(timeLeft.seconds).padStart(2, "0")}
                </div>
              </div>
            </div>

            <Link
              href="/flash-sale"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-300 hover:text-white transition-colors self-start sm:self-auto"
            >
              <span>Xem tất cả deal sốc</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Flash Sale Product Grid (Scroll mượt trên mobile) */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 pt-6">
            {items.map((item) => {
              const salePrice = toNumber(item.salePrice);
              const originalPrice =
                item.variant.originalPrice
                  ? toNumber(item.variant.originalPrice)
                  : toNumber(item.variant.price);
              const discount = calcDiscount(originalPrice, salePrice);
              const percentSold = Math.min(
                Math.round((item.soldCount / item.quantity) * 100),
                100
              );
              const isAdded = addedVariantId === item.variant.id;

              return (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl p-3 sm:p-4 text-gray-900 shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col justify-between group"
                >
                  {/* Image & Discount */}
                  <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-gray-50 mb-3">
                    <Link href={`/san-pham/${item.product.slug}`} className="block w-full h-full">
                      <Image
                        src={
                          item.variant.image ||
                          "https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=600&q=80"
                        }
                        alt={item.product.name}
                        fill
                        sizes="(max-width: 640px) 50vw, 25vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </Link>

                    {discount > 0 && (
                      <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-red-600 text-white text-[11px] font-black shadow">
                        -{discount}%
                      </span>
                    )}

                    {item.product.origin && (
                      <span className="absolute top-2 right-2 px-1.5 py-0.5 rounded bg-black/60 text-white text-[9px] font-bold">
                        {item.product.origin}
                      </span>
                    )}
                  </div>

                  {/* Title */}
                  <h3 className="font-bold text-xs sm:text-sm text-gray-900 group-hover:text-[#800028] transition-colors line-clamp-2 leading-snug mb-2">
                    <Link href={`/san-pham/${item.product.slug}`}>
                      {item.product.name}
                    </Link>
                  </h3>

                  {/* Price */}
                  <div className="space-y-2 mt-auto">
                    <div className="flex items-baseline gap-1.5 flex-wrap">
                      <span className="text-base sm:text-lg font-black text-red-600 tracking-tight">
                        {formatVND(salePrice)}
                      </span>
                      {originalPrice > salePrice && (
                        <span className="text-[11px] sm:text-xs text-gray-400 line-through">
                          {formatVND(originalPrice)}
                        </span>
                      )}
                    </div>

                    {/* Progress Bar (Đã bán) */}
                    <div className="space-y-1">
                      <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden relative">
                        <div
                          className="bg-gradient-to-r from-orange-500 to-red-600 h-full rounded-full transition-all duration-500"
                          style={{ width: `${percentSold}%` }}
                        />
                        <span className="absolute inset-0 flex items-center justify-center text-[9px] font-extrabold text-gray-700 tracking-tight">
                          Đã bán {item.soldCount}/{item.quantity}
                        </span>
                      </div>
                    </div>

                    {/* Quick Button */}
                    <button
                      onClick={() => handleQuickAdd(item)}
                      disabled={item.variant.stock <= 0}
                      className={`w-full py-2 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all duration-200 active:scale-95 ${
                        isAdded
                          ? "bg-emerald-600 text-white shadow"
                          : "bg-red-600 hover:bg-red-700 text-white shadow-sm"
                      }`}
                    >
                      {isAdded ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>Đã thêm!</span>
                        </>
                      ) : (
                        <>
                          <Zap className="w-3.5 h-3.5 fill-current text-yellow-300" />
                          <span>Mua ngay</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
