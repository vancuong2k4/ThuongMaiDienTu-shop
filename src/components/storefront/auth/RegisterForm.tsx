// ============================================================
// components/storefront/auth/RegisterForm.tsx
// Form đăng ký tài khoản khách hàng mới
// ============================================================

"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import {
  User,
  Mail,
  Phone,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  Loader2,
  ArrowRight,
  UserPlus,
  CheckCircle2,
} from "lucide-react";

export const RegisterForm: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Validate client-side
    if (!name.trim()) {
      setErrorMessage("Vui lòng nhập họ và tên của bạn.");
      return;
    }
    if (!email.trim()) {
      setErrorMessage("Vui lòng nhập địa chỉ email.");
      return;
    }
    if (password.length < 8) {
      setErrorMessage("Mật khẩu phải có ít nhất 8 ký tự.");
      return;
    }
    if (password !== confirmPassword) {
      setErrorMessage("Mật khẩu xác nhận không trùng khớp.");
      return;
    }

    setIsLoading(true);

    try {
      // 1. Gọi API đăng ký
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim().toLowerCase(),
          phone: phone.trim() || undefined,
          password,
          confirmPassword,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Không thể đăng ký tài khoản. Vui lòng thử lại.");
      }

      // 2. Tự động đăng nhập sau khi đăng ký thành công
      const loginRes = await signIn("credentials", {
        redirect: false,
        email: email.trim().toLowerCase(),
        password,
      });

      if (loginRes?.error) {
        // Nếu lỗi tự động đăng nhập, chuyển sang trang đăng nhập
        router.push(`/dang-nhap?callbackUrl=${encodeURIComponent(callbackUrl)}`);
        return;
      }

      // 3. Điều hướng về callbackUrl
      router.push(callbackUrl);
      router.refresh();
    } catch (err: unknown) {
      console.error(err);
      setErrorMessage(
        err instanceof Error ? err.message : "Đã có lỗi xảy ra trong quá trình đăng ký."
      );
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-white rounded-3xl border border-neutral-200/90 shadow-xl p-6 sm:p-8">
        <div className="text-center mb-6">
          <div className="w-12 h-12 bg-[#800028]/10 text-[#800028] rounded-2xl flex items-center justify-center mx-auto mb-3">
            <UserPlus className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-black text-neutral-900 tracking-tight">
            Đăng ký tài khoản
          </h2>
          <p className="text-xs text-neutral-500 mt-1">
            Trở thành thành viên THUYNGA Shop để nhận ưu đãi độc quyền
          </p>
        </div>

        {/* Thông báo lỗi */}
        {errorMessage && (
          <div className="mb-5 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs flex items-center gap-2.5">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5">
          {/* Họ và tên */}
          <div>
            <label className="block text-xs font-semibold text-neutral-700 mb-1">
              Họ và tên <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-400">
                <User className="w-4 h-4" />
              </div>
              <input
                type="text"
                placeholder="Ví dụ: Nguyễn Văn A"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={isLoading}
                required
                className="w-full h-11 pl-10 pr-3.5 text-sm bg-neutral-50/60 border border-neutral-300 rounded-xl focus:bg-white focus:outline-none focus:border-[#800028] focus:ring-1 focus:ring-[#800028] transition-colors"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-xs font-semibold text-neutral-700 mb-1">
              Địa chỉ Email <span className="text-red-500">*</span>
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

          {/* Số điện thoại */}
          <div>
            <label className="block text-xs font-semibold text-neutral-700 mb-1">
              Số điện thoại (tùy chọn)
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-400">
                <Phone className="w-4 h-4" />
              </div>
              <input
                type="tel"
                placeholder="0912345678"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                disabled={isLoading}
                className="w-full h-11 pl-10 pr-3.5 text-sm bg-neutral-50/60 border border-neutral-300 rounded-xl focus:bg-white focus:outline-none focus:border-[#800028] focus:ring-1 focus:ring-[#800028] transition-colors"
              />
            </div>
          </div>

          {/* Mật khẩu */}
          <div>
            <label className="block text-xs font-semibold text-neutral-700 mb-1">
              Mật khẩu (ít nhất 8 ký tự, gồm chữ hoa, thường & số) <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-400">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Tối thiểu 8 ký tự"
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
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Xác nhận mật khẩu */}
          <div>
            <label className="block text-xs font-semibold text-neutral-700 mb-1">
              Nhập lại mật khẩu <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-400">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Nhập lại mật khẩu"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={isLoading}
                required
                className="w-full h-11 pl-10 pr-3.5 text-sm bg-neutral-50/60 border border-neutral-300 rounded-xl focus:bg-white focus:outline-none focus:border-[#800028] focus:ring-1 focus:ring-[#800028] transition-colors"
              />
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full h-12 mt-3 rounded-xl bg-gradient-to-r from-[#800028] to-[#9b0032] hover:from-[#660020] hover:to-[#800028] text-white font-bold text-sm shadow-md shadow-[#800028]/25 hover:shadow-lg transition-all duration-200 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Đang tạo tài khoản...</span>
              </>
            ) : (
              <>
                <span>Đăng ký & Tiếp tục</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Chuyển sang Đăng nhập */}
        <div className="mt-6 text-center text-xs text-neutral-600">
          Đã có tài khoản THUYNGA Shop?{" "}
          <Link
            href={`/dang-nhap${callbackUrl ? `?callbackUrl=${encodeURIComponent(callbackUrl)}` : ""}`}
            className="font-bold text-[#800028] hover:underline"
          >
            Đăng nhập
          </Link>
        </div>
      </div>
    </div>
  );
};
