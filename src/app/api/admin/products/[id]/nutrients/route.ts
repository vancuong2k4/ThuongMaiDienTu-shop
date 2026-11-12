// ============================================================
// app/api/admin/products/[id]/nutrients/route.ts
// Admin API Quản lý thông số so sánh và vi chất cho sản phẩm (Phase 19)
// ============================================================

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import {
  updateProductComparisonFeatureSchema,
  updateProductNutrientSchema,
} from "@/lib/validations/comparison";
import { z } from "zod";

export const dynamic = "force-dynamic";

const updatePayloadSchema = z.object({
  feature: updateProductComparisonFeatureSchema.optional(),
  nutrients: z.array(updateProductNutrientSchema).optional(),
});

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (session?.user?.role !== "ADMIN") {
      return NextResponse.json(
        { success: false, message: "Không có quyền truy cập." },
        { status: 403 }
      );
    }

    const { id: productId } = await params;
    const body = await req.json();
    const validated = updatePayloadSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        { success: false, message: validated.error.issues[0]?.message || "Dữ liệu không hợp lệ." },
        { status: 400 }
      );
    }

    const { feature, nutrients } = validated.data;

    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      return NextResponse.json(
        { success: false, message: "Không tìm thấy sản phẩm." },
        { status: 404 }
      );
    }

    // 1. Upsert Comparison Feature if provided
    if (feature) {
      await prisma.productComparisonFeature.upsert({
        where: { productId },
        update: {
          scope: feature.scope,
          costPerDay: feature.costPerDay || null,
          servingsPerPack: feature.servingsPerPack || null,
          australianCertification: feature.australianCertification || null,
          targetAgeGroup: feature.targetAgeGroup || null,
          textureOrFlavor: feature.textureOrFlavor || null,
          keyDifferentiators: feature.keyDifferentiators ? (feature.keyDifferentiators as any) : undefined,
          storageInstruction: feature.storageInstruction || null,
        },
        create: {
          productId,
          scope: feature.scope,
          costPerDay: feature.costPerDay || null,
          servingsPerPack: feature.servingsPerPack || null,
          australianCertification: feature.australianCertification || null,
          targetAgeGroup: feature.targetAgeGroup || null,
          textureOrFlavor: feature.textureOrFlavor || null,
          keyDifferentiators: feature.keyDifferentiators ? (feature.keyDifferentiators as any) : undefined,
          storageInstruction: feature.storageInstruction || null,
        },
      });
    }

    // 2. Replace Nutrients if provided
    if (nutrients) {
      await prisma.$transaction(async (tx) => {
        await tx.productNutrient.deleteMany({
          where: { productId },
        });

        if (nutrients.length > 0) {
          await tx.productNutrient.createMany({
            data: nutrients.map((n) => ({
              productId,
              nutrientRefId: n.nutrientRefId,
              amountPerServing: n.amountPerServing,
              amountPer100g: n.amountPer100g || null,
              servingSizeText: n.servingSizeText || null,
              percentDailyValue: n.percentDailyValue || null,
              highlightClaim: n.highlightClaim || null,
            })),
          });
        }
      });
    }

    return NextResponse.json({
      success: true,
      message: "Cập nhật thông số so sánh và vi chất thành công.",
    });
  } catch (error: any) {
    console.error("Lỗi khi cập nhật thông số so sánh sản phẩm:", error);
    return NextResponse.json(
      { success: false, message: "Không thể cập nhật thông số vi chất sản phẩm." },
      { status: 500 }
    );
  }
}
