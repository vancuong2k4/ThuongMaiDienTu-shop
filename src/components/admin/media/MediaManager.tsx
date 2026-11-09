"use client";

// ============================================================
// components/admin/media/MediaManager.tsx
// Trình Quản Lý Kho Media (Client Component điều phối)
// ============================================================

import React, { useState, useEffect, useCallback } from "react";
import { MediaStats } from "./MediaStats";
import { MediaGrid } from "./MediaGrid";
import { MediaUploadModal } from "./MediaUploadModal";
import { AlertTriangle, Trash2, Loader2 } from "lucide-react";
import type { MediaItem, MediaStatsData } from "./types";

interface MediaManagerProps {
  initialStats?: MediaStatsData;
}

export const MediaManager: React.FC<MediaManagerProps> = ({ initialStats }) => {
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [stats, setStats] = useState<MediaStatsData>(
    initialStats || {
      totalFiles: 0,
      totalSizeBytes: 0,
    }
  );

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<MediaItem | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchMedia = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      params.set("page", page.toString());
      params.set("limit", "18");
      if (search) params.set("search", search);

      const res = await fetch(`/api/admin/media?${params.toString()}`);
      const data = await res.json();

      if (data.success) {
        setMedia(data.media);
        setTotalPages(data.pagination.totalPages);
        setTotalItems(data.pagination.total);
        if (data.stats) {
          setStats(data.stats);
        }
      }
    } catch (err) {
      console.error("Fetch media failed:", err);
    } finally {
      setLoading(false);
    }
  }, [page, search]);

  useEffect(() => {
    fetchMedia();
  }, [fetchMedia]);

  const handleConfirmDelete = async () => {
    if (!itemToDelete) return;
    try {
      setDeleting(true);
      const res = await fetch(`/api/admin/media/${itemToDelete.id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Không thể xóa ảnh");
      }
      setItemToDelete(null);
      fetchMedia();
    } catch (err: any) {
      alert(err.message || "Đã xảy ra lỗi khi xóa");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. KPI Stats Cards */}
      <MediaStats stats={stats} />

      {/* 2. Grid & Actions */}
      <MediaGrid
        media={media}
        loading={loading}
        search={search}
        onSearchChange={(s) => {
          setSearch(s);
          setPage(1);
        }}
        page={page}
        totalPages={totalPages}
        totalItems={totalItems}
        onPageChange={setPage}
        onOpenUpload={() => setIsUploadOpen(true)}
        onDeleteMedia={(item) => setItemToDelete(item)}
      />

      {/* Upload Modal */}
      <MediaUploadModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onSuccess={() => fetchMedia()}
      />

      {/* Delete Dialog */}
      {itemToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-6 text-center">
              <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-800">
                Xác Nhận Xóa Ảnh Khỏi Kho Media?
              </h3>
              <p className="text-xs text-slate-500 mt-2">
                Bạn có chắc muốn xóa tệp{" "}
                <span className="font-bold text-slate-700">
                  {itemToDelete.filename}
                </span>
                ? Nếu ảnh này đang được sử dụng ở bài viết hoặc sản phẩm, liên kết có thể bị gián đoạn.
              </p>
            </div>

            <div className="flex items-center justify-end gap-2.5 px-6 py-4 bg-slate-50 border-t border-slate-100">
              <button
                type="button"
                disabled={deleting}
                onClick={() => setItemToDelete(null)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 text-xs font-bold transition-all"
              >
                Hủy bỏ
              </button>
              <button
                type="button"
                disabled={deleting}
                onClick={handleConfirmDelete}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-all disabled:opacity-50"
              >
                {deleting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Đang xóa...</span>
                  </>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4" />
                    <span>Xóa Vĩnh Viễn</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
