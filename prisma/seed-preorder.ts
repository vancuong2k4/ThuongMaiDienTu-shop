import { PrismaClient, CampaignStatus, DepositType, HarvestQualityGrade, ReservationStatus } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Bắt đầu nạp dữ liệu Hệ Thống Đặt Trước Mùa Vụ Úc (Phase 21)...");

  // 1. Chiến dịch Cherry Tasmania Tết Bính Ngọ
  const cherryCampaign = await prisma.seasonalCampaign.upsert({
    where: { slug: "cherry-tasmania-tet-2026" },
    update: {},
    create: {
      title: "Cherry Đỏ Tasmania Vụ Thu Hoạch Tết Bính Ngọ 2026",
      slug: "cherry-tasmania-tet-2026",
      subtitle:
        "100% Vận chuyển đường bay Air 24h từ Thung Lũng Huon, Tasmania — Trái căng bóng, cuống xanh mướt, size 32-34mm Jumbo",
      description:
        "Reid Fruits Tasmania là một trong những nông trường trồng cherry lâu đời và danh giá nhất nước Úc thành lập từ năm 1856. Nhờ thổ nhưỡng khí hậu băng giá Nam Cực kết hợp nguồn nước tinh khiết thung lũng Huon, cherry Tasmania sở hữu vị ngọt đậm đà từ 22° đến 26° Brix, thịt quả giòn sần sật và lớp vỏ đỏ thẫm ruby sang trọng. Mỗi năm vụ thu hoạch chỉ kéo dài vỏn vẹn 4-6 tuần rơi trúng dịp Tết Nguyên Đán Việt Nam. THUYNGA Shop bao tiêu trọn gói đường bay lạnh Vietnam Airlines/Qantas Freight từ sân bay Hobart/Melbourne về thẳng Nội Bài trong 24 giờ.",
      farmName: "Reid Fruits Estate (Est. 1856)",
      farmRegion: "Huon Valley & Derwent Valley, Tasmania, Australia",
      originCountry: "Australia",
      productCategory: "CHERRY",
      bannerImage:
        "https://images.unsplash.com/photo-1528825871115-3581a5387919?auto=format&fit=crop&w=1400&q=80",
      galleryImages: [
        "https://images.unsplash.com/photo-1559181567-c3190ca9959b?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1528825871115-3581a5387919?auto=format&fit=crop&w=800&q=80",
      ],
      harvestStartDate: new Date("2026-01-05T00:00:00Z"),
      harvestEndDate: new Date("2026-01-25T00:00:00Z"),
      flightDepartureWeek: "Tuần 3 Tháng 1/2026 (Đúng 23-28 Tháng Chạp đón Tết)",
      targetBrixSweetness: "22.0° - 26.0° Brix",
      fruitSizeMm: "32mm - 34mm (Jumbo Select)",
      qualityGrade: HarvestQualityGrade.ROYAL_RESERVE,
      totalCapacityKg: 5000.0,
      reservedCapacityKg: 3850.0,
      status: CampaignStatus.OPEN_FOR_RESERVATION,
      depositType: DepositType.PERCENTAGE_30,
      depositPercent: 30,
      sortOrder: 1,
    },
  });

  // Tiers cho Cherry Tasmania
  const cherryTier1 = await prisma.preOrderTier.upsert({
    where: { id: "tier-cherry-2kg" },
    update: {},
    create: {
      id: "tier-cherry-2kg",
      campaignId: cherryCampaign.id,
      name: "Hộp Quà Biếu Hoàng Gia 2kg (Size 32-34mm Jumbo)",
      specification:
        "Hộp cứng nam châm dập kim vàng sang trọng, kèm thiệp chúc Tết, túi giữ nhiệt chuyên dụng bay Air và nơ nhung Ruby",
      price: 1950000,
      depositAmount: 585000,
      totalSlots: 350,
      reservedSlots: 268,
      isAvailable: true,
      sortOrder: 1,
    },
  });

  await prisma.preOrderTier.upsert({
    where: { id: "tier-cherry-5kg" },
    update: {},
    create: {
      id: "tier-cherry-5kg",
      campaignId: cherryCampaign.id,
      name: "Thùng Master Box Nông Trường 5kg (Size 32mm+)",
      specification:
        "Thùng carton nguyên seal kiểm định Reid Fruits Tasmania, túi MAP bảo quản khí quyển biến đổi giữ trọn cuống xanh tươi 15 ngày",
      price: 4650000,
      depositAmount: 1395000,
      totalSlots: 100,
      reservedSlots: 74,
      isAvailable: true,
      sortOrder: 2,
    },
  });

  await prisma.preOrderTier.upsert({
    where: { id: "tier-cherry-1kg" },
    update: {},
    create: {
      id: "tier-cherry-1kg",
      campaignId: cherryCampaign.id,
      name: "Hộp Thưởng Thức Mùa Vụ 1kg (Size 30-32mm)",
      specification:
        "Hộp quà nắp trong cao cấp, phù hợp dùng gia đình hoặc tặng bạn bè thân hữu đón Tết",
      price: 1050000,
      depositAmount: 315000,
      totalSlots: 200,
      reservedSlots: 142,
      isAvailable: true,
      sortOrder: 3,
    },
  });

  // Harvest Updates cho Cherry Tasmania
  await prisma.harvestUpdate.createMany({
    data: [
      {
        campaignId: cherryCampaign.id,
        title: "Đo đạc độ ngọt tuần 1: Trái chuyển màu đỏ sẫm, độ đường đạt 23.8° Brix",
        content:
          "Thời tiết thung lũng Huon tuần qua duy trì biên độ nhiệt lý tưởng: ban ngày 22°C nắng ấm nhẹ, ban đêm lạnh sâu 7°C từ luồng gió Nam Cực thổi về. Điều này kích hoạt quá trình chuyển hóa tinh bột thành đường tự nhiên cực đại. Mẫu thử nghiệm tại vườn Reid Fruits cho kích thước trung bình 33.1mm, cuống dẻo và thịt quả đặc giòn.",
        brixRecorded: 23.8,
        sizeRecordedMm: 33.1,
        weatherCondition: "Nắng ráo 21°C, độ ẩm 62%, gió mát Nam Cực",
        reportedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      },
      {
        campaignId: cherryCampaign.id,
        title: "Khởi động quy trình dán tem truy xuất nguồn gốc & kiểm định AWB",
        content:
          "Bộ phận quản lý chất lượng nông trường phối hợp cùng đối tác vận chuyển hàng không đã hoàn tất kiểm tra hệ thống làm mát Hydro-cooling. Trái sau khi hái thủ công từ 5h sáng sẽ được hạ nhiệt ngay lập tức xuống 0.5°C trước khi đóng hộp và niêm phong seal an ninh.",
        brixRecorded: 24.2,
        sizeRecordedMm: 33.5,
        weatherCondition: "Trời quang mây tạnh, 19°C",
        reportedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      },
    ],
  });

  // 2. Chiến dịch Mật ong Manuka Hoàng Gia UMF 25+
  const manukaCampaign = await prisma.seasonalCampaign.upsert({
    where: { slug: "manuka-hoang-gia-mgo1200" },
    update: {},
    create: {
      title: "Mật Ong Manuka Hoàng Gia MGO 1200+ (UMF 25+) Vụ Mùa Giới Hạn",
      slug: "manuka-hoang-gia-mgo1200",
      subtitle:
        "Chiết xuất từ những bụi cây Leptospermum hoang dã rừng nguyên sinh Úc — Kháng khuẩn hoạt tính sinh học siêu đỉnh cao",
      description:
        "MGO 1200+ (tương đương UMF 25+) là một trong những cấp độ mật ong Manuka quý hiếm và đắt giá nhất trên thế giới. Để đạt được hàm lượng Methylglyoxal tự nhiên lên tới 1200mg/kg, các đàn ong mật phải làm tổ giữa những thung lũng hoa Manuka nở rộ chỉ 2-6 tuần trong năm tại vùng rừng nguyên sinh hẻo lánh nước Úc. Mỗi mẻ quay mật đều được chứng nhận độc lập bởi phòng kiểm nghiệm chuẩn ISO 17025 của chính phủ Úc.",
      farmName: "Berringa Wild Manuka Reserves",
      farmRegion: "Pristine Coastal Forests, Victoria, Australia",
      originCountry: "Australia",
      productCategory: "MANUKA_HONEY",
      bannerImage:
        "https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=1400&q=80",
      galleryImages: [
        "https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=800&q=80",
      ],
      harvestStartDate: new Date("2026-02-01T00:00:00Z"),
      harvestEndDate: new Date("2026-03-01T00:00:00Z"),
      flightDepartureWeek: "Tuần 1 Tháng 3/2026",
      targetBrixSweetness: "82.0° Brix cô đặc",
      fruitSizeMm: "Chỉ số MGO 1200+ mg/kg",
      qualityGrade: HarvestQualityGrade.DIAMOND_SELECT,
      totalCapacityKg: 500.0,
      reservedCapacityKg: 320.0,
      status: CampaignStatus.OPEN_FOR_RESERVATION,
      depositType: DepositType.PERCENTAGE_30,
      depositPercent: 30,
      sortOrder: 2,
    },
  });

  // Tiers Manuka
  await prisma.preOrderTier.upsert({
    where: { id: "tier-manuka-single" },
    update: {},
    create: {
      id: "tier-manuka-single",
      campaignId: manukaCampaign.id,
      name: "Hũ Thủy Tinh 250g Thượng Hạng MGO 1200+ (UMF 25+)",
      specification:
        "Hộp quà sơn mài cao cấp, kèm thìa múc mật gỗ sồi tự nhiên và chứng thư phân tích hoạt tính vi sinh",
      price: 2850000,
      depositAmount: 855000,
      totalSlots: 150,
      reservedSlots: 104,
      isAvailable: true,
      sortOrder: 1,
    },
  });

  await prisma.preOrderTier.upsert({
    where: { id: "tier-manuka-duo" },
    update: {},
    create: {
      id: "tier-manuka-duo",
      campaignId: manukaCampaign.id,
      name: "Hộp Quà Đôi Song Long Tri Ân 2x250g MGO 1200+",
      specification:
        "Set 2 hũ mật ong Manuka tuyển chọn số seri liên tiếp, bọc vải gấm thêu rồng phụng sang trọng",
      price: 5500000,
      depositAmount: 1650000,
      totalSlots: 50,
      reservedSlots: 32,
      isAvailable: true,
      sortOrder: 2,
    },
  });

  // Tạo đơn đặt trước mẫu (Pre-order reservation)
  await prisma.preOrderReservation.upsert({
    where: { reservationCode: "PRE-TAS-2026-001" },
    update: {},
    create: {
      reservationCode: "PRE-TAS-2026-001",
      campaignId: cherryCampaign.id,
      tierId: cherryTier1.id,
      customerName: "Nguyễn Thị Phương Thảo",
      customerPhone: "0912345678",
      customerEmail: "thao.nguyen@gmail.com",
      deliveryAddress: "P1208 Tòa R2 Royal City, 72A Nguyễn Trãi, Thanh Xuân, Hà Nội",
      quantity: 2,
      totalPrice: 3900000,
      depositPaid: 1170000,
      remainingAmount: 2730000,
      depositMethod: "VIETQR_NAPAS",
      status: ReservationStatus.CONFIRMED_DEPOSIT,
      flightNumber: "VN780",
      notes: "Giao đúng ngày 26 Tết để biếu nội ngoại, yêu cầu cuống còn tươi xanh",
    },
  });

  console.log("✅ Nạp thành công dữ liệu Hệ Thống Đặt Trước Mùa Vụ Úc!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
