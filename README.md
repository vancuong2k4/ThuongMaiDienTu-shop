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

### ✅ Giai đoạn 6: Trang Quản Trị Admin CMS (`/admin`) (ĐÃ HOÀN THÀNH 100%)
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
- [x] **Module 6.4: Quản Lý Danh Mục Ngành Hàng (`/admin/danh-muc`)** *(Đã hoàn thành & Đã kiểm thử)*:
  - Bảng cấu trúc cây danh mục 2 tầng (Hierarchical Tree View): Ngành hàng gốc Cấp 1 có thể thu gọn / mở rộng các phân loại con Cấp 2, hiển thị số lượng sản phẩm liên kết (trực tiếp và tổng của ngành hàng).
  - Thao tác nhanh tức thì: Bật / tắt nhanh hiển thị trên website (`isActive`) với Optimistic UI, mở nhanh trang danh mục ngoài storefront (`/danh-muc/[slug]`).
  - Modal Thêm mới & Chỉnh sửa danh mục (`CategoryModal.tsx`): Tự động tạo slug tiếng Việt chuẩn SEO, tải ảnh/icon ngành hàng lên máy chủ hoặc dán URL ngoài, chọn phân cấp cha/con chống lỗi vòng lặp (Circular Dependency Guard), cấu hình thứ tự hiển thị (`sortOrder`) và thẻ Meta SEO.
  - Cơ chế Xóa Danh Mục An Toàn (Safe Category Deletion): Chặn xóa danh mục nếu đang chứa danh mục con hoặc đang có sản phẩm liên kết nhằm bảo toàn 100% dữ liệu phân loại.
  - Hệ thống REST APIs hoàn chỉnh: `GET /api/admin/categories`, `POST /api/admin/categories`, `PUT /api/admin/categories/[id]`, `DELETE /api/admin/categories/[id]`, `PATCH /api/admin/categories/[id]/toggle`.
  - Bộ thẻ thống kê nhanh: Tổng danh mục (30), Ngành hàng gốc (5), Phân loại con (25), Đang hiển thị (30).
- [x] **Module 6.5: Quản Lý Đơn Hàng & Vận Chuyển (`/admin/don-hang`)** *(Đã hoàn thành & Đã kiểm thử)*:
  - Bảng danh sách đơn hàng toàn diện: Lọc theo 7 tab trạng thái (Tất cả, Chờ xử lý, Đã xác nhận, Đang chuẩn bị, Đang giao, Đã giao, Đã hủy) kèm badge đếm số lượng realtime từ PostgreSQL.
  - Bộ lọc đa năng: Tìm kiếm theo mã đơn hàng (`TN-...`), họ tên khách hàng, số điện thoại người nhận; kết hợp lọc theo phương thức thanh toán (COD / VietQR Napas 24/7) và trạng thái thanh toán (Chờ thanh toán, Đã thanh toán, Thất bại, Hoàn tiền).
  - Thao tác đổi trạng thái nhanh (Quick Status Selector) ngay trên từng dòng đơn hàng không cần mở trang chi tiết.
  - Máy trạng thái đơn hàng nghiêm ngặt (Order Status State Machine) xử lý trong Prisma transaction: Tự động ghi nhật ký lịch sử tiến trình vào bảng `OrderStatusHistory` kèm ghi chú lý do thay đổi.
  - **Cơ chế Hoàn Tồn Kho Tự Động Nguyên Tử**: Khi đơn hàng chuyển sang `CANCELLED`, hệ thống tự động hoàn trả số lượng tồn kho (`stock: { increment: item.quantity }`) cho từng biến thể `ProductVariant`; ngược lại nếu mở lại đơn từ `CANCELLED` thì kiểm tra và trừ lại tồn kho nguyên tử.
  - Trang Chi tiết đơn hàng chuyên sâu (`/admin/don-hang/[orderNumber]`):
    - Thanh Timeline 5 bước tiến trình trực quan với biểu tượng Lucide và thời gian cập nhật chi tiết.
    - Danh sách sản phẩm mua dạng Snapshot bất biến (tên sản phẩm, biến thể, ảnh, SKU, giá và số lượng).
    - Hộp thao tác chuyển trạng thái đơn hàng kèm ô nhập ghi chú nội bộ.
    - Nút 1-click "Đánh dấu Đã thanh toán (Mark as PAID)" lập tức ghi nhận tiền về cho đơn VietQR và cập nhật `paidAt`.
    - Thẻ ghi chú nội bộ Admin (`internalNote`) hỗ trợ lưu tự động phục vụ phối hợp giữa nhân viên đóng gói và CSKH.
  - Phiếu đóng gói & vận đơn in ấn chuẩn A4/A5 (`OrderPackingSlip.tsx` & `/admin/don-hang/[orderNumber]/in`):
    - Tối ưu in ấn với CSS `@media print` loại bỏ hoàn toàn các thành phần thừa của giao diện web.
    - Hiển thị logo, thông tin cửa hàng THUYNGA Shop, thông tin người nhận, mã đơn hàng, ngày đặt.
    - Checklist kiểm tra đóng gói từng sản phẩm với ô tích kiểm hàng trực quan.
    - Con dấu thanh toán nổi bật: Đóng dấu xanh "ĐÃ THANH TOÁN TOÀN BỘ" hoặc đóng dấu đỏ "THU HỘ TIỀN MẶT (COD)" ghi rõ số tiền cần thu.
    - Khối chữ ký xác nhận: Người lập phiếu, Nhân viên đóng gói, Đơn vị vận chuyển và Khách nhận hàng.
  - Hệ thống REST APIs độc lập & an toàn: `GET /api/admin/orders`, `GET /api/admin/orders/[id]`, `PATCH /api/admin/orders/[id]/status`, `PATCH /api/admin/orders/[id]/payment`, `PATCH /api/admin/orders/[id]/note`.
