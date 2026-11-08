// ============================================================
// components/admin/customers/types.ts
// Định nghĩa kiểu dữ liệu phân hệ Quản Lý Khách Hàng (Module 6.7)
// ============================================================

export type CustomerTier = "VIP" | "REGULAR" | "NEW";

export interface CustomerListItem {
  id: string;
  name: string | null;
  email: string;
  phone: string | null;
  avatar: string | null;
  role: "ADMIN" | "CUSTOMER";
  isActive: boolean;
  createdAt: string;
  totalOrders: number;
  totalSpent: number;
  lastOrderAt: string | null;
  reviewCount: number;
  tier: CustomerTier;
}

export interface CustomerStatsData {
  totalCustomers: number;
  activeCustomers: number;
  vipCustomers: number;
  totalSpentAll: number;
}

export interface CustomerAddress {
  id: string;
  fullName: string;
  phone: string;
  province: string;
  district: string;
  ward: string;
  street: string;
  isDefault: boolean;
}

export interface CustomerOrderHistoryItem {
  id: string;
  orderNumber: string;
  total: number;
  discountAmount: number;
  orderStatus: string;
  paymentStatus: string;
  paymentMethod: string;
  createdAt: string;
  itemCount: number;
}

export interface CustomerReviewItem {
  id: string;
  rating: number;
  content: string | null;
  status: string;
  createdAt: string;
  product: {
    id: string;
    name: string;
    slug: string;
  };
}

export interface CustomerDetailData extends CustomerListItem {
  addresses: CustomerAddress[];
  orders: CustomerOrderHistoryItem[];
  reviews: CustomerReviewItem[];
}
