// ============================================================
// components/storefront/account/AccountSidebar.tsx
// Menu điều hướng bên trái trang quản lý tài khoản người dùng
// ============================================================

"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  User,
  Package,
  Heart,
  LogOut,
  ShieldCheck,
  ChevronRight,
} from "lucide-react";

interface AccountSidebarProps {
  user: {
    name?: string | null;
    email?: string | null;
    role?: string;
  };
}

export const AccountSidebar: React.FC<AccountSidebarProps> = ({ user }) => {
  const pathname = usePathname();

  const navItems = [
    {
      label: "Thông tin tài khoản",
      href: "/tai-khoan",
      icon: User,
      exact: true,
    },
    {
      label: "Đơn hàng của tôi",
      href: "/tai-khoan/don-hang",
      icon: Package,
      exact: false,
    },
    {
      label: "Sản phẩm yêu thích",
      href: "/tai-khoan/yeu-thich",
      icon: Heart,
      exact: false,
    },
  ];

  return (
    <div className="bg-white rounded-3xl border border-neutral-200/90 shadow-sm p-5 space-y-6">
      {/* Header Profile Mini */}
      <div className="flex items-center gap-3.5 pb-5 border-b border-neutral-100">
        <div className="w-13 h-13 rounded-2xl bg-gradient-to-br from-[#800028] to-[#a80035] text-white flex items-center justify-center font-black text-xl shadow-md shadow-[#800028]/20 shrink-0">
          {user.name ? user.name.charAt(0).toUpperCase() : "U"}
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="font-extrabold text-sm text-neutral-900 truncate">
            {user.name || "Khách hàng"}
          </h3>
          <p className="text-xs text-neutral-500 truncate mt-0.5">
            {user.email}
          </p>
          <span className="inline-flex items-center gap-1 mt-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
            <ShieldCheck className="w-3 h-3 text-amber-600" />
            {user.role === "ADMIN" ? "Quản trị viên" : "Thành viên thân thiết"}
          </span>
        </div>
      </div>

      {/* Navigation List */}
      <nav className="space-y-1.5">
        {navItems.map((item) => {
          const isActive = item.exact
            ? pathname === item.href
            : pathname.startsWith(item.href);
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl font-medium text-xs sm:text-sm transition-all ${
                isActive
                  ? "bg-rose-50 text-[#800028] font-bold border border-rose-200/80 shadow-xs"
                  : "text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Icon
                  className={`w-4 h-4 ${
                    isActive ? "text-[#800028]" : "text-neutral-400"
                  }`}
                />
                <span>{item.label}</span>
              </div>
              <ChevronRight
                className={`w-4 h-4 ${
                  isActive ? "text-[#800028]" : "text-neutral-300"
                }`}
              />
            </Link>
          );
        })}

        {/* Nút đăng xuất */}
        <div className="pt-3 border-t border-neutral-100">
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
          >
            <LogOut className="w-4 h-4 text-red-500" />
            <span>Đăng xuất tài khoản</span>
          </button>
        </div>
      </nav>
    </div>
  );
};
