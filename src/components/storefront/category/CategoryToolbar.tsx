"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { SlidersHorizontal, ArrowUpDown, X, RotateCcw } from "lucide-react";
import { PRICE_RANGES } from "./FilterContent";
import { CountryFlag } from "@/components/ui/CountryFlag";

export const SORT_OPTIONS = [
  { value: "featured", label: "Nổi bật nhất" },
  { value: "newest", label: "Mới nhất" },
  { value: "price_asc", label: "Giá: Thấp đến Cao" },
  { value: "price_desc", label: "Giá: Cao đến Thấp" },
  { value: "bestseller", label: "Bán chạy nhất" },
] as const;

interface CategoryToolbarProps {
  totalCount: number;
  currentSort: string;
  onOpenMobileFilter: () => void;
}

export function CategoryToolbar({
  totalCount,
  currentSort,
  onOpenMobileFilter,
}: CategoryToolbarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Đọc các bộ lọc đang kích hoạt để hiển thị Active Chips
  const selectedOrigins = searchParams.get("origin")
    ? searchParams.get("origin")!.split(",").filter(Boolean)
    : [];
  const selectedBrands = searchParams.get("brand")
    ? searchParams.get("brand")!.split(",").filter(Boolean)
    : [];
  const selectedPriceRangeId = searchParams.get("price") || "";
  const minPrice = searchParams.get("minPrice");
  const maxPrice = searchParams.get("maxPrice");
  const inStock = searchParams.get("inStock") === "true";
  const onSale = searchParams.get("onSale") === "true";

  // Đếm tổng số tiêu chí lọc đang được chọn
  let activeFilterCount =
    selectedOrigins.length +
    selectedBrands.length +
    (selectedPriceRangeId ? 1 : 0) +
    (minPrice || maxPrice ? 1 : 0) +
    (inStock ? 1 : 0) +
    (onSale ? 1 : 0);

  const matchedPriceLabel = PRICE_RANGES.find(
    (p) => p.id === selectedPriceRangeId
  )?.label;

  // Cập nhật URL
  const updateUrl = (updates: Record<string, string | null>) => {
    const current = new URLSearchParams(Array.from(searchParams.entries()));
    for (const [key, val] of Object.entries(updates)) {
      if (val === null || val === undefined || val === "") {
        current.delete(key);
      } else {
        current.set(key, val);
      }
    }
    current.delete("page");
    const query = current.toString() ? `?${current.toString()}` : "";
    router.push(`${pathname}${query}`, { scroll: false });
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    updateUrl({ sort: e.target.value });
  };

  const handleRemoveOrigin = (origin: string) => {
    const next = selectedOrigins.filter((o) => o !== origin);
    updateUrl({ origin: next.length > 0 ? next.join(",") : null });
  };

  const handleRemoveBrand = (brand: string) => {
    const next = selectedBrands.filter((b) => b !== brand);
    updateUrl({ brand: next.length > 0 ? next.join(",") : null });
  };

  const handleRemovePrice = () => {
    updateUrl({ price: null, minPrice: null, maxPrice: null });
  };

  const handleClearAll = () => {
    const current = new URLSearchParams(Array.from(searchParams.entries()));
    const sortVal = current.get("sort");
    const cleanParams = new URLSearchParams();
    if (sortVal) cleanParams.set("sort", sortVal);
    const query = cleanParams.toString() ? `?${cleanParams.toString()}` : "";
    router.push(`${pathname}${query}`, { scroll: false });
  };

  return (
    <div className="space-y-3 mb-6">
      {/* ── 1. Top Controls Bar ───────────────────────────────────── */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3.5 sm:p-4 rounded-2xl border border-gray-100 shadow-2xs">
        {/* Đếm số lượng sản phẩm */}
        <div className="text-xs sm:text-sm text-gray-600">
          Tìm thấy <strong className="text-gray-900 font-bold">{totalCount}</strong>{" "}
          sản phẩm
        </div>

        <div className="flex items-center gap-2 sm:gap-3 ml-auto">
          {/* Nút mở bộ lọc trên Mobile */}
          <button
            type="button"
            onClick={onOpenMobileFilter}
            className="lg:hidden flex items-center gap-1.5 px-3 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-bold transition-colors cursor-pointer"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-[#800028]" />
            <span>Bộ lọc</span>
            {activeFilterCount > 0 && (
              <span className="w-4 h-4 rounded-full bg-[#800028] text-white text-[10px] font-black flex items-center justify-center">
                {activeFilterCount}
              </span>
            )}
          </button>

          {/* Dropdown Sắp xếp */}
          <div className="flex items-center gap-1.5 text-xs">
            <span className="hidden sm:inline text-gray-500 font-medium">Sắp xếp:</span>
            <div className="relative">
              <select
                value={currentSort}
                onChange={handleSortChange}
                className="h-9 pl-3 pr-8 rounded-xl bg-gray-50 border border-gray-200 text-xs font-bold text-gray-800 focus:outline-none focus:border-[#800028] focus:bg-white cursor-pointer appearance-none"
              >
                {SORT_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              <ArrowUpDown className="w-3.5 h-3.5 text-gray-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
        </div>
      </div>

      {/* ── 2. Active Filter Chips Bar (Hiển thị các tiêu chí đang lọc) */}
      {activeFilterCount > 0 && (
        <div className="flex flex-wrap items-center gap-1.5 pt-1 text-xs">
          <span className="text-[11px] text-gray-400 font-medium mr-1">
            Đang lọc theo:
          </span>

          {/* Chips Xuất xứ */}
          {selectedOrigins.map((orig) => (
            <span
              key={orig}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-rose-50 border border-rose-200 text-[#800028] font-semibold text-[11px] shadow-2xs"
            >
              <CountryFlag country={orig} className="w-3.5 h-2.5 rounded-2xs" />
              <span>{orig}</span>
              <button
                type="button"
                onClick={() => handleRemoveOrigin(orig)}
                className="hover:text-red-700 cursor-pointer ml-0.5"
                aria-label={`Bỏ lọc ${orig}`}
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}

          {/* Chips Thương hiệu */}
          {selectedBrands.map((b) => (
            <span
              key={b}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-gray-100 border border-gray-200 text-gray-800 font-semibold text-[11px]"
            >
              <span>{b}</span>
              <button
                type="button"
                onClick={() => handleRemoveBrand(b)}
                className="hover:text-red-700 cursor-pointer"
                aria-label={`Bỏ lọc ${b}`}
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}

          {/* Chip Khoảng giá */}
          {matchedPriceLabel && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-50 border border-amber-200 text-amber-900 font-semibold text-[11px]">
              <span>{matchedPriceLabel}</span>
              <button
                type="button"
                onClick={handleRemovePrice}
                className="hover:text-red-700 cursor-pointer"
                aria-label="Bỏ lọc khoảng giá"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {/* Chip Giá tùy chỉnh */}
          {!matchedPriceLabel && (minPrice || maxPrice) && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-50 border border-amber-200 text-amber-900 font-semibold text-[11px]">
              <span>
                {minPrice ? `${Number(minPrice).toLocaleString("vi-VN")}₫` : "0₫"}
                {" – "}
                {maxPrice ? `${Number(maxPrice).toLocaleString("vi-VN")}₫` : "vô cùng"}
              </span>
              <button
                type="button"
                onClick={handleRemovePrice}
                className="hover:text-red-700 cursor-pointer"
                aria-label="Bỏ lọc khoảng giá"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {/* Chip Còn hàng */}
          {inStock && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 font-semibold text-[11px]">
              <span>Chỉ còn hàng</span>
              <button
                type="button"
                onClick={() => updateUrl({ inStock: null })}
                className="hover:text-red-700 cursor-pointer"
                aria-label="Bỏ lọc còn hàng"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {/* Chip Giảm giá */}
          {onSale && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-red-50 border border-red-200 text-red-800 font-semibold text-[11px]">
              <span>Đang giảm giá</span>
              <button
                type="button"
                onClick={() => updateUrl({ onSale: null })}
                className="hover:text-red-700 cursor-pointer"
                aria-label="Bỏ lọc giảm giá"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {/* Nút Xóa tất cả */}
          <button
            type="button"
            onClick={handleClearAll}
            className="inline-flex items-center gap-1 text-[11px] font-bold text-gray-500 hover:text-[#800028] ml-1.5 underline underline-offset-2 cursor-pointer"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Xóa tất cả</span>
          </button>
        </div>
      )}
    </div>
  );
}
