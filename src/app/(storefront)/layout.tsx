import { prisma } from "@/lib/prisma";
import { Header } from "@/components/storefront/layout/Header";
import { Footer } from "@/components/storefront/layout/Footer";
import { MobileBottomNav } from "@/components/storefront/layout/MobileBottomNav";
import { QuickContact } from "@/components/storefront/layout/QuickContact";

export default async function StorefrontLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Query 5 ngành hàng chính cùng các danh mục con trực tiếp từ PostgreSQL
  const categories = await prisma.category.findMany({
    where: {
      parentId: null,
      isActive: true,
    },
    include: {
      children: {
        where: { isActive: true },
        orderBy: { sortOrder: "asc" },
      },
    },
    orderBy: { sortOrder: "asc" },
  });

  return (
    <div className="flex flex-col min-h-screen bg-slate-50/40">
      {/* Header chính: TopBar + MainHeader + Category Mega Menu */}
      <Header categories={categories} />

      {/* Nội dung trang storefront */}
      <div className="flex-1">{children}</div>

      {/* Footer 4 cam kết vàng + 4 cột thông tin */}
      <Footer categories={categories} />

      {/* Thanh điều hướng cố định dưới màn hình trên Mobile */}
      <MobileBottomNav />

      {/* Nút liên hệ nhanh (Zalo, Hotline, Scroll-top) */}
      <QuickContact />
    </div>
  );
}
