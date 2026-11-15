import {
  PrismaClient,
  FormulaStage,
  ChildGender,
  GrowthAssessmentStatus,
} from "@prisma/client";

const prisma = new PrismaClient();

// ============================================================
// prisma/seed-pediatric-growth.ts
// Khởi Tạo Dữ Liệu Bách Phân Vị WHO & Quy Trình Pha Sữa Aptamil Úc (Phase 23)
// ============================================================

async function main() {
  console.log("🌱 Bắt đầu seed dữ liệu Chuẩn Tăng Trưởng WHO & Pha Sữa Aptamil Úc...");

  // 1. Protocols pha sữa Aptamil Profutura Úc (4 Giai Đoạn Chuẩn Hóa)
  // Tìm các sản phẩm Aptamil trong DB nếu có để liên kết
  const aptamilProducts = await prisma.product.findMany({
    where: {
      name: { contains: "Aptamil", mode: "insensitive" },
    },
    select: { id: true, name: true, slug: true },
  });

  const getAptamilProductId = (stageStr: string) => {
    const found = aptamilProducts.find((p) => p.name.includes(stageStr));
    return found ? found.id : null;
  };

  const protocols = [
    {
      stage: FormulaStage.STAGE_1,
      productTitle: "Sữa Bột Aptamil Profutura Úc Số 1 (0 - 6 Tháng)",
      ageRangeMonths: "0 - 6 tháng",
      waterTemperatureMinC: 40,
      waterTemperatureMaxC: 45,
      waterMlPerScoop: 50.0,
      scoopWeightGrams: 7.3,
      standardFeedsPerDay: 5,
      waterVolumeMlPerFeed: 150, // 150ml nước
      scoopsPerFeed: 3,          // 3 muỗng gạt
      mixingSteps: [
        "Rửa sạch tay bằng xà phòng sát khuẩn và tiệt trùng bình sữa, núm ti bằng máy hơi nước hoặc nước sôi trong 5 phút.",
        "Đun sôi nước sạch tinh khiết và để nguội tự nhiên về 40°C - 45°C (nhiệt độ vàng để hòa tan bột mà không phá vỡ liên kết men vi sinh).",
        "Rót chính xác lượng nước ấm cần pha vào bình (ví dụ: 150ml cho cữ 3 muỗng).",
        "Dùng muỗng đi kèm gạt ngang miệng hộp, không nén chặt bột. Cho 3 muỗng gạt vào bình nước.",
        "Đậy nắp bình và lắc đều theo hình xoắn ốc hoặc lăn tròn bình trong lòng bàn tay khoảng 15-20 giây để bột tan hoàn toàn, hạn chế tối đa bọt khí.",
        "Nhỏ vài giọt sữa lên mặt trong cổ tay kiểm tra độ ấm vừa phải trước khi cho bé bú.",
      ],
      probioticWarning:
        "CỰC KỲ QUAN TRỌNG: Aptamil Profutura Úc chứa hàng triệu lợi khuẩn sống Bifidobacterium breve M-16V và hệ men cộng sinh Synbiotic. Tuyệt đối KHÔNG pha bằng nước sôi trên 45°C vì nhiệt độ cao sẽ làm chết toàn bộ men vi sinh và làm suy giảm DHA tinh khiết.",
      storageGuidelines:
        "Đậy kín nắp nhựa sau mỗi lần sử dụng. Bảo quản nơi khô ráo, thoáng mát (dưới 25°C), tránh ánh nắng trực tiếp. Sử dụng hết trong vòng 4 tuần kể từ ngày mở nắp thiếc.",
      productId: getAptamilProductId("Số 1"),
    },
    {
      stage: FormulaStage.STAGE_2,
      productTitle: "Sữa Bột Aptamil Profutura Úc Số 2 (6 - 12 Tháng)",
      ageRangeMonths: "6 - 12 tháng",
      waterTemperatureMinC: 40,
      waterTemperatureMaxC: 45,
      waterMlPerScoop: 50.0,
      scoopWeightGrams: 7.5,
      standardFeedsPerDay: 4,
      waterVolumeMlPerFeed: 200, // 200ml nước
      scoopsPerFeed: 4,          // 4 muỗng gạt
      mixingSteps: [
        "Vệ sinh tay và dụng cụ bình sữa sạch sẽ, tiệt trùng trước khi pha.",
        "Chuẩn bị nước đun sôi để nguội về ngưỡng nhiệt độ lý tưởng 40°C - 45°C.",
        "Đo chính xác 200ml nước ấm vào bình sữa chuyên dụng.",
        "Sử dụng muỗng tiêu chuẩn kèm hộp, gạt phẳng mặt muỗng và thả 4 muỗng vào bình.",
        "Lắc đều tay theo chiều xoáy tròn nhẹ nhàng đến khi sữa tan sánh mịn hoàn toàn.",
        "Kiểm tra nhiệt độ sữa trên mu bàn tay trước khi cho bé ăn.",
      ],
      probioticWarning:
        "Giai đoạn 6 - 12 tháng là lúc hệ miễn dịch của bé chuyển giao kháng thể từ mẹ. Pha sữa đúng nhiệt độ 40-45°C giúp bảo tồn trọn vẹn phức hợp kẽm sinh học và men Probiotics củng cố hàng rào tiêu hóa dồi dào.",
      storageGuidelines:
        "Bảo quản hộp sữa nơi khô ráo mát mẻ dưới 25°C. Đậy chặt nắp sau khi múc sữa. Dùng hết trong 4 tuần sau khi bóc seal nhôm.",
      productId: getAptamilProductId("Số 2"),
    },
    {
      stage: FormulaStage.STAGE_3,
      productTitle: "Sữa Bột Aptamil Profutura Úc Số 3 Toddler (1 - 3 Tuổi)",
      ageRangeMonths: "1 - 3 tuổi",
      waterTemperatureMinC: 40,
      waterTemperatureMaxC: 45,
      waterMlPerScoop: 50.0,
      scoopWeightGrams: 8.5,
      standardFeedsPerDay: 2,
      waterVolumeMlPerFeed: 200, // 200ml nước
      scoopsPerFeed: 4,          // 4 muỗng gạt
      mixingSteps: [
        "Rửa tay và cốc/bình uống sữa của bé sạch sẽ.",
        "Đun sôi nước và để nguội xuống khoảng 40°C - 45°C.",
        "Rót 200ml nước ấm vào ly hoặc bình tập hút.",
        "Cho 4 muỗng gạt ngang Aptamil Số 3 vào cốc nước ấm.",
        "Dùng thìa khuấy đều hoặc lắc bình nhẹ nhàng cho tan hết.",
        "Cho bé thưởng thức ngay khi sữa còn ấm dễ chịu.",
      ],
      probioticWarning:
        "Sữa Aptamil Số 3 giàu DHA, canxi và hỗn hợp prebiotic scGOS/lcFOS (9:1). Nước quá nóng trên 45°C sẽ làm kết tủa protein whey và vô hiệu hóa các phân tử oligosaccharide tự nhiên.",
      storageGuidelines:
        "Đậy kín sau mỗi lần sử dụng. Bảo quản nhiệt độ phòng mát mẻ, tránh để trong tủ lạnh vì độ ẩm cao làm vón cục bột sữa.",
      productId: getAptamilProductId("Số 3"),
    },
    {
      stage: FormulaStage.STAGE_4,
      productTitle: "Sữa Bột Aptamil Profutura Úc Số 4 Junior (3 Tuổi Trở Lên)",
      ageRangeMonths: "3 tuổi trở lên",
      waterTemperatureMinC: 40,
      waterTemperatureMaxC: 45,
      waterMlPerScoop: 50.0,
      scoopWeightGrams: 8.5,
      standardFeedsPerDay: 2,
      waterVolumeMlPerFeed: 200, // 200ml nước
      scoopsPerFeed: 4,          // 4 muỗng gạt
      mixingSteps: [
        "Chuẩn bị cốc sạch cho trẻ.",
        "Rót 200ml nước uống ấm ở 40°C - 45°C vào cốc.",
        "Múc 4 muỗng gạt Aptamil Số 4 cho vào cốc nước ấm.",
        "Dùng thìa khuấy tan đều trong 10-15 giây.",
        "Uống ngay sau khi pha hoặc có thể dùng chung với ngũ cốc ăn sáng.",
      ],
      probioticWarning:
        "Duy trì nhiệt độ pha từ 40°C - 45°C để bảo vệ cấu trúc vi chất kẽm hữu cơ, i-ốt và vitamin B nhóm tan hỗ trợ năng lượng vận động cho trẻ mầm non.",
      storageGuidelines:
        "Giữ hộp ở nơi khô ráo thoáng khí, nhiệt độ không quá 25°C. Đóng chặt nắp sau khi lấy bột và dùng hết trong vòng 4 tuần.",
      productId: getAptamilProductId("Số 4"),
    },
  ];

  for (const p of protocols) {
    await prisma.aptamilPreparationProtocol.upsert({
      where: { stage: p.stage },
      update: p,
      create: p,
    });
  }
  console.log(`✅ Đã nạp thành công 4 quy trình pha sữa Aptamil Profutura Úc.`);

  // 2. WHO Child Growth Standards (0 - 60 tháng)
  // Các mốc dữ liệu gốc chuẩn y khoa WHO
  const rawWhoBoys: Array<[number, number, number, number, number, number, number]> = [
    // [ageMonths, wMedian, wMinus2SD, wPlus2SD, hMedian, hMinus2SD, hPlus2SD]
    [0, 3.3, 2.5, 4.4, 49.9, 46.1, 53.7],
    [1, 4.5, 3.4, 5.8, 54.7, 50.8, 58.6],
    [2, 5.6, 4.3, 7.1, 58.4, 54.4, 62.4],
    [3, 6.4, 5.0, 8.0, 61.4, 57.3, 65.5],
    [4, 7.0, 5.6, 8.7, 63.9, 59.7, 68.0],
    [5, 7.5, 6.0, 9.3, 65.9, 61.7, 70.1],
    [6, 7.9, 6.4, 9.8, 67.6, 63.3, 71.9],
    [7, 8.3, 6.7, 10.3, 69.2, 64.8, 73.5],
    [8, 8.6, 6.9, 10.7, 70.6, 66.2, 75.0],
    [9, 8.9, 7.1, 11.0, 72.0, 67.5, 76.5],
    [10, 9.2, 7.4, 11.4, 73.3, 68.7, 77.9],
    [11, 9.4, 7.6, 11.7, 74.5, 69.9, 79.2],
    [12, 9.6, 7.7, 12.0, 75.7, 71.0, 80.5],
    [15, 10.3, 8.3, 12.8, 79.1, 74.1, 84.2],
    [18, 10.9, 8.8, 13.7, 82.3, 76.9, 87.7],
    [21, 11.5, 9.2, 14.5, 85.1, 79.4, 90.9],
    [24, 12.2, 9.7, 15.3, 87.8, 81.7, 93.9],
    [30, 13.3, 10.5, 16.9, 92.4, 85.5, 99.1],
    [36, 14.3, 11.3, 18.3, 96.1, 88.7, 103.5],
    [42, 15.3, 12.0, 19.7, 99.9, 91.9, 107.8],
    [48, 16.3, 12.7, 21.2, 103.3, 94.9, 111.7],
    [54, 17.3, 13.4, 22.7, 106.7, 97.8, 115.5],
    [60, 18.3, 14.1, 24.2, 110.0, 100.7, 119.2],
  ];

  const rawWhoGirls: Array<[number, number, number, number, number, number, number]> = [
    [0, 3.2, 2.4, 4.2, 49.1, 45.4, 52.9],
    [1, 4.2, 3.2, 5.5, 53.7, 49.8, 57.6],
    [2, 5.1, 3.9, 6.6, 57.1, 53.0, 61.1],
    [3, 5.8, 4.5, 7.5, 59.8, 55.6, 64.0],
    [4, 6.4, 5.0, 8.2, 62.1, 57.8, 66.4],
    [5, 6.9, 5.4, 8.8, 64.0, 59.6, 68.5],
    [6, 7.3, 5.7, 9.3, 65.7, 61.2, 70.3],
    [7, 7.6, 6.0, 9.8, 67.3, 62.7, 71.9],
    [8, 7.9, 6.3, 10.2, 68.7, 64.0, 73.5],
    [9, 8.2, 6.5, 10.5, 70.1, 65.3, 75.0],
    [10, 8.5, 6.7, 10.9, 71.5, 66.5, 76.4],
    [11, 8.7, 6.9, 11.2, 72.8, 67.7, 77.8],
    [12, 8.9, 7.0, 11.5, 74.0, 68.9, 79.2],
    [15, 9.6, 7.6, 12.4, 77.5, 72.0, 83.0],
    [18, 10.2, 8.1, 13.2, 80.7, 74.9, 86.5],
    [21, 10.9, 8.6, 14.0, 83.7, 77.5, 89.8],
    [24, 11.5, 9.0, 14.8, 86.4, 80.0, 92.9],
    [30, 12.7, 9.8, 16.5, 91.2, 84.1, 98.3],
    [36, 13.9, 10.8, 18.1, 95.1, 87.4, 102.7],
    [42, 15.0, 11.5, 19.8, 99.0, 90.9, 107.2],
    [48, 16.1, 12.3, 21.5, 102.7, 94.1, 111.3],
    [54, 17.2, 13.0, 23.2, 106.2, 97.0, 115.2],
    [60, 18.2, 13.7, 24.9, 109.4, 99.9, 118.9],
  ];

  // Helper nội suy tuyến tính giữa các mốc tháng
  function interpolateTable(
    table: Array<[number, number, number, number, number, number, number]>
  ) {
    const fullList: Array<{
      ageMonths: number;
      weightMedianKg: number;
      weightMinus2SD: number;
      weightPlus2SD: number;
      heightMedianCm: number;
      heightMinus2SD: number;
      heightPlus2SD: number;
    }> = [];

    for (let m = 0; m <= 60; m++) {
      // Tìm 2 mốc xung quanh
      let lower = table[0];
      let upper = table[table.length - 1];

      for (let i = 0; i < table.length - 1; i++) {
        if (m >= table[i][0] && m <= table[i + 1][0]) {
          lower = table[i];
          upper = table[i + 1];
          break;
        }
      }

      const [m0, w0, wm2_0, wp2_0, h0, hm2_0, hp2_0] = lower;
      const [m1, w1, wm2_1, wp2_1, h1, hm2_1, hp2_1] = upper;

      const factor = m1 === m0 ? 0 : (m - m0) / (m1 - m0);

      fullList.push({
        ageMonths: m,
        weightMedianKg: Number((w0 + factor * (w1 - w0)).toFixed(2)),
        weightMinus2SD: Number((wm2_0 + factor * (wm2_1 - wm2_0)).toFixed(2)),
        weightPlus2SD: Number((wp2_0 + factor * (wp2_1 - wp2_0)).toFixed(2)),
        heightMedianCm: Number((h0 + factor * (h1 - h0)).toFixed(2)),
        heightMinus2SD: Number((hm2_0 + factor * (hm2_1 - hm2_0)).toFixed(2)),
        heightPlus2SD: Number((hp2_0 + factor * (hp2_1 - hp2_0)).toFixed(2)),
      });
    }

    return fullList;
  }

  const boyData = interpolateTable(rawWhoBoys);
  const girlData = interpolateTable(rawWhoGirls);

  for (const b of boyData) {
    await prisma.whoGrowthStandard.upsert({
      where: {
        gender_ageMonths: {
          gender: ChildGender.BOY,
          ageMonths: b.ageMonths,
        },
      },
      update: {
        weightMedianKg: b.weightMedianKg,
        weightMinus2SD: b.weightMinus2SD,
        weightPlus2SD: b.weightPlus2SD,
        heightMedianCm: b.heightMedianCm,
        heightMinus2SD: b.heightMinus2SD,
        heightPlus2SD: b.heightPlus2SD,
      },
      create: {
        gender: ChildGender.BOY,
        ...b,
      },
    });
  }

  for (const g of girlData) {
    await prisma.whoGrowthStandard.upsert({
      where: {
        gender_ageMonths: {
          gender: ChildGender.GIRL,
          ageMonths: g.ageMonths,
        },
      },
      update: {
        weightMedianKg: g.weightMedianKg,
        weightMinus2SD: g.weightMinus2SD,
        weightPlus2SD: g.weightPlus2SD,
        heightMedianCm: g.heightMedianCm,
        heightMinus2SD: g.heightMinus2SD,
        heightPlus2SD: g.heightPlus2SD,
      },
      create: {
        gender: ChildGender.GIRL,
        ...g,
      },
    });
  }
  console.log(`✅ Đã nạp thành công 122 bản ghi Chuẩn Tăng Trưởng WHO (0 - 60 tháng) cho cả Bé trai & Bé gái.`);

  // 3. Seed bản ghi đánh giá tăng trưởng mẫu cho Bé Bon
  const bonProfile = await prisma.familyMemberProfile.findFirst({
    where: { fullName: { contains: "Bon" } },
  });

  const targetUserId = bonProfile?.userId;

  if (targetUserId) {
    await prisma.childGrowthAssessmentRecord.create({
      data: {
        childName: "Bé Bon",
        gender: ChildGender.BOY,
        birthDate: new Date("2023-11-15"), // Tròn 36 tháng
        assessmentDate: new Date(),
        ageMonths: 36,
        weightKg: 14.5,
        heightCm: 96.5,
        weightZScore: 0.14,
        heightZScore: 0.11,
        weightStatus: GrowthAssessmentStatus.NORMAL,
        heightStatus: GrowthAssessmentStatus.NORMAL,
        recommendedNutrients: [
          "Aptamil Profutura Úc Số 3 (400-500ml/ngày)",
          "Bio Island Lysine Tăng Chiều Cao",
          "Bio Island DHA Não Bộ & Thị Giác",
        ],
        pharmacistAdvice:
          "Thể trạng của bé Bon phát triển rất cân đối, cả chiều cao và cân nặng đều nằm ở dải bách phân vị lý tưởng P50 theo chuẩn WHO. Dược sĩ khuyến nghị duy trì 2 cữ sữa Aptamil Số 3 pha đúng 40°C - 45°C mỗi ngày kết hợp vận động ngoài trời vào buổi sáng.",
        memberProfileId: bonProfile?.id,
        userId: targetUserId,
      },
    });
    console.log(`✅ Đã tạo hồ sơ đánh giá thể trạng mẫu cho Bé Bon.`);
  }

  console.log("✨ Hoàn tất seed dữ liệu Phase 23!");
}

main()
  .catch((e) => {
    console.error("❌ Lỗi khi seed dữ liệu Phase 23:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
