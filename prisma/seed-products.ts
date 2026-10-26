import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding 50+ Premium Products (10+ per category)...");

  // Helper tìm ID danh mục theo slug
  const getCatId = async (slug: string, fallbackSlug: string) => {
    let cat = await prisma.category.findUnique({ where: { slug } });
    if (!cat) {
      cat = await prisma.category.findUnique({ where: { slug: fallbackSlug } });
    }
    if (!cat) {
      throw new Error(`Category not found for slug: ${slug} nor fallback: ${fallbackSlug}`);
    }
    return cat.id;
  };

  // 1. TPCN & Sức khỏe
  const catHongSam = await getCatId("hong-sam-dong-trung-ha-thao", "thuc-pham-chuc-nang");
  const catBoNao = await getCatId("bo-nao-tang-cuong-tri-nho", "thuc-pham-chuc-nang");
  const catVitamin = await getCatId("vitamin-khoang-chat", "thuc-pham-chuc-nang");
  const catTimMach = await getCatId("tim-mach-huyet-ap", "thuc-pham-chuc-nang");
  const catXuongKhop = await getCatId("ho-tro-xuong-khop", "thuc-pham-chuc-nang");

  // 2. Trái cây nhập khẩu
  const catCherry = await getCatId("cherry-nhap-khau", "trai-cay-nhap-khau");
  const catNho = await getCatId("nho-nhap-khau", "trai-cay-nhap-khau");
  const catTao = await getCatId("tao-envy-rockit", "trai-cay-nhap-khau");
  const catKiwi = await getCatId("kiwi-vang", "trai-cay-nhap-khau");
  const catGioQua = await getCatId("gio-trai-cay-cao-cap", "trai-cay-nhap-khau");
  const catFruitRoot = await getCatId("trai-cay-nhap-khau", "trai-cay-nhap-khau");

  // 3. Thực phẩm & Đồ uống
  const catHat = await getCatId("hat-dinh-duong-ngu-coc", "thuc-pham-do-uong-nhap-khau");
  const catBanhKeo = await getCatId("banh-keo-chocolate-nhap-khau", "thuc-pham-do-uong-nhap-khau");
  const catTraCafe = await getCatId("tra-ca-phe-ngoai-nhap", "thuc-pham-do-uong-nhap-khau");
  const catNuocEp = await getCatId("nuoc-ep-do-uong-dinh-duong", "thuc-pham-do-uong-nhap-khau");
  const catGiaVi = await getCatId("gia-vi-dau-an-cao-cap", "thuc-pham-do-uong-nhap-khau");

  // 4. Mỹ phẩm & Chăm sóc cá nhân
  const catChongNang = await getCatId("kem-chong-nang", "my-pham-cham-soc-ca-nhan");
  const catSerum = await getCatId("serum-tinh-chat-phuc-hoi", "my-pham-cham-soc-ca-nhan");
  const catLamSach = await getCatId("lam-sach-tay-trang", "my-pham-cham-soc-ca-nhan");
  const catKemDuong = await getCatId("kem-duong-chong-lao-hoa", "my-pham-cham-soc-ca-nhan");
  const catTocBody = await getCatId("cham-soc-co-the-toc", "my-pham-cham-soc-ca-nhan");

  // 5. Mẹ & Bé
  const catSuaBot = await getCatId("sua-bot-cong-thuc", "me-va-be");
  const catAnDam = await getCatId("dinh-duong-an-dam", "me-va-be");
  const catVitBe = await getCatId("vitamin-de-khang-cho-be", "me-va-be");
  const catMeBau = await getCatId("cham-soc-me-truoc-sau-sinh", "me-va-be");
  const catVeSinhBe = await getCatId("do-dung-ve-sinh-cho-be", "me-va-be");

  const products = [
    // =========================================================================
    // NGÀNH HÀNG 1: THỰC PHẨM CHỨC NĂNG & SỨC KHỎE (10 SẢN PHẨM)
    // =========================================================================
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
        { name: "Hộp 75g (khoảng 5-7 củ)", sku: "KGC-75G", price: 1850000, originalPrice: 2150000, stock: 45, image: "https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=600&q=80", isDefault: true },
        { name: "Hộp 150g (khoảng 10-14 củ)", sku: "KGC-150G", price: 3450000, originalPrice: 3900000, stock: 30, image: "https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=600&q=80", isDefault: false },
        { name: "Hộp 300g (khoảng 20-25 củ)", sku: "KGC-300G", price: 6500000, originalPrice: 7200000, stock: 15, image: "https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=600&q=80", isDefault: false },
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
        { name: "Lọ 340 viên", sku: "TRU-GINKGO-340", price: 520000, originalPrice: 650000, stock: 80, image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=600&q=80", isDefault: true },
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
        { name: "Hộp 10 chai (50ml/chai)", sku: "DHC-COL-10", price: 780000, originalPrice: 950000, stock: 60, image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=600&q=80", isDefault: true },
        { name: "Combo 3 hộp (Liệu trình 1 tháng)", sku: "DHC-COL-COMBO3", price: 2190000, originalPrice: 2850000, stock: 25, image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=600&q=80", isDefault: false },
      ],
    },
    {
      name: "Viên uống Dầu cá không mùi Blackmores Odourless Fish Oil 1000mg Úc",
      slug: "vien-uong-dau-ca-omega-3-blackmores-uc-400-vien",
      categoryId: catTimMach,
      brand: "Blackmores",
      origin: "Úc",
      specification: "Lọ 400 viên nang mềm",
      expiryInfo: "36 tháng kể từ NSX (Date 2027)",
      shortDesc: "Nguồn Omega-3 tự nhiên tinh khiết khử mùi tanh bằng vani, tốt cho tim mạch, mắt và khớp.",
      description: "<p>Blackmores Fish Oil 1000mg được chiết xuất từ cá biển sâu đại dương, không chứa thủy ngân độc hại, giúp bảo vệ hệ tim mạch và giảm mỡ máu hiệu quả.</p>",
      isFeatured: true,
      variants: [
        { name: "Lọ 400 viên", sku: "BM-FISH-400", price: 590000, originalPrice: 720000, stock: 95, image: "https://images.unsplash.com/photo-1577401239170-897942555fb3?auto=format&fit=crop&w=600&q=80", isDefault: true },
        { name: "Combo 2 lọ (Gia đình)", sku: "BM-FISH-COMBO2", price: 1120000, originalPrice: 1440000, stock: 40, image: "https://images.unsplash.com/photo-1577401239170-897942555fb3?auto=format&fit=crop&w=600&q=80", isDefault: false },
      ],
    },
    {
      name: "Nước Hồng Sâm Won KGC Jung Kwan Jang Hàn Quốc (30 gói x 70ml)",
      slug: "nuoc-hong-sam-won-kgc-han-quoc-30-goi",
      categoryId: catHongSam,
      brand: "KGC Jung Kwan Jang",
      origin: "Hàn Quốc",
      specification: "Hộp 30 gói x 70ml",
      expiryInfo: "24 tháng kể từ ngày sản xuất",
      shortDesc: "Tinh chất hồng sâm 6 năm tuổi pha sẵn dạng nước, tăng cường miễn dịch và phục hồi thể lực tức thì.",
      description: "<p>Nước hồng sâm KGC Won là dòng sản phẩm bồi bổ quốc dân tại Hàn Quốc, kết hợp táo đỏ và thảo mộc thơm ngon dễ uống.</p>",
      isFeatured: true,
      variants: [
        { name: "Hộp 30 gói", sku: "KGC-WON-30P", price: 890000, originalPrice: 1100000, stock: 55, image: "https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=600&q=80", isDefault: true },
      ],
    },
    {
      name: "Viên uống Glucosamine Orihiro 1500mg Tái Tạo Sụn Khớp Nhật Bản",
      slug: "vien-uong-glucosamine-orihiro-1500mg-nhat-ban",
      categoryId: catXuongKhop,
      brand: "Orihiro",
      origin: "Nhật Bản",
      specification: "Lọ 900 viên nén",
      expiryInfo: "36 tháng kể từ NSX",
      shortDesc: "Hàm lượng Glucosamine độ tinh khiết cao kết hợp Chondroitin và Hyaluronic Acid bảo vệ ổ khớp.",
      description: "<p>Sản phẩm hỗ trợ xương khớp bán chạy số 1 tại Nhật Bản giúp giảm triệu chứng thoái hóa khớp, khô khớp và đau mỏi khớp khi vận động.</p>",
      isFeatured: true,
      variants: [
        { name: "Lọ 900 viên (Dùng 3 tháng)", sku: "ORI-GLUCO-900", price: 650000, originalPrice: 790000, stock: 70, image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=600&q=80", isDefault: true },
      ],
    },
    {
      name: "Viên uống Bổ Gan Milk Thistle Blackmores Úc (Chiết xuất Kế Sữa)",
      slug: "vien-uong-bo-gan-milk-thistle-blackmores-uc",
      categoryId: catBoNao,
      brand: "Blackmores",
      origin: "Úc",
      specification: "Lọ 100 viên",
      expiryInfo: "3 năm kể từ ngày sản xuất",
      shortDesc: "Chiết xuất hạt kế sữa chuẩn hóa Silymarin hỗ trợ hạ men gan, thải độc gan và bảo vệ tế bào gan.",
      description: "<p>Blackmores Milk Thistle giúp phục hồi chức năng gan suy giảm do bia rượu, thực phẩm dầu mỡ và dùng thuốc tây kéo dài.</p>",
      isFeatured: false,
      variants: [
        { name: "Lọ 100 viên", sku: "BM-MILK-100", price: 420000, originalPrice: 520000, stock: 85, image: "https://images.unsplash.com/photo-1471864190281-a93a3070b6de?auto=format&fit=crop&w=600&q=80", isDefault: true },
      ],
    },
    {
      name: "Vitamin Tổng Hợp Hằng Ngày Kirkland Daily Multi Mỹ (500 viên)",
      slug: "vien-uong-vitamin-tong-hop-kirkland-daily-multi-my",
      categoryId: catVitamin,
      brand: "Kirkland Signature",
      origin: "Mỹ",
      specification: "Lọ 500 viên nén",
      expiryInfo: "36 tháng từ ngày sản xuất",
      shortDesc: "Cung cấp đầy đủ 23 loại vitamin và khoáng chất thiết yếu tăng cường hệ miễn dịch và duy trì thể trạng khỏe mạnh.",
      description: "<p>Kirkland Daily Multi đạt chuẩn kiểm nghiệm Dược điển Hoa Kỳ USP, phù hợp cho người lớn bận rộn ăn uống thiếu chất.</p>",
      isFeatured: false,
      variants: [
        { name: "Lọ 500 viên", sku: "KL-DAILY-500", price: 495000, originalPrice: 620000, stock: 90, image: "https://images.unsplash.com/photo-1577401239170-897942555fb3?auto=format&fit=crop&w=600&q=80", isDefault: true },
      ],
    },
    {
      name: "Đông Trùng Hạ Thảo Tươi Sấy Thăng Hoa Bio-Science Hàn Quốc",
      slug: "dong-trung-ha-thao-tuoi-say-thang-hoa-korea",
      categoryId: catHongSam,
      brand: "Bio-Science",
      origin: "Hàn Quốc",
      specification: "Hộp 45g sợi sấy thăng hoa",
      expiryInfo: "24 tháng kể từ ngày sản xuất",
      shortDesc: "Giữ trọn 99% hoạt chất sinh học Cordycepin & Adenosine giúp bổ phổi, hạ đường huyết và hồi phục thể lực.",
      description: "<p>Đông trùng hạ thảo nuôi cấy mô phỏng môi trường tự nhiên tại Hàn Quốc, dùng hãm trà, chưng yến hoặc ngâm mật ong bồi bổ thượng hạng.</p>",
      isFeatured: false,
      variants: [
        { name: "Hộp 45g", sku: "BIO-DTH-45G", price: 1450000, originalPrice: 1800000, stock: 25, image: "https://images.unsplash.com/photo-1509358271058-acd22cc93898?auto=format&fit=crop&w=600&q=80", isDefault: true },
      ],
    },
    {
      name: "Tinh Dầu Thông Đỏ Chính Phủ Kwangdong Hàn Quốc (120 viên)",
      slug: "tinh-dau-thong-do-chinh-phu-kwangdong-han-quoc",
      categoryId: catTimMach,
      brand: "Kwangdong",
      origin: "Hàn Quốc",
      specification: "Hộp 120 viên nang (24 vỉ)",
      expiryInfo: "3 năm kể từ ngày sản xuất",
      shortDesc: "100% tinh dầu lá thông đỏ cổ thụ JeokSong làm sạch mảng bám thành mạch, ngăn ngừa xơ vữa động mạch.",
      description: "<p>Dòng sản phẩm chăm sóc mạch máu và ổn định mỡ máu cao cấp được cấp chứng nhận chất lượng từ chính phủ Hàn Quốc.</p>",
      isFeatured: true,
      variants: [
        { name: "Hộp 120 viên", sku: "KD-THONG-120", price: 2850000, originalPrice: 3500000, stock: 20, image: "https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=600&q=80", isDefault: true },
      ],
    },

    // =========================================================================
    // NGÀNH HÀNG 2: TRÁI CÂY TƯƠI BAY AIR CARGO (10 SẢN PHẨM)
    // =========================================================================
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
        { name: "Hộp 500g", sku: "CHE-US-500G", price: 295000, originalPrice: 380000, stock: 50, image: "https://images.unsplash.com/photo-1528825871115-3581a5387919?auto=format&fit=crop&w=600&q=80", isDefault: true },
        { name: "Hộp 1kg", sku: "CHE-US-1KG", price: 560000, originalPrice: 720000, stock: 40, image: "https://images.unsplash.com/photo-1528825871115-3581a5387919?auto=format&fit=crop&w=600&q=80", isDefault: false },
        { name: "Thùng 5kg nguyên đai", sku: "CHE-US-5KG", price: 2650000, originalPrice: 3200000, stock: 12, image: "https://images.unsplash.com/photo-1528825871115-3581a5387919?auto=format&fit=crop&w=600&q=80", isDefault: false },
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
        { name: "Hộp 1 chùm (khoảng 750g)", sku: "NHO-MD-1CHUM", price: 690000, originalPrice: 850000, stock: 35, image: "https://images.unsplash.com/photo-1596363505729-4190a9506133?auto=format&fit=crop&w=600&q=80", isDefault: true },
        { name: "Hộp quà 2 chùm (khoảng 1.5kg)", sku: "NHO-MD-2CHUM", price: 1320000, originalPrice: 1650000, stock: 18, image: "https://images.unsplash.com/photo-1596363505729-4190a9506133?auto=format&fit=crop&w=600&q=80", isDefault: false },
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
        { name: "Túi 1kg (khoảng 3-4 quả)", sku: "TAO-ENVY-1KG", price: 185000, originalPrice: 220000, stock: 65, image: "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=600&q=80", isDefault: true },
        { name: "Thùng 9kg nguyên tem", sku: "TAO-ENVY-9KG", price: 1490000, originalPrice: 1800000, stock: 20, image: "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=600&q=80", isDefault: false },
      ],
    },
    {
      name: "Cherry Vàng Rainier Mỹ Size 8.5 Ngọt Thanh Hàng Bay",
      slug: "cherry-vang-my-rainier-size-85-cao-cap",
      categoryId: catCherry,
      brand: "Rainier Cherries",
      origin: "Mỹ",
      specification: "Hộp 500g bảo quản mát",
      expiryInfo: "Bảo quản mát 5 ngày",
      shortDesc: "Nữ hoàng cherry màu vàng má đỏ, độ đường cao trên 20 Brix, thịt quả giòn tan mọng nước.",
      description: "<p>Cherry Rainier vàng là loại cherry hiếm có sản lượng giới hạn mỗi năm, vị ngọt ngào như mật ong thơm thanh tao.</p>",
      isFeatured: true,
      variants: [
        { name: "Hộp 500g", sku: "CHE-RAINIER-500", price: 385000, originalPrice: 480000, stock: 40, image: "https://images.unsplash.com/photo-1528825871115-3581a5387919?auto=format&fit=crop&w=600&q=80", isDefault: true },
        { name: "Hộp 1kg", sku: "CHE-RAINIER-1KG", price: 740000, originalPrice: 920000, stock: 25, image: "https://images.unsplash.com/photo-1528825871115-3581a5387919?auto=format&fit=crop&w=600&q=80", isDefault: false },
      ],
    },
    {
      name: "Nho Đen Không Hạt Midnight Beauty Úc Chuẩn Tươi",
      slug: "nho-den-khong-hat-midnight-beauty-uc",
      categoryId: catNho,
      brand: "Sunworld",
      origin: "Úc",
      specification: "Hộp 1kg cuống xanh",
      expiryInfo: "Bảo quản mát 7-10 ngày",
      shortDesc: "Trái nho thuôn dài đen nhánh bọc lớp phấn tự nhiên, cắn giòn rụm vị ngọt đậm sâu.",
      description: "<p>Nho Midnight Beauty nhập khẩu từ vùng trồng Sunworld trứ danh của Úc, giàu chất chống oxy hóa anthocyanin.</p>",
      isFeatured: false,
      variants: [
        { name: "Hộp 1kg", sku: "NHO-DEN-1KG", price: 245000, originalPrice: 310000, stock: 60, image: "https://images.unsplash.com/photo-1537640538966-79f369143f8f?auto=format&fit=crop&w=600&q=80", isDefault: true },
      ],
    },
    {
      name: "Kiwi Vàng Zespri SunGold New Zealand Siêu Ngọt",
      slug: "kiwi-vang-zespri-sungold-new-zealand",
      categoryId: catKiwi,
      brand: "Zespri",
      origin: "New Zealand",
      specification: "Hộp 6 quả hoặc thùng 3.2kg",
      expiryInfo: "Bảo quản ngăn mát 10-14 ngày",
      shortDesc: "Vỏ mỏng mịn ít lông, ruột vàng ươm mọng nước, hàm lượng vitamin C gấp 3 lần quả cam.",
      description: "<p>Kiwi SunGold thương hiệu Zespri số 1 New Zealand với vị ngọt mát đậm đà kích thích vị giác cả gia đình.</p>",
      isFeatured: true,
      variants: [
        { name: "Hộp 6 quả (khoảng 800g)", sku: "KIWI-ZES-6P", price: 165000, originalPrice: 210000, stock: 80, image: "https://images.unsplash.com/photo-1518492104633-130d0cc84637?auto=format&fit=crop&w=600&q=80", isDefault: true },
        { name: "Thùng 3.2kg (khoảng 22-25 quả)", sku: "KIWI-ZES-32KG", price: 620000, originalPrice: 750000, stock: 30, image: "https://images.unsplash.com/photo-1518492104633-130d0cc84637?auto=format&fit=crop&w=600&q=80", isDefault: false },
      ],
    },
    {
      name: "Việt Quất Tươi Driscoll's Hàng Bay Mỹ (Hộp 125g)",
      slug: "viet-quat-tuoi-driscolls-my",
      categoryId: catFruitRoot,
      brand: "Driscoll's",
      origin: "Mỹ",
      specification: "Hộp nhựa thông khí 125g",
      expiryInfo: "Bảo quản ngăn mát 5-7 ngày",
      shortDesc: "Trái việt quất size lớn tròn căng mọng, phấn trắng tự nhiên bao phủ, giàu dưỡng chất bổ mắt.",
      description: "<p>Driscoll's là tập đoàn quả mọng hàng đầu nước Mỹ, sản phẩm được kiểm định nghiêm ngặt không dư lượng thuốc bảo vệ thực vật.</p>",
      isFeatured: false,
      variants: [
        { name: "Hộp 125g", sku: "BLU-DRIS-125G", price: 95000, originalPrice: 125000, stock: 75, image: "https://images.unsplash.com/photo-1498557850523-fd3d118b962e?auto=format&fit=crop&w=600&q=80", isDefault: true },
        { name: "Combo 3 hộp (375g)", sku: "BLU-DRIS-COMBO3", price: 265000, originalPrice: 360000, stock: 35, image: "https://images.unsplash.com/photo-1498557850523-fd3d118b962e?auto=format&fit=crop&w=600&q=80", isDefault: false },
      ],
    },
    {
      name: "Dâu Tây Seolhyang Hàn Quốc Hàng Bay Siêu Thơm (Hộp 330g)",
      slug: "dau-tay-han-quoc-seolhyang-hop-330g",
      categoryId: catFruitRoot,
      brand: "Seolhyang",
      origin: "Hàn Quốc",
      specification: "Hộp 330g đóng khay định hình",
      expiryInfo: "Bảo quản ngăn mát 3-5 ngày",
      shortDesc: "Dâu giống tuyết thơm ngát mùi sữa, quả đỏ au bóng bẩy, vị ngọt thanh không chua gắt.",
      description: "<p>Dâu tây Hàn Quốc đi đường bay trong ngày, giữ trọn cuống tươi xanh và độ giòn ngọt mọng nước tự nhiên.</p>",
      isFeatured: true,
      variants: [
        { name: "Hộp 330g (khoảng 12-15 quả)", sku: "DAU-SEOL-330G", price: 260000, originalPrice: 320000, stock: 45, image: "https://images.unsplash.com/photo-1464965911861-746a04b4bca6?auto=format&fit=crop&w=600&q=80", isDefault: true },
      ],
    },
    {
      name: "Táo Rockit New Zealand Ống 4 Quả Giòn Ngọt Tiện Lợi",
      slug: "tao-rockit-new-zealand-ong-4-qua",
      categoryId: catTao,
      brand: "Rockit Apple",
      origin: "New Zealand",
      specification: "Ống nhựa kháng khuẩn 4 quả",
      expiryInfo: "Bảo quản mát 15-20 ngày",
      shortDesc: "Giống táo mini đầu tiên trên thế giới ăn được cả vỏ, giòn rụm và ngọt đậm thơm mát.",
      description: "<p>Táo Rockit New Zealand được đóng gói trong ống bảo quản đạt chuẩn quốc tế, phù hợp mang theo tập thể thao, dã ngoại và bữa ăn phụ cho bé.</p>",
      isFeatured: false,
      variants: [
        { name: "Ống 4 quả", sku: "ROCKIT-4P", price: 115000, originalPrice: 140000, stock: 85, image: "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=600&q=80", isDefault: true },
        { name: "Lốc 3 ống (12 quả)", sku: "ROCKIT-3TUBE", price: 320000, originalPrice: 400000, stock: 40, image: "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=600&q=80", isDefault: false },
      ],
    },
    {
      name: "Giỏ Quà Trái Cây Nhập Khẩu Biếu Tặng Luxury THUYNGA",
      slug: "gio-trai-cay-nhap-khau-bieu-tang-luxury",
      categoryId: catGioQua,
      brand: "THUYNGA Signature",
      origin: "Mỹ",
      specification: "Giỏ mây lót lụa kèm nơ hoa sang trọng",
      expiryInfo: "Bảo quản tươi 5-7 ngày",
      shortDesc: "Tuyển chọn Cherry Mỹ size 9, Nho mẫu đơn Hàn Quốc, Kiwi vàng Zespri và Táo Envy làm quà biếu cao cấp.",
      description: "<p>Giỏ quà trái cây ngoại nhập được nghệ nhân đóng gói tinh xảo, thể hiện tấm lòng trân quý trong các dịp lễ, thăm hỏi và khánh thành.</p>",
      isFeatured: true,
      variants: [
        { name: "Giỏ quà Tiêu chuẩn (khoảng 3.5kg quả)", sku: "GIO-QUA-STD", price: 1450000, originalPrice: 1750000, stock: 15, image: "https://images.unsplash.com/photo-1610832958506-aa56368176cf?auto=format&fit=crop&w=600&q=80", isDefault: true },
        { name: "Giỏ quà Thượng hạng (khoảng 5.5kg quả)", sku: "GIO-QUA-VIP", price: 2350000, originalPrice: 2800000, stock: 10, image: "https://images.unsplash.com/photo-1610832958506-aa56368176cf?auto=format&fit=crop&w=600&q=80", isDefault: false },
      ],
    },

    // =========================================================================
    // NGÀNH HÀNG 3: THỰC PHẨM & ĐỒ UỐNG NHẬP KHẨU (10 SẢN PHẨM)
    // =========================================================================
    {
      name: "Hạt Macca Úc Nứt Vỏ Tự Nhiên Mourad's 500g",
      slug: "hat-macca-uc-nut-vo-mourads-500g",
      categoryId: catHat,
      brand: "Mourad's",
      origin: "Úc",
      specification: "Gói 500g ép nhiệt kèm dụng cụ tách",
      expiryInfo: "18 tháng từ ngày sản xuất",
      shortDesc: "Hạt Macca nhập khẩu Úc hạt đều to, béo ngậy thơm ngon, giàu Omega-3 và khoáng chất.",
      description: "<p>Nữ hoàng các loại hạt dinh dưỡng từ Úc, không chất bảo quản, tốt cho tim mạch và mẹ bầu.</p>",
      isFeatured: true,
      variants: [
        { name: "Gói 500g", sku: "MACCA-500G", price: 165000, originalPrice: 210000, stock: 120, image: "https://images.unsplash.com/photo-1508746829417-e6f548d8d6ed?auto=format&fit=crop&w=600&q=80", isDefault: true },
        { name: "Combo 2 gói (1kg)", sku: "MACCA-1KG", price: 310000, originalPrice: 420000, stock: 50, image: "https://images.unsplash.com/photo-1508746829417-e6f548d8d6ed?auto=format&fit=crop&w=600&q=80", isDefault: false },
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
        { name: "Hộp thiếc 454g", sku: "DANISA-454G", price: 145000, originalPrice: 175000, stock: 75, image: "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?auto=format&fit=crop&w=600&q=80", isDefault: true },
        { name: "Hộp thiếc lớn 908g", sku: "DANISA-908G", price: 275000, originalPrice: 320000, stock: 40, image: "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?auto=format&fit=crop&w=600&q=80", isDefault: false },
      ],
    },
    {
      name: "Hạt Dẻ Cười Rang Muối Tự Nhiên Kirkland Signature Mỹ (Túi 1.36kg)",
      slug: "hat-de-cuoi-pistachio-kirkland-my-1-36kg",
      categoryId: catHat,
      brand: "Kirkland Signature",
      origin: "Mỹ",
      specification: "Túi zip 1.36kg",
      expiryInfo: "18 tháng từ ngày sản xuất",
      shortDesc: "Hạt dẻ cười rang muối biển nguyên vị giòn bùi, không tẩm chất tẩy trắng độc hại.",
      description: "<p>Hạt dẻ cười California thương hiệu Kirkland được ưa chuộng trên toàn thế giới vì hạt to mẩy, không gắt dầu, giàu vitamin B6 và kali.</p>",
      isFeatured: true,
      variants: [
        { name: "Túi 1.36kg", sku: "KL-PISTA-136KG", price: 580000, originalPrice: 690000, stock: 65, image: "https://images.unsplash.com/photo-1508746829417-e6f548d8d6ed?auto=format&fit=crop&w=600&q=80", isDefault: true },
      ],
    },
    {
      name: "Chocolate Ferrero Rocher Ý Hộp Quà Vàng 30 Viên (375g)",
      slug: "chocolate-ferrero-rocher-y-hop-30-vien",
      categoryId: catBanhKeo,
      brand: "Ferrero Rocher",
      origin: "Ý",
      specification: "Hộp mica trong 30 viên bọc giấy vàng",
      expiryInfo: "12 tháng kể từ NSX",
      shortDesc: "Socola sữa phủ vụn hạt phỉ giòn rụm kết hợp kem phỉ béo ngậy tan chảy ngọt ngào.",
      description: "<p>Biểu tượng sô-cô-la cao cấp đến từ nước Ý, món quà hoàn hảo cho ngày kỷ niệm và dịp sum họp gia đình.</p>",
      isFeatured: true,
      variants: [
        { name: "Hộp 30 viên (375g)", sku: "FERRERO-30P", price: 290000, originalPrice: 350000, stock: 80, image: "https://images.unsplash.com/photo-1549007994-cb92caebd54b?auto=format&fit=crop&w=600&q=80", isDefault: true },
      ],
    },
    {
      name: "Trà Nhân Sâm Hàn Quốc Korean Ginseng Tea Hộp Gỗ (100 gói)",
      slug: "tra-nhan-sam-han-quoc-korean-ginseng-tea-100-goi",
      categoryId: catTraCafe,
      brand: "Korean Ginseng Corp",
      origin: "Hàn Quốc",
      specification: "Hộp gỗ 100 gói x 3g",
      expiryInfo: "3 năm kể từ ngày sản xuất",
      shortDesc: "Trà hòa tan chiết xuất từ củ nhân sâm thượng hạng, thanh nhiệt giải độc và tăng cường trí lực.",
      description: "<p>Trà sâm hòa tan với hương vị thơm dịu, dễ pha chế với nước ấm hoặc đá lạnh, giúp tinh thần sảng khoái suốt ngày dài.</p>",
      isFeatured: false,
      variants: [
        { name: "Hộp 100 gói", sku: "KGC-TEA-100", price: 340000, originalPrice: 420000, stock: 70, image: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=600&q=80", isDefault: true },
      ],
    },
    {
      name: "Mật Ong Manuka Comvita UMF 10+ New Zealand Kháng Khuẩn (500g)",
      slug: "mat-ong-manuka-comvita-umf-10-new-zealand-500g",
      categoryId: catGiaVi,
      brand: "Comvita",
      origin: "New Zealand",
      specification: "Hũ 500g đạt chuẩn UMF 10+ MGO 263+",
      expiryInfo: "5 năm kể từ ngày sản xuất",
      shortDesc: "Mật ong tự nhiên từ hoa cây Manuka New Zealand với đặc tính kháng khuẩn vượt trội cho hệ hô hấp.",
      description: "<p>Comvita là thương hiệu mật ong Manuka nổi tiếng số 1 thế giới, giúp làm dịu họng, chữa viêm loét dạ dày và tăng sức đề kháng.</p>",
      isFeatured: true,
      variants: [
        { name: "Hũ 500g", sku: "COMVITA-UMF10-500", price: 1250000, originalPrice: 1550000, stock: 30, image: "https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=600&q=80", isDefault: true },
      ],
    },
    {
      name: "Dầu Olive Siêu Nguyên Chất Extra Virgin Borges Tây Ban Nha (Chai 500ml)",
      slug: "dau-olive-nguyen-chat-extra-virgin-borges-tay-ban-nha-500ml",
      categoryId: catGiaVi,
      brand: "Borges",
      origin: "Tây Ban Nha",
      specification: "Chai thủy tinh tối màu 500ml",
      expiryInfo: "24 tháng kể từ NSX",
      shortDesc: "Ép lạnh cơ học trong 24h sau thu hoạch giữ trọn vẹn hương vị Địa Trung Hải và chất chống oxy hóa.",
      description: "<p>Dầu oliu Extra Virgin Borges đạt độ axit dưới 0.5%, dùng trộn salad, ướp thực phẩm và nấu ăn giàu dinh dưỡng cho cả trẻ nhỏ.</p>",
      isFeatured: false,
      variants: [
        { name: "Chai 500ml", sku: "BORGES-OLIVE-500", price: 175000, originalPrice: 220000, stock: 95, image: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=600&q=80", isDefault: true },
      ],
    },
    {
      name: "Cà Phê Sữa Hòa Tan Maxim Mocha Gold Mild Hàn Quốc (100 gói)",
      slug: "ca-phe-hoa-tan-maxim-gold-han-quoc-100-goi",
      categoryId: catTraCafe,
      brand: "Maxim",
      origin: "Hàn Quốc",
      specification: "Hộp 100 gói x 12g",
      expiryInfo: "18 tháng kể từ NSX",
      shortDesc: "Cà phê hòa tan quốc dân Hàn Quốc hương vị thơm béo đậm đà, vị đắng dịu êm không gây say cồn cào.",
      description: "<p>Maxim Mocha Gold sử dụng sữa không béo casein thực vật, hạt cà phê tuyển chọn Arabica & Robusta hòa quyện tuyệt vời.</p>",
      isFeatured: false,
      variants: [
        { name: "Hộp 100 gói", sku: "MAXIM-GOLD-100", price: 295000, originalPrice: 360000, stock: 90, image: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=600&q=80", isDefault: true },
      ],
    },
    {
      name: "Nước Ép Lựu Đỏ Collagen Kanghwa Hàn Quốc (Hộp 30 gói x 70ml)",
      slug: "nuoc-ep-luu-do-collagen-han-quoc-kanghwa-30-goi",
      categoryId: catNuocEp,
      brand: "Kanghwa",
      origin: "Hàn Quốc",
      specification: "Hộp 30 gói x 70ml",
      expiryInfo: "24 tháng kể từ ngày sản xuất",
      shortDesc: "Chiết xuất lựu đỏ nguyên chất bổ sung phân tử collagen cá biển giúp trắng da, chống lão hóa.",
      description: "<p>Nước ép lựu đỏ Kanghwa vị chua ngọt tươi mát, thức uống thanh lọc cơ thể và giữ gìn vóc dáng thon gọn cho phái đẹp.</p>",
      isFeatured: true,
      variants: [
        { name: "Hộp 30 gói", sku: "LUU-KANGHWA-30", price: 460000, originalPrice: 580000, stock: 65, image: "https://images.unsplash.com/photo-1546173159-315724a31696?auto=format&fit=crop&w=600&q=80", isDefault: true },
      ],
    },
    {
      name: "Hạt Chia Đen Hữu Cơ The Chia Co Úc Chuẩn ACO (Túi 1kg)",
      slug: "hat-chia-organic-uc-the-chia-co-1kg",
      categoryId: catHat,
      brand: "The Chia Co",
      origin: "Úc",
      specification: "Túi zip 1kg chứng nhận Organic",
      expiryInfo: "36 tháng kể từ NSX",
      shortDesc: "Siêu thực phẩm hữu cơ giàu Omega-3 gấp 8 lần cá hồi, dồi dào chất xơ hỗ trợ tiêu hóa và giảm cân.",
      description: "<p>Hạt chia đen Úc nguyên chất không biến đổi gen (Non-GMO), thích hợp pha nước trái cây, trộn sữa chua và ngũ cốc bữa sáng.</p>",
      isFeatured: false,
      variants: [
        { name: "Túi 1kg", sku: "CHIA-CO-1KG", price: 285000, originalPrice: 350000, stock: 85, image: "https://images.unsplash.com/photo-1508746829417-e6f548d8d6ed?auto=format&fit=crop&w=600&q=80", isDefault: true },
      ],
    },

    // =========================================================================
    // NGÀNH HÀNG 4: DƯỢC MỸ PHẨM & CHĂM SÓC CÁ NHÂN (10 SẢN PHẨM)
    // =========================================================================
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
        { name: "Vạch xanh (Kiềm dầu cho da dầu mụn)", sku: "LRP-OIL-50ML", price: 435000, originalPrice: 535000, stock: 90, image: "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=600&q=80", isDefault: true },
        { name: "Vạch vàng (Cấp ẩm cho da khô, nhạy cảm)", sku: "LRP-HYDRA-50ML", price: 435000, originalPrice: 535000, stock: 65, image: "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=600&q=80", isDefault: false },
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
        { name: "Chai 30ml", sku: "GND-B5-30ML", price: 360000, originalPrice: 480000, stock: 70, image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=600&q=80", isDefault: true },
      ],
    },
    {
      name: "Nước Tẩy Trang Dịu Nhẹ Bioderma Sensibio H2O Nắp Hồng Pháp (500ml)",
      slug: "nuoc-tay-trang-bioderma-sensibio-h2o-phap-500ml",
      categoryId: catLamSach,
      brand: "Bioderma",
      origin: "Pháp",
      specification: "Chai 500ml nắp bật",
      expiryInfo: "3 năm từ NSX (Date xa)",
      shortDesc: "Công nghệ hạt Micellar lành tính làm sạch 99% bụi bẩn và lớp trang điểm mà không làm khô căng da.",
      description: "<p>Nước tẩy trang đình đám số 1 thế giới đến từ nước Pháp, an toàn tuyệt đối cho mắt môi và làn da nhạy cảm nhất.</p>",
      isFeatured: true,
      variants: [
        { name: "Chai 500ml", sku: "BIO-H2O-500", price: 395000, originalPrice: 480000, stock: 110, image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=600&q=80", isDefault: true },
      ],
    },
    {
      name: "Sữa Rửa Mặt CeraVe Foaming Facial Cleanser Da Dầu Mụn Mỹ (473ml)",
      slug: "sua-rua-mat-cerave-foaming-facial-cleanser-my-473ml",
      categoryId: catLamSach,
      brand: "CeraVe",
      origin: "Mỹ",
      specification: "Chai vòi nhấn 473ml",
      expiryInfo: "3 năm kể từ ngày sản xuất",
      shortDesc: "Chứa 3 Ceramide thiết yếu, Niacinamide và HA giúp làm sạch sâu bã nhờn mà vẫn duy trì hàng rào bảo vệ da.",
      description: "<p>Sữa rửa mặt tạo bọt dịu nhẹ phát triển bởi các chuyên gia da liễu Hoa Kỳ, độ pH chuẩn 5.5 không gây khô rát.</p>",
      isFeatured: true,
      variants: [
        { name: "Chai 473ml", sku: "CERAVE-FOAM-473", price: 380000, originalPrice: 450000, stock: 85, image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=600&q=80", isDefault: true },
      ],
    },
    {
      name: "Kem Dưỡng Phục Hồi Làm Dịu Da La Roche-Posay Cicaplast Baume B5+ (100ml)",
      slug: "kem-duong-phuc-hoi-la-roche-posay-cicaplast-baume-b5-plus-100ml",
      categoryId: catKemDuong,
      brand: "La Roche-Posay",
      origin: "Pháp",
      specification: "Tuýp 100ml",
      expiryInfo: "36 tháng kể từ ngày sản xuất",
      shortDesc: "Công thức nâng cấp với Tribioma và 5% Panthenol B5 tái tạo làn da kích ứng, nứt nẻ và tổn thương.",
      description: "<p>Cicaplast Baume B5+ làm dịu tức thì cảm giác châm chích, hỗ trợ làm lành sẹo mụn và mẩn đỏ an toàn cho cả trẻ sơ sinh.</p>",
      isFeatured: true,
      variants: [
        { name: "Tuýp 100ml", sku: "LRP-B5PLUS-100", price: 395000, originalPrice: 470000, stock: 95, image: "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=600&q=80", isDefault: true },
      ],
    },
    {
      name: "Serum Chống Lão Hóa Estée Lauder Advanced Night Repair Mỹ (50ml)",
      slug: "serum-chong-lao-hoa-estee-lauder-advanced-night-repair-50ml",
      categoryId: catSerum,
      brand: "Estée Lauder",
      origin: "Mỹ",
      specification: "Chai nâu thủy tinh 50ml có ống nhỏ giọt",
      expiryInfo: "3 năm kể từ ngày sản xuất",
      shortDesc: "Công nghệ phục hồi ban đêm Chronolux Power Signal kích hoạt tái tạo tế bào, giảm nếp nhăn và săn chắc da.",
      description: "<p>Serum chống lão hóa bán chạy số 1 toàn cầu, mang lại làn da căng bóng mịn màng và rạng rỡ sau mỗi đêm thức dậy.</p>",
      isFeatured: true,
      variants: [
        { name: "Chai 50ml", sku: "EL-ANR-50ML", price: 2150000, originalPrice: 2600000, stock: 35, image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=600&q=80", isDefault: true },
      ],
    },
    {
      name: "Sữa Chống Nắng Anessa Perfect UV Sunscreen Skincare Milk Nhật Bản (60ml)",
      slug: "kem-chong-nang-anessa-perfect-uv-sunscreen-nhat-ban-60ml",
      categoryId: catChongNang,
      brand: "Anessa",
      origin: "Nhật Bản",
      specification: "Chai 60ml dạng sữa lỏng",
      expiryInfo: "3 năm kể từ ngày sản xuất",
      shortDesc: "Công nghệ Auto Booster tăng cường màng chắn bảo vệ khi gặp nhiệt độ cao, độ ẩm và mồ hôi.",
      description: "<p>Dòng kem chống nắng số 1 Nhật Bản 21 năm liên tiếp, kết cấu mỏng nhẹ khô thoáng kiềm dầu cả ngày không vón cục.</p>",
      isFeatured: true,
      variants: [
        { name: "Chai 60ml", sku: "ANESSA-GOLD-60ML", price: 475000, originalPrice: 590000, stock: 75, image: "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=600&q=80", isDefault: true },
      ],
    },
    {
      name: "Cặp Dầu Gội Xả Phục Hồi Tóc Moroccanoil Moisture Repair (500ml)",
      slug: "dau-goi-xa-phuc-hoi-toc-moroccanoil-repair-israel-500ml",
      categoryId: catTocBody,
      brand: "Moroccanoil",
      origin: "Israel",
      specification: "Bộ gồm 1 gội 500ml + 1 xả 500ml",
      expiryInfo: "36 tháng kể từ NSX",
      shortDesc: "Tinh dầu Argan nguyên chất kết hợp Keratin tái tạo cấu trúc tóc khô xơ hư tổn do uốn nhuộm.",
      description: "<p>Bộ chăm sóc tóc chuẩn Salon cao cấp Moroccanoil giúp tóc suôn mượt óng ả, lưu giữ hương thơm sang trọng quý phái suốt 48h.</p>",
      isFeatured: false,
      variants: [
        { name: "Cặp Gội Xả 500ml", sku: "MOROC-SET-500", price: 1350000, originalPrice: 1650000, stock: 25, image: "https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?auto=format&fit=crop&w=600&q=80", isDefault: true },
      ],
    },
    {
      name: "Sữa Tắm Trắng Da Toàn Thân White Conc Body Shampoo Nhật Bản (360ml)",
      slug: "sua-tam-duong-am-white-conc-body-shampoo-nhat-ban-360ml",
      categoryId: catTocBody,
      brand: "White Conc",
      origin: "Nhật Bản",
      specification: "Chai 360ml hương bưởi tự nhiên",
      expiryInfo: "3 năm kể từ ngày sản xuất",
      shortDesc: "Chiết xuất cam chanh giàu vitamin C loại bỏ tế bào sừng già cỗi, nuôi dưỡng làn da body trắng sáng mịn màng.",
      description: "<p>Sữa tắm dưỡng trắng nổi tiếng nội địa Nhật Bản, làm sạch sâu lỗ chân lông và làm mờ các vết thâm sạm trên cơ thể.</p>",
      isFeatured: false,
      variants: [
        { name: "Chai 360ml", sku: "WC-BODY-360ML", price: 245000, originalPrice: 310000, stock: 80, image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=600&q=80", isDefault: true },
      ],
    },
    {
      name: "Kem Dưỡng Rau Má Làm Dịu Da Skin1004 Madagascar Centella Soothing Cream",
      slug: "kem-duong-am-phuc-hoi-skin1004-madagascar-centella-soothing-cream-75ml",
      categoryId: catKemDuong,
      brand: "Skin1004",
      origin: "Hàn Quốc",
      specification: "Tuýp 75ml dạng gel mỏng nhẹ",
      expiryInfo: "30 tháng kể từ NSX",
      shortDesc: "72% chiết xuất rau má Madagascar nguyên chất làm mát dịu tức thì, kháng viêm và cấp ẩm không bí da.",
      description: "<p>Kem dưỡng ẩm gel mát mẻ dành riêng cho da dầu mụn và nhạy cảm, thẩm thấu nhanh không gây bết dính trong ngày hè oi ả.</p>",
      isFeatured: false,
      variants: [
        { name: "Tuýp 75ml", sku: "SKIN1004-SOOTH-75", price: 295000, originalPrice: 380000, stock: 90, image: "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=600&q=80", isDefault: true },
      ],
    },

    // =========================================================================
    // NGÀNH HÀNG 5: MẸ & BÉ (10 SẢN PHẨM)
    // =========================================================================
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
        { name: "Số 1 (Dành cho bé 0 - 6 tháng)", sku: "APTA-UC-SO1", price: 920000, originalPrice: 1050000, stock: 45, image: "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=600&q=80", isDefault: true },
        { name: "Số 2 (Dành cho bé 6 - 12 tháng)", sku: "APTA-UC-SO2", price: 920000, originalPrice: 1050000, stock: 40, image: "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=600&q=80", isDefault: false },
        { name: "Số 3 (Dành cho bé 1 - 3 tuổi)", sku: "APTA-UC-SO3", price: 890000, originalPrice: 1020000, stock: 55, image: "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=600&q=80", isDefault: false },
      ],
    },
    {
      name: "Bột Ăn Dặm Gerber Organic Yến Mạch Chuối Mỹ (Hộp 227g)",
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
        { name: "Hộp 227g", sku: "GERBER-OAT-227G", price: 155000, originalPrice: 195000, stock: 85, image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=600&q=80", isDefault: true },
      ],
    },
    {
      name: "Sữa Bột Meiji Thanh Nội Địa Nhật Bản Số 0 (Hộp 24 thanh)",
      slug: "sua-bot-meiji-thanh-nhat-ban-so-0-hop-24-thanh",
      categoryId: catSuaBot,
      brand: "Meiji",
      origin: "Nhật Bản",
      specification: "Hộp 24 thanh x 5 viên (mỗi thanh pha 200ml)",
      expiryInfo: "18 tháng kể từ NSX",
      shortDesc: "Sữa công thức dạng viên thanh tiện lợi, vị thanh mát nhạt tự nhiên không gây nóng trong hay táo bón.",
      description: "<p>Meiji thanh số 0 cho bé từ 0-1 tuổi bổ sung DHA, ARA và FOS hỗ trợ phát triển trí não và hệ miễn dịch vững vàng.</p>",
      isFeatured: true,
      variants: [
        { name: "Hộp 24 thanh (Số 0: 0-1 tuổi)", sku: "MEIJI-TH-0", price: 540000, originalPrice: 620000, stock: 65, image: "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=600&q=80", isDefault: true },
      ],
    },
    {
      name: "Sữa Bột A2 Platinum Premium Úc Đạm Quý A2 Dễ Tiêu Hóa (Lon 900g)",
      slug: "sua-bot-a2-platinum-premium-uc-lon-900g",
      categoryId: catSuaBot,
      brand: "a2 Platinum",
      origin: "Úc",
      specification: "Lon thiếc 900g",
      expiryInfo: "24 tháng kể từ ngày sản xuất",
      shortDesc: "Chứa 100% đạm A2 tự nhiên không chứa đạm A1, khắc phục hoàn toàn tình trạng đầy bụng khó tiêu ở trẻ.",
      description: "<p>a2 Platinum cung cấp tổ hợp dinh dưỡng toàn diện với Omega-3 DHA, kẽm, sắt và prebiotic cho bé phát triển khỏe mạnh.</p>",
      isFeatured: false,
      variants: [
        { name: "Số 1 (0 - 6 tháng)", sku: "A2-PLAT-1", price: 880000, originalPrice: 980000, stock: 40, image: "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=600&q=80", isDefault: true },
        { name: "Số 2 (6 - 12 tháng)", sku: "A2-PLAT-2", price: 880000, originalPrice: 980000, stock: 35, image: "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=600&q=80", isDefault: false },
        { name: "Số 3 (1 - 3 tuổi)", sku: "A2-PLAT-3", price: 850000, originalPrice: 950000, stock: 50, image: "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=600&q=80", isDefault: false },
      ],
    },
    {
      name: "Vitamin D3 K2 MK7 Sunday Natural Đức Hữu Cơ (Lọ 20ml - 600 giọt)",
      slug: "vitamin-d3-k2-mk7-sunday-natural-duc-20ml",
      categoryId: catVitBe,
      brand: "Sunday Natural",
      origin: "Đức",
      specification: "Chai thủy tinh 20ml có ống hút giọt",
      expiryInfo: "24 tháng kể từ NSX",
      shortDesc: "Tỷ lệ vàng D3 và K2 MK7 chuẩn K2VITAL tinh khiết 99.7% giúp gắn kết canxi vào xương, bé ngủ ngon không vặn mình.",
      description: "<p>Dòng D3K2 nhỏ giọt thuần chay số 1 tại Đức chiết xuất trên nền dầu dừa MCT hữu cơ, không màu, không chất bảo quản.</p>",
      isFeatured: true,
      variants: [
        { name: "Chai 20ml (Dùng 6-8 tháng)", sku: "SUNDAY-D3K2-20", price: 345000, originalPrice: 420000, stock: 120, image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=600&q=80", isDefault: true },
      ],
    },
    {
      name: "Men Vi Sinh 10 Chủng BioAmicus Complete Canada Cho Trẻ Sơ Sinh (10ml)",
      slug: "men-vi-sinh-bioamicus-complete-10-chung-canada-10ml",
      categoryId: catVitBe,
      brand: "BioAmicus",
      origin: "Canada",
      specification: "Chai nhỏ giọt 10ml",
      expiryInfo: "24 tháng kể từ NSX",
      shortDesc: "Công thức đột phá chứa 10 chủng lợi khuẩn Lactobacillus và Bifidobacterium giải quyết nôn trớ, biếng ăn và táo bón.",
      description: "<p>Men vi sinh 10 chủng BioAmicus được các bác sĩ nhi khoa khuyên dùng để thiết lập hệ vi sinh đường ruột khỏe mạnh cho bé từ 0 tháng tuổi.</p>",
      isFeatured: true,
      variants: [
        { name: "Chai 10ml", sku: "BIO-MEN-10ML", price: 420000, originalPrice: 490000, stock: 90, image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=600&q=80", isDefault: true },
      ],
    },
    {
      name: "Bánh Ăn Dặm Pigeon Canxi Vị Cá Cơm Nhật Bản (Bé 7 tháng+)",
      slug: "banh-an-dam-pigeon-nhat-ban-cho-be-7-thang",
      categoryId: catAnDam,
      brand: "Pigeon",
      origin: "Nhật Bản",
      specification: "Hộp 6 gói nhỏ tiện dụng",
      expiryInfo: "12 tháng kể từ NSX",
      shortDesc: "Bánh xốp tròn mềm tan ngay trong miệng, bổ sung canxi và rèn luyện phản xạ nhai nuốt cho bé.",
      description: "<p>Bánh ăn dặm Pigeon sử dụng gạo tẻ Nhật Bản kết hợp cá cơm dinh dưỡng, không phẩm màu và không hương liệu nhân tạo.</p>",
      isFeatured: false,
      variants: [
        { name: "Hộp 6 gói", sku: "PIGEON-BANH-7M", price: 65000, originalPrice: 85000, stock: 110, image: "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?auto=format&fit=crop&w=600&q=80", isDefault: true },
      ],
    },
    {
      name: "Kem Chống Hăm Tã Sudocrem Healing Cream Anh Quốc (Hũ 125g)",
      slug: "kem-chong-ham-ta-sudocrem-anh-quoc-125g",
      categoryId: catVeSinhBe,
      brand: "Sudocrem",
      origin: "Anh Quốc",
      specification: "Hũ 125g",
      expiryInfo: "5 năm kể từ NSX",
      shortDesc: "Kem chống hăm tã diệt khuẩn số 1 Vương quốc Anh, làm dịu da hăm đỏ, vết muỗi đốt và trầy xước.",
      description: "<p>Sudocrem tạo lớp màng chống thấm nước bảo vệ làn da mỏng manh của bé suốt đêm, giảm ngứa rát và ngừa viêm da tã lót.</p>",
      isFeatured: false,
      variants: [
        { name: "Hũ 125g", sku: "SUDO-125G", price: 125000, originalPrice: 160000, stock: 95, image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=600&q=80", isDefault: true },
      ],
    },
    {
      name: "Sữa Tắm Gội Toàn Thân Cetaphil Baby Hoa Cúc Hữu Cơ Đức (Chai 400ml)",
      slug: "sua-tam-goi-toan-than-cetaphil-baby-duc-400ml",
      categoryId: catVeSinhBe,
      brand: "Cetaphil",
      origin: "Đức",
      specification: "Chai 400ml có vòi nhấn",
      expiryInfo: "3 năm kể từ NSX",
      shortDesc: "Chiết xuất hoa cúc Calendula hữu cơ làm sạch êm dịu, không cay mắt và cân bằng độ ẩm cho làn da bé.",
      description: "<p>Cetaphil Baby Calendula được viện da liễu châu Âu chứng nhận an toàn, không chứa paraben, dầu khoáng và xà phòng.</p>",
      isFeatured: true,
      variants: [
        { name: "Chai 400ml", sku: "CETAPHIL-BABY-400", price: 245000, originalPrice: 310000, stock: 85, image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=600&q=80", isDefault: true },
      ],
    },
    {
      name: "Viên Uống Elevit Bổ Sung Vitamin Cho Bà Bầu Bayer Úc (Hộp 100 viên)",
      slug: "vien-uong-elevit-cho-ba-bau-bayer-uc-100-vien",
      categoryId: catMeBau,
      brand: "Bayer",
      origin: "Úc",
      specification: "Hộp 100 viên (10 vỉ)",
      expiryInfo: "24 tháng kể từ ngày sản xuất",
      shortDesc: "Công thức chứa 800mcg Acid Folic, Sắt hữu cơ và 18 dưỡng chất thiết yếu cho mẹ chuẩn bị mang thai, đang mang thai và sau sinh.",
      description: "<p>Elevit Úc là sản phẩm vitamin bầu số 1 tại Úc giúp giảm 92% nguy cơ dị tật ống thần kinh ở thai nhi và giảm tình trạng ốm nghén cho mẹ.</p>",
      isFeatured: true,
      variants: [
        { name: "Hộp 100 viên (Dùng hơn 3 tháng)", sku: "ELEVIT-100V", price: 1180000, originalPrice: 1350000, stock: 50, image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=600&q=80", isDefault: true },
      ],
    },
  ];

  console.log(`Found ${products.length} products to upsert.`);

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

  // ── Tạo Flash Sale Session kết thúc sau 7 ngày ──────────────────────────
  const now = new Date();
  const endTime = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

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

  console.log("🎉 Successfully seeded all 50 products across 5 categories!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
