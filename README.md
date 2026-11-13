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

### ⚡ Giai đoạn 9: Phân Hệ Quản Lý Chiến Dịch Flash Sale & Săn Deal Giờ Vàng (HOÀN THÀNH 100%)
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
- [x] **Giai đoạn 9.4: Giao diện Storefront Săn Deal Giờ Vàng (`/flash-sale`)** *(Đã hoàn thành & Đã kiểm thử)*:
  - Trang Server Component [`/flash-sale`](/flash-sale) tối ưu hóa SEO với Meta Tags, OpenGraph, Canonical URL và Schema.org `SaleEvent` JSON-LD tự động gắn lịch trình sự kiện giờ vàng.
  - Đồng hồ đếm ngược thời gian thực dạng Flip/LED sang trọng (`FlashSaleCountdown.tsx`): Hiển thị Ngày, Giờ, Phút, Giây kèm hiệu ứng đổi màu cảnh báo khi gần hết giờ.
  - Thẻ sản phẩm deal sốc tương tác cao (`FlashSaleDealCard.tsx`): Tỷ lệ vuông sắc nét, nhãn giảm giá đỏ rượu `-XX%`, xuất xứ chính ngạch, thanh đo mức độ cháy hàng (Urgency Bar) `SẮP CHÁY HÀNG • ĐÃ BÁN XX%`, nhãn giới hạn mua và nút "Săn Ngay Deal Này" tích hợp trực tiếp `useCartStore` với phản hồi tức thì.
  - Thanh chọn khung giờ săn deal (`FlashSaleTimeSlots.tsx`): Chuyển đổi linh hoạt giữa phiên "⚡ Đang diễn ra" và phiên "⏳ Sắp diễn ra" để khách hàng xem trước ưu đãi.
  - Bộ điều phối săn deal Client (`FlashSaleClient.tsx`): Lọc deal theo ngành hàng (Trái cây bay, TPCN, Mẹ & bé), tìm kiếm thời gian thực và khối Cam kết 3 không của THUYNGA Shop.
- [x] **Giai đoạn 9.5: Đồng bộ Giá Flash Sale Với Giỏ Hàng & Checkout Storefront** *(Đã hoàn thành & Đã kiểm thử)*:
  - Mở rộng kiểu dữ liệu giỏ hàng `CartItem` (`src/types/index.ts`): Bổ sung cờ `isFlashSale` và `originalPrice` phục vụ hiển thị nhãn ưu đãi giờ vàng.
  - Cập nhật giao diện giỏ hàng (`CartItemRow.tsx`): Hiển thị huy hiệu đỏ rượu `Giá Flash Sale`, gạch ngang giá gốc và hiển thị mức giá giờ vàng ưu đãi.
  - Đồng bộ logic thêm vào giỏ từ cả trang chủ (`FlashSaleSection.tsx`) lẫn Hub chuyên biệt (`FlashSaleDealCard.tsx`).
  - Nâng cấp API đặt hàng bảo mật (`src/app/api/orders/route.ts`): Tự động kiểm tra thời gian thực xem biến thể có đang nằm trong chiến dịch Flash Sale hợp lệ hay không; Áp dụng giá `salePrice` chuẩn xác từ máy chủ (chống thao túng giá phía Client); Kiểm soát giới hạn mua mỗi khách (`limitPerUser`) và tự động tăng số lượng đã bán `soldCount` trong cơ sở dữ liệu.

### 💎 Giai đoạn 10: Hệ Thống Khách Hàng Thân Thiết & Tích Điểm Đổi Thưởng (THUYNGA Club - HOÀN THÀNH 100%)
- [x] **Giai đoạn 10.1: Nâng cấp Schema User & Order, Zod Validations & Seed Hạng Thành Viên** *(Đã hoàn thành & Đã kiểm thử)*:
  - Bổ sung trường `loyaltyPoints`, `totalPointsEarned`, `membershipTier` (`BRONZE`, `SILVER`, `GOLD`, `DIAMOND`) vào model `User` trong `prisma/schema.prisma`.
  - Bổ sung trường `pointsEarned`, `pointsRedeemed`, `pointsDiscount` vào model `Order`.
  - Tạo mới model sổ cái giao dịch điểm tích lũy `LoyaltyTransaction` (`id`, `userId`, `orderId`, `points`, `type`, `description`, `balanceAfter`, `createdAt`).
  - Đồng bộ thành công cơ sở dữ liệu PostgreSQL qua Prisma `db push` và tái sinh Prisma Client v5.22.0.
  - Xây dựng lớp kiểm thực dữ liệu Zod toàn diện & cấu hình đặc quyền 4 hạng thành viên (`src/lib/validations/loyalty.ts`): Cấu hình tỷ lệ hoàn điểm (1% ➔ 3%), danh mục đổi thưởng Voucher 50k, 100k, 250k.
  - Kịch bản nạp dữ liệu mẫu thực tế (`prisma/seed-loyalty.ts`): Phân bổ hạng VIP và lịch sử giao dịch tích lũy điểm sinh động cho các khách hàng thân thiết.
- [x] **Giai đoạn 10.2: Hệ thống REST APIs Quản lý Điểm Tích Lũy & Hạng Thành Viên** *(Đã hoàn thành & Đã kiểm thử)*:
  - `GET /api/user/loyalty`: Truy vấn số dư điểm khả dụng, tổng điểm tích lũy trọn đời, thông tin hạng thành viên VIP hiện tại, tiến trình thăng hạng kế tiếp (% hoàn thành, số tiền chi tiêu còn thiếu), danh sách quyền lợi và 30 giao dịch gần nhất.
  - `POST /api/user/loyalty/redeem`: Động cơ đổi điểm lấy Voucher (`VOUCHER_50K`, `VOUCHER_100K`, `VOUCHER_250K`); Tự động sinh mã voucher độc quyền định dạng `CLUB-XXXX`, kiểm tra số dư điểm, trừ điểm an toàn qua transaction và cập nhật sổ cái `LoyaltyTransaction`.
  - `GET /api/admin/loyalty`: Sổ cái tích điểm toàn hệ thống dành cho Admin; Lọc theo loại giao dịch (`Tích điểm đơn hàng`, `Đổi voucher`, `Admin thưởng`), lọc theo hạng thành viên (`BRONZE`, `SILVER`, `GOLD`, `DIAMOND`), tìm kiếm khách hàng và thống kê 5 chỉ số KPI chuyên sâu (Điểm lưu hành, Điểm đã quy đổi, Giá trị tiền tệ tương đương, Phân bổ 4 hạng thành viên).
  - `POST /api/admin/loyalty/adjust`: Admin điều chỉnh cộng/trừ điểm thủ công cho khách hàng có lý do rõ ràng, kiểm tra chống âm điểm và tự động ghi log vào sổ cái.
- [x] **Giai đoạn 10.3: Giao diện Quản trị Khách Hàng Thân Thiết Admin CMS (`/admin/khach-hang/tich-diem`)** *(Đã hoàn thành & Đã kiểm thử)*:
  - Tích hợp mục "Tích điểm & VIP" kèm biểu tượng huân chương `Award` trên thanh điều hướng `AdminSidebar.tsx`.
  - 4 Thẻ KPI thống kê điểm & thành viên chuyên sâu (`LoyaltyStats.tsx`): Điểm đang lưu hành (kèm giá trị quy đổi VNĐ tương đương `≈ XX.XXX.XXX ₫`), Điểm đã đổi thưởng voucher, Tổng điểm tích trọn đời, và Phân bổ số lượng 4 hạng thành viên Đồng / Bạc / Vàng / Kim Cương.
  - Thanh công cụ lọc & tìm kiếm đa năng (`LoyaltyFilters.tsx`): Tabs phân loại theo 6 loại giao dịch (Tất cả, Tích điểm đơn, Đổi voucher, Trừ điểm checkout, Admin điều chỉnh, Thưởng chào mừng), Dropdown lọc theo hạng VIP, ô tìm kiếm khách hàng theo tên, email, SĐT hoặc nội dung giao dịch.
  - Bảng sổ cái kiểm toán minh bạch (`LoyaltyTable.tsx`):
    - Cột thời gian chuẩn hóa tiếng Việt `DD/MM/YYYY HH:mm`.
    - Thông tin khách hàng: Avatar/Initials, tên kèm liên kết đến hồ sơ khách, email, badge hạng VIP (Đồng, Bạc, Vàng, Kim Cương).
    - Huy hiệu phân loại giao dịch kèm màu sắc và icon nhận diện.
    - Cột biến động điểm: Hiển thị nổi bật `+XX điểm` (xanh lá) hoặc `-XX điểm` (đỏ rượu).
    - Cột số dư sau giao dịch (balanceAfter pts) và Diễn giải chi tiết kèm link trực tiếp đến đơn hàng liên quan nếu có.
    - Phân trang dữ liệu thông minh.
  - Modal Điều chỉnh điểm thủ công (`AdjustPointsModal.tsx`):
    - Tìm kiếm và chọn nhanh khách hàng cần thưởng/phạt điểm với debounce thời gian thực.
    - Nhập số điểm (dương để cộng, âm để trừ) kèm các nút bấm nhanh: `+100`, `+500`, `+1,000`, `-100`, `-500`.
    - Nhập lý do/diễn giải kiểm toán chi tiết bắt buộc.
    - Xử lý thông báo thành công và cập nhật lại dữ liệu ngay lập tức.
  - Trang Server Component [`/admin/khach-hang/tich-diem`](/admin/khach-hang/tich-diem): Pre-fetch SSR siêu tốc và điều phối trạng thái với `LoyaltyManager.tsx`.
- [x] **Giai đoạn 10.4: Giao diện Storefront Trung Tâm Thành Viên THUYNGA Club (`/tai-khoan/tich-diem`)** *(Đã hoàn thành & Đã kiểm thử)*:
  - Tích hợp lối tắt truy cập nhanh "THUYNGA Club (Tích điểm)" tại Dropdown Menu Header (`UserAccountMenu.tsx`) và Thanh điều hướng tài khoản (`AccountSidebar.tsx`).
  - Thẻ Hội viên VIP điện tử chuẩn Luxury (`VIPMembershipCard.tsx`):
    - Đồ họa thẻ 3D kim loại sang trọng với gradient chuyên biệt theo từng hạng: Đồng (Hổ phách đồng), Bạc (Bạch kim chrome), Vàng (Hoàng kim sâm-panh), Kim Cương (Thạch anh tím & Obsidian huyền bí).
    - Họa tiết phôi chip vi mạch EMV, sóng thanh toán không tiếp xúc Contactless và chìm biểu tượng vương miện `Crown`.
    - Hiển thị số dư điểm khả dụng thời gian thực kèm giá trị tiền mặt quy đổi tương đương (`≈ XX.XXX ₫`).
    - Thanh đo tiến độ thăng hạng tiếp theo (Next Tier Progress Bar): Đo lường chính xác số tiền chi tiêu còn thiếu và phần trăm hoàn thành chặng đường.
  - Bảng so sánh đặc quyền 4 hạng hội viên (`TierPrivilegesTable.tsx`): Trực quan hóa tỷ lệ hoàn điểm (1% ➔ 3%), quà tặng sinh nhật (100k ➔ 500k), miễn phí vận chuyển toàn quốc trọn đời và Hotline Dược sĩ VIP 1:1, tự động highlight "Hạng Hiện Tại Của Bạn".
  - Gian hàng đổi thưởng điểm tích lũy (`LoyaltyRedemptionShop.tsx`):
    - 3 Mức Voucher độc quyền: 50.000₫ (500 pts), 100.000₫ (900 pts - Tiết kiệm 100 pts), 250.000₫ VIP (2.000 pts - Tiết kiệm 500 pts).
    - Động cơ đổi thưởng 1-chạm kết nối trực tiếp API `/api/user/loyalty/redeem`, sinh mã voucher cá nhân định dạng `CLUB-XXXX`, tự động trừ điểm và cập nhật số dư tức thì không cần reload.
    - Hộp thoại nhận voucher thành công tích hợp nút "Sao Chép Mã" và chuyển hướng nhanh sang mua sắm.
  - Sổ theo dõi lịch sử điểm thưởng (`MemberPointsHistory.tsx`): Bộ lọc Tabs (Tất cả, Điểm cộng, Đã đổi), ngày giờ chuẩn hóa tiếng Việt, huy hiệu và số dư sau giao dịch.
  - Trang Server Component [`/tai-khoan/tich-diem`](/tai-khoan/tich-diem): Kiểm soát phiên đăng nhập an toàn (Auth Guard), tính toán SSR siêu tốc và điều phối với `LoyaltyHubClient.tsx`.
- [x] **Giai đoạn 10.5: Tự Động Tích Điểm Khi Hoàn Tất Đơn Hàng & Đổi Điểm Trực Tiếp Khi Checkout** *(Đã hoàn thành & Đã kiểm thử)*:
  - Tích hợp động cơ Đổi Điểm Trực Tiếp tại trang Thanh toán (`CheckoutClient.tsx`):
    - Tự động hiển thị khối THUYNGA Club nếu khách hàng có số dư điểm khả dụng (`availablePoints > 0`).
    - Công tắc chuyển đổi (Switch Toggle) kích hoạt sử dụng điểm tích lũy kèm nút chọn "Tối đa" 1-chạm.
    - Cơ chế an toàn nghiệp vụ: Cố định mức giảm tối đa 50% giá trị giỏ hàng sau khi đã trừ voucher, chống tiêu cực hoặc lạm dụng.
    - Hiển thị trực quan dòng giảm trừ điểm trong bảng tính chi phí đơn hàng (`-XX.XXX₫`).
  - Đặc quyền Freeship trọn đời cho Hội viên Kim Cương (`DIAMOND`): Hệ thống tự động phát hiện hạng Kim Cương và miễn 100% phí vận chuyển toàn quốc (`shippingFee = 0₫`) tại cả giao diện người dùng và máy chủ backend.
  - Xử lý giao dịch đặt hàng nguyên tử (`src/app/api/orders/route.ts`):
    - Nhận diện `pointsToRedeem`, kiểm tra số dư điểm thực tế trên máy chủ, trừ điểm tích lũy an toàn và lưu `pointsRedeemed`, `pointsDiscount` vào bản ghi đơn hàng.
    - Tự động tạo bản ghi giao dịch âm trong sổ cái `LoyaltyTransaction` (`type: "REDEEM_ORDER"`).
  - Tự động tích điểm & thăng hạng khi giao hàng thành công (`src/app/api/admin/orders/[id]/status/route.ts`):
    - Khi trạng thái đơn hàng chuyển sang `DELIVERED`, hệ thống tự động tính điểm thưởng theo tỷ lệ hạng của khách (Đồng 1%, Bạc 1.5%, Vàng 2%, Kim Cương 3%).
    - Cộng điểm vào `loyaltyPoints` và `totalPointsEarned`, cập nhật `pointsEarned` trên đơn hàng và ghi sổ cái `type: "EARN_ORDER"`.
    - **Cơ chế Tự Động Thăng Hạng VIP (Auto Tier Upgrade Engine)**: Tính toán tổng chi tiêu các đơn giao thành công, tự động nâng hạng khách hàng (Đồng ➔ Bạc ➔ Vàng ➔ Kim Cương) ngay khi đạt ngưỡng.
  - Cơ chế hoàn điểm khi hủy đơn: Nếu đơn hàng có sử dụng điểm bị chuyển sang `CANCELLED`, hệ thống tự động hoàn trả đầy đủ điểm đã trừ vào tài khoản khách và ghi nhật ký sổ cái (`type: "ADMIN_ADJUST"`).

### 🔔 Giai đoạn 11: Phân Hệ Trung Tâm Thông Báo Đẩy Thời Gian Thực (In-App Notification Center - HOÀN THÀNH 100%)
- [x] **Giai đoạn 11.1: Nâng cấp Schema Notification, Zod Validations & Seed Dữ Liệu Thông Báo Mẫu** *(Đã hoàn thành & Đã kiểm thử)*:
  - Khởi tạo enum `NotificationType` (`ORDER_STATUS`, `PROMOTION`, `LOYALTY_TIER`, `SYSTEM`) trong `prisma/schema.prisma`.
  - Thiết lập model `Notification` (`id`, `userId`, `title`, `message`, `type`, `link`, `isRead`, `readAt`, `createdAt`) kèm chỉ mục kép hiệu năng cao `[userId, isRead]` và `[userId, createdAt]`.
  - Mở rộng model `User` liên kết 1-N với `Notification` (`onDelete: Cascade`).
  - Đồng bộ thành công cơ sở dữ liệu PostgreSQL qua Prisma `db push` và tái sinh Prisma Client v5.22.0.
  - Xây dựng lớp kiểm thực dữ liệu Zod toàn diện (`src/lib/validations/notification.ts`): Schemas cho tạo thông báo đơn lẻ, phát sóng broadcast toàn sàn, lọc danh sách phân trang và từ điển cấu hình nhãn badge theo loại thông báo.
  - Kịch bản nạp dữ liệu mẫu sinh động (`prisma/seed-notifications.ts`): Nạp 48 thông báo thực tế cho khách hàng (thông báo đơn hàng đang giao, Flash Sale sốc 35%, chúc mừng thăng hạng Kim Cương, quà sinh nhật và cập nhật bảo mật).
- [x] **Giai đoạn 11.2: Hệ Thống REST APIs Quản Lý Thông Báo & Helper Service Phát Thông Báo Server-Side** *(Đã hoàn thành & Đã kiểm thử)*:
  - Xây dựng module điều phối thông báo độc lập (`src/lib/notifications.ts`): Cung cấp hàm `createInAppNotification` tạo thông báo mục tiêu và `broadcastInAppNotification` phát sóng hàng loạt theo vai trò hoặc nhóm khách hàng VIP (`createMany`).
  - `GET /api/notifications`: Truy vấn thông báo phân trang của người dùng hiện tại, tính toán số lượng chưa đọc thời gian thực (`unreadCount`), hỗ trợ bộ lọc đa dạng theo loại thông báo (`ORDER_STATUS`, `PROMOTION`, `LOYALTY_TIER`, `SYSTEM`) và trạng thái đọc (`UNREAD`, `READ`, `ALL`).
  - `PATCH /api/notifications/[id]/read`: Đánh dấu đọc thông báo đơn lẻ, cập nhật `readAt` và tính lại số thông báo chưa đọc còn lại tức thì.
  - `POST /api/notifications/read-all`: Đánh dấu tất cả thông báo của người dùng là đã đọc 1-chạm (`updateMany`).
  - `DELETE /api/notifications/[id]`: Xóa thông báo khỏi danh sách cá nhân an toàn có kiểm tra quyền sở hữu.
  - `POST /api/admin/notifications/broadcast`: Endpoint Admin phát sóng chiến dịch khuyến mãi hoặc thông báo bảo trì toàn sàn với kiểm soát RBAC chặt chẽ.
