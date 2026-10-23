import Link from "next/link";
import {
  Phone,
  Clock,
  ShieldCheck,
  Truck,
  RotateCcw,
  Flame,
  ChevronDown,
  Search,
  PackageSearch,
  BookOpen,
} from "lucide-react";
import { SearchBar } from "./SearchBar";
import { CartButton } from "./CartButton";
import { UserAccountMenu } from "./UserAccountMenu";
import { MobileNav } from "./MobileNav";

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

interface HeaderProps {
  categories: Category[];
}

export function Header({ categories }: HeaderProps) {
  return (
    <header className="w-full sticky top-0 z-40 bg-white shadow-sm">
      {/* ── 1. Top Announcement Bar ──────────────────────────────── */}
      <div className="bg-[#5c001e] text-white text-[12px] py-1.5 border-b border-white/10 hidden md:block">
        <div className="shop-container flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-1.5 text-rose-100 font-medium">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-300" />
              <span>100% Hàng nhập khẩu chính hãng (Không bán thuốc kê đơn)</span>
            </div>
            <div className="flex items-center gap-1.5 text-rose-100 font-medium">
              <Truck className="w-3.5 h-3.5 text-amber-300" />
              <span>Miễn phí vận chuyển từ 500.000₫</span>
            </div>
            <div className="flex items-center gap-1.5 text-rose-100 font-medium">
              <RotateCcw className="w-3.5 h-3.5 text-amber-300" />
              <span>Đổi trả linh hoạt trong 7 ngày</span>
            </div>
          </div>

          <div className="flex items-center gap-5">
            <a
              href="https://facebook.com/thuyngashop.com.vn"
              target="_blank"
              rel="noopener noreferrer"
              className="text-rose-100 hover:text-white transition-colors"
            >
              Fanpage: fb.com/thuyngashop.com.vn
            </a>
            <span className="text-white/20">|</span>
            <Link
              href="/tra-cuu-don-hang"
              className="flex items-center gap-1 text-rose-100 hover:text-white transition-colors"
            >
              <PackageSearch className="w-3.5 h-3.5" />
              <span>Tra cứu đơn hàng</span>
            </Link>
          </div>
        </div>
      </div>

      {/* ── 2. Main Header ───────────────────────────────────────── */}
      <div className="brand-gradient text-white">
        <div className="shop-container py-2.5 sm:py-3.5">
          <div className="flex items-center justify-between gap-3 md:gap-8">
            {/* Mobile hamburger menu */}
            <MobileNav categories={categories} />

            {/* Logo Shop */}
            <Link href="/" className="flex flex-col group select-none">
              <div className="flex items-baseline gap-1">
                <span className="text-2xl sm:text-3xl font-black tracking-tight text-white group-hover:opacity-95 transition-opacity">
                  THUYNGA
                </span>
                <span className="text-xl sm:text-2xl font-serif italic font-bold text-amber-300">
                  Shop
                </span>
              </div>
              <span className="text-[9px] sm:text-[10px] font-semibold text-rose-100/90 tracking-widest uppercase -mt-1 hidden sm:block">
                Hàng nhập khẩu chính hãng
              </span>
            </Link>

            {/* Desktop Smart Search Bar */}
            <div className="hidden md:flex flex-1 justify-center px-4">
              <SearchBar />
            </div>

            {/* Header Right Action Icons */}
            <div className="flex items-center gap-1 sm:gap-2">
              {/* Hotline nhanh trên Desktop */}
              <a
                href="tel:0987654321"
                className="hidden xl:flex items-center gap-2.5 px-3 py-1.5 rounded-xl hover:bg-white/10 text-white transition-colors"
              >
                <div className="w-10 h-10 rounded-full bg-white/15 flex items-center justify-center text-amber-300">
                  <Phone className="w-5 h-5" />
                </div>
                <div className="flex flex-col text-left">
                  <span className="text-[10px] text-rose-100/80 font-medium uppercase tracking-wider">
                    Hotline 24/7
                  </span>
                  <span className="text-sm font-bold text-white tracking-tight">
                    0987.654.321
                  </span>
                </div>
              </a>

              {/* User Account Menu */}
              <UserAccountMenu />

              {/* Cart Button */}
              <CartButton />
            </div>
          </div>

          {/* Search bar trên Mobile (hiển thị ngay bên dưới logo trên màn hình nhỏ) */}
          <div className="mt-2.5 md:hidden">
            <SearchBar />
          </div>
        </div>
      </div>

      {/* ── 3. Category Navigation Bar (Desktop Mega Menu) ────────── */}
      <nav className="bg-white border-b border-gray-100 hidden lg:block shadow-[0_2px_8px_rgba(0,0,0,0.03)]">
        <div className="shop-container">
          <div className="flex items-center justify-between">
            {/* Mega Menu Dropdown Trigger */}
            <div className="relative group">
              <div className="flex items-center gap-2.5 px-5 py-3 bg-[#800028] text-white font-bold text-sm rounded-t-lg cursor-pointer hover:bg-[#5c001e] transition-colors">
                <span className="w-4 h-0.5 bg-white relative before:absolute before:-top-1.5 before:w-4 before:h-0.5 before:bg-white after:absolute after:top-1.5 after:w-4 after:h-0.5 after:bg-white" />
                <span>TẤT CẢ DANH MỤC</span>
                <ChevronDown className="w-4 h-4 ml-1 transition-transform group-hover:rotate-180" />
              </div>

              {/* Mega Menu Dropdown Content */}
              <div className="absolute top-full left-0 w-72 bg-white rounded-b-2xl shadow-2xl border border-gray-100 py-2 hidden group-hover:block z-50">
                {categories.map((cat) => (
                  <div key={cat.id} className="relative group/sub">
                    <Link
                      href={`/danh-muc/${cat.slug}`}
                      className="flex items-center justify-between px-4 py-2.5 text-sm font-semibold text-gray-800 hover:text-[#800028] hover:bg-rose-50/60 transition-colors"
                    >
                      <span>{cat.name}</span>
                      {cat.children && cat.children.length > 0 && (
                        <ChevronDown className="w-4 h-4 -rotate-90 text-gray-400 group-hover/sub:text-[#800028]" />
                      )}
                    </Link>

                    {/* Subcategories Flyout Menu */}
                    {cat.children && cat.children.length > 0 && (
                      <div className="absolute top-0 left-full w-64 bg-white rounded-2xl shadow-2xl border border-gray-100 py-2 hidden group-hover/sub:block z-50 ml-1">
                        <div className="px-4 py-1.5 text-xs font-bold text-[#800028] uppercase border-b border-gray-100 mb-1">
                          {cat.name}
                        </div>
                        {cat.children.map((sub) => (
                          <Link
                            key={sub.id}
                            href={`/danh-muc/${sub.slug}`}
                            className="block px-4 py-2 text-xs font-medium text-gray-700 hover:text-[#800028] hover:bg-rose-50/60 transition-colors"
                          >
                            {sub.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Horizontal Nav Links */}
            <div className="flex items-center gap-1 xl:gap-2 text-sm font-medium text-gray-700">
              {categories.slice(0, 5).map((cat) => (
                <div key={cat.id} className="relative group/nav py-3 px-2 xl:px-3">
                  <Link
                    href={`/danh-muc/${cat.slug}`}
                    className="flex items-center gap-1 hover:text-[#800028] transition-colors whitespace-nowrap font-semibold"
                  >
                    <span>{cat.name}</span>
                    {cat.children && cat.children.length > 0 && (
                      <ChevronDown className="w-3.5 h-3.5 text-gray-400 group-hover/nav:text-[#800028] transition-transform group-hover/nav:rotate-180" />
                    )}
                  </Link>

                  {/* Dropdown for specific category */}
                  {cat.children && cat.children.length > 0 && (
                    <div className="absolute top-full left-0 w-64 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 hidden group-hover/nav:block z-50">
                      {cat.children.map((sub) => (
                        <Link
                          key={sub.id}
                          href={`/danh-muc/${sub.slug}`}
                          className="block px-4 py-2 text-xs font-medium text-gray-700 hover:text-[#800028] hover:bg-rose-50/60 transition-colors"
                        >
                          {sub.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              {/* Flash Sale link */}
              <Link
                href="/flash-sale"
                className="flex items-center gap-1.5 px-3 py-1.5 bg-orange-50 hover:bg-orange-100 text-orange-700 font-extrabold rounded-full transition-colors whitespace-nowrap ml-2"
              >
                <Flame className="w-4 h-4 text-orange-600 animate-bounce" />
                <span>FLASH SALE</span>
              </Link>

              {/* Blog Link */}
              <Link
                href="/tin-tuc"
                className="flex items-center gap-1 px-3 py-3 hover:text-[#800028] transition-colors whitespace-nowrap"
              >
                <BookOpen className="w-4 h-4 text-gray-400" />
                <span>Góc sức khỏe</span>
              </Link>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}
