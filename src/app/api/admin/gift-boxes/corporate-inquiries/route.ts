// ============================================================
// app/api/admin/gift-boxes/corporate-inquiries/route.ts
// Admin API Quản lý danh sách Yêu cầu quà tặng doanh nghiệp B2B (Phase 17)
// ============================================================

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { CorporateGiftStatus } from "@prisma/client";

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
    const status = searchParams.get("status") as CorporateGiftStatus | null;
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "20", 10);
    const skip = (page - 1) * limit;

    const where: any = {};
    if (status && Object.values(CorporateGiftStatus).includes(status)) {
      where.status = status;
    }

    if (search) {
      where.OR = [
        { inquiryCode: { contains: search, mode: "insensitive" } },
        { companyName: { contains: search, mode: "insensitive" } },
        { contactPerson: { contains: search, mode: "insensitive" } },
        { phone: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
      ];
    }

    const [total, inquiries] = await Promise.all([
      prisma.corporateGiftInquiry.count({ where }),
      prisma.corporateGiftInquiry.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
    ]);

    return NextResponse.json({
      success: true,
      data: inquiries.map((inq) => ({
        ...inq,
        budgetPerHamper: Number(inq.budgetPerHamper),
        quotedTotal: inq.quotedTotal ? Number(inq.quotedTotal) : null,
      })),
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Lỗi khi admin lấy danh sách yêu cầu doanh nghiệp:", error);
    return NextResponse.json(
      { success: false, message: "Không thể tải danh sách yêu cầu doanh nghiệp." },
      { status: 500 }
    );
  }
}
