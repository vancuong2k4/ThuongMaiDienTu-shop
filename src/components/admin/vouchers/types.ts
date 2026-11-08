// ============================================================
// components/admin/vouchers/types.ts
// Định nghĩa kiểu dữ liệu cho phân hệ Quản Lý Voucher
// ============================================================

export type VoucherType = "PERCENTAGE" | "FIXED" | "FREE_SHIP";

export type VoucherLifecycleStatus =
  | "ACTIVE"
  | "UPCOMING"
  | "EXPIRED"
  | "DEPLETED"
  | "DISABLED";

export interface VoucherItem {
  id: string;
  code: string;
  type: VoucherType;
  value: number;
  minOrderAmount: number | null;
  maxDiscount: number | null;
  usageLimit: number | null;
  usedCount: number;
  userLimit: number;
  startDate: string;
  endDate: string;
  isActive: boolean;
  createdAt: string;
  orderCount: number;
  lifecycleStatus: VoucherLifecycleStatus;
}

export interface VoucherStatsData {
  total: number;
  active: number;
  upcoming: number;
  expired: number;
  totalUsed: number;
  totalDiscountGiven: number;
}

export interface VoucherRecentOrder {
  id: string;
  orderNumber: string;
  recipientName: string;
  recipientPhone: string;
  total: number;
  discountAmount: number;
  orderStatus: string;
  paymentStatus: string;
  createdAt: string;
}

export interface VoucherDetailData extends VoucherItem {
  recentOrders: VoucherRecentOrder[];
}
