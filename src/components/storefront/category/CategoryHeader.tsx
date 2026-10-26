import Link from "next/link";
import { ShieldCheck, Plane, RotateCcw } from "lucide-react";

interface SubCategoryItem {
  id: string;
  name: string;
  slug: string;
}

interface CategoryHeaderProps {
  category: {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    parent?: {
      name: string;
      slug: string;
    } | null;
  };
  subcategories: SubCategoryItem[];
  activeSubcategorySlug?: string;
  totalProducts: number;
}

export function CategoryHeader({
  category,
  subcategories,
  activeSubcategorySlug,
  totalProducts,
}: CategoryHeaderProps) {
  const isParent = !category.parent;

  return (
    <div className="bg-gradient-to-b from-rose-50/50 via-white to-white rounded-3xl border border-rose-100/70 p-5 sm:p-7 mb-6 shadow-2xs">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Tiêu đề & Mô tả */}
        <div className="space-y-1.5 max-w-2xl">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-[#800028] text-white text-[10px] font-bold uppercase tracking-wider">
              {isParent ? "Ngành Hàng Chính" : "Chuyên Mục"}
            </span>
            <span className="text-xs text-gray-500 font-medium">
              {totalProducts} sản phẩm chính hãng
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-gray-900 tracking-tight leading-tight">
            {category.name}
          </h1>

          {category.description && (
            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed line-clamp-2 pt-0.5">
              {category.description}
            </p>
          )}
        </div>

        {/* 3 Cam kết nhanh dành riêng cho danh mục */}
        <div className="flex flex-wrap md:flex-col gap-2 shrink-0 text-[11px] text-gray-700 font-medium">
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-gray-200/80 shadow-2xs">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span>100% Nhập khẩu chính ngạch</span>
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-gray-200/80 shadow-2xs">
            <Plane className="w-3.5 h-3.5 text-blue-600 shrink-0" />
            <span>Vận chuyển Air Cargo tiêu chuẩn</span>
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-gray-200/80 shadow-2xs">
            <RotateCcw className="w-3.5 h-3.5 text-[#800028] shrink-0" />
            <span>Đổi trả 7 ngày linh hoạt</span>
          </div>
        </div>
      </div>

      {/* Subcategory Pills (Thanh chọn nhanh danh mục con) */}
      {subcategories.length > 0 && (
        <div className="mt-5 pt-4 border-t border-rose-100/60">
          <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">
            Chuyên mục trực thuộc:
          </div>
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide pb-1">
            {/* Pill Tất cả */}
            <Link
              href={isParent ? `/danh-muc/${category.slug}` : `/danh-muc/${category.parent?.slug}`}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 border ${
                !activeSubcategorySlug
                  ? "bg-[#800028] text-white border-[#800028] shadow-xs"
                  : "bg-white text-gray-700 border-gray-200 hover:border-gray-300 hover:bg-gray-50"
              }`}
            >
              Tất cả {category.parent?.name || category.name}
            </Link>

            {/* Danh sách các subcategory */}
            {subcategories.map((sub) => {
              const isActive = activeSubcategorySlug === sub.slug;
              return (
                <Link
                  key={sub.id}
                  href={`/danh-muc/${sub.slug}`}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 border ${
                    isActive
                      ? "bg-[#800028] text-white border-[#800028] shadow-xs"
                      : "bg-white text-gray-700 border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  {sub.name}
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
