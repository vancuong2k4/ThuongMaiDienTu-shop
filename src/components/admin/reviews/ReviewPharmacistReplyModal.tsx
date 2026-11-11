// ============================================================
// components/admin/reviews/ReviewPharmacistReplyModal.tsx
// Modal Dược sĩ THUYNGA Shop Phản Hồi Đánh Giá Khách Hàng (Phase 14)
// ============================================================

"use client";

import React, { useState, useEffect } from "react";
import { MessageSquare, Send, X, ShieldCheck } from "lucide-react";
import type { ReviewListItem } from "./types";

interface ReviewPharmacistReplyModalProps {
  review: ReviewListItem | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (reviewId: string, replyText: string) => Promise<void>;
}

export const ReviewPharmacistReplyModal: React.FC<ReviewPharmacistReplyModalProps> = ({
  review,
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [replyText, setReplyText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (review) {
      setReplyText(review.adminReply || "");
    }
  }, [review]);

  if (!isOpen || !review) return null;

  const quickTemplates = [
    "THUYNGA Shop chân thành cảm ơn quý khách đã tin tưởng lựa chọn hàng bay Air-cargo chính hãng Úc của shop ạ!",
    "Dạ 100% sữa Aptamil và TPCN Úc tại shop đều được bảo quản mát tiêu chuẩn để giữ trọn vẹn chất lượng tốt nhất ạ ❤️",
    "Shop đã ghi nhận phản hồi của quý khách và sẽ tiếp tục nâng cấp dịch vụ đóng gói ngày càng hoàn thiện hơn nữa!",
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim()) return;

    setIsSubmitting(true);
    try {
      await onSubmit(review.id, replyText.trim());
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-lg bg-white rounded-3xl p-6 shadow-2xl space-y-5 animate-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-rose-50 text-[#800028] flex items-center justify-center">
              <MessageSquare className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-slate-900">
                Phản Hồi Từ Dược Sĩ THUYNGA Shop
              </h3>
              <p className="text-xs text-slate-500">
                Phản hồi chính thức sẽ hiển thị công khai dưới bài đánh giá
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-600"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Thông tin review gốc tóm tắt */}
        <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-1.5 text-xs">
          <div className="flex items-center justify-between">
            <span className="font-bold text-slate-800">
              {review.user.name || "Khách hàng"}
            </span>
            <span className="font-bold text-amber-600">
              {"★".repeat(review.rating)}
            </span>
          </div>
          <p className="text-slate-600 italic line-clamp-2">
            &ldquo;{review.content}&rdquo;
          </p>
        </div>

        {/* Mẫu phản hồi nhanh */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
            Gợi ý mẫu câu nhanh:
          </label>
          <div className="flex flex-col gap-1.5">
            {quickTemplates.map((tmpl, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setReplyText(tmpl)}
                className="text-left text-xs p-2 rounded-xl bg-slate-50 hover:bg-rose-50 hover:text-[#800028] border border-slate-200/60 transition-colors truncate"
              >
                {tmpl}
              </button>
            ))}
          </div>
        </div>

        {/* Form nhập */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <textarea
              rows={4}
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder="Nhập nội dung phản hồi từ Dược sĩ tư vấn..."
              className="w-full p-3 text-xs rounded-2xl border border-slate-200 focus:outline-none focus:border-[#800028] focus:ring-1 focus:ring-[#800028] resize-none"
            />
            <div className="text-[11px] text-slate-400 text-right mt-1">
              {replyText.length}/1000 ký tự
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors"
            >
              Hủy bỏ
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !replyText.trim()}
              className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl text-xs font-bold bg-[#800028] text-white hover:bg-[#660020] transition-colors disabled:opacity-50 shadow-md shadow-[#800028]/20"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{isSubmitting ? "Đang gửi..." : "Gửi phản hồi công khai"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
