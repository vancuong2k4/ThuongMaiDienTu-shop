"use client";

import { useState } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import {
  Filter,
  RotateCcw,
  Check,
  ChevronDown,
  Search,
  CheckCircle2,
  DollarSign,
  Globe2,
  Tag,
  Boxes,
} from "lucide-react";
import { CountryFlag } from "@/components/ui/CountryFlag";
import { formatVND } from "@/lib/utils";

export const PRICE_RANGES = [
  { id: "under-300k", label: "Dưới 300.000₫", min: 0, max: 300000 },
  { id: "300k-500k", label: "300.000₫ – 500.000₫", min: 300000, max: 500000 },
  { id: "500k-1m", label: "500.000₫ – 1.000.000₫", min: 500000, max: 1000000 },
  { id: "1m-2m", label: "1.000.000₫ – 2.000.000₫", min: 1000000, max: 2000000 },
  { id: "above-2m", label: "Trên 2.000.000₫", min: 2000000, max: null },
] as const;

export interface AvailableFilters {
  origins: string[];
  brands: string[];
  subcategories: Array<{ id: string; name: string; slug: string; count?: number }>;
}

interface FilterContentProps {
  availableFilters: AvailableFilters;
  onApplyMobile?: () => void;
}

export function FilterContent({ availableFilters, onApplyMobile }: FilterContentProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Đọc các giá trị filter hiện tại từ URL
  const selectedOrigins = searchParams.get("origin")
    ? searchParams.get("origin")!.split(",").filter(Boolean)
    : [];

  const selectedBrands = searchParams.get("brand")
    ? searchParams.get("brand")!.split(",").filter(Boolean)
    : [];

  const selectedPriceRange = searchParams.get("price") || "";
  const minPriceParam = searchParams.get("minPrice") || "";
  const maxPriceParam = searchParams.get("maxPrice") || "";
  const inStockOnly = searchParams.get("inStock") === "true";
  const onSaleOnly = searchParams.get("onSale") === "true";
  const selectedSubcat = searchParams.get("subcat") || "";

  // State nhập giá tùy chỉnh
  const [customMin, setCustomMin] = useState(minPriceParam);
  const [customMax, setCustomMax] = useState(maxPriceParam);
  const [brandSearch, setBrandSearch] = useState("");

  // Kiểm tra xem có filter nào đang kích hoạt không
  const hasActiveFilters =
    selectedOrigins.length > 0 ||
    selectedBrands.length > 0 ||
    !!selectedPriceRange ||
    !!minPriceParam ||
    !!maxPriceParam ||
    inStockOnly ||
    onSaleOnly ||
    !!selectedSubcat;

  // Hàm cập nhật URL search params
  const updateUrl = (updates: Record<string, string | null>) => {
    const current = new URLSearchParams(Array.from(searchParams.entries()));
    for (const [key, val] of Object.entries(updates)) {
      if (val === null || val === undefined || val === "") {
        current.delete(key);
      } else {
        current.set(key, val);
      }
    }
    // Khi đổi bộ lọc luôn reset về trang 1
    current.delete("page");
    const query = current.toString() ? `?${current.toString()}` : "";
    router.push(`${pathname}${query}`, { scroll: false });
  };

  // Toggle xuất xứ
  const handleToggleOrigin = (origin: string) => {
    let next: string[];
    if (selectedOrigins.includes(origin)) {
      next = selectedOrigins.filter((o) => o !== origin);
    } else {
      next = [...selectedOrigins, origin];
    }
    updateUrl({ origin: next.length > 0 ? next.join(",") : null });
  };

  // Toggle thương hiệu
  const handleToggleBrand = (brand: string) => {
    let next: string[];
    if (selectedBrands.includes(brand)) {
      next = selectedBrands.filter((b) => b !== brand);
    } else {
      next = [...selectedBrands, brand];
    }
    updateUrl({ brand: next.length > 0 ? next.join(",") : null });
  };

  // Chọn khoảng giá định sẵn
  const handleSelectPriceRange = (rangeId: string) => {
    if (selectedPriceRange === rangeId) {
      // Bỏ chọn nếu click lại
      updateUrl({ price: null, minPrice: null, maxPrice: null });
    } else {
      updateUrl({ price: rangeId, minPrice: null, maxPrice: null });
      setCustomMin("");
      setCustomMax("");
    }
  };

  // Áp dụng khoảng giá tùy chỉnh
  const handleApplyCustomPrice = (e: React.FormEvent) => {
    e.preventDefault();
    updateUrl({
      price: null,
      minPrice: customMin ? String(Number(customMin)) : null,
      maxPrice: customMax ? String(Number(customMax)) : null,
    });
  };

  // Xóa toàn bộ bộ lọc
  const handleResetAll = () => {
    setCustomMin("");
    setCustomMax("");
    setBrandSearch("");
    const current = new URLSearchParams(Array.from(searchParams.entries()));
    // Giữ lại sort nếu có
    const sortVal = current.get("sort");
    const cleanParams = new URLSearchParams();
    if (sortVal) cleanParams.set("sort", sortVal);
    const query = cleanParams.toString() ? `?${cleanParams.toString()}` : "";
    router.push(`${pathname}${query}`, { scroll: false });
  };

  // Lọc thương hiệu theo từ khóa tìm kiếm
  const filteredBrands = availableFilters.brands.filter((b) =>
    b.toLowerCase().includes(brandSearch.toLowerCase().trim())
  );

  return (
    <div className="space-y-6 text-xs text-gray-700">
      {/* ── 1. Header Sidebar & Nút Reset ──────────────────────────── */}
      <div className="flex items-center justify-between pb-3 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-[#800028]" />
          <span className="font-black text-gray-900 text-sm uppercase tracking-wide">
            Bộ Lọc Tìm Kiếm
          </span>
        </div>

        {hasActiveFilters && (
          <button
            type="button"
            onClick={handleResetAll}
            className="flex items-center gap-1 text-[11px] font-bold text-[#800028] hover:text-[#5c001e] transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Xóa lọc</span>
          </button>
        )}
      </div>

      {/* ── 2. Bộ lọc Trạng thái nhanh (Còn hàng & Giảm giá) ───────── */}
      <div className="space-y-2.5">
        <div className="font-bold text-gray-900 text-xs uppercase tracking-wider flex items-center gap-1.5">
          <CheckCircle2 className="w-3.5 h-3.5 text-[#800028]" />
          <span>Tình trạng hàng hóa</span>
        </div>

        <div className="space-y-2 bg-gray-50/70 p-3 rounded-2xl border border-gray-100">
          <label className="flex items-center gap-2.5 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={inStockOnly}
              onChange={(e) =>
                updateUrl({ inStock: e.target.checked ? "true" : null })
              }
              className="w-4 h-4 rounded text-[#800028] focus:ring-[#800028] border-gray-300 cursor-pointer"
            />
            <span className="font-semibold text-gray-800">Chỉ hiện sản phẩm còn hàng</span>
          </label>

          <label className="flex items-center gap-2.5 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={onSaleOnly}
              onChange={(e) =>
                updateUrl({ onSale: e.target.checked ? "true" : null })
              }
              className="w-4 h-4 rounded text-[#800028] focus:ring-[#800028] border-gray-300 cursor-pointer"
            />
            <span className="font-semibold text-gray-800 flex items-center gap-1">
              <span>Đang có ưu đãi / Giảm giá</span>
              <span className="px-1.5 py-0.2 bg-red-100 text-red-700 text-[10px] font-bold rounded-md">
                HOT
              </span>
            </span>
          </label>
        </div>
      </div>

      {/* ── 3. Bộ lọc Xuất Xứ Quốc Gia (Có cờ SVG vector sắc nét) ──── */}
      {availableFilters.origins.length > 0 && (
        <div className="space-y-2.5">
          <div className="font-bold text-gray-900 text-xs uppercase tracking-wider flex items-center gap-1.5">
            <Globe2 className="w-3.5 h-3.5 text-[#800028]" />
            <span>Xuất xứ quốc gia</span>
          </div>

          <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
            {availableFilters.origins.map((origin) => {
              const isChecked = selectedOrigins.includes(origin);
              return (
                <label
                  key={origin}
                  className={`flex items-center justify-between p-2 rounded-xl transition-colors cursor-pointer border ${
                    isChecked
                      ? "bg-rose-50/60 border-[#800028]/40 font-bold text-[#800028]"
                      : "bg-white border-transparent hover:bg-gray-50 text-gray-700"
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => handleToggleOrigin(origin)}
                      className="w-4 h-4 rounded text-[#800028] focus:ring-[#800028] border-gray-300 cursor-pointer shrink-0"
                    />
                    <CountryFlag country={origin} className="w-4.5 h-3.5 rounded-2xs shadow-2xs" />
                    <span className="truncate">{origin}</span>
                  </div>
                  {isChecked && <Check className="w-3.5 h-3.5 text-[#800028] shrink-0" />}
                </label>
              );
            })}
          </div>
        </div>
      )}

      {/* ── 4. Bộ lọc Khoảng Giá ───────────────────────────────────── */}
      <div className="space-y-2.5">
        <div className="font-bold text-gray-900 text-xs uppercase tracking-wider flex items-center gap-1.5">
          <DollarSign className="w-3.5 h-3.5 text-[#800028]" />
          <span>Khoảng giá (VNĐ)</span>
        </div>

        {/* Mức giá định sẵn */}
        <div className="space-y-1">
          {PRICE_RANGES.map((r) => {
            const isSelected = selectedPriceRange === r.id;
            return (
              <button
                key={r.id}
                type="button"
                onClick={() => handleSelectPriceRange(r.id)}
                className={`w-full text-left px-3 py-2 rounded-xl font-medium transition-all flex items-center justify-between border cursor-pointer ${
                  isSelected
                    ? "bg-[#800028] text-white border-[#800028] font-bold shadow-2xs"
                    : "bg-white hover:bg-gray-50 text-gray-700 border-gray-100 hover:border-gray-200"
                }`}
              >
                <span>{r.label}</span>
                {isSelected && <Check className="w-3.5 h-3.5 text-white shrink-0" />}
              </button>
            );
          })}
        </div>

        {/* Nhập khoảng giá tùy chỉnh */}
        <form
          onSubmit={handleApplyCustomPrice}
          className="pt-2 bg-gray-50/70 p-3 rounded-2xl border border-gray-100 space-y-2"
        >
          <div className="text-[11px] font-semibold text-gray-600">
            Hoặc tự nhập khoảng giá:
          </div>
          <div className="flex items-center gap-1.5">
            <input
              type="number"
              placeholder="Từ ₫"
              value={customMin}
              onChange={(e) => setCustomMin(e.target.value)}
              className="w-full h-8 px-2.5 rounded-lg bg-white border border-gray-200 text-xs placeholder:text-gray-400 focus:outline-none focus:border-[#800028]"
            />
            <span className="text-gray-400 text-xs">-</span>
            <input
              type="number"
              placeholder="Đến ₫"
              value={customMax}
              onChange={(e) => setCustomMax(e.target.value)}
              className="w-full h-8 px-2.5 rounded-lg bg-white border border-gray-200 text-xs placeholder:text-gray-400 focus:outline-none focus:border-[#800028]"
            />
          </div>
          <button
            type="submit"
            className="w-full h-8 rounded-lg bg-[#800028] hover:bg-[#5c001e] text-white font-bold text-xs transition-colors cursor-pointer"
          >
            Áp dụng giá
          </button>
        </form>
      </div>

      {/* ── 5. Bộ lọc Thương Hiệu ─────────────────────────────────── */}
      {availableFilters.brands.length > 0 && (
        <div className="space-y-2.5">
          <div className="font-bold text-gray-900 text-xs uppercase tracking-wider flex items-center gap-1.5">
            <Tag className="w-3.5 h-3.5 text-[#800028]" />
            <span>Thương hiệu</span>
          </div>

          {/* Ô tìm thương hiệu nhanh nếu có nhiều thương hiệu */}
          {availableFilters.brands.length > 5 && (
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={brandSearch}
                onChange={(e) => setBrandSearch(e.target.value)}
                placeholder="Tìm thương hiệu..."
                className="w-full h-8 pl-8 pr-2.5 rounded-xl bg-gray-50 border border-gray-200 text-xs focus:outline-none focus:border-[#800028] focus:bg-white"
              />
            </div>
          )}

          <div className="space-y-1 max-h-48 overflow-y-auto pr-1">
            {filteredBrands.map((brand) => {
              const isChecked = selectedBrands.includes(brand);
              return (
                <label
                  key={brand}
                  className={`flex items-center justify-between p-2 rounded-xl transition-colors cursor-pointer border ${
                    isChecked
                      ? "bg-rose-50/60 border-[#800028]/40 font-bold text-[#800028]"
                      : "bg-white border-transparent hover:bg-gray-50 text-gray-700"
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => handleToggleBrand(brand)}
                      className="w-4 h-4 rounded text-[#800028] focus:ring-[#800028] border-gray-300 cursor-pointer shrink-0"
                    />
                    <span className="truncate">{brand}</span>
                  </div>
                  {isChecked && <Check className="w-3.5 h-3.5 text-[#800028] shrink-0" />}
                </label>
              );
            })}
          </div>
        </div>
      )}

      {/* Nút hoàn tất trên Mobile */}
      {onApplyMobile && (
        <div className="pt-4 border-t border-gray-100">
          <button
            type="button"
            onClick={onApplyMobile}
            className="w-full h-11 rounded-2xl bg-[#800028] text-white font-bold text-sm shadow-md hover:bg-[#5c001e] transition-colors"
          >
            Xem kết quả
          </button>
        </div>
      )}
    </div>
  );
}
