"use client";

// ============================================================
// components/admin/flash-sale/FlashSaleItemModal.tsx
// Modal Quản Lý Deal & Thêm Biến Thể Vào Flash Sale (Module 9.3)
// ============================================================

import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
  X,
  Plus,
  Trash2,
  Package,
  Zap,
  Search,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Percent,
} from "lucide-react";
import type {
  FlashSaleCampaignItem,
  FlashSaleDealItem,
} from "./types";

interface FlashSaleItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  campaign: FlashSaleCampaignItem | null;
  onSuccess: () => void;
}

interface AvailableProduct {
  id: string;
  name: string;
  brand: string | null;
  origin: string | null;
  variants: {
    id: string;
    name: string;
    sku: string;
    price: number;
    stock: number;
    image: string | null;
  }[];
  images: { url: string }[];
}

export const FlashSaleItemModal: React.FC<FlashSaleItemModalProps> = ({
  isOpen,
  onClose,
  campaign,
  onSuccess,
}) => {
  const [items, setItems] = useState<FlashSaleDealItem[]>([]);
  const [loadingItems, setLoadingItems] = useState(false);
  const [deletingItemId, setDeletingItemId] = useState<string | null>(null);

  // New Deal Form State
  const [isAdding, setIsAdding] = useState(false);
  const [availableProducts, setAvailableProducts] = useState<AvailableProduct[]>([]);
  const [productSearch, setProductSearch] = useState("");
  const [selectedProductId, setSelectedProductId] = useState("");
  const [selectedVariantId, setSelectedVariantId] = useState("");
  const [salePrice, setSalePrice] = useState("");
  const [quantity, setQuantity] = useState("50");
  const [limitPerUser, setLimitPerUser] = useState("1");
  const [submittingDeal, setSubmittingDeal] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Fetch campaign items
  const fetchCampaignDetail = async () => {
    if (!campaign) return;
    try {
      setLoadingItems(true);
      const res = await fetch(`/api/admin/flash-sales/${campaign.id}`);
      const data = await res.json();
      if (data.success && data.data?.items) {
        setItems(data.data.items);
      }
    } catch {
      // Ignore
    } finally {
      setLoadingItems(false);
    }
  };

  // Fetch available products
  const fetchProducts = async () => {
    try {
      const res = await fetch("/api/admin/products?limit=100");
      const data = await res.json();
      if (data.success && data.data) {
        setAvailableProducts(data.data);
      }
    } catch {
      // Ignore
    }
  };

  useEffect(() => {
    if (isOpen && campaign) {
      fetchCampaignDetail();
      fetchProducts();
      setIsAdding(false);
      setFormError(null);
    }
  }, [isOpen, campaign]);

  if (!isOpen || !campaign) return null;

  // Selected product & variant details
  const selectedProduct = availableProducts.find(
    (p) => p.id === selectedProductId
  );
  const selectedVariant = selectedProduct?.variants.find(
    (v) => v.id === selectedVariantId
  );

  // Calculate live discount percentage
  const regularPrice = selectedVariant ? Number(selectedVariant.price) : 0;
  const numSalePrice = parseFloat(salePrice) || 0;
  const discountPercent =
    regularPrice > 0 && numSalePrice > 0 && numSalePrice < regularPrice
      ? Math.round(((regularPrice - numSalePrice) / regularPrice) * 100)
      : 0;

  // Handle Add Item to Campaign
  const handleAddDeal = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!selectedProductId || !selectedVariantId) {
      setFormError("Vui lòng chọn sản phẩm và biến thể hợp lệ");
      return;
    }
    if (!numSalePrice || numSalePrice <= 0) {
      setFormError("Giá Flash Sale phải lớn hơn 0");
      return;
    }
    if (numSalePrice >= regularPrice) {
      setFormError("Giá Flash Sale phải thấp hơn giá bán thông thường");
      return;
    }

    try {
      setSubmittingDeal(true);
      const res = await fetch(`/api/admin/flash-sales/${campaign.id}/items`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: selectedProductId,
          variantId: selectedVariantId,
          salePrice: numSalePrice,
          quantity: parseInt(quantity) || 1,
          limitPerUser: parseInt(limitPerUser) || 1,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Không thể thêm sản phẩm vào Flash Sale");
      }

      // Reset and refresh
      setSelectedProductId("");
      setSelectedVariantId("");
      setSalePrice("");
      setQuantity("50");
      setLimitPerUser("1");
      setIsAdding(false);
      fetchCampaignDetail();
      onSuccess();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Đã có lỗi xảy ra";
      setFormError(msg);
    } finally {
      setSubmittingDeal(false);
    }
  };

  // Handle Delete Item
  const handleDeleteItem = async (itemId: string) => {
    if (!confirm("Bạn có chắc chắn muốn gỡ sản phẩm này khỏi Flash Sale?"))
      return;

    try {
      setDeletingItemId(itemId);
      const res = await fetch(
        `/api/admin/flash-sales/${campaign.id}/items/${itemId}`,
        {
          method: "DELETE",
        }
      );
      if (!res.ok) {
        throw new Error("Không thể gỡ sản phẩm");
      }
      setItems((prev) => prev.filter((i) => i.id !== itemId));
      onSuccess();
    } catch {
      alert("Đã có lỗi xảy ra khi gỡ sản phẩm");
    } finally {
      setDeletingItemId(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] flex flex-col p-6 shadow-2xl border border-slate-200 overflow-hidden space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-rose-50 text-[#800028] flex items-center justify-center shrink-0">
              <Zap className="w-5 h-5 fill-[#800028]" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 line-clamp-1">
                Quản Lý Sản Phẩm: {campaign.name}
              </h3>
              <p className="text-[11px] text-slate-500">
                Thêm sản phẩm deal sốc, phân bổ số lượng và kiểm soát giới hạn mua
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action Bar: Nút thêm deal */}
        <div className="flex items-center justify-between">
          <div className="text-xs text-slate-600 font-semibold">
            Danh sách deal giờ vàng ({items.length} sản phẩm)
          </div>

          {!isAdding && (
            <button
              type="button"
              onClick={() => setIsAdding(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-white bg-[#800028] hover:bg-[#60001e] transition-all shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Thêm Sản Phẩm Mới Vào Giờ Vàng</span>
            </button>
          )}
        </div>

        {/* Collapsible Form: Thêm deal mới */}
        {isAdding && (
          <form
            onSubmit={handleAddDeal}
            className="p-4 rounded-2xl bg-rose-50/50 border border-rose-200/80 space-y-4 animate-in fade-in"
          >
            <div className="flex items-center justify-between border-b border-rose-100 pb-2">
              <h4 className="text-xs font-bold text-[#800028] uppercase tracking-wider flex items-center gap-1.5">
                <Plus className="w-3.5 h-3.5" />
                <span>Thêm Deal Sản Phẩm Mới</span>
              </h4>
              <button
                type="button"
                onClick={() => setIsAdding(false)}
                className="text-xs text-slate-500 hover:text-slate-800"
              >
                Đóng
              </button>
            </div>

            {formError && (
              <div className="p-2.5 rounded-xl bg-rose-100 text-rose-800 text-xs font-medium flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                <span>{formError}</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Chọn sản phẩm */}
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700">
                  Chọn sản phẩm trong kho <span className="text-rose-500">*</span>
                </label>
                <select
                  required
                  value={selectedProductId}
                  onChange={(e) => {
                    setSelectedProductId(e.target.value);
                    const prod = availableProducts.find(
                      (p) => p.id === e.target.value
                    );
                    if (prod && prod.variants.length > 0) {
                      setSelectedVariantId(prod.variants[0].id);
                      setSalePrice(
                        Math.round(
                          (Number(prod.variants[0].price) * 0.8) / 1000
                        ) * 1000 + ""
                      );
                    } else {
                      setSelectedVariantId("");
                    }
                  }}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-[#800028]/20 focus:border-[#800028]"
                >
                  <option value="">-- Chọn sản phẩm --</option>
                  {availableProducts.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.origin || "Chính hãng"})
                    </option>
                  ))}
                </select>
              </div>

              {/* Chọn biến thể */}
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700">
                  Chọn biến thể / Quy cách <span className="text-rose-500">*</span>
                </label>
                <select
                  required
                  disabled={!selectedProduct}
                  value={selectedVariantId}
                  onChange={(e) => {
                    setSelectedVariantId(e.target.value);
                    const v = selectedProduct?.variants.find(
                      (item) => item.id === e.target.value
                    );
                    if (v) {
                      setSalePrice(
                        Math.round((Number(v.price) * 0.8) / 1000) * 1000 + ""
                      );
                    }
                  }}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-[#800028]/20 focus:border-[#800028] disabled:bg-slate-100"
                >
                  {selectedProduct?.variants.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.name} (Tồn kho: {v.stock} | Giá:{" "}
                      {Number(v.price).toLocaleString("vi-VN")}₫)
                    </option>
                  ))}
                </select>
              </div>

              {/* Giá Flash Sale */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-slate-700">
                    Giá Flash Sale (VND) <span className="text-rose-500">*</span>
                  </label>
                  {discountPercent > 0 && (
                    <span className="text-[11px] font-bold text-rose-600 bg-rose-100 px-2 py-0.5 rounded-full">
                      Giảm {discountPercent}%
                    </span>
                  )}
                </div>
                <input
                  type="number"
                  required
                  min={1000}
                  step={1000}
                  value={salePrice}
                  onChange={(e) => setSalePrice(e.target.value)}
                  placeholder="Ví dụ: 199000"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#800028]/20 focus:border-[#800028]"
                />
              </div>

              {/* Số lượng mở bán & Giới hạn */}
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-700">
                    Số lượng bán <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#800028]/20 focus:border-[#800028]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-700">
                    Giới hạn / khách
                  </label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={limitPerUser}
                    onChange={(e) => setLimitPerUser(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#800028]/20 focus:border-[#800028]"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsAdding(false)}
                className="px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-600 hover:bg-white"
              >
                Hủy
              </button>
              <button
                type="submit"
                disabled={submittingDeal}
                className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-xs font-bold text-white bg-[#800028] hover:bg-[#60001e] shadow-xs disabled:opacity-50"
              >
                {submittingDeal && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                <span>Lưu Deal Giờ Vàng</span>
              </button>
            </div>
          </form>
        )}

        {/* Danh sách Deal trong Campaign */}
        <div className="flex-1 overflow-y-auto space-y-2.5 min-h-[220px] max-h-[380px] pr-1">
          {loadingItems ? (
            <div className="py-12 text-center text-slate-400">
              <Loader2 className="w-5 h-5 animate-spin mx-auto mb-1 text-[#800028]" />
              <span className="text-xs">Đang tải danh sách deal...</span>
            </div>
          ) : items.length === 0 ? (
            <div className="py-12 text-center text-slate-400 border border-dashed border-slate-200 rounded-2xl p-6">
              <Package className="w-8 h-8 mx-auto mb-1 opacity-30 text-[#800028]" />
              <p className="text-xs font-semibold text-slate-600">
                Chiến dịch này chưa có sản phẩm deal nào
              </p>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Bấm nút &quot;Thêm Sản Phẩm Mới Vào Giờ Vàng&quot; ở trên để bắt đầu
              </p>
            </div>
          ) : (
            items.map((item) => {
              const regular = item.variant.regularPrice;
              const sale = item.salePrice;
              const discount =
                regular > 0 ? Math.round(((regular - sale) / regular) * 100) : 0;
              const isDeleting = deletingItemId === item.id;

              return (
                <div
                  key={item.id}
                  className="p-3 rounded-2xl border border-slate-200/80 bg-white hover:border-rose-200 transition-all flex items-center justify-between gap-3 text-xs"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    {/* Thumbnail */}
                    <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-slate-100 shrink-0 border border-slate-200">
                      {item.product.imageUrl ? (
                        <Image
                          src={item.product.imageUrl}
                          alt={item.product.name}
                          fill
                          sizes="48px"
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-300">
                          <Package className="w-5 h-5" />
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="min-w-0 space-y-0.5">
                      <h5 className="font-bold text-slate-900 truncate">
                        {item.product.name}
                      </h5>
                      <div className="flex items-center gap-2 text-[11px] text-slate-500">
                        <span>Quy cách: <strong>{item.variant.name}</strong></span>
                        <span>•</span>
                        <span>SKU: {item.variant.sku}</span>
                      </div>
                      <div className="flex items-center gap-2 text-[11px]">
                        <span className="font-black text-[#800028]">
                          {sale.toLocaleString("vi-VN")} ₫
                        </span>
                        <span className="text-slate-400 line-through">
                          {regular.toLocaleString("vi-VN")} ₫
                        </span>
                        <span className="px-1.5 py-0.2 rounded bg-rose-100 text-rose-700 font-bold text-[10px]">
                          -{discount}%
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Quantity & Actions */}
                  <div className="flex items-center gap-4 shrink-0">
                    <div className="text-right space-y-0.5">
                      <div className="text-[11px] font-semibold text-slate-700">
                        {item.soldCount}/{item.quantity} đã bán ({item.soldPercentage}%)
                      </div>
                      <div className="w-24 h-1.5 rounded-full bg-slate-100 overflow-hidden">
                        <div
                          className="h-full bg-[#800028]"
                          style={{ width: `${Math.min(100, item.soldPercentage)}%` }}
                        />
                      </div>
                      <div className="text-[10px] text-slate-400">
                        Giới hạn: {item.limitPerUser} hộp/khách
                      </div>
                    </div>

                    <button
                      type="button"
                      disabled={isDeleting}
                      onClick={() => handleDeleteItem(item.id)}
                      className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors disabled:opacity-50"
                      title="Gỡ sản phẩm khỏi Flash Sale"
                    >
                      {isDeleting ? (
                        <Loader2 className="w-4 h-4 animate-spin text-rose-600" />
                      ) : (
                        <Trash2 className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};
