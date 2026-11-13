import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { createReservationSchema } from "@/lib/validations/preorder";
import { createPreOrderReservationRecord } from "@/lib/preorder";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    const userId = session?.user?.id || null;

    const body = await req.json();
    const validated = createReservationSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        {
          success: false,
          message:
            validated.error.issues[0]?.message || "Dữ liệu đặt giữ chỗ không hợp lệ.",
        },
        { status: 400 }
      );
    }

    const reservation = await createPreOrderReservationRecord(
      validated.data,
      userId
    );

    // Sinh link mã VietQR Napas 24/7 để quét cọc ngay
    const bankBin = "970422"; // MBBank
    const bankAccount = "0988888888";
    const bankAccountName = "THUYNGA SHOP";
    const depositAmount = Number(reservation.depositPaid);
    const transferContent = `COC ${reservation.reservationCode}`;

    const vietQrUrl = `https://img.vietqr.io/image/${bankBin}-${bankAccount}-${encodeURIComponent(
      "compact2"
    )}.png?amount=${depositAmount}&addInfo=${encodeURIComponent(
      transferContent
    )}&accountName=${encodeURIComponent(bankAccountName)}`;

    return NextResponse.json(
      {
        success: true,
        message: "Đặt cọc giữ chỗ mùa vụ thành công!",
        reservation,
        payment: {
          vietQrUrl,
          bankName: "Ngân hàng TMCP Quân Đội (MBBank)",
          bankAccount,
          bankAccountName,
          amount: depositAmount,
          transferContent,
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Lỗi khi tạo đơn đặt giữ chỗ mùa vụ:", error);
    return NextResponse.json(
      {
        success: false,
        message: error.message || "Không thể khởi tạo đơn đặt chỗ.",
      },
      { status: 400 }
    );
  }
}
