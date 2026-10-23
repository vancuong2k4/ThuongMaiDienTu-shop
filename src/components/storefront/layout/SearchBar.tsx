"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search, X, TrendingUp } from "lucide-react";

const POPULAR_KEYWORDS = [
  "Hồng sâm Hàn Quốc",
  "Cherry Úc",
  "Collagen Nhật",
  "Sữa Aptamil",
  "Kem chống nắng",
  "Nho mẫu đơn",
];

export function SearchBar() {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);

  // Đóng dropdown khi click ra ngoài
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = (searchTerm: string) => {
    const trimmed = searchTerm.trim();
    if (!trimmed) return;
    setIsOpen(false);
    router.push(`/san-pham?search=${encodeURIComponent(trimmed)}`);
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch(query);
  };

  return (
    <div ref={containerRef} className="relative w-full max-w-xl">
      <form onSubmit={onSubmit} className="relative flex items-center">
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          placeholder="Tìm thực phẩm chức năng, trái cây, mỹ phẩm nhập khẩu..."
          className="w-full h-11 pl-4 pr-24 rounded-full bg-white text-gray-900 placeholder-gray-400 text-sm border-2 border-transparent focus:border-amber-400 focus:outline-none shadow-inner transition-all duration-200"
        />

        {query && (
          <button
            type="button"
            onClick={() => setQuery("")}
            className="absolute right-12 p-1 text-gray-400 hover:text-gray-600 rounded-full transition-colors"
            aria-label="Xóa từ khóa"
          >
            <X className="w-4 h-4" />
          </button>
        )}

        <button
          type="submit"
          className="absolute right-1 w-9 h-9 bg-[#800028] hover:bg-[#5c001e] text-white rounded-full flex items-center justify-center transition-transform active:scale-95 shadow-sm"
          aria-label="Tìm kiếm"
        >
          <Search className="w-4 h-4" />
        </button>
      </form>

      {/* Dropdown gợi ý tìm kiếm */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-50 animate-in fade-in-0 zoom-in-95 duration-150">
          <div className="p-4">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2.5">
              <TrendingUp className="w-3.5 h-3.5 text-[#800028]" />
              <span>Tìm kiếm phổ biến</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {POPULAR_KEYWORDS.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => {
                    setQuery(item);
                    handleSearch(item);
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 hover:bg-[#fff0f3] text-gray-700 hover:text-[#800028] text-xs font-medium rounded-full border border-gray-100 hover:border-[#ffe0e8] transition-colors"
                >
                  <Search className="w-3 h-3 text-gray-400" />
                  {item}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-gray-50/70 px-4 py-2 text-right border-t border-gray-100">
            <span className="text-[11px] text-gray-400">
              Cam kết 100% hàng nhập khẩu chính hãng
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
