// ============================================================
// app/api/admin/flash-sales/[id]/items/route.ts
// REST API Thêm Sản Phẩm Deal Vào Chiến Dịch Flash Sale (Stage 9.2)
// ============================================================

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { flashSaleItemCreateSchema } from "@/lib/validations/flash-sale";

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

export async function POST(req: NextRequest, props: RouteParams) {
  try {
    const session = await auth();
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: flashSaleId } = await props.params;

    // Check campaign existence
    const campaign = await prisma.flashSale.findUnique({
      where: { id: flashSaleId },
    });
    if (!campaign) {
      return NextResponse.json(
        { error: "Không tìm thấy chiến dịch Flash Sale" },
        { status: 404 }
      );
    }

    const body = await req.json();
    const validation = flashSaleItemCreateSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.issues[0]?.message || "Dữ liệu không hợp lệ" },
        { status: 400 }
      );
    }

    const { productId, variantId, salePrice, quantity, limitPerUser } =
      validation.data;

    // Check if variant exists
    const variant = await prisma.productVariant.findUnique({
      where: { id: variantId },
    });
    if (!variant || variant.productId !== productId) {
      return NextResponse.json(
        { error: "Biến thể sản phẩm không tồn tại hoặc không khớp" },
        { status: 400 }
      );
    }

    // Upsert or create deal item
    const item = await prisma.flashSaleItem.upsert({
      where: {
        flashSaleId_variantId: {
          flashSaleId,
          variantId,
        },
      },
      create: {
        flashSaleId,
        productId,
        variantId,
        salePrice,
        quantity,
        limitPerUser: limitPerUser || 1,
        soldCount: 0,
      },
      update: {
        salePrice,
        quantity,
        limitPerUser: limitPerUser || 1,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Đã thêm sản phẩm vào chiến dịch Flash Sale thành công!",
        data: item,
      },
      { status: 201 }
    );
  } catch (err: unknown) {
    console.error("POST /api/admin/flash-sales/[id]/items error:", err);
    return NextResponse.json(
      { error: "Lỗi hệ thống khi thêm sản phẩm vào Flash Sale" },
      { status: 500 }
    );
  }
}
