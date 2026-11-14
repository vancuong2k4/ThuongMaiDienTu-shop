"use client";

// ============================================================
// components/storefront/family-health/RestockAlertCard.tsx
// Khối Cảnh Báo Sắp Hết Hộp & Gợi Ý Tái Mua 1-Chạm (Phase 22)
// ============================================================

import React, { useState } from "react";
import Link from "next/link";
import { AlertCircle, ShoppingBag, Check, ArrowRight } from "lucide-react";
import { useCartStore } from "@/store/cart";
import type { ScheduleWithStatus } from "@/lib/family-health";

interface RestockAlertCardProps {
  alerts: ScheduleWithStatus[];
}

export const RestockAlertCard: React.FC<RestockAlertCardProps> = ({ alerts }) => {
  const addItem = useCartStore((state) => state.addItem);
  const [addedIds, setAddedIds] = useState<Record<string, boolean>>({});

  if (alerts.length === 0) return null;

  const handleQuickAddToCart = (item: ScheduleWithStatus) => {
    if (!item.product || !item.product.variants || item.product.variants.length === 0) {
      return;
    }

    const variant = item.product.variants[0];
    addItem({
      productId: item.product.id,
      variantId: variant.id,
      productName: item.product.name,
      variantName: item.customItemName,
      sku: variant.id,
      price: Number(variant.price),
      quantity: 1,
      stock: variant.stock || 50,
      image: variant.image ?? null,
    });

    setAddedIds((prev) => ({ ...prev, [item.id]: true }));
    setTimeout(() => {
      setAddedIds((prev) => ({ ...prev, [item.id]: false }));
    }, 2000);
  };

  const formatVND = (n: number) => {
    return new Intl.NumberFormat("vi-VN").format(n) + "₫";
  };

  return (
    <div className="bg-gradient-to-br from-rose-50/80 via-white to-amber-50/60 rounded-3xl p-5 sm:p-6 border-2 border-rose-200/90 shadow-sm space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between gap-2 border-b border-rose-100 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-rose-600 text-white flex items-center justify-center shrink-0">
            <AlertCircle className="w-4 h-4 animate-pulse" />
          </div>
          <div>
            <h4 className="font-black text-xs sm:text-sm text-slate-900 uppercase tracking-wide">
              Dự Báo Tiêu Hao & Nhắc Tái Đặt Hàng
            </h4>
            <p className="text-[11px] text-slate-500">
              Có {alerts.length} sản phẩm sắp hết liều trong 3 - 7 ngày tới
            </p>
          </div>
        </div>

        <span className="text-[10px] font-mono font-bold bg-rose-100 text-[#800028] px-2.5 py-0.5 rounded-full border border-rose-200 uppercase">
          Chu Kỳ Dinh Dưỡng
        </span>
      </div>

      {/* Grid of Alert Items */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {alerts.map((item) => {
          const isAdded = !!addedIds[item.id];
          const hasLinkedProduct = !!item.product && !!item.product.variants?.[0];

          return (
            <div
              key={item.id}
              className="bg-white p-3.5 rounded-2xl border border-rose-100 shadow-2xs flex flex-col justify-between space-y-3"
            >
              <div className="space-y-1">
                <div className="flex items-start justify-between gap-2">
                  <h5 className="font-bold text-xs text-slate-900 line-clamp-1">
                    {item.customItemName}
                  </h5>
                  <span className="text-[10px] font-mono font-black text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded shrink-0">
                    Còn {item.daysRemaining} ngày
                  </span>
                </div>

                <div className="text-[11px] text-slate-500 flex items-center gap-1.5">
                  <span>Còn lại {item.servingsRemaining} liều</span>
                  <span>•</span>
                  <span>Cữ {item.timeString}</span>
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                {hasLinkedProduct ? (
                  <>
                    <span className="font-mono font-bold text-xs text-[#800028]">
                      {formatVND(Number(item.product?.variants[0]?.price))}
                    </span>

                    <button
                      type="button"
                      onClick={() => handleQuickAddToCart(item)}
                      className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-all flex items-center gap-1 cursor-pointer ${
                        isAdded
                          ? "bg-emerald-600 text-white"
                          : "bg-[#800028] hover:bg-[#660020] text-white shadow-xs"
                      }`}
                    >
                      {isAdded ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>Đã thêm</span>
                        </>
                      ) : (
                        <>
                          <ShoppingBag className="w-3.5 h-3.5" />
                          <span>Đặt mua bổ sung</span>
                        </>
                      )}
                    </button>
                  </>
                ) : (
                  <Link
                    href={`/san-pham?search=${encodeURIComponent(item.customItemName)}`}
                    className="text-xs font-bold text-[#800028] hover:underline flex items-center gap-1 ml-auto"
                  >
                    <span>Tìm sản phẩm tương tự</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
