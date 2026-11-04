"use client";

// ============================================================
// components/admin/categories/CategoryModal.tsx
// Modal Thêm Mới & Chỉnh Sửa Danh Mục Ngành Hàng
// ============================================================

import React, { useState, useEffect } from "react";
import { slugify } from "@/lib/utils";
import {
  X,
  FolderTree,
  Upload,
  Link as LinkIcon,
  Loader2,
  Check,
  AlertCircle,
  Image as ImageIcon,
} from "lucide-react";
import type { CategoryInput } from "@/lib/validations/category";

export interface CategoryModalData {
  id?: string;
  name: string;
  slug: string;
  parentId: string | null;
  description: string | null;
  image: string | null;
  sortOrder: number;
  isActive: boolean;
  seoTitle: string | null;
  seoDesc: string | null;
  childCount?: number;
}

interface RootCategoryOption {
  id: string;
  name: string;
}

interface CategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  initialData?: CategoryModalData | null;
  rootCategories: RootCategoryOption[];
  prefilledParentId?: string | null;
}

export const CategoryModal: React.FC<CategoryModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  initialData,
  rootCategories,
  prefilledParentId,
}) => {
  const isEdit = Boolean(initialData?.id);

  // Form states
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [isAutoSlug, setIsAutoSlug] = useState(true);
  const [parentId, setParentId] = useState<string | null>(null);
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [sortOrder, setSortOrder] = useState<number>(0);
  const [isActive, setIsActive] = useState(true);
  const [seoTitle, setSeoTitle] = useState("");
  const [seoDesc, setSeoDesc] = useState("");

  const [imageUrlInput, setImageUrlInput] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Reset or fill form when opening
  useEffect(() => {
    if (isOpen) {
      setErrorMessage(null);
      if (initialData) {
        setName(initialData.name || "");
        setSlug(initialData.slug || "");
        setIsAutoSlug(false);
        setParentId(initialData.parentId || null);
        setDescription(initialData.description || "");
        setImage(initialData.image || "");
        setSortOrder(initialData.sortOrder ?? 0);
        setIsActive(initialData.isActive ?? true);
        setSeoTitle(initialData.seoTitle || "");
        setSeoDesc(initialData.seoDesc || "");
      } else {
        setName("");
        setSlug("");
        setIsAutoSlug(true);
        setParentId(prefilledParentId || null);
        setDescription("");
        setImage("");
        setSortOrder(0);
        setIsActive(true);
        setSeoTitle("");
        setSeoDesc("");
      }
    }
  }, [isOpen, initialData, prefilledParentId]);

  if (!isOpen) return null;

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setName(val);
    if (isAutoSlug) {
      setSlug(slugify(val));
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setErrorMessage(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Không thể tải ảnh lên");
      }

      setImage(data.url);
    } catch (err) {
      console.error(err);
      setErrorMessage((err as Error).message);
    } finally {
      setIsUploading(false);
      e.target.value = "";
    }
  };

  const handleAddImageUrl = () => {
    if (!imageUrlInput.trim()) return;
    setImage(imageUrlInput.trim());
    setImageUrlInput("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!name.trim()) {
      setErrorMessage("Vui lòng nhập tên danh mục");
      return;
    }
    if (!slug.trim()) {
      setErrorMessage("Vui lòng nhập đường dẫn tĩnh (slug)");
      return;
    }

    const payload: CategoryInput = {
      name: name.trim(),
      slug: slug.trim(),
      parentId: parentId || null,
      description: description.trim() || null,
      image: image.trim() || null,
      sortOrder: Number(sortOrder) || 0,
      isActive,
      seoTitle: seoTitle.trim() || null,
      seoDesc: seoDesc.trim() || null,
    };

    setIsSubmitting(true);

    try {
      const url = isEdit
        ? `/api/admin/categories/${initialData?.id}`
        : "/api/admin/categories";
      const method = isEdit ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const resData = await res.json();
      if (!res.ok) {
        throw new Error(resData.error || "Không thể lưu danh mục");
      }

      onSuccess();
      onClose();
    } catch (err) {
      console.error(err);
      setErrorMessage((err as Error).message);
      setIsSubmitting(false);
    }
  };

  // Nếu đang chỉnh sửa một danh mục cha có danh mục con, không cho đổi parentId
  const hasChildren = Boolean(initialData?.childCount && initialData.childCount > 0);

  // Lọc bỏ chính danh mục đang sửa khỏi danh sách chọn danh mục cha
  const availableParents = rootCategories.filter(
    (c) => !initialData?.id || c.id !== initialData.id
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl max-w-xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between shrink-0 bg-slate-50/50">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-wine-50 text-wine-800 flex items-center justify-center font-bold">
              <FolderTree className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                {isEdit ? `Chỉnh Sửa Danh Mục: ${initialData?.name}` : "Thêm Danh Mục Mới"}
              </h3>
              <p className="text-xs text-slate-500">
                {isEdit ? "Cập nhật thông tin phân cấp và SEO" : "Thiết lập ngành hàng chính hoặc danh mục con"}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body (Scrollable) */}
        <form onSubmit={handleSubmit} className="overflow-y-auto p-6 space-y-4 flex-1">
          {errorMessage && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2.5">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Tên danh mục */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Tên danh mục <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={handleNameChange}
              placeholder="Ví dụ: Thực phẩm chức năng, Trà & Cà phê ngoại nhập..."
              required
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-wine-800/20 focus:border-wine-800"
            />
          </div>

          {/* Đường dẫn Slug */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-bold text-slate-700">
                Đường dẫn tĩnh (Slug) <span className="text-rose-500">*</span>
              </label>
              <button
                type="button"
                onClick={() => {
                  setIsAutoSlug(!isAutoSlug);
                  if (!isAutoSlug) setSlug(slugify(name));
                }}
                className="text-[11px] font-semibold text-wine-800 hover:underline"
              >
                {isAutoSlug ? "Tự động sinh (Bật)" : "Tùy chỉnh thủ công (Tắt)"}
              </button>
            </div>
            <div className="flex items-center">
              <span className="inline-flex items-center px-3 py-2.5 rounded-l-xl border border-r-0 border-slate-200 bg-slate-50 text-slate-400 text-xs font-mono">
                /danh-muc/
              </span>
              <input
                type="text"
                value={slug}
                onChange={(e) => {
                  setSlug(e.target.value);
                  setIsAutoSlug(false);
                }}
                placeholder="thuc-pham-chuc-nang"
                required
                className="w-full px-3.5 py-2.5 rounded-r-xl border border-slate-200 text-xs font-mono text-slate-800 focus:outline-none focus:ring-2 focus:ring-wine-800/20 focus:border-wine-800"
              />
            </div>
          </div>

          {/* Phân cấp danh mục (Danh mục cha) */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Phân cấp danh mục
            </label>
            <select
              value={parentId || ""}
              onChange={(e) => setParentId(e.target.value || null)}
              disabled={hasChildren}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-wine-800/20 focus:border-wine-800 disabled:bg-slate-100 disabled:text-slate-400"
            >
              <option value="">📁 Là Ngành hàng chính (Cấp 1 - Gốc)</option>
              {availableParents.map((p) => (
                <option key={p.id} value={p.id}>
                  ↳ Trực thuộc ngành hàng: {p.name}
                </option>
              ))}
            </select>
            {hasChildren && (
              <p className="text-[11px] text-amber-700 mt-1 italic">
                * Danh mục này đang chứa {initialData?.childCount} danh mục con nên bắt buộc phải là ngành hàng gốc.
              </p>
            )}
          </div>

          {/* Thứ tự sắp xếp & Trạng thái */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Thứ tự sắp xếp (Nhỏ đứng trước)
              </label>
              <input
                type="number"
                min="0"
                value={sortOrder}
                onChange={(e) => setSortOrder(parseInt(e.target.value) || 0)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-wine-800"
              />
            </div>

            <div className="flex items-center pt-5">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="w-4 h-4 text-wine-800 rounded focus:ring-wine-800"
                />
                <span className="text-xs font-bold text-slate-800">
                  Hiển thị trên Cửa hàng (Kích hoạt)
                </span>
              </label>
            </div>
          </div>

          {/* Hình ảnh / Icon đại diện */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Ảnh / Icon đại diện ngành hàng
            </label>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-xl bg-slate-100 border border-slate-200 overflow-hidden flex items-center justify-center shrink-0">
                  {image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={image}
                      alt="Category preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <ImageIcon className="w-6 h-6 text-slate-400" />
                  )}
                </div>

                <div className="flex-1 space-y-1.5">
                  <div className="flex items-center gap-2">
                    <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 cursor-pointer transition-colors">
                      <Upload className="w-3.5 h-3.5" />
                      <span>{isUploading ? "Đang tải..." : "Tải ảnh từ máy"}</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        disabled={isUploading}
                        className="hidden"
                      />
                    </label>

                    {image && (
                      <button
                        type="button"
                        onClick={() => setImage("")}
                        className="text-xs text-rose-600 hover:underline font-semibold"
                      >
                        Xóa ảnh
                      </button>
                    )}
                  </div>

                  <div className="flex items-center gap-1.5">
                    <input
                      type="url"
                      value={imageUrlInput}
                      onChange={(e) => setImageUrlInput(e.target.value)}
                      placeholder="Hoặc dán URL ảnh ngoài..."
                      className="flex-1 px-3 py-1.5 rounded-lg border border-slate-200 text-xs focus:outline-none focus:ring-1 focus:ring-wine-800"
                    />
                    <button
                      type="button"
                      onClick={handleAddImageUrl}
                      className="px-2.5 py-1.5 rounded-lg bg-slate-900 text-white text-xs font-bold hover:bg-slate-800"
                    >
                      Dán link
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Mô tả danh mục */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Mô tả ngắn ngành hàng
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Giới thiệu vắn tắt về các dòng sản phẩm trong ngành hàng này..."
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-1 focus:ring-wine-800"
            />
          </div>

          {/* Tối ưu SEO */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2.5">
            <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
              Tối ưu SEO Google (Tùy chọn)
            </span>
            <div>
              <input
                type="text"
                value={seoTitle}
                onChange={(e) => setSeoTitle(e.target.value)}
                placeholder="Tiêu đề SEO (Meta Title)..."
                className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs bg-white focus:outline-none focus:ring-1 focus:ring-wine-800"
              />
            </div>
            <div>
              <textarea
                rows={2}
                value={seoDesc}
                onChange={(e) => setSeoDesc(e.target.value)}
                placeholder="Mô tả SEO (Meta Description)..."
                className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs bg-white focus:outline-none focus:ring-1 focus:ring-wine-800"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="pt-2 border-t border-slate-100 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-wine-800 hover:bg-wine-900 text-white text-xs font-bold shadow-sm transition-all disabled:opacity-50"
            >
              {isSubmitting ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Check className="w-3.5 h-3.5" />
              )}
              <span>{isEdit ? "Lưu Cập Nhật" : "Tạo Mới Danh Mục"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
