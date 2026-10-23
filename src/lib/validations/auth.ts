// ============================================================
// lib/validations/auth.ts – Zod schemas cho auth
// ============================================================

import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Vui lòng nhập email")
    .email("Email không hợp lệ")
    .max(255),
  password: z
    .string()
    .min(1, "Vui lòng nhập mật khẩu")
    .max(100),
});

export const registerSchema = z
  .object({
    name: z.string().min(2, "Tên phải có ít nhất 2 ký tự").max(100),
    email: z.string().email("Email không hợp lệ").max(255),
    phone: z
      .string()
      .regex(/^(0|\+84)[3-9]\d{8}$/, "Số điện thoại không hợp lệ")
      .optional()
      .or(z.literal("")),
    password: z
      .string()
      .min(8, "Mật khẩu phải có ít nhất 8 ký tự")
      .max(100)
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "Mật khẩu phải có chữ hoa, chữ thường và số"
      ),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Mật khẩu xác nhận không khớp",
    path: ["confirmPassword"],
  });

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
