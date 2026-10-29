# 🛍️ THUYNGA SHOP – HỆ THỐNG THƯƠNG MẠI ĐIỆN TỬ HÀNG NHẬP KHẨU CAO CẤP

> **Dự án E-commerce độc quyền chính hãng:** Thực phẩm chức năng, Thực phẩm & Đồ uống nhập khẩu, Trái cây tươi Air Cargo, Mỹ phẩm & Chăm sóc cá nhân, Mẹ & Bé.  
> **Chủ sở hữu & Developer trực tiếp:** Trần Văn Cường (`cuongtran190404@gmail.com`)  
> **AI Co-pilot:** Senior Full-stack Developer  
> **Quy định bất biến:** Tuyệt đối **KHÔNG** kinh doanh thuốc kê đơn.

---

## 📌 1. THÔNG TIN CỐT LÕI VỀ DỰ ÁN

| Thông tin | Chi tiết |
|---|---|
| **Tên thương hiệu** | **THUYNGA Shop** |
| **Slogan** | Hàng nhập khẩu chính hãng – Trao sức khỏe, trọn niềm tin |
| **Showroom** | Số 88 Phố Huế, Hai Bà Trưng, Hà Nội |
| **Hotline / Zalo** | `0987.654.321` (Tư vấn & CSKH 24/7) |
| **Email CSKH** | `cskh@thuyngashop.com.vn` |
| **Fanpage chính thức** | [facebook.com/thuyngashop.com.vn](https://facebook.com/thuyngashop.com.vn) |
| **Màu sắc nhận diện** | **Đỏ rượu vang (`#800028`)**, Đỏ đô (`#5c001e`), Vàng kim (`#d4af37`), Nền sáng sang trọng |
| **Chỉ số kỹ thuật ưu tiên** | Mobile-First Responsive, Tải trang **< 2s** (Thực tế đạt **~650ms**), Chuẩn SEO On-page |
| **Phương thức thanh toán** | Chuyển khoản ngân hàng tự động **VietQR** & Tiền mặt khi nhận hàng **(COD)** |

### 5 Ngành hàng kinh doanh cốt lõi (Danh mục 2 cấp):
1. **Thực phẩm chức năng**: Vitamin & Khoáng chất, Tim mạch & Huyết áp, Bổ não & Trí nhớ, Xương khớp, Hồng sâm KGC 6 năm tuổi Hàn Quốc...
2. **Thực phẩm & Đồ uống nhập khẩu**: Hạt dinh dưỡng Macca Úc, Bánh quy Danisa Đan Mạch, Trà gạo lứt Nhật Bản, Nước ép dinh dưỡng...
3. **Trái cây nhập khẩu (Air Cargo 48h)**: Cherry Mỹ size 9.0, Nho mẫu đơn Shine Muscat Hàn Quốc, Táo Envy New Zealand, Giỏ quà trái cây cao cấp...
4. **Mỹ phẩm & Chăm sóc cá nhân**: Dược mỹ phẩm La Roche-Posay Pháp, Serum phục hồi B5 GoodnDoc Hàn Quốc, Kem chống nắng chuyên sâu...
5. **Mẹ & Bé**: Sữa Aptamil Profutura Úc, Bột ăn dặm Gerber Organic Mỹ, Vitamin & Đồ dùng vệ sinh cho bé...

---

## ⚙️ 2. TECH STACK & KIẾN TRÚC HỆ THỐNG

```
                    ┌────────────────────────────────────────────────────────┐
                    │                   NGƯỜI DÙNG / KHÁCH HÀNG              │
                    │         (Mobile Browser / Desktop / Tablet)            │
                    └───────────────────────────┬────────────────────────────┘
                                                │
                                    HTTP / HTTPS / CDN
                                                │
                    ┌───────────────────────────▼────────────────────────────┐
                    │               NEXT.JS 16 (APP ROUTER)                  │
                    │                                                        │
                    │  ┌──────────────────────┐  ┌─────────────────────────┐ │
                    │  │ (storefront)         │  │ (admin)                 │ │
                    │  │ - Trang chủ          │  │ - Dashboard thống kê    │ │
                    │  │ - Chi tiết sản phẩm  │  │ - Quản lý sản phẩm/kho  │ │
                    │  │ - Danh mục & Bộ lọc  │  │ - Quản lý đơn hàng      │ │
                    │  │ - Giỏ hàng, Checkout │  │ - Quản lý Voucher/Media │ │
                    │  └──────────┬───────────┘  └────────────┬────────────┘ │
                    │             │                           │              │
                    │  ┌──────────▼───────────────────────────▼────────────┐ │
                    │  │           Middleware / Auth.js (NextAuth v5)      │ │
                    │  └──────────────────────┬────────────────────────────┘ │
                    │                         │                              │
                    │  ┌──────────────────────▼────────────────────────────┐ │
                    │  │              API Route Handlers (REST)             │ │
                    │  └──────────────────────┬────────────────────────────┘ │
                    └─────────────────────────┼──────────────────────────────┘
                                              │
                                Prisma ORM v5 (Type-Safe)
                                              │
                    ┌─────────────────────────▼────────────────────────────┐
                    │               POSTGRESQL 16 (DATABASE)               │
                    │   - Database: thuyngashop (Port: 5432)                │
                    │   - SELECT ... FOR UPDATE (Chống Overselling)        │
                    │   - Snapshot giá & sản phẩm trong OrderItem          │
                    └──────────────────────────────────────────────────────┘
```

- **Framework**: `Next.js 16.4.3` (App Router, Turbopack, React 19).
- **Styling**: `Tailwind CSS v4` tích hợp `@tailwindcss/turbopack`.
- **Database**: `PostgreSQL 16` chạy trực tiếp tại `localhost:5432`.
- **ORM**: `Prisma 5.22.0` với đầy đủ migrations & TypeScript client.
- **Authentication**: `NextAuth.js v5 (beta)` (JWT Session stateless, phân quyền `ADMIN` & `CUSTOMER`).
- **State Management**: `Zustand v5` với middleware `persist` lưu giỏ hàng localStorage an toàn.
- **Data Fetching**: `@tanstack/react-query v5`.
- **Form & Validation**: `React Hook Form` kết hợp `Zod v4`.
- **Target Deploy**: VPS Ubuntu riêng (Nginx Reverse Proxy, PM2/Docker, SSL Cloudflare).

---

## 🗄️ 3. CƠ SỞ DỮ LIỆU & 18 MODELS TRONG PRISMA

Cơ sở dữ liệu được định nghĩa chi tiết tại [`prisma/schema.prisma`](./prisma/schema.prisma):

```mermaid
erDiagram
    User ||--o{ Order : "đặt hàng"
    User ||--o{ Review : "đánh giá"
    User ||--o{ Wishlist : "yêu thích"
    User ||--o{ Address : "sổ địa chỉ"
    User ||--|| Cart : "giỏ hàng"

    Product ||--o{ ProductVariant : "có nhiều biến thể"
    Product ||--o{ ProductImage : "thư viện ảnh"
    Product ||--o{ Review : "nhận đánh giá"
    Product ||--o{ FlashSaleItem : "tham gia flash sale"
    Product }o--|| Category : "thuộc danh mục"

    Category ||--o{ Category : "danh mục con (cấp 2)"

    ProductVariant ||--o{ CartItem : "trong giỏ"
    ProductVariant ||--o{ OrderItem : "trong đơn hàng"
    ProductVariant ||--o{ FlashSaleItem : "biến thể flash sale"

    FlashSale ||--o{ FlashSaleItem : "chứa deal"
    Order ||--o{ OrderItem : "chi tiết dòng sản phẩm"
    Order ||--o{ OrderStatusHistory : "lịch sử trạng thái"
    Order }o--o| Voucher : "áp dụng voucher"
```

### Danh sách 18 Bảng dữ liệu chính:
1. `users`: Tài khoản khách hàng & quản trị viên (`role`: `ADMIN` / `CUSTOMER`, `passwordHash` dùng bcryptjs).
2. `accounts`: Bảng OAuth liên kết (Google, Facebook...) chuẩn NextAuth.
3. `sessions`: Phiên đăng nhập database (nếu dùng strategy database).
4. `verification_tokens`: Mã xác thực email/reset password.
5. `addresses`: Sổ địa chỉ giao hàng của khách (Tỉnh/Huyện/Xã/Đường, `isDefault`).
6. `categories`: Danh mục 2 cấp (quan hệ tự tham chiếu `parentId`), hỗ trợ SEO title/description.
7. `products`: Sản phẩm chính (Xuất xứ, Thương hiệu, Quy cách, Hạn sử dụng - Date, Mô tả Rich Text).
8. `product_variants`: Biến thể SKU độc lập (Trọng lượng, Màu sắc, Combo; có SKU, giá bán, giá gốc, tồn kho `stock`, ảnh riêng).
9. `product_images`: Thư viện ảnh sản phẩm độ phân giải cao.
10. `tags` & `product_tags`: Nhãn sản phẩm (bổ não, giảm cân, quà biếu...).
11. `flash_sales`: Phiên Flash Sale (tên phiên, `startTime`, `endTime`, `isActive`).
12. `flash_sale_items`: Chi tiết deal trong phiên (giá sale, số lượng mở bán `quantity`, đã bán `soldCount`, giới hạn `limitPerUser`).
13. `carts` & `cart_items`: Giỏ hàng linh hoạt (hỗ trợ cả khách vãng lai bằng `sessionId` và khách đã đăng nhập bằng `userId`).
14. `vouchers`: Mã giảm giá (`PERCENTAGE`, `FIXED`, `FREE_SHIP`, điều kiện đơn tối thiểu, giảm tối đa, giới hạn lượt dùng).
15. `orders`: Đơn hàng (`orderNumber`: dạng `TN-YYYYMMDD-XXXX`, snapshot địa chỉ, phí ship, giảm giá, `paymentMethod`: `COD`/`VIETQR`, `paymentStatus`, `orderStatus`).
16. `order_items`: **Snapshot bất biến** lúc mua hàng (`productName`, `variantName`, `sku`, `price`, `image`). Đảm bảo khi shop đổi giá sau này, lịch sử đơn hàng cũ không bao giờ bị sai lệch.
17. `order_status_history`: Nhật ký vết trạng thái đơn (Chờ duyệt -> Đang xử lý -> Đang giao -> Đã giao -> Đã hủy).
18. `reviews`: Đánh giá 1-5 sao, hình ảnh thực tế (chỉ duyệt mới hiển thị).
19. `wishlist`: Danh sách sản phẩm khách hàng thả tim lưu lại.
20. `blog_posts`: Bài viết cẩm nang sức khỏe & hướng dẫn tiêu dùng chuẩn SEO.
21. `site_settings`: Cấu hình động cho Admin sửa Logo, Hotline, Banner, Footer dạng JSON.
22. `media`: Thư viện lưu trữ metadata hình ảnh tải lên.

---

## 🧠 4. NGUYÊN TẮC NGHIỆP VỤ & KỸ THUẬT QUAN TRỌNG (BẮT BUỘC TUÂN THỦ)

### 🚨 1. Chống Overselling (Bán vượt tồn kho) giờ Flash Sale
Khi khách đặt hàng thành công, **bắt buộc** áp dụng Database Transaction với cơ chế khóa bi quan (*Pessimistic Locking* – `SELECT ... FOR UPDATE`):
```typescript
await prisma.$transaction(async (tx) => {
  // 1. Khóa bản ghi biến thể để không request nào chen ngang
  const variant: any = await tx.$queryRaw`
    SELECT id, stock FROM "product_variants"
    WHERE id = ${variantId} FOR UPDATE
  `;
  if (!variant[0] || variant[0].stock < quantity) {
    throw new Error("OUT_OF_STOCK");
  }

  // 2. Trừ tồn kho nguyên tử (Atomic decrement)
  await tx.productVariant.update({
    where: { id: variantId },
    data: { stock: { decrement: quantity } }
  });

  // 3. Nếu là flash sale item, tăng soldCount đồng thời
  if (isFlashSale) {
    await tx.flashSaleItem.update({
      where: { flashSaleId_variantId: { flashSaleId, variantId } },
      data: { soldCount: { increment: quantity } }
    });
  }
});
```
Khi đơn hàng bị hủy (`CANCELLED`), hệ thống tự động hoàn trả tồn kho (`stock: { increment: quantity }`).

### 📦 2. Snapshot thông tin trong OrderItem
Không bao giờ chỉ lưu `variantId` vào `OrderItem`. Phải copy toàn bộ tên sản phẩm, tên biến thể, SKU, giá bán tại đúng thời điểm bấm thanh toán vào bảng `OrderItem`.

### ⚡ 3. Chống N+1 Query
Mọi trang Listing sản phẩm và Danh mục phải sử dụng eager loading qua Prisma `include` hoặc batching query (`WHERE id IN (...)`). Không được lặp `for` để truy vấn DB con.

### 🔢 4. Serialization trong React 19 RSC
Các trường kiểu `Decimal` trong PostgreSQL khi lấy qua Prisma sẽ là `Decimal` object. Khi truyền từ Server Component xuống Client Component, **phải convert sang number thuần** (`Number(price)`) để tránh lỗi serialization của React 19.

### 📱 5. Mobile-First Responsive
- Mọi khối giao diện phải được test trước trên màn hình điện thoại (390px - 430px).
- Luôn có thanh **Mobile Bottom Navigation** (Trang chủ, Danh mục, Flash Sale, Giỏ hàng có badge, Tài khoản) cố định đáy màn hình.

---

## 📂 5. CẤU TRÚC THƯ MỤC DỰ ÁN (PROJECT STRUCTURE)

```
D:\github\ThuongMaiDienTu-shop\
├── .env                                # File biến môi trường thực (Gitignored)
├── .env.example                        # Template biến môi trường mẫu
├── next.config.ts                      # Cấu hình Next.js (Turbopack Tailwind v4, CSP, Remote images)
├── package.json                        # Khai báo dependencies & scripts
├── tsconfig.json                       # Cấu hình TypeScript nghiêm ngặt
│
├── prisma/                             # Cơ sở dữ liệu Prisma
│   ├── schema.prisma                   # Toàn bộ 18 models dữ liệu PostgreSQL
│   ├── seed.ts                         # Script khởi tạo Admin, 5 Ngành hàng & 25 danh mục con
│   ├── seed-products.ts                # Script nạp sản phẩm mẫu thực tế & phiên Flash Sale
│   └── seed-reviews.ts                 # Script nạp đánh giá thực tế từ người mua đã xác thực
│
└── src/
    ├── middleware.ts                   # Bảo vệ route /admin và /tai-khoan theo role
    │
    ├── app/                            # Next.js App Router
    │   ├── layout.tsx                  # Root layout (Font Be Vietnam Pro, Global Providers)
    │   ├── globals.css                 # Design system (Màu #800028, Tailwind v4 @theme, custom classes)
    │   │
    │   ├── (storefront)/               # Route Group: TRANG KHÁCH HÀNG
    │   │   ├── layout.tsx              # Storefront Layout (Server Component load categories)
    │   │   ├── page.tsx                # Trang chủ (Hero slider, Flash sale đếm ngược, 5 ngành hàng)
    │   │   ├── dang-nhap/              # Trang đăng nhập tài khoản (Email/Mật khẩu + nút demo 1-click)
    │   │   ├── dang-ky/                # Trang đăng ký thành viên mới
    │   │   ├── san-pham/               # Listing tất cả sản phẩm & tìm kiếm
    │   │   │   └── [slug]/page.tsx     # Chi tiết sản phẩm (RSC + Schema JSON-LD + Metadata SEO)
    │   │   ├── danh-muc/[slug]/        # Danh mục theo slug & bộ lọc đa tiêu chí
    │   │   ├── gio-hang/               # Trang giỏ hàng chi tiết (Thanh Freeship 500k + Voucher)
    │   │   ├── thanh-toan/             # Trang thanh toán (Bắt buộc đăng nhập, chọn địa chỉ, VietQR live preview & COD)
    │   │   │   └── thanh-cong/[orderNumber]/ # Trang xác nhận đơn hàng thành công kèm mã VietQR Napas 24/7
    │   │   ├── tai-khoan/              # User Portal: Quản lý hồ sơ, sổ địa chỉ 63 tỉnh/thành, đổi mật khẩu
    │   │   │   ├── don-hang/           # Lịch sử đơn hàng, bộ lọc tabs, timeline 4 bước & hủy đơn hoàn kho
    │   │   │   │   └── [orderNumber]/  # Chi tiết đơn hàng, mã VietQR thanh toán bù & nút mua lại
    │   │   │   └── yeu-thich/          # Danh sách sản phẩm yêu thích (Wishlist) + thêm giỏ nhanh
    │   │   └── tin-tuc/                # Blog cẩm nang & góc sức khỏe
    │   │
    │   ├── (admin)/                    # Route Group: TRANG QUẢN TRỊ ADMIN CMS
    │   │   └── admin/
    │   │       ├── dashboard/          # Thống kê doanh thu, đơn hàng mới, cảnh báo tồn kho
    │   │       ├── san-pham/           # CRUD sản phẩm, biến thể, giá bán, kho
    │   │       ├── don-hang/           # Xử lý đơn, duyệt đơn, in vận đơn, đổi trạng thái
    │   │       ├── danh-muc/           # Quản lý cây danh mục 2 cấp
    │   │       ├── voucher/            # Tạo & quản lý mã giảm giá
    │   │       ├── khach-hang/         # Danh sách khách hàng & lịch sử mua sắm
    │   │       ├── danh-gia/           # Duyệt / ẩn đánh giá của khách
    │   │       ├── media/              # Kho ảnh sản phẩm & banner
    │   │       └── cai-dat/            # Chỉnh sửa logo, hotline, banner trang chủ, footer
    │   │
    │   └── api/                        # REST API Handlers
    │       ├── auth/
    │       │   ├── [...nextauth]/      # NextAuth authentication endpoints
    │       │   └── register/           # API đăng ký tài khoản khách hàng mới
    │       ├── user/
    │       │   ├── profile/            # API cập nhật hồ sơ cá nhân
    │       │   ├── change-password/    # API đổi mật khẩu bảo mật bcrypt
    │       │   ├── addresses/          # API sổ địa chỉ giao hàng (GET, POST, PATCH, DELETE)
    │       │   └── orders/[orderNumber]/cancel/ # API hủy đơn hàng & tự động hoàn tồn kho
    │       ├── wishlist/
    │       │   ├── route.ts            # API lấy danh sách ID sản phẩm yêu thích
    │       │   └── toggle/             # API thả tim / bỏ thích sản phẩm
    │       ├── vouchers/apply/         # API kiểm tra & áp dụng mã giảm giá
    │       ├── products/               # API tìm kiếm, lọc sản phẩm
    │       ├── reviews/                # API gửi đánh giá sản phẩm (POST /api/reviews)
    │       └── orders/                 # API tạo đơn an toàn (Pessimistic Locking SELECT FOR UPDATE)
    │
    ├── components/
    │   ├── providers.tsx               # NextAuth SessionProvider + TanStack QueryClientProvider
    │   │
    │   ├── storefront/
    │   │   ├── auth/                   # Component Đăng nhập & Đăng ký
    │   │   │   ├── LoginForm.tsx       # Form đăng nhập kèm banner chuyển tiếp từ checkout
    │   │   │   └── RegisterForm.tsx    # Form đăng ký thành viên mới
    │   │   │
    │   │   ├── account/                # Component User Portal
    │   │   │   ├── AccountSidebar.tsx  # Sidebar điều hướng trang cá nhân
    │   │   │   ├── AccountPageClient.tsx # Quản lý Hồ sơ, Sổ địa chỉ & Đổi mật khẩu
    │   │   │   ├── AddAddressModal.tsx # Modal thêm địa chỉ mới 3 cấp 63 tỉnh/thành
    │   │   │   ├── OrderListClient.tsx # Danh sách đơn hàng có tabs lọc & nút hủy/mua lại
    │   │   │   ├── OrderDetailView.tsx # Chi tiết đơn hàng, timeline 4 bước & VietQR
    │   │   │   └── WishlistClient.tsx  # Lưới sản phẩm yêu thích + thêm giỏ nhanh
    │   │   │
    │   │   ├── cart/                   # Component Giỏ hàng
    │   │   │   ├── FreeShippingProgress.tsx # Thanh tiến trình freeship 500k
    │   │   │   ├── CartItemRow.tsx     # Dòng sản phẩm kiểm tra tồn kho tối đa
    │   │   │   ├── CartOrderSummary.tsx# Tóm tắt chi phí & voucher + nút đăng nhập thanh toán
    │   │   │   └── CartEmptyState.tsx  # Giao diện giỏ hàng rỗng
    │   │   │
    │   │   ├── checkout/               # Component Thanh toán
    │   │   │   ├── AddressSelector.tsx # Chọn địa chỉ 3 cấp độ chuẩn Việt Nam
    │   │   │   ├── PaymentMethodSelector.tsx # Chọn COD / VietQR kèm live preview
    │   │   │   ├── VietQRCard.tsx      # Trình tạo mã VietQR Napas 24/7 offline 100%
    │   │   │   ├── CheckoutClient.tsx  # Form thanh toán tự điền thông tin user
    │   │   │   └── OrderSuccessView.tsx# Xác nhận đặt hàng thành công kèm VietQR
    │   │   │
    │   │   ├── layout/                 # Layout Header, Footer, Menu, Quick Contact
    │   │   ├── home/                   # Hero Slider, Flash Sale, Category Grid
    │   │   └── product/                # ProductCard, Gallery, Info, WishlistButton
    │   │
    │   └── ui/                         # UI primitives: CountryFlag, Modal, Badge...
    │
    ├── lib/
    │   ├── prisma.ts                   # Prisma Client Singleton (tránh cạn kiệt connection pool)
    │   ├── auth.ts                     # Cấu hình NextAuth v5 + bcrypt compare + phân quyền Admin
    │   ├── utils.ts                    # Tiện ích: formatVND, slugify, calcDiscount, generateVietQRUrl...
    │   └── validations/
    │       └── auth.ts                 # Schema Zod validate đăng nhập, đăng ký
    │
    ├── store/
    │   └── cart.ts                     # Zustand Store quản lý giỏ hàng phía Client + LocalStorage
    │
    └── types/
        ├── index.ts                    # Toàn bộ TypeScript interfaces (Product, Cart, Order, FlashSale...)
        └── next-auth.d.ts              # Type augmentation mở rộng Session chứa 'role' và 'id'
```

---

## 🚀 6. HƯỚNG DẪN CÀI ĐẶT & CHẠY DỰ ÁN

### Yêu cầu môi trường:
- **Node.js**: `v20.x` hoặc `v24.x` (Máy hiện tại đang chạy Node `v24.14.0`).
- **PostgreSQL**: `v15` hoặc `v16` (Đang chạy tại `localhost:5432`).

### Các bước khởi chạy:

1. **Cấu hình môi trường (`.env`)**:
   ```env
   DATABASE_URL="postgresql://postgres:postgres@localhost:5432/thuyngashop?schema=public"
   NEXTAUTH_URL="http://localhost:3000"
   NEXTAUTH_SECRET="+1k+g3BNvWMmp7dtgxekOK0RlDzNIHK9qrSVeoYAacQ="
   NEXT_PUBLIC_APP_URL="http://localhost:3000"
   NEXT_PUBLIC_SITE_NAME="THUYNGA Shop"
   ```

2. **Cài đặt thư viện**:
   ```bash
   npm install --legacy-peer-deps
   ```

3. **Đồng bộ Database & Sinh Prisma Client**:
   ```bash
   npm run db:push
   npm run db:generate
   ```

4. **Nạp dữ liệu mẫu (Seed Data)**:
   ```bash
   # Bước 1: Tạo Admin và 5 Ngành hàng cốt lõi
   npm run db:seed

   # Bước 2: Nạp các sản phẩm thực tế, biến thể và phiên Flash Sale
   npx tsx prisma/seed-products.ts
   ```

5. **Chạy máy chủ phát triển**:
   ```bash
   npm run dev
   ```
   👉 Mở trình duyệt tại: **[http://localhost:3000](http://localhost:3000)**

6. **Tài khoản thử nghiệm hệ thống (Test Accounts)**:
   - **Tài khoản Quản trị viên (Admin):**
     - Email: `admin@thuyngashop.com.vn`
     - Mật khẩu: `Admin@123456`
   - **Tài khoản Khách hàng thành viên (Customer):**
     - Email: `khachhang@thuyngashop.vn`
     - Mật khẩu: `Khach@123456`
   *(Có sẵn nút 1-click "Điền tài khoản Admin mẫu" tại trang đăng nhập `/dang-nhap` để test nhanh).*

---

## 🛠️ 7. DANH SÁCH LỆNH TERMINAL HỮU ÍCH

```bash
npm run dev              # Chạy môi trường phát triển (Turbopack)
npm run build            # Biên dịch dự án cho production (+ prisma generate tự động)
npm run start            # Chạy bản production đã build
npm run db:push          # Đẩy nhanh thay đổi schema vào DB (dev mode)
npm run db:migrate       # Tạo file migration lịch sử cơ sở dữ liệu
npm run db:migrate:prod  # Chạy migration trên VPS Ubuntu
npm run db:studio        # Mở GUI trực quan Prisma Studio quản lý dữ liệu trên trình duyệt
npm run db:seed          # Nạp lại tài khoản admin & danh mục
```

---

## 📋 8. TRẠNG THÁI TIẾN ĐỘ & ROADMAP TIẾP THEO

### ✅ Giai đoạn 1: Khởi tạo Nền tảng & Cấu trúc Dữ liệu (ĐÃ XONG)
- [x] Khởi tạo dự án Next.js 16 + TypeScript + Tailwind v4.
- [x] Thiết lập kết nối PostgreSQL thật (`thuyngashop`), đồng bộ 18 models Prisma.
- [x] Cấu hình NextAuth v5 phân quyền `ADMIN` và `CUSTOMER`.
- [x] Khởi tạo Zustand Cart Store với tính năng lưu giỏ hàng vào `localStorage`.
- [x] Seed đầy đủ tài khoản Admin, 5 ngành hàng chính, 25 danh mục con, 50 sản phẩm chi tiết (tối thiểu 10 sản phẩm/ngành hàng) và phiên Flash Sale.
- [x] Cấu hình bảo mật HTTP Headers (CSP, HSTS, X-Frame-Options, Image Remote Patterns).

### ✅ Giai đoạn 2: Layout Storefront & Trang Chủ Hoàn Chỉnh (ĐÃ XONG)
- [x] Header 3 tầng (TopBar cam kết chính hãng, MainBar logo sang trọng, Mega Menu 2 cấp).
- [x] Thanh tìm kiếm thông minh gợi ý từ khóa hot không dùng icon AI.
- [x] Drawer menu trượt trên mobile (Accordion mở danh mục con 1 chạm).
- [x] Thanh Mobile Bottom Navigation cố định đáy màn hình chuẩn App e-commerce.
- [x] Footer 4 cam kết vàng + 4 cột thông tin chính sách + cam kết pháp lý không bán thuốc kê đơn.
- [x] Slider Hero Banner Carousel tự chuyển động mượt mà.
- [x] Khối Flash Sale đếm ngược thời gian thực (Giờ : Phút : Giây) kèm thanh tiến trình bán hàng.
- [x] Khối sản phẩm theo từng ngành hàng với component `ProductCard` chuẩn thương mại.
- [x] Khắc phục triệt để cấu hình Turbopack Tailwind v4, tốc độ tải trang đạt **~650ms**.

### ✅ Giai đoạn 3: Chi Tiết Sản Phẩm Chuẩn E-Commerce Cao Cấp (ĐÃ XONG)
- [x] **Trang chi tiết sản phẩm (`/san-pham/[slug]`)**:
  - [x] Thư viện nhiều ảnh với tương tác zoom kính lúp (lens magnifier hover) và popup Lightbox toàn màn hình.
  - [x] Bộ chọn biến thể thông minh (Smart Variant Selector): Khi click đổi biến thể -> giá, giá gốc, SKU, tồn kho và ảnh sản phẩm tự động cập nhật mượt mà.
  - [x] Hiển thị 4 cam kết vàng nổi bật: **Xuất xứ (kèm cờ quốc gia)**, **Quy cách đóng gói**, **Hạn sử dụng (Date HSD rõ ràng)**, **Vận chuyển Air Cargo chuẩn nhiệt độ**.
  - [x] Tích hợp bộ chọn số lượng với ràng buộc tồn kho thực tế, kết nối Zustand Cart Store, nút "Mua ngay" chuyển thẳng sang thanh toán.
  - [x] Hệ thống Tab nội dung: (1) Mô tả công dụng & hướng dẫn dùng, (2) Bảng thông số kỹ thuật chi tiết & HSD, (3) Chính sách vận chuyển Air Cargo & đổi trả 7 ngày.
  - [x] Khu vực Đánh giá khách hàng xác thực: Điểm trung bình, phân bổ sao 1-5, danh sách review kèm ảnh, Modal gửi đánh giá mới kết nối `POST /api/reviews`.
  - [x] Thanh mua hàng dính cố định dưới đáy mobile (**Sticky Mobile Cart Bar**) khi cuộn xuống.
  - [x] Khối sản phẩm cùng ngành hàng gợi ý (Related Products) tăng tỷ lệ chốt đơn chéo.
  - [x] Cấu hình SEO tối đa: Schema.org Product JSON-LD structured data + Dynamic OpenGraph/Twitter Metadata.

### ✅ Giai đoạn 4: Danh Mục Sản Phẩm & Bộ Lọc Đa Tiêu Chí (ĐÃ XONG)
- [x] **Trang danh mục & Bộ lọc (`/danh-muc/[slug]`)**:
  - [x] Breadcrumbs điều hướng phân cấp chuẩn SEO kết hợp Schema.org BreadcrumbList JSON-LD.
  - [x] Header danh mục: Phân biệt rõ Ngành hàng chính vs Chuyên mục con, 3 cam kết vàng nhanh, thanh chọn chuyên mục trực thuộc (Subcategory pills).
  - [x] Bộ lọc đa tiêu chí bên trái (Desktop Sidebar) & Drawer trượt mượt mà (Mobile Slide-over Sheet):
    - [x] 5 mốc khoảng giá nhanh (Dưới 300k, 300k-500k, 500k-1M, 1M-2M, trên 2M) + Ô nhập khoảng giá tùy chỉnh (Min - Max).
    - [x] Xuất xứ quốc gia đi kèm vector SVG cờ sắc nét (`CountryFlag.tsx` chuẩn 11 quốc gia nhập khẩu).
    - [x] Thương hiệu dạng checklist đi kèm ô tìm kiếm nhanh thương hiệu trong tích tắc.
    - [x] Trạng thái: Chỉ hiện hàng còn tồn kho & Đang có ưu đãi / giảm giá HOT.
  - [x] Thanh Toolbar thông minh: Đếm số lượng sản phẩm tìm thấy, Nút mở bộ lọc mobile kèm badge đếm tiêu chí, Dropdown sắp xếp (Nổi bật nhất, Mới nhất, Giá tăng/giảm dần, Bán chạy nhất).
  - [x] Hệ thống Active Filter Chips: Hiển thị trực quan các tiêu chí đang lọc, nút xóa nhanh từng tag hoặc 1-click "Xóa tất cả".
  - [x] Lưới sản phẩm Responsive (2/3/4 cột) tái sử dụng component `ProductCard`, trạng thái rỗng (Empty State) thân thiện.
  - [x] Phân trang (Pagination) thông minh: Đánh số trang với dấu ellipsis `...`, nút Trước/Sau, đồng bộ tuyệt đối với `searchParams` URL mà không reload trang.
  - [x] Trang catalog toàn bộ & tìm kiếm (`/san-pham?search=...`): Hỗ trợ tìm kiếm từ khóa cả có dấu và không dấu (thông qua chuẩn hóa slug), tích hợp chung bộ lọc đa tiêu chí.
  - [x] Tối ưu hóa SEO Server-Side: Dynamic `generateMetadata` và Schema.org `CollectionPage` JSON-LD tự động theo từng danh mục.

### ✅ Giai đoạn 5: Giỏ Hàng & Quy Trình Thanh Toán (VietQR & COD) (ĐÃ XONG)
- [x] **Trang giỏ hàng toàn diện (`/gio-hang`)**:
  - [x] Tăng giảm số lượng sản phẩm có kiểm tra ràng buộc tồn kho thực tế (`stock`), nút xóa từng món và xóa sạch giỏ hàng.
  - [x] Thanh tiến trình Freeship (**Free Shipping Progress Bar**) động: Hiển thị số tiền còn thiếu để đạt mốc miễn phí vận chuyển 500.000₫.
  - [x] Áp dụng mã giảm giá (Voucher) linh hoạt: `WELCOME50` (giảm 50.000₫), `FREESHIP` (miễn phí ship), `THUYNGA10` (giảm 10%), `VIP200K` (giảm 200.000₫).
  - [x] Bảng tổng kết chi phí: Tạm tính, Phí ship, Giảm giá voucher, Tổng thanh toán.
  - [x] Trạng thái giỏ hàng rỗng (Empty State) với gợi ý mua sắm thân thiện.
- [x] **Trang thanh toán đặt hàng (`/thanh-toan`)**:
  - [x] **Bắt buộc đăng nhập trước khi thanh toán**: Bảo vệ 2 lớp (Middleware + Server Component), tự động chuyển hướng sang `/dang-nhap?callbackUrl=/thanh-toan` và quay lại ngay sau khi đăng nhập thành công.
  - [x] Tự động điền sẵn thông tin (Auto-fill): Họ tên, Số điện thoại và Địa chỉ mặc định của khách hàng.
  - [x] Bộ chọn địa chỉ 3 cấp chuẩn hành chính Việt Nam (`AddressSelector.tsx`): 63 Tỉnh/Thành phố, Quận/Huyện, Phường/Xã và Số nhà/Đường.
  - [x] Bộ chọn phương thức thanh toán (`PaymentMethodSelector.tsx`):
    - [x] **COD (Thanh toán khi nhận hàng)**: Đồng kiểm ngoại quan sản phẩm trước khi giao tiền.
    - [x] **VietQR Napas 24/7 (Live Preview)**: Hiển thị trực tiếp mã QR Napas 24/7 và thông tin ngân hàng ngay khi khách bấm chọn phương thức.
- [x] **Công nghệ VietQR Napas 24/7 độc lập (`VietQRCard.tsx`)**:
  - [x] Tích hợp thư viện `qrcode` sinh mã QR dạng DataURL nội bộ trực tiếp trên trình duyệt (Offline 100%, không bị ảnh hưởng bởi lỗi mạng hay adblock bên thứ ba).
  - [x] Cấu hình CSP (Content Security Policy) và RemotePatterns cấp quyền cho `img.vietqr.io` trong `next.config.ts`.
  - [x] Hỗ trợ nút sao chép 1-chạm (1-click copy): Số tài khoản MB Bank, Tên chủ tài khoản, Số tiền, Nội dung chuyển khoản.
- [x] **API Đặt hàng an toàn tuyệt đối (`POST /api/orders`)**:
  - [x] **Pessimistic Locking (`SELECT ... FOR UPDATE`)**: Khóa dòng biến thể trong PostgreSQL transaction nhằm loại bỏ 100% rủi ro Overselling (bán vượt tồn kho).
  - [x] Trừ tồn kho biến thể tự động, kiểm tra và tăng `usedCount` của Voucher trong cùng 1 transaction atomic.
  - [x] Lưu trữ **Snapshot bất biến** vào `order_items` (tên, variant, sku, giá, ảnh tại thời điểm đặt).
  - [x] Sinh mã đơn hàng chuẩn `TN-YYYYMMDD-XXXX` và mã chuyển khoản `transferCode`.
  - [x] Gán `userId` xác thực của khách hàng vào đơn hàng để quản lý trong lịch sử cá nhân.
  - [x] Tự động ghi nhật ký trạng thái đơn hàng đầu tiên (`OrderStatusHistory: PENDING`).
- [x] **Trang đặt hàng thành công (`/thanh-toan/thanh-cong/[orderNumber]`)**:
  - [x] Tạo mã VietQR chuẩn Napas 24/7 trực quan tự động khớp số tiền và mã chuyển khoản của đơn.
  - [x] Nút sao chép 1-chạm tiện lợi, chi tiết đơn hàng, địa chỉ nhận hàng và hotline CSKH.

### ✅ Giai đoạn 5.5: User Portal & Xác Thực Khách Hàng Toàn Diện (ĐÃ XONG)
- [x] **Trang Đăng nhập (`/dang-nhap`) & Đăng ký (`/dang-ky`)**:
  - [x] Giao diện sang trọng chuẩn nhận diện thương hiệu đỏ rượu `#800028` và vàng gold.
  - [x] Tích hợp NextAuth v5 Credentials provider, bảo mật mật khẩu với `bcryptjs` (salt 12 rounds).
  - [x] Nhận diện `callbackUrl` thông minh: tự động đưa khách về trang giỏ hàng/thanh toán hoặc trang trước đó.
  - [x] Nút 1-click điền tài khoản thử nghiệm nhanh (Admin / Customer).
  - [x] API Đăng ký tài khoản mới: `POST /api/auth/register` có kiểm tra trùng lặp email và số điện thoại.
- [x] **Trang Thông tin tài khoản (`/tai-khoan`)**:
  - [x] **Hồ sơ cá nhân**: Xem và cập nhật họ tên, số điện thoại (`PATCH /api/user/profile`).
  - [x] **Sổ địa chỉ nhận hàng (`AddressBook`)**: Xem danh sách địa chỉ, Modal thêm địa chỉ mới 3 cấp 63 Tỉnh/Thành (`POST /api/user/addresses`), thiết lập địa chỉ mặc định (`PATCH /api/user/addresses/[id]`), xóa địa chỉ an toàn (`DELETE /api/user/addresses/[id]`).
  - [x] **Bảo mật & Đổi mật khẩu**: Kiểm tra mật khẩu hiện tại và cập nhật mật khẩu mới (`POST /api/user/change-password`).
- [x] **Đơn hàng của tôi (`/tai-khoan/don-hang`)**:
  - [x] Bộ lọc đơn hàng theo 6 Tabs: Tất cả, Chờ xác nhận, Đang xử lý, Đang giao, Đã giao, Đã hủy.
  - [x] Nút **"Hủy đơn hàng"**: Cho phép khách tự hủy đơn `PENDING` và hệ thống **tự động hoàn trả lại số lượng tồn kho (`stock`)** vào cơ sở dữ liệu (`POST /api/user/orders/[orderNumber]/cancel`).
  - [x] Nút **"Mua lại"**: Đưa toàn bộ sản phẩm của đơn hàng cũ vào lại giỏ hàng Zustand với 1 cú click.
  - [x] **Trang Chi tiết đơn hàng (`/tai-khoan/don-hang/[orderNumber]`)**: Thanh Timeline tiến trình vận chuyển 4 bước trực quan, tích hợp lại mã VietQR Napas 24/7 để thanh toán bù bất cứ lúc nào.
- [x] **Sản phẩm yêu thích - Wishlist (`/tai-khoan/yeu-thich`)**:
  - [x] Nút Thả Tim tương tác realtime (`WishlistButton.tsx`) đồng bộ trên toàn bộ card sản phẩm và trang chi tiết sản phẩm.
  - [x] Lưu trạng thái thả tim trực tiếp vào bảng `wishlist` trong PostgreSQL (`POST /api/wishlist/toggle`).
  - [x] Trang quản lý Wishlist: Lưới sản phẩm đã lưu, nút thêm nhanh vào giỏ hàng và nút xóa khỏi danh sách.

### 👑 Giai đoạn 6: Trang Quản Trị Admin CMS (`/admin`) (ĐANG TRIỂN KHAI THEO TỪNG MODULE)
- [x] **Module 6.1: Khung Nền tảng Admin Layout, Sidebar Navigation, Header & Phân Quyền Bảo Mật RBAC** *(Đã hoàn thành & Đã kiểm thử)*:
  - Middleware bảo vệ nghiêm ngặt: Chỉ tài khoản `role === "ADMIN"` mới được truy cập `/admin/*`, tự động lưu `callbackUrl` khi chuyển hướng đăng nhập.
  - Phân quyền kép (Double RBAC Guard) tại cả Middleware và Server Layout `src/app/(admin)/layout.tsx`.
  - Giao diện Admin Shell chuẩn mực: Dark Slate (`#0f172a`) kết hợp màu đỏ rượu mận (`#800028`) đặc trưng của THUYNGA Shop.
  - Sidebar Navigation co giãn linh hoạt (Desktop collapse `w-64` <-> `w-20` lưu `localStorage`, Mobile Drawer vuốt mượt mà) với 8 phân hệ quản trị.
  - Bộ đếm thông báo Realtime: Huy hiệu đếm số đơn hàng mới cần xác nhận (`PENDING`) và đánh giá chờ duyệt trực tiếp từ database.
  - Header tiện ích: Nút chuyển nhanh xem Cửa hàng Live (`/`), Thông báo đơn cần xử lý, Menu profile quản trị viên và Đăng xuất an toàn.
  - Bộ UI Primitives chuẩn hóa: `AdminCard`, `AdminPageHeader`, `AdminBadge`.
- [x] **Module 6.2: Dashboard Tổng Quan, Thống Kê Doanh Thu & Cảnh Báo Tồn Kho (`/admin/dashboard`)** *(Đã hoàn thành & Đã kiểm thử)*:
  - Thống kê 6 chỉ số KPIs then chốt: Doanh thu thuần, Tổng đơn hàng, Giá trị trung bình đơn (AOV), Khách thành viên, Đơn chờ duyệt & Kho sắp hết.
  - Tính toán chính xác phần trăm tăng trưởng (+%) so với kỳ báo cáo trước đó.
  - Bộ lọc thời gian linh hoạt (Hôm nay, 7 ngày qua, 30 ngày qua, Toàn thời gian) cập nhật URL mượt mà không tải lại trang.
  - Biểu đồ tương tác trực quan SVG/CSS (`RevenueChart.tsx`): Chuyển đổi giữa Doanh thu và Số đơn, thanh tiến trình hiển thị doanh số từng ngày kèm tooltip chi tiết.
  - Tỷ lệ phân bổ trạng thái đơn hàng (Tiến trình %: Chờ duyệt, Đã xác nhận, Đang giao, Đã giao, Đã hủy) & Danh sách Top sản phẩm bán chạy nhất.
  - Bảng cảnh báo tồn kho kho hàng (`LowStockTable.tsx`): Tự động quét mặt hàng có tồn kho `<= 10`, phân loại mức độ nguy hiểm và có phím tắt nhập thêm kho.
  - Bảng hoạt động đơn hàng mới nhất (`RecentOrdersTable.tsx`): Hiển thị thông tin khách đặt, phương thức thanh toán, trạng thái với huy hiệu `AdminBadge` và liên kết kiểm tra nhanh.
- [x] **Module 6.3: Quản Lý Sản Phẩm & Biến Thể Tồn Kho (`/admin/san-pham`)** *(Đã hoàn thành & Đã kiểm thử)*:
  - Bảng danh sách sản phẩm phân trang, tìm kiếm đa năng theo tên sản phẩm, thương hiệu hoặc mã SKU, hiển thị dải giá min-max, tổng tồn kho và số biến thể.
  - Bộ lọc nâng cao theo danh mục phân cấp, xuất xứ quốc gia với cờ emoji, mức độ tồn kho (Dồi dào, Sắp hết, Hết hàng) và trạng thái kinh doanh.
  - Bật / Tắt nhanh tức thì trạng thái kinh doanh (`isActive`) và đánh dấu nổi bật (`isFeatured`) ngay trên bảng với Optimistic UI.
  - Form Thêm mới (`/admin/san-pham/tao-moi`) & Chỉnh sửa (`/admin/san-pham/[id]`) chuẩn chỉnh 5 phân khu: Thông tin cơ bản, Biến thể & Giá, Thư viện hình ảnh, Mô tả chi tiết HTML có Preview, và Cấu hình SEO.
  - Tự động sinh slug chuẩn tiếng Việt và mã SKU thông minh theo phân loại.
  - API Tải ảnh lên máy chủ cục bộ (`POST /api/upload`) hỗ trợ định dạng PNG, JPG, WEBP và dán link ảnh CDN ngoài.
  - Cơ chế Xóa an toàn: Tự động phát hiện sản phẩm đã có lịch sử đơn hàng để chuyển sang trạng thái "Ngừng kinh doanh" thay vì xóa cứng, bảo toàn dữ liệu kế toán và hóa đơn khách hàng.
- [ ] **Module 6.4: Quản Lý Danh Mục Ngành Hàng (`/admin/danh-muc`)**: Cây danh mục 2 cấp (Cha - Con), thêm / sửa / xóa / sắp xếp thứ tự hiển thị.
- [ ] **Module 6.5: Quản Lý Đơn Hàng (`/admin/don-hang`)**:
  - Bảng danh sách đơn hàng đầy đủ: Tìm kiếm theo mã đơn, tên khách, số điện thoại, lọc theo trạng thái đơn & thanh toán.
  - Modal / Trang xem chi tiết đơn hàng: Cập nhật trạng thái đơn (Chờ duyệt ➔ Đã xác nhận ➔ Đang giao ➔ Đã giao / Hủy), cập nhật trạng thái thanh toán (Đã thanh toán qua VietQR).
  - Tự động ghi nhật ký vào `OrderStatusHistory`.
  - In phiếu đóng gói gửi hàng (Packing Slip).
- [ ] **Module 6.6: Quản Lý Mã Giảm Giá Voucher (`/admin/voucher`)**: Thêm voucher `%` hoặc số tiền cố định, thiết lập ngày bắt đầu, ngày kết thúc, giá trị đơn tối thiểu, số lượt dùng tối đa.
- [ ] **Module 6.7: Quản Lý Khách Hàng (`/admin/khach-hang`)**: Danh sách thành viên, tổng chi tiêu, tổng số đơn mua, kích hoạt/khóa tài khoản.
- [ ] **Module 6.8: Kiểm Duyệt Đánh Giá Khách Hàng (`/admin/danh-gia`)**: Duyệt bình luận, số sao, hình ảnh đính kèm trước khi công khai.
- [ ] **Module 6.9: Cài Đặt Hệ Thống (`/admin/cai-dat`)**: Cấu hình Hotline, Logo, STK VietQR Napas 24/7 nhận tiền, mức phí vận chuyển mặc định.

### 🔜 Giai đoạn 7: Triển Khai Lên VPS Ubuntu & Production
- [ ] Cấu hình Nginx làm Reverse Proxy trỏ domain về cổng 3000.
- [ ] Thiết lập PM2 quản lý tiến trình tự động khởi động lại khi server reboot.
- [ ] Cài đặt SSL miễn phí qua Cloudflare hoặc Certbot Let's Encrypt.
- [ ] Backup tự động PostgreSQL định kỳ.

---

*Tài liệu được lập và duy trì bởi Developer Trần Văn Cường & AI Co-pilot | Cập nhật lần cuối: 2026-10-27*
