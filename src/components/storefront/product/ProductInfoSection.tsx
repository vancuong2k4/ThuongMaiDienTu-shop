"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Star,
  ShieldCheck,
  Truck,
  RotateCcw,
  Check,
  ShoppingBag,
  Zap,
  Heart,
  Share2,
  AlertCircle,
  PackageCheck,
  Calendar,
  Layers,
  MapPin,
  CheckCircle2,
  Plane,
} from "lucide-react";
import { formatVND, calcDiscount, toNumber } from "@/lib/utils";
import { useCartStore } from "@/store/cart";
import { CountryFlag } from "@/components/ui/CountryFlag";
import { WishlistButton } from "@/components/storefront/product/WishlistButton";

export interface VariantData {
  id: string;
  name: string;
  sku: string;
  price: number;
  originalPrice: number | null;
  stock: number;
  image: string | null;
  isDefault: boolean;
}

interface ProductInfoSectionProps {
  product: {
    id: string;
    name: string;
    slug: string;
    brand: string | null;
    origin: string | null;
    specification: string | null;
    expiryInfo: string | null;
    shortDesc: string | null;
    category: {
      name: string;
      slug: string;
    };
    variants: VariantData[];
    images: Array<{ url: string; alt: string | null }>;
    _count: {
      reviews: number;
    };
  };
  selectedVariant: VariantData;
  onSelectVariant: (variant: VariantData) => void;
  reviewAverage?: number;
}

