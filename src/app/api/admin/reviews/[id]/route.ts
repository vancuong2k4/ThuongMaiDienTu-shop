// ============================================================
// app/api/admin/reviews/[id]/route.ts
// API Cập nhật trạng thái, phản hồi Dược sĩ & Xóa đánh giá (Phase 14)
// ============================================================

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { adminUpdateReviewSchema } from "@/lib/validations/review";
import { createInAppNotification } from "@/lib/notifications";

interface RouteParams {
  params: Promise<{ id: string }>;
}

/**
 * PATCH: Admin cập nhật trạng thái (PENDING/APPROVED/REJECTED/FEATURED) hoặc gửi phản hồi Dược sĩ
 */
export async function PATCH(req: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth();
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();
    const result = adminUpdateReviewSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        {
          error: "Dữ liệu cập nhật không hợp lệ",
          details: result.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const review = await prisma.review.findUnique({
      where: { id },
      include: {
        product: { select: { name: true, slug: true } },
      },
    });

    if (!review) {
      return NextResponse.json(
        { error: "Không tìm thấy đánh giá" },
        { status: 404 }
      );
    }

    const { status, adminReply } = result.data;
    const adminReplyAt = adminReply ? new Date() : review.adminReplyAt;

    const updatedReview = await prisma.review.update({
      where: { id },
      data: {
        status,
        adminReply: adminReply !== undefined ? adminReply : review.adminReply,
        adminReplyAt,
      },
    });

    // Nếu Admin gửi phản hồi mới, bắn thông báo In-App cho khách hàng
    if (adminReply && adminReply !== review.adminReply) {
      await createInAppNotification({
        userId: review.userId,
        title: "👨‍⚕️ THUYNGA Shop đã phản hồi đánh giá của bạn!",
        message: `Dược sĩ THUYNGA đã gửi phản hồi cho bài đánh giá của bạn về sản phẩm "${review.product.name}".`,
        type: "SYSTEM",
        link: `/san-pham/${review.product.slug}`,
      });
    }

    return NextResponse.json({
      success: true,
      message: "Cập nhật đánh giá thành công",
      data: updatedReview,
    });
  } catch (error) {
    console.error("PATCH /api/admin/reviews/[id] error:", error);
    return NextResponse.json(
      { error: "Đã xảy ra lỗi khi cập nhật đánh giá" },
      { status: 500 }
    );
  }
}

/**
 * DELETE: Admin xóa đánh giá vi phạm / spam
 */
export async function DELETE(req: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth();
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const review = await prisma.review.findUnique({
      where: { id },
    });

    if (!review) {
      return NextResponse.json(
        { error: "Không tìm thấy đánh giá cần xóa" },
        { status: 404 }
      );
    }

    await prisma.review.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: "Đã xóa đánh giá thành công",
    });
  } catch (error) {
    console.error("DELETE /api/admin/reviews/[id] error:", error);
    return NextResponse.json(
      { error: "Đã xảy ra lỗi khi xóa đánh giá" },
      { status: 500 }
    );
  }
}
