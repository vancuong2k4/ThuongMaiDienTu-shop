"use client";

import { useState } from "react";
import { Send, CheckCircle2 } from "lucide-react";

export function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return (
      <div className="flex items-center gap-2 p-2.5 rounded-xl bg-emerald-950/40 border border-emerald-800 text-xs text-emerald-300">
        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
        <span>Cảm ơn bạn! Mã voucher 50K sẽ được gửi vào email sớm nhất.</span>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex items-center">
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Nhập email của bạn..."
        className="w-full h-9 px-3 rounded-l-xl bg-gray-800 border border-gray-700 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#800028]"
      />
      <button
        type="submit"
        className="h-9 px-3.5 bg-[#800028] hover:bg-[#5c001e] text-white rounded-r-xl text-xs font-bold transition-colors flex items-center justify-center shrink-0"
        aria-label="Đăng ký nhận tin"
      >
        <Send className="w-3.5 h-3.5" />
      </button>
    </form>
  );
}
