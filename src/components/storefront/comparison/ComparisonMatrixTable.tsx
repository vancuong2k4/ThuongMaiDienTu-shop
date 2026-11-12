"use client";

// ============================================================
// components/storefront/comparison/ComparisonMatrixTable.tsx
// Bảng Ma Trận So Sánh Sản Phẩm Đối Chiếu Đồng Trục (Phase 19)
// ============================================================

import React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  X,
  ShoppingBag,
  Plus,
  Check,
  CheckCircle2,
  Award,
  Layers,
  Info,
} from "lucide-react";
import {
  ComparisonMatrixProduct,
  ComparisonMatrixRow,
} from "@/lib/comparison";
import { formatVND } from "@/lib/utils";
import { useCartStore } from "@/store/cart";

interface ComparisonMatrixTableProps {
  products: ComparisonMatrixProduct[];
  matrixRows: ComparisonMatrixRow[];
  onRemoveProduct: (id: string) => void;
  onOpenSearch: () => void;
}

export const ComparisonMatrixTable: React.FC<ComparisonMatrixTableProps> = ({
  products,
  matrixRows,
  onRemoveProduct,
  onOpenSearch,
}) => {
  const addItem = useCartStore((state) => state.addItem);
  const [addedIds, setAddedIds] = React.useState<Record<string, boolean>>({});

  const handleQuickAdd = (p: ComparisonMatrixProduct) => {
    addItem({
      variantId: p.id,
      productId: p.id,
      productName: p.name,
      variantName: p.specification || "Quy cách chuẩn",
      sku: `COMP-${p.slug.slice(0, 8).toUpperCase()}`,
      price: p.price,
      image: p.primaryImage || "/images/placeholder.svg",
      quantity: 1,
      stock: 99,
    });

    setAddedIds((prev) => ({ ...prev, [p.id]: true }));
    setTimeout(() => {
      setAddedIds((prev) => ({ ...prev, [p.id]: false }));
    }, 1800);
  };

  const maxColumns = 4;
  const canAddMore = products.length < maxColumns;

  // Group matrix rows by category
  const generalRows = matrixRows.filter((r) => r.category === "GENERAL");
  const certRows = matrixRows.filter((r) => r.category === "CERTIFICATION");
  const nutrientRows = matrixRows.filter((r) => r.category === "NUTRIENT");
  const experienceRows = matrixRows.filter((r) => r.category === "EXPERIENCE");

  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden font-sans">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[720px]">
          {/* ── 1. Sticky Header Row (Product Cards) ───────────────── */}
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50/70">
              <th className="p-4 sm:p-5 w-48 sm:w-60 align-bottom border-r border-slate-100 bg-slate-100/50">
                <span className="text-xs font-black uppercase tracking-wider text-slate-400 block mb-1">
                  Tiêu chí đối chiếu
                </span>
                <span className="text-xs font-semibold text-slate-600 block">
                  Đang so sánh {products.length}/{maxColumns} sản phẩm
                </span>
              </th>

              {products.map((p) => {
                const isAdded = addedIds[p.id];
                return (
                  <th
                    key={p.id}
                    className="p-4 sm:p-5 w-60 sm:w-72 align-top border-r border-slate-100 last:border-r-0 relative group"
                  >
                    {/* Remove button */}
                    <button
                      type="button"
                      onClick={() => onRemoveProduct(p.id)}
                      className="absolute top-3 right-3 p-1.5 rounded-xl bg-slate-200/70 text-slate-500 hover:text-white hover:bg-rose-600 transition-colors"
                      title="Bỏ khỏi so sánh"
                    >
                      <X className="w-4 h-4" />
                    </button>

                    <div className="space-y-3">
                      {/* Product Thumbnail */}
                      <Link
                        href={`/san-pham/${p.slug}`}
                        className="block relative w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden bg-white border border-slate-200/80 shadow-2xs mx-auto group-hover:scale-105 transition-transform"
                      >
                        <Image
                          src={p.primaryImage || "/images/placeholder.svg"}
                          alt={p.name}
                          fill
                          className="object-cover"
                        />
                      </Link>

                      {/* Brand & Name */}
                      <div className="text-center space-y-1">
                        <span className="text-[10px] font-extrabold uppercase text-[#800028] tracking-wider block">
                          {p.brand || p.categoryName}
                        </span>
                        <Link
                          href={`/san-pham/${p.slug}`}
                          className="font-extrabold text-xs sm:text-sm text-slate-900 hover:text-[#800028] transition-colors line-clamp-2 leading-snug block"
                          title={p.name}
                        >
                          {p.name}
                        </Link>
                      </div>

                      {/* Price & Add to Cart */}
                      <div className="text-center space-y-2 pt-1">
                        <div className="font-black text-sm sm:text-base text-[#800028]">
                          {formatVND(p.price)}
                        </div>

                        <button
                          type="button"
                          onClick={() => handleQuickAdd(p)}
                          className={`w-full py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-xs ${
                            isAdded
                              ? "bg-emerald-600 text-white"
                              : "bg-[#800028] hover:bg-[#660020] text-white"
                          }`}
                        >
                          {isAdded ? (
                            <>
                              <Check className="w-3.5 h-3.5" />
                              <span>Đã Thêm Giỏ!</span>
                            </>
                          ) : (
                            <>
                              <ShoppingBag className="w-3.5 h-3.5" />
                              <span>Thêm Vào Giỏ</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </th>
                );
              })}

              {/* Empty Column if < 4 */}
              {canAddMore && (
                <th className="p-4 sm:p-5 w-60 sm:w-72 align-middle text-center border-r border-slate-100 last:border-r-0">
                  <div className="border-2 border-dashed border-slate-200 rounded-3xl p-6 flex flex-col items-center justify-center space-y-3 min-h-[220px]">
                    <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center">
                      <Plus className="w-6 h-6" />
                    </div>
                    <div>
                      <h5 className="font-extrabold text-xs text-slate-700">
                        Thêm sản phẩm đối chiếu
                      </h5>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        Tối đa {maxColumns} sản phẩm
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={onOpenSearch}
                      className="px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-xs transition-all"
                    >
                      Chọn Sản Phẩm
                    </button>
                  </div>
                </th>
              )}
            </tr>
          </thead>

          {/* ── 2. Table Body with Grouped Rows ────────────────────── */}
          <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
            {/* ── Section A: Thông Tin Chung & Kinh Tế ── */}
            <tr className="bg-slate-100/60 font-black text-slate-800 text-[11px] uppercase tracking-wider">
              <td colSpan={products.length + (canAddMore ? 2 : 1)} className="px-5 py-2.5">
                1. Thông tin chung & Chi phí sử dụng
              </td>
            </tr>
            {generalRows.map((row) => (
              <tr key={row.key} className="hover:bg-slate-50/60 transition-colors">
                <td className="px-5 py-3 font-bold text-slate-600 bg-slate-50/30 border-r border-slate-100">
                  {row.label}
                </td>
                {products.map((p) => {
                  const val = row.values[p.id];
                  return (
                    <td
                      key={p.id}
                      className="px-5 py-3 border-r border-slate-100 last:border-r-0"
                    >
                      {row.key === "price" && typeof val === "number" ? (
                        <span className="font-extrabold text-[#800028]">
                          {formatVND(val)}
                        </span>
                      ) : row.key === "costPerDay" && typeof val === "number" ? (
                        <span className="font-black text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200 inline-block">
                          ~{formatVND(val)}/ngày
                        </span>
                      ) : row.key === "servingsPerPack" && val ? (
                        <span className="font-semibold text-slate-800">
                          {val} ngày dùng (tiết kiệm)
                        </span>
                      ) : (
                        <span>{val ? String(val) : "-"}</span>
                      )}
                    </td>
                  );
                })}
                {canAddMore && <td className="px-5 py-3 bg-slate-50/20" />}
              </tr>
            ))}

            {/* ── Section B: Chứng Nhận Chuẩn Úc ── */}
            <tr className="bg-slate-100/60 font-black text-slate-800 text-[11px] uppercase tracking-wider">
              <td colSpan={products.length + (canAddMore ? 2 : 1)} className="px-5 py-2.5">
                2. Chứng nhận tiêu chuẩn & Kiểm định Úc
              </td>
            </tr>
            {certRows.map((row) => (
              <tr key={row.key} className="hover:bg-slate-50/60 transition-colors">
                <td className="px-5 py-3 font-bold text-slate-600 bg-slate-50/30 border-r border-slate-100">
                  {row.label}
                </td>
                {products.map((p) => (
                  <td
                    key={p.id}
                    className="px-5 py-3 border-r border-slate-100 last:border-r-0"
                  >
                    <div className="flex items-start gap-1.5 text-emerald-800 font-bold">
                      <Award className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{String(row.values[p.id] || "-")}</span>
                    </div>
                  </td>
                ))}
                {canAddMore && <td className="px-5 py-3 bg-slate-50/20" />}
              </tr>
            ))}

            {/* ── Section C: Bảng Vi Chất Đối Chiếu ── */}
            <tr className="bg-gradient-to-r from-emerald-100/70 to-emerald-50 font-black text-emerald-950 text-[11px] uppercase tracking-wider">
              <td colSpan={products.length + (canAddMore ? 2 : 1)} className="px-5 py-2.5">
                3. Bảng hàm lượng vi chất dinh dưỡng đối chiếu đồng trục
              </td>
            </tr>
            {nutrientRows.length === 0 ? (
              <tr>
                <td
                  colSpan={products.length + (canAddMore ? 2 : 1)}
                  className="px-5 py-4 text-slate-400 italic text-center"
                >
                  Chưa có thông số vi chất dinh dưỡng cụ thể cho các sản phẩm đã chọn.
                </td>
              </tr>
            ) : (
              nutrientRows.map((row) => (
                <tr key={row.key} className="hover:bg-slate-50/60 transition-colors">
                  <td className="px-5 py-3 font-bold text-slate-800 bg-slate-50/30 border-r border-slate-100">
                    <div className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      <span>{row.label}</span>
                    </div>
                  </td>
                  {products.map((p) => {
                    const val = row.values[p.id];
                    const hasVal = val && val !== "-";
                    return (
                      <td
                        key={p.id}
                        className="px-5 py-3 border-r border-slate-100 last:border-r-0"
                      >
                        {hasVal ? (
                          <span className="inline-block px-2.5 py-1 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-900 font-black">
                            {String(val)}
                          </span>
                        ) : (
                          <span className="text-slate-300 font-mono">-</span>
                        )}
                      </td>
                    );
                  })}
                  {canAddMore && <td className="px-5 py-3 bg-slate-50/20" />}
                </tr>
              ))
            )}

            {/* ── Section D: Cảm Quan & Trải Nghiệm ── */}
            <tr className="bg-slate-100/60 font-black text-slate-800 text-[11px] uppercase tracking-wider">
              <td colSpan={products.length + (canAddMore ? 2 : 1)} className="px-5 py-2.5">
                4. Cảm quan trải nghiệm & Điểm độc quyền
              </td>
            </tr>
            {experienceRows.map((row) => (
              <tr key={row.key} className="hover:bg-slate-50/60 transition-colors">
                <td className="px-5 py-3 font-bold text-slate-600 bg-slate-50/30 border-r border-slate-100">
                  {row.label}
                </td>
                {products.map((p) => {
                  const val = row.values[p.id];
                  if (row.key === "keyDifferentiators" && Array.isArray(val)) {
                    return (
                      <td
                        key={p.id}
                        className="px-5 py-3 border-r border-slate-100 last:border-r-0"
                      >
                        <ul className="space-y-1.5">
                          {val.map((diff, idx) => (
                            <li key={idx} className="flex items-start gap-1.5 text-[11px] text-slate-700">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                              <span>{diff}</span>
                            </li>
                          ))}
                        </ul>
                      </td>
                    );
                  }

                  return (
                    <td
                      key={p.id}
                      className="px-5 py-3 border-r border-slate-100 last:border-r-0 text-slate-700"
                    >
                      {val ? String(val) : "-"}
                    </td>
                  );
                })}
                {canAddMore && <td className="px-5 py-3 bg-slate-50/20" />}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
