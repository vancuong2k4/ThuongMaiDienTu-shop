// ============================================================
// lib/utils.ts – Utility functions cho THUYNGA Shop
// ============================================================

import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/** Merge Tailwind classes an toàn (dùng cho shadcn/ui) */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// ============================================================
// COUNTRY FLAGS
// ============================================================

/**
 * Lấy emoji cờ quốc gia từ tên quốc gia xuất xứ
 * @example getCountryFlag("Hàn Quốc") → "🇰🇷"
 */
export function getCountryFlag(origin: string | null | undefined): string {
  if (!origin) return "🌐";
  const norm = origin.trim().toLowerCase();
  if (norm.includes("hàn quốc") || norm.includes("korea")) return "🇰🇷";
  if (
    norm.includes("mỹ") ||
    norm.includes("hoa kỳ") ||
    norm.includes("usa") ||
    norm.includes("united states")
  )
    return "🇺🇸";
  if (norm.includes("nhật") || norm.includes("japan")) return "🇯🇵";
  if (norm.includes("úc") || norm.includes("australia")) return "🇦🇺";
  if (norm.includes("new zealand")) return "🇳🇿";
  if (norm.includes("pháp") || norm.includes("france")) return "🇫🇷";
  if (norm.includes("đức") || norm.includes("germany")) return "🇩🇪";
  if (
    norm.includes("anh") ||
    norm.includes("uk") ||
    norm.includes("united kingdom")
  )
    return "🇬🇧";
  if (norm.includes("đan mạch") || norm.includes("denmark")) return "🇩🇰";
  if (norm.includes("nga") || norm.includes("russia")) return "🇷🇺";
  if (norm.includes("canada")) return "🇨🇦";
  if (norm.includes("thụy sĩ") || norm.includes("switzerland")) return "🇨🇭";
  if (norm.includes("thái lan") || norm.includes("thailand")) return "🇹🇭";
  return "🌐";
}

// ============================================================
// FORMAT CURRENCY (VNĐ)
// ============================================================

/**
 * Format số tiền theo chuẩn Việt Nam
 * @example formatVND(125000) → "125.000 ₫"
 */
export function formatVND(amount: number | string): string {
  const num = typeof amount === "string" ? parseFloat(amount) : amount;
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    minimumFractionDigits: 0,
  }).format(num);
}

/** Bí danh cho formatVND để chuẩn hóa gọi tiền tệ */
export const formatCurrency = formatVND;

/**
 * Tính % giảm giá
 * @example calcDiscount(200000, 150000) → 25 (%)
 */
export function calcDiscount(original: number, sale: number): number {
  if (original <= 0 || sale >= original) return 0;
  return Math.round(((original - sale) / original) * 100);
}

// ============================================================
// FORMAT DATE
// ============================================================

/** Format ngày tháng Việt Nam */
export function formatDate(date: Date | string): string {
  return new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(date));
}

/** Format ngày giờ đầy đủ */
export function formatDateTime(date: Date | string): string {
  return new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));
}

// ============================================================
// SLUG
// ============================================================

/**
 * Tạo slug từ chuỗi tiếng Việt
 * @example slugify("Thực phẩm chức năng") → "thuc-pham-chuc-nang"
 */
export function slugify(text: string): string {
  const vietnameseMap: Record<string, string> = {
    à: "a", á: "a", â: "a", ã: "a", ả: "a", ạ: "a",
    ă: "a", ắ: "a", ặ: "a", ẳ: "a", ẵ: "a", ằ: "a",
    è: "e", é: "e", ê: "e", ẽ: "e", ẻ: "e", ẹ: "e",
    ề: "e", ế: "e", ệ: "e", ể: "e", ễ: "e",
    ì: "i", í: "i", ị: "i", ỉ: "i", ĩ: "i",
    ò: "o", ó: "o", ô: "o", õ: "o", ỏ: "o", ọ: "o",
    ồ: "o", ố: "o", ộ: "o", ổ: "o", ỗ: "o",
    ơ: "o", ờ: "o", ớ: "o", ợ: "o", ở: "o", ỡ: "o",
    ù: "u", ú: "u", ư: "u", ũ: "u", ủ: "u", ụ: "u",
    ừ: "u", ứ: "u", ự: "u", ử: "u", ữ: "u",
    ỳ: "y", ý: "y", ỵ: "y", ỷ: "y", ỹ: "y",
    đ: "d",
    // Uppercase
    À: "a", Á: "a", Â: "a", Ã: "a", Ả: "a", Ạ: "a",
    Ă: "a", Ắ: "a", Ặ: "a", Ẳ: "a", Ẵ: "a", Ằ: "a",
    È: "e", É: "e", Ê: "e", Ẽ: "e", Ẻ: "e", Ẹ: "e",
    Ề: "e", Ế: "e", Ệ: "e", Ể: "e", Ễ: "e",
    Ì: "i", Í: "i", Ị: "i", Ỉ: "i", Ĩ: "i",
    Ò: "o", Ó: "o", Ô: "o", Õ: "o", Ỏ: "o", Ọ: "o",
    Ồ: "o", Ố: "o", Ộ: "o", Ổ: "o", Ỗ: "o",
    Ơ: "o", Ờ: "o", Ớ: "o", Ợ: "o", Ở: "o", Ỡ: "o",
    Ù: "u", Ú: "u", Ư: "u", Ũ: "u", Ủ: "u", Ụ: "u",
    Ừ: "u", Ứ: "u", Ự: "u", Ử: "u", Ữ: "u",
    Ỳ: "y", Ý: "y", Ỵ: "y", Ỷ: "y", Ỹ: "y",
    Đ: "d",
  };

  return text
    .split("")
    .map((char) => vietnameseMap[char] || char)
    .join("")
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

// ============================================================
// ORDER NUMBER GENERATOR
// ============================================================

/**
 * Tạo mã đơn hàng: TN-YYYYMMDD-XXXX
 * @example generateOrderNumber() → "TN-20261023-0001"
 */
export function generateOrderNumber(sequence: number): string {
  const date = new Date();
  const dateStr = date.toISOString().slice(0, 10).replace(/-/g, "");
  const seq = String(sequence).padStart(4, "0");
  return `TN-${dateStr}-${seq}`;
}

// ============================================================
// VIETQR
// ============================================================

/**
 * Tạo URL QR code VietQR
 * @param amount - Số tiền chuyển khoản
 * @param transferCode - Nội dung chuyển khoản (mã đơn)
 */
export function generateVietQRUrl(
  bankCode: string,
  accountNumber: string,
  accountName: string,
  amount: number,
  transferCode: string
): string {
  const encoded = encodeURIComponent(
    `${transferCode} THUYNGA SHOP`
  );
  return `https://img.vietqr.io/image/${bankCode}-${accountNumber}-compact2.png?amount=${amount}&addInfo=${encoded}&accountName=${encodeURIComponent(accountName)}`;
}

// ============================================================
// MISC
// ============================================================

/** Delay async (dùng trong seeder, test) */
export const sleep = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

/** Truncate text */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trimEnd() + "...";
}

/** Parse giá từ Decimal string của Prisma */
export function toNumber(value: unknown): number {
  if (typeof value === "number") return value;
  if (typeof value === "string") return parseFloat(value);
  if (value && typeof value === "object" && "toNumber" in value) {
    return (value as { toNumber: () => number }).toNumber();
  }
  return 0;
}
