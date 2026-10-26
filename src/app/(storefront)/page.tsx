import { prisma } from "@/lib/prisma";
import { HeroBannerCarousel } from "@/components/storefront/home/HeroBannerCarousel";
import { FlashSaleSection } from "@/components/storefront/home/FlashSaleSection";
import { CategoryProductSection } from "@/components/storefront/home/CategoryProductSection";
import { BrandCommitmentSection } from "@/components/storefront/home/BrandCommitmentSection";
import type { ProductCardData } from "@/components/storefront/product/ProductCard";

export const revalidate = 60; // ISR cache 60s để tối ưu tốc độ tải trang dưới 2s

export default async function StorefrontHomePage() {
  const now = new Date();

  // 1. Lấy phiên Flash Sale đang hoạt động kèm sản phẩm
  const activeFlashSale = await prisma.flashSale.findFirst({
    where: {
      isActive: true,
      endTime: { gt: now },
    },
    include: {
      items: {
        include: {
          product: {
            select: {
              id: true,
              name: true,
              slug: true,
              origin: true,
            },
          },
          variant: {
            select: {
              id: true,
              name: true,
              sku: true,
              price: true,
              originalPrice: true,
              stock: true,
              image: true,
            },
          },
        },
      },
    },
    orderBy: { startTime: "desc" },
  });

  // 2. Lấy 5 ngành hàng chính kèm danh mục con
  const parentCategories = await prisma.category.findMany({
    where: {
      parentId: null,
      isActive: true,
    },
    include: {
      children: {
        where: { isActive: true },
        orderBy: { sortOrder: "asc" },
      },
    },
    orderBy: { sortOrder: "asc" },
  });

  // Lấy sản phẩm cho từng ngành hàng (bao gồm sản phẩm thuộc danh mục cha & toàn bộ danh mục con)
  const categoriesWithProducts = await Promise.all(
    parentCategories.map(async (cat) => {
      const scopeCategoryIds = [cat.id, ...cat.children.map((c) => c.id)];

      const products = await prisma.product.findMany({
        where: {
          categoryId: { in: scopeCategoryIds },
          isActive: true,
        },
        take: 8,
        include: {
          category: {
            select: {
              name: true,
              slug: true,
            },
          },
          variants: {
            where: { isActive: true },
            orderBy: { sortOrder: "asc" },
          },
          images: {
            orderBy: { sortOrder: "asc" },
            take: 2,
          },
        },
        orderBy: [{ isFeatured: "desc" }, { createdAt: "desc" }],
      });

      return {
        ...cat,
        products,
      };
    })
  );

  // 3. Serialize Decimal sang number thuần (tránh lỗi React 19 RSC serialization)
  const serializedFlashSaleItems = activeFlashSale
    ? activeFlashSale.items.map((item) => ({
        id: item.id,
        salePrice: Number(item.salePrice),
        quantity: item.quantity,
        soldCount: item.soldCount,
        product: item.product,
        variant: {
          id: item.variant.id,
          name: item.variant.name,
          sku: item.variant.sku,
          price: Number(item.variant.price),
          originalPrice: item.variant.originalPrice
            ? Number(item.variant.originalPrice)
            : null,
          stock: item.variant.stock,
          image: item.variant.image,
        },
      }))
    : [];

  const serializedCategories = categoriesWithProducts.map((cat) => ({
    id: cat.id,
    name: cat.name,
    slug: cat.slug,
    description: cat.description,
    children: cat.children,
    products: cat.products.map((p) => ({
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
    })),
  }));

  // Icon và màu sắc cho từng ngành hàng
  const categoryMeta: Record<string, { icon: string; accentColor: string }> = {
    "thuc-pham-chuc-nang": { icon: "💊", accentColor: "#800028" },
    "thuc-pham-do-uong-nhap-khau": { icon: "🍪", accentColor: "#d97706" },
    "trai-cay-nhap-khau": { icon: "🍒", accentColor: "#e11d48" },
    "my-pham-cham-soc-ca-nhan": { icon: "💄", accentColor: "#db2777" },
    "me-va-be": { icon: "🍼", accentColor: "#0284c7" },
  };

  return (
    <div className="pb-12">
      {/* ── 1. Hero Banner Carousel Slider ─────────────────────────── */}
      <HeroBannerCarousel />

      {/* ── 2. Flash Sale Section (Đếm ngược thời gian thực) ──────── */}
      {activeFlashSale && serializedFlashSaleItems.length > 0 && (
        <FlashSaleSection
          endTime={activeFlashSale.endTime.toISOString()}
          items={serializedFlashSaleItems}
        />
      )}

      {/* ── 3. Khối sản phẩm theo từng ngành hàng ─────────────────── */}
      <div className="space-y-4">
        {serializedCategories.map((cat) => {
          const meta = categoryMeta[cat.slug] || {
            icon: "🛍️",
            accentColor: "#800028",
          };

          return (
            <CategoryProductSection
              key={cat.id}
              title={cat.name}
              slug={cat.slug}
              description={cat.description || undefined}
              icon={meta.icon}
              accentColor={meta.accentColor}
              subcategories={cat.children}
              products={cat.products as unknown as ProductCardData[]}
            />
          );
        })}
      </div>

      {/* ── 4. Khối Cam kết thương hiệu & Trụ cột giá trị ──────────── */}
      <BrandCommitmentSection />
    </div>
  );
}
