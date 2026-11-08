// ============================================================
// app/api/admin/orders/[id]/note/route.ts
// API Cập nhật Ghi chú Nội bộ Đơn hàng Admin CMS
// ============================================================

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { updateAdminNoteSchema } from "@/lib/validations/order";

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
    const parsed = updateAdminNoteSchema.safeParse(body);

    if (!parsed.success) {
      const firstError = parsed.error.issues[0]?.message || "Dữ liệu không hợp lệ";
      return NextResponse.json({ error: firstError }, { status: 400 });
    }

    const { adminNote } = parsed.data;

    const order = await prisma.order.findFirst({
      where: {
        OR: [{ id }, { orderNumber: id }],
      },
      select: { id: true },
    });

    if (!order) {
      return NextResponse.json(
        { error: "Đơn hàng không tồn tại" },
        { status: 404 }
      );
    }

    const updated = await prisma.order.update({
      where: { id: order.id },
      data: {
        adminNote: adminNote || null,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Đã lưu ghi chú nội bộ",
      order: updated,
    });
  } catch (error) {
    console.error("Lỗi khi lưu ghi chú đơn hàng:", error);
    return NextResponse.json(
      { error: "Không thể lưu ghi chú" },
      { status: 500 }
    );
  }
}
