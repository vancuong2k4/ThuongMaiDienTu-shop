// ============================================================
// app/(admin)/admin/hop-qua-bieu/page.tsx
// Trang Quản Trị Hộp Quà Biếu & Báo Giá Doanh Nghiệp (Phase 17 - Stage 17.3)
// ============================================================

import React from "react";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { calculateCorporateGiftKPIs } from "@/lib/gift-box";
import { GiftBoxManager } from "@/components/admin/gift-boxes/GiftBoxManager";
import type {
  AdminGiftBoxTemplate,
  AdminCorporateInquiry,
} from "@/components/admin/gift-boxes/types";

export const metadata: Metadata = {
  title: "Quản Lý Hộp Quà Biếu & Yêu Cầu Doanh Nghiệp | Admin CMS THUYNGA Shop",
  description:
    "Quản lý danh sách mẫu vỏ hộp quà gỗ, hộp da cao cấp và quy trình tiếp nhận, báo giá hợp đồng quà tặng B2B số lượng lớn.",
};

export const revalidate = 0;

export default async function AdminGiftBoxesPage() {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") {
    redirect("/dang-nhap?callbackUrl=/admin/hop-qua-bieu");
  }

  const [stats, templates, inquiries] = await Promise.all([
    calculateCorporateGiftKPIs(),
    prisma.giftBoxTemplate.findMany({
      orderBy: { sortOrder: "asc" },
      include: {
        _count: {
          select: { hampers: true },
        },
      },
    }),
    prisma.corporateGiftInquiry.findMany({
      orderBy: { createdAt: "desc" },
    }),
  ]);

  const formattedTemplates: AdminGiftBoxTemplate[] = templates.map((t) => ({
    id: t.id,
    name: t.name,
    slug: t.slug,
    boxType: t.boxType,
    dimensions: t.dimensions,
    basePrice: Number(t.basePrice),
    maxSlots: t.maxSlots,
    imageUrl: t.imageUrl,
    description: t.description,
    isAirCargoPledge: t.isAirCargoPledge,
    isActive: t.isActive,
    sortOrder: t.sortOrder,
    createdAt: t.createdAt.toISOString(),
    updatedAt: t.updatedAt.toISOString(),
    hamperCount: t._count.hampers,
  }));

  const formattedInquiries: AdminCorporateInquiry[] = inquiries.map((inq) => ({
    id: inq.id,
    inquiryCode: inq.inquiryCode,
    companyName: inq.companyName,
    contactPerson: inq.contactPerson,
    phone: inq.phone,
    email: inq.email,
    occasion: inq.occasion,
    quantity: inq.quantity,
    budgetPerHamper: Number(inq.budgetPerHamper),
    deliveryDeadline: inq.deliveryDeadline
      ? inq.deliveryDeadline.toISOString()
      : null,
    requiresVatInvoice: inq.requiresVatInvoice,
    customLogoBranding: inq.customLogoBranding,
    notes: inq.notes,
    status: inq.status,
    quotedTotal: inq.quotedTotal ? Number(inq.quotedTotal) : null,
    adminNotes: inq.adminNotes,
    createdAt: inq.createdAt.toISOString(),
    updatedAt: inq.updatedAt.toISOString(),
  }));

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Quản Lý Hộp Quà Biếu & Yêu Cầu B2B
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Thiết lập mẫu vỏ hộp quà tặng cao cấp, kiểm soát sức chứa và quy trình báo giá đơn hàng doanh nghiệp số lượng lớn.
          </p>
        </div>
      </div>

      {/* Main Manager Client Component */}
      <GiftBoxManager
        initialStats={stats}
        initialTemplates={formattedTemplates}
        initialInquiries={formattedInquiries}
      />
    </div>
  );
}
