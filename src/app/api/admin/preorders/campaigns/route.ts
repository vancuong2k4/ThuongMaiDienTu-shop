import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { createSeasonalCampaignSchema } from "@/lib/validations/preorder";
import { calculateCampaignProgress } from "@/lib/preorder";

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

    const campaigns = await prisma.seasonalCampaign.findMany({
      orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
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
    console.error("Lỗi khi tải danh sách chiến dịch admin:", error);
    return NextResponse.json(
      { success: false, message: "Không thể tải danh sách chiến dịch." },
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
    const validated = createSeasonalCampaignSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        {
          success: false,
          message:
            validated.error.issues[0]?.message || "Dữ liệu chiến dịch không hợp lệ.",
        },
        { status: 400 }
      );
    }

    const data = validated.data;

    // Kiểm tra trùng slug
    const existing = await prisma.seasonalCampaign.findUnique({
      where: { slug: data.slug },
    });

    if (existing) {
      return NextResponse.json(
        { success: false, message: "Đường dẫn slug chiến dịch đã tồn tại." },
        { status: 400 }
      );
    }

    const campaign = await prisma.seasonalCampaign.create({
      data: {
        title: data.title,
        slug: data.slug,
        subtitle: data.subtitle,
        description: data.description,
        farmName: data.farmName,
        farmRegion: data.farmRegion,
        originCountry: data.originCountry,
        productCategory: data.productCategory,
        bannerImage: data.bannerImage,
        galleryImages: data.galleryImages || [],
        harvestStartDate: new Date(data.harvestStartDate),
        harvestEndDate: new Date(data.harvestEndDate),
        flightDepartureWeek: data.flightDepartureWeek,
        targetBrixSweetness: data.targetBrixSweetness,
        fruitSizeMm: data.fruitSizeMm,
        qualityGrade: data.qualityGrade,
        totalCapacityKg: data.totalCapacityKg,
        status: data.status,
        depositType: data.depositType,
        depositPercent: data.depositPercent,
        sortOrder: data.sortOrder,
      },
    });

    return NextResponse.json(
      { success: true, message: "Tạo chiến dịch mùa vụ thành công!", campaign },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Lỗi khi tạo chiến dịch mùa vụ admin:", error);
    return NextResponse.json(
      { success: false, message: "Không thể tạo chiến dịch mùa vụ." },
      { status: 500 }
    );
  }
}
