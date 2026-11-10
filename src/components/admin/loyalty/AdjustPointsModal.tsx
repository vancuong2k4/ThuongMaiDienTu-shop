"use client";

// ============================================================
// components/admin/loyalty/AdjustPointsModal.tsx
// Modal Điều Chỉnh Điểm Tích Lũy Khách Hàng Thủ Công (Module 10.3)
// ============================================================

import React, { useState, useEffect } from "react";
import { X, Search, Award, AlertCircle, CheckCircle2, UserCheck } from "lucide-react";

interface CustomerOption {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  loyaltyPoints?: number;
  membershipTier?: string;
}

interface AdjustPointsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const AdjustPointsModal: React.FC<AdjustPointsModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [customers, setCustomers] = useState<CustomerOption[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerOption | null>(null);

  const [points, setPoints] = useState<number | "">("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Tìm kiếm khách hàng debounce
  useEffect(() => {
    if (!isOpen) return;

    const timer = setTimeout(async () => {
      try {
        setIsSearching(true);
        const res = await fetch(
          `/api/admin/customers?search=${encodeURIComponent(searchQuery)}&limit=15`
        );
        const data = await res.json();
        if (data.success && Array.isArray(data.customers)) {
          setCustomers(data.customers);
        }
      } catch (err) {
        console.error("Failed to load customers for loyalty adjust:", err);
      } finally {
        setIsSearching(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery, isOpen]);

  if (!isOpen) return null;

  const handleQuickPoints = (val: number) => {
    setPoints(val);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!selectedCustomer) {
      setErrorMsg("Vui lòng chọn khách hàng cần điều chỉnh điểm.");
      return;
    }

    if (points === "" || points === 0) {
      setErrorMsg("Số điểm điều chỉnh phải khác 0 (dương để cộng, âm để trừ).");
      return;
    }

    if (!description.trim() || description.trim().length < 5) {
      setErrorMsg("Vui lòng nhập lý do/diễn giải cụ thể (tối thiểu 5 ký tự).");
      return;
    }

    try {
      setIsSubmitting(true);
      const res = await fetch("/api/admin/loyalty/adjust", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: selectedCustomer.id,
          points: Number(points),
          description: description.trim(),
        }),
      });

      const result = await res.json();
      if (!res.ok || !result.success) {
        throw new Error(result.error || "Không thể điều chỉnh điểm");
      }

      setSuccessMsg(
        `Thành công: Đã ${Number(points) > 0 ? "cộng" : "trừ"} ${Math.abs(
          Number(points)
        )} điểm cho khách hàng ${selectedCustomer.name}. Số dư mới: ${
          result.data.newBalance
        } pts.`
      );

      setTimeout(() => {
        onSuccess();
        onClose();
        // Reset state
        setSelectedCustomer(null);
        setPoints("");
        setDescription("");
        setSuccessMsg(null);
      }, 1200);
    } catch (err: unknown) {
      const errMessage =
        err instanceof Error ? err.message : "Đã xảy ra lỗi không xác định";
      setErrorMsg(errMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-rose-50 text-[#800028] flex items-center justify-center">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-black text-slate-800">
                Điều Chỉnh Điểm Tích Lũy
              </h3>
              <p className="text-[11px] text-slate-500 font-medium">
                Cộng hoặc khấu trừ điểm THUYNGA Club thủ công
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto">
          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* 1. Chọn khách hàng */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              1. Chọn Khách Hàng <span className="text-rose-500">*</span>
            </label>

            {selectedCustomer ? (
              <div className="flex items-center justify-between p-3 rounded-xl border border-emerald-200 bg-emerald-50/60">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-xs font-bold">
                    <UserCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-800">
                      {selectedCustomer.name}
                    </p>
                    <p className="text-[11px] text-slate-500">
                      {selectedCustomer.email}
                      {selectedCustomer.phone ? ` • ${selectedCustomer.phone}` : ""}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedCustomer(null)}
                  className="text-xs text-rose-600 hover:underline font-semibold"
                >
                  Đổi
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Tìm theo tên, email hoặc SĐT..."
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-[#800028]/20 focus:border-[#800028] outline-hidden"
                  />
                </div>

                <div className="max-h-36 overflow-y-auto divide-y divide-slate-100 border border-slate-200 rounded-xl bg-slate-50/30">
                  {isSearching ? (
                    <p className="p-3 text-center text-xs text-slate-400">
                      Đang tìm khách hàng...
                    </p>
                  ) : customers.length === 0 ? (
                    <p className="p-3 text-center text-xs text-slate-400">
                      Không tìm thấy khách hàng phù hợp
                    </p>
                  ) : (
                    customers.map((c) => (
                      <button
                        type="button"
                        key={c.id}
                        onClick={() => setSelectedCustomer(c)}
                        className="w-full text-left p-2.5 hover:bg-slate-100 transition-colors flex items-center justify-between"
                      >
                        <div>
                          <p className="text-xs font-bold text-slate-800">
                            {c.name}
                          </p>
                          <p className="text-[10px] text-slate-500">{c.email}</p>
                        </div>
                        <span className="text-[11px] text-[#800028] font-bold">
                          Chọn
                        </span>
                      </button>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* 2. Số điểm điều chỉnh */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-slate-700">
                2. Số Điểm Điều Chỉnh <span className="text-rose-500">*</span>
              </label>
              <span className="text-[11px] text-slate-400">
                (Dương: Cộng | Âm: Trừ)
              </span>
            </div>

            <input
              type="number"
              value={points}
              onChange={(e) =>
                setPoints(e.target.value === "" ? "" : Number(e.target.value))
              }
              placeholder="VD: 500 hoặc -200"
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm font-mono font-bold text-slate-800 focus:ring-2 focus:ring-[#800028]/20 focus:border-[#800028] outline-hidden"
            />

            {/* Quick buttons */}
            <div className="flex items-center gap-1.5 mt-2 flex-wrap">
              <span className="text-[10px] text-slate-400 font-semibold mr-1">
                Nhanh:
              </span>
              <button
                type="button"
                onClick={() => handleQuickPoints(100)}
                className="px-2 py-1 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold hover:bg-emerald-100"
              >
                +100
              </button>
              <button
                type="button"
                onClick={() => handleQuickPoints(500)}
                className="px-2 py-1 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold hover:bg-emerald-100"
              >
                +500
              </button>
              <button
                type="button"
                onClick={() => handleQuickPoints(1000)}
                className="px-2 py-1 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold hover:bg-emerald-100"
              >
                +1,000
              </button>
              <button
                type="button"
                onClick={() => handleQuickPoints(-100)}
                className="px-2 py-1 rounded-lg bg-rose-50 text-rose-700 border border-rose-200 text-[10px] font-bold hover:bg-rose-100"
              >
                -100
              </button>
              <button
                type="button"
                onClick={() => handleQuickPoints(-500)}
                className="px-2 py-1 rounded-lg bg-rose-50 text-rose-700 border border-rose-200 text-[10px] font-bold hover:bg-rose-100"
              >
                -500
              </button>
            </div>
          </div>

          {/* 3. Lý do & Diễn giải */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              3. Lý Do / Diễn Giải Sổ Cái <span className="text-rose-500">*</span>
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="VD: Tặng điểm sinh nhật VIP, Bồi thường giao hàng muộn, Khấu trừ do huỷ đơn hàng ngoài hệ thống..."
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 placeholder:text-slate-400 focus:ring-2 focus:ring-[#800028]/20 focus:border-[#800028] outline-hidden"
            />
          </div>

          {/* Action Buttons */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 rounded-xl bg-[#800028] hover:bg-[#60001e] text-white text-xs font-bold transition-all shadow-md shadow-[#800028]/20 disabled:opacity-50"
            >
              {isSubmitting ? "Đang xử lý..." : "Xác Nhận Điều Chỉnh"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
