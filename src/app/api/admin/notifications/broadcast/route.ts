// ============================================================
// app/api/admin/notifications/broadcast/route.ts
// API Phát Sóng Thông Báo Toàn Sàn / Nhóm Khách Hàng Admin (Stage 11.2)
// ============================================================

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { broadcastNotificationSchema } from "@/lib/validations/notification";
import { broadcastInAppNotification } from "@/lib/notifications";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const parsed = broadcastNotificationSchema.safeParse(body);

    if (!parsed.success) {
      const firstError =
        parsed.error.issues[0]?.message || "Dữ liệu không hợp lệ";
      return NextResponse.json({ error: firstError }, { status: 400 });
    }

    const { title, message, type, link, targetRole } = parsed.data;

    const result = await broadcastInAppNotification({
      title,
      message,
      type,
      link,
      targetRole,
    });

    return NextResponse.json({
      success: true,
      message: `Đã phát sóng thông báo thành công tới ${result.count} người dùng`,
      count: result.count,
    });
  } catch (error) {
    console.error("POST /api/admin/notifications/broadcast error:", error);
    return NextResponse.json(
      { error: "Đã xảy ra lỗi khi phát sóng thông báo" },
      { status: 500 }
    );
  }
}
