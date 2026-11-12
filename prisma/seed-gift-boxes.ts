// ============================================================
// prisma/seed-gift-boxes.ts
// Kịch bản nạp dữ liệu mẫu Mẫu Hộp Quà Biếu & Yêu Cầu Doanh Nghiệp (Phase 17)
// ============================================================

import {
  PrismaClient,
  GiftBoxType,
  GiftOccasion,
  CorporateGiftStatus,
} from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🎁 Đang nạp dữ liệu mẫu Mẫu Hộp Quà Biếu Cao Cấp & Doanh Nghiệp (Phase 17)...");

  // 1. Danh sách 5 mẫu vỏ hộp quà sang trọng
  const templates = [
    {
      name: "Hộp Quà Gỗ Thông Sơn Mài Hoàng Gia",
      slug: "hop-qua-go-thong-son-mai",
      boxType: GiftBoxType.WOODEN_BOX,
      dimensions: "38 x 28 x 14 cm",
      basePrice: 280000,
      maxSlots: 5,
      imageUrl: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=800&q=80",
      description: "Chất liệu gỗ thông New Zealand tự nhiên phủ sơn mài cao cấp, khóa kim loại đồng cổ điển, lót rơm lụa nhập khẩu và thiệp chúc mừng dập nổi kim.",
      isAirCargoPledge: true,
      sortOrder: 1,
    },
    {
      name: "Hộp Da Lót Nhung Rượu Vang & Mật Ong Úc",
      slug: "hop-da-lot-nhung-thuong-hang",
      boxType: GiftBoxType.LEATHER_CASE,
      dimensions: "36 x 26 x 13 cm",
      basePrice: 350000,
      maxSlots: 4,
      imageUrl: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=800&q=80",
      description: "Hộp bọc da PU vân sần sang trọng, lòng hộp lót nhung đỏ rượu mận mềm mại, chuyên dùng phối set cùng Mật ong Manuka và TPCN cao cấp.",
      isAirCargoPledge: true,
      sortOrder: 2,
    },
    {
      name: "Giỏ Mây Tre Đan Nghệ Nhân Sum Vầy",
      slug: "gio-may-tre-dan-sum-vay",
      boxType: GiftBoxType.BAMBOO_HAMPER,
      dimensions: "40 x 30 x 18 cm",
      basePrice: 190000,
      maxSlots: 6,
      imageUrl: "https://images.unsplash.com/photo-1513885535751-8b9238bd345a?auto=format&fit=crop&w=800&q=80",
      description: "Đan thủ công tỉ mỉ từ nghệ nhân làng nghề mây tre truyền thống, chống ẩm mốc chuẩn xuất khẩu, kèm nơ satin bồng bềnh và màng co trong suốt.",
      isAirCargoPledge: true,
      sortOrder: 3,
    },
    {
      name: "Hộp Chuyên Dụng Air-Cargo Cherry Đỏ Ép Kim 24K",
      slug: "hop-air-cargo-cherry-ep-kim",
      boxType: GiftBoxType.CHERRY_CARGO_BOX,
      dimensions: "32 x 24 x 10 cm",
      basePrice: 150000,
      maxSlots: 4,
      imageUrl: "https://images.unsplash.com/photo-1528821128474-27f963b062bf?auto=format&fit=crop&w=800&q=80",
      description: "Hộp carton lạnh 3 lớp định hình khay chống sốc quả Cherry Úc tươi, giữ nhiệt lạnh 48 giờ trên chuyến bay, nắp gập ép kim hoa văn vàng gold 24K.",
      isAirCargoPledge: true,
      sortOrder: 4,
    },
    {
      name: "Hộp Cứng Nam Châm Nắp Gập Quý Tộc Navy",
      slug: "hop-nam-cham-nap-gap-navy",
      boxType: GiftBoxType.LUXURY_MAGNETIC_BOX,
      dimensions: "35 x 25 x 11 cm",
      basePrice: 220000,
      maxSlots: 5,
      imageUrl: "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80",
      description: "Giấy mỹ thuật cao cấp định lượng 1200gsm nhập khẩu Châu Âu, nắp nam châm hút êm ái, ruy băng gấm dệt logo THUYNGA sang trọng.",
      isAirCargoPledge: true,
      sortOrder: 5,
    },
  ];

  for (const t of templates) {
    await prisma.giftBoxTemplate.upsert({
      where: { slug: t.slug },
      update: {
        name: t.name,
        boxType: t.boxType,
        dimensions: t.dimensions,
        basePrice: t.basePrice,
        maxSlots: t.maxSlots,
        imageUrl: t.imageUrl,
        description: t.description,
        isAirCargoPledge: t.isAirCargoPledge,
        sortOrder: t.sortOrder,
        isActive: true,
      },
      create: {
        name: t.name,
        slug: t.slug,
        boxType: t.boxType,
        dimensions: t.dimensions,
        basePrice: t.basePrice,
        maxSlots: t.maxSlots,
        imageUrl: t.imageUrl,
        description: t.description,
        isAirCargoPledge: t.isAirCargoPledge,
        sortOrder: t.sortOrder,
        isActive: true,
      },
    });
  }

  console.log(`✅ Đã nạp thành công ${templates.length} mẫu hộp quà biếu cao cấp.`);

  // 2. Nạp dữ liệu yêu cầu quà tặng doanh nghiệp B2B mẫu
  const sampleInquiry = await prisma.corporateGiftInquiry.upsert({
    where: { inquiryCode: "CORP-202611-001" },
    update: {},
    create: {
      inquiryCode: "CORP-202611-001",
      companyName: "Tập Đoàn Tài Chính & Công Nghệ SmartFinance VN",
      contactPerson: "Nguyễn Hải Đăng (Trưởng phòng Đối ngoại)",
      phone: "0912345678",
      email: "haidang.nguyen@smartfinance.com.vn",
      occasion: GiftOccasion.TET_HOLIDAY,
      quantity: 80,
      budgetPerHamper: 2500000,
      deliveryDeadline: new Date("2026-12-25"),
      requiresVatInvoice: true,
      customLogoBranding: true,
      notes: "Cần phối set gồm Hộp Cherry Úc Tasmania 2kg, 1 hũ Mật ong Manuka MGO 850+ và 1 hộp sụn cá mập Úc. Yêu cầu khắc laser logo công ty lên nắp hộp gỗ và xuất hóa đơn VAT.",
      status: CorporateGiftStatus.QUOTED,
      quotedTotal: 200000000, // 80 suất x 2.500.000đ
      adminNotes: "Đã gửi bản thiết kế 3D demo khắc logo và bảng chiết khấu 8% số lượng lớn qua email ngày 11/11. Khách hẹn phản hồi duyệt ngân sách trong 48h.",
    },
  });

  console.log("✅ Đã nạp thành công 1 yêu cầu quà tặng doanh nghiệp mẫu:", sampleInquiry.inquiryCode);
}

main()
  .catch((e) => {
    console.error("Lỗi khi seed gift box templates:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
