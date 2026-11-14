import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { updateFamilyMemberSchema } from "@/lib/validations/family-health";
import { calculateMemberScheduleOverview } from "@/lib/family-health";

export const dynamic = "force-dynamic";

export async function GET(
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
    const { searchParams } = new URL(req.url);
    const date = searchParams.get("date") || undefined;

    // Kiểm tra quyền sở hữu
    const member = await prisma.familyMemberProfile.findUnique({
      where: { id },
      select: { userId: true },
    });

    if (!member) {
      return NextResponse.json(
        { success: false, message: "Hồ sơ thành viên không tồn tại." },
        { status: 404 }
      );
    }

    if (member.userId !== session.user.id && session.user.role !== "ADMIN") {
      return NextResponse.json(
        { success: false, message: "Không có quyền truy cập hồ sơ này." },
        { status: 403 }
      );
    }

    const overview = await calculateMemberScheduleOverview(id, date);

    return NextResponse.json({ success: true, overview });
  } catch (error: any) {
    console.error("Lỗi khi tải lịch uống thành viên:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Không thể tải lịch uống." },
      { status: 500 }
    );
  }
}

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
    const validated = updateFamilyMemberSchema.safeParse(body);

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

    const member = await prisma.familyMemberProfile.findUnique({
      where: { id },
      select: { userId: true },
    });

    if (!member || (member.userId !== session.user.id && session.user.role !== "ADMIN")) {
      return NextResponse.json(
        { success: false, message: "Không có quyền sửa hồ sơ này." },
        { status: 403 }
      );
    }

    const data = validated.data;

    const updated = await prisma.familyMemberProfile.update({
      where: { id },
      data: {
        fullName: data.fullName ? data.fullName.trim() : undefined,
        relation: data.relation,
        dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth) : undefined,
        gender: data.gender,
        avatarEmoji: data.avatarEmoji,
        healthGoals: data.healthGoals,
        allergies: data.allergies,
        weightKg: data.weightKg,
        heightCm: data.heightCm,
        notes: data.notes,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Cập nhật hồ sơ thành viên thành công!",
      member: updated,
    });
  } catch (error: any) {
    console.error("Lỗi khi cập nhật thành viên:", error);
    return NextResponse.json(
      { success: false, message: "Không thể cập nhật hồ sơ." },
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

    const member = await prisma.familyMemberProfile.findUnique({
      where: { id },
      select: { userId: true },
    });

    if (!member || (member.userId !== session.user.id && session.user.role !== "ADMIN")) {
      return NextResponse.json(
        { success: false, message: "Không có quyền xóa hồ sơ này." },
        { status: 403 }
      );
    }

    await prisma.familyMemberProfile.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: "Đã xóa hồ sơ thành viên thành công.",
    });
  } catch (error: any) {
    console.error("Lỗi khi xóa thành viên:", error);
    return NextResponse.json(
      { success: false, message: "Không thể xóa hồ sơ thành viên." },
      { status: 500 }
    );
  }
}
