// ============================================================
// components/admin/referral/types.ts
// Định nghĩa kiểu dữ liệu cho giao diện Quản Trị Giới Thiệu Admin CMS
// ============================================================

export type ReferralStatusType = "PENDING" | "QUALIFIED" | "REWARDED" | "EXPIRED";

export interface ReferralUserSummary {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  avatar: string | null;
  membershipTier?: "BRONZE" | "SILVER" | "GOLD" | "DIAMOND";
  referralCode?: string | null;
  joinedAt?: string;
}

export interface ReferralOrderItem {
  id: string;
  orderNumber: string;
  total: number;
  status: string;
  createdAt: string;
}

export interface AdminReferralRecordItem {
  id: string;
  referrer: ReferralUserSummary;
  referee: ReferralUserSummary;
  order: ReferralOrderItem | null;
  status: ReferralStatusType;
  rewardPoints: number;
  voucherCode: string | null;
  rewardedAt: string | null;
  createdAt: string;
}

export interface ReferralStatsData {
  totalReferrals: number;
  totalRewarded: number;
  conversionRate: number;
  totalRevenue: number;
  totalPointsDistributed: number;
}

export interface ReferralPaginationData {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}