- [x] **Giai đoạn 11.3: Giao diện Chuông Báo Đẩy Real-time (Notification Bell Dropdown Popover)** *(Đã hoàn thành & Đã kiểm thử)*:
  - Tích hợp biểu tượng chuông thông minh `NotificationBell.tsx` trên thanh Header điều hướng cửa hàng (`Header.tsx`) cạnh giỏ hàng và menu tài khoản.
  - Huy hiệu số lượng chưa đọc nổi bật (Badge vàng hoàng kim trên nền đỏ rượu với hiệu ứng xung nhịp `animate-ping` thu hút sự chú ý khi có thông báo mới).
  - Cửa sổ Popover thả xuống sang trọng (Dropdown Popover 380px) hiển thị danh sách thông báo mới nhất:
    - Nút "Đọc tất cả" 1-chạm kích hoạt `POST /api/notifications/read-all`.
    - Thanh điều hướng Tabs phân loại nhanh: Tất cả, Đơn hàng (`Package`), Ưu đãi (`Tag`), Hội viên THUYNGA Club (`Crown`).
    - Thẻ thông báo trực quan: Nhận diện trạng thái chưa đọc (nền phớt hồng và chấm đỏ rượu), định dạng thời gian tương đối tiếng Việt thân thiện (`Vừa xong`, `XX phút trước`, `XX giờ trước`).
    - Nhấp thông báo: Tự động đánh dấu đã đọc trên máy chủ, giảm số đếm chưa đọc tức thì và chuyển hướng mượt mà đến trang liên kết (`order`, `flash-sale`, `loyalty`).
    - Chân Popover: Nút mở nhanh trang Trung tâm thông báo chuyên sâu `/tai-khoan/thong-bao`.
  - Cơ chế đồng bộ Polling định kỳ 45 giây/lần tự động cập nhật số thông báo mới mà không gây nặng tải cho server.
- [x] **Giai đoạn 11.4: Giao diện Storefront Trung Tâm Thông Báo Chuyên Sâu (`/tai-khoan/thong-bao`)** *(Đã hoàn thành & Đã kiểm thử)*:
  - Tích hợp mục "Thông báo của tôi" kèm biểu tượng `Bell` trên thanh điều hướng `AccountSidebar.tsx` và menu thả xuống Header `UserAccountMenu.tsx`.
  - Khối Header tổng quan hiển thị số thông báo chưa đọc, huy hiệu nhận diện và nút bấm "Đánh dấu tất cả đã đọc" 1-chạm.
  - Thanh Tabs điều hướng phân loại 5 danh mục: Tất cả, 📦 Đơn hàng, ⚡ Khuyến mãi & Flash Sale, 👑 THUYNGA Club & VIP, 🛡️ Hệ thống.
  - Bộ lọc trạng thái đọc: Chuyển đổi linh hoạt giữa "Tất cả thông báo", "Chỉ tin chưa đọc" và "Đã đọc".
  - Thẻ thông báo chuyên sâu (`NotificationHubClient.tsx`):
    - Khối icon phân loại nổi bật kèm màu sắc chủ đạo riêng biệt.
    - Tiêu đề đậm nét, nội dung hiển thị đầy đủ, nhãn ngày giờ định dạng tiếng Việt chi tiết `DD/MM/YYYY HH:mm`.
    - Các nút thao tác 1-chạm: Đánh dấu đã đọc (`Check`), Mở xem chi tiết trang liên kết (`ExternalLink`), và Xóa thông báo khỏi danh sách (`Trash2`).
    - Phân trang thông minh hỗ trợ duyệt nhiều trang lịch sử thông báo.
  - Trang Server Component [`/tai-khoan/thong-bao`](/tai-khoan/thong-bao): Kiểm soát phiên đăng nhập (Auth Guard), pre-fetch SSR dữ liệu ban đầu siêu tốc và kết nối đồng bộ Client Component.
- [x] **Giai đoạn 11.5: Tích Hợp Kích Hoạt Sự Kiện Tự Động (Auto Event Triggers)** *(Đã hoàn thành & Đã kiểm thử)*:
  - Tự động phát thông báo khi đặt hàng thành công (`src/app/api/orders/route.ts`): Gửi xác nhận đặt hàng tức thì đến khách kèm mã đơn và tổng tiền.
  - Tự động cập nhật hành trình đơn hàng (`src/app/api/admin/orders/[id]/status/route.ts`): Bắn thông báo tương ứng khi Admin chuyển trạng thái sang `CONFIRMED` (Đã duyệt & đóng gói), `SHIPPING` (Đang giao hỏa tốc), `DELIVERED` (Giao thành công & cộng điểm thưởng), `CANCELLED` (Đã hủy & hoàn điểm).
  - Tự động kích hoạt thông báo Thăng Hạng Hội Viên VIP: Bắn thông báo chúc mừng kèm đặc quyền mới khi khách hàng đạt mốc Bạc, Vàng hoặc Kim Cương.
  - Tự động thông báo khi Đổi Voucher thành công (`src/app/api/user/loyalty/redeem/route.ts`): Gửi mã code và hướng dẫn sử dụng voucher về hòm thư thông báo.
  - Tự động thông báo khi Admin điều chỉnh điểm tích lũy (`src/app/api/admin/loyalty/adjust/route.ts`): Báo số điểm biến động (+/-) và lý do kiểm toán minh bạch.

### 👥 Giai đoạn 12: Hệ Thống Giới Thiệu Bạn Bè & Tiếp Thị Liên Kết (Referral & Affiliate Program - HOÀN THÀNH 100%)
- [x] **Giai đoạn 12.1: Nâng cấp Schema Referral, Zod Validations & Seed Dữ Liệu Mời Bạn Bè** *(Đã hoàn thành & Đã kiểm thử)*:
  - Khởi tạo enum `ReferralStatus` (`PENDING`, `QUALIFIED`, `REWARDED`, `EXPIRED`) trong `prisma/schema.prisma`.
  - Mở rộng model `User` với mã giới thiệu độc quyền `referralCode` (@unique), quan hệ tự tham chiếu người mời `referredBy` và danh sách người được mời `referrals`.
  - Tạo mới model `ReferralRecord` (`id`, `referrerId`, `refereeId`, `orderId`, `status`, `referrerRewardPoints`, `refereeVoucherCode`, `rewardedAt`) liên kết trực tiếp với `User` và `Order`.
  - Đồng bộ thành công cơ sở dữ liệu PostgreSQL qua Prisma `db push` và tái sinh Prisma Client v5.22.0.
  - Xây dựng lớp kiểm thực dữ liệu Zod toàn diện (`src/lib/validations/referral.ts`): Cấu hình thể lệ chương trình (Người giới thiệu nhận +500 điểm ~ 50.000₫, Bạn mới nhận Voucher chào mừng 50.000₫ cho đơn từ 300.000₫), schemas áp dụng mã và từ điển hiển thị trạng thái.
  - Kịch bản nạp dữ liệu mẫu sinh động (`prisma/seed-referrals.ts`): Sinh mã giới thiệu cho toàn bộ khách hàng hiện có và tạo các liên kết bạn bè với các trạng thái thực tế (`REWARDED`, `QUALIFIED`, `PENDING`).
- [x] **Giai đoạn 12.2: Hệ Thống REST APIs Quản Lý Giới Thiệu & Động Cơ Trả Thưởng Tự Động** *(Đã hoàn thành & Đã kiểm thử)*:
  - Xây dựng module nghiệp vụ Referral độc lập (`src/lib/referral.ts`):
    - Thuật toán sinh mã giới thiệu độc quyền ngẫu nhiên (`generateRandomReferralCode`).
    - Hàm đảm bảo người dùng luôn có mã mời duy nhất (`ensureUserReferralCode`).
    - Động cơ tự động sinh Voucher chào mừng 50.000₫ cho bạn mới (`createRefereeWelcomeVoucher`: mã `BANMOI-XXXX`, đơn tối thiểu 300.000₫, hạn dùng 30 ngày).
    - Động cơ xử lý trả thưởng nguyên tử khi đơn hàng đầu tiên giao thành công (`processReferralRewardOnDelivered`): Chuyển trạng thái `REWARDED`, cộng +500 điểm tích lũy THUYNGA Club cho người mời, ghi sổ cái `LoyaltyTransaction` (`EARN_REFERRAL`) và tự động bắn thông báo đẩy In-App ăn mừng kèm thông tin người bạn được mời.
  - `GET /api/user/referral`: Lấy mã mời cá nhân, liên kết chia sẻ đầy đủ, tổng hợp thống kê chuyển đổi (Tổng bạn đã mời, Bạn đã hoàn thành đơn đầu, Tổng điểm thưởng đã nhận) và danh sách bạn bè đã mời kèm email đã được che dấu bảo mật (`m***@gmail.com`).
  - `POST /api/user/referral/apply`: Khách hàng kích hoạt mã mời bạn bè; kiểm tra chặt chẽ chống tự mời bản thân (Self-referral check), chống áp dụng lại khi đã có người mời, ngăn chặn nếu khách đã từng phát sinh đơn hàng, tự động phát sinh voucher chào mừng và gửi thông báo In-App thông báo người mời kết nối thành công.
  - `GET /api/admin/referrals`: Phân hệ Admin CMS truy vấn phân trang danh sách kết nối giới thiệu, tìm kiếm theo tên/email người mời và người được mời hoặc mã voucher, lọc theo trạng thái (`PENDING`, `QUALIFIED`, `REWARDED`, `EXPIRED`) và tính toán 5 chỉ số KPIs chuyển đổi then chốt.
- [x] **Giai đoạn 12.3: Giao diện Quản trị Giới Thiệu Admin CMS (`/admin/marketing/gioi-thieu`)** *(Đã hoàn thành & Đã kiểm thử)*:
  - Tích hợp mục "Mời bạn nhận quà" kèm biểu tượng `Share2` trên thanh điều hướng bên trái Admin CMS (`AdminSidebar.tsx`).
  - 4 Thẻ KPI chuyển đổi thời gian thực (`ReferralStats.tsx`):
    - Tổng lượt giới thiệu: Số lượng bạn bè được mời vào sàn.
    - Tỷ lệ chuyển đổi (%): Tỷ lệ bạn mới hoàn thành đơn hàng đầu tiên thành công.
    - Doanh số bạn mới: Tổng doanh thu thuần tạo ra từ các đơn hàng liên kết (VNĐ).
    - Điểm thưởng đã chi trả: Tổng số điểm THUYNGA Club đã phân phối cho người giới thiệu (+500 pts/đơn) kèm giá trị tiền mặt quy đổi tương đương.
  - Bộ lọc thông minh & tìm kiếm tức thì (`ReferralFilters.tsx`):
    - 5 Tabs phân loại trạng thái: Tất cả, 🎉 Đã trả thưởng (+500 pts), 🚚 Đang giao đơn đầu, ⏳ Chờ đơn đầu, ⌛ Hết hạn.
    - Tìm kiếm debounce theo tên người mời, bạn mới, email hoặc mã voucher chào mừng.
    - Phím tắt chuyển nhanh xem trang Storefront Mời Bạn (`/tai-khoan/gioi-thieu`) và nút Xóa bộ lọc 1-chạm.
  - Bảng theo dõi dữ liệu chi tiết (`ReferralTable.tsx`):
    - Người giới thiệu: Avatar, tên, email, huy hiệu hạng hội viên (Đồng/Bạc/Vàng/Kim Cương) và mã mời độc quyền.
    - Bạn mới được mời: Tên, email và ngày tham gia hệ thống.
    - Trạng thái liên kết: Huy hiệu màu sắc trực quan kèm icon nhận diện (`Clock`, `Truck`, `CheckCircle2`, `AlertCircle`).
    - Voucher bạn mới: Mã code `BANMOI-XXXX` kèm nút sao chép 1-chạm.
    - Đơn hàng kích hoạt: Mã đơn hàng kèm liên kết mở chi tiết đơn trong CMS, số tiền đơn hàng và trạng thái đơn.
    - Điểm thưởng: Thưởng `+500 pts` và nhãn xác nhận đã cộng điểm vào ví hội viên.
    - Phân trang dữ liệu thông minh hỗ trợ chuyển trang mượt mà.
  - Trang Server Component [`/admin/marketing/gioi-thieu`](/admin/marketing/gioi-thieu): Kiểm soát phiên Admin RBAC an toàn, pre-fetch SSR dữ liệu ban đầu siêu tốc và kết nối đồng bộ với trình điều phối `ReferralManager.tsx`.
- [x] **Giai đoạn 12.4: Giao diện Storefront Trung Tâm Mời Bạn Nhận Quà (`/tai-khoan/gioi-thieu`)** *(Đã hoàn thành & Đã kiểm thử)*:
  - Tích hợp lối tắt truy cập nhanh "Mời bạn nhận quà" kèm biểu tượng `Share2` tại:
    - Thanh điều hướng tài khoản khách hàng (`AccountSidebar.tsx`).
    - Menu thả xuống Header người dùng (`UserAccountMenu.tsx`).
  - Khối Hero Banner nhận diện thương hiệu sang trọng (`ReferralHeroBanner.tsx`):
    - Đồ họa nền Gradient đỏ rượu `#800028` chuẩn nhận diện thương hiệu, viền bo tròn 3xl và ánh sáng mờ huyền ảo.
    - 2 Thẻ quyền lợi song hành: Quà tặng Bạn Mới (Voucher 50.000₫ cho đơn từ 300k) và Thưởng Người Mời (+500 Điểm THUYNGA Club ≈ 50.000₫ khi bạn mới hoàn tất đơn đầu).
  - Thẻ chia sẻ mã mời đa kênh thông minh (`ReferralShareCard.tsx`):
    - Hộp hiển thị mã mời độc quyền cá nhân chữ lớn, nút sao chép 1-chạm kèm phản hồi tương tác tích cực.
    - Ô liên kết giới thiệu đầy đủ (`/dang-ky?ref=CODE`) tự động điền sẵn mã khi bạn bè bấm vào.
    - Trình tạo mã QR Code thời gian thực tích hợp thư viện `qrcode`: Hiển thị mã QR thương hiệu đỏ rượu, hỗ trợ nút "Tải ảnh QR về máy" để in ấn hoặc đăng story.
    - Phím tắt chia sẻ 1-chạm mạng xã hội: Facebook, Zalo Chat và Telegram.
  - Ô kích hoạt mã mời từ bạn bè (`ReferralHubClient.tsx`):
    - Dành cho khách hàng chưa có người giới thiệu: Nhập mã mời để nhận ngay Voucher chào mừng 50.000₫ tức thì.
  - 3 Thẻ đo lường hiệu quả mời bạn (`ReferralStatsCards.tsx`):
    - Bạn bè đã kết nối (số lượng đã đăng ký).
    - Đơn đầu thành công (số lượng bạn đã nhận hàng thành công).
    - Điểm thưởng đã nhận (+XX điểm ≈ XX.XXX ₫ tích lũy).
  - Sổ theo dõi bạn bè đã mời (`ReferralFriendsList.tsx`):
    - Danh sách bạn bè kèm email đã che dấu bảo mật (`c***@gmail.com`).
    - Huy hiệu tiến trình: Chờ đơn đầu, Đang giao hàng, Đã nhận +500 pts.
    - Trạng thái rỗng thân thiện (Empty State) kèm nút gọi hành động "Mời bạn bè ngay".
  - Bộ câu hỏi thường gặp FAQ Accordion (`ReferralFAQ.tsx`): Giải đáp 5 thắc mắc phổ biến về thể lệ, thời điểm trả thưởng và tính chất không giới hạn số lượt mời.
  - Trang Server Component [`/tai-khoan/gioi-thieu`](/tai-khoan/gioi-thieu): Kiểm soát phiên đăng nhập (Auth Guard), tự động sinh mã mời nếu người dùng chưa có (`ensureUserReferralCode`), pre-fetch SSR dữ liệu bạn bè siêu tốc và kết nối đồng bộ Client Component.
- [x] **Giai đoạn 12.5: Tích Hợp Đăng Ký Tài Khoản Nhận Mã Mời & Tự Động Trả Thưởng Khi Giao Hàng** *(Đã hoàn thành & Đã kiểm thử)*:
  - Nâng cấp luồng đăng ký tài khoản (`src/app/api/auth/register/route.ts` & `src/lib/validations/auth.ts`):
    - Nhận diện `referralCode` từ request body; kiểm tra tồn tại và tính hợp lệ của người giới thiệu.
    - Tự động sinh `referralCode` độc quyền cho tài khoản mới ngay khi tạo.
    - Tự động gán `referredById`, tạo bản ghi `ReferralRecord` (trạng thái `PENDING`), tự sinh Voucher chào mừng 50.000₫ `BANMOI-XXXX` và bắn 2 thông báo In-App thông báo người mời & bạn mới.
  - Giao diện đăng ký thân thiện (`src/components/storefront/auth/RegisterForm.tsx`):
    - Tự động nhận diện query param `?ref=...` từ URL và điền sẵn mã giới thiệu.
    - Hiển thị banner chào đón nổi bật: "🎁 Bạn đang được giới thiệu bởi mã REF-... Đăng ký ngay để nhận Voucher 50.000₫!".
    - Bổ sung ô nhập mã giới thiệu trực quan (tùy chọn) với icon `Gift`.
  - Tự động liên kết đơn hàng đầu tiên (`src/app/api/orders/route.ts`):
    - Khi bạn mới thực hiện đặt đơn hàng đầu tiên, hệ thống tự động tìm kiếm `ReferralRecord` (PENDING), liên kết `orderId: newOrder.id` và chuyển sang trạng thái `QUALIFIED` (đã kích hoạt phát sinh đơn hàng).
  - Tự động kích hoạt trả thưởng khi giao hàng thành công (`src/app/api/admin/orders/[id]/status/route.ts`):
    - Khi đơn hàng chuyển sang `DELIVERED`, hệ thống tự động kích hoạt `processReferralRewardOnDelivered(order.id)`.
    - Chuyển trạng thái liên kết sang `REWARDED`, cập nhật thời điểm nhận thưởng `rewardedAt`.
    - Cộng ngay +500 Điểm THUYNGA Club cho người giới thiệu, ghi nhật ký sổ cái `LoyaltyTransaction` (`type: "EARN_REFERRAL"`).
    - Bắn thông báo đẩy In-App ăn mừng gửi đến chuông thông báo của người giới thiệu!

