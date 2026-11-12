import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("q")?.trim() || "";
    const categorySlug = searchParams.get("category")?.trim() || "";
    const excludeIds = (searchParams.get("exclude") || "")
      .split(",")
      .map((id) => id.trim())
      .filter(Boolean);

    const where: any = {
      isActive: true,
      ...(excludeIds.length > 0 ? { id: { notIn: excludeIds } } : {}),
    };

    if (query) {
      where.OR = [
        { name: { contains: query, mode: "insensitive" } },
        { brand: { contains: query, mode: "insensitive" } },
        { origin: { contains: query, mode: "insensitive" } },
      ];
    }

    if (categorySlug) {
      where.category = { slug: categorySlug };
    }

    const products = await prisma.product.findMany({
      where,
      take: 8,
      select: {
        id: true,
        name: true,
        slug: true,
        brand: true,
        origin: true,
        category: { select: { name: true, slug: true } },
        variants: {
          where: { isActive: true },
          take: 1,
          select: { price: true, originalPrice: true, image: true },
        },
        images: {
          take: 1,
          select: { url: true },
        },
        comparisonFeature: {
          select: {
            scope: true,
            costPerDay: true,
            australianCertification: true,
          },
        },
      },
    });

    const formatted = products.map((p) => {
      const v = p.variants[0];
      return {
        id: p.id,
        name: p.name,
        slug: p.slug,
        brand: p.brand,
        origin: p.origin,
        categoryName: p.category.name,
        categorySlug: p.category.slug,
        price: v ? Number(v.price) : 0,
        originalPrice: v?.originalPrice ? Number(v.originalPrice) : null,
        image: p.images[0]?.url || v?.image || "/images/placeholder.svg",
        scope: p.comparisonFeature?.scope || "GENERAL",
        costPerDay: p.comparisonFeature?.costPerDay
          ? Number(p.comparisonFeature.costPerDay)
          : null,
      };
    });

    return NextResponse.json({ success: true, products: formatted });
  } catch (error: any) {
    console.error("Lỗi khi tìm kiếm sản phẩm so sánh:", error);
    return NextResponse.json(
      { error: "Không thể tìm kiếm sản phẩm." },
      { status: 500 }
    );
  }
}
