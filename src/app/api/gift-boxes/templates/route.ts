// ============================================================
// app/api/gift-boxes/templates/route.ts
// Public API lấy danh sách mẫu vỏ hộp quà tặng cao cấp (Phase 17)
// ============================================================

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { GiftBoxType } from "@prisma/client";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const boxType = searchParams.get("boxType") as GiftBoxType | null;

    const where: any = { isActive: true };
    if (boxType && Object.values(GiftBoxType).includes(boxType)) {
      where.boxType = boxType;
    }

    const templates = await prisma.giftBoxTemplate.findMany({
      where,
      orderBy: { sortOrder: "asc" },
    });

    return NextResponse.json({
      success: true,
      data: templates.map((t) => ({
        ...t,
        basePrice: Number(t.basePrice),
      })),
    });
  } catch (error) {
    console.error("Lỗi khi lấy mẫu vỏ hộp quà:", error);
    return NextResponse.json(
      { success: false, message: "Không thể tải danh sách mẫu hộp quà." },
      { status: 500 }
    );
  }
}
