// ============================================================
// app/(storefront)/cong-thuc-pha-sua-aptamil/page.tsx
// Trung Tâm Pha Sữa Aptamil Úc & Thước Đo Tăng Trưởng Trẻ Em WHO (Phase 23)
// ============================================================

import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import {
  Baby,
  Activity,
  Thermometer,
  ShieldCheck,
  Heart,
  Droplets,
  Scale,
  Award,
  ChevronRight,
  BookOpen,
} from "lucide-react";
import { getAptamilProtocols } from "@/lib/pediatric-growth";
import { AptamilFormulaCalculator } from "@/components/storefront/pediatric/AptamilFormulaCalculator";
import { WhoGrowthChartCalculator } from "@/components/storefront/pediatric/WhoGrowthChartCalculator";

export const metadata: Metadata = {
  title: "Công Cụ Tính Pha Sữa Aptamil Úc & Thước Đo Thể Trạng WHO | THUYNGA Shop",
  description:
    "Chuẩn hóa nhiệt độ nước vàng 40-45°C bảo vệ men vi sinh sống Bifidobacterium breve M-16V, tính số muỗng sữa Aptamil Profutura Úc và đối chiếu bách phân vị Z-Scores chuẩn WHO.",
};

export const revalidate = 3600; // Cache 1 giờ

export default async function AptamilPediatricCalculatorPage() {
  const rawProtocols = await getAptamilProtocols();
  const protocols = JSON.parse(JSON.stringify(rawProtocols));

  return (
    <div className="min-h-screen bg-slate-50/70 pb-20 pt-6">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 space-y-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-xs text-gray-500 font-medium">
          <Link href="/" className="hover:text-[#800028] transition-colors">
            Trang chủ
          </Link>
          <ChevronRight className="w-3 h-3 text-gray-400" />
          <Link href="/tu-van-dinh-duong" className="hover:text-[#800028] transition-colors">
            Dinh dưỡng Nhi Khoa
          </Link>
          <ChevronRight className="w-3 h-3 text-gray-400" />
          <span className="text-gray-900 font-bold">
            Chuẩn Hóa Pha Sữa Aptamil &amp; Thước Đo WHO
          </span>
        </nav>

        {/* Hero Section */}
        <div className="bg-gradient-to-r from-[#800028] via-[#5c001e] to-slate-950 text-white rounded-3xl p-6 sm:p-10 relative overflow-hidden shadow-xl">
          <div className="max-w-3xl space-y-4 relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-amber-200 text-xs font-bold backdrop-blur-xs border border-white/15">
              <Baby className="w-3.5 h-3.5 text-amber-300" />
              <span>Khoa Học Nuôi Con Không Kháng Sinh Chuẩn Úc</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight">
              Chuẩn Hóa Pha Sữa Aptamil Profutura Úc &amp; Đánh Giá Bách Phân Vị WHO
            </h1>
            <p className="text-xs sm:text-sm text-rose-100/90 leading-relaxed">
              Mỗi muỗng sữa Aptamil chứa hàng tỷ lợi khuẩn sống và vi chất tan trong dầu. Tính đúng số
              muỗng theo ml nước, kiểm soát nhiệt độ vàng 40°C - 45°C và theo dõi biểu đồ Z-Score để
              bé yêu tăng trưởng vượt chuẩn toàn diện.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-white/10">
              <div className="flex items-center gap-2 text-xs text-rose-100">
                <Thermometer className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Nhiệt độ vàng 40-45°C</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-rose-100">
                <Droplets className="w-4 h-4 text-sky-400 shrink-0" />
                <span>Tỷ lệ chuẩn 50ml/muỗng</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-rose-100">
                <Activity className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Bách phân vị Z-Score WHO</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-rose-100">
                <ShieldCheck className="w-4 h-4 text-rose-300 shrink-0" />
                <span>100% Bay Air Úc Nguyên Seal</span>
              </div>
            </div>
          </div>
        </div>

        {/* 1. Aptamil Formula Calculator */}
        <section id="cong-cu-pha-sua">
          <AptamilFormulaCalculator initialProtocols={protocols} />
        </section>

        {/* 2. WHO Growth Chart Calculator */}
        <section id="thuoc-do-who">
          <WhoGrowthChartCalculator />
        </section>

        {/* 3. Footer Knowledge Section */}
        <section className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200/80 shadow-xs space-y-6">
          <div className="flex items-center gap-2 text-gray-900">
            <BookOpen className="w-5 h-5 text-[#800028]" />
            <h3 className="text-lg font-black tracking-tight">
              3 Nguyên Tắc Vàng Khi Cho Bé Uống Sữa Công Thức Úc
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-gray-600 leading-relaxed">
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
              <div className="font-bold text-gray-900 text-sm mb-1 text-emerald-800">
                1. Đong Nước Trước, Cho Bột Sau
              </div>
              <p>
                Rót nước ấm chính xác vạch đo (ví dụ: 150ml hoặc 200ml) trước khi múc bột. Nếu cho
                bột trước rồi mới đổ nước, thể tích sữa sẽ bị loãng hoặc đặc hơn tỷ lệ chuẩn, gây áp
                lực lên thận còn non nớt của trẻ.
              </p>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
              <div className="font-bold text-gray-900 text-sm mb-1 text-amber-800">
                2. Lắc Xoáy Tròn Tránh Bọt Khí
              </div>
              <p>
                Không lắc bình lên xuống theo phương thẳng đứng vì sẽ tạo ra rất nhiều bọt khí li ti.
                Bé nuốt phải bọt khí sẽ dễ bị đầy hơi, trớ sữa và quấy khóc ban đêm. Lăn tròn bình
                sữa trong lòng bàn tay 15-20 giây.
              </p>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
              <div className="font-bold text-gray-900 text-sm mb-1 text-rose-800">
                3. Tuyệt Đối Không Dùng Lại Sữa Thừa Sau 2 Giờ
              </div>
              <p>
                Khi miệng bé đã tiếp xúc với núm ti, enzyme amylase và vi khuẩn từ tuyến nước bọt đã
                đi vào bình sữa. Sữa Aptamil giàu chất đạm tự nhiên là môi trường vi khuẩn sinh sôi rất
                nhanh, nên bỏ phần sữa thừa sau 1 đến 2 giờ.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
