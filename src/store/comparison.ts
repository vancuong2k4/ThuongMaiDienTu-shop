// ============================================================
// store/comparison.ts – Zustand Comparison Store
// Lưu trữ danh sách so sánh sản phẩm (tối đa 4 sản phẩm) với persist
// ============================================================

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export interface ComparisonStoreItem {
  id: string;
  name: string;
  slug: string;
  brand: string | null;
  origin: string | null;
  categoryName: string;
  categorySlug: string;
  price: number;
  originalPrice: number | null;
  image: string;
}

interface ComparisonStore {
  items: ComparisonStoreItem[];
  isOpen: boolean;

  // Actions
  addItem: (item: ComparisonStoreItem) => { success: boolean; message?: string };
  removeItem: (id: string) => void;
  clear: () => void;
  toggleOpen: () => void;
  setOpen: (open: boolean) => void;
  hasItem: (id: string) => boolean;
}

export const useComparisonStore = create<ComparisonStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      addItem: (newItem) => {
        const { items } = get();

        // Đã có trong danh sách
        if (items.some((i) => i.id === newItem.id)) {
          return { success: true };
        }

        // Đã đạt giới hạn 4 sản phẩm
        if (items.length >= 4) {
          return {
            success: false,
            message: "Tối đa so sánh 4 sản phẩm cùng lúc. Vui lòng xóa bớt sản phẩm để thêm mới.",
          };
        }

        set({
          items: [...items, newItem],
          isOpen: true, // Tự động mở thanh so sánh khi thêm mới
        });

        return { success: true };
      },

      removeItem: (id) => {
        set((state) => {
          const nextItems = state.items.filter((i) => i.id !== id);
          return {
            items: nextItems,
            isOpen: nextItems.length > 0 ? state.isOpen : false,
          };
        });
      },

      clear: () => {
        set({ items: [], isOpen: false });
      },

      toggleOpen: () => {
        set((state) => ({ isOpen: !state.isOpen }));
      },

      setOpen: (open) => {
        set({ isOpen: open });
      },

      hasItem: (id) => {
        return get().items.some((i) => i.id === id);
      },
    }),
    {
      name: "thuynga_comparison_store",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ items: state.items }),
    }
  )
);
