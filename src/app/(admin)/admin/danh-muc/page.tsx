// ============================================================
// app/(admin)/admin/danh-muc/page.tsx
// Trang Quản Lý Cây Danh Mục Ngành Hàng (Module 6.4)
// ============================================================

import React from "react";
import { prisma } from "@/lib/prisma";
import { AdminPageHeader } from "@/components/admin/ui/AdminPageHeader";
import {
  CategoryTreeTable,
  type CategoryTreeItem,
} from "@/components/admin/categories/CategoryTreeTable";
import { FolderTree, Layers, Eye, Folder } from "lucide-react";

export const metadata = {
  title: "Quản Lý Danh Mục Ngành Hàng | Admin THUYNGA Shop",
};

export default async function AdminCategoriesPage() {
  // Lấy toàn bộ danh mục kèm số lượng sản phẩm liên kết
  const rawCategories = await prisma.category.findMany({
    orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
    include: {
      parent: {
        select: { id: true, name: true, slug: true },
      },
      children: {
        orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
        include: {
          _count: {
            select: { products: true },
          },
        },
      },
      _count: {
        select: { products: true, children: true },
      },
    },
  });

  // Chuẩn hóa dữ liệu cho CategoryTreeTable
  const categories: CategoryTreeItem[] = rawCategories.map((cat) => {
    const directProductCount = cat._count.products;
    const childCount = cat._count.children;
    const childrenProducts = cat.children.reduce(
      (sum, child) => sum + child._count.products,
      0
    );
    const totalProductCount = directProductCount + childrenProducts;

    return {
      id: cat.id,
      name: cat.name,
      slug: cat.slug,
      description: cat.description,
      image: cat.image,
      parentId: cat.parentId,
      parent: cat.parent,
      sortOrder: cat.sortOrder,
      isActive: cat.isActive,
      seoTitle: cat.seoTitle,
      seoDesc: cat.seoDesc,
      directProductCount,
      childCount,
      totalProductCount,
      children: cat.children.map((child) => ({
        id: child.id,
        name: child.name,
        slug: child.slug,
        description: child.description,
        image: child.image,
        parentId: child.parentId,
        sortOrder: child.sortOrder,
        isActive: child.isActive,
        directProductCount: child._count.products,
      })),
    };
  });

  // Thống kê nhanh
  const totalCategories = categories.length;
  const rootCategoriesCount = categories.filter((c) => !c.parentId).length;
  const subCategoriesCount = categories.filter((c) => !!c.parentId).length;
  const activeCount = categories.filter((c) => c.isActive).length;

  return (
    <div className="space-y-6">
      {/* ── Tiêu đề Trang ───────────────────────────────────────── */}
      <AdminPageHeader
        title="Quản Lý Danh Mục Ngành Hàng"
        description="Cấu trúc cây danh mục 2 tầng (Ngành hàng chính & Phân loại con), phân loại sản phẩm và tối ưu SEO đường dẫn."
        breadcrumbs={[{ label: "Danh mục" }]}
      />

      {/* ── Thẻ Thống Kê Nhanh ──────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="bg-white rounded-2xl border border-slate-200/80 p-3.5 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
              Tổng Danh Mục
            </span>
            <span className="text-xl font-black text-slate-900 mt-1 block">
              {totalCategories}
            </span>
          </div>
          <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center">
            <FolderTree className="w-4 h-4" />
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/80 p-3.5 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
              Ngành Hàng Gốc (Cấp 1)
            </span>
            <span className="text-xl font-black text-wine-800 mt-1 block">
              {rootCategoriesCount}
            </span>
          </div>
          <div className="w-8 h-8 rounded-lg bg-wine-50 text-wine-800 flex items-center justify-center">
            <Folder className="w-4 h-4" />
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/80 p-3.5 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
              Phân Loại Con (Cấp 2)
            </span>
            <span className="text-xl font-black text-blue-700 mt-1 block">
              {subCategoriesCount}
            </span>
          </div>
          <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center">
            <Layers className="w-4 h-4" />
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/80 p-3.5 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
              Đang Hiển Thị
            </span>
            <span className="text-xl font-black text-emerald-700 mt-1 block">
              {activeCount}
            </span>
          </div>
          <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
            <Eye className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* ── Bảng Dữ Liệu Cây Phân Cấp & Thao Tác ────────────────── */}
      <CategoryTreeTable categories={categories} />
    </div>
  );
}
