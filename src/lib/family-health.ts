import { prisma } from "@/lib/prisma";
import {
  SupplementTimeSlot,
  IntakeLogStatus,
  FamilyRelation,
} from "@prisma/client";

// ============================================================
// lib/family-health.ts
// Lõi Nghiệp Vụ Tủ Thuốc Sức Khỏe Gia Đình & Nhắc Uống Vi Chất
// ============================================================

export interface ScheduleWithStatus {
  id: string;
  memberProfileId: string;
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
  customItemName: string;
  brandName?: string | null;
  timeSlot: SupplementTimeSlot;
  timeString: string;
  dosageText: string;
  dailyFrequency: number;
  totalServingsPerBox: number;
  servingsRemaining: number;
  daysRemaining: number;
  restockStatus: "URGENT" | "WARNING" | "GOOD";
  startDate: Date | string;
  estimatedEmptyDate?: Date | string | null;
  isActive: boolean;
  reminderEnabled: boolean;
  notes?: string | null;
  todayLog?: {
    id: string;
    status: IntakeLogStatus;
    takenAt?: Date | string | null;
  } | null;
}

export interface TimeSlotGroup {
  slot: SupplementTimeSlot;
  label: string;
  description: string;
  typicalHours: string;
  items: ScheduleWithStatus[];
}

export interface ConflictAlert {
  type: "WARNING" | "CAUTION";
  title: string;
  message: string;
  conflictingItems: string[];
}

export interface MemberScheduleOverview {
  member: {
    id: string;
    fullName: string;
    relation: FamilyRelation;
    avatarEmoji?: string | null;
    healthGoals: string[];
    allergies: string[];
    dateOfBirth?: Date | string | null;
    notes?: string | null;
  };
  todayFormatted: string;
  totalSchedules: number;
  takenTodayCount: number;
  adherenceRatePercent: number;
  timeSlotGroups: TimeSlotGroup[];
  restockAlerts: ScheduleWithStatus[];
  conflictAlerts: ConflictAlert[];
}

/**
 * Phân tích và nhóm lịch uống vi chất trong ngày cho thành viên gia đình
 */
