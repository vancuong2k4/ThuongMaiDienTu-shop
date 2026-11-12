// ============================================================
// app/api/admin/chat/sessions/[id]/route.ts
// Admin API Chi tiết, Cập nhật trạng thái & Xóa phiên chat (Phase 18)
// ============================================================

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { updateChatSessionSchema } from "@/lib/validations/chat";

export const dynamic = "force-dynamic";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (session?.user?.role !== "ADMIN") {
      return NextResponse.json(
        { success: false, message: "Không có quyền truy cập." },
        { status: 403 }
      );
    }

    const { id } = await params;
    const chatSession = await prisma.chatSession.findUnique({
      where: { id },
      include: {
        messages: {
          orderBy: { createdAt: "asc" },
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            membershipTier: true,
            loyaltyPoints: true,
          },
        },
      },
    });

    if (!chatSession) {
      return NextResponse.json(
        { success: false, message: "Không tìm thấy phiên trò chuyện." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: chatSession,
    });
  } catch (error) {
    console.error("Lỗi khi admin lấy chi tiết phiên chat:", error);
    return NextResponse.json(
      { success: false, message: "Không thể lấy thông tin phiên chat." },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (session?.user?.role !== "ADMIN") {
      return NextResponse.json(
        { success: false, message: "Không có quyền thực hiện hành động này." },
        { status: 403 }
      );
    }

    const { id } = await params;
    const body = await req.json();

    const parsed = updateChatSessionSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Dữ liệu cập nhật không hợp lệ.",
          errors: parsed.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const updated = await prisma.chatSession.update({
      where: { id },
      data: parsed.data,
    });

    return NextResponse.json({
      success: true,
      message: "Cập nhật trạng thái phiên chat thành công!",
      data: updated,
    });
  } catch (error: any) {
    console.error("Lỗi khi admin cập nhật phiên chat:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Không thể cập nhật phiên chat." },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (session?.user?.role !== "ADMIN") {
      return NextResponse.json(
        { success: false, message: "Không có quyền thực hiện hành động này." },
        { status: 403 }
      );
    }

    const { id } = await params;
    await prisma.chatSession.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: "Đã xóa phiên trò chuyện thành công!",
    });
  } catch (error: any) {
    console.error("Lỗi khi admin xóa phiên chat:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Không thể xóa phiên chat." },
      { status: 500 }
    );
  }
}
