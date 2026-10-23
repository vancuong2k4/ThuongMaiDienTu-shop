// ============================================================
// types/index.ts – Shared TypeScript Types cho THUYNGA Shop
// ============================================================

import type { Prisma } from "@prisma/client";

// ============================================================
// PRODUCT TYPES
// ============================================================

/** Sản phẩm đầy đủ thông tin cho trang chi tiết */
export type ProductWithDetails = Prisma.ProductGetPayload<{
  include: {
    category: { include: { parent: true } };
    variants: { orderBy: { sortOrder: "asc" } };
    images: { orderBy: { sortOrder: "asc" } };
    reviews: {
      where: { status: "APPROVED" };
      include: { user: { select: { name: true; avatar: true } } };
    };
    tags: { include: { tag: true } };
    _count: { select: { reviews: true } };
  };
}>;

/** Sản phẩm dạng card cho listing */
export type ProductCard = Prisma.ProductGetPayload<{
  include: {
    variants: {
      where: { isDefault: true; isActive: true };
      take: 1;
    };
    images: {
      orderBy: { sortOrder: "asc" };
      take: 1;
    };
    _count: { select: { reviews: true } };
  };
}>;

/** Biến thể sản phẩm */
export type VariantWithProduct = Prisma.ProductVariantGetPayload<{
  include: {
    product: {
      select: { name: true; slug: true; origin: true; expiryInfo: true };
    };
  };
}>;

// ============================================================
// CART TYPES
// ============================================================

/** Item trong giỏ hàng (với đầy đủ info để render) */
export type CartItemWithVariant = Prisma.CartItemGetPayload<{
  include: {
    variant: {
      include: {
        product: {
          select: {
            name: true;
            slug: true;
            images: { orderBy: { sortOrder: "asc" }; take: 1 };
          };
        };
      };
    };
  };
}>;

/** State giỏ hàng phía client (Zustand) */
export interface CartState {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
  isLoading: boolean;
}

export interface CartItem {
  variantId: string;
  productId: string;
  productName: string;
  variantName: string;
  sku: string;
  price: number;
  image: string | null;
  quantity: number;
  stock: number; // Để kiểm tra giới hạn tồn kho
}

// ============================================================
// ORDER TYPES
// ============================================================

/** Tạo đơn hàng mới */
export interface CreateOrderInput {
  items: Array<{
    variantId: string;
    quantity: number;
  }>;
  recipientName: string;
  recipientPhone: string;
  shippingAddress: {
    province: string;
    district: string;
    ward: string;
    street: string;
  };
  paymentMethod: "COD" | "VIETQR";
  voucherCode?: string;
  note?: string;
  userId?: string;
}

/** Kết quả tính toán đơn hàng */
export interface OrderCalculation {
  subtotal: number;
  shippingFee: number;
  discountAmount: number;
  total: number;
  appliedVoucher?: {
    code: string;
    type: string;
    discountAmount: number;
  };
}

// ============================================================
// FLASH SALE TYPES
// ============================================================

export type FlashSaleWithItems = Prisma.FlashSaleGetPayload<{
  include: {
    items: {
      include: {
        product: {
          select: {
            name: true;
            slug: true;
            images: { orderBy: { sortOrder: "asc" }; take: 1 };
          };
        };
        variant: {
          select: { name: true; price: true; stock: true };
        };
      };
    };
  };
}>;

// ============================================================
// API RESPONSE TYPES
// ============================================================

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// ============================================================
// FILTER / SORT TYPES (cho trang listing)
// ============================================================

export interface ProductFilters {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  brands?: string[];
  origins?: string[];
  rating?: number;
  inStock?: boolean;
}

export type ProductSortOption =
  | "newest"
  | "price_asc"
  | "price_desc"
  | "best_selling"
  | "rating";

// ============================================================
// SITE SETTINGS TYPES
// ============================================================

export interface HomepageBanner {
  id: string;
  image: string;
  mobileImage?: string;
  title?: string;
  subtitle?: string;
  link?: string;
  isActive: boolean;
}

export interface SiteConfig {
  siteName: string;
  logo: string;
  favicon: string;
  phone: string;
  email: string;
  address: string;
  facebookUrl?: string;
  zaloUrl?: string;
  seoTitle: string;
  seoDescription: string;
  seoKeywords: string;
}
