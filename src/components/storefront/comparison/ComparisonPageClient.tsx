"use client";

// ============================================================
// components/storefront/comparison/ComparisonPageClient.tsx
// Trình Quản Lý & Điều Phối Trang So Sánh Sản Phẩm Client-side (Phase 19)
// ============================================================

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Scale,
  Plus,
  Trash2,
  Share2,
  ArrowRight,
  Loader2,
  Check,
  Stethoscope,
} from "lucide-react";
import { useComparisonStore } from "@/store/comparison";
import {
  ComparisonMatrixProduct,
  ComparisonMatrixRow,
  ComparisonAnalysisResult,
} from "@/lib/comparison";
import { ComparisonMatrixTable } from "./ComparisonMatrixTable";
import { ComparisonSynergyCard } from "./ComparisonSynergyCard";
import { ComparisonSearchModal } from "./ComparisonSearchModal";

interface ComparisonPageClientProps {
  initialPresetIds?: string[];
}

export const ComparisonPageClient: React.FC<ComparisonPageClientProps> = ({
  initialPresetIds = [],
}) => {
  const [mounted, setMounted] = useState(false);
  const { items, removeItem, clear, addItem } = useComparisonStore();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  // Data states
  const [matrixProducts, setMatrixProducts] = useState<ComparisonMatrixProduct[]>([]);
  const [matrixRows, setMatrixRows] = useState<ComparisonMatrixRow[]>([]);
  const [synergyAnalysis, setSynergyAnalysis] =
    useState<ComparisonAnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Fetch comparison dataset & synergy whenever items change
  useEffect(() => {
    if (!mounted) return;

    const currentIds = items.map((i) => i.id);

    if (currentIds.length === 0) {
      setMatrixProducts([]);
      setMatrixRows([]);
      setSynergyAnalysis(null);
      return;
    }

    let active = true;
    setIsLoading(true);

    const loadData = async () => {
      try {
        const idsParam = currentIds.join(",");
        // 1. Fetch products & matrix rows
        const res = await fetch(`/api/comparison/products?ids=${idsParam}`);
        const json = await res.json();

        if (active && json.success) {
          setMatrixProducts(json.data.products || []);
          setMatrixRows(json.data.matrixRows || []);
        }

        // 2. If >= 2 products, fetch synergy analysis
        if (currentIds.length >= 2) {
          const synRes = await fetch("/api/comparison/analyze", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ productIds: currentIds }),
          });
          const synJson = await synRes.json();
          if (active && synJson.success) {
            setSynergyAnalysis(synJson.data);
          }
        } else {
          if (active) setSynergyAnalysis(null);
        }
      } catch (err) {
        console.error("Lỗi khi tải bảng so sánh:", err);
      } finally {
        if (active) setIsLoading(false);
      }
    };

    loadData();

    return () => {
      active = false;
    };
  }, [mounted, items]);

  const handleShare = () => {
    if (typeof window !== "undefined") {
      const idsParam = items.map((i) => i.id).join(",");
      const url = `${window.location.origin}/so-sanh?ids=${idsParam}`;
      navigator.clipboard.writeText(url);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    }
  };

  const loadPresetPair = async (slugs: string[]) => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/comparison/search?q=`);
      const json = await res.json();
      if (json.success && json.products) {
        clear();
        const matched = json.products.filter((p: any) =>
          slugs.includes(p.slug)
        );
        matched.forEach((p: any) => {
          addItem({
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
          });
        });
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  if (!mounted) {
    return (
      <div className="py-24 text-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#800028] mx-auto mb-2" />
        <span className="text-xs text-slate-400">Đang khởi tạo bảng so sánh...</span>
      </div>
    );
  }

  // ── Empty State ─────────────────────────────────────────────
  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto py-12 px-4 space-y-8">
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200/90 shadow-sm text-center space-y-4">
          <div className="w-16 h-16 rounded-3xl bg-slate-100 text-[#800028] mx-auto flex items-center justify-center">
            <Scale className="w-8 h-8" />
          </div>

          <div className="space-y-1.5 max-w-md mx-auto">
            <h2 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
              Chưa có sản phẩm nào trong danh sách so sánh
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
              Quý khách có thể bấm vào biểu tượng cán cân trên các thẻ sản phẩm hoặc chọn một trong các bộ đôi so sánh tiêu biểu dưới đây:
            </p>
          </div>

          <div className="pt-2">
            <button
              type="button"
              onClick={() => setIsSearchOpen(true)}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-[#800028] hover:bg-[#660020] text-white font-extrabold text-xs shadow-md transition-all active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>Chọn Sản Phẩm So Sánh Ngay</span>
            </button>
          </div>
        </div>

        {/* Suggested Comparison Presets */}
        <div className="space-y-3">
          <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 text-center">
            Gợi ý các bộ đôi so sánh đối chiếu chuẩn Úc phổ biến:
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Preset 1 */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200 hover:border-[#800028]/40 shadow-2xs space-y-2 flex flex-col justify-between transition-all">
              <div>
                <span className="text-[10px] font-black text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded uppercase">
                  Sữa Công Thức Úc
                </span>
                <h4 className="font-extrabold text-xs text-slate-900 mt-1">
                  Aptamil Profutura vs A2 Platinum Úc
                </h4>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Đối chiếu hệ men Synbiotics độc quyền vs 100% Đạm thuần A2 êm bụng.
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  loadPresetPair([
                    "sua-bot-aptamil-profutura-uc-lon-900g",
                    "sua-bot-a2-platinum-premium-uc-lon-900g",
                  ])
                }
                className="w-full py-2 rounded-xl bg-slate-100 hover:bg-rose-50 hover:text-[#800028] text-slate-700 font-bold text-xs transition-colors flex items-center justify-center gap-1"
              >
                <span>Xem So Sánh Này</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Preset 2 */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200 hover:border-[#800028]/40 shadow-2xs space-y-2 flex flex-col justify-between transition-all">
              <div>
                <span className="text-[10px] font-black text-amber-800 bg-amber-50 px-2 py-0.5 rounded uppercase">
                  Hiệp Đồng Vi Chất
                </span>
                <h4 className="font-extrabold text-xs text-slate-900 mt-1">
                  Dầu Cá Blackmores & Vitamin D3 K2
                </h4>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Phân tích tác dụng hiệp đồng Omega-3 DHA/EPA và vi chất D3+K2 MK7.
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  loadPresetPair([
                    "vien-uong-dau-ca-omega-3-blackmores-uc-400-vien",
                    "vitamin-d3-k2-mk7-sunday-natural-duc-20ml",
                  ])
                }
                className="w-full py-2 rounded-xl bg-slate-100 hover:bg-rose-50 hover:text-[#800028] text-slate-700 font-bold text-xs transition-colors flex items-center justify-center gap-1"
              >
                <span>Xem So Sánh Này</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Preset 3 */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200 hover:border-[#800028]/40 shadow-2xs space-y-2 flex flex-col justify-between transition-all">
              <div>
                <span className="text-[10px] font-black text-purple-800 bg-purple-50 px-2 py-0.5 rounded uppercase">
                  Vi Chất Mẹ Bầu
                </span>
                <h4 className="font-extrabold text-xs text-slate-900 mt-1">
                  Elevit Bayer Úc & Sữa Bột Aptamil
                </h4>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Kiểm tra chỉ định giãn cách Canxi và Sắt hữu cơ để tối đa hấp thu.
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  loadPresetPair([
                    "vien-uong-elevit-cho-ba-bau-bayer-uc-100-vien",
                    "sua-bot-aptamil-profutura-uc-lon-900g",
                  ])
                }
                className="w-full py-2 rounded-xl bg-slate-100 hover:bg-rose-50 hover:text-[#800028] text-slate-700 font-bold text-xs transition-colors flex items-center justify-center gap-1"
              >
                <span>Xem So Sánh Này</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        <ComparisonSearchModal
          isOpen={isSearchOpen}
          onClose={() => setIsSearchOpen(false)}
        />
      </div>
    );
  }

  // ── Active Comparison View ──────────────────────────────────
  return (
    <div className="space-y-6 sm:space-y-8 font-sans">
      {/* ── Top Action Toolbar ─────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 sm:p-5 rounded-3xl border border-slate-200 shadow-2xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-slate-900 text-white flex items-center justify-center">
            <Scale className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <h3 className="font-black text-sm sm:text-base text-slate-900">
              Đối Chiếu Thông Số & Vi Chất ({items.length}/4)
            </h3>
            <p className="text-xs text-slate-500">
              So sánh bảng dinh dưỡng, chi phí ngày dùng và ý kiến Dược sĩ
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {items.length < 4 && (
            <button
              type="button"
              onClick={() => setIsSearchOpen(true)}
              className="px-3.5 py-2 rounded-xl bg-[#800028] hover:bg-[#660020] text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition-all"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Thêm Sản Phẩm ({items.length + 1}/4)</span>
            </button>
          )}

          <button
            type="button"
            onClick={handleShare}
            className="p-2 sm:px-3 sm:py-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-bold flex items-center gap-1.5 transition-colors"
            title="Sao chép link so sánh"
          >
            {copySuccess ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span className="hidden sm:inline text-emerald-700">Đã chép link!</span>
              </>
            ) : (
              <>
                <Share2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Chia sẻ link</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={clear}
            className="p-2 sm:px-3 sm:py-2 rounded-xl border border-slate-200 text-slate-500 hover:text-rose-600 hover:bg-rose-50 text-xs font-bold flex items-center gap-1.5 transition-colors"
            title="Xóa tất cả sản phẩm khỏi so sánh"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Xóa hết</span>
          </button>
        </div>
      </div>

      {/* ── Matrix Table Component ─────────────────────────────── */}
      {isLoading && matrixProducts.length === 0 ? (
        <div className="py-20 text-center bg-white rounded-3xl border border-slate-200">
          <Loader2 className="w-8 h-8 animate-spin text-[#800028] mx-auto mb-2" />
          <span className="text-xs text-slate-500">Đang tổng hợp dữ liệu ma trận so sánh...</span>
        </div>
      ) : (
        <ComparisonMatrixTable
          products={matrixProducts}
          matrixRows={matrixRows}
          onRemoveProduct={removeItem}
          onOpenSearch={() => setIsSearchOpen(true)}
        />
      )}

      {/* ── Pharmacist Synergy Card ────────────────────────────── */}
      <ComparisonSynergyCard
        analysis={synergyAnalysis}
        isLoading={isLoading && !synergyAnalysis}
      />

      {/* Search Modal */}
      <ComparisonSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />
    </div>
  );
};
