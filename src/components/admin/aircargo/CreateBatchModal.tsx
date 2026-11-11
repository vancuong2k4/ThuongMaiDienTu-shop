"use client";

// ============================================================
// components/admin/aircargo/CreateBatchModal.tsx
// Modal Thêm Mới Mã Lô Sản Phẩm Bay Air & Chứng Thực HSD (Phase 15)
// ============================================================

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { X, Package, Barcode, Calendar, Building2, AlertCircle, Search } from "lucide-react";
import { AirCargoShipmentItem } from "./types";

interface CreateBatchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreated: () => void;
  shipments: AirCargoShipmentItem[];
}

interface ProductItem {
  id: string;
  name: string;
  slug: string;
  images?: Array<{ url: string }>;
  variants?: Array<{
    id: string;
    name: string;
    sku: string;
  }>;
}

export const CreateBatchModal: React.FC<CreateBatchModalProps> = ({
  isOpen,
  onClose,
  onCreated,
  shipments,
}) => {
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(false);

  const [shipmentId, setShipmentId] = useState("");
  const [productId, setProductId] = useState("");
  const [variantId, setVariantId] = useState("");
  const [batchCode, setBatchCode] = useState("");
  const [australianBarcode, setAustralianBarcode] = useState("93");
  const [chemistSource, setChemistSource] = useState("Chemist Warehouse Sydney (Pitt St)");
  const [manufactureDate, setManufactureDate] = useState(
    new Date(Date.now() - 30 * 24 * 3600 * 1000).toISOString().slice(0, 10)
  );
  const [expiryDate, setExpiryDate] = useState(
    new Date(Date.now() + 730 * 24 * 3600 * 1000).toISOString().slice(0, 10)
  );
  const [importedQuantity, setImportedQuantity] = useState(100);
  const [remainingStock, setRemainingStock] = useState(100);
  const [certificateUrl, setCertificateUrl] = useState("");
  const [isActive, setIsActive] = useState(true);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load products list
  useEffect(() => {
    if (!isOpen) return;

    if (shipments.length > 0 && !shipmentId) {
      setShipmentId(shipments[0].id);
    }

    const fetchProducts = async () => {
      try {
        setLoadingProducts(true);
        const res = await fetch("/api/admin/products?limit=100");
        const data = await res.json();
        if (data.success && data.data) {
          setProducts(data.data);
          if (data.data.length > 0 && !productId) {
            setProductId(data.data[0].id);
          }
        }
      } catch {
        // ignore
      } finally {
        setLoadingProducts(false);
      }
    };

    fetchProducts();
  }, [isOpen, shipments]);

  if (!isOpen) return null;

  const selectedProduct = products.find((p) => p.id === productId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!shipmentId) {
      setError("Vui lòng chọn chuyến bay / vận đơn hàng không");
      return;
    }
    if (!productId) {
      setError("Vui lòng chọn sản phẩm liên kết");
      return;
    }
    if (!batchCode.trim()) {
      setError("Vui lòng nhập mã lô hàng (VD: APT-2026-SYD02)");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/admin/aircargo/batches", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          batchCode: batchCode.trim().toUpperCase(),
          productId,
          variantId: variantId || null,
          shipmentId,
          manufactureDate: new Date(manufactureDate).toISOString(),
          expiryDate: new Date(expiryDate).toISOString(),
          importedQuantity: Number(importedQuantity),
          remainingStock: Number(remainingStock),
          australianBarcode: australianBarcode.trim() || null,
          chemistSource: chemistSource.trim() || null,
          certificateUrl: certificateUrl.trim() || null,
          isActive,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Không thể tạo mã lô hàng");
      }

      onCreated();
      onClose();
    } catch (err: any) {
      setError(err.message || "Đã xảy ra lỗi khi tạo mã lô");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl p-6 my-8">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-emerald-50 text-emerald-700 rounded-xl border border-emerald-100">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">
                Tạo Mã Lô Hàng Mới & Khóa Hạn Sử Dụng
              </h3>
              <p className="text-xs text-slate-500">
                Liên kết mã lô in đáy lon với Vận Đơn Air Cargo chính thức
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg bg-slate-100 hover:bg-slate-200 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {error && (
          <div className="mt-4 p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {/* Chuyến Bay / Vận Đơn AWB Liên Kết */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Chuyến Bay & Vận Đơn AWB Liên Kết *
              </label>
              <select
                required
                value={shipmentId}
                onChange={(e) => setShipmentId(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#800028]/20 focus:border-[#800028]"
              >
                {shipments.map((s) => (
                  <option key={s.id} value={s.id}>
                    Chuyến {s.flightNumber} ({s.originAirport} ✈️ {s.destinationAirport}) - AWB: {s.airWaybillNumber}
                  </option>
                ))}
              </select>
            </div>

            {/* Sản phẩm */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Sản Phẩm Áp Dụng Mã Lô *
              </label>
              <select
                required
                value={productId}
                onChange={(e) => {
                  setProductId(e.target.value);
                  setVariantId("");
                }}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#800028]/20 focus:border-[#800028]"
              >
                {products.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Phân loại sản phẩm (nếu có) */}
            {selectedProduct && selectedProduct.variants && selectedProduct.variants.length > 0 && (
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Biến Thể / Phân Loại (Tùy chọn)
                </label>
                <select
                  value={variantId}
                  onChange={(e) => setVariantId(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#800028]/20 focus:border-[#800028]"
                >
                  <option value="">Tất cả biến thể của sản phẩm này</option>
                  {selectedProduct.variants.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.name} ({v.sku})
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Mã Lô Hàng */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Mã Lô Hàng (In Đáy Hộp / Thân Chai) *
              </label>
              <input
                type="text"
                required
                value={batchCode}
                onChange={(e) => setBatchCode(e.target.value)}
                placeholder="VD: APT-2026-SYD02"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-mono text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#800028]/20 focus:border-[#800028]"
              />
            </div>

            {/* Mã Vạch Chuẩn Úc */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Mã Vạch Chuẩn Úc (Đầu 93x)
              </label>
              <input
                type="text"
                value={australianBarcode}
                onChange={(e) => setAustralianBarcode(e.target.value)}
                placeholder="VD: 9300631481234"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-mono text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#800028]/20 focus:border-[#800028]"
              />
            </div>

            {/* Ngày Sản Xuất NSX */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Ngày Sản Xuất (NSX) *
              </label>
              <input
                type="date"
                required
                value={manufactureDate}
                onChange={(e) => setManufactureDate(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#800028]/20 focus:border-[#800028]"
              />
            </div>

            {/* Hạn Sử Dụng HSD */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Hạn Sử Dụng (HSD - Khóa Minh Bạch) *
              </label>
              <input
                type="date"
                required
                value={expiryDate}
                onChange={(e) => setExpiryDate(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#800028]/20 focus:border-[#800028]"
              />
            </div>

            {/* Số Lượng Nhập */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Số Lượng Nhập (Kiện/Hộp) *
              </label>
              <input
                type="number"
                min="1"
                required
                value={importedQuantity}
                onChange={(e) => {
                  const val = parseInt(e.target.value) || 0;
                  setImportedQuantity(val);
                  setRemainingStock(val);
                }}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-mono text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#800028]/20 focus:border-[#800028]"
              />
            </div>

            {/* Số Lượng Tồn Kho Hiện Tại */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Số Lượng Tồn Kho Còn Lại
              </label>
              <input
                type="number"
                min="0"
                value={remainingStock}
                onChange={(e) => setRemainingStock(parseInt(e.target.value) || 0)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-mono text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#800028]/20 focus:border-[#800028]"
              />
            </div>

            {/* Nguồn Chemist Warehouse */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Nguồn Hàng Nhà Thuốc Úc
              </label>
              <input
                type="text"
                value={chemistSource}
                onChange={(e) => setChemistSource(e.target.value)}
                placeholder="VD: Chemist Warehouse Sydney (Pitt St, NSW)"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#800028]/20 focus:border-[#800028]"
              />
            </div>

            {/* Link Chứng Thư Kiểm Định */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Đường Dẫn Chứng Thư Kiểm Định (URL - Tùy chọn)
              </label>
              <input
                type="url"
                value={certificateUrl}
                onChange={(e) => setCertificateUrl(e.target.value)}
                placeholder="https://..."
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-mono text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#800028]/20 focus:border-[#800028]"
              />
            </div>

            {/* Kích Hoạt Lưu Hành */}
            <div className="sm:col-span-2 flex items-center gap-2 pt-1">
              <input
                type="checkbox"
                id="batchActiveToggle"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                className="w-4 h-4 text-[#800028] rounded border-slate-300 focus:ring-[#800028]"
              />
              <label
                htmlFor="batchActiveToggle"
                className="text-xs font-semibold text-slate-700 cursor-pointer"
              >
                Kích hoạt lưu hành công khai cho khách hàng tra cứu (Active)
              </label>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 text-xs sm:text-sm font-semibold text-slate-600 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
            >
              Hủy bỏ
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 text-xs sm:text-sm font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-xl shadow-sm hover:shadow transition-all disabled:opacity-50"
            >
              {loading ? "Đang tạo..." : "Tạo Mã Lô & Khóa HSD"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
