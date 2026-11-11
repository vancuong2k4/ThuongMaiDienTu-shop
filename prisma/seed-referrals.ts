// ============================================================
// prisma/seed-referrals.ts
// Khởi tạo Dữ Liệu Mã Giới Thiệu & Lịch Sử Mời Bạn Bè (Stage 12.1)
// ============================================================

import { PrismaClient, ReferralStatus } from "@prisma/client";

const prisma = new PrismaClient();

function generateCode(name: string | null, index: number): string {
  const cleanName = (name || "USER")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^A-Za-z0-9]/g, "")
    .toUpperCase()
    .slice(0, 5);
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let random = "";
  for (let i = 0; i < 3; i++) {
    random += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `TNREF${cleanName}${index}${random}`.slice(0, 12);
}

async function main() {
  console.log("👥 Bắt đầu khởi tạo dữ liệu Giới Thiệu Bạn Bè (Referral Program)...");

  // Tìm tất cả khách hàng
  const customers = await prisma.user.findMany({
    where: { role: "CUSTOMER" },
    include: {
      orders: {
        where: { orderStatus: "DELIVERED" },
        take: 1,
      },
    },
    orderBy: { createdAt: "asc" },
  });

  if (customers.length === 0) {
    console.log("⚠️ Không tìm thấy khách hàng nào để seed referral.");
    return;
  }

  // 1. Cập nhật mã giới thiệu referralCode cho từng khách hàng
  for (let i = 0; i < customers.length; i++) {
    const customer = customers[i];
    let refCode = customer.referralCode;
    if (!refCode) {
      refCode = generateCode(customer.name, i + 1);
      await prisma.user.update({
        where: { id: customer.id },
        data: { referralCode: refCode },
      });
    }
  }

  // 2. Dọn dẹp dữ liệu referral cũ
  await prisma.referralRecord.deleteMany({});

  // 3. Chọn 1 khách hàng chính làm người giới thiệu tích cực (ví dụ người đầu tiên)
  const mainReferrer = customers[0];
  const now = new Date();

  console.log(
    `⭐ Thiết lập ${mainReferrer.name || mainReferrer.email} (Mã: ${
      mainReferrer.referralCode
    }) làm Người giới thiệu mẫu...`
  );

  // Tạo các mối liên kết bạn bè
  if (customers.length >= 4) {
    // Bạn bè 1: Đã mua đơn đầu tiên & đã nhận thưởng (+500 điểm)
    const refereeRewarded = customers[1];
    const deliveredOrder = refereeRewarded.orders[0] || null;

    await prisma.user.update({
      where: { id: refereeRewarded.id },
      data: { referredById: mainReferrer.id },
    });

    await prisma.referralRecord.create({
      data: {
        referrerId: mainReferrer.id,
        refereeId: refereeRewarded.id,
        orderId: deliveredOrder ? deliveredOrder.id : null,
        status: ReferralStatus.REWARDED,
        referrerRewardPoints: 500,
        refereeVoucherCode: "BANMOI-50K-8A9B",
        rewardedAt: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000),
        createdAt: new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000),
      },
    });

    // Bạn bè 2: Đang xử lý đơn đầu tiên (QUALIFIED)
    const refereeQualified = customers[2];
    await prisma.user.update({
      where: { id: refereeQualified.id },
      data: { referredById: mainReferrer.id },
    });

    await prisma.referralRecord.create({
      data: {
        referrerId: mainReferrer.id,
        refereeId: refereeQualified.id,
        status: ReferralStatus.QUALIFIED,
        referrerRewardPoints: 500,
        refereeVoucherCode: "BANMOI-50K-2C4D",
        createdAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000),
      },
    });

    // Bạn bè 3: Vừa đăng ký, chưa đặt đơn (PENDING)
    const refereePending = customers[3];
    await prisma.user.update({
      where: { id: refereePending.id },
      data: { referredById: mainReferrer.id },
    });

    await prisma.referralRecord.create({
      data: {
        referrerId: mainReferrer.id,
        refereeId: refereePending.id,
        status: ReferralStatus.PENDING,
        referrerRewardPoints: 500,
        refereeVoucherCode: "BANMOI-50K-9X1Y",
        createdAt: new Date(now.getTime() - 12 * 60 * 60 * 1000),
      },
    });
  }

  const recordCount = await prisma.referralRecord.count();
  console.log(`✅ Khởi tạo thành công ${recordCount} liên kết giới thiệu bạn bè mẫu!`);
}

main()
  .catch((e) => {
    console.error("❌ Lỗi khi seed referrals:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