- [x] **Module 6.6: Quản Lý Mã Giảm Giá Voucher (`/admin/voucher`)** *(Đã hoàn thành & Đã kiểm thử)*:
  - 4 Thẻ KPI thống kê tổng quan: Tổng số voucher, Số voucher đang chạy hiệu lực, Số voucher sắp diễn ra, Tổng lượt sử dụng thực tế & Tổng số tiền chiết khấu đã tài trợ khách hàng.
  - Bộ lọc thông minh (`VoucherFilters.tsx`): Tìm kiếm mã code tự động in hoa, Tabs phân loại theo 3 hình thức (Giảm %, Giảm tiền mặt, Miễn phí vận chuyển), Dropdown lọc trạng thái vòng đời (Đang hoạt động, Sắp diễn ra, Đã hết hạn, Đang tạm dừng), nút xóa bộ lọc 1-chạm.
  - Bảng dữ liệu thông minh (`VoucherTable.tsx`):
    - Badge mã voucher nổi bật kèm nút sao chép mã 1-chạm (`Copy`) có phản hồi thị giác tức thì.
    - Hiển thị loại & giá trị giảm linh hoạt: `% giảm (kèm mức trần tối đa)`, `Số tiền cố định` hoặc `Freeship tài trợ cước`.
    - Điều kiện đơn hàng tối thiểu và giới hạn số lần dùng trên mỗi tài khoản.
    - **Thanh tiến trình sử dụng trực quan (Usage Progress Bar)**: Tự động đổi màu cảnh báo (xanh lá an toàn, cam cảnh báo khi > 60%, đỏ nguy hiểm khi sắp hết lượt > 90%).
    - Quản lý vòng đời (Lifecycle status): Huy hiệu hiển thị `Đang diễn ra`, `Sắp diễn ra`, `Đã hết hạn`, `Đã hết lượt`, `Tạm dừng`.
    - Công tắc chuyển nhanh trạng thái `isActive` (Switch toggle với Optimistic UI).
  - Modal Tạo mới & Chỉnh sửa voucher (`VoucherModal.tsx`):
    - Tích hợp nút **"Tạo mã ngẫu nhiên (1-click Random Code Generator)"** sinh mã dạng `TN-XXXX`.
    - Bộ chọn hình thức chiết khấu 3 thẻ trực quan, tự động đổi đơn vị `%` hoặc `₫`.
    - Trường ngày giờ bắt đầu và kết thúc (`datetime-local`) có ràng buộc kiểm tra logic.
  - Modal Xem Chi Tiết & Lịch Sử Sử Dụng (`VoucherDetailModal.tsx`):
    - Tổng hợp chỉ số hiệu suất của voucher.
    - Bảng danh sách 10 đơn hàng gần nhất đã áp dụng mã (Mã đơn có liên kết kiểm tra nhanh, tên & sđt khách, tổng đơn, số tiền chiết khấu, trạng thái đơn & thời gian).
  - **Cơ chế Xóa Voucher An Toàn (Safe Deletion Guard)**: Chặn xóa cứng nếu voucher đã được sử dụng trong các đơn hàng thực tế (`usedCount > 0` hoặc `orders.length > 0`) nhằm bảo vệ tính toàn vẹn chứng từ kế toán, hướng dẫn quản trị viên chuyển sang trạng thái "Tạm dừng".
  - Hệ thống REST APIs bảo mật RBAC: `GET /api/admin/vouchers`, `POST /api/admin/vouchers`, `GET /api/admin/vouchers/[id]`, `PUT /api/admin/vouchers/[id]`, `DELETE /api/admin/vouchers/[id]`, `PATCH /api/admin/vouchers/[id]/toggle`.
