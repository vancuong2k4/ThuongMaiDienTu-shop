// ============================================================
// app/api/admin/orders/[id]/status/route.ts
// API Cập nhật Trạng thái Đơn hàng & Tự động Hoàn/Trừ Kho
// ============================================================

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { updateOrderStatusSchema } from "@/lib/validations/order";
import { MEMBERSHIP_TIER_CONFIG } from "@/lib/validations/loyalty";
import type { MembershipTier } from "@prisma/client";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function PATCH(req: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth();
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();
    const parsed = updateOrderStatusSchema.safeParse(body);

    if (!parsed.success) {
      const firstError = parsed.error.issues[0]?.message || "Dữ liệu không hợp lệ";
      return NextResponse.json({ error: firstError }, { status: 400 });
    }

    const { status: newStatus, note } = parsed.data;

    // 1. Tìm đơn hàng
    const order = await prisma.order.findFirst({
      where: {
        OR: [{ id }, { orderNumber: id }],
      },
      include: {
        items: true,
      },
    });

    if (!order) {
      return NextResponse.json(
        { error: "Đơn hàng không tồn tại" },
        { status: 404 }
      );
    }

    const currentStatus = order.orderStatus;
    if (currentStatus === newStatus) {
      return NextResponse.json({
        success: true,
        message: "Trạng thái đơn hàng không thay đổi",
        order,
      });
    }

    // 2. Chuyển đổi trạng thái trong Transaction đảm bảo toàn vẹn kho hàng
    const updatedOrder = await prisma.$transaction(async (tx) => {
      // Trường hợp A: Chuyển sang CANCELLED -> Hoàn trả tồn kho nguyên tử
      if (newStatus === "CANCELLED" && currentStatus !== "CANCELLED") {
        for (const item of order.items) {
          if (item.variantId) {
            await tx.productVariant.update({
              where: { id: item.variantId },
              data: {
                stock: { increment: item.quantity },
              },
            });
          }
        }
      }

      // Trường hợp B: Khôi phục từ CANCELLED sang trạng thái khác -> Trừ kho trở lại
      if (currentStatus === "CANCELLED" && newStatus !== "CANCELLED") {
        // Kiểm tra tồn kho trước
        for (const item of order.items) {
          if (item.variantId) {
            const variant = await tx.productVariant.findUnique({
              where: { id: item.variantId },
              select: { stock: true, name: true },
            });
            if (!variant || variant.stock < item.quantity) {
              throw new Error(
                `Không thể khôi phục đơn: Sản phẩm "${item.productName} - ${item.variantName}" hiện không đủ tồn kho (Còn ${variant?.stock || 0}, cần ${item.quantity}).`
              );
            }
          }
        }

        // Trừ kho
        for (const item of order.items) {
          if (item.variantId) {
            await tx.productVariant.update({
              where: { id: item.variantId },
              data: {
                stock: { decrement: item.quantity },
              },
            });
          }
        }
      }

      // Tạo nhật ký lịch sử trạng thái
      await tx.orderStatusHistory.create({
        data: {
          orderId: order.id,
          status: newStatus,
          note: note || `Admin ${session.user.name || "Quản trị viên"} cập nhật trạng thái`,
        },
      });

      // Cập nhật đơn hàng
      const updated = await tx.order.update({
        where: { id: order.id },
        data: {
          orderStatus: newStatus,
        },
      });

      // Trường hợp C: Giao hàng thành công (DELIVERED) -> Tự động tích điểm & nâng hạng thành viên
      if (newStatus === "DELIVERED" && currentStatus !== "DELIVERED" && order.userId) {
        if (!order.pointsEarned || order.pointsEarned === 0) {
          const customer = await tx.user.findUnique({
            where: { id: order.userId },
            select: {
              id: true,
              loyaltyPoints: true,
              totalPointsEarned: true,
              membershipTier: true,
            },
          });

          if (customer) {
            const currentTier = customer.membershipTier || "BRONZE";
            const ratePercent =
              MEMBERSHIP_TIER_CONFIG[currentTier]?.pointRatePercent || 1.0;
            // 1 điểm = 100₫ (1% của 100.000₫ = 1.000₫ = 10 điểm)
            const pointsToAward = Math.round(
              (Number(order.total) * (ratePercent / 100)) / 100
            );

            if (pointsToAward > 0) {
              const newPointsBalance = customer.loyaltyPoints + pointsToAward;

              // Cộng điểm cho khách hàng
              await tx.user.update({
                where: { id: customer.id },
                data: {
                  loyaltyPoints: { increment: pointsToAward },
                  totalPointsEarned: { increment: pointsToAward },
                },
              });

              // Cập nhật số điểm đã tích vào đơn hàng
              await tx.order.update({
                where: { id: order.id },
                data: {
                  pointsEarned: pointsToAward,
                },
              });

              // Ghi vào sổ cái giao dịch
              await tx.loyaltyTransaction.create({
                data: {
                  userId: customer.id,
                  orderId: order.id,
                  points: pointsToAward,
                  type: "EARN_ORDER",
                  description: `Tích ${pointsToAward} điểm từ đơn hàng #${order.orderNumber} (Hoàn ${ratePercent}%)`,
                  balanceAfter: newPointsBalance,
                },
              });

              // Kiểm tra tự động thăng hạng VIP dựa trên tổng chi tiêu đơn giao thành công
              const userDeliveredSpent = await tx.order.aggregate({
                _sum: { total: true },
                where: {
                  userId: customer.id,
                  orderStatus: "DELIVERED",
                },
              });

              const totalDelivered = Number(userDeliveredSpent._sum.total || 0);
              let upgradedTier: MembershipTier = customer.membershipTier;

              if (totalDelivered >= MEMBERSHIP_TIER_CONFIG.DIAMOND.minSpent) {
                upgradedTier = "DIAMOND";
              } else if (totalDelivered >= MEMBERSHIP_TIER_CONFIG.GOLD.minSpent) {
                upgradedTier = "GOLD";
              } else if (totalDelivered >= MEMBERSHIP_TIER_CONFIG.SILVER.minSpent) {
                upgradedTier = "SILVER";
              }

              if (upgradedTier !== customer.membershipTier) {
                await tx.user.update({
                  where: { id: customer.id },
                  data: { membershipTier: upgradedTier },
                });
              }
            }
          }
        }
      }

      // Trường hợp D: Hủy đơn hàng (CANCELLED) sau khi khách đã dùng điểm -> Hoàn lại điểm đã trừ
      if (newStatus === "CANCELLED" && currentStatus !== "CANCELLED" && order.userId) {
        if (order.pointsRedeemed && order.pointsRedeemed > 0) {
          const customer = await tx.user.findUnique({
            where: { id: order.userId },
            select: { id: true, loyaltyPoints: true },
          });

          if (customer) {
            await tx.user.update({
              where: { id: customer.id },
              data: { loyaltyPoints: { increment: order.pointsRedeemed } },
            });

            await tx.loyaltyTransaction.create({
              data: {
                userId: customer.id,
                orderId: order.id,
                points: order.pointsRedeemed,
                type: "ADMIN_ADJUST",
                description: `Hoàn ${order.pointsRedeemed} điểm do hủy đơn hàng #${order.orderNumber}`,
                balanceAfter: customer.loyaltyPoints + order.pointsRedeemed,
              },
            });
          }
        }
      }

      return updated;
    });

    return NextResponse.json({
      success: true,
      message: `Đã cập nhật trạng thái đơn hàng sang "${newStatus}"`,
      order: updatedOrder,
    });
  } catch (error) {
    console.error("Lỗi khi cập nhật trạng thái đơn hàng:", error);
    return NextResponse.json(
      { error: (error as Error).message || "Không thể cập nhật trạng thái đơn hàng" },
      { status: 500 }
    );
  }
}
