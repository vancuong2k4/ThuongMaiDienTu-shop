// ============================================================
// app/api/user/subscriptions/route.ts
// REST API Quản lý Gói Giao Hàng Định Kỳ Khách Hàng (Stage 13.2)
// ============================================================

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  createSubscriptionSchema,
  SUBSCRIPTION_CONFIG,
} from "@/lib/validations/subscription";
import {
  generateSubscriptionNumber,
  calculateNextDeliveryDate,
} from "@/lib/subscription";
import { createInAppNotification } from "@/lib/notifications";
import { SubscriptionFrequency, SubscriptionStatus, PaymentMethod } from "@prisma/client";

export const dynamic = "force-dynamic";

/**
 * GET: Lấy danh sách gói định kỳ của người dùng hiện tại
 */
export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;

    const subscriptions = await prisma.subscription.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      include: {
        items: true,
        orders: {
          orderBy: { createdAt: "desc" },
          take: 5,
          select: {
            id: true,
            orderNumber: true,
            total: true,
            orderStatus: true,
            createdAt: true,
          },
        },
      },
    });

    // Thống kê cá nhân
    const activeSubscriptions = subscriptions.filter(
      (s) => s.status === SubscriptionStatus.ACTIVE
    );
    const activeCount = activeSubscriptions.length;

    // Ngày giao sớm nhất
    let earliestNextDelivery: string | null = null;
    if (activeSubscriptions.length > 0) {
      const sortedDates = [...activeSubscriptions].sort(
        (a, b) => a.nextDeliveryDate.getTime() - b.nextDeliveryDate.getTime()
      );
      earliestNextDelivery = sortedDates[0].nextDeliveryDate.toISOString();
    }

    // Tổng số tiền tiết kiệm lũy kế từ giảm giá 10%
    let totalSavedAmount = 0;
    subscriptions.forEach((sub) => {
      let cycleSaving = 0;
      sub.items.forEach((item) => {
        cycleSaving += (Number(item.originalPrice) - Number(item.price)) * item.quantity;
      });
      totalSavedAmount += cycleSaving * sub.totalCyclesDelivered;
    });

    const formatted = subscriptions.map((sub) => {
      let subtotalPerCycle = 0;
      let totalPerCycle = 0;
      let discountPerCycle = 0;

      sub.items.forEach((item) => {
        const orig = Number(item.originalPrice);
        const discounted = Number(item.price);
        subtotalPerCycle += orig * item.quantity;
        totalPerCycle += discounted * item.quantity;
        discountPerCycle += (orig - discounted) * item.quantity;
      });

      return {
        id: sub.id,
        subscriptionNumber: sub.subscriptionNumber,
        frequency: sub.frequency,
        status: sub.status,
        discountPercent: sub.discountPercent,
        startDate: sub.startDate.toISOString(),
        nextDeliveryDate: sub.nextDeliveryDate.toISOString(),
        lastDeliveryDate: sub.lastDeliveryDate ? sub.lastDeliveryDate.toISOString() : null,
        totalCyclesDelivered: sub.totalCyclesDelivered,
        recipientName: sub.recipientName,
        recipientPhone: sub.recipientPhone,
        shippingAddress: sub.shippingAddress,
        paymentMethod: sub.paymentMethod,
        note: sub.note,
        pausedAt: sub.pausedAt ? sub.pausedAt.toISOString() : null,
        subtotalPerCycle,
        discountPerCycle,
        totalPerCycle,
        items: sub.items.map((i) => ({
          id: i.id,
          variantId: i.variantId,
          productName: i.productName,
          variantName: i.variantName,
          sku: i.sku,
          originalPrice: Number(i.originalPrice),
          price: Number(i.price),
          quantity: i.quantity,
          image: i.image,
        })),
        recentOrders: sub.orders.map((o) => ({
          id: o.id,
          orderNumber: o.orderNumber,
          total: Number(o.total),
          status: o.orderStatus,
          createdAt: o.createdAt.toISOString(),
        })),
        createdAt: sub.createdAt.toISOString(),
      };
    });

    return NextResponse.json({
      success: true,
      subscriptions: formatted,
      stats: {
        totalSubscriptions: subscriptions.length,
        activeCount,
        earliestNextDelivery,
        totalSavedAmount,
      },
    });
  } catch (error) {
    console.error("GET /api/user/subscriptions error:", error);
    return NextResponse.json(
      { error: "Đã xảy ra lỗi khi lấy danh sách gói định kỳ" },
      { status: 500 }
    );
  }
}

