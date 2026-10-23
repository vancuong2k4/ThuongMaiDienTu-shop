// ============================================================
// app/layout.tsx – Root Layout
// ============================================================

import type { Metadata } from "next";
import { Be_Vietnam_Pro } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";

// Font chính: Be Vietnam Pro (hỗ trợ tiếng Việt tốt, hiện đại)
const beVietnamPro = Be_Vietnam_Pro({
  subsets: ["vietnamese", "latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-be-vietnam-pro",
  display: "swap", // Tránh layout shift
  preload: true,
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL || "https://thuyngashop.com.vn"
  ),
  title: {
    default: "THUYNGA Shop – Hàng Nhập Khẩu Chính Hãng",
    template: "%s | THUYNGA Shop",
  },
  description:
    "THUYNGA Shop chuyên cung cấp thực phẩm chức năng, mỹ phẩm, thực phẩm nhập khẩu chính hãng từ Hàn Quốc, Nhật Bản, Mỹ. Giao hàng toàn quốc, đảm bảo chất lượng.",
  keywords: [
    "thực phẩm chức năng nhập khẩu",
    "mỹ phẩm chính hãng",
    "hàng nhập khẩu",
    "thuynga shop",
    "thực phẩm Hàn Quốc",
    "thực phẩm Nhật Bản",
  ],
  openGraph: {
    type: "website",
    locale: "vi_VN",
    siteName: "THUYNGA Shop",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi" className={beVietnamPro.variable}>
      <body className="font-sans antialiased bg-white text-gray-900">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
