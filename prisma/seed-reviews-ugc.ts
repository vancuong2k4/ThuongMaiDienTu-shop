// ============================================================
// prisma/seed-reviews-ugc.ts
// Kịch bản nạp dữ liệu mẫu Đánh Giá Xác Thực Air-Cargo & Hỏi Đáp (Stage 14.1)
// ============================================================

import { PrismaClient, ReviewStatus } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Bắt đầu nạp dữ liệu mẫu Đánh giá xác thực & Hỏi đáp chuyên gia...");

  // Tìm hoặc lấy 2 tài khoản người dùng có sẵn trong DB
  const users = await prisma.user.findMany({ take: 3 });
  if (users.length === 0) {
    console.log("⚠️ Không có user nào trong hệ thống.");
    return;
  }

  const customerUser = users[0];
  const momUser2 = users[1] || users[0];

  let adminUser = await prisma.user.findFirst({
    where: { role: "ADMIN" },
  });

  // 2. Tìm các sản phẩm chủ lực
  const products = await prisma.product.findMany({
    include: { images: true },
    take: 5,
  });

  if (products.length === 0) {
    console.log("⚠️ Chưa tìm thấy sản phẩm nào trong DB để liên kết đánh giá.");
    return;
  }

  const p1 = products[0]; // Sản phẩm 1 (Sữa hoặc TPCN)
  const p2 = products[1] || products[0]; // Sản phẩm 2
  const p3 = products[2] || products[0]; // Sản phẩm 3

  // 3. Xóa các reviews mẫu cũ nếu có
  await prisma.reviewHelpfulVote.deleteMany({});
  await prisma.productAnswer.deleteMany({});
  await prisma.productQuestion.deleteMany({});
  await prisma.review.deleteMany({});

  console.log("🧹 Đã làm sạch bảng đánh giá và hỏi đáp cũ.");

  // 4. Tạo các đánh giá xác thực bay air (UGC)
  const review1 = await prisma.review.create({
    data: {
      productId: p1.id,
      userId: customerUser.id,
      rating: 5,
      packagingRating: 5,
      freshnessRating: 5,
      effectivenessRating: 5,
      content:
        "Sữa thơm ngậy mát vị thanh gần như sữa mẹ, bé nhà mình trộm vía output đẹp và tăng cân đều đặn. Shop đóng gói bọc xốp bóng khí 3 lớp dày dặn, lon sữa không hề bị móp méo chút nào. Check bill Chemist Warehouse đầy đủ, date bay air mới tinh tận cuối 2027. Sẽ gắn bó lâu dài cùng THUYNGA Shop!",
      images: [
        p1.images[0]?.url || "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800",
        "https://images.unsplash.com/photo-1544816155-12df9643f363?w=800",
      ],
      isVerifiedBuyer: true,
      airCargoVerified: true,
      helpfulCount: 16,
      rewardPoints: 150,
      status: ReviewStatus.FEATURED,
      adminReply:
        "THUYNGA Shop chân thành cảm ơn mẹ Thu Hà đã tin tưởng lựa chọn! Toàn bộ sữa Aptamil tại shop đều được thu mua trực tiếp tại kệ Chemist Úc và bay air về trong 48h để giữ nguyên vẹn hệ vi sinh Synbiotic quý giá cho bé ạ ❤️",
      adminReplyAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), // 2 ngày trước
    },
  });

  const review2 = await prisma.review.create({
    data: {
      productId: p1.id,
      userId: momUser2.id,
      rating: 5,
      packagingRating: 5,
      freshnessRating: 5,
      effectivenessRating: 4,
      content:
        "Đúng chuẩn hàng air xách tay xịn xò. Mở nắp ra hạt sữa tơi mịn, không bị vón cục hay ẩm như một số chỗ đi đường biển container. Bé chịu bú ngay từ cữ đầu tiên. Chăm sóc khách hàng nhiệt tình, giao hàng hỏa tốc trong 2 tiếng tại Hà Nội.",
      images: [
        "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800",
      ],
      isVerifiedBuyer: true,
      airCargoVerified: true,
      helpfulCount: 9,
      rewardPoints: 150,
      status: ReviewStatus.APPROVED,
    },
  });

  const review3 = await prisma.review.create({
    data: {
      productId: p2.id,
      userId: customerUser.id,
      rating: 5,
      packagingRating: 5,
      freshnessRating: 5,
      effectivenessRating: 5,
      content:
        "Mật ong sánh đặc, thơm hương hoa Manuka đặc trưng, vị ngọt dịu và có chút thảo mộc tự nhiên. Mình hay pha 1 thìa với nước ấm mỗi sáng, cổ họng êm hẳn và không bị viêm họng mùa lạnh. Hàng bay air bọc chống sốc cực cẩn thận, tem phụ tiếng Việt và mã vạch chuẩn Úc 93x!",
      images: [
        p2.images[0]?.url || "https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=800",
      ],
      isVerifiedBuyer: true,
      airCargoVerified: true,
      helpfulCount: 12,
      rewardPoints: 150,
      status: ReviewStatus.FEATURED,
      adminReply:
        "Cảm ơn quý khách! Mật ong Manuka Úc chuẩn độ kháng khuẩn MGO cao luôn được bảo quản mát dưới 25°C từ kho Melbourne về đến tận tay khách hàng ạ.",
      adminReplyAt: new Date(Date.now() - 1000 * 60 * 60 * 12),
    },
  });

  const review4 = await prisma.review.create({
    data: {
      productId: p3.id,
      userId: momUser2.id,
      rating: 4,
      packagingRating: 4,
      freshnessRating: 5,
      effectivenessRating: 4,
      content:
        "Sản phẩm dùng tốt, date xa, đóng gói cẩn thận. Mới dùng 1 tuần thấy cơ thể nhẹ nhõm hơn, sẽ tiếp tục theo dõi và ủng hộ shop.",
      images: [],
      isVerifiedBuyer: true,
      airCargoVerified: true,
      helpfulCount: 3,
      rewardPoints: 50,
      status: ReviewStatus.APPROVED,
    },
  });

  // Review đang chờ duyệt (PENDING) để test chức năng Admin CMS Moderation
  const reviewPending = await prisma.review.create({
    data: {
      productId: p2.id,
      userId: momUser2.id,
      rating: 5,
      packagingRating: 5,
      freshnessRating: 5,
      effectivenessRating: 5,
      content:
        "Giao hàng nhanh, bọc hàng kỹ. Hàng có tem bảo đảm chính hãng và phiếu bảo hành đi air. Sẽ giới thiệu cho các mẹ ở công ty cùng mua.",
      images: [],
      isVerifiedBuyer: false,
      airCargoVerified: true,
      helpfulCount: 0,
      rewardPoints: 50,
      status: ReviewStatus.PENDING,
    },
  });

  // 5. Thêm bình chọn hữu ích (Helpful Vote)
  await prisma.reviewHelpfulVote.create({
    data: {
      reviewId: review1.id,
      userId: momUser2.id,
    },
  });

  // 6. Tạo câu hỏi & trả lời chuyên gia (Community Q&A)
  const q1 = await prisma.productQuestion.create({
    data: {
      productId: p1.id,
      userId: customerUser.id,
      question:
        "Cho mình hỏi sữa Aptamil Profutura Úc pha ở nhiệt độ nước bao nhiêu độ C là chuẩn nhất để không làm mất men vi sinh Synbiotic quý của sữa ạ?",
      isAnswered: true,
      status: ReviewStatus.APPROVED,
    },
  });

  await prisma.productAnswer.create({
    data: {
      questionId: q1.id,
      userId: adminUser?.id || customerUser.id,
      answer:
        "Dạ chào mẹ! Nhiệt độ chuẩn nhất để pha sữa Aptamil Profutura Úc là nước ấm khoảng 40°C - 45°C mẹ nhé. Nước quá nóng trên 50°C sẽ làm bất hoạt men vi sinh có lợi Synbiotic và phá vỡ cấu trúc đạm whey quý trong sữa ạ!",
      isOfficial: true,
    },
  });

  const q2 = await prisma.productQuestion.create({
    data: {
      productId: p1.id,
      userId: momUser2.id,
      question:
        "Hàng này shop cam kết bay air 100% hay có đợt đi container đường biển không ạ? Mua cho bé sơ sinh nên mình rất kỹ tính về nhiệt độ bảo quản.",
      isAnswered: true,
      status: ReviewStatus.APPROVED,
    },
  });

  await prisma.productAnswer.create({
    data: {
      questionId: q2.id,
      userId: adminUser?.id || customerUser.id,
      answer:
        "Dạ THUYNGA Shop cam kết 100% sữa công thức Aptamil và TPCN đều được vận chuyển bằng đường hàng không Air-Cargo từ Sydney/Melbourne về sân bay Nội Bài trong khoang mát tiêu chuẩn, có bill mua hàng trực tiếp tại Chemist/Coles/Woolworths để mẹ hoàn toàn an tâm nhé!",
      isOfficial: true,
    },
  });

  console.log("✅ Đã nạp thành công:", {
    reviewsCreated: 5,
    helpfulVotesCreated: 1,
    questionsCreated: 2,
    answersCreated: 2,
  });
}

main()
  .catch((e) => {
    console.error("❌ Lỗi khi nạp dữ liệu mẫu:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
