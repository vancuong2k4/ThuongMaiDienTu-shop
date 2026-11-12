"use client";

// ============================================================
// components/admin/nutrients/NutrientReferenceTable.tsx
// Bảng Danh Sách Chỉ Tiêu Vi Chất Chuẩn Hóa (Phase 19)
// ============================================================

import React, { useState } from "react";
import { Search, Scale, ShieldCheck, AlertTriangle } from "lucide-react";
import { NutrientUnit } from "@prisma/client";

export interface AdminNutrientItem {
  id: string;
  code: string;
  nameVi: string;
  nameEn: string | null;
  category: string;
  standardRdi: any;
  upperLimit: any;
  unit: NutrientUnit;
  benefitsSummary: string;
  cautionNotes: string | null;
  _count?: {
    productNutrients: number;
  };
}

interface NutrientReferenceTableProps {
  nutrients: AdminNutrientItem[];
}

export const NutrientReferenceTable: React.FC<NutrientReferenceTableProps> = ({
  nutrients,
}) => {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");

  const categories = Array.from(new Set(nutrients.map((n) => n.category)));

  const filtered = nutrients.filter((n) => {
    const matchSearch =
      n.code.toLowerCase().includes(search.toLowerCase()) ||
      n.nameVi.toLowerCase().includes(search.toLowerCase()) ||
      (n.nameEn && n.nameEn.toLowerCase().includes(search.toLowerCase()));

    const matchCat =
      selectedCategory === "ALL" || n.category === selectedCategory;

    return matchSearch && matchCat;
  });

  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 shadow-2xs overflow-hidden">
      {/* 1. Filter Bar */}
      <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/40">
        <div className="relative flex-1 max-w-sm">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm theo mã code hoặc tên vi chất..."
            className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-[#800028] bg-white"
          />
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none">
          <button
            type="button"
            onClick={() => setSelectedCategory("ALL")}
            className={`text-xs font-bold px-3 py-1.5 rounded-xl transition-colors whitespace-nowrap ${
              selectedCategory === "ALL"
                ? "bg-[#800028] text-white"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            Tất cả ({nutrients.length})
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`text-xs font-bold px-3 py-1.5 rounded-xl transition-colors whitespace-nowrap ${
                selectedCategory === cat
                  ? "bg-[#800028] text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* 2. Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/70 text-slate-500 font-bold uppercase tracking-wider text-[11px]">
              <th className="p-4">Mã Code</th>
              <th className="p-4">Tên Hoạt Chất Vi Chất</th>
              <th className="p-4">Nhóm</th>
              <th className="p-4 text-center">Khuyến Nghị (RDI)</th>
              <th className="p-4 text-center">Ngưỡng Tối Đa (UL)</th>
              <th className="p-4">Công Dụng & Lưu Ý</th>
              <th className="p-4 text-center">Sản Phẩm</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={7} className="p-8 text-center text-slate-400">
                  Không tìm thấy chỉ tiêu vi chất nào phù hợp.
                </td>
              </tr>
            ) : (
              filtered.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="p-4 font-mono font-black text-slate-900">
                    <span className="px-2.5 py-1 rounded-lg bg-slate-100 border border-slate-200">
                      {item.code}
                    </span>
                  </td>

                  <td className="p-4">
                    <strong className="font-bold text-slate-900 text-xs block">
                      {item.nameVi}
                    </strong>
                    {item.nameEn && (
                      <span className="text-[11px] text-slate-400 italic block mt-0.5">
                        {item.nameEn}
                      </span>
                    )}
                  </td>

                  <td className="p-4">
                    <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200/60">
                      {item.category}
                    </span>
                  </td>

                  <td className="p-4 text-center font-bold text-slate-800">
                    {item.standardRdi ? `${item.standardRdi} ${item.unit}` : "-"}
                  </td>

                  <td className="p-4 text-center">
                    {item.upperLimit ? (
                      <span className="inline-flex items-center gap-1 font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-md border border-rose-200">
                        <AlertTriangle className="w-3 h-3 text-rose-500" />
                        <span>
                          {item.upperLimit} {item.unit}
                        </span>
                      </span>
                    ) : (
                      <span className="text-slate-400">-</span>
                    )}
                  </td>

                  <td className="p-4 max-w-xs">
                    <p className="line-clamp-2 text-[11px] text-slate-600">
                      {item.benefitsSummary}
                    </p>
                    {item.cautionNotes && (
                      <span className="text-[10px] text-amber-700 font-medium block mt-0.5 truncate">
                        Lưu ý: {item.cautionNotes}
                      </span>
                    )}
                  </td>

                  <td className="p-4 text-center">
                    <span className="font-extrabold text-xs text-[#800028] bg-rose-50 px-2.5 py-1 rounded-lg border border-rose-100">
                      {item._count?.productNutrients || 0} SP
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
