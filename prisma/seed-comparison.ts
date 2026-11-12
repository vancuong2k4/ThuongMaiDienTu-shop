// ============================================================
// prisma/seed-comparison.ts
// Kịch bản Seed Dữ Liệu Bộ So Sánh Sản Phẩm & Vi Chất Chuẩn Úc (Phase 19)
// ============================================================

import {
  PrismaClient,
  NutrientUnit,
  ComparisonScope,
  SynergyType,
} from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 [Seed Comparison] Bắt đầu nạp danh mục vi chất & quy tắc tương tác...");

  // 1. Tạo các Nutrient References
  const nutrientsData = [
    {
      code: "DHA",
      nameVi: "DHA Tinh Khiết Từ Dầu Cá / Vi Tảo",
      nameEn: "Docosahexaenoic Acid (Omega-3)",
      category: "Axit Béo Omega",
      standardRdi: 250,
      upperLimit: 1000,
      unit: NutrientUnit.MG,
      benefitsSummary:
        "Thành phần cấu trúc chính của não bộ và võng mạc mắt, hỗ trợ phát triển trí thông minh, khả năng quan sát và phản xạ cho bé.",
      cautionNotes: "Nên dùng trong hoặc ngay sau bữa ăn có chất béo để hấp thụ tối đa.",
      sortOrder: 1,
    },
    {
      code: "EPA",
      nameVi: "EPA Chống Viêm & Tuần Hoàn",
      nameEn: "Eicosapentaenoic Acid (Omega-3)",
      category: "Axit Béo Omega",
      standardRdi: 180,
      upperLimit: 800,
      unit: NutrientUnit.MG,
      benefitsSummary:
        "Hỗ trợ giảm mỡ máu, bảo vệ tim mạch và điều hòa phản ứng viêm trong cơ thể.",
      cautionNotes: "Thận trọng khi dùng cùng thuốc chống đông máu liều cao.",
      sortOrder: 2,
    },
    {
      code: "SYNBIOTICS",
      nameVi: "Hệ Men Vi Sinh Synbiotics Độc Quyền",
      nameEn: "Synbiotics (Probiotics + Prebiotics GOS/FOS)",
      category: "Men Vi Sinh & Tiêu Hóa",
      standardRdi: 5,
      upperLimit: null,
      unit: NutrientUnit.G,
      benefitsSummary:
        "Tổ hợp men vi sinh Bifidobacterium và chất xơ hòa tan scGOS/lcFOS 9:1, giúp phân mềm, chống táo bón và tăng đề kháng ruột.",
      cautionNotes: "Pha nước dưới 40°C để tránh tiêu diệt lợi khuẩn sống.",
      sortOrder: 3,
    },
    {
      code: "MGO",
      nameVi: "Kháng Sinh Tự Nhiên Methylglyoxal",
      nameEn: "Methylglyoxal (Manuka Active)",
      category: "Kháng Khuẩn Tự Nhiên",
      standardRdi: 263,
      upperLimit: null,
      unit: NutrientUnit.MGO,
      benefitsSummary:
        "Hoạt chất kháng khuẩn tự nhiên độc quyền của mật ong hoa Manuka Úc/NZ, giúp làm dịu cổ họng, ức chế vi khuẩn HP dạ dày.",
      cautionNotes: "Không dùng cho trẻ dưới 1 tuổi (nguy cơ ngộ độc Clostridium botulinum).",
      sortOrder: 4,
    },
    {
      code: "FOLIC_ACID",
      nameVi: "Axit Folic Hoạt Hóa Quatrefolic",
      nameEn: "Folic Acid / Folate",
      category: "Vitamin Nhóm B",
      standardRdi: 400,
      upperLimit: 1000,
      unit: NutrientUnit.MCG,
      benefitsSummary:
        "Ngăn ngừa dị tật ống thần kinh thai nhi, tham gia quá trình phân chia tế bào và tạo hồng cầu khỏe mạnh.",
      cautionNotes: "Phụ nữ mang thai nên dùng đủ 800mcg/ngày theo chỉ định Dược sĩ.",
      sortOrder: 5,
    },
    {
      code: "IRON_ORGANIC",
      nameVi: "Sắt Hữu Cơ Bisglycinate Không Nóng",
      nameEn: "Iron Bisglycinate Chelate",
      category: "Khoáng Chất Thiết Yếu",
      standardRdi: 27,
      upperLimit: 45,
      unit: NutrientUnit.MG,
      benefitsSummary:
        "Vận chuyển oxy đi khắp cơ thể, chống thiếu máu mệt mỏi, hấp thu êm dịu không gây táo bón.",
      cautionNotes: "Tránh uống cùng lúc với trà, cà phê hoặc sữa Canxi liều cao.",
      sortOrder: 6,
    },
    {
      code: "CALCIUM_ORGANIC",
      nameVi: "Canxi Hữu Cơ Tảo Biển Đỏ",
      nameEn: "Organic Calcium (Aquamin F)",
      category: "Khoáng Chất Thiết Yếu",
      standardRdi: 800,
      upperLimit: 2500,
      unit: NutrientUnit.MG,
      benefitsSummary:
        "Xây dựng khung xương, mọc răng chắc khỏe cho bé và phòng ngừa loãng xương cho mẹ bầu và người cao tuổi.",
      cautionNotes: "Nên uống buổi sáng hoặc trưa, uống nhiều nước trong ngày.",
      sortOrder: 7,
    },
    {
      code: "ZINC_CITRATE",
      nameVi: "Kẽm Sinh Học Kích Vị Giác & Miễn Dịch",
      nameEn: "Zinc Citrate / Bisglycinate",
      category: "Khoáng Chất Thiết Yếu",
      standardRdi: 11,
      upperLimit: 40,
      unit: NutrientUnit.MG,
      benefitsSummary:
        "Kích thích gai vị giác giúp trẻ ăn ngon miệng, tăng cường hoạt động của tế bào lympho T chống nhiễm trùng đường hô hấp.",
      cautionNotes: "Không dùng lúc đói cồn cào để tránh cồn ruột.",
      sortOrder: 8,
    },
    {
      code: "VITAMIN_D3",
      nameVi: "Vitamin D3 Tự Nhiên Dạng Dầu",
      nameEn: "Cholecalciferol (Vitamin D3)",
      category: "Vitamin Tan Trong Dầu",
      standardRdi: 400,
      upperLimit: 2000,
      unit: NutrientUnit.IU,
      benefitsSummary:
        "Kích hoạt thụ thể hấp thụ canxi tại ruột non, hỗ trợ hệ xương phát triển vượt bậc và cải thiện giấc ngủ.",
      cautionNotes: "Dùng chung với chất béo bữa ăn giúp hấp thu gấp 3 lần.",
      sortOrder: 9,
    },
    {
      code: "VITAMIN_K2",
      nameVi: "Vitamin K2 MK7 Chiết Xuất Đậu Nành Natto",
      nameEn: "Menaquinone-7 (Vitamin K2 MK7)",
      category: "Vitamin Tan Trong Dầu",
      standardRdi: 45,
      upperLimit: null,
      unit: NutrientUnit.MCG,
      benefitsSummary:
        "Kích hoạt protein Osteocalcin vận chuyển canxi gắn thẳng vào xương, chống canxi lắng đọng vôi hóa mạch máu.",
      cautionNotes: "Dạng All-Trans là dạng có sinh khả dụng cao nhất.",
      sortOrder: 10,
    },
    {
      code: "SILYMARIN",
      nameVi: "Chiết Xuất Cây Kế Sữa Chuẩn Hóa",
      nameEn: "Milk Thistle Silymarin",
      category: "Thảo Dược Bổ Gan",
      standardRdi: 420,
      upperLimit: 1200,
      unit: NutrientUnit.MG,
      benefitsSummary:
        "Chống oxy hóa tế bào gan, ổn định màng tế bào trước tác hại của bia rượu và hỗ trợ hạ men gan hiệu quả.",
      cautionNotes: "Uống đều đặn ít nhất 4-8 tuần để thấy rõ hiệu quả.",
      sortOrder: 11,
    },
  ];

  const nutrientMap: Record<string, string> = {};

  for (const n of nutrientsData) {
    const created = await prisma.nutrientReference.upsert({
      where: { code: n.code },
      update: {
        nameVi: n.nameVi,
        nameEn: n.nameEn,
        category: n.category,
        standardRdi: n.standardRdi,
        upperLimit: n.upperLimit,
        unit: n.unit,
        benefitsSummary: n.benefitsSummary,
        cautionNotes: n.cautionNotes,
        sortOrder: n.sortOrder,
      },
      create: {
        code: n.code,
        nameVi: n.nameVi,
        nameEn: n.nameEn,
        category: n.category,
        standardRdi: n.standardRdi,
        upperLimit: n.upperLimit,
        unit: n.unit,
        benefitsSummary: n.benefitsSummary,
        cautionNotes: n.cautionNotes,
        sortOrder: n.sortOrder,
      },
    });
    nutrientMap[n.code] = created.id;
  }
  console.log(`✅ Đã nạp ${Object.keys(nutrientMap).length} chỉ tiêu vi chất tham chiếu.`);

  // 2. Tạo các Quy Tắc Tương Tác Vi Chất (Synergy & Safety Rules)
  const rules = [
    {
      primaryCode: "VITAMIN_D3",
      secondaryCode: "VITAMIN_K2",
      synergyType: SynergyType.SYNERGY_BENEFICIAL,
      title: "Hiệp đồng D3 + K2: Dẫn hướng Canxi tối ưu vào xương răng",
      description:
        "Vitamin D3 mở cổng hấp thu canxi tại biểu mô ruột, trong khi Vitamin K2 (MK7) kích hoạt protein Osteocalcin dẫn truyền canxi gắn chính xác vào cấu trúc xương, ngăn chặn nguy cơ vôi hóa mạch máu.",
      pharmacistRecommendation:
        "Nên uống cùng thời điểm trong hoặc sau bữa ăn có dầu mỡ để phát huy hiệu quả tối đa.",
    },
    {
      primaryCode: "DHA",
      secondaryCode: "EPA",
      synergyType: SynergyType.SYNERGY_BENEFICIAL,
      title: "Tổ hợp Omega-3 Tự Nhiên: Não bộ, mắt & tim mạch",
      description:
        "DHA và EPA kết hợp theo tỷ lệ chuẩn giúp tăng cường tuần hoàn vi mạch não, cải thiện chỉ số tập trung và ổn định huyết áp.",
      pharmacistRecommendation:
        "Dược sĩ khuyên dùng vào bữa ăn sáng hoặc trưa để cơ thể chuyển hóa năng lượng tốt nhất.",
    },
    {
      primaryCode: "CALCIUM_ORGANIC",
      secondaryCode: "IRON_ORGANIC",
      synergyType: SynergyType.INTERACTION_SEPARATE,
      title: "Cạnh tranh thụ thể: Canxi ức chế hấp thu Sắt",
      description:
        "Canxi ở nồng độ cao trong ruột non sẽ cạnh tranh cùng thụ thể DMT-1 với Sắt, làm giảm tới 50% hiệu suất hấp thu vi chất sắt của cơ thể.",
      pharmacistRecommendation:
        "Dược sĩ chỉ định: Uống Sắt vào buổi sáng trước ăn hoặc sau ăn 1 giờ, uống Canxi vào buổi trưa sau ăn (cách nhau tối thiểu 2 giờ).",
    },
    {
      primaryCode: "ZINC_CITRATE",
      secondaryCode: "IRON_ORGANIC",
      synergyType: SynergyType.INTERACTION_SEPARATE,
      title: "Khoáng chất cạnh tranh: Kẽm và Sắt nên giãn cách",
      description:
        "Kẽm và Sắt đều sử dụng cùng kênh vận chuyển khoáng chất hóa trị 2 qua niêm mạc ruột. Dùng chung một lúc sẽ khiến cả 2 vi chất bị giảm hấp thu.",
      pharmacistRecommendation:
        "Uống Sắt buổi sáng và bổ sung Kẽm vào buổi trưa hoặc đầu giờ chiều sau ăn.",
    },
    {
      primaryCode: "MGO",
      secondaryCode: "SYNBIOTICS",
      synergyType: SynergyType.SYNERGY_BENEFICIAL,
      title: "Bảo vệ niêm mạc & Củng cố hệ vi sinh đường ruột",
      description:
        "Mật ong Manuka MGO tự nhiên làm sạch và làm lành các ổ viêm loét dạ dày ruột, tạo môi trường thuận lợi để lợi khuẩn Synbiotics bám dính và phát triển sinh sôi.",
      pharmacistRecommendation:
        "Uống 1 thìa mật ong Manuka pha nước ấm vào sáng sớm, sau đó bổ sung men vi sinh vào bữa sáng.",
    },
  ];

  for (const r of rules) {
    const pId = nutrientMap[r.primaryCode];
    const sId = nutrientMap[r.secondaryCode];
    if (pId && sId) {
      await prisma.nutrientSynergyRule.upsert({
        where: {
          primaryNutrientId_secondaryNutrientId: {
            primaryNutrientId: pId,
            secondaryNutrientId: sId,
          },
        },
        update: {
          synergyType: r.synergyType,
          title: r.title,
          description: r.description,
          pharmacistRecommendation: r.pharmacistRecommendation,
        },
        create: {
          primaryNutrientId: pId,
          secondaryNutrientId: sId,
          synergyType: r.synergyType,
          title: r.title,
          description: r.description,
          pharmacistRecommendation: r.pharmacistRecommendation,
        },
      });
    }
  }
  console.log(`✅ Đã nạp ${rules.length} quy tắc tương tác vi chất chuẩn Dược sĩ.`);

  // 3. Liên kết ProductComparisonFeature và ProductNutrient cho các sản phẩm cốt lõi
  const productSpecs = [
    {
      slug: "sua-bot-aptamil-profutura-uc-lon-900g",
      scope: ComparisonScope.INFANT_FORMULA,
      costPerDay: 28000,
      servingsPerPack: 32,
      australianCertification: "Đạt chuẩn TGA & Tiêu chuẩn Thực phẩm FSANZ Úc",
      targetAgeGroup: "Bé từ 0-12 tháng (và các số tương ứng)",
      textureOrFlavor: "Vị thanh nhạt gần như sữa mẹ, hạt sữa vàng nhạt tơi xốp",
      keyDifferentiators: [
        "Chứa hệ vi sinh Synbiotics độc quyền (Bifidobacterium M-16V + scGOS/lcFOS 9:1)",
        "Hàm lượng DHA cao nhất trong các dòng sữa công thức Úc",
        "Tỷ lệ đạm Whey/Casein vàng 60:40 chống đầy bụng",
      ],
      storageInstruction: "Đậy kín nắp nhựa sau mỗi lần pha, dùng hết trong 4 tuần sau mở nắp.",
      nutrients: [
        { code: "DHA", amount: 130, per100g: 130, text: "130mg / 100g bột", claim: "Cao nhất phân khúc sữa Úc" },
        { code: "SYNBIOTICS", amount: 8.8, per100g: 8.8, text: "8.8g / 100g bột", claim: "Độc quyền Aptamil Nutricia" },
        { code: "CALCIUM_ORGANIC", amount: 520, per100g: 520, text: "520mg / 100g bột", claim: "Dễ hấp thu, không vón cục" },
        { code: "ZINC_CITRATE", amount: 3.8, per100g: 3.8, text: "3.8mg / 100g bột", claim: "Hỗ trợ vị giác & đề kháng" },
      ],
    },
    {
      slug: "sua-bot-a2-platinum-premium-uc-lon-900g",
      scope: ComparisonScope.INFANT_FORMULA,
      costPerDay: 26000,
      servingsPerPack: 33,
      australianCertification: "100% Thuần Đạm Beta-casein A2 & FSANZ Úc",
      targetAgeGroup: "Bé tiêu hóa nhạy cảm, dễ nôn trớ",
      textureOrFlavor: "Vị béo ngậy tự nhiên từ sữa tươi Úc, hương thơm dịu",
      keyDifferentiators: [
        "100% Đạm Beta-casein A2 từ giống bò thuần chủng New Zealand & Úc",
        "Không giải phóng peptide BCM-7 gây sôi bụng và khó tiêu",
        "Bổ sung Omega-3 DHA, ARA, GOS và Probiotics",
      ],
      storageInstruction: "Bảo quản nơi khô ráo, nhiệt độ dưới 25°C.",
      nutrients: [
        { code: "DHA", amount: 110, per100g: 110, text: "110mg / 100g bột", claim: "Từ dầu cá biển tự nhiên" },
        { code: "CALCIUM_ORGANIC", amount: 580, per100g: 580, text: "580mg / 100g bột", claim: "Giàu canxi hữu cơ tự nhiên" },
        { code: "ZINC_CITRATE", amount: 4.1, per100g: 4.1, text: "4.1mg / 100g bột", claim: "Kích thích enzym tiêu hóa" },
      ],
    },
    {
      slug: "mat-ong-manuka-comvita-umf-10-new-zealand-500g",
      scope: ComparisonScope.MANUKA_HONEY,
      costPerDay: 15000,
      servingsPerPack: 50,
      australianCertification: "UMF™ 10+ Quality Trademark Certified (MGO 263+)",
      targetAgeGroup: "Trẻ từ 1 tuổi, người lớn & người cao tuổi",
      textureOrFlavor: "Chất mật sánh mịn vàng đậm hổ phách, vị ngọt thanh mát ấm",
      keyDifferentiators: [
        "Chỉ số kháng khuẩn MGO 263+ được kiểm định độc lập bằng máy đo quang phổ",
        "Thương hiệu Comvita số 1 New Zealand với hơn 50 năm truyền thống nuôi ong",
        "Mật sống nguyên chất không xử lý nhiệt cao để bảo tồn enzym quý",
      ],
      storageInstruction: "Bảo quản dưới 20°C, tránh ánh nắng trực tiếp, không cho vào tủ lạnh.",
      nutrients: [
        { code: "MGO", amount: 263, per100g: 263, text: "263mg / 1kg mật", claim: "Kháng khuẩn thực nghiệm cao" },
      ],
    },
    {
      slug: "vien-uong-dau-ca-omega-3-blackmores-uc-400-vien",
      scope: ComparisonScope.SUPPLEMENTS,
      costPerDay: 3500,
      servingsPerPack: 200,
      australianCertification: "TGA AUST L 148356 Úc (Chemist Warehouse)",
      targetAgeGroup: "Người lớn, học sinh ôn thi & người làm việc máy tính",
      textureOrFlavor: "Viên nang mềm màu vàng óng, không mùi tanh hương vani chanh",
      keyDifferentiators: [
        "Chiết xuất 100% từ cá cơm nhỏ biển sâu Nam Cực, loại bỏ hoàn toàn thủy ngân",
        "Hàm lượng EPA/DHA chuẩn 180mg / 120mg mỗi viên nang",
        "Hộp đại 400 viên tiết kiệm dùng liên tục hơn 6 tháng cho cả nhà",
      ],
      storageInstruction: "Bảo quản dưới 30°C nơi khô ráo, tránh ánh sáng trực tiếp.",
      nutrients: [
        { code: "DHA", amount: 120, per100g: null, text: "120mg / 1 viên", claim: "Hỗ trợ thị lực & trí não" },
        { code: "EPA", amount: 180, per100g: null, text: "180mg / 1 viên", claim: "Bảo vệ mỡ máu & tim mạch" },
      ],
    },
    {
      slug: "vien-uong-elevit-cho-ba-bau-bayer-uc-100-vien",
      scope: ComparisonScope.SUPPLEMENTS,
      costPerDay: 11000,
      servingsPerPack: 100,
      australianCertification: "TGA AUST L 284752 Úc (Bayer Australia)",
      targetAgeGroup: "Phụ nữ chuẩn bị có thai, đang mang thai và cho con bú",
      textureOrFlavor: "Viên bao phim màu trắng ngà, 1 viên duy nhất mỗi ngày",
      keyDifferentiators: [
        "Chứa 800mcg Axit Folic giảm tới 92% nguy cơ dị tật ống thần kinh",
        "60mg Sắt hữu cơ liều chuẩn quốc tế phòng ngừa thiếu máu thai kỳ",
        "Tích hợp 19 vitamin và khoáng chất toàn diện cho mẹ và thai nhi",
      ],
      storageInstruction: "Bảo quản dưới 25°C nơi khô ráo, tránh ẩm.",
      nutrients: [
        { code: "FOLIC_ACID", amount: 800, per100g: null, text: "800mcg / 1 viên", claim: "Chuẩn RDI cho phụ nữ mang thai" },
        { code: "IRON_ORGANIC", amount: 60, per100g: null, text: "60mg / 1 viên", claim: "Sắt hữu cơ không táo bón" },
        { code: "ZINC_CITRATE", amount: 11, per100g: null, text: "11mg / 1 viên", claim: "Kẽm sinh học tăng đề kháng" },
      ],
    },
    {
      slug: "vitamin-d3-k2-mk7-sunday-natural-duc-20ml",
      scope: ComparisonScope.SUPPLEMENTS,
      costPerDay: 1500,
      servingsPerPack: 300,
      australianCertification: "Đạt chuẩn Bio-Siegel Đức & K2VITAL® All-Trans 99.7%",
      targetAgeGroup: "Trẻ sơ sinh từ 0 ngày tuổi, trẻ nhỏ trong độ tuổi mầm non",
      textureOrFlavor: "Dạng giọt dầu MCT dừa không màu không mùi, bé hợp tác uống dễ dàng",
      keyDifferentiators: [
        "K2 MK7 tinh khiết ở cấu hình All-Trans sinh khả dụng hấp thu cao nhất",
        "Dầu nền MCT dừa hữu cơ bảo vệ vitamin tan trong dầu không bị phân hủy",
        "Pipet nhỏ giọt định lượng chuẩn 200 IU D3 + 15mcg K2 mỗi 1 giọt",
      ],
      storageInstruction: "Bảo quản nơi khô ráo, thoáng mát dưới 25°C.",
      nutrients: [
        { code: "VITAMIN_D3", amount: 200, per100g: null, text: "200 IU / 1 giọt", claim: "Tối ưu hấp thu canxi" },
        { code: "VITAMIN_K2", amount: 15, per100g: null, text: "15mcg / 1 giọt", claim: "K2VITAL® All-Trans" },
      ],
    },
  ];

  for (const item of productSpecs) {
    const product = await prisma.product.findUnique({
      where: { slug: item.slug },
    });

    if (!product) {
      console.log(`⚠️ Không tìm thấy sản phẩm ${item.slug}, bỏ qua.`);
      continue;
    }

    // 3.1. Cập nhật Feature
    await prisma.productComparisonFeature.upsert({
      where: { productId: product.id },
      update: {
        scope: item.scope,
        costPerDay: item.costPerDay,
        servingsPerPack: item.servingsPerPack,
        australianCertification: item.australianCertification,
        targetAgeGroup: item.targetAgeGroup,
        textureOrFlavor: item.textureOrFlavor,
        keyDifferentiators: item.keyDifferentiators,
        storageInstruction: item.storageInstruction,
      },
      create: {
        productId: product.id,
        scope: item.scope,
        costPerDay: item.costPerDay,
        servingsPerPack: item.servingsPerPack,
        australianCertification: item.australianCertification,
        targetAgeGroup: item.targetAgeGroup,
        textureOrFlavor: item.textureOrFlavor,
        keyDifferentiators: item.keyDifferentiators,
        storageInstruction: item.storageInstruction,
      },
    });

    // 3.2. Cập nhật Nutrients
    for (const n of item.nutrients) {
      const refId = nutrientMap[n.code];
      if (refId) {
        await prisma.productNutrient.upsert({
          where: {
            productId_nutrientRefId: {
              productId: product.id,
              nutrientRefId: refId,
            },
          },
          update: {
            amountPerServing: n.amount,
            amountPer100g: n.per100g,
            servingSizeText: n.text,
            highlightClaim: n.claim,
          },
          create: {
            productId: product.id,
            nutrientRefId: refId,
            amountPerServing: n.amount,
            amountPer100g: n.per100g,
            servingSizeText: n.text,
            highlightClaim: n.claim,
          },
        });
      }
    }

    console.log(`✅ Đã thiết lập thông số so sánh cho sản phẩm: ${product.name}`);
  }

  console.log("🎉 Hoàn tất nạp dữ liệu so sánh sản phẩm & vi chất chuẩn Úc!");
}

main()
  .catch((e) => {
    console.error("❌ Lỗi khi seed dữ liệu so sánh:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
