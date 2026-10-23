import { PrismaClient, Role } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting database seeding...");

  // 1. Create or update Admin account
  const adminPassword = await hash("Admin@123456", 10);
  const adminUser = await prisma.user.upsert({
    where: { email: "admin@thuyngashop.com.vn" },
    update: {},
    create: {
      email: "admin@thuyngashop.com.vn",
      name: "Trần Văn Cường (Admin)",
      phone: "0987654321",
      passwordHash: adminPassword,
      role: Role.ADMIN,
      isActive: true,
    },
  });
  console.log("✅ Admin user ready:", adminUser.email);

  // 2. Create 5 Main Categories & Subcategories (2 levels)
  const categoriesData = [
    {
      name: "Thực phẩm chức năng",
      slug: "thuc-pham-chuc-nang",
      description: "Thực phẩm bảo vệ sức khỏe, vitamin, khoáng chất, collagen nhập khẩu chính hãng.",
      sortOrder: 1,
      children: [
        { name: "Vitamin & Khoáng chất", slug: "vitamin-khoang-chat", sortOrder: 1 },
        { name: "Chăm sóc tim mạch & huyết áp", slug: "tim-mach-huyet-ap", sortOrder: 2 },
        { name: "Bổ não & Tăng cường trí nhớ", slug: "bo-nao-tang-cuong-tri-nho", sortOrder: 3 },
        { name: "Hỗ trợ xương khớp", slug: "ho-tro-xuong-khop", sortOrder: 4 },
        { name: "Hồng sâm & Đông trùng hạ thảo", slug: "hong-sam-dong-trung-ha-thao", sortOrder: 5 },
      ],
    },
    {
      name: "Thực phẩm & Đồ uống nhập khẩu",
      slug: "thuc-pham-do-uong-nhap-khau",
      description: "Bánh kẹo, trà, cà phê, hạt dinh dưỡng, gia vị và đồ uống cao cấp nhập khẩu.",
      sortOrder: 2,
      children: [
        { name: "Hạt dinh dưỡng & Ngũ cốc", slug: "hat-dinh-duong-ngu-coc", sortOrder: 1 },
        { name: "Bánh kẹo & Chocolate nhập khẩu", slug: "banh-keo-chocolate-nhap-khau", sortOrder: 2 },
        { name: "Trà & Cà phê ngoại nhập", slug: "tra-ca-phe-ngoai-nhap", sortOrder: 3 },
        { name: "Nước ép & Đồ uống dinh dưỡng", slug: "nuoc-ep-do-uong-dinh-duong", sortOrder: 4 },
        { name: "Gia vị & Dầu ăn cao cấp", slug: "gia-vi-dau-an-cao-cap", sortOrder: 5 },
      ],
    },
    {
      name: "Trái cây nhập khẩu",
      slug: "trai-cay-nhap-khau",
      description: "Trái cây tươi ngon nhập khẩu đường hàng không, chuẩn VietGAP/GlobalGAP.",
      sortOrder: 3,
      children: [
        { name: "Cherry Mỹ / Úc / New Zealand", slug: "cherry-nhap-khau", sortOrder: 1 },
        { name: "Nho mẫu đơn & Nho ngón tay", slug: "nho-nhap-khau", sortOrder: 2 },
        { name: "Táo Envy & Rockit", slug: "tao-envy-rockit", sortOrder: 3 },
        { name: "Kiwi vàng New Zealand", slug: "kiwi-vang", sortOrder: 4 },
        { name: "Hộp quà & Giỏ trái cây cao cấp", slug: "gio-trai-cay-cao-cap", sortOrder: 5 },
      ],
    },
    {
      name: "Mỹ phẩm & Chăm sóc cá nhân",
      slug: "my-pham-cham-soc-ca-nhan",
      description: "Dược mỹ phẩm, chăm sóc da mặt, chống lão hóa, kem chống nắng chính hãng.",
      sortOrder: 4,
      children: [
        { name: "Làm sạch & Tẩy trang", slug: "lam-sach-tay-trang", sortOrder: 1 },
        { name: "Serum & Tinh chất phục hồi", slug: "serum-tinh-chat-phuc-hoi", sortOrder: 2 },
        { name: "Kem dưỡng & Chống lão hóa", slug: "kem-duong-chong-lao-hoa", sortOrder: 3 },
        { name: "Kem chống nắng chuyên sâu", slug: "kem-chong-nang", sortOrder: 4 },
        { name: "Chăm sóc cơ thể & Tóc", slug: "cham-soc-co-the-toc", sortOrder: 5 },
      ],
    },
    {
      name: "Mẹ & Bé",
      slug: "me-va-be",
      description: "Sữa bột, dinh dưỡng ăn dặm, vitamin cho mẹ bầu và bé yêu nhập khẩu an toàn.",
      sortOrder: 5,
      children: [
        { name: "Sữa bột công thức nhập khẩu", slug: "sua-bot-cong-thuc", sortOrder: 1 },
        { name: "Dinh dưỡng ăn dặm & Bánh ăn dặm", slug: "dinh-duong-an-dam", sortOrder: 2 },
        { name: "Vitamin & Tăng đề kháng cho bé", slug: "vitamin-de-khang-cho-be", sortOrder: 3 },
        { name: "Chăm sóc mẹ trước & sau sinh", slug: "cham-soc-me-truoc-sau-sinh", sortOrder: 4 },
        { name: "Đồ dùng vệ sinh cho bé", slug: "do-dung-ve-sinh-cho-be", sortOrder: 5 },
      ],
    },
  ];

  for (const cat of categoriesData) {
    const parent = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {
        name: cat.name,
        description: cat.description,
        sortOrder: cat.sortOrder,
      },
      create: {
        name: cat.name,
        slug: cat.slug,
        description: cat.description,
        sortOrder: cat.sortOrder,
      },
    });

    for (const child of cat.children) {
      await prisma.category.upsert({
        where: { slug: child.slug },
        update: {
          name: child.name,
          parentId: parent.id,
          sortOrder: child.sortOrder,
        },
        create: {
          name: child.name,
          slug: child.slug,
          parentId: parent.id,
          sortOrder: child.sortOrder,
        },
      });
    }
  }
  console.log("✅ 5 Main Categories & Subcategories seeded successfully!");

  // 3. Site Settings (Thông tin cơ bản của shop)
  const siteConfig = {
    brandName: "THUYNGA Shop",
    slogan: "Hàng nhập khẩu chính hãng – Trao sức khỏe, trọn niềm tin",
    hotline: "0987.654.321",
    email: "cskh@thuyngashop.com.vn",
    address: "Số 88 Phố Huế, Hai Bà Trưng, Hà Nội",
    fanpage: "https://facebook.com/thuyngashop.com.vn",
    zalo: "https://zalo.me/0987654321",
    openingHours: "08:00 - 21:30 hàng ngày",
  };

  await prisma.siteSetting.upsert({
    where: { key: "site_config" },
    update: { value: siteConfig },
    create: {
      key: "site_config",
      value: siteConfig,
    },
  });
  console.log("✅ Site configuration seeded!");

  console.log("🎉 Seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
