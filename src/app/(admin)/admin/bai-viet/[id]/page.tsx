// ============================================================
// app/(admin)/admin/bai-viet/[id]/page.tsx
// Trang Chỉnh Sửa Bài Viết Cẩm Nang (Stage 8.3)
// ============================================================

import React from "react";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { AdminPageHeader } from "@/components/admin/ui/AdminPageHeader";
import { BlogForm } from "@/components/admin/blogs/BlogForm";
import type { BlogItem } from "@/components/admin/blogs/types";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export async function generateMetadata(props: PageProps): Promise<Metadata> {
  const { id } = await props.params;
  const post = await prisma.blogPost.findUnique({
    where: { id },
    select: { title: true },
  });

  if (!post) {
    return {
      title: "Không tìm thấy bài viết | Quản trị THUYNGA Shop",
    };
  }

  return {
    title: `Chỉnh sửa: ${post.title} | Quản trị THUYNGA Shop`,
    description: `Chỉnh sửa nội dung và tối ưu SEO cho bài viết ${post.title}`,
  };
}

export const revalidate = 0;

export default async function EditBlogPostPage(props: PageProps) {
  const { id } = await props.params;

  const post = await prisma.blogPost.findUnique({
    where: { id },
  });

  if (!post) {
    notFound();
  }

  const serializedPost: BlogItem = {
    id: post.id,
    title: post.title,
    slug: post.slug,
    excerpt: post.excerpt,
    content: post.content,
    coverImage: post.coverImage,
    category: post.category,
    authorName: post.authorName,
    readingTime: post.readingTime,
    viewCount: post.viewCount,
    isFeatured: post.isFeatured,
    isPublished: post.isPublished,
    publishedAt: post.publishedAt?.toISOString() || null,
    seoTitle: post.seoTitle,
    seoDesc: post.seoDesc,
    seoKeywords: post.seoKeywords,
    createdAt: post.createdAt.toISOString(),
    updatedAt: post.updatedAt.toISOString(),
  };

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Chỉnh Sửa Bài Viết Cẩm Nang"
        description="Cập nhật nội dung, hình ảnh bìa và cấu hình SEO E-E-A-T cho bài viết"
        breadcrumbs={[
          { label: "Bài viết", href: "/admin/bai-viet" },
          { label: post.title },
        ]}
      />

      <BlogForm mode="edit" initialData={serializedPost} />
    </div>
  );
}
