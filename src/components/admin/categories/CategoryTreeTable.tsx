"use client";

// ============================================================
// components/admin/categories/CategoryTreeTable.tsx
// Bảng Phân Cấp Cây Danh Mục Ngành Hàng Admin CMS
// ============================================================

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  FolderTree,
  Folder,
  ChevronDown,
  ChevronRight,
  Plus,
  Edit3,
  Trash2,
  ExternalLink,
  Layers,
  Package,
  Loader2,
  AlertCircle,
  X,
  CheckCircle2,
  Search,
  Filter,
} from "lucide-react";
import { CategoryModal, type CategoryModalData } from "./CategoryModal";

export interface CategoryTreeItem {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image: string | null;
  parentId: string | null;
  parent?: { id: string; name: string; slug: string } | null;
  sortOrder: number;
  isActive: boolean;
  seoTitle: string | null;
  seoDesc: string | null;
  directProductCount: number;
  childCount: number;
  totalProductCount: number;
  children?: Array<{
    id: string;
    name: string;
    slug: string;
    description: string | null;
    image: string | null;
    parentId: string | null;
    sortOrder: number;
    isActive: boolean;
    directProductCount: number;
  }>;
}

interface CategoryTreeTableProps {
  categories: CategoryTreeItem[];
}

export const CategoryTreeTable: React.FC<CategoryTreeTableProps> = ({
  categories: initialCategories,
}) => {
  const router = useRouter();
  const [categories, setCategories] = useState<CategoryTreeItem[]>(initialCategories);
  const [search, setSearch] = useState("");
  const [filterLevel, setFilterLevel] = useState<"all" | "root" | "sub">("all");
  const [filterActive, setFilterActive] = useState<"all" | "active" | "inactive">("all");

  // State các danh mục cha đang mở rộng (expanded)
  const [expandedIds, setExpandedIds] = useState<Record<string, boolean>>(() => {
    // Mặc định mở rộng tất cả danh mục gốc
    const init: Record<string, boolean> = {};
    initialCategories.forEach((c) => {
      if (!c.parentId) init[c.id] = true;
    });
    return init;
  });

  // State cho Modal Tạo / Sửa
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    initialData: CategoryModalData | null;
    prefilledParentId: string | null;
  }>({
    isOpen: false,
    initialData: null,
    prefilledParentId: null,
  });

  // State cho Modal Xóa An Toàn
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    category: {
      id: string;
      name: string;
      childCount: number;
      productCount: number;
    } | null;
    isDeleting: boolean;
    errorMessage: string | null;
  }>({
    isOpen: false,
    category: null,
    isDeleting: false,
    errorMessage: null,
  });

  const [loadingToggles, setLoadingToggles] = useState<Record<string, boolean>>({});

  // Cập nhật khi prop thay đổi
  React.useEffect(() => {
    setCategories(initialCategories);
  }, [initialCategories]);

  // Bật/tắt mở rộng một danh mục gốc
  const toggleExpand = (id: string) => {
    setExpandedIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const expandAll = () => {
    const all: Record<string, boolean> = {};
    categories.forEach((c) => {
      if (!c.parentId) all[c.id] = true;
    });
    setExpandedIds(all);
  };

  const collapseAll = () => {
    setExpandedIds({});
  };

  // Bật / Tắt nhanh isActive
  const handleToggleActive = async (id: string, currentActive: boolean) => {
    if (loadingToggles[id]) return;
    const newActive = !currentActive;

    // Optimistic Update
    setCategories((prev) =>
      prev.map((cat) => {
        if (cat.id === id) return { ...cat, isActive: newActive };
        if (cat.children) {
          return {
            ...cat,
            children: cat.children.map((child) =>
              child.id === id ? { ...child, isActive: newActive } : child
            ),
          };
        }
        return cat;
      })
    );

    setLoadingToggles((prev) => ({ ...prev, [id]: true }));

    try {
      const res = await fetch(`/api/admin/categories/${id}/toggle`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: newActive }),
      });

      if (!res.ok) {
        throw new Error("Lỗi khi cập nhật trạng thái");
      }
      router.refresh();
    } catch (err) {
      console.error(err);
      // Revert lại
      setCategories((prev) =>
        prev.map((cat) => {
          if (cat.id === id) return { ...cat, isActive: currentActive };
          if (cat.children) {
            return {
              ...cat,
              children: cat.children.map((child) =>
                child.id === id ? { ...child, isActive: currentActive } : child
              ),
            };
          }
          return cat;
        })
      );
      alert("Không thể cập nhật trạng thái danh mục.");
    } finally {
      setLoadingToggles((prev) => ({ ...prev, [id]: false }));
    }
  };

  // Mở modal tạo mới danh mục
  const openCreateModal = (prefilledParent?: string | null) => {
    setModalState({
      isOpen: true,
      initialData: null,
      prefilledParentId: prefilledParent || null,
    });
  };

  // Mở modal sửa danh mục
  const openEditModal = (cat: CategoryTreeItem | any) => {
    setModalState({
      isOpen: true,
      initialData: {
        id: cat.id,
        name: cat.name,
        slug: cat.slug,
        parentId: cat.parentId,
        description: cat.description,
        image: cat.image,
        sortOrder: cat.sortOrder,
        isActive: cat.isActive,
        seoTitle: cat.seoTitle,
        seoDesc: cat.seoDesc,
        childCount: cat.childCount || cat.children?.length || 0,
      },
      prefilledParentId: null,
    });
  };

  // Mở modal xóa
  const openDeleteModal = (
    id: string,
    name: string,
    childCount: number,
    productCount: number
  ) => {
    setDeleteModal({
      isOpen: true,
      category: { id, name, childCount, productCount },
      isDeleting: false,
      errorMessage: null,
    });
  };

  // Thực hiện xóa danh mục
  const confirmDelete = async () => {
    if (!deleteModal.category) return;

    setDeleteModal((prev) => ({ ...prev, isDeleting: true, errorMessage: null }));

    try {
      const res = await fetch(`/api/admin/categories/${deleteModal.category.id}`, {
        method: "DELETE",
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Không thể xóa danh mục");
      }

      setDeleteModal({
        isOpen: false,
        category: null,
        isDeleting: false,
        errorMessage: null,
      });

      router.refresh();
    } catch (err) {
      setDeleteModal((prev) => ({
        ...prev,
        isDeleting: false,
        errorMessage: (err as Error).message,
      }));
    }
  };

  // Lọc dữ liệu hiển thị
  const rootCategories = categories.filter((c) => !c.parentId);

  // Lấy danh sách ngành hàng gốc làm options cho modal
  const rootCategoryOptions = rootCategories.map((c) => ({
    id: c.id,
    name: c.name,
  }));

  // Bộ lọc
  const filteredRootCategories = rootCategories.filter((root) => {
    const matchesSearch =
      !search ||
      root.name.toLowerCase().includes(search.toLowerCase()) ||
      root.slug.toLowerCase().includes(search.toLowerCase()) ||
      root.children?.some(
        (child) =>
          child.name.toLowerCase().includes(search.toLowerCase()) ||
          child.slug.toLowerCase().includes(search.toLowerCase())
      );

    const matchesActive =
      filterActive === "all" ||
      (filterActive === "active" && root.isActive) ||
      (filterActive === "inactive" && !root.isActive);

    const matchesLevel =
      filterLevel === "all" || filterLevel === "root" || filterLevel === "sub";

    return matchesSearch && matchesActive && matchesLevel;
  });

  return (
    <div className="space-y-4">
      {/* ── Thanh Công Cụ & Bộ Lọc Nhanh ─────────────────────────── */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Tìm kiếm */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm theo tên hoặc slug danh mục..."
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-wine-800/20 focus:border-wine-800"
          />
        </div>

        {/* Lọc & Hành động */}
        <div className="flex items-center gap-2 flex-wrap">
          <select
            value={filterActive}
            onChange={(e) => setFilterActive(e.target.value as any)}
            className="py-2 px-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 bg-white"
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="active">Đang hiển thị</option>
            <option value="inactive">Đã ẩn</option>
          </select>

          <button
            type="button"
            onClick={expandAll}
            className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors hidden md:inline-flex"
          >
            Mở rộng tất cả
          </button>

          <button
            type="button"
            onClick={collapseAll}
            className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors hidden md:inline-flex"
          >
            Thu gọn
          </button>

          <button
            type="button"
            onClick={() => openCreateModal(null)}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-wine-800 hover:bg-wine-900 text-white text-xs font-bold shadow-md transition-all shrink-0"
          >
            <Plus className="w-4 h-4 text-amber-300" />
            <span>Thêm ngành hàng</span>
          </button>
        </div>
      </div>

      {/* ── Bảng Dữ Liệu Phân Cấp Cây Danh Mục ──────────────────── */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto scrollbar-thin">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 text-[11px] font-bold text-slate-500 uppercase tracking-wider bg-slate-50/70">
                <th className="py-3 px-4 w-12 text-center">#</th>
                <th className="py-3 px-3">Tên Danh Mục & Phân Cấp</th>
                <th className="py-3 px-3">Đường dẫn tĩnh (Slug)</th>
                <th className="py-3 px-3 text-center">Thứ tự</th>
                <th className="py-3 px-3 text-center">Số Sản Phẩm</th>
                <th className="py-3 px-3 text-center">Hiển thị</th>
                <th className="py-3 px-4 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filteredRootCategories.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400 italic">
                    Không tìm thấy danh mục nào phù hợp với bộ lọc.
                  </td>
                </tr>
              ) : (
                filteredRootCategories.map((root) => {
                  const isExpanded = Boolean(expandedIds[root.id]);
                  const children = root.children || [];
                  const toggleLoading = loadingToggles[root.id];

                  // Khi đang tìm kiếm: chỉ hiển thị các danh mục con khớp từ khóa (hoặc hiển thị hết nếu chính danh mục gốc khớp)
                  const isRootMatched =
                    !search ||
                    root.name.toLowerCase().includes(search.toLowerCase()) ||
                    root.slug.toLowerCase().includes(search.toLowerCase());

                  const displayedChildren = children.filter(
                    (child) =>
                      isRootMatched ||
                      child.name.toLowerCase().includes(search.toLowerCase()) ||
                      child.slug.toLowerCase().includes(search.toLowerCase())
                  );

                  return (
                    <React.Fragment key={root.id}>
                      {/* ── Hàng Danh Mục Cha (Cấp 1) ───────────────── */}
                      <tr className="bg-slate-50/40 hover:bg-slate-100/60 transition-colors font-medium group">
                        {/* Nút Thu gọn / Mở rộng */}
                        <td className="py-3.5 px-4 text-center">
                          {children.length > 0 ? (
                            <button
                              type="button"
                              onClick={() => toggleExpand(root.id)}
                              className="p-1 rounded-lg text-slate-500 hover:bg-slate-200/70 transition-colors"
                              title={isExpanded ? "Thu gọn danh mục con" : "Xem các danh mục con"}
                            >
                              {isExpanded ? (
                                <ChevronDown className="w-4 h-4 text-wine-800" />
                              ) : (
                                <ChevronRight className="w-4 h-4 text-slate-600" />
                              )}
                            </button>
                          ) : (
                            <span className="text-slate-300">•</span>
                          )}
                        </td>

                        {/* Tên Danh mục cha & Icon */}
                        <td className="py-3.5 px-3">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-lg bg-wine-50 text-wine-800 border border-wine-200/60 flex items-center justify-center shrink-0 font-bold overflow-hidden">
                              {root.image ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img
                                  src={root.image}
                                  alt={root.name}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <Folder className="w-4 h-4" />
                              )}
                            </div>

                            <div className="min-w-0">
                              <span className="font-extrabold text-slate-900 text-sm block group-hover:text-wine-800 transition-colors">
                                {root.name}
                              </span>
                              <div className="flex items-center gap-1.5 text-[10px] text-slate-400 mt-0.5">
                                <span className="bg-slate-200/70 text-slate-700 px-1.5 py-0.2 rounded font-semibold">
                                  Ngành hàng gốc
                                </span>
                                {children.length > 0 && (
                                  <span>• {children.length} phân loại con</span>
                                )}
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Slug */}
                        <td className="py-3.5 px-3 font-mono text-[11px] text-slate-600">
                          {root.slug}
                        </td>

                        {/* Thứ tự */}
                        <td className="py-3.5 px-3 text-center font-bold text-slate-700">
                          {root.sortOrder}
                        </td>

                        {/* Số lượng sản phẩm */}
                        <td className="py-3.5 px-3 text-center">
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-blue-50 text-blue-800 border border-blue-200/60">
                            <Package className="w-3 h-3" />
                            <span>
                              {root.totalProductCount} SP
                              {root.directProductCount > 0 && root.childCount > 0 && (
                                <span className="text-[10px] text-blue-600 font-normal">
                                  {" "}
                                  ({root.directProductCount} gốc)
                                </span>
                              )}
                            </span>
                          </span>
                        </td>

                        {/* Toggle Hiển thị */}
                        <td className="py-3.5 px-3 text-center">
                          <button
                            type="button"
                            onClick={() => handleToggleActive(root.id, root.isActive)}
                            disabled={toggleLoading}
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold transition-all ${
                              root.isActive
                                ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-200"
                                : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                            }`}
                          >
                            {toggleLoading ? (
                              <Loader2 className="w-3 h-3 animate-spin" />
                            ) : (
                              <span
                                className={`w-2 h-2 rounded-full ${
                                  root.isActive ? "bg-emerald-500" : "bg-slate-400"
                                }`}
                              />
                            )}
                            <span>{root.isActive ? "Hiển thị" : "Đã ẩn"}</span>
                          </button>
                        </td>

                        {/* Thao tác */}
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-1">
                            {/* Thêm danh mục con */}
                            <button
                              type="button"
                              onClick={() => openCreateModal(root.id)}
                              title="Thêm danh mục con vào ngành hàng này"
                              className="p-1.5 rounded-lg text-slate-500 hover:text-wine-800 hover:bg-wine-50 transition-colors"
                            >
                              <Plus className="w-4 h-4" />
                            </button>

                            {/* Xem trên website */}
                            <Link
                              href={`/danh-muc/${root.slug}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              title="Xem danh mục trên Storefront"
                              className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-700 hover:bg-emerald-50 transition-colors"
                            >
                              <ExternalLink className="w-4 h-4" />
                            </Link>

                            {/* Sửa */}
                            <button
                              type="button"
                              onClick={() => openEditModal(root)}
                              title="Chỉnh sửa danh mục"
                              className="p-1.5 rounded-lg text-slate-400 hover:text-wine-800 hover:bg-wine-50 transition-colors"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>

                            {/* Xóa */}
                            <button
                              type="button"
                              onClick={() =>
                                openDeleteModal(
                                  root.id,
                                  root.name,
                                  children.length,
                                  root.totalProductCount
                                )
                              }
                              title="Xóa danh mục"
                              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>

                      {/* ── Danh Sách Danh Mục Con (Cấp 2) ─────────── */}
                      {isExpanded &&
                        displayedChildren.map((child) => {
                          const childToggleLoading = loadingToggles[child.id];

                          return (
                            <tr
                              key={child.id}
                              className="hover:bg-slate-50 transition-colors group"
                            >
                              {/* Cột số # */}
                              <td className="py-2.5 px-4 text-center text-slate-300">
                                <span className="font-mono text-[10px]">↳</span>
                              </td>

                              {/* Tên Danh mục con (Thụt lề) */}
                              <td className="py-2.5 px-3">
                                <div className="flex items-center gap-2 pl-4">
                                  <span className="text-slate-300 font-mono text-sm">
                                    └─
                                  </span>
                                  <div className="w-6 h-6 rounded-md bg-slate-100 border border-slate-200 overflow-hidden flex items-center justify-center shrink-0 text-slate-400">
                                    {child.image ? (
                                      // eslint-disable-next-line @next/next/no-img-element
                                      <img
                                        src={child.image}
                                        alt={child.name}
                                        className="w-full h-full object-cover"
                                      />
                                    ) : (
                                      <FolderTree className="w-3.5 h-3.5" />
                                    )}
                                  </div>

                                  <span className="font-bold text-slate-800 text-xs group-hover:text-wine-800 transition-colors">
                                    {child.name}
                                  </span>
                                </div>
                              </td>

                              {/* Slug */}
                              <td className="py-2.5 px-3 font-mono text-[11px] text-slate-500">
                                {child.slug}
                              </td>

                              {/* Thứ tự */}
                              <td className="py-2.5 px-3 text-center text-slate-600 font-medium">
                                {child.sortOrder}
                              </td>

                              {/* Số lượng sản phẩm */}
                              <td className="py-2.5 px-3 text-center">
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700">
                                  <span>{child.directProductCount} SP</span>
                                </span>
                              </td>

                              {/* Toggle Hiển thị */}
                              <td className="py-2.5 px-3 text-center">
                                <button
                                  type="button"
                                  onClick={() =>
                                    handleToggleActive(child.id, child.isActive)
                                  }
                                  disabled={childToggleLoading}
                                  className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold transition-all ${
                                    child.isActive
                                      ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200/60"
                                      : "bg-slate-100 text-slate-400 hover:bg-slate-200"
                                  }`}
                                >
                                  {childToggleLoading ? (
                                    <Loader2 className="w-2.5 h-2.5 animate-spin" />
                                  ) : (
                                    <span
                                      className={`w-1.5 h-1.5 rounded-full ${
                                        child.isActive
                                          ? "bg-emerald-500"
                                          : "bg-slate-400"
                                      }`}
                                    />
                                  )}
                                  <span>{child.isActive ? "Bật" : "Ẩn"}</span>
                                </button>
                              </td>

                              {/* Thao tác */}
                              <td className="py-2.5 px-4 text-right">
                                <div className="flex items-center justify-end gap-1">
                                  {/* Xem trên website */}
                                  <Link
                                    href={`/danh-muc/${child.slug}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    title="Xem danh mục trên Storefront"
                                    className="p-1 rounded-md text-slate-400 hover:text-emerald-700 hover:bg-emerald-50 transition-colors"
                                  >
                                    <ExternalLink className="w-3.5 h-3.5" />
                                  </Link>

                                  {/* Sửa */}
                                  <button
                                    type="button"
                                    onClick={() => openEditModal(child)}
                                    title="Chỉnh sửa danh mục"
                                    className="p-1 rounded-md text-slate-400 hover:text-wine-800 hover:bg-wine-50 transition-colors"
                                  >
                                    <Edit3 className="w-3.5 h-3.5" />
                                  </button>

                                  {/* Xóa */}
                                  <button
                                    type="button"
                                    onClick={() =>
                                      openDeleteModal(
                                        child.id,
                                        child.name,
                                        0,
                                        child.directProductCount
                                      )
                                    }
                                    title="Xóa danh mục"
                                    className="p-1 rounded-md text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                    </React.Fragment>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Modal Thêm Mới / Sửa Danh Mục ───────────────────────── */}
      <CategoryModal
        isOpen={modalState.isOpen}
        onClose={() =>
          setModalState({
            isOpen: false,
            initialData: null,
            prefilledParentId: null,
          })
        }
        onSuccess={() => {
          router.refresh();
        }}
        initialData={modalState.initialData}
        rootCategories={rootCategoryOptions}
        prefilledParentId={modalState.prefilledParentId}
      />

      {/* ── Modal Xác Nhận Xóa An Toàn ──────────────────────────── */}
      {deleteModal.isOpen && deleteModal.category && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 p-6 space-y-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
                  <AlertCircle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Xác nhận xóa danh mục
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {deleteModal.category.name}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() =>
                  setDeleteModal({
                    isOpen: false,
                    category: null,
                    isDeleting: false,
                    errorMessage: null,
                  })
                }
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Cảnh báo ràng buộc */}
            {deleteModal.errorMessage ? (
              <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs leading-relaxed">
                {deleteModal.errorMessage}
              </div>
            ) : deleteModal.category.childCount > 0 ? (
              <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs leading-relaxed">
                <strong>Chặn thao tác xóa:</strong> Danh mục này hiện đang chứa{" "}
                <strong>{deleteModal.category.childCount} danh mục con</strong>.
                Để xóa, trước hết bạn cần chuyển các danh mục con sang ngành hàng
                khác hoặc xóa các danh mục con trước.
              </div>
            ) : deleteModal.category.productCount > 0 ? (
              <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs leading-relaxed">
                <strong>Chặn thao tác xóa:</strong> Hiện có{" "}
                <strong>{deleteModal.category.productCount} sản phẩm</strong>{" "}
                đang thuộc danh mục này. Vui lòng chuyển các sản phẩm sang danh mục
                khác trước khi xóa để tránh mất dữ liệu liên kết sản phẩm.
              </div>
            ) : (
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Bạn có chắc chắn muốn xóa vĩnh viễn danh mục{" "}
                <strong className="text-slate-900">
                  &ldquo;{deleteModal.category.name}&rdquo;
                </strong>
                ? Thao tác này không thể hoàn tác.
              </p>
            )}

            {/* Actions */}
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() =>
                  setDeleteModal({
                    isOpen: false,
                    category: null,
                    isDeleting: false,
                    errorMessage: null,
                  })
                }
                disabled={deleteModal.isDeleting}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
              >
                {deleteModal.category.childCount > 0 ||
                deleteModal.category.productCount > 0
                  ? "Đã hiểu & Đóng"
                  : "Hủy bỏ"}
              </button>

              {deleteModal.category.childCount === 0 &&
                deleteModal.category.productCount === 0 && (
                  <button
                    type="button"
                    onClick={confirmDelete}
                    disabled={deleteModal.isDeleting}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white transition-colors disabled:opacity-50"
                  >
                    {deleteModal.isDeleting && (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    )}
                    <span>Xác nhận xóa</span>
                  </button>
                )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
