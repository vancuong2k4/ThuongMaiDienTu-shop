// ============================================================
// app/(storefront)/tai-khoan/phac-do/page.tsx
// Trang Trung Tâm Phác Đồ & Lịch Uống Của Khách Hàng (Phase 16 - Stage 16.5)
// ============================================================

import React from "react";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { AccountProtocolsHubClient } from "@/components/storefront/account-protocols/AccountProtocolsHubClient";
import type { AccountProtocolItem } from "@/components/storefront/account-protocols/types";

export const metadata: Metadata = {
  title: "Phác Đồ & Lịch Uống Vi Chất Của Tôi | THUYNGA Shop",
  description:
    "Theo dõi phác đồ dinh dưỡng chuẩn y khoa và lịch nhắc uống sữa Aptamil, vitamin Úc cá nhân hóa do Dược sĩ THUYNGA tư vấn.",
};

export const revalidate = 0;

export default async function CustomerProtocolsPage() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/dang-nhap?callbackUrl=/tai-khoan/phac-do");
  }

  const userId = session.user.id;

  // Lấy lịch sử trắc nghiệm sức khỏe & phác đồ dinh dưỡng của user
  const assessments = await prisma.userHealthAssessment.findMany({
    where: { userId },
    include: {
      protocol: {
        include: {
          items: {
            include: {
              product: {
                select: {
                  id: true,
                  name: true,
                  slug: true,
                  images: {
                    select: {
                      url: true,
                    },
                    take: 1,
                  },
                },
              },
              variant: {
                select: {
                  id: true,
                  name: true,
                  price: true,
                },
              },
            },
          },
        },
      },
      consultationBookings: {
        orderBy: { createdAt: "desc" },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  // Chuyển đổi dữ liệu chuẩn hóa dạng plain object
  const formattedAssessments: AccountProtocolItem[] = assessments.map((a) => ({
    id: a.id,
    targetGroup: a.targetGroup,
    createdAt: a.createdAt.toISOString(),
    notes: a.notes,
    quizAnswers: a.quizAnswers,
    protocol: a.protocol
      ? {
          id: a.protocol.id,
          slug: a.protocol.slug,
          title: a.protocol.title,
          subtitle: a.protocol.subtitle,
          keyNutrients: a.protocol.keyNutrients,
          pharmacistAdvice: a.protocol.pharmacistAdvice,
          dosageSchedule: a.protocol.dosageSchedule,
          comboDiscountPercent: a.protocol.comboDiscountPercent,
          items: a.protocol.items.map((item) => ({
            id: item.id,
            usageInstructions: item.usageInstructions,
            timing: item.timing,
            quantity: item.quantity,
            product: {
              id: item.product.id,
              name: item.product.name,
              slug: item.product.slug,
              images: item.product.images?.map((img) => ({ url: img.url })),
            },
            variant: item.variant
              ? {
                  id: item.variant.id,
                  name: item.variant.name,
                  price: Number(item.variant.price),
                }
              : null,
          })),
        }
      : null,
    consultationBookings: a.consultationBookings.map((b) => ({
      id: b.id,
      preferredDate: b.preferredDate.toISOString(),
      preferredTimeSlot: b.preferredTimeSlot,
      healthConcerns: b.healthConcerns,
      status: b.status,
      pharmacistNotes: b.pharmacistNotes,
    })),
  }));

  return <AccountProtocolsHubClient assessments={formattedAssessments} />;
}
