"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2, AlertCircle } from "lucide-react";
import { formatVND } from "@/lib/utils";
import type { CartItem } from "@/types";

interface CartItemRowProps {
  item: CartItem;
  onUpdateQuantity: (variantId: string, quantity: number) => void;
  onRemove: (variantId: string) => void;
}

export function CartItemRow({
  item,
  onUpdateQuantity,
  onRemove,
}: CartItemRowProps) {
  const lineTotal = item.price * item.quantity;
  const isMaxStock = item.quantity >= item.stock;

  return (
    <div className="py-4 sm:py-5 border-b border-gray-100 last:border-none flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors">
      {/* ── Thông tin sản phẩm & Ảnh ───────────────────────────────── */}
      <div className="flex items-start gap-3.5 sm:gap-4 flex-1 min-w-0">
        {/* Ảnh */}
        <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden bg-gray-50 border border-gray-100 shrink-0">
          <Image
            src={
              item.image ||
              "https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=600&q=80"
            }
            alt={item.productName}
            fill
            className="object-cover object-center"
            sizes="96px"
          />
        </div>

        {/* Tiêu đề & Phân loại */}
        <div className="space-y-1 flex-1 min-w-0">
          <h4 className="font-bold text-xs sm:text-sm text-gray-900 leading-snug line-clamp-2 hover:text-[#800028] transition-colors">
            {item.productName}
          </h4>

          {/* Phân loại & SKU */}
          <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-gray-500">
            <span className="px-2 py-0.5 rounded-md bg-rose-50 text-[#800028] font-semibold border border-rose-100/80">
              {item.variantName}
            </span>
            <span className="text-gray-400 font-mono text-[10px]">
              SKU: {item.sku}
            </span>
          </div>

          {/* Đơn giá */}
          <div className="text-xs font-semibold text-gray-700 sm:hidden pt-0.5">
            Đơn giá: <span className="text-[#800028] font-bold">{formatVND(item.price)}</span>
          </div>

          {/* Cảnh báo kho */}
          {item.stock <= 5 && item.stock > 0 && (
            <div className="flex items-center gap-1 text-[11px] text-amber-600 font-medium pt-0.5">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>Chỉ còn {item.stock} sản phẩm trong kho</span>
            </div>
          )}
        </div>
      </div>

      {/* ── Bộ điều khiển số lượng & Đơn giá trên Desktop ───────────── */}
      <div className="flex items-center justify-between sm:justify-end gap-4 sm:gap-8 pt-2 sm:pt-0 border-t sm:border-t-0 border-gray-50">
        {/* Đơn giá ẩn trên mobile */}
        <div className="hidden sm:block text-right w-24">
          <div className="text-xs text-gray-400 font-medium">Đơn giá</div>
          <div className="text-sm font-bold text-gray-800">
            {formatVND(item.price)}
          </div>
        </div>

        {/* Bộ tăng/giảm (+ / -) */}
        <div className="flex flex-col items-center gap-1">
          <div className="flex items-center border border-gray-200 rounded-xl bg-white shadow-2xs overflow-hidden">
            <button
              type="button"
              onClick={() => onUpdateQuantity(item.variantId, item.quantity - 1)}
              className="w-8 h-8 flex items-center justify-center text-gray-600 hover:text-black hover:bg-gray-100 transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              aria-label="Giảm số lượng"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>

            <span className="w-10 text-center font-bold text-xs sm:text-sm text-gray-900 select-none">
              {item.quantity}
            </span>

            <button
              type="button"
              onClick={() => onUpdateQuantity(item.variantId, item.quantity + 1)}
              disabled={isMaxStock}
              className="w-8 h-8 flex items-center justify-center text-gray-600 hover:text-black hover:bg-gray-100 transition-colors disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
              aria-label="Tăng số lượng"
              title={isMaxStock ? "Đã đạt số lượng tồn kho tối đa" : undefined}
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>
          {isMaxStock && (
            <span className="text-[10px] text-amber-600 font-medium">Tối đa kho</span>
          )}
        </div>

        {/* Thành tiền (Line Total) */}
        <div className="text-right w-28">
          <div className="text-[11px] text-gray-400 sm:hidden">Thành tiền:</div>
          <div className="text-sm sm:text-base font-black text-[#800028]">
            {formatVND(lineTotal)}
          </div>
        </div>

        {/* Nút Xóa */}
        <button
          type="button"
          onClick={() => onRemove(item.variantId)}
          className="w-8 h-8 rounded-xl flex items-center justify-center text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
          title="Xóa sản phẩm"
          aria-label="Xóa sản phẩm"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
