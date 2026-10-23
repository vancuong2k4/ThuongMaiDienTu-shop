// ============================================================
// app/api/auth/[...nextauth]/route.ts
// NextAuth.js v5 route handler
// ============================================================

import { handlers } from "@/lib/auth";

export const { GET, POST } = handlers;
