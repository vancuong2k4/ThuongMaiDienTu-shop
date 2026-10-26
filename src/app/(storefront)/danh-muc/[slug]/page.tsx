import { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { CategoryBreadcrumbs, BreadcrumbItem } from "@/components/storefront/category/CategoryBreadcrumbs";
import { CategoryHeader } from "@/components/storefront/category/CategoryHeader";
import { CategoryPageClient } from "@/components/storefront/category/CategoryPageClient";
import { PRICE_RANGES } from "@/components/storefront/category/FilterContent";

interface PageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{
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

// ── 1. Dynamic SEO Metadata ─────────────────────────────────────────────────
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;

  const category = await prisma.category.findUnique({
    where: { slug },
    select: {
      name: true,
      description: true,
      seoTitle: true,
      seoDesc: true,
    },
  });

  if (!category) {
    return {
      title: "Không tìm thấy danh mục | THUYNGA Shop",
    };
  }

  const siteName = process.env.NEXT_PUBLIC_SITE_NAME || "THUYNGA Shop";
  const title = category.seoTitle || `${category.name} – Nhập Khẩu Chính Hãng | ${siteName}`;
  const description =
    category.seoDesc ||
    category.description ||
    `Khám phá các sản phẩm ${category.name} nhập khẩu chính ngạch 100%, bảo quản Air Cargo và date mới nhất tại ${siteName}.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      url: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/danh-muc/${slug}`,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

// ── 2. Server Component Page ────────────────────────────────────────────────
export default async function CategoryPage({ params, searchParams }: PageProps) {
  const { slug } = await params;
  const sParams = await searchParams;

  // Lấy thông tin danh mục kèm quan hệ cha - con
  const category = await prisma.category.findUnique({
    where: { slug },
    include: {
      parent: {
        select: { id: true, name: true, slug: true },
      },
      children: {
        where: { isActive: true },
        select: { id: true, name: true, slug: true },
        orderBy: { sortOrder: "asc" },
      },
    },
  });

  if (!category || !category.isActive) {
    notFound();
  }

  // Xác định phạm vi danh mục để lấy sản phẩm
  // Nếu là danh mục cha: Lấy sản phẩm của cha + tất cả danh mục con
  // Nếu là danh mục con: Lấy sản phẩm của danh mục con này
  const isParent = !category.parentId;
  let categoryScopeIds: string[] = [];
  let subcategoriesToDisplay: Array<{ id: string; name: string; slug: string }> = [];

  if (isParent) {
    categoryScopeIds = [category.id, ...category.children.map((c) => c.id)];
    subcategoriesToDisplay = category.children;
  } else {
    categoryScopeIds = [category.id];
    // Lấy các danh mục anh em cùng cha để hiện ở header
    if (category.parentId) {
      subcategoriesToDisplay = await prisma.category.findMany({
        where: { parentId: category.parentId, isActive: true },
        select: { id: true, name: true, slug: true },
        orderBy: { sortOrder: "asc" },
      });
    }
  }

  // Lấy các giá trị bộ lọc khả dụng (Available Filter Options)
  const [originsRaw, brandsRaw] = await Promise.all([
    prisma.product.findMany({
      where: {
        categoryId: { in: categoryScopeIds },
        isActive: true,
        origin: { not: null },
      },
      select: { origin: true },
      distinct: ["origin"],
    }),
    prisma.product.findMany({
      where: {
        categoryId: { in: categoryScopeIds },
        isActive: true,
        brand: { not: null },
      },
      select: { brand: true },
      distinct: ["brand"],
    }),
  ]);

  const availableOrigins = originsRaw
    .map((o) => o.origin)
    .filter((o): o is string => Boolean(o));

  const availableBrands = brandsRaw
    .map((b) => b.brand)
    .filter((b): b is string => Boolean(b));

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

  // Xây dựng điều kiện lọc Prisma WhereInput
  const whereClause: Prisma.ProductWhereInput = {
    categoryId: { in: categoryScopeIds },
    isActive: true,
  };

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

  // Xử lý lọc khoảng giá
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

  if (sort === "newest") {
    orderBy = [{ createdAt: "desc" }];
  } else if (sort === "bestseller") {
    orderBy = [{ createdAt: "desc" }];
  }

  // Truy vấn sản phẩm và tổng số lượng
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

  // Sắp xếp theo giá (vì giá nằm ở bảng Variant nên sort mượt ở application layer)
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

  // Cắt trang (Pagination slice)
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

  // Xây dựng Breadcrumb items
  const breadcrumbItems: BreadcrumbItem[] = [];
  if (category.parent) {
    breadcrumbItems.push({
      name: category.parent.name,
      url: `/danh-muc/${category.parent.slug}`,
    });
  }
  breadcrumbItems.push({
    name: category.name,
    url: `/danh-muc/${category.slug}`,
  });

  // Schema.org CollectionPage JSON-LD
  const collectionJsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: category.name,
    description: category.description || `Danh mục ${category.name}`,
    url: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/danh-muc/${category.slug}`,
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: totalCount,
      itemListElement: serializedProducts.map((p, index) => ({
        "@type": "ListItem",
        position: (currentPage - 1) * pageSize + index + 1,
        url: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/san-pham/${p.slug}`,
        name: p.name,
      })),
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionJsonLd) }}
      />

      <div className="bg-gray-50/50 min-h-screen pb-16">
        <div className="shop-container py-2">
          {/* Breadcrumbs điều hướng */}
          <CategoryBreadcrumbs items={breadcrumbItems} />

          {/* Category Header Banner & Quick Subcategory Pills */}
          <CategoryHeader
            category={{
              id: category.id,
              name: category.name,
              slug: category.slug,
              description: category.description,
              parent: category.parent,
            }}
            subcategories={subcategoriesToDisplay}
            activeSubcategorySlug={isParent ? undefined : category.slug}
            totalProducts={totalCount}
          />

          {/* Client Interactive Area (Toolbar + Sidebar + Grid + Drawer + Pagination) */}
          <CategoryPageClient
            products={serializedProducts}
            totalCount={totalCount}
            currentPage={currentPage}
            totalPages={totalPages}
            currentSort={sort}
            availableFilters={{
              origins: availableOrigins,
              brands: availableBrands,
              subcategories: subcategoriesToDisplay,
            }}
          />
        </div>
      </div>
    </>
  );
}