### ✅ Giai đoạn 13: Phân Hệ Đơn Hàng Đăng Ký Định Kỳ Tiết Kiệm (Subscribe & Save / Auto-Ship - ĐÃ HOÀN THÀNH 100%)
- [x] **Giai đoạn 13.1: Nâng cấp Schema Subscription, Zod Validations & Seed Dữ Liệu Gói Định Kỳ** *(Đã hoàn thành & Đã kiểm thử)*:
  - Khởi tạo enum `SubscriptionFrequency` (`EVERY_2_WEEKS`, `EVERY_1_MONTH`, `EVERY_2_MONTHS`, `EVERY_3_MONTHS`) và `SubscriptionStatus` (`ACTIVE`, `PAUSED`, `CANCELLED`, `EXPIRED`) trong `prisma/schema.prisma`.
  - Thiết lập model `Subscription` (`id`, `subscriptionNumber`, `userId`, `frequency`, `status`, `discountPercent: 10`, `startDate`, `nextDeliveryDate`, `lastDeliveryDate`, `totalCyclesDelivered`, `recipientName`, `recipientPhone`, `shippingAddress`, `paymentMethod`, `note`, `pausedAt`, `cancelledAt`, `cancellationReason`).
  - Thiết lập model `SubscriptionItem` (`id`, `subscriptionId`, `variantId`, `productName`, `variantName`, `sku`, `originalPrice`, `price`, `quantity`, `image`).
  - Mở rộng model `User` liên kết 1-N với `Subscription`, mở rộng model `Order` liên kết 1-N với `Subscription` (theo dõi đơn hàng phát sinh từ gói định kỳ).
  - Đồng bộ thành công cơ sở dữ liệu PostgreSQL qua Prisma `db push` và tái sinh Prisma Client v5.22.0.
  - Xây dựng lớp kiểm thực Zod toàn diện (`src/lib/validations/subscription.ts`): Cấu hình ưu đãi giảm 10% trọn đời, schemas tạo mới gói, đổi chu kỳ, tạm dừng, bỏ qua kỳ và bộ lọc truy vấn.
  - Kịch bản nạp dữ liệu mẫu sinh động (`prisma/seed-subscriptions.ts`): Nạp 3 gói định kỳ tiêu biểu (Sữa bột Úc cho bé 1 tháng/lần, Mật ong & TPCN 2 tuần/lần, Vitamin bổ khớp 2 tháng/lần - PAUSED).
- [x] **Giai đoạn 13.2: Hệ Thống REST APIs Quản Lý Gói Định Kỳ & Động Cơ Sinh Đơn Hàng Tự Động** *(Đã hoàn thành & Đã kiểm thử)*:
  - Xây dựng module điều phối Subscription độc lập (`src/lib/subscription.ts`):
    - Thuật toán sinh mã gói định kỳ duy nhất `SUB-YYYY-XXXX` (`generateSubscriptionNumber`).
    - Hàm tính toán ngày giao hàng kế tiếp dựa trên chu kỳ (`calculateNextDeliveryDate`: 2 tuần, 1 tháng, 2 tháng, 3 tháng).
    - Động cơ tạo đơn hàng tự động nguyên tử (`createOrderFromSubscription`): Tự động tạo `Order` kèm `OrderItem`s với giá giảm 10% trọn đời, miễn phí vận chuyển 0₫, cập nhật `lastDeliveryDate`, `nextDeliveryDate` và tăng `totalCyclesDelivered`, đồng thời bắn thông báo In-App cho khách.
    - Động cơ quét và kích hoạt các gói định kỳ đến hạn (`processDueSubscriptions`).
  - `GET /api/user/subscriptions`: Khách hàng tra cứu danh sách gói định kỳ, danh sách sản phẩm, các đơn hàng gần đây phát sinh từ gói và 4 chỉ số thống kê cá nhân (Tổng số gói, Gói đang kích hoạt, Ngày giao sớm nhất, Tổng tiền tiết kiệm lũy kế).
  - `POST /api/user/subscriptions`: Khách hàng đăng ký gói giao định kỳ mới kèm kiểm thực Zod nghiêm ngặt.
  - `PATCH /api/user/subscriptions/[id]/action`: Khách hàng thao tác linh hoạt trên gói: Tạm dừng (`PAUSE`), Kích hoạt lại (`RESUME`), Bỏ qua kỳ tới (`SKIP_NEXT`), Đặt giao ngay hôm nay (`DELIVER_NOW`), Hủy gói (`CANCEL`), hoặc Thay đổi chu kỳ (`UPDATE_FREQUENCY`).
  - `GET /api/admin/subscriptions`: Phân hệ Admin CMS tra cứu phân trang, tìm kiếm đa tiêu chí, lọc theo trạng thái & chu kỳ, và tính toán 5 chỉ số KPIs then chốt (Tổng số gói, Gói hoạt động, Gói tạm dừng, Doanh thu định kỳ ước tính MRR, Tổng số đơn hàng định kỳ đã tạo).
  - `POST /api/admin/subscriptions/[id]/trigger`: Endpoint Admin CMS cho phép kích hoạt tạo đơn hàng định kỳ ngay lập tức theo yêu cầu hỗ trợ khách hàng.
- [x] **Giai đoạn 13.3: Giao diện Quản Trị Đơn Hàng Định Kỳ Admin CMS (`/admin/don-hang/dinh-ky`)** *(Đã hoàn thành & Đã kiểm thử)*:
  - Tích hợp mục "Đơn định kỳ" kèm biểu tượng `Repeat` trên thanh điều hướng bên trái Admin CMS (`AdminSidebar.tsx`).
  - 4 Thẻ KPI vận hành & tài chính thời gian thực (`SubscriptionStats.tsx`):
    - Doanh thu MRR ước tính: Chuẩn hóa doanh thu định kỳ theo tháng (VNĐ).
    - Gói đang hoạt động: Số lượng gói ACTIVE kèm tỷ lệ % trên tổng số gói.
    - Đơn định kỳ đã tạo: Số lượng đơn hàng tự động phát sinh theo chu kỳ.
    - Gói đang tạm dừng: Số lượng khách hàng tạm hoãn nhận hàng.
  - Bộ lọc đa năng & tìm kiếm tức thì (`SubscriptionFilters.tsx`):
    - 4 Tabs trạng thái: Tất cả, 🟢 Đang hoạt động, ⏸️ Tạm dừng, ❌ Đã hủy.
    - Bộ chọn lọc theo chu kỳ: 2 tuần/lần, 1 tháng/lần, 2 tháng/lần, 3 tháng/lần.
    - Tìm kiếm debounce theo mã `SUB-...`, tên khách, SĐT hoặc tên sản phẩm đăng ký.
    - Phím tắt mở xem nhanh trang Storefront Gói định kỳ (`/tai-khoan/dinh-ky`) và nút Xóa bộ lọc.
  - Bảng theo dõi dữ liệu chi tiết (`SubscriptionTable.tsx`):
    - Mã gói & Khách hàng: Mã `SUB-2026-XXXX`, Avatar, tên, SĐT/email, huy hiệu hạng hội viên (Đồng/Bạc/Vàng/Kim Cương).
    - Sản phẩm đăng ký: Danh sách tên mặt hàng kèm số lượng x đơn giá.
    - Chu kỳ giao hàng: Huy hiệu icon `Calendar` hiển thị tần suất.
    - Trạng thái gói: Huy hiệu màu sắc trực quan (`CheckCircle2`, `Pause`, `AlertCircle`).
    - Kỳ giao kế tiếp: Ngày giao định dạng tiếng Việt kèm cảnh báo số ngày còn lại (highlight đỏ nếu còn <= 3 ngày).
    - Doanh thu chu kỳ: Số tiền mỗi kỳ giao (đã áp dụng -10% trọn đời).
    - Tiến độ chu kỳ: Số kỳ đã giao & số đơn hàng phát sinh (kèm link kiểm tra).
    - Nút thao tác Admin "Tạo đơn ngay" 1-chạm: Kích hoạt tạo đơn hàng định kỳ tức thì qua API `/api/admin/subscriptions/[id]/trigger`.
    - Phân trang dữ liệu thông minh.
  - Trang Server Component [`/admin/don-hang/dinh-ky`](/admin/don-hang/dinh-ky): Kiểm soát quyền Admin RBAC nghiêm ngặt, pre-fetch SSR dữ liệu siêu tốc và kết nối đồng bộ `SubscriptionManager.tsx`.
- [x] **Giai đoạn 13.4: Tích Hợp Bộ Chọn Subscribe & Save Trên Trang Chi Tiết Sản Phẩm & Giỏ Hàng** *(Đã hoàn thành & Đã kiểm thử)*:
  - Component bộ chọn tùy chọn mua hàng (`SubscriptionOptionSelector.tsx`):
    - Tùy chọn 1: "Mua một lần" - Mức giá niêm yết hoặc giá khuyến mãi thường.
    - Tùy chọn 2: "Giao Định Kỳ (Subscribe & Save)" - Nổi bật huy hiệu "TIẾT KIỆM 10%", tính toán số tiền tiết kiệm trên từng sản phẩm, miễn phí ship trọn đời.
    - Bộ chọn tần suất giao hàng 4 cấp độ: Mỗi 2 tuần, Mỗi 1 tháng (Khuyên dùng), Mỗi 2 tháng, Mỗi 3 tháng.
    - 3 Cam kết vàng: Freeship toàn quốc, Tạm dừng/hủy 1-chạm, Chuẩn date Air-Cargo mới nhất.
  - Tích hợp sâu vào trang chi tiết sản phẩm (`ProductInfoSection.tsx`):
    - Đồng bộ giá sau chiết khấu 10% khi chuyển chế độ Subscribe & Save.
    - Thêm vào giỏ hàng hoặc bấm "Mua ngay" tự động nhận diện gói định kỳ.
  - Nâng cấp Giỏ hàng Zustand (`src/store/cart.ts` & `src/types/index.ts`):
    - Mở rộng kiểu dữ liệu `CartItem` hỗ trợ `isSubscription` và `subscriptionFrequency`.
    - Dòng giỏ hàng (`CartItemRow.tsx`) hiển thị huy hiệu nhận diện "Giao định kỳ (-10%)" kèm icon `Repeat`.
  - Tự động kích hoạt gói định kỳ khi đặt hàng Checkout (`src/app/api/orders/route.ts`):
    - Nhận diện các mặt hàng đăng ký định kỳ, áp dụng chính sách Freeship 0₫ tự động.
    - Tạo bản ghi `Subscription` và `SubscriptionItem` trong cùng 1 transaction atomic.
    - Liên kết `subscriptionId` với `Order` đầu tiên.
    - Tự động bắn thông báo In-App chúc mừng khách hàng đã đăng ký gói định kỳ thành công.
- [x] **Giai đoạn 13.5: Giao Diện Storefront Trung Tâm Quản Lý Gói Định Kỳ (`/tai-khoan/dinh-ky`)** *(Đã hoàn thành & Đã kiểm thử)*:
  - Banner đặc quyền thượng lưu (`SubscriptionHeroBanner.tsx`): Tông màu rượu vang `#800028` kết hợp xanh ngọc lục bảo, làm nổi bật 3 cam kết: Giảm 10% trọn đời mọi chu kỳ, Freeship 100% toàn quốc và Linh hoạt 1-chạm.
  - 3 Thẻ thống kê trực quan (`SubscriptionStatsCards.tsx`): Số gói đang kích hoạt, Lịch giao hàng gần nhất (kèm đếm ngược số ngày còn lại), Tổng số tiền đã tiết kiệm từ chiết khấu và freeship.
  - Thẻ thông tin gói chi tiết (`SubscriptionCard.tsx`):
    - Mã gói `#SUB-2026-XXXX`, huy hiệu trạng thái (Đang hoạt động / Tạm dừng / Đã hủy), chu kỳ giao hàng (2 tuần, 1 tháng, 2 tháng, 3 tháng).
    - Cảnh báo lịch giao tiếp theo nổi bật kèm đếm ngược ngày.
    - Danh sách sản phẩm trong gói: Ảnh thumbnail, tên sản phẩm, phân loại, số lượng, đơn giá sau giảm 10%.
    - Thông tin người nhận, địa chỉ giao hàng và phương thức thanh toán.
    - Bảng tổng kết tài chính: Tạm tính, Tiết kiệm 10%, Phí ship 0₫ (Freeship), Tổng thanh toán mỗi kỳ.
    - Accordion lịch sử các đơn hàng đã được tạo tự động từ gói kèm liên kết đến chi tiết đơn hàng.
    - Thanh tác vụ 1-chạm: Tạm dừng gói, Kích hoạt lại, Bỏ qua lần giao này, Giao ngay hôm nay (lập tức đóng gói đi air), Đổi chu kỳ nhận hàng (kèm Modal chọn tần suất trực quan), và Hủy gói.
  - Client Container điều phối (`SubscriptionHubClient.tsx`): Tabs phân loại (Tất cả, Đang hoạt động, Tạm dừng, Đã hủy), thông báo toast realtime khi thực hiện thao tác, trạng thái rỗng thân thiện kích thích mua sắm, Accordion FAQ giải đáp thắc mắc khách hàng.
  - Trang Server Component [`/tai-khoan/dinh-ky`](/tai-khoan/dinh-ky): Kiểm soát xác thực SSR, prefetch dữ liệu gói định kỳ và lịch sử đơn hàng từ Prisma.
  - Tích hợp điều hướng Storefront: Bổ sung mục "Gói giao định kỳ" (icon `Repeat`) vào cả `AccountSidebar.tsx` và `UserAccountMenu.tsx`.

### ✅ Giai đoạn 14: Hệ Thống Đánh Giá & Trưng Bày UGC Người Dùng Thực Tế Xác Thực Đường Bay Air-Cargo (Verified Air-Cargo Customer Reviews, UGC Showcase & Community Q&A - ĐÃ HOÀN THÀNH 100%)
- [x] **Giai đoạn 14.1: Nâng Cấp Schema Đánh Giá Đa Chiều, Q&A Chuyên Gia, Zod Validations & Seed Dữ Liệu UGC Thực Tế** *(Đã hoàn thành & Đã kiểm thử)*:
  - Mở rộng enum `ReviewStatus` bổ sung trạng thái `FEATURED` (Ghim bài đánh giá & ảnh UGC nổi bật lên đầu trang sản phẩm/trang chủ).
  - Bổ sung giá trị `EARN_REVIEW` trong enum `LoyaltyType` để liên kết sổ cái tích điểm thưởng THUYNGA Club khi khách hàng gửi review (+50 đến +150 điểm).
  - Nâng cấp toàn diện model `Review` trong `prisma/schema.prisma`:
    - Đánh giá đa chiều 4 tiêu chí: Sao tổng thể `rating` (1-5), Đóng gói & Giữ nhiệt Air-cargo `packagingRating` (1-5), Date HSD mới chuẩn Úc `freshnessRating` (1-5), Hiệu quả & Bé hợp vị `effectivenessRating` (1-5).
    - Huy hiệu uy tín: `isVerifiedBuyer` (Đã mua hàng từ đơn thực tế), `airCargoVerified` (Xác thực hàng bay Air-cargo chính ngạch kèm bill Chemist Warehouse).
    - Tương tác cộng đồng: Đếm số lượt cảm ơn hữu ích `helpfulCount`, liên kết 1-N với model `ReviewHelpfulVote`.
    - Phản hồi từ Dược sĩ / CSKH THUYNGA Shop: `adminReply` và `adminReplyAt`.
    - Thưởng điểm THUYNGA Club: `rewardPoints` ghi nhận điểm thưởng đã chi trả (+50đ bài chữ, +150đ bài kèm ảnh/video UGC).
    - Liên kết trực tiếp với đơn hàng `orderId` trong `Order`.
  - Khởi tạo model `ReviewHelpfulVote` chống spam bình chọn "Hữu ích".
  - Khởi tạo model `ProductQuestion` và `ProductAnswer` hỗ trợ phân hệ Hỏi Đáp Chuyên Gia Sữa & TPCN Úc trực tiếp trên trang chi tiết sản phẩm.
  - Đồng bộ thành công cơ sở dữ liệu PostgreSQL qua Prisma `db push` và tái sinh Prisma Client v5.22.0.
  - Xây dựng lớp kiểm thực Zod toàn diện (`src/lib/validations/review.ts`): Cấu hình điểm thưởng, schemas tạo đánh giá, duyệt đánh giá Admin, hỏi đáp cộng đồng và bộ lọc phân trang.
  - Kịch bản nạp dữ liệu mẫu sinh động (`prisma/seed-reviews-ugc.ts`): 5 đánh giá unboxing hàng bay air thực tế (Aptamil, Manuka Honey, Vitamin Úc), 1 bình chọn hữu ích, 2 câu hỏi hỏi đáp chuyên gia kèm câu trả lời chính thức từ Dược sĩ THUYNGA.
