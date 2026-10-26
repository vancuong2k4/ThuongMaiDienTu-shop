import { PrismaClient, Role } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding Products, Variants & Flash Sale...");

  // Lấy các danh mục chính
  const catTpcN = await prisma.category.findUnique({ where: { slug: "thuc-pham-chuc-nang" } });
  const catFnb = await prisma.category.findUnique({ where: { slug: "thuc-pham-do-uong-nhap-khau" } });
  const catFruit = await prisma.category.findUnique({ where: { slug: "trai-cay-nhap-khau" } });
  const catCosme = await prisma.category.findUnique({ where: { slug: "my-pham-cham-soc-ca-nhan" } });
  const catMomBaby = await prisma.category.findUnique({ where: { slug: "me-va-be" } });

  if (!catTpcN || !catFnb || !catFruit || !catCosme || !catMomBaby) {
    console.error("Categories not found, run initial seed first!");
    return;
  }

  const getSubcatId = async (slug: string, fallbackId: string) => {
    const sub = await prisma.category.findUnique({ where: { slug } });
    return sub ? sub.id : fallbackId;
  };

  const catHongSam = await getSubcatId("hong-sam-dong-trung-ha-thao", catTpcN.id);
  const catBoNao = await getSubcatId("bo-nao-tang-cuong-tri-nho", catTpcN.id);
  const catVitamin = await getSubcatId("vitamin-khoang-chat", catTpcN.id);
  const catCherry = await getSubcatId("cherry-nhap-khau", catFruit.id);
  const catNho = await getSubcatId("nho-nhap-khau", catFruit.id);
  const catTao = await getSubcatId("tao-envy-rockit", catFruit.id);
  const catMacca = await getSubcatId("hat-dinh-duong-ngu-coc", catFnb.id);
  const catBanhKeo = await getSubcatId("banh-keo-chocolate-nhap-khau", catFnb.id);
  const catChongNang = await getSubcatId("kem-chong-nang", catCosme.id);
  const catSerum = await getSubcatId("serum-tinh-chat-phuc-hoi", catCosme.id);
  const catSuaBot = await getSubcatId("sua-bot-cong-thuc", catMomBaby.id);
  const catAnDam = await getSubcatId("dinh-duong-an-dam", catMomBaby.id);

  // ── Danh sách sản phẩm mẫu chuẩn ──────────────────────────────────────────
  const products = [
    // 1. Thực phẩm chức năng
    {
      name: "Hồng sâm củ khô KGC Jung Kwan Jang Hàn Quốc (Hộp thiếc)",
      slug: "hong-sam-cu-kho-kgc-jung-kwan-jang-han-quoc",
      categoryId: catHongSam,
      brand: "KGC Jung Kwan Jang",
      origin: "Hàn Quốc",
      specification: "Hộp thiếc hút chân không kèm hộp gỗ thông",
      expiryInfo: "10 năm kể từ ngày sản xuất",
      shortDesc: "100% củ hồng sâm 6 năm tuổi tuyển chọn nghiêm ngặt theo tiêu chuẩn chính phủ Hàn Quốc.",
      description: "<p>Hồng sâm củ khô KGC Jung Kwan Jang là sản phẩm biểu tượng của Tập đoàn Nhân sâm Hàn Quốc. Chứa hàm lượng Saponin dồi dào, giúp bồi bổ nguyên khí, tăng cường thể lực và phòng ngừa suy nhược cơ thể.</p>",
      isFeatured: true,
      variants: [
        {
          name: "Hộp 75g (khoảng 5-7 củ)",
          sku: "KGC-75G",
          price: 1850000,
          originalPrice: 2150000,
          stock: 45,
          image: "https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=600&q=80",
          isDefault: true,
        },
        {
          name: "Hộp 150g (khoảng 10-14 củ)",
          sku: "KGC-150G",
          price: 3450000,
          originalPrice: 3900000,
          stock: 30,
          image: "https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=600&q=80",
          isDefault: false,
        },
        {
          name: "Hộp 300g (khoảng 20-25 củ)",
          sku: "KGC-300G",
          price: 6500000,
          originalPrice: 7200000,
          stock: 15,
          image: "https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=600&q=80",
          isDefault: false,
        },
      ],
    },
    {
      name: "Viên uống bổ não Ginkgo Biloba Trunature 120mg Mỹ",
      slug: "vien-uong-bo-nao-ginkgo-biloba-trunature-120mg",
      categoryId: catBoNao,
      brand: "Trunature",
      origin: "Mỹ",
      specification: "Lọ 340 viên nang mềm",
      expiryInfo: "36 tháng từ NSX (Date xa)",
      shortDesc: "Chiết xuất lá bạch quả Ginkgo Biloba chuẩn hóa giúp tăng tuần hoàn máu não, giảm chóng mặt, hoa mắt.",
      description: "<p>Sản phẩm hàng đầu tại Mỹ giúp cải thiện trí nhớ, tăng độ tập trung và hỗ trợ tuần hoàn não cho người làm việc căng thẳng và người cao tuổi.</p>",
      isFeatured: true,
      variants: [
        {
          name: "Lọ 340 viên",
          sku: "TRU-GINKGO-340",
          price: 520000,
          originalPrice: 650000,
          stock: 80,
          image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=600&q=80",
          isDefault: true,
        },
      ],
    },
    {
      name: "Collagen Nước DHC Beauty 7000 Plus Nhật Bản",
      slug: "collagen-nuoc-dhc-beauty-7000-plus-nhat-ban",
      categoryId: catVitamin,
      brand: "DHC",
      origin: "Nhật Bản",
      specification: "Hộp 10 chai x 50ml",
      expiryInfo: "24 tháng kể từ ngày sản xuất",
      shortDesc: "Hàm lượng collagen phân tử siêu nhỏ 7000mg kết hợp vitamin C giúp da căng mịn, đàn hồi.",
      description: "<p>Dòng collagen nước cao cấp nhất của DHC Nhật Bản, hấp thụ nhanh gấp 3 lần collagen thông thường.</p>",
      isFeatured: true,
      variants: [
        {
          name: "Hộp 10 chai (50ml/chai)",
          sku: "DHC-COL-10",
          price: 780000,
          originalPrice: 950000,
          stock: 60,
          image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=600&q=80",
          isDefault: true,
        },
        {
          name: "Combo 3 hộp (Liệu trình 1 tháng)",
          sku: "DHC-COL-COMBO3",
          price: 2190000,
          originalPrice: 2850000,
          stock: 25,
          image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=600&q=80",
          isDefault: false,
        },
      ],
    },

    // 2. Trái cây nhập khẩu
    {
      name: "Cherry Đỏ Mỹ Size 9.0 Hàng Bay Chuẩn Tươi Tuyển Chọn",
      slug: "cherry-do-my-size-9-hang-bay",
      categoryId: catCherry,
      brand: "USA Cherries",
      origin: "Mỹ",
      specification: "Đóng hộp giữ nhiệt kèm đá gel",
      expiryInfo: "Bảo quản ngăn mát 5-7 ngày",
      shortDesc: "Cherry đỏ Mỹ size 9.0 cuống tươi xanh, giòn đanh, vị ngọt đậm thơm mát nhập khẩu hàng bay 48h.",
      description: "<p>Cherry Mỹ vận chuyển theo đường hàng không (Air Cargo) giữ nguyên độ giòn ngọt mọng nước. Đóng gói chuyên nghiệp bằng hộp bảo ôn nhiệt độ tiêu chuẩn.</p>",
      isFeatured: true,
      variants: [
        {
          name: "Hộp 500g",
          sku: "CHE-US-500G",
          price: 295000,
          originalPrice: 380000,
          stock: 50,
          image: "https://images.unsplash.com/photo-1528825871115-3581a5387919?auto=format&fit=crop&w=600&q=80",
          isDefault: true,
        },
        {
          name: "Hộp 1kg",
          sku: "CHE-US-1KG",
          price: 560000,
          originalPrice: 720000,
          stock: 40,
          image: "https://images.unsplash.com/photo-1528825871115-3581a5387919?auto=format&fit=crop&w=600&q=80",
          isDefault: false,
        },
        {
          name: "Thùng 5kg nguyên đai",
          sku: "CHE-US-5KG",
          price: 2650000,
          originalPrice: 3200000,
          stock: 12,
          image: "https://images.unsplash.com/photo-1528825871115-3581a5387919?auto=format&fit=crop&w=600&q=80",
          isDefault: false,
        },
      ],
    },
    {
      name: "Nho Mẫu Đơn Shine Muscat Hàn Quốc (Hộp quà cao cấp)",
      slug: "nho-mau-don-shine-muscat-han-quoc",
      categoryId: catNho,
      brand: "Shine Muscat",
      origin: "Hàn Quốc",
      specification: "Chùm 700g-800g đóng hộp quà tặng",
      expiryInfo: "Bảo quản mát 7-10 ngày",
      shortDesc: "Nho mẫu đơn chuẩn Hàn Quốc quả to mọng, ngọt đậm vị sữa thơm đặc trưng, không hạt.",
      description: "<p>Nho mẫu đơn được mệnh danh là 'vua của các loại nho' với hương thơm sữa dịu ngọt, giòn ngọt sang trọng thích hợp làm quà biếu cao cấp.</p>",
      isFeatured: true,
      variants: [
        {
          name: "Hộp 1 chùm (khoảng 750g)",
          sku: "NHO-MD-1CHUM",
          price: 690000,
          originalPrice: 850000,
          stock: 35,
          image: "https://images.unsplash.com/photo-1596363505729-4190a9506133?auto=format&fit=crop&w=600&q=80",
          isDefault: true,
        },
        {
          name: "Hộp quà 2 chùm (khoảng 1.5kg)",
          sku: "NHO-MD-2CHUM",
          price: 1320000,
          originalPrice: 1650000,
          stock: 18,
          image: "https://images.unsplash.com/photo-1596363505729-4190a9506133?auto=format&fit=crop&w=600&q=80",
          isDefault: false,
        },
      ],
    },
    {
      name: "Táo Envy New Zealand Size 24 Giòn Ngọt",
      slug: "tao-envy-new-zealand-size-24",
      categoryId: catTao,
      brand: "Envy Apple",
      origin: "New Zealand",
      specification: "Túi 1kg hoặc thùng 9kg",
      expiryInfo: "Bảo quản tủ lạnh 15-20 ngày",
      shortDesc: "Táo Envy New Zealand vỏ đỏ rực, thịt vàng thơm giòn đanh, ngọt lịm không bở.",
      description: "<p>Táo Envy size đại cao cấp, giàu vitamin C và chất xơ tự nhiên, tốt cho vóc dáng và sức khỏe tim mạch.</p>",
      isFeatured: false,
      variants: [
        {
          name: "Túi 1kg (khoảng 3-4 quả)",
          sku: "TAO-ENVY-1KG",
          price: 185000,
          originalPrice: 220000,
          stock: 65,
          image: "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=600&q=80",
          isDefault: true,
        },
        {
          name: "Thùng 9kg nguyên tem",
          sku: "TAO-ENVY-9KG",
          price: 1490000,
          originalPrice: 1800000,
          stock: 20,
          image: "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=600&q=80",
          isDefault: false,
        },
      ],
    },

    // 3. Thực phẩm & Đồ uống
    {
      name: "Hạt Macca Úc Nứt Vỏ Tự Nhiên Mourad's 500g",
      slug: "hat-macca-uc-nut-vo-mourads-500g",
      categoryId: catMacca,
      brand: "Mourad's",
      origin: "Úc",
      specification: "Gói 500g ép nhiệt kèm dụng cụ tách",
      expiryInfo: "18 tháng từ ngày sản xuất",
      shortDesc: "Hạt Macca nhập khẩu Úc hạt đều to, béo ngậy thơm ngon, giàu Omega-3 và khoáng chất.",
      description: "<p>Nữ hoàng các loại hạt dinh dưỡng từ Úc, không chất bảo quản, tốt cho tim mạch và mẹ bầu.</p>",
      isFeatured: true,
      variants: [
        {
          name: "Gói 500g",
          sku: "MACCA-500G",
          price: 165000,
          originalPrice: 210000,
          stock: 120,
          image: "https://images.unsplash.com/photo-1508746829417-e6f548d8d6ed?auto=format&fit=crop&w=600&q=80",
          isDefault: true,
        },
        {
          name: "Combo 2 gói (1kg)",
          sku: "MACCA-1KG",
          price: 310000,
          originalPrice: 420000,
          stock: 50,
          image: "https://images.unsplash.com/photo-1508746829417-e6f548d8d6ed?auto=format&fit=crop&w=600&q=80",
          isDefault: false,
        },
      ],
    },
    {
      name: "Bánh Quy Bơ Hoàng Gia Danisa Đan Mạch",
      slug: "banh-quy-bo-hoang-gia-danisa-dan-mach",
      categoryId: catBanhKeo,
      brand: "Danisa",
      origin: "Đan Mạch",
      specification: "Hộp thiếc sang trọng",
      expiryInfo: "24 tháng kể từ ngày sản xuất",
      shortDesc: "Công thức truyền thống Đan Mạch với hương bơ sữa thơm lừng giòn tan.",
      description: "<p>Bánh quy bơ cao cấp Danisa được làm từ nguyên liệu bơ hảo hạng, thích hợp thưởng thức trà chiều và làm quà tặng lễ Tết.</p>",
      isFeatured: false,
      variants: [
        {
          name: "Hộp thiếc 454g",
          sku: "DANISA-454G",
          price: 145000,
          originalPrice: 175000,
          stock: 75,
          image: "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?auto=format&fit=crop&w=600&q=80",
          isDefault: true,
        },
        {
          name: "Hộp thiếc lớn 908g",
          sku: "DANISA-908G",
          price: 275000,
          originalPrice: 320000,
          stock: 40,
          image: "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?auto=format&fit=crop&w=600&q=80",
          isDefault: false,
        },
      ],
    },

    // 4. Mỹ phẩm & Chăm sóc cá nhân
    {
      name: "Kem Chống Nắng La Roche-Posay Anthelios UVmune 400 Pháp",
      slug: "kem-chong-nang-la-roche-posay-anthelios-uvmune-400",
      categoryId: catChongNang,
      brand: "La Roche-Posay",
      origin: "Pháp",
      specification: "Chai 50ml nắp vặn",
      expiryInfo: "3 năm từ NSX, 12 tháng sau mở nắp",
      shortDesc: "Màng lọc độc quyền Mexoryl 400 bảo vệ da tối đa trước tia UVA dài, kiềm dầu kháng nước đỉnh cao.",
      description: "<p>Dược mỹ phẩm chống nắng số 1 thế giới được các chuyên gia da liễu khuyên dùng cho mọi loại da kể cả da nhạy cảm.</p>",
      isFeatured: true,
      variants: [
        {
          name: "Vạch xanh (Kiềm dầu cho da dầu mụn)",
          sku: "LRP-OIL-50ML",
          price: 435000,
          originalPrice: 535000,
          stock: 90,
          image: "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=600&q=80",
          isDefault: true,
        },
        {
          name: "Vạch vàng (Cấp ẩm cho da khô, nhạy cảm)",
          sku: "LRP-HYDRA-50ML",
          price: 435000,
          originalPrice: 535000,
          stock: 65,
          image: "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=600&q=80",
          isDefault: false,
        },
      ],
    },
    {
      name: "Serum Phục Hồi Cấp Ẩm B5 GoodnDoc Hydra B5 Hàn Quốc",
      slug: "serum-phuc-hoi-cap-am-b5-goodndoc-hydra-b5",
      categoryId: catSerum,
      brand: "GoodnDoc",
      origin: "Hàn Quốc",
      specification: "Chai thủy tinh 30ml có ống hút",
      expiryInfo: "36 tháng kể từ ngày sản xuất",
      shortDesc: "Pro-Vitamin B5 kết hợp Hyaluronic Acid nồng độ cao phục hồi làn da tổn thương, làm dịu kích ứng tức thì.",
      description: "<p>Tinh chất phục hồi quốc dân cho da sau peel, treatment, laser hoặc da mỏng yếu nhạy cảm.</p>",
      isFeatured: false,
      variants: [
        {
          name: "Chai 30ml",
          sku: "GND-B5-30ML",
          price: 360000,
          originalPrice: 480000,
          stock: 70,
          image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=600&q=80",
          isDefault: true,
        },
      ],
    },

    // 5. Mẹ & Bé
    {
      name: "Sữa Bột Aptamil Profutura Úc (Lon 900g)",
      slug: "sua-bot-aptamil-profutura-uc-lon-900g",
      categoryId: catSuaBot,
      brand: "Aptamil",
      origin: "Úc",
      specification: "Lon thiếc 900g",
      expiryInfo: "24 tháng kể từ ngày sản xuất",
      shortDesc: "Dòng sữa cao cấp giàu men vi sinh Probiotics Bifidobacterium, DHA và dưỡng chất phát triển toàn diện.",
      description: "<p>Aptamil Profutura Úc là dòng sữa phát triển trí não và chiều cao số 1 cho trẻ em với công thức Synbiotic độc quyền mát lành tựa sữa mẹ.</p>",
      isFeatured: true,
      variants: [
        {
          name: "Số 1 (Dành cho bé 0 - 6 tháng)",
          sku: "APTA-UC-SO1",
          price: 920000,
          originalPrice: 1050000,
          stock: 45,
          image: "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=600&q=80",
          isDefault: true,
        },
        {
          name: "Số 2 (Dành cho bé 6 - 12 tháng)",
          sku: "APTA-UC-SO2",
          price: 920000,
          originalPrice: 1050000,
          stock: 40,
          image: "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=600&q=80",
          isDefault: false,
        },
        {
          name: "Số 3 (Dành cho bé 1 - 3 tuổi)",
          sku: "APTA-UC-SO3",
          price: 890000,
          originalPrice: 1020000,
          stock: 55,
          image: "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=600&q=80",
          isDefault: false,
        },
      ],
    },
    {
      name: "Bột Ăn Dặm Gerber Organic Yến Mạch Chuối Mỹ",
      slug: "bot-an-dam-gerber-organic-yen-mach-chuoi-my",
      categoryId: catAnDam,
      brand: "Gerber",
      origin: "Mỹ",
      specification: "Hộp 227g",
      expiryInfo: "18 tháng từ ngày sản xuất",
      shortDesc: "Nguyên liệu yến mạch hữu cơ chứng nhận USDA kết hợp chuối tươi thơm ngon, bổ sung sắt và kẽm.",
      description: "<p>Bột ăn dặm cho bé từ 6 tháng tuổi, giúp bé làm quen với thức ăn dặm một cách nhẹ nhàng và giàu dinh dưỡng.</p>",
      isFeatured: false,
      variants: [
        {
          name: "Hộp 227g",
          sku: "GERBER-OAT-227G",
          price: 155000,
          originalPrice: 195000,
          stock: 85,
          image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=600&q=80",
          isDefault: true,
        },
      ],
    },
  ];

  // Lưu sản phẩm và biến thể vào database
  for (const item of products) {
    const product = await prisma.product.upsert({
      where: { slug: item.slug },
      update: {
        name: item.name,
        categoryId: item.categoryId,
        brand: item.brand,
        origin: item.origin,
        specification: item.specification,
        expiryInfo: item.expiryInfo,
        shortDesc: item.shortDesc,
        description: item.description,
        isFeatured: item.isFeatured,
      },
      create: {
        name: item.name,
        slug: item.slug,
        categoryId: item.categoryId,
        brand: item.brand,
        origin: item.origin,
        specification: item.specification,
        expiryInfo: item.expiryInfo,
        shortDesc: item.shortDesc,
        description: item.description,
        isFeatured: item.isFeatured,
      },
    });

    for (const v of item.variants) {
      await prisma.productVariant.upsert({
        where: { sku: v.sku },
        update: {
          name: v.name,
          price: v.price,
          originalPrice: v.originalPrice,
          stock: v.stock,
          image: v.image,
          isDefault: v.isDefault,
        },
        create: {
          productId: product.id,
          name: v.name,
          sku: v.sku,
          price: v.price,
          originalPrice: v.originalPrice,
          stock: v.stock,
          image: v.image,
          isDefault: v.isDefault,
        },
      });

      // Tạo luôn ProductImage nếu chưa có
      if (v.image) {
        await prisma.productImage.create({
          data: {
            productId: product.id,
            url: v.image,
            alt: item.name,
          },
        }).catch(() => {});
      }
    }
  }
  console.log("✅ Seeded products & variants successfully!");

  // ── Tạo Flash Sale Session kết thúc sau 18 tiếng ──────────────────────────
  const now = new Date();
  const endTime = new Date(now.getTime() + 18 * 60 * 60 * 1000);

  const flashSale = await prisma.flashSale.upsert({
    where: { id: "fs-hom-nay" },
    update: {
      name: "⚡ FLASH SALE HÀNG NHẬP KHẨU – GIÁ CỰC SỐC HÔM NAY",
      startTime: now,
      endTime: endTime,
      isActive: true,
    },
    create: {
      id: "fs-hom-nay",
      name: "⚡ FLASH SALE HÀNG NHẬP KHẨU – GIÁ CỰC SỐC HÔM NAY",
      startTime: now,
      endTime: endTime,
      isActive: true,
    },
  });

  // Chọn 4 biến thể làm flash sale
  const cherryVariant = await prisma.productVariant.findUnique({ where: { sku: "CHE-US-500G" } });
  const kgcVariant = await prisma.productVariant.findUnique({ where: { sku: "KGC-75G" } });
  const lrpVariant = await prisma.productVariant.findUnique({ where: { sku: "LRP-OIL-50ML" } });
  const maccaVariant = await prisma.productVariant.findUnique({ where: { sku: "MACCA-500G" } });

  const flashItems = [
    { variant: cherryVariant, salePrice: 249000, quantity: 50, soldCount: 38 },
    { variant: kgcVariant, salePrice: 1590000, quantity: 30, soldCount: 22 },
    { variant: lrpVariant, salePrice: 389000, quantity: 60, soldCount: 47 },
    { variant: maccaVariant, salePrice: 139000, quantity: 100, soldCount: 82 },
  ];

  for (const item of flashItems) {
    if (item.variant) {
      await prisma.flashSaleItem.upsert({
        where: {
          flashSaleId_variantId: {
            flashSaleId: flashSale.id,
            variantId: item.variant.id,
          },
        },
        update: {
          salePrice: item.salePrice,
          quantity: item.quantity,
          soldCount: item.soldCount,
        },
        create: {
          flashSaleId: flashSale.id,
          productId: item.variant.productId,
          variantId: item.variant.id,
          salePrice: item.salePrice,
          quantity: item.quantity,
          soldCount: item.soldCount,
        },
      });
    }
  }
  console.log("✅ Seeded Flash Sale with 4 hot deals successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Failed to seed products:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
