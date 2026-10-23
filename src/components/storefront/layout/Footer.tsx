import Link from "next/link";
import {
  ShieldCheck,
  Truck,
  RotateCcw,
  Headphones,
  MapPin,
  Phone,
  Mail,
  Clock,
  QrCode,
  Banknote,
  Send,
  AlertCircle,
} from "lucide-react";
import { NewsletterForm } from "./NewsletterForm";

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

interface FooterProps {
  categories?: Category[];
}

export function Footer({ categories = [] }: FooterProps) {
  return (
    <footer className="bg-gray-900 text-gray-300 pt-12 pb-24 lg:pb-12 border-t border-gray-800">
      {/* ── 1. Value Proposition Banner (4 cam kết vàng) ───────────── */}
      <div className="shop-container pb-12 border-b border-gray-800">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="flex items-start gap-4 p-4 rounded-2xl bg-gray-800/40 border border-gray-800 hover:border-rose-900/60 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-[#800028]/30 border border-[#800028]/50 flex items-center justify-center shrink-0 text-amber-300">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">100% CHÍNH HÃNG</h4>
              <p className="text-xs text-gray-400 mt-1 leading-relaxed">
                Cam kết bồi thường 200% nếu phát hiện hàng giả, hàng kém chất lượng.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-4 rounded-2xl bg-gray-800/40 border border-gray-800 hover:border-rose-900/60 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-[#800028]/30 border border-[#800028]/50 flex items-center justify-center shrink-0 text-amber-300">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">GIAO HÀNG HỎA TỐC</h4>
              <p className="text-xs text-gray-400 mt-1 leading-relaxed">
                Đóng gói tiêu chuẩn, bảo quản nhiệt độ chuẩn cho thực phẩm & trái cây.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-4 rounded-2xl bg-gray-800/40 border border-gray-800 hover:border-rose-900/60 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-[#800028]/30 border border-[#800028]/50 flex items-center justify-center shrink-0 text-amber-300">
              <RotateCcw className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">ĐỔI TRẢ 7 NGÀY</h4>
              <p className="text-xs text-gray-400 mt-1 leading-relaxed">
                Hỗ trợ đổi trả miễn phí và nhanh chóng nếu sản phẩm có lỗi phát sinh.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-4 rounded-2xl bg-gray-800/40 border border-gray-800 hover:border-rose-900/60 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-[#800028]/30 border border-[#800028]/50 flex items-center justify-center shrink-0 text-amber-300">
              <Headphones className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">TƯ VẤN TẬN TÂM</h4>
              <p className="text-xs text-gray-400 mt-1 leading-relaxed">
                Đội ngũ tư vấn am hiểu sản phẩm 24/7 (Tuyệt đối không bán thuốc kê đơn).
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── 2. Main Footer 4 Columns ──────────────────────────────── */}
      <div className="shop-container py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 xl:gap-12">
          {/* Cột 1: Thông tin shop */}
          <div className="space-y-4">
            <div>
              <Link href="/" className="inline-flex items-baseline gap-1 select-none">
                <span className="text-2xl font-black tracking-tight text-white">
                  THUYNGA
                </span>
                <span className="text-xl font-serif italic font-bold text-amber-300">
                  Shop
                </span>
              </Link>
              <p className="text-[11px] font-semibold text-rose-300 uppercase tracking-widest mt-0.5">
                Hàng nhập khẩu chính hãng
              </p>
            </div>

            <p className="text-xs text-gray-400 leading-relaxed">
              THUYNGA Shop chuyên phân phối thực phẩm chức năng, thực phẩm & đồ uống, trái cây tươi, mỹ phẩm và đồ mẹ & bé nhập khẩu chính hãng từ Hàn Quốc, Nhật Bản, Mỹ, Úc.
            </p>

            <div className="space-y-2.5 text-xs text-gray-300 pt-2">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#a0003a] shrink-0 mt-0.5" />
                <span>Số 88 Phố Huế, Hai Bà Trưng, Hà Nội</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#a0003a] shrink-0" />
                <a
                  href="tel:0987654321"
                  className="hover:text-white font-semibold transition-colors"
                >
                  0987.654.321 (Tư vấn & Đặt hàng)
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#a0003a] shrink-0" />
                <a
                  href="mailto:cskh@thuyngashop.com.vn"
                  className="hover:text-white transition-colors"
                >
                  cskh@thuyngashop.com.vn
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-[#a0003a] shrink-0" />
                <span>Mở cửa: 08:00 - 21:30 hàng ngày</span>
              </div>
            </div>

            {/* Social link */}
            <div className="pt-2">
              <a
                href="https://facebook.com/thuyngashop.com.vn"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-blue-950/40 border border-blue-900/60 text-blue-300 text-xs hover:bg-blue-900/50 transition-colors"
              >
                <svg className="w-4 h-4 text-blue-400 fill-current" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
                <span>facebook.com/thuyngashop.com.vn</span>
              </a>
            </div>
          </div>

          {/* Cột 2: Ngành hàng chính */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider relative pb-2 after:absolute after:bottom-0 after:left-0 after:w-8 after:h-0.5 after:bg-[#800028]">
              Ngành hàng chính
            </h3>
            <ul className="space-y-2.5 text-xs text-gray-400">
              <li>
                <Link
                  href="/danh-muc/thuc-pham-chuc-nang"
                  className="hover:text-white transition-colors flex items-center justify-between"
                >
                  <span>Thực phẩm chức năng</span>
                  <span className="text-[10px] text-gray-600">Hàn, Nhật, Mỹ</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/danh-muc/thuc-pham-do-uong-nhap-khau"
                  className="hover:text-white transition-colors flex items-center justify-between"
                >
                  <span>Thực phẩm & Đồ uống</span>
                  <span className="text-[10px] text-gray-600">Bánh kẹo, Hạt, Trà</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/danh-muc/trai-cay-nhap-khau"
                  className="hover:text-white transition-colors flex items-center justify-between"
                >
                  <span>Trái cây nhập khẩu</span>
                  <span className="text-[10px] text-gray-600">Cherry, Nho, Táo</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/danh-muc/my-pham-cham-soc-ca-nhan"
                  className="hover:text-white transition-colors flex items-center justify-between"
                >
                  <span>Mỹ phẩm & Chăm sóc da</span>
                  <span className="text-[10px] text-gray-600">Dược mỹ phẩm</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/danh-muc/me-va-be"
                  className="hover:text-white transition-colors flex items-center justify-between"
                >
                  <span>Mẹ & Bé</span>
                  <span className="text-[10px] text-gray-600">Sữa, Ăn dặm</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/flash-sale"
                  className="text-orange-400 hover:text-orange-300 font-bold transition-colors inline-flex items-center gap-1"
                >
                  <span>🔥 Flash Sale đếm ngược</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Cột 3: Hỗ trợ khách hàng */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider relative pb-2 after:absolute after:bottom-0 after:left-0 after:w-8 after:h-0.5 after:bg-[#800028]">
              Hỗ trợ khách hàng
            </h3>
            <ul className="space-y-2.5 text-xs text-gray-400">
              <li>
                <Link
                  href="/chinh-sach/huong-dan-mua-hang"
                  className="hover:text-white transition-colors"
                >
                  Hướng dẫn mua hàng & Đặt hàng trực tuyến
                </Link>
              </li>
              <li>
                <Link
                  href="/chinh-sach/chinh-sach-giao-hang"
                  className="hover:text-white transition-colors"
                >
                  Chính sách giao hàng & Cước phí vận chuyển
                </Link>
              </li>
              <li>
                <Link
                  href="/chinh-sach/chinh-sach-doi-tra"
                  className="hover:text-white transition-colors"
                >
                  Quy định đổi trả hàng trong 7 ngày
                </Link>
              </li>
              <li>
                <Link
                  href="/chinh-sach/chinh-sach-bao-mat"
                  className="hover:text-white transition-colors"
                >
                  Chính sách bảo mật thông tin cá nhân
                </Link>
              </li>
              <li>
                <Link
                  href="/tra-cuu-don-hang"
                  className="hover:text-white transition-colors font-semibold text-rose-300"
                >
                  Tra cứu tình trạng đơn hàng
                </Link>
              </li>
              <li>
                <Link
                  href="/tin-tuc"
                  className="hover:text-white transition-colors"
                >
                  Góc sức khỏe & Cẩm nang tiêu dùng
                </Link>
              </li>
            </ul>
          </div>

          {/* Cột 4: Thanh toán & Nhận ưu đãi */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider relative pb-2 after:absolute after:bottom-0 after:left-0 after:w-8 after:h-0.5 after:bg-[#800028]">
              Thanh toán tiện lợi
            </h3>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="flex items-center gap-2 p-2 rounded-xl bg-gray-800/80 border border-gray-700">
                <QrCode className="w-5 h-5 text-emerald-400 shrink-0" />
                <div>
                  <div className="font-bold text-white text-[11px]">VietQR</div>
                  <div className="text-[10px] text-gray-400">Chuyển khoản 24/7</div>
                </div>
              </div>
              <div className="flex items-center gap-2 p-2 rounded-xl bg-gray-800/80 border border-gray-700">
                <Banknote className="w-5 h-5 text-amber-400 shrink-0" />
                <div>
                  <div className="font-bold text-white text-[11px]">COD</div>
                  <div className="text-[10px] text-gray-400">Tiền mặt khi nhận</div>
                </div>
              </div>
            </div>

            {/* Form nhận ưu đãi */}
            <div className="pt-2">
              <h4 className="text-xs font-semibold text-white mb-1.5">
                Nhận voucher 50.000₫ cho đơn đầu tiên
              </h4>
              <NewsletterForm />
            </div>

            {/* Cam kết pháp lý quan trọng */}
            <div className="flex items-start gap-2 p-3 rounded-xl bg-amber-950/20 border border-amber-900/40 text-[11px] text-amber-200/90 leading-relaxed">
              <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <span>
                <strong>Tuyên bố:</strong> THUYNGA Shop tuyệt đối KHÔNG kinh doanh thuốc kê đơn. Thực phẩm chức năng không phải là thuốc và không thay thế thuốc chữa bệnh.
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ── 3. Bottom Copyright Bar ──────────────────────────────── */}
      <div className="shop-container pt-8 mt-4 border-t border-gray-800 text-xs text-gray-500 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          © 2026 <strong className="text-gray-300">THUYNGA Shop</strong>. Bản quyền thuộc về THUYNGA Shop – Hàng nhập khẩu chính hãng.
        </div>
        <div className="text-[11px] text-gray-500">
          Phát triển & Vận hành bởi <span className="text-gray-300 font-medium">Trần Văn Cường</span>
        </div>
      </div>
    </footer>
  );
}
