// ============================================================
// components/storefront/flash-sale/types.ts
// Định nghĩa kiểu dữ liệu cho giao diện Săn Deal Flash Sale Storefront
// ============================================================

export interface StorefrontFlashSaleDeal {
  id: string;
  flashSaleId: string;
  productId: string;
  variantId: string;
  salePrice: number;
  regularPrice: number;
  originalPrice: number | null;
  discountPercent: number;
  quantity: number;
  soldCount: number;
  soldPercentage: number;
  limitPerUser: number;
  product: {
    id: string;
    name: string;
    slug: string;
    brand: string | null;
    origin: string | null;
    categoryName: string;
  };
  variant: {
    id: string;
    name: string;
    sku: string;
    stock: number;
    image: string | null;
  };
  imageUrl: string | null;
}

export interface StorefrontFlashSaleCampaign {
  id: string;
  name: string;
  description: string | null;
  bannerImage: string | null;
  startTime: string;
  endTime: string;
  status: "ACTIVE" | "UPCOMING" | "ENDED";
  deals: StorefrontFlashSaleDeal[];
}
