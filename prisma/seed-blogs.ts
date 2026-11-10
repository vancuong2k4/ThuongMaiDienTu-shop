// ============================================================
// prisma/seed-blogs.ts
// Nạp dữ liệu 6 bài viết cẩm nang y khoa & sức khỏe chuyên sâu
// ============================================================

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const sampleBlogs = [
  {
    title: "Hướng Dẫn Sử Dụng Hồng Sâm Hàn Quốc Đúng Cách Cho Người Lớn Tuổi",
    slug: "huong-dan-su-dung-hong-sam-han-quoc-dung-cach-cho-nguoi-lon-tuoi",
    category: "Cẩm nang sức khỏe",
    authorName: "Dược sĩ Thu Nga",
    readingTime: 6,
    viewCount: 1420,
    isFeatured: true,
    isPublished: true,
    publishedAt: new Date("2026-10-25T08:00:00Z"),
    coverImage:
      "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=1200&auto=format&fit=crop",
    excerpt:
      "Hồng sâm 6 năm tuổi KGC Jung Kwan Jang là thượng phẩm bồi bổ nguyên khí, tăng cường tuần hoàn não. Tuy nhiên, người cao tuổi cần nắm rõ liều lượng và thời điểm uống để đạt hiệu quả cao nhất mà không gây mất ngủ.",
    content: `
<h2>1. Vì sao hồng sâm 6 năm tuổi là lựa chọn vàng cho người cao tuổi?</h2>
<p>Khi bước qua độ tuổi 60, các cơ quan trong cơ thể dần suy giảm chức năng, đặc biệt là hệ tuần hoàn, tim mạch và hệ miễn dịch. Hồng sâm Hàn Quốc trải qua quy trình hấp sấy 9 lần tạo ra hàm lượng <strong>Ginsenoside Rg1, Rb1, Rg3</strong> cao gấp nhiều lần nhân sâm tươi, có tác dụng kích thích lưu thông máu và phòng ngừa xơ vữa động mạch.</p>

<p>Tại THUYNGA Shop, toàn bộ hồng sâm củ khô KGC Jung Kwan Jang đều được nhập khẩu nguyên hộp thiếc có chứng nhận của Tập đoàn Nhân sâm Hàn Quốc.</p>

<h2>2. Thời điểm vàng uống hồng sâm trong ngày</h2>
<ul>
  <li><strong>Buổi sáng (07:00 - 08:30):</strong> Thời điểm cơ thể hấp thu dưỡng chất tốt nhất sau khi ăn sáng nhẹ 15-20 phút.</li>
  <li><strong>Buổi trưa (11:30 - 13:00):</strong> Giúp phục hồi thể lực và duy trì sự tỉnh táo cho buổi chiều.</li>
  <li><strong>Lưu ý quan trọng:</strong> Tuyệt đối không dùng hồng sâm sau 18:00 tối vì hoạt chất kích thích thần kinh nhẹ có thể gây khó ngủ cho người già.</li>
</ul>

<h2>3. Các cách dùng hồng sâm củ khô thơm ngon và bổ dưỡng</h2>
<p>Có 3 phương pháp sử dụng phổ biến nhất được các chuyên gia khuyên dùng:</p>
<ol>
  <li><strong>Thái lát ngậm trực tiếp:</strong> Hấp cách thủy củ sâm cho mềm, dùng dao sắc thái lát mỏng 1-2mm. Mỗi ngày ngậm và nhai nuốt 2-3 lát.</li>
  <li><strong>Hãm trà hồng sâm táo đỏ:</strong> Cho 3-5 lát sâm cùng 2 quả táo đỏ Hàn Quốc vào ấm nước sôi, ủ 15 phút là có tách trà thanh mát, thơm nồng.</li>
  <li><strong>Ngâm mật ong rừng nguyên chất:</strong> Xếp các lát sâm vào hũ thủy tinh, đổ ngập mật ong bạc hà hoặc mật ong hoa nhãn. Sau 2 tuần là có thể sử dụng mỗi sáng 1 thìa cafe.</li>
</ol>

<blockquote>
  <p><strong>Cảnh báo y khoa:</strong> Người đang có huyết áp cao kịch phát (trên 180mmHg) hoặc đang sốt cao, tiêu chảy cấp cần tạm ngưng sử dụng hồng sâm cho đến khi thể trạng ổn định.</p>
</blockquote>
    `,
    seoTitle: "Cách Dùng Hồng Sâm KGC Cho Người Lớn Tuổi Đúng Cách | THUYNGA Shop",
    seoDesc:
      "Hướng dẫn chi tiết từ Dược sĩ Thu Nga về liều lượng, thời điểm vàng và cách chế biến hồng sâm củ khô Hàn Quốc giúp người lớn tuổi bồi bổ sức khỏe an toàn.",
    seoKeywords: "hong sam han quoc, cach dung hong sam, hong sam kgc, nguoi cao tuoi",
  },
  {
    title: "So Sánh Sữa Bột Aptamil Úc Và Aptamil Anh: Loại Nào Phù Hợp Hơn Cho Bé?",
    slug: "so-sanh-sua-bot-aptamil-uc-va-aptamil-anh-loai-nao-phu-hop-hon",
    category: "Dinh dưỡng mẹ & bé",
    authorName: "Chuyên gia Dinh dưỡng Minh Hà",
    readingTime: 7,
    viewCount: 2150,
    isFeatured: true,
    isPublished: true,
    publishedAt: new Date("2026-10-26T09:30:00Z"),
    coverImage:
      "https://images.unsplash.com/photo-1555252333-9f8e92e65df9?q=80&w=1200&auto=format&fit=crop",
    excerpt:
      "Aptamil Profutura Úc (lon thiếc lùn) và Aptamil Profutura Anh là hai dòng sữa công thức cao cấp bậc nhất hiện nay. Mẹ bỉm sữa nên chọn dòng nào để bé tăng cân đều, tiêu hóa khỏe và phát triển trí não tối ưu?",
    content: `
<h2>1. Tổng quan về dòng sữa Aptamil Profutura</h2>
<p>Cả hai dòng sữa đều thuộc tập đoàn dinh dưỡng hàng đầu Danone Nutricia, nổi tiếng với công thức độc quyền <strong>Synbiotic</strong> kết hợp giữa Prebiotics GOS/FOS và lợi khuẩn sống Probiotics B.breve M-16V giúp hệ vi sinh đường ruột của bé khỏe mạnh tương đương bú sữa mẹ.</p>

<h2>2. Bảng so sánh thành phần chi tiết</h2>
<table border="1" cellpadding="8" style="border-collapse:collapse;width:100%;text-align:left;">
  <thead>
    <tr style="background:#f8fafc;">
      <th>Tiêu chí</th>
      <th>Aptamil Úc (Profutura Synbiotic)</th>
      <th>Aptamil Anh (Profutura First Infant)</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>Đóng gói</strong></td>
      <td>Lon thiếc 900g, nắp gài kín chống ẩm</td>
      <td>Hộp giấy Eazypack 800g</td>
    </tr>
    <tr>
      <td><strong>Chất béo</strong></td>
      <td>Hàm lượng chất béo từ sữa bò chăn thả cao hơn, giúp bé chắc thịt</td>
      <td>Chất béo trung tính từ dầu thực vật cao cấp</td>
    </tr>
    <tr>
      <td><strong>Hàm lượng DHA</strong></td>
      <td>Chiết xuất từ dầu cá ngừ đại dương tinh khiết (cao hơn ~20%)</td>
      <td>DHA tiêu chuẩn châu Âu</td>
    </tr>
    <tr>
      <td><strong>Vị sữa</strong></td>
      <td>Thanh mát, thơm ngậy nhẹ, rất dễ uống</td>
      <td>Nhạt thanh, gần giống sữa mẹ nhất</td>
    </tr>
  </tbody>
</table>

<h2>3. Lời khuyên chọn sữa từ chuyên gia</h2>
<p>Nếu mẹ ưu tiên bé phát triển toàn diện, có cân nặng đầm thịt và hỗ trợ tăng cường hệ miễn dịch tối đa, dòng <strong>Aptamil Úc</strong> là sự đầu tư xứng đáng. Lon thiếc 900g cũng bảo quản tốt hơn trước khí hậu nhiệt đới ẩm tại Việt Nam.</p>
    `,
    seoTitle: "So Sánh Sữa Aptamil Úc Và Aptamil Anh Chi Tiết 2026 | THUYNGA Shop",
    seoDesc:
      "Phân tích chuyên sâu thành phần dinh dưỡng, khả năng tăng cân, phát triển trí não giữa Aptamil Úc lon thiếc 900g và Aptamil Anh giúp mẹ chọn đúng sữa cho con.",
    seoKeywords: "aptamil uc, aptamil anh, so sanh aptamil, sua bot cho be",
  },
  {
    title: "Bí Quyết Chọn Và Bảo Quản Cherry Đỏ Mỹ Đường Bay Chuẩn Tươi Tuyển Chọn",
    slug: "bi-quyet-chon-va-bao-quan-cherry-do-my-duong-bay-chuan-tuoi",
    category: "Kiến thức trái cây bay",
    authorName: "Thu Nga Fruits",
    readingTime: 5,
    viewCount: 980,
    isFeatured: true,
    isPublished: true,
    publishedAt: new Date("2026-10-27T10:15:00Z"),
    coverImage:
      "https://images.unsplash.com/photo-1528825871115-3581a5387919?q=80&w=1200&auto=format&fit=crop",
    excerpt:
      "Cherry đỏ Mỹ size 9.0 hàng bay (Air Cargo) luôn là tâm điểm của giới sành ăn nhờ vị ngọt đậm, trái giòn sần sật và cuống xanh mướt. Hướng dẫn cách phân biệt cherry bay và cherry tàu biển đông lạnh.",
    content: `
<h2>1. Cherry hàng bay Air Cargo khác gì Cherry đi tàu biển?</h2>
<p>Cherry là loại quả có lớp vỏ mỏng manh, lượng đường cao và cực kỳ nhạy cảm với nhiệt độ:</p>
<ul>
  <li><strong>Hàng bay Air Cargo (48h):</strong> Sau khi thu hoạch tại vườn bang Washington, cherry được xử lý sốc lạnh Hydrocooler và bay thẳng về Sân bay Nội Bài trong vòng 48 giờ. Trái giữ nguyên cuống xanh tươi rói, căng bóng và giòn rụm.</li>
  <li><strong>Hàng đi tàu biển (25-35 ngày):</strong> Cherry phải trải qua gần 1 tháng lênh đênh trên biển ở nhiệt độ âm, cuống ngả nâu đen, thịt quả mềm nhão và vị ngọt bị nhạt dần.</li>
</ul>

<h2>2. Bảng quy chuẩn kích cỡ (Size) Cherry Mỹ</h2>
<p>Tại Mỹ, kích thước cherry được tính theo thang đo chuẩn quốc tế:</p>
<ul>
  <li><strong>Size 8.5 (đường kính > 31.5mm):</strong> Cỡ cự đại thượng hạng, sản lượng cực hiếm.</li>
  <li><strong>Size 9.0 (đường kính 29.8 - 31.4mm):</strong> Tiêu chuẩn cao cấp tại THUYNGA Shop, trái to bằng đồng xu 5.000₫, giòn ngọt đỉnh cao.</li>
  <li><strong>Size 9.5 & 10:</strong> Kích cỡ thông thường trong siêu thị phổ thông.</li>
</ul>

<h2>3. Cách bảo quản tại nhà giữ độ giòn tới 10 ngày</h2>
<ol>
  <li>Không rửa trước khi cho vào tủ lạnh (nước đọng ở cuống sẽ khiến cherry nhanh nấm mốc).</li>
  <li>Lót một lớp khăn giấy khô dưới đáy hộp nhựa có nắp đậy kín.</li>
  <li>Bảo quản ở ngăn mát tủ lạnh với dải nhiệt độ lý tưởng <strong>0°C đến 4°C</strong>.</li>
  <li>Chỉ rửa đúng lượng vừa ăn dưới vòi nước lạnh nhẹ trước khi thưởng thức.</li>
</ol>
    `,
    seoTitle: "Bí Quyết Chọn Cherry Đỏ Mỹ Size 9.0 Hàng Bay Chuẩn Tươi | THUYNGA Shop",
    seoDesc:
      "Cách nhận biết Cherry Mỹ nhập khẩu đường bay Air Cargo cuống xanh giòn rụm và phương pháp bảo quản giữ trọn vitamin tại nhà lên đến 10 ngày.",
    seoKeywords: "cherry do my, cherry size 9, cherry hang bay, bao quan cherry",
  },
  {
    title: "5 Dấu Hiệu Nhận Biết Tảo Xoắn Spirulina Nhật Bản Thật Và Giả",
    slug: "5-dau-hieu-nhan-biet-tao-xoan-spirulina-nhat-ban-that-va-gia",
    category: "Mẹo phân biệt thật - giả",
    authorName: "Dược sĩ Thu Nga",
    readingTime: 5,
    viewCount: 3120,
    isFeatured: false,
    isPublished: true,
    publishedAt: new Date("2026-10-28T14:00:00Z"),
    coverImage:
      "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?q=80&w=1200&auto=format&fit=crop",
    excerpt:
      "Tảo xoắn Spirulina Algae 2200 viên nội địa Nhật Bản là một trong những sản phẩm bị làm giả tinh vi nhất trên thị trường. Hãy kiểm tra ngay 5 chi tiết sau để bảo vệ sức khỏe gia đình.",
    content: `
<h2>1. Kiểm tra màu sắc và độ nén của viên tảo</h2>
<p>Viên tảo thật được ép lạnh từ 100% bột tảo Spirulina nguyên chất vùng nước sâu Kumejima đảo Okinawa:</p>
<ul>
  <li><strong>Tảo thật:</strong> Viên màu xanh lục đậm hơi ánh đen, bề mặt mịn màng đồng nhất, không bóng loáng. Khi cắn thử có vị mằn mặn tự nhiên của khoáng biển và mùi tanh nhẹ đặc trưng của tảo biển.</li>
  <li><strong>Tảo giả:</strong> Viên màu xanh nhạt hoặc xanh lá cây nhân tạo, cắn vào có vị chua bùi của bột mì pha trộn hoặc phẩm màu hóa chất.</li>
</ul>

<h2>2. Thử nghiệm độ tan trong nước ấm</h2>
<p>Thả 1 viên tảo vào ly nước ấm 40°C trong 5 phút:</p>
<ul>
  <li><strong>Tảo chính hãng:</strong> Viên tảo từ từ phồng lên và hòa tan thành lớp nước màu xanh lam thẫm đồng nhất, không có cặn lợn cợn tách lớp.</li>
  <li><strong>Tảo làm giả:</strong> Nước đổi màu xanh lơ hóa chất rất nhanh, dưới đáy ly đọng lớp cặn bột trắng của chất độn phụ gia.</li>
</ul>

<h2>3. Vỏ hộp và tem chống hàng giả</h2>
<p>Toàn bộ sản phẩm Tảo xoắn Spirulina tại THUYNGA Shop đều có tem phụ tiếng Việt theo quy định của Bộ Y Tế, số lô sản xuất dập nổi sắc nét dưới đáy lọ và mã vạch chuẩn đầu 49 của Nhật Bản.</p>
    `,
    seoTitle: "Phân Biệt Tảo Xoắn Spirulina Nhật Bản Thật Giả Chi Tiết | THUYNGA Shop",
    seoDesc:
      "5 cách nhận biết Tảo xoắn Spirulina Algae 2200 viên Nhật Bản chính hãng đơn giản và chuẩn xác nhất giúp người tiêu dùng tránh mua phải hàng nhái kém chất lượng.",
    seoKeywords: "tao xoan nhat ban, tao spirulina, phan biet tao that gia, hang noi dia nhat",
  },
  {
    title: "Vai Trò Then Chốt Của Bộ Đôi Vitamin D3 K2 MK7 Đối Với Chiều Cao Trẻ Nhỏ",
    slug: "vai-tro-then-chot-cua-bo-doi-vitamin-d3-k2-mk7-cho-chieu-cao-tre",
    category: "Dinh dưỡng mẹ & bé",
    authorName: "Dược sĩ Thu Nga",
    readingTime: 6,
    viewCount: 1890,
    isFeatured: false,
    isPublished: true,
    publishedAt: new Date("2026-10-29T11:00:00Z"),
    coverImage:
      "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?q=80&w=1200&auto=format&fit=crop",
    excerpt:
      "Bổ sung Canxi mà thiếu Vitamin D3 và K2 MK7 chẳng khác nào 'xe không có người lái'. Khám phá cơ chế vận chuyển Canxi thẳng vào xương giúp bé bứt phá chiều cao ngay từ những năm tháng đầu đời.",
    content: `
<h2>1. Cơ chế 'kiềng ba chân' hấp thu Canxi</h2>
<p>Nhiều bậc phụ huynh lầm tưởng rằng chỉ cần cho con uống thật nhiều Canxi là con sẽ cao lớn. Tuy nhiên:</p>
<ul>
  <li><strong>Canxi:</strong> Là gạch đá để xây dựng khung xương.</li>
  <li><strong>Vitamin D3:</strong> Đóng vai trò là 'người gác cổng', giúp hấp thu Canxi từ thức ăn qua thành ruột vào máu.</li>
  <li><strong>Vitamin K2 (dạng MK7):</strong> Đóng vai trò là 'người dẫn đường', kích hoạt protein Osteocalcin để đưa Canxi trong máu gắn thẳng vào mô xương và răng, ngăn ngừa Canxi lắng đọng vào thành mạch máu hoặc thận.</li>
</ul>

<h2>2. Tại sao nên chọn Vitamin D3 K2 MK7 nguồn gốc tự nhiên?</h2>
<p>Dòng D3 K2 Sunday Natural của Đức sử dụng 100% MK7 K2VITAL® tinh khiết dạng all-trans từ thảo dược tự nhiên kết hợp dầu vận chuyển MCT dừa hữu cơ, giúp hấp thu tối đa mà không gây kích ứng đường tiêu hóa nhạy cảm của trẻ sơ sinh.</p>
    `,
    seoTitle: "Tại Sao Trẻ Cần Bổ Sung Vitamin D3 K2 MK7 Đúng Cách? | THUYNGA Shop",
    seoDesc:
      "Dược sĩ Thu Nga giải thích cơ chế hiệp đồng giữa Vitamin D3 và K2 MK7 giúp vận chuyển canxi vào xương tối đa, thúc đẩy tăng trưởng chiều cao cho bé.",
    seoKeywords: "vitamin d3 k2 mk7, phat trien chieu cao, canxi cho be, sunday natural",
  },
  {
    title: "Vì Sao Thực Phẩm Chức Năng Và Trái Cây Bắt Buộc Phải Vận Chuyển Bằng Air Cargo?",
    slug: "vi-sao-thuc-pham-chuc-nang-va-trai-cay-phai-van-chuyen-bang-air-cargo",
    category: "Lối sống lành mạnh",
    authorName: "Ban Quản Trị THUYNGA Shop",
    readingTime: 4,
    viewCount: 850,
    isFeatured: false,
    isPublished: true,
    publishedAt: new Date("2026-10-30T16:20:00Z"),
    coverImage:
      "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=1200&auto=format&fit=crop",
    excerpt:
      "Không giống như hàng gia dụng hay quần áo, thực phẩm chức năng và trái cây tươi chứa các hoạt chất sinh học rất nhạy cảm với nhiệt độ. Đó là lý do THUYNGA Shop 100% nói KHÔNG với hàng container biển giá rẻ.",
    content: `
<h2>1. Cái giá của việc vận chuyển bằng tàu biển giá rẻ</h2>
<p>Nhiều đơn vị xách tay trôi nổi lựa chọn chuyển hàng qua đường biển để tiết kiệm chi phí vận chuyển (rẻ hơn 4-5 lần so với đường hàng không). Tuy nhiên, nhiệt độ trong thùng container biển vào mùa hè có thể lên tới <strong>50°C - 60°C</strong> kéo dài suốt 1-2 tháng lênh đênh:</p>
<ul>
  <li>Viên nang dầu cá Omega-3 bị oxy hóa, biến chất và có mùi khét tanh.</li>
  <li>Lợi khuẩn sống Men vi sinh (Probiotics) bị tiêu diệt gần như hoàn toàn trước nhiệt độ cao.</li>
  <li>Collagen và Vitamin C dạng nước bị đổi màu nâu sẫm, mất tác dụng sinh học.</li>
</ul>

<h2>2. Cam kết vận chuyển Air Cargo kiểm soát nhiệt độ tại THUYNGA Shop</h2>
<p>Tại THUYNGA Shop, 100% sản phẩm được đặt khoang hành lý chuyên dụng Air Cargo bay thẳng từ Úc, Nhật, Hàn, Mỹ về Việt Nam trong 24-48 giờ. Hàng hóa được đóng thùng xốp chuyên dụng kèm đá gel cách nhiệt giữ nhiệt độ khoang mát 2-8°C, bảo toàn 100% hoạt tính dược liệu nguyên vẹn như vừa mua tại hiệu thuốc bản xứ.</p>
    `,
    seoTitle: "Tiêu Chuẩn Vận Chuyển Air Cargo Tại THUYNGA Shop | Cam Kết Chính Hãng",
    seoDesc:
      "Tìm hiểu lý do THUYNGA Shop kiên quyết vận chuyển 100% thực phẩm chức năng và trái cây nhập khẩu bằng đường hàng không Air Cargo chuẩn nhiệt độ quốc tế.",
    seoKeywords: "air cargo, van chuyen hang bay, chat luong thuc pham chuc nang, cam ket chinh hang",
  },
];

async function main() {
  console.log("🌱 Bắt đầu nạp bài viết Cẩm Nang Sức Khỏe & Blog...");

  for (const blog of sampleBlogs) {
    const existing = await prisma.blogPost.findUnique({
      where: { slug: blog.slug },
    });

    if (existing) {
      await prisma.blogPost.update({
        where: { slug: blog.slug },
        data: blog,
      });
      console.log(`  ✔ Cập nhật bài viết: [${blog.category}] ${blog.title}`);
    } else {
      await prisma.blogPost.create({
        data: blog,
      });
      console.log(`  ✔ Tạo mới bài viết: [${blog.category}] ${blog.title}`);
    }
  }

  const count = await prisma.blogPost.count();
  console.log(`🎉 Hoàn tất nạp dữ liệu! Tổng số bài viết hiện có trong DB: ${count}`);
}

main()
  .catch((e) => {
    console.error("❌ Lỗi khi nạp seed blog:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
