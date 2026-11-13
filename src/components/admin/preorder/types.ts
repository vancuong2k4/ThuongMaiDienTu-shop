// ============================================================
// components/admin/preorder/types.ts
// Các Kiểu Dữ Liệu Quản Trị Đặt Trước Mùa Vụ Úc (Phase 21)
// ============================================================

export type CampaignStatusType =
  | "UPCOMING"
  | "OPEN_FOR_RESERVATION"
  | "HARVESTING"
  | "AIR_SHIPPING"
  | "DELIVERED"
  | "CLOSED";

export type DepositPolicyType =
  | "PERCENTAGE_30"
  | "PERCENTAGE_50"
  | "FULL_PAYMENT";

export type HarvestGradeType =
  | "PREMIUM_EXPORT"
  | "ROYAL_RESERVE"
  | "DIAMOND_SELECT";

export type ReservationStatusType =
  | "CONFIRMED_DEPOSIT"
  | "PAID_FULL"
  | "ALLOCATED_FLIGHT"
  | "SHIPPED"
  | "COMPLETED"
  | "CANCELLED";

export interface AdminCampaignItem {
  id: string;
  title: string;
  slug: string;
  subtitle: string;
  description?: string;
  farmName: string;
  farmRegion: string;
  productCategory: string;
  bannerImage: string;
  harvestStartDate: string | Date;
  harvestEndDate: string | Date;
  flightDepartureWeek: string;
  targetBrixSweetness: string;
  fruitSizeMm: string;
  qualityGrade: HarvestGradeType;
  totalCapacityKg: number;
  reservedCapacityKg: number;
  status: CampaignStatusType;
  depositType: DepositPolicyType;
  depositPercent: number;
  sortOrder: number;
  _count?: {
    reservations: number;
  };
  tiers?: Array<{
    id: string;
    name: string;
    specification: string;
    price: number | any;
    depositAmount: number | any;
    totalSlots: number;
    reservedSlots: number;
  }>;
}

export interface AdminReservationItem {
  id: string;
  reservationCode: string;
  campaignId: string;
  tierId: string;
  userId?: string | null;
  customerName: string;
  customerPhone: string;
  customerEmail?: string | null;
  deliveryAddress: string;
  quantity: number;
  totalPrice: number | any;
  depositPaid: number | any;
  remainingAmount: number | any;
  depositMethod: string;
  status: ReservationStatusType;
  flightNumber?: string | null;
  airWaybillNumber?: string | null;
  notes?: string | null;
  createdAt: string | Date;
  campaign: {
    title: string;
    slug: string;
    farmName: string;
    flightDepartureWeek: string;
  };
  tier: {
    name: string;
    specification: string;
    price: number | any;
    depositAmount: number | any;
  };
}

export interface AdminPreOrderKPIs {
  totalCampaigns: number;
  activeCampaigns: number;
  totalReservations: number;
  totalDepositRevenue: number;
  totalContractValue: number;
}
