"use client";

import { useState } from "react";
import { CategoryToolbar } from "./CategoryToolbar";
import { CategoryFilterSidebar } from "./CategoryFilterSidebar";
import { CategoryFilterDrawer } from "./CategoryFilterDrawer";
import { CategoryProductGrid } from "./CategoryProductGrid";
import { CategoryPagination } from "./CategoryPagination";
import { AvailableFilters } from "./FilterContent";
import { ProductCardData } from "@/components/storefront/product/ProductCard";

interface CategoryPageClientProps {
  products: ProductCardData[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
  currentSort: string;
  availableFilters: AvailableFilters;
}

export function CategoryPageClient({
  products,
  totalCount,
  currentPage,
  totalPages,
  currentSort,
  availableFilters,
}: CategoryPageClientProps) {
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  return (
    <div>
      {/* Thanh Toolbar điều khiển phía trên danh sách */}
      <CategoryToolbar
        totalCount={totalCount}
        currentSort={currentSort}
        onOpenMobileFilter={() => setIsMobileFilterOpen(true)}
      />

      {/* Bố cục chính: Cột trái (Bộ lọc Sidebar Desktop) + Cột phải (Lưới sản phẩm) */}
      <div className="flex items-start gap-6 lg:gap-8">
        {/* Sidebar lọc trên Desktop */}
        <CategoryFilterSidebar availableFilters={availableFilters} />

        {/* Lưới sản phẩm & Phân trang */}
        <div className="flex-1 min-w-0">
          <CategoryProductGrid products={products} />

          <CategoryPagination
            currentPage={currentPage}
            totalPages={totalPages}
          />
        </div>
      </div>

      {/* Drawer lọc trượt trên Mobile */}
      <CategoryFilterDrawer
        isOpen={isMobileFilterOpen}
        onClose={() => setIsMobileFilterOpen(false)}
        availableFilters={availableFilters}
      />
    </div>
  );
}
