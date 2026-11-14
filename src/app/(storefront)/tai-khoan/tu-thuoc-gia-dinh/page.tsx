// ============================================================
// app/(storefront)/tai-khoan/tu-thuoc-gia-dinh/page.tsx
// Tủ Thuốc Gia Đình & Lịch Uống Thực Phẩm Chức Năng (Phase 22)
// ============================================================

import React from "react";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { calculateMemberScheduleOverview } from "@/lib/family-health";
import { FamilyVaultClient } from "@/components/storefront/family-health/FamilyVaultClient";
import type { FamilyMemberSummary } from "@/components/storefront/family-health/FamilyMemberTabs";

export const metadata: Metadata = {
  title: "Tủ Thuốc Gia Đình & Lịch Uống Chuẩn Dược Sĩ | THUYNGA Shop",
  description:
    "Quản lý tủ thuốc gia đình, hồ sơ sức khỏe từng thành viên và lịch uống thực phẩm chức năng Úc tương thích sinh học, hạn chế đối kháng vi chất.",
};

export const revalidate = 0;

export default async function FamilyVaultPage() {
  const session = await auth();
  if (!session?.user) {
    redirect("/dang-nhap?callbackUrl=/tai-khoan/tu-thuoc-gia-dinh");
  }

  const userId = session.user.id;

  // Lấy danh sách thành viên trong gia đình của user
  const dbMembers = await prisma.familyMemberProfile.findMany({
    where: { userId },
    orderBy: { createdAt: "asc" },
    include: {
      _count: {
        select: {
          supplementSchedules: true,
        },
      },
    },
  });

  const members: FamilyMemberSummary[] = dbMembers.map((m) => {
    let ageYears: number | null = null;
    if (m.dateOfBirth) {
      const diffMs = Date.now() - new Date(m.dateOfBirth).getTime();
      ageYears = Math.floor(diffMs / (1000 * 60 * 60 * 24 * 365.25));
    }
    return {
      id: m.id,
      fullName: m.fullName,
      relation: m.relation,
      avatarEmoji: m.avatarEmoji,
      healthGoals: m.healthGoals,
      allergies: m.allergies,
      dateOfBirth: m.dateOfBirth ? m.dateOfBirth.toISOString() : null,
      ageYears,
      _count: {
        supplementSchedules: m._count?.supplementSchedules ?? 0,
      },
    };
  });

  let initialOverview = null;
  if (members.length > 0) {
    const rawOverview = await calculateMemberScheduleOverview(members[0].id);
    if (rawOverview) {
      // Đảm bảo pure JSON serializable cho Client Component
      initialOverview = JSON.parse(JSON.stringify(rawOverview));
    }
  }

  return (
    <div className="min-h-screen bg-slate-50/60 pb-16 pt-6">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6">
        <FamilyVaultClient
          initialMembers={members}
          initialOverview={initialOverview}
        />
      </div>
    </div>
  );
}
