// ============================================================
// app/api/gift-boxes/corporate-inquiry/route.ts
// Public API tiếp nhận yêu cầu báo giá quà tặng doanh nghiệp B2B (Phase 17)
// ============================================================

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { corporateGiftInquirySchema } from "@/lib/validations/gift-box";
import { generateCorporateInquiryCode } from "@/lib/gift-box";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    const body = await req.json();

    const parsed = corporateGiftInquirySchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Thông tin yêu cầu báo giá doanh nghiệp không hợp lệ.",
          errors: parsed.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const {
      companyName,
      contactPerson,
      phone,
      email,
      occasion,
      quantity,
      budgetPerHamper,
      deliveryDeadline,
      requiresVatInvoice,
      customLogoBranding,
      notes,
    } = parsed.data;

    const inquiryCode = await generateCorporateInquiryCode();

    const inquiry = await prisma.corporateGiftInquiry.create({
      data: {
        inquiryCode,
        companyName,
        contactPerson,
        phone,
        email,
        occasion,
        quantity,
        budgetPerHamper,
        deliveryDeadline: deliveryDeadline ? new Date(deliveryDeadline) : null,
        requiresVatInvoice,
        customLogoBranding,
        notes,
        userId: session?.user?.id || null,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Gửi yêu cầu báo giá quà tặng doanh nghiệp thành công! Chuyên viên B2B của THUYNGA Shop sẽ liên hệ trong 2-4 giờ làm việc.",
      data: {
        id: inquiry.id,
        inquiryCode: inquiry.inquiryCode,
      },
    });
  } catch (error: any) {
    console.error("Lỗi khi gửi yêu cầu báo giá doanh nghiệp:", error);
    return NextResponse.json(
      {
        success: false,
        message: error.message || "Không thể gửi yêu cầu báo giá. Vui lòng liên hệ Hotline 090.888.6666.",
      },
      { status: 500 }
    );
  }
}
