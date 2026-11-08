// ============================================================
// app/(admin)/admin/danh-gia/page.tsx
// Trang Kiểm Duyệt Đánh Giá Khách Hàng Admin CMS (Module 6.8)
// ============================================================

import React from "react";
import { AdminPageHeader } from "@/components/admin/ui/AdminPageHeader";
import { ReviewManager } from "@/components/admin/reviews/ReviewManager";
import { prisma } from "@/lib/prisma";
import { ReviewStatus } from "@prisma/client";

export const metadata = {
  title: "Kiểm Duyệt Đánh Giá Khách Hàng | THUYNGA Shop Admin",
  description: "Kiểm duyệt đánh giá, phê duyệt nhận xét công khai và loại bỏ bình luận vi phạm.",
};

export default async function AdminReviewsPage() {
  // Lấy dữ liệu thống kê ban đầu song song
  const [total, pending, approved, rejected, avgAgg] = await Promise.all([
    prisma.review.count(),
    prisma.review.count({ where: { status: ReviewStatus.PENDING } }),
    prisma.review.count({ where: { status: ReviewStatus.APPROVED } }),
    prisma.review.count({ where: { status: ReviewStatus.REJECTED } }),
    prisma.review.aggregate({
      _avg: { rating: true },
    }),
  ]);

  const rawAvg = avgAgg._avg.rating || 5.0;
  const averageRating = Math.round(rawAvg * 10) / 10;

  const initialStats = {
    total,
    pending,
    approved,
    rejected,
    averageRating,
  };

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Kiểm Duyệt Đánh Giá Khách Hàng"
        description="Kiểm duyệt bình luận, số sao và hình ảnh thực tế từ khách hàng; phê duyệt công khai hoặc tạm ẩn đánh giá vi phạm."
        breadcrumbs={[{ label: "Kiểm duyệt đánh giá" }]}
      />
      <ReviewManager initialStats={initialStats} />
    </div>
  );
}