- [x] **Giai đoạn 14.2: Hệ Thống REST APIs Đánh Giá, Bình Chọn Hữu Ích, Trả Thưởng Điểm & Hỏi Đáp Q&A** *(Đã hoàn thành & Đã kiểm thử)*:
  - Xây dựng module điều phối nghiệp vụ đánh giá (`src/lib/reviews.ts`):
    - Xác thực người mua hàng thực tế `checkVerifiedBuyer`: Kiểm tra đơn hàng hoàn tất (`DELIVERED`) có chứa sản phẩm, tự động liên kết `orderId`.
    - Động cơ trả thưởng điểm THUYNGA Club `awardReviewPoints`: Tự động cộng +50 điểm (đánh giá chữ) hoặc +150 điểm (đính kèm ảnh/video UGC), ghi sổ cái giao dịch `LoyaltyTransaction` (`type: EARN_REVIEW`) và gửi thông báo In-App.
    - Bình chọn hữu ích `toggleHelpfulVote`: Cơ chế bật/tắt (toggle) chống spam, cập nhật bảng `ReviewHelpfulVote` và số đếm `helpfulCount`.
    - Tính toán ma trận thống kê đa chiều `calculateProductRatingStats`: Điểm trung bình, phân bổ 1-5 sao kèm %, điểm đóng gói air-cargo, date HSD mới, hiệu quả & bé hợp vị, số lượng ảnh UGC.
  - `POST /api/reviews`: Khách hàng gửi bài đánh giá kèm kiểm thực Zod, tự động nhận diện verified buyer và trả thưởng điểm.
  - `POST /api/reviews/[id]/helpful`: Khách hàng bình chọn "Hữu ích" cho bài đánh giá hữu ích của người khác.
  - `GET /api/reviews/product/[slug]`: Endpoint công khai tải danh sách đánh giá đã duyệt/ghim, hỗ trợ phân trang, lọc theo sao, lọc bài có ảnh UGC, lọc người mua thực tế, sắp xếp đa dạng và kiểm tra trạng thái bình chọn của user hiện tại.
  - `GET & POST /api/products/[slug]/qa`: Khách hàng tra cứu và đặt câu hỏi chuyên gia sữa & TPCN Úc.
  - `POST /api/products/[slug]/qa/[questionId]/answer`: Dược sĩ / Cộng đồng phản hồi câu hỏi; tự động gán nhãn `isOfficial: true` cho tài khoản Quản trị viên và bắn thông báo In-App cho người hỏi.
  - `GET & PATCH & DELETE /api/admin/reviews`: Phân hệ Admin CMS tra cứu danh sách kiểm duyệt, thống kê 5 chỉ số (Tổng bài, Chờ duyệt, Điểm TB, Tỷ lệ ảnh UGC, Ghim), cập nhật trạng thái và gửi phản hồi Dược sĩ chính thức.
- [x] **Giai đoạn 14.3: Giao Diện Quản Trị Đánh Giá & UGC Admin CMS (`/admin/danh-gia`)** *(Đã hoàn thành & Đã kiểm thử)*:
  - 4 Thẻ KPI kiểm duyệt đa chiều thời gian thực (`ReviewStats.tsx`):
    - Tổng Đánh Giá & Điểm TB: Tổng phản hồi toàn sàn kèm huy hiệu điểm trung bình sao vàng (★/5.0).
    - Chờ Kiểm Duyệt: Số lượng bài chờ xử lý kèm chỉ báo pulse cảnh báo khi tồn đọng.
    - Ghim Nổi Bật (Top UGC): Số lượng bài viết xuất sắc được gắn huy hiệu tím `Award` đưa lên đầu trang.
    - Tỷ Lệ Ảnh UGC Thực Tế: Phần trăm đánh giá kèm ảnh bóc hộp air-cargo chính hãng.
  - Bộ lọc đa năng & tìm kiếm thông minh (`ReviewFilters.tsx`):
    - 5 Tabs phân loại: Tất Cả, ⏳ Chờ Duyệt, 🟢 Đã Duyệt, ⭐ Ghim Nổi Bật, ❌ Từ Chối.
    - Dropdown lọc theo số sao (1-5 sao).
    - Phím bật/tắt (Toggle) "Có ảnh UGC" và "Đã mua hàng (Verified Buyer)".
    - Ô tìm kiếm tức thì theo nội dung, tên khách hàng, email hoặc tên sản phẩm.
    - Nút xóa bộ lọc 1-chạm khi có tiêu chí đang kích hoạt.
  - Bảng dữ liệu chi tiết chuyên sâu (`ReviewTable.tsx`):
    - Khách hàng: Avatar, tên, email, huy hiệu hạng hội viên THUYNGA Club (Đồng/Bạc/Vàng/Kim Cương).
    - Sản phẩm: Thumbnail ảnh, tên sản phẩm, liên kết mở xem trang chi tiết.
    - Tiêu chí chi tiết: Sao tổng thể kèm 3 điểm thành phần (Đóng gói Air-cargo, Date HSD mới, Hiệu quả & Bé hợp vị).
    - Huy hiệu tin cậy: "Đã mua hàng" (`CheckCircle2`), "Bay Air" (`ShieldCheck`), "+Xđ" điểm thưởng THUYNGA Club.
    - Thư viện ảnh UGC: Xem ảnh thu nhỏ, hỗ trợ mở Modal Lightbox xem ảnh lớn độ nét cao.
    - Lượt hữu ích: Thống kê số lượng người dùng khác bình chọn (👍 X).
    - Khối phản hồi Dược sĩ: Hiển thị phản hồi chính thức hoặc nút mở modal trả lời.
    - Thanh tác vụ kiểm duyệt 1-chạm: Phê duyệt (`APPROVED`), Ghim Top (`FEATURED`), Từ chối (`REJECTED`), Xóa vĩnh viễn (`DELETE`).
  - Modal Dược sĩ THUYNGA Shop phản hồi chuyên môn (`ReviewPharmacistReplyModal.tsx`):
    - Cung cấp sẵn các mẫu câu tư vấn chuẩn y khoa & chăm sóc mẹ bé.
    - Tự động lưu phản hồi công khai và bắn thông báo In-App cho người đánh giá.
  - Trang Server Component [`/admin/danh-gia`](/admin/danh-gia): Pre-fetch SSR 7 chỉ số thống kê, kết nối đồng bộ `ReviewManager.tsx`.
- [x] **Giai đoạn 14.4: Nâng Cấp Giao Diện Đánh Giá & Phân Hệ Hỏi Đáp Chuyên Gia Trên Trang Chi Tiết Sản Phẩm** *(Đã hoàn thành & Đã kiểm thử)*:
  - Nâng cấp toàn diện phân hệ đánh giá (`ProductReviewsSection.tsx`):
    - Hộp tổng quan đánh giá: Điểm trung bình to bản (★/5.0), số lượng đánh giá, thanh phân bổ 5 sao kèm tỷ lệ % và cam kết 100% chuẩn Air-Cargo Úc.
    - 3 Điểm thành phần chuyên sâu: Đóng gói Air-cargo (5.0★), Date HSD mới tinh (5.0★), Bé hợp vị & Hiệu quả (4.9★).
    - Góc ảnh mở hộp thực tế (Top UGC Gallery): Băng chuyền hình ảnh thực tế bóc hộp air-cargo của khách, hỗ trợ nhấp xem phóng to Lightbox sắc nét.
    - Thanh công cụ lọc: Lọc nhanh theo số sao (1-5★), lọc bài có ảnh UGC, lọc người mua thực tế (Verified Buyer), sắp xếp (Mới nhất, Hữu ích nhất, Sao cao nhất).
    - Thẻ đánh giá người mua chi tiết: Avatar, huy hiệu "Đã mua hàng" (`CheckCircle2`), "Chuẩn Air Úc" (`ShieldCheck`), "Top Đánh Giá" (`Award`), nội dung nhận xét, thư viện ảnh UGC, khối phản hồi từ Dược sĩ THUYNGA Shop và nút bình chọn "Hữu ích" thời gian thực.
    - Modal viết đánh giá nhận thưởng đa tiêu chí: Banner thưởng +50đ hoặc +150đ THUYNGA Club, bộ chọn 4 tiêu chí sao, đính kèm tối đa 5 ảnh UGC và thông báo chúc mừng nhận điểm ngay lập tức.
  - Phân hệ Hỏi Đáp Chuyên Gia Sữa & TPCN Úc (`ProductQnABox.tsx`):
    - Khối hỏi đáp cộng đồng tương tác cao: Danh sách câu hỏi của phụ huynh kèm câu trả lời chính thức từ Dược sĩ THUYNGA Shop (`ShieldCheck`) hoặc thành viên khác.
    - Modal đặt câu hỏi chuyên môn nhanh chóng và form gửi câu trả lời cộng đồng.
  - Tích hợp đồng bộ vào trang chi tiết sản phẩm (`ProductDetailClient.tsx` & `/san-pham/[slug]`): Truy vấn SSR các đánh giá đã duyệt hoặc ghim top, truyền `productSlug` và hiển thị cả 2 khối Đánh giá và Hỏi đáp chuyên gia.
- [x] **Giai đoạn 14.5: Giao Diện Storefront Trung Tâm Đánh Giá & Săn Điểm Thưởng Của Tôi (`/tai-khoan/danh-gia`)** *(Đã hoàn thành & Đã kiểm thử)*:
  - 3 Thẻ thống kê cá nhân thời gian thực (`AccountReviewsStats.tsx`):
    - Sản phẩm đã đánh giá: Đếm tổng số mặt hàng người dùng đã hoàn thành chia sẻ cảm nhận.
    - Điểm thưởng đã tích lũy: Tổng điểm THUYNGA Club đã tích lũy từ các bài review (+50đ bài chữ, +150đ bài kèm ảnh).
    - Lượt cảm ơn hữu ích: Tổng số lượt các mẹ bỉm sữa khác đã bình chọn "Hữu ích" cho đánh giá của bạn.
  - Phân hệ 2 Tabs thông minh (`AccountReviewsHubClient.tsx`):
    - Tab 1: "Chờ Đánh Giá" (`PendingReviewsList.tsx`): Tự động phát hiện các mặt hàng trong các đơn hàng đã giao thành công (`DELIVERED`) mà khách hàng chưa review, hiển thị thumbnail, tên sản phẩm, mã đơn hàng, ngày nhận và nút hành động nổi bật "Đánh giá (+150đ)" kèm icon `Camera`.
    - Tab 2: "Đã Đánh Giá" (`MyReviewsList.tsx`): Danh sách các đánh giá cá nhân đã đăng, hiển thị huy hiệu trạng thái (Đã hiển thị / Top Đánh Giá / Đang duyệt), điểm số 4 tiêu chí sao, ảnh bóc hộp UGC thực tế, điểm thưởng nhận được và phản hồi chính thức từ Dược sĩ THUYNGA Shop.
  - Modal đánh giá trực tiếp từ đơn hàng: Chọn điểm 4 tiêu chí sao, nhập cảm nhận thực tế, dán ảnh bóc hộp air-cargo, tự động cập nhật danh sách và trả thưởng điểm THUYNGA Club ngay lập tức.
  - Trang Server Component [`/tai-khoan/danh-gia`](/tai-khoan/danh-gia): Kiểm soát đăng nhập SSR (Auth Guard), đối soát đơn hàng `DELIVERED` và bài review từ Prisma PostgreSQL.
  - Tích hợp điều hướng Storefront: Bổ sung mục "Đánh giá của tôi" (icon `Star`) vào thanh menu tài khoản (`AccountSidebar.tsx`) và menu người dùng Header (`UserAccountMenu.tsx`).

### ✈️ Giai đoạn 15: Hệ Thống Minh Bạch Lô Hàng Air-Cargo, Vận Đơn AWB & Chứng Thực Hạn Sử Dụng (Australian Airway Bill & Batch Transparency System - HOÀN THÀNH 100%)
- [x] **Giai đoạn 15.1: Thiết Kế Schema Lô Hàng Bay Air, Mã Lô, Zod Validations & Seed Dữ Liệu Vận Đơn Thực Tế** *(Đã hoàn thành & Đã kiểm thử)*:
  - Khởi tạo enum `ShipmentStatus` (`DEPARTED`, `IN_TRANSIT`, `CUSTOMS_CLEARED`, `IN_WAREHOUSE`) và `AirlineCarrier` (`VIETNAM_AIRLINES_CARGO`, `QANTAS_FREIGHT`, `EMIRATES_SKYCARGO`, `SINGAPORE_AIRLINES_CARGO`) trong `prisma/schema.prisma`.
  - Thiết lập model `AirCargoShipment` (mã chuyến bay, số vận đơn AWB chính thức, hãng hàng không, sân bay khởi hành/hạ cánh SYD/MEL -> HAN, ngày bay, dải nhiệt độ bảo quản lạnh min/max, bản ghi nhiệt độ theo thời gian `temperatureLog`, ảnh hóa đơn mua hàng Chemist Warehouse Úc, ảnh chứng từ thông quan y tế).
  - Thiết lập model `ProductBatch` (mã lô in dưới đáy lon/thân chai `batchCode`, ngày sản xuất NSX, hạn sử dụng HSD, số lượng nhập/tồn, mã vạch chuẩn Úc 93x, địa chỉ nhà thuốc Chemist Warehouse Úc, link chứng thư kiểm định chất lượng, trạng thái lưu hành `isActive`).
  - Thiết lập model `BatchVerificationLog` lưu nhật ký tra cứu minh bạch từ khách hàng (IP, User-Agent, thời điểm).
  - Mở rộng model `Product` và `ProductVariant` liên kết 1-N với `ProductBatch`.
  - Đồng bộ thành công cơ sở dữ liệu PostgreSQL qua Prisma `db push` và tái sinh Prisma Client v5.22.0.
  - Xây dựng lớp kiểm thực Zod toàn diện (`src/lib/validations/batch.ts`): Cấu hình 4 hãng hàng không, 4 trạng thái vận chuyển khoang mát và schemas tạo lô hàng, tạo mã lô, tra cứu minh bạch.
  - Kịch bản nạp dữ liệu mẫu sinh động (`prisma/seed-aircargo-batches.ts`): Nạp 2 lô hàng bay air tiêu biểu (Chuyến bay VN782 của Vietnam Airlines Cargo từ Sydney, Chuyến bay QF43 của Qantas Freight từ Melbourne), 3 mã lô chính thức cho Aptamil, Mật ong Manuka, Swisse và 2 nhật ký tra cứu mẫu.
- [x] **Giai đoạn 15.2: Hệ Thống REST APIs Tra Cứu Vận Đơn AWB, Quản Lý Lô Hàng & Kiểm Chứng HSD** *(Đã hoàn thành & Đã kiểm thử)*:
  - Thư viện nghiệp vụ tra cứu & quản lý kho lạnh (`src/lib/aircargo.ts`):
    - `verifyBatchByCode`: Tra cứu mã lô hàng, đối soát mã vạch Úc, tự động tính toán số tháng HSD còn lại (`monthsRemaining`), gán huy hiệu độ tươi mới (Date mới tinh / Date rất xa), liên kết toàn bộ lộ trình chuyến bay, dải nhiệt độ khoang mát và ghi nhận nhật ký tra cứu IP/User-Agent.
    - `getLatestBatchForProduct`: Lấy thông tin lô hàng bay air đang lưu hành mới nhất của một sản phẩm (mã AWB, chuyến bay, hãng vận chuyển, ngày hạ cánh, nhiệt độ bảo quản) phục vụ gắn badge uy tín.
    - `calculateAirCargoKPIs`: Tính toán 5 chỉ số vận hành kho lạnh hàng không thời gian thực (Tổng số chuyến bay, Tổng số lô hàng, Lô hàng đang lưu hành, Chuyến bay đang bay/vận chuyển, Tổng lượt khách tra cứu minh bạch).
  - API Storefront tra cứu công khai:
    - `GET /api/aircargo/verify/[batchCode]`: API tra cứu mã lô hàng thời gian thực, xác thực đầy đủ hóa đơn mua hàng Chemist Warehouse Úc và hải quan Nội Bài.
    - `GET /api/aircargo/latest/[productId]`: API lấy dữ liệu chứng nhận bay air mới nhất để render widget trên trang chi tiết sản phẩm.
  - Bộ REST APIs Quản trị Admin CMS bảo mật (`ADMIN` role check):
    - `GET & POST /api/admin/aircargo/shipments`: Lấy danh sách chuyến bay phân trang, lọc theo hãng hàng không, trạng thái vận chuyển, tìm kiếm theo số AWB/mã chuyến; tạo chuyến bay mới với Zod validation và tự động sinh mã chuyến.
    - `GET, PATCH & DELETE /api/admin/aircargo/shipments/[id]`: Xem chi tiết chuyến bay kèm danh sách lô hàng liên kết; cập nhật trạng thái thông quan/nhiệt độ; chặn xóa an toàn nếu chuyến bay đang chứa các lô hàng liên kết.
    - `GET & POST /api/admin/aircargo/batches`: Quản lý danh sách lô hàng sản phẩm phân trang, lọc theo chuyến bay/sản phẩm; tạo lô hàng mới kiểm tra chống trùng mã lô (`batchCode`).
    - `GET, PATCH & DELETE /api/admin/aircargo/batches/[id]`: Xem chi tiết lịch sử tra cứu của lô; cập nhật ngày HSD/tồn kho/trạng thái lưu hành; xóa lô hàng an toàn.
- [x] **Giai đoạn 15.3: Giao Diện Quản Trị Lô Hàng Bay Air & Mã Lô Admin CMS (`/admin/kho-hang/lo-hang-air`)** *(Đã hoàn thành & Đã kiểm thử)*:
  - 5 Thẻ Thống Kê KPI Vận Hành Kho Lạnh Air (`AirCargoStats.tsx`):
    - Tổng chuyến bay Air: Đếm tổng các chuyến bay từ Sydney/Melbourne về Nội Bài.
    - Lô hàng đang lưu hành: Đếm số lượng mã lô date mới (> 18-24 tháng).
    - Chuyến bay đang vận chuyển: Đếm số chuyến bay trên khoang hàng không kiểm soát nhiệt độ.
    - Lượt khách tra cứu AWB: Thống kê số lượt khách hàng quét mã QR / tra cứu minh bạch.
    - Chuẩn nhiệt độ kho lạnh: Đồng hồ đo nhiệt độ bảo quản 18°C - 24°C chuẩn y tế.
  - Bộ Lọc Đa Năng & Chuyển Đổi Tab Thông Minh (`AirCargoFilters.tsx`):
    - Tab Switcher: "Vận Đơn & Chuyến Bay Air" và "Mã Lô & Hạn Sử Dụng".
    - Tìm kiếm nhanh theo số AWB, số hiệu chuyến bay, mã lô, barcode Úc 93x.
    - Lọc theo hãng hàng không (Vietnam Airlines Cargo, Qantas Freight, Emirates, Singapore Airlines).
    - Lọc theo trạng thái vận chuyển và tình trạng lưu hành (Active / Inactive).
  - Bảng Quản Lý Chuyến Bay & Vận Đơn AWB (`ShipmentTable.tsx`):
    - Hiển thị số hiệu chuyến bay kèm badge hãng hàng không, số vận đơn AWB, hành trình bay (SYD/MEL ✈️ HAN), dải nhiệt độ kho lạnh, trạng thái thông quan, số lượng lô hàng liên kết.
    - Thư viện ảnh hóa đơn mua hàng Chemist Warehouse Úc & chứng từ hải quan với Modal Lightbox phóng to sắc nét.
    - Chuyển đổi trạng thái 1-chạm (Cất cánh / Đang bay / Thông quan / Nhập kho) và xóa an toàn.
  - Bảng Quản Lý Mã Lô Sản Phẩm & Khóa HSD (`BatchTable.tsx`):
    - Hiển thị mã lô đáy hộp, barcode Úc 93x, thumbnail sản phẩm liên kết, chuyến bay/AWB, NSX - HSD kèm đếm ngược số tháng còn lại và huy hiệu độ tươi mới (Date mới tinh / Date rất xa).
    - Quản lý tồn kho/nhập, nguồn nhà thuốc Úc Chemist Warehouse, đếm lượt khách tra cứu thực tế.
    - Nút gạt bật/tắt trạng thái lưu hành công khai và xóa mã lô.
  - Modal Thêm Mới Chuyến Bay & AWB (`CreateShipmentModal.tsx`):
    - Form nhập đầy đủ số AWB, chuyến bay, sân bay đi/đến, thời điểm cất/hạ cánh, dải nhiệt độ, danh sách URL ảnh hóa đơn Chemist Warehouse và ghi chú vận hành.
  - Modal Thêm Mới Mã Lô & Khóa HSD (`CreateBatchModal.tsx`):
    - Chọn chuyến bay liên kết, tự động tải danh sách sản phẩm từ hệ thống, nhập mã lô, barcode 93x, NSX/HSD, số lượng nhập/tồn và nguồn gốc nhà thuốc Úc.
  - Trung Tâm Quản Trị Hợp Nhất (`AirCargoManager.tsx` & Server Component [`/admin/kho-hang/lo-hang-air`](/admin/kho-hang/lo-hang-air)):
    - Quản lý đồng bộ trạng thái, gọi API bất đồng bộ và pre-fetch SSR dữ liệu ban đầu.
  - Điều Hướng Admin: Bổ sung mục "Lô hàng bay Air" (icon `Plane`) vào thanh điều hướng bên trái `AdminSidebar.tsx`.
