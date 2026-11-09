// ============================================================
// app/(admin)/admin/cai-dat/page.tsx
// Trang Cài Đặt Hệ Thống & Cửa Hàng Admin CMS (Module 6.9)
// ============================================================

import React from "react";
import { AdminPageHeader } from "@/components/admin/ui/AdminPageHeader";
import { SettingsManager } from "@/components/admin/settings/SettingsManager";
import { prisma } from "@/lib/prisma";

export const metadata = {
  title: "Cài Đặt Hệ Thống & Cửa Hàng | THUYNGA Shop Admin",
  description: "Cấu hình thương hiệu, thông tin ngân hàng VietQR Napas 24/7, phí vận chuyển và SEO.",
};

const DEFAULT_SITE_CONFIG = {
  brandName: "THUYNGA Shop",
  slogan: "Hàng nhập khẩu chính hãng – Trao sức khỏe, trọn niềm tin",
  hotline: "0987.654.321",
  email: "cskh@thuyngashop.com.vn",
  address: "Số 88 Phố Huế, Hai Bà Trưng, Hà Nội",
  openingHours: "08:00 - 21:30 hàng ngày",
  fanpage: "https://facebook.com/thuyngashop.com.vn",
  zalo: "https://zalo.me/0987654321",
  tiktok: "https://tiktok.com/@thuyngashop",
  logo: "",
  favicon: "",
};

const DEFAULT_VIETQR_CONFIG = {
  bankId: "MB",
  accountNo: "0987654321",
  accountName: "TRAN VAN CUONG",
  template: "compact" as const,
};

const DEFAULT_SHIPPING_CONFIG = {
  standardFee: 30000,
  freeShippingThreshold: 500000,
  deliveryTime: "Hỏa tốc 2-4h nội thành, 24-48h toàn quốc qua Air Cargo",
};

const DEFAULT_SEO_CONFIG = {
  metaTitle: "THUYNGA Shop | Thực Phẩm Chức Năng & Trái Cây Nhập Khẩu Chính Hãng",
  metaDescription:
    "Cửa hàng trực tuyến hàng nhập khẩu chính hãng từ Úc, Nhật, Hàn, Mỹ. Cam kết 100% nguồn gốc rõ ràng, vận chuyển Air Cargo chuẩn nhiệt độ.",
  keywords: "thực phẩm chức năng, vitamin nhập khẩu, cherry mỹ, hồng sâm hàn quốc, sữa bột úc",
  ogImage: "",
};

export default async function AdminSettingsPage() {
  const records = await prisma.siteSetting.findMany();
  const map = new Map(records.map((r) => [r.key, r.value]));

  const initialSettings = {
    siteConfig: {
      ...DEFAULT_SITE_CONFIG,
      ...((map.get("site_config") as any) || {}),
    },
    vietqrConfig: {
      ...DEFAULT_VIETQR_CONFIG,
      ...((map.get("vietqr_config") as any) || {}),
    },
    shippingConfig: {
      ...DEFAULT_SHIPPING_CONFIG,
      ...((map.get("shipping_config") as any) || {}),
    },
    seoConfig: {
      ...DEFAULT_SEO_CONFIG,
      ...((map.get("seo_config") as any) || {}),
    },
  };

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Cài Đặt Hệ Thống & Cửa Hàng"
        description="Cấu hình thông tin thương hiệu, thông tin thanh toán VietQR Napas 24/7, chính sách phí ship và thẻ Meta SEO."
        breadcrumbs={[{ label: "Cài đặt hệ thống" }]}
      />
      <SettingsManager initialSettings={initialSettings} />
    </div>
  );
}
