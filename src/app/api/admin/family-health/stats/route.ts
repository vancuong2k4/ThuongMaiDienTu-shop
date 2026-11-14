import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { calculateFamilyHealthAdminStats } from "@/lib/family-health";

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

    const stats = await calculateFamilyHealthAdminStats();

    return NextResponse.json({
      success: true,
      stats,
    });
  } catch (error: any) {
    console.error("Lỗi khi tải thống kê tủ thuốc gia đình admin:", error);
    return NextResponse.json(
      { success: false, message: "Không thể tải số liệu thống kê." },
      { status: 500 }
    );
  }
}
