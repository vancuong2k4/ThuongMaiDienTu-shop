// ============================================================
// components/storefront/subscription/SubscriptionCard.tsx
// Card hiển thị chi tiết 1 gói Subscribe & Save cùng các tác vụ 1-chạm
// ============================================================

"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Repeat,
  Calendar,
  Clock,
  Truck,
  MapPin,
  Phone,
  User,
  CreditCard,
  ChevronDown,
  ChevronUp,
  Pause,
  Play,
  SkipForward,
  Zap,
  Settings,
  XCircle,
  Package,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";
import type {
  StorefrontSubscription,
  SubscriptionFrequencyType,
} from "./types";
import { SUBSCRIPTION_FREQUENCY_CONFIG } from "@/lib/validations/subscription";

interface SubscriptionCardProps {
  subscription: StorefrontSubscription;
  onAction: (
    subscriptionId: string,
    action: "PAUSE" | "RESUME" | "SKIP_NEXT" | "DELIVER_NOW" | "CANCEL" | "UPDATE_FREQUENCY",
    payload?: { frequency?: SubscriptionFrequencyType; note?: string }
  ) => Promise<void>;
  isLoading: boolean;
}

export const SubscriptionCard: React.FC<SubscriptionCardProps> = ({
  subscription,
  onAction,
  isLoading,
}) => {
  const [showOrders, setShowOrders] = useState(false);
  const [showFrequencyModal, setShowFrequencyModal] = useState(false);
  const [selectedFreq, setSelectedFreq] = useState<SubscriptionFrequencyType>(
    subscription.frequency
  );
  const [actionLoadingKey, setActionLoadingKey] = useState<string | null>(null);

  const formatVND = (val: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(val);
  };

  const freqConfig = SUBSCRIPTION_FREQUENCY_CONFIG[subscription.frequency];

  // Helper tính ngày đếm ngược
  const nextDate = new Date(subscription.nextDeliveryDate);
  const formattedNextDate = nextDate.toLocaleDateString("vi-VN", {
    weekday: "short",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(nextDate);
  target.setHours(0, 0, 0, 0);
  const diffDays = Math.ceil(
    (target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
  );

  let countdownBadge = "";
  let countdownColor = "bg-rose-50 text-[#800028] border-rose-200";
  if (subscription.status === "ACTIVE") {
    if (diffDays < 0) {
      countdownBadge = "Đang lên lịch tạo đơn";
      countdownColor = "bg-amber-50 text-amber-800 border-amber-200";
    } else if (diffDays === 0) {
      countdownBadge = "Giao hôm nay";
      countdownColor = "bg-emerald-50 text-emerald-800 border-emerald-200";
    } else if (diffDays === 1) {
      countdownBadge = "Giao ngày mai";
      countdownColor = "bg-blue-50 text-blue-800 border-blue-200";
    } else {
      countdownBadge = `Còn ${diffDays} ngày`;
    }
  }

  // Handle direct actions
  const handleTriggerAction = async (
    action: "PAUSE" | "RESUME" | "SKIP_NEXT" | "DELIVER_NOW" | "CANCEL",
    confirmMsg?: string
  ) => {
    if (confirmMsg && !window.confirm(confirmMsg)) {
      return;
    }
    setActionLoadingKey(action);
    try {
      await onAction(subscription.id, action);
    } finally {
      setActionLoadingKey(null);
    }
  };

  const handleUpdateFrequencySubmit = async () => {
    setActionLoadingKey("UPDATE_FREQUENCY");
    try {
      await onAction(subscription.id, "UPDATE_FREQUENCY", {
        frequency: selectedFreq,
      });
      setShowFrequencyModal(false);
    } finally {
      setActionLoadingKey(null);
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-neutral-200/90 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
      {/* Top Header Card */}
      <div className="p-5 sm:p-6 bg-gradient-to-r from-neutral-50/80 via-white to-rose-50/30 border-b border-neutral-100 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#800028] to-[#a80035] text-white flex items-center justify-center shadow-md shadow-[#800028]/20 shrink-0">
            <Repeat className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-neutral-900 text-base sm:text-lg">
                {subscription.subscriptionNumber}
              </span>
              {subscription.status === "ACTIVE" && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Đang hoạt động
                </span>
              )}
              {subscription.status === "PAUSED" && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200">
                  <Pause className="w-3 h-3 text-amber-600" />
                  Đang tạm dừng
                </span>
              )}
              {subscription.status === "CANCELLED" && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-neutral-200 text-neutral-700">
                  <XCircle className="w-3 h-3 text-neutral-500" />
                  Đã hủy
                </span>
              )}
            </div>
            <p className="text-xs text-neutral-500 mt-0.5">
              Tạo ngày{" "}
              {new Date(subscription.createdAt).toLocaleDateString("vi-VN")} • Đã
              giao {subscription.totalCyclesDelivered} kỳ
            </p>
          </div>
        </div>

        {/* Chu kỳ Badge */}
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-neutral-100 text-neutral-800 border border-neutral-200">
            <Clock className="w-3.5 h-3.5 text-neutral-500" />
            {freqConfig?.label || subscription.frequency}
          </span>
          <span className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
            Tiết kiệm 10% trọn đời
          </span>
        </div>
      </div>

      {/* Body: Delivery Date Banner & Shipping Info */}
      <div className="p-5 sm:p-6 space-y-6">
        {/* Next Delivery Alert Box */}
        {subscription.status === "ACTIVE" ? (
          <div className="p-4 rounded-2xl bg-gradient-to-r from-rose-50/70 to-emerald-50/40 border border-rose-200/60 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#800028] text-white flex items-center justify-center shrink-0">
                <Truck className="w-5 h-5 text-emerald-300" />
              </div>
              <div>
                <div className="text-xs text-neutral-600 font-medium">
                  Kỳ giao hàng dự kiến kế tiếp:
                </div>
                <div className="text-base sm:text-lg font-black text-[#800028]">
                  {formattedNextDate}
                </div>
              </div>
            </div>
            {countdownBadge && (
              <span
                className={`px-3 py-1 rounded-full text-xs font-bold border ${countdownColor}`}
              >
                {countdownBadge}
              </span>
            )}
          </div>
        ) : subscription.status === "PAUSED" ? (
          <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200/80 flex items-center gap-3 text-amber-800">
            <Pause className="w-5 h-5 text-amber-600 shrink-0" />
            <div className="text-xs sm:text-sm font-medium">
              Gói giao đang tạm dừng. Hệ thống sẽ không tạo đơn mới cho đến khi
              bạn nhấn <strong>&ldquo;Kích hoạt lại&rdquo;</strong>.
            </div>
          </div>
        ) : null}

        {/* Product Items List */}
        <div className="space-y-3">
          <div className="text-xs font-bold text-neutral-500 uppercase tracking-wider">
            Sản phẩm trong gói định kỳ ({subscription.items.length})
          </div>
          <div className="divide-y divide-neutral-100 rounded-2xl border border-neutral-100 bg-neutral-50/40 overflow-hidden">
            {subscription.items.map((item) => (
              <div
                key={item.id}
                className="p-3.5 sm:p-4 flex items-center gap-3 sm:gap-4 hover:bg-neutral-50 transition-colors"
              >
                <div className="w-14 h-14 rounded-xl bg-white border border-neutral-200/80 p-1 flex items-center justify-center shrink-0 overflow-hidden">
                  {item.image ? (
                    <Image
                      src={item.image}
                      alt={item.productName}
                      width={56}
                      height={56}
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <Package className="w-6 h-6 text-neutral-300" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-sm text-neutral-900 truncate">
                    {item.productName}
                  </h4>
                  {item.variantName && (
                    <p className="text-xs text-neutral-500 truncate mt-0.5">
                      Phân loại: {item.variantName}
                    </p>
                  )}
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs font-bold text-[#800028]">
                      {formatVND(item.price)}
                    </span>
                    {item.originalPrice > item.price && (
                      <span className="text-[11px] text-neutral-400 line-through">
                        {formatVND(item.originalPrice)}
                      </span>
                    )}
                    <span className="text-xs text-neutral-600 font-medium">
                      × {item.quantity}
                    </span>
                  </div>
                </div>
                <div className="text-right font-extrabold text-sm text-neutral-900 shrink-0">
                  {formatVND(item.price * item.quantity)}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Shipping & Recipient Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-2xl bg-neutral-50/80 border border-neutral-100 text-xs">
          <div className="space-y-1.5">
            <div className="flex items-center gap-1.5 font-bold text-neutral-700">
              <User className="w-3.5 h-3.5 text-neutral-400" />
              <span>Người nhận hàng:</span>
            </div>
            <p className="text-neutral-900 font-semibold pl-5">
              {subscription.recipientName} • {subscription.recipientPhone}
            </p>
            <div className="flex items-start gap-1.5 text-neutral-600 pl-5 pt-1">
              <MapPin className="w-3.5 h-3.5 text-neutral-400 shrink-0 mt-0.5" />
              <span>{subscription.shippingAddress}</span>
            </div>
          </div>

          <div className="space-y-1.5 border-t md:border-t-0 md:border-l border-neutral-200/80 pt-3 md:pt-0 md:pl-4">
            <div className="flex items-center gap-1.5 font-bold text-neutral-700">
              <CreditCard className="w-3.5 h-3.5 text-neutral-400" />
              <span>Thanh toán & Phí giao hàng:</span>
            </div>
            <p className="text-neutral-900 font-semibold pl-5">
              {subscription.paymentMethod === "COD"
                ? "Thanh toán khi nhận hàng (COD)"
                : subscription.paymentMethod === "BANK_TRANSFER"
                ? "Chuyển khoản ngân hàng"
                : "Cổng thanh toán điện tử"}
            </p>
            <div className="flex items-center gap-1.5 text-emerald-700 font-semibold pl-5 pt-1">
              <Truck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Freeship 100% (Tiết kiệm 30.000₫/kỳ)</span>
            </div>
          </div>
        </div>

        {/* Financial Summary */}
        <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-neutral-100">
          <div className="flex items-center gap-4 text-xs text-neutral-600">
            <span>
              Tạm tính: <strong>{formatVND(subscription.subtotalPerCycle)}</strong>
            </span>
            <span>•</span>
            <span className="text-emerald-700 font-semibold">
              Tiết kiệm 10%: -{formatVND(subscription.discountPerCycle)}
            </span>
          </div>

          <div className="flex items-baseline gap-2">
            <span className="text-xs text-neutral-500 font-medium">
              Tổng mỗi kỳ giao:
            </span>
            <span className="text-xl font-black text-[#800028]">
              {formatVND(subscription.totalPerCycle)}
            </span>
          </div>
        </div>

        {/* Recent Orders Accordion */}
        {subscription.recentOrders && subscription.recentOrders.length > 0 && (
          <div className="border border-neutral-200/80 rounded-2xl overflow-hidden">
            <button
              type="button"
              onClick={() => setShowOrders(!showOrders)}
              className="w-full px-4 py-3 bg-neutral-50/70 hover:bg-neutral-100/70 flex items-center justify-between text-xs font-bold text-neutral-700 transition-colors"
            >
              <div className="flex items-center gap-2">
                <Package className="w-4 h-4 text-neutral-500" />
                <span>
                  Lịch sử các đơn đã tạo ({subscription.recentOrders.length})
                </span>
              </div>
              {showOrders ? (
                <ChevronUp className="w-4 h-4 text-neutral-500" />
              ) : (
                <ChevronDown className="w-4 h-4 text-neutral-500" />
              )}
            </button>

            {showOrders && (
              <div className="divide-y divide-neutral-100 bg-white">
                {subscription.recentOrders.map((ord) => (
                  <div
                    key={ord.id}
                    className="p-3 sm:px-4 flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-3">
                      <Link
                        href={`/tai-khoan/don-hang/${ord.orderNumber}`}
                        className="font-bold text-[#800028] hover:underline flex items-center gap-1"
                      >
                        <span>#{ord.orderNumber}</span>
                        <ExternalLink className="w-3 h-3" />
                      </Link>
                      <span className="text-neutral-400">•</span>
                      <span className="text-neutral-500">
                        {new Date(ord.createdAt).toLocaleDateString("vi-VN")}
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="font-bold text-neutral-900">
                        {formatVND(ord.total)}
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-neutral-100 text-neutral-700">
                        {ord.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Action Toolbar */}
        {subscription.status !== "CANCELLED" && (
          <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-neutral-100">
            <div className="flex flex-wrap items-center gap-2">
              {subscription.status === "ACTIVE" ? (
                <>
                  {/* Tạm dừng */}
                  <button
                    type="button"
                    disabled={isLoading || actionLoadingKey !== null}
                    onClick={() =>
                      handleTriggerAction(
                        "PAUSE",
                        "Bạn có chắc muốn tạm dừng gói giao định kỳ này? Bạn có thể mở lại bất cứ lúc nào."
                      )
                    }
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-neutral-100 text-neutral-700 hover:bg-neutral-200 transition-colors disabled:opacity-50"
                  >
                    <Pause className="w-3.5 h-3.5 text-neutral-600" />
                    <span>
                      {actionLoadingKey === "PAUSE"
                        ? "Đang lưu..."
                        : "Tạm dừng"}
                    </span>
                  </button>

                  {/* Bỏ qua lần này */}
                  <button
                    type="button"
                    disabled={isLoading || actionLoadingKey !== null}
                    onClick={() =>
                      handleTriggerAction(
                        "SKIP_NEXT",
                        "Bạn muốn bỏ qua đợt giao này? Ngày giao kế tiếp sẽ được dời lại theo đúng chu kỳ."
                      )
                    }
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-neutral-100 text-neutral-700 hover:bg-neutral-200 transition-colors disabled:opacity-50"
                  >
                    <SkipForward className="w-3.5 h-3.5 text-neutral-600" />
                    <span>
                      {actionLoadingKey === "SKIP_NEXT"
                        ? "Đang dời..."
                        : "Bỏ qua lần này"}
                    </span>
                  </button>

                  {/* Giao ngay hôm nay */}
                  <button
                    type="button"
                    disabled={isLoading || actionLoadingKey !== null}
                    onClick={() =>
                      handleTriggerAction(
                        "DELIVER_NOW",
                        "Bạn muốn tạo đơn hàng ngay lập tức mà không cần đợi đến lịch hẹn? Đơn hàng sẽ được gửi tới kho để đóng gói ngay."
                      )
                    }
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-rose-50 text-[#800028] hover:bg-rose-100 border border-rose-200 transition-colors disabled:opacity-50"
                  >
                    <Zap className="w-3.5 h-3.5 text-[#800028]" />
                    <span>
                      {actionLoadingKey === "DELIVER_NOW"
                        ? "Đang tạo đơn..."
                        : "Giao ngay hôm nay"}
                    </span>
                  </button>

                  {/* Đổi chu kỳ */}
                  <button
                    type="button"
                    disabled={isLoading || actionLoadingKey !== null}
                    onClick={() => setShowFrequencyModal(true)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-neutral-100 text-neutral-700 hover:bg-neutral-200 transition-colors disabled:opacity-50"
                  >
                    <Settings className="w-3.5 h-3.5 text-neutral-600" />
                    <span>Đổi chu kỳ</span>
                  </button>
                </>
              ) : subscription.status === "PAUSED" ? (
                /* Kích hoạt lại */
                <button
                  type="button"
                  disabled={isLoading || actionLoadingKey !== null}
                  onClick={() =>
                    handleTriggerAction(
                      "RESUME",
                      "Kích hoạt lại gói giao định kỳ này? Hệ thống sẽ tính lại ngày giao tiếp theo."
                    )
                  }
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm transition-colors disabled:opacity-50"
                >
                  <Play className="w-3.5 h-3.5" />
                  <span>
                    {actionLoadingKey === "RESUME"
                      ? "Đang kích hoạt..."
                      : "Kích hoạt lại ngay"}
                  </span>
                </button>
              ) : null}
            </div>

            {/* Hủy gói */}
            <button
              type="button"
              disabled={isLoading || actionLoadingKey !== null}
              onClick={() =>
                handleTriggerAction(
                  "CANCEL",
                  "Bạn có chắc chắn muốn hủy gói định kỳ này? Bạn sẽ mất quyền lợi giảm 10% trọn đời và Freeship cho sản phẩm này."
                )
              }
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50 ml-auto"
            >
              <XCircle className="w-3.5 h-3.5" />
              <span>
                {actionLoadingKey === "CANCEL" ? "Đang hủy..." : "Hủy gói"}
              </span>
            </button>
          </div>
        )}
      </div>

      {/* Modal Đổi Chu Kỳ Giao Hàng */}
      {showFrequencyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl space-y-5 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-[#800028]" />
                <h3 className="font-extrabold text-base text-neutral-900">
                  Thay Đổi Chu Kỳ Giao Hàng
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowFrequencyModal(false)}
                className="w-8 h-8 rounded-full hover:bg-neutral-100 flex items-center justify-center text-neutral-400 hover:text-neutral-600"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-neutral-600">
              Chọn chu kỳ phù hợp với nhu cầu sử dụng thực tế của gia đình bạn.
              Mọi quyền lợi giảm giá 10% và Freeship vẫn được giữ nguyên.
            </p>

            <div className="space-y-2.5">
              {(
                Object.keys(
                  SUBSCRIPTION_FREQUENCY_CONFIG
                ) as SubscriptionFrequencyType[]
              ).map((key) => {
                const conf = SUBSCRIPTION_FREQUENCY_CONFIG[key];
                const isSelected = selectedFreq === key;
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setSelectedFreq(key)}
                    className={`w-full p-3.5 rounded-2xl border text-left flex items-center justify-between transition-all ${
                      isSelected
                        ? "border-[#800028] bg-rose-50/50 shadow-sm"
                        : "border-neutral-200 hover:border-neutral-300 bg-white"
                    }`}
                  >
                    <div>
                      <div className="font-bold text-sm text-neutral-900">
                        {conf.label}
                      </div>
                      <div className="text-xs text-neutral-500 mt-0.5">
                        {conf.description}
                      </div>
                    </div>
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                        isSelected
                          ? "border-[#800028] bg-[#800028] text-white"
                          : "border-neutral-300"
                      }`}
                    >
                      {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-neutral-100">
              <button
                type="button"
                onClick={() => setShowFrequencyModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-neutral-600 hover:bg-neutral-100 transition-colors"
              >
                Hủy bỏ
              </button>
              <button
                type="button"
                disabled={
                  actionLoadingKey === "UPDATE_FREQUENCY" ||
                  selectedFreq === subscription.frequency
                }
                onClick={handleUpdateFrequencySubmit}
                className="px-5 py-2 rounded-xl text-xs font-bold bg-[#800028] text-white hover:bg-[#660020] transition-colors disabled:opacity-50 shadow-md shadow-[#800028]/20"
              >
                {actionLoadingKey === "UPDATE_FREQUENCY"
                  ? "Đang lưu..."
                  : "Xác nhận đổi chu kỳ"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
