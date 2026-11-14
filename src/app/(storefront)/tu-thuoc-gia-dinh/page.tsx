// ============================================================
// app/(storefront)/tu-thuoc-gia-dinh/page.tsx
// Trang Giới Thiệu Tính Năng Tủ Thuốc Gia Đình & Lịch Uống Chuẩn Dược Sĩ (Phase 22)
// ============================================================

import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import {
  Clock,
  Heart,
  ShieldCheck,
  Users,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Stethoscope,
  BookOpen,
  Calendar,
  Package,
  Award,
  ChevronRight,
  Sun,
  Sunrise,
  Sunset,
  Moon,
  Coffee,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Tủ Thuốc Gia Đình & Lịch Uống Vi Chất Tương Thích Sinh Học | THUYNGA Shop",
  description:
    "Khoa học uống thực phẩm chức năng Úc theo nhịp sinh học Chronobiology: Hấp thu tối đa, triệt tiêu đối kháng vi chất Canxi - Sắt - Kẽm, đồng hành chăm sóc sức khỏe trọn vẹn mọi thế hệ gia đình.",
};

export const revalidate = 3600; // Cache 1 giờ

export default function FamilyHealthLandingPage() {
  const chronobiologySlots = [
    {
      slot: "SÁNG TRƯỚC ĂN",
      time: "06:30 - 07:00",
      icon: Sunrise,
      badgeColor: "bg-amber-100 text-amber-800 border-amber-300",
      targetNutrients: ["Men vi sinh Probiotics (Life-Space)", "Nghệ Nano Curcumin"],
      biologicalReason:
        "Khi dạ dày rỗng, nồng độ acid dịch vị thấp nhất, tạo điều kiện cho hàng tỷ lợi khuẩn sống sót vượt qua dạ dày để di chuyển an toàn xuống ruột non.",
      caution: "Không uống cùng nước nóng trên 40°C làm chết men vi sinh sống.",
    },
    {
      slot: "SÁNG SAU ĂN",
      time: "07:30 - 08:30",
      icon: Sun,
      badgeColor: "bg-orange-100 text-orange-800 border-orange-300",
      targetNutrients: [
        "Vitamin D3 K2 (Ostelin / Bio Island)",
        "Canxi hữu cơ sữa Úc",
        "Dầu cá Omega-3 DHA",
        "Sữa bột Aptamil Profutura",
      ],
      biologicalReason:
        "Vitamin D3, K2 và Omega-3 là các vi chất tan trong dầu, cần chất béo từ bữa sáng để kích hoạt enzyme lipase và hòa tan micelle hấp thu tối ưu vào máu.",
      caution: "Không uống chung với viên sắt hoặc trà xanh đặc cùng khung giờ.",
    },
    {
      slot: "TRƯA SAU ĂN",
      time: "12:30 - 13:30",
      icon: Coffee,
      badgeColor: "bg-sky-100 text-sky-800 border-sky-300",
      targetNutrients: ["Viên sắt hữu cơ (Blackmores Pregnancy Iron)", "Kẽm Zinc Bio Island", "Vitamin C Úc"],
      biologicalReason:
        "Cách xa cữ Canxi buổi sáng ít nhất 2 đến 4 giờ. Bữa trưa có kèm Vitamin C giúp chuyển hóa sắt ferric (Fe3+) thành sắt ferrous (Fe2+) dễ hấp thu qua thụ thể DMT1.",
      caution: "Tránh uống cùng cà phê, trà xanh hoặc sữa tươi vì tannin và phytate gây ức chế sắt.",
    },
    {
      slot: "TỐI SAU ĂN",
      time: "18:30 - 19:30",
      icon: Sunset,
      badgeColor: "bg-indigo-100 text-indigo-800 border-indigo-300",
      targetNutrients: [
        "Glucosamine 1500mg sụn khớp",
        "CoQ10 150mg tuần hoàn tim mạch",
        "Mật ong Manuka Berringa ấm",
      ],
      biologicalReason:
        "Hỗ trợ quá trình phục hồi tế bào sụn khớp và tuần hoàn oxy tim mạch trong suốt giai đoạn nghỉ ngơi tĩnh của cơ thể buổi tối.",
      caution: "Pha mật ong Manuka với nước ấm dưới 45°C để bảo toàn enzyme kháng khuẩn methylglyoxal.",
    },
    {
      slot: "TRƯỚC KHI ĐI NGỦ",
      time: "21:30 - 22:00",
      icon: Moon,
      badgeColor: "bg-purple-100 text-purple-800 border-purple-300",
      targetNutrients: ["Magie hữu cơ (Magnesium)", "Thảo dược hỗ trợ giấc ngủ sâu"],
      biologicalReason:
        "Magie kích hoạt hệ thần kinh phó giao cảm, giải phóng thụ thể GABA, giúp thư giãn nhóm cơ bắp căng thẳng sau ngày dài và đưa giấc ngủ vào trạng thái REM sâu.",
      caution: "Nên uống cách bữa ăn tối ít nhất 1.5 giờ để dạ dày nhẹ nhàng.",
    },
  ];

  const conflictRules = [
    {
      pair: "Canxi Hữu Cơ vs Viên Sắt",
      problem:
        "Cùng cạnh tranh trực tiếp thụ thể hấp thu DMT1 (Divalent Metal Transporter 1) trên biểu mô niêm mạc ruột non.",
      pharmacistAdvice:
        "Uống Canxi vào cữ Sáng sau ăn (08:00) và dời Sắt sang cữ Trưa sau ăn (12:30). Cách biệt tối thiểu 2 giờ sẽ giúp hấp thu trọn vẹn cả hai mà không bị đào thải lãng phí.",
    },
    {
      pair: "Kẽm (Zinc) vs Sắt (Iron)",
      problem:
        "Liều cao của một khoáng chất kim loại hóa trị 2 sẽ ức chế cạnh tranh tính thấm màng nhung mao đối với khoáng chất còn lại.",
      pharmacistAdvice:
        "Tách cữ uống hoặc bổ sung Kẽm vào buổi sáng/chiều xen kẽ. Không uống gộp hai loại cùng một ngụm nước.",
    },
    {
      pair: "Vitamin Tan Trong Dầu (D3, K2, DHA) vs Nước Trắng Đơn Thuần",
      problem:
        "D3, K2 và Omega-3 DHA không tan trong nước; nếu uống lúc đói hoặc chỉ với nước lọc, hơn 60% hàm lượng vi chất sẽ bị đào thải qua gan mật mà không thẩm thấu được.",
      pharmacistAdvice:
        "Luôn uống ngay sau bữa ăn có chứa chất béo lành mạnh (sữa công thức, trứng, bơ hạt, dầu oliu).",
    },
  ];

  const familyGenerations = [
    {
      title: "Trẻ Nhỏ & Học Sinh",
      emoji: "👶",
      desc: "Tập trung nền tảng chiều cao, hoàn thiện võng mạc mắt, não bộ và kháng thể đường ruột.",
      regimen: ["Aptamil Profutura Úc", "Bio Island D3 K2 & DHA", "Kẽm nhai Bio Island Zinc"],
    },
    {
      title: "Mẹ Bầu & Phụ Nữ Sau Sinh",
      emoji: "👩",
      desc: "Bổ sung sắt không táo bón, canxi nano xương cốt, DHA tinh khiết tránh trầm cảm và sương mù não.",
      regimen: ["Blackmores Pregnancy Iron", "Canxi Ostelin bầu", "Elevit Úc chính hãng"],
    },
    {
      title: "Ông Bà & Người Cao Tuổi",
      emoji: "👵",
      desc: "Tái tạo dịch nhờn khớp gối, hạ huyết áp, bảo vệ mạch vành và giấc ngủ sâu tự nhiên.",
      regimen: ["Blackmores Glucosamine 1500mg", "CoQ10 Healthy Care", "Magnesium ngủ ngon"],
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50/70 pb-20">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#800028] via-[#5c001e] to-slate-950 text-white py-16 lg:py-24">
        {/* Glow decoration */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="container mx-auto max-w-7xl px-4 sm:px-6 relative z-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-amber-300 text-xs font-bold mb-6">
              <Stethoscope className="w-4 h-4 text-emerald-400" />
              <span>Phương Pháp Chronobiology Chuẩn Dược Sĩ Úc</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight mb-6">
              Tủ Thuốc Sức Khỏe Gia Đình &amp; Lịch Uống Vi Chất Tương Thích Sinh Học
            </h1>
            <p className="text-base sm:text-lg text-rose-100/90 leading-relaxed mb-8">
              Không chỉ là mua sản phẩm tốt — uống đúng thời điểm sinh học giúp cơ thể hấp thu tối
              đa từng giọt vi chất, triệt tiêu đối kháng Canxi - Sắt, và tự động cảnh báo sắp hết
              hộp để gia đình bạn không bao giờ đứt quãng liệu trình.
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <Link
                href="/tai-khoan/tu-thuoc-gia-dinh"
                className="inline-flex items-center gap-2.5 px-6 py-3.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-black text-sm rounded-xl shadow-lg shadow-emerald-900/30 transition-all hover:scale-[1.02]"
              >
                <Heart className="w-4 h-4 text-rose-200 fill-rose-200" />
                <span>Mở Tủ Thuốc Gia Đình Của Bạn</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </Link>

              <Link
                href="/tu-van-dinh-duong"
                className="inline-flex items-center gap-2 px-5 py-3.5 bg-white/10 hover:bg-white/15 text-white font-bold text-sm rounded-xl backdrop-blur-md border border-white/20 transition-all"
              >
                <Stethoscope className="w-4 h-4 text-emerald-300" />
                <span>Tư Vấn Cùng Dược Sĩ</span>
              </Link>
            </div>

            {/* Quick Badges */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-12 pt-8 border-t border-white/10">
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
                <span className="text-xs font-medium text-rose-100">100% Chính Hãng Úc Air Cargo</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Clock className="w-5 h-5 text-amber-300 shrink-0" />
                <span className="text-xs font-medium text-rose-100">5 Khung Giờ Sinh Học Chuẩn</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Users className="w-5 h-5 text-sky-300 shrink-0" />
                <span className="text-xs font-medium text-rose-100">Hồ Sơ Đa Thế Hệ Gia Đình</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Package className="w-5 h-5 text-rose-300 shrink-0" />
                <span className="text-xs font-medium text-rose-100">Cảnh Báo Tái Nạp Trước 7 Ngày</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. CHRONOBIOLOGY SECTION (5 KHUNG GIỜ SINH HỌC) */}
      <section className="py-16">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold mb-3 border border-emerald-200">
              <Clock className="w-3.5 h-3.5 text-emerald-600" />
              <span>Đồng Hồ Nhịp Sinh Học 24H</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
              5 Thời Điểm Uống Vi Chất Vàng Trong Ngày
            </h2>
            <p className="text-sm sm:text-base text-gray-600 mt-2">
              Mỗi cơ quan và enzyme trong cơ thể người có chu kỳ hoạt động sinh học riêng. Uống đúng
              giờ giúp tăng khả năng hấp thu lên gấp 300%.
            </p>
          </div>

          <div className="space-y-4">
            {chronobiologySlots.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={idx}
                  className="bg-white rounded-2xl p-5 sm:p-6 border border-gray-200/80 shadow-xs hover:shadow-md transition-shadow"
                >
                  <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-rose-50 text-[#800028] flex items-center justify-center shrink-0 border border-rose-100">
                        <Icon className="w-6 h-6" />
                      </div>
                      <div>
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-xs font-black border ${item.badgeColor}`}
                          >
                            {item.slot}
                          </span>
                          <span className="text-xs font-bold text-gray-400">
                            Khung giờ khuyến nghị: {item.time}
                          </span>
                        </div>
                        <h3 className="text-base sm:text-lg font-black text-gray-900 mb-2">
                          {item.targetNutrients.join(" • ")}
                        </h3>
                        <p className="text-xs sm:text-sm text-gray-600 leading-relaxed max-w-3xl">
                          <strong className="text-gray-900">Cơ chế dược lý:</strong>{" "}
                          {item.biologicalReason}
                        </p>
                      </div>
                    </div>

                    <div className="lg:w-72 bg-amber-50/70 border border-amber-200 rounded-xl p-3 shrink-0">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900 mb-1">
                        <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                        <span>Lưu ý Dược sĩ</span>
                      </div>
                      <p className="text-xs text-amber-800 leading-relaxed">{item.caution}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 3. CONFLICT MATRIX EXPLANATION */}
      <section className="py-12 bg-white border-y border-gray-200">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6">
          <div className="max-w-2xl mb-10">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 text-[#800028] text-xs font-bold mb-3 border border-rose-200">
              <ShieldCheck className="w-3.5 h-3.5 text-[#800028]" />
              <span>Bộ Lọc Triệt Tiêu Đối Kháng</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
              Tại Sao Phải Tránh Uống Canxi, Sắt &amp; Kẽm Cùng Lúc?
            </h2>
            <p className="text-sm text-gray-600 mt-2">
              Hệ thống của THUYNGA Shop tự động quét lịch uống gia đình bạn và đưa ra cảnh báo nếu phát
              hiện các vi chất đối kháng nhau.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {conflictRules.map((rule, idx) => (
              <div
                key={idx}
                className="bg-slate-50 rounded-2xl p-5 border border-slate-200 hover:border-rose-300 transition-colors flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="w-6 h-6 rounded-full bg-rose-100 text-[#800028] text-xs font-black flex items-center justify-center">
                      !
                    </span>
                    <h3 className="font-black text-gray-900 text-sm">{rule.pair}</h3>
                  </div>
                  <div className="mb-4">
                    <span className="text-[11px] font-bold text-rose-700 uppercase tracking-wide block mb-1">
                      Hiện tượng đối kháng:
                    </span>
                    <p className="text-xs text-gray-600 leading-relaxed">{rule.problem}</p>
                  </div>
                </div>

                <div className="bg-emerald-50/80 border border-emerald-200 rounded-xl p-3">
                  <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wide block mb-1">
                    Khuyến nghị từ Dược Sĩ:
                  </span>
                  <p className="text-xs text-emerald-900 leading-relaxed font-medium">
                    {rule.pharmacistAdvice}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. MULTI-GENERATION PROFILES */}
      <section className="py-16">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-50 text-sky-800 text-xs font-bold mb-3 border border-sky-200">
              <Users className="w-3.5 h-3.5 text-sky-600" />
              <span>Chăm Sóc Toàn Diện 3 Thế Hệ</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
              Một Tài Khoản — Tủ Thuốc Cho Cả Gia Đình
            </h2>
            <p className="text-sm sm:text-base text-gray-600 mt-2">
              Tạo hồ sơ độc lập cho từng thành viên: Con nhỏ, Mẹ bầu, Vợ chồng, và Ông bà lớn tuổi.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {familyGenerations.map((gen, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl p-6 border border-gray-200/80 shadow-xs hover:shadow-lg transition-all"
              >
                <div className="text-4xl mb-4">{gen.emoji}</div>
                <h3 className="text-lg font-black text-gray-900 mb-2">{gen.title}</h3>
                <p className="text-xs text-gray-600 leading-relaxed mb-4">{gen.desc}</p>

                <div className="border-t border-gray-100 pt-3">
                  <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block mb-2">
                    Sản phẩm Úc gợi ý theo phác đồ:
                  </span>
                  <ul className="space-y-1.5">
                    {gen.regimen.map((prod, pIdx) => (
                      <li
                        key={pIdx}
                        className="flex items-center gap-2 text-xs font-semibold text-gray-800"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>{prod}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. CALL TO ACTION FOOTER BANNER */}
      <section className="container mx-auto max-w-7xl px-4 sm:px-6">
        <div className="bg-gradient-to-r from-[#800028] via-[#a80036] to-[#5c001e] rounded-3xl p-8 sm:p-12 text-white text-center shadow-xl relative overflow-hidden">
          <div className="relative z-10 max-w-2xl mx-auto space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-amber-200 text-xs font-bold backdrop-blur-md">
              <Award className="w-4 h-4 text-amber-300" />
              <span>Tiện Ích Đặc Quyền Cho Thành Viên THUYNGA Shop</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight">
              Bắt Đầu Xây Dựng Tủ Thuốc Sức Khỏe Gia Đình Ngay Hôm Nay
            </h2>
            <p className="text-xs sm:text-sm text-rose-100/90 leading-relaxed">
              Hoàn toàn miễn phí. Dễ dàng điểm danh cữ uống mỗi ngày, nhận chuông báo trực quan,
              và an tâm tuyệt đối với nguồn hàng bay Air chuẩn hóa từ Melbourne &amp; Sydney.
            </p>
            <div className="pt-2 flex flex-wrap justify-center gap-4">
              <Link
                href="/tai-khoan/tu-thuoc-gia-dinh"
                className="px-8 py-3.5 bg-white text-[#800028] font-black text-sm rounded-xl shadow-lg hover:bg-rose-50 transition-all hover:scale-105 inline-flex items-center gap-2"
              >
                <span>Tạo Hồ Sơ Tủ Thuốc Gia Đình</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
              <Link
                href="/san-pham"
                className="px-6 py-3.5 bg-white/10 hover:bg-white/20 text-white font-bold text-sm rounded-xl border border-white/20 transition-all"
              >
                <span>Xem Danh Mục Sản Phẩm Úc</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
