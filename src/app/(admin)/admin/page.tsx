// ============================================================
// app/(admin)/admin/page.tsx
// Chuyển hướng nhanh từ /admin sang /admin/dashboard
// ============================================================

import { redirect } from "next/navigation";

export default function AdminPage() {
  redirect("/admin/dashboard");
}
