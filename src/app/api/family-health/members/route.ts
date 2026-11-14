import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { createFamilyMemberSchema } from "@/lib/validations/family-health";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, message: "Vui lòng đăng nhập để truy cập tủ thuốc gia đình." },
        { status: 401 }
      );
    }

    const members = await prisma.familyMemberProfile.findMany({
      where: { userId: session.user.id },
      orderBy: [{ relation: "asc" }, { createdAt: "asc" }],
      include: {
        _count: {
          select: { supplementSchedules: { where: { isActive: true } } },
        },
      },
    });

    return NextResponse.json({ success: true, members });
  } catch (error: any) {
    console.error("Lỗi khi tải danh sách thành viên gia đình:", error);
    return NextResponse.json(
      { success: false, message: "Không thể tải hồ sơ gia đình." },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, message: "Vui lòng đăng nhập để thêm thành viên." },
        { status: 401 }
      );
    }

    const body = await req.json();
    const validated = createFamilyMemberSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        {
          success: false,
          message:
            validated.error.issues[0]?.message || "Dữ liệu thành viên không hợp lệ.",
        },
        { status: 400 }
      );
    }

    const data = validated.data;

    const member = await prisma.familyMemberProfile.create({
      data: {
        userId: session.user.id,
        fullName: data.fullName.trim(),
        relation: data.relation,
        dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth) : null,
        gender: data.gender || null,
        avatarEmoji: data.avatarEmoji || "👶",
        healthGoals: data.healthGoals || [],
        allergies: data.allergies || [],
        weightKg: data.weightKg || null,
        heightCm: data.heightCm || null,
        notes: data.notes || null,
      },
    });

    return NextResponse.json(
      { success: true, message: "Thêm thành viên gia đình thành công!", member },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Lỗi khi thêm thành viên gia đình:", error);
    return NextResponse.json(
      { success: false, message: "Không thể lưu hồ sơ thành viên gia đình." },
      { status: 500 }
    );
  }
}
