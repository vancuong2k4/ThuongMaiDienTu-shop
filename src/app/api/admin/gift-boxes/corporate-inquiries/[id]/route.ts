// ============================================================
// app/api/admin/gift-boxes/corporate-inquiries/[id]/route.ts
// Admin API Chi tiết, Cập nhật trạng thái & Báo giá yêu cầu doanh nghiệp (Phase 17)
// ============================================================

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { updateCorporateInquiryStatusSchema } from "@/lib/validations/gift-box";

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
    const inquiry = await prisma.corporateGiftInquiry.findUnique({
      where: { id },
    });

    if (!inquiry) {
      return NextResponse.json(
        { success: false, message: "Không tìm thấy yêu cầu doanh nghiệp." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        ...inquiry,
        budgetPerHamper: Number(inquiry.budgetPerHamper),
        quotedTotal: inquiry.quotedTotal ? Number(inquiry.quotedTotal) : null,
      },
    });
  } catch (error) {
    console.error("Lỗi khi admin lấy chi tiết yêu cầu doanh nghiệp:", error);
    return NextResponse.json(
      { success: false, message: "Không thể lấy chi tiết yêu cầu doanh nghiệp." },
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

    const parsed = updateCorporateInquiryStatusSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Dữ liệu cập nhật trạng thái không hợp lệ.",
          errors: parsed.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const { status, quotedTotal, adminNotes } = parsed.data;

    const updated = await prisma.corporateGiftInquiry.update({
      where: { id },
      data: {
        status,
        ...(quotedTotal !== undefined ? { quotedTotal } : {}),
        ...(adminNotes !== undefined ? { adminNotes } : {}),
      },
    });

    return NextResponse.json({
      success: true,
      message: "Cập nhật trạng thái yêu cầu doanh nghiệp thành công!",
      data: {
        ...updated,
        budgetPerHamper: Number(updated.budgetPerHamper),
        quotedTotal: updated.quotedTotal ? Number(updated.quotedTotal) : null,
      },
    });
  } catch (error: any) {
    console.error("Lỗi khi admin cập nhật yêu cầu doanh nghiệp:", error);
    return NextResponse.json(
      {
        success: false,
        message: error.message || "Không thể cập nhật yêu cầu doanh nghiệp.",
      },
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
    await prisma.corporateGiftInquiry.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: "Đã xóa yêu cầu doanh nghiệp thành công!",
    });
  } catch (error: any) {
    console.error("Lỗi khi admin xóa yêu cầu doanh nghiệp:", error);
    return NextResponse.json(
      {
        success: false,
        message: error.message || "Không thể xóa yêu cầu doanh nghiệp.",
      },
      { status: 500 }
    );
  }
}