/**
 * POST: Đăng ký gói giao hàng định kỳ mới
 */
export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    const body = await req.json();

    const parsed = createSubscriptionSchema.safeParse(body);
    if (!parsed.success) {
      const firstError = parsed.error.issues[0]?.message || "Dữ liệu không hợp lệ";
      return NextResponse.json({ error: firstError }, { status: 400 });
    }

    const {
      frequency,
      recipientName,
      recipientPhone,
      shippingAddress,
      paymentMethod,
      note,
      startDate: inputStartDate,
      items,
    } = parsed.data;

    // Sinh mã gói ngẫu nhiên độc nhất
    let subscriptionNumber = generateSubscriptionNumber();
    let isUnique = false;
    let attempts = 0;
    while (!isUnique && attempts < 5) {
      const existing = await prisma.subscription.findUnique({
        where: { subscriptionNumber },
        select: { id: true },
      });
      if (!existing) {
        isUnique = true;
      } else {
        subscriptionNumber = generateSubscriptionNumber();
        attempts++;
      }
    }

    const now = new Date();
    const startDate = inputStartDate ? new Date(inputStartDate) : now;
    const nextDeliveryDate = calculateNextDeliveryDate(
      startDate,
      frequency as SubscriptionFrequency
    );

    const discountPercent = SUBSCRIPTION_CONFIG.DEFAULT_DISCOUNT_PERCENT; // 10%

    // Tạo bản ghi Subscription và Items
    const newSubscription = await prisma.subscription.create({
      data: {
        subscriptionNumber,
        userId,
        frequency: frequency as SubscriptionFrequency,
        status: SubscriptionStatus.ACTIVE,
        discountPercent,
        startDate,
        nextDeliveryDate,
        recipientName: recipientName.trim(),
        recipientPhone: recipientPhone.trim(),
        shippingAddress: shippingAddress.trim(),
        paymentMethod: paymentMethod as PaymentMethod,
        note: note?.trim() || null,
        items: {
          create: items.map((item) => {
            const orig = item.originalPrice;
            const discounted = Math.round(orig * (1 - discountPercent / 100));
            return {
              variantId: item.variantId || null,
              productName: item.productName.trim(),
              variantName: item.variantName.trim(),
              sku: item.sku.trim(),
              originalPrice: orig,
              price: discounted,
              quantity: item.quantity,
              image: item.image || null,
            };
          }),
        },
      },
      include: {
        items: true,
      },
    });

    // Bắn thông báo In-App chào mừng gói định kỳ
    await createInAppNotification({
      userId,
      type: "PROMOTION",
      title: `🔄 Đăng ký gói định kỳ #${subscriptionNumber} thành công!`,
      message: `Bạn đã đăng ký nhận hàng định kỳ thành công với đặc quyền giảm 10% trọn đời & Miễn phí vận chuyển. Lần giao tiếp theo dự kiến: ${nextDeliveryDate.toLocaleDateString("vi-VN")}.`,
      link: "/tai-khoan/dinh-ky",
    });

    return NextResponse.json(
      {
        success: true,
        message: "Đăng ký gói giao hàng định kỳ thành công!",
        subscription: newSubscription,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /api/user/subscriptions error:", error);
    return NextResponse.json(
      { error: "Đã xảy ra lỗi khi tạo gói định kỳ" },
      { status: 500 }
    );
  }
}
