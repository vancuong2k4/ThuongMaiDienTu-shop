// ============================================================
// app/api/products/[slug]/qa/route.ts
// REST API Hỏi Đáp Chuyên Gia Sữa & TPCN Úc (Community Q&A - Phase 14)
// ============================================================

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ReviewStatus } from "@prisma/client";
import { auth } from "@/lib/auth";
import { askQuestionSchema } from "@/lib/validations/review";

interface RouteParams {
  params: Promise<{ slug: string }>;
}

/**
 * GET: Lấy danh sách câu hỏi & trả lời của sản phẩm
 */
export async function GET(req: NextRequest, { params }: RouteParams) {
  try {
    const { slug } = await params;

    const product = await prisma.product.findUnique({
      where: { slug },
      select: { id: true },
    });

    if (!product) {
      return NextResponse.json(
        { error: "Không tìm thấy sản phẩm" },
        { status: 404 }
      );
    }

    const questions = await prisma.productQuestion.findMany({
      where: {
        productId: product.id,
        status: { in: [ReviewStatus.APPROVED, ReviewStatus.FEATURED] },
      },
      orderBy: { createdAt: "desc" },
      include: {
        user: {
          select: {
            name: true,
            avatar: true,
            membershipTier: true,
          },
        },
        answers: {
          orderBy: [{ isOfficial: "desc" }, { createdAt: "asc" }],
          include: {
            user: {
              select: {
                name: true,
                avatar: true,
                role: true,
              },
            },
          },
        },
      },
    });

    const formatted = questions.map((q) => ({
      id: q.id,
      question: q.question,
      isAnswered: q.isAnswered,
      createdAt: q.createdAt.toISOString(),
      user: {
        name: q.user.name || "Khách hàng",
        avatar: q.user.avatar,
        membershipTier: q.user.membershipTier,
      },
      answers: q.answers.map((a) => ({
        id: a.id,
        answer: a.answer,
        isOfficial: a.isOfficial,
        createdAt: a.createdAt.toISOString(),
        user: {
          name: a.isOfficial ? "Dược sĩ THUYNGA Shop" : a.user.name || "Thành viên",
          avatar: a.user.avatar,
          role: a.user.role,
        },
      })),
    }));

    return NextResponse.json({
      success: true,
      questions: formatted,
      totalQuestions: formatted.length,
    });
  } catch (error) {
    console.error("GET /api/products/[slug]/qa error:", error);
    return NextResponse.json(
      { error: "Đã xảy ra lỗi khi tải danh sách hỏi đáp" },
      { status: 500 }
    );
  }
}

/**
 * POST: Khách hàng đặt câu hỏi mới cho sản phẩm
 */
export async function POST(req: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Vui lòng đăng nhập để gửi câu hỏi cho chuyên gia" },
        { status: 401 }
      );
    }

    const { slug } = await params;
    const body = await req.json();

    const product = await prisma.product.findUnique({
      where: { slug },
      select: { id: true, name: true },
    });

    if (!product) {
      return NextResponse.json(
        { error: "Không tìm thấy sản phẩm" },
        { status: 404 }
      );
    }

    const result = askQuestionSchema.safeParse({
      productId: product.id,
      question: body.question,
    });

    if (!result.success) {
      return NextResponse.json(
        {
          error: "Dữ liệu câu hỏi không hợp lệ",
          details: result.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const newQuestion = await prisma.productQuestion.create({
      data: {
        productId: product.id,
        userId: session.user.id,
        question: result.data.question.trim(),
        status: ReviewStatus.APPROVED, // Tự động hiển thị để cộng đồng thảo luận
        isAnswered: false,
      },
      include: {
        user: {
          select: {
            name: true,
            avatar: true,
            membershipTier: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      message: "Gửi câu hỏi thành công! Dược sĩ THUYNGA sẽ phản hồi sớm nhất.",
      question: {
        id: newQuestion.id,
        question: newQuestion.question,
        isAnswered: false,
        createdAt: newQuestion.createdAt.toISOString(),
        user: {
          name: newQuestion.user.name || "Khách hàng",
          avatar: newQuestion.user.avatar,
          membershipTier: newQuestion.user.membershipTier,
        },
        answers: [],
      },
    });
  } catch (error) {
    console.error("POST /api/products/[slug]/qa error:", error);
    return NextResponse.json(
      { error: "Đã xảy ra lỗi khi gửi câu hỏi" },
      { status: 500 }
    );
  }
}