- [x] **Module 6.7: Quản Lý Khách Hàng (`/admin/khach-hang`)** *(Đã hoàn thành & Đã kiểm thử)*:
  - 4 Thẻ KPI thống kê khách hàng toàn diện: Khách thành viên đăng ký, Tài khoản đang hoạt động, Khách hàng VIP và Tổng doanh số tích lũy từ thành viên.
  - Phân hạng thành viên tự động 3 cấp bậc:
    - **Khách VIP (Award badge vàng gold)**: Chi tiêu tích lũy ≥ 5.000.000₫ hoặc ≥ 3 đơn hàng.
    - **Khách Quen (User badge xanh lá)**: Chi tiêu từ 1.000.000₫ hoặc ≥ 1 đơn hàng.
    - **Khách Mới (Slate badge)**: Thành viên mới đăng ký, chưa có đơn hàng.
  - Bộ lọc đa năng (`CustomerFilters.tsx`): Tìm kiếm nhanh theo tên, email, số điện thoại; Tabs phân hạng (Tất cả, VIP, Quen, Mới); lọc trạng thái (Đang hoạt động, Đã bị khóa); lọc vai trò (Khách hàng, Quản trị viên); sắp xếp (Mới tham gia nhất, Chi tiêu cao nhất, Nhiều đơn hàng nhất).
  - Bảng dữ liệu thông minh (`CustomerTable.tsx`):
    - Avatar với fallback chữ cái đầu thông minh, huy hiệu `ADMIN`, huy hiệu `Bạn` nhận diện tài khoản hiện tại.
    - Email và số điện thoại kèm thao tác gọi hoặc sao chép 1-chạm có phản hồi tức thì.
    - Tổng số đơn hàng và giá trị vòng đời khách hàng (LTV - Lifetime Value) tính từ các đơn đặt thực tế (loại trừ đơn hủy).
    - Ngày đặt đơn gần nhất và ngày tạo tài khoản.
    - **Cơ chế Khóa / Mở Khóa Tài Khoản & Bảo Vệ Chống Tự Khóa (Self-Lock Prevention Guard)**: Công tắc switch toggle với Optimistic UI, tự động vô hiệu hóa và chặn Admin tự khóa tài khoản của chính mình.
  - Modal Hồ Sơ Khách Hàng Toàn Diện (`CustomerDetailModal.tsx`):
    - Tóm tắt nhanh: Tổng chi tiêu LTV, Tổng đơn hàng, Số lượng đánh giá đã gửi.
    - Hệ thống 3 Tabs chuyên sâu:
      1. **Tab Đơn Hàng**: Danh sách tất cả đơn hàng đã mua (Mã đơn có link mở sang chi tiết đơn hàng, số món, tổng tiền, phương thức, trạng thái đơn & ngày đặt).
      2. **Tab Sổ Địa Chỉ**: Danh sách địa chỉ giao hàng đã lưu 4 cấp (Số nhà, Phường/Xã, Quận/Huyện, Tỉnh/Thành) kèm huy hiệu ĐỊA CHỈ MẶC ĐỊNH.
      3. **Tab Đánh Giá**: Toàn bộ đánh giá nhận xét thực tế đã gửi kèm số sao (1-5 sao), nội dung và liên kết đến sản phẩm ngoài website.
  - Hệ thống REST APIs chuẩn RBAC: `GET /api/admin/customers`, `GET /api/admin/customers/[id]`, `PATCH /api/admin/customers/[id]/toggle`.
