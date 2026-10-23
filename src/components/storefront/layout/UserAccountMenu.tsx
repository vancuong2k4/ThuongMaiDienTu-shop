"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { User, LogIn, UserPlus, Package, Heart, Shield, LogOut, ChevronDown } from "lucide-react";

export function UserAccountMenu() {
  const { data: session, status } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const isLoggedIn = status === "authenticated" && !!session?.user;
  const isAdmin = session?.user?.role === "ADMIN";

  return (
    <div ref={menuRef} className="relative">
      {isLoggedIn ? (
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-white/10 text-white transition-colors group"
          aria-expanded={isOpen}
          aria-label="Tài khoản cá nhân"
        >
          <div className="w-10 h-10 rounded-full bg-white/20 border border-white/30 flex items-center justify-center font-bold text-sm text-white">
            {session.user?.name?.charAt(0).toUpperCase() || "U"}
          </div>
          <div className="hidden lg:flex flex-col text-left">
            <span className="text-[11px] text-rose-100/80 font-medium">Xin chào,</span>
            <span className="text-sm font-semibold truncate max-w-[120px] text-white">
              {session.user?.name || "Khách hàng"}
            </span>
          </div>
          <ChevronDown className="w-4 h-4 text-white/80 group-hover:text-white transition-transform duration-200" />
        </button>
      ) : (
        <div className="flex items-center gap-1">
          <Link
            href="/dang-nhap"
            className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-white/10 text-white transition-colors"
          >
            <div className="w-10 h-10 rounded-full bg-white/15 flex items-center justify-center text-white">
              <User className="w-5 h-5 text-white" />
            </div>
            <div className="hidden lg:flex flex-col text-left">
              <span className="text-[11px] text-rose-100/80 font-medium uppercase tracking-wider">
                Tài khoản
              </span>
              <span className="text-sm font-bold text-white tracking-tight">
                Đăng nhập
              </span>
            </div>
          </Link>
        </div>
      )}

      {/* Dropdown Menu */}
      {isOpen && isLoggedIn && (
        <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-2xl border border-gray-100 py-2 z-50 animate-in fade-in-0 zoom-in-95 duration-150">
          <div className="px-4 py-3 border-b border-gray-100">
            <p className="text-sm font-bold text-gray-900 truncate">
              {session?.user?.name}
            </p>
            <p className="text-xs text-gray-500 truncate mt-0.5">
              {session?.user?.email}
            </p>
            {isAdmin && (
              <span className="inline-block mt-1.5 px-2 py-0.5 bg-rose-100 text-[#800028] text-[10px] font-bold rounded-full">
                Quản trị viên
              </span>
            )}
          </div>

          <div className="py-1">
            {isAdmin && (
              <Link
                href="/admin/dashboard"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2.5 px-4 py-2 text-sm text-[#800028] font-semibold hover:bg-rose-50 transition-colors"
              >
                <Shield className="w-4 h-4 text-[#800028]" />
                <span>Trang quản trị (Admin)</span>
              </Link>
            )}

            <Link
              href="/tai-khoan"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2.5 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#800028] transition-colors"
            >
              <User className="w-4 h-4 text-gray-400" />
              <span>Thông tin tài khoản</span>
            </Link>

            <Link
              href="/tai-khoan/don-hang"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2.5 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#800028] transition-colors"
            >
              <Package className="w-4 h-4 text-gray-400" />
              <span>Đơn hàng của tôi</span>
            </Link>

            <Link
              href="/tai-khoan/yeu-thich"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2.5 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#800028] transition-colors"
            >
              <Heart className="w-4 h-4 text-gray-400" />
              <span>Sản phẩm yêu thích</span>
            </Link>
          </div>

          <div className="border-t border-gray-100 pt-1 mt-1">
            <button
              onClick={() => {
                setIsOpen(false);
                signOut({ callbackUrl: "/" });
              }}
              className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
            >
              <LogOut className="w-4 h-4 text-red-500" />
              <span>Đăng xuất</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
