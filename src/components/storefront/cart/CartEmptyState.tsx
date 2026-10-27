"use client";

import Link from "next/link";
import { ShoppingBag, ArrowRight, ShieldCheck, Plane, Award } from "lucide-react";

export function CartEmptyState() {
  return (
    <div className="bg-white rounded-3xl border border-gray-100 p-8 sm:p-14 text-center max-w-2xl mx-auto shadow-2xs space-y-6 my-6">
      <div className="w-20 h-20 rounded-full bg-rose-50 text-[#800028] mx-auto flex items-center justify-center">
        <ShoppingBag className="w-10 h-10" />
      </div>

      <div className="space-y-2">
        <h2 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">
          Giỏ hàng của bạn đang trống
        </h2>
        <p className="text-xs sm:text-sm text-gray-500 max-w-md mx-auto leading-relaxed">
          Bạn chưa chọn sản phẩm nào. Hãy khám phá hàng trăm dòng thực phẩm chức năng, bánh kẹo cao cấp, trái cây bay và mỹ phẩm nhập khẩu chính ngạch nhé!
        </p>
      </div>

      <div className="pt-2">
        <Link
          href="/san-pham"
          className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-[#800028] hover:bg-[#5c001e] text-white font-bold text-xs sm:text-sm shadow-md transition-all hover:scale-[1.02] cursor-pointer"
        >
          <span>Khám phá sản phẩm ngay</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="pt-6 border-t border-gray-100 grid grid-cols-1 sm:grid-cols-3 gap-3 text-left">
        <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-gray-50 border border-gray-100 text-[11px] text-gray-700 font-medium">
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>100% Nhập khẩu chính ngạch</span>
        </div>
        <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-gray-50 border border-gray-100 text-[11px] text-gray-700 font-medium">
          <Plane className="w-4 h-4 text-blue-600 shrink-0" />
          <span>Vận chuyển Air Cargo 48h</span>
        </div>
        <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-gray-50 border border-gray-100 text-[11px] text-gray-700 font-medium">
          <Award className="w-4 h-4 text-amber-600 shrink-0" />
          <span>Cam kết date mới nhất</span>
        </div>
      </div>
    </div>
  );
}
