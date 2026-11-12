// ============================================================
// prisma/seed-chat.ts
// Kịch bản nạp dữ liệu mẫu Cuộc Hội Thoại Live Chat & Tư Vấn Dược Sĩ (Phase 18)
// ============================================================

import {
  PrismaClient,
  ChatSenderRole,
  ChatSessionStatus,
  ChatMessageType,
} from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("💬 Đang nạp dữ liệu mẫu Cuộc Hội Thoại Live Chat & Dược Sĩ (Phase 18)...");

  // 1. Hội thoại 1: Tư vấn Cherry Tasmania bay Air & Giao hỏa tốc
  const session1 = await prisma.chatSession.upsert({
    where: { sessionCode: "CHAT-202611-001" },
    update: {},
    create: {
      sessionCode: "CHAT-202611-001",
      customerName: "Chị Mai Phương",
      customerPhone: "0982345678",
      customerEmail: "maiphuong.hn@gmail.com",
      status: ChatSessionStatus.ACTIVE,
      assignedTo: "Thu Hằng (CSKH)",
      unreadCustomerCount: 0,
      unreadAdminCount: 0,
      lastMessageText: "Dạ được chị nhé! Bên em miễn phí ship hỏa tốc và tặng kèm thiệp dập nổi lời chúc sinh nhật theo yêu cầu ạ.",
      lastMessageAt: new Date(),
    },
  });

  // Xóa tin nhắn cũ nếu có để tránh trùng lặp
  await prisma.chatMessage.deleteMany({
    where: { sessionId: session1.id },
  });

  await prisma.chatMessage.createMany({
    data: [
      {
        sessionId: session1.id,
        senderRole: ChatSenderRole.CUSTOMER,
        senderName: "Chị Mai Phương",
        messageType: ChatMessageType.TEXT,
        content: "Chào shop, đợt Cherry Tasmania Úc size 30-32mm bay Air chuyến mới nhất đã về đến Hà Nội chưa ạ? Bé nhà mình thích ăn cherry nhưng mình sợ hàng trôi nổi bảo quản hóa chất.",
        createdAt: new Date(Date.now() - 3600000 * 2), // 2 giờ trước
      },
      {
        sessionId: session1.id,
        senderRole: ChatSenderRole.SUPPORT_AGENT,
        senderName: "Thu Hằng (CSKH)",
        messageType: ChatMessageType.TEXT,
        content: "Dạ THUYNGA Shop xin chào chị Phương ạ! Lô hàng Cherry Tasmania chuyến bay QF7902 đã hạ cánh Nội Bài trưa hôm qua, bảo quản lạnh 2-4°C suốt hành trình và đã có tem chứng thực AWB trên từng thùng. Chị hoàn toàn yên tâm 100% không lo hàng trôi nổi ạ.",
        createdAt: new Date(Date.now() - 3600000 * 1.8),
      },
      {
        sessionId: session1.id,
        senderRole: ChatSenderRole.CUSTOMER,
        senderName: "Chị Mai Phương",
        messageType: ChatMessageType.TEXT,
        content: "Vậy shop ship cho mình 1 thùng 2kg sang Times City trong chiều nay được không? Có thiệp mừng sinh nhật không shop?",
        createdAt: new Date(Date.now() - 3600000 * 1.5),
      },
      {
        sessionId: session1.id,
        senderRole: ChatSenderRole.SUPPORT_AGENT,
        senderName: "Thu Hằng (CSKH)",
        messageType: ChatMessageType.TEXT,
        content: "Dạ được chị nhé! Bên em miễn phí ship hỏa tốc và tặng kèm thiệp dập nổi lời chúc sinh nhật theo yêu cầu ạ. Em đã lên đơn chuyển bộ phận kho giao ngay cho chị ạ!",
        createdAt: new Date(Date.now() - 3600000 * 1.2),
      },
    ],
  });

  // 2. Hội thoại 2: Tư vấn đổi sữa Aptamil Profutura & Tiêu hóa bé
  const session2 = await prisma.chatSession.upsert({
    where: { sessionCode: "CHAT-202611-002" },
    update: {},
    create: {
      sessionCode: "CHAT-202611-002",
      customerName: "Mẹ Bảo An",
      customerPhone: "0915678901",
      customerEmail: "mebaoan.2026@gmail.com",
      status: ChatSessionStatus.PENDING_PHARMACIST,
      assignedTo: "Dược sĩ Thu Trang",
      unreadCustomerCount: 0,
      unreadAdminCount: 1,
      lastMessageText: "Dược sĩ THUYNGA chào mẹ Bảo An nhé! Với tình trạng bé 7 tháng bụng dạ nhạy cảm, Aptamil Profutura Úc là lựa chọn rất tốt...",
      lastMessageAt: new Date(),
    },
  });

  await prisma.chatMessage.deleteMany({
    where: { sessionId: session2.id },
  });

  await prisma.chatMessage.createMany({
    data: [
      {
        sessionId: session2.id,
        senderRole: ChatSenderRole.CUSTOMER,
        senderName: "Mẹ Bảo An",
        messageType: ChatMessageType.TEXT,
        content: "Chào Dược sĩ, bé nhà em 7 tháng tuổi, dạo này uống sữa công thức hay bị xì xoẹt và nôn trớ nhẹ. Em muốn đổi sang Aptamil Úc Profutura thì nên pha nhiệt độ bao nhiêu và có cần bổ sung thêm men vi sinh Bio Island không ạ?",
        createdAt: new Date(Date.now() - 3600000 * 0.8),
      },
      {
        sessionId: session2.id,
        senderRole: ChatSenderRole.SYSTEM_BOT,
        senderName: "Hệ thống Tự Động",
        messageType: ChatMessageType.TEXT,
        content: "Hệ thống đã tiếp nhận câu hỏi dinh dưỡng chuyên sâu của bạn và chuyển tiếp tới Dược sĩ chuyên môn trực chat. Dược sĩ sẽ tham vấn chuyên môn cho bạn ngay sau đây.",
        createdAt: new Date(Date.now() - 3600000 * 0.7),
      },
      {
        sessionId: session2.id,
        senderRole: ChatSenderRole.PHARMACIST,
        senderName: "Dược sĩ Thu Trang",
        messageType: ChatMessageType.TEXT,
        content: "Dược sĩ THUYNGA chào mẹ Bảo An nhé! Với tình trạng bé 7 tháng bụng dạ nhạy cảm, Aptamil Profutura Úc số 2 là lựa chọn rất tốt nhờ chứa synbiotic độc quyền (men vi sinh Probiotic B.breve M-16V kết hợp chất xơ hòa tan scGOS/lcFOS) giúp hệ vi sinh đường ruột êm dịu. Mẹ nhớ pha nước chuẩn 40°C để bảo toàn vi sinh vật có lợi nhé. Nếu bé đi ngoài phân lỏng trên 3 ngày, mẹ bổ sung thêm men vi sinh nhỏ giọt Bio Island trước cữ bú 15 phút sẽ cải thiện rõ rệt ạ.",
        createdAt: new Date(Date.now() - 3600000 * 0.5),
      },
    ],
  });

  console.log("✅ Đã nạp thành công 2 phiên hội thoại Live Chat mẫu cùng tin nhắn trao đổi chuyên sâu!");
}

main()
  .catch((e) => {
    console.error("Lỗi khi seed dữ liệu chat:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
