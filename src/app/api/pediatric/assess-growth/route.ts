import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { growthAssessmentInputSchema } from "@/lib/validations/pediatric-growth";
import { assessChildGrowth } from "@/lib/pediatric-growth";

// ============================================================
// app/api/pediatric/assess-growth/route.ts
// Đánh Giá Thể Trạng Trẻ Em Chuẩn Bách Phân Vị WHO & Lưu Hồ Sơ (Phase 23)
// ============================================================

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    const userId = session?.user?.id || null;

    const body = await req.json();
    const validated = growthAssessmentInputSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Dữ liệu thể trạng của bé không hợp lệ.",
          errors: validated.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const { childName, gender, birthDate, weightKg, heightCm, memberProfileId } =
      validated.data;

    const assessment = await assessChildGrowth({
      childName,
      gender,
      birthDate,
      weightKg,
      heightCm,
      memberProfileId: memberProfileId || null,
      userId,
    });

    return NextResponse.json({
      success: true,
      data: assessment,
      savedToUserAccount: Boolean(userId),
    });
  } catch (error: any) {
    console.error("Lỗi khi đánh giá thể trạng bé theo chuẩn WHO:", error);
    return NextResponse.json(
      {
        success: false,
        message: error.message || "Lỗi hệ thống khi đánh giá thể trạng.",
      },
      { status: 500 }
    );
  }
}
