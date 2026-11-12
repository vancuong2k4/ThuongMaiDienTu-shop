"use client";

// ============================================================
// components/storefront/comparison/ComparisonButton.tsx
// Nút Bấm Thêm / Xóa Sản Phẩm Vào Danh Sách So Sánh (Phase 19)
// ============================================================

import React, { useState, useEffect } from "react";
import { Scale, Check } from "lucide-react";
import { useComparisonStore, ComparisonStoreItem } from "@/store/comparison";

interface ComparisonButtonProps {
  product: ComparisonStoreItem;
  className?: string;
  showText?: boolean;
}

export const ComparisonButton: React.FC<ComparisonButtonProps> = ({
  product,
  className = "",
  showText = false,
}) => {
  const [mounted, setMounted] = useState(false);
  const { addItem, removeItem, hasItem } = useComparisonStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <button
        type="button"
        disabled
        className={
          className ||
          "w-8 h-8 rounded-full bg-white/90 border border-slate-200 flex items-center justify-center text-slate-400"
        }
      >
        <Scale className="w-3.5 h-3.5" />
      </button>
    );
  }

  const isSelected = hasItem(product.id);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isSelected) {
      removeItem(product.id);
    } else {
      const res = addItem(product);
      if (!res.success && res.message) {
        alert(res.message);
      }
    }
  };

  if (showText) {
    return (
      <button
        type="button"
        onClick={handleClick}
        className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs transition-all ${
          isSelected
            ? "bg-[#800028] text-white shadow-xs"
            : "bg-slate-100 hover:bg-slate-200 text-slate-700"
        } ${className}`}
      >
        {isSelected ? (
          <>
            <Check className="w-4 h-4 text-emerald-300" />
            <span>Đã Thêm So Sánh</span>
          </>
        ) : (
          <>
            <Scale className="w-4 h-4 text-slate-600" />
            <span>So Sánh Chi Tiết</span>
          </>
        )}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      title={isSelected ? "Bỏ khỏi danh sách so sánh" : "Thêm vào danh sách so sánh"}
      aria-label={isSelected ? "Bỏ so sánh" : "Thêm so sánh"}
      className={`${
        isSelected
          ? "bg-[#800028] text-white shadow-md border border-[#800028]"
          : "bg-white/90 text-slate-600 hover:text-[#800028] hover:bg-white border border-slate-200"
      } ${className}`}
    >
      <Scale className="w-3.5 h-3.5 transition-transform active:scale-90" />
    </button>
  );
};
