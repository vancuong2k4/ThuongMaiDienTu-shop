// ============================================================
// app/(admin)/admin/dashboard/page.tsx
// Trang Tổng Quan Kinh Doanh, KPIs & Cảnh Báo Kho (Module 6.2)
// ============================================================

import React from "react";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { formatCurrency } from "@/lib/utils";
import {
  getDashboardAnalytics,
  type TimeRange,
} from "@/lib/services/analytics";
import { AdminPageHeader } from "@/components/admin/ui/AdminPageHeader";
import { AdminCard } from "@/components/admin/ui/AdminCard";
import { DashboardFilter } from "@/components/admin/dashboard/DashboardFilter";
import { RevenueChart } from "@/components/admin/dashboard/RevenueChart";
import { LowStockTable } from "@/components/admin/dashboard/LowStockTable";
import { RecentOrdersTable } from "@/components/admin/dashboard/RecentOrdersTable";
import { AdminBadge } from "@/components/admin/ui/AdminBadge";
import {
  DollarSign,
  ShoppingBag,
  TrendingUp,
  TrendingDown,
  Users,
  AlertTriangle,
  Clock,
  ExternalLink,
  Flame,
  ArrowRight,
  ShieldCheck,
  CreditCard,
} from "lucide-react";

interface DashboardPageProps {
  searchParams: Promise<{
    range?: string;
  }>;
}

