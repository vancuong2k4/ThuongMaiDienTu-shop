"use client";

// ============================================================
// components/admin/products/ProductFilters.tsx
// Bộ lọc tìm kiếm sản phẩm nâng cao cho Admin CMS
// ============================================================

import React, { useTransition } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Search, RotateCcw, Filter } from "lucide-react";
import { getCountryFlag } from "@/lib/utils";

interface CategoryOption {
  id: string;
  name: string;
  parentId: string | null;
}

interface ProductFiltersProps {
  categories: CategoryOption[];
  origins: string[];
}

export const ProductFilters: React.FC<ProductFiltersProps> = ({
  categories,
  origins,
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const currentSearch = searchParams.get("search") || "";
  const currentCategory = searchParams.get("categoryId") || "all";
  const currentOrigin = searchParams.get("origin") || "all";
  const currentStockStatus = searchParams.get("stockStatus") || "all";
  const currentActive = searchParams.get("isActive") || "all";
  const currentFeatured = searchParams.get("isFeatured") || "all";

  const updateFilters = (updates: Record<string, string>) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", "1"); // Reset về trang 1 khi lọc

    Object.entries(updates).forEach(([key, value]) => {
      if (value === "all" || value === "") {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    });

    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`);
    });
  };

  const handleReset = () => {
    startTransition(() => {
      router.push(pathname);
    });
  };

  const hasActiveFilters = Boolean(
    currentSearch ||
      currentCategory !== "all" ||
      currentOrigin !== "all" ||
      currentStockStatus !== "all" ||
      currentActive !== "all" ||
      currentFeatured !== "all"
  );

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs space-y-3">
      {/* ── Hàng 1: Tìm kiếm từ khóa ────────────────────────────── */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            defaultValue={currentSearch}
            placeholder="Tìm theo tên sản phẩm, thương hiệu hoặc mã SKU..."
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-wine-800/20 focus:border-wine-800 transition-all"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                updateFilters({ search: (e.target as HTMLInputElement).value });
              }
            }}
            onBlur={(e) => {
              if (e.target.value !== currentSearch) {
                updateFilters({ search: e.target.value });
              }
            }}
          />
        </div>

        {hasActiveFilters && (
          <button
            type="button"
            onClick={handleReset}
            disabled={isPending}
            className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:text-wine-800 hover:bg-slate-50 transition-colors shrink-0"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Xóa bộ lọc</span>
          </button>
        )}
      </div>

      {/* ── Hàng 2: Bộ lọc phân loại ────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5 pt-1">
        {/* Danh mục */}
        <div>
          <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
            Danh mục
          </label>
          <select
            value={currentCategory}
            onChange={(e) => updateFilters({ categoryId: e.target.value })}
            className="w-full py-2 px-2.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-wine-800/20 focus:border-wine-800"
          >
            <option value="all">Tất cả danh mục</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.parentId ? `↳ ${c.name}` : c.name}
              </option>
            ))}
          </select>
        </div>

        {/* Xuất xứ */}
        <div>
          <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
            Xuất xứ
          </label>
          <select
            value={currentOrigin}
            onChange={(e) => updateFilters({ origin: e.target.value })}
            className="w-full py-2 px-2.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-wine-800/20 focus:border-wine-800"
          >
            <option value="all">Tất cả xuất xứ</option>
            {origins.map((org) => (
              <option key={org} value={org}>
                {getCountryFlag(org)} {org}
              </option>
            ))}
          </select>
        </div>

        {/* Tồn kho */}
        <div>
          <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
            Tồn kho
          </label>
          <select
            value={currentStockStatus}
            onChange={(e) => updateFilters({ stockStatus: e.target.value })}
            className="w-full py-2 px-2.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-wine-800/20 focus:border-wine-800"
          >
            <option value="all">Tất cả mức tồn</option>
            <option value="in_stock">Dồi dào (&gt; 10)</option>
            <option value="low_stock">Sắp hết hàng (1 - 10)</option>
            <option value="out_of_stock">Hết hàng (0)</option>
          </select>
        </div>

        {/* Trạng thái kinh doanh */}
        <div>
          <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
            Kinh doanh
          </label>
          <select
            value={currentActive}
            onChange={(e) => updateFilters({ isActive: e.target.value })}
            className="w-full py-2 px-2.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-wine-800/20 focus:border-wine-800"
          >
            <option value="all">Tất cả</option>
            <option value="true">Đang kinh doanh</option>
            <option value="false">Ngừng kinh doanh</option>
          </select>
        </div>

        {/* Nổi bật */}
        <div className="col-span-2 sm:col-span-1">
          <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
            Nổi bật
          </label>
          <select
            value={currentFeatured}
            onChange={(e) => updateFilters({ isFeatured: e.target.value })}
            className="w-full py-2 px-2.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-wine-800/20 focus:border-wine-800"
          >
            <option value="all">Tất cả</option>
            <option value="true">Nổi bật ⭐</option>
            <option value="false">Bình thường</option>
          </select>
        </div>
      </div>
    </div>
  );
};
