// ============================================================
// components/storefront/referral/types.ts
// Định nghĩa kiểu dữ liệu cho Giao Diện Mời Bạn Nhận Quà Storefront
// ============================================================

export type ReferralStatusType = "PENDING" | "QUALIFIED" | "REWARDED" | "EXPIRED";

export interface ReferralUserProfile {
  id: string;
  name: string;
  email: string;
  referralCode: string;
  referralLink: string;
}

export interface StorefrontReferralStats {
  totalInvited: number;
  totalRewarded: number;
  totalPointsEarned: number;
  totalValueVND: number;
}

export interface InvitedFriendItem {
  id: string;
  name: string;
  maskedEmail: string;
  joinedAt: string;
  status: ReferralStatusType;
  rewardPoints: number;
  firstOrderTotal: number | null;
  voucherCode: string | null;
}
