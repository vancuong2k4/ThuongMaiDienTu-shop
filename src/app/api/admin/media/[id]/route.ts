// ============================================================
// app/api/admin/media/[id]/route.ts
// API Xóa Tệp Khỏi Kho Media Admin CMS
// ============================================================

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { unlink } from "fs/promises";
import path from "path";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function DELETE(req: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth();
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const media = await prisma.media.findUnique({
      where: { id },
    });

    if (!media) {
      return NextResponse.json(
        { error: "Không tìm thấy tệp trong kho media" },
        { status: 404 }
      );
    }

    // Xóa record khỏi database
    await prisma.media.delete({
      where: { id },
    });

    // Nếu là file lưu trữ cục bộ, xóa file vật lý
    if (media.url.startsWith("/uploads/")) {
      try {
        const filePath = path.join(process.cwd(), "public", media.url);
        await unlink(filePath);
      } catch (err) {
        // File có thể không còn tồn tại trên disk, bỏ qua
      }
    }

    return NextResponse.json({
      success: true,
      message: "Đã xóa ảnh khỏi kho media",
    });
  } catch (error) {
    console.error("DELETE /api/admin/media/[id] error:", error);
    return NextResponse.json(
      { error: "Đã xảy ra lỗi khi xóa ảnh" },
      { status: 500 }
    );
  }
}
