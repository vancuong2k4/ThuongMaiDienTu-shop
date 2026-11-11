// ============================================================
// components/admin/subscription/types.ts
// Định nghĩa kiểu dữ liệu cho giao diện Quản Trị Gói Định Kỳ Admin CMS
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

export interface SubscriptionItemData {
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

export interface AdminSubscriptionItem {
  id: string;
  subscriptionNumber: string;
  user: {
    id: string;
    name: string;
    email: string | null;
    phone: string | null;
    avatar: string | null;
    membershipTier?: "BRONZE" | "SILVER" | "GOLD" | "DIAMOND";
  };
  frequency: SubscriptionFrequencyType;
  status: SubscriptionStatusType;
  discountPercent: number;
  startDate: string;
  nextDeliveryDate: string;
  lastDeliveryDate: string | null;
  totalCyclesDelivered: number;
  ordersCount: number;
  recipientName: string;
  recipientPhone: string;
  shippingAddress: string;
  paymentMethod: string;
  note: string | null;
  cycleTotal: number;
  cycleOriginal: number;
  items: SubscriptionItemData[];
  createdAt: string;
}

export interface SubscriptionStatsData {
  totalSubscriptions: number;
  activeCount: number;
  pausedCount: number;
  estimatedMRR: number;
  totalOrdersGenerated: number;
}

export interface SubscriptionPaginationData {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}
