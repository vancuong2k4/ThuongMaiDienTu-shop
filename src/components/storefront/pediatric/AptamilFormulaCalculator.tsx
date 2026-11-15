"use client";

// ============================================================
// components/storefront/pediatric/AptamilFormulaCalculator.tsx
// Công Cụ Chuẩn Hóa Tỷ Lệ & Nhiệt Độ Pha Sữa Aptamil Úc (Phase 23)
// ============================================================

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Baby,
  Thermometer,
  Droplets,
  Scale,
  Clock,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  ShoppingBag,
  Info,
  ChevronRight,
  ArrowRight,
} from "lucide-react";
import { useCartStore } from "@/store/cart";
import type { FormulaMixResult } from "@/lib/pediatric-growth";

interface AptamilFormulaCalculatorProps {
  initialProtocols: any[];
}

export const AptamilFormulaCalculator: React.FC<AptamilFormulaCalculatorProps> = ({
  initialProtocols,
}) => {
  const addItem = useCartStore((state) => state.addItem);
  const [selectedStage, setSelectedStage] = useState<string>("STAGE_1");
  const [calcMode, setCalcMode] = useState<"VOLUME" | "WEIGHT">("VOLUME");
  const [targetVolume, setTargetVolume] = useState<number>(150);
  const [babyWeight, setBabyWeight] = useState<number>(6.5);
  const [waterTempInput, setWaterTempInput] = useState<number>(42);
  const [mixResult, setMixResult] = useState<FormulaMixResult | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [addedToCart, setAddedToCart] = useState<boolean>(false);

  const stagesList = [
    {
      id: "STAGE_1",
      label: "Số 1 (0 - 6 tháng)",
      title: "Aptamil Profutura Số 1",
      desc: "Men vi sinh Bifidobacterium & Đạm Whey tối ưu",
      defaultVolume: 150,
      defaultWeight: 5.5,
    },
    {
      id: "STAGE_2",
      label: "Số 2 (6 - 12 tháng)",
      title: "Aptamil Profutura Số 2",
      desc: "Kẽm sinh học & Sắt tăng cường miễn dịch",
      defaultVolume: 200,
      defaultWeight: 8.5,
    },
    {
      id: "STAGE_3",
      label: "Số 3 (1 - 3 tuổi)",
      title: "Aptamil Profutura Số 3",
      desc: "DHA não bộ & Canxi xương răng Toddler",
      defaultVolume: 200,
      defaultWeight: 12.0,
    },
    {
      id: "STAGE_4",
      label: "Số 4 (3 tuổi trở lên)",
      title: "Aptamil Profutura Số 4",
      desc: "Phức hợp vi chất cho bé mẫu giáo vận động",
      defaultVolume: 200,
      defaultWeight: 15.0,
    },
  ];

  const fetchMixCalculation = async () => {
    setLoading(true);
    try {
      const payload: any = { stage: selectedStage };
      if (calcMode === "VOLUME") {
        payload.targetWaterVolumeMl = targetVolume;
      } else {
        payload.babyWeightKg = babyWeight;
      }

      const res = await fetch("/api/pediatric/calculate-formula", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success) {
        setMixResult(data.data);
      }
    } catch {
      console.error("Lỗi tính toán pha sữa Aptamil");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMixCalculation();
  }, [selectedStage, calcMode, targetVolume, babyWeight]);

  const handleStageSelect = (stageId: string) => {
    setSelectedStage(stageId);
    const stageInfo = stagesList.find((s) => s.id === stageId);
    if (stageInfo) {
      setTargetVolume(stageInfo.defaultVolume);
      setBabyWeight(stageInfo.defaultWeight);
    }
  };

  const handleAddToCart = () => {
    if (!mixResult?.product) return;
    const variant = mixResult.product.variants?.[0];
    if (!variant) return;

    addItem({
      productId: mixResult.product.id,
      variantId: variant.id,
      productName: mixResult.product.name,
      variantName: mixResult.productTitle,
      sku: variant.id,
      price: Number(variant.price),
      quantity: 1,
      stock: variant.stock || 50,
      image: variant.image ?? null,
    });

    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  const formatVND = (n: number) => {
    return new Intl.NumberFormat("vi-VN").format(n) + "₫";
  };

  const isTempTooHot = waterTempInput > 45;
  const isTempTooCold = waterTempInput < 37;
  const isTempIdeal = waterTempInput >= 40 && waterTempInput <= 45;

  return (
    <div className="bg-white rounded-3xl border border-gray-200/80 shadow-xs overflow-hidden">
      {/* 1. Header Banner */}
      <div className="bg-gradient-to-r from-emerald-800 via-teal-900 to-slate-900 p-6 sm:p-8 text-white relative">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-emerald-200 text-xs font-bold mb-3 border border-white/15">
            <Baby className="w-3.5 h-3.5 text-emerald-300" />
            <span>Tiêu Chuẩn Dược Sĩ Nhi Khoa Úc</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight">
            Công Cụ Chuẩn Hóa Tỷ Lệ &amp; Nhiệt Độ Pha Sữa Aptamil Profutura Úc
          </h2>
          <p className="text-xs sm:text-sm text-emerald-100/90 mt-2 leading-relaxed">
            Sữa Aptamil Úc chứa hệ vi sinh sống <em>Bifidobacterium breve M-16V</em> và cấu trúc đạm
            tự nhiên. Nước quá nóng trên 45°C sẽ phá hủy toàn bộ lợi khuẩn và làm vón cục sữa.
          </p>
        </div>
      </div>

      <div className="p-6 sm:p-8 space-y-8">
        {/* 2. Chọn Giai Đoạn Sữa (Stages 1-4) */}
        <div>
          <label className="text-xs font-black text-gray-500 uppercase tracking-wider block mb-3">
            Bước 1: Chọn Độ Tuổi Của Bé (Giai Đoạn Aptamil)
          </label>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {stagesList.map((stg) => {
              const isSelected = selectedStage === stg.id;
              return (
                <button
                  key={stg.id}
                  type="button"
                  onClick={() => handleStageSelect(stg.id)}
                  className={`p-4 rounded-2xl border text-left transition-all ${
                    isSelected
                      ? "border-emerald-600 bg-emerald-50/70 shadow-xs ring-2 ring-emerald-500/20"
                      : "border-gray-200 hover:border-gray-300 bg-white"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span
                      className={`text-xs font-black px-2 py-0.5 rounded ${
                        isSelected
                          ? "bg-emerald-600 text-white"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {stg.id.replace("_", " ")}
                    </span>
                    {isSelected && (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    )}
                  </div>
                  <h4 className="font-bold text-gray-900 text-xs sm:text-sm mt-1">
                    {stg.label}
                  </h4>
                  <p className="text-[11px] text-gray-500 mt-0.5 line-clamp-2">
                    {stg.desc}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {/* 3. Chế Độ Tính Toán & Nhập Liệu */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 bg-slate-50/70 p-5 rounded-2xl border border-slate-200/80">
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="text-xs font-black text-gray-700 uppercase tracking-wide">
                Bước 2: Căn Chỉnh Khẩu Phần Cữ Uống
              </label>
              <div className="flex bg-gray-200 p-0.5 rounded-lg text-[11px] font-bold">
                <button
                  type="button"
                  onClick={() => setCalcMode("VOLUME")}
                  className={`px-3 py-1 rounded-md transition-colors ${
                    calcMode === "VOLUME"
                      ? "bg-white text-gray-900 shadow-xs"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  Theo Dung Tích (ml)
                </button>
                <button
                  type="button"
                  onClick={() => setCalcMode("WEIGHT")}
                  className={`px-3 py-1 rounded-md transition-colors ${
                    calcMode === "WEIGHT"
                      ? "bg-white text-gray-900 shadow-xs"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  Theo Cân Nặng (kg)
                </button>
              </div>
            </div>

            {calcMode === "VOLUME" ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs font-bold text-gray-600">
                  <span>Dung tích nước cần pha:</span>
                  <span className="text-emerald-700 font-black text-base">
                    {targetVolume} ml
                  </span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="300"
                  step="50"
                  value={targetVolume}
                  onChange={(e) => setTargetVolume(Number(e.target.value))}
                  className="w-full accent-emerald-600 cursor-pointer"
                />
                <div className="flex justify-between text-[11px] text-gray-400 font-medium">
                  <span>50ml (1 muỗng)</span>
                  <span>100ml</span>
                  <span>150ml (Chuẩn)</span>
                  <span>200ml (Chuẩn)</span>
                  <span>250ml</span>
                  <span>300ml</span>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs font-bold text-gray-600">
                  <span>Cân nặng hiện tại của bé:</span>
                  <span className="text-emerald-700 font-black text-base">
                    {babyWeight} kg
                  </span>
                </div>
                <input
                  type="range"
                  min="3.0"
                  max="20.0"
                  step="0.5"
                  value={babyWeight}
                  onChange={(e) => setBabyWeight(Number(e.target.value))}
                  className="w-full accent-emerald-600 cursor-pointer"
                />
                <div className="flex justify-between text-[11px] text-gray-400 font-medium">
                  <span>3.0 kg</span>
                  <span>6.0 kg</span>
                  <span>10.0 kg</span>
                  <span>15.0 kg</span>
                  <span>20.0 kg</span>
                </div>
              </div>
            )}
          </div>

          {/* Cảm Biến Nhiệt Độ Nước Pha Sữa */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-black text-gray-700 uppercase tracking-wide flex items-center gap-1.5">
                <Thermometer className="w-4 h-4 text-rose-500" />
                <span>Nhiệt Độ Nước Pha Thử Nghiệm</span>
              </label>
              <span
                className={`text-sm font-black px-2.5 py-0.5 rounded-full ${
                  isTempIdeal
                    ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                    : isTempTooHot
                    ? "bg-rose-100 text-rose-800 border border-rose-300 animate-pulse"
                    : "bg-sky-100 text-sky-800 border border-sky-300"
                }`}
              >
                {waterTempInput}°C
              </span>
            </div>

            <input
              type="range"
              min="25"
              max="70"
              step="1"
              value={waterTempInput}
              onChange={(e) => setWaterTempInput(Number(e.target.value))}
              className="w-full accent-rose-600 cursor-pointer mb-2"
            />

            {isTempTooHot ? (
              <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-[11px] text-rose-800 leading-relaxed font-medium flex items-start gap-1.5">
                <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <span>
                  <strong>NGUY HIỂM:</strong> Nước {waterTempInput}°C quá nóng! Sẽ làm biến tính
                  protein whey, vón cục bột và triệt tiêu 100% lợi khuẩn sống <em>Bifidobacterium M-16V</em>.
                </span>
              </div>
            ) : isTempTooCold ? (
              <div className="p-2.5 rounded-xl bg-sky-50 border border-sky-200 text-[11px] text-sky-800 leading-relaxed font-medium flex items-start gap-1.5">
                <Info className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
                <span>
                  Nước {waterTempInput}°C hơi nguội, chất béo tự nhiên trong sữa Aptamil có thể tan chậm hơn. Khuyến nghị 40°C - 45°C.
                </span>
              </div>
            ) : (
              <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-[11px] text-emerald-800 leading-relaxed font-medium flex items-start gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>
                  <strong>HOÀN HẢO:</strong> {waterTempInput}°C là dải nhiệt độ vàng để sữa tan sánh mịn, hòa tan trọn vẹn DHA và giữ trọn men vi sinh sống.
                </span>
              </div>
            )}
          </div>
        </div>

        {/* 4. Kết Quả Định Lượng Cữ Sữa */}
        {mixResult && (
          <div className="bg-emerald-50/50 rounded-2xl p-6 border border-emerald-200/80 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-emerald-200/60 pb-4">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-emerald-800 bg-emerald-200/70 px-2 py-0.5 rounded">
                  Kết Quả Đo Lường Cho 1 Cữ
                </span>
                <h3 className="text-lg font-black text-gray-900 mt-1">
                  {mixResult.productTitle}
                </h3>
              </div>

              {mixResult.product && (
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleAddToCart}
                    className="px-4 py-2 bg-[#800028] hover:bg-[#5c001e] text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>
                      {addedToCart ? "Đã Thêm Vào Giỏ!" : "Mua Hộp Sữa Này"}
                    </span>
                  </button>
                </div>
              )}
            </div>

            {/* 4 Thẻ chỉ số định lượng */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-white p-4 rounded-xl border border-emerald-100 shadow-xs">
                <div className="text-[11px] font-bold text-gray-500 uppercase flex items-center gap-1">
                  <Droplets className="w-3.5 h-3.5 text-sky-500" />
                  <span>Nước Ấm (40-45°C)</span>
                </div>
                <div className="text-2xl font-black text-gray-900 mt-1">
                  {mixResult.waterVolumeMl}
                  <span className="text-xs font-normal text-gray-500 ml-1">ml</span>
                </div>
                <p className="text-[10px] text-gray-400 mt-0.5">Rót nước vào bình trước</p>
              </div>

              <div className="bg-white p-4 rounded-xl border border-emerald-100 shadow-xs">
                <div className="text-[11px] font-bold text-gray-500 uppercase flex items-center gap-1">
                  <Scale className="w-3.5 h-3.5 text-amber-500" />
                  <span>Số Muỗng Gạt Ngang</span>
                </div>
                <div className="text-2xl font-black text-emerald-700 mt-1">
                  {mixResult.scoopsCount}
                  <span className="text-xs font-normal text-gray-500 ml-1">muỗng gạt</span>
                </div>
                <p className="text-[10px] text-gray-400 mt-0.5">1 muỗng = 50ml nước</p>
              </div>

              <div className="bg-white p-4 rounded-xl border border-emerald-100 shadow-xs">
                <div className="text-[11px] font-bold text-gray-500 uppercase flex items-center gap-1">
                  <Scale className="w-3.5 h-3.5 text-purple-500" />
                  <span>Khối Lượng Bột</span>
                </div>
                <div className="text-2xl font-black text-gray-900 mt-1">
                  {mixResult.powderWeightGrams}
                  <span className="text-xs font-normal text-gray-500 ml-1">gram</span>
                </div>
                <p className="text-[10px] text-gray-400 mt-0.5">Không nén bột chặt</p>
              </div>

              <div className="bg-white p-4 rounded-xl border border-emerald-100 shadow-xs">
                <div className="text-[11px] font-bold text-gray-500 uppercase flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-rose-500" />
                  <span>Năng Lượng Cung Cấp</span>
                </div>
                <div className="text-2xl font-black text-gray-900 mt-1">
                  ~{mixResult.estimatedCaloriesKcal}
                  <span className="text-xs font-normal text-gray-500 ml-1">kcal</span>
                </div>
                <p className="text-[10px] text-gray-400 mt-0.5">Khoảng 66 kcal/100ml</p>
              </div>
            </div>

            {/* Quy trình pha 6 bước chuẩn hóa */}
            <div className="bg-white rounded-xl p-5 border border-emerald-100 space-y-3">
              <h4 className="text-xs font-black text-gray-700 uppercase tracking-wide flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Quy Trình 6 Bước Pha Sữa Khoa Học Chuẩn Dược Sĩ</span>
              </h4>
              <div className="space-y-2">
                {mixResult.mixingSteps.map((step, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 text-xs text-gray-700">
                    <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 font-black text-[11px] flex items-center justify-center shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <span className="leading-relaxed">{step}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Lưu ý bảo quản */}
            <div className="text-xs text-gray-500 border-t border-emerald-200/50 pt-3">
              <strong>Hướng dẫn bảo quản:</strong> {mixResult.storageGuidelines}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
