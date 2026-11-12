"use client";

// ============================================================
// components/storefront/comparison/ComparisonSearchModal.tsx
// Modal Tìm Kiếm & Thêm Sản Phẩm Vào Bảng So Sánh (Phase 19)
// ============================================================

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Search, X, Plus, Check, Loader2 } from "lucide-react";
import { formatVND } from "@/lib/utils";
import { useComparisonStore, ComparisonStoreItem } from "@/store/comparison";

interface SearchProductItem {
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
  scope: string;
  costPerDay: number | null;
}

interface ComparisonSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ComparisonSearchModal: React.FC<ComparisonSearchModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState<SearchProductItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { items, addItem, hasItem } = useComparisonStore();

  useEffect(() => {
    if (!isOpen) return;

    let active = true;
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        const exclude = items.map((i) => i.id).join(",");
        const res = await fetch(
          `/api/comparison/search?q=${encodeURIComponent(
            searchTerm
          )}&exclude=${encodeURIComponent(exclude)}`
        );
        const json = await res.json();
        if (active && json.success) {
          setResults(json.products || []);
        }
      } catch (err) {
        console.error("Lỗi khi tìm sản phẩm so sánh:", err);
      } finally {
        if (active) setIsLoading(false);
      }
    };

    const timer = setTimeout(fetchProducts, 250);
    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [isOpen, searchTerm, items]);

  if (!isOpen) return null;

  const handleSelect = (p: SearchProductItem) => {
    const storeItem: ComparisonStoreItem = {
      id: p.id,
      name: p.name,
      slug: p.slug,
      brand: p.brand,
      origin: p.origin,
      categoryName: p.categoryName,
      categorySlug: p.categorySlug,
      price: p.price,
      originalPrice: p.originalPrice,
      image: p.image,
    };
    const res = addItem(storeItem);
    if (!res.success && res.message) {
      alert(res.message);
    } else {
      if (items.length + 1 >= 4) {
        onClose();
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in-0 duration-200">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/60">
          <div>
            <h3 className="font-extrabold text-sm sm:text-base text-slate-900">
              Thêm sản phẩm vào bảng so sánh
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Đang chọn {items.length}/4 sản phẩm
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Bar */}
        <div className="p-4 border-b border-slate-100">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Tìm theo tên sản phẩm, thương hiệu (Aptamil, Manuka, Blackmores...)"
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:border-[#800028] bg-slate-50/50"
              autoFocus
            />
          </div>
        </div>

        {/* Results List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {isLoading ? (
            <div className="py-12 flex flex-col items-center justify-center text-slate-400 gap-2">
              <Loader2 className="w-6 h-6 animate-spin text-[#800028]" />
              <span className="text-xs">Đang tìm kiếm sản phẩm...</span>
            </div>
          ) : results.length === 0 ? (
            <div className="py-12 text-center text-slate-400 space-y-1">
              <p className="text-sm font-bold text-slate-600">
                Không tìm thấy sản phẩm phù hợp
              </p>
              <p className="text-xs">
                Hãy thử tìm kiếm với từ khóa khác như &ldquo;Aptamil&rdquo;, &ldquo;Manuka&rdquo;, &ldquo;Dầu cá&rdquo;...
              </p>
            </div>
          ) : (
            results.map((prod) => {
              const selected = hasItem(prod.id);
              return (
                <div
                  key={prod.id}
                  className="p-2.5 rounded-2xl border border-slate-100 hover:border-slate-200 bg-white hover:bg-slate-50/60 flex items-center justify-between gap-3 transition-colors shadow-2xs"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-slate-100 shrink-0 border border-slate-100">
                      <Image
                        src={prod.image}
                        alt={prod.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-bold text-xs text-slate-900 line-clamp-1">
                        {prod.name}
                      </h4>
                      <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-0.5">
                        <span className="font-extrabold text-[#800028]">
                          {formatVND(prod.price)}
                        </span>
                        {prod.costPerDay && (
                          <span className="text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded font-medium">
                            ~{formatVND(prod.costPerDay)}/ngày
                          </span>
                        )}
                        <span>• {prod.categoryName}</span>
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleSelect(prod)}
                    disabled={selected}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 flex items-center gap-1 transition-all ${
                      selected
                        ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                        : "bg-[#800028] hover:bg-[#660020] text-white shadow-xs"
                    }`}
                  >
                    {selected ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Đã chọn</span>
                      </>
                    ) : (
                      <>
                        <Plus className="w-3.5 h-3.5" />
                        <span>Thêm</span>
                      </>
                    )}
                  </button>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-50 border-t border-slate-100 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-200/50"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};
