"use client";

// ============================================================
// components/storefront/flash-sale/FlashSaleClient.tsx
// Bộ Điều Phối Săn Deal Giờ Vàng Phía Khách Hàng (Module 9.4)
// ============================================================

import React, { useState, useMemo } from "react";
import Image from "next/image";
import { FlashSaleCountdown } from "./FlashSaleCountdown";
import { FlashSaleTimeSlots } from "./FlashSaleTimeSlots";
import { FlashSaleDealCard } from "./FlashSaleDealCard";
import type { StorefrontFlashSaleCampaign } from "./types";
import {
  Zap,
  Flame,
  Search,
  Filter,
  Package,
  ShieldCheck,
  Plane,
  AlertTriangle,
} from "lucide-react";

interface FlashSaleClientProps {
  campaigns: StorefrontFlashSaleCampaign[];
}

export const FlashSaleClient: React.FC<FlashSaleClientProps> = ({
  campaigns,
}) => {
  const [selectedCampaignId, setSelectedCampaignId] = useState<string>(
    campaigns[0]?.id || ""
  );
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [search, setSearch] = useState<string>("");

  const currentCampaign =
    campaigns.find((c) => c.id === selectedCampaignId) || campaigns[0];

  // Extract unique categories from current campaign deals
  const categories = useMemo(() => {
    if (!currentCampaign) return [];
    const set = new Set<string>();
    currentCampaign.deals.forEach((d) => {
      if (d.product.categoryName) set.add(d.product.categoryName);
    });
    return Array.from(set);
  }, [currentCampaign]);

  // Filter deals by category & search
  const filteredDeals = useMemo(() => {
    if (!currentCampaign) return [];
    let list = [...currentCampaign.deals];

    if (selectedCategory !== "ALL") {
      list = list.filter((d) => d.product.categoryName === selectedCategory);
    }

    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter(
        (d) =>
          d.product.name.toLowerCase().includes(q) ||
          d.product.brand?.toLowerCase().includes(q) ||
          d.variant.name.toLowerCase().includes(q)
      );
    }

    return list;
  }, [currentCampaign, selectedCategory, search]);

  if (!currentCampaign) {
    return (
      <div className="py-20 text-center bg-white rounded-3xl border border-slate-200 p-8 space-y-3">
        <Zap className="w-12 h-12 mx-auto text-slate-300" />
        <h3 className="text-base font-bold text-slate-800">
          Hiện Chưa Có Phiên Flash Sale Nào
        </h3>
        <p className="text-xs text-slate-500">
          Vui lòng quay lại sau hoặc theo dõi trang chủ để cập nhật giờ vàng săn deal!
        </p>
      </div>
    );
  }

  const isUpcoming = currentCampaign.status === "UPCOMING";

  return (
    <div className="space-y-8">
      {/* Hero Banner Chi Tiết Chiến Dịch */}
      <div className="relative rounded-3xl bg-gradient-to-r from-[#800028] via-[#60001e] to-slate-900 text-white overflow-hidden shadow-2xl p-6 sm:p-10">
        {/* Background Image Overlay */}
        {currentCampaign.bannerImage && (
          <div className="absolute inset-0 opacity-20 pointer-events-none">
            <Image
              src={currentCampaign.bannerImage}
              alt={currentCampaign.name}
              fill
              className="object-cover"
              priority
            />
          </div>
        )}

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-amber-300 text-xs font-black uppercase tracking-wider border border-white/15">
              <Flame className="w-3.5 h-3.5 fill-amber-300" />
              <span>
                {isUpcoming ? "KHUNG GIỜ SẮP TỚI" : "GIỜ VÀNG GIÁ SỐC ĐANG DIỄN RA"}
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight">
              {currentCampaign.name}
            </h1>

            {currentCampaign.description && (
              <p className="text-xs sm:text-sm text-rose-100/90 leading-relaxed font-normal">
                {currentCampaign.description}
              </p>
            )}
          </div>

          {/* Countdown Clock */}
          <div className="bg-black/30 backdrop-blur-md border border-white/15 p-4 sm:p-6 rounded-2xl shrink-0">
            <FlashSaleCountdown
              endTime={
                isUpcoming ? currentCampaign.startTime : currentCampaign.endTime
              }
              label={isUpcoming ? "MỞ BÁN SAU" : "KẾT THÚC TRONG"}
            />
          </div>
        </div>
      </div>

      {/* Tabs Chuyển Đổi Khung Giờ (Active vs Upcoming) */}
      <FlashSaleTimeSlots
        campaigns={campaigns}
        selectedCampaignId={selectedCampaignId}
        onSelectCampaign={(id) => {
          setSelectedCampaignId(id);
          setSelectedCategory("ALL");
          setSearch("");
        }}
      />

      {/* Thanh Lọc Chuyên Mục & Tìm Kiếm Nhanh */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          <button
            type="button"
            onClick={() => setSelectedCategory("ALL")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              selectedCategory === "ALL"
                ? "bg-[#800028] text-white shadow-xs"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
          >
            Tất cả deal ({currentCampaign.deals.length})
          </button>

          {categories.map((cat) => {
            const count = currentCampaign.deals.filter(
              (d) => d.product.categoryName === cat
            ).length;
            const isSelected = selectedCategory === cat;

            return (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  isSelected
                    ? "bg-[#800028] text-white shadow-xs"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                {cat} ({count})
              </button>
            );
          })}
        </div>

        {/* Live Search */}
        <div className="relative min-w-[240px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm theo tên deal, thương hiệu..."
            className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#800028]/20 focus:border-[#800028]"
          />
        </div>
      </div>

      {/* Grid Danh Sách Deal Sản Phẩm */}
      {filteredDeals.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredDeals.map((deal) => (
            <FlashSaleDealCard
              key={deal.id}
              deal={deal}
              isUpcoming={isUpcoming}
            />
          ))}
        </div>
      ) : (
        <div className="py-16 text-center bg-white rounded-3xl border border-slate-200/80 p-8 space-y-2">
          <Package className="w-10 h-10 mx-auto text-slate-300" />
          <p className="text-sm font-bold text-slate-800">
            Không tìm thấy sản phẩm deal phù hợp
          </p>
          <p className="text-xs text-slate-400">
            Hãy thử tìm với từ khóa khác hoặc bấm xem tất cả deal
          </p>
        </div>
      )}

      {/* Khối Cam Kết Chất Lượng Hàng Bay */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-rose-50/60 to-amber-50/40 border border-rose-100 grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
        <div className="space-y-1.5">
          <div className="w-10 h-10 rounded-2xl bg-white shadow-xs mx-auto flex items-center justify-center text-emerald-600">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h4 className="text-xs font-bold text-slate-900">
            100% Chính Ngạch & Tem Phụ
          </h4>
          <p className="text-[11px] text-slate-500">
            Mọi sản phẩm Flash Sale đều nguyên đai nguyên kiện từ nhà sản xuất.
          </p>
        </div>

        <div className="space-y-1.5">
          <div className="w-10 h-10 rounded-2xl bg-white shadow-xs mx-auto flex items-center justify-center text-blue-600">
            <Plane className="w-5 h-5" />
          </div>
          <h4 className="text-xs font-bold text-slate-900">
            Hàng Bay Air Cargo 48h
          </h4>
          <p className="text-[11px] text-slate-500">
            Trái cây tươi và vi chất bảo quản lạnh tối ưu giữ trọn chất lượng.
          </p>
        </div>

        <div className="space-y-1.5">
          <div className="w-10 h-10 rounded-2xl bg-white shadow-xs mx-auto flex items-center justify-center text-[#800028]">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <h4 className="text-xs font-bold text-slate-900">
            Nguyên Tắc Vàng Tuyệt Đối
          </h4>
          <p className="text-[11px] text-slate-500">
            Cam kết nói KHÔNG với thuốc kê đơn và hàng cận hạn sử dụng.
          </p>
        </div>
      </div>
    </div>
  );
};
