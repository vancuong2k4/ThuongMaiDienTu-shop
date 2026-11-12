"use client";

// ============================================================
// components/storefront/gift-builder/HamperBuilderClient.tsx
// Trình Thiết Kế Giỏ Quà Visual Tương Tác 4 Bước (Phase 17)
// ============================================================

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Gift,
  Building2,
  Box,
  Layers,
  ChevronRight,
  ChevronLeft,
  CheckCircle2,
  ShoppingBag,
  ShieldCheck,
  AlertCircle,
  Plane,
  Heart,
  Plus,
} from "lucide-react";
import {
  BuilderTemplate,
  BuilderProduct,
  SelectedHamperItem,
  BuilderFormData,
} from "./types";
import { StepBoxSelection } from "./StepBoxSelection";
import { StepProductSelection } from "./StepProductSelection";
import { StepPackagingAndCard } from "./StepPackagingAndCard";
import { CorporateInquiryModal } from "./CorporateInquiryModal";
import { GiftOccasion, GiftRibbonColor } from "@prisma/client";
import {
  GIFT_OCCASION_CONFIG,
  GIFT_RIBBON_COLOR_CONFIG,
} from "@/lib/validations/gift-box";
import { useCartStore } from "@/store/cart";

interface HamperBuilderClientProps {
  templates: BuilderTemplate[];
  products: BuilderProduct[];
}