- [x] **Module 6.8: Kiểm Duyệt Đánh Giá Khách Hàng (`/admin/danh-gia`)** *(Đã hoàn thành & Đã kiểm thử)*:
  - 4 Thẻ KPI thống kê đánh giá toàn diện: Tổng số đánh giá toàn sàn, Số đánh giá chờ kiểm duyệt (`PENDING` kèm hiệu ứng pulse cảnh báo), Số đánh giá đã công khai (`APPROVED`) và Điểm trung bình hài lòng của khách hàng (làm tròn thập phân ví dụ 5.0/5.0).
  - Bộ lọc thông minh (`ReviewFilters.tsx`):
    - Tabs trạng thái: Tất cả, Chờ kiểm duyệt (kèm badge số lượng chờ duyệt thời gian thực), Đã công khai, Từ chối / Ẩn.
    - Bộ lọc số sao linh hoạt: 5 sao, 4 sao, 3 sao, 2 sao, 1 sao hoặc tất cả.
    - Ô tìm kiếm đa năng theo tên khách hàng, email người đánh giá, tên sản phẩm hoặc từ khóa trong nội dung nhận xét.
    - Sắp xếp linh hoạt: Mới nhất, Sao cao nhất (5 ★), Sao thấp nhất (1 ★).
  - Bảng dữ liệu kiểm duyệt trực quan (`ReviewTable.tsx`):
    - Cột Sản phẩm: Ảnh thumbnail, tên sản phẩm và nút mở nhanh trang sản phẩm ngoài website (`/san-pham/[slug]`).
    - Cột Khách hàng: Avatar / Initials, tên người gửi và email liên hệ.
    - Cột Đánh giá: Sao vàng 1-5 sao, trích đoạn nhận xét của khách, danh sách ảnh đính kèm thực tế.
    - **Modal Lightbox xem ảnh đánh giá**: Bấm vào thumbnail ảnh đánh giá để phóng to toàn màn hình chi tiết.
    - Cột Trạng thái: Huy hiệu `🟡 Chờ duyệt` (amber pulse), `🟢 Đã công khai` (emerald), `🔴 Đã từ chối` (rose).
    - Thao tác nhanh 1-chạm:
      - Nút **"Duyệt"** (Check xanh): Phê duyệt tức thì để hiển thị công khai trên trang sản phẩm ngoài website.
      - Nút **"Ẩn"** (Ban cam): Từ chối hoặc tạm ẩn đánh giá vi phạm khỏi website.
      - Nút **"Xóa"** (Trash đỏ): Xóa vĩnh viễn đánh giá kèm modal xác nhận an toàn.
  - Hệ thống REST APIs bảo mật chuẩn RBAC: `GET /api/admin/reviews`, `PATCH /api/admin/reviews/[id]/status`, `DELETE /api/admin/reviews/[id]`.
- [x] **Module 6.9: Cài Đặt Hệ Thống & Thư Viện Media (`/admin/cai-dat` & `/admin/media`)** *(Đã hoàn thành & Đã kiểm thử)*:
  - **Phân hệ Cài Đặt Hệ Thống (`/admin/cai-dat`)**:
    - **Tab Thông tin thương hiệu**: Cấu hình Tên cửa hàng ("THUYNGA Shop"), Slogan cam kết chính hãng, Hotline CSKH, Email hỗ trợ, Địa chỉ showroom kho hàng, Thời gian mở cửa trực tổng đài, Facebook Fanpage, Zalo OA và kênh TikTok.
    - **Tab Tài khoản VietQR Napas 24/7**: Cấu hình Ngân hàng thụ hưởng (danh sách 15 ngân hàng lớn: MB, VCB, TCB, BIDV, ACB...), Số tài khoản, Tên chủ thụ hưởng, Mẫu hiển thị VietQR.
    - **Thẻ Live VietQR Preview**: Tự động sinh mã VietQR Napas 24/7 thời gian thực kèm tính năng quét thử 10.000₫ trực tiếp trên màn hình quản trị để kiểm tra độ chính xác của tài khoản ngân hàng.
    - **Tab Vận chuyển & Freeship**: Cấu hình Phí vận chuyển tiêu chuẩn (30.000₫), Ngưỡng miễn phí vận chuyển Freeship (500.000₫ đồng bộ với thanh tiến trình Freeship giỏ hàng), Cam kết vận chuyển Air Cargo chuẩn nhiệt độ.
    - **Tab SEO & Thẻ Meta**: Cấu hình Meta Title, Meta Description, Meta Keywords, OpenGraph Image URL kèm **Bộ mô phỏng Google Search SERP Simulator** hiển thị trực quan diện mạo website trên kết quả tìm kiếm Google.
    - Hệ thống REST APIs cài đặt: `GET /api/admin/settings` (tự động nạp giá trị mặc định thông minh nếu chưa có), `PUT /api/admin/settings` (upsert nguyên tử theo từng phân khu hoặc toàn bộ).
  - **Phân hệ Thư Viện Media (`/admin/media`)**:
    - 3 Thẻ KPI thống kê: Tổng số hình ảnh, Dung lượng lưu trữ đã sử dụng trên máy chủ (KB/MB), Định dạng ảnh hỗ trợ (WEBP, PNG, JPG, SVG, AVIF).
    - Modal Tải Ảnh (`MediaUploadModal.tsx`): Kéo & thả nhiều tệp cùng lúc từ máy tính hoặc thêm nhanh ảnh từ liên kết URL bên ngoài.
    - Lưới Ảnh Thông Minh (`MediaGrid.tsx`): Hiển thị ảnh vuông sắc nét, tên tệp, dung lượng và ngày tạo; Nút sao chép URL ảnh 1-chạm (`Copy URL`) có phản hồi tức thì để dán vào bài viết hoặc sản phẩm; Modal Lightbox phóng to ảnh độ phân giải gốc; Nút xóa ảnh an toàn.
    - Tích hợp điều hướng trực tiếp trên Sidebar Admin (`AdminSidebar.tsx`).
    - Hệ thống REST APIs media: `GET /api/admin/media`, `POST /api/admin/media`, `DELETE /api/admin/media/[id]`.

