// ============================================================
// prisma/seed-aircargo-batches.ts
// Kịch bản nạp dữ liệu mẫu Lô Hàng Bay Air & Mã Lô Minh Bạch (Phase 15 - Stage 15.1)
// ============================================================

import {
  PrismaClient,
  AirlineCarrier,
  ShipmentStatus,
} from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Bắt đầu nạp dữ liệu Lô Hàng Bay Air & Mã Lô HSD Minh Bạch...");

  // 1. Tìm sản phẩm trong DB
  const products = await prisma.product.findMany({
    include: { variants: true },
    take: 4,
  });

  if (products.length === 0) {
    console.log("⚠️ Không tìm thấy sản phẩm nào trong DB để liên kết lô hàng.");
    return;
  }

  const p1 = products[0];
  const p2 = products[1] || products[0];
  const p3 = products[2] || products[0];

  // Làm sạch dữ liệu cũ
  await prisma.batchVerificationLog.deleteMany({});
  await prisma.productBatch.deleteMany({});
  await prisma.airCargoShipment.deleteMany({});

  console.log("🧹 Đã làm sạch dữ liệu lô hàng cũ.");

  // 2. Tạo Lô hàng bay Air 1: Vietnam Airlines Cargo từ Sydney (SYD -> HAN)
  const departure1 = new Date();
  departure1.setDate(departure1.getDate() - 10);
  const arrival1 = new Date();
  arrival1.setDate(arrival1.getDate() - 9);

  const shipment1 = await prisma.airCargoShipment.create({
    data: {
      shipmentNumber: "AWB-VN782-202610",
      airWaybillNumber: "738-98421054",
      carrier: AirlineCarrier.VIETNAM_AIRLINES_CARGO,
      flightNumber: "VN782",
      originAirport: "SYD",
      destinationAirport: "HAN",
      departureDate: departure1,
      arrivalDate: arrival1,
      status: ShipmentStatus.IN_WAREHOUSE,
      storageTempMin: 18.5,
      storageTempMax: 22.0,
      temperatureLog: [
        { time: departure1.toISOString(), temp: 19.8, note: "Bốc hàng khoang mát Sydney" },
        { time: new Date(departure1.getTime() + 1000 * 60 * 60 * 5).toISOString(), temp: 20.4, note: "Trên hành trình bay tầng đối lưu" },
        { time: arrival1.toISOString(), temp: 21.2, note: "Hạ cánh Nội Bài, chuyển kho lạnh TCS" },
      ],
      receiptImages: [
        "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800",
        "https://images.unsplash.com/photo-1544816155-12df9643f363?w=800",
      ],
      customsDocImages: [
        "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800",
      ],
      notes:
        "Lô hàng chuyên chở sữa công thức Aptamil Profutura Synbiotic và Manuka Honey nguyên đai nguyên kiện, thu mua trực tiếp tại Chemist Warehouse Sydney.",
    },
  });

  // 3. Tạo Lô hàng bay Air 2: Qantas Freight từ Melbourne (MEL -> HAN)
  const departure2 = new Date();
  departure2.setDate(departure2.getDate() - 4);
  const arrival2 = new Date();
  arrival2.setDate(arrival2.getDate() - 3);

  const shipment2 = await prisma.airCargoShipment.create({
    data: {
      shipmentNumber: "AWB-QF43-202611",
      airWaybillNumber: "081-34829105",
      carrier: AirlineCarrier.QANTAS_FREIGHT,
      flightNumber: "QF43",
      originAirport: "MEL",
      destinationAirport: "HAN",
      departureDate: departure2,
      arrivalDate: arrival2,
      status: ShipmentStatus.IN_WAREHOUSE,
      storageTempMin: 2.0,
      storageTempMax: 6.0,
      temperatureLog: [
        { time: departure2.toISOString(), temp: 3.5, note: "Khoang lạnh kiểm soát Melbourne" },
        { time: arrival2.toISOString(), temp: 4.2, note: "Hạ cánh Nội Bài, xe lạnh vận chuyển về kho" },
      ],
      receiptImages: [
        "https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=800",
      ],
      customsDocImages: [
        "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800",
      ],
      notes:
        "Lô hàng Vitamin Úc Swisse & Blackmores, kiểm tra nhiệt độ lạnh nghiêm ngặt dưới 25°C.",
    },
  });

  // 4. Tạo các mã lô hàng hóa cụ thể (ProductBatch)
  const mfg1 = new Date();
  mfg1.setMonth(mfg1.getMonth() - 2);
  const exp1 = new Date();
  exp1.setMonth(exp1.getMonth() + 22); // Còn 22 tháng HSD

  const batch1 = await prisma.productBatch.create({
    data: {
      batchCode: "APT-2026-SYD01",
      productId: p1.id,
      variantId: p1.variants[0]?.id || null,
      shipmentId: shipment1.id,
      manufactureDate: mfg1,
      expiryDate: exp1,
      importedQuantity: 240,
      remainingStock: 184,
      australianBarcode: "9310042456789",
      chemistSource: "Chemist Warehouse George Street, Sydney NSW",
      certificateUrl: "https://thuyngashop.vn/certificates/aptamil-syd-cert.pdf",
      isActive: true,
    },
  });

  const mfg2 = new Date();
  mfg2.setMonth(mfg2.getMonth() - 1);
  const exp2 = new Date();
  exp2.setFullYear(exp2.getFullYear() + 3); // HSD 3 năm

  const batch2 = await prisma.productBatch.create({
    data: {
      batchCode: "MNK-2026-MEL02",
      productId: p2.id,
      variantId: p2.variants[0]?.id || null,
      shipmentId: shipment1.id,
      manufactureDate: mfg2,
      expiryDate: exp2,
      importedQuantity: 150,
      remainingStock: 98,
      australianBarcode: "9345210987654",
      chemistSource: "Chemist Warehouse Bourke St Mall, Melbourne VIC",
      certificateUrl: "https://thuyngashop.vn/certificates/manuka-mel-cert.pdf",
      isActive: true,
    },
  });

  const mfg3 = new Date();
  mfg3.setMonth(mfg3.getMonth() - 3);
  const exp3 = new Date();
  exp3.setMonth(exp3.getMonth() + 21);

  const batch3 = await prisma.productBatch.create({
    data: {
      batchCode: "SWI-2026-SYD03",
      productId: p3.id,
      variantId: p3.variants[0]?.id || null,
      shipmentId: shipment2.id,
      manufactureDate: mfg3,
      expiryDate: exp3,
      importedQuantity: 300,
      remainingStock: 220,
      australianBarcode: "9321456987123",
      chemistSource: "Priceline Pharmacy Pitt Street, Sydney NSW",
      certificateUrl: "https://thuyngashop.vn/certificates/swisse-syd-cert.pdf",
      isActive: true,
    },
  });

  // 5. Thêm bản ghi tra cứu minh bạch mẫu (Verification Log)
  await prisma.batchVerificationLog.createMany({
    data: [
      {
        batchId: batch1.id,
        batchCode: batch1.batchCode,
        ipAddress: "14.232.128.45",
        userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X)",
      },
      {
        batchId: batch2.id,
        batchCode: batch2.batchCode,
        ipAddress: "113.190.234.12",
        userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
      },
    ],
  });

  console.log("✅ Đã nạp thành công:", {
    shipmentsCreated: 2,
    batchesCreated: 3,
    verificationLogs: 2,
    sampleBatchCodes: ["APT-2026-SYD01", "MNK-2026-MEL02", "SWI-2026-SYD03"],
  });
}

main()
  .catch((e) => {
    console.error("❌ Lỗi khi nạp dữ liệu mẫu lô hàng bay air:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
