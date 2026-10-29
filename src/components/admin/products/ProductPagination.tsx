"use client";

// ============================================================
// components/admin/products/ProductPagination.tsx
// Phân trang danh sách sản phẩm Admin CMS
// ============================================================

import React, { useTransition } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface ProductPaginationProps {
  page: number;
  totalPages: number;
  total: number;
  limit: number;
}

export const ProductPagination: React.FC<ProductPaginationProps> = ({
  page,
  totalPages,
  total,
  limit,
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages || newPage === page) return;
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(newPage));
    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`);
    });
  };

  const handleLimitChange = (newLimit: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("limit", String(newLimit));
    params.set("page", "1");
    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`);
    });
  };

  if (total === 0) return null;

  const startItem = (page - 1) * limit + 1;
  const endItem = Math.min(page * limit, total);

  // Tính danh sách các trang cần hiển thị (tối đa 5 nút)
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (page <= 3) {
        pages.push(1, 2, 3, 4, "...", totalPages);
      } else if (page >= totalPages - 2) {
        pages.push(1, "...", totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, "...", page - 1, page, page + 1, "...", totalPages);
      }
    }
    return pages;
  };

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-3 px-2 text-xs text-slate-500">
      {/* Thông tin số lượng */}
      <div className="flex items-center gap-2">
        <span>
          Hiển thị <strong>{startItem}</strong> - <strong>{endItem}</strong> trong tổng số{" "}
          <strong>{total}</strong> sản phẩm
        </span>

        <span className="hidden sm:inline text-slate-300">|</span>

        {/* Lựa chọn số mục mỗi trang */}
        <div className="hidden sm:flex items-center gap-1.5">
          <span>Xem</span>
          <select
            value={limit}
            onChange={(e) => handleLimitChange(Number(e.target.value))}
            className="py-1 px-2 rounded-lg border border-slate-200 bg-white text-xs font-semibold text-slate-700"
          >
            <option value="10">10</option>
            <option value="20">20</option>
            <option value="50">50</option>
          </select>
          <span>mục / trang</span>
        </div>
      </div>

      {/* Điều hướng trang */}
      <div className="flex items-center gap-1 self-center sm:self-auto">
        <button
          type="button"
          onClick={() => handlePageChange(page - 1)}
          disabled={page <= 1 || isPending}
          className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:hover:bg-transparent transition-colors"
          title="Trang trước"
          aria-label="Trang trước"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {getPageNumbers().map((p, idx) => {
          if (p === "...") {
            return (
              <span key={`dots-${idx}`} className="px-2 py-1 text-slate-400">
                ...
              </span>
            );
          }
          const isCurrent = p === page;
          return (
            <button
              key={`page-${p}`}
              type="button"
              onClick={() => handlePageChange(Number(p))}
              disabled={isPending}
              className={`w-8 h-8 rounded-lg font-bold text-xs transition-colors ${
                isCurrent
                  ? "bg-wine-800 text-white shadow-xs"
                  : "text-slate-700 hover:bg-slate-100 border border-slate-200"
              }`}
            >
              {p}
            </button>
          );
        })}

        <button
          type="button"
          onClick={() => handlePageChange(page + 1)}
          disabled={page >= totalPages || isPending}
          className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:hover:bg-transparent transition-colors"
          title="Trang tiếp theo"
          aria-label="Trang tiếp theo"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
