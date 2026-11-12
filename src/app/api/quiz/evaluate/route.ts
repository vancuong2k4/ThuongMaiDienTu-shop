// ============================================================
// app/api/quiz/evaluate/route.ts
// Đánh Giá Trắc Nghiệm Sức Khỏe & Trả Về Phác Đồ Cá Nhân Hóa (Phase 16)
// ============================================================

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { submitAssessmentSchema } from "@/lib/validations/protocol";
import { evaluateAssessmentAndMatchProtocol } from "@/lib/protocols";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    const body = await req.json();

    const parsed = submitAssessmentSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Dữ liệu trả lời không hợp lệ", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const result = await evaluateAssessmentAndMatchProtocol(
      parsed.data,
      session?.user?.id
    );

    return NextResponse.json({
      success: true,
      message: "Đánh giá sức khỏe thành công! Đã tạo phác đồ cá nhân hóa.",
      data: result,
    });
  } catch (error) {
    console.error("POST /api/quiz/evaluate error:", error);
    return NextResponse.json(
      { error: "Đã xảy ra lỗi khi đánh giá phác đồ dinh dưỡng" },
      { status: 500 }
    );
  }
}
