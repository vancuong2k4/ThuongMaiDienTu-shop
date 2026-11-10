"use client";

// ============================================================
// components/storefront/blog/BlogListClient.tsx
// Danh Sách Bài Viết Cẩm Nang Có Bộ Lọc & Phân Trang Tương Tác
// ============================================================

import React, { useState, useMemo } from "react";
import { BlogCategoryFilter } from "./BlogCategoryFilter";
import { BlogCard } from "./BlogCard";
import type { StorefrontBlogPost, CategoryCount } from "./types";
import {
  ChevronLeft,
  ChevronRight,
  SlidersHorizontal,
  SearchX,
  BookOpen,
} from "lucide-react";

interface BlogListClientProps {
  initialPosts: StorefrontBlogPost[];
  categories: CategoryCount[];
}

const ITEMS_PER_PAGE = 9;

export const BlogListClient: React.FC<BlogListClientProps> = ({
  initialPosts,
  categories,
}) => {
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<"newest" | "views">("newest");
  const [currentPage, setCurrentPage] = useState(1);

  // Filter & Sort
  const filteredPosts = useMemo(() => {
    let result = [...initialPosts];

    // Filter by Category
    if (selectedCategory !== "ALL") {
      result = result.filter((post) => post.category === selectedCategory);
    }

    // Filter by Search
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      result = result.filter(
        (post) =>
          post.title.toLowerCase().includes(q) ||
          post.excerpt?.toLowerCase().includes(q) ||
          post.seoKeywords?.toLowerCase().includes(q)
      );
    }

    // Sort
    result.sort((a, b) => {
      if (sortBy === "views") {
        return b.viewCount - a.viewCount;
      }
      // default: newest
      const dateA = new Date(a.publishedAt || a.createdAt).getTime();
      const dateB = new Date(b.publishedAt || b.createdAt).getTime();
      return dateB - dateA;
    });

    return result;
  }, [initialPosts, selectedCategory, search, sortBy]);

  // Pagination calculation
  const totalItems = filteredPosts.length;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE) || 1;
  const paginatedPosts = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredPosts.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredPosts, currentPage]);

  const handleSelectCategory = (cat: string) => {
    setSelectedCategory(cat);
    setCurrentPage(1);
  };

  const handleSearchChange = (query: string) => {
    setSearch(query);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    const element = document.getElementById("blog-listing-anchor");
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div id="blog-listing-anchor" className="space-y-6">
      {/* Category Tabs & Quick Search */}
      <BlogCategoryFilter
        categories={categories}
        totalAll={initialPosts.length}
        selectedCategory={selectedCategory}
        onSelectCategory={handleSelectCategory}
        search={search}
        onSearchChange={handleSearchChange}
      />

      {/* Header Bar: Match count & Sort selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200/80 text-xs text-slate-500">
        <div>
          Tìm thấy{" "}
          <strong className="text-slate-900 font-bold">{totalItems}</strong> bài
          viết
          {selectedCategory !== "ALL" && (
            <span>
              {" "}
              trong chuyên mục{" "}
              <strong className="text-[#800028]">{selectedCategory}</strong>
            </span>
          )}
          {search && (
            <span>
              {" "}
              phù hợp với từ khóa &quot;
              <strong className="text-slate-900">{search}</strong>&quot;
            </span>
          )}
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400" />
          <span className="font-medium">Sắp xếp:</span>
          <select
            value={sortBy}
            onChange={(e) =>
              setSortBy(e.target.value as "newest" | "views")
            }
            className="px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-[#800028]/20 focus:border-[#800028]"
          >
            <option value="newest">Mới nhất trước</option>
            <option value="views">Được đọc nhiều nhất</option>
          </select>
        </div>
      </div>

      {/* Articles Grid */}
      {paginatedPosts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {paginatedPosts.map((post) => (
            <BlogCard key={post.id} post={post} />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="py-16 text-center bg-white rounded-3xl border border-slate-200/80 p-8 space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-rose-50 text-[#800028] mx-auto flex items-center justify-center">
            <SearchX className="w-7 h-7" />
          </div>
          <div className="space-y-1">
            <h4 className="text-base font-bold text-slate-900">
              Không tìm thấy bài viết phù hợp
            </h4>
            <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
              Hãy thử tìm kiếm với từ khóa khác hoặc bấm nút bên dưới để xem toàn bộ cẩm nang sức khỏe.
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              setSelectedCategory("ALL");
              setSearch("");
              setCurrentPage(1);
            }}
            className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-[#800028] hover:bg-[#60001e] transition-all shadow-md shadow-[#800028]/20"
          >
            Xem tất cả bài viết
          </button>
        </div>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="pt-8 flex items-center justify-center gap-2">
          <button
            type="button"
            disabled={currentPage <= 1}
            onClick={() => handlePageChange(currentPage - 1)}
            className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:hover:bg-transparent transition-all"
            aria-label="Trang trước"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => {
            const isActive = p === currentPage;
            return (
              <button
                key={p}
                type="button"
                onClick={() => handlePageChange(p)}
                className={`w-9 h-9 rounded-xl text-xs font-bold transition-all ${
                  isActive
                    ? "bg-[#800028] text-white shadow-md shadow-[#800028]/20"
                    : "border border-slate-200 text-slate-700 hover:bg-slate-100"
                }`}
              >
                {p}
              </button>
            );
          })}

          <button
            type="button"
            disabled={currentPage >= totalPages}
            onClick={() => handlePageChange(currentPage + 1)}
            className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:hover:bg-transparent transition-all"
            aria-label="Trang tiếp"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};
