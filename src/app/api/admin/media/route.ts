// ============================================================
// app/api/admin/media/route.ts
// API Danh Sách & Tải Lên Thư Viện Media Admin CMS
// ============================================================

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { Prisma } from "@prisma/client";

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
    const limit = Math.max(1, Math.min(100, parseInt(searchParams.get("limit") || "18")));
    const skip = (page - 1) * limit;

    const search = searchParams.get("search")?.trim() || "";

    const where: Prisma.MediaWhereInput = {};
    if (search) {
      where.OR = [
        { filename: { contains: search, mode: "insensitive" } },
        { altText: { contains: search, mode: "insensitive" } },
      ];
    }

    const [mediaItems, totalCount, statsAgg] = await Promise.all([
      prisma.media.findMany({
        where,
        skip,
        take: limit,
        orderBy: [{ createdAt: "desc" }],
      }),
      prisma.media.count({ where }),
      prisma.media.aggregate({
        _sum: { size: true },
        _count: true,
      }),
    ]);

    const formattedItems = mediaItems.map((m) => ({
      id: m.id,
      filename: m.filename,
      url: m.url,
      mimeType: m.mimeType,
      size: m.size,
      width: m.width,
      height: m.height,
      altText: m.altText,
      createdAt: m.createdAt.toISOString(),
    }));

    return NextResponse.json({
      success: true,
      media: formattedItems,
      pagination: {
        page,
        limit,
        total: totalCount,
        totalPages: Math.ceil(totalCount / limit) || 1,
      },
      stats: {
        totalFiles: statsAgg._count || 0,
        totalSizeBytes: statsAgg._sum.size || 0,
      },
    });
  } catch (error) {
    console.error("GET /api/admin/media error:", error);
    return NextResponse.json(
      { error: "Đã xảy ra lỗi khi lấy danh sách media" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const contentType = req.headers.get("content-type") || "";

    // ── TRƯỜNG HỢP 1: THÊM ẢNH TỪ URL NGOÀI (JSON) ─────────────
    if (contentType.includes("application/json")) {
      const body = await req.json();
      const { url, filename, altText } = body;

      if (!url || typeof url !== "string") {
        return NextResponse.json(
          { error: "Vui lòng nhập đường dẫn URL ảnh hợp lệ" },
          { status: 400 }
        );
      }

      const cleanUrl = url.trim();
      const inferredName =
        filename ||
        cleanUrl.split("/").pop()?.split("?")[0] ||
        `external_${Date.now()}.jpg`;

      const media = await prisma.media.create({
        data: {
          filename: inferredName,
          url: cleanUrl,
          mimeType: "image/jpeg",
          size: 0,
          altText: altText?.trim() || null,
        },
      });

      return NextResponse.json(
        {
          success: true,
          message: "Đã lưu ảnh vào kho media",
          media,
        },
        { status: 201 }
      );
    }

    // ── TRƯỜNG HỢP 2: TẢI FILE TỪ MÁY (FORMDATA) ───────────────
    const formData = await req.formData();
    const files = formData.getAll("file") as File[];
    const altText = (formData.get("altText") as string) || null;

    if (!files || files.length === 0) {
      return NextResponse.json(
        { error: "Vui lòng chọn tập tin để tải lên" },
        { status: 400 }
      );
    }

    const uploadDir = path.join(process.cwd(), "public", "uploads", "media");
    await mkdir(uploadDir, { recursive: true });

    const createdRecords = [];

    for (const file of files) {
      const validMimeTypes = [
        "image/jpeg",
        "image/png",
        "image/webp",
        "image/gif",
        "image/svg+xml",
        "image/avif",
      ];

      if (!validMimeTypes.includes(file.type)) {
        continue;
      }

      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const ext = path.extname(file.name).toLowerCase() || ".jpg";
      const timestamp = Date.now();
      const randomHex = Math.random().toString(36).substring(2, 7);
      const uniqueFileName = `media_${timestamp}_${randomHex}${ext}`;
      const filePath = path.join(uploadDir, uniqueFileName);

      await writeFile(filePath, buffer);

      const publicUrl = `/uploads/media/${uniqueFileName}`;

      const mediaRecord = await prisma.media.create({
        data: {
          filename: file.name,
          url: publicUrl,
          mimeType: file.type,
          size: file.size,
          altText: altText?.trim() || file.name.replace(/\.[^/.]+$/, ""),
        },
      });

      createdRecords.push(mediaRecord);
    }

    return NextResponse.json(
      {
        success: true,
        message: `Đã tải lên thành công ${createdRecords.length} tệp hình ảnh`,
        media: createdRecords,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /api/admin/media error:", error);
    return NextResponse.json(
      { error: "Đã xảy ra lỗi khi tải ảnh lên kho media" },
      { status: 500 }
    );
  }
}
