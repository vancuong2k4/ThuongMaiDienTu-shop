// ============================================================
// app/api/admin/flash-sales/[id]/items/[itemId]/route.ts
// REST API Cập Nhật & Gỡ Bỏ Sản Phẩm Khỏi Chiến Dịch Flash Sale (Stage 9.2)
// ============================================================

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { flashSaleItemUpdateSchema } from "@/lib/validations/flash-sale";

interface RouteParams {
  params: Promise<{
    id: string;
    itemId: string;
  }>;
}

export async function PUT(req: NextRequest, props: RouteParams) {
  try {
    const session = await auth();
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: flashSaleId, itemId } = await props.params;

    const existing = await prisma.flashSaleItem.findUnique({
      where: { id: itemId },
    });

    if (!existing || existing.flashSaleId !== flashSaleId) {
      return NextResponse.json(
        { error: "Không tìm thấy sản phẩm trong chiến dịch Flash Sale này" },
        { status: 404 }
      );
    }

    const body = await req.json();
    const validation = flashSaleItemUpdateSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.issues[0]?.message || "Dữ liệu không hợp lệ" },
        { status: 400 }
      );
    }

    const { salePrice, quantity, soldCount, limitPerUser } = validation.data;

    const updated = await prisma.flashSaleItem.update({
      where: { id: itemId },
      data: {
        ...(salePrice !== undefined && { salePrice }),
        ...(quantity !== undefined && { quantity }),
        ...(soldCount !== undefined && { soldCount }),
        ...(limitPerUser !== undefined && { limitPerUser }),
      },
    });

    return NextResponse.json({
      success: true,
      message: "Cập nhật sản phẩm Flash Sale thành công!",
      data: updated,
    });
  } catch (err: unknown) {
    console.error("PUT /api/admin/flash-sales/[id]/items/[itemId] error:", err);
    return NextResponse.json(
      { error: "Lỗi hệ thống khi cập nhật sản phẩm Flash Sale" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest, props: RouteParams) {
  try {
    const session = await auth();
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: flashSaleId, itemId } = await props.params;

    const existing = await prisma.flashSaleItem.findUnique({
      where: { id: itemId },
    });

    if (!existing || existing.flashSaleId !== flashSaleId) {
      return NextResponse.json(
        { error: "Không tìm thấy sản phẩm trong chiến dịch Flash Sale" },
        { status: 404 }
      );
    }

    await prisma.flashSaleItem.delete({
      where: { id: itemId },
    });

    return NextResponse.json({
      success: true,
      message: "Đã gỡ sản phẩm khỏi chiến dịch Flash Sale thành công!",
    });
  } catch (err: unknown) {
    console.error("DELETE /api/admin/flash-sales/[id]/items/[itemId] error:", err);
    return NextResponse.json(
      { error: "Lỗi hệ thống khi gỡ sản phẩm Flash Sale" },
      { status: 500 }
    );
  }
}
