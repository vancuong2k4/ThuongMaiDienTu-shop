"use client";

// ============================================================
// components/admin/aircargo/CreateShipmentModal.tsx
// Modal Thêm Mới Chuyến Bay & Vận Đơn Air-Cargo (Phase 15)
// ============================================================

import React, { useState } from "react";
import { X, Plane, Plus, Trash2, AlertCircle } from "lucide-react";
import { AirlineCarrier, ShipmentStatus } from "@prisma/client";
import {
  AIRLINE_CARRIERS_CONFIG,
  SHIPMENT_STATUS_CONFIG,
} from "@/lib/validations/batch";

interface CreateShipmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreated: () => void;
}

export const CreateShipmentModal: React.FC<CreateShipmentModalProps> = ({
  isOpen,
  onClose,
  onCreated,
}) => {
  const [carrier, setCarrier] = useState<AirlineCarrier>("VIETNAM_AIRLINES_CARGO");
  const [flightNumber, setFlightNumber] = useState("VN782");
  const [airWaybillNumber, setAirWaybillNumber] = useState("738-");
  const [originAirport, setOriginAirport] = useState("SYD");
  const [destinationAirport, setDestinationAirport] = useState("HAN");
  const [departureDate, setDepartureDate] = useState(
    new Date().toISOString().slice(0, 16)
  );
  const [arrivalDate, setArrivalDate] = useState(
    new Date(Date.now() + 14 * 3600 * 1000).toISOString().slice(0, 16)
  );
  const [status, setStatus] = useState<ShipmentStatus>("IN_WAREHOUSE");
  const [storageTempMin, setStorageTempMin] = useState(18.0);
  const [storageTempMax, setStorageTempMax] = useState(24.0);
  const [receiptUrlInput, setReceiptUrlInput] = useState("");
  const [receiptImages, setReceiptImages] = useState<string[]>([
    "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800",
  ]);
  const [notes, setNotes] = useState(
    "Vận chuyển khoang lạnh 18-24°C, bảo quản tối ưu dinh dưỡng Aptamil & TPCN Úc."
  );

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleAddReceiptImage = () => {
    if (!receiptUrlInput.trim()) return;
    try {
      new URL(receiptUrlInput.trim());
      setReceiptImages([...receiptImages, receiptUrlInput.trim()]);
      setReceiptUrlInput("");
    } catch {
      setError("Vui lòng nhập đường dẫn URL ảnh hợp lệ (http:// hoặc https://)");
    }
  };

  const handleRemoveReceiptImage = (index: number) => {
    setReceiptImages(receiptImages.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/admin/aircargo/shipments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          airWaybillNumber: airWaybillNumber.trim(),
          carrier,
          flightNumber: flightNumber.trim().toUpperCase(),
          originAirport: originAirport.trim().toUpperCase(),
          destinationAirport: destinationAirport.trim().toUpperCase(),
          departureDate: new Date(departureDate).toISOString(),
          arrivalDate: new Date(arrivalDate).toISOString(),
          status,
          storageTempMin: Number(storageTempMin),
          storageTempMax: Number(storageTempMax),
          receiptImages,
          customsDocImages: [],
          notes: notes.trim() || null,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Không thể tạo chuyến bay air-cargo");
      }

      onCreated();
      onClose();
    } catch (err: any) {
      setError(err.message || "Đã xảy ra lỗi khi tạo chuyến bay");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl p-6 my-8">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-sky-50 text-sky-700 rounded-xl border border-sky-100">
              <Plane className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">
                Tạo Chuyến Bay & Vận Đơn Hàng Không (AWB)
              </h3>
              <p className="text-xs text-slate-500">
                Nhập thông tin chuyến bay Air Cargo Úc về Nội Bài
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
            {/* Hãng Hàng Không */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Hãng Hàng Không *
              </label>
              <select
                value={carrier}
                onChange={(e) => setCarrier(e.target.value as AirlineCarrier)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#800028]/20 focus:border-[#800028]"
              >
                {Object.entries(AIRLINE_CARRIERS_CONFIG).map(([key, item]) => (
                  <option key={key} value={key}>
                    {item.name} ({item.code})
                  </option>
                ))}
              </select>
            </div>

            {/* Số Hiệu Chuyến Bay */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Số Hiệu Chuyến Bay *
              </label>
              <input
                type="text"
                required
                value={flightNumber}
                onChange={(e) => setFlightNumber(e.target.value)}
                placeholder="VD: VN782 hoặc QF43"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-mono text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#800028]/20 focus:border-[#800028]"
              />
            </div>

            {/* Vận Đơn Hàng Không AWB */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Số Vận Đơn Hàng Không (AWB Number) *
              </label>
              <input
                type="text"
                required
                value={airWaybillNumber}
                onChange={(e) => setAirWaybillNumber(e.target.value)}
                placeholder="VD: 738-98421054"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-mono text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#800028]/20 focus:border-[#800028]"
              />
            </div>

            {/* Trạng Thái Vận Chuyển */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Trạng Thái Hiện Tại *
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as ShipmentStatus)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#800028]/20 focus:border-[#800028]"
              >
                {Object.entries(SHIPMENT_STATUS_CONFIG).map(([key, item]) => (
                  <option key={key} value={key}>
                    {item.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Sân Bay Đi */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Sân Bay Đi (Origin)
              </label>
              <input
                type="text"
                value={originAirport}
                onChange={(e) => setOriginAirport(e.target.value)}
                placeholder="SYD hoặc MEL"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-mono text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#800028]/20 focus:border-[#800028]"
              />
            </div>

            {/* Sân Bay Đến */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Sân Bay Đến (Destination)
              </label>
              <input
                type="text"
                value={destinationAirport}
                onChange={(e) => setDestinationAirport(e.target.value)}
                placeholder="HAN (Nội Bài)"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-mono text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#800028]/20 focus:border-[#800028]"
              />
            </div>

            {/* Ngày Cất Cánh */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Thời Điểm Cất Cánh (Departure) *
              </label>
              <input
                type="datetime-local"
                required
                value={departureDate}
                onChange={(e) => setDepartureDate(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#800028]/20 focus:border-[#800028]"
              />
            </div>

            {/* Ngày Hạ Cánh */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Thời Điểm Hạ Cánh (Arrival) *
              </label>
              <input
                type="datetime-local"
                required
                value={arrivalDate}
                onChange={(e) => setArrivalDate(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#800028]/20 focus:border-[#800028]"
              />
            </div>

            {/* Nhiệt Độ Min */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Nhiệt Độ Min (°C)
              </label>
              <input
                type="number"
                step="0.5"
                value={storageTempMin}
                onChange={(e) => setStorageTempMin(parseFloat(e.target.value))}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-mono text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#800028]/20 focus:border-[#800028]"
              />
            </div>

            {/* Nhiệt Độ Max */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Nhiệt Độ Max (°C)
              </label>
              <input
                type="number"
                step="0.5"
                value={storageTempMax}
                onChange={(e) => setStorageTempMax(parseFloat(e.target.value))}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-mono text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#800028]/20 focus:border-[#800028]"
              />
            </div>
          </div>

          {/* Ảnh Hóa Đơn Chemist Warehouse */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Ảnh Hóa Đơn Mua Hàng Chemist Warehouse Úc (URL)
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="url"
                value={receiptUrlInput}
                onChange={(e) => setReceiptUrlInput(e.target.value)}
                placeholder="Dán đường dẫn ảnh hóa đơn (https://...)"
                className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#800028]/20 focus:border-[#800028]"
              />
              <button
                type="button"
                onClick={handleAddReceiptImage}
                className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-semibold flex items-center gap-1 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                Thêm
              </button>
            </div>
            {receiptImages.length > 0 && (
              <div className="space-y-1.5 max-h-28 overflow-y-auto">
                {receiptImages.map((img, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between px-3 py-1.5 bg-slate-50 rounded-lg text-xs font-mono text-slate-600 border border-slate-200/80"
                  >
                    <span className="truncate max-w-[420px]">{img}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveReceiptImage(idx)}
                      className="text-rose-500 hover:text-rose-700 p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Ghi Chú */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Ghi Chú Vận Hành & Cam Kết
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="VD: Kiểm tra nhiệt độ nghiêm ngặt, date xa hơn 2 năm..."
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#800028]/20 focus:border-[#800028]"
            />
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
              className="px-5 py-2 text-xs sm:text-sm font-semibold text-white bg-[#800028] hover:bg-[#660020] rounded-xl shadow-sm hover:shadow transition-all disabled:opacity-50"
            >
              {loading ? "Đang tạo..." : "Tạo Chuyến Bay & Vận Đơn"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
