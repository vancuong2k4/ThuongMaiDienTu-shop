// ============================================================
// app/api/admin/settings/route.ts
// API Đọc & Cập Nhật Cài Đặt Hệ Thống Admin CMS
// ============================================================

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  siteConfigSchema,
  vietqrConfigSchema,
  shippingConfigSchema,
  seoConfigSchema,
} from "@/lib/validations/settings";

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
  template: "compact",
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

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const settingsRecords = await prisma.siteSetting.findMany();
    const settingsMap = new Map(settingsRecords.map((s) => [s.key, s.value]));

    const siteConfig = {
      ...DEFAULT_SITE_CONFIG,
      ...((settingsMap.get("site_config") as any) || {}),
    };

    const vietqrConfig = {
      ...DEFAULT_VIETQR_CONFIG,
      ...((settingsMap.get("vietqr_config") as any) || {}),
    };

    const shippingConfig = {
      ...DEFAULT_SHIPPING_CONFIG,
      ...((settingsMap.get("shipping_config") as any) || {}),
    };

    const seoConfig = {
      ...DEFAULT_SEO_CONFIG,
      ...((settingsMap.get("seo_config") as any) || {}),
    };

    return NextResponse.json({
      success: true,
      settings: {
        siteConfig,
        vietqrConfig,
        shippingConfig,
        seoConfig,
      },
    });
  } catch (error) {
    console.error("GET /api/admin/settings error:", error);
    return NextResponse.json(
      { error: "Đã xảy ra lỗi khi tải cài đặt hệ thống" },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await auth();
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { key, data } = body;

    if (!key || !data) {
      return NextResponse.json(
        { error: "Thiếu dữ liệu cài đặt cần lưu" },
        { status: 400 }
      );
    }

    if (key === "site_config") {
      const parsed = siteConfigSchema.safeParse(data);
      if (!parsed.success) {
        return NextResponse.json(
          { error: parsed.error.issues[0]?.message || "Dữ liệu không hợp lệ" },
          { status: 400 }
        );
      }
      await prisma.siteSetting.upsert({
        where: { key: "site_config" },
        update: { value: parsed.data },
        create: { key: "site_config", value: parsed.data },
      });
    } else if (key === "vietqr_config") {
      const parsed = vietqrConfigSchema.safeParse(data);
      if (!parsed.success) {
        return NextResponse.json(
          { error: parsed.error.issues[0]?.message || "Dữ liệu không hợp lệ" },
          { status: 400 }
        );
      }
      await prisma.siteSetting.upsert({
        where: { key: "vietqr_config" },
        update: { value: parsed.data },
        create: { key: "vietqr_config", value: parsed.data },
      });
    } else if (key === "shipping_config") {
      const parsed = shippingConfigSchema.safeParse(data);
      if (!parsed.success) {
        return NextResponse.json(
          { error: parsed.error.issues[0]?.message || "Dữ liệu không hợp lệ" },
          { status: 400 }
        );
      }
      await prisma.siteSetting.upsert({
        where: { key: "shipping_config" },
        update: { value: parsed.data },
        create: { key: "shipping_config", value: parsed.data },
      });
    } else if (key === "seo_config") {
      const parsed = seoConfigSchema.safeParse(data);
      if (!parsed.success) {
        return NextResponse.json(
          { error: parsed.error.issues[0]?.message || "Dữ liệu không hợp lệ" },
          { status: 400 }
        );
      }
      await prisma.siteSetting.upsert({
        where: { key: "seo_config" },
        update: { value: parsed.data },
        create: { key: "seo_config", value: parsed.data },
      });
    } else {
      return NextResponse.json(
        { error: `Khóa cài đặt "${key}" không được hỗ trợ` },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Đã lưu cấu hình cài đặt thành công",
    });
  } catch (error) {
    console.error("PUT /api/admin/settings error:", error);
    return NextResponse.json(
      { error: "Đã xảy ra lỗi khi lưu cài đặt" },
      { status: 500 }
    );
  }
}