export async function calculateMemberScheduleOverview(
  memberProfileId: string,
  dateStr?: string
): Promise<MemberScheduleOverview> {
  const member = await prisma.familyMemberProfile.findUnique({
    where: { id: memberProfileId },
    include: {
      supplementSchedules: {
        where: { isActive: true },
        include: {
          product: {
            select: {
              id: true,
              name: true,
              slug: true,
              variants: {
                where: { isActive: true },
                select: { id: true, price: true, image: true, stock: true },
                take: 1,
              },
            },
          },
        },
        orderBy: [{ timeString: "asc" }],
      },
    },
  });

  if (!member) {
    throw new Error("Không tìm thấy hồ sơ thành viên gia đình.");
  }

  // Chuẩn hóa ngày hôm nay dạng YYYY-MM-DD
  const effectiveDateStr = dateStr || new Date().toISOString().slice(0, 10);
  const logDate = new Date(`${effectiveDateStr}T00:00:00Z`);

  // Lấy toàn bộ nhật ký intake logs của thành viên trong ngày
  const logs = await prisma.supplementIntakeLog.findMany({
    where: {
      memberProfileId,
      logDate,
    },
  });

  const logMap = new Map(logs.map((l) => [l.scheduleId, l]));

  // Định nghĩa các khung giờ
  const slotDefinitions: Record<
    SupplementTimeSlot,
    { label: string; description: string; typicalHours: string }
  > = {
    MORNING_BEFORE_MEAL: {
      label: "Sáng Trước Ăn",
      description: "Men vi sinh Probiotics, Tinh nghệ Nano, Nước ấm mật ong",
      typicalHours: "06:00 - 07:00",
    },
    MORNING_AFTER_MEAL: {
      label: "Sáng Sau Ăn",
      description: "Vitamin D3 K2, Canxi hữu cơ, Dầu cá DHA, Sữa bột",
      typicalHours: "07:30 - 09:00",
    },
    NOON_AFTER_MEAL: {
      label: "Trưa Sau Ăn",
      description: "Sắt hữu cơ, Kẽm Zinc, Vitamin C (Cách Canxi 2-4 giờ)",
      typicalHours: "12:00 - 13:30",
    },
    EVENING_AFTER_MEAL: {
      label: "Tối Sau Ăn",
      description: "Glucosamine sụn khớp, CoQ10 tim mạch, Bổ gan Úc",
      typicalHours: "18:30 - 20:00",
    },
    BEFORE_BED: {
      label: "Trước Khi Đi Ngủ",
      description: "Canxi sữa, Magie thư giãn cơ, Thảo dược an thần ngủ ngon",
      typicalHours: "21:00 - 22:30",
    },
  };

  const enrichedSchedules: ScheduleWithStatus[] = member.supplementSchedules.map(
    (s) => {
      const todayLog = logMap.get(s.id) || null;
      const daysRem = Math.max(
        0,
        Math.floor(s.servingsRemaining / (s.dailyFrequency || 1))
      );

      let restockStatus: "URGENT" | "WARNING" | "GOOD" = "GOOD";
      if (daysRem <= 5) restockStatus = "URGENT";
      else if (daysRem <= 10) restockStatus = "WARNING";

      return {
        id: s.id,
        memberProfileId: s.memberProfileId,
        productId: s.productId,
        product: s.product,
        customItemName: s.customItemName,
        brandName: s.brandName,
        timeSlot: s.timeSlot,
        timeString: s.timeString,
        dosageText: s.dosageText,
        dailyFrequency: s.dailyFrequency,
        totalServingsPerBox: s.totalServingsPerBox,
        servingsRemaining: s.servingsRemaining,
        daysRemaining: daysRem,
        restockStatus,
        startDate: s.startDate,
        estimatedEmptyDate: s.estimatedEmptyDate,
        isActive: s.isActive,
        reminderEnabled: s.reminderEnabled,
        notes: s.notes,
        todayLog: todayLog
          ? {
              id: todayLog.id,
              status: todayLog.status,
              takenAt: todayLog.takenAt,
            }
          : null,
      };
    }
  );

  // Nhóm theo time slots
  const slotsOrder: SupplementTimeSlot[] = [
    SupplementTimeSlot.MORNING_BEFORE_MEAL,
    SupplementTimeSlot.MORNING_AFTER_MEAL,
    SupplementTimeSlot.NOON_AFTER_MEAL,
    SupplementTimeSlot.EVENING_AFTER_MEAL,
    SupplementTimeSlot.BEFORE_BED,
  ];

  const timeSlotGroups: TimeSlotGroup[] = slotsOrder
    .map((slot) => {
      const def = slotDefinitions[slot];
      const items = enrichedSchedules.filter((s) => s.timeSlot === slot);
      return {
        slot,
        label: def.label,
        description: def.description,
        typicalHours: def.typicalHours,
        items,
      };
    })
    .filter((g) => g.items.length > 0);

  // Thuật toán phát hiện xung đột / đối kháng vi chất (Conflict Detection Engine)
  const conflictAlerts: ConflictAlert[] = [];

  const morningItems = enrichedSchedules.filter(
    (s) => s.timeSlot === SupplementTimeSlot.MORNING_AFTER_MEAL
  );
  const noonItems = enrichedSchedules.filter(
    (s) => s.timeSlot === SupplementTimeSlot.NOON_AFTER_MEAL
  );

  // Kiểm tra Canxi và Sắt cùng 1 khung giờ
  const hasCalciumInMorning = morningItems.some((s) =>
    s.customItemName.toLowerCase().includes("canxi") ||
    s.customItemName.toLowerCase().includes("calcium") ||
    s.customItemName.toLowerCase().includes("sữa")
  );
  const hasIronInMorning = morningItems.some((s) =>
    s.customItemName.toLowerCase().includes("sắt") ||
    s.customItemName.toLowerCase().includes("iron")
  );

  if (hasCalciumInMorning && hasIronInMorning) {
    conflictAlerts.push({
      type: "WARNING",
      title: "Xung Đột Hấp Thu: Canxi & Sắt Trong Cùng Khung Giờ Sáng",
      message:
        "Canxi và Sắt cạnh tranh thụ thể hấp thu tại ruột non. Dược sĩ THUYNGA Shop khuyến nghị chuyển sản phẩm Sắt sang cữ Trưa sau ăn (cách ít nhất 2 giờ) để tối đa lượng hồng cầu tái tạo.",
      conflictingItems: morningItems
        .filter((s) => {
          const n = s.customItemName.toLowerCase();
          return (
            n.includes("canxi") ||
            n.includes("calcium") ||
            n.includes("sữa") ||
            n.includes("sắt") ||
            n.includes("iron")
          );
        })
        .map((s) => s.customItemName),
    });
  }

  // Danh sách sản phẩm sắp hết cần mua bổ sung
  const restockAlerts = enrichedSchedules.filter(
    (s) => s.restockStatus === "URGENT" || s.restockStatus === "WARNING"
  );

  // Tỷ lệ tuân thủ
  const totalSchedules = enrichedSchedules.length;
  const takenTodayCount = enrichedSchedules.filter(
    (s) => s.todayLog?.status === IntakeLogStatus.TAKEN
  ).length;
  const adherenceRatePercent =
    totalSchedules > 0
      ? Math.round((takenTodayCount / totalSchedules) * 100)
      : 100;

  return {
    member: {
      id: member.id,
      fullName: member.fullName,
      relation: member.relation,
      avatarEmoji: member.avatarEmoji,
      healthGoals: member.healthGoals,
      allergies: member.allergies,
      dateOfBirth: member.dateOfBirth,
      notes: member.notes,
    },
    todayFormatted: effectiveDateStr,
    totalSchedules,
    takenTodayCount,
    adherenceRatePercent,
    timeSlotGroups,
    restockAlerts,
    conflictAlerts,
  };
}

