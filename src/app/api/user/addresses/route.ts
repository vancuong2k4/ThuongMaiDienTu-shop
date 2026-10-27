// ============================================================
// app/api/user/addresses/route.ts – Lấy danh sách & Thêm địa chỉ mới
// ============================================================

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET: Lấy danh sách địa chỉ của user
export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Chưa đăng nhập" }, { status: 401 });
    }

    const addresses = await prisma.address.findMany({
      where: { userId: session.user.id },
      orderBy: [{ isDefault: "desc" }, { createdAt: "desc" }],
    });

    return NextResponse.json({ success: true, addresses });
  } catch (error: unknown) {
    console.error("Fetch addresses error:", error);
    return NextResponse.json(
      { error: "Lỗi khi tải danh sách địa chỉ" },
      { status: 500 }
    );
  }
}

// POST: Thêm địa chỉ mới
export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Chưa đăng nhập" }, { status: 401 });
    }

    const body = await req.json();
    const { fullName, phone, province, district, ward, street, isDefault } = body;

    if (!fullName?.trim() || !phone?.trim() || !province?.trim() || !district?.trim() || !ward?.trim() || !street?.trim()) {
      return NextResponse.json(
        { error: "Vui lòng nhập đầy đủ các thông tin địa chỉ" },
        { status: 400 }
      );
    }

    // Nếu người dùng chọn isDefault = true, hoặc đây là địa chỉ đầu tiên của user -> set default
    const existingCount = await prisma.address.count({
      where: { userId: session.user.id },
    });

    const shouldBeDefault = isDefault || existingCount === 0;

    const newAddress = await prisma.$transaction(async (tx) => {
      if (shouldBeDefault) {
        // Hủy default của tất cả các địa chỉ cũ
        await tx.address.updateMany({
          where: { userId: session.user.id },
          data: { isDefault: false },
        });
      }

      return await tx.address.create({
        data: {
          userId: session.user.id,
          fullName: fullName.trim(),
          phone: phone.trim(),
          province: province.trim(),
          district: district.trim(),
          ward: ward.trim(),
          street: street.trim(),
          isDefault: shouldBeDefault,
        },
      });
    });

    return NextResponse.json(
      {
        success: true,
        message: "Thêm địa chỉ nhận hàng thành công!",
        address: newAddress,
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    console.error("Create address error:", error);
    return NextResponse.json(
      { error: "Đã có lỗi xảy ra khi lưu địa chỉ" },
      { status: 500 }
    );
  }
}
