// ============================================================
// app/(admin)/admin/danh-gia/page.tsx
// Trang Kiểm Duyệt Đánh Giá Khách Hàng & UGC Air-Cargo Admin CMS (Phase 14)
// ============================================================

import React from "react";
import { AdminPageHeader } from "@/components/admin/ui/AdminPageHeader";
import { ReviewManager } from "@/components/admin/reviews/ReviewManager";
import { prisma } from "@/lib/prisma";
import { ReviewStatus } from "@prisma/client";

export const metadata = {
  title: "Kiểm Duyệt Đánh Giá & UGC Air-Cargo | THUYNGA Shop Admin",
  description:
    "Kiểm duyệt nhận xét, số sao đa tiêu chí và ảnh bóc hộp air-cargo thực tế từ khách hàng; phê duyệt công khai, ghim top hoặc phản hồi từ Dược sĩ.",
};

export const revalidate = 0;

export default async function AdminReviewsPage() {
  // Lấy dữ liệu thống kê ban đầu song song
  const [total, pending, approved, rejected, featured, avgAgg, mediaCount] =
    await Promise.all([
      prisma.review.count(),
      prisma.review.count({ where: { status: ReviewStatus.PENDING } }),
      prisma.review.count({ where: { status: ReviewStatus.APPROVED } }),
      prisma.review.count({ where: { status: ReviewStatus.REJECTED } }),
      prisma.review.count({ where: { status: ReviewStatus.FEATURED } }),
      prisma.review.aggregate({
        _avg: { rating: true },
      }),
      prisma.review.count({
        where: { images: { isEmpty: false } },
      }),
    ]);

  const rawAvg = avgAgg._avg.rating || 5.0;
  const averageRating = Math.round(rawAvg * 10) / 10;
  const mediaRate = total > 0 ? Math.round((mediaCount / total) * 100) : 0;

  const initialStats = {
    total,
    pending,
    approved,
    rejected,
    featured,
    averageRating,
    mediaRate,
  };

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Kiểm Duyệt Đánh Giá & UGC Air-Cargo"
        description="Kiểm duyệt bình luận, chấm điểm đa tiêu chí, ảnh bóc hộp bay air; phê duyệt công khai, ghim top hoặc gửi phản hồi chính thức từ Dược sĩ."
        breadcrumbs={[{ label: "Marketing", href: "/admin/marketing" }, { label: "Đánh giá & UGC" }]}
      />
      <ReviewManager initialStats={initialStats} />
    </div>
  );
}
