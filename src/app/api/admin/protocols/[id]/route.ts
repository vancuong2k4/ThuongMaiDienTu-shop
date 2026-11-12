// ============================================================
// app/api/admin/protocols/[id]/route.ts
// Chi Tiết, Cập Nhật & Xóa Phác Đồ Dinh Dưỡng Admin CMS (Phase 16)
// ============================================================

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { updateProtocolSchema } from "@/lib/validations/protocol";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(req: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth();
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const protocol = await prisma.healthProtocol.findUnique({
      where: { id },
      include: {
        items: {
          include: {
            product: true,
            variant: true,
          },
        },
        _count: {
          select: { assessments: true },
        },
      },
    });

    if (!protocol) {
      return NextResponse.json(
        { error: "Không tìm thấy phác đồ dinh dưỡng" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: protocol });
  } catch (error) {
    console.error("GET /api/admin/protocols/[id] error:", error);
    return NextResponse.json(
      { error: "Đã xảy ra lỗi khi lấy thông tin phác đồ" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth();
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();
    const parsed = updateProtocolSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Dữ liệu không hợp lệ", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const data = parsed.data;
    const updateData: any = {};

    if (data.title !== undefined) updateData.title = data.title.trim();
    if (data.targetGroup !== undefined) updateData.targetGroup = data.targetGroup;
    if (data.subtitle !== undefined) updateData.subtitle = data.subtitle;
    if (data.description !== undefined) updateData.description = data.description.trim();
    if (data.keyNutrients !== undefined) updateData.keyNutrients = data.keyNutrients;
    if (data.pharmacistAdvice !== undefined) updateData.pharmacistAdvice = data.pharmacistAdvice.trim();
    if (data.dosageSchedule !== undefined) updateData.dosageSchedule = data.dosageSchedule;
    if (data.comboDiscountPercent !== undefined) updateData.comboDiscountPercent = data.comboDiscountPercent;
    if (data.isActive !== undefined) updateData.isActive = data.isActive;

    const updated = await prisma.healthProtocol.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({
      success: true,
      message: "Cập nhật phác đồ thành công",
      data: updated,
    });
  } catch (error) {
    console.error("PATCH /api/admin/protocols/[id] error:", error);
    return NextResponse.json(
      { error: "Đã xảy ra lỗi khi cập nhật phác đồ" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth();
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    await prisma.healthProtocol.delete({ where: { id } });

    return NextResponse.json({
      success: true,
      message: "Xóa phác đồ thành công",
    });
  } catch (error) {
    console.error("DELETE /api/admin/protocols/[id] error:", error);
    return NextResponse.json(
      { error: "Đã xảy ra lỗi khi xóa phác đồ" },
      { status: 500 }
    );
  }
}
