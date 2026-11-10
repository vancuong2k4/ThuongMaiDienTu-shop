// ============================================================
// prisma/seed-flash-sales.ts
// Khởi tạo Dữ Liệu Chiến Dịch Flash Sale & Deal Giờ Vàng (Stage 9.1)
// ============================================================

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("⚡ Bắt đầu khởi tạo dữ liệu mẫu Chiến dịch Flash Sale...");

  // Tìm các sản phẩm thực tế trong DB
  const products = await prisma.product.findMany({
    include: {
      variants: true,
    },
    take: 10,
  });

  if (products.length < 4) {
    console.error("❌ Không đủ sản phẩm trong database để tạo Flash Sale.");
    return;
  }

  // 1. Dọn dẹp dữ liệu Flash Sale cũ (nếu có)
  await prisma.flashSaleItem.deleteMany({});
  await prisma.flashSale.deleteMany({});

  const now = new Date();
  const twoHoursAgo = new Date(now.getTime() - 2 * 60 * 60 * 1000);
  const twoDaysLater = new Date(now.getTime() + 48 * 60 * 60 * 1000);
  const fiveDaysLater = new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000);

  // 2. Tạo Chiến dịch 1: ĐANG DIỄN RA (Active Flash Sale)
  const activeCampaign = await prisma.flashSale.create({
    data: {
      name: "⚡ ĐẠI TIỆC GIỜ VÀNG – HÀNG BAY AIR CARGO & VITAMIN ÚC (GIẢM TỚI 35%)",
      description:
        "Săn ngay các mặt hàng ngoại nhập cao cấp: Trái cây bay 48h giữ trọn độ tươi giòn và Thực phẩm bảo vệ sức khỏe chính hãng số lượng có hạn!",
      bannerImage:
        "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&w=1400&q=80",
      startTime: twoHoursAgo,
      endTime: twoDaysLater,
      isActive: true,
    },
  });

  console.log(`✅ Đã tạo Chiến dịch Đang Diễn Ra: ${activeCampaign.name}`);

  // Thêm 5 sản phẩm vào chiến dịch đang diễn ra
  const activeItemsData = [
    {
      productIndex: 3, // Cherry Đỏ Mỹ
      discountPercent: 20,
      quantity: 50,
      soldCount: 42, // Đã bán 84% -> Sắp cháy hàng
      limitPerUser: 2,
    },
    {
      productIndex: 1, // Ginkgo Biloba Trunature
      discountPercent: 25,
      quantity: 60,
      soldCount: 38,
      limitPerUser: 1,
    },
    {
      productIndex: 2, // Collagen DHC Beauty
      discountPercent: 22,
      quantity: 40,
      soldCount: 29,
      limitPerUser: 1,
    },
    {
      productIndex: 4, // Nho Mẫu Đơn Shine Muscat
      discountPercent: 18,
      quantity: 35,
      soldCount: 28,
      limitPerUser: 2,
    },
    {
      productIndex: 0, // Hồng sâm củ khô KGC
      discountPercent: 15,
      quantity: 25,
      soldCount: 16,
      limitPerUser: 1,
    },
  ];

  for (const item of activeItemsData) {
    const prod = products[item.productIndex];
    if (!prod || prod.variants.length === 0) continue;

    const variant = prod.variants[0];
    const regularPrice = Number(variant.price);
    const salePrice = Math.round(
      (regularPrice * (100 - item.discountPercent)) / 100
    );

    await prisma.flashSaleItem.create({
      data: {
        flashSaleId: activeCampaign.id,
        productId: prod.id,
        variantId: variant.id,
        salePrice,
        quantity: item.quantity,
        soldCount: item.soldCount,
        limitPerUser: item.limitPerUser,
      },
    });

    console.log(
      `   ➔ Đã thêm deal: ${prod.name} | Giá gốc: ${regularPrice.toLocaleString(
        "vi-VN"
      )}₫ ➔ Giá Flash Sale: ${salePrice.toLocaleString("vi-VN")}₫ (${item.soldCount}/${
        item.quantity
      } đã bán)`
    );
  }

  // 3. Tạo Chiến dịch 2: SẮP DIỄN RA (Upcoming Flash Sale)
  const upcomingCampaign = await prisma.flashSale.create({
    data: {
      name: "🔥 ĐÊM HỘI SĂN DEAL – CHĂM SÓC MẸ & BÉ TIÊU CHUẨN NGOẠI NHẬP",
      description:
        "Chuẩn bị đón khung giờ vàng săn sữa công thức xách tay bay, vitamin D3K2 và hạt dinh dưỡng cao cấp với giá độc quyền cho thành viên.",
      bannerImage:
        "https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?auto=format&fit=crop&w=1400&q=80",
      startTime: twoDaysLater,
      endTime: fiveDaysLater,
      isActive: true,
    },
  });

  console.log(`✅ Đã tạo Chiến dịch Sắp Diễn Ra: ${upcomingCampaign.name}`);

  // Thêm 3 sản phẩm vào chiến dịch sắp tới (chưa mở bán, soldCount = 0)
  const upcomingIndexes = [0, 2, 5];
  for (const idx of upcomingIndexes) {
    const prod = products[idx];
    if (!prod || prod.variants.length === 0) continue;

    const variant = prod.variants[0];
    const regularPrice = Number(variant.price);
    const salePrice = Math.round((regularPrice * 0.8) / 1000) * 1000;

    await prisma.flashSaleItem.create({
      data: {
        flashSaleId: upcomingCampaign.id,
        productId: prod.id,
        variantId: variant.id,
        salePrice,
        quantity: 50,
        soldCount: 0,
        limitPerUser: 1,
      },
    });
  }

  console.log("🎉 Hoàn tất nạp dữ liệu mẫu Chiến dịch Flash Sale thành công!");
}

main()
  .catch((e) => {
    console.error("❌ Lỗi khi khởi tạo Flash Sale:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
