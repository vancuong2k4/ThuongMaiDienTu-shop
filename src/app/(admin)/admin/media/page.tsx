// ============================================================
// app/(admin)/admin/media/page.tsx
// Trang Thư Viện Media Admin CMS (Module 6.9)
// ============================================================

import React from "react";
import { AdminPageHeader } from "@/components/admin/ui/AdminPageHeader";
import { MediaManager } from "@/components/admin/media/MediaManager";
import { prisma } from "@/lib/prisma";

export const metadata = {
  title: "Thư Viện Media & Kho Ảnh | THUYNGA Shop Admin",
  description: "Quản lý kho ảnh sản phẩm, banner thương hiệu, logo và tệp đa phương tiện.",
};

export default async function AdminMediaPage() {
  const statsAgg = await prisma.media.aggregate({
    _sum: { size: true },
    _count: true,
  });

  const initialStats = {
    totalFiles: statsAgg._count || 0,
    totalSizeBytes: statsAgg._sum.size || 0,
  };

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Thư Viện Media"
        description="Kho lưu trữ hình ảnh sản phẩm, banner thương hiệu, logo và tệp tải lên; sao chép liên kết ảnh sử dụng nhanh chóng."
        breadcrumbs={[{ label: "Thư viện media" }]}
      />
      <MediaManager initialStats={initialStats} />
    </div>
  );
}
