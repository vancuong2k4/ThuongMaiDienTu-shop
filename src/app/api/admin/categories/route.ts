// ============================================================
// app/api/admin/categories/route.ts
// API Danh sách & Tạo mới Danh mục Ngành hàng Admin CMS
// ============================================================

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { categorySchema } from "@/lib/validations/category";

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search")?.trim() || "";

    // 1. Lấy toàn bộ danh mục kèm số lượng sản phẩm & danh mục con
    const categories = await prisma.category.findMany({
      where: search
        ? {
            OR: [
              { name: { contains: search, mode: "insensitive" } },
              { slug: { contains: search, mode: "insensitive" } },
            ],
          }
        : undefined,
      orderBy: [
        { sortOrder: "asc" },
        { name: "asc" },
      ],
      include: {
        parent: {
          select: { id: true, name: true, slug: true },
        },
        children: {
          orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
          include: {
            _count: {
              select: { products: true },
            },
          },
        },
        _count: {
          select: { products: true, children: true },
        },
      },
    });

    // 2. Định dạng & tính toán số lượng sản phẩm tổng (cả con) cho ngành hàng cha
    const formatted = categories.map((cat) => {
      const directCount = cat._count.products;
      const childCount = cat._count.children;
      const childrenProducts = cat.children.reduce(
        (sum, child) => sum + child._count.products,
        0
      );
      const totalProductCount = directCount + childrenProducts;

      return {
        id: cat.id,
        name: cat.name,
        slug: cat.slug,
        description: cat.description,
        image: cat.image,
        parentId: cat.parentId,
        parent: cat.parent,
        sortOrder: cat.sortOrder,
        isActive: cat.isActive,
        seoTitle: cat.seoTitle,
        seoDesc: cat.seoDesc,
        createdAt: cat.createdAt,
        updatedAt: cat.updatedAt,
        directProductCount: directCount,
        childCount,
        totalProductCount,
        children: cat.children.map((child) => ({
          id: child.id,
          name: child.name,
          slug: child.slug,
          description: child.description,
          image: child.image,
          parentId: child.parentId,
          sortOrder: child.sortOrder,
          isActive: child.isActive,
          directProductCount: child._count.products,
        })),
      };
    });

    // Tách thành danh mục gốc và danh mục con nếu không tìm kiếm
    const rootCategories = formatted.filter((c) => !c.parentId);
    const subCategories = formatted.filter((c) => !!c.parentId);

    return NextResponse.json({
      items: formatted,
      rootCategories,
      subCategories,
      totalCount: formatted.length,
    });
  } catch (error) {
    console.error("Lỗi khi lấy danh mục:", error);
    return NextResponse.json(
      { error: "Không thể lấy danh sách danh mục" },
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
    const parsed = categorySchema.safeParse(body);

    if (!parsed.success) {
      const firstError = parsed.error.issues[0]?.message || "Dữ liệu không hợp lệ";
      return NextResponse.json(
        { error: firstError, details: parsed.error.format() },
        { status: 400 }
      );
    }

    const data = parsed.data;

    // 1. Kiểm tra slug đã tồn tại chưa
    const existingSlug = await prisma.category.findUnique({
      where: { slug: data.slug },
      select: { id: true, name: true },
    });

    if (existingSlug) {
      return NextResponse.json(
        { error: `Đường dẫn slug "${data.slug}" đã được sử dụng bởi danh mục "${existingSlug.name}". Vui lòng chọn slug khác.` },
        { status: 400 }
      );
    }

    // 2. Nếu có parentId, kiểm tra parentId có tồn tại và không phải là cấp 3 (chỉ cho phép tối đa 2 cấp)
    if (data.parentId) {
      const parent = await prisma.category.findUnique({
        where: { id: data.parentId },
        select: { id: true, parentId: true },
      });

      if (!parent) {
        return NextResponse.json(
          { error: "Danh mục cha không tồn tại" },
          { status: 400 }
        );
      }

      if (parent.parentId) {
        return NextResponse.json(
          { error: "Hệ thống chỉ hỗ trợ phân cấp tối đa 2 tầng danh mục (Ngành hàng chính -> Phân loại chi tiết). Vui lòng chọn danh mục gốc làm danh mục cha." },
          { status: 400 }
        );
      }
    }

    // 3. Tạo mới danh mục
    const newCategory = await prisma.category.create({
      data: {
        name: data.name,
        slug: data.slug,
        parentId: data.parentId || null,
        description: data.description || null,
        image: data.image || null,
        sortOrder: data.sortOrder ?? 0,
        isActive: data.isActive ?? true,
        seoTitle: data.seoTitle || null,
        seoDesc: data.seoDesc || null,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Tạo danh mục mới thành công",
      category: newCategory,
    });
  } catch (error) {
    console.error("Lỗi khi tạo danh mục:", error);
    return NextResponse.json(
      { error: "Đã xảy ra lỗi khi tạo danh mục. Vui lòng thử lại." },
      { status: 500 }
    );
  }
}
