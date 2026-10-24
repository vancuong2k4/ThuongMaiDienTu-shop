import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ReviewStatus } from "@prisma/client";
import { auth } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { productId, rating, content, userName } = body;

    if (!productId || !rating || !content || !userName) {
      return NextResponse.json(
        { error: "Vui lòng điền đầy đủ thông tin đánh giá" },
        { status: 400 }
      );
    }

    // Kiểm tra xem user đã đăng nhập chưa
    const session = await auth();
    let userId = session?.user?.id;

    if (!userId) {
      // Nếu là khách ẩn danh chưa đăng nhập: tìm hoặc tạo tài khoản tạm
      const tempEmail = `guest.${Date.now()}@thuyngashop.local`;
      const guestUser = await prisma.user.create({
        data: {
          name: userName,
          email: tempEmail,
          role: "CUSTOMER",
        },
      });
      userId = guestUser.id;
    }

    // Tạo review (mặc định APPROVED để hiển thị ngay, hoặc PENDING nếu cần duyệt)
    const review = await prisma.review.create({
      data: {
        productId,
        userId,
        rating: Math.max(1, Math.min(5, Number(rating))),
        content: content.trim(),
        status: ReviewStatus.APPROVED,
        images: [],
      },
      include: {
        user: {
          select: {
            name: true,
            avatar: true,
          },
        },
      },
    });

    return NextResponse.json({ success: true, data: review });
  } catch (error) {
    console.error("Error creating review:", error);
    return NextResponse.json(
      { error: "Không thể gửi đánh giá, vui lòng thử lại sau" },
      { status: 500 }
    );
  }
}
