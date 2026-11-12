// ============================================================
// components/admin/gift-boxes/types.ts
// Kiểu dữ liệu Quản lý Hộp Quà Biếu & Quà Doanh Nghiệp Admin CMS (Phase 17)
// ============================================================

import {
  GiftBoxType,
  GiftRibbonColor,
  GiftOccasion,
  CorporateGiftStatus,
} from "@prisma/client";

export interface AdminGiftBoxTemplate {
  id: string;
  name: string;
  slug: string;
  boxType: GiftBoxType;
  dimensions: string;
  basePrice: number;
  maxSlots: number;
  imageUrl: string;
  description: string | null;
  isAirCargoPledge: boolean;
  isActive: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
  hamperCount?: number;
}

export interface AdminCorporateInquiry {
  id: string;
  inquiryCode: string;
  companyName: string;
  contactPerson: string;
  phone: string;
  email: string;
  occasion: GiftOccasion;
  quantity: number;
  budgetPerHamper: number;
  deliveryDeadline: string | null;
  requiresVatInvoice: boolean;
  customLogoBranding: boolean;
  notes: string | null;
  status: CorporateGiftStatus;
  quotedTotal: number | null;
  adminNotes: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CorporateGiftKPIs {
  totalInquiries: number;
  pendingInquiries: number;
  quotedInquiries: number;
  wonInquiries: number;
  templatesCount: number;
  wonRevenue: number;
  conversionRate: number;
  totalHampersCreated: number;
}
