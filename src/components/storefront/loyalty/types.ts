// ============================================================
// components/storefront/loyalty/types.ts
// Kiểu dữ liệu Storefront Khách Hàng Thân Thiết THUYNGA Club
// ============================================================

import type { LoyaltyType } from "@prisma/client";

export interface TierConfig {
  name: string;
  code: string;
  minSpent: number;
  pointRatePercent: number;
  gradient: string;
  textGradient: string;
  badgeBg: string;
  privileges: readonly string[];
}

export interface TierProgress {
  currentSpent: number;
  nextTier: string | null;
  nextTierThreshold: number | null;
  spentNeeded: number;
  percentComplete: number;
}

export interface RewardOption {
  readonly id: "VOUCHER_50K" | "VOUCHER_100K" | "VOUCHER_250K";
  readonly title: string;
  readonly description: string;
  readonly pointsRequired: number;
  readonly voucherValue: number;
  readonly minOrderAmount: number;
  readonly tag: string;
}

export interface LoyaltyTransactionEntry {
  id: string;
  points: number;
  type: LoyaltyType;
  description: string;
  balanceAfter: number;
  createdAt: string;
  order: {
    orderNumber: string;
    total: number;
  } | null;
}

export interface LoyaltyHubData {
  currentPoints: number;
  monetaryEquivalent: number;
  totalPointsEarned: number;
  membershipTier: "BRONZE" | "SILVER" | "GOLD" | "DIAMOND";
  tierConfig: TierConfig;
  tierProgress: TierProgress;
  transactions: LoyaltyTransactionEntry[];
  rewardCatalog: readonly RewardOption[];
}
