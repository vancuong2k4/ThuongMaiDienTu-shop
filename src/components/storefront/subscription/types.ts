// ============================================================
// components/storefront/subscription/types.ts
// Định nghĩa kiểu dữ liệu cho Giao Diện Quản Lý Gói Định Kỳ Storefront
// ============================================================

export type SubscriptionFrequencyType =
  | "EVERY_2_WEEKS"
  | "EVERY_1_MONTH"
  | "EVERY_2_MONTHS"
  | "EVERY_3_MONTHS";

export type SubscriptionStatusType =
  | "ACTIVE"
  | "PAUSED"
  | "CANCELLED"
  | "EXPIRED";

export interface StorefrontSubItem {
  id: string;
  variantId: string | null;
  productName: string;
  variantName: string;
  sku: string;
  originalPrice: number;
  price: number;
  quantity: number;
  image: string | null;
}

export interface StorefrontOrderBrief {
  id: string;
  orderNumber: string;
  total: number;
  status: string;
  createdAt: string;
}

export interface StorefrontSubscription {
  id: string;
  subscriptionNumber: string;
  frequency: SubscriptionFrequencyType;
  status: SubscriptionStatusType;
  discountPercent: number;
  startDate: string;
  nextDeliveryDate: string;
  lastDeliveryDate: string | null;
  totalCyclesDelivered: number;
  recipientName: string;
  recipientPhone: string;
  shippingAddress: string;
  paymentMethod: string;
  note: string | null;
  pausedAt: string | null;
  subtotalPerCycle: number;
  discountPerCycle: number;
  totalPerCycle: number;
  items: StorefrontSubItem[];
  recentOrders: StorefrontOrderBrief[];
  createdAt: string;
}

export interface StorefrontSubscriptionStats {
  totalSubscriptions: number;
  activeCount: number;
  earliestNextDelivery: string | null;
  totalSavedAmount: number;
}
