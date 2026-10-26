"use client";

import { useEffect } from "react";
import { X, Filter } from "lucide-react";
import { AvailableFilters, FilterContent } from "./FilterContent";

interface CategoryFilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  availableFilters: AvailableFilters;
}

export function CategoryFilterDrawer({
  isOpen,
  onClose,
  availableFilters,
}: CategoryFilterDrawerProps) {
  // Chặn scroll body khi drawer mở
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden flex justify-end">
      {/* Backdrop mờ */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        aria-hidden="true"
      />

      {/* Sheet Drawer trượt từ phải sang */}
      <div className="relative w-full max-w-xs sm:max-w-sm bg-white h-full shadow-2xl flex flex-col z-10 animate-in slide-in-from-right duration-300">
        {/* Header Drawer */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 bg-gray-50/70">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-[#800028]" />
            <h3 className="font-black text-gray-900 text-sm uppercase tracking-wide">
              Bộ Lọc Sản Phẩm
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-200/80 hover:bg-gray-300 text-gray-600 flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Đóng bộ lọc"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Nội dung bộ lọc */}
        <div className="flex-1 overflow-y-auto p-5 scrollbar-hide">
          <FilterContent
            availableFilters={availableFilters}
            onApplyMobile={onClose}
          />
        </div>
      </div>
    </div>
  );
}