- [x] **Giai đoạn 15.4: Giao Diện Storefront Tra Cứu Minh Bạch Nguồn Gốc & Hạn Sử Dụng Air-Cargo (`/minh-bach-air-cargo`)** *(Đã hoàn thành & Đã kiểm thử)*:
  - Thanh Tra Cứu Thông Minh & Gợi Ý 1-Chạm (`TransparencySearchBar.tsx`):
    - Input tra cứu mã lô in nổi dưới đáy lon/thân chai (`APT-2026-SYD01`, `MNK-2026-MEL02`, `SWI-2026-SYD03`).
    - Nút bấm mã lô mẫu 1-chạm giúp khách hàng trải nghiệm ngay không cần gõ phím.
  - Thẻ Hành Trình Chuyến Bay & Vận Đơn Hàng Không AWB (`FlightTimelineCard.tsx`):
    - Trực quan hóa chặng bay từ sân bay quốc tế Sydney Kingsford Smith (SYD) hoặc Melbourne Tullamarine (MEL) về thẳng sân bay quốc tế Nội Bài (HAN).
    - Hiển thị logo/badge hãng hàng không (Vietnam Airlines Cargo / Qantas Freight), số hiệu chuyến bay, thời gian bay non-stop (~9h45m), số vận đơn AWB có nút sao chép 1-chạm và trạng thái thông quan hải quan.
  - Thẻ Kiểm Soát Kho Lạnh Hàng Không & Nhật Ký Cảm Biến (`ColdChainGaugeCard.tsx`):
    - Thước đo nhiệt độ khoang mát dải chuẩn 18°C - 24°C, bảo toàn 100% men vi sinh Probiotics và vi chất dinh dưỡng.
    - Bảng nhật ký nhiệt độ 4 chặng: Đóng pallet tại Úc, trên khoang bay hàng không độ cao 11,000m, kiểm dịch y tế Nội Bài, và nhập kho điều hòa 24/7 của THUYNGA Shop.
  - Thư Viện Hóa Đơn Mua Hàng Chemist Warehouse Úc (`ChemistReceiptGallery.tsx`):
    - Bộ sưu tập hóa đơn mua hàng thực tế từ hệ thống Chemist Warehouse Sydney (Pitt St, NSW) và Melbourne.
    - Huy hiệu "Có thuế GST Úc" chứng minh nguồn gốc chính hãng chuẩn mực.
    - Tích hợp Modal Lightbox phóng to độ nét cao soi rõ từng mã vạch và số tiền thanh toán AUD.
  - Thẻ Chứng Thực Hạn Sử Dụng & Cam Kết Độ Tươi Mới (`BatchFreshnessPledge.tsx`):
    - Hiển thị ảnh sản phẩm, NSX và HSD dập nổi thực tế kèm đếm ngược số tháng còn lại (Date mới tinh > 20 tháng).
    - Mã vạch GS1 Úc đầu số 93x chuẩn Australia.
    - Nút hành động trực tiếp "Đặt Mua Lô Hàng Này" dẫn thẳng tới trang sản phẩm.
  - Cổng Tra Cứu Hợp Nhất & 4 Trụ Cột Cam Kết Vàng (`TransparencyPortalClient.tsx` & Server Component [`/minh-bach-air-cargo`](/minh-bach-air-cargo)):
    - Quản lý đồng bộ URL searchParams `?code=...`, hỗ trợ SSR pre-fetch kết quả tức thì.
    - Khối cẩm nang 3 bước hướng dẫn tra cứu và banner 4 Cam kết vàng (100% Đi Máy Bay, HSD > 18-24 tháng, Kho Lạnh 18-24°C, Hóa Đơn Thuế GST Đầy Đủ).
- [x] **Giai đoạn 15.5: Widget Chứng Thực Bay Air Trên Trang Chi Tiết Sản Phẩm & Điều Hướng Toàn Sàn** *(Đã hoàn thành & Đã kiểm thử)*:
  - Widget Huy Hiệu Lô Hàng Bay Air Đang Lưu Hành (`ProductAirCargoBadge.tsx`):
    - Tự động hiển thị huy hiệu nổi bật ngay dưới 4 cam kết vàng của trang chi tiết sản phẩm.
    - Hiển thị đầy đủ thông số mã chuyến bay (VN782), số vận đơn AWB (738-98421054), mã lô dập nổi đáy lon (`batchCode`), dải nhiệt độ kho mát 18-24°C, nguồn mua Chemist Warehouse Úc.
    - Đếm ngược số tháng HSD còn lại kèm huy hiệu "Date mới tinh (Còn 23 tháng HSD)".
    - Nút dẫn động "Soi hóa đơn & AWB" đưa khách hàng trực tiếp sang Cổng tra cứu minh bạch kèm mã lô được điền sẵn tự động.
    - Chế độ dự phòng thông minh (Fallback) hiển thị cam kết 100% bay air cho các sản phẩm chưa gán mã lô cụ thể.
  - Tích hợp liên hoàn Server Component & Client State (`ProductDetailClient.tsx`, `ProductInfoSection.tsx`, `/san-pham/[slug]`):
    - Server Component trang sản phẩm tự động truy vấn SSR `getLatestBatchForProduct(product.id)` song song với các sản phẩm liên quan.
    - Truyền dữ liệu kiểu định type-safe xuống `ProductDetailClient` và render mượt mà trong `ProductInfoSection`.
  - Nâng Cấp Hệ Thống Điều Hướng Toàn Sàn:
    - Top Announcement Bar: Bổ sung liên kết "Minh bạch bay Air" (icon `Plane`) trên đỉnh trang web.
    - Header Navigation Bar: Bổ sung huy hiệu "Minh bạch bay Air" nổi bật bên cạnh nút "FLASH SALE".
    - Footer Chân Trang: Bổ sung mục "Minh bạch lô bay Air & Hạn sử dụng (AWB)" trong khối Hỗ Trợ & Chính Sách.

### 🩺 Giai đoạn 16: Hệ Thống Tư Vấn Dinh Dưỡng & Phác Đồ Bổ Sung Cá Nhân Hóa Chuẩn Y Khoa (AI/Pharmacist Health Assessment & Personalized Supplement Protocol Builder - ĐÃ HOÀN THÀNH 100%)
- [x] **Giai đoạn 16.1: Thiết Kế Schema, Enums, Zod Validations & Seed Dữ Liệu Ngân Hàng Câu Hỏi & Phác Đồ Mẫu** *(Đã hoàn thành & Đã kiểm thử)*:
  - Bổ sung 3 enums cốt lõi trong `prisma/schema.prisma`: `HealthTargetGroup` (`BABY_KIDS`, `PREGNANT_MOM`, `POSTPARTUM_MOM`, `ADULT_HEALTH`, `ELDERLY`), `QuizQuestionType` (`SINGLE_CHOICE`, `MULTIPLE_CHOICE`), `ConsultationStatus` (`PENDING`, `CONFIRMED`, `COMPLETED`, `CANCELLED`).
  - Thiết kế 6 models cơ sở dữ liệu quan hệ hoàn chỉnh:
    - `HealthQuizQuestion` & `QuizOption`: Ngân hàng câu hỏi trắc nghiệm đa tầng kèm gợi ý vi chất và liên kết phác đồ lâm sàng.
    - `HealthProtocol` & `ProtocolProductItem`: Phác đồ dinh dưỡng chuẩn y khoa Úc, chỉ định dưỡng chất cốt lõi, lời khuyên Dược sĩ, biểu đồ liều dùng sáng/trưa/tối và ưu đãi combo trọn bộ -10%.
    - `UserHealthAssessment`: Hồ sơ đánh giá sức khỏe cá nhân hóa của khách hàng, lưu trữ lịch sử trả lời và phác đồ đã gán.
    - `PharmacistConsultationBooking`: Hệ thống đặt lịch tư vấn 1-1 chuyên sâu cùng Dược sĩ THUYNGA Shop.
  - Đồng bộ thành công cơ sở dữ liệu PostgreSQL qua Prisma `db push` và tái sinh Prisma Client v5.22.0.
  - Xây dựng Zod validation schemas (`src/lib/validations/protocol.ts`): Cấu hình 5 nhóm đối tượng, 4 trạng thái tư vấn và schemas đánh giá bài test, đặt lịch hẹn và tạo phác đồ.
  - Kịch bản seed dữ liệu mẫu sinh động (`prisma/seed-protocols.ts`): Nạp 4 phác đồ lâm sàng chuẩn Dược sĩ Úc (Bé tiêu hóa kém biếng ăn, Bé tăng chiều cao đề kháng, Mẹ bầu toàn diện giảm nghén, Người cao tuổi sụn khớp bổ não), 9 câu hỏi trắc nghiệm chuyên sâu và 1 lịch hẹn tư vấn mẫu.
- [x] **Giai đoạn 16.2: Xây Dựng Hệ Thống REST APIs Đánh Giá Sức Khỏe & Đề Xuất Phác Đồ** *(Đã hoàn thành & Đã kiểm thử)*:
  - Thư viện logic đánh giá sức khỏe & thuật toán đề xuất (`src/lib/protocols.ts`):
    - `getQuizQuestionsByTargetGroup`: Truy vấn ngân hàng câu hỏi trắc nghiệm theo nhóm đối tượng mục tiêu.
    - `evaluateAssessmentAndMatchProtocol`: Thuật toán phân tích câu trả lời, đối soát tags vi chất và matching phác đồ tối ưu; tính toán tổng giá gốc, chiết khấu combo phác đồ trọn bộ (-10% đến -15%) và lưu trữ hồ sơ `UserHealthAssessment`.
    - `calculateProtocolKPIs`: Tổng hợp 5 chỉ số KPI vận hành (Tổng lượt làm bài test, Lịch hẹn tư vấn mới, Lịch hẹn hoàn tất, Tổng số phác đồ lưu hành).
  - Hệ thống Public REST APIs:
    - `GET /api/quiz/questions`: API trả về ngân hàng câu hỏi trắc nghiệm kèm options lọc theo `targetGroup`.
    - `POST /api/quiz/evaluate`: API tiếp nhận câu trả lời, đánh giá tức thì và trả về phác đồ cá nhân hóa kèm lịch uống chi tiết.
    - `GET /api/protocols/[slug]`: API lấy thông tin chi tiết một phác đồ cụ thể cùng danh sách sản phẩm thành phần.
    - `POST /api/consultations/book`: API đặt lịch hẹn gọi điện tư vấn 1-1 chuyên sâu cùng Dược sĩ THUYNGA Shop.
  - Bộ Admin REST APIs bảo mật (`ADMIN` role check):
    - `GET & POST /api/admin/protocols`: Quản lý danh sách phác đồ phân trang, tìm kiếm, lọc theo đối tượng; tạo mới phác đồ với Zod validation.
    - `GET, PATCH & DELETE /api/admin/protocols/[id]`: Xem chi tiết phác đồ, cập nhật thông tin và xóa an toàn.
    - `GET /api/admin/consultations`: Quản lý danh sách lịch hẹn tư vấn dược sĩ, lọc theo trạng thái (`PENDING`, `CONFIRMED`, `COMPLETED`, `CANCELLED`).
    - `PATCH & DELETE /api/admin/consultations/[id]`: Cập nhật trạng thái cuộc gọi và lưu ghi chú chuyên môn của Dược sĩ.
- [x] **Giai đoạn 16.3: Giao Diện Quản Trị Phác Đồ & Lịch Hẹn Tư Vấn Admin CMS (`/admin/phac-do-dinh-duong`)** *(Đã hoàn thành & Đã kiểm thử)*:
  - 5 Thẻ Thống Kê KPI Phác Đồ & Lịch Hẹn Tư Vấn (`ProtocolStats.tsx`):
    - Lượt trắc nghiệm sức khỏe: Thống kê số lượt khách hàng hoàn thành bài test.
    - Lịch hẹn chờ Dược sĩ gọi: Cảnh báo số lượng cuộc hẹn mới cần phân công Dược sĩ.
    - Đã tư vấn hoàn tất: Tổng số cuộc gọi hướng dẫn chuyên môn thành công.
    - Phác đồ đang lưu hành: Đếm số lượng phác đồ chuẩn y khoa Úc đang kích hoạt.
    - Tỷ lệ chốt combo phác đồ: Thống kê hiệu quả chuyển đổi combo ưu đãi 10%.
  - Bộ Lọc Đa Năng & Chuyển Đổi Tab Thông Minh (`ProtocolFilters.tsx`):
    - Tab Switcher: "Phác Đồ Dinh Dưỡng" và "Lịch Hẹn Tư Vấn Dược Sĩ".
    - Tìm kiếm theo tên phác đồ, slug, khách hàng, số điện thoại, vấn đề sức khỏe.
    - Lọc theo nhóm đối tượng mục tiêu (Bé sơ sinh, Mẹ bầu, Sau sinh, Người lớn, Người cao tuổi) và trạng thái cuộc gọi.
  - Bảng Quản Lý Phác Đồ Lâm Sàng (`ProtocolTable.tsx`):
    - Hiển thị tiêu đề, slug, nhóm đối tượng, danh sách vi chất cốt lõi, số sản phẩm thành phần, % giảm giá combo và lượt khách áp dụng thực tế.
    - Nút gạt bật/tắt trạng thái lưu hành công khai và xóa an toàn.
  - Bảng Quản Lý Lịch Hẹn Tư Vấn 1-1 (`ConsultationTable.tsx`):
    - Hiển thị tên khách hàng, số điện thoại gọi trực tiếp (`tel:`), ngày và khung giờ hẹn gọi, phác đồ đã gợi ý.
    - Cập nhật trạng thái cuộc gọi 1-chạm (`PENDING` -> `CONFIRMED` -> `COMPLETED` -> `CANCELLED`).
    - Nút mở Modal xem toàn bộ câu trả lời bài test và lưu nhật ký ghi chú của Dược sĩ.
  - Modal Tạo Phác Đồ Mới (`CreateProtocolModal.tsx`):
    - Form nhập slug, tiêu đề, nhóm đối tượng, mô tả chuyên môn, lời khuyên Dược sĩ, biểu đồ liều dùng sáng/trưa/tối và thêm các sản phẩm thành phần từ hệ thống.
  - Modal Ghi Chú Chuyên Môn Của Dược Sĩ (`ConsultationNoteModal.tsx`):
    - Xem lại toàn bộ câu trả lời bài test của khách, cập nhật trạng thái cuộc gọi và lưu chỉ dẫn chuyên môn.
  - Trang Server Component [`/admin/phac-do-dinh-duong`](/admin/phac-do-dinh-duong) & Điều Hướng:
    - Pre-fetch SSR dữ liệu ban đầu và bổ sung mục "Phác đồ Dược sĩ" (icon `Stethoscope`) trên thanh menu điều hướng Admin.
- [x] **Giai đoạn 16.4: Giao Diện Storefront Trắc Nghiệm Sức Khỏe Tương Tác & Trình Trưng Bày Phác Đồ (`/tu-van-dinh-duong`)** *(Đã hoàn thành & Đã kiểm thử)*:
  - Khối Trắc Nghiệm Đa Tầng Tương Tác (`HealthQuizStepper.tsx`):
    - Bước 1: Chọn đối tượng mục tiêu với thẻ thông tin sinh động (Bé sơ sinh, Mẹ bầu, Sau sinh, Người trưởng thành, Người cao tuổi).
    - Bước 2 -> N: Chuỗi câu hỏi chuyên môn kèm thanh tiến trình % trực quan, điều hướng tiến lùi mượt mà.
    - Bước cuối: Biểu mẫu nhập họ tên, số điện thoại và ghi chú thể trạng riêng của bé/mẹ.
  - Trình Trưng Bày Phác Đồ Cá Nhân Hóa & Đặt Combo 1-Chạm (`ProtocolResultShowcase.tsx`):
    - Khối tổng quan phác đồ: Tiêu đề lâm sàng, huy hiệu đối tượng, danh sách vi chất cốt lõi và chỉ dẫn chuyên môn từ Dược sĩ.
    - Biểu đồ liều dùng trong ngày: Trực quan hóa thời điểm uống Sáng / Trưa / Chiều / Tối tối ưu hấp thu.
    - Danh mục sản phẩm thành phần: Hiển thị ảnh, quy cách, liều lượng, cam kết 100% bay air.
    - Khối ưu đãi combo phác đồ: Tính toán tổng tiền gốc, chiết khấu combo 10-15%, nút 1-chạm "Thêm trọn bộ phác đồ vào giỏ hàng" tích hợp trực tiếp vào giỏ hàng Zustand.
  - Modal Đặt Lịch Tư Vấn Dược Sĩ 1-1 Miễn Phí (`BookConsultationModal.tsx`):
    - Đặt lịch hẹn qua điện thoại: Chọn ngày thuận tiện, chọn khung giờ (Sáng 09:00 - 11:30, Chiều 14:00 - 16:30, Tối 19:00 - 21:00) và màn hình xác nhận thành công.
  - Container Hợp Nhất & Trang Server Component [`/tu-van-dinh-duong`](/tu-van-dinh-duong):
    - Quản lý đồng bộ URL searchParams `?protocol=...`, hỗ trợ SSR pre-fetch kết quả tức thì và làm lại bài test linh hoạt.
