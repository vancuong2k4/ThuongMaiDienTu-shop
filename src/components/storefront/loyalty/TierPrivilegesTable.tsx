"use client";

// ============================================================
// components/storefront/loyalty/TierPrivilegesTable.tsx
// Bảng So Sánh Quyền Lợi 4 Hạng Hội Viên THUYNGA Club (Module 10.4)
// ============================================================

import React from "react";
import { Award, Crown, CheckCircle2, Star, Zap, Truck } from "lucide-react";

interface TierPrivilegesTableProps {
  currentTier: "BRONZE" | "SILVER" | "GOLD" | "DIAMOND";
}

export const TierPrivilegesTable: React.FC<TierPrivilegesTableProps> = ({
  currentTier,
}) => {
  const tiers = [
    {
      id: "BRONZE",
      name: "Thành Viên Đồng",
      badge: "Đồng (Bronze)",
      spentThreshold: "0 ₫ (Mặc định)",
      rate: "1%",
      icon: Award,
      borderColor: "border-amber-200",
      headerBg: "bg-amber-50/70 text-amber-900",
      rateBg: "text-amber-800",
      benefits: [
        "Hoàn điểm 1% trên mọi đơn hàng hợp lệ",
        "Quy đổi điểm lấy mã giảm giá không giới hạn",
        "Thông báo sớm các đợt Flash Sale & Deal Giờ Vàng",
        "Quà tặng tri ân sinh nhật tiêu chuẩn",
      ],
    },
    {
      id: "SILVER",
      name: "Thành Viên Bạc",
      badge: "Bạc (Silver)",
      spentThreshold: "Từ 3.000.000 ₫",
      rate: "1.5%",
      icon: Award,
      borderColor: "border-slate-300",
      headerBg: "bg-slate-100 text-slate-900",
      rateBg: "text-slate-800",
      benefits: [
        "Hoàn điểm 1.5% trên mọi đơn hàng (gấp 1.5 lần)",
        "Voucher quà tặng sinh nhật 100.000 ₫",
        "Ưu tiên xử lý đơn và đóng gói kiện hàng air-cargo",
        "Đặc quyền tham gia các ngày hội mua sắm hội viên",
      ],
    },
    {
      id: "GOLD",
      name: "Thành Viên Vàng",
      badge: "Vàng (Gold)",
      spentThreshold: "Từ 10.000.000 ₫",
      rate: "2%",
      icon: Crown,
      borderColor: "border-yellow-400",
      headerBg: "bg-yellow-50 text-yellow-950",
      rateBg: "text-yellow-700",
      benefits: [
        "Hoàn điểm 2% trên mọi đơn hàng (gấp 2 lần)",
        "Voucher quà tặng sinh nhật 250.000 ₫",
        "Voucher chiết khấu độc quyền ngày Gold Member",
        "Tư vấn chế độ dinh dưỡng & TPCN với Dược sĩ 1:1",
      ],
    },
    {
      id: "DIAMOND",
      name: "Thành Viên Kim Cương",
      badge: "Kim Cương (Diamond)",
      spentThreshold: "Từ 25.000.000 ₫",
      rate: "3%",
      icon: Crown,
      borderColor: "border-purple-300",
      headerBg: "bg-purple-900 text-purple-50",
      rateBg: "text-purple-600",
      benefits: [
        "Hoàn điểm 3% cao nhất sàn (gấp 3 lần)",
        "MIỄN PHÍ VẬN CHUYỂN TOÀN QUỐC TRỌN ĐỜI",
        "Voucher quà tặng sinh nhật VIP 500.000 ₫",
        "Trải nghiệm dùng thử sản phẩm xách tay mới về sớm nhất",
        "Đường dây nóng Hotline VIP ưu tiên kết nối 24/7",
      ],
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-black text-slate-800">
            Bảng Đặc Quyền 4 Hạng Hội Viên
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Càng chi tiêu nhiều – Tỷ lệ tích điểm và quyền lợi phục vụ càng vượt trội
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {tiers.map((t) => {
          const isCurrent = currentTier === t.id;
          const Icon = t.icon;

          return (
            <div
              key={t.id}
              className={`rounded-3xl border transition-all duration-300 flex flex-col overflow-hidden bg-white ${
                t.borderColor
              } ${
                isCurrent
                  ? "ring-2 ring-[#800028] shadow-lg shadow-[#800028]/10 relative"
                  : "shadow-xs hover:shadow-md"
              }`}
            >
              {/* Badge Hạng Hiện Tại */}
              {isCurrent && (
                <div className="bg-[#800028] text-white text-[10px] font-black uppercase tracking-wider py-1 text-center">
                  Hạng Hiện Tại Của Bạn
                </div>
              )}

              {/* Card Header */}
              <div className={`p-4 border-b ${t.headerBg}`}>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black uppercase tracking-wider">
                    {t.badge}
                  </span>
                  <Icon className="w-5 h-5 opacity-90" />
                </div>
                <div className="mt-3">
                  <div className="flex items-baseline gap-1">
                    <span className={`text-2xl font-black ${t.rateBg}`}>
                      {t.rate}
                    </span>
                    <span className="text-[11px] font-semibold opacity-80">
                      hoàn điểm
                    </span>
                  </div>
                  <p className="text-[11px] opacity-75 mt-0.5 font-medium">
                    {t.spentThreshold}
                  </p>
                </div>
              </div>

              {/* Quyền lợi chi tiết */}
              <div className="p-4 flex-1 space-y-2.5">
                <p className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                  Đặc quyền nổi bật:
                </p>
                <ul className="space-y-2 text-xs text-slate-600">
                  {t.benefits.map((benefit, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span className="leading-relaxed">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
