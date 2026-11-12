// ============================================================
// app/api/gift-boxes/[id]/route.ts
// Public API lấy thông tin chi tiết giỏ quà tùy biến theo id hoặc mã (Phase 17)
// ============================================================

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const hamper = await prisma.giftCustomHamper.findFirst({
      where: {
        OR: [{ id }, { hamperCode: id }],
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

    if (!hamper) {
      return NextResponse.json(
        { success: false, message: "Không tìm thấy thông tin giỏ quà." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        ...hamper,
        totalPrice: Number(hamper.totalPrice),
        template: {
          ...hamper.template,
          basePrice: Number(hamper.template.basePrice),
        },
        items: hamper.items.map((item) => ({
          ...item,
          unitPrice: Number(item.unitPrice),
          variant: item.variant
            ? {
                ...item.variant,
                price: Number(item.variant.price),
              }
            : null,
        })),
      },
    });
  } catch (error) {
    console.error("Lỗi khi lấy chi tiết giỏ quà:", error);
    return NextResponse.json(
      { success: false, message: "Không thể lấy thông tin giỏ quà." },
      { status: 500 }
    );
  }
}
