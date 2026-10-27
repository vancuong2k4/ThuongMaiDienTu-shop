import { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { WishlistClient, WishlistProductItem } from "@/components/storefront/account/WishlistClient";

export const metadata: Metadata = {
  title: "Sản phẩm yêu thích | THUYNGA Shop",
  description: "Danh sách sản phẩm bạn đã lưu yêu thích tại THUYNGA Shop.",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function WishlistPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/dang-nhap?callbackUrl=/tai-khoan/yeu-thich");
  }

  const rawWishlist = await prisma.wishlist.findMany({
    where: {
      userId: session.user.id,
    },
    include: {
      product: {
        include: {
          variants: {
            where: { isActive: true },
            orderBy: [{ isDefault: "desc" }, { price: "asc" }],
          },
          images: {
            orderBy: { sortOrder: "asc" },
            take: 1,
          },
        },
      },
    },
    orderBy: {
      addedAt: "desc",
    },
  });

  const serializedItems: WishlistProductItem[] = rawWishlist.map((it) => {
    const defaultVar = it.product.variants[0] || null;
    const coverImg = it.product.images[0]?.url || defaultVar?.image || null;

    return {
      id: it.id,
      productId: it.productId,
      addedAt: it.addedAt.toISOString(),
      product: {
        id: it.product.id,
        name: it.product.name,
        slug: it.product.slug,
        brand: it.product.brand,
        origin: it.product.origin,
        image: coverImg,
        defaultVariant: defaultVar
          ? {
              id: defaultVar.id,
              name: defaultVar.name,
              sku: defaultVar.sku,
              price: Number(defaultVar.price),
              originalPrice: defaultVar.originalPrice ? Number(defaultVar.originalPrice) : null,
              stock: defaultVar.stock,
              image: defaultVar.image,
            }
          : null,
      },
    };
  });

  return <WishlistClient initialItems={serializedItems} />;
}
