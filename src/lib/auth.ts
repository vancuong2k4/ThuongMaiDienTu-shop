// ============================================================
// lib/auth.ts – NextAuth.js v5 Configuration
// Hỗ trợ: Credentials (email/password) + phân quyền Admin/Customer
// ============================================================

import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { compare } from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { loginSchema } from "@/lib/validations/auth";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),

  // Session dùng JWT (stateless, phù hợp cho VPS)
  session: { strategy: "jwt" },

  pages: {
    signIn: "/dang-nhap",
    error: "/dang-nhap",
  },

  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Mật khẩu", type: "password" },
      },
      async authorize(credentials) {
        // ✅ Validate input trước (chống injection)
        const parsed = loginSchema.safeParse(credentials);
        if (!parsed.success) return null;

        const { email, password } = parsed.data;

        // Tìm user trong DB
        const user = await prisma.user.findUnique({
          where: { email },
          select: {
            id: true,
            email: true,
            name: true,
            passwordHash: true,
            role: true,
            avatar: true,
            isActive: true,
          },
        });

        // Không tìm thấy hoặc user bị khóa
        if (!user || !user.passwordHash || !user.isActive) return null;

        // Kiểm tra password
        const isValid = await compare(password, user.passwordHash);
        if (!isValid) return null;

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          image: user.avatar,
        };
      },
    }),
  ],

  callbacks: {
    // Đưa role vào JWT token
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id!;
        token.role = user.role;
      }
      return token;
    },

    // Đưa role vào session để dùng phía client
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.role = token.role;
      }
      return session;
    },
  },
});

// ============================================================
// Helper: Kiểm tra quyền Admin (dùng trong Server Components / API)
// ============================================================
export async function requireAdmin() {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") {
    throw new Error("UNAUTHORIZED");
  }
  return session;
}

export async function requireAuth() {
  const session = await auth();
  if (!session) {
    throw new Error("UNAUTHORIZED");
  }
  return session;
}
