import Link from "next/link";
import {
  Phone,
  ShieldCheck,
  Truck,
  RotateCcw,
  Flame,
  ChevronDown,
  PackageSearch,
  BookOpen,
  LayoutGrid,
  Plane,
  ShieldPlus,
  Coffee,
  Apple,
  Droplet,
  Baby,
} from "lucide-react";
import { SearchBar } from "./SearchBar";
import { CartButton } from "./CartButton";
import { UserAccountMenu } from "./UserAccountMenu";
import { MobileNav } from "./MobileNav";

// Helper lấy tên hiển thị ngắn gọn, cân đối cho thanh menu ngang trên Desktop
function getCategoryShortName(slug: string, fullName: string) {
  if (slug.includes("thuc-pham-chuc-nang")) return "TPCN & Sức khỏe";
  if (slug.includes("thuc-pham-do-uong")) return "Thực phẩm & Đồ uống";
  if (slug.includes("trai-cay")) return "Trái cây tươi bay";
  if (slug.includes("my-pham")) return "Mỹ phẩm làm đẹp";
  if (slug.includes("me-va-be")) return "Mẹ & Bé";
  return fullName;
}

// Helper lấy icon đại diện cho ngành hàng
function getCategoryIcon(slug: string) {
  if (slug.includes("thuc-pham-chuc-nang")) return ShieldPlus;
  if (slug.includes("thuc-pham-do-uong")) return Coffee;
  if (slug.includes("trai-cay")) return Apple;
  if (slug.includes("my-pham")) return Droplet;
  if (slug.includes("me-va-be")) return Baby;
  return LayoutGrid;
}

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
      <nav className="bg-white border-b border-gray-200/80 hidden lg:block shadow-[0_2px_10px_rgba(0,0,0,0.03)]">
        <div className="shop-container">
          <div className="flex items-center gap-1.5 xl:gap-2.5 py-1.5">
            {/* 1. Mega Menu Button (TẤT CẢ DANH MỤC) – Khối cố định sang trọng bên trái */}
            <div className="relative group shrink-0">
              <button
                type="button"
                className="flex items-center justify-between gap-1.5 w-44 xl:w-52 px-3 xl:px-4 py-2.5 bg-gradient-to-r from-[#800028] to-[#9e0032] hover:from-[#5c001e] hover:to-[#800028] text-white font-bold text-xs xl:text-sm rounded-xl shadow-xs transition-all cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <LayoutGrid className="w-4 h-4 text-amber-300" />
                  <span className="tracking-wide uppercase font-black">TẤT CẢ DANH MỤC</span>
                </div>
                <ChevronDown className="w-4 h-4 text-white/80 transition-transform duration-200 group-hover:rotate-180" />
              </button>

              {/* Mega Menu Dropdown Content */}
              <div className="absolute top-full left-0 w-72 pt-1.5 hidden group-hover:block z-50">
                <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 py-2.5 overflow-hidden">
                  <div className="px-4 py-1.5 text-[11px] font-bold text-gray-400 uppercase tracking-wider border-b border-gray-100 mb-1 flex items-center justify-between">
                    <span>5 Ngành hàng nhập khẩu</span>
                    <span className="text-[10px] text-[#800028] font-bold">Chính hãng</span>
                  </div>
                  {categories.map((cat) => {
                    const Icon = getCategoryIcon(cat.slug);
                    return (
                      <div key={cat.id} className="relative group/sub">
                        <Link
                          href={`/danh-muc/${cat.slug}`}
                          className="flex items-center justify-between px-4 py-2.5 text-xs xl:text-sm font-semibold text-gray-800 hover:text-[#800028] hover:bg-rose-50/70 transition-colors"
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <div className="w-7 h-7 rounded-lg bg-rose-50 text-[#800028] flex items-center justify-center shrink-0">
                              <Icon className="w-3.5 h-3.5" />
                            </div>
                            <span className="truncate">{cat.name}</span>
                          </div>
                          {cat.children && cat.children.length > 0 && (
                            <ChevronDown className="w-3.5 h-3.5 -rotate-90 text-gray-400 group-hover/sub:text-[#800028] shrink-0" />
                          )}
                        </Link>

                        {/* Subcategories Flyout Menu */}
                        {cat.children && cat.children.length > 0 && (
                          <div className="absolute top-0 left-full w-64 pt-0 hidden group-hover/sub:block z-50 pl-1.5">
                            <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 p-3">
                              <div className="px-2 py-1 text-xs font-bold text-[#800028] uppercase border-b border-gray-100 mb-2 flex items-center gap-1.5">
                                <Icon className="w-3.5 h-3.5 text-[#800028]" />
                                <span>{cat.name}</span>
                              </div>
                              <div className="space-y-0.5">
                                {cat.children.map((sub) => (
                                  <Link
                                    key={sub.id}
                                    href={`/danh-muc/${sub.slug}`}
                                    className="block px-2.5 py-1.5 text-xs font-medium text-gray-700 hover:text-[#800028] hover:bg-rose-50/60 rounded-lg transition-colors"
                                  >
                                    {sub.name}
                                  </Link>
                                ))}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* 2. Primary Horizontal Category Links (Tiếp nối liền mạch ngay sau nút Danh mục) */}
            <div className="flex items-center gap-0.5 xl:gap-1 text-xs xl:text-sm font-semibold text-gray-700">
              {categories.slice(0, 5).map((cat) => {
                const Icon = getCategoryIcon(cat.slug);
                const displayName = getCategoryShortName(cat.slug, cat.name);
                return (
                  <div key={cat.id} className="relative group/nav">
                    <Link
                      href={`/danh-muc/${cat.slug}`}
                      className="flex items-center gap-1.5 px-2 xl:px-2.5 py-2 rounded-xl text-gray-700 hover:text-[#800028] hover:bg-rose-50/70 transition-all whitespace-nowrap"
                    >
                      <Icon className="w-3.5 h-3.5 text-gray-400 group-hover/nav:text-[#800028] transition-colors shrink-0" />
                      <span>{displayName}</span>
                      {cat.children && cat.children.length > 0 && (
                        <ChevronDown className="w-3 h-3 text-gray-400 group-hover/nav:text-[#800028] transition-transform duration-200 group-hover/nav:rotate-180 shrink-0" />
                      )}
                    </Link>

                    {/* Dropdown for specific category */}
                    {cat.children && cat.children.length > 0 && (
                      <div className="absolute top-full left-0 w-64 pt-1.5 hidden group-hover/nav:block z-50">
                        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-2.5">
                          <div className="px-2.5 py-1 text-xs font-bold text-[#800028] border-b border-gray-100 mb-1 flex items-center gap-1.5">
                            <Icon className="w-3.5 h-3.5" />
                            <span>{cat.name}</span>
                          </div>
                          {cat.children.map((sub) => (
                            <Link
                              key={sub.id}
                              href={`/danh-muc/${sub.slug}`}
                              className="block px-2.5 py-1.5 text-xs font-medium text-gray-700 hover:text-[#800028] hover:bg-rose-50/60 rounded-lg transition-colors"
                            >
                              {sub.name}
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* 3. Utility Promotion Badges (Căn sát góc phải bằng ml-auto, cân xứng với Giỏ hàng) */}
            <div className="flex items-center gap-2 ml-auto shrink-0">
              {/* Flash Sale link */}
              <Link
                href="/flash-sale"
                className="flex items-center gap-1.5 px-3.5 py-1.5 bg-gradient-to-r from-amber-500 via-orange-500 to-red-600 hover:from-amber-600 hover:to-red-700 text-white font-black text-xs rounded-full shadow-xs hover:shadow-md hover:scale-105 transition-all whitespace-nowrap tracking-wide"
              >
                <Flame className="w-3.5 h-3.5 fill-current animate-pulse text-amber-200" />
                <span>FLASH SALE</span>
              </Link>

              {/* Blog Cẩm Nang Sức Khỏe (Hiện trên màn hình siêu rộng 2XL) */}
              <Link
                href="/tin-tuc"
                className="hidden 2xl:flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold text-gray-600 hover:text-[#800028] hover:bg-rose-50/60 rounded-xl transition-colors whitespace-nowrap"
              >
                <BookOpen className="w-3.5 h-3.5 text-gray-400" />
                <span>Góc sức khỏe</span>
              </Link>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}
