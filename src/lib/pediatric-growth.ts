import { prisma } from "@/lib/prisma";
import {
  FormulaStage,
  ChildGender,
  GrowthAssessmentStatus,
} from "@prisma/client";

// ============================================================
// lib/pediatric-growth.ts
// Lõi Nghiệp Vụ Tăng Trưởng Trẻ Em WHO & Chuẩn Hóa Pha Sữa Aptamil Úc (Phase 23)
// ============================================================

export interface WhoAssessmentResult {
  childName: string;
  gender: ChildGender;
  ageMonths: number;
  weightKg: number;
  heightCm: number;
  weightZScore: number;
  heightZScore: number;
  weightStatus: GrowthAssessmentStatus;
  heightStatus: GrowthAssessmentStatus;
  weightPercentileApprox: string;
  heightPercentileApprox: string;
  whoStandardBaseline: {
    weightMedianKg: number;
    weightMinus2SD: number;
    weightPlus2SD: number;
    heightMedianCm: number;
    heightMinus2SD: number;
    heightPlus2SD: number;
  };
  recommendedNutrients: string[];
  pharmacistAdvice: string;
  suggestedAptamilStage: FormulaStage;
}

export interface FormulaMixResult {
  stage: FormulaStage;
  productTitle: string;
  ageRangeMonths: string;
  waterTemperatureMinC: number;
  waterTemperatureMaxC: number;
  waterVolumeMl: number;
  scoopsCount: number;
  powderWeightGrams: number;
  estimatedCaloriesKcal: number;
  dailyFeedsRecommended: number;
  mixingSteps: string[];
  probioticWarning: string;
  storageGuidelines: string;
  product?: {
    id: string;
    name: string;
    slug: string;
    variants: Array<{
      id: string;
      price: number | any;
      image?: string | null;
      stock: number;
    }>;
  } | null;
}

/**
 * Tính Z-Score theo chuẩn phân phối bách phân vị WHO
 */
export function calculateZScore(
  actualValue: number,
  median: number,
  minus2SD: number,
  plus2SD: number
): number {
  if (actualValue >= median) {
    const sd = (plus2SD - median) / 2;
    return sd > 0 ? Number(((actualValue - median) / sd).toFixed(2)) : 0;
  } else {
    const sd = (median - minus2SD) / 2;
    return sd > 0 ? Number(((actualValue - median) / sd).toFixed(2)) : 0;
  }
}

/**
 * Ước lượng bách phân vị (Percentile) từ Z-Score
 */
export function estimatePercentile(zScore: number): string {
  if (zScore <= -3) return "< P0.1 (Rất thấp)";
  if (zScore <= -2) return "P3 (Dưới chuẩn)";
  if (zScore <= -1) return "P15";
  if (zScore < 1) return "P50 (Chuẩn trung vị WHO)";
  if (zScore < 2) return "P85";
  if (zScore < 3) return "P97 (Vượt chuẩn)";
  return "> P99.9 (Rất cao)";
}

/**
 * Đánh giá thể trạng trẻ em so với cơ sở dữ liệu WHO
 */
