"use client";

import { useState, useRef, MouseEvent } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Maximize2, X, ShieldCheck } from "lucide-react";

interface ProductImageGalleryProps {
  images: Array<{ url: string; alt: string | null }>;
  productName: string;
  origin?: string | null;
  discountPercent?: number;
  activeImage: string;
  onSelectImage: (url: string) => void;
}

export function ProductImageGallery({
  images,
  productName,
  origin,
  discountPercent = 0,
  activeImage,
  onSelectImage,
}: ProductImageGalleryProps) {
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 50, y: 50 });
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Danh sách ảnh duy nhất (loại bỏ trùng lặp)
  const allImages = Array.from(
    new Set([activeImage, ...images.map((img) => img.url)])
  ).filter(Boolean);

  const currentIdx = allImages.indexOf(activeImage);

  // Xử lý hover zoom kính lúp
  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const { left, top, width, height } =
      containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomPosition({
      x: Math.max(0, Math.min(100, x)),
      y: Math.max(0, Math.min(100, y)),
    });
  };

  const nextImage = () => {
    const nextIdx = (currentIdx + 1) % allImages.length;
    onSelectImage(allImages[nextIdx]);
  };

  const prevImage = () => {
    const prevIdx = (currentIdx - 1 + allImages.length) % allImages.length;
    onSelectImage(allImages[prevIdx]);
  };

  return (
    <div className="flex flex-col gap-3 select-none">
      {/* ── 1. Main Large Image with Zoom & Badges ─────────────────── */}
      <div
        ref={containerRef}
        onMouseEnter={() => setIsZoomed(true)}
        onMouseLeave={() => setIsZoomed(false)}
        onMouseMove={handleMouseMove}
        onClick={() => setIsLightboxOpen(true)}
        className="relative aspect-square w-full rounded-3xl overflow-hidden bg-white border border-gray-100 shadow-sm cursor-zoom-in group"
      >
        {/* Ảnh chính */}
        <Image
          src={activeImage}
          alt={productName}
          fill
          priority
          sizes="(max-width: 768px) 100vw, 50vw"
          className={`object-cover object-center transition-transform duration-200 ${
            isZoomed ? "scale-150 origin-center" : "scale-100"
          }`}
          style={
            isZoomed
              ? {
                  transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`,
                }
              : undefined
          }
        />

        {/* Origin Badge */}
        {origin && (
          <div className="absolute top-3.5 left-3.5 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-xs font-bold tracking-wide flex items-center gap-1.5 shadow-sm">
            {origin === "Hàn Quốc" && "🇰🇷"}
            {origin === "Mỹ" && "🇺🇸"}
            {origin === "Nhật Bản" && "🇯🇵"}
            {origin === "Úc" && "🇦🇺"}
            {origin === "New Zealand" && "🇳🇿"}
            {origin === "Pháp" && "🇫🇷"}
            {origin === "Đan Mạch" && "🇩🇰"}
            <span>Xuất xứ: {origin}</span>
          </div>
        )}

        {/* Discount Badge */}
        {discountPercent > 0 && (
          <div className="absolute top-3.5 right-3.5 px-2.5 py-1 rounded-xl bg-red-600 text-white text-xs font-black shadow-md">
            GIẢM {discountPercent}%
          </div>
        )}

        {/* Nút phóng to toàn màn hình */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsLightboxOpen(true);
          }}
          className="absolute bottom-3.5 right-3.5 w-9 h-9 rounded-full bg-white/90 backdrop-blur-md text-gray-700 hover:text-[#800028] hover:bg-white flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
          aria-label="Xem ảnh phóng to"
        >
          <Maximize2 className="w-4 h-4" />
        </button>

        {/* Nút điều hướng ảnh trên mobile/tablet */}
        {allImages.length > 1 && (
          <>
            <button
              onClick={(e) => {
                e.stopPropagation();
                prevImage();
              }}
              className="absolute left-2.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/80 hover:bg-white text-gray-700 flex items-center justify-center shadow opacity-0 group-hover:opacity-100 transition-opacity"
              aria-label="Ảnh trước"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                nextImage();
              }}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/80 hover:bg-white text-gray-700 flex items-center justify-center shadow opacity-0 group-hover:opacity-100 transition-opacity"
              aria-label="Ảnh sau"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </>
        )}
      </div>

      {/* ── 2. Thumbnail Strip ─────────────────────────────────────── */}
      {allImages.length > 1 && (
        <div className="flex items-center gap-2.5 overflow-x-auto pb-1.5 scrollbar-hide">
          {allImages.map((url, idx) => {
            const isActive = url === activeImage;
            return (
              <button
                key={`${url}-${idx}`}
                onClick={() => onSelectImage(url)}
                className={`relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden shrink-0 border-2 transition-all bg-white ${
                  isActive
                    ? "border-[#800028] ring-2 ring-[#800028]/20 shadow-sm"
                    : "border-gray-200 hover:border-gray-300 opacity-70 hover:opacity-100"
                }`}
              >
                <Image
                  src={url}
                  alt={`${productName} thumbnail ${idx + 1}`}
                  fill
                  sizes="80px"
                  className="object-cover"
                />
              </button>
            );
          })}
        </div>
      )}

      {/* ── 3. Lightbox Fullscreen Modal ────────────────────────────── */}
      {isLightboxOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setIsLightboxOpen(false)}
        >
          {/* Nút đóng */}
          <button
            onClick={() => setIsLightboxOpen(false)}
            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-colors z-50"
            aria-label="Đóng xem ảnh"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Vùng ảnh to */}
          <div
            className="relative w-full max-w-4xl h-[75vh] flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={activeImage}
              alt={productName}
              fill
              className="object-contain"
              sizes="100vw"
            />

            {allImages.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-2 w-11 h-11 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center transition-colors"
                  aria-label="Ảnh trước"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-2 w-11 h-11 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center transition-colors"
                  aria-label="Ảnh sau"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
