import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { calculateCampaignProgress } from "@/lib/preorder";

export const dynamic = "force-dynamic";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    const campaign = await prisma.seasonalCampaign.findUnique({
      where: { slug },
      include: {
        tiers: {
          orderBy: { sortOrder: "asc" },
        },
        harvestUpdates: {
          orderBy: { reportedAt: "desc" },
        },
        _count: {
          select: { reservations: true },
        },
      },
    });

    if (!campaign) {
      return NextResponse.json(
        { success: false, message: "Chiến dịch mùa vụ không tồn tại." },
        { status: 404 }
      );
    }

    const stats = calculateCampaignProgress(campaign);

    return NextResponse.json({
      success: true,
      campaign: {
        ...campaign,
        stats,
      },
    });
  } catch (error: any) {
    console.error("Lỗi khi tải chi tiết chiến dịch mùa vụ:", error);
    return NextResponse.json(
      { success: false, message: "Không thể tải chi tiết chiến dịch mùa vụ." },
      { status: 500 }
    );
  }
}
