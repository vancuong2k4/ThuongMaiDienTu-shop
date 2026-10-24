import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { ProductDetailClient } from "@/components/storefront/product/ProductDetailClient";
import { ProductCard, ProductCardData } from "@/components/storefront/product/ProductCard";
import { ChevronRight, Home, ShieldCheck, ArrowRight } from "lucide-react";

export const revalidate = 60; // Tự động làm mới cache mỗi 60s (ISR)

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

// ── 1. SEO Metadata Generator (Chuẩn SEO On-page) ──────────────────────
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;

  const product = await prisma.product.findUnique({
    where: { slug },
    include: {
      category: true,
      variants: { where: { isDefault: true }, take: 1 },
      images: { take: 1 },
    },
  });

  if (!product || !product.isActive) {
    return {
      title: "Không tìm thấy sản phẩm | THUYNGA Shop",
    };
  }

  const defaultPrice = product.variants[0]?.price
    ? Number(product.variants[0].price)
    : 0;

  const title = product.seoTitle || `${product.name} | THUYNGA Shop`;
  const description =
    product.seoDesc ||
    product.shortDesc ||
    `Mua ngay ${product.name} chính hãng nhập khẩu tại THUYNGA Shop. Xuất xứ: ${product.origin || "Chính hãng"}, Quy cách: ${product.specification || "Tiêu chuẩn"}. Cam kết hoàn tiền 200% nếu phát hiện hàng giả.`;

  const ogImage =
    product.images[0]?.url ||
    product.variants[0]?.image ||
    "https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=800&q=80";

  return {
    title,
    description,
    keywords: [
      product.name,
      product.category.name,
      product.brand || "hàng nhập khẩu",
      `xuất xứ ${product.origin}`,
      "thuynga shop",
    ],
    openGraph: {
      title,
      description,
      images: [{ url: ogImage, width: 800, height: 800, alt: product.name }],
      type: "website",
    },
  };
}

