// ============================================================
// app/api/admin/nutrients/route.ts
// Admin API Quản lý danh mục chỉ tiêu vi chất dinh dưỡng (Phase 19)
// ============================================================

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { createNutrientReferenceSchema } from "@/lib/validations/comparison";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (session?.user?.role !== "ADMIN") {
      return NextResponse.json(
        { success: false, message: "Không có quyền truy cập." },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");

    const where: any = {};
    if (category) {
      where.category = category;
    }

    const nutrients = await prisma.nutrientReference.findMany({
      where,
      orderBy: [{ sortOrder: "asc" }, { code: "asc" }],
      include: {
        _count: {
          select: { productNutrients: true },
        },
      },
    });

    return NextResponse.json({ success: true, nutrients });
  } catch (error: any) {
    console.error("Lỗi khi tải danh sách vi chất:", error);
    return NextResponse.json(
      { success: false, message: "Không thể tải danh sách vi chất." },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (session?.user?.role !== "ADMIN") {
      return NextResponse.json(
        { success: false, message: "Không có quyền truy cập." },
        { status: 403 }
      );
    }

    const body = await req.json();
    const validated = createNutrientReferenceSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        { success: false, message: validated.error.issues[0]?.message || "Dữ liệu không hợp lệ." },
        { status: 400 }
      );
    }

    const data = validated.data;

    const nutrient = await prisma.nutrientReference.create({
      data: {
        code: data.code,
        nameVi: data.nameVi,
        nameEn: data.nameEn || null,
        category: data.category,
        standardRdi: data.standardRdi || null,
        upperLimit: data.upperLimit || null,
        unit: data.unit,
        benefitsSummary: data.benefitsSummary,
        cautionNotes: data.cautionNotes || null,
        sortOrder: data.sortOrder,
      },
    });

    return NextResponse.json({ success: true, nutrient }, { status: 201 });
  } catch (error: any) {
    console.error("Lỗi khi tạo chỉ tiêu vi chất:", error);
    if (error.code === "P2002") {
      return NextResponse.json(
        { success: false, message: "Mã vi chất (Code) đã tồn tại trong hệ thống." },
        { status: 409 }
      );
    }
    return NextResponse.json(
      { success: false, message: "Không thể tạo chỉ tiêu vi chất." },
      { status: 500 }
    );
  }
}
