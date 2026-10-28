// ============================================================
// lib/services/analytics.ts
// Service Thống kê & Phân tích Dữ liệu Hệ thống Admin CMS
// ============================================================

import { prisma } from "@/lib/prisma";
import { OrderStatus } from "@prisma/client";

export type TimeRange = "today" | "7days" | "30days" | "all";

export interface AnalyticsSummary {
  range: TimeRange;
  currentRevenue: number;
  previousRevenue: number;
  revenueGrowth: number;
  totalOrders: number;
  previousOrders: number;
  ordersGrowth: number;
  pendingOrdersCount: number;
  averageOrderValue: number;
  totalCustomers: number;
  newCustomers: number;
  lowStockCount: number;
  chartData: Array<{
    date: string;
    label: string;
    revenue: number;
    orders: number;
  }>;
  statusBreakdown: Array<{
    status: OrderStatus;
    count: number;
    percentage: number;
  }>;
  lowStockItems: Array<{
    id: string;
    variantName: string;
    sku: string;
    stock: number;
    price: number;
    productId: string;
    productName: string;
    productSlug: string;
    productImage?: string | null;
  }>;
  recentOrders: Array<{
    id: string;
    orderNumber: string;
    recipientName: string;
    recipientPhone: string;
    total: number;
    paymentMethod: string;
    paymentStatus: string;
    orderStatus: OrderStatus;
    createdAt: Date;
    itemCount: number;
  }>;
  topSelling: Array<{
    productName: string;
    totalQuantity: number;
    totalRevenue: number;
  }>;
}