// ── 2. Main Product Detail Page Component ─────────────────────────────
export default async function ProductDetailPage({ params }: PageProps) {
  const { slug } = await params;

  // Truy vấn sản phẩm đầy đủ thông tin từ PostgreSQL
  const product = await prisma.product.findUnique({
    where: { slug },
    include: {
      category: {
        include: {
          parent: true,
        },
      },
      variants: {
        where: { isActive: true },
        orderBy: [{ isDefault: "desc" }, { sortOrder: "asc" }],
      },
      images: {
        orderBy: { sortOrder: "asc" },
      },
      reviews: {
        where: { status: "APPROVED" },
        include: {
          user: {
            select: {
              name: true,
              avatar: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
      },
      _count: {
        select: { reviews: true },
      },
    },
  });

  if (!product || !product.isActive) {
    notFound();
  }

  // Truy vấn sản phẩm liên quan trong cùng ngành hàng (lấy 4 sản phẩm)
  const relatedProducts = await prisma.product.findMany({
    where: {
      categoryId: product.categoryId,
      id: { not: product.id },
      isActive: true,
    },
    take: 4,
    include: {
      category: { select: { name: true, slug: true } },
      variants: { where: { isActive: true }, orderBy: { sortOrder: "asc" } },
      images: { orderBy: { sortOrder: "asc" }, take: 2 },
    },
    orderBy: { createdAt: "desc" },
  });

  // Serialize Prisma Decimal objects sang số thuần để truyền an toàn xuống Client Component
  const serializedProduct = {
    id: product.id,
    name: product.name,
    slug: product.slug,
    brand: product.brand,
    origin: product.origin,
    specification: product.specification,
    expiryInfo: product.expiryInfo,
    shortDesc: product.shortDesc,
    description: product.description,
    category: {
      name: product.category.name,
      slug: product.category.slug,
    },
    variants: product.variants.map((v) => ({
      id: v.id,
      name: v.name,
      sku: v.sku,
      price: Number(v.price),
      originalPrice: v.originalPrice ? Number(v.originalPrice) : null,
      stock: v.stock,
      image: v.image,
      isDefault: v.isDefault,
    })),
    images: product.images.map((img) => ({
      url: img.url,
      alt: img.alt,
    })),
    reviews: product.reviews.map((r) => ({
      id: r.id,
      rating: r.rating,
      content: r.content,
      images: r.images,
      createdAt: r.createdAt.toISOString(),
      user: r.user,
    })),
    _count: product._count,
  };

  const serializedRelated = relatedProducts.map((p) => ({
    id: p.id,
    name: p.name,
    slug: p.slug,
    brand: p.brand,
    origin: p.origin,
    specification: p.specification,
    expiryInfo: p.expiryInfo,
    category: p.category,
    images: p.images,
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
  }));

  // Schema.org Structured Data (Google Rich Snippets SEO)
  const defaultVariant =
    serializedProduct.variants.find((v) => v.isDefault) ||
    serializedProduct.variants[0];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    image: serializedProduct.images[0]?.url || defaultVariant?.image,
    description: product.shortDesc || product.name,
    sku: defaultVariant?.sku,
    brand: {
      "@type": "Brand",
      name: product.brand || "THUYNGA Shop",
    },
    offers: {
      "@type": "Offer",
      url: `https://thuyngashop.com.vn/san-pham/${product.slug}`,
      priceCurrency: "VND",
      price: defaultVariant?.price,
      availability:
        defaultVariant && defaultVariant.stock > 0
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
      seller: {
        "@type": "Organization",
        name: "THUYNGA Shop",
      },
    },
  };

  return (
    <div className="py-4 sm:py-6 lg:py-8">
      {/* Schema.org Structured Data Script */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="shop-container space-y-6 sm:space-y-8">
        {/* ── Breadcrumbs ────────────────────────────────────────── */}
        <nav
          className="flex items-center gap-1.5 text-xs text-gray-500 overflow-x-auto scrollbar-hide py-1"
          aria-label="Breadcrumb"
        >
          <Link
            href="/"
            className="flex items-center gap-1 hover:text-[#800028] transition-colors"
          >
            <Home className="w-3.5 h-3.5" />
            <span>Trang chủ</span>
          </Link>

          <ChevronRight className="w-3 h-3 text-gray-300 shrink-0" />

          {product.category.parent && (
            <>
              <Link
                href={`/danh-muc/${product.category.parent.slug}`}
                className="hover:text-[#800028] transition-colors whitespace-nowrap"
              >
                {product.category.parent.name}
              </Link>
              <ChevronRight className="w-3 h-3 text-gray-300 shrink-0" />
            </>
          )}

          <Link
            href={`/danh-muc/${product.category.slug}`}
            className="hover:text-[#800028] transition-colors whitespace-nowrap"
          >
            {product.category.name}
          </Link>

          <ChevronRight className="w-3 h-3 text-gray-300 shrink-0" />

          <span className="text-gray-900 font-semibold truncate max-w-[200px] sm:max-w-md">
            {product.name}
          </span>
        </nav>

        {/* ── Client Product Detail Interactive Component ────────── */}
        <ProductDetailClient product={serializedProduct} />

        {/* ── Related Products (Sản phẩm cùng ngành hàng) ─────────── */}
        {serializedRelated.length > 0 && (
          <section className="pt-8 border-t border-gray-100 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg sm:text-xl font-black text-gray-900 tracking-tight">
                  Sản phẩm cùng ngành hàng
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  Khám phá thêm các mặt hàng tương tự trong danh mục {product.category.name}
                </p>
              </div>

              <Link
                href={`/danh-muc/${product.category.slug}`}
                className="text-xs font-bold text-[#800028] hover:underline flex items-center gap-1"
              >
                <span>Xem thêm</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
              {serializedRelated.map((rel) => (
                <ProductCard
                  key={rel.id}
                  product={rel as unknown as ProductCardData}
                />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
