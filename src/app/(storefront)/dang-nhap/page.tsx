import { Metadata } from "next";
import { Suspense } from "react";
import { LoginForm } from "@/components/storefront/auth/LoginForm";

export const metadata: Metadata = {
  title: "Đăng nhập tài khoản | THUYNGA Shop",
  description:
    "Đăng nhập tài khoản THUYNGA Shop để quản lý đơn hàng, theo dõi lịch sử mua sắm và nhận ưu đãi tích điểm thành viên.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function LoginPage() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-neutral-50/50">
      <Suspense
        fallback={
          <div className="w-full max-w-md mx-auto p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#800028] mx-auto" />
          </div>
        }
      >
        <LoginForm />
      </Suspense>
    </div>
  );
}
