// ============================================================
// app/(admin)/admin/vi-chat/page.tsx
// Trang Quản Trị Chỉ Tiêu Vi Chất & Quy Tắc Hiệp Đồng Dược Sĩ (Phase 19)
// ============================================================

import React from "react";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NutrientManager } from "@/components/admin/nutrients/NutrientManager";
import type { AdminNutrientItem } from "@/components/admin/nutrients/NutrientReferenceTable";
import type { AdminSynergyItem } from "@/components/admin/nutrients/NutrientSynergyList";

export const metadata: Metadata = {
  title: "Quản Lý Chỉ Tiêu Vi Chất & Hiệp Đồng Dược Sĩ | Admin CMS THUYNGA Shop",
  description:
    "Cấu hình chuẩn hóa các hoạt chất vi chất, chỉ số RDI/UL và quy tắc hiệp đồng Dược sĩ cho sản phẩm Úc nhập khẩu.",
};

export const revalidate = 0;

export default async function AdminNutrientsPage() {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") {
    redirect("/dang-nhap?callbackUrl=/admin/vi-chat");
  }

  const [nutrients, synergies, configuredProductsCount] = await Promise.all([
    prisma.nutrientReference.findMany({
      orderBy: [{ sortOrder: "asc" }, { code: "asc" }],
      include: {
        _count: {
          select: { productNutrients: true },
        },
      },
    }),
    prisma.nutrientSynergyRule.findMany({
      include: {
        primaryNutrient: {
          select: { code: true, nameVi: true, unit: true },
        },
        secondaryNutrient: {
          select: { code: true, nameVi: true, unit: true },
        },
      },
    }),
    prisma.productNutrient.groupBy({
      by: ["productId"],
    }).then((res) => res.length),
  ]);

  const formattedNutrients: AdminNutrientItem[] = nutrients.map((n) => ({
    id: n.id,
    code: n.code,
    nameVi: n.nameVi,
    nameEn: n.nameEn,
    category: n.category,
    standardRdi: n.standardRdi ? Number(n.standardRdi) : null,
    upperLimit: n.upperLimit ? Number(n.upperLimit) : null,
    unit: n.unit,
    benefitsSummary: n.benefitsSummary,
    cautionNotes: n.cautionNotes,
    _count: n._count,
  }));

  const formattedSynergies: AdminSynergyItem[] = synergies.map((s) => ({
    id: s.id,
    synergyType: s.synergyType,
    title: s.title,
    description: s.description,
    pharmacistRecommendation: s.pharmacistRecommendation,
    primaryNutrient: s.primaryNutrient,
    secondaryNutrient: s.secondaryNutrient,
  }));

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div>
        <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
          Quản Lý Chỉ Tiêu Vi Chất & Quy Tắc Hiệp Đồng
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Thiết lập mã chỉ tiêu hoạt chất, ngưỡng an toàn tối đa (UL) và kịch bản tư vấn dược học tự động cho khách hàng.
        </p>
      </div>

      {/* Main Nutrient Manager */}
      <NutrientManager
        nutrients={formattedNutrients}
        synergies={formattedSynergies}
        totalConfiguredProducts={configuredProductsCount}
      />
    </div>
  );
}
