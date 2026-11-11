"use client";

// ============================================================
// components/storefront/transparency/TransparencySearchBar.tsx
// Thanh Tra Cứu Mã Lô Hàng Bay Air & Gợi Ý 1-Chạm (Phase 15)
// ============================================================

import React, { useState } from "react";
import { Search, Sparkles, X, ShieldCheck } from "lucide-react";

interface TransparencySearchBarProps {
  onSearch: (code: string) => void;
  loading: boolean;
  initialCode?: string;
}

export const TransparencySearchBar: React.FC<TransparencySearchBarProps> = ({
  onSearch,
  loading,
  initialCode = "",
}) => {
  const [inputVal, setInputVal] = useState(initialCode);

  const sampleCodes = [
    { code: "APT-2026-SYD01", name: "Aptamil Profutura Úc" },
    { code: "MNK-2026-MEL02", name: "Mật ong Manuka Úc" },
    { code: "SWI-2026-SYD03", name: "Swisse Collagen Úc" },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputVal.trim()) {
      onSearch(inputVal.trim());
    }
  };

  const handleSelectSample = (code: string) => {
    setInputVal(code);
    onSearch(code);
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative flex items-center bg-white rounded-2xl p-2 sm:p-2.5 shadow-xl shadow-slate-200/50 border-2 border-slate-200 focus-within:border-[#800028] transition-all">
          <div className="pl-3 pr-2 text-slate-400">
            <Search className="w-5 h-5 text-slate-400" />
          </div>

          <input
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            placeholder="Nhập mã lô in dưới đáy lon hoặc thân chai (VD: APT-2026-SYD01)..."
            className="flex-1 bg-transparent px-2 py-2 text-sm sm:text-base font-mono text-slate-800 placeholder-slate-400 focus:outline-none uppercase"
          />

          {inputVal && (
            <button
              type="button"
              onClick={() => setInputVal("")}
              className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 mr-2 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}

          <button
            type="submit"
            disabled={loading || !inputVal.trim()}
            className="flex items-center gap-2 px-5 sm:px-7 py-3 bg-[#800028] hover:bg-[#660020] text-white text-xs sm:text-sm font-bold rounded-xl shadow-md hover:shadow-lg transition-all disabled:opacity-50 disabled:pointer-events-none"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Đang tra cứu...</span>
              </>
            ) : (
              <>
                <ShieldCheck className="w-4 h-4" />
                <span>Tra Cứu Vận Đơn</span>
              </>
            )}
          </button>
        </div>
      </form>

      {/* Gợi ý mã lô mẫu 1-chạm */}
      <div className="flex items-center flex-wrap gap-2 mt-3.5 px-2">
        <span className="text-xs font-semibold text-slate-500">Mã lô mẫu:</span>
        {sampleCodes.map((s) => (
          <button
            key={s.code}
            type="button"
            onClick={() => handleSelectSample(s.code)}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-medium bg-slate-100 hover:bg-rose-50 hover:text-[#800028] hover:border-[#800028]/30 border border-slate-200 text-slate-700 transition-all"
          >
            <span className="font-bold">{s.code}</span>
            <span className="text-[11px] text-slate-400">({s.name})</span>
          </button>
        ))}
      </div>
    </div>
  );
};
