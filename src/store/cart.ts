// ============================================================
// store/cart.ts – Zustand Cart Store
// Giỏ hàng client-side với persist (localStorage)
// ============================================================

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { CartItem } from "@/types";

export interface AppliedVoucher {
  id: string;
  code: string;
  type: string;
  value: number;
  discountAmount: number;
  minOrderAmount?: number | null;
  maxDiscount?: number | null;
  description: string;
}

interface CartStore {
  items: CartItem[];
  appliedVoucher: AppliedVoucher | null;

  // Actions
  addItem: (item: CartItem) => void;
  removeItem: (variantId: string) => void;
  updateQuantity: (variantId: string, quantity: number) => void;
  clearCart: () => void;
  applyVoucher: (voucher: AppliedVoucher) => void;
  removeVoucher: () => void;

  // Computed (getters)
  totalItems: () => number;
  subtotal: () => number;
  shippingFee: () => number;
  discountAmount: () => number;
  totalPrice: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      appliedVoucher: null,

      addItem: (newItem) => {
        set((state) => {
          const existing = state.items.find(
            (i) => i.variantId === newItem.variantId
          );

          if (existing) {
            const newQty = Math.min(
              existing.quantity + newItem.quantity,
              newItem.stock
            );
            return {
              items: state.items.map((i) =>
                i.variantId === newItem.variantId
                  ? { ...i, quantity: newQty }
                  : i
              ),
            };
          }

          return { items: [...state.items, newItem] };
        });
      },

      removeItem: (variantId) => {
        set((state) => ({
          items: state.items.filter((i) => i.variantId !== variantId),
        }));
      },

      updateQuantity: (variantId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(variantId);
          return;
        }
        set((state) => ({
          items: state.items.map((i) =>
            i.variantId === variantId
              ? { ...i, quantity: Math.min(quantity, i.stock) }
              : i
          ),
        }));
      },

      clearCart: () => set({ items: [], appliedVoucher: null }),

      applyVoucher: (voucher) => set({ appliedVoucher: voucher }),

      removeVoucher: () => set({ appliedVoucher: null }),

      totalItems: () => {
        return get().items.reduce((sum, item) => sum + item.quantity, 0);
      },

      subtotal: () => {
        return get().items.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0
        );
      },

      shippingFee: () => {
        const sub = get().subtotal();
        if (sub === 0) return 0;
        // Miễn phí vận chuyển cho đơn từ 500.000₫ hoặc voucher FREESHIP
        if (sub >= 500000 || get().appliedVoucher?.type === "FREE_SHIP") {
          return 0;
        }
        return 30000;
      },

      discountAmount: () => {
        const voucher = get().appliedVoucher;
        if (!voucher) return 0;

        const sub = get().subtotal();
        if (voucher.minOrderAmount && sub < voucher.minOrderAmount) {
          return 0;
        }

        if (voucher.type === "FIXED") {
          return Math.min(voucher.value, sub);
        } else if (voucher.type === "PERCENTAGE") {
          const calc = Math.round((sub * voucher.value) / 100);
          return voucher.maxDiscount ? Math.min(calc, voucher.maxDiscount) : calc;
        } else if (voucher.type === "FREE_SHIP") {
          // Nếu đơn đã >= 500k thì vốn đã free ship, nếu chưa thì giảm 30k ship
          return sub < 500000 ? 30000 : 0;
        }
        return voucher.discountAmount || 0;
      },

      totalPrice: () => {
        const sub = get().subtotal();
        if (sub === 0) return 0;
        const discount = get().discountAmount();
        const ship = get().shippingFee();
        return Math.max(0, sub - discount + ship);
      },
    }),
    {
      name: "thuyngashop-cart",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
