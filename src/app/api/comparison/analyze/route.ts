import { NextRequest, NextResponse } from "next/server";
import { analyzeNutrientSynergies } from "@/lib/comparison";
import { analyzeSynergySchema } from "@/lib/validations/comparison";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validated = analyzeSynergySchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        { error: validated.error.issues[0]?.message || "Dữ liệu so sánh không hợp lệ." },
        { status: 400 }
      );
    }

    const result = await analyzeNutrientSynergies(validated.data.productIds);
    return NextResponse.json({ success: true, data: result });
  } catch (error: any) {
    console.error("Lỗi khi phân tích tương tác vi chất:", error);
    return NextResponse.json(
      { error: "Không thể phân tích tương tác và hiệp đồng vi chất." },
      { status: 500 }
    );
  }
}
