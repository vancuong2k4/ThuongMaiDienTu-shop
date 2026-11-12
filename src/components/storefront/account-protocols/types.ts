// ============================================================
// components/storefront/account-protocols/types.ts
// Kiểu dữ liệu Phác đồ & Lịch uống vi chất của tôi (Phase 16)
// ============================================================

import { HealthTargetGroup, ConsultationStatus } from "@prisma/client";

export interface AccountProtocolItem {
  id: string;
  targetGroup: HealthTargetGroup;
  createdAt: string;
  notes: string | null;
  quizAnswers: any;
  protocol: {
    id: string;
    slug: string;
    title: string;
    subtitle: string | null;
    keyNutrients: string[];
    pharmacistAdvice: string;
    dosageSchedule: any;
    comboDiscountPercent: number;
    items: Array<{
      id: string;
      usageInstructions: string;
      timing: string;
      quantity: number;
      product: {
        id: string;
        name: string;
        slug: string;
        images?: Array<{ url: string }>;
      };
      variant?: {
        id: string;
        name: string;
        price: number;
      } | null;
    }>;
  } | null;
  consultationBookings: Array<{
    id: string;
    preferredDate: string;
    preferredTimeSlot: string;
    healthConcerns: string;
    status: ConsultationStatus;
    pharmacistNotes: string | null;
  }>;
}
