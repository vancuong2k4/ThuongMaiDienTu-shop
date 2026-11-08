// ============================================================
// app/api/admin/reviews/[id]/status/route.ts
// API Cập nhật trạng thái duyệt đánh giá (PENDING / APPROVED / REJECTED)
// ============================================================

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { reviewStatusUpdateSchema } from "@/lib/validations/review";

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
    const result = reviewStatusUpdateSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: "Trạng thái đánh giá không hợp lệ" },
        { status: 400 }
      );
    }

    const review = await prisma.review.findUnique({
      where: { id },
    });

    if (!review) {
      return NextResponse.json(
        { error: "Không tìm thấy đánh giá" },
        { status: 404 }
      );
    }

    const updated = await prisma.review.update({
      where: { id },
      data: {
        status: result.data.status,
      },
    });

    return NextResponse.json({
      success: true,
      message: `Đã chuyển trạng thái đánh giá sang ${updated.status}`,
      status: updated.status,
    });
  } catch (error) {
    console.error("PATCH /api/admin/reviews/[id]/status error:", error);
    return NextResponse.json(
      { error: "Đã xảy ra lỗi khi cập nhật trạng thái đánh giá" },
      { status: 500 }
    );
  }
}
