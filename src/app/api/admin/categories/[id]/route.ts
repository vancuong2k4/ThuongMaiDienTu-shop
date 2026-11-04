// ============================================================
// app/api/admin/categories/[id]/route.ts
// API Chi tiết, Cập nhật & Xóa Danh mục Ngành hàng
// ============================================================

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { categorySchema } from "@/lib/validations/category";

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

    const category = await prisma.category.findUnique({
      where: { id },
      include: {
        parent: {
          select: { id: true, name: true, slug: true },
        },
        children: {
          select: { id: true, name: true, slug: true },
        },
        _count: {
          select: { products: true, children: true },
        },
      },
    });

    if (!category) {
      return NextResponse.json(
        { error: "Không tìm thấy danh mục" },
        { status: 404 }
      );
    }

    return NextResponse.json({ category });
  } catch (error) {
    console.error("Lỗi khi lấy chi tiết danh mục:", error);
    return NextResponse.json(
      { error: "Lỗi hệ thống khi tải danh mục" },
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

    const existing = await prisma.category.findUnique({
      where: { id },
      include: {
        children: { select: { id: true } },
      },
    });

    if (!existing) {
      return NextResponse.json(
        { error: "Danh mục không tồn tại" },
        { status: 404 }
      );
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

    // 1. Kiểm tra trùng lặp slug với danh mục khác
    if (data.slug !== existing.slug) {
      const duplicateSlug = await prisma.category.findFirst({
        where: {
          slug: data.slug,
          id: { not: id },
        },
        select: { id: true, name: true },
      });

      if (duplicateSlug) {
        return NextResponse.json(
          {
            error: `Đường dẫn slug "${data.slug}" đã được sử dụng bởi danh mục "${duplicateSlug.name}".`,
          },
          { status: 400 }
        );
      }
    }

    // 2. Kiểm tra phân cấp hợp lệ & Chống vòng lặp
    if (data.parentId) {
      // Không được chọn chính nó làm cha
      if (data.parentId === id) {
        return NextResponse.json(
          { error: "Một danh mục không thể chọn chính nó làm danh mục cha." },
          { status: 400 }
        );
      }

      // Không được chọn danh mục con của nó làm cha
      const childIds = existing.children.map((c) => c.id);
      if (childIds.includes(data.parentId)) {
        return NextResponse.json(
          { error: "Không thể chọn một danh mục con làm danh mục cha của nó (gây lỗi vòng lặp)." },
          { status: 400 }
        );
      }

      // Nếu danh mục hiện tại đang có danh mục con, không thể biến nó thành con của một danh mục khác (vì hệ thống chỉ tối đa 2 cấp)
      if (childIds.length > 0) {
        return NextResponse.json(
          {
            error: `Danh mục này đang có ${childIds.length} danh mục con. Để chuyển thành danh mục con, trước hết bạn cần chuyển các danh mục con hiện tại sang nơi khác.`,
          },
          { status: 400 }
        );
      }

      // Kiểm tra danh mục cha được chọn có phải là danh mục gốc không
      const parentCat = await prisma.category.findUnique({
        where: { id: data.parentId },
        select: { id: true, parentId: true },
      });

      if (!parentCat) {
        return NextResponse.json(
          { error: "Danh mục cha được chọn không tồn tại." },
          { status: 400 }
        );
      }

      if (parentCat.parentId) {
        return NextResponse.json(
          { error: "Hệ thống chỉ hỗ trợ cấu trúc 2 tầng (Ngành hàng chính -> Phân loại con). Vui lòng chọn danh mục gốc làm cha." },
          { status: 400 }
        );
      }
    }

    // 3. Cập nhật dữ liệu
    const updated = await prisma.category.update({
      where: { id },
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
      message: "Cập nhật danh mục thành công",
      category: updated,
    });
  } catch (error) {
    console.error("Lỗi khi cập nhật danh mục:", error);
    return NextResponse.json(
      { error: "Không thể cập nhật danh mục. Vui lòng kiểm tra lại." },
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

    const category = await prisma.category.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            products: true,
            children: true,
          },
        },
      },
    });

    if (!category) {
      return NextResponse.json(
        { error: "Danh mục không tồn tại" },
        { status: 404 }
      );
    }

    // 1. Kiểm tra danh mục con
    if (category._count.children > 0) {
      return NextResponse.json(
        {
          error: `Không thể xóa: Danh mục này đang chứa ${category._count.children} danh mục con. Vui lòng chuyển hoặc xóa các danh mục con trước.`,
        },
        { status: 400 }
      );
    }

    // 2. Kiểm tra sản phẩm đang liên kết
    if (category._count.products > 0) {
      return NextResponse.json(
        {
          error: `Không thể xóa: Hiện có ${category._count.products} sản phẩm đang thuộc danh mục này. Vui lòng chuyển các sản phẩm sang danh mục khác trước khi thực hiện xóa.`,
        },
        { status: 400 }
      );
    }

    // 3. Xóa an toàn khi không có ràng buộc
    await prisma.category.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: "Đã xóa danh mục thành công",
    });
  } catch (error) {
    console.error("Lỗi khi xóa danh mục:", error);
    return NextResponse.json(
      { error: "Đã xảy ra lỗi khi xóa danh mục" },
      { status: 500 }
    );
  }
}
