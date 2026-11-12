// ============================================================
// app/api/admin/consultations/[id]/route.ts
// Cập Nhật Trạng Thái & Ghi Chú Lịch Tư Vấn Dược Sĩ (Phase 16)
// ============================================================

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ConsultationStatus } from "@prisma/client";

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

    const { status, pharmacistNotes } = body;

    const updateData: any = {};
    if (status && Object.values(ConsultationStatus).includes(status)) {
      updateData.status = status;
    }
    if (pharmacistNotes !== undefined) {
      updateData.pharmacistNotes = pharmacistNotes;
    }

    const updated = await prisma.pharmacistConsultationBooking.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({
      success: true,
      message: "Cập nhật lịch tư vấn dược sĩ thành công",
      data: updated,
    });
  } catch (error) {
    console.error("PATCH /api/admin/consultations/[id] error:", error);
    return NextResponse.json(
      { error: "Đã xảy ra lỗi khi cập nhật lịch hẹn tư vấn" },
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
    await prisma.pharmacistConsultationBooking.delete({ where: { id } });

    return NextResponse.json({
      success: true,
      message: "Xóa lịch hẹn tư vấn thành công",
    });
  } catch (error) {
    console.error("DELETE /api/admin/consultations/[id] error:", error);
    return NextResponse.json(
      { error: "Đã xảy ra lỗi khi xóa lịch hẹn tư vấn" },
      { status: 500 }
    );
  }
}
