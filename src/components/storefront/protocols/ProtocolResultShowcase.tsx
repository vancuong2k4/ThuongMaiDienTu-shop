"use client";

// ============================================================
// components/storefront/protocols/ProtocolResultShowcase.tsx
// Trình Trưng Bày Phác Đồ Cá Nhân Hóa & Đặt Hàng Combo 1-Chạm (Phase 16)
// ============================================================

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Stethoscope,
  Clock,
  ShieldCheck,
  ShoppingBag,
  Phone,
  CheckCircle2,
  Calendar,
  Sparkles,
  ArrowRight,
  RotateCcw,
  Percent,
  Check,
} from "lucide-react";
import { useCartStore } from "@/store/cart";
import { formatVND } from "@/lib/utils";
import { HEALTH_TARGET_GROUPS_CONFIG } from "@/lib/validations/protocol";

interface ProtocolItem {
  id: string;
  productId: string;
  variantId: string | null;
  usageInstructions: string;
  timing: string;
  quantity: number;
  isEssential: boolean;
  product: {
    id: string;
    name: string;
    slug: string;
    origin?: string | null;
    images?: Array<{ url: string }>;
  };
  variant: {
    id: string;
    name: string;
    sku: string;
    price: number | string;
    originalPrice: number | string | null;
    stock: number;
  } | null;
}

interface ProtocolData {
  id: string;
  slug: string;
  title: string;
  targetGroup: string;
  subtitle?: string | null;
  description: string;
  keyNutrients: string[];
  pharmacistAdvice: string;
  dosageSchedule: any;
  comboDiscountPercent: number;
  items: ProtocolItem[];
}

interface ProtocolResultShowcaseProps {
  protocol: ProtocolData;
  pricing?: {
    totalPrice: number;
    discountPercent: number;
    comboPrice: number;
    savings: number;
  };
  assessmentId?: string;
  customerName?: string;
  onOpenConsultationModal: () => void;
  onRetakeQuiz: () => void;
}

