export interface PriceRangeOption {
  id: string;
  label: string;
  min: number;
  max: number | null;
}

export const PRICE_RANGES: readonly PriceRangeOption[] = [
  { id: "under-300k", label: "Dưới 300.000₫", min: 0, max: 300000 },
  { id: "300k-500k", label: "300.000₫ – 500.000₫", min: 300000, max: 500000 },
  { id: "500k-1m", label: "500.000₫ – 1.000.000₫", min: 500000, max: 1000000 },
  { id: "1m-2m", label: "1.000.000₫ – 2.000.000₫", min: 1000000, max: 2000000 },
  { id: "above-2m", label: "Trên 2.000.000₫", min: 2000000, max: null },
] as const;

export const SORT_OPTIONS = [
  { value: "featured", label: "Nổi bật nhất" },
  { value: "newest", label: "Mới nhất" },
  { value: "price_asc", label: "Giá: Thấp đến Cao" },
  { value: "price_desc", label: "Giá: Cao đến Thấp" },
  { value: "bestseller", label: "Bán chạy nhất" },
] as const;
