import { redirect } from "next/navigation";

// ============================================================
// app/(storefront)/bieu-do-tang-truong-who/page.tsx
// Điều Hướng Tới Trung Tâm Chuẩn Đo Thể Trạng & Pha Sữa Úc
// ============================================================

export default function WhoGrowthPageRedirect() {
  redirect("/cong-thuc-pha-sua-aptamil#thuoc-do-who");
}
