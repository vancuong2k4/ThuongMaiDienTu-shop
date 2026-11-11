"use client";

// ============================================================
// components/storefront/referral/ReferralFAQ.tsx
// Câu Hỏi Thường Gặp Về Chương Trình Mời Bạn Nhận Quà (Stage 12.4)
// ============================================================

import React, { useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";

interface FAQItem {
  question: string;
  answer: string;
}

const FAQS: FAQItem[] = [
  {
    question: "1. Thể lệ chương trình 'Mời Bạn Nhận Quà Đôi' hoạt động như thế nào?",
    answer:
      "Bạn chỉ cần chia sẻ Mã giới thiệu hoặc Liên kết mời bạn cá nhân cho bạn bè hoặc người thân chưa từng có tài khoản tại THUYNGA Shop. Khi người bạn này đăng ký hoặc áp dụng mã mời thành công, họ sẽ nhận ngay 1 Voucher chào mừng 50.000₫. Sau khi người bạn hoàn tất và nhận hàng thành công đơn đầu tiên, hệ thống sẽ tự động cộng ngay +500 Điểm THUYNGA Club vào ví của bạn.",
  },
  {
    question: "2. Khi nào tôi (người giới thiệu) sẽ nhận được 500 điểm thưởng?",
    answer:
      "Điểm thưởng +500 điểm THUYNGA Club (tương đương 50.000₫) sẽ được tự động cộng vào tài khoản của bạn ngay khi đơn hàng đầu tiên của bạn mới chuyển sang trạng thái ĐÃ GIAO HÀNG THÀNH CÔNG (DELIVERED). Bạn sẽ đồng thời nhận được 1 thông báo đẩy trên chuông thông báo thông báo bạn mới đã nhận hàng.",
  },
  {
    question: "3. Voucher 50.000₫ của bạn mới có thời hạn và điều kiện gì?",
    answer:
      "Mã voucher chào mừng (định dạng BANMOI-XXXX) có giá trị giảm trực tiếp 50.000₫ cho đơn hàng đầu tiên có giá trị từ 300.000₫ trở lên. Voucher có hiệu lực sử dụng trong vòng 30 ngày kể từ ngày kích hoạt mã mời.",
  },
  {
    question: "4. Tôi có thể mời tối đa bao nhiêu người bạn?",
    answer:
      "THUYNGA Shop KHÔNG GIỚI HẠN số lượng bạn bè bạn có thể mời! Bạn mời càng nhiều, số điểm tích lũy THUYNGA Club nhận được càng lớn để đổi các voucher giảm giá lên đến 250.000₫ hoặc trừ trực tiếp khi thanh toán đơn hàng.",
  },
  {
    question: "5. Tôi đã có tài khoản từ trước, có thể nhập mã mời của người khác không?",
    answer:
      "Chương trình chỉ áp dụng mã mời cho khách hàng mới chưa từng phát sinh đơn hàng nào trên hệ thống. Khách hàng đã có đơn hàng trước đó không thể áp dụng mã mời của người khác.",
  },
];

export const ReferralFAQ: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  return (
    <div className="bg-white rounded-3xl border border-neutral-200/90 shadow-sm p-6 sm:p-8 space-y-5">
      <div className="flex items-center gap-2.5">
        <div className="w-10 h-10 rounded-2xl bg-rose-50 text-[#800028] flex items-center justify-center shrink-0">
          <HelpCircle className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-lg sm:text-xl font-black text-neutral-900 tracking-tight">
            Câu Hỏi Thường Gặp (FAQ)
          </h2>
          <p className="text-xs sm:text-sm text-neutral-500">
            Giải đáp chi tiết về quyền lợi và cơ chế trả thưởng chương trình
          </p>
        </div>
      </div>

      <div className="divide-y divide-neutral-100">
        {FAQS.map((faq, index) => {
          const isOpen = openIndex === index;
          return (
            <div key={index} className="py-4 first:pt-2 last:pb-0">
              <button
                type="button"
                onClick={() => toggle(index)}
                className="w-full flex items-center justify-between text-left gap-3 group"
              >
                <span
                  className={`text-sm sm:text-base font-bold transition-colors ${
                    isOpen
                      ? "text-[#800028]"
                      : "text-neutral-800 group-hover:text-[#800028]"
                  }`}
                >
                  {faq.question}
                </span>
                <ChevronDown
                  className={`w-5 h-5 text-neutral-400 transition-transform duration-200 shrink-0 ${
                    isOpen ? "rotate-180 text-[#800028]" : ""
                  }`}
                />
              </button>

              {isOpen && (
                <div className="mt-2.5 pr-4 text-xs sm:text-sm text-neutral-600 leading-relaxed animate-in fade-in-0 duration-150">
                  {faq.answer}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
