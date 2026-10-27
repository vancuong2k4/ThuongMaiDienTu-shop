import { Metadata } from "next";
import { Suspense } from "react";
import { RegisterForm } from "@/components/storefront/auth/RegisterForm";

export const metadata: Metadata = {
  title: "Đăng ký tài khoản | THUYNGA Shop",
  description:
    "Đăng ký tài khoản thành viên THUYNGA Shop để tích điểm đổi quà, nhận voucher ưu đãi và quản lý đơn hàng dễ dàng.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function RegisterPage() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-neutral-50/50">
      <Suspense
        fallback={
          <div className="w-full max-w-md mx-auto p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#800028] mx-auto" />
          </div>
        }
      >
        <RegisterForm />
      </Suspense>
    </div>
  );
}