### 📚 Giai đoạn 8: Phân Hệ Cẩm Nang Sức Khỏe & Blog Tin Tức Chuẩn SEO (HOÀN THÀNH 100%)
- [x] **Giai đoạn 8.1: Schema Update, Seed Data Y Khoa & Zod Validation Layer** *(Đã hoàn thành & Đã kiểm thử)*:
  - Nâng cấp model `BlogPost` trong `prisma/schema.prisma` với các trường chuẩn Google E-E-A-T: `category`, `authorName`, `readingTime`, `viewCount`, `isFeatured`, `seoKeywords`.
  - Đồng bộ thành công cơ sở dữ liệu PostgreSQL qua Prisma `db push` và phát sinh lại Prisma Client.
  - Bộ dữ liệu mẫu y khoa thực tế (`prisma/seed-blogs.ts`): Nạp 6 bài viết cẩm nang sức khỏe chuyên sâu (cách dùng hồng sâm người cao tuổi, so sánh sữa Aptamil Úc/Anh, cách chọn cherry size 9.0 hàng bay, mẹo phân biệt tảo xoắn thật giả, vai trò D3K2MK7, cam kết vận chuyển Air Cargo).
  - Validation schema nghiêm ngặt: `src/lib/validations/blog.ts` kiểm thực tiêu đề, slug, tóm tắt, nội dung, chuyên mục, thời gian đọc và cấu hình SEO.
- [x] **Giai đoạn 8.2: Hệ Thống REST APIs Quản Trị Bài Viết Admin CMS** *(Đã hoàn thành & Đã kiểm thử)*:
  - `GET /api/admin/blogs`: Lấy danh sách bài viết phân trang, tìm kiếm đa năng (tiêu đề, tóm tắt, nội dung), lọc theo chuyên mục (`category`), trạng thái (`PUBLISHED` / `DRAFT`), bài nổi bật (`isFeatured`), sắp xếp theo ngày/lượt xem/tên, và tổng hợp 4 chỉ số KPI (Tổng bài, Đã xuất bản, Bản nháp, Tổng lượt xem).
  - `POST /api/admin/blogs`: Tạo bài viết mới, tự động tạo slug tiếng Việt chuẩn SEO từ tiêu đề, tự động tính toán thời gian đọc (`readingTime`) dựa trên độ dài nội dung, tự gán ngày xuất bản `publishedAt`.
  - `GET /api/admin/blogs/[id]`: Truy vấn chi tiết bài viết phục vụ màn hình chỉnh sửa.
  - `PUT /api/admin/blogs/[id]`: Cập nhật toàn diện nội dung, chuyên mục, ảnh cover, thẻ Meta SEO và kiểm tra chống trùng lặp slug với bài viết khác.
  - `PATCH /api/admin/blogs/[id]/publish`: Bật/tắt nhanh trạng thái xuất bản bài viết với Optimistic UI, tự động cập nhật thời gian xuất bản khi bài được duyệt lên sóng.
  - `PATCH /api/admin/blogs/[id]/feature`: Bật/tắt ghim bài viết tiêu điểm nổi bật (Featured Hero Story).
  - `DELETE /api/admin/blogs/[id]`: Xóa vĩnh viễn bài viết khỏi hệ thống.
