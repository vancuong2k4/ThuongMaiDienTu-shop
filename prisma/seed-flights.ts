// ============================================================
// prisma/seed-flights.ts
// Kịch bản Seed Dữ Liệu Chuyến Bay Air Cargo & Cảm Biến Chuỗi Lạnh (Phase 20)
// ============================================================

import {
  PrismaClient,
  AirlineCarrier,
  FlightStatus,
  ColdChainCategory,
  SensorAlertLevel,
} from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("✈️ [Seed Air Cargo] Bắt đầu nạp dữ liệu chuyến bay & chuỗi lạnh Cold-Chain...");

  const now = new Date();

  // ── Flight 1: VN780 (Melbourne -> Hà Nội) - Đã nhập kho THUYNGA Shop ──
  const depTime1 = new Date(now.getTime() - 24 * 60 * 60 * 1000); // 24h trước
  const arrTime1 = new Date(depTime1.getTime() + 9 * 60 * 60 * 1000); // 9h sau cất cánh

  const flight1 = await prisma.airCargoFlight.upsert({
    where: { flightNumber: "VN780" },
    update: {
      aircraftType: "Boeing 787-9 Dreamliner Cargo",
      carrier: AirlineCarrier.VIETNAM_AIRLINES_CARGO,
      originAirport: "MEL",
      originCity: "Melbourne (Victoria, Úc)",
      destAirport: "HAN",
      destCity: "Hà Nội (Sân bay Quốc tế Nội Bài)",
      scheduledDeparture: depTime1,
      actualDeparture: depTime1,
      scheduledArrival: arrTime1,
      actualArrival: arrTime1,
      flightDurationMinutes: 540,
      flightStatus: FlightStatus.STORED_COLD,
      flightProgressPercent: 100,
      currentLatitude: 21.2212,
      currentLongitude: 105.8072,
      currentAltitudeFeet: 0,
      coldChainCategory: ColdChainCategory.ULTRA_COLD_CHERRY,
      targetTempMin: 0.0,
      targetTempMax: 4.0,
      averageTemp: 2.15,
      isColdChainPassed: true,
      totalCargoWeightKg: 4500.0,
      cargoManifestSummary:
        "4.500 kg Cherry đỏ Tasmania Size 30-32mm hái sáng sớm & 1.200 lon Sữa Aptamil Profutura Úc",
    },
    create: {
      flightNumber: "VN780",
      aircraftType: "Boeing 787-9 Dreamliner Cargo",
      carrier: AirlineCarrier.VIETNAM_AIRLINES_CARGO,
      originAirport: "MEL",
      originCity: "Melbourne (Victoria, Úc)",
      destAirport: "HAN",
      destCity: "Hà Nội (Sân bay Quốc tế Nội Bài)",
      scheduledDeparture: depTime1,
      actualDeparture: depTime1,
      scheduledArrival: arrTime1,
      actualArrival: arrTime1,
      flightDurationMinutes: 540,
      flightStatus: FlightStatus.STORED_COLD,
      flightProgressPercent: 100,
      currentLatitude: 21.2212,
      currentLongitude: 105.8072,
      currentAltitudeFeet: 0,
      coldChainCategory: ColdChainCategory.ULTRA_COLD_CHERRY,
      targetTempMin: 0.0,
      targetTempMax: 4.0,
      averageTemp: 2.15,
      isColdChainPassed: true,
      totalCargoWeightKg: 4500.0,
      cargoManifestSummary:
        "4.500 kg Cherry đỏ Tasmania Size 30-32mm hái sáng sớm & 1.200 lon Sữa Aptamil Profutura Úc",
    },
  });

  // Milestones for Flight 1
  await prisma.flightMilestone.deleteMany({ where: { flightId: flight1.id } });
  await prisma.flightMilestone.createMany({
    data: [
      {
        flightId: flight1.id,
        stepNumber: 1,
        title: "Đóng gói bọc xốp giữ nhiệt & nạp cảm biến nhiệt độ tại nông trại",
        locationName: "Huon Valley Farm (Tasmania / Melbourne Hub)",
        timestamp: new Date(depTime1.getTime() - 4 * 60 * 60 * 1000),
        isCompleted: true,
        notes: "Kiểm tra cảm biến USB Logger SENS-TAS-01 hoạt động tốt, pin 100%.",
      },
      {
        flightId: flight1.id,
        stepNumber: 2,
        title: "Cất cánh đường băng Sân bay Quốc tế Melbourne (MEL)",
        locationName: "Melbourne Airport (MEL), Australia",
        timestamp: depTime1,
        isCompleted: true,
        notes: "Khoang hàng kích hoạt chế độ làm lạnh chủ động 2.0°C.",
      },
      {
        flightId: flight1.id,
        stepNumber: 3,
        title: "Hạ cánh an toàn tại Sân bay Quốc tế Nội Bài (HAN)",
        locationName: "Sân bay Quốc tế Nội Bài, Hà Nội",
        timestamp: arrTime1,
        isCompleted: true,
        notes: "Tiếp đất lúc sáng sớm, xe nâng chuyển thẳng vào kho mát sân bay NCTS.",
      },
      {
        flightId: flight1.id,
        stepNumber: 4,
        title: "Thông quan Hải quan & Cấp chứng thư kiểm dịch thực vật",
        locationName: "Chi cục Hải quan Cửa khẩu Sân bay Nội Bài",
        timestamp: new Date(arrTime1.getTime() + 2 * 60 * 60 * 1000),
        isCompleted: true,
        notes: "Kết quả kiểm tra đạt 100% tiêu chuẩn nhập khẩu chính ngạch.",
      },
      {
        flightId: flight1.id,
        stepNumber: 5,
        title: "Nhập kho mát bảo quản tiêu chuẩn THUYNGA Shop",
        locationName: "Tổng kho THUYNGA Shop, Hà Nội",
        timestamp: new Date(arrTime1.getTime() + 3.5 * 60 * 60 * 1000),
        isCompleted: true,
        notes: "Lưu kho lạnh 0-4°C, cuống xanh tươi giòn nguyên phấn.",
      },
    ],
  });

  // Sensor Logs for Flight 1 (10 data points)
  await prisma.coldChainSensorLog.deleteMany({ where: { flightId: flight1.id } });
  const sensorLogs1 = [
    { hourOffset: -2, temp: 1.9, hum: 91, stage: "Kho lạnh xuất hàng Melbourne" },
    { hourOffset: 0, temp: 2.2, hum: 90, stage: "Cất cánh đường băng MEL" },
    { hourOffset: 2, temp: 2.1, hum: 89, stage: "Độ cao 35.000 ft không phận Úc" },
    { hourOffset: 4, temp: 2.0, hum: 88, stage: "Bay qua vùng biển Indonesia" },
    { hourOffset: 6, temp: 2.3, hum: 89, stage: "Không phận Biển Đông" },
    { hourOffset: 8, temp: 2.2, hum: 90, stage: "Bắt đầu hạ độ cao vào Hà Nội" },
    { hourOffset: 9, temp: 2.4, hum: 91, stage: "Hạ cánh đường băng Nội Bài (HAN)" },
    { hourOffset: 10, temp: 2.3, hum: 89, stage: "Khu vực kho mát Hải quan Nội Bài" },
    { hourOffset: 11, temp: 2.1, hum: 90, stage: "Xe tải lạnh trung chuyển chuyên dụng" },
    { hourOffset: 12, temp: 2.0, hum: 92, stage: "Kho lạnh trung tâm THUYNGA Shop" },
  ];

  await prisma.coldChainSensorLog.createMany({
    data: sensorLogs1.map((log) => ({
      flightId: flight1.id,
      sensorId: "SENS-LOGGER-TAS-01",
      recordedAt: new Date(depTime1.getTime() + log.hourOffset * 60 * 60 * 1000),
      temperatureCelsius: log.temp,
      humidityPercent: log.hum,
      batteryPercent: 96,
      alertLevel: SensorAlertLevel.NORMAL,
      stageName: log.stage,
    })),
  });

  // ── Flight 2: VN772 (Sydney -> Hà Nội) - Đang bay trên không (CRUISING) ──
  const depTime2 = new Date(now.getTime() - 6 * 60 * 60 * 1000); // Cất cánh 6h trước
  const arrTime2 = new Date(depTime2.getTime() + 9 * 60 * 60 * 1000); // Còn 3h nữa hạ cánh

  const flight2 = await prisma.airCargoFlight.upsert({
    where: { flightNumber: "VN772" },
    update: {
      aircraftType: "Airbus A350-900 XWB",
      carrier: AirlineCarrier.VIETNAM_AIRLINES_CARGO,
      originAirport: "SYD",
      originCity: "Sydney (New South Wales, Úc)",
      destAirport: "HAN",
      destCity: "Hà Nội (Sân bay Quốc tế Nội Bài)",
      scheduledDeparture: depTime2,
      actualDeparture: depTime2,
      scheduledArrival: arrTime2,
      actualArrival: null,
      flightDurationMinutes: 540,
      flightStatus: FlightStatus.CRUISING,
      flightProgressPercent: 68,
      currentLatitude: 3.139,
      currentLongitude: 108.82,
      currentAltitudeFeet: 39000,
      coldChainCategory: ColdChainCategory.ULTRA_COLD_CHERRY,
      targetTempMin: 0.0,
      targetTempMax: 4.0,
      averageTemp: 2.18,
      isColdChainPassed: true,
      totalCargoWeightKg: 3800.0,
      cargoManifestSummary:
        "3.800 kg Cherry vàng Rainier Úc Size 32mm & 800 hũ Mật ong Manuka Comvita UMF 10+",
    },
    create: {
      flightNumber: "VN772",
      aircraftType: "Airbus A350-900 XWB",
      carrier: AirlineCarrier.VIETNAM_AIRLINES_CARGO,
      originAirport: "SYD",
      originCity: "Sydney (New South Wales, Úc)",
      destAirport: "HAN",
      destCity: "Hà Nội (Sân bay Quốc tế Nội Bài)",
      scheduledDeparture: depTime2,
      actualDeparture: depTime2,
      scheduledArrival: arrTime2,
      actualArrival: null,
      flightDurationMinutes: 540,
      flightStatus: FlightStatus.CRUISING,
      flightProgressPercent: 68,
      currentLatitude: 3.139,
      currentLongitude: 108.82,
      currentAltitudeFeet: 39000,
      coldChainCategory: ColdChainCategory.ULTRA_COLD_CHERRY,
      targetTempMin: 0.0,
      targetTempMax: 4.0,
      averageTemp: 2.18,
      isColdChainPassed: true,
      totalCargoWeightKg: 3800.0,
      cargoManifestSummary:
        "3.800 kg Cherry vàng Rainier Úc Size 32mm & 800 hũ Mật ong Manuka Comvita UMF 10+",
    },
  });

  // Milestones for Flight 2
  await prisma.flightMilestone.deleteMany({ where: { flightId: flight2.id } });
  await prisma.flightMilestone.createMany({
    data: [
      {
        flightId: flight2.id,
        stepNumber: 1,
        title: "Bàn giao pallet hàng lạnh tại Sân bay Sydney Kingsford Smith",
        locationName: "Sydney Airport (SYD), Australia",
        timestamp: new Date(depTime2.getTime() - 2.5 * 60 * 60 * 1000),
        isCompleted: true,
        notes: "Nhiệt độ giao nhận 1.8°C, niêm phong chì hải quan Úc.",
      },
      {
        flightId: flight2.id,
        stepNumber: 2,
        title: "Cất cánh rời Sydney Kingsford Smith (SYD)",
        locationName: "Sydney Airport (SYD), Australia",
        timestamp: depTime2,
        isCompleted: true,
        notes: "Chuyến bay hành trình trực tiếp hướng về Hà Nội.",
      },
      {
        flightId: flight2.id,
        stepNumber: 3,
        title: "Đang bay tuần tra trên không phận quốc tế",
        locationName: "Độ cao 39.000 ft - Phía trên Biển Đông",
        timestamp: now,
        isCompleted: true,
        notes: "Tốc độ hành trình 880 km/h, chuỗi lạnh bảo quản 2.2°C ổn định.",
      },
      {
        flightId: flight2.id,
        stepNumber: 4,
        title: "Dự kiến hạ cánh Sân bay Quốc tế Nội Bài",
        locationName: "Sân bay Quốc tế Nội Bài (HAN)",
        timestamp: arrTime2,
        isCompleted: false,
        notes: "Dự kiến đúng giờ 100%, không bị delay thời tiết.",
      },
      {
        flightId: flight2.id,
        stepNumber: 5,
        title: "Thông quan & Bàn giao kho lạnh THUYNGA Shop",
        locationName: "Tổng kho THUYNGA Shop, Hà Nội",
        timestamp: new Date(arrTime2.getTime() + 3 * 60 * 60 * 1000),
        isCompleted: false,
        notes: "Đội ngũ xe lạnh sẵn sàng đón hàng tại cửa khẩu.",
      },
    ],
  });

  // Sensor Logs for Flight 2
  await prisma.coldChainSensorLog.deleteMany({ where: { flightId: flight2.id } });
  const sensorLogs2 = [
    { hourOffset: -1.5, temp: 1.8, hum: 92, stage: "Kho lạnh sân bay Sydney" },
    { hourOffset: 0, temp: 2.1, hum: 91, stage: "Cất cánh đường băng SYD" },
    { hourOffset: 2, temp: 2.3, hum: 89, stage: "Độ cao 37.000 ft bang Queensland" },
    { hourOffset: 4, temp: 2.2, hum: 90, stage: "Không phận biển Indonesia" },
    { hourOffset: 6, temp: 2.2, hum: 89, stage: "Không phận Biển Đông (Hiện tại)" },
  ];

  await prisma.coldChainSensorLog.createMany({
    data: sensorLogs2.map((log) => ({
      flightId: flight2.id,
      sensorId: "SENS-LOGGER-SYD-02",
      recordedAt: new Date(depTime2.getTime() + log.hourOffset * 60 * 60 * 1000),
      temperatureCelsius: log.temp,
      humidityPercent: log.hum,
      batteryPercent: 98,
      alertLevel: SensorAlertLevel.NORMAL,
      stageName: log.stage,
    })),
  });

  // ── Flight 3: QF7561 (Melbourne -> TP.HCM) - Đang thông quan hải quan ──
  const depTime3 = new Date(now.getTime() - 10 * 60 * 60 * 1000);
  const arrTime3 = new Date(depTime3.getTime() + 8.5 * 60 * 60 * 1000);

  const flight3 = await prisma.airCargoFlight.upsert({
    where: { flightNumber: "QF7561" },
    update: {
      aircraftType: "Boeing 747-8F Freighter",
      carrier: AirlineCarrier.QANTAS_FREIGHT,
      originAirport: "MEL",
      originCity: "Melbourne, Australia",
      destAirport: "SGN",
      destCity: "TP. Hồ Chí Minh (Tân Sơn Nhất)",
      scheduledDeparture: depTime3,
      actualDeparture: depTime3,
      scheduledArrival: arrTime3,
      actualArrival: arrTime3,
      flightDurationMinutes: 510,
      flightStatus: FlightStatus.CUSTOMS_CLEARING,
      flightProgressPercent: 92,
      currentLatitude: 10.8188,
      currentLongitude: 106.652,
      currentAltitudeFeet: 0,
      coldChainCategory: ColdChainCategory.CONTROLLED_AMBIENT,
      targetTempMin: 18.0,
      targetTempMax: 24.0,
      averageTemp: 20.8,
      isColdChainPassed: true,
      totalCargoWeightKg: 6200.0,
      cargoManifestSummary:
        "5.000 hộp Sữa Aptamil Profutura Úc, A2 Platinum & 2.000 lọ Dầu cá Blackmores Chemist Warehouse",
    },
    create: {
      flightNumber: "QF7561",
      aircraftType: "Boeing 747-8F Freighter",
      carrier: AirlineCarrier.QANTAS_FREIGHT,
      originAirport: "MEL",
      originCity: "Melbourne, Australia",
      destAirport: "SGN",
      destCity: "TP. Hồ Chí Minh (Tân Sơn Nhất)",
      scheduledDeparture: depTime3,
      actualDeparture: depTime3,
      scheduledArrival: arrTime3,
      actualArrival: arrTime3,
      flightDurationMinutes: 510,
      flightStatus: FlightStatus.CUSTOMS_CLEARING,
      flightProgressPercent: 92,
      currentLatitude: 10.8188,
      currentLongitude: 106.652,
      currentAltitudeFeet: 0,
      coldChainCategory: ColdChainCategory.CONTROLLED_AMBIENT,
      targetTempMin: 18.0,
      targetTempMax: 24.0,
      averageTemp: 20.8,
      isColdChainPassed: true,
      totalCargoWeightKg: 6200.0,
      cargoManifestSummary:
        "5.000 hộp Sữa Aptamil Profutura Úc, A2 Platinum & 2.000 lọ Dầu cá Blackmores Chemist Warehouse",
    },
  });

  // Milestones for Flight 3
  await prisma.flightMilestone.deleteMany({ where: { flightId: flight3.id } });
  await prisma.flightMilestone.createMany({
    data: [
      {
        flightId: flight3.id,
        stepNumber: 1,
        title: "Bốc dỡ lô sữa Aptamil & TPCN tại tổng kho Melbourne",
        locationName: "Qantas Freight Terminal Melbourne (MEL)",
        timestamp: depTime3,
        isCompleted: true,
      },
      {
        flightId: flight3.id,
        stepNumber: 2,
        title: "Cất cánh bay thẳng Melbourne - TP. Hồ Chí Minh",
        locationName: "Sân bay Quốc tế Melbourne (MEL)",
        timestamp: depTime3,
        isCompleted: true,
      },
      {
        flightId: flight3.id,
        stepNumber: 3,
        title: "Hạ cánh tại Sân bay Quốc tế Tân Sơn Nhất (SGN)",
        locationName: "Sân bay Quốc tế Tân Sơn Nhất (SGN)",
        timestamp: arrTime3,
        isCompleted: true,
      },
      {
        flightId: flight3.id,
        stepNumber: 4,
        title: "Kiểm nghiệm hải quan & thông quan lô hàng",
        locationName: "Chi cục Hải quan Tân Sơn Nhất (TCS)",
        timestamp: now,
        isCompleted: true,
      },
      {
        flightId: flight3.id,
        stepNumber: 5,
        title: "Nhập kho phân phối miền Nam THUYNGA Shop",
        locationName: "Kho hàng THUYNGA Shop Quận 1, TP.HCM",
        timestamp: new Date(now.getTime() + 2 * 60 * 60 * 1000),
        isCompleted: false,
      },
    ],
  });

  // Sensor Logs for Flight 3
  await prisma.coldChainSensorLog.deleteMany({ where: { flightId: flight3.id } });
  const sensorLogs3 = [
    { hourOffset: 0, temp: 20.5, hum: 62, stage: "Cất cánh Melbourne" },
    { hourOffset: 3, temp: 21.0, hum: 64, stage: "Khoang hàng bay QF7561" },
    { hourOffset: 6, temp: 20.8, hum: 65, stage: "Không phận quốc tế" },
    { hourOffset: 8.5, temp: 21.2, hum: 66, stage: "Hạ cánh Tân Sơn Nhất (SGN)" },
    { hourOffset: 9.5, temp: 20.9, hum: 63, stage: "Khu vực kho TCS Tân Sơn Nhất" },
  ];

  await prisma.coldChainSensorLog.createMany({
    data: sensorLogs3.map((log) => ({
      flightId: flight3.id,
      sensorId: "SENS-LOGGER-QF-03",
      recordedAt: new Date(depTime3.getTime() + log.hourOffset * 60 * 60 * 1000),
      temperatureCelsius: log.temp,
      humidityPercent: log.hum,
      batteryPercent: 95,
      alertLevel: SensorAlertLevel.NORMAL,
      stageName: log.stage,
    })),
  });

  console.log("✅ Đã nạp thành công 3 chuyến bay Air Cargo, mốc hành trình và 21 bản ghi cảm biến chuỗi lạnh!");
}

main()
  .catch((e) => {
    console.error("❌ Lỗi khi seed chuyến bay Air Cargo:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
