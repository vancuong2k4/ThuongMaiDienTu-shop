// ============================================================
// prisma/seed-protocols.ts
// Seed Ngân Hàng Câu Hỏi Trắc Nghiệm Sức Khỏe & Phác Đồ Dược Sĩ Úc (Phase 16)
// ============================================================

import {
  PrismaClient,
  HealthTargetGroup,
  QuizQuestionType,
  ConsultationStatus,
} from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🚀 Bắt đầu nạp dữ liệu mẫu Ngân hàng Câu hỏi & Phác đồ Dinh dưỡng...");

  // Tìm các sản phẩm thực tế trong DB để liên kết vào phác đồ
  const products = await prisma.product.findMany({
    take: 10,
    include: {
      variants: { take: 1 },
    },
  });

  if (products.length === 0) {
    console.log("⚠️ Chưa có sản phẩm trong DB, vui lòng seed sản phẩm trước!");
    return;
  }

  // 1. Tạo 4 Phác Đồ Dinh Dưỡng Chuẩn Dược Sĩ Úc
  console.log("📋 1. Tạo các Phác Đồ Dinh Dưỡng Mẫu...");

  // Phác đồ 1: Bé tiêu hóa kém, biếng ăn
  const p1 = products[0];
  const p2 = products[1] || products[0];
  const p3 = products[2] || products[0];

  const protocolBaby = await prisma.healthProtocol.upsert({
    where: { slug: "phac-do-be-tieu-hoa-kem-bieng-an" },
    update: {},
    create: {
      slug: "phac-do-be-tieu-hoa-kem-bieng-an",
      title: "Phác Đồ Phục Hồi Hệ Tiêu Hóa, Chống Táo Bón & Kích Thích Bé Ăn Ngon",
      targetGroup: HealthTargetGroup.BABY_KIDS,
      subtitle: "Phối hợp men vi sinh sống 15 chủng Úc, Sữa Aptamil mát đạm Whey và Kẽm sinh học Bio Island",
      description:
        "Phác đồ lâm sàng được thiết kế riêng cho trẻ sơ sinh và trẻ nhỏ gặp tình trạng ruột nhạy cảm, hay nôn trớ, táo bón hoặc biếng ăn sinh lý. Sự phối hợp giữa men vi sinh và kẽm sinh học giúp tăng sinh enzym tiêu hóa tự nhiên, phục hồi vi nhung mao ruột và nâng cao khả năng hấp thu dinh dưỡng tối đa.",
      keyNutrients: [
        "Men vi sinh sống Probiotics 15 chủng lợi khuẩn",
        "Kẽm sinh học Bio Island Zinc",
        "Chất xơ hòa tan FOS/GOS & Men Synbiotic",
        "Đạm Whey thủy phân dễ hấp thu",
      ],
      pharmacistAdvice:
        "Dược sĩ THUYNGA Shop khuyên: Pha sữa công thức ở nhiệt độ 40-45°C để bảo toàn men vi sinh sống. Bổ sung Kẽm vào buổi sáng sau ăn 30 phút, và men vi sinh vào đầu giờ chiều cách cữ sữa 1 tiếng. Duy trì liên tục tối thiểu 4 tuần để thấy rõ hiệu quả bé tăng cân và đi phân mềm xốp.",
      dosageSchedule: {
        morning: "07:30 - Uống Kẽm Bio Island 1 viên (nhai hoặc trộn cháo ấm) sau ăn sáng 30 phút",
        afternoon: "14:00 - Uống Men vi sinh Úc 1 gói nhỏ pha với 30ml nước ấm (dưới 40°C)",
        evening: "20:00 - Cữ sữa Aptamil Profutura ấm trước giờ ngủ giúp bé ngủ sâu giấc",
      },
      comboDiscountPercent: 12,
      isActive: true,
      items: {
        create: [
          {
            productId: p1.id,
            variantId: p1.variants[0]?.id || null,
            usageInstructions: "Uống 2-3 cữ mỗi ngày (180ml - 210ml/cữ theo độ tuổi của bé)",
            timing: "Sáng & Tối",
            quantity: 2,
            isEssential: true,
            sortOrder: 1,
          },
          {
            productId: p2.id,
            variantId: p2.variants[0]?.id || null,
            usageInstructions: "1 viên/ngày sau bữa ăn sáng 30 phút",
            timing: "Sáng",
            quantity: 1,
            isEssential: true,
            sortOrder: 2,
          },
        ],
      },
    },
  });

  // Phác đồ 2: Bé phát triển chiều cao & tăng đề kháng
  const protocolHeight = await prisma.healthProtocol.upsert({
    where: { slug: "phac-do-be-tang-chieu-cao-de-khang" },
    update: {},
    create: {
      slug: "phac-do-be-tang-chieu-cao-de-khang",
      title: "Phác Đồ Bứt Phá Chiều Cao & Miễn Dịch Đề Kháng Hô Hấp Vượt Trội",
      targetGroup: HealthTargetGroup.BABY_KIDS,
      subtitle: "Phối hợp Canxi sữa Bio Island Milk Calcium, Vitamin D3/K2 và DHA tinh khiết phát triển não bộ",
      description:
        "Tối ưu hóa giai đoạn vàng phát triển hệ khung xương và hệ thống miễn dịch tự nhiên của bé. Canxi chiết xuất từ sữa bò tươi Úc kết hợp D3K2 giúp định vị canxi chính xác vào xương, phòng ngừa còi xương và hỗ trợ bé mọc răng nhanh, ngủ không giật mình.",
      keyNutrients: [
        "Canxi sữa tự nhiên Bio Island Milk Calcium",
        "Vitamin D3 & K2 Menaquinone-7",
        "DHA thực vật tinh khiết từ tảo Schizochytrium",
      ],
      pharmacistAdvice:
        "Nên uống Canxi vào buổi sáng trước 09h00 kết hợp tắm nắng nhẹ. Tuyệt đối không uống Canxi vào buổi tối để tránh lắng cặn. DHA nên uống trong hoặc ngay sau bữa ăn giàu chất béo.",
      dosageSchedule: {
        morning: "08:00 - Uống Canxi Sữa Bio Island sau ăn sáng cùng nhiều nước",
        afternoon: "12:30 - Uống DHA Bio Island ngay sau bữa trưa",
        evening: "20:30 - Massage chân bé và ngủ sớm trước 21h30 để kích thích hormone tăng trưởng GH",
      },
      comboDiscountPercent: 10,
      isActive: true,
      items: {
        create: [
          {
            productId: p2.id,
            variantId: p2.variants[0]?.id || null,
            usageInstructions: "Uống 1 viên Canxi Sữa mỗi sáng sau ăn",
            timing: "Sáng",
            quantity: 1,
            isEssential: true,
            sortOrder: 1,
          },
          {
            productId: p3.id,
            variantId: p3.variants[0]?.id || null,
            usageInstructions: "Uống 1 viên DHA ngay sau bữa ăn trưa",
            timing: "Trưa",
            quantity: 1,
            isEssential: true,
            sortOrder: 2,
          },
        ],
      },
    },
  });

  // Phác đồ 3: Mẹ Bầu Toàn Diện Thai Kỳ
  const protocolMom = await prisma.healthProtocol.upsert({
    where: { slug: "phac-do-me-bau-toan-dien-giam-nghen" },
    update: {},
    create: {
      slug: "phac-do-me-bau-toan-dien-giam-nghen",
      title: "Phác Đồ Dinh Dưỡng Mẹ Bầu Toàn Diện: Giảm Nghén, Đủ Vi Chất & Bé Tinh Anh",
      targetGroup: HealthTargetGroup.PREGNANT_MOM,
      subtitle: "Bộ ba vàng: Sắt hữu cơ không táo bón + Canxi hữu cơ + DHA Bầu Úc chuyên sâu",
      description:
        "Cung cấp đầy đủ hàm lượng Axit Folic 500mcg chống dị tật ống thần kinh, Sắt hữu cơ dạng Bisglycinate hấp thu êm dịu không nóng trong, và Canxi hữu cơ hỗ trợ xương chậu người mẹ dẻo dai chuẩn bị cho kỳ sinh nở.",
      keyNutrients: [
        "Axit Folic 500mcg & Sắt sinh học hữu cơ",
        "Canxi Citrate & Vitamin D3",
        "DHA tinh khiết tỷ lệ chuẩn não thai nhi",
      ],
      pharmacistAdvice:
        "Uống Sắt và Canxi cách nhau tối thiểu 2 giờ để tránh cạnh tranh hấp thu. Sắt nên uống sáng sớm lúc đói hoặc sau ăn 1h kèm một cốc nước cam để tăng khả năng hấp thu.",
      dosageSchedule: {
        morning: "06:30 - Uống 1 viên Sắt Bầu hữu cơ với nước lọc hoặc nước cam",
        afternoon: "11:30 - Uống 2 viên Canxi sau ăn trưa 30 phút",
        evening: "18:30 - Uống 1 viên DHA Bầu trong bữa cơm tối",
      },
      comboDiscountPercent: 15,
      isActive: true,
      items: {
        create: [
          {
            productId: p1.id,
            variantId: p1.variants[0]?.id || null,
            usageInstructions: "1 viên/ngày uống cách xa Canxi 2 giờ",
            timing: "Sáng",
            quantity: 1,
            isEssential: true,
            sortOrder: 1,
          },
        ],
      },
    },
  });

  // Phác đồ 4: Phục hồi sụn khớp & Bổ não người cao tuổi
  const protocolElderly = await prisma.healthProtocol.upsert({
    where: { slug: "phac-do-sun-khop-bo-nao-nguoi-cao-tuoi" },
    update: {},
    create: {
      slug: "phac-do-sun-khop-bo-nao-nguoi-cao-tuoi",
      title: "Phác Đồ Tái Tạo Sụn Khớp, Giảm Khô Cứng Khớp & Minh Mẫn Tuổi Già",
      targetGroup: HealthTargetGroup.ELDERLY,
      subtitle: "Kết hợp Glucosamine Sulfate 1500mg Úc, Dầu cá không mùi Omega-3 và Mật ong Manuka kháng viêm",
      description:
        "Giải pháp chuyên biệt cho người lớn tuổi bị thoái hóa khớp gối, đau lưng cột sống, tê bì chân tay hoặc tuần hoàn não kém. Glucosamine liều chuẩn 1500mg giúp bôi trơn ổ khớp, kết hợp Omega-3 chống xơ vữa thành mạch và bảo vệ tim mạch tối ưu.",
      keyNutrients: [
        "Glucosamine Sulfate 1500mg hàm lượng chuẩn",
        "EPA & DHA từ dầu cá biển sâu Úc",
        "MGO kháng khuẩn tự nhiên từ Mật ong Manuka",
      ],
      pharmacistAdvice:
        "Duy trì Glucosamine liên tục theo liệu trình 3-6 tháng để tái tạo màng hoạt dịch sụn khớp. Dầu cá Omega-3 nên uống ngay sau bữa ăn có chất béo để hấp thu tốt nhất.",
      dosageSchedule: {
        morning: "07:30 - Pha 1 thìa mật ong Manuka Úc với 150ml nước ấm 40°C uống ấm bụng",
        afternoon: "12:00 - Uống 1 viên Glucosamine 1500mg ngay sau bữa ăn trưa",
        evening: "18:30 - Uống 1 viên Dầu cá Omega-3 sau bữa cơm tối",
      },
      comboDiscountPercent: 10,
      isActive: true,
      items: {
        create: [
          {
            productId: p3.id,
            variantId: p3.variants[0]?.id || null,
            usageInstructions: "1 viên/ngày sau bữa ăn trưa",
            timing: "Trưa",
            quantity: 1,
            isEssential: true,
            sortOrder: 1,
          },
        ],
      },
    },
  });

  // 2. Tạo Ngân Hàng Câu Hỏi Trắc Nghiệm Sức Khỏe Cho 4 Nhóm Đối Tượng
  console.log("❓ 2. Tạo Ngân Hàng Câu Hỏi Trắc Nghiệm...");

  // Nhóm 1: BABY_KIDS (4 câu hỏi)
  await prisma.healthQuizQuestion.create({
    data: {
      targetGroup: HealthTargetGroup.BABY_KIDS,
      questionText: "Độ tuổi hiện tại của bé là bao nhiêu?",
      subtitle: "Giúp xác định chính xác công thức sữa và liều lượng vi chất an toàn",
      stepNumber: 1,
      questionType: QuizQuestionType.SINGLE_CHOICE,
      sortOrder: 1,
      options: {
        create: [
          { label: "Bé sơ sinh (0 - 6 tháng tuổi)", icon: "Baby", sortOrder: 1 },
          { label: "Bé tập ăn dặm (6 - 12 tháng tuổi)", icon: "Baby", sortOrder: 2 },
          { label: "Trẻ chập chững (1 - 3 tuổi)", icon: "Baby", sortOrder: 3 },
          { label: "Trẻ mẫu giáo & tiểu học (Trên 3 tuổi)", icon: "Baby", sortOrder: 4 },
        ],
      },
    },
  });

  await prisma.healthQuizQuestion.create({
    data: {
      targetGroup: HealthTargetGroup.BABY_KIDS,
      questionText: "Vấn đề tiêu hóa & thể trạng nào ba mẹ đang lo lắng nhất ở bé?",
      subtitle: "Chọn vấn đề điển hình nhất đang ảnh hưởng đến sinh hoạt của bé",
      stepNumber: 2,
      questionType: QuizQuestionType.SINGLE_CHOICE,
      sortOrder: 2,
      options: {
        create: [
          {
            label: "Táo bón, đi phân khô cứng, rặn đỏ mặt hoặc đi phân sống",
            subtitle: "Hệ vi sinh đường ruột đang thiếu hụt men tiêu hóa và chất xơ FOS",
            icon: "ShieldAlert",
            recommendedTags: ["probiotics", "digestive", "aptamil"],
            protocolSlug: "phac-do-be-tieu-hoa-kem-bieng-an",
            sortOrder: 1,
          },
          {
            label: "Biếng ăn, ngậm thức ăn lâu, chậm tăng cân so với chuẩn WHO",
            subtitle: "Cơ thể thiếu hụt vi chất Kẽm sinh học và Lysine kích thích vị giác",
            icon: "AlertCircle",
            recommendedTags: ["zinc", "lysine", "appetite"],
            protocolSlug: "phac-do-be-tieu-hoa-kem-bieng-an",
            sortOrder: 2,
          },
          {
            label: "Thấp còi, chậm mọc răng, đêm ngủ hay giật mình đổ mồ hôi trộm",
            subtitle: "Dấu hiệu hấp thu Canxi và Vitamin D3/K2 chưa tối ưu",
            icon: "TrendingUp",
            recommendedTags: ["calcium", "vitamin-d3", "growth"],
            protocolSlug: "phac-do-be-tang-chieu-cao-de-khang",
            sortOrder: 3,
          },
          {
            label: "Thường xuyên ốm vặt, viêm mũi họng mỗi khi thời tiết giao mùa",
            subtitle: "Hàng rào kháng thể tự nhiên và đề kháng hô hấp cần được củng cố",
            icon: "ShieldCheck",
            recommendedTags: ["manuka", "immune", "lactoferrin"],
            protocolSlug: "phac-do-be-tang-chieu-cao-de-khang",
            sortOrder: 4,
          },
        ],
      },
    },
  });

  await prisma.healthQuizQuestion.create({
    data: {
      targetGroup: HealthTargetGroup.BABY_KIDS,
      questionText: "Chế độ dinh dưỡng hàng ngày của bé hiện nay?",
      subtitle: "Để Dược sĩ tính toán khẩu phần vi chất không bị dư thừa",
      stepNumber: 3,
      questionType: QuizQuestionType.SINGLE_CHOICE,
      sortOrder: 3,
      options: {
        create: [
          { label: "Bú sữa mẹ hoàn toàn", icon: "Heart", sortOrder: 1 },
          { label: "Dùng sữa công thức kết hợp ăn dặm", icon: "Coffee", sortOrder: 2 },
          { label: "Ăn cơm cùng gia đình & uống sữa tươi", icon: "Utensils", sortOrder: 3 },
          { label: "Bé kén ăn, hầu như chỉ uống sữa", icon: "AlertCircle", sortOrder: 4 },
        ],
      },
    },
  });

  await prisma.healthQuizQuestion.create({
    data: {
      targetGroup: HealthTargetGroup.BABY_KIDS,
      questionText: "Mục tiêu dinh dưỡng ưu tiên số 1 của ba mẹ trong 3 tháng tới?",
      subtitle: "Phác đồ sẽ tập trung giải quyết triệt để mục tiêu này",
      stepNumber: 4,
      questionType: QuizQuestionType.SINGLE_CHOICE,
      sortOrder: 4,
      options: {
        create: [
          {
            label: "Êm bụng, hết táo bón, bé tự giác ăn ngon miệng và lên cân đều",
            icon: "Smile",
            protocolSlug: "phac-do-be-tieu-hoa-kem-bieng-an",
            sortOrder: 1,
          },
          {
            label: "Bứt phá chiều cao, xương răng chắc khỏe, hoàn thiện thị giác & não bộ",
            icon: "Award",
            protocolSlug: "phac-do-be-tang-chieu-cao-de-khang",
            sortOrder: 2,
          },
          {
            label: "Tăng cường đề kháng tối đa, giảm thiểu việc phải dùng kháng sinh",
            icon: "ShieldCheck",
            protocolSlug: "phac-do-be-tang-chieu-cao-de-khang",
            sortOrder: 3,
          },
        ],
      },
    },
  });

  // Nhóm 2: PREGNANT_MOM (3 câu hỏi)
  await prisma.healthQuizQuestion.create({
    data: {
      targetGroup: HealthTargetGroup.PREGNANT_MOM,
      questionText: "Mẹ đang ở giai đoạn nào của thai kỳ?",
      subtitle: "Mỗi tam cá nguyệt đòi hỏi nhu cầu vi chất và năng lượng khác biệt",
      stepNumber: 1,
      questionType: QuizQuestionType.SINGLE_CHOICE,
      sortOrder: 1,
      options: {
        create: [
          { label: "Chuẩn bị mang thai (3 tháng trước thụ thai)", sortOrder: 1 },
          { label: "Tam cá nguyệt thứ nhất (Tuần 1 - Tuần 13)", sortOrder: 2 },
          { label: "Tam cá nguyệt thứ hai (Tuần 14 - Tuần 27)", sortOrder: 3 },
          { label: "Tam cá nguyệt thứ ba (Tuần 28 - Tuần 40)", sortOrder: 4 },
        ],
      },
    },
  });

  await prisma.healthQuizQuestion.create({
    data: {
      targetGroup: HealthTargetGroup.PREGNANT_MOM,
      questionText: "Tình trạng mẹ cảm thấy khó chịu nhất hiện tại?",
      subtitle: "Dược sĩ sẽ hướng dẫn cách uống vi chất giảm thiểu tối đa triệu chứng này",
      stepNumber: 2,
      questionType: QuizQuestionType.SINGLE_CHOICE,
      sortOrder: 2,
      options: {
        create: [
          {
            label: "Ốm nghén, nôn nao, chóng mặt, không ăn uống được nhiều",
            icon: "AlertCircle",
            protocolSlug: "phac-do-me-bau-toan-dien-giam-nghen",
            sortOrder: 1,
          },
          {
            label: "Chuột rút ban đêm, đau nhức mỏi lưng, ê ẩm vùng xương chậu",
            icon: "Activity",
            protocolSlug: "phac-do-me-bau-toan-dien-giam-nghen",
            sortOrder: 2,
          },
          {
            label: "Uống sắt bị nóng trong, nổi mụn và táo bón nặng",
            icon: "Flame",
            protocolSlug: "phac-do-me-bau-toan-dien-giam-nghen",
            sortOrder: 3,
          },
          {
            label: "Muốn bổ sung đầy đủ DHA và dưỡng chất cho não bộ thai nhi",
            icon: "Brain",
            protocolSlug: "phac-do-me-bau-toan-dien-giam-nghen",
            sortOrder: 4,
          },
        ],
      },
    },
  });

  // Nhóm 3: ELDERLY (2 câu hỏi)
  await prisma.healthQuizQuestion.create({
    data: {
      targetGroup: HealthTargetGroup.ELDERLY,
      questionText: "Tình trạng vận động xương khớp của cô/chú hiện tại?",
      subtitle: "Khảo sát mức độ tổn thương của màng sụn và dịch ổ khớp",
      stepNumber: 1,
      questionType: QuizQuestionType.SINGLE_CHOICE,
      sortOrder: 1,
      options: {
        create: [
          {
            label: "Đau nhức khớp gối khi đứng lên ngồi xuống hoặc leo cầu thang",
            protocolSlug: "phac-do-sun-khop-bo-nao-nguoi-cao-tuoi",
            sortOrder: 1,
          },
          {
            label: "Khớp khô lục cục khi vận động, cứng khớp buổi sáng",
            protocolSlug: "phac-do-sun-khop-bo-nao-nguoi-cao-tuoi",
            sortOrder: 2,
          },
          {
            label: "Đau mỏi thắt lưng, thoái hóa đốt sống cổ hoặc tê bì ngón tay",
            protocolSlug: "phac-do-sun-khop-bo-nao-nguoi-cao-tuoi",
            sortOrder: 3,
          },
        ],
      },
    },
  });

  // 3. Tạo Bản Đánh Giá Mẫu & Lịch Hẹn Tư Vấn Mẫu
  console.log("📝 3. Tạo Bản Đánh Giá Sức Khỏe & Lịch Hẹn Tư Vấn Mẫu...");

  const sampleAssessment = await prisma.userHealthAssessment.create({
    data: {
      targetGroup: HealthTargetGroup.BABY_KIDS,
      customerName: "Nguyễn Thị Mai Anh",
      customerPhone: "0912345678",
      customerEmail: "maianh.nguyen@gmail.com",
      protocolId: protocolBaby.id,
      notes: "Bé 8 tháng tuổi, bú mẹ kết hợp dặm Aptamil Úc, hay bị bón 3 ngày mới đi 1 lần.",
      isSavedToProfile: true,
      quizAnswers: {
        age: "Bé tập ăn dặm (6 - 12 tháng tuổi)",
        digestive: "Táo bón, đi phân khô cứng, rặn đỏ mặt hoặc đi phân sống",
        diet: "Dùng sữa công thức kết hợp ăn dặm",
        goal: "Êm bụng, hết táo bón, bé tự giác ăn ngon miệng và lên cân đều",
      },
      consultationBookings: {
        create: {
          customerName: "Nguyễn Thị Mai Anh",
          phone: "0912345678",
          preferredDate: new Date(Date.now() + 24 * 3600 * 1000),
          preferredTimeSlot: "14:00 - 16:30",
          healthConcerns: "Cần Dược sĩ hướng dẫn cách kết hợp men vi sinh Bio-Oil và sữa Aptamil không bị vón cục.",
          status: ConsultationStatus.PENDING,
          pharmacistNotes: "Đã phân công Dược sĩ Lê Thu Trang phụ trách cuộc gọi tư vấn.",
        },
      },
    },
  });

  console.log("✅ Seed dữ liệu Ngân hàng Câu hỏi & Phác đồ Dinh dưỡng hoàn tất thành công!");
}

main()
  .catch((e) => {
    console.error("❌ Lỗi khi seed protocols:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
