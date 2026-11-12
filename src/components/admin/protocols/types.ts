// ============================================================
// components/admin/protocols/types.ts
// Định nghĩa kiểu dữ liệu Quản trị Phác đồ Dược sĩ & Lịch hẹn (Phase 16)
// ============================================================

import { HealthTargetGroup, ConsultationStatus } from "@prisma/client";

export interface ProtocolItemData {
  id: string;
  protocolId: string;
  productId: string;
  variantId: string | null;
  usageInstructions: string;
  timing: string;
  quantity: number;
  isEssential: boolean;
  sortOrder: number;
  product: {
    id: string;
    name: string;
    slug: string;
    images?: Array<{ url: string }>;
  };
  variant: {
    id: string;
    name: string;
    price: number | string;
    originalPrice: number | string | null;
    stock: number;
  } | null;
}

export interface HealthProtocolItem {
  id: string;
  slug: string;
  title: string;
  targetGroup: HealthTargetGroup;
  subtitle: string | null;
  description: string;
  keyNutrients: string[];
  pharmacistAdvice: string;
  dosageSchedule: any;
  comboDiscountPercent: number;
  isActive: boolean;
  items: ProtocolItemData[];
  _count?: {
    assessments: number;
  };
  createdAt: string;
  updatedAt: string;
}

export interface ConsultationBookingItem {
  id: string;
  assessmentId: string | null;
  userId: string | null;
  customerName: string;
  phone: string;
  preferredDate: string;
  preferredTimeSlot: string;
  healthConcerns: string;
  status: ConsultationStatus;
  pharmacistNotes: string | null;
  createdAt: string;
  updatedAt: string;
  assessment?: {
    id: string;
    targetGroup: HealthTargetGroup;
    quizAnswers: any;
    protocol?: {
      id: string;
      title: string;
      slug: string;
      targetGroup: HealthTargetGroup;
    } | null;
  } | null;
  user?: {
    id: string;
    name: string | null;
    email: string | null;
    membershipTier: string;
  } | null;
}

export interface ProtocolKPIs {
  totalAssessments: number;
  totalBookings: number;
  pendingBookings: number;
  completedBookings: number;
  totalProtocols: number;
}
