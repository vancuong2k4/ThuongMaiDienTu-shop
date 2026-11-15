// ============================================================
// components/admin/pediatric/types.ts
// Kiểu dữ liệu quản trị Tăng Trưởng Trẻ Em & Pha Sữa Úc (Phase 23)
// ============================================================

export interface PediatricAdminKPIs {
  totalAssessments: number;
  normalCount: number;
  underweightCount: number;
  stuntedCount: number;
  normalRatioPercent: number;
  recentAssessments: AdminChildAssessmentItem[];
}

export interface AdminChildAssessmentItem {
  id: string;
  childName: string;
  gender: "BOY" | "GIRL";
  birthDate: Date | string;
  assessmentDate: Date | string;
  ageMonths: number;
  weightKg: number;
  heightCm: number;
  weightZScore: number;
  heightZScore: number;
  weightStatus: string;
  heightStatus: string;
  recommendedNutrients: string[];
  pharmacistAdvice: string;
  createdAt: Date | string;
  user?: {
    id: string;
    name?: string | null;
    phone?: string | null;
    email?: string | null;
  } | null;
}

export interface AdminAptamilProtocolItem {
  id: string;
  stage: string;
  productTitle: string;
  ageRangeMonths: string;
  waterTemperatureMinC: number;
  waterTemperatureMaxC: number;
  waterMlPerScoop: number;
  scoopWeightGrams: number;
  standardFeedsPerDay: number;
  waterVolumeMlPerFeed: number;
  scoopsPerFeed: number;
  mixingSteps: string[];
  probioticWarning: string;
  storageGuidelines: string;
  productId?: string | null;
  product?: {
    id: string;
    name: string;
    slug: string;
    variants: Array<{
      id: string;
      price: number | any;
      image?: string | null;
      stock: number;
    }>;
  } | null;
}
