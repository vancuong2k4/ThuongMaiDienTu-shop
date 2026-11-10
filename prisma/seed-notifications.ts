// ============================================================
// prisma/seed-notifications.ts
// Khởi tạo Dữ Liệu Mẫu Thông Báo In-App (Stage 11.1)
// ============================================================

import { PrismaClient, NotificationType } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🔔 Bắt đầu khởi tạo dữ liệu Thông Báo Đẩy In-App...");

  // Tìm tất cả khách hàng
  const customers = await prisma.user.findMany({
    where: { role: "CUSTOMER" },
  });

  if (customers.length === 0) {
    console.log("⚠️ Không tìm thấy người dùng nào để seed notifications.");
    return;
  }

  // Dọn dẹp thông báo cũ
  await prisma.notification.deleteMany({});

  const now = new Date();

  for (const customer of customers) {
    const sampleNotifications = [
      {
        userId: customer.id,
        title: "📦 Đơn hàng #TN-20261110-8X9A đang được giao",
        message:
          "Kiện hàng Vitamin Úc & Sữa Hữu Cơ Bubs Organic của bạn đã rời kho trung chuyển và đang được tài xế giao hỏa tốc đến địa chỉ.",
        type: NotificationType.ORDER_STATUS,
        link: "/tai-khoan/don-hang",
        isRead: false,
        createdAt: new Date(now.getTime() - 15 * 60 * 1000), // 15 phút trước
      },
      {
        userId: customer.id,
        title: "⚡ Đại Tiệc Flash Sale Giờ Vàng – Giảm Sốc Tới 35%",
        message:
          "Phiên săn deal hoa quả bay Air Cargo (Cherry Đỏ Mỹ, Nho Mẫu Đơn Shine Muscat) và Dược phẩm DHC Collagen đang diễn ra. Số lượng giới hạn!",
        type: NotificationType.PROMOTION,
        link: "/flash-sale",
        isRead: false,
        createdAt: new Date(now.getTime() - 2 * 60 * 60 * 1000), // 2 giờ trước
      },
      {
        userId: customer.id,
        title: "👑 Chúc mừng bạn đã thăng hạng Hội Viên THUYNGA Club!",
        message:
          "Bạn đã chính thức mở khóa đặc quyền hoàn điểm tới 3%, ưu tiên kết nối Hotline Dược sĩ 24/7 và quyền lợi giao hàng bay Air độc quyền.",
        type: NotificationType.LOYALTY_TIER,
        link: "/tai-khoan/tich-diem",
        isRead: false,
        createdAt: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000), // 1 ngày trước
      },
      {
        userId: customer.id,
        title: "🎁 Quà Tặng Tri Ân Hội Viên: Voucher Độc Quyền Đã Về Ví",
        message:
          "THUYNGA Shop gửi tặng bạn mã giảm giá đặc quyền hội viên thân thiết. Hãy vào gian hàng đổi thưởng để kích hoạt và sử dụng ngay.",
        type: NotificationType.LOYALTY_TIER,
        link: "/tai-khoan/tich-diem",
        isRead: true,
        readAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000),
        createdAt: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000), // 3 ngày trước
      },
      {
        userId: customer.id,
        title: "✅ Giao hàng thành công: Đơn hàng #TN-20261025-4K2M",
        message:
          "Đơn hàng của bạn đã được giao thành công. +215 điểm THUYNGA Club đã được cộng vào tài khoản của bạn.",
        type: NotificationType.ORDER_STATUS,
        link: "/tai-khoan/don-hang",
        isRead: true,
        readAt: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000),
        createdAt: new Date(now.getTime() - 6 * 24 * 60 * 60 * 1000), // 6 ngày trước
      },
      {
        userId: customer.id,
        title: "🛡️ Cập nhật bảo mật & Hệ thống THUYNGA Shop",
        message:
          "Hệ thống xác thực 2 lớp và thanh toán VietQR Napas 24/7 đã được nâng cấp hoàn tất với tốc độ xử lý tức thì dưới 1 giây.",
        type: NotificationType.SYSTEM,
        link: null,
        isRead: true,
        readAt: new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000),
        createdAt: new Date(now.getTime() - 12 * 24 * 60 * 60 * 1000),
      },
    ];

    for (const notif of sampleNotifications) {
      await prisma.notification.create({ data: notif });
    }
  }

  const count = await prisma.notification.count();
  console.log(`✅ Khởi tạo thành công ${count} thông báo mẫu cho các tài khoản!`);
}

main()
  .catch((e) => {
    console.error("❌ Lỗi khi seed notifications:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
