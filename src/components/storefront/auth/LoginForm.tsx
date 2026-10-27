// ============================================================
// components/storefront/auth/LoginForm.tsx
// Form đăng nhập người dùng tích hợp NextAuth Credentials
// ============================================================

"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import {
  Lock,
  Mail,
  Eye,
  EyeOff,
  AlertCircle,
  Loader2,
  ShieldCheck,
  ShoppingBag,
  ArrowRight,
} from "lucide-react";

export const LoginForm: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";
  const isFromCheckout = callbackUrl.includes("/thanh-toan");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!email.trim() || !password.trim()) {
      setErrorMessage("Vui lòng điền đầy đủ Email và Mật khẩu.");
      return;
    }

    setIsLoading(true);

    try {
      const res = await signIn("credentials", {
        redirect: false,
        email: email.trim().toLowerCase(),
        password: password.trim(),
      });

      if (!res || res.error) {
        setErrorMessage("Email hoặc mật khẩu không chính xác. Vui lòng thử lại.");
        setIsLoading(false);
        return;
      }

      // Đăng nhập thành công -> điều hướng về trang callbackUrl
      router.push(callbackUrl);
      router.refresh();
    } catch (err: unknown) {
      console.error(err);
      setErrorMessage("Đã xảy ra lỗi khi đăng nhập. Vui lòng thử lại sau.");
      setIsLoading(false);
    }
  };

  // Đăng nhập nhanh bằng tài khoản Admin mẫu để test
  const fillSampleAdmin = () => {
    setEmail("admin@thuyngashop.com.vn");
    setPassword("Admin@123456");
  };

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Banner nếu đi từ trang thanh toán */}
      {isFromCheckout && (
        <div className="mb-6 p-4 rounded-2xl bg-gradient-to-r from-amber-50 to-rose-50 border border-amber-200/80 shadow-sm flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#800028] text-white flex items-center justify-center shrink-0 shadow-sm">
            <ShoppingBag className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-sm text-[#800028]">
              Yêu cầu đăng nhập trước khi thanh toán
            </h4>
            <p className="text-xs text-neutral-600 mt-0.5 leading-relaxed">
              Vui lòng đăng nhập để bảo vệ quyền lợi đơn hàng, lưu lại lịch sử mua sắm và tích lũy điểm thưởng thành viên.
            </p>
          </div>
        </div>
      )}

      <div className="bg-white rounded-3xl border border-neutral-200/90 shadow-xl p-6 sm:p-8">
        <div className="text-center mb-6">
          <div className="w-12 h-12 bg-[#800028]/10 text-[#800028] rounded-2xl flex items-center justify-center mx-auto mb-3">
            <Lock className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-black text-neutral-900 tracking-tight">
            Đăng nhập tài khoản
          </h2>
          <p className="text-xs text-neutral-500 mt-1">
            Chào mừng bạn quay trở lại với THUYNGA Shop
          </p>
        </div>

        {/* Thông báo lỗi */}
        {errorMessage && (
          <div className="mb-5 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs flex items-center gap-2.5">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email */}
          <div>
            <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
              Địa chỉ Email
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-400">
                <Mail className="w-4 h-4" />
              </div>
              <input
                type="email"
                placeholder="email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
                required
                className="w-full h-11 pl-10 pr-3.5 text-sm bg-neutral-50/60 border border-neutral-300 rounded-xl focus:bg-white focus:outline-none focus:border-[#800028] focus:ring-1 focus:ring-[#800028] transition-colors"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-neutral-700">
                Mật khẩu
              </label>
              <Link
                href="/quen-mat-khau"
                className="text-xs text-[#800028] hover:underline font-medium"
              >
                Quên mật khẩu?
              </Link>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-400">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Nhập mật khẩu"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                required
                className="w-full h-11 pl-10 pr-10 text-sm bg-neutral-50/60 border border-neutral-300 rounded-xl focus:bg-white focus:outline-none focus:border-[#800028] focus:ring-1 focus:ring-[#800028] transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-neutral-400 hover:text-neutral-600"
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full h-12 mt-2 rounded-xl bg-gradient-to-r from-[#800028] to-[#9b0032] hover:from-[#660020] hover:to-[#800028] text-white font-bold text-sm shadow-md shadow-[#800028]/25 hover:shadow-lg transition-all duration-200 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Đang xác thực...</span>
              </>
            ) : (
              <>
                <span>Đăng nhập</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Nút điền nhanh tài khoản Admin */}
        <div className="mt-5 pt-4 border-t border-neutral-100 text-center">
          <p className="text-[11px] text-neutral-400 mb-2">Dành cho thử nghiệm:</p>
          <button
            type="button"
            onClick={fillSampleAdmin}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-100 hover:bg-neutral-200 text-neutral-700 text-xs font-medium transition-colors"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-[#800028]" />
            <span>Điền tài khoản Admin mẫu</span>
          </button>
        </div>

        {/* Chuyển qua Đăng ký */}
        <div className="mt-6 text-center text-xs text-neutral-600">
          Chưa có tài khoản THUYNGA Shop?{" "}
          <Link
            href={`/dang-ky${callbackUrl ? `?callbackUrl=${encodeURIComponent(callbackUrl)}` : ""}`}
            className="font-bold text-[#800028] hover:underline"
          >
            Đăng ký ngay
          </Link>
        </div>
      </div>
    </div>
  );
};
