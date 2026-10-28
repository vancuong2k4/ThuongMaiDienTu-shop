"use client";

// ============================================================
// components/admin/dashboard/LowStockTable.tsx
// Bảng Cảnh Báo Sản Phẩm Sắp Hết Hàng (Stock <= 10)
// ============================================================

import React from "react";
import Link from "next/link";
import { formatCurrency } from "@/lib/utils";
import { AlertTriangle, CheckCircle2, ArrowRight, Package } from "lucide-react";

interface LowStockItem {
  id: string;
  variantName: string;
  sku: string;
  stock: number;
  price: number;
  productId: string;
  productName: string;
  productSlug: string;
  productImage?: string | null;
}

interface LowStockTableProps {
  items: LowStockItem[];
}

export const LowStockTable: React.FC<LowStockTableProps> = ({ items }) => {
  if (items.length === 0) {
    return (
      <div className="py-10 text-center flex flex-col items-center justify-center">
        <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3">
          <CheckCircle2 className="w-6 h-6" />
        </div>
        <h4 className="text-sm font-bold text-slate-800">Kho hàng an toàn</h4>
        <p className="text-xs text-slate-500 mt-1 max-w-sm">
          Tất cả sản phẩm đều đang duy trì mức tồn kho dồi dào trên 10 đơn vị.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto scrollbar-thin">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-slate-100 text-[11px] font-bold text-slate-500 uppercase tracking-wider bg-slate-50/60">
            <th className="py-2.5 px-3">Sản phẩm & Phân loại</th>
            <th className="py-2.5 px-3">Mã SKU</th>
            <th className="py-2.5 px-3 text-right">Giá bán</th>
            <th className="py-2.5 px-3 text-center">Tồn kho</th>
            <th className="py-2.5 px-3 text-right">Thao tác</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 text-xs">
          {items.map((item) => {
            const isZero = item.stock === 0;
            const isDanger = item.stock > 0 && item.stock <= 5;

            return (
              <tr
                key={item.id}
                className="hover:bg-slate-50/80 transition-colors group"
              >
                {/* Product info */}
                <td className="py-3 px-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-slate-100 border border-slate-200 overflow-hidden shrink-0 flex items-center justify-center text-slate-400">
                      {item.productImage ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={item.productImage}
                          alt={item.productName}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <Package className="w-4 h-4" />
                      )}
                    </div>
                    <div className="min-w-0 max-w-[220px] sm:max-w-[280px]">
                      <p className="font-bold text-slate-800 truncate group-hover:text-wine-800 transition-colors">
                        {item.productName}
                      </p>
                      <p className="text-[11px] text-slate-500 truncate mt-0.5">
                        {item.variantName}
                      </p>
                    </div>
                  </div>
                </td>

                {/* SKU */}
                <td className="py-3 px-3 font-mono font-bold text-[11px] text-slate-600">
                  {item.sku}
                </td>

                {/* Price */}
                <td className="py-3 px-3 text-right font-semibold text-slate-800">
                  {formatCurrency(item.price)}
                </td>

                {/* Stock with Badge */}
                <td className="py-3 px-3 text-center">
                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold ${
                      isZero
                        ? "bg-rose-100 text-rose-800"
                        : isDanger
                        ? "bg-orange-100 text-orange-800"
                        : "bg-amber-100 text-amber-800"
                    }`}
                  >
                    <AlertTriangle className="w-3 h-3 shrink-0" />
                    <span>{item.stock} cái</span>
                  </span>
                </td>

                {/* Action Link */}
                <td className="py-3 px-3 text-right">
                  <Link
                    href={`/admin/san-pham?search=${encodeURIComponent(item.sku)}`}
                    className="inline-flex items-center gap-1 text-[11px] font-bold text-wine-800 hover:text-wine-900 bg-wine-50 hover:bg-wine-100/80 px-2.5 py-1.5 rounded-lg transition-colors"
                  >
                    <span>Nhập thêm</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