export async function assessChildGrowth(params: {
  childName: string;
  gender: ChildGender;
  birthDate: Date | string;
  weightKg: number;
  heightCm: number;
  memberProfileId?: string | null;
  userId?: string | null;
}): Promise<WhoAssessmentResult> {
  const birthDateObj =
    typeof params.birthDate === "string"
      ? new Date(params.birthDate)
      : params.birthDate;

  // Tính tuổi chính xác theo tháng (làm tròn từ 0 đến 60)
  const diffMs = Date.now() - birthDateObj.getTime();
  const rawMonths = diffMs / (1000 * 60 * 60 * 24 * 30.4375);
  const ageMonths = Math.min(60, Math.max(0, Math.round(rawMonths)));

  // Truy vấn chuẩn WHO theo giới tính và số tháng
  const baseline = await prisma.whoGrowthStandard.findUnique({
    where: {
      gender_ageMonths: {
        gender: params.gender,
        ageMonths,
      },
    },
  });

  // Nếu không tìm thấy thì dùng mốc gần nhất
  const effectiveBaseline =
    baseline ||
    (await prisma.whoGrowthStandard.findFirst({
      where: { gender: params.gender },
      orderBy: { ageMonths: "desc" },
    })) || {
      weightMedianKg: 10.0,
      weightMinus2SD: 8.0,
      weightPlus2SD: 12.5,
      heightMedianCm: 80.0,
      heightMinus2SD: 75.0,
      heightPlus2SD: 85.0,
    };

  const weightZScore = calculateZScore(
    params.weightKg,
    effectiveBaseline.weightMedianKg,
    effectiveBaseline.weightMinus2SD,
    effectiveBaseline.weightPlus2SD
  );

  const heightZScore = calculateZScore(
    params.heightCm,
    effectiveBaseline.heightMedianCm,
    effectiveBaseline.heightMinus2SD,
    effectiveBaseline.heightPlus2SD
  );

  // Phân loại thể trạng cân nặng
  let weightStatus: GrowthAssessmentStatus = GrowthAssessmentStatus.NORMAL;
  if (weightZScore < -3) {
    weightStatus = GrowthAssessmentStatus.SEVERELY_UNDERWEIGHT;
  } else if (weightZScore < -2) {
    weightStatus = GrowthAssessmentStatus.UNDERWEIGHT;
  } else if (weightZScore > 2) {
    weightStatus = GrowthAssessmentStatus.OVERWEIGHT;
  }

  // Phân loại thể trạng chiều cao
  let heightStatus: GrowthAssessmentStatus = GrowthAssessmentStatus.NORMAL;
  if (heightZScore < -2) {
    heightStatus = GrowthAssessmentStatus.STUNTED;
  } else if (heightZScore > 2) {
    heightStatus = GrowthAssessmentStatus.TALL;
  }

  // Chọn giai đoạn sữa Aptamil tương ứng tuổi
  let suggestedAptamilStage: FormulaStage = FormulaStage.STAGE_1;
  if (ageMonths >= 36) {
    suggestedAptamilStage = FormulaStage.STAGE_4;
  } else if (ageMonths >= 12) {
    suggestedAptamilStage = FormulaStage.STAGE_3;
  } else if (ageMonths >= 6) {
    suggestedAptamilStage = FormulaStage.STAGE_2;
  }

  // Đề xuất vi chất & lời khuyên Dược sĩ chuyên sâu
  const recommendedNutrients: string[] = [];
  const stageNameMap = {
    STAGE_1: "Aptamil Profutura Úc Số 1",
    STAGE_2: "Aptamil Profutura Úc Số 2",
    STAGE_3: "Aptamil Profutura Úc Số 3",
    STAGE_4: "Aptamil Profutura Úc Số 4",
  };
  recommendedNutrients.push(stageNameMap[suggestedAptamilStage]);

  let pharmacistAdvice = "";

  if (
    weightStatus === GrowthAssessmentStatus.UNDERWEIGHT ||
    weightStatus === GrowthAssessmentStatus.SEVERELY_UNDERWEIGHT
  ) {
    recommendedNutrients.push("Bio Island Lysine Tăng Cân & Chiều Cao");
    recommendedNutrients.push("Men vi sinh Úc Life-Space Probiotic");
    pharmacistAdvice = `Bé ${params.childName} có chỉ số cân nặng nằm dưới ngưỡng P3 chuẩn WHO (${params.weightKg}kg so với mức chuẩn ${effectiveBaseline.weightMedianKg}kg). Dược sĩ THUYNGA Shop khuyến nghị duy trì đủ lượng sữa Aptamil Profutura giàu chất béo màng cầu sữa MFGM, kết hợp men vi sinh để tối ưu hóa khả năng hấp thu nhung mao ruột non.`;
  } else if (heightStatus === GrowthAssessmentStatus.STUNTED) {
    recommendedNutrients.push("Bio Island Canxi Sữa Milk Calcium");
    recommendedNutrients.push("Ostelin Vitamin D3 K2 Giọt Úc");
    pharmacistAdvice = `Chỉ số chiều cao của bé ${params.childName} (${params.heightCm}cm) đang thấp hơn ngưỡng chuẩn ${effectiveBaseline.heightMedianCm}cm. Cần ưu tiên bổ sung Vitamin D3 K2 vào cữ sáng sau ăn để gắn canxi trực tiếp vào khuôn xương, kết hợp ngủ trước 21h30 để tuyến yên tiết hormone tăng trưởng GH đạt đỉnh.`;
  } else if (weightStatus === GrowthAssessmentStatus.OVERWEIGHT) {
    pharmacistAdvice = `Bé ${params.childName} có cân nặng vượt ngưỡng P97 chuẩn WHO. Nên duy trì dinh dưỡng cân bằng, giảm nước ngọt/đồ ngọt, giữ lượng sữa Aptamil ở mức 400ml/ngày và khuyến khích bé vận động thể chất ngoài trời mỗi ngày.`;
  } else {
    recommendedNutrients.push("Bio Island DHA Tinh Khiết Cho Bé");
    recommendedNutrients.push("Bio Island Kẽm Zinc Hỗ Trợ Đề Kháng");
    pharmacistAdvice = `Tuyệt vời! Bé ${params.childName} phát triển rất cân đối, cả chiều cao và cân nặng đều nằm ở dải bách phân vị lý tưởng P50 theo chuẩn WHO. Mẹ hãy tiếp tục duy trì chế độ dinh dưỡng lành mạnh và pha sữa đúng nhiệt độ 40-45°C để bảo toàn men sống.`;
  }

  // Lưu lịch sử đánh giá vào Database
  await prisma.childGrowthAssessmentRecord.create({
    data: {
      childName: params.childName,
      gender: params.gender,
      birthDate: birthDateObj,
      assessmentDate: new Date(),
      ageMonths,
      weightKg: params.weightKg,
      heightCm: params.heightCm,
      weightZScore,
      heightZScore,
      weightStatus,
      heightStatus,
      recommendedNutrients,
      pharmacistAdvice,
      memberProfileId: params.memberProfileId || null,
      userId: params.userId || null,
    },
  });

  return {
    childName: params.childName,
    gender: params.gender,
    ageMonths,
    weightKg: params.weightKg,
    heightCm: params.heightCm,
    weightZScore,
    heightZScore,
    weightStatus,
    heightStatus,
    weightPercentileApprox: estimatePercentile(weightZScore),
    heightPercentileApprox: estimatePercentile(heightZScore),
    whoStandardBaseline: {
      weightMedianKg: effectiveBaseline.weightMedianKg,
      weightMinus2SD: effectiveBaseline.weightMinus2SD,
      weightPlus2SD: effectiveBaseline.weightPlus2SD,
      heightMedianCm: effectiveBaseline.heightMedianCm,
      heightMinus2SD: effectiveBaseline.heightMinus2SD,
      heightPlus2SD: effectiveBaseline.heightPlus2SD,
    },
    recommendedNutrients,
    pharmacistAdvice,
    suggestedAptamilStage,
  };
}

