// ============================================================
// app/(admin)/admin/san-pham/tao-moi/page.tsx
// Trang Tạo Mới Sản Phẩm & Biến Thể Admin CMS
// ============================================================

import React from "react";
import { prisma } from "@/lib/prisma";
import { AdminPageHeader } from "@/components/admin/ui/AdminPageHeader";
import { ProductForm } from "@/components/admin/products/ProductForm";

export const metadata = {
  title: "Thêm Sản Phẩm Mới | Admin THUYNGA Shop",
};

export default async function CreateProductPage() {
  const categories = await prisma.category.findMany({
    select: { id: true, name: true, parentId: true },
    orderBy: [{ parentId: "asc" }, { sortOrder: "asc" }, { name: "asc" }],
  });

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Thêm Sản Phẩm Mới"
        description="Điền thông tin chi tiết, tạo biến thể phân loại giá & tồn kho, tải hình ảnh và tối ưu SEO cho sản phẩm."
        breadcrumbs={[
          { label: "Sản phẩm", href: "/admin/san-pham" },
          { label: "Tạo mới" },
        ]}
      />

      <ProductForm categories={categories} isEdit={false} />
    </div>
  );
}
