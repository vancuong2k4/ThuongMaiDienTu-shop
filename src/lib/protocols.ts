// ============================================================
// lib/protocols.ts
// Nghiệp vụ Đánh Giá Sức Khỏe & Đề Xuất Phác Đồ Cá Nhân Hóa (Phase 16)
// ============================================================

import { prisma } from "@/lib/prisma";
import { HealthTargetGroup, ConsultationStatus } from "@prisma/client";
import { SubmitAssessmentInput } from "@/lib/validations/protocol";

/**
 * Lấy danh sách câu hỏi trắc nghiệm theo nhóm đối tượng
 */
export async function getQuizQuestionsByTargetGroup(
  targetGroup: HealthTargetGroup = HealthTargetGroup.BABY_KIDS
) {
  return prisma.healthQuizQuestion.findMany({
    where: {
      targetGroup,
      isActive: true,
    },
    orderBy: { stepNumber: "asc" },
    include: {
      options: {
        orderBy: { sortOrder: "asc" },
      },
    },
  });
}

/**
 * Đánh giá câu trả lời trắc nghiệm & Khớp phác đồ tối ưu
 */
export async function evaluateAssessmentAndMatchProtocol(
  input: SubmitAssessmentInput,
  userId?: string
) {
  // 1. Phân tích các câu trả lời để tìm protocolSlug hoặc tags phù hợp nhất
  const selectedOptionIds: string[] = [];
  for (const key of Object.keys(input.answers)) {
    const val = input.answers[key];
    if (typeof val === "string") {
      selectedOptionIds.push(val);
    } else if (Array.isArray(val)) {
      selectedOptionIds.push(...val);
    }
  }

  // Truy vấn các option đã chọn để tìm protocolSlug được gán
  const selectedOptions = await prisma.quizOption.findMany({
    where: {
      id: { in: selectedOptionIds },
    },
  });

  // Tìm protocolSlug ưu tiên cao nhất
  let matchedSlug: string | null = null;
  for (const opt of selectedOptions) {
    if (opt.protocolSlug) {
      matchedSlug = opt.protocolSlug;
      break;
    }
  }

  // 2. Tìm phác đồ trong DB
  let protocol = null;
  if (matchedSlug) {
    protocol = await prisma.healthProtocol.findUnique({
      where: { slug: matchedSlug },
      include: {
        items: {
          orderBy: { sortOrder: "asc" },
          include: {
            product: {
              select: {
                id: true,
                name: true,
                slug: true,
                origin: true,
                images: {
                  take: 1,
                  orderBy: { sortOrder: "asc" },
                  select: { url: true },
                },
              },
            },
            variant: {
              select: {
                id: true,
                name: true,
                sku: true,
                price: true,
                originalPrice: true,
                stock: true,
              },
            },
          },
        },
      },
    });
  }

  // Nếu không khớp slug cụ thể, fallback lấy phác đồ đầu tiên của nhóm đối tượng
  if (!protocol) {
    protocol = await prisma.healthProtocol.findFirst({
      where: {
        targetGroup: input.targetGroup,
        isActive: true,
      },
      include: {
        items: {
          orderBy: { sortOrder: "asc" },
          include: {
            product: {
              select: {
                id: true,
                name: true,
                slug: true,
                origin: true,
                images: {
                  take: 1,
                  orderBy: { sortOrder: "asc" },
                  select: { url: true },
                },
              },
            },
            variant: {
              select: {
                id: true,
                name: true,
                sku: true,
                price: true,
                originalPrice: true,
                stock: true,
              },
            },
          },
        },
      },
    });
  }

  // 3. Tính toán tổng giá trị phác đồ & giá ưu đãi combo
  let totalPrice = 0;
  if (protocol && protocol.items) {
    for (const item of protocol.items) {
      const price = item.variant?.price
        ? Number(item.variant.price)
        : 500000;
      totalPrice += price * item.quantity;
    }
  }

  const discountPercent = protocol?.comboDiscountPercent || 10;
  const comboPrice = Math.round(totalPrice * (1 - discountPercent / 100));

  // 4. Lưu hồ sơ đánh giá sức khỏe vào cơ sở dữ liệu
  const assessment = await prisma.userHealthAssessment.create({
    data: {
      userId: userId || null,
      targetGroup: input.targetGroup,
      quizAnswers: input.answers,
      protocolId: protocol?.id || null,
      customerName: input.customerName.trim(),
      customerPhone: input.customerPhone.trim(),
      customerEmail: input.customerEmail?.trim() || null,
      notes: input.notes?.trim() || null,
      isSavedToProfile: input.isSavedToProfile || Boolean(userId),
    },
  });

  return {
    assessmentId: assessment.id,
    protocol,
    pricing: {
      totalPrice,
      discountPercent,
      comboPrice,
      savings: totalPrice - comboPrice,
    },
  };
}

/**
 * Thống kê KPI tổng quan quản trị phác đồ & lịch hẹn tư vấn
 */
export async function calculateProtocolKPIs() {
  const [
    totalAssessments,
    totalBookings,
    pendingBookings,
    completedBookings,
    totalProtocols,
  ] = await Promise.all([
    prisma.userHealthAssessment.count(),
    prisma.pharmacistConsultationBooking.count(),
    prisma.pharmacistConsultationBooking.count({
      where: { status: ConsultationStatus.PENDING },
    }),
    prisma.pharmacistConsultationBooking.count({
      where: { status: ConsultationStatus.COMPLETED },
    }),
    prisma.healthProtocol.count({ where: { isActive: true } }),
  ]);

  return {
    totalAssessments,
    totalBookings,
    pendingBookings,
    completedBookings,
    totalProtocols,
  };
}