- [x] **Giai đoạn 8.3: Giao Diện Quản Trị Bài Viết Admin CMS (`/admin/bai-viet`)** *(Đã hoàn thành & Đã kiểm thử)*:
  - Tích hợp mục "Bài viết" với icon `BookOpen` trên thanh điều hướng `AdminSidebar.tsx`.
  - 4 Thẻ KPI thống kê chuyên sâu (`BlogStats.tsx`): Tổng bài cẩm nang, Đã xuất bản, Bản nháp, và Tổng lượt đọc tích lũy.
  - Thanh công cụ lọc & tìm kiếm đa năng (`BlogFilters.tsx`): Lọc theo chuyên mục danh mục E-E-A-T dạng tab trượt, trạng thái xuất bản, tìm kiếm thời gian thực, sắp xếp linh hoạt.
  - Bảng danh sách bài viết chuẩn Luxury (`BlogTable.tsx`): Ảnh bìa cover, tiêu đề kèm badge danh mục, tác giả, thời gian đọc, thống kê lượt xem, nút ghim bài viết tiêu điểm dạng sao vàng, công tắc gạt xuất bản/bản nháp Optimistic UI tức thì, cùng menu hành động & phân trang thông minh.
  - Bộ điều phối giao diện quản trị Client (`BlogManager.tsx`): Xử lý tải dữ liệu thời gian thực, cập nhật giao diện lạc quan (Optimistic Updates), tự động hoàn tác khi có sự cố, hộp thoại xác nhận xóa bài viết bảo mật và thông báo Toast trạng thái.
  - Trình soạn thảo & tối ưu hóa bài viết chuyên sâu (`BlogForm.tsx`):
    - Hỗ trợ cả 2 chế độ Tạo mới (`/admin/bai-viet/tao-moi`) và Chỉnh sửa (`/admin/bai-viet/[id]`).
    - Bộ sinh slug tự động loại bỏ dấu tiếng Việt chuẩn URL SEO với tính năng khóa/mở khóa tùy biến.
    - Thanh công cụ định dạng Markdown nhanh (H2, H3, Bold, Italic, List, Trích dẫn chuyên gia, Bảng dữ liệu, Chèn link).
    - Tab chuyển đổi giữa "Soạn Thảo" và "Xem Trước (Live Preview)" chuẩn typo cẩm nang y khoa.
    - Bộ mô phỏng kết quả tìm kiếm Google SERP Simulator (xem trước giao diện Google Desktop & Mobile kèm Title, URL breadcrumb, Snippet mô tả).
    - Tự động ước lượng thời gian đọc dựa trên số lượng từ ngữ chuyên môn.
    - Xem trước trực tiếp ảnh bìa (Cover Image) với tỷ lệ chuẩn 16:9.
- [x] **Giai đoạn 8.4: Giao Diện Storefront Danh Sách Cẩm Nang (`/tin-tuc`)** *(Đã hoàn thành & Đã kiểm thử)*:
  - Trang Server Component `/tin-tuc` tích hợp bộ dữ liệu SEO đầy đủ: Meta Tags, OpenGraph, Canonical URL và Schema.org `CollectionPage` + `ItemList` JSON-LD.
  - Banner tiêu điểm nổi bật Magazine Layout (`BlogHeroFeatured.tsx`): Ảnh cover lớn zoom mượt, nhãn sao vàng "Bài Viết Tiêu Điểm", ngày đăng, thời gian đọc, tóm tắt trích dẫn và thông tin xác thực chuyên gia "Dược sĩ Thu Nga".
  - Thanh chuyển đổi danh mục & tìm kiếm tức thì (`BlogCategoryFilter.tsx`): Tab phân loại chuẩn E-E-A-T kèm huy hiệu đếm số lượng bài viết động, thanh tìm kiếm từ khóa thời gian thực.
  - Thẻ bài viết cẩm nang chuẩn tạp chí (`BlogCard.tsx`): Tỷ lệ khung hình 16:9, nhãn chuyên mục, số lượt đọc, thời gian đọc, thông tin tác giả và hiệu ứng chuyển màu thương hiệu sang trọng.
  - Bộ điều phối danh sách bài viết Client (`BlogListClient.tsx`): Lọc kết hợp đa tiêu chí (danh mục + từ khóa tìm kiếm), sắp xếp theo Mới nhất / Lượt đọc nhiều nhất, phân trang 9 bài/trang mượt mà và giao diện trạng thái trống (Empty State) tinh tế.
  - Khối cam kết chuyên môn y khoa & Hotline Dược sĩ (`BlogExpertBanner.tsx`): Khẳng định cam kết hàng bay Air Cargo, nguyên tắc vàng không kinh doanh thuốc kê đơn, nút gọi Hotline và Chat Zalo tư vấn 1:1.