/**
 * Tính toán tỷ lệ và lượng pha sữa Aptamil Úc chuẩn xác
 */
export async function calculateAptamilFormulaMix(params: {
  stage: FormulaStage;
  babyWeightKg?: number;
  babyAgeMonths?: number;
  targetWaterVolumeMl?: number;
}): Promise<FormulaMixResult> {
  const protocol = await prisma.aptamilPreparationProtocol.findUnique({
    where: { stage: params.stage },
    include: {
      product: {
        select: {
          id: true,
          name: true,
          slug: true,
          variants: {
            where: { isActive: true },
            select: { id: true, price: true, image: true, stock: true },
            take: 1,
          },
        },
      },
    },
  });

  if (!protocol) {
    throw new Error(`Không tìm thấy quy trình pha sữa cho giai đoạn ${params.stage}`);
  }

  let waterVolumeMl = protocol.waterVolumeMlPerFeed;
  let scoopsCount = protocol.scoopsPerFeed;

  if (params.targetWaterVolumeMl && params.targetWaterVolumeMl > 0) {
    waterVolumeMl = params.targetWaterVolumeMl;
    // 50ml nước ứng với 1 muỗng gạt ngang
    scoopsCount = Math.max(1, Math.round(waterVolumeMl / protocol.waterMlPerScoop));
  } else if (params.babyWeightKg && params.babyWeightKg > 0) {
    // Quy tắc nhi khoa ước tính: ~150ml sữa / kg / ngày
    const totalDailyMl = params.babyWeightKg * 150;
    const perFeedMl = Math.round(totalDailyMl / protocol.standardFeedsPerDay);
    // Làm tròn bội số 50ml
    scoopsCount = Math.max(1, Math.round(perFeedMl / protocol.waterMlPerScoop));
    waterVolumeMl = scoopsCount * protocol.waterMlPerScoop;
  }

  const powderWeightGrams = Number(
    (scoopsCount * protocol.scoopWeightGrams).toFixed(1)
  );

  // Sữa Aptamil thành phẩm cung cấp khoảng 66 kcal trên mỗi 100ml
  const estimatedCaloriesKcal = Math.round((waterVolumeMl * 66) / 100);

  return {
    stage: protocol.stage,
    productTitle: protocol.productTitle,
    ageRangeMonths: protocol.ageRangeMonths,
    waterTemperatureMinC: protocol.waterTemperatureMinC,
    waterTemperatureMaxC: protocol.waterTemperatureMaxC,
    waterVolumeMl,
    scoopsCount,
    powderWeightGrams,
    estimatedCaloriesKcal,
    dailyFeedsRecommended: protocol.standardFeedsPerDay,
    mixingSteps: protocol.mixingSteps,
    probioticWarning: protocol.probioticWarning,
    storageGuidelines: protocol.storageGuidelines,
    product: protocol.product,
  };
}

