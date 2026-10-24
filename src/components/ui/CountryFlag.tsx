"use client";

import React from "react";

interface CountryFlagProps {
  country?: string | null;
  className?: string;
  size?: "xs" | "sm" | "md" | "lg";
}

/**
 * Hiển thị cờ quốc gia dưới dạng SVG chuẩn vector sắc nét,
 * tương thích 100% trên mọi hệ điều hành (kể cả Windows không có font flag emoji).
 */
export function CountryFlag({
  country,
  className = "w-6 h-4",
  size,
}: CountryFlagProps) {
  if (!country) {
    return (
      <span className="inline-block text-base leading-none select-none">🌐</span>
    );
  }

  const norm = country.trim().toLowerCase();

  // Size preset nếu được cung cấp
  const sizeClasses =
    size === "xs"
      ? "w-4 h-3"
      : size === "sm"
      ? "w-5 h-3.5"
      : size === "md"
      ? "w-7 h-5"
      : size === "lg"
      ? "w-10 h-7"
      : className;

  // 1. Hàn Quốc (South Korea)
  if (norm.includes("hàn quốc") || norm.includes("korea") || norm === "kr") {
    return (
      <svg
        viewBox="0 0 72 48"
        className={`${sizeClasses} rounded-xs shadow-2xs border border-gray-200/60 shrink-0 inline-block align-middle`}
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect width="72" height="48" fill="#FFFFFF" />
        {/* Taegeuk Circle */}
        <g transform="translate(36, 24)">
          <path d="M 0 -11 A 11 11 0 0 1 0 11 A 5.5 5.5 0 0 0 0 0 A 5.5 5.5 0 0 1 0 -11 Z" fill="#C62828" />
          <path d="M 0 11 A 11 11 0 0 1 0 -11 A 5.5 5.5 0 0 0 0 0 A 5.5 5.5 0 0 1 0 11 Z" fill="#1565C0" />
        </g>
        {/* 4 Trigrams */}
        {/* Top-left: Geon (☰) */}
        <g transform="translate(18, 12) rotate(33.7)" stroke="#111" strokeWidth="1.8">
          <line x1="-6" y1="-3.5" x2="6" y2="-3.5" />
          <line x1="-6" y1="0" x2="6" y2="0" />
          <line x1="-6" y1="3.5" x2="6" y2="3.5" />
        </g>
        {/* Bottom-right: Gon (☷) */}
        <g transform="translate(54, 36) rotate(33.7)" stroke="#111" strokeWidth="1.8">
          <line x1="-6" y1="-3.5" x2="-1.2" y2="-3.5" /><line x1="1.2" y1="-3.5" x2="6" y2="-3.5" />
          <line x1="-6" y1="0" x2="-1.2" y2="0" /><line x1="1.2" y1="0" x2="6" y2="0" />
          <line x1="-6" y1="3.5" x2="-1.2" y2="3.5" /><line x1="1.2" y1="3.5" x2="6" y2="3.5" />
        </g>
        {/* Top-right: Gam (☵) */}
        <g transform="translate(54, 12) rotate(-33.7)" stroke="#111" strokeWidth="1.8">
          <line x1="-6" y1="-3.5" x2="-1.2" y2="-3.5" /><line x1="1.2" y1="-3.5" x2="6" y2="-3.5" />
          <line x1="-6" y1="0" x2="6" y2="0" />
          <line x1="-6" y1="3.5" x2="-1.2" y2="3.5" /><line x1="1.2" y1="3.5" x2="6" y2="3.5" />
        </g>
        {/* Bottom-left: Ri (☲) */}
        <g transform="translate(18, 36) rotate(-33.7)" stroke="#111" strokeWidth="1.8">
          <line x1="-6" y1="-3.5" x2="6" y2="-3.5" />
          <line x1="-6" y1="0" x2="-1.2" y2="0" /><line x1="1.2" y1="0" x2="6" y2="0" />
          <line x1="-6" y1="3.5" x2="6" y2="3.5" />
        </g>
      </svg>
    );
  }

  // 2. Mỹ (Hoa Kỳ / USA)
  if (
    norm.includes("mỹ") ||
    norm.includes("hoa kỳ") ||
    norm.includes("usa") ||
    norm.includes("united states") ||
    norm === "us"
  ) {
    return (
      <svg
        viewBox="0 0 72 48"
        className={`${sizeClasses} rounded-xs shadow-2xs border border-gray-200/60 shrink-0 inline-block align-middle`}
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect width="72" height="48" fill="#B22234" />
        {/* 6 sọc trắng xen kẽ 7 sọc đỏ */}
        <rect y="3.69" width="72" height="3.69" fill="#FFFFFF" />
        <rect y="11.07" width="72" height="3.69" fill="#FFFFFF" />
        <rect y="18.46" width="72" height="3.69" fill="#FFFFFF" />
        <rect y="25.84" width="72" height="3.69" fill="#FFFFFF" />
        <rect y="33.23" width="72" height="3.69" fill="#FFFFFF" />
        <rect y="40.61" width="72" height="3.69" fill="#FFFFFF" />
        {/* Canton xanh */}
        <rect width="32" height="25.84" fill="#3C3B6E" />
        {/* Grid sao tượng trưng */}
        <g fill="#FFFFFF">
          <circle cx="5" cy="5" r="1.3" /><circle cx="13" cy="5" r="1.3" /><circle cx="21" cy="5" r="1.3" /><circle cx="27" cy="5" r="1.3" />
          <circle cx="9" cy="9.5" r="1.3" /><circle cx="17" cy="9.5" r="1.3" /><circle cx="25" cy="9.5" r="1.3" />
          <circle cx="5" cy="14" r="1.3" /><circle cx="13" cy="14" r="1.3" /><circle cx="21" cy="14" r="1.3" /><circle cx="27" cy="14" r="1.3" />
          <circle cx="9" cy="18.5" r="1.3" /><circle cx="17" cy="18.5" r="1.3" /><circle cx="25" cy="18.5" r="1.3" />
          <circle cx="5" cy="22.5" r="1.3" /><circle cx="13" cy="22.5" r="1.3" /><circle cx="21" cy="22.5" r="1.3" /><circle cx="27" cy="22.5" r="1.3" />
        </g>
      </svg>
    );
  }

  // 3. Nhật Bản (Japan)
  if (norm.includes("nhật") || norm.includes("japan") || norm === "jp") {
    return (
      <svg
        viewBox="0 0 72 48"
        className={`${sizeClasses} rounded-xs shadow-2xs border border-gray-200/60 shrink-0 inline-block align-middle`}
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect width="72" height="48" fill="#FFFFFF" />
        <circle cx="36" cy="24" r="14" fill="#BC002D" />
      </svg>
    );
  }

  // 4. Úc (Australia)
  if (norm.includes("úc") || norm.includes("australia") || norm === "au") {
    return (
      <svg
        viewBox="0 0 72 48"
        className={`${sizeClasses} rounded-xs shadow-2xs border border-gray-200/60 shrink-0 inline-block align-middle`}
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect width="72" height="48" fill="#00008B" />
        {/* Union Jack góc trên bên trái */}
        <g>
          <rect width="36" height="24" fill="#00247D" />
          <path d="M0 0 L36 24 M36 0 L0 24" stroke="#FFFFFF" strokeWidth="4" />
          <path d="M0 0 L36 24 M36 0 L0 24" stroke="#CF142B" strokeWidth="2" />
          <path d="M18 0 V24 M0 12 H36" stroke="#FFFFFF" strokeWidth="6" />
          <path d="M18 0 V24 M0 12 H36" stroke="#CF142B" strokeWidth="3" />
        </g>
        {/* Commonwealth Star */}
        <circle cx="18" cy="36" r="4.5" fill="#FFFFFF" />
        {/* Chòm sao Nam Thập Tự (Southern Cross) */}
        <circle cx="54" cy="10" r="2" fill="#FFFFFF" />
        <circle cx="62" cy="18" r="2" fill="#FFFFFF" />
        <circle cx="48" cy="24" r="2" fill="#FFFFFF" />
        <circle cx="56" cy="38" r="2.5" fill="#FFFFFF" />
        <circle cx="58" cy="26" r="1.3" fill="#FFFFFF" />
      </svg>
    );
  }

  // 5. New Zealand
  if (norm.includes("new zealand") || norm === "nz") {
    return (
      <svg
        viewBox="0 0 72 48"
        className={`${sizeClasses} rounded-xs shadow-2xs border border-gray-200/60 shrink-0 inline-block align-middle`}
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect width="72" height="48" fill="#00247D" />
        {/* Union Jack */}
        <g>
          <rect width="36" height="24" fill="#00247D" />
          <path d="M0 0 L36 24 M36 0 L0 24" stroke="#FFFFFF" strokeWidth="4" />
          <path d="M0 0 L36 24 M36 0 L0 24" stroke="#CC142B" strokeWidth="2" />
          <path d="M18 0 V24 M0 12 H36" stroke="#FFFFFF" strokeWidth="6" />
          <path d="M18 0 V24 M0 12 H36" stroke="#CC142B" strokeWidth="3" />
        </g>
        {/* 4 Red Stars with White Borders */}
        <circle cx="54" cy="11" r="2.8" fill="#FFFFFF" /><circle cx="54" cy="11" r="2" fill="#CC142B" />
        <circle cx="62" cy="20" r="2.8" fill="#FFFFFF" /><circle cx="62" cy="20" r="2" fill="#CC142B" />
        <circle cx="48" cy="24" r="2.8" fill="#FFFFFF" /><circle cx="48" cy="24" r="2" fill="#CC142B" />
        <circle cx="54" cy="37" r="3.2" fill="#FFFFFF" /><circle cx="54" cy="37" r="2.3" fill="#CC142B" />
      </svg>
    );
  }

  // 6. Pháp (France)
  if (norm.includes("pháp") || norm.includes("france") || norm === "fr") {
    return (
      <svg
        viewBox="0 0 72 48"
        className={`${sizeClasses} rounded-xs shadow-2xs border border-gray-200/60 shrink-0 inline-block align-middle`}
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect width="24" height="48" fill="#002395" />
        <rect x="24" width="24" height="48" fill="#FFFFFF" />
        <rect x="48" width="24" height="48" fill="#ED2939" />
      </svg>
    );
  }

  // 7. Đức (Germany)
  if (norm.includes("đức") || norm.includes("germany") || norm === "de") {
    return (
      <svg
        viewBox="0 0 72 48"
        className={`${sizeClasses} rounded-xs shadow-2xs border border-gray-200/60 shrink-0 inline-block align-middle`}
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect width="72" height="16" fill="#000000" />
        <rect y="16" width="72" height="16" fill="#DD0000" />
        <rect y="32" width="72" height="16" fill="#FFCE00" />
      </svg>
    );
  }

  // 8. Đan Mạch (Denmark)
  if (norm.includes("đan mạch") || norm.includes("denmark") || norm === "dk") {
    return (
      <svg
        viewBox="0 0 72 48"
        className={`${sizeClasses} rounded-xs shadow-2xs border border-gray-200/60 shrink-0 inline-block align-middle`}
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect width="72" height="48" fill="#C8102E" />
        <rect x="22" width="7" height="48" fill="#FFFFFF" />
        <rect y="21" width="72" height="7" fill="#FFFFFF" />
      </svg>
    );
  }

  // 9. Vương quốc Anh (UK)
  if (
    norm.includes("anh") ||
    norm.includes("uk") ||
    norm.includes("united kingdom") ||
    norm === "gb"
  ) {
    return (
      <svg
        viewBox="0 0 72 48"
        className={`${sizeClasses} rounded-xs shadow-2xs border border-gray-200/60 shrink-0 inline-block align-middle`}
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect width="72" height="48" fill="#012169" />
        <path d="M0 0 L72 48 M72 0 L0 48" stroke="#FFFFFF" strokeWidth="8" />
        <path d="M0 0 L72 48 M72 0 L0 48" stroke="#C8102E" strokeWidth="4" />
        <path d="M36 0 V48 M0 24 H72" stroke="#FFFFFF" strokeWidth="12" />
        <path d="M36 0 V48 M0 24 H72" stroke="#C8102E" strokeWidth="7" />
      </svg>
    );
  }

  // 10. Canada
  if (norm.includes("canada") || norm === "ca") {
    return (
      <svg
        viewBox="0 0 72 48"
        className={`${sizeClasses} rounded-xs shadow-2xs border border-gray-200/60 shrink-0 inline-block align-middle`}
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect width="18" height="48" fill="#FF0000" />
        <rect x="18" width="36" height="48" fill="#FFFFFF" />
        <rect x="54" width="18" height="48" fill="#FF0000" />
        {/* Lá phong đỏ tượng trưng */}
        <circle cx="36" cy="24" r="8" fill="#FF0000" />
      </svg>
    );
  }

  // 11. Thụy Sĩ (Switzerland)
  if (norm.includes("thụy sĩ") || norm.includes("switzerland") || norm === "ch") {
    return (
      <svg
        viewBox="0 0 72 48"
        className={`${sizeClasses} rounded-xs shadow-2xs border border-gray-200/60 shrink-0 inline-block align-middle`}
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect width="72" height="48" fill="#D52B1E" />
        <rect x="32" y="12" width="8" height="24" fill="#FFFFFF" />
        <rect x="24" y="20" width="24" height="8" fill="#FFFFFF" />
      </svg>
    );
  }

  // Fallback icon quả địa cầu
  return (
    <span className="inline-block text-base leading-none select-none">🌐</span>
  );
}
