// ============================================================
// middleware.ts – Route Protection & Auth Middleware
// ============================================================

import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const isLoggedIn = !!req.auth;
  const userRole = req.auth?.user?.role;

  // ── Bảo vệ Admin routes ──────────────────────────────────
  if (pathname.startsWith("/admin")) {
    if (!isLoggedIn) {
      return NextResponse.redirect(new URL("/dang-nhap", req.url));
    }
    if (userRole !== "ADMIN") {
      // Không phải admin → về trang chủ
      return NextResponse.redirect(new URL("/", req.url));
    }
  }

  // ── Bảo vệ Customer routes (cần đăng nhập) ───────────────
  if (pathname.startsWith("/tai-khoan")) {
    if (!isLoggedIn) {
      return NextResponse.redirect(
        new URL(`/dang-nhap?callbackUrl=${pathname}`, req.url)
      );
    }
  }

  // ── Redirect nếu đã đăng nhập mà vào trang login/register ─
  if (
    isLoggedIn &&
    (pathname === "/dang-nhap" || pathname === "/dang-ky")
  ) {
    if (userRole === "ADMIN") {
      return NextResponse.redirect(new URL("/admin/dashboard", req.url));
    }
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
});

// Chỉ apply middleware cho các routes cần thiết (bỏ qua static files)
export const config = {
  matcher: [
    "/admin/:path*",
    "/tai-khoan/:path*",
    "/dang-nhap",
    "/dang-ky",
    // Bỏ qua API auth routes (NextAuth tự xử lý)
    "/((?!api/auth|_next/static|_next/image|favicon.ico|public).*)",
  ],
};
