// ============================================================
// app/api/admin/aircargo/batches/[id]/route.ts
// Chi Tiết, Chỉnh Sửa & Xóa Lô Hàng Sản Phẩm (Phase 15)
// ============================================================

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { updateBatchSchema } from "@/lib/validations/batch";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(req: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth();
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const batch = await prisma.productBatch.findUnique({
      where: { id },
      include: {
        product: true,
        variant: true,
        shipment: true,
        verificationLogs: {
          take: 20,
          orderBy: { verifiedAt: "desc" },
        },
      },
    });

    if (!batch) {
      return NextResponse.json(
        { error: "Không tìm thấy lô sản phẩm" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: batch });
  } catch (error) {
    console.error("GET /api/admin/aircargo/batches/[id] error:", error);
    return NextResponse.json(
      { error: "Đã xảy ra lỗi khi lấy thông tin lô sản phẩm" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth();
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();
    const parsed = updateBatchSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Dữ liệu không hợp lệ", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const data = parsed.data;
    const updateData: any = {};

    if (data.batchCode !== undefined) updateData.batchCode = data.batchCode.trim().toUpperCase();
    if (data.productId !== undefined) updateData.productId = data.productId;
    if (data.variantId !== undefined) updateData.variantId = data.variantId;
    if (data.shipmentId !== undefined) updateData.shipmentId = data.shipmentId;
    if (data.manufactureDate !== undefined) updateData.manufactureDate = new Date(data.manufactureDate);
    if (data.expiryDate !== undefined) updateData.expiryDate = new Date(data.expiryDate);
    if (data.importedQuantity !== undefined) updateData.importedQuantity = data.importedQuantity;
    if (data.remainingStock !== undefined) updateData.remainingStock = data.remainingStock;
    if (data.australianBarcode !== undefined) updateData.australianBarcode = data.australianBarcode;
    if (data.chemistSource !== undefined) updateData.chemistSource = data.chemistSource;
    if (data.certificateUrl !== undefined) updateData.certificateUrl = data.certificateUrl;
    if (data.isActive !== undefined) updateData.isActive = data.isActive;

    const updated = await prisma.productBatch.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({
      success: true,
      message: "Cập nhật lô sản phẩm thành công",
      data: updated,
    });
  } catch (error) {
    console.error("PATCH /api/admin/aircargo/batches/[id] error:", error);
    return NextResponse.json(
      { error: "Đã xảy ra lỗi khi cập nhật lô sản phẩm" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth();
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    await prisma.productBatch.delete({ where: { id } });

    return NextResponse.json({
      success: true,
      message: "Xóa lô sản phẩm thành công",
    });
  } catch (error) {
    console.error("DELETE /api/admin/aircargo/batches/[id] error:", error);
    return NextResponse.json(
      { error: "Đã xảy ra lỗi khi xóa lô sản phẩm" },
      { status: 500 }
    );
  }
}
