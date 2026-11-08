// ============================================================
// app/api/admin/customers/route.ts
// API Danh Sách & Thống Kê Khách Hàng Admin CMS (Module 6.7)
// ============================================================

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Role, Prisma } from "@prisma/client";

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
    const limit = Math.max(1, Math.min(100, parseInt(searchParams.get("limit") || "10")));
    const skip = (page - 1) * limit;

    const search = searchParams.get("search")?.trim() || "";
    const tierFilter = searchParams.get("tier") || "ALL";
    const statusFilter = searchParams.get("status") || "ALL";
    const roleFilter = searchParams.get("role") || "ALL";
    const sortBy = searchParams.get("sortBy") || "createdAt_desc";

    // ── Xây dựng điều kiện lọc ──────────────────────────────────
    const where: Prisma.UserWhereInput = {};

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
        { phone: { contains: search, mode: "insensitive" } },
      ];
    }

    if (statusFilter === "ACTIVE") {
      where.isActive = true;
    } else if (statusFilter === "BLOCKED") {
      where.isActive = false;
    }

    if (roleFilter !== "ALL" && Object.values(Role).includes(roleFilter as Role)) {
      where.role = roleFilter as Role;
    }

    // ── Truy vấn người dùng kèm thông tin đơn hàng ──────────────
    const allMatchingUsers = await prisma.user.findMany({
      where,
      orderBy: [{ createdAt: "desc" }],
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        avatar: true,
        role: true,
        isActive: true,
        createdAt: true,
        orders: {
          select: {
            id: true,
            total: true,
            orderStatus: true,
            createdAt: true,
          },
        },
        _count: {
          select: {
            reviews: true,
          },
        },
      },
    });

    // ── Tính toán số liệu thống kê chi tiêu & phân hạng cho từng user
    let formattedUsers = allMatchingUsers.map((u) => {
      // Đơn hàng hợp lệ (không tính đơn hủy)
      const validOrders = u.orders.filter((o) => o.orderStatus !== "CANCELLED");
      const totalOrders = validOrders.length;
      const totalSpent = validOrders.reduce(
        (sum, order) => sum + Number(order.total),
        0
      );

      // Ngày đặt đơn gần nhất
      let lastOrderAt: string | null = null;
      if (u.orders.length > 0) {
        const sortedOrders = [...u.orders].sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        lastOrderAt = sortedOrders[0].createdAt.toISOString();
      }

      // Phân hạng thành viên:
      // - VIP: Chi tiêu >= 5.000.000₫ hoặc >= 3 đơn hàng
      // - REGULAR: Chi tiêu >= 1.000.000₫ hoặc >= 1 đơn hàng
      // - NEW: Chưa có đơn hoặc chi tiêu < 1.000.000₫
      let tier: "VIP" | "REGULAR" | "NEW" = "NEW";
      if (totalSpent >= 5000000 || totalOrders >= 3) {
        tier = "VIP";
      } else if (totalSpent >= 1000000 || totalOrders >= 1) {
        tier = "REGULAR";
      }

      return {
        id: u.id,
        name: u.name,
        email: u.email,
        phone: u.phone,
        avatar: u.avatar,
        role: u.role,
        isActive: u.isActive,
        createdAt: u.createdAt.toISOString(),
        totalOrders,
        totalSpent,
        lastOrderAt,
        reviewCount: u._count.reviews,
        tier,
      };
    });

    // ── Lọc theo Tier nếu có ────────────────────────────────────
    if (tierFilter !== "ALL") {
      formattedUsers = formattedUsers.filter((u) => u.tier === tierFilter);
    }

    // ── Sắp xếp ────────────────────────────────────────────────
    if (sortBy === "spent_desc") {
      formattedUsers.sort((a, b) => b.totalSpent - a.totalSpent);
    } else if (sortBy === "orders_desc") {
      formattedUsers.sort((a, b) => b.totalOrders - a.totalOrders);
    } else {
      // createdAt_desc
      formattedUsers.sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    }

    // ── Tính tổng & Phân trang ─────────────────────────────────
    const totalCount = formattedUsers.length;
    const paginatedUsers = formattedUsers.slice(skip, skip + limit);

    // ── Thống kê tổng quan toàn hệ thống ────────────────────────
    const [totalUsersCount, activeUsersCount, memberSpentAgg] = await Promise.all([
      prisma.user.count({ where: { role: Role.CUSTOMER } }),
      prisma.user.count({ where: { role: Role.CUSTOMER, isActive: true } }),
      prisma.order.aggregate({
        _sum: { total: true },
        where: {
          userId: { not: null },
          orderStatus: { not: "CANCELLED" },
        },
      }),
    ]);

    // Đếm số VIP trong tập khách hàng
    const allCustomerStats = allMatchingUsers.filter((u) => u.role === Role.CUSTOMER);
    const vipCount = allCustomerStats.filter((u) => {
      const validOrders = u.orders.filter((o) => o.orderStatus !== "CANCELLED");
      const totalSpent = validOrders.reduce((sum, o) => sum + Number(o.total), 0);
      return totalSpent >= 5000000 || validOrders.length >= 3;
    }).length;

    return NextResponse.json({
      success: true,
      customers: paginatedUsers,
      currentUserId: session.user.id,
      pagination: {
        page,
        limit,
        total: totalCount,
        totalPages: Math.ceil(totalCount / limit) || 1,
      },
      stats: {
        totalCustomers: totalUsersCount,
        activeCustomers: activeUsersCount,
        vipCustomers: vipCount,
        totalSpentAll: Number(memberSpentAgg._sum.total || 0),
      },
    });
  } catch (error) {
    console.error("GET /api/admin/customers error:", error);
    return NextResponse.json(
      { error: "Đã xảy ra lỗi khi lấy danh sách khách hàng" },
      { status: 500 }
    );
  }
}