- [x] **Giai đoạn 8.5: Trang Chi Tiết Bài Viết & Ghim Sản Phẩm Mua Ngay (`/tin-tuc/[slug]`)** *(Đã hoàn thành & Đã kiểm thử)*:
  - Trang Server Component `/tin-tuc/[slug]` tích hợp dynamic `generateMetadata`: Tối ưu hóa toàn diện thẻ Meta SEO, OpenGraph image, canonical URL và Schema.org `Article` JSON-LD tự động gắn thông tin Dược sĩ chuyên môn E-E-A-T.
  - Tự động tăng số lượt đọc `viewCount` theo phương thức atomic increment an toàn và bảo toàn hiệu năng.
  - Mục lục bài viết thông minh Scrollspy (`TableOfContents.tsx`): Tự động trích xuất cấu trúc đề mục H2, H3, đồng bộ anchor URL, hỗ trợ thu gọn accordion trên thiết bị di động và cuộn mượt mà (smooth scrolling) tới từng phần.
  - Thanh chia sẻ đa kênh & Chỉ báo tiến độ đọc (`ArticleShareBar.tsx`): Pinned reading progress bar chuyển màu gradient ở đầu màn hình, sao chép liên kết 1 chạm, chia sẻ nhanh lên Facebook, Zalo và in bài viết.
  - Trình hiển thị nội dung y khoa chuẩn Typo (`ArticleContent.tsx`): Tự động định dạng đề mục có gắn ID neo, trích dẫn lời khuyên chuyên gia (Expert Callout Quote), danh sách tiện ích và thẻ Khuyến cáo y khoa bắt buộc (Medical Disclaimer).
  - Khối ghim sản phẩm khuyên dùng Shop The Story (`ArticleProductMentions.tsx`): Kết nối trực tiếp cơ sở dữ liệu hàng ngoại nhập chính hãng, hiển thị ảnh, thương hiệu, xuất xứ, giá bán ưu đãi, phần trăm giảm giá và nút xem chi tiết mua ngay.
  - Thanh bài viết cùng chuyên mục liên quan (`RelatedArticles.tsx`): Gợi ý 3 bài cẩm nang cùng chủ đề giúp giữ chân khách hàng và tối ưu luồng đọc.
  - Sidebar cố định (Sticky Sidebar): Tích hợp hộp thoại liên hệ Hotline Dược sĩ và tư vấn Chat Zalo trực tiếp 1:1.

### ⚡ Giai đoạn 9: Phân Hệ Quản Lý Chiến Dịch Flash Sale & Săn Deal Giờ Vàng (ĐANG TRIỂN KHAI)
- [x] **Giai đoạn 9.1: Nâng cấp Schema FlashSale, Zod Validation & Seed chiến dịch Giờ Vàng hoạt động** *(Đã hoàn thành & Đã kiểm thử)*:
  - Bổ sung `bannerImage`, `description`, `updatedAt` vào model `FlashSale` trong `prisma/schema.prisma`.
  - Đồng bộ thành công cơ sở dữ liệu PostgreSQL qua Prisma `db push` và tái sinh Prisma Client v5.22.0.
  - Xây dựng lớp kiểm thực dữ liệu Zod toàn diện (`src/lib/validations/flash-sale.ts`): Kiểm tra tên chiến dịch, thời lượng hợp lệ (`startTime < endTime`), giá Flash Sale sốc, số lượng phân bổ và giới hạn mỗi khách mua.
  - Kịch bản nạp dữ liệu mẫu thực tế (`prisma/seed-flash-sales.ts`): Nạp chiến dịch đang diễn ra "⚡ ĐẠI TIỆC GIỜ VÀNG – HÀNG BAY AIR CARGO & VITAMIN ÚC" kèm 5 deal sản phẩm thực tế (Cherry Đỏ Mỹ, Ginkgo Biloba, Collagen DHC, Nho Mẫu Đơn, Hồng Sâm KGC) với số lượng và tiến độ cháy hàng sinh động, cùng chiến dịch sắp diễn ra "🔥 ĐÊM HỘI SĂN DEAL – CHĂM SÓC MẸ & BÉ".
