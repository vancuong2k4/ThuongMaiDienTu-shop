"use client";

// ============================================================
// components/admin/media/MediaGrid.tsx
// Lưới Hình Ảnh Kho Media & Công Cụ Tương Tác
// ============================================================

import React, { useState } from "react";
import Image from "next/image";
import {
  Search,
  Plus,
  Copy,
  Check,
  Eye,
  Trash2,
  X,
  ChevronLeft,
  ChevronRight,
  AlertTriangle,
  Loader2,
  FileImage,
} from "lucide-react";
import type { MediaItem } from "./types";

interface MediaGridProps {
  media: MediaItem[];
  loading: boolean;
  search: string;
  onSearchChange: (search: string) => void;
  page: number;
  totalPages: number;
  totalItems: number;
  onPageChange: (newPage: number) => void;
  onOpenUpload: () => void;
  onDeleteMedia: (item: MediaItem) => void;
}

export const MediaGrid: React.FC<MediaGridProps> = ({
  media,
  loading,
  search,
  onSearchChange,
  page,
  totalPages,
  totalItems,
  onPageChange,
  onOpenUpload,
  onDeleteMedia,
}) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [lightboxImage, setLightboxImage] = useState<MediaItem | null>(null);

  const handleCopy = (item: MediaItem) => {
    // If relative path, build full URL or copy relative path
    const url = item.url.startsWith("http")
      ? item.url
      : `${window.location.origin}${item.url}`;
    navigator.clipboard.writeText(url);
    setCopiedId(item.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const formatSize = (bytes: number) => {
    if (bytes === 0) return "External";
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  return (
    <div className="space-y-4">
      {/* Search & Actions Bar */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-96">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Tìm theo tên tệp hoặc mô tả ảnh..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-9 pr-9 py-2 rounded-xl border border-slate-200 bg-slate-50/50 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#800028]/20 focus:border-[#800028] transition-all"
          />
          {search && (
            <button
              type="button"
              onClick={() => onSearchChange("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        <button
          type="button"
          onClick={onOpenUpload}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-[#800028] hover:bg-[#680020] text-white text-xs font-bold shadow-xs hover:shadow-md transition-all shrink-0 active:scale-[0.98]"
        >
          <Plus className="w-4 h-4" />
          <span>Tải Ảnh Mới</span>
        </button>
      </div>

      {/* Media Grid */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs">
        {loading ? (
          <div className="py-20 text-center text-slate-400 flex flex-col items-center justify-center gap-2">
            <Loader2 className="w-7 h-7 animate-spin text-[#800028]" />
            <span className="text-xs font-medium">Đang tải kho media...</span>
          </div>
        ) : media.length === 0 ? (
          <div className="py-20 text-center flex flex-col items-center justify-center gap-2 text-slate-400">
            <FileImage className="w-12 h-12 text-slate-300" />
            <p className="text-sm font-semibold text-slate-600">
              Chưa có hình ảnh nào trong kho media
            </p>
            <p className="text-xs text-slate-400">
              Bấm nút &quot;Tải Ảnh Mới&quot; để thêm ảnh sản phẩm hoặc banner thương hiệu
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {media.map((item) => {
              const isCopied = copiedId === item.id;

              return (
                <div
                  key={item.id}
                  className="group relative rounded-xl border border-slate-200/80 bg-slate-50/50 overflow-hidden hover:shadow-md hover:border-[#800028]/40 transition-all flex flex-col"
                >
                  {/* Image Aspect Box */}
                  <div className="relative aspect-square w-full bg-slate-100 overflow-hidden flex items-center justify-center">
                    <Image
                      src={item.url}
                      alt={item.altText || item.filename}
                      fill
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 16vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      unoptimized={item.url.startsWith("http")}
                    />

                    {/* Hover Actions Overlay */}
                    <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5 p-2">
                      <button
                        type="button"
                        onClick={() => handleCopy(item)}
                        className="p-2 rounded-lg bg-white/90 text-slate-700 hover:bg-white hover:text-[#800028] shadow-sm transition-all"
                        title="Sao chép đường dẫn URL"
                      >
                        {isCopied ? (
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={() => setLightboxImage(item)}
                        className="p-2 rounded-lg bg-white/90 text-slate-700 hover:bg-white hover:text-blue-600 shadow-sm transition-all"
                        title="Xem ảnh phóng to"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>

                      <button
                        type="button"
                        onClick={() => onDeleteMedia(item)}
                        className="p-2 rounded-lg bg-white/90 text-slate-700 hover:bg-rose-600 hover:text-white shadow-sm transition-all"
                        title="Xóa ảnh"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Caption & Metadata */}
                  <div className="p-2.5 flex-1 flex flex-col justify-between text-[11px] bg-white">
                    <p
                      className="font-bold text-slate-700 truncate"
                      title={item.filename}
                    >
                      {item.filename}
                    </p>
                    <div className="flex items-center justify-between text-slate-400 mt-1">
                      <span>{formatSize(item.size)}</span>
                      <span>{formatDate(item.createdAt)}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Pagination Footer */}
        {!loading && media.length > 0 && totalPages > 1 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-6 mt-4 border-t border-slate-100 text-xs text-slate-500">
            <p>
              Hiển thị trang <span className="font-bold text-slate-700">{page}</span> /{" "}
              <span className="font-bold text-slate-700">{totalPages}</span> (Tổng{" "}
              <span className="font-bold text-slate-700">{totalItems}</span> tệp ảnh)
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

      {/* Lightbox Modal */}
      {lightboxImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-in fade-in"
          onClick={() => setLightboxImage(null)}
        >
          <div
            className="relative max-w-4xl max-h-[90vh] bg-transparent"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setLightboxImage(null)}
              className="absolute -top-10 right-0 p-2 text-white hover:text-slate-300"
            >
              <X className="w-6 h-6" />
            </button>
            <Image
              src={lightboxImage.url}
              alt={lightboxImage.altText || lightboxImage.filename}
              width={1000}
              height={1000}
              className="max-h-[80vh] w-auto rounded-2xl object-contain shadow-2xl mx-auto"
              unoptimized={lightboxImage.url.startsWith("http")}
            />
            <div className="mt-3 text-center text-white text-xs">
              <p className="font-bold">{lightboxImage.filename}</p>
              <p className="text-slate-300 text-[11px] mt-0.5">
                {formatSize(lightboxImage.size)} • {lightboxImage.url}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
