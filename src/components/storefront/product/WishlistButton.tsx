// ============================================================
// components/storefront/product/WishlistButton.tsx
// Nút bấm Thả Tim yêu thích sản phẩm có tương tác realtime
// ============================================================

"use client";

import React, { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { Heart } from "lucide-react";

interface WishlistButtonProps {
  productId: string;
  initialIsWishlisted?: boolean;
  className?: string;
  showText?: boolean;
}

export const WishlistButton: React.FC<WishlistButtonProps> = ({
  productId,
  initialIsWishlisted = false,
  className = "",
  showText = false,
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const { status } = useSession();

  const [isWishlisted, setIsWishlisted] = useState(initialIsWishlisted);
  const [isLoading, setIsLoading] = useState(false);

  const handleToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // Nếu chưa đăng nhập -> chuyển sang đăng nhập
    if (status !== "authenticated") {
      router.push(`/dang-nhap?callbackUrl=${encodeURIComponent(pathname)}`);
      return;
    }

    // Optimistic Update
    const nextState = !isWishlisted;
    setIsWishlisted(nextState);
    setIsLoading(true);

    try {
      const res = await fetch("/api/wishlist/toggle", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId }),
      });

      const data = await res.json();
      if (!res.ok) {
        // Rollback nếu lỗi
        setIsWishlisted(!nextState);
      } else {
        setIsWishlisted(data.isWishlisted);
      }
    } catch (err) {
      console.error(err);
      setIsWishlisted(!nextState);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleToggle}
      disabled={isLoading}
      title={isWishlisted ? "Bỏ lưu sản phẩm" : "Lưu vào yêu thích"}
      className={`transition-all duration-200 cursor-pointer active:scale-90 flex items-center gap-1.5 ${className}`}
    >
      <Heart
        className={`w-5 h-5 transition-colors ${
          isWishlisted
            ? "fill-red-500 text-red-500 scale-105"
            : "text-neutral-400 hover:text-red-500"
        }`}
      />
      {showText && (
        <span
          className={`text-xs font-semibold ${
            isWishlisted ? "text-red-600" : "text-neutral-600"
          }`}
        >
          {isWishlisted ? "Đã thích" : "Yêu thích"}
        </span>
      )}
    </button>
  );
};