- [x] **Giai đoạn 16.5: Hub Quản Lý Phác Đồ Cá Nhân (`/tai-khoan/phac-do`), Lịch Nhắc Liều Dùng Hàng Ngày & Tích Hợp Toàn Sàn** *(Đã hoàn thành & Đã kiểm thử)*:
  - Trung Tâm Phác Đồ & Lịch Nhắc Uống Vi Chất Của Tôi (`AccountProtocolsHubClient.tsx`):
    - Quản lý đồng thời nhiều phác đồ đã được Dược sĩ kê và lưu trữ trên tài khoản.
    - Chuyển đổi tab linh hoạt: "Lịch Nhắc Uống Hôm Nay" và "Tất Cả Phác Đồ & Lịch Hẹn Tư Vấn".
  - Thẻ Lịch Nhắc Liều Dùng Hàng Ngày & Điểm Danh Uống Vi Chất (`DailyDosageScheduleCard.tsx`):
    - Phân bổ 3 khung giờ uống khoa học trong ngày: Sáng (sau ăn sáng), Chiều (men vi sinh nước ấm < 40°C), Tối (sữa ấm trước ngủ).
    - Bộ đếm chuỗi ngày uống đúng giờ liên tiếp (Streak counter 🔥) kích thích thói quen bổ sung vi chất đều đặn.
    - Thanh tiến trình hoàn thành trong ngày (% cữ đã uống) lưu trạng thái bền vững trong `localStorage`.
  - Danh Sách Phác Đồ Đã Lưu & Lịch Hẹn Tư Vấn (`SavedProtocolsList.tsx`):
    - Xem chi tiết từng phác đồ đã làm, danh sách sản phẩm thành phần và theo dõi tiến trình lịch hẹn tư vấn cùng Dược sĩ (`PENDING`, `CONFIRMED`, `COMPLETED`).
  - Trang Server Component [`/tai-khoan/phac-do`](/tai-khoan/phac-do):
    - Bảo vệ nghiêm ngặt bằng NextAuth v5 Session Guard, tự động chuyển hướng đăng nhập có callbackUrl.
    - SSR truy vấn lịch sử đánh giá `userHealthAssessment` cùng dữ liệu sản phẩm, biến thể và lịch hẹn tư vấn.
  - Tích Hợp Toàn Bộ Hệ Thống Điều Hướng Sàn:
    - Bổ sung mục "Phác đồ & Lịch uống" (`Stethoscope`) trên thanh menu bên trái `AccountSidebar.tsx`.
    - Bổ sung phím tắt phác đồ trên menu tài khoản `UserAccountMenu.tsx`.
    - Bổ sung nút "Tư vấn Dinh dưỡng" trên thanh thông báo đầu trang (Top Announcement Bar), huy hiệu nổi bật trên thanh điều hướng chính `Header.tsx` và menu di động `MobileNav.tsx`.

