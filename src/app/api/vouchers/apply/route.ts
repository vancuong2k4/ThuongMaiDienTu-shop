import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { VoucherType } from "@prisma/client";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { code, subtotal } = body;

    if (!code || typeof code !== "string") {
      return NextResponse.json(
        { success: false, error: "Vui lòng nhập mã giảm giá" },
        { status: 400 }
      );
    }

    const cleanCode = code.trim().toUpperCase();
    const orderSubtotal = Number(subtotal) || 0;

    const voucher = await prisma.voucher.findUnique({
      where: { code: cleanCode },
    });

    if (!voucher || !voucher.isActive) {
      return NextResponse.json(
        { success: false, error: "Mã giảm giá không tồn tại hoặc đã hết hạn" },
        { status: 404 }
      );
    }

    const now = new Date();
    if (now < voucher.startDate || now > voucher.endDate) {
      return NextResponse.json(
        { success: false, error: "Mã giảm giá đã hết thời gian áp dụng" },
        { status: 400 }
      );
    }

    if (voucher.usageLimit !== null && voucher.usedCount >= voucher.usageLimit) {
      return NextResponse.json(
        { success: false, error: "Mã giảm giá đã hết lượt sử dụng" },
        { status: 400 }
      );
    }

    const minAmount = voucher.minOrderAmount ? Number(voucher.minOrderAmount) : 0;
    if (orderSubtotal < minAmount) {
      return NextResponse.json(
        {
          success: false,
          error: `Đơn hàng tối thiểu ${minAmount.toLocaleString("vi-VN")}₫ để sử dụng mã này`,
        },
        { status: 400 }
      );
    }

    let discountAmount = 0;
    let description = "";
    const rawVal = Number(voucher.value);
    const maxDiscount = voucher.maxDiscount ? Number(voucher.maxDiscount) : null;

    if (voucher.type === VoucherType.FIXED) {
      discountAmount = Math.min(rawVal, orderSubtotal);
      description = `Giảm ${rawVal.toLocaleString("vi-VN")}₫`;
    } else if (voucher.type === VoucherType.FREE_SHIP) {
      // Giảm tối đa phí ship tiêu chuẩn (30.000₫)
      discountAmount = Math.min(rawVal, 30000);
      description = "Miễn phí vận chuyển toàn quốc";
    } else if (voucher.type === VoucherType.PERCENTAGE) {
      const calculated = Math.round((orderSubtotal * rawVal) / 100);
      discountAmount = maxDiscount ? Math.min(calculated, maxDiscount) : calculated;
      description = `Giảm ${rawVal}% (tối đa ${maxDiscount ? maxDiscount.toLocaleString("vi-VN") + "₫" : ""})`;
    }

    return NextResponse.json({
      success: true,
      voucher: {
        id: voucher.id,
        code: voucher.code,
        type: voucher.type,
        value: rawVal,
        discountAmount,
        minOrderAmount: minAmount,
        maxDiscount,
        description,
      },
    });
  } catch (error) {
    console.error("Error validating voucher:", error);
    return NextResponse.json(
      { success: false, error: "Có lỗi xảy ra khi kiểm tra mã giảm giá" },
      { status: 500 }
    );
  }
}