/**
 * Lấy danh sách toàn bộ các quy trình pha sữa Aptamil Úc
 */
export async function getAptamilProtocols() {
  return await prisma.aptamilPreparationProtocol.findMany({
    orderBy: { stage: "asc" },
    include: {
      product: {
        select: {
          id: true,
          name: true,
          slug: true,
          variants: {
            where: { isActive: true },
            select: { id: true, price: true, image: true, stock: true },
            take: 1,
          },
        },
      },
    },
  });
}

/**
 * Thống kê Admin KPIs cho Phân Hệ Tăng Trưởng Trẻ Em
 */
export async function calculatePediatricAdminKPIs() {
  const [
    totalAssessments,
    normalCount,
    underweightCount,
    stuntedCount,
    recentAssessments,
  ] = await Promise.all([
    prisma.childGrowthAssessmentRecord.count(),
    prisma.childGrowthAssessmentRecord.count({
      where: {
        weightStatus: GrowthAssessmentStatus.NORMAL,
        heightStatus: GrowthAssessmentStatus.NORMAL,
      },
    }),
    prisma.childGrowthAssessmentRecord.count({
      where: {
        weightStatus: {
          in: [
            GrowthAssessmentStatus.UNDERWEIGHT,
            GrowthAssessmentStatus.SEVERELY_UNDERWEIGHT,
          ],
        },
      },
    }),
    prisma.childGrowthAssessmentRecord.count({
      where: {
        heightStatus: GrowthAssessmentStatus.STUNTED,
      },
    }),
    prisma.childGrowthAssessmentRecord.findMany({
      orderBy: { createdAt: "desc" },
      take: 20,
      include: {
        user: {
          select: { id: true, name: true, phone: true, email: true },
        },
      },
    }),
  ]);

  const normalRatioPercent =
    totalAssessments > 0
      ? Math.round((normalCount / totalAssessments) * 100)
      : 100;

  return {
    totalAssessments,
    normalCount,
    underweightCount,
    stuntedCount,
    normalRatioPercent,
    recentAssessments,
  };
}
