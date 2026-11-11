// ============================================================
// app/api/products/[slug]/qa/[questionId]/answer/route.ts
// REST API Trả lời câu hỏi cộng đồng (Pharmacist / Community Answer)
// ============================================================

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { answerQuestionSchema } from "@/lib/validations/review";
import { createInAppNotification } from "@/lib/notifications";

interface RouteParams {
  params: Promise<{ slug: string; questionId: string }>;
}

export async function POST(req: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Vui lòng đăng nhập để trả lời câu hỏi" },
        { status: 401 }
      );
    }

    const { slug, questionId } = await params;
    const body = await req.json();

    const result = answerQuestionSchema.safeParse({
      questionId,
      answer: body.answer,
      isOfficial: session.user.role === "ADMIN",
    });

    if (!result.success) {
      return NextResponse.json(
        {
          error: "Dữ liệu trả lời không hợp lệ",
          details: result.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const question = await prisma.productQuestion.findUnique({
      where: { id: questionId },
      include: { product: { select: { name: true, slug: true } } },
    });

    if (!question) {
      return NextResponse.json(
        { error: "Không tìm thấy câu hỏi" },
        { status: 404 }
      );
    }

    const isOfficial = session.user.role === "ADMIN";

    const [answer] = await prisma.$transaction([
      prisma.productAnswer.create({
        data: {
          questionId,
          userId: session.user.id,
          answer: result.data.answer.trim(),
          isOfficial,
        },
        include: {
          user: {
            select: {
              name: true,
              avatar: true,
              role: true,
            },
          },
        },
      }),
      prisma.productQuestion.update({
        where: { id: questionId },
        data: { isAnswered: true },
      }),
    ]);

    // Bắn thông báo In-App cho người đặt câu hỏi nếu người trả lời khác họ
    if (question.userId !== session.user.id) {
      await createInAppNotification({
        userId: question.userId,
        title: isOfficial
          ? "👨‍⚕️ Dược sĩ THUYNGA đã trả lời câu hỏi của bạn!"
          : "💬 Có câu trả lời mới cho thắc mắc của bạn",
        message: `Câu hỏi về sản phẩm "${question.product.name}" của bạn đã nhận được phản hồi mới.`,
        type: "SYSTEM",
        link: `/san-pham/${slug}`,
      });
    }

    return NextResponse.json({
      success: true,
      message: "Gửi câu trả lời thành công!",
      answer: {
        id: answer.id,
        answer: answer.answer,
        isOfficial: answer.isOfficial,
        createdAt: answer.createdAt.toISOString(),
        user: {
          name: answer.isOfficial ? "Dược sĩ THUYNGA Shop" : answer.user.name || "Thành viên",
          avatar: answer.user.avatar,
          role: answer.user.role,
        },
      },
    });
  } catch (error) {
    console.error("POST /api/products/[slug]/qa/[questionId]/answer error:", error);
    return NextResponse.json(
      { error: "Đã xảy ra lỗi khi gửi câu trả lời" },
      { status: 500 }
    );
  }
}
