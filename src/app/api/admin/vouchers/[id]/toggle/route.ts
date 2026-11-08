// ============================================================
// app/api/admin/vouchers/[id]/toggle/route.ts
// API Bật/Tắt nhanh kích hoạt Voucher Admin CMS
// ============================================================

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { voucherToggleSchema } from "@/lib/validations/voucher";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function PATCH(req: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth();
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();
    const result = voucherToggleSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: "Dữ liệu trạng thái không hợp lệ" },
        { status: 400 }
      );
    }

    const voucher = await prisma.voucher.findUnique({
      where: { id },
    });

    if (!voucher) {
      return NextResponse.json({ error: "Không tìm thấy voucher" }, { status: 404 });
    }

    const updated = await prisma.voucher.update({
      where: { id },
      data: {
        isActive: result.data.isActive,
      },
    });

    return NextResponse.json({
      success: true,
      message: `Đã ${updated.isActive ? "kích hoạt" : "tạm dừng"} voucher "${updated.code}"`,
      isActive: updated.isActive,
    });
  } catch (error) {
    console.error("PATCH /api/admin/vouchers/[id]/toggle error:", error);
    return NextResponse.json(
      { error: "Đã xảy ra lỗi khi cập nhật trạng thái voucher" },
      { status: 500 }
    );
  }
}
