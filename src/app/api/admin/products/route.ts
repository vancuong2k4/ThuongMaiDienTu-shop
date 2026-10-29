// ============================================================
// app/api/admin/products/route.ts
// API Quản lý Danh sách & Tạo mới Sản phẩm Admin CMS
// ============================================================

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { productFormSchema } from "@/lib/validations/product";
import { Prisma } from "@prisma/client";

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
    const limit = Math.max(1, Math.min(100, parseInt(searchParams.get("limit") || "10")));
    const skip = (page - 1) * limit;

    const search = searchParams.get("search")?.trim() || "";
    const categoryId = searchParams.get("categoryId") || "";
    const origin = searchParams.get("origin") || "";
    const stockStatus = searchParams.get("stockStatus") || "";
    const isActiveParam = searchParams.get("isActive") || "";
    const isFeaturedParam = searchParams.get("isFeatured") || "";
    const sortBy = searchParams.get("sortBy") || "createdAt_desc";

    // ── Xây dựng câu điều kiện WHERE ─────────────────────────────
    const where: Prisma.ProductWhereInput = {};

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { brand: { contains: search, mode: "insensitive" } },
        {
          variants: {
            some: {
              OR: [
                { sku: { contains: search, mode: "insensitive" } },
                { name: { contains: search, mode: "insensitive" } },
              ],
            },
          },
        },
      ];
    }

    if (categoryId && categoryId !== "all") {
      // Tìm cả danh mục này và danh mục con của nó
      const childCategories = await prisma.category.findMany({
        where: { parentId: categoryId },
        select: { id: true },
      });
      const categoryIds = [categoryId, ...childCategories.map((c) => c.id)];
      where.categoryId = { in: categoryIds };
    }

    if (origin && origin !== "all") {
      where.origin = origin;
    }

    if (isActiveParam === "true") where.isActive = true;
    if (isActiveParam === "false") where.isActive = false;

    if (isFeaturedParam === "true") where.isFeatured = true;
    if (isFeaturedParam === "false") where.isFeatured = false;

    if (stockStatus === "out_of_stock") {
      // Hết hàng: tất cả variant đều có stock = 0
      where.variants = {
        none: { stock: { gt: 0 } },
      };
    } else if (stockStatus === "low_stock") {
      // Sắp hết hàng: có ít nhất 1 variant stock <= 10 và > 0
      where.variants = {
        some: { stock: { lte: 10, gt: 0 } },
      };
    } else if (stockStatus === "in_stock") {
      // Còn hàng dồi dào: có variant stock > 10
      where.variants = {
        some: { stock: { gt: 10 } },
      };
    }

    // ── Xử lý sắp xếp ───────────────────────────────────────────
    let orderBy: Prisma.ProductOrderByWithRelationInput = { createdAt: "desc" };
    if (sortBy === "createdAt_asc") orderBy = { createdAt: "asc" };
    if (sortBy === "name_asc") orderBy = { name: "asc" };
    if (sortBy === "name_desc") orderBy = { name: "desc" };

    // ── Truy vấn dữ liệu song song ─────────────────────────────
    const [total, products] = await Promise.all([
      prisma.product.count({ where }),
      prisma.product.findMany({
        where,
        skip,
        take: limit,
        orderBy,
        include: {
          category: {
            select: { id: true, name: true, slug: true },
          },
          images: {
            orderBy: { sortOrder: "asc" },
            take: 1,
          },
          variants: {
            orderBy: { sortOrder: "asc" },
            select: {
              id: true,
              name: true,
              sku: true,
              price: true,
              originalPrice: true,
              stock: true,
              isActive: true,
              isDefault: true,
            },
          },
          _count: {
            select: { reviews: true },
          },
        },
      }),
    ]);

    // ── Tính toán các chỉ số dẫn xuất cho từng sản phẩm ─────────
    const items = products.map((prod) => {
      const prices = prod.variants.map((v) => Number(v.price));
      const minPrice = prices.length > 0 ? Math.min(...prices) : 0;
      const maxPrice = prices.length > 0 ? Math.max(...prices) : 0;
      const totalStock = prod.variants.reduce((acc, v) => acc + v.stock, 0);

      return {
        id: prod.id,
        name: prod.name,
        slug: prod.slug,
        brand: prod.brand,
        origin: prod.origin,
        specification: prod.specification,
        isActive: prod.isActive,
        isFeatured: prod.isFeatured,
        createdAt: prod.createdAt,
        updatedAt: prod.updatedAt,
        category: prod.category,
        thumbnail: prod.images[0]?.url || null,
        minPrice,
        maxPrice,
        totalStock,
        variantCount: prod.variants.length,
        reviewCount: prod._count.reviews,
        variants: prod.variants.map((v) => ({
          ...v,
          price: Number(v.price),
          originalPrice: v.originalPrice ? Number(v.originalPrice) : null,
        })),
      };
    });

    return NextResponse.json({
      items,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Lỗi khi lấy danh sách sản phẩm:", error);
    return NextResponse.json(
      { error: "Không thể lấy danh sách sản phẩm" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const parsed = productFormSchema.safeParse(body);

    if (!parsed.success) {
      const firstError = parsed.error.issues[0]?.message || "Dữ liệu không hợp lệ";
      return NextResponse.json({ error: firstError, details: parsed.error.format() }, { status: 400 });
    }

    const data = parsed.data;

    // 1. Kiểm tra slug đã tồn tại chưa
    const existingSlug = await prisma.product.findUnique({
      where: { slug: data.slug },
      select: { id: true },
    });
    if (existingSlug) {
      return NextResponse.json(
        { error: `Đường dẫn slug "${data.slug}" đã tồn tại. Vui lòng chọn slug khác.` },
        { status: 400 }
      );
    }

    // 2. Kiểm tra SKU của các biến thể có bị trùng trong nội bộ hoặc trong DB không
    const skus = data.variants.map((v) => v.sku);
    const uniqueSkus = new Set(skus);
    if (uniqueSkus.size !== skus.length) {
      return NextResponse.json(
        { error: "Mã SKU của các biến thể trong sản phẩm này không được trùng nhau." },
        { status: 400 }
      );
    }

    const duplicateSkusInDb = await prisma.productVariant.findMany({
      where: { sku: { in: skus } },
      select: { sku: true },
    });

    if (duplicateSkusInDb.length > 0) {
      return NextResponse.json(
        {
          error: `Mã SKU [${duplicateSkusInDb.map((s) => s.sku).join(", ")}] đã tồn tại trong hệ thống. Vui lòng nhập SKU khác.`,
        },
        { status: 400 }
      );
    }

    // 3. Đảm bảo có ít nhất 1 biến thể là default
    const hasDefault = data.variants.some((v) => v.isDefault);
    const variantsToCreate = data.variants.map((v, index) => ({
      name: v.name,
      sku: v.sku,
      price: new Prisma.Decimal(v.price),
      originalPrice: v.originalPrice ? new Prisma.Decimal(v.originalPrice) : null,
      stock: v.stock,
      weight: v.weight || null,
      image: v.image || null,
      isDefault: hasDefault ? v.isDefault : index === 0,
      isActive: v.isActive,
      sortOrder: v.sortOrder || index,
    }));

    // 4. Tạo Product cùng variants và images trong Transaction
    const newProduct = await prisma.$transaction(async (tx) => {
      const product = await tx.product.create({
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
          variants: {
            create: variantsToCreate,
          },
          images: {
            create: data.images.map((img, idx) => ({
              url: img.url,
              alt: img.alt || data.name,
              sortOrder: img.sortOrder ?? idx,
            })),
          },
        },
        include: {
          variants: true,
          images: true,
        },
      });

      return product;
    });

    return NextResponse.json({
      success: true,
      message: "Tạo sản phẩm mới thành công",
      product: {
        id: newProduct.id,
        name: newProduct.name,
        slug: newProduct.slug,
      },
    });
  } catch (error) {
    console.error("Lỗi khi tạo sản phẩm:", error);
    return NextResponse.json(
      { error: "Đã xảy ra lỗi khi lưu sản phẩm. Vui lòng thử lại." },
      { status: 500 }
    );
  }
}
