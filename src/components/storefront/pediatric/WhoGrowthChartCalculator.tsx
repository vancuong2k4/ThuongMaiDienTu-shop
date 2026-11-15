"use client";

// ============================================================
// components/storefront/pediatric/WhoGrowthChartCalculator.tsx
// Thước Đo & Đánh Giá Thể Trạng Trẻ Em Chuẩn WHO Z-Scores (Phase 23)
// ============================================================

import React, { useState } from "react";
import Link from "next/link";
import {
  Baby,
  Scale,
  Activity,
  Heart,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ShieldCheck,
  Stethoscope,
  Info,
  Calendar,
} from "lucide-react";
import type { WhoAssessmentResult } from "@/lib/pediatric-growth";

export const WhoGrowthChartCalculator: React.FC = () => {
  const [childName, setChildName] = useState("Bé");
  const [gender, setGender] = useState<"BOY" | "GIRL">("BOY");
  const [birthDate, setBirthDate] = useState("2024-01-01");
  const [weightKg, setWeightKg] = useState<number>(10.5);
  const [heightCm, setHeightCm] = useState<number>(82.0);

  const [loading, setLoading] = useState(false);
  const [assessment, setAssessment] = useState<WhoAssessmentResult | null>(null);

  const handleAssess = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/pediatric/assess-growth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          childName,
          gender,
          birthDate,
          weightKg,
          heightCm,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setAssessment(data.data);
      } else {
        alert(data.message || "Không thể thực hiện đánh giá thể trạng.");
      }
    } catch {
      alert("Lỗi kết nối khi đánh giá thể trạng bé.");
    } finally {
      setLoading(false);
    }
  };

  const getWeightStatusBadge = (status: string) => {
    switch (status) {
      case "SEVERELY_UNDERWEIGHT":
        return <span className="px-2.5 py-1 rounded-full text-xs font-black bg-rose-100 text-rose-800 border border-rose-300">Cực kỳ nhẹ cân (Z &lt; -3)</span>;
      case "UNDERWEIGHT":
        return <span className="px-2.5 py-1 rounded-full text-xs font-black bg-amber-100 text-amber-800 border border-amber-300">Nhẹ cân (Z &lt; -2)</span>;
      case "OVERWEIGHT":
        return <span className="px-2.5 py-1 rounded-full text-xs font-black bg-purple-100 text-purple-800 border border-purple-300">Thừa cân (Z &gt; +2)</span>;
      default:
        return <span className="px-2.5 py-1 rounded-full text-xs font-black bg-emerald-100 text-emerald-800 border border-emerald-300">Cân nặng chuẩn WHO (-2 &le; Z &le; +2)</span>;
    }
  };

  const getHeightStatusBadge = (status: string) => {
    switch (status) {
      case "STUNTED":
        return <span className="px-2.5 py-1 rounded-full text-xs font-black bg-amber-100 text-amber-800 border border-amber-300">Thấp còi (Z &lt; -2)</span>;
      case "TALL":
        return <span className="px-2.5 py-1 rounded-full text-xs font-black bg-sky-100 text-sky-800 border border-sky-300">Chiều cao vượt trội (Z &gt; +2)</span>;
      default:
        return <span className="px-2.5 py-1 rounded-full text-xs font-black bg-emerald-100 text-emerald-800 border border-emerald-300">Chiều cao chuẩn WHO (-2 &le; Z &le; +2)</span>;
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-gray-200/80 shadow-xs overflow-hidden">
      {/* 1. Header Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-950 to-slate-900 p-6 sm:p-8 text-white relative">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-sky-200 text-xs font-bold mb-3 border border-white/15">
            <Activity className="w-3.5 h-3.5 text-sky-400" />
            <span>Tiêu Chuẩn Tăng Trưởng Trẻ Em WHO (Child Growth Standards)</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight">
            Thước Đo Bách Phân Vị &amp; Đánh Giá Thể Trạng Trẻ Em Chuẩn Y Khoa
          </h2>
          <p className="text-xs sm:text-sm text-sky-100/90 mt-2 leading-relaxed">
            Nhập ngày sinh, chiều cao và cân nặng để hệ thống tự động tính Z-Score, so khớp với 122
            chuẩn mốc phát triển của Tổ chức Y Tế Thế Giới (WHO) và đưa ra lời khuyên vi chất Úc.
          </p>
        </div>
      </div>

      <div className="p-6 sm:p-8 space-y-8">
        {/* 2. Form Nhập Liệu Thể Trạng Bé */}
        <form onSubmit={handleAssess} className="bg-slate-50/80 p-5 sm:p-6 rounded-2xl border border-slate-200 space-y-5">
          <h3 className="text-xs font-black text-gray-500 uppercase tracking-wider">
            Thông Tin Chỉ Số Phát Triển Của Bé
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Tên bé */}
            <div>
              <label className="text-xs font-bold text-gray-700 block mb-1">
                Tên hoặc Biệt danh của bé:
              </label>
              <input
                type="text"
                required
                value={childName}
                onChange={(e) => setChildName(e.target.value)}
                placeholder="VD: Bé Bon, Bé Sữa..."
                className="w-full px-3 py-2 text-xs bg-white border border-gray-200 rounded-xl focus:outline-hidden focus:ring-1 focus:ring-blue-600 font-bold"
              />
            </div>

            {/* Giới tính */}
            <div>
              <label className="text-xs font-bold text-gray-700 block mb-1">
                Giới tính:
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setGender("BOY")}
                  className={`py-2 text-xs font-bold rounded-xl border transition-all ${
                    gender === "BOY"
                      ? "bg-blue-600 text-white border-blue-600 shadow-xs"
                      : "bg-white text-gray-700 border-gray-200 hover:border-gray-300"
                  }`}
                >
                  👦 Bé trai
                </button>
                <button
                  type="button"
                  onClick={() => setGender("GIRL")}
                  className={`py-2 text-xs font-bold rounded-xl border transition-all ${
                    gender === "GIRL"
                      ? "bg-pink-600 text-white border-pink-600 shadow-xs"
                      : "bg-white text-gray-700 border-gray-200 hover:border-gray-300"
                  }`}
                >
                  👧 Bé gái
                </button>
              </div>
            </div>

            {/* Ngày sinh */}
            <div>
              <label className="text-xs font-bold text-gray-700 block mb-1">
                Ngày sinh của bé:
              </label>
              <input
                type="date"
                required
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-white border border-gray-200 rounded-xl focus:outline-hidden focus:ring-1 focus:ring-blue-600 font-bold text-gray-800"
              />
            </div>

            {/* Cân nặng */}
            <div>
              <label className="text-xs font-bold text-gray-700 block mb-1">
                Cân nặng hiện tại (kg):
              </label>
              <input
                type="number"
                step="0.1"
                min="1.5"
                max="45.0"
                required
                value={weightKg}
                onChange={(e) => setWeightKg(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs bg-white border border-gray-200 rounded-xl focus:outline-hidden focus:ring-1 focus:ring-blue-600 font-black text-blue-700"
              />
            </div>

            {/* Chiều cao */}
            <div className="sm:col-span-2 lg:col-span-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2 border-t border-slate-200">
              <div className="flex-1 max-w-xs">
                <label className="text-xs font-bold text-gray-700 block mb-1">
                  Chiều cao / Chiều dài (cm):
                </label>
                <input
                  type="number"
                  step="0.5"
                  min="40"
                  max="140"
                  required
                  value={heightCm}
                  onChange={(e) => setHeightCm(Number(e.target.value))}
                  className="w-full px-3 py-2 text-xs bg-white border border-gray-200 rounded-xl focus:outline-hidden focus:ring-1 focus:ring-blue-600 font-black text-indigo-700"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-black text-xs rounded-xl shadow-xs transition-colors disabled:opacity-50 flex items-center justify-center gap-2 self-end sm:self-auto"
              >
                <Activity className="w-4 h-4" />
                <span>{loading ? "Đang Tính Toán..." : "Đánh Giá Thể Trạng Ngay"}</span>
              </button>
            </div>
          </div>
        </form>

        {/* 3. Bảng Kết Quả Đánh Giá Y Khoa */}
        {assessment && (
          <div className="space-y-6">
            <div className="bg-blue-50/60 rounded-2xl p-6 border border-blue-200/80 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-blue-200/60 pb-4">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-blue-800 bg-blue-200/70 px-2 py-0.5 rounded">
                    Báo Cáo Phân Tích Thể Trạng WHO
                  </span>
                  <h3 className="text-lg font-black text-gray-900 mt-1">
                    Bé {assessment.childName} ({assessment.ageMonths} tháng tuổi •{" "}
                    {assessment.gender === "BOY" ? "Bé trai" : "Bé gái"})
                  </h3>
                </div>
                <div className="text-xs text-gray-500 font-medium">
                  Thời điểm đánh giá: Hôm nay
                </div>
              </div>

              {/* 2 Khối Chỉ Số Cân Nặng & Chiều Cao */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Cân Nặng */}
                <div className="bg-white p-5 rounded-2xl border border-blue-100 shadow-xs space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-gray-500 uppercase flex items-center gap-1.5">
                      <Scale className="w-4 h-4 text-blue-600" />
                      <span>Cân Nặng: {assessment.weightKg} kg</span>
                    </span>
                    {getWeightStatusBadge(assessment.weightStatus)}
                  </div>

                  <div className="flex items-baseline justify-between pt-1">
                    <div className="text-xs text-gray-600">
                      Z-Score: <strong className="text-gray-900">{assessment.weightZScore} SD</strong>
                    </div>
                    <div className="text-xs text-gray-600">
                      Bách phân vị: <strong className="text-blue-700">{assessment.weightPercentileApprox}</strong>
                    </div>
                  </div>

                  <div className="p-2.5 bg-slate-50 rounded-xl text-[11px] text-gray-600 flex justify-between">
                    <span>Chuẩn P50: <strong>{assessment.whoStandardBaseline.weightMedianKg}kg</strong></span>
                    <span>Ngưỡng thiếu: <strong>&lt; {assessment.whoStandardBaseline.weightMinus2SD}kg</strong></span>
                    <span>Ngưỡng thừa: <strong>&gt; {assessment.whoStandardBaseline.weightPlus2SD}kg</strong></span>
                  </div>
                </div>

                {/* Chiều Cao */}
                <div className="bg-white p-5 rounded-2xl border border-blue-100 shadow-xs space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-gray-500 uppercase flex items-center gap-1.5">
                      <Activity className="w-4 h-4 text-indigo-600" />
                      <span>Chiều Cao: {assessment.heightCm} cm</span>
                    </span>
                    {getHeightStatusBadge(assessment.heightStatus)}
                  </div>

                  <div className="flex items-baseline justify-between pt-1">
                    <div className="text-xs text-gray-600">
                      Z-Score: <strong className="text-gray-900">{assessment.heightZScore} SD</strong>
                    </div>
                    <div className="text-xs text-gray-600">
                      Bách phân vị: <strong className="text-indigo-700">{assessment.heightPercentileApprox}</strong>
                    </div>
                  </div>

                  <div className="p-2.5 bg-slate-50 rounded-xl text-[11px] text-gray-600 flex justify-between">
                    <span>Chuẩn P50: <strong>{assessment.whoStandardBaseline.heightMedianCm}cm</strong></span>
                    <span>Ngưỡng thấp: <strong>&lt; {assessment.whoStandardBaseline.heightMinus2SD}cm</strong></span>
                    <span>Ngưỡng cao: <strong>&gt; {assessment.whoStandardBaseline.heightPlus2SD}cm</strong></span>
                  </div>
                </div>
              </div>

              {/* Lời khuyên Dược sĩ */}
              <div className="bg-white p-5 rounded-2xl border border-blue-100 shadow-xs space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-800">
                  <Stethoscope className="w-4 h-4 text-emerald-600" />
                  <span>Chỉ Dẫn Chuyên Môn Từ Dược Sĩ THUYNGA Shop</span>
                </div>
                <p className="text-xs text-gray-700 leading-relaxed font-medium">
                  {assessment.pharmacistAdvice}
                </p>
              </div>

              {/* Gợi ý vi chất bổ sung */}
              <div className="bg-white p-5 rounded-2xl border border-blue-100 shadow-xs space-y-3">
                <h4 className="text-xs font-black text-gray-700 uppercase tracking-wide">
                  Phác Đồ Vi Chất Úc Được Khuyến Nghị Cho Bé:
                </h4>
                <div className="flex flex-wrap gap-2">
                  {assessment.recommendedNutrients.map((item, idx) => (
                    <div
                      key={idx}
                      className="px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-gray-800 flex items-center gap-2"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
