// ============================================================
// components/admin/family-health/types.ts
// Các kiểu dữ liệu quản trị Tủ Thuốc Gia Đình & CRM Tái Nạp (Phase 22)
// ============================================================

export interface AdminFamilyKPIs {
  totalProfiles: number;
  totalMembers: number;
  totalSchedules: number;
  urgentRestocksCount: number;
}

export interface AdminUrgentRestockItem {
  id: string;
  customItemName: string;
  brandName?: string | null;
  timeSlot: string;
  dosageText: string;
  servingsRemaining: number;
  startDate: Date | string;
  estimatedEmptyDate?: Date | string | null;
  memberProfile: {
    id: string;
    fullName: string;
    relation: string;
    user: {
      id: string;
      name?: string | null;
      phone?: string | null;
      email?: string | null;
    };
  };
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

export interface AdminFamilyMemberItem {
  id: string;
  fullName: string;
  relation: string;
  avatarEmoji?: string | null;
  healthGoals: string[];
  allergies: string[];
  weightKg?: number | null;
  heightCm?: number | null;
  notes?: string | null;
  dateOfBirth?: Date | string | null;
  createdAt: Date | string;
  user: {
    id: string;
    name?: string | null;
    phone?: string | null;
    email?: string | null;
  };
  _count: {
    supplementSchedules: number;
  };
}
