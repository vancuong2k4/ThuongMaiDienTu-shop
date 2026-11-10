// ============================================================
// app/api/admin/loyalty/adjust/route.ts
// REST API Điều Chỉnh Điểm Tích Lũy Khách Hàng Thủ Công (Stage 10.2)
// ============================================================

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { adjustPointsSchema } from "@/lib/validations/loyalty";
import { LoyaltyType } from "@prisma/client";
import { createInAppNotification } from "@/lib/notifications";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const validation = adjustPointsSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.issues[0]?.message || "Dữ liệu không hợp lệ" },
        { status: 400 }
      );
    }

    const { userId, points, description } = validation.data;

    // Chạy transaction điều chỉnh điểm
    const result = await prisma.$transaction(async (tx) => {
      const user = await tx.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          name: true,
          email: true,
          loyaltyPoints: true,
          totalPointsEarned: true,
        },
      });

      if (!user) {
        throw new Error("Không tìm thấy khách hàng");
      }

      // Tính số dư mới (không cho âm điểm)
      const newBalance = Math.max(0, user.loyaltyPoints + points);
      const pointsDiff = newBalance - user.loyaltyPoints;

      if (pointsDiff === 0 && points < 0) {
        throw new Error("Khách hàng hiện có 0 điểm, không thể trừ thêm.");
      }

      // Cập nhật User
      const updatedUser = await tx.user.update({
        where: { id: userId },
        data: {
          loyaltyPoints: newBalance,
          ...(points > 0 && {
            totalPointsEarned: user.totalPointsEarned + points,
          }),
        },
      });

      // Ghi nhận vào sổ cái
      const transaction = await tx.loyaltyTransaction.create({
        data: {
          userId,
          points: pointsDiff,
          type: LoyaltyType.ADMIN_ADJUST,
          description: description.trim(),
          balanceAfter: newBalance,
        },
      });

      return {
        user: updatedUser,
        transaction,
      };
    });

    // Gửi thông báo In-App thông báo biến động điểm cho khách hàng
    await createInAppNotification({
      userId,
      title:
        points > 0
          ? `🎁 Bạn nhận được +${points} điểm THUYNGA Club!`
          : `⚖️ Điều chỉnh điểm tích lũy THUYNGA Club`,
      message: `Tài khoản của bạn vừa được ${
        points > 0 ? "cộng +" : "khấu trừ "
      }${Math.abs(points)} điểm (${description.trim()}). Số dư hiện tại: ${
        result.user.loyaltyPoints
      } điểm.`,
      type: "LOYALTY_TIER",
      link: "/tai-khoan/tich-diem",
    });

    return NextResponse.json({
      success: true,
      message: `Đã ${points > 0 ? "cộng" : "trừ"} ${Math.abs(points)} điểm cho khách hàng ${result.user.name || result.user.email} thành công!`,
      data: {
        userId: result.user.id,
        newPoints: result.user.loyaltyPoints,
        transaction: result.transaction,
      },
    });
  } catch (err: unknown) {
    console.error("POST /api/admin/loyalty/adjust error:", err);
    const msg = err instanceof Error ? err.message : "Đã có lỗi xảy ra";
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}
