"use client";

// ============================================================
// components/storefront/referral/ReferralShareCard.tsx
// Thẻ Chia Sẻ Mã Giới Thiệu, Liên Kết & Mã QR Code (Stage 12.4)
// ============================================================

import React, { useState, useEffect } from "react";
import QRCode from "qrcode";
import {
  Copy,
  Check,
  QrCode,
  Share2,
  Download,
  ExternalLink,
  MessageCircle,
  Send,
} from "lucide-react";

interface ReferralShareCardProps {
  referralCode: string;
  referralLink: string;
}

export const ReferralShareCard: React.FC<ReferralShareCardProps> = ({
  referralCode,
  referralLink,
}) => {
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [qrDataUrl, setQrDataUrl] = useState<string>("");
  const [showQR, setShowQR] = useState(false);

  // Sinh mã QR Code nội bộ từ URL giới thiệu
  useEffect(() => {
    if (!referralLink) return;
    QRCode.toDataURL(referralLink, {
      width: 320,
      margin: 2,
      color: {
        dark: "#800028",
        light: "#FFFFFF",
      },
    })
      .then((url) => setQrDataUrl(url))
      .catch((err) => console.error("Lỗi sinh QR Code:", err));
  }, [referralLink]);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(referralCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(referralLink);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleShareFacebook = () => {
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(referralLink)}`;
    window.open(url, "_blank", "width=600,height=500");
  };

  const handleShareTelegram = () => {
    const text = encodeURIComponent(
      `Tặng bạn Voucher 50.000₫ mua hàng Úc chính hãng tại THUYNGA Shop. Nhập mã giới thiệu: ${referralCode}`
    );
    const url = `https://t.me/share/url?url=${encodeURIComponent(referralLink)}&text=${text}`;
    window.open(url, "_blank", "width=600,height=500");
  };

  const handleShareZalo = () => {
    // Zalo sharing via URL or clipboard helper
    navigator.clipboard.writeText(
      `Tặng bạn Voucher 50.000₫ mua thực phẩm bảo vệ sức khỏe & dinh dưỡng Úc chính hãng tại THUYNGA Shop! Đăng ký ngay tại: ${referralLink}`
    );
    alert(
      "Đã sao chép lời nhắn kèm link giới thiệu! Bạn có thể dán trực tiếp vào khung chat Zalo."
    );
  };

  return (
    <div className="bg-white rounded-3xl border border-neutral-200/90 shadow-sm p-6 sm:p-8 space-y-6">
      <div>
        <h2 className="text-lg sm:text-xl font-black text-neutral-900 tracking-tight">
          Mã Mời Độc Quyền Của Bạn
        </h2>
        <p className="text-xs sm:text-sm text-neutral-500 mt-1">
          Gửi mã hoặc chia sẻ liên kết trực tiếp cho bạn bè để nhận voucher 50k
          và tích lũy điểm thưởng.
        </p>
      </div>

      {/* Grid: Mã Mời Box & Link Box */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Box 1: Mã giới thiệu */}
        <div className="bg-rose-50/60 rounded-2xl border-2 border-dashed border-[#800028]/30 p-5 flex flex-col justify-between">
          <div>
            <span className="text-[11px] font-bold text-[#800028] uppercase tracking-wider block mb-2">
              Mã Giới Thiệu Cá Nhân
            </span>
            <div className="flex items-center justify-between gap-3">
              <span className="font-mono text-2xl sm:text-3xl font-black tracking-widest text-[#800028]">
                {referralCode}
              </span>
              <button
                type="button"
                onClick={handleCopyCode}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-[#800028] hover:bg-[#660020] transition-colors shadow-sm shrink-0"
              >
                {copiedCode ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-300" />
                    Đã chép!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    Sao chép mã
                  </>
                )}
              </button>
            </div>
          </div>
          <p className="text-[11px] text-neutral-500 mt-3">
            Bạn bè có thể nhập mã này khi đăng ký hoặc áp dụng trong trang cá nhân.
          </p>
        </div>

        {/* Box 2: Link giới thiệu trực tiếp */}
        <div className="bg-slate-50 rounded-2xl border border-slate-200 p-5 flex flex-col justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block mb-2">
              Liên Kết Giới Thiệu (Tự Điền Mã)
            </span>
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={referralLink}
                className="flex-1 bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-600 font-mono select-all focus:outline-none"
              />
              <button
                type="button"
                onClick={handleCopyLink}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-slate-800 bg-white border border-slate-300 hover:bg-slate-100 transition-colors shadow-2xs shrink-0"
              >
                {copiedLink ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-600" />
                    Đã chép!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    Sao chép link
                  </>
                )}
              </button>
            </div>
          </div>
          <p className="text-[11px] text-neutral-500 mt-3">
            Khi người nhận nhấp vào liên kết, mã mời sẽ được tự động điền sẵn tại trang đăng ký.
          </p>
        </div>
      </div>

      {/* Social Share & QR Code Actions */}
      <div className="pt-2 border-t border-neutral-100 flex flex-wrap items-center justify-between gap-4">
        {/* Nút chia sẻ mạng xã hội */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-bold text-neutral-700 mr-1 flex items-center gap-1.5">
            <Share2 className="w-3.5 h-3.5 text-neutral-500" />
            Chia sẻ nhanh:
          </span>

          <button
            type="button"
            onClick={handleShareFacebook}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-blue-600 text-white hover:bg-blue-700 transition-colors"
          >
            Facebook
          </button>

          <button
            type="button"
            onClick={handleShareZalo}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-sky-500 text-white hover:bg-sky-600 transition-colors"
          >
            <MessageCircle className="w-3.5 h-3.5" />
            Zalo Chat
          </button>

          <button
            type="button"
            onClick={handleShareTelegram}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-sky-600 text-white hover:bg-sky-700 transition-colors"
          >
            <Send className="w-3.5 h-3.5" />
            Telegram
          </button>
        </div>

        {/* Nút bật/tắt QR Code */}
        <button
          type="button"
          onClick={() => setShowQR((prev) => !prev)}
          className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            showQR
              ? "bg-[#800028] text-white"
              : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"
          }`}
        >
          <QrCode className="w-4 h-4" />
          {showQR ? "Ẩn Mã QR Code" : "Hiện Mã QR Code"}
        </button>
      </div>

      {/* Khối Mã QR Code Mở Rộng */}
      {showQR && (
        <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200 text-center animate-in fade-in-0 duration-200">
          <div className="inline-block bg-white p-4 rounded-2xl shadow-md border border-slate-200">
            {qrDataUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={qrDataUrl}
                alt={`Mã QR Giới Thiệu ${referralCode}`}
                className="w-48 h-48 mx-auto"
              />
            ) : (
              <div className="w-48 h-48 flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-[#800028] border-t-transparent rounded-full animate-spin" />
              </div>
            )}
            <p className="mt-2 font-mono text-sm font-bold text-[#800028]">
              {referralCode}
            </p>
          </div>
          <p className="text-xs text-neutral-500 mt-3 max-w-sm mx-auto">
            Quét mã bằng camera điện thoại hoặc Zalo để mở thẳng trang đăng ký nhận ưu đãi.
          </p>

          {qrDataUrl && (
            <a
              href={qrDataUrl}
              download={`QR-Moi-Ban-${referralCode}.png`}
              className="inline-flex items-center gap-1.5 mt-3 px-4 py-1.5 rounded-xl text-xs font-semibold bg-white border border-slate-300 text-slate-700 hover:bg-slate-100 transition-colors shadow-2xs"
            >
              <Download className="w-3.5 h-3.5" />
              Tải ảnh QR về máy
            </a>
          )}
        </div>
      )}
    </div>
  );
};
