// ============================================================
// app/(admin)/admin/tang-truong-tre-em/page.tsx
// Trang Quản Trị Thể Trạng Trẻ Em & Quy Chuẩn Pha Sữa Úc (Phase 23)
// ============================================================

import React from "react";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import {
  calculatePediatricAdminKPIs,
  getAptamilProtocols,
} from "@/lib/pediatric-growth";
import { PediatricAdminManager } from "@/components/admin/pediatric/PediatricAdminManager";
import type {
  PediatricAdminKPIs,
  AdminAptamilProtocolItem,
} from "@/components/admin/pediatric/types";

export const metadata: Metadata = {
  title: "Quản Trị Tăng Trưởng Trẻ Em & Pha Sữa Úc | Admin CMS THUYNGA Shop",
  description:
    "Phân tích bách phân vị WHO thể trạng trẻ em, tỷ lệ cân nặng/chiều cao và quản lý quy chuẩn pha sữa Aptamil Profutura Úc.",
};

export const revalidate = 0;

export default async function AdminPediatricPage() {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") {
    redirect("/dang-nhap?callbackUrl=/admin/tang-truong-tre-em");
  }

  const [rawStats, rawProtocols] = await Promise.all([
    calculatePediatricAdminKPIs(),
    getAptamilProtocols(),
  ]);

  const kpis: PediatricAdminKPIs = JSON.parse(JSON.stringify(rawStats));
  const protocols: AdminAptamilProtocolItem[] = JSON.parse(
    JSON.stringify(rawProtocols)
  );

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      <PediatricAdminManager
        initialKpis={kpis}
        initialProtocols={protocols}
      />
    </div>
  );
}