export async function getDashboardAnalytics(
  range: TimeRange = "7days"
): Promise<AnalyticsSummary> {
  const now = new Date();
  let startDate: Date;
  let previousStartDate: Date;
  let previousEndDate: Date;

  if (range === "today") {
    startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    previousStartDate = new Date(startDate);
    previousStartDate.setDate(previousStartDate.getDate() - 1);
    previousEndDate = new Date(startDate);
  } else if (range === "30days") {
    startDate = new Date(now);
    startDate.setDate(startDate.getDate() - 30);
    startDate.setHours(0, 0, 0, 0);

    previousStartDate = new Date(startDate);
    previousStartDate.setDate(previousStartDate.getDate() - 30);
    previousEndDate = new Date(startDate);
  } else if (range === "all") {
    startDate = new Date(2020, 0, 1);
    previousStartDate = new Date(2020, 0, 1);
    previousEndDate = new Date(2020, 0, 1);
  } else {
    // Mặc định: 7 ngày qua
    startDate = new Date(now);
    startDate.setDate(startDate.getDate() - 7);
    startDate.setHours(0, 0, 0, 0);

    previousStartDate = new Date(startDate);
    previousStartDate.setDate(previousStartDate.getDate() - 7);
    previousEndDate = new Date(startDate);
  }

  // ── 1. Truy vấn song song dữ liệu KPI ───────────────────────
  const [
    currentRevenueAgg,
    prevRevenueAgg,
    totalOrdersCount,
    prevOrdersCount,
    pendingOrdersCount,
    totalCustomersCount,
    newCustomersCount,
    lowStockCount,
    rawOrdersForChart,
    statusGroup,
    lowStockVariants,
    recentOrdersList,
    topItemsGroup,
  ] = await Promise.all([
    // Doanh thu kỳ hiện tại (không tính đơn hủy)
    prisma.order.aggregate({
      _sum: { total: true },
      where: {
        createdAt: { gte: startDate },
        orderStatus: { not: "CANCELLED" },
      },
    }),

    // Doanh thu kỳ trước (để tính % tăng trưởng)
    range !== "all"
      ? prisma.order.aggregate({
          _sum: { total: true },
          where: {
            createdAt: { gte: previousStartDate, lt: previousEndDate },
            orderStatus: { not: "CANCELLED" },
          },
        })
      : Promise.resolve({ _sum: { total: null } }),

    // Số lượng đơn hàng kỳ hiện tại
    prisma.order.count({
      where: { createdAt: { gte: startDate } },
    }),

    // Số lượng đơn hàng kỳ trước
    range !== "all"
      ? prisma.order.count({
          where: { createdAt: { gte: previousStartDate, lt: previousEndDate } },
        })
      : Promise.resolve(0),

    // Đơn hàng đang chờ duyệt
    prisma.order.count({
      where: { orderStatus: "PENDING" },
    }),

    // Tổng số khách hàng thành viên
    prisma.user.count({
      where: { role: "CUSTOMER" },
    }),

    // Khách hàng mới đăng ký trong kỳ
    prisma.user.count({
      where: { role: "CUSTOMER", createdAt: { gte: startDate } },
    }),

    // Số biến thể sản phẩm sắp hết hàng (tồn kho <= 10)
    prisma.productVariant.count({
      where: { stock: { lte: 10 }, isActive: true },
    }),

    // Đơn hàng để dựng biểu đồ doanh thu theo ngày
    prisma.order.findMany({
      where: {
        createdAt: { gte: startDate },
        orderStatus: { not: "CANCELLED" },
      },
      select: {
        createdAt: true,
        total: true,
      },
      orderBy: { createdAt: "asc" },
    }),

    // Tỷ lệ trạng thái đơn hàng
    prisma.order.groupBy({
      by: ["orderStatus"],
      _count: { id: true },
      where: { createdAt: { gte: startDate } },
    }),

    // Danh sách chi tiết các mặt hàng sắp hết hàng
    prisma.productVariant.findMany({
      where: { stock: { lte: 10 }, isActive: true },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            slug: true,
            images: {
              take: 1,
              orderBy: { sortOrder: "asc" },
            },
          },
        },
      },
      orderBy: { stock: "asc" },
      take: 8,
    }),

    // Danh sách đơn hàng mới nhất
    prisma.order.findMany({
      take: 7,
      orderBy: { createdAt: "desc" },
      include: {
        items: {
          select: { id: true },
        },
      },
    }),

    // Top sản phẩm bán chạy (dựa trên OrderItem)
    prisma.orderItem.groupBy({
      by: ["productName"],
      _sum: {
        quantity: true,
        price: true,
      },
      orderBy: {
        _sum: {
          quantity: "desc",
        },
      },
      take: 5,
    }),
  ]);

  // ── 2. Xử lý số liệu Doanh thu & Tăng trưởng ─────────────────
  const currentRevenue = Number(currentRevenueAgg._sum.total || 0);
  const previousRevenue = Number(prevRevenueAgg._sum.total || 0);

  let revenueGrowth = 0;
  if (previousRevenue > 0) {
    revenueGrowth = Number(
      (((currentRevenue - previousRevenue) / previousRevenue) * 100).toFixed(1)
    );
  } else if (currentRevenue > 0) {
    revenueGrowth = 100;
  }

  let ordersGrowth = 0;
  if (prevOrdersCount > 0) {
    ordersGrowth = Number(
      (((totalOrdersCount - prevOrdersCount) / prevOrdersCount) * 100).toFixed(1)
    );
  } else if (totalOrdersCount > 0) {
    ordersGrowth = 100;
  }

  const averageOrderValue =
    totalOrdersCount > 0 ? Math.round(currentRevenue / totalOrdersCount) : 0;

  // ── 3. Chuẩn bị dữ liệu chuỗi thời gian cho Biểu đồ (Chart) ─
  const daysCount =
    range === "today" ? 1 : range === "30days" ? 30 : range === "all" ? 14 : 7;

  // Tạo map chứa các ngày trong khoảng thời gian
  const dateMap: Record<string, { label: string; revenue: number; orders: number }> =
    {};

  for (let i = daysCount - 1; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const key = d.toISOString().split("T")[0]; // YYYY-MM-DD
    const label = `${d.getDate()}/${d.getMonth() + 1}`;
    dateMap[key] = { label, revenue: 0, orders: 0 };
  }

  // Điền đơn hàng vào map
  for (const order of rawOrdersForChart) {
    const key = order.createdAt.toISOString().split("T")[0];
    if (dateMap[key]) {
      dateMap[key].revenue += Number(order.total);
      dateMap[key].orders += 1;
    }
  }

  const chartData = Object.keys(dateMap).map((key) => ({
    date: key,
    label: dateMap[key].label,
    revenue: dateMap[key].revenue,
    orders: dateMap[key].orders,
  }));

  // ── 4. Phân phối trạng thái đơn hàng ────────────────────────
  const totalInBreakdown = statusGroup.reduce(
    (acc, curr) => acc + curr._count.id,
    0
  );
  const statusBreakdown = statusGroup.map((item) => ({
    status: item.orderStatus,
    count: item._count.id,
    percentage:
      totalInBreakdown > 0
        ? Math.round((item._count.id / totalInBreakdown) * 100)
        : 0,
  }));

  // ── 5. Chuẩn hóa danh sách cảnh báo tồn kho ─────────────────
  const lowStockItems = lowStockVariants.map((item) => ({
    id: item.id,
    variantName: item.name,
    sku: item.sku,
    stock: item.stock,
    price: Number(item.price),
    productId: item.productId,
    productName: item.product.name,
    productSlug: item.product.slug,
    productImage: item.product.images[0]?.url || item.image || null,
  }));

  // ── 6. Chuẩn hóa danh sách đơn hàng gần đây ─────────────────
  const recentOrders = recentOrdersList.map((o) => ({
    id: o.id,
    orderNumber: o.orderNumber,
    recipientName: o.recipientName,
    recipientPhone: o.recipientPhone,
    total: Number(o.total),
    paymentMethod: o.paymentMethod,
    paymentStatus: o.paymentStatus,
    orderStatus: o.orderStatus,
    createdAt: o.createdAt,
    itemCount: o.items.length,
  }));

  // ── 7. Chuẩn hóa top sản phẩm bán chạy ──────────────────────
  const topSelling = topItemsGroup.map((item) => ({
    productName: item.productName,
    totalQuantity: item._sum.quantity || 0,
    totalRevenue: Number(item._sum.price || 0),
  }));

  return {
    range,
    currentRevenue,
    previousRevenue,
    revenueGrowth,
    totalOrders: totalOrdersCount,
    previousOrders: prevOrdersCount,
    ordersGrowth,
    pendingOrdersCount,
    averageOrderValue,
    totalCustomers: totalCustomersCount,
    newCustomers: newCustomersCount,
    lowStockCount,
    chartData,
    statusBreakdown,
    lowStockItems,
    recentOrders,
    topSelling,
  };
}
