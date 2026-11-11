// ============================================================
// lib/subscription.ts
// Module Nghiệp Vụ Quản Lý & Tự Động Sinh Đơn Giao Định Kỳ (Stage 13.2)
// ============================================================

import { prisma } from "@/lib/prisma";
import {
  SubscriptionFrequency,
  SubscriptionStatus,
  PaymentMethod,
} from "@prisma/client";
import { SUBSCRIPTION_CONFIG } from "@/lib/validations/subscription";
import { createInAppNotification } from "@/lib/notifications";

/**
 * Sinh mã gói đăng ký định kỳ ngẫu nhiên: SUB-2026-XXXX
 */
export function generateSubscriptionNumber(): string {
  const year = new Date().getFullYear();
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let random = "";
  for (let i = 0; i < 4; i++) {
    random += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `${SUBSCRIPTION_CONFIG.PREFIX}-${year}-${random}`;
}

/**
 * Sinh mã đơn hàng chuẩn TN-YYYYMMDD-XXXX
 */
function generateOrderNumber(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let random = "";
  for (let i = 0; i < 4; i++) {
    random += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `TN-${year}${month}${day}-${random}`;
}

/**
 * Tính ngày giao hàng kỳ tiếp theo dựa trên chu kỳ (Frequency)
 */
export function calculateNextDeliveryDate(
  fromDate: Date,
  frequency: SubscriptionFrequency
): Date {
  const next = new Date(fromDate);
  switch (frequency) {
    case SubscriptionFrequency.EVERY_2_WEEKS:
      next.setDate(next.getDate() + 14);
      break;
    case SubscriptionFrequency.EVERY_1_MONTH:
      next.setMonth(next.getMonth() + 1);
      break;
    case SubscriptionFrequency.EVERY_2_MONTHS:
      next.setMonth(next.getMonth() + 2);
      break;
    case SubscriptionFrequency.EVERY_3_MONTHS:
      next.setMonth(next.getMonth() + 3);
      break;
    default:
      next.setMonth(next.getMonth() + 1);
  }
  return next;
}

/**
 * Tự động tạo Đơn hàng mới từ Gói Định Kỳ (Khi đến hạn hoặc khi khách bấm "Giao ngay")
 */
export async function createOrderFromSubscription(subscriptionId: string) {
  const sub = await prisma.subscription.findUnique({
    where: { id: subscriptionId },
    include: {
      items: true,
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
        },
      },
    },
  });

  if (!sub) {
    throw new Error("Không tìm thấy gói định kỳ tương ứng");
  }

  if (sub.status !== SubscriptionStatus.ACTIVE) {
    throw new Error(`Gói định kỳ hiện đang ở trạng thái "${sub.status}", không thể tạo đơn hàng.`);
  }

  if (sub.items.length === 0) {
    throw new Error("Gói định kỳ không có sản phẩm nào");
  }

  // 1. Tính toán chi phí đơn hàng
  let calculatedSubtotal = 0;
  let calculatedDiscount = 0;
  let calculatedTotal = 0;

  sub.items.forEach((item) => {
    const origPrice = Number(item.originalPrice);
    const subPrice = Number(item.price);
    const qty = item.quantity;

    calculatedSubtotal += origPrice * qty;
    calculatedDiscount += (origPrice - subPrice) * qty;
    calculatedTotal += subPrice * qty;
  });

  // 2. Tạo mã đơn hàng độc nhất
  let orderNumber = generateOrderNumber();
  let isUnique = false;
  let attempts = 0;
  while (!isUnique && attempts < 5) {
    const existing = await prisma.order.findUnique({
      where: { orderNumber },
      select: { id: true },
    });
    if (!existing) {
      isUnique = true;
    } else {
      orderNumber = generateOrderNumber();
      attempts++;
    }
  }

  const transferCode = `TN${orderNumber.replace(/[^A-Za-z0-9]/g, "").slice(-8).toUpperCase()}`;

  // 3. Thực thi transaction tạo đơn hàng & cập nhật gói định kỳ
  const newOrder = await prisma.$transaction(async (tx) => {
    // A. Tạo đơn hàng
    const order = await tx.order.create({
      data: {
        orderNumber,
        userId: sub.userId,
        subscriptionId: sub.id,
        recipientName: sub.recipientName,
        recipientPhone: sub.recipientPhone,
        shippingAddress: sub.shippingAddress,
        subtotal: calculatedSubtotal,
        shippingFee: 0, // Đặc quyền Subscribe & Save: Miễn phí vận chuyển
        discountAmount: calculatedDiscount,
        total: calculatedTotal,
        paymentMethod: sub.paymentMethod,
        paymentStatus: "PENDING",
        orderStatus: "PENDING",
        note: `[Gói Định Kỳ #${sub.subscriptionNumber}] ${sub.note || ""}`.trim(),
        transferCode: sub.paymentMethod === PaymentMethod.VIETQR ? transferCode : null,
        items: {
          create: sub.items.map((item) => ({
            variantId: item.variantId,
            productName: item.productName,
            variantName: item.variantName,
            sku: item.sku,
            price: item.price,
            quantity: item.quantity,
            image: item.image,
          })),
        },
        statusHistory: {
          create: {
            status: "PENDING",
            note: `Đơn hàng tự động phát sinh từ gói đăng ký định kỳ #${sub.subscriptionNumber}`,
          },
        },
      },
    });

    // B. Cập nhật ngày giao tiếp theo & tăng số chu kỳ
    const now = new Date();
    const nextDelivery = calculateNextDeliveryDate(now, sub.frequency);

    await tx.subscription.update({
      where: { id: sub.id },
      data: {
        lastDeliveryDate: now,
        nextDeliveryDate: nextDelivery,
        totalCyclesDelivered: { increment: 1 },
      },
    });

    return order;
  });

  // 4. Bắn thông báo In-App cho người dùng
  await createInAppNotification({
    userId: sub.userId,
    type: "ORDER_STATUS",
    title: `🔄 Đơn hàng định kỳ #${newOrder.orderNumber} đã được tạo!`,
    message: `Đơn hàng theo chu kỳ của gói #${sub.subscriptionNumber} đã được kích hoạt thành công (tiết kiệm 10% trọn đời & Freeship). Đơn hàng sẽ sớm được đóng gói và giao đến bạn.`,
    link: `/tai-khoan/don-hang/${newOrder.orderNumber}`,
  });

  return newOrder;
}

/**
 * Quét và kích hoạt tất cả gói định kỳ đến hạn giao (Run định kỳ hoặc gọi qua API)
 */
export async function processDueSubscriptions() {
  const now = new Date();
  // Tìm các gói ACTIVE có nextDeliveryDate <= now
  const dueSubscriptions = await prisma.subscription.findMany({
    where: {
      status: SubscriptionStatus.ACTIVE,
      nextDeliveryDate: { lte: now },
    },
    select: { id: true, subscriptionNumber: true },
  });

  const results = [];
  for (const sub of dueSubscriptions) {
    try {
      const order = await createOrderFromSubscription(sub.id);
      results.push({
        subscriptionId: sub.id,
        subscriptionNumber: sub.subscriptionNumber,
        orderNumber: order.orderNumber,
        status: "SUCCESS",
      });
    } catch (err) {
      console.error(`Lỗi khi tạo đơn định kỳ cho ${sub.subscriptionNumber}:`, err);
      results.push({
        subscriptionId: sub.id,
        subscriptionNumber: sub.subscriptionNumber,
        status: "FAILED",
        error: (err as Error).message,
      });
    }
  }

  return results;
}
