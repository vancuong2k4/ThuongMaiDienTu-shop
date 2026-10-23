"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Grid, Flame, ShoppingBag, User } from "lucide-react";
import { useCartStore } from "@/store/cart";
import { useEffect, useState } from "react";

export function MobileBottomNav() {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const totalItems = useCartStore((state) => state.totalItems());

  useEffect(() => {
    setMounted(true);
  }, []);

  // Ẩn thanh bottom nav trên trang checkout để tránh phân tâm khách hàng khi thanh toán
  if (pathname.startsWith("/thanh-toan")) {
    return null;
  }

  const navItems = [
    {
      label: "Trang chủ",
      href: "/",
      icon: Home,
      isActive: pathname === "/",
    },
    {
      label: "Danh mục",
      href: "/danh-muc",
      icon: Grid,
      isActive: pathname.startsWith("/danh-muc"),
    },
    {
      label: "Flash Sale",
      href: "/flash-sale",
      icon: Flame,
      isActive: pathname === "/flash-sale",
      badge: "HOT",
      isHot: true,
    },
    {
      label: "Giỏ hàng",
      href: "/gio-hang",
      icon: ShoppingBag,
      isActive: pathname === "/gio-hang",
      count: mounted ? totalItems : 0,
    },
    {
      label: "Tài khoản",
      href: "/tai-khoan",
      icon: User,
      isActive: pathname.startsWith("/tai-khoan") || pathname === "/dang-nhap",
    },
  ];

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-gray-200 z-40 lg:hidden shadow-[0_-4px_16px_rgba(0,0,0,0.06)]"
      aria-label="Thanh điều hướng dưới di động"
    >
      <div className="grid grid-cols-5 h-14 max-w-md mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`relative flex flex-col items-center justify-center gap-1 transition-colors ${
                item.isActive
                  ? "text-[#800028] font-bold"
                  : "text-gray-500 hover:text-gray-900 font-medium"
              }`}
            >
              <div className="relative">
                <Icon
                  className={`w-5 h-5 ${
                    item.isHot && !item.isActive ? "text-orange-500" : ""
                  }`}
                />

                {/* Badge số lượng giỏ hàng */}
                {item.count !== undefined && item.count > 0 && (
                  <span className="absolute -top-1.5 -right-2 bg-[#800028] text-white text-[10px] font-extrabold w-4 h-4 rounded-full flex items-center justify-center shadow">
                    {item.count > 99 ? "99+" : item.count}
                  </span>
                )}

                {/* Badge Flash sale HOT */}
                {item.badge && (
                  <span className="absolute -top-2 -right-3 bg-red-600 text-white text-[8px] font-black px-1 rounded-full uppercase tracking-tighter shadow-sm animate-pulse">
                    {item.badge}
                  </span>
                )}
              </div>

              <span className="text-[10px] tracking-tight leading-none">
                {item.label}
              </span>

              {item.isActive && (
                <span className="absolute top-0 w-8 h-0.5 bg-[#800028] rounded-full" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
