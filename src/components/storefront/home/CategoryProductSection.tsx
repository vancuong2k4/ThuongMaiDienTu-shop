import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ProductCard, ProductCardData } from "../product/ProductCard";

interface CategoryProductSectionProps {
  title: string;
  slug: string;
  description?: string;
  icon?: string;
  accentColor?: string;
  subcategories?: Array<{
    id: string;
    name: string;
    slug: string;
  }>;
  products: ProductCardData[];
  totalProducts?: number;
}

export function CategoryProductSection({
  title,
  slug,
  description,
  icon = "🛍️",
  accentColor = "#800028",
  subcategories = [],
  products,
  totalProducts,
}: CategoryProductSectionProps) {
  if (!products || products.length === 0) return null;

  return (
    <section className="py-8 sm:py-10 border-b border-gray-100 last:border-none">
      <div className="shop-container">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6 pb-4 border-b border-gray-100">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-2xl" role="img" aria-label={title}>
                {icon}
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">
                {title}
              </h2>
            </div>
            {description && (
              <p className="text-xs sm:text-sm text-gray-500 max-w-xl">
                {description}
              </p>
            )}
          </div>

          {/* Subcategory Pills & View All */}
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide pb-1">
            {subcategories.slice(0, 4).map((sub) => (
              <Link
                key={sub.id}
                href={`/danh-muc/${sub.slug}`}
                className="px-3 py-1.5 rounded-full bg-gray-50 hover:bg-[#fff0f3] text-gray-600 hover:text-[#800028] text-xs font-semibold whitespace-nowrap transition-colors border border-gray-100"
              >
                {sub.name}
              </Link>
            ))}

            <Link
              href={`/danh-muc/${slug}`}
              className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-full bg-[#800028] hover:bg-[#5c001e] text-white text-xs font-bold whitespace-nowrap transition-colors shadow-sm ml-1"
            >
              <span>Xem tất cả</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Product Grid (Tối đa 8 sản phẩm = đúng 2 hàng 4 cột) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* Nút Xem thêm khi tổng số sản phẩm trong ngành hàng nhiều hơn số hiển thị trên trang chủ */}
        {totalProducts && totalProducts > products.length && (
          <div className="mt-8 text-center">
            <Link
              href={`/danh-muc/${slug}`}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-white hover:bg-rose-50 text-[#800028] font-bold text-xs sm:text-sm border border-rose-200 hover:border-[#800028] shadow-2xs transition-all hover:scale-[1.02] cursor-pointer"
            >
              <span>Xem thêm {totalProducts - products.length} sản phẩm {title} khác</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
