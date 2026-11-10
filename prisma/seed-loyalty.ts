// ============================================================
// prisma/seed-loyalty.ts
// Khởi tạo Dữ Liệu Thành Viên & Điểm Tích Lũy THUYNGA Club (Stage 10.1)
// ============================================================

import { PrismaClient, MembershipTier, LoyaltyType } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("💎 Bắt đầu khởi tạo dữ liệu THUYNGA Club & Điểm tích lũy...");

  // Tìm tất cả khách hàng
  const customers = await prisma.user.findMany({
    where: { role: "CUSTOMER" },
  });

  if (customers.length === 0) {
    console.log("⚠️ Không tìm thấy khách hàng nào để seed loyalty.");
    return;
  }

  // Dọn dẹp giao dịch cũ
  await prisma.loyaltyTransaction.deleteMany({});

  const tiersData: {
    emailPattern: string;
    tier: MembershipTier;
    currentPoints: number;
    totalEarned: number;
    transactions: {
      points: number;
      type: LoyaltyType;
      desc: string;
      daysAgo: number;
    }[];
  }[] = [
    {
      emailPattern: "cuongtran",
      tier: MembershipTier.DIAMOND,
      currentPoints: 3450,
      totalEarned: 5200,
      transactions: [
        {
          points: 100,
          type: LoyaltyType.SIGNUP_BONUS,
          desc: "Tặng điểm thưởng chào mừng gia nhập THUYNGA Club",
          daysAgo: 30,
        },
        {
          points: 1200,
          type: LoyaltyType.EARN_ORDER,
          desc: "Tích lũy từ đơn hàng Hồng sâm KGC 6 năm tuổi",
          daysAgo: 25,
        },
        {
          points: 1500,
          type: LoyaltyType.EARN_ORDER,
          desc: "Tích lũy từ đơn hàng Thùng Cherry Mỹ & Nho mẫu đơn",
          daysAgo: 18,
        },
        {
          points: -900,
          type: LoyaltyType.REDEEM_VOUCHER,
          desc: "Đổi điểm nhận Voucher VIP giảm 100.000₫",
          daysAgo: 12,
        },
        {
          points: 1900,
          type: LoyaltyType.EARN_ORDER,
          desc: "Tích lũy từ đơn hàng Thực phẩm chức năng Úc cao cấp",
          daysAgo: 5,
        },
        {
          points: 500,
          type: LoyaltyType.ADMIN_ADJUST,
          desc: "Quà tặng thăng hạng Kim Cương (Diamond Member Reward)",
          daysAgo: 2,
        },
        {
          points: -850,
          type: LoyaltyType.REDEEM_ORDER,
          desc: "Dùng điểm trừ trực tiếp vào đơn hàng đặt online",
          daysAgo: 1,
        },
      ],
    },
    {
      emailPattern: "khachhang",
      tier: MembershipTier.GOLD,
      currentPoints: 1850,
      totalEarned: 2600,
      transactions: [
        {
          points: 100,
          type: LoyaltyType.SIGNUP_BONUS,
          desc: "Tặng điểm thưởng chào mừng gia nhập THUYNGA Club",
          daysAgo: 20,
        },
        {
          points: 800,
          type: LoyaltyType.EARN_ORDER,
          desc: "Tích lũy từ đơn hàng Sữa Aptamil Profutura Úc",
          daysAgo: 15,
        },
        {
          points: 1200,
          type: LoyaltyType.EARN_ORDER,
          desc: "Tích lũy từ đơn hàng Combo Tảo xoắn & D3K2MK7",
          daysAgo: 8,
        },
        {
          points: -500,
          type: LoyaltyType.REDEEM_VOUCHER,
          desc: "Đổi điểm nhận Voucher 50.000₫",
          daysAgo: 4,
        },
        {
          points: 250,
          type: LoyaltyType.ADMIN_ADJUST,
          desc: "Thưởng sinh nhật thành viên Vàng (Gold Member)",
          daysAgo: 2,
        },
      ],
    },
    {
      emailPattern: "minhanh",
      tier: MembershipTier.SILVER,
      currentPoints: 680,
      totalEarned: 980,
      transactions: [
        {
          points: 100,
          type: LoyaltyType.SIGNUP_BONUS,
          desc: "Tặng điểm thưởng chào mừng gia nhập THUYNGA Club",
          daysAgo: 15,
        },
        {
          points: 580,
          type: LoyaltyType.EARN_ORDER,
          desc: "Tích lũy từ đơn hàng Trái cây bay Air Cargo",
          daysAgo: 10,
        },
        {
          points: 300,
          type: LoyaltyType.EARN_ORDER,
          desc: "Tích lũy từ đơn hàng Collagen DHC Beauty",
          daysAgo: 4,
        },
        {
          points: -300,
          type: LoyaltyType.REDEEM_ORDER,
          desc: "Dùng điểm giảm trừ đơn hàng",
          daysAgo: 1,
        },
      ],
    },
    {
      emailPattern: "thanhtung",
      tier: MembershipTier.GOLD,
      currentPoints: 1450,
      totalEarned: 1950,
      transactions: [
        {
          points: 100,
          type: LoyaltyType.SIGNUP_BONUS,
          desc: "Tặng điểm thưởng chào mừng gia nhập THUYNGA Club",
          daysAgo: 25,
        },
        {
          points: 1550,
          type: LoyaltyType.EARN_ORDER,
          desc: "Tích lũy từ đơn hàng Cao hồng sâm Hàn Quốc",
          daysAgo: 14,
        },
        {
          points: -500,
          type: LoyaltyType.REDEEM_VOUCHER,
          desc: "Đổi điểm nhận Voucher giảm 50.000₫",
          daysAgo: 6,
        },
        {
          points: 300,
          type: LoyaltyType.ADMIN_ADJUST,
          desc: "Điểm thưởng khách hàng thân thiết từ Dược sĩ Thu Nga",
          daysAgo: 1,
        },
      ],
    },
  ];

  for (const customer of customers) {
    const matchedTierData = tiersData.find((t) =>
      customer.email.toLowerCase().includes(t.emailPattern)
    );

    const tier = matchedTierData ? matchedTierData.tier : MembershipTier.BRONZE;
    const currentPoints = matchedTierData ? matchedTierData.currentPoints : 150;
    const totalEarned = matchedTierData ? matchedTierData.totalEarned : 150;

    // Cập nhật User
    await prisma.user.update({
      where: { id: customer.id },
      data: {
        membershipTier: tier,
        loyaltyPoints: currentPoints,
        totalPointsEarned: totalEarned,
      },
    });

    console.log(
      `👤 Cập nhật khách hàng: ${customer.name || customer.email} ➔ Hạng ${tier} | Số dư: ${currentPoints} điểm`
    );

    // Tạo lịch sử giao dịch
    if (matchedTierData && matchedTierData.transactions.length > 0) {
      let rollingBalance = 0;
      for (const tx of matchedTierData.transactions) {
        rollingBalance += tx.points;
        const txDate = new Date(
          Date.now() - tx.daysAgo * 24 * 60 * 60 * 1000
        );

        await prisma.loyaltyTransaction.create({
          data: {
            userId: customer.id,
            points: tx.points,
            type: tx.type,
            description: tx.desc,
            balanceAfter: Math.max(0, rollingBalance),
            createdAt: txDate,
          },
        });
      }
    } else {
      // Mặc định giao dịch chào mừng
      await prisma.loyaltyTransaction.create({
        data: {
          userId: customer.id,
          points: 150,
          type: LoyaltyType.SIGNUP_BONUS,
          description: "Tặng điểm thưởng chào mừng gia nhập THUYNGA Club",
          balanceAfter: 150,
          createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        },
      });
    }
  }

  console.log("🎉 Khởi tạo dữ liệu THUYNGA Club thành công!");
}

main()
  .catch((e) => {
    console.error("❌ Lỗi khi khởi tạo Loyalty:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