export default async function AdminDashboardPage(props: DashboardPageProps) {
  const searchParams = await props.searchParams;
  const range = (searchParams.range as TimeRange) || "7days";
  const session = await auth();
  const analytics = await getDashboardAnalytics(range);

  return (
    <div className="space-y-6">
      {/* ── Tiêu đề Trang & Action ─────────────────────────────── */}
      <AdminPageHeader
        title="Tổng Quan Quản Trị Hệ Thống"
        description={`Theo dõi doanh thu thực tế, tiến trình đơn hàng và cảnh báo tồn kho thời gian thực.`}
        breadcrumbs={[{ label: "Dashboard" }]}
        actions={
          <div className="flex items-center gap-2">
            <Link
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-slate-700 bg-white border border-slate-300 rounded-xl hover:bg-slate-50 transition-colors shadow-xs"
            >
              <span>Xem Cửa Hàng Live</span>
              <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
            </Link>
          </div>
        }
      />

      {/* ── Thanh Lọc Thời Gian Báo Cáo ────────────────────────── */}
      <DashboardFilter currentRange={range} />

      {/* ── Top 6 Thẻ Chỉ Số KPIs ───────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3.5">
        {/* Doanh thu thuần */}
        <AdminCard className="hover:shadow-md transition-shadow relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-[11px] font-bold uppercase tracking-wider">
              Doanh Thu Thuần
            </span>
            <div className="w-7 h-7 rounded-lg bg-wine-50 text-wine-800 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2.5">
            <p className="text-xl font-black text-slate-900 tracking-tight">
              {formatCurrency(analytics.currentRevenue)}
            </p>
            <div className="mt-1 flex items-center gap-1.5 text-[11px]">
              {analytics.revenueGrowth >= 0 ? (
                <span className="inline-flex items-center gap-0.5 font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
                  <TrendingUp className="w-3 h-3" />
                  +{analytics.revenueGrowth}%
                </span>
              ) : (
                <span className="inline-flex items-center gap-0.5 font-bold text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded">
                  <TrendingDown className="w-3 h-3" />
                  {analytics.revenueGrowth}%
                </span>
              )}
              <span className="text-slate-400">so với kỳ trước</span>
            </div>
          </div>
        </AdminCard>

        {/* Tổng đơn hàng */}
        <AdminCard className="hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-[11px] font-bold uppercase tracking-wider">
              Tổng Đơn Hàng
            </span>
            <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2.5">
            <div className="flex items-baseline gap-1.5">
              <p className="text-xl font-black text-slate-900">
                {analytics.totalOrders}
              </p>
              <span className="text-xs font-semibold text-slate-500">đơn</span>
            </div>
            <div className="mt-1 flex items-center gap-1.5 text-[11px]">
              {analytics.ordersGrowth >= 0 ? (
                <span className="inline-flex items-center gap-0.5 font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
                  <TrendingUp className="w-3 h-3" />
                  +{analytics.ordersGrowth}%
                </span>
              ) : (
                <span className="inline-flex items-center gap-0.5 font-bold text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded">
                  <TrendingDown className="w-3 h-3" />
                  {analytics.ordersGrowth}%
                </span>
              )}
              <span className="text-slate-400">tổng đơn</span>
            </div>
          </div>
        </AdminCard>

        {/* Giá trị trung bình đơn (AOV) */}
        <AdminCard className="hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-[11px] font-bold uppercase tracking-wider">
              Giá Trị TB / Đơn
            </span>
            <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center">
              <CreditCard className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2.5">
            <p className="text-xl font-black text-slate-900 tracking-tight">
              {formatCurrency(analytics.averageOrderValue)}
            </p>
            <p className="mt-1 text-[11px] text-slate-400 font-medium">
              AOV trên mỗi đơn thành công
            </p>
          </div>
        </AdminCard>

        {/* Khách hàng */}
        <AdminCard className="hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-[11px] font-bold uppercase tracking-wider">
              Khách Thành Viên
            </span>
            <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2.5">
            <div className="flex items-baseline gap-1.5">
              <p className="text-xl font-black text-slate-900">
                {analytics.totalCustomers}
              </p>
              <span className="text-xs font-semibold text-slate-500">người</span>
            </div>
            <p className="mt-1 text-[11px] font-bold text-emerald-700">
              +{analytics.newCustomers} mới trong kỳ
            </p>
          </div>
        </AdminCard>

        {/* Đơn chờ duyệt */}
        <AdminCard
          className={`hover:shadow-md transition-shadow ${
            analytics.pendingOrdersCount > 0 ? "border-amber-300 bg-amber-50/20" : ""
          }`}
        >
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-[11px] font-bold uppercase tracking-wider">
              Cần Xác Nhận
            </span>
            <div className="w-7 h-7 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2.5">
            <div className="flex items-baseline gap-1.5">
              <p className="text-xl font-black text-amber-900">
                {analytics.pendingOrdersCount}
              </p>
              <span className="text-xs font-bold text-amber-700">đơn chờ</span>
            </div>
            <Link
              href="/admin/don-hang?status=PENDING"
              className="mt-1 inline-flex items-center gap-1 text-[11px] font-bold text-amber-800 hover:text-amber-950 underline"
            >
              <span>Xử lý ngay</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </AdminCard>

        {/* Tồn kho cảnh báo */}
        <AdminCard
          className={`hover:shadow-md transition-shadow ${
            analytics.lowStockCount > 0 ? "border-rose-300 bg-rose-50/20" : ""
          }`}
        >
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-[11px] font-bold uppercase tracking-wider">
              Kho Sắp Hết
            </span>
            <div className="w-7 h-7 rounded-lg bg-rose-100 text-rose-800 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2.5">
            <div className="flex items-baseline gap-1.5">
              <p className="text-xl font-black text-rose-900">
                {analytics.lowStockCount}
              </p>
              <span className="text-xs font-bold text-rose-700">mặt hàng</span>
            </div>
            <p className="mt-1 text-[11px] font-medium text-rose-700">
              Số lượng tồn kho $\le$ 10
            </p>
          </div>
        </AdminCard>
      </div>

      {/* ── Khu Vực Giữa: Biểu Đồ Doanh Thu & Tỷ Lệ Đơn Hàng ───── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Biểu đồ Doanh thu (Chiếm 2 cột) */}
        <div className="lg:col-span-2">
          <AdminCard noPadding>
            <div className="p-5">
              <RevenueChart
                data={analytics.chartData}
                totalRevenue={analytics.currentRevenue}
                totalOrders={analytics.totalOrders}
              />
            </div>
          </AdminCard>
        </div>

        {/* Tỷ lệ trạng thái đơn hàng & Top sản phẩm (Chiếm 1 cột) */}
        <div className="space-y-6">
          {/* Trạng thái đơn hàng */}
          <AdminCard
            title="Tỷ Lệ Trạng Thái Đơn"
            description="Phân bổ đơn hàng trong khoảng thời gian đã chọn"
          >
            <div className="space-y-3.5">
              {analytics.statusBreakdown.length === 0 ? (
                <p className="text-xs text-slate-400 italic py-2">
                  Chưa có dữ liệu đơn hàng trong kỳ này.
                </p>
              ) : (
                analytics.statusBreakdown.map((item) => (
                  <div key={item.status} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <AdminBadge
                          type="order"
                          status={item.status}
                          className="text-[10px] py-0 px-2"
                        />
                      </div>
                      <span className="font-bold text-slate-800">
                        {item.count} đơn ({item.percentage}%)
                      </span>
                    </div>
                    {/* Progress Bar */}
                    <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                      <div
                        style={{ width: `${item.percentage}%` }}
                        className={`h-full rounded-full transition-all duration-500 ${
                          item.status === "DELIVERED"
                            ? "bg-emerald-500"
                            : item.status === "PENDING"
                            ? "bg-amber-500"
                            : item.status === "CANCELLED"
                            ? "bg-rose-500"
                            : "bg-blue-500"
                        }`}
                      />
                    </div>
                  </div>
                ))
              )}
            </div>
          </AdminCard>

          {/* Top Sản phẩm bán chạy */}
          <AdminCard
            title="Sản Phẩm Bán Chạy"
            description="Top mặt hàng có lượt đặt hàng cao nhất"
          >
            <div className="divide-y divide-slate-100">
              {analytics.topSelling.length === 0 ? (
                <p className="text-xs text-slate-400 italic py-2">
                  Chưa có lượt bán nào được ghi nhận.
                </p>
              ) : (
                analytics.topSelling.map((prod, idx) => (
                  <div
                    key={idx}
                    className="py-2.5 first:pt-0 last:pb-0 flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span
                        className={`w-5 h-5 rounded-md flex items-center justify-center font-bold text-[11px] shrink-0 ${
                          idx === 0
                            ? "bg-amber-100 text-amber-800 border border-amber-300"
                            : idx === 1
                            ? "bg-slate-200 text-slate-700"
                            : idx === 2
                            ? "bg-orange-100 text-orange-800"
                            : "bg-slate-100 text-slate-500"
                        }`}
                      >
                        {idx + 1}
                      </span>
                      <span className="text-xs font-semibold text-slate-800 truncate">
                        {prod.productName}
                      </span>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-xs font-bold text-wine-800">
                        {prod.totalQuantity} đã bán
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </AdminCard>
        </div>
      </div>

      {/* ── Khu Vực Dưới: Đơn Hàng Mới Nhất & Cảnh Báo Tồn Kho ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Đơn hàng mới nhất */}
        <AdminCard
          title="Đơn Hàng Mới Nhất"
          description="Danh sách các đơn khách vừa đặt trên hệ thống"
          headerAction={
            <Link
              href="/admin/don-hang"
              className="text-xs font-bold text-wine-800 hover:text-wine-900 inline-flex items-center gap-1"
            >
              <span>Xem tất cả</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          }
          noPadding
        >
          <RecentOrdersTable orders={analytics.recentOrders} />
        </AdminCard>

        {/* Cảnh báo kho sắp hết hàng */}
        <AdminCard
          title="Cảnh Báo Tồn Kho"
          description="Các sản phẩm có lượng tồn kho dưới mức an toàn (<= 10 đơn vị)"
          headerAction={
            <Link
              href="/admin/san-pham"
              className="text-xs font-bold text-wine-800 hover:text-wine-900 inline-flex items-center gap-1"
            >
              <span>Quản lý kho</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          }
          noPadding
        >
          <LowStockTable items={analytics.lowStockItems} />
        </AdminCard>
      </div>
    </div>
  );
}