export const HamperBuilderClient: React.FC<HamperBuilderClientProps> = ({
  templates,
  products,
}) => {
  const router = useRouter();
  const addItemToCart = useCartStore((state) => state.addItem);

  // Current Step: 1, 2, 3, 4
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Selected Template
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>(
    templates[0]?.id || ""
  );
  const selectedTemplate =
    templates.find((t) => t.id === selectedTemplateId) || templates[0] || null;

  // Selected Product Items
  const [selectedItems, setSelectedItems] = useState<SelectedHamperItem[]>([]);

  // Packaging & Card
  const [formData, setFormData] = useState<BuilderFormData>({
    occasion: GiftOccasion.TET_HOLIDAY,
    ribbonColor: GiftRibbonColor.RUBY_RED,
    hasWaxSeal: true,
    hasLedLights: false,
    greetingCardMessage:
      GIFT_OCCASION_CONFIG.TET_HOLIDAY.greetingSample,
    cardSenderName: "",
    cardReceiverName: "",
    notes: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isCorporateModalOpen, setIsCorporateModalOpen] = useState(false);

  // Calculations
  const maxSlots = selectedTemplate?.maxSlots || 5;
  const totalSlotsUsed = selectedItems.reduce(
    (sum, item) => sum + item.slotCost * item.quantity,
    0
  );
  const isCapacityExceeded = totalSlotsUsed > maxSlots;

  const basePrice = selectedTemplate?.basePrice || 0;
  const ledLightsPrice = formData.hasLedLights ? 50000 : 0;
  const itemsSubtotal = selectedItems.reduce(
    (sum, item) => sum + item.unitPrice * item.quantity,
    0
  );

  let discountAmount = 0;
  if (itemsSubtotal >= 2000000) {
    discountAmount = Math.round(itemsSubtotal * 0.05); // -5% combo quà biếu
  }

  const totalPrice = Math.max(0, basePrice + ledLightsPrice + itemsSubtotal - discountAmount);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(val);
  };

  // Handlers
  const handleAddItem = (product: BuilderProduct) => {
    if (!product.defaultVariant) return;
    if (totalSlotsUsed + product.slotCost > maxSlots) {
      alert(`Hộp quà chỉ chứa tối đa ${maxSlots} ô. Vui lòng chọn hộp lớn hơn hoặc bớt sản phẩm.`);
      return;
    }

    setSelectedItems((prev) => {
      const existing = prev.find((i) => i.productId === product.id);
      if (existing) {
        return prev.map((i) =>
          i.productId === product.id
            ? { ...i, quantity: i.quantity + 1 }
            : i
        );
      }
      return [
        ...prev,
        {
          productId: product.id,
          productName: product.name,
          variantId: product.defaultVariant?.id || null,
          variantName: product.defaultVariant?.name || null,
          quantity: 1,
          unitPrice: Number(product.defaultVariant?.price || 0),
          slotCost: product.slotCost,
          imageUrl: product.images[0]?.url || null,
        },
      ];
    });
  };

  const handleRemoveItem = (productId: string) => {
    setSelectedItems((prev) => {
      const existing = prev.find((i) => i.productId === productId);
      if (!existing) return prev;
      if (existing.quantity <= 1) {
        return prev.filter((i) => i.productId !== productId);
      }
      return prev.map((i) =>
        i.productId === productId
          ? { ...i, quantity: i.quantity - 1 }
          : i
      );
    });
  };

  const handleFormDataChange = (fields: Partial<BuilderFormData>) => {
    setFormData((prev) => ({ ...prev, ...fields }));
  };

  const handleNextStep = () => {
    setError(null);
    if (currentStep === 1) {
      if (!selectedTemplate) {
        setError("Vui lòng chọn một mẫu vỏ hộp quà để tiếp tục.");
        return;
      }
      setCurrentStep(2);
    } else if (currentStep === 2) {
      if (selectedItems.length === 0) {
        setError("Vui lòng chọn ít nhất 1 sản phẩm để xếp vào hộp quà.");
        return;
      }
      if (isCapacityExceeded) {
        setError(`Số lượng sản phẩm vượt quá sức chứa ${maxSlots} ô của vỏ hộp.`);
        return;
      }
      setCurrentStep(3);
    } else if (currentStep === 3) {
      setCurrentStep(4);
    }
  };

  const handlePrevStep = () => {
    setError(null);
    setCurrentStep((prev) => Math.max(1, prev - 1));
  };

  // Add Custom Hamper to Cart
  const handleAddToCart = async () => {
    if (!selectedTemplate || selectedItems.length === 0) return;
    setError(null);
    setIsSubmitting(true);

    try {
      // 1. Lưu cấu hình giỏ quà vào database qua API
      const res = await fetch("/api/gift-boxes/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          templateId: selectedTemplate.id,
          occasion: formData.occasion,
          ribbonColor: formData.ribbonColor,
          hasWaxSeal: formData.hasWaxSeal,
          hasLedLights: formData.hasLedLights,
          greetingCardMessage: formData.greetingCardMessage,
          cardSenderName: formData.cardSenderName,
          cardReceiverName: formData.cardReceiverName,
          notes: formData.notes,
          items: selectedItems.map((i) => ({
            productId: i.productId,
            variantId: i.variantId,
            quantity: i.quantity,
            unitPrice: i.unitPrice,
            slotCost: i.slotCost,
          })),
        }),
      });

      const data = await res.json();
      if (!data.success) {
        throw new Error(data.message || "Không thể tạo giỏ quà.");
      }

      const { hamperCode, id: hamperId } = data.data;

      // 2. Thêm vào giỏ hàng Zustand dưới dạng 1 custom gift hamper package
      addItemToCart({
        variantId: `hamper-${hamperId}`,
        productId: selectedTemplate.id,
        productName: `Giỏ Quà Tùy Biến: ${selectedTemplate.name}`,
        variantName: `${GIFT_OCCASION_CONFIG[formData.occasion]?.shortLabel || "Quà biếu"} (${selectedItems.length} món)`,
        sku: hamperCode,
        price: totalPrice,
        image: selectedTemplate.imageUrl,
        quantity: 1,
        stock: 99,
        isCustomHamper: true,
        hamperId,
        hamperCode,
        hamperDetails: {
          templateName: selectedTemplate.name,
          occasion: GIFT_OCCASION_CONFIG[formData.occasion]?.label || "Quà biếu",
          ribbonColor: GIFT_RIBBON_COLOR_CONFIG[formData.ribbonColor].label,
          hasWaxSeal: formData.hasWaxSeal,
          hasLedLights: formData.hasLedLights,
          greetingCardMessage: formData.greetingCardMessage,
          itemCount: selectedItems.length,
        },
      });

      // 3. Chuyển hướng đến giỏ hàng
      router.push("/gio-hang");
    } catch (err: any) {
      setError(err.message || "Đã xảy ra lỗi khi thêm vào giỏ hàng.");
      setIsSubmitting(false);
    }
  };

  const stepsList = [
    { num: 1, title: "Chọn Vỏ Hộp", desc: "Hộp gỗ, da, mây tre" },
    { num: 2, title: "Chọn Sản Phẩm", desc: "Cherry, Manuka, TPCN" },
    { num: 3, title: "Phụ Kiện & Thiệp", desc: "Nơ lụa, sáp, lời chúc" },
    { num: 4, title: "Tóm Tắt & Đặt", desc: "Xem lại & Thêm giỏ hàng" },
  ];

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* ── Top Hero Banner ─────────────────────────────────── */}
      <div className="relative overflow-hidden bg-gradient-to-r from-slate-950 via-[#800028] to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl">
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-xs font-semibold text-rose-200">
              <Gift className="w-3.5 h-3.5 text-amber-300" />
              <span>Dịch Vụ Quà Biếu Cao Cấp Chuẩn Hàng Không Úc</span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight leading-tight">
              Tự Thiết Kế Giỏ Quà Biếu & Hộp Cherry Úc Hoàng Gia
            </h1>
            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
              Tự tay tuyển chọn từng hộp Cherry tươi bay Air, Mật ong Manuka và TPCN Úc thượng hạng. Đóng gói trong hộp gỗ sơn mài, niêm phong sáp cổ điển kèm thiệp chúc mừng dập nổi kim.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
            <button
              onClick={() => setIsCorporateModalOpen(true)}
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-extrabold shadow-md transition-all"
            >
              <Building2 className="w-4 h-4" />
              <span>Báo Giá Doanh Nghiệp (từ 5 suất)</span>
            </button>
          </div>
        </div>

        {/* Decorative background glow */}
        <div className="absolute -right-10 -bottom-10 w-72 h-72 bg-white/5 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* ── 4-Step Wizard Stepper Bar ────────────────────────── */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-xs">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {stepsList.map((s) => {
            const isPassed = currentStep > s.num;
            const isCurrent = currentStep === s.num;

            return (
              <div
                key={s.num}
                onClick={() => {
                  if (isPassed) setCurrentStep(s.num);
                }}
                className={`p-3 rounded-xl flex items-center gap-3 transition-all ${
                  isCurrent
                    ? "bg-[#800028] text-white shadow-xs"
                    : isPassed
                    ? "bg-rose-50 text-slate-800 cursor-pointer hover:bg-rose-100"
                    : "bg-slate-50 text-slate-400"
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center font-black text-xs shrink-0 ${
                    isCurrent
                      ? "bg-white text-[#800028]"
                      : isPassed
                      ? "bg-emerald-600 text-white"
                      : "bg-slate-200 text-slate-600"
                  }`}
                >
                  {isPassed ? <CheckCircle2 className="w-4 h-4" /> : s.num}
                </div>
                <div className="min-w-0">
                  <span className="font-bold text-xs block truncate">
                    {s.title}
                  </span>
                  <span
                    className={`text-[10px] block truncate ${
                      isCurrent ? "text-rose-100" : "text-slate-400"
                    }`}
                  >
                    {s.desc}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Error Banner ────────────────────────────────────── */}
      {error && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-center gap-2.5">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* ── Main Step Content & Sticky Live Summary ──────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Active Step (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          {currentStep === 1 && (
            <StepBoxSelection
              templates={templates}
              selectedTemplateId={selectedTemplateId}
              onSelectTemplate={(tpl) => setSelectedTemplateId(tpl.id)}
            />
          )}

          {currentStep === 2 && (
            <StepProductSelection
              products={products}
              selectedTemplate={selectedTemplate}
              selectedItems={selectedItems}
              onAddItem={handleAddItem}
              onRemoveItem={handleRemoveItem}
              totalSlotsUsed={totalSlotsUsed}
            />
          )}

          {currentStep === 3 && (
            <StepPackagingAndCard
              formData={formData}
              onChange={handleFormDataChange}
            />
          )}

          {currentStep === 4 && (
            <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-7 shadow-xs space-y-6">
              <div className="space-y-1 pb-4 border-b border-slate-100">
                <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-100 uppercase tracking-wider">
                  Bước cuối cùng
                </span>
                <h3 className="text-lg font-black text-slate-900 mt-1">
                  4. Xác Nhận Cấu Hình Giỏ Quà Hoàn Chỉnh
                </h3>
                <p className="text-xs text-slate-500">
                  Kiểm tra lại toàn bộ sản phẩm thành phần, lời chúc in thiệp và phụ kiện trước khi đưa vào giỏ hàng.
                </p>
              </div>

              {/* Box & Items review */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Vật phẩm trong giỏ ({selectedItems.length} món)
                </h4>
                <div className="divide-y divide-slate-100 border border-slate-200 rounded-2xl overflow-hidden">
                  {selectedItems.map((item) => (
                    <div
                      key={item.productId}
                      className="p-3.5 flex items-center justify-between gap-3 bg-white"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-slate-100 overflow-hidden shrink-0 border border-slate-200">
                          {item.imageUrl ? (
                            <img
                              src={item.imageUrl}
                              alt={item.productName}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-slate-300">
                              <Box className="w-5 h-5" />
                            </div>
                          )}
                        </div>
                        <div>
                          <span className="font-bold text-slate-900 text-xs block">
                            {item.productName}
                          </span>
                          <span className="text-[11px] text-slate-400">
                            Số lượng: <strong>{item.quantity}</strong> × {formatCurrency(item.unitPrice)}
                          </span>
                        </div>
                      </div>

                      <span className="font-bold text-slate-900 text-xs">
                        {formatCurrency(item.unitPrice * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Card Message review */}
              <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80 space-y-2">
                <span className="text-[10px] font-bold text-amber-800 uppercase tracking-wider block">
                  Thiệp in kèm theo hộp quà
                </span>
                <p className="text-xs text-slate-800 italic leading-relaxed">
                  &ldquo;{formData.greetingCardMessage}&rdquo;
                </p>
                <div className="flex items-center gap-4 text-[11px] text-slate-600 font-medium pt-1">
                  {formData.cardSenderName && <span>Gửi từ: <strong>{formData.cardSenderName}</strong></span>}
                  {formData.cardReceiverName && <span>Kính tặng: <strong>{formData.cardReceiverName}</strong></span>}
                </div>
              </div>
            </div>
          )}

          {/* Wizard Navigation Controls */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-200">
            {currentStep > 1 ? (
              <button
                type="button"
                onClick={handlePrevStep}
                className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-bold transition-all"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Quay lại Bước {currentStep - 1}</span>
              </button>
            ) : <div />}

            {currentStep < 4 ? (
              <button
                type="button"
                onClick={handleNextStep}
                className="inline-flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-[#800028] hover:bg-[#660020] text-white text-xs font-bold shadow-sm transition-all"
              >
                <span>Tiếp tục sang Bước {currentStep + 1}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleAddToCart}
                disabled={isSubmitting}
                className="inline-flex items-center gap-2 px-7 py-3 rounded-2xl bg-gradient-to-r from-[#800028] to-[#a80035] text-white text-xs sm:text-sm font-black shadow-md hover:shadow-lg transition-all disabled:opacity-50"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>{isSubmitting ? "Đang xử lý..." : "Thêm Giỏ Quà Này Vào Giỏ Hàng"}</span>
              </button>
            )}
          </div>
        </div>

        {/* Right Column: Sticky Summary Panel (4 cols) */}
        <div className="lg:col-span-4 sticky top-24 space-y-4">
          <div className="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-6 shadow-sm space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h4 className="font-extrabold text-slate-900 text-sm">
                Chi Tiết Giỏ Quà Của Bạn
              </h4>
              <span className="text-[10px] font-bold text-slate-400">
                Bước {currentStep}/4
              </span>
            </div>

            {/* Selected box mini */}
            {selectedTemplate && (
              <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-200/80">
                <img
                  src={selectedTemplate.imageUrl}
                  alt={selectedTemplate.name}
                  className="w-12 h-12 rounded-xl object-cover shrink-0 border border-slate-200"
                />
                <div className="min-w-0 flex-1">
                  <span className="font-bold text-slate-900 text-xs block truncate">
                    {selectedTemplate.name}
                  </span>
                  <span className="text-[11px] text-slate-500">
                    Giá vỏ: {formatCurrency(selectedTemplate.basePrice)}
                  </span>
                </div>
              </div>
            )}

            {/* Slots gauge mini */}
            <div className="space-y-1.5 p-3 rounded-2xl bg-slate-50 border border-slate-200/80">
              <div className="flex items-center justify-between text-xs font-semibold">
                <span className="text-slate-600">Sức chứa ô hộp:</span>
                <span
                  className={`font-mono font-bold ${
                    isCapacityExceeded ? "text-rose-600" : "text-slate-900"
                  }`}
                >
                  {totalSlotsUsed} / {maxSlots} ô
                </span>
              </div>
              <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${
                    isCapacityExceeded
                      ? "bg-rose-500"
                      : "bg-[#800028]"
                  }`}
                  style={{
                    width: `${Math.min(100, (totalSlotsUsed / maxSlots) * 100)}%`,
                  }}
                />
              </div>
            </div>

            {/* Price Breakdown */}
            <div className="space-y-2 text-xs text-slate-600 border-t border-slate-100 pt-3">
              <div className="flex items-center justify-between">
                <span>Giá vỏ hộp kèm lót lụa:</span>
                <span className="font-bold text-slate-900">
                  {formatCurrency(basePrice)}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span>Vật phẩm ({selectedItems.length} món):</span>
                <span className="font-bold text-slate-900">
                  {formatCurrency(itemsSubtotal)}
                </span>
              </div>

              {formData.hasLedLights && (
                <div className="flex items-center justify-between text-amber-700">
                  <span>Dây đèn LED đom đóm:</span>
                  <span className="font-bold">+50.000₫</span>
                </div>
              )}

              {discountAmount > 0 && (
                <div className="flex items-center justify-between text-emerald-700 font-bold">
                  <span>Ưu đãi giỏ quà cao cấp (-5%):</span>
                  <span>-{formatCurrency(discountAmount)}</span>
                </div>
              )}

              {/* Total Price */}
              <div className="flex items-center justify-between pt-3 border-t border-slate-200 text-sm">
                <span className="font-extrabold text-slate-900">Tổng giỏ quà:</span>
                <span className="font-black text-[#800028] text-base sm:text-lg">
                  {formatCurrency(totalPrice)}
                </span>
              </div>
            </div>

            {/* Safety Commitment Pledge */}
            <div className="p-3 rounded-2xl bg-emerald-50/60 border border-emerald-100 text-[11px] text-emerald-950 space-y-1">
              <div className="flex items-center gap-1.5 font-bold">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Cam Kết Chất Lượng THUYNGA</span>
              </div>
              <p className="text-emerald-900/80 leading-relaxed text-[10px]">
                Miễn phí giao hỏa tốc nội thành Hà Nội trong 2 giờ. Hộp quà giữ nhiệt chuẩn bay Air đảm bảo Cherry tươi mát đến tay người nhận.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Corporate B2B Modal */}
      <CorporateInquiryModal
        isOpen={isCorporateModalOpen}
        onClose={() => setIsCorporateModalOpen(false)}
      />
    </div>
  );
};
