import { NextRequest, NextResponse } from "next/server";
import { aptamilFormulaCalculatorInputSchema } from "@/lib/validations/pediatric-growth";
import { calculateAptamilFormulaMix } from "@/lib/pediatric-growth";

// ============================================================
// app/api/pediatric/calculate-formula/route.ts
// Tính Toán Tỷ Lệ Nước, Muỗng, Năng Lượng & Nhiệt Độ Pha Sữa (Phase 23)
// ============================================================

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validated = aptamilFormulaCalculatorInputSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Dữ liệu đầu vào không hợp lệ.",
          errors: validated.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const result = await calculateAptamilFormulaMix(validated.data);

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    console.error("Lỗi khi tính toán pha sữa Aptamil:", error);
    return NextResponse.json(
      {
        success: false,
        message: error.message || "Lỗi hệ thống khi tính toán công thức pha sữa.",
      },
      { status: 500 }
    );
  }
}
