// ============================================================
// components/admin/flash-sale/types.ts
// Định nghĩa kiểu dữ liệu cho giao diện Quản Lý Flash Sale Admin CMS
// ============================================================

export interface FlashSaleCampaignItem {
  id: string;
  name: string;
  description: string | null;
  bannerImage: string | null;
  startTime: string;
  endTime: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  status: "ACTIVE" | "UPCOMING" | "ENDED";
  itemCount: number;
  totalQuantity: number;
  totalSold: number;
  revenue: number;
  soldPercentage: number;
}

export interface FlashSaleDealProduct {
  id: string;
  name: string;
  slug: string;
  brand: string | null;
  origin: string | null;
  imageUrl: string | null;
}

export interface FlashSaleDealVariant {
  id: string;
  name: string;
  sku: string;
  regularPrice: number;
  originalPrice: number | null;
  stock: number;
}

export interface FlashSaleDealItem {
  id: string;
  flashSaleId: string;
  productId: string;
  variantId: string;
  salePrice: number;
  quantity: number;
  soldCount: number;
  limitPerUser: number;
  product: FlashSaleDealProduct;
  variant: FlashSaleDealVariant;
  soldPercentage: number;
}

export interface FlashSaleStatsData {
  total: number;
  active: number;
  upcoming: number;
  ended: number;
  totalSold: number;
  totalRevenue: number;
  averageSoldRate: number;
}
