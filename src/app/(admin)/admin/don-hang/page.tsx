// ============================================================
// app/(admin)/admin/don-hang/page.tsx
// Trang Quản Lý Đơn Hàng Admin CMS (Module 6.5)
// ============================================================

import React from "react";
import { prisma } from "@/lib/prisma";
import { AdminPageHeader } from "@/components/admin/ui/AdminPageHeader";
import { OrderFilters } from "@/components/admin/orders/OrderFilters";
import { OrderTable, type OrderItemSummary } from "@/components/admin/orders/OrderTable";
import { OrderStatus, PaymentStatus, PaymentMethod, Prisma } from "@prisma/client";
import { ShoppingBag, Clock, CheckCircle2, DollarSign } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

interface OrdersPageProps {
  searchParams: Promise<{
    page?: string;
    limit?: string;
    search?: string;
    status?: string;
    paymentStatus?: string;
    paymentMethod?: string;
    sortBy?: string;
  }>;
}

export const metadata = {
  title: "Quản Lý Đơn Hàng | Admin THUYNGA Shop",
};

export default async function AdminOrdersPage(props: OrdersPageProps) {
  const searchParams = await props.searchParams;

  const page = Math.max(1, parseInt(searchParams.page || "1"));
  const limit = Math.max(1, Math.min(100, parseInt(searchParams.limit || "10")));
  const skip = (page - 1) * limit;

  const search = searchParams.search?.trim() || "";
  const status = searchParams.status || "all";
  const paymentStatus = searchParams.paymentStatus || "all";
  const paymentMethod = searchParams.paymentMethod || "all";
  const sortBy = searchParams.sortBy || "createdAt_desc";

  // ── Xây dựng điều kiện lọc ──────────────────────────────────
  const where: Prisma.OrderWhereInput = {};

  if (search) {
    where.OR = [
      { orderNumber: { contains: search, mode: "insensitive" } },
      { recipientName: { contains: search, mode: "insensitive" } },
      { recipientPhone: { contains: search, mode: "insensitive" } },
    ];
  }

  if (status !== "all" && Object.values(OrderStatus).includes(status as OrderStatus)) {
    where.orderStatus = status as OrderStatus;
  }

  if (
    paymentStatus !== "all" &&
    Object.values(PaymentStatus).includes(paymentStatus as PaymentStatus)
  ) {
    where.paymentStatus = paymentStatus as PaymentStatus;
  }

  if (
    paymentMethod !== "all" &&
    Object.values(PaymentMethod).includes(paymentMethod as PaymentMethod)
  ) {
    where.paymentMethod = paymentMethod as PaymentMethod;
  }

  let orderBy: Prisma.OrderOrderByWithRelationInput = { createdAt: "desc" };
  if (sortBy === "createdAt_asc") orderBy = { createdAt: "asc" };
  if (sortBy === "total_desc") orderBy = { total: "desc" };
  if (sortBy === "total_asc") orderBy = { total: "asc" };

  // ── Truy vấn song song dữ liệu & thống kê ───────────────────
  const [total, orders, statusGroups, totalRevenueAgg] = await Promise.all([
    prisma.order.count({ where }),
    prisma.order.findMany({
      where,
      skip,
      take: limit,
      orderBy,
      include: {
        items: {
          select: {
            id: true,
            productName: true,
            variantName: true,
            quantity: true,
            price: true,
            image: true,
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    }),
    prisma.order.groupBy({
      by: ["orderStatus"],
      _count: { id: true },
    }),
    prisma.order.aggregate({
      _sum: { total: true },
      where: { orderStatus: { not: "CANCELLED" } },
    }),
  ]);

  // Chuẩn hóa bộ đếm trạng thái
  const countsMap: Record<string, number> = {
    all: 0,
    PENDING: 0,
    CONFIRMED: 0,
    PROCESSING: 0,
    SHIPPING: 0,
    DELIVERED: 0,
    CANCELLED: 0,
  };

  let totalAllOrders = 0;
  statusGroups.forEach((g) => {
    countsMap[g.orderStatus] = g._count.id;
    totalAllOrders += g._count.id;
  });
  countsMap.all = totalAllOrders;

  const totalPages = Math.ceil(total / limit);

  // Chuẩn hóa dữ liệu đơn hàng
  const formattedOrders: OrderItemSummary[] = orders.map((o) => {
    const itemCount = o.items.reduce((sum, it) => sum + it.quantity, 0);

    return {
      id: o.id,
      orderNumber: o.orderNumber,
      recipientName: o.recipientName,
      recipientPhone: o.recipientPhone,
      shippingAddress: o.shippingAddress,
      subtotal: Number(o.subtotal),
      shippingFee: Number(o.shippingFee),
      discountAmount: Number(o.discountAmount),
      total: Number(o.total),
      paymentMethod: o.paymentMethod,
      paymentStatus: o.paymentStatus,
      orderStatus: o.orderStatus,
      note: o.note,
      adminNote: o.adminNote,
      transferCode: o.transferCode,
      paidAt: o.paidAt,
      createdAt: o.createdAt,
      itemCount,
      user: o.user,
    };
  });

  const totalRevenue = Number(totalRevenueAgg._sum.total || 0);

  return (
    <div className="space-y-6">
      {/* ── Tiêu đề Trang ───────────────────────────────────────── */}
      <AdminPageHeader
        title="Quản Lý Đơn Hàng"
        description="Xem danh sách đơn, cập nhật tiến trình vận chuyển, kiểm tra thanh toán và in phiếu đóng gói gửi hàng."
        breadcrumbs={[{ label: "Đơn hàng" }]}
      />

      {/* ── Thẻ Thống Kê Nhanh ──────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="bg-white rounded-2xl border border-slate-200/80 p-3.5 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
              Tổng Đơn Hàng
            </span>
            <span className="text-xl font-black text-slate-900 mt-1 block">
              {countsMap.all}
            </span>
          </div>
          <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center">
            <ShoppingBag className="w-4 h-4" />
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/80 p-3.5 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
              Chờ Xác Nhận
            </span>
            <span className="text-xl font-black text-amber-600 mt-1 block">
              {countsMap.PENDING}
            </span>
          </div>
          <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
            <Clock className="w-4 h-4" />
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/80 p-3.5 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
              Đang Vận Chuyển
            </span>
            <span className="text-xl font-black text-cyan-700 mt-1 block">
              {countsMap.SHIPPING + countsMap.PROCESSING}
            </span>
          </div>
          <div className="w-8 h-8 rounded-lg bg-cyan-50 text-cyan-700 flex items-center justify-center">
            <CheckCircle2 className="w-4 h-4" />
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/80 p-3.5 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
              Doanh Số Tích Lũy
            </span>
            <span className="text-xl font-black text-wine-800 mt-1 block">
              {formatCurrency(totalRevenue)}
            </span>
          </div>
          <div className="w-8 h-8 rounded-lg bg-wine-50 text-wine-800 flex items-center justify-center">
            <DollarSign className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* ── Bộ Lọc & Tab Trạng Thái ─────────────────────────────── */}
      <OrderFilters counts={countsMap} />

      {/* ── Bảng Dữ Liệu Đơn Hàng & Phân Trang ─────────────────── */}
      <OrderTable
        orders={formattedOrders}
        page={page}
        totalPages={totalPages}
        total={total}
        limit={limit}
      />
    </div>
  );
}
