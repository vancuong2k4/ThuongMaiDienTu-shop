import { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { CategoryBreadcrumbs } from "@/components/storefront/category/CategoryBreadcrumbs";
import { CategoryPageClient } from "@/components/storefront/category/CategoryPageClient";
import { PRICE_RANGES } from "@/components/storefront/category/constants";
import { Search, ShieldCheck } from "lucide-react";

interface PageProps {
  searchParams: Promise<{
    search?: string;
    q?: string;
    sort?: string;
    origin?: string;
    brand?: string;
    price?: string;
    minPrice?: string;
    maxPrice?: string;
    inStock?: string;
    onSale?: string;
    page?: string;
  }>;
}

export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
  const sParams = await searchParams;
  const searchTerm = sParams.search || sParams.q || "";
  const siteName = process.env.NEXT_PUBLIC_SITE_NAME || "THUYNGA Shop";

  if (searchTerm) {
    return {
      title: `Tìm kiếm: "${searchTerm}" | ${siteName}`,
      description: `Kết quả tìm kiếm cho từ khóa "${searchTerm}" tại ${siteName} – Hàng nhập khẩu chính hãng.`,
    };
  }

  return {
    title: `Tất Cả Sản Phẩm Nhập Khẩu Chính Hãng | ${siteName}`,
    description: `Danh sách đầy đủ các sản phẩm thực phẩm chức năng, thực phẩm đồ uống, trái cây Air Cargo và mỹ phẩm chính ngạch tại ${siteName}.`,
  };
}

