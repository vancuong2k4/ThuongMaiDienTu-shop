// ============================================================
// app/api/user/subscriptions/[id]/action/route.ts
// REST API Thao Tác Gói Giao Định Kỳ (Tạm Dừng, Bỏ Qua, Giao Ngay, Hủy) (Stage 13.2)
// ============================================================

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { subscriptionActionSchema } from "@/lib/validations/subscription";
import {
  calculateNextDeliveryDate,
  createOrderFromSubscription,
} from "@/lib/subscription";
import { createInAppNotification } from "@/lib/notifications";
import { SubscriptionFrequency, SubscriptionStatus } from "@prisma/client";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function PATCH(req: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const userId = session.user.id;

    // Tìm gói định kỳ và kiểm tra quyền sở hữu
    const subscription = await prisma.subscription.findUnique({
      where: { id },
    });

    if (!subscription) {
      return NextResponse.json(
        { error: "Không tìm thấy gói giao định kỳ" },
        { status: 404 }
      );
    }

    if (subscription.userId !== userId && session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Bạn không có quyền thao tác trên gói định kỳ này" },
        { status: 403 }
      );
    }

    const body = await req.json();
    const parsed = subscriptionActionSchema.safeParse(body);

    if (!parsed.success) {
      const firstError = parsed.error.issues[0]?.message || "Hành động không hợp lệ";
      return NextResponse.json({ error: firstError }, { status: 400 });
    }

    const { action, frequency: newFrequency, reason } = parsed.data;

    let updatedSubscription = null;
    let message = "";
    const now = new Date();

    switch (action) {
      case "PAUSE": {
        if (subscription.status !== SubscriptionStatus.ACTIVE) {
          return NextResponse.json(
            { error: "Chỉ gói đang hoạt động mới có thể tạm dừng" },
            { status: 400 }
          );
        }

        updatedSubscription = await prisma.subscription.update({
          where: { id },
          data: {
            status: SubscriptionStatus.PAUSED,
            pausedAt: now,
          },
        });
        message = "Đã tạm dừng gói định kỳ thành công. Bạn có thể kích hoạt lại bất cứ lúc nào.";

        await createInAppNotification({
          userId,
          type: "SYSTEM",
          title: `⏸️ Đã tạm dừng gói định kỳ #${subscription.subscriptionNumber}`,
          message: "Gói giao hàng của bạn đã tạm dừng nhận đơn mới. Khi có nhu cầu tiếp tục, bạn chỉ cần bấm 'Tiếp tục' trong trang quản lý.",
          link: "/tai-khoan/dinh-ky",
        });
        break;
      }

      case "RESUME": {
        if (subscription.status !== SubscriptionStatus.PAUSED) {
          return NextResponse.json(
            { error: "Chỉ gói đang tạm dừng mới có thể kích hoạt lại" },
            { status: 400 }
          );
        }

        // Nếu ngày giao kế tiếp đã qua, tính lại từ hôm nay
        let nextDelivery = subscription.nextDeliveryDate;
        if (nextDelivery < now) {
          nextDelivery = calculateNextDeliveryDate(now, subscription.frequency);
        }

        updatedSubscription = await prisma.subscription.update({
          where: { id },
          data: {
            status: SubscriptionStatus.ACTIVE,
            pausedAt: null,
            nextDeliveryDate: nextDelivery,
          },
        });
        message = `Đã kích hoạt lại gói định kỳ! Kỳ giao tiếp theo: ${nextDelivery.toLocaleDateString("vi-VN")}.`;

        await createInAppNotification({
          userId,
          type: "SYSTEM",
          title: `▶️ Gói định kỳ #${subscription.subscriptionNumber} đã hoạt động trở lại!`,
          message: `Lịch giao hàng định kỳ tiếp theo của bạn dự kiến vào ngày ${nextDelivery.toLocaleDateString("vi-VN")}.`,
          link: "/tai-khoan/dinh-ky",
        });
        break;
      }

      case "SKIP_NEXT": {
        if (subscription.status !== SubscriptionStatus.ACTIVE) {
          return NextResponse.json(
            { error: "Gói định kỳ phải đang hoạt động để bỏ qua lần giao" },
            { status: 400 }
          );
        }

        const currentNext = subscription.nextDeliveryDate > now ? subscription.nextDeliveryDate : now;
        const newNextDelivery = calculateNextDeliveryDate(currentNext, subscription.frequency);

        updatedSubscription = await prisma.subscription.update({
          where: { id },
          data: {
            nextDeliveryDate: newNextDelivery,
          },
        });
        message = `Đã dời lần giao tiếp theo sang ngày: ${newNextDelivery.toLocaleDateString("vi-VN")}.`;
        break;
      }

      case "DELIVER_NOW": {
        // Sinh đơn hàng mới ngay lập tức
        const newOrder = await createOrderFromSubscription(id);
        updatedSubscription = await prisma.subscription.findUnique({
          where: { id },
        });
        message = `Đã đặt giao ngay hôm nay thành công! Mã đơn hàng: #${newOrder.orderNumber}.`;
        break;
      }

      case "CANCEL": {
        updatedSubscription = await prisma.subscription.update({
          where: { id },
          data: {
            status: SubscriptionStatus.CANCELLED,
            cancelledAt: now,
            cancellationReason: reason || "Khách hàng tự hủy",
          },
        });
        message = "Đã hủy gói định kỳ thành công. Bạn vẫn có thể mua lẻ hoặc đăng ký lại bất cứ khi nào.";

        await createInAppNotification({
          userId,
          type: "SYSTEM",
          title: `❌ Gói định kỳ #${subscription.subscriptionNumber} đã hủy`,
          message: "Gói định kỳ đã được hủy thành công theo yêu cầu của bạn. Cảm ơn bạn đã đồng hành cùng THUYNGA Shop!",
          link: "/tai-khoan/dinh-ky",
        });
        break;
      }

      case "UPDATE_FREQUENCY": {
        if (!newFrequency) {
          return NextResponse.json(
            { error: "Vui lòng chọn chu kỳ giao hàng mới" },
            { status: 400 }
          );
        }

        const nextDelivery = calculateNextDeliveryDate(now, newFrequency as SubscriptionFrequency);

        updatedSubscription = await prisma.subscription.update({
          where: { id },
          data: {
            frequency: newFrequency as SubscriptionFrequency,
            nextDeliveryDate: nextDelivery,
          },
        });
        message = "Đã cập nhật chu kỳ giao hàng mới thành công.";
        break;
      }

      default:
        return NextResponse.json({ error: "Thao tác không hỗ trợ" }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      message,
      subscription: updatedSubscription,
    });
  } catch (error) {
    console.error("PATCH /api/user/subscriptions/[id]/action error:", error);
    return NextResponse.json(
      { error: (error as Error).message || "Đã xảy ra lỗi khi cập nhật gói định kỳ" },
      { status: 500 }
    );
  }
}
