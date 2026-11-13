// ============================================================
// app/(admin)/admin/mua-vu-dat-truoc/page.tsx
// Trang Quản Trị Chiến Dịch Mùa Vụ Úc & Đơn Đặt Cọc (Phase 21)
// ============================================================

import React from "react";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { calculatePreOrderKPIs } from "@/lib/preorder";
import { PreOrderAdminManager } from "@/components/admin/preorder/PreOrderAdminManager";
import type {
  AdminCampaignItem,
  AdminReservationItem,
} from "@/components/admin/preorder/types";

export const metadata: Metadata = {
  title: "Quản Trị Đặt Trước Mùa Vụ Úc | Admin CMS THUYNGA Shop",
  description:
    "Quản lý chiến dịch Cherry Tasmania, Mật ong Manuka Hoàng gia, danh sách khách cọc giữ chỗ và gán chuyến bay Air Cargo.",
};

export const revalidate = 0;

export default async function AdminPreOrdersPage() {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") {
    redirect("/dang-nhap?callbackUrl=/admin/mua-vu-dat-truoc");
  }

  const [campaigns, reservations, kpis] = await Promise.all([
    prisma.seasonalCampaign.findMany({
      orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
      include: {
        tiers: {
          orderBy: { sortOrder: "asc" },
        },
        _count: {
          select: { reservations: true },
        },
      },
    }),
    prisma.preOrderReservation.findMany({
      orderBy: [{ createdAt: "desc" }],
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
            price: true,
            depositAmount: true,
          },
        },
      },
    }),
    calculatePreOrderKPIs(),
  ]);

  const serializedCampaigns: AdminCampaignItem[] = campaigns.map((c) => ({
    id: c.id,
    title: c.title,
    slug: c.slug,
    subtitle: c.subtitle,
    description: c.description,
    farmName: c.farmName,
    farmRegion: c.farmRegion,
    productCategory: c.productCategory,
    bannerImage: c.bannerImage,
    harvestStartDate: c.harvestStartDate.toISOString(),
    harvestEndDate: c.harvestEndDate.toISOString(),
    flightDepartureWeek: c.flightDepartureWeek,
    targetBrixSweetness: c.targetBrixSweetness,
    fruitSizeMm: c.fruitSizeMm,
    qualityGrade: c.qualityGrade as any,
    totalCapacityKg: c.totalCapacityKg,
    reservedCapacityKg: c.reservedCapacityKg,
    status: c.status as any,
    depositType: c.depositType as any,
    depositPercent: c.depositPercent,
    sortOrder: c.sortOrder,
    _count: c._count,
    tiers: c.tiers.map((t) => ({
      id: t.id,
      name: t.name,
      specification: t.specification,
      price: Number(t.price),
      depositAmount: Number(t.depositAmount),
      totalSlots: t.totalSlots,
      reservedSlots: t.reservedSlots,
    })),
  }));

  const serializedReservations: AdminReservationItem[] = reservations.map(
    (r) => ({
      id: r.id,
      reservationCode: r.reservationCode,
      campaignId: r.campaignId,
      tierId: r.tierId,
      userId: r.userId,
      customerName: r.customerName,
      customerPhone: r.customerPhone,
      customerEmail: r.customerEmail,
      deliveryAddress: r.deliveryAddress,
      quantity: r.quantity,
      totalPrice: Number(r.totalPrice),
      depositPaid: Number(r.depositPaid),
      remainingAmount: Number(r.remainingAmount),
      depositMethod: r.depositMethod,
      status: r.status as any,
      flightNumber: r.flightNumber,
      airWaybillNumber: r.airWaybillNumber,
      notes: r.notes,
      createdAt: r.createdAt.toISOString(),
      campaign: r.campaign,
      tier: {
        name: r.tier.name,
        specification: r.tier.specification,
        price: Number(r.tier.price),
        depositAmount: Number(r.tier.depositAmount),
      },
    })
  );

  return (
    <div className="space-y-6">
      <PreOrderAdminManager
        initialCampaigns={serializedCampaigns}
        initialReservations={serializedReservations}
        initialKpis={kpis}
      />
    </div>
  );
}
