// ============================================================
// app/(admin)/admin/bai-viet/tao-moi/page.tsx
// Trang Tạo Mới Bài Viết Cẩm Nang (Stage 8.3)
// ============================================================

import React from "react";
import type { Metadata } from "next";
import { AdminPageHeader } from "@/components/admin/ui/AdminPageHeader";
import { BlogForm } from "@/components/admin/blogs/BlogForm";

export const metadata: Metadata = {
  title: "Viết Bài Cẩm Nang Mới | Quản trị THUYNGA Shop",
  description: "Soạn thảo bài viết mới chuẩn SEO E-E-A-T cho Thúy Nga Shop",
};

export default function CreateBlogPostPage() {
  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Viết Bài Cẩm Nang Mới"
        description="Soạn thảo cẩm nang y khoa, chia sẻ dinh dưỡng và kiến thức hàng ngoại nhập chính hãng"
        breadcrumbs={[
          { label: "Bài viết", href: "/admin/bai-viet" },
          { label: "Tạo mới" },
        ]}
      />

      <BlogForm mode="create" />
    </div>
  );
}
