"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Menu,
  X,
  ChevronDown,
  Flame,
  PhoneCall,
  MapPin,
  Clock,
  Package,
  Search,
  Tag,
  BookOpen,
  FileText,
  ShieldCheck,
  ChevronRight,
} from "lucide-react";

interface SubCategory {
  id: string;
  name: string;
  slug: string;
}

interface Category {
  id: string;
  name: string;
  slug: string;
  children: SubCategory[];
}

interface MobileNavProps {
  categories: Category[];
}

export function MobileNav({ categories }: MobileNavProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [expandedCat, setExpandedCat] = useState<string | null>(null);

  // Khóa scroll body khi mở menu
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const toggleExpand = (catId: string) => {
    setExpandedCat(expandedCat === catId ? null : catId);
  };

  const closeMenu = () => {
    setIsOpen(false);
    setExpandedCat(null);
  };

  return (
    <>
      {/* Nút bấm mở menu trên Mobile Header */}
      <button
        onClick={() => setIsOpen(true)}
        className="p-2 -ml-2 text-white hover:bg-white/10 rounded-xl transition-colors lg:hidden"
        aria-label="Mở danh mục menu"
      >
        <Menu className="w-6 h-6" />
      </button>

      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 lg:hidden transition-opacity"
          onClick={closeMenu}
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed top-0 bottom-0 left-0 w-[85%] max-w-sm bg-white z-50 shadow-2xl flex flex-col transform transition-transform duration-300 ease-out lg:hidden ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Drawer Header */}
        <div className="flex items-center justify-between p-4 bg-gradient-to-r from-[#800028] to-[#5c001e] text-white">
          <div>
            <div className="font-extrabold text-lg tracking-tight text-white flex items-center gap-1.5">
              <span>THUYNGA</span>
              <span className="text-amber-300 font-serif italic text-base">Shop</span>
            </div>
            <p className="text-[11px] text-rose-100/90 font-medium tracking-wide">
              HÀNG NHẬP KHẨU CHÍNH HÃNG
            </p>
          </div>
          <button
            onClick={closeMenu}
            className="p-2 text-white/80 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
            aria-label="Đóng menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Search */}
        <div className="p-3 bg-gray-50 border-b border-gray-100">
          <Link
            href="/san-pham"
            onClick={closeMenu}
            className="flex items-center gap-2.5 px-3 py-2.5 bg-white border border-gray-200 rounded-xl text-sm text-gray-500 shadow-sm"
          >
            <Search className="w-4 h-4 text-gray-400" />
            <span>Tìm kiếm sản phẩm...</span>
          </Link>
        </div>

        {/* Scrollable Navigation List */}
        <div className="flex-1 overflow-y-auto divide-y divide-gray-100 text-sm">
          {/* Featured highlights */}
          <div className="py-2 px-3 space-y-1">
            <Link
              href="/flash-sale"
              onClick={closeMenu}
              className="flex items-center justify-between px-3 py-2.5 rounded-xl bg-orange-50 text-orange-700 font-bold hover:bg-orange-100 transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <Flame className="w-4 h-4 text-orange-600 animate-bounce" />
                <span>Flash Sale Giá Sốc</span>
              </div>
              <span className="text-[10px] bg-red-600 text-white px-1.5 py-0.5 rounded font-extrabold uppercase">
                Hot
              </span>
            </Link>

            <Link
              href="/san-pham?sort=newest"
              onClick={closeMenu}
              className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-gray-700 hover:bg-gray-50 font-medium"
            >
              <Package className="w-4 h-4 text-[#800028]" />
              <span>Hàng mới về</span>
            </Link>

            <Link
              href="/san-pham?filter=promotion"
              onClick={closeMenu}
              className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-gray-700 hover:bg-gray-50 font-medium"
            >
              <Tag className="w-4 h-4 text-rose-500" />
              <span>Khuyến mãi đặc biệt</span>
            </Link>
          </div>

          {/* 5 Main Categories & Subcategories */}
          <div className="py-2">
            <div className="px-4 py-1.5 text-xs font-bold text-gray-400 uppercase tracking-wider">
              Danh mục sản phẩm
            </div>

            {categories.map((cat) => {
              const isExpanded = expandedCat === cat.id;
              const hasChildren = cat.children && cat.children.length > 0;

              return (
                <div key={cat.id} className="border-b border-gray-50 last:border-none">
                  <div className="flex items-center justify-between px-4 py-3 hover:bg-gray-50">
                    <Link
                      href={`/danh-muc/${cat.slug}`}
                      onClick={closeMenu}
                      className="flex-1 font-semibold text-gray-900 hover:text-[#800028] transition-colors"
                    >
                      {cat.name}
                    </Link>

                    {hasChildren && (
                      <button
                        onClick={() => toggleExpand(cat.id)}
                        className="p-1.5 text-gray-400 hover:text-[#800028] transition-colors"
                        aria-label={`Mở danh mục con của ${cat.name}`}
                      >
                        <ChevronDown
                          className={`w-4 h-4 transition-transform duration-200 ${
                            isExpanded ? "rotate-180 text-[#800028]" : ""
                          }`}
                        />
                      </button>
                    )}
                  </div>

                  {/* Subcategories (Accordion) */}
                  {hasChildren && isExpanded && (
                    <div className="bg-gray-50/80 px-4 py-2 space-y-1 animate-in fade-in-0 duration-150">
                      {cat.children.map((sub) => (
                        <Link
                          key={sub.id}
                          href={`/danh-muc/${sub.slug}`}
                          onClick={closeMenu}
                          className="flex items-center justify-between py-2 px-3 text-xs font-medium text-gray-600 hover:text-[#800028] hover:bg-white rounded-lg transition-colors"
                        >
                          <span>{sub.name}</span>
                          <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Useful Links */}
          <div className="py-2 px-3 space-y-1">
            <div className="px-3 py-1.5 text-xs font-bold text-gray-400 uppercase tracking-wider">
              Thông tin & Hỗ trợ
            </div>

            <Link
              href="/tin-tuc"
              onClick={closeMenu}
              className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50 rounded-lg"
            >
              <BookOpen className="w-4 h-4 text-gray-400" />
              <span>Góc sức khỏe & Cẩm nang</span>
            </Link>

            <Link
              href="/chinh-sach/chinh-sach-doi-tra"
              onClick={closeMenu}
              className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50 rounded-lg"
            >
              <ShieldCheck className="w-4 h-4 text-gray-400" />
              <span>Chính sách đổi trả 7 ngày</span>
            </Link>

            <Link
              href="/chinh-sach/chinh-sach-giao-hang"
              onClick={closeMenu}
              className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50 rounded-lg"
            >
              <FileText className="w-4 h-4 text-gray-400" />
              <span>Chính sách giao hàng toàn quốc</span>
            </Link>
          </div>
        </div>

        {/* Drawer Footer Contact Info */}
        <div className="p-4 bg-gray-50 border-t border-gray-200 text-xs text-gray-600 space-y-2">
          <div className="flex items-start gap-2">
            <MapPin className="w-4 h-4 text-[#800028] shrink-0 mt-0.5" />
            <span>Số 88 Phố Huế, Hai Bà Trưng, Hà Nội</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-[#800028] shrink-0" />
            <span>08:00 - 21:30 hàng ngày</span>
          </div>

          <a
            href="tel:0987654321"
            className="mt-2 flex items-center justify-center gap-2 w-full py-2.5 bg-[#800028] text-white rounded-xl font-bold hover:bg-[#5c001e] transition-colors shadow-sm"
          >
            <PhoneCall className="w-4 h-4" />
            <span>Gọi hotline: 0987.654.321</span>
          </a>
        </div>
      </div>
    </>
  );
}
