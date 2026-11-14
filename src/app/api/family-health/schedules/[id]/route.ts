import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { updateSupplementScheduleSchema } from "@/lib/validations/family-health";

export const dynamic = "force-dynamic";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, message: "Vui lòng đăng nhập." },
        { status: 401 }
      );
    }

    const { id } = await params;
    const body = await req.json();
    const validated = updateSupplementScheduleSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        {
          success: false,
          message:
            validated.error.issues[0]?.message || "Dữ liệu cập nhật không hợp lệ.",
        },
        { status: 400 }
      );
    }

    const schedule = await prisma.memberSupplementSchedule.findUnique({
      where: { id },
      include: {
        memberProfile: { select: { userId: true } },
      },
    });

    if (
      !schedule ||
      (schedule.memberProfile.userId !== session.user.id &&
        session.user.role !== "ADMIN")
    ) {
      return NextResponse.json(
        { success: false, message: "Không có quyền sửa lịch uống này." },
        { status: 403 }
      );
    }

    const data = validated.data;

    let estimatedEmptyDate = schedule.estimatedEmptyDate;
    if (data.servingsRemaining !== undefined) {
      const freq = data.dailyFrequency || schedule.dailyFrequency || 1;
      const days = Math.floor(data.servingsRemaining / freq);
      estimatedEmptyDate = new Date(Date.now() + days * 24 * 60 * 60 * 1000);
    }

    const updated = await prisma.memberSupplementSchedule.update({
      where: { id },
      data: {
        customItemName: data.customItemName,
        brandName: data.brandName,
        timeSlot: data.timeSlot,
        timeString: data.timeString,
        dosageText: data.dosageText,
        dailyFrequency: data.dailyFrequency,
        servingsRemaining: data.servingsRemaining,
        estimatedEmptyDate,
        reminderEnabled: data.reminderEnabled,
        notes: data.notes,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Cập nhật lịch uống thành công!",
      schedule: updated,
    });
  } catch (error: any) {
    console.error("Lỗi khi cập nhật lịch uống:", error);
    return NextResponse.json(
      { success: false, message: "Không thể cập nhật lịch uống." },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, message: "Vui lòng đăng nhập." },
        { status: 401 }
      );
    }

    const { id } = await params;

    const schedule = await prisma.memberSupplementSchedule.findUnique({
      where: { id },
      include: {
        memberProfile: { select: { userId: true } },
      },
    });

    if (
      !schedule ||
      (schedule.memberProfile.userId !== session.user.id &&
        session.user.role !== "ADMIN")
    ) {
      return NextResponse.json(
        { success: false, message: "Không có quyền xóa lịch uống này." },
        { status: 403 }
      );
    }

    await prisma.memberSupplementSchedule.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: "Đã xóa lịch uống thành công.",
    });
  } catch (error: any) {
    console.error("Lỗi khi xóa lịch uống:", error);
    return NextResponse.json(
      { success: false, message: "Không thể xóa lịch uống." },
      { status: 500 }
    );
  }
}
