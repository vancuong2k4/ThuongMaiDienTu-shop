// ============================================================
// app/api/admin/customers/[id]/toggle/route.ts
// API Khóa / Mở Khóa Tài Khoản Khách Hàng Admin CMS
// ============================================================

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

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

    // ── Self-Lock Prevention Guard ──────────────────────────────
    if (session.user.id === id) {
      return NextResponse.json(
        { error: "Bạn không thể tự khóa tài khoản quản trị viên của chính mình" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Không tìm thấy người dùng" },
        { status: 404 }
      );
    }

    const body = await req.json();
    const nextActiveState =
      typeof body.isActive === "boolean" ? body.isActive : !user.isActive;

    const updated = await prisma.user.update({
      where: { id },
      data: {
        isActive: nextActiveState,
      },
    });

    return NextResponse.json({
      success: true,
      message: `Đã ${updated.isActive ? "mở khóa" : "khóa"} tài khoản ${
        updated.name || updated.email
      }`,
      isActive: updated.isActive,
    });
  } catch (error) {
    console.error("PATCH /api/admin/customers/[id]/toggle error:", error);
    return NextResponse.json(
      { error: "Đã xảy ra lỗi khi cập nhật trạng thái tài khoản" },
      { status: 500 }
    );
  }
}
