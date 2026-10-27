// ============================================================
// next.config.ts – THUYNGA Shop
// ============================================================

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // --- Image Optimization ---
  images: {
    // Thêm domain của Cloudflare R2 và các CDN khác
    remotePatterns: [
      {
        protocol: "https",
        hostname: "media.thuyngashop.com.vn",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "*.r2.cloudflarestorage.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "placehold.co",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "img.vietqr.io",
        pathname: "/**",
      },
    ],
    // Tự động convert sang WebP/AVIF
    formats: ["image/avif", "image/webp"],
    // Cache ảnh đã optimize 30 ngày
    minimumCacheTTL: 2592000,
  },

  // --- Security Headers ---
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval'", // unsafe-eval cần cho Next.js dev
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "font-src 'self' https://fonts.gstatic.com",
              "img-src 'self' data: blob: https://media.thuyngashop.com.vn https://placehold.co https://images.unsplash.com https://img.vietqr.io https://*.vietqr.io",
              "connect-src 'self' https://api.vietqr.io https://*.vietqr.io",
              "frame-src 'none'",
            ].join("; "),
          },
        ],
      },
    ];
  },

  // --- Redirects ---
  async redirects() {
    return [
      // Redirect www → non-www (hoặc ngược lại, tùy cấu hình DNS)
      // {
      //   source: '/(.*)',
      //   has: [{ type: 'host', value: 'www.thuyngashop.com.vn' }],
      //   destination: 'https://thuyngashop.com.vn/:path*',
      //   permanent: true,
      // },
    ];
  },

  // --- Compiler options ---
  compiler: {
    // Xóa console.log trong production
    removeConsole: process.env.NODE_ENV === "production",
  },

  // --- Experimental ---
  experimental: {
    // Optimize package imports (giảm bundle size)
    optimizePackageImports: ["lucide-react", "@radix-ui/react-icons"],
  },

  // --- Turbopack with Tailwind v4 ---
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
