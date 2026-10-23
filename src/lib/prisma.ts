// ============================================================
// lib/prisma.ts – Prisma Client Singleton
// Đảm bảo chỉ tạo 1 instance trong dev (tránh connection pool exhausted)
// ============================================================

import { PrismaClient } from "@prisma/client";

// Khai báo global để TypeScript không báo lỗi
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "error", "warn"]
        : ["error"],
  });

// Trong môi trường dev, lưu instance vào global để hot-reload không tạo thêm connection
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
