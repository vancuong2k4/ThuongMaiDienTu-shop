// ============================================================
// components/storefront/gift-builder/types.ts
// Kiểu dữ liệu Trình Thiết Kế Giỏ Quà Tùy Biến Storefront (Phase 17)
// ============================================================

import {
  GiftBoxType,
  GiftRibbonColor,
  GiftOccasion,
} from "@prisma/client";

export interface BuilderTemplate {
  id: string;
  name: string;
  slug: string;
  boxType: GiftBoxType;
  dimensions: string;
  basePrice: number;
  maxSlots: number;
  imageUrl: string;
  description: string | null;
  isAirCargoPledge: boolean;
}

export interface BuilderProduct {
  id: string;
  name: string;
  slug: string;
  shortDesc: string | null;
  brand: string | null;
  origin: string | null;
  specification: string | null;
  category: {
    id: string;
    name: string;
    slug: string;
  };
  images: Array<{ url: string }>;
  defaultVariant: {
    id: string;
    name: string;
    price: number;
    originalPrice?: number | null;
    stock: number;
    sku: string;
  } | null;
  slotCost: number; // 1 đến 2 slots
}

export interface SelectedHamperItem {
  productId: string;
  productName: string;
  variantId: string | null;
  variantName: string | null;
  quantity: number;
  unitPrice: number;
  slotCost: number;
  imageUrl: string | null;
}

export interface BuilderFormData {
  occasion: GiftOccasion;
  ribbonColor: GiftRibbonColor;
  hasWaxSeal: boolean;
  hasLedLights: boolean;
  greetingCardMessage: string;
  cardSenderName: string;
  cardReceiverName: string;
  notes: string;
}
