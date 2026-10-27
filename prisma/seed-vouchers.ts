import { PrismaClient, VoucherType } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding realistic Vouchers...");

  const now = new Date();
  const startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000); // Hôm qua
  const endDate = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000); // 30 ngày tới

  const vouchers = [
    {
      code: "WELCOME50",
      type: VoucherType.FIXED,
      value: 50000,
      minOrderAmount: 500000,
      maxDiscount: null,
      usageLimit: 1000,
      userLimit: 1,
      startDate,
      endDate,
      isActive: true,
    },
    {
      code: "FREESHIP",
      type: VoucherType.FREE_SHIP,
      value: 30000,
      minOrderAmount: 300000,
      maxDiscount: 30000,
      usageLimit: 500,
      userLimit: 1,
      startDate,
      endDate,
      isActive: true,
    },
    {
      code: "THUYNGA10",
      type: VoucherType.PERCENTAGE,
      value: 10, // 10%
      minOrderAmount: 1000000,
      maxDiscount: 150000, // Tối đa 150.000₫
      usageLimit: 200,
      userLimit: 1,
      startDate,
      endDate,
      isActive: true,
    },
    {
      code: "VIP200K",
      type: VoucherType.FIXED,
      value: 200000,
      minOrderAmount: 2000000,
      maxDiscount: null,
      usageLimit: 100,
      userLimit: 1,
      startDate,
      endDate,
      isActive: true,
    },
  ];

  for (const v of vouchers) {
    await prisma.voucher.upsert({
      where: { code: v.code },
      update: {
        type: v.type,
        value: v.value,
        minOrderAmount: v.minOrderAmount,
        maxDiscount: v.maxDiscount,
        usageLimit: v.usageLimit,
        startDate: v.startDate,
        endDate: v.endDate,
        isActive: v.isActive,
      },
      create: {
        code: v.code,
        type: v.type,
        value: v.value,
        minOrderAmount: v.minOrderAmount,
        maxDiscount: v.maxDiscount,
        usageLimit: v.usageLimit,
        userLimit: v.userLimit,
        startDate: v.startDate,
        endDate: v.endDate,
        isActive: v.isActive,
      },
    });
  }

  console.log("✅ Seeded 4 vouchers successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
