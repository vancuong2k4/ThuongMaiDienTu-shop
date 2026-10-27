"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Trash2, ArrowLeft, ShoppingBag } from "lucide-react";
import { useCartStore } from "@/store/cart";
import { FreeShippingProgress } from "./FreeShippingProgress";
import { CartItemRow } from "./CartItemRow";
import { CartOrderSummary } from "./CartOrderSummary";
import { CartEmptyState } from "./CartEmptyState";

export function CartPageClient() {
  const [mounted, setMounted] = useState(false);

  const items = useCartStore((state) => state.items);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeItem = useCartStore((state) => state.removeItem);
  const clearCart = useCartStore((state) => state.clearCart);

  const appliedVoucher = useCartStore((state) => state.appliedVoucher);
  const applyVoucher = useCartStore((state) => state.applyVoucher);
  const removeVoucher = useCartStore((state) => state.removeVoucher);

  const subtotal = useCartStore((state) => state.subtotal());
  const shippingFee = useCartStore((state) => state.shippingFee());
  const discountAmount = useCartStore((state) => state.discountAmount());
  const totalPrice = useCartStore((state) => state.totalPrice());
  const totalCount = useCartStore((state) => state.totalItems());

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="py-12 flex flex-col items-center justify-center space-y-3 min-h-[350px]">
        <div className="w-8 h-8 border-3 border-rose-200 border-t-[#800028] rounded-full animate-spin" />
        <p className="text-xs text-gray-500 font-medium">Đang tải giỏ hàng...</p>
      </div>
    );
  }

  if (items.length === 0) {
    return <CartEmptyState />;
  }

  const handleConfirmClear = () => {
    if (window.confirm("Bạn có chắc chắn muốn xóa toàn bộ sản phẩm khỏi giỏ hàng?")) {
      clearCart();
    }
  };

  return (
    <div className="space-y-6">
      {/* ── Tiêu đề giỏ hàng & Nút Xóa tất cả ─────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-rose-50 text-[#800028] flex items-center justify-center shrink-0">
            <ShoppingBag className="w-4 h-4" />
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">
            Giỏ Hàng Của Bạn
          </h1>
          <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">
            {totalCount} sản phẩm
          </span>
        </div>

        <button
          type="button"
          onClick={handleConfirmClear}
          className="inline-flex items-center gap-1.5 text-xs text-gray-500 hover:text-red-600 transition-colors font-medium self-start sm:self-auto cursor-pointer"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Xóa toàn bộ giỏ hàng</span>
        </button>
      </div>

      {/* ── Bố cục 2 Cột: Danh sách sản phẩm (Trái) & Tóm tắt (Phải) ─ */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
        {/* Cột Trái (8 phần) */}
        <div className="lg:col-span-7 xl:col-span-8 space-y-4">
          {/* Thanh Tiến Trình Miễn Phí Vận Chuyển */}
          <FreeShippingProgress subtotal={subtotal} />

          {/* Bảng Danh Sách Sản Phẩm */}
          <div className="bg-white rounded-3xl border border-gray-100 p-4 sm:p-6 shadow-2xs">
            {/* Header cột trên Desktop */}
            <div className="hidden sm:grid grid-cols-12 pb-3 mb-2 border-b border-gray-100 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
              <div className="col-span-6">Sản phẩm</div>
              <div className="col-span-2 text-right">Đơn giá</div>
              <div className="col-span-2 text-center">Số lượng</div>
              <div className="col-span-2 text-right">Thành tiền</div>
            </div>

            {/* Danh sách items */}
            <div className="divide-y divide-gray-100">
              {items.map((item) => (
                <CartItemRow
                  key={item.variantId}
                  item={item}
                  onUpdateQuantity={updateQuantity}
                  onRemove={removeItem}
                />
              ))}
            </div>
          </div>

          {/* Nút quay lại mua sắm */}
          <div className="pt-2">
            <Link
              href="/san-pham"
              className="inline-flex items-center gap-2 text-xs font-bold text-gray-600 hover:text-[#800028] transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Tiếp tục tìm kiếm và mua sắm sản phẩm khác</span>
            </Link>
          </div>
        </div>

        {/* Cột Phải (4 phần) */}
        <div className="lg:col-span-5 xl:col-span-4">
          <CartOrderSummary
            subtotal={subtotal}
            shippingFee={shippingFee}
            discountAmount={discountAmount}
            totalPrice={totalPrice}
            appliedVoucher={appliedVoucher}
            onApplyVoucher={applyVoucher}
            onRemoveVoucher={removeVoucher}
          />
        </div>
      </div>
    </div>
  );
}
