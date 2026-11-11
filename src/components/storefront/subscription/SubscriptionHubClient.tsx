// ============================================================
// components/storefront/subscription/SubscriptionHubClient.tsx
// Client Container chính quản lý các Gói Giao Định Kỳ Storefront
// ============================================================

"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Repeat,
  Package,
  Plus,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  ShieldCheck,
  Truck,
  HeartHandshake,
} from "lucide-react";
import type {
  StorefrontSubscription,
  StorefrontSubscriptionStats,
  SubscriptionFrequencyType,
} from "./types";
import { SubscriptionHeroBanner } from "./SubscriptionHeroBanner";
import { SubscriptionStatsCards } from "./SubscriptionStatsCards";
import { SubscriptionCard } from "./SubscriptionCard";

interface SubscriptionHubClientProps {
  initialSubscriptions: StorefrontSubscription[];
  initialStats: StorefrontSubscriptionStats;
}

export const SubscriptionHubClient: React.FC<SubscriptionHubClientProps> = ({
  initialSubscriptions,
  initialStats,
}) => {
  const [subscriptions, setSubscriptions] =
    useState<StorefrontSubscription[]>(initialSubscriptions);
  const [stats, setStats] =
    useState<StorefrontSubscriptionStats>(initialStats);
  const [activeTab, setActiveTab] = useState<
    "ALL" | "ACTIVE" | "PAUSED" | "CANCELLED"
  >("ALL");
  const [isLoading, setIsLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  // FAQ Accordion Open State
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  const showToast = (type: "success" | "error", text: string) => {
    setToastMessage({ type, text });
    setTimeout(() => {
      setToastMessage(null);
    }, 4500);
  };

  // Re-fetch data from API to ensure complete sync
  const refreshData = async () => {
    try {
      const res = await fetch("/api/user/subscriptions");
      if (res.ok) {
        const data = await res.json();
        setSubscriptions(data.subscriptions || []);
        setStats(data.stats || initialStats);
      }
    } catch {
      // ignore
    }
  };

  // Handle action triggers (PAUSE, RESUME, SKIP_NEXT, DELIVER_NOW, CANCEL, UPDATE_FREQUENCY)
  const handleAction = async (
    subscriptionId: string,
    action: "PAUSE" | "RESUME" | "SKIP_NEXT" | "DELIVER_NOW" | "CANCEL" | "UPDATE_FREQUENCY",
    payload?: { frequency?: SubscriptionFrequencyType; note?: string }
  ) => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/user/subscriptions/${subscriptionId}/action`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, ...payload }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Không thể thực hiện tác vụ");
      }

      showToast("success", data.message || "Cập nhật gói định kỳ thành công!");
      await refreshData();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Đã có lỗi xảy ra";
      showToast("error", message);
    } finally {
      setIsLoading(false);
    }
  };

  // Filter subscriptions based on tab
  const filteredSubscriptions = subscriptions.filter((sub) => {
    if (activeTab === "ALL") return true;
    if (activeTab === "ACTIVE") return sub.status === "ACTIVE";
    if (activeTab === "PAUSED") return sub.status === "PAUSED";
    if (activeTab === "CANCELLED") return sub.status === "CANCELLED";
    return true;
  });

  const faqs = [
    {
      q: "Làm thế nào để tạm dừng hoặc hủy gói giao định kỳ?",
      a: "Bạn hoàn toàn có thể tạm dừng hoặc hủy gói bất kỳ lúc nào chỉ bằng 1 thao tác bấm nút 'Tạm dừng' hoặc 'Hủy gói' trực tiếp trên từng thẻ gói. Không có bất kỳ ràng buộc hay phụ phí nào.",
    },
    {
      q: "Tôi có thể đổi chu kỳ nhận hàng (ví dụ từ 2 tuần sang 1 tháng) được không?",
      a: "Có, bạn chỉ cần bấm vào nút 'Đổi chu kỳ', chọn tần suất mong muốn mới (2 tuần, 1 tháng, 2 tháng, 3 tháng). Ngày giao tiếp theo sẽ tự động được điều chỉnh tương ứng.",
    },
    {
      q: "Tôi muốn nhận hàng ngay hôm nay thì phải làm sao?",
      a: "Chỉ cần nhấn nút 'Giao ngay hôm nay', hệ thống sẽ tự động tạo ngay 1 đơn hàng mới và gửi xuống kho vận hành để đóng gói đi air ngay lập tức, đồng thời dời ngày giao tiếp theo về đúng chu kỳ.",
    },
    {
      q: "Chính sách giá và phí giao hàng cho đơn định kỳ như thế nào?",
      a: "Toàn bộ các đơn hàng thuộc gói định kỳ đều được hưởng chiết khấu giảm 10% trọn đời trên giá sản phẩm và 100% MIỄN PHÍ VẬN CHUYỂN toàn quốc.",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Toast Notification Banner */}
      {toastMessage && (
        <div
          className={`p-4 rounded-2xl flex items-center justify-between text-xs sm:text-sm font-bold shadow-lg animate-in slide-in-from-top duration-200 ${
            toastMessage.type === "success"
              ? "bg-emerald-600 text-white"
              : "bg-red-600 text-white"
          }`}
        >
          <div className="flex items-center gap-2">
            <span className="text-base">
              {toastMessage.type === "success" ? "✓" : "⚠"}
            </span>
            <span>{toastMessage.text}</span>
          </div>
          <button
            type="button"
            onClick={() => setToastMessage(null)}
            className="text-white/80 hover:text-white font-bold ml-4"
          >
            ✕
          </button>
        </div>
      )}

      {/* Hero Banner */}
      <SubscriptionHeroBanner />

      {/* Stats Cards */}
      <SubscriptionStatsCards stats={stats} />

      {/* Filter Tabs & Content Header */}
      <div className="bg-white rounded-3xl border border-neutral-200/90 p-5 sm:p-6 shadow-sm space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-neutral-100">
          <div>
            <h2 className="text-lg font-black text-neutral-900 tracking-tight">
              Danh Sách Gói Định Kỳ Của Bạn
            </h2>
            <p className="text-xs text-neutral-500 mt-0.5">
              Quản lý tần suất, lịch giao và các sản phẩm mẹ & bé giao tự động
            </p>
          </div>

          <Link
            href="/san-pham"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-[#800028] text-white hover:bg-[#660020] transition-colors shadow-sm shadow-[#800028]/20"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Thêm gói mới</span>
          </Link>
        </div>

        {/* Tab Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveTab("ALL")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === "ALL"
                ? "bg-neutral-900 text-white shadow-sm"
                : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
            }`}
          >
            Tất cả ({subscriptions.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("ACTIVE")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === "ACTIVE"
                ? "bg-emerald-600 text-white shadow-sm"
                : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
            }`}
          >
            Đang hoạt động ({subscriptions.filter((s) => s.status === "ACTIVE").length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("PAUSED")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === "PAUSED"
                ? "bg-amber-600 text-white shadow-sm"
                : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
            }`}
          >
            Tạm dừng ({subscriptions.filter((s) => s.status === "PAUSED").length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("CANCELLED")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === "CANCELLED"
                ? "bg-neutral-600 text-white shadow-sm"
                : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
            }`}
          >
            Đã kết thúc / Hủy ({subscriptions.filter((s) => s.status === "CANCELLED").length})
          </button>
        </div>

        {/* Subscriptions List */}
        {filteredSubscriptions.length > 0 ? (
          <div className="space-y-4">
            {filteredSubscriptions.map((sub) => (
              <SubscriptionCard
                key={sub.id}
                subscription={sub}
                onAction={handleAction}
                isLoading={isLoading}
              />
            ))}
          </div>
        ) : (
          <div className="py-12 px-4 text-center space-y-4">
            <div className="w-16 h-16 rounded-3xl bg-neutral-100 text-neutral-400 mx-auto flex items-center justify-center">
              <Repeat className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <h3 className="font-extrabold text-neutral-800 text-base">
                {activeTab === "ALL"
                  ? "Bạn chưa có gói giao hàng định kỳ nào"
                  : "Không có gói định kỳ nào trong trạng thái này"}
              </h3>
              <p className="text-xs text-neutral-500 max-w-md mx-auto">
                {activeTab === "ALL"
                  ? "Đăng ký định kỳ cho các sản phẩm sữa bột Aptamil hoặc TPCN Úc ngay hôm nay để nhận ưu đãi giảm giá 10% trọn đời và Freeship 100%!"
                  : "Chuyển sang tab 'Tất cả' để xem toàn bộ danh sách gói định kỳ của bạn."}
              </p>
            </div>
            {activeTab === "ALL" && (
              <Link
                href="/san-pham"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-[#800028] text-white hover:bg-[#660020] transition-colors shadow-md shadow-[#800028]/20"
              >
                <Package className="w-4 h-4" />
                <span>Khám phá sản phẩm ngay</span>
              </Link>
            )}
          </div>
        )}
      </div>

      {/* FAQ Accordion Section */}
      <div className="bg-white rounded-3xl border border-neutral-200/90 p-5 sm:p-6 shadow-sm space-y-4">
        <div className="flex items-center gap-2.5">
          <HelpCircle className="w-5 h-5 text-[#800028]" />
          <h3 className="font-extrabold text-base text-neutral-900">
            Câu Hỏi Thường Gặp Về Gói Giao Định Kỳ
          </h3>
        </div>

        <div className="divide-y divide-neutral-100">
          {faqs.map((item, idx) => {
            const isOpen = openFaqIndex === idx;
            return (
              <div key={idx} className="py-3.5 first:pt-1 last:pb-1">
                <button
                  type="button"
                  onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                  className="w-full flex items-center justify-between text-left gap-4 text-xs sm:text-sm font-bold text-neutral-800 hover:text-[#800028] transition-colors"
                >
                  <span>{item.q}</span>
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-neutral-400 shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-neutral-400 shrink-0" />
                  )}
                </button>
                {isOpen && (
                  <p className="text-xs text-neutral-600 mt-2 leading-relaxed animate-in fade-in duration-150">
                    {item.a}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
