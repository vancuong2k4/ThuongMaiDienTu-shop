// ============================================================
// app/(storefront)/tai-khoan/thong-bao/page.tsx
// Trang Trung Tâm Thông Báo Khách Hàng In-App (Stage 11.4)
// ============================================================

import React from "react";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NotificationHubClient } from "@/components/storefront/notifications/NotificationHubClient";

export const metadata: Metadata = {
  title: "Trung Tâm Thông Báo | THUYNGA Shop",
  description:
    "Cập nhật trạng thái đơn hàng, ưu đãi Flash Sale giờ vàng và quyền lợi hội viên THUYNGA Club.",
};

export const revalidate = 0;

export default async function CustomerNotificationsPage() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/dang-nhap?callbackUrl=/tai-khoan/thong-bao");
  }

  const userId = session.user.id;

  const [totalCount, unreadCount, rawNotifications] = await Promise.all([
    prisma.notification.count({ where: { userId } }),
    prisma.notification.count({ where: { userId, isRead: false } }),
    prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 10,
      skip: 0,
    }),
  ]);

  const formattedNotifications = rawNotifications.map((n) => ({
    id: n.id,
    title: n.title,
    message: n.message,
    type: n.type,
    link: n.link,
    isRead: n.isRead,
    readAt: n.readAt ? n.readAt.toISOString() : null,
    createdAt: n.createdAt.toISOString(),
  }));

  return (
    <NotificationHubClient
      initialNotifications={formattedNotifications}
      initialUnreadCount={unreadCount}
      initialPagination={{
        page: 1,
        limit: 10,
        total: totalCount,
        totalPages: Math.ceil(totalCount / 10) || 1,
      }}
    />
  );
}
