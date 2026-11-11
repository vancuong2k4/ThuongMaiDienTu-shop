// ============================================================
// prisma/seed-subscriptions.ts
// Khởi tạo Dữ Liệu Gói Đơn Hàng Giao Định Kỳ (Subscribe & Save)
// ============================================================

import {
  PrismaClient,
  SubscriptionFrequency,
  SubscriptionStatus,
  PaymentMethod,
} from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🔄 Bắt đầu nạp dữ liệu mẫu Gói Giao Hàng Định Kỳ (Subscribe & Save)...");

  // 1. Tìm tài khoản khách hàng
  const customers = await prisma.user.findMany({
    where: { role: "CUSTOMER" },
    take: 3,
    orderBy: { createdAt: "asc" },
  });

  if (customers.length === 0) {
    console.log("⚠️ Không tìm thấy khách hàng nào để tạo gói định kỳ.");
    return;
  }

  // 2. Tìm một số biến thể sản phẩm tiêu biểu (Sữa Úc, TPCN, Mật ong)
  const variants = await prisma.productVariant.findMany({
    take: 5,
    include: {
      product: {
        select: {
          name: true,
          images: true,
        },
      },
    },
  });

  if (variants.length === 0) {
    console.log("⚠️ Không tìm thấy biến thể sản phẩm nào.");
    return;
  }

  // Xóa các gói định kỳ mẫu cũ nếu có
  await prisma.subscriptionItem.deleteMany({});
  await prisma.subscription.deleteMany({});

  const now = new Date();

  // Gói 1: Sữa bột cho bé - Giao 1 tháng/lần (ACTIVE)
  const user1 = customers[0];
  const var1 = variants[0];
  const price1 = Number(var1.price);
  const discounted1 = Math.round(price1 * 0.9); // Giảm 10%

  const next1 = new Date(now.getTime() + 10 * 24 * 60 * 60 * 1000); // 10 ngày nữa giao
  const last1 = new Date(now.getTime() - 20 * 24 * 60 * 60 * 1000);

  const sub1 = await prisma.subscription.create({
    data: {
      subscriptionNumber: "SUB-2026-0001",
      userId: user1.id,
      frequency: SubscriptionFrequency.EVERY_1_MONTH,
      status: SubscriptionStatus.ACTIVE,
      discountPercent: 10,
      startDate: new Date(now.getTime() - 80 * 24 * 60 * 60 * 1000),
      nextDeliveryDate: next1,
      lastDeliveryDate: last1,
      totalCyclesDelivered: 2,
      recipientName: user1.name || "Nguyễn Thùy Nga",
      recipientPhone: user1.phone || "0988888888",
      shippingAddress: "Số 88 Phố Huế, Phường Hàng Bài, Quận Hoàn Kiếm, Hà Nội",
      paymentMethod: PaymentMethod.COD,
      note: "Giao trong giờ hành chính, gọi trước 15 phút giúp mình",
      items: {
        create: [
          {
            variantId: var1.id,
            productName: var1.product.name,
            variantName: var1.name,
            sku: var1.sku,
            originalPrice: price1,
            price: discounted1,
            quantity: 2,
            image: var1.product.images[0]?.url || null,
          },
        ],
      },
    },
  });
  console.log(`✅ Đã tạo gói định kỳ 1: ${sub1.subscriptionNumber} (${user1.name || user1.email})`);

  // Gói 2: Mật ong & Thực phẩm chăm sóc sức khỏe - Giao 2 tuần/lần (ACTIVE)
  const user2 = customers[1] || customers[0];
  const var2 = variants[1] || variants[0];
  const price2 = Number(var2.price);
  const discounted2 = Math.round(price2 * 0.9);

  const next2 = new Date(now.getTime() + 4 * 24 * 60 * 60 * 1000); // 4 ngày nữa giao
  const last2 = new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000);

  const sub2 = await prisma.subscription.create({
    data: {
      subscriptionNumber: "SUB-2026-0002",
      userId: user2.id,
      frequency: SubscriptionFrequency.EVERY_2_WEEKS,
      status: SubscriptionStatus.ACTIVE,
      discountPercent: 10,
      startDate: new Date(now.getTime() - 24 * 24 * 60 * 60 * 1000),
      nextDeliveryDate: next2,
      lastDeliveryDate: last2,
      totalCyclesDelivered: 1,
      recipientName: user2.name || "Khách Hàng Thân Thiết",
      recipientPhone: user2.phone || "0912345678",
      shippingAddress: "Căn hộ 1205 Tòa Landmark 81, Vinhomes Central Park, Phường 22, Quận Bình Thạnh, TP. Hồ Chí Minh",
      paymentMethod: PaymentMethod.VIETQR,
      note: "Hàng date mới nhất chuẩn Air Cargo giữ lạnh",
      items: {
        create: [
          {
            variantId: var2.id,
            productName: var2.product.name,
            variantName: var2.name,
            sku: var2.sku,
            originalPrice: price2,
            price: discounted2,
            quantity: 1,
            image: var2.product.images[0]?.url || null,
          },
        ],
      },
    },
  });
  console.log(`✅ Đã tạo gói định kỳ 2: ${sub2.subscriptionNumber} (${user2.name || user2.email})`);

  // Gói 3: Vitamin Bổ Khớp - Giao 2 tháng/lần (PAUSED)
  const user3 = customers[2] || customers[0];
  const var3 = variants[2] || variants[0];
  const price3 = Number(var3.price);
  const discounted3 = Math.round(price3 * 0.9);

  const next3 = new Date(now.getTime() + 25 * 24 * 60 * 60 * 1000);

  const sub3 = await prisma.subscription.create({
    data: {
      subscriptionNumber: "SUB-2026-0003",
      userId: user3.id,
      frequency: SubscriptionFrequency.EVERY_2_MONTHS,
      status: SubscriptionStatus.PAUSED,
      discountPercent: 10,
      startDate: new Date(now.getTime() - 120 * 24 * 60 * 60 * 1000),
      nextDeliveryDate: next3,
      totalCyclesDelivered: 1,
      pausedAt: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000),
      recipientName: user3.name || "Trần Văn Cường",
      recipientPhone: user3.phone || "0934567890",
      shippingAddress: "Số 25 ngõ 68 Cầu Giấy, Phường Quan Hoa, Quận Cầu Giấy, Hà Nội",
      paymentMethod: PaymentMethod.COD,
      note: "Khách đi công tác tạm dừng 2 tuần",
      items: {
        create: [
          {
            variantId: var3.id,
            productName: var3.product.name,
            variantName: var3.name,
            sku: var3.sku,
            originalPrice: price3,
            price: discounted3,
            quantity: 1,
            image: var3.product.images[0]?.url || null,
          },
        ],
      },
    },
  });
  console.log(`✅ Đã tạo gói định kỳ 3: ${sub3.subscriptionNumber} (${user3.name || user3.email} - PAUSED)`);

  console.log("🎉 Hoàn tất nạp dữ liệu mẫu Giao Hàng Định Kỳ (Subscribe & Save)!");
}

main()
  .catch((e) => {
    console.error("Lỗi khi nạp dữ liệu mẫu subscription:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
