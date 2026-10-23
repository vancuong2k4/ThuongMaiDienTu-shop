"use client";

import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { useCartStore } from "@/store/cart";
import { useEffect, useState } from "react";
import { formatVND } from "@/lib/utils";

export function CartButton() {
  const [mounted, setMounted] = useState(false);
  const totalItems = useCartStore((state) => state.totalItems());
  const totalPrice = useCartStore((state) => state.totalPrice());

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <Link
      href="/gio-hang"
      className="relative flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-white/10 transition-colors group"
      aria-label="Giỏ hàng"
    >
      <div className="relative">
        <div className="w-10 h-10 rounded-full bg-white/15 flex items-center justify-center text-white group-hover:scale-105 transition-transform">
          <ShoppingBag className="w-5 h-5 text-white" />
        </div>
        {mounted && totalItems > 0 && (
          <span className="absolute -top-1 -right-1 bg-amber-400 text-[#5c001e] text-[11px] font-extrabold w-5 h-5 rounded-full flex items-center justify-center shadow-md animate-pulse">
            {totalItems > 99 ? "99+" : totalItems}
          </span>
        )}
      </div>

      <div className="hidden lg:flex flex-col text-left">
        <span className="text-[11px] text-rose-100/80 font-medium uppercase tracking-wider">
          Giỏ hàng
        </span>
        <span className="text-sm font-bold text-white tracking-tight">
          {mounted ? (totalPrice > 0 ? formatVND(totalPrice) : "0 ₫") : "0 ₫"}
        </span>
      </div>
    </Link>
  );
}
