// ============================================================
// app/api/consultations/book/route.ts
// Đặt Lịch Tư Vấn 1-1 Với Dược Sĩ THUYNGA Shop (Phase 16)
// ============================================================

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { bookConsultationSchema } from "@/lib/validations/protocol";
import { ConsultationStatus } from "@prisma/client";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    const body = await req.json();

    const parsed = bookConsultationSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Dữ liệu đặt lịch không hợp lệ", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const data = parsed.data;

    const booking = await prisma.pharmacistConsultationBooking.create({
      data: {
        assessmentId: data.assessmentId || null,
        userId: session?.user?.id || null,
        customerName: data.customerName.trim(),
        phone: data.phone.trim(),
        preferredDate: new Date(data.preferredDate),
        preferredTimeSlot: data.preferredTimeSlot.trim(),
        healthConcerns: data.healthConcerns.trim(),
        status: ConsultationStatus.PENDING,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Đặt lịch tư vấn với Dược sĩ thành công! Chúng tôi sẽ liên hệ đúng khung giờ đã hẹn.",
      data: booking,
    });
  } catch (error) {
    console.error("POST /api/consultations/book error:", error);
    return NextResponse.json(
      { error: "Đã xảy ra lỗi khi đặt lịch tư vấn dược sĩ" },
      { status: 500 }
    );
  }
}
