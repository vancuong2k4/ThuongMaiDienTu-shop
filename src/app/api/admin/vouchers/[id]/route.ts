// ============================================================
// app/api/admin/vouchers/[id]/route.ts
// API Chi Tiết, Chỉnh Sửa & Xóa Voucher Admin CMS
// ============================================================

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { voucherFormSchema } from "@/lib/validations/voucher";
import { Prisma } from "@prisma/client";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(req: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth();
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const voucher = await prisma.voucher.findUnique({
      where: { id },
      include: {
        orders: {
          take: 10,
          orderBy: { createdAt: "desc" },
          select: {
            id: true,
            orderNumber: true,
            recipientName: true,
            recipientPhone: true,
            total: true,
            discountAmount: true,
            orderStatus: true,
            paymentStatus: true,
            createdAt: true,
          },
        },
        _count: {
          select: { orders: true },
        },
      },
    });

    if (!voucher) {
      return NextResponse.json({ error: "Không tìm thấy voucher" }, { status: 404 });
    }

    const now = new Date();
    let lifecycleStatus: "ACTIVE" | "UPCOMING" | "EXPIRED" | "DEPLETED" | "DISABLED" = "ACTIVE";
    if (!voucher.isActive) {
      lifecycleStatus = "DISABLED";
    } else if (now < voucher.startDate) {
      lifecycleStatus = "UPCOMING";
    } else if (now > voucher.endDate) {
      lifecycleStatus = "EXPIRED";
    } else if (voucher.usageLimit !== null && voucher.usedCount >= voucher.usageLimit) {
      lifecycleStatus = "DEPLETED";
    }

    return NextResponse.json({
      success: true,
      voucher: {
        id: voucher.id,
        code: voucher.code,
        type: voucher.type,
        value: Number(voucher.value),
        minOrderAmount: voucher.minOrderAmount ? Number(voucher.minOrderAmount) : null,
        maxDiscount: voucher.maxDiscount ? Number(voucher.maxDiscount) : null,
        usageLimit: voucher.usageLimit,
        usedCount: voucher.usedCount,
        userLimit: voucher.userLimit,
        startDate: voucher.startDate.toISOString(),
        endDate: voucher.endDate.toISOString(),
        isActive: voucher.isActive,
        createdAt: voucher.createdAt.toISOString(),
        orderCount: voucher._count.orders,
        lifecycleStatus,
        recentOrders: voucher.orders.map((o) => ({
          id: o.id,
          orderNumber: o.orderNumber,
          recipientName: o.recipientName,
          recipientPhone: o.recipientPhone,
          total: Number(o.total),
          discountAmount: Number(o.discountAmount),
          orderStatus: o.orderStatus,
          paymentStatus: o.paymentStatus,
          createdAt: o.createdAt.toISOString(),
        })),
      },
    });
  } catch (error) {
    console.error("GET /api/admin/vouchers/[id] error:", error);
    return NextResponse.json(
      { error: "Đã xảy ra lỗi khi lấy thông tin voucher" },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth();
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();
    const result = voucherFormSchema.safeParse(body);

    if (!result.success) {
      const firstError = result.error.issues[0]?.message || "Dữ liệu không hợp lệ";
      return NextResponse.json({ error: firstError }, { status: 400 });
    }

    // Kiểm tra xem voucher có tồn tại không
    const existing = await prisma.voucher.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json({ error: "Không tìm thấy voucher cần cập nhật" }, { status: 404 });
    }

    const {
      code,
      type,
      value,
      minOrderAmount,
      maxDiscount,
      usageLimit,
      userLimit,
      startDate,
      endDate,
      isActive,
    } = result.data;

    // Kiểm tra trùng code với voucher khác
    if (code !== existing.code) {
      const duplicate = await prisma.voucher.findUnique({
        where: { code },
      });
      if (duplicate && duplicate.id !== id) {
        return NextResponse.json(
          { error: `Mã voucher "${code}" đã được sử dụng bởi chương trình khác.` },
          { status: 400 }
        );
      }
    }

    const updated = await prisma.voucher.update({
      where: { id },
      data: {
        code,
        type,
        value: new Prisma.Decimal(value),
        minOrderAmount: minOrderAmount ? new Prisma.Decimal(minOrderAmount) : null,
        maxDiscount: maxDiscount ? new Prisma.Decimal(maxDiscount) : null,
        usageLimit: usageLimit ?? null,
        userLimit: userLimit ?? 1,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        isActive,
      },
    });

    return NextResponse.json({
      success: true,
      message: `Đã cập nhật voucher ${updated.code} thành công`,
      voucher: {
        id: updated.id,
        code: updated.code,
        type: updated.type,
        value: Number(updated.value),
      },
    });
  } catch (error) {
    console.error("PUT /api/admin/vouchers/[id] error:", error);
    return NextResponse.json(
      { error: "Đã xảy ra lỗi khi cập nhật voucher" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth();
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const voucher = await prisma.voucher.findUnique({
      where: { id },
      include: {
        _count: {
          select: { orders: true },
        },
      },
    });

    if (!voucher) {
      return NextResponse.json({ error: "Không tìm thấy voucher cần xóa" }, { status: 404 });
    }

    // ── Safe Deletion Guard ─────────────────────────────────────
    // Nếu voucher đã được khách áp dụng hoặc đã có trong đơn hàng
    if (voucher.usedCount > 0 || voucher._count.orders > 0) {
      return NextResponse.json(
        {
          error: `Voucher "${voucher.code}" đã được sử dụng trong ${voucher._count.orders} đơn hàng thực tế. Không thể xóa để bảo đảm tính toàn vẹn chứng từ kế toán. Bạn có thể bấm Tắt kích hoạt để tạm dừng sử dụng.`,
        },
        { status: 400 }
      );
    }

    await prisma.voucher.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: `Đã xóa mã voucher "${voucher.code}" thành công`,
    });
  } catch (error) {
    console.error("DELETE /api/admin/vouchers/[id] error:", error);
    return NextResponse.json(
      { error: "Đã xảy ra lỗi khi xóa mã voucher" },
      { status: 500 }
    );
  }
}
