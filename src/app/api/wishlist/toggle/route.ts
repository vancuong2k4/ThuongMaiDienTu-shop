// ============================================================
// app/api/wishlist/toggle/route.ts – Thêm / Xóa sản phẩm yêu thích
// ============================================================

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Vui lòng đăng nhập để lưu sản phẩm yêu thích" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { productId } = body;

    if (!productId) {
      return NextResponse.json(
        { error: "Mã sản phẩm không hợp lệ" },
        { status: 400 }
      );
    }

    // Kiểm tra sản phẩm có tồn tại không
    const product = await prisma.product.findUnique({
      where: { id: productId },
      select: { id: true, name: true },
    });

    if (!product) {
      return NextResponse.json(
        { error: "Sản phẩm không tồn tại" },
        { status: 404 }
      );
    }

    // Kiểm tra xem đã thả tim chưa
    const existing = await prisma.wishlist.findUnique({
      where: {
        userId_productId: {
          userId: session.user.id,
          productId,
        },
      },
    });

    if (existing) {
      // Đã có -> Xóa khỏi wishlist
      await prisma.wishlist.delete({
        where: { id: existing.id },
      });

      return NextResponse.json({
        success: true,
        isWishlisted: false,
        message: `Đã bỏ lưu sản phẩm "${product.name}" khỏi danh sách yêu thích`,
      });
    } else {
      // Chưa có -> Thêm vào wishlist
      await prisma.wishlist.create({
        data: {
          userId: session.user.id,
          productId,
        },
      });

      return NextResponse.json({
        success: true,
        isWishlisted: true,
        message: `Đã lưu sản phẩm "${product.name}" vào danh sách yêu thích!`,
      });
    }
  } catch (error: unknown) {
    console.error("Wishlist toggle error:", error);
    return NextResponse.json(
      { error: "Đã xảy ra lỗi khi cập nhật danh sách yêu thích" },
      { status: 500 }
    );
  }
}
