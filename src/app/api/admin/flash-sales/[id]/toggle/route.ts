// ============================================================
// app/api/admin/flash-sales/[id]/toggle/route.ts
// REST API Bật/Tắt Trạng Thái Kích Hoạt Chiến Dịch Flash Sale (Stage 9.2)
// ============================================================

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

export async function PATCH(req: NextRequest, props: RouteParams) {
  try {
    const session = await auth();
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await props.params;
    const body = await req.json();

    const existing = await prisma.flashSale.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json(
        { error: "Không tìm thấy chiến dịch Flash Sale" },
        { status: 404 }
      );
    }

    const nextState =
      typeof body.isActive === "boolean" ? body.isActive : !existing.isActive;

    const updated = await prisma.flashSale.update({
      where: { id },
      data: { isActive: nextState },
    });

    return NextResponse.json({
      success: true,
      message: nextState
        ? "Đã kích hoạt chiến dịch Flash Sale!"
        : "Đã tạm dừng chiến dịch Flash Sale.",
      data: updated,
    });
  } catch (err: unknown) {
    console.error("PATCH /api/admin/flash-sales/[id]/toggle error:", err);
    return NextResponse.json(
      { error: "Lỗi hệ thống khi đổi trạng thái Flash Sale" },
      { status: 500 }
    );
  }
}
