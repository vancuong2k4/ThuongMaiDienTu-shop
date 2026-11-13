import { prisma } from "@/lib/prisma";
import {
  CampaignStatus,
  DepositType,
  ReservationStatus,
  HarvestQualityGrade,
} from "@prisma/client";
import type { CreateReservationInput } from "@/lib/validations/preorder";

// ============================================================
// lib/preorder.ts
// Lõi Nghiệp Vụ Đặt Trước Mùa Vụ Úc & Phân Bổ Slot Khoang Bay
// ============================================================

export interface CampaignProgressStats {
  fillRatePercent: number;
  remainingCapacityKg: number;
  totalSlots: number;
  reservedSlots: number;
  availableSlots: number;
  daysRemaining: number;
  isSoldOut: boolean;
  statusBadge: {
    label: string;
    bgColor: string;
    textColor: string;
    borderColor: string;
  };
  qualityBadge: {
    label: string;
    bgColor: string;
    textColor: string;
  };
}

/**
 * Tính toán thống kê tiến độ lấp đầy slot và trạng thái chiến dịch
 */
export function calculateCampaignProgress(campaign: {
  status: CampaignStatus;
  qualityGrade: HarvestQualityGrade;
  totalCapacityKg: number;
  reservedCapacityKg: number;
  harvestStartDate: Date | string;
  harvestEndDate: Date | string;
  tiers?: Array<{ totalSlots: number; reservedSlots: number }>;
}): CampaignProgressStats {
  const fillRate =
    campaign.totalCapacityKg > 0
      ? Math.min(
          100,
          Number(
            ((campaign.reservedCapacityKg / campaign.totalCapacityKg) * 100).toFixed(1)
          )
        )
      : 0;

  const remainingKg = Math.max(
    0,
    Number((campaign.totalCapacityKg - campaign.reservedCapacityKg).toFixed(1))
  );

  let totalSlots = 0;
  let reservedSlots = 0;

  if (campaign.tiers && campaign.tiers.length > 0) {
    totalSlots = campaign.tiers.reduce((s, t) => s + t.totalSlots, 0);
    reservedSlots = campaign.tiers.reduce((s, t) => s + t.reservedSlots, 0);
  }

  const availableSlots = Math.max(0, totalSlots - reservedSlots);
  const isSoldOut = fillRate >= 100 || (totalSlots > 0 && availableSlots === 0);

  const now = new Date();
  const endDate = new Date(campaign.harvestEndDate);
  const diffTime = endDate.getTime() - now.getTime();
  const daysRemaining = Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));

  let statusBadge = {
    label: "Đang mở đặt cọc",
    bgColor: "bg-emerald-50",
    textColor: "text-emerald-700",
    borderColor: "border-emerald-200",
  };

  switch (campaign.status) {
    case CampaignStatus.UPCOMING:
      statusBadge = {
        label: "Sắp mở giữ chỗ",
        bgColor: "bg-blue-50",
        textColor: "text-blue-700",
        borderColor: "border-blue-200",
      };
      break;
    case CampaignStatus.HARVESTING:
      statusBadge = {
        label: "Đang thu hoạch tại vườn Úc",
        bgColor: "bg-amber-50",
        textColor: "text-amber-800",
        borderColor: "border-amber-200",
      };
      break;
    case CampaignStatus.AIR_SHIPPING:
      statusBadge = {
        label: "Đang bay Air về Việt Nam",
        bgColor: "bg-sky-50",
        textColor: "text-sky-800",
        borderColor: "border-sky-200",
      };
      break;
    case CampaignStatus.DELIVERED:
      statusBadge = {
        label: "Đã trả hàng hoàn tất",
        bgColor: "bg-purple-50",
        textColor: "text-purple-700",
        borderColor: "border-purple-200",
      };
      break;
    case CampaignStatus.CLOSED:
      statusBadge = {
        label: "Đã đóng chiến dịch",
        bgColor: "bg-slate-50",
        textColor: "text-slate-600",
        borderColor: "border-slate-200",
      };
      break;
  }

  let qualityBadge = {
    label: "Hoàng Gia Royal Reserve",
    bgColor: "bg-[#800028]/10",
    textColor: "text-[#800028]",
  };

  if (campaign.qualityGrade === HarvestQualityGrade.DIAMOND_SELECT) {
    qualityBadge = {
      label: "Tuyển Chọn Kim Cương Diamond",
      bgColor: "bg-amber-50",
      textColor: "text-amber-700",
    };
  } else if (campaign.qualityGrade === HarvestQualityGrade.PREMIUM_EXPORT) {
    qualityBadge = {
      label: "Xuất Khẩu Loại 1 Premium",
      bgColor: "bg-blue-50",
      textColor: "text-blue-700",
    };
  }

  return {
    fillRatePercent: fillRate,
    remainingCapacityKg: remainingKg,
    totalSlots,
    reservedSlots,
    availableSlots,
    daysRemaining,
    isSoldOut,
    statusBadge,
    qualityBadge,
  };
}

/**
 * Sinh mã đơn đặt trước ngẫu nhiên duy nhất
 */
