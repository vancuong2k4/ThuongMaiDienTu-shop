// ============================================================
// app/api/quiz/questions/route.ts
// Lấy Danh Sách Câu Hỏi Trắc Nghiệm Dinh Dưỡng Theo Nhóm Đối Tượng (Phase 16)
// ============================================================

import { NextRequest, NextResponse } from "next/server";
import { getQuizQuestionsByTargetGroup } from "@/lib/protocols";
import { HealthTargetGroup } from "@prisma/client";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const targetGroupParam = searchParams.get("targetGroup") || "BABY_KIDS";

    const targetGroup = Object.values(HealthTargetGroup).includes(
      targetGroupParam as HealthTargetGroup
    )
      ? (targetGroupParam as HealthTargetGroup)
      : HealthTargetGroup.BABY_KIDS;

    const questions = await getQuizQuestionsByTargetGroup(targetGroup);

    return NextResponse.json({
      success: true,
      data: questions,
    });
  } catch (error) {
    console.error("GET /api/quiz/questions error:", error);
    return NextResponse.json(
      { error: "Đã xảy ra lỗi khi tải ngân hàng câu hỏi trắc nghiệm" },
      { status: 500 }
    );
  }
}
