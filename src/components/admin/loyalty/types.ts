// ============================================================
// components/admin/loyalty/types.ts
// Định nghĩa kiểu dữ liệu cho giao diện Quản Lý Tích Điểm Admin CMS
// ============================================================

export interface LoyaltyUserSummary {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  avatar: string | null;
  membershipTier: "BRONZE" | "SILVER" | "GOLD" | "DIAMOND";
  currentPoints: number;
}

export interface LoyaltyTransactionItem {
  id: string;
  points: number;
  type:
    | "EARN_ORDER"
    | "REDEEM_ORDER"
    | "REDEEM_VOUCHER"
    | "ADMIN_ADJUST"
    | "SIGNUP_BONUS";
  description: string;
  balanceAfter: number;
  createdAt: string;
  user: LoyaltyUserSummary;
  order: {
    id: string;
    orderNumber: string;
    total: number;
  } | null;
}

export interface LoyaltyStatsData {
  totalCustomers: number;
  totalCirculatingPoints: number;
  totalLifetimePointsEarned: number;
  totalRedeemedPoints: number;
  monetaryEquivalentValue: number;
  tierDistribution: {
    bronze: number;
    silver: number;
    gold: number;
    diamond: number;
  };
}
