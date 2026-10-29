// ============================================================
// app/(admin)/admin/san-pham/page.tsx
// Trang Quản Lý Danh Sách Sản Phẩm & Tồn Kho (Module 6.3)
// ============================================================

import React from "react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { AdminPageHeader } from "@/components/admin/ui/AdminPageHeader";
import { ProductFilters } from "@/components/admin/products/ProductFilters";
import { ProductTable, type ProductItem } from "@/components/admin/products/ProductTable";
import { ProductPagination } from "@/components/admin/products/ProductPagination";
import { Plus, Package, AlertTriangle, Layers } from "lucide-react";
import { Prisma } from "@prisma/client";

interface PageProps {
  searchParams: Promise<{
    page?: string;
    limit?: string;
    search?: string;
    categoryId?: string;
    origin?: string;
    stockStatus?: string;
    isActive?: string;
    isFeatured?: string;
    sortBy?: string;
  }>;
}

export default async function AdminProductsPage(props: PageProps) {
  const searchParams = await props.searchParams;

  const page = Math.max(1, parseInt(searchParams.page || "1"));
  const limit = Math.max(1, Math.min(100, parseInt(searchParams.limit || "10")));
  const skip = (page - 1) * limit;

  const search = searchParams.search?.trim() || "";
  const categoryId = searchParams.categoryId || "";
  const origin = searchParams.origin || "";
  const stockStatus = searchParams.stockStatus || "";
  const isActiveParam = searchParams.isActive || "";
  const isFeaturedParam = searchParams.isFeatured || "";
  const sortBy = searchParams.sortBy || "createdAt_desc";

  // ── Xây dựng điều kiện lọc ──────────────────────────────────
  const where: Prisma.ProductWhereInput = {};

  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { brand: { contains: search, mode: "insensitive" } },
      {
        variants: {
          some: {
            OR: [
              { sku: { contains: search, mode: "insensitive" } },
              { name: { contains: search, mode: "insensitive" } },
            ],
          },
        },
      },
    ];
  }

  if (categoryId && categoryId !== "all") {
    const childCategories = await prisma.category.findMany({
      where: { parentId: categoryId },
      select: { id: true },
    });
    const categoryIds = [categoryId, ...childCategories.map((c) => c.id)];
    where.categoryId = { in: categoryIds };
  }

  if (origin && origin !== "all") {
    where.origin = origin;
  }

  if (isActiveParam === "true") where.isActive = true;
  if (isActiveParam === "false") where.isActive = false;

  if (isFeaturedParam === "true") where.isFeatured = true;
  if (isFeaturedParam === "false") where.isFeatured = false;

  if (stockStatus === "out_of_stock") {
    where.variants = { none: { stock: { gt: 0 } } };
  } else if (stockStatus === "low_stock") {
    where.variants = { some: { stock: { lte: 10, gt: 0 } } };
  } else if (stockStatus === "in_stock") {
    where.variants = { some: { stock: { gt: 10 } } };
  }

  let orderBy: Prisma.ProductOrderByWithRelationInput = { createdAt: "desc" };
  if (sortBy === "createdAt_asc") orderBy = { createdAt: "asc" };
  if (sortBy === "name_asc") orderBy = { name: "asc" };
  if (sortBy === "name_desc") orderBy = { name: "desc" };

  // ── Truy vấn song song dữ liệu danh sách & bộ lọc ───────────
  const [total, products, categories, rawOrigins, totalActive, totalLowStock] =
    await Promise.all([
      prisma.product.count({ where }),
      prisma.product.findMany({
        where,
        skip,
        take: limit,
        orderBy,
        include: {
          category: {
            select: { id: true, name: true, slug: true },
          },
          images: {
            orderBy: { sortOrder: "asc" },
            take: 1,
          },
          variants: {
            orderBy: { sortOrder: "asc" },
            select: {
              id: true,
              name: true,
              sku: true,
              price: true,
              originalPrice: true,
              stock: true,
              isActive: true,
            },
          },
          _count: {
            select: { reviews: true },
          },
        },
      }),
      // Danh mục cho bộ lọc
      prisma.category.findMany({
        select: { id: true, name: true, parentId: true },
        orderBy: [{ parentId: "asc" }, { sortOrder: "asc" }, { name: "asc" }],
      }),
      // Danh sách xuất xứ có trong DB
      prisma.product.findMany({
        select: { origin: true },
        distinct: ["origin"],
        where: { origin: { not: null } },
      }),
      // Đếm số sản phẩm đang kinh doanh
      prisma.product.count({ where: { isActive: true } }),
      // Đếm số biến thể sắp hết hàng
      prisma.productVariant.count({
        where: { stock: { lte: 10 }, isActive: true },
      }),
    ]);

  const origins = rawOrigins
    .map((o) => o.origin)
    .filter((org): org is string => Boolean(org));

  const totalPages = Math.ceil(total / limit);

  // ── Chuẩn hóa danh sách sản phẩm để render ──────────────────
  const formattedProducts: ProductItem[] = products.map((prod) => {
    const prices = prod.variants.map((v) => Number(v.price));
    const minPrice = prices.length > 0 ? Math.min(...prices) : 0;
    const maxPrice = prices.length > 0 ? Math.max(...prices) : 0;
    const totalStock = prod.variants.reduce((acc, v) => acc + v.stock, 0);

    return {
      id: prod.id,
      name: prod.name,
      slug: prod.slug,
      brand: prod.brand,
      origin: prod.origin,
      specification: prod.specification,
      isActive: prod.isActive,
      isFeatured: prod.isFeatured,
      createdAt: prod.createdAt,
      category: prod.category,
      thumbnail: prod.images[0]?.url || null,
      minPrice,
      maxPrice,
      totalStock,
      variantCount: prod.variants.length,
      reviewCount: prod._count.reviews,
      variants: prod.variants.map((v) => ({
        ...v,
        price: Number(v.price),
        originalPrice: v.originalPrice ? Number(v.originalPrice) : null,
      })),
    };
  });

  return (
    <div className="space-y-6">
      {/* ── Tiêu đề Trang & Nút Thêm Mới ───────────────────────── */}
      <AdminPageHeader
        title="Quản Lý Sản Phẩm & Kho Hàng"
        description="Quản lý toàn bộ danh mục sản phẩm, biến thể quy cách, giá bán và theo dõi tồn kho thời gian thực."
        breadcrumbs={[{ label: "Sản phẩm" }]}
        actions={
          <Link
            href="/admin/san-pham/tao-moi"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-wine-800 hover:bg-wine-900 text-white text-xs font-bold shadow-md transition-all"
          >
            <Plus className="w-4 h-4 text-amber-300" />
            <span>Thêm sản phẩm mới</span>
          </Link>
        }
      />

      {/* ── Thống kê nhanh trên đầu trang ──────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <div className="bg-white rounded-2xl border border-slate-200/80 p-3.5 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
              Tổng Sản Phẩm
            </span>
            <span className="text-xl font-black text-slate-900 mt-1 block">
              {total}
            </span>
          </div>
          <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center">
            <Package className="w-4 h-4" />
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/80 p-3.5 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
              Đang Kinh Doanh
            </span>
            <span className="text-xl font-black text-emerald-700 mt-1 block">
              {totalActive}
            </span>
          </div>
          <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
            <Layers className="w-4 h-4" />
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/80 p-3.5 shadow-xs flex items-center justify-between col-span-2 sm:col-span-1">
          <div>
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
              Kho Cảnh Báo (≤ 10)
            </span>
            <span className="text-xl font-black text-rose-700 mt-1 block">
              {totalLowStock}
            </span>
          </div>
          <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-700 flex items-center justify-center">
            <AlertTriangle className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* ── Bộ Lọc Nâng Cao ─────────────────────────────────────── */}
      <ProductFilters categories={categories} origins={origins} />

      {/* ── Bảng Dữ Liệu Sản Phẩm ──────────────────────────────── */}
      <ProductTable products={formattedProducts} />

      {/* ── Phân Trang ─────────────────────────────────────────── */}
      <ProductPagination
        page={page}
        totalPages={totalPages}
        total={total}
        limit={limit}
      />
    </div>
  );
}
