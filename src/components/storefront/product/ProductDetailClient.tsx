"use client";

import { useState } from "react";
import { ProductImageGallery } from "./ProductImageGallery";
import { ProductInfoSection, VariantData } from "./ProductInfoSection";
import { ProductTabs } from "./ProductTabs";
import { ProductReviewsSection, ReviewData } from "./ProductReviewsSection";
import { StickyMobileCartBar } from "./StickyMobileCartBar";
import { calcDiscount } from "@/lib/utils";

interface ProductDetailClientProps {
  product: {
    id: string;
    name: string;
    slug: string;
    brand: string | null;
    origin: string | null;
    specification: string | null;
    expiryInfo: string | null;
    shortDesc: string | null;
    description: string | null;
    category: {
      name: string;
      slug: string;
    };
    variants: VariantData[];
    images: Array<{ url: string; alt: string | null }>;
    reviews: ReviewData[];
    _count: {
      reviews: number;
    };
  };
}

export function ProductDetailClient({ product }: ProductDetailClientProps) {
  // Tìm biến thể mặc định hoặc biến thể đầu tiên
  const initialVariant =
    product.variants.find((v) => v.isDefault) || product.variants[0];

  const [selectedVariant, setSelectedVariant] =
    useState<VariantData>(initialVariant);

  // Ảnh hiển thị chính (ưu tiên ảnh biến thể, sau đó ảnh sản phẩm đầu tiên)
  const [activeImage, setActiveImage] = useState<string>(
    initialVariant?.image ||
      product.images[0]?.url ||
      "https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=600&q=80"
  );

  // Khi chọn biến thể: Cập nhật biến thể & tự động đổi ảnh chính sang ảnh riêng của biến thể đó
  const handleSelectVariant = (variant: VariantData) => {
    setSelectedVariant(variant);
    if (variant.image) {
      setActiveImage(variant.image);
    }
  };

  const discountPercent = selectedVariant.originalPrice
    ? calcDiscount(selectedVariant.originalPrice, selectedVariant.price)
    : 0;

  // Tính điểm đánh giá trung bình
  const reviewAverage =
    product.reviews.length > 0
      ? product.reviews.reduce((acc, r) => acc + r.rating, 0) /
        product.reviews.length
      : 5.0;

  return (
    <div className="space-y-8 lg:space-y-12">
      {/* ── 1. Top Section: Gallery (Left) & Info + Variant Selector (Right) ─ */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 xl:gap-12 items-start">
        {/* Gallery Cột Trái (5/12 cols) */}
        <div className="lg:col-span-5 lg:sticky lg:top-24">
          <ProductImageGallery
            images={product.images}
            productName={product.name}
            origin={product.origin}
            discountPercent={discountPercent}
            activeImage={activeImage}
            onSelectImage={setActiveImage}
          />
        </div>

        {/* Thông tin & Bộ chọn biến thể Cột Phải (7/12 cols) */}
        <div className="lg:col-span-7">
          <ProductInfoSection
            product={product}
            selectedVariant={selectedVariant}
            onSelectVariant={handleSelectVariant}
            reviewAverage={reviewAverage}
          />
        </div>
      </div>

      {/* ── 2. Middle Section: Product Tabs (Mô tả, Thông số, Vận chuyển) ── */}
      <ProductTabs product={product} />

      {/* ── 3. Bottom Section: Customer Reviews ─────────────────────────── */}
      <ProductReviewsSection
        productId={product.id}
        productName={product.name}
        reviews={product.reviews}
      />

      {/* ── 4. Mobile Sticky Buy Bar khi cuộn trang ─────────────────────── */}
      <StickyMobileCartBar
        productId={product.id}
        productName={product.name}
        selectedVariant={selectedVariant}
        activeImage={activeImage}
      />
    </div>
  );
}
