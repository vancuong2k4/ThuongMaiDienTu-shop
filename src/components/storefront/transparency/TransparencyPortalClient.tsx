"use client";

// ============================================================
// components/storefront/transparency/TransparencyPortalClient.tsx
// Cổng Tra Cứu Minh Bạch Toàn Diện Cho Khách Hàng (Phase 15)
// ============================================================

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { TransparencySearchBar } from "./TransparencySearchBar";
import { FlightTimelineCard } from "./FlightTimelineCard";
import { ColdChainGaugeCard } from "./ColdChainGaugeCard";
import { ChemistReceiptGallery } from "./ChemistReceiptGallery";
import { BatchFreshnessPledge } from "./BatchFreshnessPledge";
import {
  ShieldCheck,
  Plane,
  FileText,
  Thermometer,
  Clock,
  AlertCircle,
  HelpCircle,
  CheckCircle2,
} from "lucide-react";

interface TransparencyPortalClientProps {
  initialCode?: string;
  initialData?: any;
}

export const TransparencyPortalClient: React.FC<TransparencyPortalClientProps> = ({
  initialCode = "",
  initialData = null,
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [currentCode, setCurrentCode] = useState(initialCode);
  const [data, setData] = useState<any>(initialData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchBatch = async (code: string) => {
    if (!code || code.trim().length < 2) return;
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/aircargo/verify/${encodeURIComponent(code.trim())}`);
      const resData = await res.json();

      if (!res.ok || !resData.success) {
        setError(
          resData.error ||
            `Không tìm thấy dữ liệu cho mã lô "${code}". Vui lòng kiểm tra lại mã in ở đáy sản phẩm.`
        );
        setData(null);
      } else {
        setData(resData.data);
        setCurrentCode(code);
      }
    } catch {
      setError("Đã xảy ra lỗi kết nối khi tra cứu. Vui lòng thử lại sau ít phút.");
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (code: string) => {
    router.replace(`/minh-bach-air-cargo?code=${encodeURIComponent(code)}`, {
      scroll: false,
    });
    fetchBatch(code);
  };

  useEffect(() => {
    const queryCode = searchParams.get("code");
    if (queryCode && queryCode !== currentCode) {
      setCurrentCode(queryCode);
      fetchBatch(queryCode);
    }
  }, [searchParams]);

  return (
    <div className="space-y-10 sm:space-y-12">
      {/* Hero Section */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-50 border border-rose-200/80 text-[#800028] text-xs font-bold uppercase tracking-wider shadow-sm">
          <ShieldCheck className="w-4 h-4 text-[#800028]" />
          <span>Hệ Thống Minh Bạch Air-Cargo Độc Quyền</span>
        </div>

        <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
          Kiểm Tra Vận Đơn Bay Air & Hóa Đơn Chemist Warehouse Úc
        </h1>

        <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl mx-auto">
          Tra cứu nguồn gốc thực tế từng hộp sữa Aptamil, mật ong Manuka và
          vitamin Úc được vận chuyển bằng đường hàng không trực tiếp về Nội Bài.
        </p>

        {/* Thanh Tra Cứu */}
        <div className="pt-2">
          <TransparencySearchBar
            onSearch={handleSearch}
            loading={loading}
            initialCode={currentCode}
          />
        </div>
      </div>

      {/* Hiển Thị Lỗi */}
      {error && (
        <div className="max-w-3xl mx-auto p-4 sm:p-5 bg-rose-50 border border-rose-200 rounded-2xl flex items-start gap-3.5 shadow-sm">
          <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h4 className="font-bold text-slate-900 text-sm">
              Không tìm thấy thông tin mã lô
            </h4>
            <p className="text-xs text-rose-700 leading-relaxed">{error}</p>
          </div>
        </div>
      )}

      {/* Kết Quả Tra Cứu Thành Công */}
      {data && (
        <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-300">
          {/* Thông tin mã lô & Hạn sử dụng */}
          <BatchFreshnessPledge batch={data} />

          {/* Lộ trình chuyến bay & Vận đơn AWB */}
          <FlightTimelineCard shipment={data.shipment} />

          {/* Chuỗi cung ứng lạnh & Nhiệt độ */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ColdChainGaugeCard
              storageTempMin={data.shipment.storageTempMin}
              storageTempMax={data.shipment.storageTempMax}
              temperatureLog={data.shipment.temperatureLog}
            />
            <ChemistReceiptGallery
              receiptImages={data.shipment.receiptImages}
              chemistSource={data.chemistSource}
            />
          </div>
        </div>
      )}

      {/* Hướng Dẫn & 4 Cam Kết Vàng (Khi chưa tra cứu hoặc ở chân trang) */}
      {!data && !loading && (
        <div className="max-w-4xl mx-auto space-y-10 pt-4">
          {/* 3 Bước Tra Cứu Nhanh */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-sm text-center space-y-2.5">
              <div className="w-10 h-10 rounded-2xl bg-rose-50 text-[#800028] font-black text-base flex items-center justify-center mx-auto">
                1
              </div>
              <h4 className="font-bold text-slate-800 text-sm">Xem Mã Dưới Đáy Hộp</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Mã lô (Batch code) gồm các chữ và số in dập nổi dưới đáy lon sữa hoặc thân chai vitamin.
              </p>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-sm text-center space-y-2.5">
              <div className="w-10 h-10 rounded-2xl bg-sky-50 text-sky-700 font-black text-base flex items-center justify-center mx-auto">
                2
              </div>
              <h4 className="font-bold text-slate-800 text-sm">Nhập Vào Ô Tra Cứu</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Điền chính xác mã lô hoặc nhấp vào các nút mã lô mẫu ở trên để hệ thống tự động đối soát.
              </p>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-sm text-center space-y-2.5">
              <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-700 font-black text-base flex items-center justify-center mx-auto">
                3
              </div>
              <h4 className="font-bold text-slate-800 text-sm">Xem Hồ Sơ Minh Bạch</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Xem toàn bộ số vận đơn AWB, hành trình bay, dải nhiệt độ kho lạnh và hóa đơn Chemist Úc.
              </p>
            </div>
          </div>

          {/* 4 Trụ Cột Cam Kết Vàng Của THUYNGA Shop */}
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-7 sm:p-9 text-white shadow-xl relative overflow-hidden">
            <div className="relative z-10 space-y-6">
              <div className="text-center max-w-xl mx-auto space-y-2">
                <span className="text-xs font-semibold text-rose-300 uppercase tracking-widest">
                  Tiêu Chuẩn Hàng Đầu
                </span>
                <h3 className="text-xl sm:text-2xl font-black tracking-tight">
                  4 Cam Kết Vàng Về Chuỗi Cung Ứng Hàng Úc
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
                <div className="p-4 bg-white/10 rounded-2xl backdrop-blur-sm space-y-1.5">
                  <div className="flex items-center gap-2 font-bold text-sky-300">
                    <Plane className="w-4 h-4" />
                    <span>100% Đi Máy Bay</span>
                  </div>
                  <p className="text-slate-300 text-[11px] leading-relaxed">
                    Vận chuyển hỏa tốc bằng đường hàng không Vietnam Airlines & Qantas Freight, không đi container đường biển.
                  </p>
                </div>

                <div className="p-4 bg-white/10 rounded-2xl backdrop-blur-sm space-y-1.5">
                  <div className="flex items-center gap-2 font-bold text-emerald-300">
                    <Clock className="w-4 h-4" />
                    <span>HSD Rất Xa &gt; 18-24 Tháng</span>
                  </div>
                  <p className="text-slate-300 text-[11px] leading-relaxed">
                    Nhập hàng liên tục hàng tuần, date luôn mới tinh từ các kệ thuốc Chemist Warehouse lớn nhất bang NSW & Victoria.
                  </p>
                </div>

                <div className="p-4 bg-white/10 rounded-2xl backdrop-blur-sm space-y-1.5">
                  <div className="flex items-center gap-2 font-bold text-amber-300">
                    <Thermometer className="w-4 h-4" />
                    <span>Kho Lạnh 18-24°C</span>
                  </div>
                  <p className="text-slate-300 text-[11px] leading-relaxed">
                    Giữ nguyên vẹn men vi sinh Probiotics và vitamin không bị biến tính hay giảm hoạt lực sinh học do nhiệt độ cao.
                  </p>
                </div>

                <div className="p-4 bg-white/10 rounded-2xl backdrop-blur-sm space-y-1.5">
                  <div className="flex items-center gap-2 font-bold text-rose-300">
                    <FileText className="w-4 h-4" />
                    <span>Hóa Đơn Thuế GST Đầy Đủ</span>
                  </div>
                  <p className="text-slate-300 text-[11px] leading-relaxed">
                    Minh bạch 100% hóa đơn mua hàng có mã số doanh nghiệp ABN và thuế GST từ các siêu thị uy tín tại Úc.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
