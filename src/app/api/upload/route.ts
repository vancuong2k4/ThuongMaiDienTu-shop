// ============================================================
// app/api/upload/route.ts
// API Tải ảnh lên máy chủ cục bộ (Local Storage /public/uploads)
// ============================================================

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

export async function POST(req: NextRequest) {
  try {
    // 1. Kiểm tra quyền Admin
    const session = await auth();
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Bạn không có quyền tải ảnh lên hệ thống" },
        { status: 401 }
      );
    }

    // 2. Đọc file từ formData
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { error: "Không tìm thấy tập tin để tải lên" },
        { status: 400 }
      );
    }

    // 3. Kiểm tra định dạng file
    const validMimeTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/gif",
      "image/avif",
    ];
    if (!validMimeTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "Chỉ chấp nhận định dạng ảnh JPG, PNG, WEBP, GIF, AVIF" },
        { status: 400 }
      );
    }

    // 4. Giới hạn dung lượng tối đa 5MB
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: "Dung lượng ảnh vượt quá giới hạn 5MB" },
        { status: 400 }
      );
    }

    // 5. Chuẩn bị thư mục lưu trữ
    const uploadDir = path.join(process.cwd(), "public", "uploads", "products");
    await mkdir(uploadDir, { recursive: true });

    // 6. Tạo tên file duy nhất an toàn
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const ext = path.extname(file.name).toLowerCase() || ".jpg";
    const timestamp = Date.now();
    const randomHex = Math.random().toString(36).substring(2, 8);
    const fileName = `prod_${timestamp}_${randomHex}${ext}`;
    const filePath = path.join(uploadDir, fileName);

    await writeFile(filePath, buffer);

    const publicUrl = `/uploads/products/${fileName}`;

    return NextResponse.json({
      success: true,
      url: publicUrl,
      fileName,
      size: file.size,
    });
  } catch (error) {
    console.error("Lỗi khi tải ảnh lên:", error);
    return NextResponse.json(
      { error: "Không thể lưu ảnh lên máy chủ. Vui lòng thử lại." },
      { status: 500 }
    );
  }
}
