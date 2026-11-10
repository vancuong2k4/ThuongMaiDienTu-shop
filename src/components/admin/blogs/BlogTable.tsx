"use client";

// ============================================================
// components/admin/blogs/BlogTable.tsx
// Bảng Danh Sách Bài Viết Cẩm Nang (Optimistic UI & Actions)
// ============================================================

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Star,
  ExternalLink,
  Edit2,
  Trash2,
  Calendar,
  Clock,
  Eye,
  ChevronLeft,
  ChevronRight,
  AlertTriangle,
  Loader2,
  BookOpen,
} from "lucide-react";
import type { BlogItem } from "./types";

interface BlogTableProps {
  posts: BlogItem[];
  loading: boolean;
  page: number;
  totalPages: number;
  totalItems: number;
  onPageChange: (newPage: number) => void;
  onTogglePublish: (id: string, currentState: boolean) => Promise<void>;
  onToggleFeature: (id: string, currentState: boolean) => Promise<void>;
  onDeletePost: (post: BlogItem) => void;
}

export const BlogTable: React.FC<BlogTableProps> = ({
  posts,
  loading,
  page,
  totalPages,
  totalItems,
  onPageChange,
  onTogglePublish,
  onToggleFeature,
  onDeletePost,
}) => {
  const [togglingPublishId, setTogglingPublishId] = useState<string | null>(null);
  const [togglingFeatureId, setTogglingFeatureId] = useState<string | null>(null);

  const handlePublish = async (post: BlogItem) => {
    try {
      setTogglingPublishId(post.id);
      await onTogglePublish(post.id, post.isPublished);
    } finally {
      setTogglingPublishId(null);
    }
  };

  const handleFeature = async (post: BlogItem) => {
    try {
      setTogglingFeatureId(post.id);
      await onToggleFeature(post.id, post.isFeatured);
    } finally {
      setTogglingFeatureId(null);
    }
  };

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return "Chưa xuất bản";
    const d = new Date(dateStr);
    return d.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-slate-600">
          <thead className="bg-slate-50/80 text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200/80">
            <tr>
              <th className="py-3.5 px-4 min-w-[280px]">Bài Viết</th>
              <th className="py-3.5 px-4 min-w-[130px]">Chuyên Mục</th>
              <th className="py-3.5 px-4">Lượt Đọc</th>
              <th className="py-3.5 px-4 text-center">Tiêu Điểm</th>
              <th className="py-3.5 px-4 text-center">Trạng Thái</th>
              <th className="py-3.5 px-4">Ngày Đăng</th>
              <th className="py-3.5 px-4 text-right">Thao Tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading ? (
              <tr>
                <td colSpan={7} className="py-16 text-center text-slate-400">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <Loader2 className="w-6 h-6 animate-spin text-[#800028]" />
                    <span className="text-xs font-medium">Đang tải danh sách bài viết...</span>
                  </div>
                </td>
              </tr>
            ) : posts.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-16 text-center">
                  <div className="flex flex-col items-center justify-center gap-2 text-slate-400">
                    <AlertTriangle className="w-8 h-8 text-slate-300" />
                    <p className="text-sm font-semibold text-slate-600">
                      Chưa có bài viết nào
                    </p>
                    <p className="text-xs text-slate-400">
                      Thử thay đổi bộ lọc hoặc bấm nút &quot;Viết Bài Mới&quot;
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              posts.map((post) => {
                const isPublishing = togglingPublishId === post.id;
                const isFeaturing = togglingFeatureId === post.id;

                return (
                  <tr
                    key={post.id}
                    className="hover:bg-slate-50/60 transition-colors group"
                  >
                    {/* 1. Bài viết (Cover + Title + Author) */}
                    <td className="py-4 px-4 align-top">
                      <div className="flex items-start gap-3">
                        {post.coverImage ? (
                          <div className="relative w-16 h-12 rounded-lg overflow-hidden border border-slate-200 shrink-0">
                            <Image
                              src={post.coverImage}
                              alt={post.title}
                              fill
                              sizes="64px"
                              className="object-cover"
                            />
                          </div>
                        ) : (
                          <div className="w-16 h-12 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400 shrink-0">
                            <BookOpen className="w-5 h-5" />
                          </div>
                        )}
                        <div className="min-w-0 max-w-[320px]">
                          <Link
                            href={`/admin/bai-viet/${post.id}`}
                            className="font-bold text-xs text-slate-800 hover:text-[#800028] hover:underline line-clamp-2 leading-snug"
                            title={post.title}
                          >
                            {post.title}
                          </Link>
                          <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-400">
                            <span>Tác giả: <strong>{post.authorName}</strong></span>
                            <span>•</span>
                            <span>{post.readingTime} phút đọc</span>
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* 2. Chuyên mục */}
                    <td className="py-4 px-4 align-top">
                      <span className="inline-block px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700">
                        {post.category}
                      </span>
                    </td>

                    {/* 3. Lượt đọc */}
                    <td className="py-4 px-4 align-top">
                      <div className="flex items-center gap-1.5 text-xs text-slate-700 font-bold">
                        <Eye className="w-3.5 h-3.5 text-slate-400" />
                        <span>{post.viewCount.toLocaleString("vi-VN")}</span>
                      </div>
                    </td>

                    {/* 4. Tiêu điểm nổi bật (isFeatured) */}
                    <td className="py-4 px-4 align-top text-center">
                      <button
                        type="button"
                        disabled={isFeaturing}
                        onClick={() => handleFeature(post)}
                        className={`p-1.5 rounded-lg transition-all ${
                          post.isFeatured
                            ? "text-amber-500 hover:bg-amber-50"
                            : "text-slate-300 hover:text-slate-500 hover:bg-slate-100"
                        }`}
                        title={post.isFeatured ? "Bỏ ghim nổi bật" : "Ghim bài viết tiêu điểm"}
                      >
                        <Star
                          className={`w-4 h-4 ${
                            post.isFeatured ? "fill-amber-400" : ""
                          }`}
                        />
                      </button>
                    </td>

                    {/* 5. Trạng thái xuất bản (isPublished toggle) */}
                    <td className="py-4 px-4 align-top text-center">
                      <div className="flex flex-col items-center gap-1">
                        <button
                          type="button"
                          disabled={isPublishing}
                          onClick={() => handlePublish(post)}
                          className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-[#800028]/20 ${
                            post.isPublished ? "bg-[#800028]" : "bg-slate-200"
                          } ${isPublishing ? "opacity-50 cursor-not-allowed" : ""}`}
                          title={post.isPublished ? "Bấm để chuyển về bản nháp" : "Bấm để xuất bản"}
                        >
                          <span
                            className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                              post.isPublished ? "translate-x-5" : "translate-x-0"
                            }`}
                          />
                        </button>
                        <span className="text-[10px] font-semibold text-slate-400">
                          {post.isPublished ? "Công khai" : "Bản nháp"}
                        </span>
                      </div>
                    </td>

                    {/* 6. Ngày đăng */}
                    <td className="py-4 px-4 align-top">
                      <div className="flex items-center gap-1 text-xs text-slate-500">
                        <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="whitespace-nowrap">{formatDate(post.publishedAt || post.createdAt)}</span>
                      </div>
                    </td>

                    {/* 7. Thao Tác */}
                    <td className="py-4 px-4 align-top text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {post.isPublished && (
                          <Link
                            href={`/tin-tuc/${post.slug}`}
                            target="_blank"
                            className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                            title="Xem trang thực tế ngoài website"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </Link>
                        )}
                        <Link
                          href={`/admin/bai-viet/${post.id}`}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-[#800028] hover:bg-rose-50 transition-colors"
                          title="Chỉnh sửa bài viết"
                        >
                          <Edit2 className="w-4 h-4" />
                        </Link>
                        <button
                          type="button"
                          onClick={() => onDeletePost(post)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                          title="Xóa bài viết"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      {!loading && posts.length > 0 && totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 border-t border-slate-100 bg-slate-50/50 text-xs text-slate-500">
          <p>
            Hiển thị trang <span className="font-bold text-slate-700">{page}</span> /{" "}
            <span className="font-bold text-slate-700">{totalPages}</span> (Tổng{" "}
            <span className="font-bold text-slate-700">{totalItems}</span> bài viết)
          </p>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              disabled={page <= 1}
              onClick={() => onPageChange(page - 1)}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all font-semibold"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Trước</span>
            </button>
            <div className="px-2 py-1 font-bold text-slate-700">{page}</div>
            <button
              type="button"
              disabled={page >= totalPages}
              onClick={() => onPageChange(page + 1)}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all font-semibold"
            >
              <span>Sau</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
