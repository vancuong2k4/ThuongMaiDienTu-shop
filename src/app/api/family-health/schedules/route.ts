import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { createSupplementScheduleSchema } from "@/lib/validations/family-health";

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
    const validated = createSupplementScheduleSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        {
          success: false,
          message:
            validated.error.issues[0]?.message || "Dữ liệu lịch uống không hợp lệ.",
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

    if (!member || (member.userId !== session.user.id && session.user.role !== "ADMIN")) {
      return NextResponse.json(
        { success: false, message: "Không có quyền thêm lịch uống cho thành viên này." },
        { status: 403 }
      );
    }

    // Tính toán ngày dự kiến hết hộp
    const servings = data.servingsRemaining || data.totalServingsPerBox || 60;
    const daysUntilEmpty = Math.floor(servings / (data.dailyFrequency || 1));
    const estimatedEmptyDate = new Date(Date.now() + daysUntilEmpty * 24 * 60 * 60 * 1000);

    const schedule = await prisma.memberSupplementSchedule.create({
      data: {
        memberProfileId: data.memberProfileId,
        productId: data.productId || null,
        customItemName: data.customItemName.trim(),
        brandName: data.brandName ? data.brandName.trim() : null,
        timeSlot: data.timeSlot,
        timeString: data.timeString,
        dosageText: data.dosageText.trim(),
        dailyFrequency: data.dailyFrequency,
        totalServingsPerBox: data.totalServingsPerBox,
        servingsRemaining: servings,
        startDate: new Date(data.startDate),
        estimatedEmptyDate,
        isActive: true,
        reminderEnabled: data.reminderEnabled,
        notes: data.notes ? data.notes.trim() : null,
      },
      include: {
        product: {
          select: { id: true, name: true, slug: true },
        },
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Thêm lịch uống vi chất thành công!",
        schedule,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Lỗi khi thêm lịch uống:", error);
    return NextResponse.json(
      { success: false, message: "Không thể lưu lịch uống." },
      { status: 500 }
    );
  }
}
