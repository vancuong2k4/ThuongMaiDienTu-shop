"use client";

// ============================================================
// components/admin/layout/AdminSidebar.tsx
// Thanh điều hướng bên trái Admin CMS (Hỗ trợ Co dãn & Responsive)
// ============================================================

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  FolderTree,
  Tag,
  Users,
  Star,
  Settings,
  ExternalLink,
  LogOut,
  ChevronLeft,
  ChevronRight,
  X,
  Shield,
  User,
} from "lucide-react";

export interface AdminSidebarProps {
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  isMobileOpen: boolean;
  onCloseMobile: () => void;
  pendingOrdersCount?: number;
  pendingReviewsCount?: number;
  currentUser?: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
    role?: string;
  };
}

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
  badge?: number;
  badgeColor?: string;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  isCollapsed,
  onToggleCollapse,
  isMobileOpen,
  onCloseMobile,
  pendingOrdersCount = 0,
  pendingReviewsCount = 0,
  currentUser,
}) => {
  const pathname = usePathname();

  const navItems: NavItem[] = [
    {
      label: "Tổng quan",
      href: "/admin/dashboard",
      icon: LayoutDashboard,
    },
    {
      label: "Đơn hàng",
      href: "/admin/don-hang",
      icon: ShoppingBag,
      badge: pendingOrdersCount,
      badgeColor: "bg-amber-500 text-white",
    },
    {
      label: "Sản phẩm",
      href: "/admin/san-pham",
      icon: Package,
    },
    {
      label: "Danh mục",
      href: "/admin/danh-muc",
      icon: FolderTree,
    },
    {
      label: "Mã giảm giá",
      href: "/admin/voucher",
      icon: Tag,
    },
    {
      label: "Khách hàng",
      href: "/admin/khach-hang",
      icon: Users,
    },
    {
      label: "Đánh giá",
      href: "/admin/danh-gia",
      icon: Star,
      badge: pendingReviewsCount,
      badgeColor: "bg-rose-500 text-white",
    },
    {
      label: "Cài đặt",
      href: "/admin/cai-dat",
      icon: Settings,
    },
  ];

  const isLinkActive = (href: string) => {
    if (href === "/admin/dashboard") {
      return pathname === "/admin/dashboard" || pathname === "/admin";
    }
    return pathname.startsWith(href);
  };

  const sidebarContent = (
    <div className="flex flex-col h-full bg-slate-900 text-slate-200 select-none">
      {/* ── Brand Header ────────────────────────────────────────── */}
      <div className="h-16 px-4 border-b border-slate-800 flex items-center justify-between shrink-0">
        <Link
          href="/admin/dashboard"
          className="flex items-center gap-3 overflow-hidden group"
          onClick={onCloseMobile}
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-wine-700 via-wine-800 to-slate-900 flex items-center justify-center text-white font-extrabold shadow-md shrink-0 border border-wine-500/30 group-hover:scale-105 transition-transform">
            <span className="text-amber-400 font-serif text-lg">T</span>
          </div>
          {!isCollapsed && (
            <div className="flex flex-col truncate">
              <span className="font-extrabold text-sm tracking-wide text-white group-hover:text-amber-300 transition-colors">
                THUYNGA<span className="text-wine-400 font-light ml-1">CMS</span>
              </span>
              <span className="text-[10px] text-slate-400 uppercase tracking-wider font-medium">
                Hệ thống Quản Trị
              </span>
            </div>
          )}
        </Link>

        {/* Mobile close button */}
        <button
          type="button"
          onClick={onCloseMobile}
          className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          aria-label="Đóng thanh điều hướng"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Desktop collapse toggle */}
        <button
          type="button"
          onClick={onToggleCollapse}
          className="hidden lg:flex p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          title={isCollapsed ? "Mở rộng thanh menu" : "Thu gọn thanh menu"}
          aria-label={isCollapsed ? "Mở rộng thanh menu" : "Thu gọn thanh menu"}
        >
          {isCollapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <ChevronLeft className="w-4 h-4" />
          )}
        </button>
      </div>

      {/* ── Navigation Links ────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1.5 scrollbar-thin scrollbar-thumb-slate-800">
        {!isCollapsed && (
          <div className="px-3 mb-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            Menu Quản Trị
          </div>
        )}

        {navItems.map((item) => {
          const active = isLinkActive(item.href);
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onCloseMobile}
              title={isCollapsed ? item.label : undefined}
              className={`group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all relative ${
                active
                  ? "bg-wine-800 text-white shadow-sm shadow-wine-950/40"
                  : "text-slate-300 hover:bg-slate-800/80 hover:text-white"
              } ${isCollapsed ? "justify-center" : "justify-between"}`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <Icon
                  className={`w-5 h-5 shrink-0 transition-transform group-hover:scale-110 ${
                    active ? "text-amber-300" : "text-slate-400 group-hover:text-slate-200"
                  }`}
                />
                {!isCollapsed && (
                  <span className="truncate">{item.label}</span>
                )}
              </div>

              {/* Notification Badges */}
              {item.badge !== undefined && item.badge > 0 && (
                <>
                  {!isCollapsed ? (
                    <span
                      className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                        item.badgeColor || "bg-amber-500 text-white"
                      }`}
                    >
                      {item.badge > 99 ? "99+" : item.badge}
                    </span>
                  ) : (
                    <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 rounded-full bg-amber-400 ring-2 ring-slate-900" />
                  )}
                </>
              )}
            </Link>
          );
        })}
      </div>

      {/* ── Quick Storefront Shortcut ───────────────────────────── */}
      <div className="p-3 border-t border-slate-800">
        <Link
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          title="Xem cửa hàng khách hàng (Mở tab mới)"
          className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white bg-slate-800/60 hover:bg-slate-800 transition-all border border-slate-700/60 ${
            isCollapsed ? "justify-center" : ""
          }`}
        >
          <ExternalLink className="w-4 h-4 text-emerald-400 shrink-0" />
          {!isCollapsed && (
            <div className="flex-1 flex items-center justify-between">
              <span>Xem Cửa Hàng</span>
              <span className="text-[10px] text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-1.5 py-0.5 rounded font-mono">
                Live
              </span>
            </div>
          )}
        </Link>
      </div>

      {/* ── Admin User Profile & Sign Out ───────────────────────── */}
      <div className="p-3 border-t border-slate-800 bg-slate-950/40">
        <div
          className={`flex items-center gap-3 ${
            isCollapsed ? "justify-center" : "justify-between"
          }`}
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-full bg-slate-800 border border-wine-500/40 flex items-center justify-center text-slate-200 shrink-0 font-bold text-xs uppercase overflow-hidden">
              {currentUser?.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={currentUser.image}
                  alt={currentUser.name || "Admin"}
                  className="w-full h-full object-cover"
                />
              ) : (
                <User className="w-4 h-4 text-amber-400" />
              )}
            </div>
            {!isCollapsed && (
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-bold text-white truncate flex items-center gap-1">
                  {currentUser?.name || "Admin"}
                  <Shield className="w-3 h-3 text-amber-400 shrink-0" />
                </span>
                <span className="text-[10px] text-slate-400 truncate">
                  {currentUser?.email || "admin@thuyngashop.com.vn"}
                </span>
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={() => signOut({ callbackUrl: "/dang-nhap" })}
            title="Đăng xuất khỏi CMS"
            aria-label="Đăng xuất"
            className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800/80 rounded-lg transition-colors shrink-0"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* ── Desktop Fixed Sidebar ─────────────────────────────────── */}
      <aside
        className={`hidden lg:block fixed inset-y-0 left-0 z-30 transition-[width] duration-300 ease-in-out border-r border-slate-800 ${
          isCollapsed ? "w-20" : "w-64"
        }`}
      >
        {sidebarContent}
      </aside>

      {/* ── Mobile Drawer ─────────────────────────────────────────── */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-50 lg:hidden bg-slate-900/70 backdrop-blur-sm transition-opacity"
          onClick={onCloseMobile}
        >
          <div
            className="fixed inset-y-0 left-0 w-72 max-w-[85vw] shadow-2xl transition-transform animate-in slide-in-from-left duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};
