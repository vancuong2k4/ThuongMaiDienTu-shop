// ============================================================
// app/(admin)/admin/phac-do-dinh-duong/page.tsx
// Trang Quản Trị Phác Đồ Dinh Dưỡng & Tư Vấn Dược Sĩ Admin CMS (Phase 16)
// ============================================================

import React from "react";
import { AdminPageHeader } from "@/components/admin/ui/AdminPageHeader";
import { ProtocolManager } from "@/components/admin/protocols/ProtocolManager";
import { prisma } from "@/lib/prisma";
import { calculateProtocolKPIs } from "@/lib/protocols";
import {
  HealthProtocolItem,
  ConsultationBookingItem,
} from "@/components/admin/protocols/types";

export const metadata = {
  title: "Quản Trị Phác Đồ Dược Sĩ & Lịch Hẹn Tư Vấn | THUYNGA Shop Admin",
  description:
    "Quản lý ngân hàng phác đồ bổ sung vi chất chuẩn y khoa Úc, combo sản phẩm và danh sách lịch hẹn tư vấn 1-1 của khách hàng.",
};

export const revalidate = 0;

export default async function AdminProtocolsPage() {
  const [kpis, rawProtocols, rawBookings] = await Promise.all([
    calculateProtocolKPIs(),
    prisma.healthProtocol.findMany({
      take: 20,
      orderBy: { createdAt: "desc" },
      include: {
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                slug: true,
                images: {
                  take: 1,
                  select: { url: true },
                },
              },
            },
            variant: {
              select: {
                id: true,
                name: true,
                price: true,
                originalPrice: true,
                stock: true,
              },
            },
          },
        },
        _count: {
          select: { assessments: true },
        },
      },
    }),
    prisma.pharmacistConsultationBooking.findMany({
      take: 20,
      orderBy: { createdAt: "desc" },
      include: {
        assessment: {
          include: {
            protocol: {
              select: {
                id: true,
                title: true,
                slug: true,
                targetGroup: true,
              },
            },
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            membershipTier: true,
          },
        },
      },
    }),
  ]);

  // Chuẩn hóa dữ liệu sang JSON-safe cho Client Component
  const initialProtocols: HealthProtocolItem[] = rawProtocols.map((p) => ({
    id: p.id,
    slug: p.slug,
    title: p.title,
    targetGroup: p.targetGroup,
    subtitle: p.subtitle,
    description: p.description,
    keyNutrients: p.keyNutrients,
    pharmacistAdvice: p.pharmacistAdvice,
    dosageSchedule: p.dosageSchedule,
    comboDiscountPercent: p.comboDiscountPercent,
    isActive: p.isActive,
    items: p.items.map((it) => ({
      id: it.id,
      protocolId: it.protocolId,
      productId: it.productId,
      variantId: it.variantId,
      usageInstructions: it.usageInstructions,
      timing: it.timing,
      quantity: it.quantity,
      isEssential: it.isEssential,
      sortOrder: it.sortOrder,
      product: it.product,
      variant: it.variant
        ? {
            id: it.variant.id,
            name: it.variant.name,
            price: Number(it.variant.price),
            originalPrice: it.variant.originalPrice
              ? Number(it.variant.originalPrice)
              : null,
            stock: it.variant.stock,
          }
        : null,
    })),
    _count: p._count,
    createdAt: p.createdAt.toISOString(),
    updatedAt: p.updatedAt.toISOString(),
  }));

  const initialBookings: ConsultationBookingItem[] = rawBookings.map((b) => ({
    id: b.id,
    assessmentId: b.assessmentId,
    userId: b.userId,
    customerName: b.customerName,
    phone: b.phone,
    preferredDate: b.preferredDate.toISOString(),
    preferredTimeSlot: b.preferredTimeSlot,
    healthConcerns: b.healthConcerns,
    status: b.status,
    pharmacistNotes: b.pharmacistNotes,
    createdAt: b.createdAt.toISOString(),
    updatedAt: b.updatedAt.toISOString(),
    assessment: b.assessment,
    user: b.user,
  }));

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Quản Trị Phác Đồ Dược Sĩ & Lịch Hẹn Tư Vấn"
        description="Xây dựng lộ trình bổ sung dinh dưỡng cá nhân hóa, quản lý combo phác đồ và phân công Dược sĩ gọi điện tư vấn 1-1 cho khách hàng."
        breadcrumbs={[
          { label: "Dược sĩ & Y tế", href: "/admin/phac-do-dinh-duong" },
          { label: "Phác đồ dinh dưỡng" },
        ]}
      />
      <ProtocolManager
        initialKpis={kpis}
        initialProtocols={initialProtocols}
        initialBookings={initialBookings}
      />
    </div>
  );
}