- [x] **Giai đoạn 9.2: Hệ thống REST APIs Admin Quản Lý Chiến Dịch & Sản Phẩm Flash Sale** *(Đã hoàn thành & Đã kiểm thử)*:
  - `GET /api/admin/flash-sales`: Lấy danh sách chiến dịch phân trang, tìm kiếm theo tên/mô tả, lọc theo trạng thái (`ACTIVE` - Đang diễn ra, `UPCOMING` - Sắp tới, `ENDED` - Đã kết thúc) và tổng hợp số liệu 6 chỉ số KPI (Tổng chiến dịch, Đang chạy, Sắp tới, Đã kết thúc, Tổng lượt bán Flash Sale, Tỷ lệ cháy hàng trung bình).
  - `POST /api/admin/flash-sales`: Tạo chiến dịch Flash Sale mới kèm kiểm thực thời lượng chặt chẽ.
  - `GET /api/admin/flash-sales/[id]`: Truy vấn thông tin chi tiết chiến dịch và danh sách các sản phẩm deal (giá gốc, giá sale, số lượng, tỷ lệ đã bán).
  - `PUT /api/admin/flash-sales/[id]`: Cập nhật tên chiến dịch, mô tả, banner và điều chỉnh mốc thời gian giờ vàng.
  - `DELETE /api/admin/flash-sales/[id]`: Xóa vĩnh viễn chiến dịch (tự động cascade xóa các deal liên kết).
  - `PATCH /api/admin/flash-sales/[id]/toggle`: Bật/tắt trạng thái kích hoạt chiến dịch (`isActive`).
  - `POST /api/admin/flash-sales/[id]/items`: Thêm hoặc cập nhật biến thể sản phẩm vào chiến dịch với giá sốc, số lượng phân bổ và giới hạn mỗi khách (`limitPerUser`).
  - `PUT /api/admin/flash-sales/[id]/items/[itemId]`: Điều chỉnh giá sale, số lượng mở bán hoặc số lượng đã bán.
  - `DELETE /api/admin/flash-sales/[id]/items/[itemId]`: Gỡ bỏ sản phẩm khỏi chiến dịch giờ vàng.
- [x] **Giai đoạn 9.3: Giao diện Quản trị Flash Sale Admin CMS (`/admin/flash-sale`)** *(Đã hoàn thành & Đã kiểm thử)*:
  - Tích hợp mục "Flash Sale" kèm biểu tượng tia chớp `Zap` trên thanh điều hướng `AdminSidebar.tsx`.
  - 4 Thẻ KPI thống kê chuyên sâu (`FlashSaleStats.tsx`): Đang diễn ra, Sắp diễn ra, Lượt mua Flash Sale tích lũy, và Doanh thu giờ vàng.
  - Thanh công cụ lọc & tìm kiếm đa năng (`FlashSaleFilters.tsx`): Tabs lọc trạng thái (`ACTIVE`, `UPCOMING`, `ENDED`), tìm kiếm theo tên chiến dịch và sắp xếp linh hoạt.
  - Bảng danh sách chiến dịch chuẩn Luxury (`FlashSaleTable.tsx`): Hiển thị thumbnail banner, mốc thời gian bắt đầu - kết thúc, nhãn trạng thái động, thanh đo mức độ cháy hàng trực quan theo phần trăm, công tắc gạt kích hoạt `isActive` với Optimistic UI và menu thao tác.
  - Modal tạo mới & cập nhật chiến dịch (`FlashSaleCampaignModal.tsx`): Hỗ trợ nhập tên, mô tả, ảnh banner xem trước tỉ lệ 21:9, chọn mốc thời gian bắt đầu - kết thúc với kiểm thực logic thời gian tự động.
  - Modal Quản lý deal sản phẩm chuyên sâu (`FlashSaleItemModal.tsx`): Tìm kiếm sản phẩm trong kho hàng, chọn biến thể/quy cách, tự động tính phần trăm giảm giá theo thời gian thực khi nhập giá Flash Sale, phân bổ số lượng mở bán, thiết lập giới hạn mua mỗi khách và gỡ deal an toàn.
  - Trang Server Component [`/admin/flash-sale`](/admin/flash-sale): Pre-fetch SSR siêu tốc và điều phối trạng thái với `FlashSaleManager.tsx`.
- [ ] **Giai đoạn 9.4: Giao diện Storefront Săn Deal Giờ Vàng (`/flash-sale`)**: Đồng hồ đếm ngược số LED sang trọng, thanh đo độ cháy hàng, tab khung giờ.
- [ ] **Giai đoạn 9.5: Đồng bộ Giá Flash Sale Với Giỏ Hàng & Checkout Storefront**: Tự động áp dụng giá giờ vàng và kiểm soát giới hạn tồn kho.

### 🔜 Giai đoạn 7: Triển Khai Lên VPS Ubuntu & Production
- [ ] Cấu hình Nginx làm Reverse Proxy trỏ domain về cổng 3000.
- [ ] Thiết lập PM2 quản lý tiến trình tự động khởi động lại khi server reboot.
- [ ] Cài đặt SSL miễn phí qua Cloudflare hoặc Certbot Let's Encrypt.
- [ ] Backup tự động PostgreSQL định kỳ.

---

*Tài liệu được lập và duy trì bởi Developer Trần Văn Cường & AI Co-pilot | Cập nhật lần cuối: 2026-10-27*
