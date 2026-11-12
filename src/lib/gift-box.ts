// ============================================================
// lib/gift-box.ts
// Bộ Động Cơ Tính Toán Sức Chứa (Slot Capacity Engine), Giá Giỏ Quà & KPIs (Phase 17)
// ============================================================

import { prisma } from "@/lib/prisma";
import {
  GiftBoxType,
  GiftOccasion,
  GiftRibbonColor,
  CorporateGiftStatus,
  Prisma,
} from "@prisma/client";

export interface CalculateHamperInput {
  templateId: string;
  hasLedLights?: boolean;
  items: Array<{
    productId: string;
    variantId?: string | null;
    quantity: number;
    unitPrice: number;
    slotCost?: number;
  }>;
}

export interface CalculateHamperResult {
  valid: boolean;
  error?: string;
  template: {
    id: string;
    name: string;
    basePrice: number;
    maxSlots: number;
    boxType: GiftBoxType;
    imageUrl: string;
  };
  totalSlotsUsed: number;
  maxSlots: number;
  isCapacityExceeded: boolean;
  basePrice: number;
  ledLightsPrice: number;
  itemsSubtotal: number;
  discountAmount: number;
  totalPrice: number;
}

/**
 * Lấy danh sách mẫu vỏ hộp quà đang hoạt động
 */
export async function getActiveGiftBoxTemplates() {
  return prisma.giftBoxTemplate.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: "asc" },
  });
}

/**
 * Động cơ tính toán dung lượng (Slots) & Giá trị giỏ quà
 */
export async function calculateHamperCapacityAndTotal(
  input: CalculateHamperInput
): Promise<CalculateHamperResult> {
  const template = await prisma.giftBoxTemplate.findUnique({
    where: { id: input.templateId },
  });

  if (!template || !template.isActive) {
    throw new Error("Mẫu vỏ hộp quà không tồn tại hoặc đã ngừng cung cấp.");
  }

  const basePrice = Number(template.basePrice);
  const ledLightsPrice = input.hasLedLights ? 50000 : 0;

  let totalSlotsUsed = 0;
  let itemsSubtotal = 0;

  for (const item of input.items) {
    const slotCost = item.slotCost && item.slotCost > 0 ? item.slotCost : 1;
    totalSlotsUsed += slotCost * item.quantity;
    itemsSubtotal += item.unitPrice * item.quantity;
  }

  const isCapacityExceeded = totalSlotsUsed > template.maxSlots;

  // Ưu đãi giỏ quà cao cấp: Nếu giỏ quà đạt từ 2.000.000đ trở lên, chiết khấu đặc biệt 5% tổng sản phẩm
  let discountAmount = 0;
  if (itemsSubtotal >= 2000000) {
    discountAmount = Math.round(itemsSubtotal * 0.05);
  }

  const totalPrice = Math.max(0, basePrice + ledLightsPrice + itemsSubtotal - discountAmount);

  return {
    valid: !isCapacityExceeded,
    error: isCapacityExceeded
      ? `Số lượng sản phẩm vượt quá sức chứa tối đa của hộp (${totalSlotsUsed}/${template.maxSlots} ô). Vui lòng chọn hộp lớn hơn hoặc bớt sản phẩm.`
      : undefined,
    template: {
      id: template.id,
      name: template.name,
      basePrice,
      maxSlots: template.maxSlots,
      boxType: template.boxType,
      imageUrl: template.imageUrl,
    },
    totalSlotsUsed,
    maxSlots: template.maxSlots,
    isCapacityExceeded,
    basePrice,
    ledLightsPrice,
    itemsSubtotal,
    discountAmount,
    totalPrice,
  };
}

/**
 * Sinh mã giỏ quà duy nhất dạng HMP-YYYYMM-XXXX
 */
export async function generateHamperCode(): Promise<string> {
  const now = new Date();
  const yearMonth = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}`;
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  return `HMP-${yearMonth}-${randomSuffix}`;
}

/**
 * Sinh mã yêu cầu doanh nghiệp duy nhất dạng CORP-YYYYMM-XXXX
 */
export async function generateCorporateInquiryCode(): Promise<string> {
  const now = new Date();
  const yearMonth = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}`;
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  return `CORP-${yearMonth}-${randomSuffix}`;
}

/**
 * Tổng hợp số liệu KPI phục vụ Admin Dashboard Quà Biếu & Quà Doanh Nghiệp
 */
export async function calculateCorporateGiftKPIs() {
  const [
    totalInquiries,
    pendingInquiries,
    quotedInquiries,
    wonInquiries,
    templatesCount,
    wonRevenueAggregate,
    totalHampersCreated,
  ] = await Promise.all([
    prisma.corporateGiftInquiry.count(),
    prisma.corporateGiftInquiry.count({
      where: { status: CorporateGiftStatus.PENDING },
    }),
    prisma.corporateGiftInquiry.count({
      where: { status: CorporateGiftStatus.QUOTED },
    }),
    prisma.corporateGiftInquiry.count({
      where: {
        status: {
          in: [CorporateGiftStatus.DEPOSIT_PAID, CorporateGiftStatus.FULFILLED],
        },
      },
    }),
    prisma.giftBoxTemplate.count({
      where: { isActive: true },
    }),
    prisma.corporateGiftInquiry.aggregate({
      where: {
        status: {
          in: [CorporateGiftStatus.DEPOSIT_PAID, CorporateGiftStatus.FULFILLED],
        },
      },
      _sum: {
        quotedTotal: true,
      },
    }),
    prisma.giftCustomHamper.count(),
  ]);

  const wonRevenue = Number(wonRevenueAggregate._sum.quotedTotal || 0);
  const conversionRate =
    totalInquiries > 0 ? Math.round((wonInquiries / totalInquiries) * 100) : 0;

  return {
    totalInquiries,
    pendingInquiries,
    quotedInquiries,
    wonInquiries,
    templatesCount,
    wonRevenue,
    conversionRate,
    totalHampersCreated,
  };
}
