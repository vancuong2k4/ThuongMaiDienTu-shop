"use client";

// ============================================================
// components/admin/media/MediaUploadModal.tsx
// Modal Tải Lên Tệp Hình Ảnh / Thêm Từ URL Ngoài
// ============================================================

import React, { useState, useRef } from "react";
import Image from "next/image";
import {
  X,
  Upload,
  Link as LinkIcon,
  Loader2,
  CheckCircle2,
  AlertCircle,
  FileImage,
} from "lucide-react";

interface MediaUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const MediaUploadModal: React.FC<MediaUploadModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [tab, setTab] = useState<"file" | "url">("file");

  // File upload state
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // URL upload state
  const [externalUrl, setExternalUrl] = useState("");
  const [altText, setAltText] = useState("");

  if (!isOpen) return null;

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedFiles(Array.from(e.target.files));
      setErrorMsg(null);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files) {
      setSelectedFiles(Array.from(e.dataTransfer.files));
      setErrorMsg(null);
    }
  };

  const handleUploadFiles = async () => {
    if (selectedFiles.length === 0) {
      setErrorMsg("Vui lòng chọn ít nhất một tập tin ảnh");
      return;
    }

    try {
      setUploading(true);
      setErrorMsg(null);

      const formData = new FormData();
      selectedFiles.forEach((file) => {
        formData.append("file", file);
      });

      const res = await fetch("/api/admin/media", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Không thể tải ảnh lên");
      }

      onSuccess();
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || "Đã xảy ra lỗi khi tải ảnh");
    } finally {
      setUploading(false);
    }
  };

  const handleAddFromUrl = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!externalUrl.trim()) {
      setErrorMsg("Vui lòng nhập đường dẫn URL ảnh");
      return;
    }

    try {
      setUploading(true);
      setErrorMsg(null);

      const res = await fetch("/api/admin/media", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          url: externalUrl.trim(),
          altText: altText.trim(),
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Không thể thêm ảnh từ URL");
      }

      onSuccess();
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || "Đã xảy ra lỗi khi thêm ảnh");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xl w-full max-w-lg my-8 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-2">
            <Upload className="w-5 h-5 text-[#800028]" />
            <h3 className="text-base font-bold text-slate-800">
              Thêm Ảnh Vào Kho Media
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switch */}
        <div className="flex border-b border-slate-100 px-6 pt-3 gap-4">
          <button
            type="button"
            onClick={() => setTab("file")}
            className={`pb-2.5 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 ${
              tab === "file"
                ? "border-[#800028] text-[#800028]"
                : "border-transparent text-slate-500 hover:text-slate-700"
            }`}
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Tải Từ Máy Tính</span>
          </button>
          <button
            type="button"
            onClick={() => setTab("url")}
            className={`pb-2.5 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 ${
              tab === "url"
                ? "border-[#800028] text-[#800028]"
                : "border-transparent text-slate-500 hover:text-slate-700"
            }`}
          >
            <LinkIcon className="w-3.5 h-3.5" />
            <span>Thêm Từ Liên Kết (URL)</span>
          </button>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div className="mx-6 mt-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            <span className="font-semibold">{errorMsg}</span>
          </div>
        )}

        {/* Body */}
        <div className="p-6">
          {tab === "file" ? (
            <div className="space-y-4">
              {/* Dropzone */}
              <div
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-slate-200 hover:border-[#800028] rounded-2xl p-8 text-center cursor-pointer bg-slate-50/50 hover:bg-rose-50/20 transition-all flex flex-col items-center justify-center gap-3"
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept="image/png,image/jpeg,image/webp,image/gif,image/svg+xml"
                  onChange={handleFileSelect}
                  className="hidden"
                />
                <div className="w-12 h-12 rounded-2xl bg-slate-100 text-[#800028] flex items-center justify-center">
                  <Upload className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-700">
                    Kéo & thả tập tin ảnh vào đây
                  </p>
                  <p className="text-xs text-slate-400 mt-1">
                    hoặc bấm để chọn ảnh từ máy tính (Hỗ trợ tải nhiều ảnh)
                  </p>
                </div>
                <p className="text-[10px] text-slate-400 font-medium">
                  Định dạng: JPG, PNG, WEBP, GIF, SVG (Tối đa 5MB/ảnh)
                </p>
              </div>

              {/* Selected Files List */}
              {selectedFiles.length > 0 && (
                <div className="space-y-2 max-h-36 overflow-y-auto">
                  <p className="text-xs font-bold text-slate-700">
                    Đã chọn {selectedFiles.length} tệp:
                  </p>
                  {selectedFiles.map((f, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-100 text-xs"
                    >
                      <div className="flex items-center gap-2 truncate">
                        <FileImage className="w-4 h-4 text-slate-400 shrink-0" />
                        <span className="truncate font-medium text-slate-700">
                          {f.name}
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-400 shrink-0 ml-2">
                        {(f.size / 1024).toFixed(1)} KB
                      </span>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-bold"
                >
                  Hủy
                </button>
                <button
                  type="button"
                  disabled={uploading || selectedFiles.length === 0}
                  onClick={handleUploadFiles}
                  className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-[#800028] hover:bg-[#680020] text-white text-xs font-bold disabled:opacity-50 transition-all"
                >
                  {uploading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Đang tải lên...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Tải Lên {selectedFiles.length > 0 ? `(${selectedFiles.length})` : ""}</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleAddFromUrl} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Đường Dẫn URL Ảnh <span className="text-rose-500">*</span>
                </label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  value={externalUrl}
                  onChange={(e) => setExternalUrl(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#800028]/20 focus:border-[#800028]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Mô Tả Ảnh (Alt Text)
                </label>
                <input
                  type="text"
                  placeholder="Mô tả nội dung hình ảnh..."
                  value={altText}
                  onChange={(e) => setAltText(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#800028]/20 focus:border-[#800028]"
                />
              </div>

              {externalUrl && (
                <div className="p-2 border border-slate-200 rounded-xl bg-slate-50 flex items-center justify-center max-h-40 overflow-hidden">
                  <Image
                    src={externalUrl}
                    alt="Preview"
                    width={160}
                    height={120}
                    className="max-h-36 w-auto object-contain rounded-lg"
                    unoptimized
                  />
                </div>
              )}

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-bold"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={uploading || !externalUrl}
                  className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-[#800028] hover:bg-[#680020] text-white text-xs font-bold disabled:opacity-50 transition-all"
                >
                  {uploading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Đang lưu...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Lưu Ảnh</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
