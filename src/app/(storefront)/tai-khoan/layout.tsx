// ============================================================
// app/(storefront)/tai-khoan/layout.tsx
// Layout chung cho khu vực tài khoản người dùng
// ============================================================

import React from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { AccountSidebar } from "@/components/storefront/account/AccountSidebar";
import { ChevronRight } from "lucide-react";

export default async function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect("/dang-nhap?callbackUrl=/tai-khoan");
  }

  return (
    <div className="bg-neutral-50/60 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-neutral-500 mb-6">
          <Link href="/" className="hover:text-neutral-900 transition-colors">
            Trang chủ
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-neutral-400" />
          <span className="text-neutral-900 font-semibold">Tài khoản của tôi</span>
        </nav>

        {/* 2 Cột Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Cột Trái: Sidebar Menu (4 cols) */}
          <div className="lg:col-span-4 sticky top-24">
            <AccountSidebar user={session.user} />
          </div>

          {/* Cột Phải: Nội dung từng trang (8 cols) */}
          <div className="lg:col-span-8">{children}</div>
        </div>
      </div>
    </div>
  );
}
