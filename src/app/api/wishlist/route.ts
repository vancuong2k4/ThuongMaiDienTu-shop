// ============================================================
// app/api/wishlist/route.ts – Lấy danh sách ID sản phẩm yêu thích của user
// ============================================================

import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ success: true, productIds: [] });
    }

    const items = await prisma.wishlist.findMany({
      where: { userId: session.user.id },
      select: { productId: true },
    });

    return NextResponse.json({
      success: true,
      productIds: items.map((i) => i.productId),
    });
  } catch (error: unknown) {
    console.error("Fetch wishlist error:", error);
    return NextResponse.json(
      { error: "Lỗi tải danh sách yêu thích" },
      { status: 500 }
    );
  }
}
