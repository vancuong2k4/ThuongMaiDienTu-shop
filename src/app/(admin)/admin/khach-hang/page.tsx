// ============================================================
// app/(admin)/admin/khach-hang/page.tsx
// Trang Quản Lý Khách Hàng Admin CMS (Module 6.7)
// ============================================================

import React from "react";
import { AdminPageHeader } from "@/components/admin/ui/AdminPageHeader";
import { CustomerManager } from "@/components/admin/customers/CustomerManager";
import { prisma } from "@/lib/prisma";
import { Role } from "@prisma/client";

export const metadata = {
  title: "Quản Lý Khách Hàng | THUYNGA Shop Admin",
  description: "Danh sách khách hàng, theo dõi chi tiêu trọn đời (LTV), phân hạng thành viên và quản lý tài khoản.",
};

export default async function AdminCustomersPage() {
  // Lấy dữ liệu thống kê ban đầu song song
  const [totalCustomers, activeCustomers, memberSpentAgg, customerOrders] =
    await Promise.all([
      prisma.user.count({ where: { role: Role.CUSTOMER } }),
      prisma.user.count({ where: { role: Role.CUSTOMER, isActive: true } }),
      prisma.order.aggregate({
        _sum: { total: true },
        where: {
          userId: { not: null },
          orderStatus: { not: "CANCELLED" },
        },
      }),
      prisma.user.findMany({
        where: { role: Role.CUSTOMER },
        select: {
          orders: {
            where: { orderStatus: { not: "CANCELLED" } },
            select: { total: true },
          },
        },
      }),
    ]);

  // Đếm số VIP trong tập khách hàng
  const vipCustomers = customerOrders.filter((c) => {
    const totalSpent = c.orders.reduce((sum, o) => sum + Number(o.total), 0);
    return totalSpent >= 5000000 || c.orders.length >= 3;
  }).length;

  const initialStats = {
    totalCustomers,
    activeCustomers,
    vipCustomers,
    totalSpentAll: Number(memberSpentAgg._sum.total || 0),
  };

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Quản Lý Khách Hàng"
        description="Theo dõi danh sách người dùng, thống kê giá trị trọn đời (LTV), phân hạng thành viên và kiểm soát trạng thái tài khoản."
        breadcrumbs={[{ label: "Khách hàng" }]}
      />
      <CustomerManager initialStats={initialStats} />
    </div>
  );
}