### 🎁 Giai đoạn 17: Hệ Thống Giỏ Quà Biếu Tùy Biến Cao Cấp, Hộp Quà Cherry Bay Air & Thiệp Chúc Mừng Cá Nhân Hóa (Luxury Custom Gift Box, Cherry Hamper Builder & Corporate B2B Gifts - ĐÃ HOÀN THÀNH 100%)
- [x] **Giai đoạn 17.1: Thiết Kế Schema, Enums, Zod Validations & Seed Dữ Liệu 5 Mẫu Hộp Quà Biếu & Yêu Cầu Doanh Nghiệp** *(Đã hoàn thành & Đã kiểm thử)*:
  - Bổ sung 4 enums cốt lõi trong `prisma/schema.prisma`:
    - `GiftBoxType`: `WOODEN_BOX` (Hộp gỗ thông sơn mài), `LEATHER_CASE` (Hộp da lót nhung đỏ), `BAMBOO_HAMPER` (Giỏ mây tre đan thủ công), `CHERRY_CARGO_BOX` (Hộp chuyên dụng Air-Cargo Cherry ép kim vàng 24K), `LUXURY_MAGNETIC_BOX` (Hộp nam châm nắp gập Châu Âu).
    - `GiftRibbonColor`: `RUBY_RED` (Đỏ rượu Ruby #800028), `CHAMPAGNE_GOLD` (Vàng kim ánh champagne), `EMERALD_GREEN` (Xanh ngọc lục bảo), `ROYAL_NAVY` (Xanh Navy quý phái).
    - `GiftOccasion`: `TET_HOLIDAY` (Tết Nguyên Đán), `MID_AUTUMN` (Tết Trung Thu), `CORPORATE_THANK_YOU` (Tri ân đối tác doanh nghiệp), `BIRTHDAY` (Sinh nhật & Kỷ niệm), `NEWBORN_BABY` (Mừng đầy tháng bé), `PARENTS_HEALTH` (Báo hiếu cha mẹ).
    - `CorporateGiftStatus`: `PENDING`, `CONTACTED`, `QUOTED`, `DEPOSIT_PAID`, `FULFILLED`, `CANCELLED`.
  - Thiết kế 4 models cơ sở dữ liệu quan hệ hoàn chỉnh:
    - `GiftBoxTemplate`: Mẫu vỏ hộp, kích thước, giá nền vỏ hộp, sức chứa tối đa (slots), cam kết bảo ôn bay Air.
    - `GiftCustomHamper`: Bản ghi giỏ quà do khách thiết kế, mã giỏ quà `HMP-XXXX`, dịp tặng, màu nơ ruy băng, niêm phong sáp đồng hoàng gia (Wax seal), đèn LED, nội dung thiệp in và người gửi/người nhận.
    - `GiftHamperItem`: Chi tiết các sản phẩm xếp vào giỏ kèm số slot chiếm dụng.
    - `CorporateGiftInquiry`: Yêu cầu báo giá quà biếu doanh nghiệp B2B số lượng lớn (Công ty, Người liên hệ, Ngân sách mỗi suất, Hóa đơn VAT, Khắc laser logo).
  - Cập nhật các quan hệ hai chiều với `User`, `Product`, `ProductVariant` và `Order`.
  - Đồng bộ thành công cơ sở dữ liệu PostgreSQL qua Prisma `db push` và tái sinh Prisma Client v5.22.0.
  - Xây dựng Zod validation schemas (`src/lib/validations/gift-box.ts`) và cấu hình bảng màu sắc, chất liệu, mẫu lời chúc thiệp theo dịp.
  - Kịch bản seed dữ liệu mẫu sinh động (`prisma/seed-gift-boxes.ts`): Nạp 5 mẫu vỏ hộp quà sang trọng và 1 yêu cầu quà tặng doanh nghiệp mẫu `CORP-202611-001`.
- [x] **Giai đoạn 17.2: Xây Dựng Hệ Thống REST APIs Quản Lý Hộp Quà, Tính Toán Sức Chứa (Slot Capacity Engine) & Báo Giá Doanh Nghiệp** *(Đã hoàn thành & Đã kiểm thử)*:
  - Thư viện logic dung lượng giỏ quà & tổng hợp KPIs (`src/lib/gift-box.ts`):
    - `getActiveGiftBoxTemplates`: Lấy danh sách mẫu vỏ hộp quà đang hoạt động theo thứ tự ưu tiên.
    - `calculateHamperCapacityAndTotal`: Động cơ tính toán dung lượng (Slots), kiểm tra giới hạn sức chứa vỏ hộp, cộng gộp giá nền vỏ hộp + phụ kiện đèn LED + các sản phẩm thành phần; tự động kích hoạt ưu đãi combo giỏ quà cao cấp -5% khi đạt từ 2.000.000đ.
    - `generateHamperCode` & `generateCorporateInquiryCode`: Sinh mã giỏ quà duy nhất `HMP-YYYYMM-XXXX` và mã yêu cầu doanh nghiệp `CORP-YYYYMM-XXXX`.
    - `calculateCorporateGiftKPIs`: Thống kê 6 chỉ số KPI vận hành (Tổng yêu cầu doanh nghiệp, Yêu cầu mới chờ liên hệ, Đã gửi bảng báo giá, Hợp đồng đã cọc/chốt thành công, Doanh thu quà biếu thực tế, Tỷ lệ chốt đơn B2B).
  - Hệ thống Public REST APIs:
    - `GET /api/gift-boxes/templates`: API lấy danh sách mẫu vỏ hộp quà công khai kèm bộ lọc loại hộp (`boxType`).
    - `POST /api/gift-boxes/calculate`: API tính toán dung lượng slots và tổng tiền giỏ quà thời gian thực phục vụ trình dựng visual.
    - `POST /api/gift-boxes/create`: API lưu cấu hình giỏ quà tùy biến của khách hàng (User hoặc Guest Session), tạo bản ghi `GiftCustomHamper` và `GiftHamperItem`.
    - `GET /api/gift-boxes/[id]`: API lấy chi tiết giỏ quà theo ID hoặc mã `hamperCode`.
    - `POST /api/gift-boxes/corporate-inquiry`: API tiếp nhận yêu cầu báo giá quà tặng doanh nghiệp B2B số lượng lớn có kiểm tra Zod validation.
  - Hệ thống Admin REST APIs bảo mật (`ADMIN` role check):
    - `GET & POST /api/admin/gift-boxes/templates`: Quản lý danh sách mẫu vỏ hộp và tạo mẫu hộp mới.
    - `GET, PATCH & DELETE /api/admin/gift-boxes/templates/[id]`: Xem chi tiết, cập nhật giá vỏ hộp, kích thước, và xóa an toàn (tự động chuyển trạng thái ẩn nếu đã có khách dùng).
    - `GET /api/admin/gift-boxes/corporate-inquiries`: Danh sách yêu cầu doanh nghiệp phân trang, tìm kiếm đa năng và lọc theo trạng thái.
    - `GET, PATCH & DELETE /api/admin/gift-boxes/corporate-inquiries/[id]`: Cập nhật trạng thái đàm phán B2B, lưu báo giá chính thức `quotedTotal` và ghi chú nội bộ `adminNotes`.
- [x] **Giai đoạn 17.3: Giao Diện Quản Trị Hộp Quà Biếu & Báo Giá Doanh Nghiệp Admin CMS (`/admin/hop-qua-bieu`)** *(Đã hoàn thành & Đã kiểm thử)*:
  - 5 Thẻ Thống Kê KPI Quà Biếu & Quà Doanh Nghiệp (`GiftBoxStats.tsx`):
    - Tổng yêu cầu B2B: Theo dõi lượng doanh nghiệp liên hệ đặt quà.
    - Chờ báo giá: Cảnh báo các đơn hàng B2B cần chuyên viên tư vấn gấp.
    - Đã chốt cọc: Số lượng hợp đồng quà tặng thành công kèm tỷ lệ chốt đơn (%).
    - Doanh số quà biếu: Tổng giá trị hợp đồng B2B đã thu (VNĐ).
    - Mẫu vỏ hộp: Đếm số lượng mẫu vỏ hộp đang hoạt động và số giỏ quà khách hàng đã tự thiết kế trên sàn.
  - Bộ Lọc Đa Năng & Chuyển Đổi Tab Thông Minh (`GiftBoxFilters.tsx`):
    - Tab Switcher: "Yêu Cầu Quà Doanh Nghiệp (B2B)" và "Mẫu Vỏ Hộp Quà Biếu".
    - Tìm kiếm theo mã yêu cầu, tên công ty, người liên hệ, SĐT, hoặc tên mẫu hộp/slug.
    - Lọc theo trạng thái hợp đồng B2B (`PENDING`, `CONTACTED`, `QUOTED`, `DEPOSIT_PAID`, `FULFILLED`, `CANCELLED`).
    - Phím tắt mở Modal thêm mới mẫu vỏ hộp quà.
  - Bảng Quản Lý Yêu Cầu Quà Doanh Nghiệp (`CorporateInquiryTable.tsx`):
    - Hiển thị mã `CORP-XXXX`, tên công ty, người liên hệ, nút gọi nhanh (`tel:`) và email (`mailto:`).
    - Chi tiết dịp tặng, số lượng suất quà, ngân sách dự kiến mỗi suất, báo giá tổng, hạn giao hàng, huy hiệu xuất hóa đơn VAT và in logo doanh nghiệp.
    - Thao tác mở Modal báo giá & xóa an toàn.
  - Bảng Quản Lý Mẫu Vỏ Hộp Quà (`GiftTemplateTable.tsx`):
    - Hiển thị ảnh mẫu hộp, tên, slug, loại chất liệu, kích thước chuẩn (DxRxC), giá vỏ hộp, sức chứa slots và huy hiệu cam kết giữ nhiệt bay Air.
    - Nút gạt chuyển trạng thái kinh doanh / tạm ngừng tức thì.
  - Modal Thêm Mới Mẫu Vỏ Hộp Quà (`CreateGiftTemplateModal.tsx`):
    - Form nhập tên, tự động sinh slug tiếng Việt chuẩn, chọn kiểu dáng hộp, sức chứa slots (2-12 ô), kích thước, giá vỏ hộp, URL ảnh và cam kết bảo ôn.
  - Modal Báo Giá & Cập Nhật Trạng Thái B2B (`InquiryQuoteModal.tsx`):
    - Xem tóm tắt thông tin khách và yêu cầu phối set quà, cập nhật tiến trình xử lý, nhập số tiền báo giá chính thức (VNĐ) và lưu nhật ký đàm phán nội bộ.
  - Trang Server Component [`/admin/hop-qua-bieu`](/admin/hop-qua-bieu) & Menu Sidebar:
    - Pre-fetch SSR số liệu KPI, danh sách mẫu hộp và yêu cầu B2B.
    - Bổ sung mục "Hộp quà biếu" (icon `Gift`) trên thanh menu điều hướng `AdminSidebar.tsx`.
- [x] **Giai đoạn 17.4: Giao Diện Storefront Trình Thiết Kế Giỏ Quà Tương Tác Visual & Viết Thiệp Cá Nhân Hóa (`/gio-qua-bieu`)** *(Đã hoàn thành & Đã kiểm thử)*:
  - Khối Hero Sang Trọng & Phím Tắt Báo Giá Doanh Nghiệp B2B:
    - Nhận diện thương hiệu đỏ rượu vang `#800028`, gradient hoàng gia và giới thiệu quy trình đóng gói quà tặng nhập khẩu bay Air từ Úc.
    - Nút CTA mở Modal báo giá B2B dành cho khách hàng doanh nghiệp đặt từ 5 suất trở lên.
  - Thanh Tiến Trình 4 Bước Thông Minh (`HamperBuilderClient.tsx`):
    - Bước 1: Chọn vỏ hộp -> Bước 2: Chọn sản phẩm -> Bước 3: Phụ kiện & Thiệp -> Bước 4: Tóm tắt & Đặt hàng.
    - Điều hướng mượt mà, cho phép nhấn quay lại các bước trước đó bất kỳ lúc nào.
  - Lựa Chọn Kiểu Dáng Vỏ Hộp (`StepBoxSelection.tsx`):
    - Hiển thị danh thiếp vỏ hộp gỗ thông sơn mài, hộp da lót nhung đỏ, giỏ mây tre đan thủ công, hộp chuyên dụng Cherry ép kim 24K.
    - Trực quan kích thước chuẩn, chất liệu, sức chứa slots và huy hiệu cam kết chuẩn bay Air.
  - Chọn Vật Phẩm & Đo Lường Sức Chứa Theo Thời Gian Thực (`StepProductSelection.tsx`):
    - Thanh đo dung lượng giỏ (Capacity Gauge): Cập nhật trực tiếp số ô đã dùng / tối đa (VD: 3/5 ô), cảnh báo tức thì khi hộp đã đầy sức chứa.
    - Bộ lọc danh mục vật phẩm linh hoạt: Cherry Úc tươi bay Air, Mật ong Manuka & TPCN Úc, Sữa Aptamil Mẹ & Bé.
    - Bộ điều khiển số lượng (+ / -) cùng thẻ thông tin số slot mỗi sản phẩm chiếm dụng.
  - Phụ Kiện Đóng Gói Hoàng Gia & Thiết Kế Thiệp Chúc Mừng (`StepPackagingAndCard.tsx`):
    - Bảng 4 màu nơ lụa satin cao cấp: Đỏ Ruby (#800028), Vàng Champagne, Xanh Ngọc Lục Bảo, Xanh Navy.
    - Tùy chọn đóng dấu niêm sáp đồng THUYNGA (Royal Wax seal) và lắp dây đèn LED đom đóm ấm áp (+50.000₫).
    - Bộ soạn thảo thiệp chúc mừng cá nhân hóa: Chọn dịp lễ (Tết, Trung Thu, Doanh nghiệp, Sinh nhật, Đầy tháng, Báo hiếu), 1-click điền lời chúc mẫu trang trọng, nhập tên người gửi và người nhận.
    - Thẻ xem trước thiệp chúc mừng dập nổi thực tế thời gian thực (Realtime Card Preview) với phong cách thư pháp tinh tế.
  - Modal Đặt Hàng Doanh Nghiệp B2B Số Lượng Lớn (`CorporateInquiryModal.tsx`):
    - Biểu mẫu nhập thông tin công ty, người phụ trách, SĐT Zalo, email, số lượng suất, ngân sách, xuất hóa đơn VAT và khắc laser logo lên nắp hộp gỗ.
  - Thanh Tóm Tắt & Tính Tiền Giỏ Quà Tự Động (Sticky Live Summary Panel):
    - Tính toán chi tiết giá vỏ hộp, tổng tiền sản phẩm thành phần, phụ kiện đèn LED và tự động kích hoạt ưu đãi giỏ quà cao cấp -5% khi đạt từ 2.000.000đ.
    - Nút 1-chạm "Thêm Giỏ Quà Này Vào Giỏ Hàng" gọi API lưu cấu hình và đồng bộ tức thì vào giỏ hàng Zustand `useCartStore`.
  - Trang Server Component [`/gio-qua-bieu`](/gio-qua-bieu):
    - Pre-fetch SSR toàn bộ mẫu vỏ hộp quà tặng đang kích hoạt và danh sách sản phẩm Úc đạt chuẩn phối set quà biếu.
- [x] **Giai đoạn 17.5: Tích Hợp Giỏ Hàng, Trang Chi Tiết Đơn Hàng & Điều Hướng Toàn Sàn** *(Đã hoàn thành & Đã kiểm thử)*:
  - Tích Hợp Hiển Thị Giỏ Quà Tùy Biến Trong Giỏ Hàng (`CartItemRow.tsx`):
    - Nhận diện `item.isCustomHamper` với huy hiệu tím sang trọng "Giỏ quà tùy biến" (icon `Gift`).
    - Hiển thị danh mục chi tiết: Tên vỏ hộp, màu nơ satin, dấu sáp hoàng gia THUYNGA, đèn LED ấm áp và trích dẫn lời chúc thiệp dập nổi.
  - Tích Hợp Điều Hướng Toàn Diện Trên Toàn Hệ Thống:
    - Bổ sung liên kết nổi bật "Giỏ quà biếu" (`Gift`) trên thanh điều hướng chính `Header.tsx`.
    - Bổ sung mục "Giỏ Quà Biếu Hoàng Gia" (huy hiệu `VIP`) trên ngăn kéo menu di động `MobileNav.tsx`.

### ✅ Giai đoạn 18: Hệ Thống Live Chat & Hỗ Trợ Đa Kênh Tích Hợp Dược Sĩ / CSKH (Multi-channel Live Chat, Pharmacist Consultation Widget & Webhook Zalo/Facebook - ĐÃ HOÀN THÀNH 100%)
- [x] **Giai đoạn 18.1: Thiết Kế Schema, Enums, Zod Validations & Seed Dữ Liệu Hội Thoại Chat Mẫu** *(Đã hoàn thành & Đã kiểm thử)*:
  - Bổ sung 3 enums cốt lõi trong `prisma/schema.prisma`:
    - `ChatSenderRole`: `CUSTOMER` (Khách hàng), `PHARMACIST` (Dược sĩ chuyên môn), `SUPPORT_AGENT` (Chuyên viên CSKH), `SYSTEM_BOT` (Hệ thống tự động).
    - `ChatSessionStatus`: `ACTIVE` (Đang trao đổi), `PENDING_PHARMACIST` (Chờ Dược sĩ hỗ trợ), `RESOLVED` (Đã giải đáp), `CLOSED` (Đã đóng).
    - `ChatMessageType`: `TEXT` (Văn bản), `IMAGE` (Ảnh toa thuốc/bao bì), `PRODUCT_CARD` (Thẻ sản phẩm), `ORDER_CARD` (Thẻ đơn hàng).
  - Thiết kế 2 models quan hệ hoàn chỉnh:
    - `ChatSession`: Mã phiên `sessionCode`, liên kết `User` hoặc khách vãng lai `guestSessionId`, tên khách, SĐT, email, trạng thái, người phụ trách, bộ đếm tin chưa đọc hai chiều và tin nhắn cuối.
    - `ChatMessage`: Nội dung trao đổi, vai trò người gửi, đính kèm mediaUrl, metadata JSON và trạng thái đã đọc `isRead`.
  - Cập nhật quan hệ hai chiều `chatSessions` trong model `User`.
  - Đồng bộ thành công cơ sở dữ liệu PostgreSQL qua Prisma `db push` và tái sinh Prisma Client v5.22.0.
  - Xây dựng Zod validation schemas (`src/lib/validations/chat.ts`), cấu hình vai trò, trạng thái và 5 gợi ý câu hỏi nhanh (Quick Chat Prompts).
  - Kịch bản seed dữ liệu mẫu sinh động (`prisma/seed-chat.ts`): Nạp 2 phiên hội thoại chuyên sâu (Tư vấn vận chuyển Cherry Tasmania bay Air `CHAT-202611-001` và tư vấn Dược sĩ về sữa Aptamil Profutura tiêu hóa nhạy cảm `CHAT-202611-002`).
- [x] **Giai đoạn 18.2: Xây Dựng Hệ Thống REST APIs & Logic Hội Thoại Thời Gian Thực (Chat Engine)** *(Đã hoàn thành & Đã kiểm thử)*:
  - Thư viện logic hội thoại & tổng hợp KPIs (`src/lib/chat.ts`):
    - `generateChatSessionCode`: Sinh mã định danh phiên chat duy nhất `CHAT-YYYYMM-XXXX`.
    - `getOrCreateChatSession`: Tự động nhận diện phiên chat đang hoạt động (`ACTIVE`, `PENDING_PHARMACIST`) của khách hàng theo `userId` hoặc `guestSessionId`, hỗ trợ lưu tin nhắn mở đầu mượt mà.
    - `calculateChatKPIs`: Thống kê 5 chỉ số KPI CSKH (Tổng số phiên chat, Số phiên đang trao đổi, Số phiên cần Dược sĩ tham vấn, Số phiên đã giải quyết, Tổng lượng tin nhắn và thời gian phản hồi trung bình).
  - Hệ thống Public Storefront REST APIs:
    - `GET /api/chat/session`: API lấy phiên chat hiện tại của khách hàng vãng lai hoặc đã đăng nhập.
    - `POST /api/chat/session`: API khởi tạo phiên chat mới kèm tin nhắn chào hỏi ban đầu có Zod validation.
    - `GET /api/chat/messages`: API tải lịch sử tin nhắn của phiên chat (hỗ trợ polling tin nhắn mới theo `sinceTimestamp`).
    - `POST /api/chat/messages`: API khách hàng gửi tin nhắn mới, tự động tăng bộ đếm tin chưa đọc phía Admin (`unreadAdminCount`) và cập nhật thời gian tin nhắn cuối.
    - `POST /api/chat/read`: API khách hàng đánh dấu đã đọc tin nhắn trong phiên (`unreadCustomerCount = 0`).
  - Hệ thống Admin / Pharmacist REST APIs bảo mật (`ADMIN` role check):
    - `GET /api/admin/chat/sessions`: Quản lý danh sách các phiên trò chuyện phân trang, tìm kiếm theo tên/SĐT/mã và lọc theo trạng thái.
    - `GET, PATCH & DELETE /api/admin/chat/sessions/[id]`: Xem toàn bộ lịch sử trò chuyện kèm hồ sơ khách hàng, chuyển trạng thái hội thoại và xóa an toàn.
    - `POST /api/admin/chat/messages`: API Dược sĩ / Chuyên viên CSKH phản hồi khách hàng (hỗ trợ văn bản, ảnh, thẻ sản phẩm), tự động tăng `unreadCustomerCount`.
    - `POST /api/admin/chat/read`: API quản trị viên đánh dấu đã đọc tin nhắn của khách hàng.
- [x] **Giai đoạn 18.3: Giao Diện Trung Tâm Live Chat CSKH & Dược Sĩ Admin CMS (`/admin/chat-cskh`)** *(Đã hoàn thành & Đã kiểm thử)*:
  - 4 Thẻ Thống Kê KPI Live Chat & Dược Sĩ (`ChatStats.tsx`):
    - Đang trao đổi: Theo dõi số lượng cuộc hội thoại khách đang online.
    - Cần Dược sĩ: Cảnh báo các thắc mắc về liều dùng vi chất và sữa cần Dược sĩ chuyên môn tham vấn.
    - Đã giải quyết: Số lượng phiên tư vấn đã hỗ trợ thành công.
    - Tổng tin nhắn & Thời gian phản hồi trung bình (~3 phút).
  - Danh Sách Hội Thoại Đa Luồng Bên Trái (`ChatSessionList.tsx`):
    - Ô tìm kiếm khách hàng theo tên, số điện thoại, mã phiên `CHAT-XXXX`.
    - Bộ lọc trạng thái tab nhanh (Tất cả, Đang chat, Cần Dược sĩ, Đã xong).
    - Thẻ hội thoại trực quan kèm huy hiệu tin chưa đọc nổi bật, trích đoạn tin nhắn mới nhất và thời gian tương tác gần nhất.
  - Khung Trò Chuyện & Phản Hồi Trực Tiếp Bên Phải (`ChatConversationPane.tsx`):
    - Tiêu đề hiển thị hồ sơ khách, nút gọi nhanh (`tel:`), email và bộ chọn chuyển đổi trạng thái phiên chat.
    - Luồng tin nhắn phân biệt rõ ràng: Tin nhắn khách hàng (trắng), Tin nhắn CSKH (đỏ rượu #800028), Tin nhắn Dược sĩ (xanh ngọc lục bảo kèm icon `Stethoscope`), Tin nhắn hệ thống (tím).
    - Bộ chuyển đổi vai trò phản hồi: Cho phép quản trị viên linh hoạt chuyển đổi giữa "Chuyên viên CSKH" và "Dược sĩ Chuyên Môn".
    - Khung nhập tin nhắn tiện lợi hỗ trợ phím tắt Enter để gửi nhanh.
  - Bộ Điều Phối Live Chat Tự Động (`ChatCenterManager.tsx`):
    - Tự động poll cập nhật tin nhắn mới mỗi 4 giây và tự động đánh dấu đã đọc khi mở phiên.
  - Trang Server Component [`/admin/chat-cskh`](/admin/chat-cskh) & Menu Sidebar:
    - Pre-fetch SSR số liệu KPI và 30 phiên hội thoại mới nhất.
    - Bổ sung mục "Live Chat CSKH" (icon `MessageSquare`) trên menu thanh bên `AdminSidebar.tsx`.
- [x] **Giai đoạn 18.4: Widget Floating Live Chat Storefront Góc Màn Hình & Trải Nghiệm Tương Tác Hai Chiều** *(Đã hoàn thành & Đã kiểm thử)*:
  - Nút Bấm Nổi Hoàng Gia Góc Phải Màn Hình (`LiveChatButton.tsx`):
    - Tông màu đỏ rượu mận `#800028` viền vàng gold, chấm xanh online động và bộ đếm huy hiệu tin nhắn chưa đọc (`unreadCount`).
    - Tooltip gợi ý "Chat cùng Dược sĩ & CSKH" trên Desktop.
  - Cửa Sổ Trò Chuyện Trực Tuyến Hiện Đại (`LiveChatWindow.tsx`):
    - Tiêu đề "Dược Sĩ & CSKH THUYNGA" kèm huy hiệu trạng thái cam kết phản hồi trong 3 phút.
    - Màn hình khởi tạo (Pre-chat): Lời chào nồng hậu, 5 thẻ câu hỏi nhanh 1-chạm (HSD Cherry Úc, đổi sữa Aptamil, tra cứu đơn, giỏ quà Tết) và form đăng ký họ tên, SĐT Zalo.
    - Luồng tin nhắn tương tác hai chiều: Bong bóng tin nhắn khách hàng (đỏ rượu #800028) đối xứng với tin phản hồi của Chuyên viên/Dược sĩ (trắng/xanh ngọc lục bảo kèm icon `Stethoscope`).
    - Khung nhập tin nhắn tích hợp thanh gợi ý nhanh và nút gửi `Send`.
  - Widget Hợp Nhất & Duy Trì Phiên Khách Vãng Lai (`LiveChatWidget.tsx`):
    - Tự động sinh và lưu `thuynga_guest_session_id` trong `localStorage`, bảo toàn lịch sử chat khi khách tải lại trang hoặc chuyển tab.
    - Cơ chế polling tự động mỗi 3.5 giây kiểm tra tin nhắn mới và tự động đánh dấu đã đọc khi mở cửa sổ.
  - Tích Hợp Toàn Bộ Giao Diện Storefront (`QuickContact.tsx`):
    - Đặt vị trí nổi bật góc dưới bên phải màn hình trên tất cả các trang bán hàng.
- [x] **Giai đoạn 18.5: Tích Hợp Đa Kênh Zalo OA, Facebook Messenger, Mẫu Phản Hồi Nhanh & Âm Báo Chime Web Audio API** *(Đã hoàn thành & Đã kiểm thử)*:
  - Thư Viện Tổng Hợp Âm Báo Độc Lập Chuẩn Web Audio API (`src/lib/chat-audio.ts`):
    - Khởi tạo âm thanh dạng sóng sin mượt mà tần số G5 (784Hz) -> C6 (1046.5Hz) cho tin nhắn mới đến và D5 (587Hz) cho thao tác gửi tin.
    - Hoạt động 100% offline, không phụ thuộc bất kỳ file mp3 ngoài nào, tự động tương thích chính sách autoplay của trình duyệt và lưu trạng thái bật/tắt chuông vào `localStorage`.
  - Thanh Chuyển Tiếp Đa Kênh Storefront (`LiveChatWindow.tsx`):
    - Tích hợp 3 kênh liên hệ tức thời: Zalo OA Dược Sĩ chính thức (`https://zalo.me/0908886666`), Facebook Messenger Fanpage (`https://m.me/thuyngashop.com.vn`), và Hotline Dược Sĩ (`tel:0908886666`).
    - Nút bật/tắt âm báo chuông (`Volume2` / `VolumeX`) trực tiếp trên thanh tiêu đề cửa sổ chat.
    - Thẻ đánh giá 5 sao hài lòng tư vấn Dược sĩ khi phiên trò chuyện được chuyển sang trạng thái `RESOLVED`.
  - Bổ Sung 6 Mẫu Tin Nhắn Trả Lời Nhanh Chuẩn Dược Sĩ Trong Admin CMS (`ChatConversationPane.tsx`):
    - Lời chào Dược sĩ, Tư vấn sữa Aptamil Profutura Synbiotics, Mật ong Manuka chỉ số MGO/UMF, Cherry Tasmania bay Air 48h tươi giòn, Hóa đơn Chemist Warehouse & tem phụ tiếng Việt, Đóng gói giao hàng hỏa tốc.
    - Nút bật/tắt âm báo chuông tin nhắn mới của khách hàng cho nhân viên tư vấn Admin.

### 🔬 Giai đoạn 19: Bộ So Sánh Sản Phẩm Chuyên Sâu & Phân Tích Vi Chất Thông Minh (Smart Australian Product Comparison, Nutrient Synergy & Safety Matrix - ĐÃ HOÀN THÀNH 100%)
- [x] **Giai đoạn 19.1: Thiết Kế Schema, Enums, Zod Validations & Seed Dữ Liệu Vi Chất Chuẩn Úc** *(Đã hoàn thành & Đã kiểm thử)*:
  - Bổ sung 3 enums cốt lõi trong `prisma/schema.prisma`:
    - `NutrientUnit`: `MG`, `MCG`, `G`, `IU`, `CFU`, `PERCENT`, `MGO`.
    - `ComparisonScope`: `GENERAL`, `INFANT_FORMULA`, `SUPPLEMENTS`, `MANUKA_HONEY`, `FRESH_FRUITS`.
    - `SynergyType`: `SYNERGY_BENEFICIAL`, `CAUTION_OVERDOSE`, `INTERACTION_SEPARATE`, `NEUTRAL`.
  - Thiết kế 4 models chuyên sâu:
    - `NutrientReference`: Chỉ tiêu hoạt chất tiêu chuẩn (DHA, EPA, Synbiotics, MGO, Folic Acid, Sắt hữu cơ, Canxi, Kẽm, Vitamin D3, K2 MK7, Silymarin kế sữa).
    - `ProductNutrient`: Hàm lượng vi chất trên liều dùng và trên 100g của từng sản phẩm.
    - `ProductComparisonFeature`: Bảng chỉ tiêu so sánh mở rộng (chi phí ngày dùng `costPerDay`, số ngày dùng `servingsPerPack`, chứng nhận TGA/ACO, đối tượng phù hợp, đặc điểm vị giác, bảo quản).
    - `NutrientSynergyRule`: Bộ quy tắc tương tác vi chất chuẩn Dược sĩ (D3+K2 dẫn hướng canxi, Omega-3 DHA/EPA tỷ lệ vàng, Canxi và Sắt giãn cách 2 giờ tránh cạnh tranh hấp thụ).
  - Cập nhật quan hệ hai chiều `nutrients` và `comparisonFeature` trong model `Product`.
  - Đồng bộ cơ sở dữ liệu PostgreSQL qua Prisma `db push` thành công và tái sinh Prisma Client v5.22.0.
  - Xây dựng Zod validation schemas (`src/lib/validations/comparison.ts`) với cấu hình danh mục và màu sắc tương tác.
  - Kịch bản seed dữ liệu mẫu sinh động (`prisma/seed-comparison.ts`): Nạp 11 chỉ tiêu vi chất, 5 quy tắc hiệp đồng/cảnh báo, và thiết lập đầy đủ thông số cho 6 sản phẩm chủ lực (Aptamil Profutura, A2 Platinum, Mật ong Manuka Comvita, Dầu cá Blackmores, Elevit bà bầu, Vitamin D3 K2 Sunday Natural).
- [x] **Giai đoạn 19.2: Xây Dựng Comparison Engine, Dịch Vụ Phân Tích Tương Tác Vi Chất & Hệ Thống REST APIs** *(Đã hoàn thành & Đã kiểm thử)*:
  - Thư viện logic so sánh ma trận & thuật toán phân tích tương tác (`src/lib/comparison.ts`):
    - `getComparisonDataset`: Chuẩn hóa dữ liệu tối đa 4 sản phẩm theo 4 phân nhóm (Chung, Tiêu chuẩn chứng nhận, Thành phần vi chất đối chiếu đồng trục, và Cảm quan trải nghiệm).
    - `analyzeNutrientSynergies`: Thuật toán đối chiếu thành phần vi chất tự động phát hiện nguy cơ thừa liều (`CAUTION_OVERDOSE`) khi tổng lượng vi chất trong các sản phẩm uống cùng ngày vượt ngưỡng an toàn tối đa (Upper Limit - UL), đồng thời truy quét quy tắc hiệp đồng tương hỗ (`SYNERGY_BENEFICIAL`) và cảnh báo uống cách thời điểm (`INTERACTION_SEPARATE`).
  - Hệ thống Public Storefront REST APIs:
    - `GET /api/comparison/products?ids=...`: Lấy toàn bộ ma trận dữ liệu phân tích đối chiếu theo danh sách IDs.
    - `POST /api/comparison/analyze`: API phân tích tương tác vi chất chuẩn Dược sĩ có Zod validation (`analyzeSynergySchema`).
    - `GET /api/comparison/search`: API tìm kiếm nhanh sản phẩm bổ sung vào bảng so sánh với hỗ trợ lọc danh mục và loại trừ sản phẩm đã chọn.
  - Hệ thống Admin CMS REST APIs bảo mật (`ADMIN` role guard):
    - `GET & POST /api/admin/nutrients`: Xem danh mục và khởi tạo chỉ tiêu vi chất chuẩn hóa.
    - `PUT /api/admin/products/[id]/nutrients`: Cập nhật thông số so sánh mở rộng và cấu trúc thành phần vi chất cho từng sản phẩm trong database transaction.
- [x] **Giai đoạn 19.3: Quản Lý State Zustand & Thanh So Sánh Nổi Storefront (Floating Comparison Dock)** *(Đã hoàn thành & Đã kiểm thử)*:
  - Zustand Store Lưu Trữ Client-side Thông Minh (`src/store/comparison.ts`):
    - Quản lý danh sách tối đa 4 sản phẩm so sánh, đồng bộ `localStorage` qua middleware `persist` (`thuynga_comparison_store`).
    - Các actions: `addItem` (tự động kiểm tra giới hạn 4 sản phẩm và tự động mở dock khi thêm mới), `removeItem`, `clear`, `toggleOpen`, `hasItem`.
  - Nút So Sánh Sản Phẩm Đa Năng (`ComparisonButton.tsx`):
    - Đặt nổi trên từng thẻ sản phẩm `ProductCard.tsx` (cạnh nút Thả Tim Yêu Thích) và trang chi tiết sản phẩm `ProductInfoSection.tsx` (`showText=true`).
    - Nhận diện trạng thái đã thêm/chưa thêm với icon `Scale` (chuẩn quy tắc không dùng icon Sparkles).
  - Thanh Dock Nổi Thông Minh Dưới Đáy Màn Hình (`FloatingComparisonDock.tsx`):
    - Trạng thái thu gọn: Huy hiệu pill sang trọng gradient đỏ rượu `#800028` đính kèm bộ đếm `(N/4)` nhấp nháy tinh tế.
    - Trạng thái mở rộng: 4 ô sản phẩm (thẻ ảnh, tên, giá bán và nút X xóa nhanh 1-chạm), ô trống có nét đứt khuyến khích thêm sản phẩm, nút "Xóa hết" và nút CTA "So Sánh Ngay" dẫn thẳng vào `/so-sanh`.
  - Tích Hợp Toàn Bộ Giao Diện Storefront (`layout.tsx`):
    - Xuất hiện xuyên suốt trên tất cả các trang bán hàng của THUYNGA Shop.
- [x] **Giai đoạn 19.4: Giao Diện Bảng Ma Trận So Sánh & Thẻ Phân Tích Hiệp Đồng Dược Sĩ (`/so-sanh`)** *(Đã hoàn thành & Đã kiểm thử)*:
  - Bảng Ma Trận Đối Chiếu Trực Quan Đa Chiều (`ComparisonMatrixTable.tsx`):
    - Cột cố định (Sticky Header): 4 cột sản phẩm kèm ảnh phóng to, tên, giá bán và nút 1-chạm "Thêm vào giỏ" (`useCartStore`) cùng nút xóa nhanh.
    - Phân nhóm 4 phần rõ ràng: (1) Thông tin chung & chi phí sử dụng (giá, chi phí ngày dùng ~VNĐ/ngày, số ngày dùng/hộp, quy cách, xuất xứ hàng bay Air), (2) Chứng nhận tiêu chuẩn & kiểm định Úc (TGA, FSANZ, ACO Organic), (3) Bảng hàm lượng vi chất dinh dưỡng đối chiếu đồng trục (DHA, EPA, Synbiotics, MGO, Canxi, Sắt, Kẽm, D3, K2...), (4) Cảm quan trải nghiệm & ưu điểm đột phá độc quyền.
    - Cột trống nét đứt thông minh khi so sánh ít hơn 4 sản phẩm, tích hợp nút "Chọn sản phẩm đối chiếu".
  - Thẻ Phân Tích Hiệp Đồng & Cảnh Báo An Toàn Dược Sĩ (`ComparisonSynergyCard.tsx`):
    - Huy hiệu tổng thể: "Hiệp đồng sinh học cao" (xanh ngọc lục bảo), "Cần lưu ý liều dùng" (đỏ hồng), "Kết hợp an toàn".
    - Khối ý kiến đánh giá chuyên môn Dược sĩ THUYNGA Shop kèm icon `Stethoscope`.
    - Danh sách các tương tác chi tiết: Giải thích cơ chế sinh học, chỉ định liều uống cụ thể của Dược sĩ và các sản phẩm liên đới.
  - Modal Tìm Kiếm & Bổ Sung Sản Phẩm (`ComparisonSearchModal.tsx`):
    - Tìm kiếm tức thời theo từ khóa tên hoặc thương hiệu, tự động loại trừ sản phẩm đã có trong bảng, 1-click thêm vào bảng so sánh.
  - Giao Diện Trạng Thái Trống & 3 Bộ Đôi Mẫu Gợi Ý Sẵn (`ComparisonPageClient.tsx`):
    - Bộ đôi 1: Aptamil Profutura vs A2 Platinum Úc (Synbiotics vs Đạm A2).
    - Bộ đôi 2: Dầu cá Blackmores & Vitamin D3 K2 MK7 (Hiệp đồng vi chất).
    - Bộ đôi 3: Elevit Bayer Úc & Sữa Bột Aptamil (Chỉ định giãn cách Canxi và Sắt hữu cơ).
  - Trang Server Component [`/so-sanh`](/so-sanh):
    - Cấu hình OpenGraph & SEO Metadata chuyên sâu cho công cụ so sánh.
- [x] **Giai đoạn 19.5: Giao Diện Quản Trị Admin CMS Chỉ Tiêu Vi Chất (`/admin/vi-chat`) & Tích Hợp Toàn Sàn** *(Đã hoàn thành & Đã kiểm thử)*:
  - 4 Thẻ Thống Kê KPI Vi Chất & Ma Trận Dinh Dưỡng (`NutrientStats.tsx`):
    - Tổng chỉ tiêu vi chất chuẩn, Quy tắc hiệp đồng Dược sĩ, Sản phẩm đã nạp vi chất, và Số lượng nhóm dưỡng chất chính (Omega, Vitamin, Khoáng chất, Men vi sinh).
  - Bảng Quản Lý Danh Mục Chỉ Tiêu Vi Chất (`NutrientReferenceTable.tsx`):
    - Bộ lọc theo danh mục và tìm kiếm tức thời theo mã code hoặc tên hoạt chất.
    - Đối chiếu trực quan: Mã code, Tên tiếng Việt / Danh pháp khoa học tiếng Anh, Liều khuyến nghị RDI, Ngưỡng cảnh báo tối đa UL, Tóm tắt công dụng & lưu ý, Bộ đếm số lượng sản phẩm đang áp dụng.
  - Danh Sách Quy Tắc Tương Tác & Hiệp Đồng Dược Sĩ (`NutrientSynergyList.tsx`):
    - Trực quan hóa các cặp vi chất tương tác: Badge loại tương tác (Hiệp đồng hấp thu, Cảnh báo vượt ngưỡng, Giãn cách 2 giờ), mô tả cơ chế sinh học và chỉ định Dược sĩ.
  - Modal Thêm Mới Chỉ Tiêu Vi Chất (`CreateNutrientModal.tsx`):
    - Biểu mẫu nhập mã code, tên vi chất, đơn vị đo lường (`NutrientUnit`), liều RDI, ngưỡng UL, tóm tắt công dụng và lưu ý khi uống.
  - Bộ Điều Phối Admin Vi Chất (`NutrientManager.tsx`) & Trang Server Component [`/admin/vi-chat`](/admin/vi-chat):
    - Chuyển đổi tab linh hoạt giữa "Chỉ Tiêu Vi Chất" và "Quy Tắc Hiệp Đồng", tích hợp nút làm mới dữ liệu và mở modal tạo mới.
  - Tích Hợp Điều Hướng Toàn Diện Trên Toàn Hệ Thống:
    - Bổ sung menu "Chỉ tiêu vi chất" (icon `Scale`) trên thanh bên quản trị `AdminSidebar.tsx`.
    - Bổ sung nút liên kết nổi bật "So sánh vi chất" (icon `Scale`) trên thanh điều hướng chính `Header.tsx`.
    - Bổ sung mục "So Sánh Sản Phẩm & Vi Chất" (huy hiệu `Chuẩn Úc`) trên ngăn kéo menu di động `MobileNav.tsx`.

### ✈️ Giai đoạn 20: Hệ Thống Giám Sát Chuyến Bay Air Cargo Thời Gian Thực & Bản Đồ Chuỗi Lạnh Cold-Chain (Realtime Flight Tracker, Cold-Chain Sensor Log & Radar Map - ĐANG TRIỂN KHAI)
- [x] **Giai đoạn 20.1: Thiết Kế Schema Chuyến Bay, Cảm Biến Chuỗi Lạnh & Seed Dữ Liệu Thực Tế** *(Đã hoàn thành & Đã kiểm thử)*:
  - Bổ sung 3 enums cốt lõi trong `prisma/schema.prisma`:
    - `FlightStatus`: `SCHEDULED` (Đã lên lịch), `DEPARTED` (Đã cất cánh), `CRUISING` (Đang bay trên không phận), `LANDED` (Đã hạ cánh), `CUSTOMS_CLEARING` (Đang thông quan & kiểm dịch), `STORED_COLD` (Đã nhập kho lạnh THUYNGA Shop).
    - `ColdChainCategory`: `ULTRA_COLD_CHERRY` (Chuỗi lạnh sâu 0-4°C cho Cherry Tasmania), `COOL_PROBIOTICS` (Chuỗi mát 2-8°C cho men sống), `CONTROLLED_AMBIENT` (Nhiệt độ phòng kiểm soát 18-24°C cho sữa Aptamil & TPCN).
    - `SensorAlertLevel`: `NORMAL` (An toàn tuyệt đối), `WARNING` (Cận ngưỡng), `CRITICAL` (Báo động vượt ngưỡng).
  - Thiết kế 3 models chuyên sâu:
    - `AirCargoFlight`: Lưu thông tin chuyến bay, số hiệu (VN780, VN772, QF7561), loại tàu bay (Boeing 787-9, A350-900, B747-8F), hãng hàng không, sân bay đi/đến, thời gian bay thực tế, tọa độ GPS, độ cao bay (ft), tiến độ bay %, nhiệt độ mục tiêu và khối lượng hàng hóa.
    - `FlightMilestone`: Các mốc hành trình từ đóng gói nông trại, cất cánh, bay hành trình, hạ cánh đến thông quan hải quan.
    - `ColdChainSensorLog`: Bản ghi chuỗi thời gian của thiết bị cảm biến nhiệt độ & độ ẩm gắn kèm thùng hàng.
  - Cập nhật quan hệ hai chiều `flights` trong model `AirCargoShipment`.
  - Đồng bộ cơ sở dữ liệu PostgreSQL qua Prisma `db push` thành công và tái sinh Prisma Client v5.22.0.
  - Xây dựng Zod validation schemas (`src/lib/validations/air-cargo.ts`) cùng cấu hình trạng thái, dải nhiệt độ và nhận diện hãng bay.
  - Kịch bản seed dữ liệu mẫu sinh động (`prisma/seed-flights.ts`): Nạp 3 chuyến bay Air Cargo huyết mạch từ Melbourne & Sydney về Nội Bài/Tân Sơn Nhất kèm 15 mốc hành trình và 21 bản ghi cảm biến chuỗi lạnh thực tế.
- [x] **Giai đoạn 20.2: Xây Dựng Flight Tracker Engine, Dịch Vụ Đánh Giá Chuỗi Lạnh & REST APIs** *(Đã hoàn thành & Đã kiểm thử)*:
  - Thư viện Flight Tracker Engine & Cold-Chain Analytics (`src/lib/flight-tracker.ts`):
    - `calculateFlightLiveProgress`: Tính toán động tọa độ GPS trên không phận quốc tế, tiến độ chuyến bay %, và thời gian bay còn lại (`remainingTimeFormatted`) giữa Melbourne/Sydney và Hà Nội/TP.HCM.
    - `evaluateColdChainAnalytics`: Đánh giá chất lượng chuỗi lạnh (nhiệt độ min, max, avg, tỷ lệ tuân thủ %, điểm chất lượng và trạng thái `OPTIMAL` / `ACCEPTABLE` / `BREACHED`).
    - `calculateFlightKPIs`: Tổng hợp 6 chỉ số KPI Air Cargo (Tổng chuyến bay, Chuyến đang bay, Chuyến đã nhập kho lạnh, Sản lượng tấn hàng, Tỷ lệ tuân thủ chuỗi lạnh).
  - Hệ thống Public Storefront REST APIs:
    - `GET /api/air-cargo/flights`: Danh sách chuyến bay hỗ trợ tìm kiếm, lọc theo hãng bay và trạng thái.
    - `GET /api/air-cargo/flights/[flightNumber]`: Chi tiết chuyến bay kèm tiến trình GPS, mốc hành trình và toàn bộ chuỗi số liệu cảm biến nhiệt độ.
    - `GET /api/air-cargo/kpis`: Số liệu KPI tổng quan cho dashboard và trang công khai.
  - Hệ thống Admin CMS REST APIs bảo mật (`ADMIN` role check):
    - `GET & POST /api/admin/air-cargo/flights`: Xem danh sách và khởi tạo chuyến bay mới kèm tự động sinh 4 mốc hành trình cơ bản.
    - `PATCH & DELETE /api/admin/air-cargo/flights/[id]`: Cập nhật trạng thái bay, tọa độ GPS, thời gian thực tế và xóa chuyến bay.
    - `POST /api/admin/air-cargo/sensor-logs`: Ghi nhận tức thời số liệu cảm biến nhiệt độ/độ ẩm và tự động tái tính toán nhiệt độ trung bình.
- [x] **Giai đoạn 20.3: Trang Tra Cứu Hành Trình Chuyến Bay & Bản Đồ Hàng Không Trực Quan (`/tra-cuu-air-cargo`)** *(Đã hoàn thành & Đã kiểm thử)*:
  - Bản Đồ Radar Quỹ Đạo Hàng Không SVG Trực Quan (`FlightRadarMap.tsx`):
    - Vẽ quỹ đạo cong Bezier giữa các sân bay Úc (Melbourne, Sydney, Hobart Tasmania) và Việt Nam (Nội Bài HAN / Tân Sơn Nhất SGN).
    - Biểu tượng máy bay chuyển động theo tiến trình thực tế, tích hợp hiển thị góc xoay hướng bay, độ cao (FT), tọa độ GPS và thời gian bay còn lại.
    - Hiệu ứng sóng radar phát tín hiệu ngọn hải đăng (Radar Beacon Ping Ring) tại điểm đến.
  - Biểu Đồ Cảm Biến Chuỗi Lạnh Cold-Chain SVG (`ColdChainChart.tsx`):
    - Đồ thị đường polyline nhiệt độ theo chuỗi thời gian ghi nhận từ các cảm biến tự ghi USB Logger.
    - Vùng an toàn kiểm soát nhiệt độ (0.0°C - 4.0°C) đánh dấu màu xanh ngọc lục bảo mờ trực quan.
    - Điểm đo tương tác: Nhấp để xem thông số chi tiết nhiệt độ (°C), độ ẩm (%) và tên công đoạn vận chuyển.
  - Mốc Tiến Trình Hành Trình Vận Chuyển (`FlightMilestoneTimeline.tsx`):
    - Trực quan hóa 5 mốc khép kín: Đóng gói kiểm nhiệt nông trại, Cất cánh đường băng Úc, Bay tuần tra trên không, Hạ cánh Nội Bài/TSN, Thông quan và nhập kho lạnh THUYNGA Shop.
  - Trang Tổng Quan Tra Cứu [`/tra-cuu-air-cargo`](/tra-cuu-air-cargo):
    - Hero banner phong cách radar hàng không, 4 thẻ KPI chuyến bay và danh sách các chuyến bay cập nhật tiến trình % trực tiếp.
  - Trang Chi Tiết Chuyến Bay [`/tra-cuu-air-cargo/[flightNumber]`](/tra-cuu-air-cargo/VN780):
    - Bản kê kiện hàng hóa Air Cargo (Manifest) và liên kết các lô sản phẩm tương ứng.
- [x] **Giai đoạn 20.4: Tích Hợp Live Flight Ticker & Kết Nối Thẻ Sản Phẩm Air Cargo** *(Đã hoàn thành & Đã kiểm thử)*:
  - Dải Băng Thông Tin Chuyến Bay Air Cargo Trực Tiếp (`LiveFlightTicker.tsx`):
    - Đặt ngay dưới Hero Banner trang chủ `src/app/(storefront)/page.tsx`.
    - Hiệu ứng la bàn radar quay nhẹ nhàng (`Compass` animate-spin), huy hiệu chuyến bay (VN772, VN780, QF7561) gắn cờ quốc gia, lộ trình bay (SYD/MEL ➔ HAN/SGN), tiến độ hành trình % và nhiệt độ khoang hàng trực tiếp (°C).
    - Phím tắt 1-chạm xem nhanh chi tiết radar chuyến bay tương ứng.
  - Tích Hợp Huy Hiệu Sản Phẩm & Điều Hướng Toàn Diện:
    - Nâng cấp `ProductAirCargoBadge.tsx`: Nhấp trực tiếp vào số hiệu chuyến bay để mở Radar giám sát thời gian thực `/tra-cuu-air-cargo/[flightNumber]`.
    - Bổ sung nút liên kết "Radar Air Cargo Úc" trên thanh điều hướng đầu trang `Header.tsx` và ngăn kéo menu di động `MobileNav.tsx`.
- [ ] **Giai đoạn 20.5: Giao Diện Quản Trị Admin CMS Chuyến Bay Air Cargo (`/admin/kho-hang/chuyen-bay-air`) & Hoàn Thiện Toàn Sàn**

### 🔜 Giai đoạn 7: Triển Khai Lên VPS Ubuntu & Production
- [ ] Cấu hình Nginx làm Reverse Proxy trỏ domain về cổng 3000.
- [ ] Thiết lập PM2 quản lý tiến trình tự động khởi động lại khi server reboot.
- [ ] Cài đặt SSL miễn phí qua Cloudflare hoặc Certbot Let's Encrypt.
- [ ] Backup tự động PostgreSQL định kỳ.

---

*Tài liệu được lập và duy trì bởi Developer Trần Văn Cường & AI Co-pilot | Cập nhật lần cuối: 2026-10-27*
