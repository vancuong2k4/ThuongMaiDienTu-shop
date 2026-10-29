// ============================================================
// app/(admin)/admin/san-pham/[id]/page.tsx
// Trang Chỉnh Sửa Sản Phẩm & Biến Thể Tồn Kho Admin CMS
// ============================================================

import React from "react";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { AdminPageHeader } from "@/components/admin/ui/AdminPageHeader";
import { ProductForm } from "@/components/admin/products/ProductForm";
import Link from "next/link";
import { ExternalLink } from "lucide-react";

interface EditProductPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: EditProductPageProps) {
  const { id } = await params;
  const product = await prisma.product.findUnique({
    where: { id },
    select: { name: true },
  });

  return {
    title: product
      ? `Sửa: ${product.name} | Admin THUYNGA Shop`
      : "Chỉnh Sửa Sản Phẩm | Admin THUYNGA Shop",
  };
}

export default async function EditProductPage({ params }: EditProductPageProps) {
  const { id } = await params;

  const [product, categories] = await Promise.all([
    prisma.product.findUnique({
      where: { id },
      include: {
        images: {
          orderBy: { sortOrder: "asc" },
        },
        variants: {
          orderBy: { sortOrder: "asc" },
        },
        category: {
          select: { id: true, name: true },
        },
      },
    }),
    prisma.category.findMany({
      select: { id: true, name: true, parentId: true },
      orderBy: [{ parentId: "asc" }, { sortOrder: "asc" }, { name: "asc" }],
    }),
  ]);

  if (!product) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title={`Chỉnh Sửa: ${product.name}`}
        description={`Cập nhật thông tin chi tiết, chỉnh sửa giá bán biến thể và quản lý tồn kho.`}
        breadcrumbs={[
          { label: "Sản phẩm", href: "/admin/san-pham" },
          { label: "Chỉnh sửa" },
        ]}
        actions={
          <Link
            href={`/san-pham/${product.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-slate-700 bg-white border border-slate-300 rounded-xl hover:bg-slate-50 transition-colors shadow-xs"
          >
            <span>Xem trên website</span>
            <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
          </Link>
        }
      />

      <ProductForm
        categories={categories}
        initialData={product}
        isEdit={true}
      />
    </div>
  );
}
