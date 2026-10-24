import { PrismaClient, ReviewStatus } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding realistic customer reviews...");

  // Tạo hoặc lấy một vài tài khoản khách hàng mẫu
  const customers = [
    { name: "Chị Minh Anh (Hà Nội)", email: "minhanh.review@gmail.com" },
    { name: "Anh Hoàng Nam (Đà Nẵng)", email: "hoangnam.review@gmail.com" },
    { name: "Bác Thanh Tùng (TP.HCM)", email: "thanhtung.review@gmail.com" },
    { name: "Chị Thu Thảo (Hải Phòng)", email: "thuthao.review@gmail.com" },
    { name: "Mẹ Bé Bắp (Cần Thơ)", email: "mebebap.review@gmail.com" },
  ];

  const userIds: string[] = [];
  for (const c of customers) {
    const u = await prisma.user.upsert({
      where: { email: c.email },
      update: { name: c.name },
      create: {
        email: c.email,
        name: c.name,
        role: "CUSTOMER",
      },
    });
    userIds.push(u.id);
  }

  // 1. Review cho Hồng sâm KGC
  const hongSam = await prisma.product.findUnique({
    where: { slug: "hong-sam-cu-kho-kgc-jung-kwan-jang-han-quoc" },
  });
  if (hongSam) {
    await prisma.review.upsert({
      where: {
        productId_userId: {
          productId: hongSam.id,
          userId: userIds[0],
        },
      },
      update: {},
      create: {
        productId: hongSam.id,
        userId: userIds[0],
        rating: 5,
        content:
          "Hàng chuẩn KGC 100%, có tem phụ và quét mã QR chính phủ Hàn Quốc đầy đủ. Hộp thiếc bên trong có hộp gỗ thông rất thơm và sang trọng, mua biếu bố mẹ ai cũng khen. Shop đóng gói cẩn thận 3 lớp chống sốc.",
        status: ReviewStatus.APPROVED,
        images: [
          "https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=400&q=80",
        ],
      },
    });

    await prisma.review.upsert({
      where: {
        productId_userId: {
          productId: hongSam.id,
          userId: userIds[2],
        },
      },
      update: {},
      create: {
        productId: hongSam.id,
        userId: userIds[2],
        rating: 5,
        content:
          "Bố mình uống được 2 tuần thấy ăn ngon ngủ sâu giấc hơn hẳn, giảm hẳn chứng đau đầu mệt mỏi. Date xa tận 10 năm từ NSX nên rất yên tâm tích trữ. Sẽ ủng hộ shop lâu dài!",
        status: ReviewStatus.APPROVED,
        images: [],
      },
    });
  }

  // 2. Review cho Cherry Mỹ
  const cherry = await prisma.product.findUnique({
    where: { slug: "cherry-do-my-size-9-hang-bay" },
  });
  if (cherry) {
    await prisma.review.upsert({
      where: {
        productId_userId: {
          productId: cherry.id,
          userId: userIds[1],
        },
      },
      update: {},
      create: {
        productId: cherry.id,
        userId: userIds[1],
        rating: 5,
        content:
          "Cherry quả to bự size 9 đúng chuẩn, cuống còn tươi xanh lét, cắn vào giòn sần sật ngọt đậm nước. Giao hàng hỏa tốc trong hộp xốp kèm đá gel mát rượi. Đáng đồng tiền bát gạo!",
        status: ReviewStatus.APPROVED,
        images: [
          "https://images.unsplash.com/photo-1528825871115-3581a5387919?auto=format&fit=crop&w=400&q=80",
        ],
      },
    });
  }

  // 3. Review cho Sữa Aptamil Úc
  const aptamil = await prisma.product.findUnique({
    where: { slug: "sua-bot-aptamil-profutura-uc-lon-900g" },
  });
  if (aptamil) {
    await prisma.review.upsert({
      where: {
        productId_userId: {
          productId: aptamil.id,
          userId: userIds[4],
        },
      },
      update: {},
      create: {
        productId: aptamil.id,
        userId: userIds[4],
        rating: 5,
        content:
          "Bé nhà mình đổi từ sữa khác sang Aptamil Úc của shop trộm vía output cực đều, không bị táo bón chút nào. Vị thanh mát nhạt giống sữa mẹ, lon thiếc nguyên đai nguyên kiện date xa tít mù.",
        status: ReviewStatus.APPROVED,
        images: [],
      },
    });
  }

  console.log("✅ Seeded customer reviews successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Failed to seed reviews:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
