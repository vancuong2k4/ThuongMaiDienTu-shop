// ============================================================
// app/api/admin/aircargo/batches/route.ts
// Quản trị Danh Sách & Tạo Mới Lô Hàng Sản Phẩm (Phase 15)
// ============================================================

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { createBatchSchema } from "@/lib/validations/batch";

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
    const limit = Math.max(1, Math.min(100, parseInt(searchParams.get("limit") || "15")));
    const skip = (page - 1) * limit;

    const search = searchParams.get("search")?.trim() || "";
    const shipmentId = searchParams.get("shipmentId") || "";
    const productId = searchParams.get("productId") || "";
    const isActiveParam = searchParams.get("isActive");

    const where: Prisma.ProductBatchWhereInput = {};

    if (search) {
      where.OR = [
        { batchCode: { contains: search, mode: "insensitive" } },
        { australianBarcode: { contains: search, mode: "insensitive" } },
        { chemistSource: { contains: search, mode: "insensitive" } },
        { product: { name: { contains: search, mode: "insensitive" } } },
      ];
    }

    if (shipmentId) where.shipmentId = shipmentId;
    if (productId) where.productId = productId;
    if (isActiveParam !== null && isActiveParam !== undefined && isActiveParam !== "ALL") {
      where.isActive = isActiveParam === "true";
    }

    const [batches, total] = await Promise.all([
      prisma.productBatch.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          product: {
            select: {
              id: true,
              name: true,
              slug: true,
              images: {
                take: 1,
                orderBy: { sortOrder: "asc" },
                select: { url: true },
              },
            },
          },
          variant: {
            select: { id: true, name: true, sku: true },
          },
          shipment: {
            select: {
              id: true,
              shipmentNumber: true,
              airWaybillNumber: true,
              carrier: true,
              flightNumber: true,
              departureDate: true,
              arrivalDate: true,
              status: true,
            },
          },
          _count: {
            select: { verificationLogs: true },
          },
        },
      }),
      prisma.productBatch.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      data: batches,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("GET /api/admin/aircargo/batches error:", error);
    return NextResponse.json(
      { error: "Đã xảy ra lỗi khi lấy danh sách lô sản phẩm" },
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

    const body = await req.json();
    const parsed = createBatchSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Dữ liệu không hợp lệ", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const data = parsed.data;

    // Kiểm tra trùng mã lô
    const existing = await prisma.productBatch.findUnique({
      where: { batchCode: data.batchCode.trim().toUpperCase() },
    });

    if (existing) {
      return NextResponse.json(
        { error: `Mã lô "${data.batchCode}" đã tồn tại trên hệ thống!` },
        { status: 400 }
      );
    }

    const batch = await prisma.productBatch.create({
      data: {
        batchCode: data.batchCode.trim().toUpperCase(),
        productId: data.productId,
        variantId: data.variantId || null,
        shipmentId: data.shipmentId,
        manufactureDate: new Date(data.manufactureDate),
        expiryDate: new Date(data.expiryDate),
        importedQuantity: data.importedQuantity,
        remainingStock: data.remainingStock ?? data.importedQuantity,
        australianBarcode: data.australianBarcode?.trim() || null,
        chemistSource: data.chemistSource?.trim() || "Chemist Warehouse Sydney",
        certificateUrl: data.certificateUrl || null,
        isActive: data.isActive,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Tạo lô sản phẩm bay Air thành công",
      data: batch,
    });
  } catch (error) {
    console.error("POST /api/admin/aircargo/batches error:", error);
    return NextResponse.json(
      { error: "Đã xảy ra lỗi khi tạo lô sản phẩm" },
      { status: 500 }
    );
  }
}