export const ProtocolResultShowcase: React.FC<ProtocolResultShowcaseProps> = ({
  protocol,
  pricing,
  assessmentId,
  customerName,
  onOpenConsultationModal,
  onRetakeQuiz,
}) => {
  const { addItem } = useCartStore();
  const [addedAll, setAddedAll] = useState(false);

  const groupConf =
    HEALTH_TARGET_GROUPS_CONFIG[
      protocol.targetGroup as keyof typeof HEALTH_TARGET_GROUPS_CONFIG
    ] || HEALTH_TARGET_GROUPS_CONFIG.BABY_KIDS;

  // Tính toán giá nếu pricing prop chưa truyền
  const totalPrice =
    pricing?.totalPrice ??
    protocol.items.reduce((acc, it) => {
      const p = it.variant?.price ? Number(it.variant.price) : 500000;
      return acc + p * it.quantity;
    }, 0);

  const discountPercent = pricing?.discountPercent ?? protocol.comboDiscountPercent ?? 10;
  const comboPrice =
    pricing?.comboPrice ?? Math.round(totalPrice * (1 - discountPercent / 100));
  const savings = pricing?.savings ?? (totalPrice - comboPrice);

  // Thêm tất cả sản phẩm phác đồ vào giỏ hàng kèm giá combo ưu đãi
  const handleAddAllToCart = () => {
    protocol.items.forEach((it) => {
      if (!it.variant) return;
      const unitOriginalPrice = Number(it.variant.price);
      const unitDiscountedPrice = Math.round(
        unitOriginalPrice * (1 - discountPercent / 100)
      );

      addItem({
        variantId: it.variant.id,
        productId: it.product.id,
        productName: it.product.name,
        variantName: it.variant.name,
        sku: it.variant.sku,
        price: unitDiscountedPrice,
        originalPrice: unitOriginalPrice,
        image: it.product.images?.[0]?.url || null,
        quantity: it.quantity,
        stock: it.variant.stock,
      });
    });

    setAddedAll(true);
    setTimeout(() => setAddedAll(false), 3000);
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* ── 1. Hero Header Phác Đồ ──────────────────────────────────── */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-9 space-y-5 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-rose-50/60 rounded-full blur-3xl -z-10" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <span
              className={`text-xs font-bold px-3 py-1 rounded-full border ${groupConf.badgeColor}`}
            >
              {groupConf.label}
            </span>
            <span className="text-xs text-slate-400 font-medium">
              Dành cho: <strong className="text-slate-700">{customerName || "Bạn"}</strong>
            </span>
          </div>

          <button
            type="button"
            onClick={onRetakeQuiz}
            className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-[#800028] transition-colors self-start sm:self-auto"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Làm lại bài trắc nghiệm</span>
          </button>
        </div>

        <div className="space-y-2">
          <h2 className="text-xl sm:text-3xl font-black text-slate-900 tracking-tight leading-tight">
            {protocol.title}
          </h2>
          {protocol.subtitle && (
            <p className="text-sm sm:text-base text-slate-600 font-medium leading-relaxed">
              {protocol.subtitle}
            </p>
          )}
        </div>

        {/* Dưỡng Chất Cốt Lõi */}
        <div className="flex items-center flex-wrap gap-2 pt-1">
          <span className="text-xs font-bold text-slate-500">Dưỡng chất cốt lõi:</span>
          {protocol.keyNutrients.map((nutr, idx) => (
            <span
              key={idx}
              className="text-xs font-semibold px-3 py-1 rounded-full bg-slate-100 text-slate-800 border border-slate-200"
            >
              {nutr}
            </span>
          ))}
        </div>

        {/* Lời Khuyên & Cơ Chế Chuyên Môn Của Dược Sĩ */}
        <div className="p-4 sm:p-5 bg-gradient-to-br from-rose-50/70 to-amber-50/40 rounded-2xl border border-rose-100 space-y-2">
          <div className="flex items-center gap-2 font-bold text-xs uppercase tracking-wider text-[#800028]">
            <Stethoscope className="w-4 h-4" />
            <span>Chỉ Dẫn Chuyên Môn Dược Sĩ THUYNGA Shop</span>
          </div>
          <p className="text-xs sm:text-sm text-slate-800 leading-relaxed font-medium">
            {protocol.pharmacistAdvice}
          </p>
          <div className="pt-2 text-[11px] text-slate-500 italic">
            * THUYNGA Shop cam kết 100% sản phẩm trong phác đồ vận chuyển bằng đường bay hàng không kho lạnh 18-24°C, bảo toàn men vi sinh sống và hoạt lực vi chất.
          </div>
        </div>
      </div>

      {/* ── 2. Biểu Đồ Liều Dùng Trong Ngày (Daily Dosage Schedule) ────── */}
      {protocol.dosageSchedule && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-7 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
              <Clock className="w-5 h-5 text-sky-600" />
              <span>Biểu Đồ Lộ Trình Uống Vi Chất Trong Ngày</span>
            </h3>
            <span className="text-xs font-semibold text-sky-700 bg-sky-50 px-2.5 py-1 rounded-lg">
              Tối ưu hấp thu
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
            {protocol.dosageSchedule.morning && (
              <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200/80 space-y-1.5">
                <span className="text-xs font-bold text-amber-900 uppercase tracking-wider block">
                  🌅 Buổi Sáng
                </span>
                <p className="text-xs text-amber-950 leading-relaxed font-medium">
                  {protocol.dosageSchedule.morning}
                </p>
              </div>
            )}

            {protocol.dosageSchedule.afternoon && (
              <div className="p-4 rounded-2xl bg-sky-50/60 border border-sky-200/80 space-y-1.5">
                <span className="text-xs font-bold text-sky-900 uppercase tracking-wider block">
                  ☀️ Buổi Chiều
                </span>
                <p className="text-xs text-sky-950 leading-relaxed font-medium">
                  {protocol.dosageSchedule.afternoon}
                </p>
              </div>
            )}

            {protocol.dosageSchedule.evening && (
              <div className="p-4 rounded-2xl bg-purple-50/60 border border-purple-200/80 space-y-1.5">
                <span className="text-xs font-bold text-purple-900 uppercase tracking-wider block">
                  🌙 Buổi Tối
                </span>
                <p className="text-xs text-purple-950 leading-relaxed font-medium">
                  {protocol.dosageSchedule.evening}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── 3. Danh Sách Sản Phẩm Thành Phần Trong Phác Đồ ──────────── */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-7 space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h3 className="font-bold text-slate-900 text-base">
              Bộ Sản Phẩm Chỉ Định Trong Phác Đồ
            </h3>
            <p className="text-xs text-slate-500">
              {protocol.items.length} sản phẩm tương thích cao, không xung đột hấp thu
            </p>
          </div>
          <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
            Giảm {discountPercent}% khi mua combo
          </span>
        </div>

        <div className="divide-y divide-slate-100">
          {protocol.items.map((item, idx) => {
            const prodImage =
              item.product.images?.[0]?.url || "/images/placeholder.png";
            const unitPrice = item.variant?.price
              ? Number(item.variant.price)
              : 500000;
            const discountedUnitPrice = Math.round(
              unitPrice * (1 - discountPercent / 100)
            );

            return (
              <div
                key={item.id}
                className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="flex items-start gap-4">
                  <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden bg-slate-50 border border-slate-200 shrink-0">
                    <Image
                      src={prodImage}
                      alt={item.product.name}
                      fill
                      className="object-cover"
                      sizes="80px"
                    />
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-[10px] font-bold text-sky-700 bg-sky-50 px-2 py-0.5 rounded border border-sky-200">
                        Bay Air 100%
                      </span>
                      <span className="text-[10px] font-semibold text-slate-500">
                        {item.timing}
                      </span>
                    </div>

                    <Link
                      href={`/san-pham/${item.product.slug}`}
                      className="font-bold text-slate-900 text-sm hover:text-[#800028] transition-colors line-clamp-1"
                    >
                      {item.product.name}
                    </Link>

                    {item.variant && (
                      <span className="text-xs text-slate-500 block">
                        Quy cách: {item.variant.name} (SL: {item.quantity})
                      </span>
                    )}

                    <div className="text-xs font-medium text-emerald-800 bg-emerald-50/80 px-2.5 py-1 rounded-lg inline-block mt-1">
                      💡 {item.usageInstructions}
                    </div>
                  </div>
                </div>

                {/* Giá Sản Phẩm */}
                <div className="text-left sm:text-right shrink-0">
                  <div className="font-mono font-bold text-base text-[#800028]">
                    {formatVND(discountedUnitPrice * item.quantity)}
                  </div>
                  <div className="text-xs font-mono text-slate-400 line-through">
                    {formatVND(unitPrice * item.quantity)}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── 4. Tổng Kết Giá & CTA Đặt Mua Combo ───────────────────────── */}
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-rose-300 uppercase tracking-wider">
              Đặc Quyền Combo Phác Đồ Dược Sĩ
            </span>
            <h4 className="text-lg sm:text-xl font-bold">
              Tiết Kiệm {formatVND(savings)} Khi Đặt Trọn Bộ Phác Đồ
            </h4>
          </div>

          <div className="text-left sm:text-right">
            <span className="text-xs text-slate-400 block">Tổng thanh toán combo:</span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-black font-mono text-amber-300">
                {formatVND(comboPrice)}
              </span>
              <span className="text-xs sm:text-sm font-mono text-slate-400 line-through">
                {formatVND(totalPrice)}
              </span>
            </div>
          </div>
        </div>

        {/* Nút Hành Động */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {/* Nút Thêm Vào Giỏ */}
          <button
            type="button"
            onClick={handleAddAllToCart}
            className="flex items-center justify-center gap-2 px-6 py-3.5 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-slate-950 font-black text-sm rounded-2xl shadow-lg hover:shadow-xl transition-all cursor-pointer active:scale-95"
          >
            {addedAll ? (
              <>
                <Check className="w-5 h-5 text-emerald-900" />
                <span>Đã thêm trọn bộ vào giỏ hàng!</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-5 h-5" />
                <span>Thêm Trọn Bộ Phác Đồ (-{discountPercent}%)</span>
              </>
            )}
          </button>

          {/* Nút Đặt Lịch Tư Vấn 1-1 */}
          <button
            type="button"
            onClick={onOpenConsultationModal}
            className="flex items-center justify-center gap-2 px-6 py-3.5 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-sm rounded-2xl transition-all cursor-pointer"
          >
            <Phone className="w-4 h-4 text-emerald-400" />
            <span>Đặt Lịch Gọi Tư Vấn Dược Sĩ 1-1</span>
          </button>
        </div>

        <div className="flex items-center justify-center gap-2 text-xs text-slate-400 text-center pt-1">
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>
            Miễn phí vận chuyển toàn quốc • Đổi trả trong 7 ngày nếu không phù hợp
          </span>
        </div>
      </div>
    </div>
  );
};
