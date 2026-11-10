// ============================================================
// lib/notifications.ts
// Service Tiện Ích Tạo & Phát Sóng Thông Báo In-App Server-Side (Stage 11.2)
// ============================================================

import { prisma } from "@/lib/prisma";
import { NotificationType, Role } from "@prisma/client";

export interface SendNotificationOptions {
  userId: string;
  title: string;
  message: string;
  type?: NotificationType;
  link?: string | null;
}

export interface BroadcastNotificationOptions {
  title: string;
  message: string;
  type?: NotificationType;
  link?: string | null;
  targetRole?: "ALL" | "CUSTOMER" | "VIP_ONLY";
}

/**
 * Tạo một thông báo đẩy In-App cho một người dùng cụ thể
 */
export async function createInAppNotification({
  userId,
  title,
  message,
  type = "SYSTEM",
  link = null,
}: SendNotificationOptions) {
  try {
    const notification = await prisma.notification.create({
      data: {
        userId,
        title,
        message,
        type,
        link,
      },
    });
    return notification;
  } catch (error) {
    console.error("Lỗi khi tạo thông báo In-App:", error);
    return null;
  }
}

/**
 * Phát sóng thông báo đẩy In-App đến nhóm người dùng mục tiêu
 */
export async function broadcastInAppNotification({
  title,
  message,
  type = "PROMOTION",
  link = null,
  targetRole = "ALL",
}: BroadcastNotificationOptions) {
  try {
    let whereCondition: {
      role?: Role;
      membershipTier?: { in: ["SILVER", "GOLD", "DIAMOND"] };
    } = {};

    if (targetRole === "CUSTOMER") {
      whereCondition.role = Role.CUSTOMER;
    } else if (targetRole === "VIP_ONLY") {
      whereCondition = {
        role: Role.CUSTOMER,
        membershipTier: { in: ["SILVER", "GOLD", "DIAMOND"] },
      };
    }

    const targetUsers = await prisma.user.findMany({
      where: whereCondition,
      select: { id: true },
    });

    if (targetUsers.length === 0) {
      return { count: 0 };
    }

    const notificationsData = targetUsers.map((u) => ({
      userId: u.id,
      title,
      message,
      type,
      link,
    }));

    const result = await prisma.notification.createMany({
      data: notificationsData,
    });

    return { count: result.count };
  } catch (error) {
    console.error("Lỗi khi phát sóng thông báo In-App:", error);
    throw error;
  }
}
