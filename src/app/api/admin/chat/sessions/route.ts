// ============================================================
// app/api/admin/chat/sessions/route.ts
// Admin API Quản lý danh sách các phiên trò chuyện trực tuyến (Phase 18)
// ============================================================

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { ChatSessionStatus } from "@prisma/client";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (session?.user?.role !== "ADMIN") {
      return NextResponse.json(
        { success: false, message: "Không có quyền truy cập." },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || "";
    const status = searchParams.get("status") as ChatSessionStatus | null;
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "25", 10);
    const skip = (page - 1) * limit;

    const where: any = {};
    if (status && Object.values(ChatSessionStatus).includes(status)) {
      where.status = status;
    }

    if (search) {
      where.OR = [
        { sessionCode: { contains: search, mode: "insensitive" } },
        { customerName: { contains: search, mode: "insensitive" } },
        { customerPhone: { contains: search, mode: "insensitive" } },
        { customerEmail: { contains: search, mode: "insensitive" } },
        { lastMessageText: { contains: search, mode: "insensitive" } },
      ];
    }

    const [total, sessions] = await Promise.all([
      prisma.chatSession.count({ where }),
      prisma.chatSession.findMany({
        where,
        orderBy: { lastMessageAt: "desc" },
        skip,
        take: limit,
        include: {
          _count: {
            select: { messages: true },
          },
        },
      }),
    ]);

    return NextResponse.json({
      success: true,
      data: sessions,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Lỗi khi admin lấy danh sách phiên chat:", error);
    return NextResponse.json(
      { success: false, message: "Không thể tải danh sách phiên chat." },
      { status: 500 }
    );
  }
}
