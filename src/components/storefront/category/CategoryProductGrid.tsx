"use client";

import { PackageX, RotateCcw } from "lucide-react";
import { ProductCard, ProductCardData } from "@/components/storefront/product/ProductCard";
import { useRouter, usePathname, useSearchParams } from "next/navigation";

interface CategoryProductGridProps {
  products: ProductCardData[];
}

export function CategoryProductGrid({ products }: CategoryProductGridProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handleResetFilters = () => {
    const current = new URLSearchParams(Array.from(searchParams.entries()));
    const sortVal = current.get("sort");
    const cleanParams = new URLSearchParams();
    if (sortVal) cleanParams.set("sort", sortVal);
    const query = cleanParams.toString() ? `?${cleanParams.toString()}` : "";
    router.push(`${pathname}${query}`, { scroll: false });
  };

  if (products.length === 0) {
    return (
      <div className="bg-white rounded-3xl border border-gray-100 p-10 sm:p-14 text-center space-y-4 shadow-2xs">
        <div className="w-16 h-16 rounded-full bg-rose-50 text-[#800028] mx-auto flex items-center justify-center">
          <PackageX className="w-8 h-8" />
        </div>
        <div className="space-y-1.5 max-w-md mx-auto">
          <h3 className="text-base sm:text-lg font-bold text-gray-900">
            Không tìm thấy sản phẩm phù hợp
          </h3>
          <p className="text-xs text-gray-500 leading-relaxed">
            Rất tiếc, hiện tại không có sản phẩm nào thỏa mãn toàn bộ tiêu chí lọc bạn đã chọn. Vui lòng thử nới lỏng hoặc xóa bớt bộ lọc.
          </p>
        </div>
        <div className="pt-2">
          <button
            type="button"
            onClick={handleResetFilters}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#800028] hover:bg-[#5c001e] text-white text-xs font-bold shadow-md transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Xóa bộ lọc để xem tất cả</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-5">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
