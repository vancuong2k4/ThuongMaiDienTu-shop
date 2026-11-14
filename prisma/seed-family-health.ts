import { PrismaClient, FamilyRelation, SupplementTimeSlot, IntakeLogStatus } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Bắt đầu nạp dữ liệu Tủ Thuốc Sức Khỏe Gia Đình (Phase 22)...");

  // 1. Lấy user đầu tiên (hoặc tạo user mẫu nếu chưa có)
  let user = await prisma.user.findFirst({
    where: { role: "CUSTOMER" },
  });

  if (!user) {
    user = await prisma.user.findFirst();
  }

  if (!user) {
    console.log("⚠️ Không tìm thấy người dùng nào trong cơ sở dữ liệu. Vui lòng tạo tài khoản trước.");
    return;
  }

  // Lấy sản phẩm có sẵn để liên kết
  const aptamilProduct = await prisma.product.findFirst({
    where: { slug: { contains: "aptamil" } },
  });
  const blackmoresProduct = await prisma.product.findFirst({
    where: { slug: { contains: "blackmores" } },
  });

  // 2. Thành viên 1: Bé Bon (3 tuổi) - Con cái
  const childProfile = await prisma.familyMemberProfile.upsert({
    where: { id: "family-mem-bon" },
    update: {},
    create: {
      id: "family-mem-bon",
      userId: user.id,
      fullName: "Bé Bon (3 tuổi)",
      relation: FamilyRelation.CHILD,
      dateOfBirth: new Date("2023-05-15T00:00:00Z"),
      gender: "MALE",
      avatarEmoji: "👶",
      healthGoals: ["Tăng đề kháng hô hấp", "Phát triển chiều cao", "Bổ sung DHA phát triển não bộ"],
      allergies: ["Không có dị ứng"],
      weightKg: 14.5,
      heightCm: 96.0,
      notes: "Bé thích vị sữa nhạt thanh Aptamil Profutura, uống buổi sáng sau ăn",
    },
  });

  // Lịch uống Bé Bon
  const schedule1 = await prisma.memberSupplementSchedule.upsert({
    where: { id: "sched-bon-aptamil" },
    update: {},
    create: {
      id: "sched-bon-aptamil",
      memberProfileId: childProfile.id,
      productId: aptamilProduct?.id || null,
      customItemName: "Sữa Aptamil Profutura Synbiotic Số 3 Úc",
      brandName: "Aptamil Nutricia",
      timeSlot: SupplementTimeSlot.MORNING_AFTER_MEAL,
      timeString: "07:30",
      dosageText: "200ml sữa ấm (4 muỗng gạt cùng 180ml nước 40°C)",
      dailyFrequency: 1,
      totalServingsPerBox: 30,
      servingsRemaining: 8, // Sắp hết (còn 8 ngày) -> Cảnh báo restock
      startDate: new Date(Date.now() - 22 * 24 * 60 * 60 * 1000),
      estimatedEmptyDate: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000),
      isActive: true,
      reminderEnabled: true,
      notes: "Kèm men Synbiotics bảo vệ hệ tiêu hóa non nớt",
    },
  });

  const schedule2 = await prisma.memberSupplementSchedule.upsert({
    where: { id: "sched-bon-dha" },
    update: {},
    create: {
      id: "sched-bon-dha",
      memberProfileId: childProfile.id,
      customItemName: "Bio Island DHA For Kids Dầu Cá Úc",
      brandName: "Bio Island",
      timeSlot: SupplementTimeSlot.MORNING_AFTER_MEAL,
      timeString: "08:15",
      dosageText: "1 viên/ngày (cắt đuôi cá hòa vào thìa cháo hoặc nước)",
      dailyFrequency: 1,
      totalServingsPerBox: 60,
      servingsRemaining: 42,
      startDate: new Date(Date.now() - 18 * 24 * 60 * 60 * 1000),
      estimatedEmptyDate: new Date(Date.now() + 42 * 24 * 60 * 60 * 1000),
      isActive: true,
      reminderEnabled: true,
      notes: "Chiết xuất vi tảo biển tự nhiên, không mùi tanh",
    },
  });

  // 3. Thành viên 2: Mẹ Thảo (32 tuổi) - Bản thân
  const momProfile = await prisma.familyMemberProfile.upsert({
    where: { id: "family-mem-mom" },
    update: {},
    create: {
      id: "family-mem-mom",
      userId: user.id,
      fullName: "Mẹ Thảo (Bản thân)",
      relation: FamilyRelation.SELF,
      dateOfBirth: new Date("1994-08-20T00:00:00Z"),
      gender: "FEMALE",
      avatarEmoji: "👩",
      healthGoals: ["Phục hồi tóc & móng sau sinh", "Bổ máu ngừa thiếu sắt", "Bảo vệ thị lực"],
      allergies: ["Không có dị ứng"],
      weightKg: 52.0,
      heightCm: 162.0,
      notes: "Uống Sắt vào cữ trưa để cách xa Canxi buổi sáng ít nhất 2 giờ chuẩn Dược sĩ chỉ định",
    },
  });

  // Lịch uống Mẹ Thảo
  const schedule3 = await prisma.memberSupplementSchedule.upsert({
    where: { id: "sched-mom-collagen" },
    update: {},
    create: {
      id: "sched-mom-collagen",
      memberProfileId: momProfile.id,
      productId: blackmoresProduct?.id || null,
      customItemName: "Blackmores Nails Hair & Skin Úc",
      brandName: "Blackmores",
      timeSlot: SupplementTimeSlot.MORNING_AFTER_MEAL,
      timeString: "08:00",
      dosageText: "1 viên sau bữa ăn sáng cùng nước ấm",
      dailyFrequency: 1,
      totalServingsPerBox: 60,
      servingsRemaining: 35,
      startDate: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000),
      estimatedEmptyDate: new Date(Date.now() + 35 * 24 * 60 * 60 * 1000),
      isActive: true,
      reminderEnabled: true,
      notes: "Cung cấp Silica, Vitamin C và Kẽm tự nhiên",
    },
  });

  const schedule4 = await prisma.memberSupplementSchedule.upsert({
    where: { id: "sched-mom-iron" },
    update: {},
    create: {
      id: "sched-mom-iron",
      memberProfileId: momProfile.id,
      customItemName: "Blackmores Bio Iron Advanced Hữu Cơ",
      brandName: "Blackmores",
      timeSlot: SupplementTimeSlot.NOON_AFTER_MEAL,
      timeString: "12:30",
      dosageText: "1 viên sau bữa trưa cùng 1 cốc nước cam tươi",
      dailyFrequency: 1,
      totalServingsPerBox: 30,
      servingsRemaining: 4, // Cảnh báo sắp hết (còn 4 ngày) -> Cần mua bổ sung
      startDate: new Date(Date.now() - 26 * 24 * 60 * 60 * 1000),
      estimatedEmptyDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000),
      isActive: true,
      reminderEnabled: true,
      notes: "Không uống cùng sữa hoặc trà xanh để tối ưu hấp thu",
    },
  });

  // 4. Thành viên 3: Bà Nội (68 tuổi) - Ông bà
  const grandmaProfile = await prisma.familyMemberProfile.upsert({
    where: { id: "family-mem-grandma" },
    update: {},
    create: {
      id: "family-mem-grandma",
      userId: user.id,
      fullName: "Bà Nội (68 tuổi)",
      relation: FamilyRelation.GRANDPARENT,
      dateOfBirth: new Date("1958-12-10T00:00:00Z"),
      gender: "FEMALE",
      avatarEmoji: "👵",
      healthGoals: ["Khớp gối linh hoạt, giảm đau mỏi", "Tim mạch & huyết áp ổn định", "Ngủ ngon sâu giấc"],
      allergies: ["Dị ứng hải sản vỏ mềm"],
      weightKg: 58.0,
      heightCm: 155.0,
      notes: "Cần nhắc nhở uống đều đặn mỗi sáng và tối",
    },
  });

  const schedule5 = await prisma.memberSupplementSchedule.upsert({
    where: { id: "sched-grandma-glucosamine" },
    update: {},
    create: {
      id: "sched-grandma-glucosamine",
      memberProfileId: grandmaProfile.id,
      customItemName: "Blackmores Glucosamine Sulfate 1500mg One-A-Day",
      brandName: "Blackmores",
      timeSlot: SupplementTimeSlot.MORNING_AFTER_MEAL,
      timeString: "08:30",
      dosageText: "1 viên sau ăn sáng (viên nén tan chậm)",
      dailyFrequency: 1,
      totalServingsPerBox: 180,
      servingsRemaining: 120,
      startDate: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
      estimatedEmptyDate: new Date(Date.now() + 120 * 24 * 60 * 60 * 1000),
      isActive: true,
      reminderEnabled: true,
      notes: "Tái tạo dịch khớp gối sụn, duy trì liên tục 3-6 tháng",
    },
  });

  // 5. Nạp Intake Logs hôm nay
  const todayStr = new Date().toISOString().slice(0, 10);
  const todayDate = new Date(`${todayStr}T00:00:00Z`);

  await prisma.supplementIntakeLog.upsert({
    where: {
      scheduleId_logDate: {
        scheduleId: schedule1.id,
        logDate: todayDate,
      },
    },
    update: {},
    create: {
      scheduleId: schedule1.id,
      memberProfileId: childProfile.id,
      logDate: todayDate,
      status: IntakeLogStatus.TAKEN,
      takenAt: new Date(),
      notes: "Bé đã uống hết bình 200ml lúc 07:45",
    },
  });

  console.log("✅ Nạp thành công dữ liệu Tủ Thuốc Sức Khỏe Gia Đình Đa Thế Hệ!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
