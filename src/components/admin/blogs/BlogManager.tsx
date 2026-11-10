"use client";

// ============================================================
// components/admin/blogs/BlogManager.tsx
// Bộ điều phối Quản Lý Bài Viết Cẩm Nang (Client Container)
// ============================================================

import React, { useState, useEffect, useCallback, useTransition } from "react";
import { BlogStats } from "./BlogStats";
import { BlogFilters } from "./BlogFilters";
import { BlogTable } from "./BlogTable";
import type { BlogItem, BlogStatsData } from "./types";
import {
  AlertTriangle,
  Loader2,
  CheckCircle2,
  XCircle,
  X,
  BookOpen,
} from "lucide-react";

interface BlogManagerProps {
  initialStats?: BlogStatsData;
  initialPosts?: BlogItem[];
  initialPagination?: {
    page: number;
    limit: number;
    totalPages: number;
    totalItems: number;
  };
}

export const BlogManager: React.FC<BlogManagerProps> = ({
  initialStats = { total: 0, published: 0, draft: 0, totalViews: 0 },
  initialPosts = [],
  initialPagination = { page: 1, limit: 10, totalPages: 1, totalItems: 0 },
}) => {
  const [stats, setStats] = useState<BlogStatsData>(initialStats);
  const [posts, setPosts] = useState<BlogItem[]>(initialPosts);
  const [page, setPage] = useState(initialPagination.page);
  const [totalPages, setTotalPages] = useState(initialPagination.totalPages);
  const [totalItems, setTotalItems] = useState(initialPagination.totalItems);
  const [limit] = useState(initialPagination.limit);

  // Filters state
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [selectedStatus, setSelectedStatus] = useState("ALL");
  const [sortBy, setSortBy] = useState("createdAt_desc");

  const [loading, setLoading] = useState(false);
  const [deletingPost, setDeletingPost] = useState<BlogItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [notification, setNotification] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  // Auto clear notification after 4s
  useEffect(() => {
    if (!notification) return;
    const timer = setTimeout(() => setNotification(null), 4000);
    return () => clearTimeout(timer);
  }, [notification]);

  // Fetch blogs data
  const fetchBlogs = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      params.set("page", page.toString());
      params.set("limit", limit.toString());
      if (search.trim()) params.set("search", search.trim());
      if (selectedCategory && selectedCategory !== "ALL") {
        params.set("category", selectedCategory);
      }
      if (selectedStatus && selectedStatus !== "ALL") {
        params.set("status", selectedStatus);
      }
      if (sortBy) params.set("sortBy", sortBy);

      const res = await fetch(`/api/admin/blogs?${params.toString()}`);
      if (!res.ok) {
        throw new Error("Không thể tải danh sách bài viết");
      }
      const data = await res.json();
      if (data.success) {
        setPosts(data.data);
        setTotalPages(data.pagination.totalPages);
        setTotalItems(data.pagination.total);
        if (data.stats) {
          setStats(data.stats);
        }
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Đã có lỗi xảy ra";
      setNotification({ type: "error", message: msg });
    } finally {
      setLoading(false);
    }
  }, [page, limit, search, selectedCategory, selectedStatus, sortBy]);

  // Trigger fetch when filter changes
  useEffect(() => {
    fetchBlogs();
  }, [fetchBlogs]);

  // Handle Search input change with page reset
  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const handleCategoryChange = (cat: string) => {
    setSelectedCategory(cat);
    setPage(1);
  };

  const handleStatusChange = (status: string) => {
    setSelectedStatus(status);
    setPage(1);
  };

  const handleSortByChange = (sort: string) => {
    setSortBy(sort);
    setPage(1);
  };

  const handleResetFilters = () => {
    setSearch("");
    setSelectedCategory("ALL");
    setSelectedStatus("ALL");
    setSortBy("createdAt_desc");
    setPage(1);
  };

  // Toggle publish
  const handleTogglePublish = async (id: string, currentState: boolean) => {
    const nextState = !currentState;
    // Optimistic update
    setPosts((prev) =>
      prev.map((p) =>
        p.id === id
          ? {
              ...p,
              isPublished: nextState,
              publishedAt: nextState ? new Date().toISOString() : null,
            }
          : p
      )
    );
    setStats((prev) => ({
      ...prev,
      published: nextState ? prev.published + 1 : Math.max(0, prev.published - 1),
      draft: nextState ? Math.max(0, prev.draft - 1) : prev.draft + 1,
    }));

    try {
      const res = await fetch(`/api/admin/blogs/${id}/publish`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isPublished: nextState }),
      });
      if (!res.ok) {
        throw new Error("Lỗi cập nhật trạng thái xuất bản");
      }
      setNotification({
        type: "success",
        message: nextState
          ? "Đã xuất bản bài viết thành công lên storefront!"
          : "Đã chuyển bài viết về trạng thái bản nháp.",
      });
    } catch (err) {
      // Rollback
      setPosts((prev) =>
        prev.map((p) => (p.id === id ? { ...p, isPublished: currentState } : p))
      );
      setStats((prev) => ({
        ...prev,
        published: currentState ? prev.published + 1 : Math.max(0, prev.published - 1),
        draft: currentState ? Math.max(0, prev.draft - 1) : prev.draft + 1,
      }));
      setNotification({
        type: "error",
        message: "Không thể thay đổi trạng thái xuất bản. Vui lòng thử lại.",
      });
    }
  };

  // Toggle featured
  const handleToggleFeature = async (id: string, currentState: boolean) => {
    const nextState = !currentState;
    // Optimistic update
    setPosts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, isFeatured: nextState } : p))
    );

    try {
      const res = await fetch(`/api/admin/blogs/${id}/feature`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isFeatured: nextState }),
      });
      if (!res.ok) {
        throw new Error("Lỗi cập nhật trạng thái nổi bật");
      }
      setNotification({
        type: "success",
        message: nextState
          ? "Đã ghim bài viết lên tiêu điểm trang chủ Cẩm nang!"
          : "Đã hủy ghim tiêu điểm của bài viết.",
      });
    } catch (err) {
      // Rollback
      setPosts((prev) =>
        prev.map((p) => (p.id === id ? { ...p, isFeatured: currentState } : p))
      );
      setNotification({
        type: "error",
        message: "Không thể đổi trạng thái nổi bật. Vui lòng thử lại.",
      });
    }
  };

  // Delete article
  const handleDeletePost = (post: BlogItem) => {
    setDeletingPost(post);
  };

  const handleConfirmDelete = async () => {
    if (!deletingPost) return;
    try {
      setIsDeleting(true);
      const res = await fetch(`/api/admin/blogs/${deletingPost.id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        throw new Error("Không thể xóa bài viết");
      }
      setNotification({
        type: "success",
        message: `Đã xóa bài viết "${deletingPost.title}" thành công!`,
      });
      setDeletingPost(null);
      // Refresh list
      fetchBlogs();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Không thể xóa bài viết";
      setNotification({ type: "error", message: msg });
    } finally {
      setIsDeleting(false);
    }
  };

  const hasActiveFilters =
    search.trim() !== "" ||
    selectedCategory !== "ALL" ||
    selectedStatus !== "ALL" ||
    sortBy !== "createdAt_desc";

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {notification && (
        <div
          role="alert"
          className={`flex items-center justify-between p-4 rounded-xl text-sm font-medium border shadow-xs transition-all animate-in fade-in slide-in-from-top-2 ${
            notification.type === "success"
              ? "bg-emerald-50 text-emerald-800 border-emerald-200"
              : "bg-rose-50 text-rose-800 border-rose-200"
          }`}
        >
          <div className="flex items-center gap-2.5">
            {notification.type === "success" ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            ) : (
              <XCircle className="w-5 h-5 text-rose-600 shrink-0" />
            )}
            <span>{notification.message}</span>
          </div>
          <button
            type="button"
            onClick={() => setNotification(null)}
            className="p-1 rounded-lg hover:bg-black/5 text-slate-500 hover:text-slate-700"
            aria-label="Đóng thông báo"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* 4 Thẻ KPI Thống Kê */}
      <BlogStats stats={stats} />

      {/* Bộ Lọc & Tìm Kiếm */}
      <BlogFilters
        search={search}
        onSearchChange={handleSearchChange}
        selectedCategory={selectedCategory}
        onCategoryChange={handleCategoryChange}
        selectedStatus={selectedStatus}
        onStatusChange={handleStatusChange}
        sortBy={sortBy}
        onSortByChange={handleSortByChange}
        onResetFilters={handleResetFilters}
        hasActiveFilters={hasActiveFilters}
      />

      {/* Bảng Dữ Liệu */}
      <BlogTable
        posts={posts}
        loading={loading}
        page={page}
        totalPages={totalPages}
        totalItems={totalItems}
        onPageChange={setPage}
        onTogglePublish={handleTogglePublish}
        onToggleFeature={handleToggleFeature}
        onDeletePost={handleDeletePost}
      />

      {/* Hộp Thoại Xác Nhận Xóa Bài Viết */}
      {deletingPost && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-slate-900">
                  Xác nhận xóa bài viết?
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Thao tác này sẽ xóa vĩnh viễn bài viết khỏi hệ thống và không thể phục hồi.
                </p>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs space-y-1.5">
              <div className="font-semibold text-slate-800 line-clamp-2">
                {deletingPost.title}
              </div>
              <div className="flex items-center gap-2 text-slate-500">
                <span>Chuyên mục: <strong className="text-slate-700">{deletingPost.category}</strong></span>
                <span>•</span>
                <span>Lượt xem: <strong className="text-slate-700">{deletingPost.viewCount.toLocaleString("vi-VN")}</strong></span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setDeletingPost(null)}
                disabled={isDeleting}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors disabled:opacity-50"
              >
                Hủy bỏ
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                disabled={isDeleting}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 transition-colors shadow-xs disabled:opacity-50"
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Đang xóa...</span>
                  </>
                ) : (
                  <span>Xác nhận xóa</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