/**
 * 1-Chạm Ghi Nhận "Đã Uống" / "Bỏ Qua" kèm điều chỉnh số lượng viên còn lại
 */
export async function toggleSupplementIntake(
  scheduleId: string,
  memberProfileId: string,
  logDateStr: string,
  targetStatus: IntakeLogStatus,
  notes?: string | null
) {
  const logDate = new Date(`${logDateStr}T00:00:00Z`);

  return await prisma.$transaction(async (tx) => {
    // 1. Kiểm tra trạng thái hiện tại
    const existing = await tx.supplementIntakeLog.findUnique({
      where: {
        scheduleId_logDate: {
          scheduleId,
          logDate,
        },
      },
    });

    const previousStatus = existing?.status || IntakeLogStatus.SCHEDULED;

    // 2. Lưu / Cập nhật bản ghi nhật ký
    const log = await tx.supplementIntakeLog.upsert({
      where: {
        scheduleId_logDate: {
          scheduleId,
          logDate,
        },
      },
      update: {
        status: targetStatus,
        takenAt: targetStatus === IntakeLogStatus.TAKEN ? new Date() : null,
        notes: notes || undefined,
      },
      create: {
        scheduleId,
        memberProfileId,
        logDate,
        status: targetStatus,
        takenAt: targetStatus === IntakeLogStatus.TAKEN ? new Date() : null,
        notes: notes || null,
      },
    });

    // 3. Tự động trừ/cộng liều còn lại của hộp
    if (previousStatus !== IntakeLogStatus.TAKEN && targetStatus === IntakeLogStatus.TAKEN) {
      // Chuyển sang đã uống -> Trừ 1 liều
      await tx.memberSupplementSchedule.update({
        where: { id: scheduleId },
        data: {
          servingsRemaining: { decrement: 1 },
        },
      });
    } else if (previousStatus === IntakeLogStatus.TAKEN && targetStatus !== IntakeLogStatus.TAKEN) {
      // Hủy trạng thái đã uống -> Cộng hoàn trả 1 liều
      await tx.memberSupplementSchedule.update({
        where: { id: scheduleId },
        data: {
          servingsRemaining: { increment: 1 },
        },
      });
    }

    return log;
  });
}

/**
 * Thống kê Admin KPIs cho Phân hệ Tủ Thuốc Gia Đình
 */
export async function calculateFamilyHealthAdminStats() {
  const [
    totalProfiles,
    totalMembers,
    totalSchedules,
    urgentRestocks,
  ] = await Promise.all([
    prisma.user.count({
      where: { familyMembers: { some: {} } },
    }),
    prisma.familyMemberProfile.count(),
    prisma.memberSupplementSchedule.count({
      where: { isActive: true },
    }),
    prisma.memberSupplementSchedule.findMany({
      where: {
        isActive: true,
        servingsRemaining: { lte: 7 }, // Sắp hết trong 7 ngày
      },
      include: {
        memberProfile: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                phone: true,
                email: true,
              },
            },
          },
        },
        product: {
          select: {
            id: true,
            name: true,
            slug: true,
            variants: {
              where: { isActive: true },
              select: { id: true, price: true, image: true, stock: true },
              take: 1,
            },
          },
        },
      },
      orderBy: [{ servingsRemaining: "asc" }],
      take: 20,
    }),
  ]);

  return {
    totalProfiles,
    totalMembers,
    totalSchedules,
    urgentRestocksCount: urgentRestocks.length,
    urgentRestocks,
  };
}
