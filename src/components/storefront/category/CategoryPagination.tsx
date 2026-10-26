"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface CategoryPaginationProps {
  currentPage: number;
  totalPages: number;
}

export function CategoryPagination({
  currentPage,
  totalPages,
}: CategoryPaginationProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  if (totalPages <= 1) return null;

  const navigateToPage = (page: number) => {
    if (page < 1 || page > totalPages || page === currentPage) return;
    const current = new URLSearchParams(Array.from(searchParams.entries()));
    current.set("page", String(page));
    router.push(`${pathname}?${current.toString()}`, { scroll: true });
  };

  // Tạo mảng số trang hiển thị (thông minh với ellipsis)
  const getPageNumbers = () => {
    const delta = 1;
    const range: number[] = [];
    for (
      let i = Math.max(2, currentPage - delta);
      i <= Math.min(totalPages - 1, currentPage + delta);
      i++
    ) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      range.unshift(-1); // Dấu ...
    }
    if (currentPage + delta < totalPages - 1) {
      range.push(-2); // Dấu ...
    }

    range.unshift(1);
    if (totalPages > 1) {
      range.push(totalPages);
    }

    return range;
  };

  const pages = getPageNumbers();

  return (
    <nav
      aria-label="Phân trang danh mục"
      className="flex items-center justify-center gap-1.5 pt-8 pb-4 text-xs select-none"
    >
      {/* Nút Trước */}
      <button
        type="button"
        onClick={() => navigateToPage(currentPage - 1)}
        disabled={currentPage <= 1}
        className={`h-9 px-3 rounded-xl border flex items-center gap-1 font-semibold transition-colors cursor-pointer ${
          currentPage <= 1
            ? "border-gray-200 text-gray-300 cursor-not-allowed bg-gray-50"
            : "border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50"
        }`}
        aria-label="Trang trước"
      >
        <ChevronLeft className="w-4 h-4" />
        <span className="hidden sm:inline">Trước</span>
      </button>

      {/* Các số trang */}
      <div className="flex items-center gap-1">
        {pages.map((p, idx) => {
          if (p < 0) {
            return (
              <span
                key={`ellipsis-${idx}`}
                className="w-9 h-9 flex items-center justify-center text-gray-400"
              >
                ...
              </span>
            );
          }

          const isActive = p === currentPage;
          return (
            <button
              key={p}
              type="button"
              onClick={() => navigateToPage(p)}
              className={`w-9 h-9 rounded-xl font-bold transition-all cursor-pointer ${
                isActive
                  ? "bg-[#800028] text-white shadow-xs"
                  : "bg-white border border-gray-200 text-gray-700 hover:border-gray-300 hover:bg-gray-50"
              }`}
              aria-current={isActive ? "page" : undefined}
            >
              {p}
            </button>
          );
        })}
      </div>

      {/* Nút Sau */}
      <button
        type="button"
        onClick={() => navigateToPage(currentPage + 1)}
        disabled={currentPage >= totalPages}
        className={`h-9 px-3 rounded-xl border flex items-center gap-1 font-semibold transition-colors cursor-pointer ${
          currentPage >= totalPages
            ? "border-gray-200 text-gray-300 cursor-not-allowed bg-gray-50"
            : "border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50"
        }`}
        aria-label="Trang sau"
      >
        <span className="hidden sm:inline">Sau</span>
        <ChevronRight className="w-4 h-4" />
      </button>
    </nav>
  );
}
