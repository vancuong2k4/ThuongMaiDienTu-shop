// ============================================================
// app/api/orders/route.ts – API Đặt hàng an toàn (Phase 5)
// Áp dụng Pessimistic Locking (SELECT ... FOR UPDATE) chống Overselling
// ============================================================

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { PaymentMethod } from "@prisma/client";

interface OrderItemRequest {
  variantId: string;
  quantity: number;
}

interface CreateOrderBody {
  recipientName: string;
  recipientPhone: string;
  province: string;
  district: string;
  ward: string;
  addressDetail: string;
  note?: string;
  paymentMethod: PaymentMethod;
  voucherCode?: string;
  items: OrderItemRequest[];
}

// Hàm sinh mã đơn hàng định dạng TN-YYYYMMDD-XXXX
function generateOrderNumber(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let randomStr = "";
  for (let i = 0; i < 4; i++) {
    randomStr += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `TN-${year}${month}${day}-${randomStr}`;
}

export async function POST(req: NextRequest) {
  try {
    // 0. Bắt buộc đăng nhập tài khoản
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Vui lòng đăng nhập tài khoản trước khi thực hiện đặt hàng." },
        { status: 401 }
      );
    }

    const currentUserId = session.user.id;
    const body = (await req.json()) as CreateOrderBody;
    const {
      recipientName,
      recipientPhone,
      province,
      district,
      ward,
      addressDetail,
      note,
      paymentMethod,
      voucherCode,
      items,
    } = body;

    // 1. Validation đầu vào
    if (!recipientName?.trim()) {
      return NextResponse.json(
        { error: "Vui lòng nhập họ và tên người nhận hàng." },
        { status: 400 }
      );
    }

    const cleanPhone = recipientPhone?.trim().replace(/[\s.-]/g, "") || "";
    const phoneRegex = /(84|0[3|5|7|8|9])+([0-9]{8})\b/;
    if (!phoneRegex.test(cleanPhone)) {
      return NextResponse.json(
        { error: "Số điện thoại nhận hàng không hợp lệ (cần 10 chữ số hợp lệ)." },
        { status: 400 }
      );
    }

    if (!province?.trim() || !district?.trim() || !ward?.trim() || !addressDetail?.trim()) {
      return NextResponse.json(
        { error: "Vui lòng cung cấp đầy đủ thông tin địa chỉ giao hàng (Tỉnh/Thành, Quận/Huyện, Phường/Xã, Số nhà/Đường)." },
        { status: 400 }
      );
    }

    if (!["COD", "VIETQR"].includes(paymentMethod)) {
      return NextResponse.json(
        { error: "Phương thức thanh toán không hợp lệ (hỗ trợ COD hoặc VIETQR)." },
        { status: 400 }
      );
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: "Giỏ hàng của bạn đang trống." },
        { status: 400 }
      );
    }

    for (const item of items) {
      if (!item.variantId || typeof item.quantity !== "number" || item.quantity <= 0) {
        return NextResponse.json(
          { error: "Thông tin số lượng sản phẩm không hợp lệ." },
          { status: 400 }
        );
      }
    }

    const formattedShippingAddress = `${addressDetail.trim()}, ${ward.trim()}, ${district.trim()}, ${province.trim()}`;

    // 2. Chạy Prisma Transaction với Pessimistic Locking chống Overselling
    const resultOrder = await prisma.$transaction(
      async (tx) => {
        let calculatedSubtotal = 0;
        const verifiedItems: {
          variantId: string;
          productName: string;
          variantName: string;
          sku: string;
          price: number;
          quantity: number;
          image: string | null;
        }[] = [];

        // Khóa từng variant theo thứ tự để tránh Deadlock
        const sortedItems = [...items].sort((a, b) => a.variantId.localeCompare(b.variantId));

        for (const it of sortedItems) {
          // Pessimistic Lock: SELECT FOR UPDATE
          const lockedRows: { id: string }[] = await tx.$queryRaw`
            SELECT id FROM product_variants
            WHERE id = ${it.variantId}
            FOR UPDATE
          `;

          if (lockedRows.length === 0) {
            throw new Error(`Sản phẩm (mã: ${it.variantId}) không tồn tại trong hệ thống.`);
          }

          const variant = await tx.productVariant.findUnique({
            where: { id: it.variantId },
            include: { product: true },
          });

          if (!variant || !variant.isActive || !variant.product.isActive) {
            throw new Error(`Sản phẩm "${variant?.name || it.variantId}" hiện không còn kinh doanh.`);
          }

          if (variant.stock < it.quantity) {
            throw new Error(
              `Sản phẩm "${variant.product.name} - ${variant.name}" chỉ còn ${variant.stock} sản phẩm trong kho (bạn đặt ${it.quantity}). Vui lòng điều chỉnh lại số lượng.`
            );
          }

          const itemPrice = Number(variant.price);
          calculatedSubtotal += itemPrice * it.quantity;

          verifiedItems.push({
            variantId: variant.id,
            productName: variant.product.name,
            variantName: variant.name,
            sku: variant.sku,
            price: itemPrice,
            quantity: it.quantity,
            image: variant.image || null,
          });

          // Trừ tồn kho biến thể
          await tx.productVariant.update({
            where: { id: variant.id },
            data: {
              stock: { decrement: it.quantity },
            },
          });
        }

        // 3. Tính toán Phí Ship & Voucher
        const standardShippingFee = calculatedSubtotal >= 500000 ? 0 : 30000;
        let finalShippingFee = standardShippingFee;
        let calculatedDiscount = 0;
        let validatedVoucherId: string | null = null;

        if (voucherCode && voucherCode.trim()) {
          const codeUpper = voucherCode.trim().toUpperCase();

          // Lock voucher row
          const lockedVoucher: { id: string }[] = await tx.$queryRaw`
            SELECT id FROM vouchers
            WHERE code = ${codeUpper}
            FOR UPDATE
          `;

          if (lockedVoucher.length === 0) {
            throw new Error(`Mã giảm giá "${codeUpper}" không tồn tại.`);
          }

          const voucher = await tx.voucher.findUnique({
            where: { code: codeUpper },
          });

          if (!voucher || !voucher.isActive) {
            throw new Error(`Mã giảm giá "${codeUpper}" hiện không hoạt động.`);
          }

          const now = new Date();
          if (now < voucher.startDate) {
            throw new Error(`Mã giảm giá "${codeUpper}" chưa đến thời gian áp dụng.`);
          }
          if (now > voucher.endDate) {
            throw new Error(`Mã giảm giá "${codeUpper}" đã hết hạn sử dụng.`);
          }

          if (voucher.usageLimit !== null && voucher.usedCount >= voucher.usageLimit) {
            throw new Error(`Mã giảm giá "${codeUpper}" đã hết số lượt sử dụng.`);
          }

          const minOrder = voucher.minOrderAmount ? Number(voucher.minOrderAmount) : 0;
          if (calculatedSubtotal < minOrder) {
            throw new Error(
              `Mã giảm giá "${codeUpper}" yêu cầu đơn hàng tối thiểu ${minOrder.toLocaleString("vi-VN")}₫.`
            );
          }

          // Tính giá trị giảm theo loại voucher
          const vValue = Number(voucher.value);
          const maxDisc = voucher.maxDiscount ? Number(voucher.maxDiscount) : null;

          if (voucher.type === "FIXED") {
            calculatedDiscount = Math.min(vValue, calculatedSubtotal);
          } else if (voucher.type === "PERCENTAGE") {
            const rawDiscount = Math.round((calculatedSubtotal * vValue) / 100);
            calculatedDiscount = maxDisc ? Math.min(rawDiscount, maxDisc) : rawDiscount;
          } else if (voucher.type === "FREE_SHIP") {
            if (calculatedSubtotal < 500000) {
              finalShippingFee = 0;
              calculatedDiscount = 30000;
            } else {
              calculatedDiscount = 0;
            }
          }

          validatedVoucherId = voucher.id;

          // Cập nhật lượt dùng voucher
          await tx.voucher.update({
            where: { id: voucher.id },
            data: { usedCount: { increment: 1 } },
          });
        }

        const calculatedTotal = Math.max(
          0,
          calculatedSubtotal - calculatedDiscount + finalShippingFee
        );

        // 4. Sinh mã đơn hàng độc nhất
        let orderNumber = generateOrderNumber();
        let isUnique = false;
        let attempts = 0;
        while (!isUnique && attempts < 5) {
          const existing = await tx.order.findUnique({
            where: { orderNumber },
            select: { id: true },
          });
          if (!existing) {
            isUnique = true;
          } else {
            orderNumber = generateOrderNumber();
            attempts++;
          }
        }

        // Mã chuyển khoản VietQR (nếu thanh toán qua VietQR)
        const transferCode =
          paymentMethod === "VIETQR"
            ? `TN${orderNumber.replace(/[^A-Za-z0-9]/g, "")}`
            : null;

        // 5. Lưu Order và OrderItems snapshot
        const newOrder = await tx.order.create({
          data: {
            orderNumber,
            userId: currentUserId,
            recipientName: recipientName.trim(),
            recipientPhone: cleanPhone,
            shippingAddress: formattedShippingAddress,
            subtotal: calculatedSubtotal,
            shippingFee: finalShippingFee,
            discountAmount: calculatedDiscount,
            total: calculatedTotal,
            paymentMethod,
            paymentStatus: "PENDING",
            orderStatus: "PENDING",
            note: note?.trim() || null,
            voucherId: validatedVoucherId,
            transferCode,
            items: {
              create: verifiedItems.map((item) => ({
                variantId: item.variantId,
                productName: item.productName,
                variantName: item.variantName,
                sku: item.sku,
                price: item.price,
                quantity: item.quantity,
                image: item.image,
              })),
            },
            statusHistory: {
              create: {
                status: "PENDING",
                note: "Đơn hàng mới được đặt trực tuyến qua website",
              },
            },
          },
          select: {
            id: true,
            orderNumber: true,
            total: true,
            subtotal: true,
            shippingFee: true,
            discountAmount: true,
            paymentMethod: true,
            transferCode: true,
            recipientName: true,
            recipientPhone: true,
            shippingAddress: true,
            createdAt: true,
          },
        });

        return newOrder;
      },
      {
        timeout: 10000, // 10 giây transaction timeout
      }
    );

    return NextResponse.json(
      {
        success: true,
        message: "Đặt hàng thành công!",
        order: {
          ...resultOrder,
          total: Number(resultOrder.total),
          subtotal: Number(resultOrder.subtotal),
          shippingFee: Number(resultOrder.shippingFee),
          discountAmount: Number(resultOrder.discountAmount),
        },
      },
      { status: 201 }
    );
  } catch (err: unknown) {
    console.error("Order creation error:", err);
    const errorMessage =
      err instanceof Error
        ? err.message
        : "Đã xảy ra lỗi trong quá trình xử lý đơn hàng. Vui lòng thử lại sau.";

    return NextResponse.json({ error: errorMessage }, { status: 400 });
  }
}