export function ProductInfoSection({
  product,
  selectedVariant,
  onSelectVariant,
  reviewAverage = 5.0,
}: ProductInfoSectionProps) {
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const router = useRouter();

  const addItem = useCartStore((state) => state.addItem);

  const price = selectedVariant.price;
  const originalPrice = selectedVariant.originalPrice;
  const discountPercent = originalPrice
    ? calcDiscount(originalPrice, price)
    : 0;
  const isOutOfStock = selectedVariant.stock <= 0;

  // Xử lý tăng giảm số lượng
  const handleQuantityChange = (newQty: number) => {
    if (newQty < 1) return;
    if (newQty > selectedVariant.stock) return;
    setQuantity(newQty);
  };

  // Thêm vào giỏ hàng
  const handleAddToCart = () => {
    if (isOutOfStock) return;

    addItem({
      variantId: selectedVariant.id,
      productId: product.id,
      productName: product.name,
      variantName: selectedVariant.name,
      sku: selectedVariant.sku,
      price: price,
      image: selectedVariant.image || product.images[0]?.url || null,
      quantity: quantity,
      stock: selectedVariant.stock,
    });

    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  // Mua ngay -> Thêm giỏ và chuyển sang trang thanh toán
  const handleBuyNow = () => {
    if (isOutOfStock) return;

    addItem({
      variantId: selectedVariant.id,
      productId: product.id,
      productName: product.name,
      variantName: selectedVariant.name,
      sku: selectedVariant.sku,
      price: price,
      image: selectedVariant.image || product.images[0]?.url || null,
      quantity: quantity,
      stock: selectedVariant.stock,
    });

    router.push("/thanh-toan");
  };

  // Chia sẻ link sản phẩm
  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* ── 1. Brand, Title & Rating Header ────────────────────────── */}
      <div className="space-y-2 border-b border-gray-100 pb-4">
        <div className="flex items-center justify-between gap-4">
          <Link
            href={`/danh-muc/${product.category.slug}`}
            className="text-xs font-bold text-[#800028] uppercase tracking-wider hover:underline"
          >
            {product.brand || product.category.name}
          </Link>
          <span className="text-xs text-gray-400 font-mono">
            Mã SKU: <strong className="text-gray-700">{selectedVariant.sku}</strong>
          </span>
        </div>

        <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-gray-900 leading-tight">
          {product.name}
        </h1>

        {/* Rating summary & Review count */}
        <div className="flex items-center gap-3 pt-1 text-xs">
          <div className="flex items-center gap-1 text-amber-500 font-bold bg-amber-50 px-2 py-0.5 rounded-lg border border-amber-100">
            <Star className="w-3.5 h-3.5 fill-current" />
            <span>{reviewAverage.toFixed(1)}</span>
          </div>

          <a
            href="#danh-gia-khach-hang"
            className="text-gray-500 hover:text-[#800028] underline underline-offset-2"
          >
            {product._count.reviews > 0
              ? `${product._count.reviews} đánh giá thực tế`
              : "Chưa có đánh giá (Hãy là người đầu tiên)"}
          </a>

          <span className="text-gray-300">|</span>

          <span className="text-emerald-700 font-semibold flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Chính hãng 100%</span>
          </span>
        </div>
      </div>

      {/* ── 2. Pricing Box ─────────────────────────────────────────── */}
      <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-rose-50/70 via-[#fff0f3]/40 to-transparent border border-rose-100 space-y-2">
        <div className="flex items-baseline gap-3 flex-wrap">
          <span className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#800028] tracking-tight">
            {formatVND(price)}
          </span>

          {originalPrice && originalPrice > price && (
            <span className="text-sm sm:text-base text-gray-400 line-through font-normal">
              {formatVND(originalPrice)}
            </span>
          )}

          {discountPercent > 0 && (
            <span className="px-2.5 py-0.5 rounded-lg bg-red-600 text-white text-xs font-black shadow-sm">
              TIẾT KIỆM {discountPercent}%
            </span>
          )}
        </div>

        {originalPrice && originalPrice > price && (
          <p className="text-xs text-rose-800 font-medium">
            (Bạn tiết kiệm được{" "}
            <strong>{formatVND(originalPrice - price)}</strong> so với giá niêm
            yết)
          </p>
        )}
      </div>

      {/* ── 3. Four Golden Commitments & Product Highlights ───────── */}
      <div className="rounded-2xl border border-amber-300/80 bg-gradient-to-br from-amber-50/70 via-rose-50/30 to-amber-50/50 p-4 shadow-sm space-y-3">
        <div className="flex items-center justify-between border-b border-amber-200/70 pb-2.5">
          <div className="flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-gradient-to-r from-amber-500 to-[#800028] text-white flex items-center justify-center text-xs font-black shadow-xs">
              ★
            </span>
            <span className="text-xs sm:text-sm font-black text-amber-950 uppercase tracking-wide">
              4 Cam Kết Vàng Từ THUYNGA Shop
            </span>
          </div>
          <span className="text-[11px] font-bold text-amber-900 bg-amber-100/90 px-2.5 py-0.5 rounded-full border border-amber-300/70 shadow-2xs">
            Chuẩn Chính Hãng 100%
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
          {/* Cam kết 1: Xuất xứ kèm cờ quốc gia */}
          <div className="p-3 rounded-xl bg-white/95 border border-amber-200/80 shadow-2xs flex items-start gap-3 hover:border-amber-400 transition-colors">
            <div className="shrink-0 mt-0.5">
              <CountryFlag country={product.origin} className="w-8 h-5.5 rounded-xs shadow-xs" />
            </div>
            <div className="min-w-0 flex-1">
              <span className="text-gray-400 block text-[11px] font-medium">Xuất xứ chính ngạch:</span>
              <strong className="text-gray-900 font-bold block text-sm truncate">
                {product.origin ? `${product.origin}` : "Nhập khẩu chính hãng"}
              </strong>
              <span className="text-[10px] text-emerald-700 font-semibold flex items-center gap-1 mt-0.5">
                <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
                <span>Đầy đủ hóa đơn & tem phụ</span>
              </span>
            </div>
          </div>

          {/* Cam kết 2: Hạn sử dụng (Date HSD) */}
          <div className="p-3 rounded-xl bg-white/95 border border-amber-200/80 shadow-2xs flex items-start gap-3 hover:border-amber-400 transition-colors">
            <div className="w-8 h-8 rounded-xl bg-rose-100/80 text-[#800028] flex items-center justify-center shrink-0">
              <Calendar className="w-4 h-4" />
            </div>
            <div className="min-w-0 flex-1">
              <span className="text-gray-400 block text-[11px] font-medium">Hạn sử dụng (Date HSD):</span>
              <strong className="text-[#800028] font-bold block text-sm truncate">
                {product.expiryInfo || "Date xa mới nhất"}
              </strong>
              <span className="text-[10px] text-rose-700 font-semibold block mt-0.5">
                Cam kết date mới – Không bán cận date
              </span>
            </div>
          </div>

          {/* Cam kết 3: Quy cách đóng gói */}
          <div className="p-3 rounded-xl bg-white/95 border border-amber-200/80 shadow-2xs flex items-start gap-3 hover:border-amber-400 transition-colors">
            <div className="w-8 h-8 rounded-xl bg-amber-100/80 text-amber-900 flex items-center justify-center shrink-0">
              <PackageCheck className="w-4 h-4" />
            </div>
            <div className="min-w-0 flex-1">
              <span className="text-gray-400 block text-[11px] font-medium">Quy cách đóng gói:</span>
              <strong className="text-gray-900 font-bold block text-sm truncate">
                {product.specification || selectedVariant.name}
              </strong>
              <span className="text-[10px] text-gray-500 block mt-0.5 truncate">
                Nguyên seal niêm phong của hãng
              </span>
            </div>
          </div>

          {/* Cam kết 4: Vận chuyển Air Cargo & Nhiệt độ */}
          <div className="p-3 rounded-xl bg-white/95 border border-amber-200/80 shadow-2xs flex items-start gap-3 hover:border-amber-400 transition-colors">
            <div className="w-8 h-8 rounded-xl bg-blue-100/80 text-blue-700 flex items-center justify-center shrink-0">
              <Plane className="w-4 h-4" />
            </div>
            <div className="min-w-0 flex-1">
              <span className="text-gray-400 block text-[11px] font-medium">Vận chuyển Air Cargo:</span>
              <strong className="text-gray-900 font-bold block text-sm truncate">
                Bay 48h - Kho mát 2-8°C
              </strong>
              <span className="text-[10px] text-blue-700 font-semibold block mt-0.5">
                Giao hỏa tốc 2h nội thành
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ── 4. Smart Variant Selector (Bộ chọn biến thể thông minh) ─── */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold text-gray-800 uppercase tracking-wide">
            Chọn phân loại / Quy cách:
          </span>
          <span
            className={`font-semibold ${
              isOutOfStock
                ? "text-red-600"
                : selectedVariant.stock <= 10
                ? "text-orange-600 font-bold"
                : "text-emerald-700"
            }`}
          >
            {isOutOfStock
              ? "Tạm hết hàng"
              : selectedVariant.stock <= 10
              ? `Chỉ còn ${selectedVariant.stock} sản phẩm (Sắp hết)`
              : `Còn ${selectedVariant.stock} sản phẩm`}
          </span>
        </div>

        {/* Danh sách biến thể */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {product.variants.map((v) => {
            const isSelected = v.id === selectedVariant.id;
            const isVOutOfStock = v.stock <= 0;

            return (
              <button
                key={v.id}
                type="button"
                onClick={() => {
                  if (!isVOutOfStock) {
                    onSelectVariant(v);
                    setQuantity(1);
                  }
                }}
                disabled={isVOutOfStock}
                className={`relative p-3 rounded-2xl text-left border-2 transition-all flex items-center justify-between gap-3 ${
                  isSelected
                    ? "border-[#800028] bg-rose-50/40 shadow-sm"
                    : isVOutOfStock
                    ? "border-gray-200 bg-gray-100/60 opacity-60 cursor-not-allowed"
                    : "border-gray-200 hover:border-gray-300 bg-white"
                }`}
              >
                <div className="space-y-0.5 flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span
                      className={`text-xs font-bold truncate ${
                        isSelected ? "text-[#800028]" : "text-gray-800"
                      }`}
                    >
                      {v.name}
                    </span>
                    {isSelected && (
                      <span className="w-4 h-4 rounded-full bg-[#800028] text-white flex items-center justify-center shrink-0">
                        <Check className="w-2.5 h-2.5" />
                      </span>
                    )}
                  </div>
                  <div className="text-xs font-bold text-gray-900">
                    {formatVND(v.price)}
                  </div>
                </div>

                {isVOutOfStock && (
                  <span className="text-[10px] bg-gray-300 text-gray-700 px-1.5 py-0.5 rounded font-semibold shrink-0">
                    Hết hàng
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── 5. Quantity & Actions Buttons ───────────────────────────── */}
      <div className="space-y-4 pt-2">
        {/* Bộ chọn số lượng */}
        <div className="flex items-center gap-4">
          <span className="text-xs font-bold text-gray-700 uppercase tracking-wide">
            Số lượng:
          </span>

          <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm">
            <button
              type="button"
              onClick={() => handleQuantityChange(quantity - 1)}
              disabled={quantity <= 1 || isOutOfStock}
              className="w-10 h-10 flex items-center justify-center text-gray-600 hover:bg-gray-100 disabled:opacity-30 disabled:hover:bg-transparent font-bold text-base transition-colors"
              aria-label="Giảm số lượng"
            >
              -
            </button>

            <input
              type="number"
              min={1}
              max={selectedVariant.stock}
              value={quantity}
              onChange={(e) => {
                const val = parseInt(e.target.value);
                if (!isNaN(val)) handleQuantityChange(val);
              }}
              disabled={isOutOfStock}
              className="w-14 h-10 text-center font-bold text-sm text-gray-900 border-x border-gray-200 focus:outline-none"
            />

            <button
              type="button"
              onClick={() => handleQuantityChange(quantity + 1)}
              disabled={quantity >= selectedVariant.stock || isOutOfStock}
              className="w-10 h-10 flex items-center justify-center text-gray-600 hover:bg-gray-100 disabled:opacity-30 disabled:hover:bg-transparent font-bold text-base transition-colors"
              aria-label="Tăng số lượng"
            >
              +
            </button>
          </div>

          <span className="text-xs text-gray-400">
            (Tối đa: {selectedVariant.stock} sản phẩm)
          </span>
        </div>

        {/* Nút hành động Mua hàng */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          {/* Thêm giỏ hàng */}
          <button
            type="button"
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            className={`h-12 px-6 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 border-2 transition-all active:scale-95 ${
              isAdded
                ? "bg-emerald-600 text-white border-emerald-600 shadow-md"
                : isOutOfStock
                ? "bg-gray-200 text-gray-400 border-gray-200 cursor-not-allowed"
                : "border-[#800028] text-[#800028] bg-white hover:bg-[#800028] hover:text-white shadow-sm"
            }`}
          >
            {isAdded ? (
              <>
                <Check className="w-4 h-4" />
                <span>Đã thêm vào giỏ hàng!</span>
              </>
            ) : isOutOfStock ? (
              <span>Tạm hết hàng</span>
            ) : (
              <>
                <ShoppingBag className="w-4 h-4" />
                <span>Thêm vào giỏ</span>
              </>
            )}
          </button>

          {/* Mua ngay */}
          <button
            type="button"
            onClick={handleBuyNow}
            disabled={isOutOfStock}
            className={`h-12 px-6 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-all active:scale-95 ${
              isOutOfStock
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-gradient-to-r from-[#800028] to-[#9e0032] hover:from-[#5c001e] hover:to-[#800028] text-white shadow-lg hover:shadow-xl"
            }`}
          >
            <Zap className="w-4 h-4 fill-current text-amber-300" />
            <span>Mua ngay (Giao tận nơi)</span>
          </button>
        </div>

        {/* Yêu thích & Chia sẻ */}
        <div className="flex items-center justify-between pt-2 border-t border-gray-100 text-xs text-gray-500">
          <WishlistButton
            productId={product.id}
            showText={true}
            className="hover:text-red-600 transition-colors"
          />

          <button
            type="button"
            onClick={handleShare}
            className="flex items-center gap-1.5 hover:text-[#800028] transition-colors"
          >
            <Share2 className="w-4 h-4" />
            <span>{copySuccess ? "Đã sao chép liên kết!" : "Chia sẻ sản phẩm"}</span>
          </button>
        </div>
      </div>

      {/* ── 6. Legal Disclaimer & Trust Commitments ─────────────────── */}
      <div className="space-y-3 pt-3">
        {/* Tuyên bố miễn trừ trách nhiệm y tế */}
        <div className="flex items-start gap-2.5 p-3 rounded-2xl bg-amber-50/80 border border-amber-200/80 text-[11px] text-amber-900 leading-relaxed">
          <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <span>
            <strong>Lưu ý quan trọng:</strong> THUYNGA Shop tuyệt đối KHÔNG kinh doanh thuốc kê đơn. Thực phẩm chức năng không phải là thuốc và không có tác dụng thay thế thuốc chữa bệnh.
          </span>
        </div>

        {/* Chính sách bảo hành & Quyền lợi khách hàng */}
        <div className="p-4 rounded-2xl bg-gradient-to-br from-gray-50 to-rose-50/30 border border-gray-200/80 space-y-2.5 text-xs text-gray-700 shadow-2xs">
          <div className="font-bold text-gray-900 text-xs uppercase tracking-wider flex items-center gap-1.5 pb-2 border-b border-gray-200/60">
            <ShieldCheck className="w-4 h-4 text-[#800028]" />
            <span>Chính Sách & Quyền Lợi Khách Hàng:</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span><strong>Bồi thường 200%:</strong> Nếu phát hiện hàng giả, hàng nhái kém chất lượng.</span>
            </div>
            <div className="flex items-start gap-2">
              <RotateCcw className="w-4 h-4 text-[#800028] shrink-0 mt-0.5" />
              <span><strong>Đổi trả 7 ngày:</strong> Miễn phí nếu sản phẩm có lỗi bao bì hoặc cận date.</span>
            </div>
            <div className="flex items-start gap-2">
              <PackageCheck className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <span><strong>Đồng kiểm hàng:</strong> Mở gói kiểm tra đúng sản phẩm trước khi thanh toán.</span>
            </div>
            <div className="flex items-start gap-2">
              <Truck className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
              <span><strong>Giao nhanh toàn quốc:</strong> Hỗ trợ thanh toán VietQR tự động & COD.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
