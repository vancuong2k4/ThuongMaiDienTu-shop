// ============================================================
// app/(admin)/layout.tsx – Khung Layout & Bảo Vệ RBAC Admin CMS
// ============================================================

import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { AdminShell } from "@/components/admin/layout/AdminShell";

export const metadata: Metadata = {
  title: {
    default: "Admin CMS | THUYNGA Shop",
    template: "%s | Admin THUYNGA Shop",
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // ── 1. Kiểm tra xác thực & Phân quyền RBAC ───────────────────
  const session = await auth();

  if (!session || !session.user) {
    redirect("/dang-nhap?callbackUrl=/admin/dashboard");
  }

  if (session.user.role !== "ADMIN") {
    // Không có quyền Admin → đuổi về trang chủ Storefront
    redirect("/");
  }

  // ── 2. Lấy dữ liệu thông báo thời gian thực ─────────────────
  let pendingOrdersCount = 0;
  let pendingReviewsCount = 0;

  try {
    const [ordersCount, reviewsCount] = await Promise.all([
      prisma.order.count({
        where: { orderStatus: "PENDING" },
      }),
      prisma.review.count({
        where: { status: "PENDING" },
      }),
    ]);
    pendingOrdersCount = ordersCount;
    pendingReviewsCount = reviewsCount;
  } catch (error) {
    console.error("Lỗi khi tải thông báo Admin Layout:", error);
  }

  return (
    <AdminShell
      pendingOrdersCount={pendingOrdersCount}
      pendingReviewsCount={pendingReviewsCount}
      currentUser={session.user}
    >
      {children}
    </AdminShell>
  );
}