export default async function AllProductsPage({ searchParams }: PageProps) {
  const sParams = await searchParams;
  const searchTerm = (sParams.search || sParams.q || "").trim();

  // Parse các bộ lọc từ searchParams
  const sort = sParams.sort || "featured";
  const selectedOrigins = sParams.origin
    ? sParams.origin.split(",").filter(Boolean)
    : [];
  const selectedBrands = sParams.brand
    ? sParams.brand.split(",").filter(Boolean)
    : [];
  const priceRangeId = sParams.price || "";
  const minPrice = sParams.minPrice ? Number(sParams.minPrice) : undefined;
  const maxPrice = sParams.maxPrice ? Number(sParams.maxPrice) : undefined;
  const inStock = sParams.inStock === "true";
  const onSale = sParams.onSale === "true";
  const currentPage = Math.max(1, Number(sParams.page) || 1);
  const pageSize = 12;

  // Lấy các giá trị bộ lọc khả dụng toàn hệ thống
  const [originsRaw, brandsRaw, allSubcategories] = await Promise.all([
    prisma.product.findMany({
      where: { isActive: true, origin: { not: null } },
      select: { origin: true },
      distinct: ["origin"],
    }),
    prisma.product.findMany({
      where: { isActive: true, brand: { not: null } },
      select: { brand: true },
      distinct: ["brand"],
    }),
    prisma.category.findMany({
      where: { parentId: null, isActive: true },
      select: { id: true, name: true, slug: true },
      orderBy: { sortOrder: "asc" },
    }),
  ]);

  const availableOrigins = originsRaw
    .map((o) => o.origin)
    .filter((o): o is string => Boolean(o));

  const availableBrands = brandsRaw
    .map((b) => b.brand)
    .filter((b): b is string => Boolean(b));

  // Xây dựng điều kiện lọc Prisma WhereInput
  const whereClause: Prisma.ProductWhereInput = {
    isActive: true,
  };

  // Tìm kiếm theo từ khóa (hỗ trợ cả có dấu và không dấu qua slug)
  if (searchTerm) {
    const slugKeyword = searchTerm
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/đ/g, "d")
      .replace(/Đ/g, "D")
      .trim()
      .replace(/\s+/g, "-");

    whereClause.OR = [
      { name: { contains: searchTerm, mode: "insensitive" } },
      { brand: { contains: searchTerm, mode: "insensitive" } },
      { shortDesc: { contains: searchTerm, mode: "insensitive" } },
      { origin: { contains: searchTerm, mode: "insensitive" } },
      { slug: { contains: slugKeyword, mode: "insensitive" } },
    ];
  }

  if (selectedOrigins.length > 0) {
    whereClause.origin = { in: selectedOrigins };
  }

  if (selectedBrands.length > 0) {
    whereClause.brand = { in: selectedBrands };
  }

  if (inStock) {
    whereClause.variants = {
      some: { stock: { gt: 0 }, isActive: true },
    };
  }

  if (onSale) {
    whereClause.variants = {
      some: { originalPrice: { gt: 0 }, isActive: true },
    };
  }

  // Lọc khoảng giá
  let resolvedMin: number | undefined = minPrice;
  let resolvedMax: number | undefined = maxPrice;

  if (priceRangeId) {
    const matchedRange = PRICE_RANGES.find((p) => p.id === priceRangeId);
    if (matchedRange) {
      resolvedMin = matchedRange.min !== undefined ? matchedRange.min : undefined;
      resolvedMax = matchedRange.max !== null ? matchedRange.max : undefined;
    }
  }

  if (resolvedMin !== undefined || resolvedMax !== undefined) {
    const priceFilter: Prisma.DecimalFilter = {};
    if (resolvedMin !== undefined) priceFilter.gte = new Prisma.Decimal(resolvedMin);
    if (resolvedMax !== undefined) priceFilter.lte = new Prisma.Decimal(resolvedMax);

    whereClause.variants = {
      ...(whereClause.variants || {}),
      some: {
        price: priceFilter,
        isActive: true,
      },
    };
  }

  // Sắp xếp
  let orderBy: Prisma.ProductOrderByWithRelationInput[] = [
    { isFeatured: "desc" },
    { createdAt: "desc" },
  ];

  if (sort === "newest" || sort === "bestseller") {
    orderBy = [{ createdAt: "desc" }];
  }

  // Truy vấn sản phẩm
  const [totalCount, rawProducts] = await Promise.all([
    prisma.product.count({ where: whereClause }),
    prisma.product.findMany({
      where: whereClause,
      include: {
        category: {
          select: { name: true, slug: true },
        },
        variants: {
          where: { isActive: true },
          select: {
            id: true,
            name: true,
            sku: true,
            price: true,
            originalPrice: true,
            stock: true,
            image: true,
            isDefault: true,
          },
          orderBy: { sortOrder: "asc" },
        },
        images: {
          select: { url: true, alt: true },
          orderBy: { sortOrder: "asc" },
        },
      },
      orderBy,
    }),
  ]);

  // Sắp xếp theo giá
  let sortedProducts = rawProducts;
  if (sort === "price_asc") {
    sortedProducts = [...rawProducts].sort((a, b) => {
      const priceA = Number(a.variants.find((v) => v.isDefault)?.price || a.variants[0]?.price || 0);
      const priceB = Number(b.variants.find((v) => v.isDefault)?.price || b.variants[0]?.price || 0);
      return priceA - priceB;
    });
  } else if (sort === "price_desc") {
    sortedProducts = [...rawProducts].sort((a, b) => {
      const priceA = Number(a.variants.find((v) => v.isDefault)?.price || a.variants[0]?.price || 0);
      const priceB = Number(b.variants.find((v) => v.isDefault)?.price || b.variants[0]?.price || 0);
      return priceB - priceA;
    });
  }

  // Cắt trang
  const totalPages = Math.ceil(totalCount / pageSize);
  const paginatedProducts = sortedProducts.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  // Serialize Prisma Decimal fields sang number cho React 19 RSC
  const serializedProducts = paginatedProducts.map((p) => ({
    id: p.id,
    name: p.name,
    slug: p.slug,
    brand: p.brand,
    origin: p.origin,
    specification: p.specification,
    expiryInfo: p.expiryInfo,
    category: p.category,
    variants: p.variants.map((v) => ({
      id: v.id,
      name: v.name,
      sku: v.sku,
      price: Number(v.price),
      originalPrice: v.originalPrice ? Number(v.originalPrice) : null,
      stock: v.stock,
      image: v.image,
      isDefault: v.isDefault,
    })),
    images: p.images,
  }));

  const breadcrumbItems = searchTerm
    ? [
        { name: "Tất cả sản phẩm", url: "/san-pham" },
        { name: `Tìm kiếm: "${searchTerm}"`, url: `/san-pham?search=${encodeURIComponent(searchTerm)}` },
      ]
    : [{ name: "Tất cả sản phẩm", url: "/san-pham" }];

  return (
    <div className="bg-gray-50/50 min-h-screen pb-16">
      <div className="shop-container py-2">
        {/* Breadcrumbs */}
        <CategoryBreadcrumbs items={breadcrumbItems} />

        {/* Header Banner */}
        <div className="bg-gradient-to-b from-rose-50/50 via-white to-white rounded-3xl border border-rose-100/70 p-5 sm:p-7 mb-6 shadow-2xs">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1.5 max-w-2xl">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-[#800028] text-white text-[10px] font-bold uppercase tracking-wider">
                  {searchTerm ? "Kết Quả Tìm Kiếm" : "Kho Hàng Nhập Khẩu"}
                </span>
                <span className="text-xs text-gray-500 font-medium">
                  {totalCount} sản phẩm sẵn có
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-gray-900 tracking-tight leading-tight">
                {searchTerm ? `Kết quả cho "${searchTerm}"` : "Tất Cả Sản Phẩm Chính Hãng"}
              </h1>

              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                {searchTerm
                  ? `Tìm thấy ${totalCount} sản phẩm phù hợp với từ khóa "${searchTerm}".`
                  : "Khám phá trọn bộ các dòng thực phẩm chức năng, bánh kẹo cao cấp, trái cây bay Air Cargo, dược mỹ phẩm và dinh dưỡng mẹ & bé nhập khẩu chính ngạch 100%."}
              </p>
            </div>

            <div className="flex items-center gap-2 text-xs text-emerald-700 font-bold bg-emerald-50 px-3.5 py-2 rounded-2xl border border-emerald-100 shrink-0">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Cam kết hoàn tiền 200% nếu hàng giả</span>
            </div>
          </div>
        </div>

        {/* Client Interactive Area */}
        <CategoryPageClient
          products={serializedProducts}
          totalCount={totalCount}
          currentPage={currentPage}
          totalPages={totalPages}
          currentSort={sort}
          availableFilters={{
            origins: availableOrigins,
            brands: availableBrands,
            subcategories: allSubcategories,
          }}
        />
      </div>
    </div>
  );
}
