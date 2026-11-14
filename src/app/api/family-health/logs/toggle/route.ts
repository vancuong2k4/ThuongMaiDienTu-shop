import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { toggleIntakeLogSchema } from "@/lib/validations/family-health";
import { toggleSupplementIntake } from "@/lib/family-health";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, message: "Vui lòng đăng nhập." },
        { status: 401 }
      );
    }

    const body = await req.json();
    const validated = toggleIntakeLogSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        {
          success: false,
          message:
            validated.error.issues[0]?.message || "Dữ liệu cữ uống không hợp lệ.",
        },
        { status: 400 }
      );
    }

    const data = validated.data;

    // Kiểm tra quyền sở hữu hồ sơ thành viên
    const member = await prisma.familyMemberProfile.findUnique({
      where: { id: data.memberProfileId },
      select: { userId: true },
    });

    if (
      !member ||
      (member.userId !== session.user.id && session.user.role !== "ADMIN")
    ) {
      return NextResponse.json(
        { success: false, message: "Không có quyền ghi nhận cho thành viên này." },
        { status: 403 }
      );
    }

    const log = await toggleSupplementIntake(
      data.scheduleId,
      data.memberProfileId,
      data.logDate,
      data.status,
      data.notes
    );

    return NextResponse.json({
      success: true,
      message:
        data.status === "TAKEN"
          ? "Đã ghi nhận uống vi chất thành công!"
          : "Đã cập nhật trạng thái cữ uống.",
      log,
    });
  } catch (error: any) {
    console.error("Lỗi khi ghi nhận cữ uống:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Không thể cập nhật cữ uống." },
      { status: 500 }
    );
  }
}
