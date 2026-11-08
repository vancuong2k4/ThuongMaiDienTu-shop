// ============================================================
// app/(admin)/admin/voucher/page.tsx
// Trang Quản Lý Mã Giảm Giá & Khuyến Mãi Admin CMS (Module 6.6)
// ============================================================

import React from "react";
import { AdminPageHeader } from "@/components/admin/ui/AdminPageHeader";
import { VoucherManager } from "@/components/admin/vouchers/VoucherManager";
import { prisma } from "@/lib/prisma";

export const metadata = {
  title: "Quản Lý Mã Giảm Giá (Voucher) | THUYNGA Shop Admin",
  description: "Tạo và quản lý các chương trình khuyến mãi, voucher chiết khấu và miễn phí vận chuyển.",
};

export default async function AdminVouchersPage() {
  const now = new Date();

  // Truy vấn song song dữ liệu thống kê ban đầu cho trang
  const [total, active, upcoming, expired, usedCountAgg, discountAgg] =
    await Promise.all([
      prisma.voucher.count(),
      prisma.voucher.count({
        where: {
          isActive: true,
          startDate: { lte: now },
          endDate: { gte: now },
        },
      }),
      prisma.voucher.count({
        where: {
          isActive: true,
          startDate: { gt: now },
        },
      }),
      prisma.voucher.count({
        where: {
          endDate: { lt: now },
        },
      }),
      prisma.voucher.aggregate({
        _sum: { usedCount: true },
      }),
      prisma.order.aggregate({
        _sum: { discountAmount: true },
        where: {
          voucherId: { not: null },
          orderStatus: { not: "CANCELLED" },
        },
      }),
    ]);

  const initialStats = {
    total,
    active,
    upcoming,
    expired,
    totalUsed: usedCountAgg._sum.usedCount || 0,
    totalDiscountGiven: Number(discountAgg._sum.discountAmount || 0),
  };

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Quản Lý Mã Giảm Giá (Voucher)"
        description="Tạo và quản lý các chương trình khuyến mãi, voucher chiết khấu theo %, tiền mặt và miễn phí vận chuyển."
        breadcrumbs={[{ label: "Khuyến mãi & Voucher" }]}
      />
      <VoucherManager initialStats={initialStats} />
    </div>
  );
}
