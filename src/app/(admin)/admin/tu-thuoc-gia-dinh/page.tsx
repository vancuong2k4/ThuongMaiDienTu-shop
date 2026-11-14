// ============================================================
// app/(admin)/admin/tu-thuoc-gia-dinh/page.tsx
// Trang Quản Trị Tủ Thuốc Gia Đình & CRM Tái Nạp (Phase 22)
// ============================================================

import React from "react";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { calculateFamilyHealthAdminStats } from "@/lib/family-health";
import { FamilyHealthAdminManager } from "@/components/admin/family-health/FamilyHealthAdminManager";
import type {
  AdminFamilyKPIs,
  AdminUrgentRestockItem,
  AdminFamilyMemberItem,
} from "@/components/admin/family-health/types";

export const metadata: Metadata = {
  title: "Quản Trị Tủ Thuốc Gia Đình & CRM Tái Nạp | Admin CMS THUYNGA Shop",
  description:
    "Theo dõi dữ liệu thể trạng gia đình khách hàng, cữ uống vi chất và danh sách khách hàng sắp hết hộp cần Dược sĩ liên hệ tái nạp.",
};

export const revalidate = 0;

export default async function AdminFamilyHealthPage() {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") {
    redirect("/dang-nhap?callbackUrl=/admin/tu-thuoc-gia-dinh");
  }

  const [rawStats, rawMembers] = await Promise.all([
    calculateFamilyHealthAdminStats(),
    prisma.familyMemberProfile.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            phone: true,
            email: true,
          },
        },
        _count: {
          select: {
            supplementSchedules: true,
          },
        },
      },
      take: 100,
    }),
  ]);

  const kpis: AdminFamilyKPIs = {
    totalProfiles: rawStats.totalProfiles,
    totalMembers: rawStats.totalMembers,
    totalSchedules: rawStats.totalSchedules,
    urgentRestocksCount: rawStats.urgentRestocksCount,
  };

  // Pure JSON serialization
  const restocks: AdminUrgentRestockItem[] = JSON.parse(
    JSON.stringify(rawStats.urgentRestocks)
  );

  const members: AdminFamilyMemberItem[] = JSON.parse(
    JSON.stringify(rawMembers)
  );

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      <FamilyHealthAdminManager
        initialKpis={kpis}
        initialRestocks={restocks}
        initialMembers={members}
      />
    </div>
  );
}
