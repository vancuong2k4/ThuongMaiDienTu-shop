"use client";

// ============================================================
// components/admin/layout/AdminHeader.tsx
// Thanh tiêu đề điều khiển trên cùng Admin CMS
// ============================================================

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { signOut } from "next-auth/react";
import {
  Menu,
  PanelLeftClose,
  PanelLeftOpen,
  ExternalLink,
  Bell,
  LogOut,
  Shield,
  User,
  ShoppingBag,
  Star,
  ChevronDown,
} from "lucide-react";

export interface AdminHeaderProps {
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  onOpenMobile: () => void;
  pendingOrdersCount?: number;
  pendingReviewsCount?: number;
  currentUser?: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
    role?: string;
  };
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({
  isCollapsed,
  onToggleCollapse,
  onOpenMobile,
  pendingOrdersCount = 0,
  pendingReviewsCount = 0,
  currentUser,
}) => {
  const [profileOpen, setProfileOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setProfileOpen(false);
      }
      if (
        notifRef.current &&
        !notifRef.current.contains(e.target as Node)
      ) {
        setNotificationsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const totalNotifications = pendingOrdersCount + pendingReviewsCount;

  return (
    <header className="sticky top-0 z-20 h-16 bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-6 flex items-center justify-between shadow-xs">
      {/* ── Left Side: Sidebar triggers & Status ───────────────────── */}
      <div className="flex items-center gap-3">
        {/* Mobile menu trigger */}
        <button
          type="button"
          onClick={onOpenMobile}
          className="lg:hidden p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
          aria-label="Mở menu quản trị"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Desktop sidebar toggle button */}
        <button
          type="button"
          onClick={onToggleCollapse}
          className="hidden lg:flex p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
          title={isCollapsed ? "Mở rộng sidebar" : "Thu hẹp sidebar"}
          aria-label={isCollapsed ? "Mở rộng sidebar" : "Thu hẹp sidebar"}
        >
          {isCollapsed ? (
            <PanelLeftOpen className="w-5 h-5 text-slate-600" />
          ) : (
            <PanelLeftClose className="w-5 h-5 text-slate-600" />
          )}
        </button>

        {/* Brand/System Tag */}
        <div className="hidden sm:flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs font-bold uppercase tracking-wider text-slate-600">
            Hệ Thống Sẵn Sàng
          </span>
        </div>
      </div>

      {/* ── Right Side: Quick Action & Profile ─────────────────────── */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* View Storefront Shortcut */}
        <Link
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="hidden sm:inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 hover:text-slate-900 border border-slate-200 transition-all"
        >
          <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
          <span>Xem Cửa Hàng</span>
        </Link>

        {/* Notification Bell Dropdown */}
        <div className="relative" ref={notifRef}>
          <button
            type="button"
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            className="relative p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            title="Thông báo hệ thống"
            aria-label="Thông báo hệ thống"
          >
            <Bell className="w-5 h-5" />
            {totalNotifications > 0 && (
              <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-wine-800 text-white text-[10px] font-bold flex items-center justify-center ring-2 ring-white">
                {totalNotifications > 9 ? "9+" : totalNotifications}
              </span>
            )}
          </button>

          {notificationsOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-slate-200 py-3 z-50 animate-in fade-in-50 zoom-in-95">
              <div className="px-4 pb-2 border-b border-slate-100 flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Cần xử lý ({totalNotifications})
                </span>
              </div>

              <div className="py-2 divide-y divide-slate-100 max-h-72 overflow-y-auto">
                <Link
                  href="/admin/don-hang?status=PENDING"
                  onClick={() => setNotificationsOpen(false)}
                  className="px-4 py-2.5 flex items-center justify-between hover:bg-slate-50 transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                      <ShoppingBag className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-800 group-hover:text-wine-800">
                        Đơn hàng chờ xác nhận
                      </p>
                      <p className="text-[11px] text-slate-500">
                        Khách đặt cần duyệt đóng gói
                      </p>
                    </div>
                  </div>
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                    {pendingOrdersCount}
                  </span>
                </Link>

                <Link
                  href="/admin/danh-gia?status=PENDING"
                  onClick={() => setNotificationsOpen(false)}
                  className="px-4 py-2.5 flex items-center justify-between hover:bg-slate-50 transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-rose-100 text-rose-700 flex items-center justify-center shrink-0">
                      <Star className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-800 group-hover:text-wine-800">
                        Đánh giá chờ duyệt
                      </p>
                      <p className="text-[11px] text-slate-500">
                        Kiểm duyệt trước khi công khai
                      </p>
                    </div>
                  </div>
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-800">
                    {pendingReviewsCount}
                  </span>
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Profile Pill Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setProfileOpen(!profileOpen)}
            className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl hover:bg-slate-100 transition-colors border border-transparent hover:border-slate-200"
            aria-label="Menu tài khoản"
          >
            <div className="w-8 h-8 rounded-full bg-wine-800 text-white flex items-center justify-center text-xs font-bold overflow-hidden shadow-xs">
              {currentUser?.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={currentUser.image}
                  alt={currentUser.name || "Admin"}
                  className="w-full h-full object-cover"
                />
              ) : (
                <User className="w-4 h-4 text-amber-300" />
              )}
            </div>
            <div className="hidden md:flex flex-col text-left">
              <span className="text-xs font-bold text-slate-800 truncate max-w-[120px]">
                {currentUser?.name || "Admin"}
              </span>
              <span className="text-[10px] text-wine-800 font-semibold tracking-wide">
                Quản Trị Viên
              </span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {profileOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in-50 zoom-in-95">
              <div className="px-4 py-2 border-b border-slate-100">
                <p className="text-xs font-bold text-slate-800 truncate">
                  {currentUser?.name || "Admin"}
                </p>
                <p className="text-[11px] text-slate-500 truncate">
                  {currentUser?.email || "admin@thuyngashop.com.vn"}
                </p>
                <div className="mt-1.5 inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-wine-50 text-wine-800 text-[10px] font-bold">
                  <Shield className="w-3 h-3 text-wine-700" />
                  <span>Quyền Quản Trị Cao Nhất</span>
                </div>
              </div>

              <div className="py-1">
                <Link
                  href="/admin/cai-dat"
                  onClick={() => setProfileOpen(false)}
                  className="block px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-wine-800 transition-colors"
                >
                  Cài đặt tài khoản
                </Link>
                <Link
                  href="/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-wine-800 transition-colors sm:hidden"
                >
                  Xem Cửa Hàng Live
                </Link>
              </div>

              <div className="pt-1 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => signOut({ callbackUrl: "/dang-nhap" })}
                  className="w-full text-left px-4 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 flex items-center gap-2 transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Đăng Xuất Khỏi Admin</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