export function generateReservationCode(category = "TAS"): string {
  const year = new Date().getFullYear();
  const randNum = Math.floor(1000 + Math.random() * 9000);
  const prefix = category.substring(0, 3).toUpperCase();
  return `PRE-${prefix}-${year}-${randNum}`;
}

/**
 * Tạo đơn đặt trước giữ chỗ mùa vụ có khóa giao dịch Atomic
 */
export async function createPreOrderReservationRecord(
  input: CreateReservationInput,
  userId?: string | null
) {
  return await prisma.$transaction(async (tx) => {
    // 1. Kiểm tra chiến dịch
    const campaign = await tx.seasonalCampaign.findUnique({
      where: { id: input.campaignId },
      include: { tiers: true },
    });

    if (!campaign) {
      throw new Error("Chiến dịch mùa vụ không tồn tại.");
    }

    if (
      campaign.status !== CampaignStatus.OPEN_FOR_RESERVATION &&
      campaign.status !== CampaignStatus.HARVESTING
    ) {
      throw new Error("Chiến dịch hiện không tiếp nhận đặt cọc.");
    }

    // 2. Kiểm tra tier
    const tier = campaign.tiers.find((t) => t.id === input.tierId);
    if (!tier) {
      throw new Error("Quy cách đặt trước không tồn tại trong chiến dịch.");
    }

    const availableSlots = tier.totalSlots - tier.reservedSlots;
    if (availableSlots < input.quantity) {
      throw new Error(
        `Chỉ còn ${availableSlots} suất khả dụng cho quy cách này, không đủ ${input.quantity} suất yêu cầu.`
      );
    }

    // 3. Tính toán tiền cọc & tổng tiền
    const pricePerUnit = Number(tier.price);
    const depositPerUnit = Number(tier.depositAmount);
    const totalPrice = pricePerUnit * input.quantity;
    const depositPaid = depositPerUnit * input.quantity;
    const remainingAmount = totalPrice - depositPaid;

    // Ước tính số kg tăng thêm trong chiến dịch
    let estKg = input.quantity * 2.0; // Mặc định 2kg / slot
    if (tier.name.includes("5kg")) {
      estKg = input.quantity * 5.0;
    } else if (tier.name.includes("1kg")) {
      estKg = input.quantity * 1.0;
    } else if (tier.name.includes("250g")) {
      estKg = input.quantity * 0.25;
    }

    // 4. Sinh mã code
    const code = generateReservationCode(campaign.productCategory);

    // 5. Cập nhật số slot đã đặt trong Tier
    await tx.preOrderTier.update({
      where: { id: tier.id },
      data: {
        reservedSlots: { increment: input.quantity },
      },
    });

    // 6. Cập nhật sản lượng đã đặt trong Campaign
    await tx.seasonalCampaign.update({
      where: { id: campaign.id },
      data: {
        reservedCapacityKg: { increment: estKg },
      },
    });

    // 7. Tạo bản ghi đặt chỗ
    const reservation = await tx.preOrderReservation.create({
      data: {
        reservationCode: code,
        campaignId: campaign.id,
        tierId: tier.id,
        userId: userId || null,
        customerName: input.customerName.trim(),
        customerPhone: input.customerPhone.trim(),
        customerEmail: input.customerEmail ? input.customerEmail.trim() : null,
        deliveryAddress: input.deliveryAddress.trim(),
        quantity: input.quantity,
        totalPrice,
        depositPaid,
        remainingAmount,
        depositMethod: input.depositMethod,
        status: ReservationStatus.CONFIRMED_DEPOSIT,
        notes: input.notes ? input.notes.trim() : null,
      },
      include: {
        campaign: {
          select: {
            title: true,
            slug: true,
            farmName: true,
            flightDepartureWeek: true,
          },
        },
        tier: {
          select: {
            name: true,
            specification: true,
          },
        },
      },
    });

    return reservation;
  });
}

/**
 * Thống kê KPIs cho Admin CMS Mùa vụ Úc
 */
export async function calculatePreOrderKPIs() {
  const [
    totalCampaigns,
    activeCampaigns,
    totalReservations,
    allReservations,
  ] = await Promise.all([
    prisma.seasonalCampaign.count(),
    prisma.seasonalCampaign.count({
      where: {
        status: {
          in: [
            CampaignStatus.OPEN_FOR_RESERVATION,
            CampaignStatus.HARVESTING,
            CampaignStatus.AIR_SHIPPING,
          ],
        },
      },
    }),
    prisma.preOrderReservation.count({
      where: { status: { not: ReservationStatus.CANCELLED } },
    }),
    prisma.preOrderReservation.findMany({
      where: { status: { not: ReservationStatus.CANCELLED } },
      select: { depositPaid: true, totalPrice: true },
    }),
  ]);

  const totalDepositRevenue = allReservations.reduce(
    (sum, r) => sum + Number(r.depositPaid),
    0
  );
  const totalContractValue = allReservations.reduce(
    (sum, r) => sum + Number(r.totalPrice),
    0
  );

  return {
    totalCampaigns,
    activeCampaigns,
    totalReservations,
    totalDepositRevenue,
    totalContractValue,
  };
}
