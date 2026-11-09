// ============================================================
// components/admin/media/types.ts
// Định nghĩa kiểu dữ liệu Thư Viện Media (Module 6.9)
// ============================================================

export interface MediaItem {
  id: string;
  filename: string;
  url: string;
  mimeType: string;
  size: number;
  width: number | null;
  height: number | null;
  altText: string | null;
  createdAt: string;
}

export interface MediaStatsData {
  totalFiles: number;
  totalSizeBytes: number;
}
