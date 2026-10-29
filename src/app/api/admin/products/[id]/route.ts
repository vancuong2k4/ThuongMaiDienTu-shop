// ============================================================
// app/api/admin/products/[id]/route.ts
// API Chi tiết, Cập nhật & Xóa Sản phẩm Admin CMS
// ============================================================

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { productFormSchema } from "@/lib/validations/product";
import { Prisma } from "@prisma/client";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(req: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth();
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        category: {
          select: { id: true, name: true, slug: true },
        },
        images: {
          orderBy: { sortOrder: "asc" },
        },
        variants: {
          orderBy: { sortOrder: "asc" },
        },
      },
    });

    if (!product) {
      return NextResponse.json(
        { error: "Không tìm thấy sản phẩm" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      product: {
        ...product,
        variants: product.variants.map((v) => ({
          ...v,
          price: Number(v.price),
          originalPrice: v.originalPrice ? Number(v.originalPrice) : null,
        })),
      },
    });
  } catch (error) {
    console.error("Lỗi khi lấy chi tiết sản phẩm:", error);
    return NextResponse.json(
      { error: "Lỗi hệ thống khi tải sản phẩm" },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth();
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const existingProduct = await prisma.product.findUnique({
      where: { id },
      include: { variants: true },
    });

    if (!existingProduct) {
      return NextResponse.json(
        { error: "Sản phẩm không tồn tại" },
        { status: 404 }
      );
    }

    const body = await req.json();
    const parsed = productFormSchema.safeParse(body);

    if (!parsed.success) {
      const firstError = parsed.error.issues[0]?.message || "Dữ liệu không hợp lệ";
      return NextResponse.json({ error: firstError, details: parsed.error.format() }, { status: 400 });
    }

    const data = parsed.data;

    // 1. Kiểm tra slug trùng lặp với sản phẩm khác
    if (data.slug !== existingProduct.slug) {
      const duplicateSlug = await prisma.product.findFirst({
        where: {
          slug: data.slug,
          id: { not: id },
        },
        select: { id: true },
      });
      if (duplicateSlug) {
        return NextResponse.json(
          { error: `Đường dẫn slug "${data.slug}" đã được sử dụng bởi sản phẩm khác.` },
          { status: 400 }
        );
      }
    }

    // 2. Kiểm tra SKU trùng lặp nội bộ và với các sản phẩm khác
    const skus = data.variants.map((v) => v.sku);
    const uniqueSkus = new Set(skus);
    if (uniqueSkus.size !== skus.length) {
      return NextResponse.json(
        { error: "Mã SKU của các biến thể trong sản phẩm không được trùng nhau." },
        { status: 400 }
      );
    }

    const duplicateSkus = await prisma.productVariant.findMany({
      where: {
        sku: { in: skus },
        productId: { not: id },
      },
      select: { sku: true },
    });

    if (duplicateSkus.length > 0) {
      return NextResponse.json(
        {
          error: `Mã SKU [${duplicateSkus.map((s) => s.sku).join(", ")}] đã được sử dụng ở sản phẩm khác.`,
        },
        { status: 400 }
      );
    }

    // 3. Thực hiện cập nhật trong Transaction an toàn
    const updated = await prisma.$transaction(async (tx) => {
      // a. Cập nhật thông tin chung của Product
      await tx.product.update({
        where: { id },
        data: {
          name: data.name,
          slug: data.slug,
          categoryId: data.categoryId,
          brand: data.brand || null,
          origin: data.origin || null,
          specification: data.specification || null,
          expiryInfo: data.expiryInfo || null,
          shortDesc: data.shortDesc || null,
          description: data.description || null,
          isFeatured: data.isFeatured,
          isActive: data.isActive,
          seoTitle: data.seoTitle || null,
          seoDesc: data.seoDesc || null,
          seoKeywords: data.seoKeywords || null,
        },
      });

      // b. Xử lý hình ảnh (Xóa ảnh cũ và tạo lại danh sách ảnh mới theo thứ tự)
      await tx.productImage.deleteMany({
        where: { productId: id },
      });

      if (data.images.length > 0) {
        await tx.productImage.createMany({
          data: data.images.map((img, idx) => ({
            productId: id,
            url: img.url,
            alt: img.alt || data.name,
            sortOrder: img.sortOrder ?? idx,
          })),
        });
      }

      // c. Xử lý biến thể (variants)
      const existingVariantIds = existingProduct.variants.map((v) => v.id);
      const incomingVariantIds = data.variants
        .map((v) => v.id)
        .filter((vid): vid is string => Boolean(vid));

      // Biến thể bị xóa khỏi form
      const removedVariantIds = existingVariantIds.filter(
        (vid) => !incomingVariantIds.includes(vid)
      );

      // Kiểm tra biến thể bị xóa có đơn hàng liên kết không
      for (const removedId of removedVariantIds) {
        const orderCount = await tx.orderItem.count({
          where: { variantId: removedId },
        });
        if (orderCount > 0) {
          // Có đơn hàng liên kết -> không xóa cứng, chỉ vô hiệu hóa
          await tx.productVariant.update({
            where: { id: removedId },
            data: { isActive: false },
          });
        } else {
          // Không có đơn hàng -> xóa an toàn
          await tx.productVariant.delete({
            where: { id: removedId },
          });
        }
      }

      // Đảm bảo có ít nhất 1 biến thể mặc định
      const hasDefault = data.variants.some((v) => v.isDefault);

      // Cập nhật hoặc thêm mới từng biến thể
      for (let i = 0; i < data.variants.length; i++) {
        const v = data.variants[i];
        const isDefaultVal = hasDefault ? v.isDefault : i === 0;

        if (v.id && existingVariantIds.includes(v.id)) {
          // Update
          await tx.productVariant.update({
            where: { id: v.id },
            data: {
              name: v.name,
              sku: v.sku,
              price: new Prisma.Decimal(v.price),
              originalPrice: v.originalPrice ? new Prisma.Decimal(v.originalPrice) : null,
              stock: v.stock,
              weight: v.weight || null,
              image: v.image || null,
              isDefault: isDefaultVal,
              isActive: v.isActive,
              sortOrder: v.sortOrder || i,
            },
          });
        } else {
          // Create new
          await tx.productVariant.create({
            data: {
              productId: id,
              name: v.name,
              sku: v.sku,
              price: new Prisma.Decimal(v.price),
              originalPrice: v.originalPrice ? new Prisma.Decimal(v.originalPrice) : null,
              stock: v.stock,
              weight: v.weight || null,
              image: v.image || null,
              isDefault: isDefaultVal,
              isActive: v.isActive,
              sortOrder: v.sortOrder || i,
            },
          });
        }
      }

      return tx.product.findUnique({
        where: { id },
        include: { variants: true, images: true },
      });
    });

    return NextResponse.json({
      success: true,
      message: "Cập nhật sản phẩm thành công",
      product: updated,
    });
  } catch (error) {
    console.error("Lỗi khi cập nhật sản phẩm:", error);
    return NextResponse.json(
      { error: "Không thể lưu cập nhật sản phẩm. Vui lòng kiểm tra lại." },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth();
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        variants: {
          select: { id: true },
        },
      },
    });

    if (!product) {
      return NextResponse.json(
        { error: "Sản phẩm không tồn tại" },
        { status: 404 }
      );
    }

    const variantIds = product.variants.map((v) => v.id);

    // Kiểm tra xem sản phẩm đã có đơn hàng nào chưa
    const orderItemsCount = await prisma.orderItem.count({
      where: { variantId: { in: variantIds } },
    });

    if (orderItemsCount > 0) {
      // Sản phẩm đã có hóa đơn -> Soft deactivation để bảo toàn dữ liệu kế toán
      await prisma.$transaction([
        prisma.product.update({
          where: { id },
          data: {
            isActive: false,
            isFeatured: false,
          },
        }),
        prisma.productVariant.updateMany({
          where: { productId: id },
          data: { isActive: false },
        }),
      ]);

      return NextResponse.json({
        success: true,
        action: "DEACTIVATED",
        message: `Sản phẩm này đã có ${orderItemsCount} lượt đặt hàng trong lịch sử. Hệ thống đã tự động chuyển sang trạng thái "Ngừng kinh doanh" thay vì xóa vĩnh viễn để bảo toàn dữ liệu kế toán & hóa đơn khách hàng.`,
      });
    }

    // Chưa từng có đơn hàng -> Xóa sạch an toàn (Cascade xóa variants và images)
    await prisma.product.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      action: "DELETED",
      message: "Đã xóa vĩnh viễn sản phẩm khỏi hệ thống thành công.",
    });
  } catch (error) {
    console.error("Lỗi khi xóa sản phẩm:", error);
    return NextResponse.json(
      { error: "Lỗi hệ thống khi xóa sản phẩm" },
      { status: 500 }
    );
  }
}
