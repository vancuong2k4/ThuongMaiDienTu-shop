import { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { AccountPageClient } from "@/components/storefront/account/AccountPageClient";

export const metadata: Metadata = {
  title: "Thông tin tài khoản | THUYNGA Shop",
  description:
    "Quản lý hồ sơ cá nhân, danh sách địa chỉ nhận hàng và bảo mật tài khoản tại THUYNGA Shop.",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function AccountPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/dang-nhap?callbackUrl=/tai-khoan");
  }

  const [user, addresses] = await Promise.all([
    prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        createdAt: true,
      },
    }),
    prisma.address.findMany({
      where: { userId: session.user.id },
      orderBy: [{ isDefault: "desc" }, { createdAt: "desc" }],
      select: {
        id: true,
        fullName: true,
        phone: true,
        province: true,
        district: true,
        ward: true,
        street: true,
        isDefault: true,
      },
    }),
  ]);

  if (!user) {
    redirect("/dang-nhap");
  }

  return (
    <AccountPageClient
      initialUser={{
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        createdAt: user.createdAt.toISOString(),
      }}
      initialAddresses={addresses}
    />
  );
}
