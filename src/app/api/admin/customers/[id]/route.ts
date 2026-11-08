// ============================================================
// app/api/admin/customers/[id]/route.ts
// API Chi Tiết Khách Hàng (Sổ địa chỉ, Lịch sử đơn hàng, Đánh giá)
// ============================================================

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

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

    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        addresses: {
          orderBy: [{ isDefault: "desc" }, { createdAt: "desc" }],
        },
        orders: {
          orderBy: [{ createdAt: "desc" }],
          include: {
            items: {
              select: { id: true },
            },
          },
        },
        reviews: {
          orderBy: [{ createdAt: "desc" }],
          include: {
            product: {
              select: {
                id: true,
                name: true,
                slug: true,
              },
            },
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Không tìm thấy khách hàng" },
        { status: 404 }
      );
    }

    // Tính toán số liệu thống kê
    const validOrders = user.orders.filter((o) => o.orderStatus !== "CANCELLED");
    const totalOrders = validOrders.length;
    const totalSpent = validOrders.reduce(
      (sum, order) => sum + Number(order.total),
      0
    );

    let lastOrderAt: string | null = null;
    if (user.orders.length > 0) {
      lastOrderAt = user.orders[0].createdAt.toISOString();
    }

    let tier: "VIP" | "REGULAR" | "NEW" = "NEW";
    if (totalSpent >= 5000000 || totalOrders >= 3) {
      tier = "VIP";
    } else if (totalSpent >= 1000000 || totalOrders >= 1) {
      tier = "REGULAR";
    }

    return NextResponse.json({
      success: true,
      customer: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        avatar: user.avatar,
        role: user.role,
        isActive: user.isActive,
        createdAt: user.createdAt.toISOString(),
        totalOrders,
        totalSpent,
        lastOrderAt,
        reviewCount: user.reviews.length,
        tier,
        addresses: user.addresses.map((a) => ({
          id: a.id,
          fullName: a.fullName,
          phone: a.phone,
          province: a.province,
          district: a.district,
          ward: a.ward,
          street: a.street,
          isDefault: a.isDefault,
        })),
        orders: user.orders.map((o) => ({
          id: o.id,
          orderNumber: o.orderNumber,
          total: Number(o.total),
          discountAmount: Number(o.discountAmount),
          orderStatus: o.orderStatus,
          paymentStatus: o.paymentStatus,
          paymentMethod: o.paymentMethod,
          createdAt: o.createdAt.toISOString(),
          itemCount: o.items.length,
        })),
        reviews: user.reviews.map((r) => ({
          id: r.id,
          rating: r.rating,
          content: r.content,
          status: r.status,
          createdAt: r.createdAt.toISOString(),
          product: {
            id: r.product.id,
            name: r.product.name,
            slug: r.product.slug,
          },
        })),
      },
    });
  } catch (error) {
    console.error("GET /api/admin/customers/[id] error:", error);
    return NextResponse.json(
      { error: "Đã xảy ra lỗi khi lấy thông tin chi tiết khách hàng" },
      { status: 500 }
    );
  }
}
