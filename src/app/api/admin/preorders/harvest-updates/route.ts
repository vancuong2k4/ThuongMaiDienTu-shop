import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { createHarvestUpdateSchema } from "@/lib/validations/preorder";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (session?.user?.role !== "ADMIN") {
      return NextResponse.json(
        { success: false, message: "Không có quyền truy cập." },
        { status: 403 }
      );
    }

    const body = await req.json();
    const validated = createHarvestUpdateSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        {
          success: false,
          message:
            validated.error.issues[0]?.message || "Dữ liệu nhật ký không hợp lệ.",
        },
        { status: 400 }
      );
    }

    const data = validated.data;

    const update = await prisma.harvestUpdate.create({
      data: {
        campaignId: data.campaignId,
        title: data.title,
        content: data.content,
        brixRecorded: data.brixRecorded || null,
        sizeRecordedMm: data.sizeRecordedMm || null,
        weatherCondition: data.weatherCondition || null,
        photos: data.photos || [],
        reportedAt: data.reportedAt ? new Date(data.reportedAt) : new Date(),
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Xuất bản nhật ký nông trường thành công!",
        update,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Lỗi khi tạo nhật ký nông trường:", error);
    return NextResponse.json(
      { success: false, message: "Không thể lưu nhật ký nông trường." },
      { status: 500 }
    );
  }
}
