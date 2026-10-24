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
  AlertCircle,
  ChevronRight,
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
    <footer className="bg-[#0e1015] text-zinc-400 pt-12 pb-24 lg:pb-10 border-t border-zinc-800/80 text-xs">
      {/* ── 1. Value Proposition Banner (4 cam kết vàng) ───────────── */}
      <div className="shop-container pb-10 border-b border-zinc-800/80">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 hover:border-zinc-700 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-zinc-800/80 border border-zinc-700/60 flex items-center justify-center shrink-0 text-amber-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-white text-xs uppercase tracking-wider">
                100% Chính Hãng
              </h4>
              <p className="text-[11px] text-zinc-400 mt-1 leading-relaxed">
                Nhập khẩu chính ngạch, bồi hoàn 200% nếu phát hiện hàng giả.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 hover:border-zinc-700 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-zinc-800/80 border border-zinc-700/60 flex items-center justify-center shrink-0 text-amber-400">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-white text-xs uppercase tracking-wider">
                Giao Hàng Hỏa Tốc
              </h4>
              <p className="text-[11px] text-zinc-400 mt-1 leading-relaxed">
                Đóng gói tiêu chuẩn, bảo quản chuẩn nhiệt độ Air Cargo.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 hover:border-zinc-700 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-zinc-800/80 border border-zinc-700/60 flex items-center justify-center shrink-0 text-amber-400">
              <RotateCcw className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-white text-xs uppercase tracking-wider">
                Đổi Trả 7 Ngày
              </h4>
              <p className="text-[11px] text-zinc-400 mt-1 leading-relaxed">
                Đổi mới miễn phí nếu phát sinh lỗi bao bì hoặc cận date.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 hover:border-zinc-700 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-zinc-800/80 border border-zinc-700/60 flex items-center justify-center shrink-0 text-amber-400">
              <Headphones className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-white text-xs uppercase tracking-wider">
                Tư Vấn Tận Tâm
              </h4>
              <p className="text-[11px] text-zinc-400 mt-1 leading-relaxed">
                Đội ngũ am hiểu sản phẩm 24/7 (Không bán thuốc kê đơn).
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── 2. Main Footer 4 Columns ──────────────────────────────── */}
      <div className="shop-container py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 xl:gap-10">
          {/* Cột 1: Thông tin thương hiệu */}
          <div className="space-y-4">
            <div>
              <Link href="/" className="inline-flex items-baseline gap-1 select-none">
                <span className="text-xl font-black tracking-tight text-white">
                  THUYNGA
                </span>
                <span className="text-lg font-serif italic font-bold text-amber-300">
                  Shop
                </span>
              </Link>
              <p className="text-[10px] font-semibold text-zinc-400 uppercase tracking-widest mt-0.5">
                Hàng nhập khẩu chính hãng
              </p>
            </div>

            <p className="text-xs text-zinc-400 leading-relaxed">
              THUYNGA Shop chuyên phân phối thực phẩm chức năng, thực phẩm dinh dưỡng, trái cây tươi Air Cargo, mỹ phẩm và đồ mẹ & bé nhập khẩu chính ngạch từ Hàn Quốc, Nhật Bản, Mỹ, Úc.
            </p>

            <div className="space-y-2 text-xs text-zinc-300 pt-1">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-zinc-400 shrink-0 mt-0.5" />
                <span>Số 88 Phố Huế, Hai Bà Trưng, Hà Nội</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-zinc-400 shrink-0" />
                <a
                  href="tel:0987654321"
                  className="hover:text-white font-medium transition-colors"
                >
                  0987.654.321 (Hotline 24/7)
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-zinc-400 shrink-0" />
                <a
                  href="mailto:cskh@thuyngashop.com.vn"
                  className="hover:text-white transition-colors"
                >
                  cskh@thuyngashop.com.vn
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-zinc-400 shrink-0" />
                <span>Giờ mở cửa: 08:00 – 21:30 hàng ngày</span>
              </div>
            </div>

            {/* Social link */}
            <div className="pt-1">
              <a
                href="https://facebook.com/thuyngashop.com.vn"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-300 text-xs hover:border-zinc-700 hover:text-white transition-colors"
              >
                <svg className="w-3.5 h-3.5 fill-current text-zinc-400" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
                <span>fb.com/thuyngashop.com.vn</span>
              </a>
            </div>
          </div>

          {/* Cột 2: Ngành hàng chính */}
          <div className="space-y-3.5">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider pb-2 border-b border-zinc-800">
              Ngành Hàng Cốt Lõi
            </h3>
            <ul className="space-y-2 text-xs">
              <li>
                <Link
                  href="/danh-muc/thuc-pham-chuc-nang"
                  className="hover:text-white transition-colors flex items-center gap-1.5 py-0.5"
                >
                  <ChevronRight className="w-3 h-3 text-zinc-600 shrink-0" />
                  <span>Thực phẩm chức năng (Hàn, Nhật, Mỹ)</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/danh-muc/thuc-pham-do-uong-nhap-khau"
                  className="hover:text-white transition-colors flex items-center gap-1.5 py-0.5"
                >
                  <ChevronRight className="w-3 h-3 text-zinc-600 shrink-0" />
                  <span>Thực phẩm & Đồ uống nhập khẩu</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/danh-muc/trai-cay-nhap-khau"
                  className="hover:text-white transition-colors flex items-center gap-1.5 py-0.5"
                >
                  <ChevronRight className="w-3 h-3 text-zinc-600 shrink-0" />
                  <span>Trái cây tươi bay Air Cargo</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/danh-muc/my-pham-cham-soc-ca-nhan"
                  className="hover:text-white transition-colors flex items-center gap-1.5 py-0.5"
                >
                  <ChevronRight className="w-3 h-3 text-zinc-600 shrink-0" />
                  <span>Mỹ phẩm & Dược mỹ phẩm làm đẹp</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/danh-muc/me-va-be"
                  className="hover:text-white transition-colors flex items-center gap-1.5 py-0.5"
                >
                  <ChevronRight className="w-3 h-3 text-zinc-600 shrink-0" />
                  <span>Sữa & Dinh dưỡng Mẹ và Bé</span>
                </Link>
              </li>
              <li className="pt-1">
                <Link
                  href="/flash-sale"
                  className="hover:text-white font-semibold transition-colors flex items-center gap-1.5 text-zinc-300"
                >
                  <ChevronRight className="w-3 h-3 text-amber-400 shrink-0" />
                  <span>Phiên Flash Sale giá sốc</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Cột 3: Hỗ trợ khách hàng */}
          <div className="space-y-3.5">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider pb-2 border-b border-zinc-800">
              Hỗ Trợ & Chính Sách
            </h3>
            <ul className="space-y-2 text-xs">
              <li>
                <Link
                  href="/chinh-sach/huong-dan-mua-hang"
                  className="hover:text-white transition-colors flex items-center gap-1.5 py-0.5"
                >
                  <ChevronRight className="w-3 h-3 text-zinc-600 shrink-0" />
                  <span>Hướng dẫn mua hàng & đặt hàng online</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/chinh-sach/chinh-sach-giao-hang"
                  className="hover:text-white transition-colors flex items-center gap-1.5 py-0.5"
                >
                  <ChevronRight className="w-3 h-3 text-zinc-600 shrink-0" />
                  <span>Chính sách giao hàng & cước phí vận chuyển</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/chinh-sach/chinh-sach-doi-tra"
                  className="hover:text-white transition-colors flex items-center gap-1.5 py-0.5"
                >
                  <ChevronRight className="w-3 h-3 text-zinc-600 shrink-0" />
                  <span>Chính sách đổi trả hàng trong 7 ngày</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/chinh-sach/chinh-sach-bao-mat"
                  className="hover:text-white transition-colors flex items-center gap-1.5 py-0.5"
                >
                  <ChevronRight className="w-3 h-3 text-zinc-600 shrink-0" />
                  <span>Chính sách bảo mật thông tin</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/tra-cuu-don-hang"
                  className="hover:text-white transition-colors flex items-center gap-1.5 py-0.5"
                >
                  <ChevronRight className="w-3 h-3 text-zinc-600 shrink-0" />
                  <span>Tra cứu tình trạng vận đơn</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/tin-tuc"
                  className="hover:text-white transition-colors flex items-center gap-1.5 py-0.5"
                >
                  <ChevronRight className="w-3 h-3 text-zinc-600 shrink-0" />
                  <span>Góc sức khỏe & cẩm nang tiêu dùng</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Cột 4: Thanh toán & Nhận ưu đãi */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider pb-2 border-b border-zinc-800">
              Phương Thức Thanh Toán
            </h3>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-zinc-900 border border-zinc-800">
                <QrCode className="w-4 h-4 text-zinc-300 shrink-0" />
                <div>
                  <div className="font-semibold text-white text-[11px]">VietQR</div>
                  <div className="text-[10px] text-zinc-400">Tự động 24/7</div>
                </div>
              </div>
              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-zinc-900 border border-zinc-800">
                <Banknote className="w-4 h-4 text-zinc-300 shrink-0" />
                <div>
                  <div className="font-semibold text-white text-[11px]">COD</div>
                  <div className="text-[10px] text-zinc-400">Tiền mặt khi nhận</div>
                </div>
              </div>
            </div>

            {/* Form nhận voucher */}
            <div className="space-y-1.5 pt-1">
              <p className="text-[11px] font-semibold text-zinc-300">
                Đăng ký nhận voucher 50.000₫ cho đơn đầu tiên:
              </p>
              <NewsletterForm />
            </div>

            {/* Tuyên bố miễn trừ trách nhiệm pháp lý */}
            <div className="flex items-start gap-2 p-2.5 rounded-xl bg-zinc-900/90 border border-zinc-800 text-[11px] text-zinc-400 leading-relaxed">
              <AlertCircle className="w-3.5 h-3.5 text-zinc-400 shrink-0 mt-0.5" />
              <span>
                <strong className="text-zinc-300 font-semibold">Lưu ý:</strong> THUYNGA Shop tuyệt đối không kinh doanh thuốc kê đơn. Thực phẩm chức năng không thay thế thuốc chữa bệnh.
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ── 3. Bottom Copyright Bar ──────────────────────────────── */}
      <div className="shop-container pt-6 border-t border-zinc-800/80 text-[11px] text-zinc-400 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div>
          © 2026 <strong className="text-zinc-300">THUYNGA Shop</strong>. Bảo lưu mọi quyền.
        </div>
        <div>
          Phát triển & Vận hành bởi <strong className="text-zinc-300 font-medium">Trần Văn Cường</strong>
        </div>
      </div>
    </footer>
  );
}
