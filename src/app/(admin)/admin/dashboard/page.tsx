// ============================================================
// app/(admin)/admin/dashboard/page.tsx
// Trang Tổng Quan Admin CMS Dashboard (Module 6.1)
// ============================================================

import React from "react";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { AdminPageHeader } from "@/components/admin/ui/AdminPageHeader";
import { AdminCard } from "@/components/admin/ui/AdminCard";
import {
  ShoppingBag,
  Package,
  Users,
  Star,
  Tag,
  ArrowRight,
  Clock,
  ShieldCheck,
  Server,
  Layers,
  ArrowUpRight,
} from "lucide-react";

export default async function AdminDashboardPage() {
  const session = await auth();

  // Thống kê nhanh cơ bản cho dashboard
  const [
    pendingOrdersCount,
    pendingReviewsCount,
    totalProducts,
    totalUsers,
    totalCategories,
  ] = await Promise.all([
    prisma.order.count({ where: { orderStatus: "PENDING" } }),
    prisma.review.count({ where: { status: "PENDING" } }),
    prisma.product.count({ where: { isActive: true } }),
    prisma.user.count({ where: { role: "CUSTOMER" } }),
    prisma.category.count(),
  ]);

  return (
    <div className="space-y-6">
      {/* ── Tiêu đề trang & Breadcrumbs ───────────────────────── */}
      <AdminPageHeader
        title="Tổng Quan Quản Trị Hệ Thống"
        description="Chào mừng quay trở lại. Quản lý toàn bộ danh mục, đơn hàng, sản phẩm và khách hàng tại đây."
        breadcrumbs={[{ label: "Dashboard" }]}
        actions={
          <div className="flex items-center gap-2.5">
            <Link
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-slate-700 bg-white border border-slate-300 rounded-xl hover:bg-slate-50 transition-colors shadow-xs"
            >
              <span>Xem Cửa Hàng Live</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-slate-500" />
            </Link>
          </div>
        }
      />

      {/* ── Welcome Banner ────────────────────────────────────── */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-slate-800 to-wine-900 text-white p-6 sm:p-8 shadow-sm">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-amber-300 text-xs font-semibold mb-3 border border-white/15">
            <ShieldCheck className="w-4 h-4 text-amber-400" />
            <span>Phân quyền Quản trị cao nhất (ADMIN)</span>
          </div>

          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white mb-2">
            Xin chào, {session?.user?.name || "Quản trị viên"}!
          </h2>

          <p className="text-sm text-slate-300 leading-relaxed">
            Hệ thống CMS THUYNGA Shop đã hoàn thiện Khung Layout, Sidebar điều
            hướng đa cấp, phân quyền RBAC và kiểm soát truy cập an toàn.
          </p>

          <div className="mt-5 flex items-center gap-4 flex-wrap">
            <Link
              href="/admin/don-hang"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-wine-800 hover:bg-wine-700 text-white shadow-md transition-all border border-wine-500/40"
            >
              <ShoppingBag className="w-4 h-4 text-amber-300" />
              <span>Xem danh sách đơn hàng</span>
            </Link>

            <Link
              href="/admin/san-pham"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-white/10 hover:bg-white/20 text-white transition-all border border-white/20"
            >
              <Package className="w-4 h-4 text-white" />
              <span>Quản lý kho sản phẩm</span>
            </Link>
          </div>
        </div>

        {/* Decorative background shape */}
        <div className="absolute -right-8 -bottom-10 w-64 h-64 bg-wine-800/20 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* ── Action Alerts (Đơn hàng / Đánh giá cần duyệt) ──────── */}
      {(pendingOrdersCount > 0 || pendingReviewsCount > 0) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {pendingOrdersCount > 0 && (
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-sm">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-amber-900">
                    {pendingOrdersCount} đơn hàng chờ xác nhận
                  </h4>
                  <p className="text-xs text-amber-700 mt-0.5">
                    Khách đã đặt đơn mới, vui lòng kiểm tra và đóng gói giao hàng.
                  </p>
                </div>
              </div>
              <Link
                href="/admin/don-hang?status=PENDING"
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold bg-amber-600 hover:bg-amber-700 text-white transition-colors shrink-0"
              >
                <span>Xử lý ngay</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          )}

          {pendingReviewsCount > 0 && (
            <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-rose-500 text-white flex items-center justify-center shrink-0 shadow-sm">
                  <Star className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-rose-900">
                    {pendingReviewsCount} đánh giá chờ kiểm duyệt
                  </h4>
                  <p className="text-xs text-rose-700 mt-0.5">
                    Đánh giá từ khách hàng cần phê duyệt trước khi hiển thị lên sản phẩm.
                  </p>
                </div>
              </div>
              <Link
                href="/admin/danh-gia?status=PENDING"
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white transition-colors shrink-0"
              >
                <span>Kiểm duyệt</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          )}
        </div>
      )}

      {/* ── Quick Stats Grid ──────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <AdminCard className="hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Sản Phẩm Trong Kho
            </span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900">
              {totalProducts}
            </span>
            <span className="text-xs text-slate-500 font-medium">sản phẩm</span>
          </div>
        </AdminCard>

        <AdminCard className="hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Ngành Hàng / Danh Mục
            </span>
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900">
              {totalCategories}
            </span>
            <span className="text-xs text-slate-500 font-medium">danh mục</span>
          </div>
        </AdminCard>

        <AdminCard className="hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Khách Hàng Đăng Ký
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900">
              {totalUsers}
            </span>
            <span className="text-xs text-slate-500 font-medium">thành viên</span>
          </div>
        </AdminCard>

        <AdminCard className="hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Trạng Thái Hệ Thống
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <Server className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-sm font-bold text-emerald-600">
              Trực tuyến 100%
            </span>
          </div>
        </AdminCard>
      </div>

      {/* ── Quản Lý Nhanh Hệ Thống (Module Shortcuts) ─────────── */}
      <AdminCard
        title="Các Phân Hệ Quản Trị Hệ Thống"
        description="Truy cập nhanh vào các khu vực quản lý dữ liệu CMS"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Link
            href="/admin/don-hang"
            className="p-4 rounded-xl border border-slate-200/80 hover:border-wine-300 hover:bg-wine-50/30 transition-all group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center group-hover:scale-110 transition-transform">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-bold text-slate-800 group-hover:text-wine-800 transition-colors">
                  Quản Lý Đơn Hàng
                </h4>
                <p className="text-xs text-slate-500 truncate mt-0.5">
                  Xác nhận, đóng gói, giao hàng & in vận đơn
                </p>
              </div>
            </div>
          </Link>

          <Link
            href="/admin/san-pham"
            className="p-4 rounded-xl border border-slate-200/80 hover:border-wine-300 hover:bg-wine-50/30 transition-all group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Package className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-bold text-slate-800 group-hover:text-wine-800 transition-colors">
                  Sản Phẩm & Tồn Kho
                </h4>
                <p className="text-xs text-slate-500 truncate mt-0.5">
                  Thêm mới, sửa giá, tải ảnh & cảnh báo hết hàng
                </p>
              </div>
            </div>
          </Link>

          <Link
            href="/admin/danh-muc"
            className="p-4 rounded-xl border border-slate-200/80 hover:border-wine-300 hover:bg-wine-50/30 transition-all group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-800 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Layers className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-bold text-slate-800 group-hover:text-wine-800 transition-colors">
                  Ngành Hàng & Danh Mục
                </h4>
                <p className="text-xs text-slate-500 truncate mt-0.5">
                  Phân cấp danh mục cha/con & icon hiển thị
                </p>
              </div>
            </div>
          </Link>

          <Link
            href="/admin/voucher"
            className="p-4 rounded-xl border border-slate-200/80 hover:border-wine-300 hover:bg-wine-50/30 transition-all group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Tag className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-bold text-slate-800 group-hover:text-wine-800 transition-colors">
                  Mã Giảm Giá Voucher
                </h4>
                <p className="text-xs text-slate-500 truncate mt-0.5">
                  Chiết khấu %, giảm tiền, giới hạn lượt dùng
                </p>
              </div>
            </div>
          </Link>

          <Link
            href="/admin/khach-hang"
            className="p-4 rounded-xl border border-slate-200/80 hover:border-wine-300 hover:bg-wine-50/30 transition-all group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-800 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Users className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-bold text-slate-800 group-hover:text-wine-800 transition-colors">
                  Quản Lý Khách Hàng
                </h4>
                <p className="text-xs text-slate-500 truncate mt-0.5">
                  Danh sách thành viên, lịch sử mua & khóa tài khoản
                </p>
              </div>
            </div>
          </Link>

          <Link
            href="/admin/danh-gia"
            className="p-4 rounded-xl border border-slate-200/80 hover:border-wine-300 hover:bg-wine-50/30 transition-all group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-800 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Star className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-bold text-slate-800 group-hover:text-wine-800 transition-colors">
                  Kiểm Duyệt Đánh Giá
                </h4>
                <p className="text-xs text-slate-500 truncate mt-0.5">
                  Duyệt đánh giá sao, bình luận & phản hồi khách
                </p>
              </div>
            </div>
          </Link>
        </div>
      </AdminCard>
    </div>
  );
}
