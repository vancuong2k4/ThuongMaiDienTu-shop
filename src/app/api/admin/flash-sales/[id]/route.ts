// ============================================================
// app/api/admin/flash-sales/[id]/route.ts
// REST API Chi Tiết, Cập Nhật & Xóa Chiến Dịch Flash Sale (Stage 9.2)
// ============================================================

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { flashSaleUpdateSchema } from "@/lib/validations/flash-sale";

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

export async function GET(req: NextRequest, props: RouteParams) {
  try {
    const session = await auth();
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await props.params;

    const campaign = await prisma.flashSale.findUnique({
      where: { id },
      include: {
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                slug: true,
                brand: true,
                origin: true,
                images: {
                  take: 1,
                  orderBy: { sortOrder: "asc" },
                  select: { url: true },
                },
              },
            },
            variant: {
              select: {
                id: true,
                name: true,
                sku: true,
                price: true,
                originalPrice: true,
                stock: true,
                image: true,
              },
            },
          },
          orderBy: { id: "asc" },
        },
      },
    });

    if (!campaign) {
      return NextResponse.json(
        { error: "Không tìm thấy chiến dịch Flash Sale" },
        { status: 404 }
      );
    }

    const now = new Date();
    const isCurrentlyActive =
      campaign.isActive &&
      campaign.startTime <= now &&
      campaign.endTime >= now;
    const isUpcoming = campaign.startTime > now;
    const status = isCurrentlyActive
      ? "ACTIVE"
      : isUpcoming
      ? "UPCOMING"
      : "ENDED";

    const serializedItems = campaign.items.map((item) => ({
      id: item.id,
      flashSaleId: item.flashSaleId,
      productId: item.productId,
      variantId: item.variantId,
      salePrice: Number(item.salePrice),
      quantity: item.quantity,
      soldCount: item.soldCount,
      limitPerUser: item.limitPerUser,
      product: {
        id: item.product.id,
        name: item.product.name,
        slug: item.product.slug,
        brand: item.product.brand,
        origin: item.product.origin,
        imageUrl: item.product.images[0]?.url || item.variant.image || null,
      },
      variant: {
        id: item.variant.id,
        name: item.variant.name,
        sku: item.variant.sku,
        regularPrice: Number(item.variant.price),
        originalPrice: item.variant.originalPrice
          ? Number(item.variant.originalPrice)
          : null,
        stock: item.variant.stock,
      },
      soldPercentage:
        item.quantity > 0
          ? Math.round((item.soldCount / item.quantity) * 100)
          : 0,
    }));

    return NextResponse.json({
      success: true,
      data: {
        id: campaign.id,
        name: campaign.name,
        description: campaign.description,
        bannerImage: campaign.bannerImage,
        startTime: campaign.startTime.toISOString(),
        endTime: campaign.endTime.toISOString(),
        isActive: campaign.isActive,
        createdAt: campaign.createdAt.toISOString(),
        updatedAt: campaign.updatedAt.toISOString(),
        status,
        items: serializedItems,
      },
    });
  } catch (err: unknown) {
    console.error("GET /api/admin/flash-sales/[id] error:", err);
    return NextResponse.json(
      { error: "Lỗi hệ thống khi tải chi tiết Flash Sale" },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest, props: RouteParams) {
  try {
    const session = await auth();
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await props.params;
    const body = await req.json();

    const validation = flashSaleUpdateSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.issues[0]?.message || "Dữ liệu không hợp lệ" },
        { status: 400 }
      );
    }

    const existing = await prisma.flashSale.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json(
        { error: "Không tìm thấy chiến dịch Flash Sale" },
        { status: 404 }
      );
    }

    const { name, description, bannerImage, startTime, endTime, isActive } =
      validation.data;

    const updated = await prisma.flashSale.update({
      where: { id },
      data: {
        ...(name !== undefined && { name }),
        ...(description !== undefined && { description }),
        ...(bannerImage !== undefined && { bannerImage: bannerImage || null }),
        ...(startTime !== undefined && { startTime }),
        ...(endTime !== undefined && { endTime }),
        ...(isActive !== undefined && { isActive }),
      },
    });

    return NextResponse.json({
      success: true,
      message: "Cập nhật chiến dịch Flash Sale thành công!",
      data: updated,
    });
  } catch (err: unknown) {
    console.error("PUT /api/admin/flash-sales/[id] error:", err);
    return NextResponse.json(
      { error: "Lỗi hệ thống khi cập nhật Flash Sale" },
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

    const { id } = await props.params;

    const existing = await prisma.flashSale.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json(
        { error: "Không tìm thấy chiến dịch Flash Sale" },
        { status: 404 }
      );
    }

    await prisma.flashSale.delete({ where: { id } });

    return NextResponse.json({
      success: true,
      message: "Đã xóa chiến dịch Flash Sale thành công!",
    });
  } catch (err: unknown) {
    console.error("DELETE /api/admin/flash-sales/[id] error:", err);
    return NextResponse.json(
      { error: "Lỗi hệ thống khi xóa chiến dịch Flash Sale" },
      { status: 500 }
    );
  }
}
