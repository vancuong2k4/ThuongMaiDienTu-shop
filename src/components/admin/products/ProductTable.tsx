"use client";

// ============================================================
// components/admin/products/ProductTable.tsx
// Bảng Danh sách Sản phẩm Quản trị CMS với Thao tác Nhanh
// ============================================================

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { formatCurrency, getCountryFlag } from "@/lib/utils";
import {
  Package,
  Edit3,
  Trash2,
  ExternalLink,
  Star,
  AlertTriangle,
  CheckCircle2,
  Loader2,
  X,
  AlertCircle,
} from "lucide-react";

export interface ProductItem {
  id: string;
  name: string;
  slug: string;
  brand: string | null;
  origin: string | null;
  specification: string | null;
  isActive: boolean;
  isFeatured: boolean;
  createdAt: Date | string;
  category: {
    id: string;
    name: string;
    slug: string;
  };
  thumbnail: string | null;
  minPrice: number;
  maxPrice: number;
  totalStock: number;
  variantCount: number;
  reviewCount: number;
  variants: Array<{
    id: string;
    name: string;
    sku: string;
    price: number;
    originalPrice: number | null;
    stock: number;
    isActive: boolean;
  }>;
}

interface ProductTableProps {
  products: ProductItem[];
}

export const ProductTable: React.FC<ProductTableProps> = ({
  products: initialProducts,
}) => {
  const router = useRouter();
  const [products, setProducts] = useState<ProductItem[]>(initialProducts);
  const [loadingToggles, setLoadingToggles] = useState<Record<string, boolean>>({});

  // State cho Modal xác nhận xóa
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    product: ProductItem | null;
    isDeleting: boolean;
    resultMessage: string | null;
    resultType: "success" | "warning" | null;
  }>({
    isOpen: false,
    product: null,
    isDeleting: false,
    resultMessage: null,
    resultType: null,
  });

  // Đồng bộ lại khi initialProducts thay đổi (do phân trang hoặc lọc)
  React.useEffect(() => {
    setProducts(initialProducts);
  }, [initialProducts]);

  // Xử lý bật/tắt nhanh trạng thái kinh doanh hoặc nổi bật
  const handleToggle = async (
    id: string,
    field: "isActive" | "isFeatured",
    currentValue: boolean
  ) => {
    const key = `${id}-${field}`;
    if (loadingToggles[key]) return;

    const newValue = !currentValue;

    // Cập nhật Optimistic trên giao diện
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, [field]: newValue } : p))
    );
    setLoadingToggles((prev) => ({ ...prev, [key]: true }));

    try {
      const res = await fetch(`/api/admin/products/${id}/toggle`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ field, value: newValue }),
      });

      if (!res.ok) {
        throw new Error("Lỗi cập nhật trạng thái");
      }
      router.refresh();
    } catch (err) {
      console.error(err);
      // Revert lại nếu có lỗi
      setProducts((prev) =>
        prev.map((p) => (p.id === id ? { ...p, [field]: currentValue } : p))
      );
      alert("Không thể cập nhật trạng thái sản phẩm. Vui lòng thử lại.");
    } finally {
      setLoadingToggles((prev) => ({ ...prev, [key]: false }));
    }
  };

  // Mở modal xác nhận xóa
  const openDeleteModal = (product: ProductItem) => {
    setDeleteModal({
      isOpen: true,
      product,
      isDeleting: false,
      resultMessage: null,
      resultType: null,
    });
  };

  // Thực thi xóa sản phẩm
  const confirmDelete = async () => {
    if (!deleteModal.product) return;

    setDeleteModal((prev) => ({ ...prev, isDeleting: true }));

    try {
      const res = await fetch(`/api/admin/products/${deleteModal.product.id}`, {
        method: "DELETE",
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Không thể xóa sản phẩm");
      }

      if (data.action === "DEACTIVATED") {
        setDeleteModal((prev) => ({
          ...prev,
          isDeleting: false,
          resultMessage: data.message,
          resultType: "warning",
        }));
      } else {
        setDeleteModal((prev) => ({
          ...prev,
          isDeleting: false,
          resultMessage: data.message,
          resultType: "success",
        }));
      }

      router.refresh();
    } catch (error) {
      console.error(error);
      alert((error as Error).message);
      setDeleteModal((prev) => ({ ...prev, isDeleting: false }));
    }
  };

  const closeDeleteModal = () => {
    setDeleteModal({
      isOpen: false,
      product: null,
      isDeleting: false,
      resultMessage: null,
      resultType: null,
    });
    router.refresh();
  };

  if (products.length === 0) {
    return (
      <div className="py-16 text-center flex flex-col items-center justify-center bg-white rounded-2xl border border-slate-200">
        <div className="w-14 h-14 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mb-3">
          <Package className="w-7 h-7" />
        </div>
        <h4 className="text-sm font-bold text-slate-800">
          Không tìm thấy sản phẩm nào
        </h4>
        <p className="text-xs text-slate-500 mt-1 max-w-sm">
          Thử thay đổi từ khóa tìm kiếm hoặc các điều kiện trong bộ lọc bên trên.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto scrollbar-thin">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 text-[11px] font-bold text-slate-500 uppercase tracking-wider bg-slate-50/70">
                <th className="py-3 px-4">Sản phẩm</th>
                <th className="py-3 px-3">Danh mục & Xuất xứ</th>
                <th className="py-3 px-3 text-right">Giá bán</th>
                <th className="py-3 px-3 text-center">Tồn kho</th>
                <th className="py-3 px-3 text-center">Nổi bật</th>
                <th className="py-3 px-3 text-center">Kinh doanh</th>
                <th className="py-3 px-4 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {products.map((product) => {
                const isZeroStock = product.totalStock === 0;
                const isLowStock =
                  product.totalStock > 0 && product.totalStock <= 10;
                const activeLoading = loadingToggles[`${product.id}-isActive`];
                const featuredLoading =
                  loadingToggles[`${product.id}-isFeatured`];

                return (
                  <tr
                    key={product.id}
                    className="hover:bg-slate-50/80 transition-colors group"
                  >
                    {/* 1. Thumbnail + Tên sản phẩm + SKU */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-xl bg-slate-100 border border-slate-200/80 overflow-hidden shrink-0 flex items-center justify-center relative">
                          {product.thumbnail ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={product.thumbnail}
                              alt={product.name}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                            />
                          ) : (
                            <Package className="w-5 h-5 text-slate-400" />
                          )}
                          {product.variantCount > 1 && (
                            <span className="absolute bottom-0 right-0 bg-slate-900/80 text-white text-[9px] font-bold px-1 rounded-tl">
                              +{product.variantCount}
                            </span>
                          )}
                        </div>

                        <div className="min-w-0 max-w-[240px] sm:max-w-[300px]">
                          <Link
                            href={`/admin/san-pham/${product.id}`}
                            className="font-bold text-slate-900 hover:text-wine-800 line-clamp-1 transition-colors"
                            title={product.name}
                          >
                            {product.name}
                          </Link>

                          <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-500">
                            {product.brand && (
                              <span className="font-semibold text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded text-[10px]">
                                {product.brand}
                              </span>
                            )}
                            <span className="font-mono text-slate-400 text-[10px] truncate">
                              {product.variants[0]?.sku || product.slug}
                            </span>
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* 2. Danh mục & Xuất xứ */}
                    <td className="py-3.5 px-3">
                      <div>
                        <span className="font-medium text-slate-800 block truncate max-w-[150px]">
                          {product.category?.name || "Chưa phân loại"}
                        </span>
                        {product.origin && (
                          <span className="inline-flex items-center gap-1 text-[11px] text-slate-500 mt-0.5">
                            <span>{getCountryFlag(product.origin)}</span>
                            <span>{product.origin}</span>
                          </span>
                        )}
                      </div>
                    </td>

                    {/* 3. Giá bán */}
                    <td className="py-3.5 px-3 text-right">
                      {product.minPrice === product.maxPrice ? (
                        <span className="font-extrabold text-slate-900">
                          {formatCurrency(product.minPrice)}
                        </span>
                      ) : (
                        <div className="flex flex-col items-end">
                          <span className="font-extrabold text-slate-900">
                            {formatCurrency(product.minPrice)}
                          </span>
                          <span className="text-[10px] text-slate-500">
                            đến {formatCurrency(product.maxPrice)}
                          </span>
                        </div>
                      )}
                    </td>

                    {/* 4. Tồn kho */}
                    <td className="py-3.5 px-3 text-center">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold ${
                          isZeroStock
                            ? "bg-rose-100 text-rose-800 border border-rose-200"
                            : isLowStock
                            ? "bg-amber-100 text-amber-800 border border-amber-200"
                            : "bg-emerald-50 text-emerald-800 border border-emerald-200"
                        }`}
                      >
                        {isLowStock && <AlertTriangle className="w-3 h-3" />}
                        <span>
                          {isZeroStock
                            ? "Hết hàng"
                            : `${product.totalStock} cái`}
                        </span>
                      </span>
                    </td>

                    {/* 5. Nổi bật ⭐ */}
                    <td className="py-3.5 px-3 text-center">
                      <button
                        type="button"
                        onClick={() =>
                          handleToggle(
                            product.id,
                            "isFeatured",
                            product.isFeatured
                          )
                        }
                        disabled={featuredLoading}
                        title={
                          product.isFeatured
                            ? "Bỏ đánh dấu nổi bật"
                            : "Đánh dấu sản phẩm nổi bật"
                        }
                        className={`p-1.5 rounded-lg transition-colors ${
                          product.isFeatured
                            ? "text-amber-500 hover:bg-amber-50"
                            : "text-slate-300 hover:text-slate-500 hover:bg-slate-100"
                        }`}
                      >
                        {featuredLoading ? (
                          <Loader2 className="w-4 h-4 animate-spin text-amber-500" />
                        ) : (
                          <Star
                            className={`w-4 h-4 ${
                              product.isFeatured ? "fill-amber-400" : ""
                            }`}
                          />
                        )}
                      </button>
                    </td>

                    {/* 6. Trạng thái kinh doanh */}
                    <td className="py-3.5 px-3 text-center">
                      <button
                        type="button"
                        onClick={() =>
                          handleToggle(product.id, "isActive", product.isActive)
                        }
                        disabled={activeLoading}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold transition-all ${
                          product.isActive
                            ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-200"
                            : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                        }`}
                      >
                        {activeLoading ? (
                          <Loader2 className="w-3 h-3 animate-spin" />
                        ) : (
                          <span
                            className={`w-2 h-2 rounded-full ${
                              product.isActive
                                ? "bg-emerald-500"
                                : "bg-slate-400"
                            }`}
                          />
                        )}
                        <span>
                          {product.isActive ? "Đang bán" : "Ngừng bán"}
                        </span>
                      </button>
                    </td>

                    {/* 7. Thao tác */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        {/* Xem trên trang chủ */}
                        <Link
                          href={`/san-pham/${product.slug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          title="Xem trên website khách hàng"
                          className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-700 hover:bg-emerald-50 transition-colors"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </Link>

                        {/* Sửa */}
                        <Link
                          href={`/admin/san-pham/${product.id}`}
                          title="Chỉnh sửa sản phẩm & biến thể"
                          className="p-1.5 rounded-lg text-slate-400 hover:text-wine-800 hover:bg-wine-50 transition-colors"
                        >
                          <Edit3 className="w-4 h-4" />
                        </Link>

                        {/* Xóa */}
                        <button
                          type="button"
                          onClick={() => openDeleteModal(product)}
                          title="Xóa hoặc ngừng kinh doanh sản phẩm"
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Modal Xác Nhận Xóa / Ngừng Kinh Doanh ─────────────────── */}
      {deleteModal.isOpen && deleteModal.product && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 p-6 space-y-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
                  <AlertCircle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Xác nhận thao tác xóa
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Mã ID: {deleteModal.product.id}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={closeDeleteModal}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {deleteModal.resultMessage ? (
              <div
                className={`p-3.5 rounded-xl text-xs leading-relaxed ${
                  deleteModal.resultType === "warning"
                    ? "bg-amber-50 text-amber-900 border border-amber-200"
                    : "bg-emerald-50 text-emerald-900 border border-emerald-200"
                }`}
              >
                {deleteModal.resultMessage}
              </div>
            ) : (
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Bạn có chắc chắn muốn xóa sản phẩm{" "}
                <strong className="text-slate-900">
                  &ldquo;{deleteModal.product.name}&rdquo;
                </strong>
                ?
                <br />
                <span className="text-[11px] text-slate-500 mt-2 block italic">
                  * Ghi chú an toàn: Nếu sản phẩm đã từng phát sinh đơn hàng, hệ
                  thống sẽ tự động chuyển sang trạng thái &ldquo;Ngừng kinh
                  doanh&rdquo; để bảo toàn tính toàn vẹn của lịch sử hóa đơn.
                </span>
              </p>
            )}

            <div className="flex items-center justify-end gap-2 pt-2">
              {deleteModal.resultMessage ? (
                <button
                  type="button"
                  onClick={closeDeleteModal}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-900 text-white hover:bg-slate-800 transition-colors"
                >
                  Đã hiểu & Đóng
                </button>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={closeDeleteModal}
                    disabled={deleteModal.isDeleting}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
                  >
                    Hủy bỏ
                  </button>
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
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
