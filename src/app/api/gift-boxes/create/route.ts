// ============================================================
// app/api/gift-boxes/create/route.ts
// Public API tạo và lưu cấu hình giỏ quà tùy biến của khách hàng (Phase 17)
// ============================================================

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { createCustomHamperSchema } from "@/lib/validations/gift-box";
import {
  calculateHamperCapacityAndTotal,
  generateHamperCode,
} from "@/lib/gift-box";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    const body = await req.json();

    const parsed = createCustomHamperSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Dữ liệu giỏ quà không hợp lệ.",
          errors: parsed.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const {
      templateId,
      occasion,
      ribbonColor,
      hasWaxSeal,
      hasLedLights,
      greetingCardMessage,
      cardSenderName,
      cardReceiverName,
      notes,
      items,
    } = parsed.data;

    // Tính toán dung lượng và giá chính thức
    const calculation = await calculateHamperCapacityAndTotal({
      templateId,
      hasLedLights,
      items,
    });

    if (!calculation.valid) {
      return NextResponse.json(
        { success: false, message: calculation.error },
        { status: 400 }
      );
    }

    const hamperCode = await generateHamperCode();

    const hamper = await prisma.giftCustomHamper.create({
      data: {
        hamperCode,
        templateId,
        userId: session?.user?.id || null,
        sessionId: body.sessionId || null,
        occasion,
        ribbonColor,
        hasWaxSeal,
        hasLedLights,
        greetingCardMessage,
        cardSenderName,
        cardReceiverName,
        totalPrice: calculation.totalPrice,
        notes,
        items: {
          create: items.map((item) => ({
            productId: item.productId,
            variantId: item.variantId || null,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            slotCost: item.slotCost || 1,
          })),
        },
      },
      include: {
        template: true,
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                slug: true,
                images: {
                  select: { url: true },
                  take: 1,
                },
              },
            },
            variant: {
              select: {
                id: true,
                name: true,
                price: true,
              },
            },
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      message: "Tạo cấu hình giỏ quà tùy biến thành công!",
      data: {
        id: hamper.id,
        hamperCode: hamper.hamperCode,
        totalPrice: Number(hamper.totalPrice),
        calculation,
        hamper,
      },
    });
  } catch (error: any) {
    console.error("Lỗi khi tạo giỏ quà tùy biến:", error);
    return NextResponse.json(
      {
        success: false,
        message: error.message || "Không thể tạo giỏ quà. Vui lòng thử lại sau.",
      },
      { status: 500 }
    );
  }
}
