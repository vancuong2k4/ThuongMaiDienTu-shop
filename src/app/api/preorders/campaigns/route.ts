import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { calculateCampaignProgress } from "@/lib/preorder";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const campaigns = await prisma.seasonalCampaign.findMany({
      orderBy: [{ sortOrder: "asc" }, { harvestStartDate: "asc" }],
      include: {
        tiers: {
          where: { isAvailable: true },
          orderBy: { sortOrder: "asc" },
        },
        harvestUpdates: {
          orderBy: { reportedAt: "desc" },
          take: 2,
        },
        _count: {
          select: { reservations: true },
        },
      },
    });

    const enriched = campaigns.map((campaign) => {
      const stats = calculateCampaignProgress(campaign);
      return {
        ...campaign,
        stats,
      };
    });

    return NextResponse.json({
      success: true,
      campaigns: enriched,
    });
  } catch (error: any) {
    console.error("Lỗi khi tải danh sách chiến dịch đặt trước:", error);
    return NextResponse.json(
      { success: false, message: "Không thể tải danh sách chiến dịch mùa vụ." },
      { status: 500 }
    );
  }
}
